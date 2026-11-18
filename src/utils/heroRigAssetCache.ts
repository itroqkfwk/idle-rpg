import { CharacterClassId } from '../types/game';
import { CLASS_PART_SPECS } from '../data/heroAnimationClips';

export interface AtlasSpriteRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface PackedHeroAtlas {
  canvas: HTMLCanvasElement;
  rects: Record<string, AtlasSpriteRect>;
}

export type LoadedPartMap = Record<string, HTMLImageElement>;

const atlasCacheByClass: Partial<Record<CharacterClassId, PackedHeroAtlas>> = {};
const promiseByClass: Partial<Record<CharacterClassId, Promise<PackedHeroAtlas>>> = {};

const EXTRA_HEAD_FILES = ['head_hit.png', 'head_victory.png', 'head_defeat.png'] as const;

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
        // Ignore decode rejection if interrupted
      }
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function packImagesIntoAtlas(entries: Array<readonly [string, HTMLImageElement | null]>): PackedHeroAtlas {
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
  canvas.height = Math.max(256, curY + rowH + PADDING);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    for (const p of placements) {
      ctx.drawImage(p.img, p.x, p.y, p.w, p.h);
    }
  }
  return { canvas, rects };
}

export function getCachedHeroAtlas(classId: CharacterClassId): PackedHeroAtlas | null {
  return atlasCacheByClass[classId] ?? null;
}

export function preloadHeroRigParts(classId: CharacterClassId): Promise<PackedHeroAtlas> {
  if (atlasCacheByClass[classId]) {
    return Promise.resolve(atlasCacheByClass[classId]!);
  }
  if (promiseByClass[classId]) {
    return promiseByClass[classId]!;
  }

  const baseDir = `./assets/animations/${classId}/parts`;
  const partFiles = new Set<string>(
    Object.values(CLASS_PART_SPECS[classId]).map((sp) => sp.file)
  );
  EXTRA_HEAD_FILES.forEach((f) => partFiles.add(f));

  const promise = Promise.all(
    Array.from(partFiles).map(async (fileName) => {
      const img = await loadSingleImage(`${baseDir}/${fileName}`);
      return [fileName, img] as const;
    })
  ).then((entries) => {
    const atlas = packImagesIntoAtlas(entries);
    atlasCacheByClass[classId] = atlas;
    return atlas;
  });

  promiseByClass[classId] = promise;
  return promise;
}

export function preloadAllHeroRigAssets(): void {
  void preloadHeroRigParts('warrior');
  void preloadHeroRigParts('mage');
}
