import React, { useEffect, useRef, useState } from 'react';
import {
  PET_CLIP_CATALOG,
  PET_RIG_SPECS,
  PetRigId,
  PetRigState,
  evaluatePetClipPose,
  resolvePetClipId,
  resolvePetRigId,
  solvePetSkeleton,
} from '../data/petAnimationClips';
import { PackedRigAtlas, getCachedPetAtlas, preloadPetRigParts } from '../utils/monsterPetAssetCache';
import { animationClock } from '../utils/animationClock';
import {
  combatAnchorRegistry,
  CombatSceneContextId,
  PetSceneAttachments,
} from '../utils/combatAnchorRegistry';

interface PetSkeletalRigProps {
  petId?: string | null;
  petName?: string;
  isAttacking?: boolean;
  isMoving?: boolean;
  isVictory?: boolean;
  isMainBattlePet?: boolean;
  sceneContext?: CombatSceneContextId;
  paused?: boolean;
  replayToken?: number;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  onAttachmentsUpdate?: (pts: PetSceneAttachments, progress: number) => void;
}

let pShadowSprite: HTMLCanvasElement | null = null;
let pAttackAuraSprite: HTMLCanvasElement | null = null;

function getPetRadialSprite(kind: 'shadow' | 'aura'): HTMLCanvasElement {
  if (kind === 'shadow' && pShadowSprite) return pShadowSprite;
  if (kind === 'aura' && pAttackAuraSprite) return pAttackAuraSprite;
  const c = document.createElement('canvas');
  c.width = kind === 'shadow' ? 96 : 64;
  c.height = kind === 'shadow' ? 24 : 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    if (kind === 'shadow') {
      const g = ctx.createRadialGradient(48, 12, 3, 48, 12, 44);
      g.addColorStop(0, 'rgba(2, 6, 23, 0.65)');
      g.addColorStop(0.58, 'rgba(2, 6, 23, 0.24)');
      g.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 96, 24);
    } else {
      const g = ctx.createRadialGradient(32, 32, 3, 32, 32, 30);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      g.addColorStop(0.45, 'rgba(251, 191, 36, 0.55)');
      g.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
  }
  if (kind === 'shadow') pShadowSprite = c;
  else pAttackAuraSprite = c;
  return c;
}

function computeAdaptiveDpr(): number {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth < 640) return 1;
  return Math.min(window.devicePixelRatio || 1, 1.35);
}

export const PetSkeletalRig: React.FC<PetSkeletalRigProps> = ({
  petId,
  petName,
  isAttacking = false,
  isMoving = false,
  isVictory = false,
  isMainBattlePet = true,
  sceneContext,
  paused = false,
  replayToken = 0,
  fallbackSrc,
  alt = 'Pet',
  className = '',
  onAttachmentsUpdate,
}) => {
  const rigId: PetRigId = resolvePetRigId(petId, petName);
  const spec = PET_RIG_SPECS[rigId];
  const resolvedScene: CombatSceneContextId = sceneContext ?? (isMainBattlePet ? 'main_battle' : 'pet_showcase');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const atlasRef = useRef<PackedRigAtlas | null>(getCachedPetAtlas(rigId));
  const [assetsReady, setAssetsReady] = useState<boolean>(Boolean(atlasRef.current));
  const cachedRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const dprRef = useRef<number>(computeAdaptiveDpr());

  const stateRef = useRef({
    rigId,
    isAttacking,
    isMoving,
    isVictory,
    paused,
    resolvedScene,
    onAttachmentsUpdate,
  });
  stateRef.current = {
    rigId,
    isAttacking,
    isMoving,
    isVictory,
    paused,
    resolvedScene,
    onAttachmentsUpdate,
  };

  const timerRef = useRef({
    lastKey: '',
    elapsedMs: 0,
    lastFrameTime: typeof performance !== 'undefined' ? performance.now() : 0,
    lastReplayToken: replayToken,
    lastSignature: '',
  });

  useEffect(() => {
    let mounted = true;
    const cached = getCachedPetAtlas(rigId);
    if (cached) {
      atlasRef.current = cached;
      timerRef.current.lastSignature = '';
      setAssetsReady(true);
    } else {
      setAssetsReady(false);
      preloadPetRigParts(rigId).then((loaded) => {
        if (!mounted) return;
        atlasRef.current = loaded;
        timerRef.current.lastSignature = '';
        setAssetsReady(true);
      });
    }
    return () => {
      mounted = false;
    };
  }, [rigId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncResolution = () => {
      const nextDpr = computeAdaptiveDpr();
      dprRef.current = nextDpr;
      const curSpec = PET_RIG_SPECS[stateRef.current.rigId];
      const targetW = Math.round(curSpec.canonicalW * nextDpr);
      const targetH = Math.round(curSpec.canonicalH * nextDpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        timerRef.current.lastSignature = '';
      }
    };
    syncResolution();

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
      resizeObs = new ResizeObserver(updateRectCache);
      resizeObs.observe(canvas);
    }
    const handleResize = () => {
      syncResolution();
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

    const shadowSprite = getPetRadialSprite('shadow');
    const auraSprite = getPetRadialSprite('aura');
    timerRef.current.lastFrameTime = performance.now();

    const unsubscribe = animationClock.subscribe(isMainBattlePet ? 1 : 5, (now: number) => {
      const s = stateRef.current;
      const atlas = atlasRef.current;
      if (!atlas || atlas.canvas.width <= 0) return;

      const curSpec = PET_RIG_SPECS[s.rigId];
      const clipId = resolvePetClipId(s.isAttacking, s.isMoving, s.isVictory);
      const key = `${s.rigId}:${clipId}`;
      const timer = timerRef.current;
      const dtMs = Math.max(0, Math.min(50, now - timer.lastFrameTime));
      timer.lastFrameTime = now;

      if (timer.lastKey !== key || timer.lastReplayToken !== replayToken) {
        timer.lastKey = key;
        timer.lastReplayToken = replayToken;
        timer.elapsedMs = 0;
        timer.lastSignature = '';
      } else if (!s.paused) {
        timer.elapsedMs += dtMs;
      }

      const meta = PET_CLIP_CATALOG[clipId];
      const normT = meta.loop
        ? (timer.elapsedMs % meta.durationMs) / meta.durationMs
        : Math.min(1, timer.elapsedMs / Math.max(1, meta.durationMs));

      const signature = `${key}:${Math.round(normT * 240)}`;
      if (s.paused && timer.lastSignature === signature) return;
      timer.lastSignature = signature;

      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, curSpec.canonicalW, curSpec.canonicalH);

      const pose = evaluatePetClipPose(s.rigId, clipId, normT);
      const solved = solvePetSkeleton(s.rigId, pose, curSpec.centerX, curSpec.groundY, 1.0);

      // Keep data-pet-state DOM attribute accurate without React re-renders
      const subPhase: PetRigState = solved.subPhase;
      if (canvas.getAttribute('data-pet-state') !== subPhase) {
        canvas.setAttribute('data-pet-state', subPhase);
      }

      // 1. Baked Ground Shadow
      const gx = solved.attachments.groundContact.x;
      const gy = curSpec.groundY + 3;
      const shScale = Math.max(0.45, 1 - Math.max(0, -pose.rootY) / 70);
      ctx.save();
      ctx.globalAlpha = Math.max(0.28, 0.85 * shScale);
      ctx.drawImage(shadowSprite, gx - (76 * shScale) / 2, gy - (14 * shScale) / 2, 76 * shScale, 14 * shScale);
      ctx.restore();

      // 2. Co-op Attack Charge Glint at live attackOrigin
      if (clipId === 'attack') {
        const ax = solved.attachments.attackOrigin.x;
        const ay = solved.attachments.attackOrigin.y;
        const r = subPhase === 'AttackExecute' ? 22 : 14;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(auraSprite, ax - r, ay - r, r * 2, r * 2);
        ctx.restore();
      }

      // 3. Render Articulated Pet Parts
      for (let i = 0; i < solved.drawOrder.length; i++) {
        const partId = solved.drawOrder[i];
        const partSpec = curSpec.parts[partId];
        const m = solved.matrices[partId];
        if (!partSpec || !m) continue;

        let fileName = partSpec.file;
        if (partId === 'face') {
          if (solved.expression === 'attack' && atlas.rects['face_attack.png']) fileName = 'face_attack.png';
          else if (solved.expression === 'victory' && atlas.rects['face_victory.png']) fileName = 'face_victory.png';
        }
        const srcRect = atlas.rects[fileName];
        if (!srcRect) continue;

        ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 4. Publish Live Pet Attachments (for projectile launch synchronization)
      if (!cachedRectRef.current) updateRectCache();
      const rect = cachedRectRef.current;
      if (rect && rect.width > 0 && rect.height > 0) {
        const scaleX = rect.width / curSpec.canonicalW;
        const scaleY = rect.height / curSpec.canonicalH;
        const toClient = (pt: { x: number; y: number }) => ({
          x: rect.left + pt.x * scaleX,
          y: rect.top + pt.y * scaleY,
        });
        const clientPts: PetSceneAttachments = {
          updatedAt: now,
          petId: s.rigId,
          clipId,
          animState: subPhase,
          attackOrigin: toClient(solved.attachments.attackOrigin),
          bodyCenter: toClient(solved.attachments.bodyCenter),
          groundContact: toClient(solved.attachments.groundContact),
          canvasRect: rect,
        };
        combatAnchorRegistry.setPetAnchors(s.resolvedScene, clientPts);
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
      combatAnchorRegistry.clearPetAnchors(resolvedScene);
    };
  }, [rigId, replayToken, isMainBattlePet, resolvedScene]);

  const initialState: PetRigState = isAttacking ? 'AttackPrep' : isVictory ? 'Victory' : isMoving ? 'Move' : 'Idle';

  return (
    <div className={`pet-skeletal-stage ${className}`}>
      {!assetsReady && fallbackSrc && (
        <img src={fallbackSrc} alt={alt} className="pet-2d-sprite pet-fallback-sprite" draggable={false} />
      )}
      <canvas
        ref={canvasRef}
        className="pet-2d-sprite pet-skeletal-canvas"
        aria-label={alt}
        data-rig-ready={assetsReady ? 'true' : 'false'}
        data-pet-rig-id={rigId}
        data-pet-state={initialState}
        data-scene-context={resolvedScene}
        style={{ opacity: assetsReady ? 1 : 0 }}
      />
    </div>
  );
};
