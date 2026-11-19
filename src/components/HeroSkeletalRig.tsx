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
import { combatAnchorRegistry, CombatSceneContextId, HeroSceneAttachments } from '../utils/combatAnchorRegistry';

export type HeroClientAttachments = HeroSceneAttachments;

interface HeroSkeletalRigProps {
  classId: CharacterClassId;
  animState: HeroRigState;
  castingSkillType?: SkillEffectType | null;
  isAwakeningCasting?: boolean;
  isHitStop?: boolean;
  attackDurationMs?: number;
  isMainBattleHero?: boolean;
  sceneContext?: CombatSceneContextId;
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

function computeAdaptiveDpr(): number {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth < 640) return 1;
  return Math.min(window.devicePixelRatio || 1, 1.35);
}

export const HeroSkeletalRig: React.FC<HeroSkeletalRigProps> = ({
  classId,
  animState,
  castingSkillType = null,
  isAwakeningCasting = false,
  isHitStop = false,
  attackDurationMs,
  isMainBattleHero = true,
  sceneContext,
  paused = false,
  replayToken = 0,
  fallbackSrc,
  alt = 'Hero',
  onAttachmentsUpdate,
  className = '',
}) => {
  const resolvedScene: CombatSceneContextId = sceneContext ?? (isMainBattleHero ? 'main_battle' : 'skill_preview');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const atlasRef = useRef<PackedHeroAtlas | null>(getCachedHeroAtlas(classId));
  const [assetsReady, setAssetsReady] = useState<boolean>(Boolean(atlasRef.current));
  const cachedRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const dprRef = useRef<number>(computeAdaptiveDpr());

  const stateRef = useRef({
    classId,
    animState,
    castingSkillType,
    isAwakeningCasting,
    isHitStop,
    attackDurationMs,
    paused,
    isMainBattleHero,
    resolvedScene,
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
    resolvedScene,
    onAttachmentsUpdate,
  };

  const clipTimerRef = useRef({
    lastKey: '',
    elapsedMs: 0,
    lastFrameTime: typeof performance !== 'undefined' ? performance.now() : 0,
    lastReplayToken: replayToken,
    lastDrawnSignature: '',
  });

  useEffect(() => {
    let mounted = true;
    const cached = getCachedHeroAtlas(classId);
    if (cached) {
      atlasRef.current = cached;
      clipTimerRef.current.lastDrawnSignature = '';
      setAssetsReady(true);
    } else {
      preloadHeroRigParts(classId).then((loaded) => {
        if (!mounted) return;
        atlasRef.current = loaded;
        clipTimerRef.current.lastDrawnSignature = '';
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

    const syncCanvasResolution = () => {
      const nextDpr = computeAdaptiveDpr();
      dprRef.current = nextDpr;
      const targetW = Math.round(RIG_CANONICAL_W * nextDpr);
      const targetH = Math.round(RIG_CANONICAL_H * nextDpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        clipTimerRef.current.lastDrawnSignature = '';
      }
    };
    syncCanvasResolution();

    const updateRectCache = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        cachedRectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    };
    updateRectCache();
    const initRaf = requestAnimationFrame(updateRectCache);

    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(() => {
        updateRectCache();
      });
      resizeObs.observe(canvas);
    }
    const handleResize = () => {
      syncCanvasResolution();
      updateRectCache();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', updateRectCache, { passive: true });

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

    const unsubscribe = animationClock.subscribe(isMainBattleHero ? 1 : 4, (now: number) => {
      const s = stateRef.current;
      const atlas = atlasRef.current;
      if (!atlas || atlas.canvas.width <= 0) return;

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
        timer.lastDrawnSignature = '';
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

      const signature = `${clipKey}:${Math.round(normT * 240)}`;
      if ((s.paused || s.isHitStop) && timer.lastDrawnSignature === signature) {
        return;
      }
      timer.lastDrawnSignature = signature;

      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, RIG_CANONICAL_W, RIG_CANONICAL_H);

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

      // 3. Publish Scene-Isolated Attachment Coordinates using Cached Bounding Rect (zero DOM reflow inside rAF!)
      if (!cachedRectRef.current) {
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
          canvasRect: rect,
        };
        combatAnchorRegistry.setHeroAnchors(s.resolvedScene, clientPts);
        if (s.onAttachmentsUpdate) {
          s.onAttachmentsUpdate(clientPts, normT);
        }
      }
    });

    return () => {
      cancelAnimationFrame(initRaf);
      unsubscribe();
      if (resizeObs) resizeObs.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRectCache);
      document.removeEventListener('visibilitychange', handleVisibility);
      combatAnchorRegistry.clearHeroAnchors(resolvedScene);
    };
  }, [replayToken, isMainBattleHero, resolvedScene]);

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
        data-scene-context={resolvedScene}
        style={{
          opacity: assetsReady ? 1 : 0,
        }}
      />
    </div>
  );
};
