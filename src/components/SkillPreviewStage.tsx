import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Skill } from '../types/game';
import { HeroSkeletalRig, HeroClientAttachments } from './HeroSkeletalRig';
import { HERO_CLIP_CATALOG, HeroRigState, resolveHeroClipId } from '../data/heroAnimationClips';
import { getSkillElementMeta } from './RpgIcons';
import { animationClock } from '../utils/animationClock';

interface SkillPreviewStageProps {
  skill: Skill;
}

export const SkillPreviewStage: React.FC<SkillPreviewStageProps> = ({ skill }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const vfxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const enemyTargetRef = useRef<HTMLDivElement | null>(null);
  const heroAttachRef = useRef<HeroClientAttachments | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [replayCount, setReplayCount] = useState(0);
  const [animState, setAnimState] = useState<HeroRigState>('SkillCast');
  const [phaseLabel, setPhaseLabel] = useState('시전 준비');
  const [enemyHitActive, setEnemyHitActive] = useState(false);

  const clipId = resolveHeroClipId(
    skill.classId,
    'SkillCast',
    skill.effectType,
    Boolean(skill.isAwakening)
  );
  const clipMeta = HERO_CLIP_CATALOG[clipId];
  const elemMeta = getSkillElementMeta(skill.effectType);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const isPassiveOnly = Boolean(
    skill.cooldown <= 0 &&
      !skill.isAwakening &&
      (!skill.baseDamageMult || skill.baseDamageMult <= 0)
  );

  // Reset timeline whenever skill changes or Replay clicked
  useEffect(() => {
    setIsPlaying(true);
    setAnimState(isPassiveOnly ? 'Idle' : 'SkillCast');
    setEnemyHitActive(false);
    setPhaseLabel(isPassiveOnly ? '상시 패시브 효과' : '시전 준비');
  }, [skill.id, replayCount, isPassiveOnly]);

  // Isolated Preview Canvas 2D Loop (Zero side effects on live game combat/save state)
  useEffect(() => {
    const canvas = vfxCanvasRef.current;
    const stageEl = stageRef.current;
    if (!canvas || !stageEl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CYCLE_MS = skill.isAwakening ? 1650 : 1280;
    const CAST_ACTIVE_MS = clipMeta.durationMs;
    const RELEASE_MS = CAST_ACTIVE_MS * clipMeta.releaseTime;
    const CONTACT_MS = CAST_ACTIVE_MS * (clipMeta.contactTime + 0.14);

    let elapsedMs = 0;
    let lastTime = performance.now();
    let lastStateTag: HeroRigState = isPassiveOnly ? 'Idle' : 'SkillCast';
    let lastHitTag = false;
    let lastPhaseText = '';
    let localReplayTag = -1;

    const drawStage = (now: number) => {
      const dtMs = Math.max(0, Math.min(50, now - lastTime));
      lastTime = now;

      if (localReplayTag !== replayCount) {
        localReplayTag = replayCount;
        elapsedMs = 0;
      } else if (isPlayingRef.current) {
        elapsedMs = (elapsedMs + dtMs) % CYCLE_MS;
      }

      const stageRect = stageEl.getBoundingClientRect();
      const targetW = Math.max(240, Math.round(stageRect.width));
      const targetH = Math.max(120, Math.round(stageRect.height));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.clearRect(0, 0, targetW, targetH);

      if (isPassiveOnly) {
        return;
      }

      // Sync Character State (Cast -> Idle breathing pause -> Repeat Cast)
      const nextState: HeroRigState = elapsedMs < CAST_ACTIVE_MS ? 'SkillCast' : 'Idle';
      if (nextState !== lastStateTag) {
        lastStateTag = nextState;
        setAnimState(nextState);
      }

      const inHitWindow = elapsedMs >= CONTACT_MS && elapsedMs <= CONTACT_MS + 240;
      if (inHitWindow !== lastHitTag) {
        lastHitTag = inHitWindow;
        setEnemyHitActive(inHitWindow);
      }

      const phaseStr =
        elapsedMs < RELEASE_MS
          ? '1·2단계: 기 모으기 / 시전 준비'
          : elapsedMs < CONTACT_MS
          ? '3·4단계: 무기 발사 / 검격 궤적'
          : elapsedMs < CAST_ACTIVE_MS
          ? '5단계: 목표 명중 / 폭발'
          : '6단계: 자세 복귀';
      if (phaseStr !== lastPhaseText) {
        lastPhaseText = phaseStr;
        setPhaseLabel(phaseStr);
      }

      // Read live origin from preview HeroSkeletalRig attachments
      let originX = targetW * 0.34;
      let originY = targetH * 0.56;
      const att = heroAttachRef.current;
      if (att && stageRect.width > 0) {
        const src = skill.classId === 'mage' ? att.staffTip : att.weaponTip;
        originX = src.x - stageRect.left;
        originY = src.y - stageRect.top;
      }

      let targetX = targetW * 0.78;
      let targetY = targetH * 0.58;
      if (enemyTargetRef.current && stageRect.width > 0) {
        const er = enemyTargetRef.current.getBoundingClientRect();
        targetX = er.left + er.width * 0.48 - stageRect.left;
        targetY = er.top + er.height * 0.54 - stageRect.top;
      }

      const groundY = targetH * 0.86;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // Stage 1-2: Cast Concentration Sigil right on Staff Crystal / Sword Tip
      if (elapsedMs < CONTACT_MS) {
        const prepProg = Math.min(1, elapsedMs / Math.max(1, CONTACT_MS));
        const sigR = 8 + prepProg * 22;
        ctx.strokeStyle = elemMeta.color;
        ctx.globalAlpha = (1 - prepProg * 0.35) * 0.85;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(originX, originY, sigR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(originX, originY, 3 + prepProg * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stage 3-4: Travel / Release from live weaponTip/staffTip to target dummy
      if (elapsedMs >= RELEASE_MS * 0.78 && elapsedMs <= CONTACT_MS + 110) {
        const travelSpan = Math.max(1, CONTACT_MS - RELEASE_MS * 0.78);
        const travelP = Math.max(0, Math.min(1, (elapsedMs - RELEASE_MS * 0.78) / travelSpan));
        const px = originX + (targetX - originX) * travelP;
        const py = originY + (targetY - originY) * travelP;

        if (skill.classId === 'mage') {
          if (skill.effectType === 'chain_lightning' || skill.effectType === 'thunder_strike') {
            // Zigzag Lightning Arc from staffTip/sky -> enemy
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 4;
            ctx.beginPath();
            const sx = skill.effectType === 'thunder_strike' ? targetX : originX;
            const sy = skill.effectType === 'thunder_strike' ? 8 : originY;
            ctx.moveTo(sx, sy);
            for (let seg = 1; seg <= 4; seg++) {
              const frac = seg / 4;
              const jx = sx + (targetX - sx) * frac + ((seg % 2 === 0 ? 1 : -1) * 14 * (1 - frac));
              const jy = sy + (targetY - sy) * frac;
              ctx.lineTo(jx, jy);
            }
            ctx.stroke();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.6;
            ctx.stroke();
          } else {
            // Projectile orb/missile flying cleanly from crystal tip
            ctx.fillStyle = elemMeta.color;
            ctx.beginPath();
            ctx.arc(px, py, skill.isAwakening ? 13 : 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, skill.isAwakening ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();
            // Glowing Trail
            ctx.strokeStyle = elemMeta.color;
            ctx.lineWidth = 4;
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        } else {
          // Warrior Slash Arc / Shield Slam / Sword Wave from weaponTip
          if (skill.effectType === 'sword_wave' || skill.effectType === 'wind_blade') {
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(px, py, 22, -Math.PI * 0.45, Math.PI * 0.45);
            ctx.stroke();
          } else {
            const ang = -0.8 + travelP * 1.9;
            ctx.strokeStyle = elemMeta.color;
            ctx.lineWidth = skill.isAwakening ? 10 : 7;
            ctx.beginPath();
            ctx.arc(targetX - 10, targetY, 34, ang - 0.9, ang + 0.5);
            ctx.stroke();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(targetX - 10, targetY, 34, ang - 0.7, ang + 0.3);
            ctx.stroke();
          }
        }
      }

      // Stage 5: Impact Shockwave & Element Burst on Training Monster
      if (elapsedMs >= CONTACT_MS && elapsedMs <= CAST_ACTIVE_MS + 180) {
        const impP = Math.max(0, Math.min(1, (elapsedMs - CONTACT_MS) / 360));
        const fade = Math.max(0, 1 - impP);
        const radius = (skill.isAwakening ? 68 : 48) * (0.25 + impP * 0.85);

        ctx.globalAlpha = fade;
        ctx.strokeStyle = elemMeta.color;
        ctx.lineWidth = 4.5 * fade + 1;
        ctx.beginPath();
        ctx.ellipse(targetX, targetY, radius, radius * 0.85, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * fade;
        ctx.beginPath();
        ctx.ellipse(targetX, groundY - 4, radius * 1.15, radius * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Radial Star Sparks
        const sparkCount = skill.isAwakening ? 12 : 8;
        for (let k = 0; k < sparkCount; k++) {
          const a = (k / sparkCount) * Math.PI * 2 + impP * 0.8;
          const d = 10 + impP * (skill.isAwakening ? 54 : 38);
          ctx.fillStyle = k % 2 === 0 ? '#ffffff' : elemMeta.color;
          ctx.beginPath();
          ctx.arc(targetX + Math.cos(a) * d, targetY + Math.sin(a) * d, 2.8 * fade + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Awakening Pillar Beam
        if (skill.isAwakening) {
          ctx.globalAlpha = fade * 0.45;
          ctx.fillStyle = elemMeta.color;
          ctx.fillRect(targetX - 18 * fade, 0, 36 * fade, groundY);
        }
      }

      ctx.restore();
    };

    const unsubscribe = animationClock.subscribe(4, drawStage);
    return () => {
      unsubscribe();
    };
  }, [skill.id, skill.classId, skill.effectType, skill.isAwakening, replayCount, clipMeta, elemMeta.color, isPassiveOnly]);

  return (
    <div className="skill-preview-container" data-testid="skill-preview-stage">
      {/* Stage Canvas Backdrop */}
      <div
        ref={stageRef}
        className="skill-preview-viewport"
        style={{ borderColor: elemMeta.border }}
      >
        <div className="skill-preview-ground-line" />
        <div className="skill-preview-badge-top">
          <span style={{ color: elemMeta.color, fontWeight: 900 }}>{phaseLabel}</span>
          <span className="preview-isolated-tag">미리보기 (실제 전투 무관)</span>
        </div>

        {/* Preview Hero Skeletal Rig (Isolated from main battle state) */}
        <div className="skill-preview-hero-slot">
          <HeroSkeletalRig
            classId={skill.classId}
            animState={animState}
            castingSkillType={skill.effectType}
            isAwakeningCasting={Boolean(skill.isAwakening)}
            isMainBattleHero={false}
            paused={!isPlaying}
            replayToken={replayCount}
            onAttachmentsUpdate={(pts) => {
              heroAttachRef.current = pts;
            }}
          />
        </div>

        {/* Isolated Practice Target Dummy */}
        <div
          ref={enemyTargetRef}
          className={`skill-preview-dummy ${enemyHitActive ? 'dummy-hit' : ''}`}
          data-dummy-hit={enemyHitActive ? 'true' : 'false'}
        >
          <div className="dummy-shadow" />
          <img
            src="./assets/monster_slime.png"
            alt="연습용 타겟"
            className="dummy-sprite"
            draggable={false}
          />
          <span className="dummy-label">훈련 표적</span>
        </div>

        {/* Mini Canvas 2D Skill VFX Overlay */}
        <canvas
          ref={vfxCanvasRef}
          className="skill-preview-vfx-canvas"
          data-testid="skill-preview-vfx-canvas"
        />
      </div>

      {/* Controls Bar */}
      <div className="skill-preview-controls">
        <button
          type="button"
          data-testid="skill-preview-play-pause-btn"
          className="btn-game btn-game-blue skill-preview-btn"
          onClick={() => setIsPlaying((p) => !p)}
          disabled={isPassiveOnly}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? '일시정지' : '재생'}</span>
        </button>
        <button
          type="button"
          data-testid="skill-preview-replay-btn"
          className="btn-game btn-game-wood skill-preview-btn"
          onClick={() => {
            setIsPlaying(true);
            setReplayCount((c) => c + 1);
          }}
          disabled={isPassiveOnly}
        >
          <RotateCcw size={13} />
          <span>다시 보기</span>
        </button>
      </div>
    </div>
  );
};
