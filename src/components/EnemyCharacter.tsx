import React, { useState, useEffect } from 'react';
import { Monster, DamageNumberData, MonsterStatusEffect } from '../types/game';
import { Skull } from 'lucide-react';

interface EnemyCharacterProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
  isAttacking: boolean;
  isHitStop?: boolean;
  damages?: DamageNumberData[];
  monsterStatuses?: MonsterStatusEffect[];
  isFinisherHit?: boolean;
  hitComboStep?: 1 | 2 | 3 | null;
  isCriticalHit?: boolean;
}

const STATUS_META: Record<MonsterStatusEffect['type'], { label: string; icon: string; color: string; bg: string }> = {
  burn: { label: '화상', icon: '🔥', color: '#fb923c', bg: 'rgba(234, 88, 12, 0.32)' },
  freeze: { label: '빙결', icon: '❄️', color: '#38bdf8', bg: 'rgba(2, 132, 199, 0.35)' },
  shock: { label: '감전', icon: '⚡', color: '#facc15', bg: 'rgba(202, 138, 4, 0.32)' },
  armor_break: { label: '방어파쇄', icon: '🛡️', color: '#f43f5e', bg: 'rgba(225, 29, 72, 0.32)' },
  stun: { label: '기절', icon: '💫', color: '#fde047', bg: 'rgba(217, 119, 6, 0.35)' },
};

export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({
  monster,
  isHit,
  isDefeated,
  isAttacking,
  isHitStop,
  damages,
  monsterStatuses = [],
  isFinisherHit = false,
  hitComboStep = null,
  isCriticalHit = false,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((monster.currentHp / monster.maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  const isBoss = monster.isBoss || monster.id.includes('boss');
  const isGoldDungeonMob = monster.id.startsWith('dg_gold_');
  const isExpDungeonMob = monster.id.startsWith('dg_exp_');
  const isRuinsDungeonBoss = monster.id.startsWith('dg_ruins_');
  const isFrozen = monsterStatuses.some((s) => s.type === 'freeze');
  const isBurning = monsterStatuses.some((s) => s.type === 'burn');
  const isStunned = monsterStatuses.some((s) => s.type === 'stun');

  // Strict death lock: once HP reaches 0 or isDefeated is active, suppress hit reactions
  const isDeadState = isDefeated || monster.currentHp <= 0;
  const activeHitStep: 1 | 2 | 3 | null = isDeadState
    ? null
    : isFinisherHit || hitComboStep === 3
    ? 3
    : hitComboStep === 2
    ? 2
    : hitComboStep === 1 || isHit
    ? 1
    : null;

  // Determine monster sprite & idle animation type (preserving original PNG assets)
  const getMonsterType = () => {
    if (isRuinsDungeonBoss || isBoss) {
      return { sprite: './assets/boss_golem.png', idleClass: 'boss-act-idle', sizeClass: 'boss-size' };
    }
    if (isGoldDungeonMob) {
      return { sprite: './assets/monster_spirit.png', idleClass: 'spirit-act-idle', sizeClass: 'medium-size' };
    }
    if (isExpDungeonMob) {
      if (monster.id.includes('_w2')) return { sprite: './assets/monster_mushroom.png', idleClass: 'mushroom-act-idle', sizeClass: 'medium-size' };
      if (monster.id.includes('_w3')) return { sprite: './assets/monster_bee.png', idleClass: 'bee-act-idle', sizeClass: 'medium-size' };
      if (monster.id.includes('_w4')) return { sprite: './assets/monster_spirit.png', idleClass: 'spirit-act-idle', sizeClass: 'medium-size' };
      return { sprite: './assets/monster_slime.png', idleClass: 'slime-act-idle', sizeClass: 'slime-size' };
    }
    if (monster.id.includes('m2') || monster.name.includes('버섯')) {
      return { sprite: './assets/monster_mushroom.png', idleClass: 'mushroom-act-idle', sizeClass: 'medium-size' };
    }
    if (monster.id.includes('m3') || monster.name.includes('벌') || monster.name.includes('다람쥐')) {
      return { sprite: './assets/monster_bee.png', idleClass: 'bee-act-idle', sizeClass: 'medium-size' };
    }
    if (monster.id.includes('m4') || monster.name.includes('요정') || monster.name.includes('정령')) {
      return { sprite: './assets/monster_spirit.png', idleClass: 'spirit-act-idle', sizeClass: 'medium-size' };
    }
    return { sprite: './assets/monster_slime.png', idleClass: 'slime-act-idle', sizeClass: 'slime-size' };
  };

  const monsterConfig = getMonsterType();

  const enemyAnimState = isDeadState
    ? 'Defeat'
    : activeHitStep === 3
    ? 'Hit3'
    : activeHitStep === 2
    ? 'Hit2'
    : activeHitStep === 1
    ? 'Hit1'
    : isFrozen || isStunned
    ? 'CC'
    : isAttacking
    ? 'Attack'
    : 'Idle';

  const getHitActionClass = () => {
    if (isDeadState) return 'enemy-act-defeat';
    if (activeHitStep === 3) return isBoss ? 'enemy-act-hit-3-boss' : 'enemy-act-hit-3';
    if (activeHitStep === 2) return isBoss ? 'enemy-act-hit-2-boss' : 'enemy-act-hit-2';
    if (activeHitStep === 1) return isBoss ? 'enemy-act-hit-1-boss' : 'enemy-act-hit-1';
    if (isFrozen || isStunned) return 'enemy-act-cc-frozen';
    if (isAttacking) return 'enemy-act-attack';
    return monsterConfig.idleClass;
  };

  return (
    <div
      className={`enemy-character-box ${isBoss ? 'is-boss-combatant' : ''}`}
      data-enemy-state={enemyAnimState}
    >
      {/* Overhead Damage Numbers strictly anchored to Monster Sprite */}
      <div className="monster-damage-anchor-layer">
        {damages && damages.map((dmg) => (
          <div
            key={dmg.id}
            className={`monster-dmg-pop ${dmg.isSkill ? 'dmg-skill' : dmg.isCritical ? 'dmg-crit' : 'dmg-normal'}`}
            style={{ transform: `translateX(${dmg.offsetX ?? 0}px)` }}
          >
            {dmg.isSkill ? (
              <span className="skill-burst-label">{dmg.skillName ?? 'SKILL!'}</span>
            ) : dmg.isCritical ? (
              <span className="crit-burst-label">CRIT!</span>
            ) : null}
            {dmg.value.toLocaleString()}
          </div>
        ))}
      </div>

      {/* Overhead Enemy HP Cluster */}
      <div className="combatant-hp-cluster">
        {/* Active Status Effect Debuff Pills */}
        {monsterStatuses.length > 0 && (
          <div className="monster-status-pills-row">
            {monsterStatuses.map((st) => {
              const meta = STATUS_META[st.type];
              return (
                <span
                  key={st.type}
                  className="monster-status-pill"
                  style={{
                    borderColor: meta.color,
                    background: meta.bg,
                    color: '#ffffff',
                  }}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className="status-sec">{st.duration.toFixed(1)}s</span>
                </span>
              );
            })}
          </div>
        )}

        <div className="combatant-name-tag">
          {isRuinsDungeonBoss ? (
            <span className="boss-lvl-badge" style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}>
              <Skull size={10} /> ANCIENT BOSS
            </span>
          ) : isGoldDungeonMob ? (
            <span className="boss-lvl-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)' }}>
              GOLD GOBLIN
            </span>
          ) : isExpDungeonMob ? (
            <span className="boss-lvl-badge" style={{ background: 'linear-gradient(135deg, #10b981, #047857)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }}>
              {isBoss ? 'FINAL GUARDIAN' : 'WAVE GUARDIAN'}
            </span>
          ) : isBoss ? (
            <span className="boss-lvl-badge">
              <Skull size={10} /> BOSS
            </span>
          ) : (
            <span className="enemy-lvl-badge">MONSTER</span>
          )}
          <span className="enemy-name-text">{monster.name}</span>
        </div>

        <div className={`combatant-hp-track ${isBoss ? 'boss-hp-track' : ''}`}>
          <div className="combatant-hp-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div
            className={`combatant-hp-fill ${isBoss ? 'boss-hp-fill' : 'enemy-hp-fill'}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="combatant-hp-val">
          {monster.currentHp.toLocaleString()} / {monster.maxHp.toLocaleString()}
        </div>
      </div>

      {/* 2D Sprite Body Stage */}
      <div
        className={`enemy-sprite-wrapper ${getHitActionClass()} ${!isDeadState && isCriticalHit ? 'hit-crit-recoil' : ''} ${
          isHitStop ? 'hit-stop-freeze' : ''
        } ${isFrozen ? 'status-tint-freeze' : isBurning ? 'status-tint-burn' : ''} ${
          isGoldDungeonMob ? 'dungeon-gold-aura' : isExpDungeonMob ? 'dungeon-exp-aura' : isRuinsDungeonBoss ? 'dungeon-ruins-aura' : ''
        }`}
        data-enemy-state={enemyAnimState}
      >
        {/* Soft Ground Contact Shadow synchronized with hit & defeat states */}
        <div
          className={`character-ground-shadow ${isBoss ? 'boss-ground-shadow' : 'normal-ground-shadow'} ${
            isDeadState
              ? 'enemy-shadow-defeat'
              : activeHitStep === 3
              ? 'enemy-shadow-hit-3'
              : activeHitStep === 2
              ? 'enemy-shadow-hit-2'
              : activeHitStep === 1
              ? 'enemy-shadow-hit-1'
              : ''
          }`}
        />

        {/* Hit Impact Wave Rings (1타 소형 파동 / 2타 중간 파동 / 3타 대형 충격파 + 보스 전용 파동) */}
        {activeHitStep !== null && (
          <div className={`enemy-hit-impact-ring impact-ring-${activeHitStep} ${isBoss ? 'boss-impact-pulse' : ''}`} />
        )}

        {/* 3타 바닥 충격파 및 파편/먼지 파티클 */}
        {activeHitStep === 3 && (
          <div className="enemy-finisher-shock-layer" aria-hidden="true">
            <div className="finisher-ground-shockwave" />
            <span className="hit-debris-shard shard-1" />
            <span className="hit-debris-shard shard-2" />
            <span className="hit-debris-shard shard-3" />
            <span className="hit-debris-shard shard-4" />
            <span className="hit-dust-puff puff-left" />
            <span className="hit-dust-puff puff-right" />
          </div>
        )}

        {/* 사망 시 파티클 분해 레이어 */}
        {isDeadState && (
          <div className="enemy-defeat-dispersal-layer" aria-hidden="true">
            <div className="defeat-vanish-ring" />
            <span className="defeat-soul-mote mote-1" />
            <span className="defeat-soul-mote mote-2" />
            <span className="defeat-soul-mote mote-3" />
            <span className="defeat-soul-mote mote-4" />
            <span className="defeat-soul-mote mote-5" />
            <span className="defeat-soul-mote mote-6" />
          </div>
        )}

        {/* 2D Monster Sprite */}
        <img
          src={monsterConfig.sprite}
          alt={monster.name}
          className={`monster-2d-sprite ${monsterConfig.sizeClass}`}
          draggable={false}
        />

        {/* Ground Knockback Dust */}
        {!isDeadState && isHit && <div className="enemy-knockback-dust" />}
      </div>

      <style>{`
        .enemy-character-box {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
        }

        .combatant-hp-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 6px;
          z-index: 10;
        }

        .monster-status-pills-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 3px;
          margin-bottom: 3px;
        }

        .monster-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 9999px;
          border: 1px solid;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
        }

        .status-sec {
          opacity: 0.85;
          font-size: 8px;
          margin-left: 1px;
        }

        .status-tint-freeze .monster-2d-sprite {
          filter: drop-shadow(0 0 12px #38bdf8) brightness(1.15) hue-rotate(15deg) !important;
        }

        .status-tint-burn .monster-2d-sprite {
          filter: drop-shadow(0 0 12px #f97316) brightness(1.12) saturate(1.25) !important;
        }

        .dungeon-gold-aura .monster-2d-sprite {
          filter: sepia(0.55) saturate(2.4) hue-rotate(-12deg) brightness(1.12) drop-shadow(0 0 16px rgba(251, 191, 36, 0.85));
        }

        .dungeon-exp-aura .monster-2d-sprite {
          filter: saturate(1.35) drop-shadow(0 0 15px rgba(16, 185, 129, 0.75));
        }

        .dungeon-ruins-aura .monster-2d-sprite {
          filter: hue-rotate(215deg) saturate(1.45) brightness(1.06) drop-shadow(0 0 22px rgba(168, 85, 247, 0.9));
        }

        .enemy-act-cc-frozen {
          animation: none !important;
        }

        .combatant-name-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }

        .enemy-lvl-badge {
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 9999px;
          letter-spacing: 0.5px;
        }

        .boss-lvl-badge {
          background: linear-gradient(135deg, #ef4444, #991b1b);
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          padding: 1px 6px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
        }

        .enemy-name-text {
          font-size: 11px;
          font-weight: 800;
          color: #f8fafc;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 2px #000;
        }

        .combatant-hp-track {
          position: relative;
          width: 88px;
          height: 6px;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .boss-hp-track {
          width: 130px;
          height: 9px;
          border-color: rgba(239, 68, 68, 0.6);
        }

        .combatant-hp-ghost {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #fef08a;
          border-radius: 9999px;
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .combatant-hp-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 9999px;
          transition: width 0.15s ease-out;
        }

        .enemy-hp-fill {
          background: linear-gradient(90deg, #ea580c 0%, #f97316 70%, #fdba74 100%);
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
        }

        .boss-hp-fill {
          background: linear-gradient(90deg, #b91c1c 0%, #ef4444 60%, #f87171 100%);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.85);
        }

        .combatant-hp-val {
          font-size: 9px;
          font-weight: 800;
          color: #cbd5e1;
          text-shadow: 0 1px 2px #000;
          margin-top: 2px;
        }

        /* Overhead Damage Numbers strictly elevated above Status Pills */
        .monster-damage-anchor-layer {
          position: absolute;
          top: -46px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .monster-dmg-pop {
          position: absolute;
          bottom: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          letter-spacing: -0.5px;
          white-space: nowrap;
          pointer-events: none;
        }

        .dmg-normal {
          color: #ffffff;
          font-size: 1.35rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 4px #000;
          animation: monsterDmgPopAnim 0.42s ease-out forwards;
        }

        .dmg-crit {
          color: #fde047;
          font-size: 1.7rem;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px #ea580c;
          animation: monsterCritPopAnim 0.45s cubic-bezier(0.18, 0.9, 0.32, 1.25) forwards;
        }

        .dmg-skill {
          color: #c084fc;
          font-size: 2.1rem;
          text-shadow: 0 0 14px #a855f7, 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 24px #38bdf8;
          animation: monsterSkillPopAnim 0.52s cubic-bezier(0.16, 1, 0.3, 1.2) forwards;
          z-index: 50;
        }

        @keyframes monsterSkillPopAnim {
          0% { opacity: 0; transform: scale(0.3) translateY(14px); }
          22% { opacity: 1; transform: scale(1.4) translateY(-10px); }
          45% { transform: scale(1.1) translateY(-20px); }
          80% { opacity: 1; transform: scale(1.02) translateY(-30px); }
          100% { opacity: 0; transform: scale(0.9) translateY(-42px); }
        }

        .crit-burst-label {
          display: block;
          font-size: 0.58em;
          line-height: 1;
          letter-spacing: 1.5px;
          color: #f97316;
          text-shadow: 0 0 8px #fde047, 0 1px 3px #000;
          text-align: center;
        }

        .skill-burst-label {
          display: block;
          font-size: 0.52em;
          line-height: 1.1;
          letter-spacing: 2px;
          color: #38bdf8;
          text-shadow: 0 0 10px #38bdf8, 0 1px 3px #000;
          text-align: center;
          font-weight: 900;
        }

        .hit-stop-freeze {
          animation-play-state: paused !important;
        }

        .enemy-sprite-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-origin: bottom center;
          will-change: transform, opacity;
        }

        /* Distinct Silhouettes and Proportions (Meeting 390x844 spec) */
        .slime-size {
          width: 148px;
          height: 140px;
        }

        .medium-size {
          width: 155px;
          height: 175px;
        }

        .boss-size {
          width: 230px;
          height: 235px;
        }

        .character-ground-shadow {
          position: absolute;
          bottom: 2px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          transition: transform 0.14s ease-out, opacity 0.2s ease-out;
        }

        .normal-ground-shadow {
          width: 105px;
          height: 18px;
        }

        .boss-ground-shadow {
          width: 175px;
          height: 26px;
        }

        .enemy-shadow-hit-1 {
          transform: translateX(4px) scaleX(1.06);
        }
        .enemy-shadow-hit-2 {
          transform: translateX(9px) scaleX(1.12);
        }
        .enemy-shadow-hit-3 {
          transform: translateX(14px) scaleX(1.26) scaleY(1.15);
        }
        .enemy-shadow-defeat {
          transform: scale(0.2);
          opacity: 0;
        }

        .monster-2d-sprite {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
          z-index: 2;
          pointer-events: none;
          transform-origin: bottom center;
        }

        /* 1/2/3타 피격 파동 링 (Pure CSS geometric ring, no text/emojis) */
        .enemy-hit-impact-ring {
          position: absolute;
          top: 46%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 15;
        }

        .impact-ring-1 {
          width: 58px;
          height: 58px;
          border: 2px solid rgba(255, 255, 255, 0.9);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(254, 240, 138, 0.3) 50%, transparent 75%);
          animation: hitImpactWave1 0.17s ease-out forwards;
        }

        .impact-ring-2 {
          width: 82px;
          height: 82px;
          border: 2.5px solid rgba(251, 191, 36, 0.95);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(251, 191, 36, 0.45) 48%, transparent 76%);
          animation: hitImpactWave2 0.21s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .impact-ring-3 {
          width: 118px;
          height: 118px;
          border: 3px solid rgba(254, 240, 138, 0.98);
          box-shadow: 0 0 22px rgba(249, 115, 22, 0.85), inset 0 0 16px rgba(255, 255, 255, 0.85);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(249, 115, 22, 0.5) 45%, transparent 75%);
          animation: hitImpactWave3 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .boss-impact-pulse {
          border-color: rgba(248, 113, 113, 0.95);
          box-shadow: 0 0 28px rgba(239, 68, 68, 0.85);
        }

        @keyframes hitImpactWave1 {
          0% { transform: translate(-50%, -50%) scale(0.35); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
        }
        @keyframes hitImpactWave2 {
          0% { transform: translate(-50%, -50%) scale(0.3) rotate(-10deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.55) rotate(12deg); opacity: 0; }
        }
        @keyframes hitImpactWave3 {
          0% { transform: translate(-50%, -50%) scale(0.25); opacity: 1; }
          55% { opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1.85); opacity: 0; }
        }

        /* 3타 바닥 충격파 및 파편/먼지 파티클 */
        .enemy-finisher-shock-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 16;
        }

        .finisher-ground-shockwave {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 140px;
          height: 28px;
          transform: translateX(-50%);
          border-radius: 50%;
          border: 3px solid rgba(254, 240, 138, 0.95);
          box-shadow: 0 0 18px rgba(249, 115, 22, 0.9);
          animation: finisherGroundShock 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes finisherGroundShock {
          0% { transform: translateX(-50%) scale(0.3, 0.5); opacity: 1; }
          100% { transform: translateX(-50%) scale(1.65, 1.3); opacity: 0; }
        }

        .hit-debris-shard {
          position: absolute;
          bottom: 14px;
          left: 50%;
          width: 7px;
          height: 7px;
          background: linear-gradient(135deg, #fef08a, #f97316);
          clip-path: polygon(50% 0%, 100% 45%, 75% 100%, 15% 90%, 0% 35%);
          box-shadow: 0 0 6px rgba(251, 191, 36, 0.85);
        }

        .shard-1 { animation: debrisFly1 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .shard-2 { animation: debrisFly2 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .shard-3 { animation: debrisFly3 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .shard-4 { animation: debrisFly4 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes debrisFly1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(42px, -38px) rotate(140deg) scale(0.3); opacity: 0; }
        }
        @keyframes debrisFly2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(-36px, -32px) rotate(-120deg) scale(0.3); opacity: 0; }
        }
        @keyframes debrisFly3 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1.1); opacity: 1; }
          100% { transform: translate(54px, -14px) rotate(200deg) scale(0.25); opacity: 0; }
        }
        @keyframes debrisFly4 {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.95); opacity: 1; }
          100% { transform: translate(-48px, -12px) rotate(-175deg) scale(0.25); opacity: 0; }
        }

        .hit-dust-puff {
          position: absolute;
          bottom: 2px;
          width: 34px;
          height: 15px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(226, 214, 185, 0.85) 0%, rgba(168, 155, 130, 0.4) 60%, transparent 100%);
          filter: blur(1.5px);
        }

        .puff-left {
          left: 18%;
          animation: dustPuffLeft 0.32s ease-out forwards;
        }
        .puff-right {
          right: 12%;
          animation: dustPuffRight 0.32s ease-out forwards;
        }

        @keyframes dustPuffLeft {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0.9; }
          100% { transform: translate(-26px, -8px) scale(1.7); opacity: 0; }
        }
        @keyframes dustPuffRight {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0.9; }
          100% { transform: translate(34px, -10px) scale(1.85); opacity: 0; }
        }

        /* 사망 파티클 분해 레이어 */
        .enemy-defeat-dispersal-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 18;
        }

        .defeat-vanish-ring {
          position: absolute;
          top: 52%;
          left: 50%;
          width: 96px;
          height: 96px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2.5px solid rgba(251, 191, 36, 0.9);
          box-shadow: 0 0 24px rgba(245, 158, 11, 0.8);
          animation: defeatVanishRingAnim 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes defeatVanishRingAnim {
          0% { transform: translate(-50%, -50%) scale(0.25); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.75); opacity: 0; }
        }

        .defeat-soul-mote {
          position: absolute;
          top: 52%;
          left: 50%;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #fde047 50%, #f97316 100%);
          box-shadow: 0 0 10px #f59e0b;
        }

        .mote-1 { animation: soulMote1 0.4s ease-out forwards; }
        .mote-2 { animation: soulMote2 0.4s ease-out forwards; }
        .mote-3 { animation: soulMote3 0.4s ease-out forwards; }
        .mote-4 { animation: soulMote4 0.4s ease-out forwards; }
        .mote-5 { animation: soulMote5 0.4s ease-out forwards; }
        .mote-6 { animation: soulMote6 0.4s ease-out forwards; }

        @keyframes soulMote1 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-48px, -54px) scale(0.2); opacity: 0; }
        }
        @keyframes soulMote2 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(44px, -50px) scale(0.2); opacity: 0; }
        }
        @keyframes soulMote3 {
          0% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-58px, -12px) scale(0.2); opacity: 0; }
        }
        @keyframes soulMote4 {
          0% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(56px, -14px) scale(0.2); opacity: 0; }
        }
        @keyframes soulMote5 {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
          100% { transform: translate(-24px, -72px) scale(0.15); opacity: 0; }
        }
        @keyframes soulMote6 {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
          100% { transform: translate(26px, -68px) scale(0.15); opacity: 0; }
        }

        .enemy-knockback-dust {
          position: absolute;
          bottom: 2px;
          right: 20px;
          width: 26px;
          height: 12px;
          border-radius: 50%;
          background: rgba(180, 170, 140, 0.65);
          filter: blur(2px);
          animation: knockbackDust 0.28s ease-out forwards;
        }

        @keyframes knockbackDust {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.6) translateX(12px); opacity: 0; }
        }

        /* Idle Animations by Monster Archetype */
        .slime-act-idle {
          animation: slimeSquash 1.6s ease-in-out infinite;
        }

        @keyframes slimeSquash {
          0%, 100% { transform: scale(1, 1); }
          45% { transform: scale(1.08, 0.92) translateY(2px); }
          70% { transform: scale(0.95, 1.05) translateY(-4px); }
        }

        .mushroom-act-idle {
          animation: mushroomBob 1.8s ease-in-out infinite;
        }

        @keyframes mushroomBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }

        .bee-act-idle {
          animation: beeHover 0.85s ease-in-out infinite;
        }

        @keyframes beeHover {
          0%, 100% { transform: translateY(-16px) scale(1); }
          50% { transform: translateY(-24px) scale(1.02); }
        }

        .spirit-act-idle {
          animation: spiritFloat 2.2s ease-in-out infinite;
        }

        @keyframes spiritFloat {
          0%, 100% { transform: translateY(-12px) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); filter: drop-shadow(0 0 12px rgba(52, 211, 153, 0.7)); }
        }

        .boss-act-idle {
          animation: bossRumble 2.4s ease-in-out infinite;
        }

        @keyframes bossRumble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02, 0.98); }
        }

        /* Attack Lunge */
        .enemy-act-attack {
          animation: enemyLungeAnim 0.22s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        @keyframes enemyLungeAnim {
          0% { transform: translateX(0); }
          40% { transform: translateX(-34px) scale(1.06); }
          100% { transform: translateX(0); }
        }

        /* Distinct 3-Stage Monster Hit Reactions (v2.7) */
        /* 1타: 약한 밀림 (8px / 보스 3.5px), 짧은 White Flash, 소형 타격 파동 */
        .enemy-act-hit-1 {
          animation: enemyHit1Anim 0.17s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }
        .enemy-act-hit-1-boss {
          animation: enemyHit1BossAnim 0.17s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }
        .enemy-act-hit-1 .monster-2d-sprite,
        .enemy-act-hit-1-boss .monster-2d-sprite {
          animation: whiteFlashLight 0.14s ease-out forwards;
        }

        @keyframes enemyHit1Anim {
          0% { transform: translateX(0) scale(1, 1); }
          32% { transform: translateX(8px) scale(0.95, 1.05) rotate(2deg); }
          100% { transform: translateX(0) scale(1, 1) rotate(0deg); }
        }
        @keyframes enemyHit1BossAnim {
          0% { transform: translateX(0) scale(1, 1); }
          32% { transform: translateX(3.5px) scale(0.98, 1.02); }
          100% { transform: translateX(0) scale(1, 1); }
        }
        @keyframes whiteFlashLight {
          0% { filter: brightness(6.5) contrast(1.9) drop-shadow(0 0 14px rgba(255, 255, 255, 0.85)); }
          100% { filter: brightness(1) contrast(1) saturate(1); }
        }

        /* 2타: 중간 밀림 (15px / 보스 6.5px), 몸체 흔들림, 방향성 반동 */
        .enemy-act-hit-2 {
          animation: enemyHit2Anim 0.22s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;
        }
        .enemy-act-hit-2-boss {
          animation: enemyHit2BossAnim 0.22s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;
        }
        .enemy-act-hit-2 .monster-2d-sprite,
        .enemy-act-hit-2-boss .monster-2d-sprite {
          animation: amberFlashMedium 0.19s ease-out forwards;
        }

        @keyframes enemyHit2Anim {
          0% { transform: translateX(0) rotate(0deg); }
          26% { transform: translateX(15px) translateY(-4px) scale(0.91, 1.09) rotate(8deg); }
          58% { transform: translateX(6px) translateY(1px) scale(1.05, 0.95) rotate(-3.5deg); }
          82% { transform: translateX(2px) rotate(1.5deg); }
          100% { transform: translateX(0) scale(1, 1) rotate(0deg); }
        }
        @keyframes enemyHit2BossAnim {
          0% { transform: translateX(0) rotate(0deg); }
          28% { transform: translateX(6.5px) translateY(-2px) scale(0.95, 1.04) rotate(3deg); }
          62% { transform: translateX(2.5px) scale(1.02, 0.98) rotate(-1.2deg); }
          100% { transform: translateX(0) scale(1, 1) rotate(0deg); }
        }
        @keyframes amberFlashMedium {
          0% { filter: brightness(10) contrast(2.2) drop-shadow(0 0 20px rgba(251, 191, 36, 0.88)); }
          100% { filter: brightness(1) contrast(1) saturate(1); }
        }

        /* 3타: 강한 넉백 (24px / 보스 11px), 몸체 압축 및 탄성 복원 */
        .enemy-act-hit-3,
        .enemy-act-finisher-hit {
          animation: enemyHit3Anim 0.3s cubic-bezier(0.18, 0.9, 0.22, 1) forwards;
        }
        .enemy-act-hit-3-boss {
          animation: enemyHit3BossAnim 0.3s cubic-bezier(0.18, 0.9, 0.22, 1) forwards;
        }
        .enemy-act-hit-3 .monster-2d-sprite,
        .enemy-act-hit-3-boss .monster-2d-sprite,
        .enemy-act-finisher-hit .monster-2d-sprite {
          animation: whiteGoldFlashHeavy 0.26s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes enemyHit3Anim {
          0% { transform: translateX(0) scale(1, 1) rotate(0deg); }
          22% { transform: translateX(24px) translateY(4px) scale(1.18, 0.82) rotate(11deg); }
          52% { transform: translateX(12px) translateY(-5px) scale(0.92, 1.09) rotate(-4deg); }
          78% { transform: translateX(4px) translateY(1px) scale(1.04, 0.97) rotate(1.5deg); }
          100% { transform: translateX(0) translateY(0) scale(1, 1) rotate(0deg); }
        }
        @keyframes enemyHit3BossAnim {
          0% { transform: translateX(0) scale(1, 1) rotate(0deg); }
          24% { transform: translateX(11px) translateY(2px) scale(1.09, 0.91) rotate(4.5deg); }
          55% { transform: translateX(5px) translateY(-2px) scale(0.96, 1.04) rotate(-1.5deg); }
          100% { transform: translateX(0) translateY(0) scale(1, 1) rotate(0deg); }
        }
        @keyframes whiteGoldFlashHeavy {
          0% {
            filter: brightness(22) contrast(3.5) saturate(0) drop-shadow(0 0 35px rgba(254, 240, 138, 0.95)) drop-shadow(0 0 16px rgba(249, 115, 22, 0.85));
            transform: scale(0.92) translateX(6px);
          }
          40% {
            filter: brightness(9) contrast(2.2) saturate(0.3) drop-shadow(0 0 20px rgba(251, 191, 36, 0.75));
          }
          100% {
            filter: brightness(1) contrast(1) saturate(1) drop-shadow(0 0 0 transparent);
            transform: scale(1) translateX(0);
          }
        }

        /* 치명타 추가 시각 리코일 */
        .hit-crit-recoil .monster-2d-sprite {
          filter: drop-shadow(0 0 18px rgba(249, 115, 22, 0.85)) !important;
        }

        /* 사망 연출: 몸체 붕괴 + 축소 + 투명도 감소 */
        .enemy-act-defeat {
          animation: enemyDefeatDissolve 0.38s cubic-bezier(0.22, 0.8, 0.3, 1) forwards;
          pointer-events: none;
        }

        @keyframes enemyDefeatDissolve {
          0% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1, 1) rotate(0deg);
            filter: brightness(2.5) contrast(1.4);
          }
          28% {
            opacity: 0.9;
            transform: translateX(12px) translateY(-4px) scale(1.08, 0.9) rotate(6deg);
            filter: brightness(3.2) drop-shadow(0 0 22px #f59e0b);
          }
          65% {
            opacity: 0.45;
            transform: translateX(16px) translateY(10px) scale(0.72, 0.56) rotate(12deg);
            filter: brightness(1.8) saturate(0.4) blur(1px);
          }
          100% {
            opacity: 0;
            transform: translateX(18px) translateY(22px) scale(0.22, 0.15) rotate(16deg);
            filter: brightness(0.8) blur(3px);
          }
        }

        /* PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .enemy-sprite-wrapper {
            height: clamp(200px, 24vh, 310px);
            width: calc(clamp(200px, 24vh, 310px) * 0.95);
          }

          .is-boss-combatant .enemy-sprite-wrapper {
            height: clamp(290px, 34vh, 430px);
            width: calc(clamp(290px, 34vh, 430px) * 0.98);
          }

          .monster-2d-sprite.slime-size {
            height: clamp(160px, 19vh, 250px);
          }

          .monster-2d-sprite.medium-size {
            height: clamp(200px, 24vh, 310px);
          }

          .monster-2d-sprite.boss-size {
            height: clamp(290px, 34vh, 430px);
          }

          .character-ground-shadow.normal-ground-shadow {
            width: calc(clamp(200px, 24vh, 310px) * 0.7);
            height: calc(clamp(200px, 24vh, 310px) * 0.12);
          }

          .character-ground-shadow.boss-ground-shadow {
            width: calc(clamp(290px, 34vh, 430px) * 0.75);
            height: calc(clamp(290px, 34vh, 430px) * 0.13);
          }
        }
      `}</style>
    </div>
  );
};
