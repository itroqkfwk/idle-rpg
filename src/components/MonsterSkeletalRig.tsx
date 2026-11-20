import React, { useEffect, useRef, useState } from 'react';
import { BossPatternType, Monster } from '../types/game';
import {
  MONSTER_CLIP_CATALOG,
  MONSTER_RIG_SPECS,
  MonsterRigId,
  MonsterRigState,
  evaluateMonsterClipPose,
  resolveMonsterClipId,
  resolveMonsterRigId,
  solveMonsterSkeleton,
} from '../data/monsterAnimationClips';
import { PackedRigAtlas, getCachedMonsterAtlas, preloadMonsterRigParts } from '../utils/monsterPetAssetCache';
import { animationClock } from '../utils/animationClock';
import {
  combatAnchorRegistry,
  CombatSceneContextId,
  DEFAULT_VISUAL_RENDER_MODE,
  MonsterSceneAttachments,
  VisualRenderMode,
} from '../utils/combatAnchorRegistry';

interface MonsterSkeletalRigProps {
  monster: Pick<Monster, 'id' | 'name' | 'isBoss' | 'element'>;
  animState: MonsterRigState;
  bossPhase?: 1 | 2;
  bossPattern?: BossPatternType | null;
  isFrozen?: boolean;
  isBurning?: boolean;
  isStunned?: boolean;
  isHitStop?: boolean;
  isMainBattleMonster?: boolean;
  sceneContext?: CombatSceneContextId;
  renderMode?: VisualRenderMode;
  paused?: boolean;
  replayToken?: number;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  onAttachmentsUpdate?: (pts: MonsterSceneAttachments, progress: number) => void;
}

let mShadowSprite: HTMLCanvasElement | null = null;
let mHitAuraSprite: HTMLCanvasElement | null = null;
let mFrostSprite: HTMLCanvasElement | null = null;
let mBurnSprite: HTMLCanvasElement | null = null;
let mPhase2Sprite: HTMLCanvasElement | null = null;

function getRadialSprite(kind: 'shadow' | 'hit' | 'frost' | 'burn' | 'phase2'): HTMLCanvasElement {
  if (kind === 'shadow' && mShadowSprite) return mShadowSprite;
  if (kind === 'hit' && mHitAuraSprite) return mHitAuraSprite;
  if (kind === 'frost' && mFrostSprite) return mFrostSprite;
  if (kind === 'burn' && mBurnSprite) return mBurnSprite;
  if (kind === 'phase2' && mPhase2Sprite) return mPhase2Sprite;

  const c = document.createElement('canvas');
  c.width = kind === 'shadow' ? 128 : 96;
  c.height = kind === 'shadow' ? 32 : 96;
  const ctx = c.getContext('2d');
  if (ctx) {
    if (kind === 'shadow') {
      const g = ctx.createRadialGradient(64, 16, 4, 64, 16, 60);
      g.addColorStop(0, 'rgba(2, 6, 23, 0.72)');
      g.addColorStop(0.58, 'rgba(2, 6, 23, 0.28)');
      g.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 32);
    } else {
      const g = ctx.createRadialGradient(48, 48, 6, 48, 48, 46);
      if (kind === 'hit') {
        g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        g.addColorStop(0.45, 'rgba(254, 240, 138, 0.55)');
        g.addColorStop(1, 'rgba(249, 115, 22, 0)');
      } else if (kind === 'frost') {
        g.addColorStop(0, 'rgba(186, 230, 253, 0.72)');
        g.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
        g.addColorStop(1, 'rgba(56, 189, 248, 0)');
      } else if (kind === 'burn') {
        g.addColorStop(0, 'rgba(253, 186, 116, 0.68)');
        g.addColorStop(0.55, 'rgba(249, 115, 22, 0.34)');
        g.addColorStop(1, 'rgba(234, 88, 12, 0)');
      } else {
        g.addColorStop(0, 'rgba(240, 171, 252, 0.65)');
        g.addColorStop(0.55, 'rgba(168, 85, 247, 0.32)');
        g.addColorStop(1, 'rgba(168, 85, 247, 0)');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 96, 96);
    }
  }

  if (kind === 'shadow') mShadowSprite = c;
  else if (kind === 'hit') mHitAuraSprite = c;
  else if (kind === 'frost') mFrostSprite = c;
  else if (kind === 'burn') mBurnSprite = c;
  else mPhase2Sprite = c;
  return c;
}

function computeAdaptiveDpr(): number {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth < 640) return 1;
  return Math.min(window.devicePixelRatio || 1, 1.35);
}

export const MonsterSkeletalRig: React.FC<MonsterSkeletalRigProps> = ({
  monster,
  animState,
  bossPhase = 1,
  bossPattern = null,
  isFrozen = false,
  isBurning = false,
  isStunned = false,
  isHitStop = false,
  isMainBattleMonster = true,
  sceneContext,
  renderMode = DEFAULT_VISUAL_RENDER_MODE,
  paused = false,
  replayToken = 0,
  fallbackSrc,
  alt = 'Monster',
  className = '',
  onAttachmentsUpdate,
}) => {
  const rigId: MonsterRigId = resolveMonsterRigId(monster);
  const spec = MONSTER_RIG_SPECS[rigId];
  const resolvedScene: CombatSceneContextId = sceneContext ?? (isMainBattleMonster ? 'main_battle' : 'skill_preview');
  const isOriginalArt = renderMode === 'original_art';
  const resolvedSrc = fallbackSrc || spec.sourcePng;

  const hostRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const atlasRef = useRef<PackedRigAtlas | null>(isOriginalArt ? null : getCachedMonsterAtlas(rigId));
  const [assetsReady, setAssetsReady] = useState<boolean>(isOriginalArt ? true : Boolean(atlasRef.current));
  const cachedRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const dprRef = useRef<number>(computeAdaptiveDpr());

  const stateRef = useRef({
    monsterId: monster.id,
    rigId,
    animState,
    bossPhase,
    bossPattern,
    isFrozen,
    isBurning,
    isStunned,
    isHitStop,
    paused,
    resolvedScene,
    isOriginalArt,
    onAttachmentsUpdate,
  });
  stateRef.current = {
    monsterId: monster.id,
    rigId,
    animState,
    bossPhase,
    bossPattern,
    isFrozen,
    isBurning,
    isStunned,
    isHitStop,
    paused,
    resolvedScene,
    isOriginalArt,
    onAttachmentsUpdate,
  };

  const timerRef = useRef({
    lastKey: '',
    elapsedMs: 0,
    lastFrameTime: typeof performance !== 'undefined' ? performance.now() : 0,
    lastReplayToken: replayToken,
    lastSignature: '',
  });

  // Never load skeletal part atlas when renderMode === 'original_art'
  useEffect(() => {
    if (isOriginalArt) {
      atlasRef.current = null;
      setAssetsReady(true);
      return;
    }
    let mounted = true;
    const cached = getCachedMonsterAtlas(rigId);
    if (cached) {
      atlasRef.current = cached;
      timerRef.current.lastSignature = '';
      setAssetsReady(true);
    } else {
      setAssetsReady(false);
      preloadMonsterRigParts(rigId).then((loaded) => {
        if (!mounted) return;
        atlasRef.current = loaded;
        timerRef.current.lastSignature = '';
        setAssetsReady(true);
      });
    }
    return () => {
      mounted = false;
    };
  }, [rigId, isOriginalArt]);

  useEffect(() => {
    const targetEl = isOriginalArt ? hostRef.current : canvasRef.current;
    if (!targetEl) return;

    const canvas = !isOriginalArt ? canvasRef.current : null;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const syncResolution = () => {
      if (!canvas) return;
      const nextDpr = computeAdaptiveDpr();
      dprRef.current = nextDpr;
      const curSpec = MONSTER_RIG_SPECS[stateRef.current.rigId];
      const targetW = Math.round(curSpec.canonicalW * nextDpr);
      const targetH = Math.round(curSpec.canonicalH * nextDpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        timerRef.current.lastSignature = '';
      }
    };
    if (canvas) syncResolution();

    const updateRectCache = () => {
      const el = isOriginalArt ? hostRef.current : canvasRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        cachedRectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    };
    updateRectCache();
    const initRaf = requestAnimationFrame(updateRectCache);

    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(updateRectCache);
      resizeObs.observe(targetEl);
    }
    const handleResize = () => {
      if (canvas) syncResolution();
      updateRectCache();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', updateRectCache, { passive: true });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        timerRef.current.lastFrameTime = performance.now();
        updateRectCache();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const shadowSprite = !isOriginalArt ? getRadialSprite('shadow') : null;
    const hitSprite = !isOriginalArt ? getRadialSprite('hit') : null;
    const frostSprite = !isOriginalArt ? getRadialSprite('frost') : null;
    const burnSprite = !isOriginalArt ? getRadialSprite('burn') : null;
    const phase2Sprite = !isOriginalArt ? getRadialSprite('phase2') : null;

    timerRef.current.lastFrameTime = performance.now();

    const onTick = (now: number) => {
      const s = stateRef.current;
      const curSpec = MONSTER_RIG_SPECS[s.rigId];
      const timer = timerRef.current;
      const dtMs = Math.max(0, Math.min(50, now - timer.lastFrameTime));
      timer.lastFrameTime = now;

      const clipId = resolveMonsterClipId(s.animState);
      const key = `${s.rigId}:${clipId}:${s.animState}:${s.bossPattern ?? ''}`;

      if (timer.lastKey !== key || timer.lastReplayToken !== replayToken) {
        timer.lastKey = key;
        timer.lastReplayToken = replayToken;
        timer.elapsedMs = 0;
        timer.lastSignature = '';
        if (canvas) syncResolution();
      } else if (!s.paused && !s.isHitStop) {
        timer.elapsedMs += dtMs;
      }

      const meta = MONSTER_CLIP_CATALOG[clipId];
      const normT = meta.loop
        ? (timer.elapsedMs % meta.durationMs) / meta.durationMs
        : Math.min(1, timer.elapsedMs / Math.max(1, meta.durationMs));

      const signature = `${key}:${Math.round(normT * 240)}:${s.isFrozen ? 1 : 0}:${s.isBurning ? 1 : 0}:${s.bossPhase}`;
      if ((s.paused || s.isHitStop) && timer.lastSignature === signature) {
        return;
      }
      timer.lastSignature = signature;

      const pose = evaluateMonsterClipPose(curSpec.archetype, clipId, normT, {
        bossPattern: s.bossPattern,
        bossPhase: s.bossPhase,
      });
      const solved = solveMonsterSkeleton(curSpec.rigId, pose, curSpec.centerX, curSpec.groundY, 1.0);

      if (!s.isOriginalArt && canvas && ctx) {
        const atlas = atlasRef.current;
        if (!atlas || atlas.canvas.width <= 0) return;

        const dpr = dprRef.current;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, curSpec.canonicalW, curSpec.canonicalH);

        const gx = solved.attachments.groundContact.x;
        const gy = curSpec.groundY + 4;
        const altPx = Math.max(0, -pose.rootY);
        const shScale = Math.max(0.45, 1 - altPx / 120);
        const baseShW = curSpec.isBoss ? 176 : curSpec.archetype === 'beast' ? 148 : 112;
        const baseShH = curSpec.isBoss ? 28 : 20;
        if (shadowSprite) {
          ctx.save();
          ctx.globalAlpha = Math.max(0.24, 0.85 * shScale * solved.rootAlpha);
          ctx.drawImage(shadowSprite, gx - (baseShW * shScale) / 2, gy - (baseShH * shScale) / 2, baseShW * shScale, baseShH * shScale);
          ctx.restore();
        }

        if ((curSpec.isBoss && s.bossPhase === 2 && solved.rootAlpha > 0.1) || s.isFrozen || s.isBurning) {
          const bx = solved.attachments.bodyCenter.x;
          const by = solved.attachments.bodyCenter.y;
          const r = curSpec.isBoss ? 118 : 82;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.55 * solved.rootAlpha;
          if (s.isFrozen && frostSprite) {
            ctx.drawImage(frostSprite, bx - r, by - r, r * 2, r * 2);
          } else if (s.isBurning && burnSprite) {
            ctx.drawImage(burnSprite, bx - r, by - r, r * 2, r * 2);
          } else if (s.bossPhase === 2 && phase2Sprite) {
            ctx.drawImage(phase2Sprite, bx - r, by - r, r * 2, r * 2);
          }
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = solved.rootAlpha;
        for (let i = 0; i < solved.drawOrder.length; i++) {
          const partId = solved.drawOrder[i];
          const partSpec = curSpec.parts[partId];
          const m = solved.matrices[partId];
          if (!partSpec || !m) continue;

          let fileName = partSpec.file;
          if (partId === 'face') {
            if (solved.expression === 'hit' && atlas.rects['face_hit.png']) fileName = 'face_hit.png';
            else if (solved.expression === 'attack' && atlas.rects['face_attack.png']) fileName = 'face_attack.png';
          }
          const srcRect = atlas.rects[fileName];
          if (!srcRect) continue;

          ctx.setTransform(
            dpr * m[0],
            dpr * m[1],
            dpr * m[2],
            dpr * m[3],
            dpr * m[4],
            dpr * m[5]
          );
          ctx.drawImage(
            atlas.canvas,
            srcRect.sx,
            srcRect.sy,
            srcRect.sw,
            srcRect.sh,
            -partSpec.pivotX,
            -partSpec.pivotY,
            partSpec.w,
            partSpec.h
          );
        }
        ctx.restore();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (solved.hitFlashAlpha > 0.05 && hitSprite) {
          const bx = solved.attachments.bodyCenter.x;
          const by = solved.attachments.bodyCenter.y;
          const hr = curSpec.isBoss ? 105 : 74;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(0.9, solved.hitFlashAlpha);
          ctx.drawImage(hitSprite, bx - hr, by - hr, hr * 2, hr * 2);
          ctx.restore();
        }
      }

      // Publish Scene-Scoped Monster Anchors (no rAF DOM reflow polling)
      if (!cachedRectRef.current) {
        updateRectCache();
      }
      const rect = cachedRectRef.current;
      if (rect && rect.width > 0 && rect.height > 0) {
        const scaleX = rect.width / curSpec.canonicalW;
        const scaleY = rect.height / curSpec.canonicalH;
        const toClient = (pt: { x: number; y: number }) => ({
          x: rect.left + pt.x * scaleX,
          y: rect.top + pt.y * scaleY,
        });
        const clientPts: MonsterSceneAttachments = {
          updatedAt: now,
          monsterId: s.monsterId,
          archetype: curSpec.archetype,
          clipId,
          animState: s.animState,
          bodyCenter: toClient(solved.attachments.bodyCenter),
          headCenter: toClient(solved.attachments.headCenter),
          attackOrigin: toClient(solved.attachments.attackOrigin),
          groundContact: toClient(solved.attachments.groundContact),
          canvasRect: rect,
        };
        combatAnchorRegistry.setMonsterAnchors(s.resolvedScene, clientPts);
        if (s.onAttachmentsUpdate) {
          s.onAttachmentsUpdate(clientPts, normT);
        }
      }
    };

    onTick(performance.now());
    const unsubscribe = animationClock.subscribe(isMainBattleMonster ? 1 : 4, onTick);

    return () => {
      cancelAnimationFrame(initRaf);
      unsubscribe();
      if (resizeObs) resizeObs.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRectCache);
      document.removeEventListener('visibilitychange', handleVisibility);
      combatAnchorRegistry.clearMonsterAnchors(resolvedScene);
    };
  }, [rigId, replayToken, isMainBattleMonster, resolvedScene, isOriginalArt]);

  const activeClipId = resolveMonsterClipId(animState);

  if (isOriginalArt) {
    return (
      <div className={`monster-skeletal-stage monster-original-art-stage ${spec.isBoss ? 'is-boss-rig' : ''} ${className}`}>
        <img
          ref={(el) => {
            hostRef.current = el;
          }}
          src={resolvedSrc}
          alt={alt}
          className={`monster-2d-sprite monster-original-art-sprite monster-skeletal-canvas ${className}`}
          data-render-mode="original_art"
          data-rig-ready="true"
          data-monster-rig-id={rigId}
          data-monster-archetype={spec.archetype}
          data-anim-state={animState}
          data-clip-id={activeClipId}
          data-scene-context={resolvedScene}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`monster-skeletal-stage ${spec.isBoss ? 'is-boss-rig' : ''} ${className}`}>
      {!assetsReady && fallbackSrc && (
        <img src={fallbackSrc} alt={alt} className="monster-2d-sprite monster-fallback-sprite" draggable={false} />
      )}
      <canvas
        ref={canvasRef}
        className="monster-2d-sprite monster-skeletal-canvas"
        aria-label={alt}
        data-render-mode="skeletal_rig"
        data-rig-ready={assetsReady ? 'true' : 'false'}
        data-monster-rig-id={rigId}
        data-monster-archetype={spec.archetype}
        data-anim-state={animState}
        data-clip-id={activeClipId}
        data-scene-context={resolvedScene}
        style={{
          opacity: assetsReady ? 1 : 0,
        }}
      />
    </div>
  );
};
