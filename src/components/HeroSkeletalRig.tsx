import React, { useEffect, useRef, useState } from 'react';
import { CharacterClassId, SkillEffectType } from '../types/game';
import {
  CLASS_PART_SPECS,
  HERO_CLIP_CATALOG,
  HeroAnimationClipId,
  HeroRigState,
  RIG_CANONICAL_H,
  RIG_CANONICAL_W,
  RIG_DEFAULT_CENTER_X,
  RIG_DEFAULT_GROUND_Y,
  evaluateHeroClipPose,
  resolveHeroClipId,
  solveHeroSkeleton,
} from '../data/heroAnimationClips';
import { PackedHeroAtlas, getCachedHeroAtlas, preloadHeroRigParts } from '../utils/heroRigAssetCache';
import { animationClock } from '../utils/animationClock';

export interface HeroClientAttachments {
  updatedAt: number;
  classId: CharacterClassId;
  clipId: HeroAnimationClipId;
  animState: HeroRigState;
  weaponGrip: { x: number; y: number };
  weaponTip: { x: number; y: number };
  staffTip: { x: number; y: number };
  leftHand: { x: number; y: number };
  rightHand: { x: number; y: number };
  leftFoot: { x: number; y: number };
  rightFoot: { x: number; y: number };
  groundContact: { x: number; y: number };
  bodyCenter: { x: number; y: number };
}

declare global {
  interface Window {
    __heroAttachmentPoints?: HeroClientAttachments;
  }
}

interface HeroSkeletalRigProps {
  classId: CharacterClassId;
  animState: HeroRigState;
  castingSkillType?: SkillEffectType | null;
  isAwakeningCasting?: boolean;
  isHitStop?: boolean;
  attackDurationMs?: number;
  isMainBattleHero?: boolean;
  paused?: boolean;
  replayToken?: number;
  fallbackSrc?: string;
  alt?: string;
  onAttachmentsUpdate?: (clientPts: HeroClientAttachments, progress: number) => void;
  className?: string;
}

// Pre-rendered radial sprites (eliminates per-frame createRadialGradient allocations)
let cachedShadowSprite: HTMLCanvasElement | null = null;
let cachedCyanOrbSprite: HTMLCanvasElement | null = null;
let cachedPurpleOrbSprite: HTMLCanvasElement | null = null;

function getShadowSprite(): HTMLCanvasElement {
  if (cachedShadowSprite) return cachedShadowSprite;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 32;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(64, 16, 4, 64, 16, 60);
    g.addColorStop(0, 'rgba(2, 6, 23, 0.72)');
    g.addColorStop(0.55, 'rgba(2, 6, 23, 0.30)');
    g.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 32);
  }
  cachedShadowSprite = c;
  return c;
}

function getOrbGlowSprite(purple: boolean): HTMLCanvasElement {
  const existing = purple ? cachedPurpleOrbSprite : cachedCyanOrbSprite;
  if (existing) return existing;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, purple ? 'rgba(255,255,255,0.95)' : 'rgba(224,242,254,0.82)');
    g.addColorStop(0.42, purple ? 'rgba(192,132,252,0.58)' : 'rgba(56,189,248,0.45)');
    g.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  if (purple) cachedPurpleOrbSprite = c;
  else cachedCyanOrbSprite = c;
  return c;
}

export const HeroSkeletalRig: React.FC<HeroSkeletalRigProps> = ({
  classId,
  animState,
  castingSkillType = null,
  isAwakeningCasting = false,
  isHitStop = false,
  attackDurationMs,
  isMainBattleHero = true,
  paused = false,
  replayToken = 0,
  fallbackSrc,
  alt = 'Hero',
  onAttachmentsUpdate,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const atlasRef = useRef<PackedHeroAtlas | null>(getCachedHeroAtlas(classId));
  const [assetsReady, setAssetsReady] = useState<boolean>(Boolean(atlasRef.current));
  const cachedRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const stateRef = useRef({
    classId,
    animState,
    castingSkillType,
    isAwakeningCasting,
    isHitStop,
    attackDurationMs,
    paused,
    isMainBattleHero,
    onAttachmentsUpdate,
  });
  stateRef.current = {
    classId,
    animState,
    castingSkillType,
    isAwakeningCasting,
    isHitStop,
    attackDurationMs,
    paused,
    isMainBattleHero,
    onAttachmentsUpdate,
  };

  const clipTimerRef = useRef({
    lastKey: '',
    elapsedMs: 0,
    lastFrameTime: typeof performance !== 'undefined' ? performance.now() : 0,
    lastReplayToken: replayToken,
  });

  useEffect(() => {
    let mounted = true;
    const cached = getCachedHeroAtlas(classId);
    if (cached) {
      atlasRef.current = cached;
      setAssetsReady(true);
    } else {
      preloadHeroRigParts(classId).then((loaded) => {
        if (!mounted) return;
        atlasRef.current = loaded;
        setAssetsReady(true);
      });
    }
    return () => {
      mounted = false;
    };
  }, [classId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
    const targetW = Math.round(RIG_CANONICAL_W * dpr);
    const targetH = Math.round(RIG_CANONICAL_H * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const updateRectCache = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        cachedRectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    };
    updateRectCache();

    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(updateRectCache);
      resizeObs.observe(canvas);
    }
    window.addEventListener('resize', updateRectCache);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        clipTimerRef.current.lastFrameTime = performance.now();
        updateRectCache();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const shadowSprite = getShadowSprite();
    const cyanOrbSprite = getOrbGlowSprite(false);
    const purpleOrbSprite = getOrbGlowSprite(true);

    clipTimerRef.current.lastFrameTime = performance.now();
    let frameTickCount = 0;

    const unsubscribe = animationClock.subscribe(isMainBattleHero ? 1 : 3, (now: number) => {
      const s = stateRef.current;
      const timer = clipTimerRef.current;
      const dtMs = Math.max(0, Math.min(50, now - timer.lastFrameTime));
      timer.lastFrameTime = now;

      const clipId = resolveHeroClipId(
        s.classId,
        s.animState,
        s.castingSkillType ?? null,
        s.isAwakeningCasting
      );
      const clipKey = `${s.classId}:${clipId}:${s.animState}`;

      if (timer.lastKey !== clipKey || timer.lastReplayToken !== replayToken) {
        timer.lastKey = clipKey;
        timer.lastReplayToken = replayToken;
        timer.elapsedMs = 0;
      } else if (!s.paused && !s.isHitStop) {
        timer.elapsedMs += dtMs;
      }

      const meta = HERO_CLIP_CATALOG[clipId];
      const isBasicAtk = s.animState === 'Attack1' || s.animState === 'Attack2' || s.animState === 'Attack3';
      const durationMs = isBasicAtk && s.attackDurationMs
        ? Math.max(180, Math.min(550, s.attackDurationMs))
        : meta.durationMs;

      const normT = meta.loop
        ? ((timer.elapsedMs % durationMs) / durationMs)
        : Math.min(1, timer.elapsedMs / Math.max(1, durationMs));

      const atlas = atlasRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, RIG_CANONICAL_W, RIG_CANONICAL_H);

      if (atlas && atlas.canvas.width > 0) {
        const pose = evaluateHeroClipPose(s.classId, clipId, normT);
        const solved = solveHeroSkeleton(
          s.classId,
          pose,
          RIG_DEFAULT_CENTER_X,
          RIG_DEFAULT_GROUND_Y,
          1.0
        );

        // 1. Pre-rendered Ground Contact Shadow Sprite (Zero createRadialGradient)
        const gx = solved.attachments.groundContact.x;
        const gy = RIG_DEFAULT_GROUND_Y + 3;
        const altitude = Math.max(0, -pose.rootY);
        const shadowScale = Math.max(0.42, 1 - altitude / 95);
        const shadowW = 108 * shadowScale;
        const shadowH = 22 * shadowScale;
        ctx.save();
        ctx.globalAlpha = Math.max(0.28, 0.85 * shadowScale * solved.rootAlpha);
        ctx.drawImage(shadowSprite, gx - shadowW / 2, gy - shadowH / 2, shadowW, shadowH);
        ctx.restore();

        // 2. Render Articulated Skeletal Parts from Single Packed Atlas Texture
        const specs = CLASS_PART_SPECS[s.classId];
        ctx.save();
        ctx.globalAlpha = solved.rootAlpha;
        for (let i = 0; i < solved.drawOrder.length; i++) {
          const partId = solved.drawOrder[i];
          if (partId === 'offhand' && !solved.offhandVisible) continue;
          let fileName = specs[partId].file;
          if (partId === 'head') {
            if (solved.expression === 'hit' && atlas.rects['head_hit.png']) fileName = 'head_hit.png';
            else if (solved.expression === 'victory' && atlas.rects['head_victory.png']) fileName = 'head_victory.png';
            else if (solved.expression === 'defeat' && atlas.rects['head_defeat.png']) fileName = 'head_defeat.png';
          }
          const srcRect = atlas.rects[fileName];
          if (!srcRect) continue;
          const m = solved.matrices[partId];
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
            -specs[partId].pivotX,
            -specs[partId].pivotY,
            specs[partId].w,
            specs[partId].h
          );
        }
        ctx.restore();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 2.5 Pre-rendered Weapon-Locked Luminous Glint
        if (s.classId === 'mage') {
          const isBurst = s.animState === 'Attack3' || s.animState === 'SkillCast' || s.isAwakeningCasting;
          const isAtk = s.animState === 'Attack1' || s.animState === 'Attack2';
          const pulse = 0.88 + Math.sin(now * 0.008) * 0.14;
          const orbR = (isBurst ? 28 : isAtk ? 20 : 13) * pulse;
          const orbX = solved.attachments.staffTip.x;
          const orbY = solved.attachments.staffTip.y;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(
            isBurst ? purpleOrbSprite : cyanOrbSprite,
            orbX - orbR,
            orbY - orbR,
            orbR * 2,
            orbR * 2
          );
          ctx.restore();
        } else if (
          s.animState === 'Attack1' ||
          s.animState === 'Attack2' ||
          s.animState === 'Attack3' ||
          s.animState === 'SkillCast'
        ) {
          const tx = solved.attachments.weaponTip.x;
          const ty = solved.attachments.weaponTip.y;
          const gx2 = solved.attachments.weaponGrip.x;
          const gy2 = solved.attachments.weaponGrip.y;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = s.isAwakeningCasting || s.animState === 'Attack3'
            ? 'rgba(251, 191, 36, 0.72)'
            : 'rgba(186, 230, 253, 0.65)';
          ctx.lineWidth = s.animState === 'Attack3' ? 5 : 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(gx2, gy2);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.restore();
        }

        // 3. Synchronize World Viewport Attachment Points using Cached Bounding Rect (refresh lazily every 8 frames)
        if ((frameTickCount++ & 7) === 0 || !cachedRectRef.current) {
          updateRectCache();
        }
        const rect = cachedRectRef.current;
        if (rect && rect.width > 0 && rect.height > 0) {
          const scaleX = rect.width / RIG_CANONICAL_W;
          const scaleY = rect.height / RIG_CANONICAL_H;
          const toClient = (pt: { x: number; y: number }) => ({
            x: rect.left + pt.x * scaleX,
            y: rect.top + pt.y * scaleY,
          });
          const clientPts: HeroClientAttachments = {
            updatedAt: now,
            classId: s.classId,
            clipId,
            animState: s.animState,
            weaponGrip: toClient(solved.attachments.weaponGrip),
            weaponTip: toClient(solved.attachments.weaponTip),
            staffTip: toClient(solved.attachments.staffTip),
            leftHand: toClient(solved.attachments.leftHand),
            rightHand: toClient(solved.attachments.rightHand),
            leftFoot: toClient(solved.attachments.leftFoot),
            rightFoot: toClient(solved.attachments.rightFoot),
            groundContact: toClient(solved.attachments.groundContact),
            bodyCenter: toClient(solved.attachments.bodyCenter),
          };
          if (s.isMainBattleHero && typeof window !== 'undefined') {
            window.__heroAttachmentPoints = clientPts;
          }
          if (s.onAttachmentsUpdate) {
            s.onAttachmentsUpdate(clientPts, normT);
          }
        }
      }
    });

    return () => {
      unsubscribe();
      if (resizeObs) resizeObs.disconnect();
      window.removeEventListener('resize', updateRectCache);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [replayToken, isMainBattleHero]);

  return (
    <div className={`hero-skeletal-stage ${className}`}>
      {!assetsReady && fallbackSrc && (
        <img src={fallbackSrc} alt={alt} className="hero-2d-sprite hero-fallback-sprite" draggable={false} />
      )}
      <canvas
        ref={canvasRef}
        className="hero-2d-sprite hero-skeletal-canvas"
        aria-label={alt}
        data-rig-ready={assetsReady ? 'true' : 'false'}
        data-class-id={classId}
        data-anim-state={animState}
        style={{
          opacity: assetsReady ? 1 : 0,
        }}
      />
    </div>
  );
};
