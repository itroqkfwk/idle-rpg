import { MONSTER_RIG_SPECS, MonsterRigId } from '../data/monsterAnimationClips';
import { PET_RIG_SPECS, PetRigId } from '../data/petAnimationClips';

export interface AtlasSpriteRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface PackedRigAtlas {
  canvas: HTMLCanvasElement;
  rects: Record<string, AtlasSpriteRect>;
}

const MAX_MONSTER_ATLAS_CACHE = 10;

const monsterAtlasCache = new Map<MonsterRigId, PackedRigAtlas>();
const monsterPromiseCache = new Map<MonsterRigId, Promise<PackedRigAtlas>>();

const petAtlasCache = new Map<PetRigId, PackedRigAtlas>();
const petPromiseCache = new Map<PetRigId, Promise<PackedRigAtlas>>();

const EXTRA_MONSTER_FILES = ['face_hit.png', 'face_attack.png'] as const;
const EXTRA_PET_FILES = ['face_attack.png', 'face_victory.png'] as const;

function loadSingleImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = async () => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch {
        // Ignore decode cancellation on quick teardown
      }
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function packImagesIntoAtlas(entries: Array<readonly [string, HTMLImageElement | null]>): PackedRigAtlas {
  const ATLAS_W = 1024;
  const PADDING = 4;
  let curX = PADDING;
  let curY = PADDING;
  let rowH = 0;

  const rects: Record<string, AtlasSpriteRect> = {};
  const placements: Array<{ img: HTMLImageElement; x: number; y: number; w: number; h: number }> = [];

  for (const [name, img] of entries) {
    if (!img || img.naturalWidth <= 0 || img.naturalHeight <= 0) continue;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (curX + w + PADDING > ATLAS_W) {
      curX = PADDING;
      curY += rowH + PADDING;
      rowH = 0;
    }
    rects[name] = { sx: curX, sy: curY, sw: w, sh: h };
    placements.push({ img, x: curX, y: curY, w, h });
    curX += w + PADDING;
    if (h > rowH) rowH = h;
  }

  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_W;
  canvas.height = Math.max(128, curY + rowH + PADDING);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    for (const p of placements) {
      ctx.drawImage(p.img, p.x, p.y, p.w, p.h);
    }
  }
  return { canvas, rects };
}

export function getCachedMonsterAtlas(rigId: MonsterRigId): PackedRigAtlas | null {
  const hit = monsterAtlasCache.get(rigId) ?? null;
  if (hit) {
    // Refresh LRU order
    monsterAtlasCache.delete(rigId);
    monsterAtlasCache.set(rigId, hit);
  }
  return hit;
}

export function preloadMonsterRigParts(rigId: MonsterRigId): Promise<PackedRigAtlas> {
  const cached = getCachedMonsterAtlas(rigId);
  if (cached) return Promise.resolve(cached);

  const pending = monsterPromiseCache.get(rigId);
  if (pending) return pending;

  const spec = MONSTER_RIG_SPECS[rigId];
  const baseDir = `./assets/animations/monsters/${rigId}/parts`;
  const files = new Set<string>(
    Object.values(spec.parts)
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => p.file)
  );
  EXTRA_MONSTER_FILES.forEach((f) => files.add(f));

  const promise = Promise.all(
    Array.from(files).map(async (fileName) => {
      const img = await loadSingleImage(`${baseDir}/${fileName}`);
      return [fileName, img] as const;
    })
  ).then((entries) => {
    const atlas = packImagesIntoAtlas(entries);
    if (monsterAtlasCache.size >= MAX_MONSTER_ATLAS_CACHE) {
      const oldestKey = monsterAtlasCache.keys().next().value;
      if (oldestKey) {
        const oldAtlas = monsterAtlasCache.get(oldestKey);
        if (oldAtlas) {
          oldAtlas.canvas.width = 0;
          oldAtlas.canvas.height = 0;
        }
        monsterAtlasCache.delete(oldestKey);
      }
    }
    monsterAtlasCache.set(rigId, atlas);
    monsterPromiseCache.delete(rigId);
    return atlas;
  });

  monsterPromiseCache.set(rigId, promise);
  return promise;
}

export function getCachedPetAtlas(petId: PetRigId): PackedRigAtlas | null {
  return petAtlasCache.get(petId) ?? null;
}

export function preloadPetRigParts(petId: PetRigId): Promise<PackedRigAtlas> {
  const cached = getCachedPetAtlas(petId);
  if (cached) return Promise.resolve(cached);

  const pending = petPromiseCache.get(petId);
  if (pending) return pending;

  const spec = PET_RIG_SPECS[petId];
  const baseDir = `./assets/animations/pets/${petId}/parts`;
  const files = new Set<string>(
    Object.values(spec.parts)
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => p.file)
  );
  EXTRA_PET_FILES.forEach((f) => files.add(f));

  const promise = Promise.all(
    Array.from(files).map(async (fileName) => {
      const img = await loadSingleImage(`${baseDir}/${fileName}`);
      return [fileName, img] as const;
    })
  ).then((entries) => {
    const atlas = packImagesIntoAtlas(entries);
    petAtlasCache.set(petId, atlas);
    petPromiseCache.delete(petId);
    return atlas;
  });

  petPromiseCache.set(petId, promise);
  return promise;
}

export function getMonsterPetAtlasCacheStats(): { monsterCount: number; petCount: number } {
  return {
    monsterCount: monsterAtlasCache.size,
    petCount: petAtlasCache.size,
  };
}
