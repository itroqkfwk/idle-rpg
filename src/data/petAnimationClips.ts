export type PetRigId = 'pet_fox' | 'pet_fairy' | 'pet_slime' | 'pet_cat' | 'pet_dragon';

export type PetRigState =
  | 'Idle'
  | 'Move'
  | 'AttackPrep'
  | 'AttackExecute'
  | 'Recovery'
  | 'Victory';

export type PetClipId = 'idle' | 'move' | 'attack' | 'victory';

export type PetPartId =
  | 'tail_3'
  | 'tail_2'
  | 'tail_1'
  | 'wing_back'
  | 'wing_front'
  | 'leg_back'
  | 'leg_front'
  | 'arm_back'
  | 'torso'
  | 'crown'
  | 'head'
  | 'face'
  | 'arm_front';

export type Mat2D = [number, number, number, number, number, number];

export interface Vec2 {
  x: number;
  y: number;
}

export interface PetPartSpec {
  id: PetPartId;
  file: string;
  w: number;
  h: number;
  pivotX: number;
  pivotY: number;
  exportScale: number;
}

export interface PetRigSpec {
  petId: PetRigId;
  canonicalW: number;
  canonicalH: number;
  centerX: number;
  groundY: number;
  parts: Partial<Record<PetPartId, PetPartSpec>>;
  drawOrder: PetPartId[];
}

export interface PetPose {
  rootX: number;
  rootY: number;
  bodyAngle: number;
  bodyScaleX: number;
  bodyScaleY: number;
  headAngle: number;
  tail1Angle: number;
  tail2Angle: number;
  tail3Angle: number;
  wingBackAngle: number;
  wingBackScaleX: number;
  wingFrontAngle: number;
  wingFrontScaleX: number;
  armBackAngle: number;
  armFrontAngle: number;
  legBackAngle: number;
  legFrontAngle: number;
  crownAngle: number;
  groundLock: boolean;
  expression: 'normal' | 'attack' | 'victory';
  subPhase?: PetRigState;
}

export interface PetAttachmentPoints {
  bodyCenter: Vec2;
  attackOrigin: Vec2;
  groundContact: Vec2;
}

export interface SolvedPetFrame {
  matrices: Partial<Record<PetPartId, Mat2D>>;
  drawOrder: PetPartId[];
  attachments: PetAttachmentPoints;
  expression: 'normal' | 'attack' | 'victory';
  subPhase: PetRigState;
}

export interface PetClipMeta {
  id: PetClipId;
  durationMs: number;
  loop: boolean;
}

export const PET_CLIP_CATALOG: Record<PetClipId, PetClipMeta> = {
  idle: { id: 'idle', durationMs: 1600, loop: true },
  move: { id: 'move', durationMs: 520, loop: true },
  attack: { id: 'attack', durationMs: 390, loop: false },
  victory: { id: 'victory', durationMs: 680, loop: false },
};

export const PET_CANONICAL_W = 160;
export const PET_CANONICAL_H = 140;
export const PET_DEFAULT_CENTER_X = 76;
export const PET_DEFAULT_GROUND_Y = 122;
export const PET_EXPORT_SCALE = 2;

export const ALL_PET_RIG_IDS: PetRigId[] = ['pet_fox', 'pet_fairy', 'pet_slime', 'pet_cat', 'pet_dragon'];

export function resolvePetRigId(petId?: string | null, petName?: string): PetRigId {
  const id = petId || '';
  if (id === 'pet_fairy' || petName?.includes('요정')) return 'pet_fairy';
  if (id === 'pet_slime' || petName?.includes('슬라임')) return 'pet_slime';
  if (id === 'pet_cat' || petName?.includes('냥이') || petName?.includes('고양이')) return 'pet_cat';
  if (id === 'pet_dragon' || petName?.includes('드래곤')) return 'pet_dragon';
  return 'pet_fox';
}

function sp(id: PetPartId, file: string, w: number, h: number, pivotX: number, pivotY: number): PetPartSpec {
  return { id, file, w, h, pivotX, pivotY, exportScale: PET_EXPORT_SCALE };
}

export const PET_RIG_SPECS: Record<PetRigId, PetRigSpec> = {
  pet_fox: {
    petId: 'pet_fox',
    canonicalW: PET_CANONICAL_W,
    canonicalH: PET_CANONICAL_H,
    centerX: PET_DEFAULT_CENTER_X,
    groundY: PET_DEFAULT_GROUND_Y,
    parts: {
      tail_3: sp('tail_3', 'tail_3.png', 52, 52, 42, 42),
      tail_2: sp('tail_2', 'tail_2.png', 54, 52, 42, 42),
      tail_1: sp('tail_1', 'tail_1.png', 52, 48, 42, 38),
      leg_back: sp('leg_back', 'leg_back.png', 24, 34, 12, 8),
      arm_back: sp('arm_back', 'arm_back.png', 24, 34, 12, 8),
      torso: sp('torso', 'torso.png', 66, 48, 33, 30),
      leg_front: sp('leg_front', 'leg_front.png', 24, 34, 12, 8),
      arm_front: sp('arm_front', 'arm_front.png', 24, 34, 12, 8),
      head: sp('head', 'head.png', 66, 62, 28, 44),
      face: sp('face', 'face.png', 46, 30, 23, 15),
    },
    drawOrder: ['tail_3', 'tail_2', 'tail_1', 'leg_back', 'arm_back', 'torso', 'leg_front', 'arm_front', 'head', 'face'],
  },
  pet_fairy: {
    petId: 'pet_fairy',
    canonicalW: PET_CANONICAL_W,
    canonicalH: PET_CANONICAL_H,
    centerX: PET_DEFAULT_CENTER_X,
    groundY: PET_DEFAULT_GROUND_Y,
    parts: {
      wing_back: sp('wing_back', 'wing_back.png', 56, 64, 46, 36),
      tail_1: sp('tail_1', 'tail_1.png', 46, 44, 34, 14),
      arm_back: sp('arm_back', 'arm_back.png', 22, 28, 11, 6),
      torso: sp('torso', 'torso.png', 46, 54, 23, 42),
      head: sp('head', 'head.png', 58, 56, 29, 44),
      face: sp('face', 'face.png', 40, 26, 20, 13),
      wing_front: sp('wing_front', 'wing_front.png', 56, 64, 46, 36),
      arm_front: sp('arm_front', 'arm_front.png', 22, 28, 11, 6),
    },
    drawOrder: ['wing_back', 'wing_front', 'tail_1', 'arm_back', 'torso', 'head', 'face', 'arm_front'],
  },
  pet_slime: {
    petId: 'pet_slime',
    canonicalW: PET_CANONICAL_W,
    canonicalH: PET_CANONICAL_H,
    centerX: PET_DEFAULT_CENTER_X,
    groundY: PET_DEFAULT_GROUND_Y,
    parts: {
      leg_back: sp('leg_back', 'leg_back.png', 22, 18, 11, 5),
      leg_front: sp('leg_front', 'leg_front.png', 22, 18, 11, 5),
      arm_back: sp('arm_back', 'arm_back.png', 22, 24, 11, 6),
      torso: sp('torso', 'torso.png', 78, 66, 39, 58),
      face: sp('face', 'face.png', 54, 34, 27, 17),
      crown: sp('crown', 'crown.png', 44, 34, 22, 28),
      arm_front: sp('arm_front', 'arm_front.png', 22, 24, 11, 6),
    },
    drawOrder: ['leg_back', 'arm_back', 'leg_front', 'torso', 'face', 'crown', 'arm_front'],
  },
  pet_cat: {
    petId: 'pet_cat',
    canonicalW: PET_CANONICAL_W,
    canonicalH: PET_CANONICAL_H,
    centerX: PET_DEFAULT_CENTER_X,
    groundY: PET_DEFAULT_GROUND_Y,
    parts: {
      tail_1: sp('tail_1', 'tail_1.png', 48, 56, 40, 44),
      leg_back: sp('leg_back', 'leg_back.png', 22, 34, 11, 8),
      arm_back: sp('arm_back', 'arm_back.png', 22, 34, 11, 8),
      torso: sp('torso', 'torso.png', 62, 46, 31, 28),
      leg_front: sp('leg_front', 'leg_front.png', 22, 34, 11, 8),
      arm_front: sp('arm_front', 'arm_front.png', 24, 36, 12, 8),
      head: sp('head', 'head.png', 62, 58, 28, 42),
      face: sp('face', 'face.png', 44, 28, 22, 14),
    },
    drawOrder: ['tail_1', 'leg_back', 'arm_back', 'torso', 'leg_front', 'head', 'face', 'arm_front'],
  },
  pet_dragon: {
    petId: 'pet_dragon',
    canonicalW: PET_CANONICAL_W,
    canonicalH: PET_CANONICAL_H,
    centerX: PET_DEFAULT_CENTER_X,
    groundY: PET_DEFAULT_GROUND_Y,
    parts: {
      wing_back: sp('wing_back', 'wing_back.png', 58, 56, 48, 34),
      tail_1: sp('tail_1', 'tail_1.png', 54, 46, 44, 28),
      leg_back: sp('leg_back', 'leg_back.png', 24, 30, 12, 8),
      arm_back: sp('arm_back', 'arm_back.png', 22, 26, 11, 6),
      torso: sp('torso', 'torso.png', 60, 56, 30, 38),
      leg_front: sp('leg_front', 'leg_front.png', 24, 30, 12, 8),
      head: sp('head', 'head.png', 66, 58, 24, 42),
      face: sp('face', 'face.png', 46, 28, 23, 14),
      wing_front: sp('wing_front', 'wing_front.png', 58, 56, 48, 34),
      arm_front: sp('arm_front', 'arm_front.png', 22, 26, 11, 6),
    },
    drawOrder: ['wing_back', 'wing_front', 'tail_1', 'leg_back', 'arm_back', 'torso', 'leg_front', 'head', 'face', 'arm_front'],
  },
};

const DEG_TO_RAD = Math.PI / 180;
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function defaultPetPose(): PetPose {
  return {
    rootX: 0, rootY: 0,
    bodyAngle: 0, bodyScaleX: 1, bodyScaleY: 1, headAngle: 0,
    tail1Angle: 0, tail2Angle: 0, tail3Angle: 0,
    wingBackAngle: 0, wingBackScaleX: 1, wingFrontAngle: 0, wingFrontScaleX: 1,
    armBackAngle: 0, armFrontAngle: 0, legBackAngle: 0, legFrontAngle: 0, crownAngle: 0,
    groundLock: true, expression: 'normal', subPhase: 'Idle',
  };
}

interface Key { t: number; pose: Partial<PetPose>; ease?: 'linear' | 'smooth'; }

function sampleKeys(tRaw: number, keys: Key[]): PetPose {
  const t = Math.max(0, Math.min(1, tRaw));
  const base = defaultPetPose();
  let p = keys[0];
  let n = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) { p = keys[i]; n = keys[i + 1]; break; }
  }
  const span = Math.max(0.0001, n.t - p.t);
  const localT = (t - p.t) / span;
  const k = n.ease === 'linear' ? localT : easeInOut(localT);
  const out: PetPose = { ...base };
  const numKeys: (keyof PetPose)[] = [
    'rootX', 'rootY', 'bodyAngle', 'bodyScaleX', 'bodyScaleY', 'headAngle',
    'tail1Angle', 'tail2Angle', 'tail3Angle',
    'wingBackAngle', 'wingBackScaleX', 'wingFrontAngle', 'wingFrontScaleX',
    'armBackAngle', 'armFrontAngle', 'legBackAngle', 'legFrontAngle', 'crownAngle',
  ];
  for (const prop of numKeys) {
    const a = (p.pose[prop] as number | undefined) ?? (base[prop] as number);
    const b = (n.pose[prop] as number | undefined) ?? (base[prop] as number);
    (out[prop] as number) = lerp(a, b, k);
  }
  out.groundLock = k < 0.5 ? (p.pose.groundLock ?? true) : (n.pose.groundLock ?? true);
  out.expression = k < 0.5 ? (p.pose.expression ?? 'normal') : (n.pose.expression ?? 'normal');
  out.subPhase = k < 0.5 ? (p.pose.subPhase ?? 'Idle') : (n.pose.subPhase ?? 'Idle');
  return out;
}

export function resolvePetClipId(isAttacking: boolean, isMoving: boolean, isVictory: boolean): PetClipId {
  if (isAttacking) return 'attack';
  if (isVictory) return 'victory';
  if (isMoving) return 'move';
  return 'idle';
}

export function evaluatePetClipPose(petId: PetRigId, clipId: PetClipId, tNorm: number): PetPose {
  const isLoop = PET_CLIP_CATALOG[clipId]?.loop ?? false;
  const t = isLoop ? ((tNorm % 1) + 1) % 1 : Math.max(0, Math.min(1, tNorm));
  const phase = t * Math.PI * 2;
  const sin = Math.sin(phase);
  const cos = Math.cos(phase);

  // --- VICTORY ---
  if (clipId === 'victory') {
    const flap = Math.sin(t * Math.PI * 6);
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'victory', subPhase: 'Victory', rootY: 0 } },
      { t: 0.35, pose: { rootY: -18, bodyAngle: -8, bodyScaleY: 1.06, headAngle: -8, tail1Angle: -28, tail2Angle: 22, tail3Angle: -16, armFrontAngle: -56, legBackAngle: 24, wingFrontAngle: flap * 30, wingBackAngle: -flap * 30, expression: 'victory', subPhase: 'Victory', groundLock: false }, ease: 'smooth' },
      { t: 0.72, pose: { rootY: -6, bodyAngle: 6, tail1Angle: 24, tail2Angle: -18, tail3Angle: 20, expression: 'victory', subPhase: 'Victory', groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootY: 0, expression: 'victory', subPhase: 'Victory' }, ease: 'smooth' },
    ]);
  }

  // --- 1. PET FOX (붉은 방울 여우) ---
  if (petId === 'pet_fox') {
    if (clipId === 'idle') {
      const p = defaultPetPose();
      p.bodyScaleY = 1 + sin * 0.03;
      p.headAngle = cos * 4;
      p.tail1Angle = Math.sin(phase) * 14;
      p.tail2Angle = Math.sin(phase - 0.7) * 16;
      p.tail3Angle = Math.sin(phase - 1.4) * 18;
      p.subPhase = 'Idle';
      return p;
    }
    if (clipId === 'move') {
      const p = defaultPetPose();
      p.rootY = -Math.abs(sin) * 8;
      p.bodyAngle = 4 + Math.cos(phase * 2) * 4;
      p.headAngle = -4 + Math.sin(phase * 2) * 3;
      p.armFrontAngle = -sin * 34;
      p.legBackAngle = -sin * 34;
      p.armBackAngle = sin * 34;
      p.legFrontAngle = sin * 34;
      p.tail1Angle = sin * 18;
      p.tail2Angle = cos * 18;
      p.tail3Angle = -sin * 16;
      p.subPhase = 'Move';
      return p;
    }
    // attack (0..0.22 AttackPrep, 0.22..0.64 AttackExecute, 0.64..1.0 Recovery)
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack', subPhase: 'AttackPrep' } },
      { t: 0.20, pose: { rootX: -8, rootY: 4, bodyAngle: 12, bodyScaleY: 0.90, headAngle: -8, tail1Angle: -20, tail2Angle: -14, tail3Angle: -8, armFrontAngle: -30, legBackAngle: 28, expression: 'attack', subPhase: 'AttackPrep' }, ease: 'smooth' },
      { t: 0.45, pose: { rootX: 28, rootY: -14, bodyAngle: -10, headAngle: 10, tail1Angle: 22, tail2Angle: 30, tail3Angle: 36, armFrontAngle: 48, armBackAngle: 38, legFrontAngle: -38, legBackAngle: -44, expression: 'attack', subPhase: 'AttackExecute', groundLock: false }, ease: 'linear' },
      { t: 0.76, pose: { rootX: 10, rootY: 0, bodyAngle: 4, tail1Angle: -12, expression: 'normal', subPhase: 'Recovery' }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, headAngle: 0, expression: 'normal', subPhase: 'Recovery' }, ease: 'smooth' },
    ]);
  }

  // --- 2. PET FAIRY (햇살 반딧불 요정) ---
  if (petId === 'pet_fairy') {
    const fastFlap = Math.sin(t * Math.PI * 8);
    if (clipId === 'idle') {
      const p = defaultPetPose();
      p.rootX = sin * 3;
      p.rootY = -18 + Math.sin(phase * 2) * 5;
      p.bodyAngle = cos * 6;
      p.headAngle = -cos * 4;
      p.wingFrontAngle = fastFlap * 26;
      p.wingFrontScaleX = 0.56 + Math.abs(fastFlap) * 0.44;
      p.wingBackAngle = -fastFlap * 24;
      p.wingBackScaleX = 0.54 + Math.abs(fastFlap) * 0.44;
      p.armFrontAngle = -14 + sin * 10;
      p.armBackAngle = 14 - sin * 10;
      p.tail1Angle = Math.sin(phase - 0.6) * 16;
      p.groundLock = false;
      p.subPhase = 'Idle';
      return p;
    }
    if (clipId === 'move') {
      const p = defaultPetPose();
      p.rootY = -20 + cos * 6;
      p.bodyAngle = 16;
      p.headAngle = -10;
      p.wingFrontAngle = fastFlap * 30;
      p.wingFrontScaleX = 0.52 + Math.abs(fastFlap) * 0.48;
      p.wingBackAngle = -fastFlap * 28;
      p.wingBackScaleX = 0.50 + Math.abs(fastFlap) * 0.48;
      p.tail1Angle = -24 + sin * 14;
      p.groundLock = false;
      p.subPhase = 'Move';
      return p;
    }
    return sampleKeys(t, [
      { t: 0.00, pose: { rootY: -18, bodyAngle: 0, expression: 'attack', subPhase: 'AttackPrep', groundLock: false } },
      { t: 0.22, pose: { rootX: -6, rootY: -26, bodyAngle: -16, armFrontAngle: -64, armBackAngle: -56, wingFrontAngle: -28, wingBackAngle: 28, expression: 'attack', subPhase: 'AttackPrep', groundLock: false }, ease: 'smooth' },
      { t: 0.46, pose: { rootX: 24, rootY: -18, bodyAngle: 22, armFrontAngle: 68, armBackAngle: 52, wingFrontAngle: 32, wingBackAngle: -32, expression: 'attack', subPhase: 'AttackExecute', groundLock: false }, ease: 'linear' },
      { t: 0.78, pose: { rootX: 8, rootY: -22, bodyAngle: 8, armFrontAngle: 12, subPhase: 'Recovery', groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: -18, bodyAngle: 0, expression: 'normal', subPhase: 'Recovery', groundLock: false }, ease: 'smooth' },
    ]);
  }

  // --- 3. PET SLIME (퐁퐁 슬라임) ---
  if (petId === 'pet_slime') {
    if (clipId === 'idle') {
      const p = defaultPetPose();
      p.bodyScaleX = 1 + sin * 0.08;
      p.bodyScaleY = 1 - sin * 0.07;
      p.crownAngle = cos * 9;
      p.armFrontAngle = -10 + sin * 10;
      p.armBackAngle = 10 - sin * 10;
      p.subPhase = 'Idle';
      return p;
    }
    if (clipId === 'move') {
      return sampleKeys(t, [
        { t: 0.00, pose: { bodyScaleX: 1.14, bodyScaleY: 0.86, subPhase: 'Move' } },
        { t: 0.36, pose: { rootX: 10, rootY: -16, bodyScaleX: 0.88, bodyScaleY: 1.14, crownAngle: -12, subPhase: 'Move', groundLock: false }, ease: 'smooth' },
        { t: 0.74, pose: { rootX: 4, rootY: 2, bodyScaleX: 1.18, bodyScaleY: 0.82, crownAngle: 10, subPhase: 'Move' }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 0, rootY: 0, bodyScaleX: 1.04, bodyScaleY: 0.96, subPhase: 'Move' }, ease: 'smooth' },
      ]);
    }
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack', subPhase: 'AttackPrep' } },
      { t: 0.22, pose: { rootX: -6, bodyScaleX: 1.24, bodyScaleY: 0.76, crownAngle: -16, armFrontAngle: -24, expression: 'attack', subPhase: 'AttackPrep' }, ease: 'smooth' },
      { t: 0.46, pose: { rootX: 30, rootY: -12, bodyAngle: 18, bodyScaleX: 1.22, bodyScaleY: 0.90, crownAngle: 20, armFrontAngle: 42, armBackAngle: 28, expression: 'attack', subPhase: 'AttackExecute', groundLock: false }, ease: 'linear' },
      { t: 0.76, pose: { rootX: 10, rootY: 2, bodyScaleX: 1.16, bodyScaleY: 0.84, crownAngle: -10, subPhase: 'Recovery' }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyScaleX: 1, bodyScaleY: 1, expression: 'normal', subPhase: 'Recovery' }, ease: 'smooth' },
    ]);
  }

  // --- 4. PET CAT (달빛 턱시도 냥이) ---
  if (petId === 'pet_cat') {
    if (clipId === 'idle') {
      const p = defaultPetPose();
      p.bodyScaleY = 1 + sin * 0.025;
      p.headAngle = cos * 3.5;
      p.tail1Angle = sin * 20;
      p.armFrontAngle = -4 + sin * 5;
      p.subPhase = 'Idle';
      return p;
    }
    if (clipId === 'move') {
      const p = defaultPetPose();
      p.rootY = -Math.abs(sin) * 7;
      p.bodyAngle = 6;
      p.armFrontAngle = -sin * 36;
      p.legBackAngle = -sin * 36;
      p.armBackAngle = sin * 36;
      p.legFrontAngle = sin * 36;
      p.tail1Angle = -14 + cos * 16;
      p.subPhase = 'Move';
      return p;
    }
    // Attack: predatory crouch -> agile forward leap & paw swipe
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack', subPhase: 'AttackPrep' } },
      { t: 0.22, pose: { rootX: -8, rootY: 4, bodyAngle: 14, bodyScaleY: 0.90, headAngle: -10, tail1Angle: 28, armFrontAngle: -38, legBackAngle: 28, expression: 'attack', subPhase: 'AttackPrep' }, ease: 'smooth' },
      { t: 0.48, pose: { rootX: 30, rootY: -10, bodyAngle: -12, headAngle: 8, armFrontAngle: -88, armBackAngle: 36, legFrontAngle: -28, legBackAngle: -36, tail1Angle: -26, expression: 'attack', subPhase: 'AttackExecute', groundLock: false }, ease: 'linear' },
      { t: 0.78, pose: { rootX: 10, rootY: 0, bodyAngle: 5, armFrontAngle: -24, tail1Angle: 12, subPhase: 'Recovery' }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, expression: 'normal', subPhase: 'Recovery' }, ease: 'smooth' },
    ]);
  }

  // --- 5. PET DRAGON (아기 루비 드래곤) ---
  const wingFlap = Math.sin(t * Math.PI * 4);
  if (clipId === 'idle') {
    const p = defaultPetPose();
    p.rootY = -12 + sin * 6;
    p.bodyAngle = cos * 4;
    p.headAngle = -cos * 5;
    p.wingFrontAngle = wingFlap * 24;
    p.wingFrontScaleX = 0.65 + Math.abs(wingFlap) * 0.35;
    p.wingBackAngle = -wingFlap * 22;
    p.wingBackScaleX = 0.62 + Math.abs(wingFlap) * 0.36;
    p.tail1Angle = sin * 14;
    p.groundLock = false;
    p.subPhase = 'Idle';
    return p;
  }
  if (clipId === 'move') {
    const p = defaultPetPose();
    p.rootY = -14 + cos * 6;
    p.bodyAngle = 14;
    p.headAngle = -8;
    p.wingFrontAngle = wingFlap * 28;
    p.wingFrontScaleX = 0.58 + Math.abs(wingFlap) * 0.42;
    p.wingBackAngle = -wingFlap * 26;
    p.tail1Angle = -18 + sin * 12;
    p.groundLock = false;
    p.subPhase = 'Move';
    return p;
  }
  return sampleKeys(t, [
    { t: 0.00, pose: { rootY: -12, expression: 'attack', subPhase: 'AttackPrep', groundLock: false } },
    { t: 0.22, pose: { rootX: -6, rootY: -18, bodyAngle: -16, headAngle: -18, wingFrontAngle: -32, wingBackAngle: 30, tail1Angle: 20, expression: 'attack', subPhase: 'AttackPrep', groundLock: false }, ease: 'smooth' },
    { t: 0.48, pose: { rootX: 24, rootY: -12, bodyAngle: 18, headAngle: 16, wingFrontAngle: 34, wingBackAngle: -32, armFrontAngle: 42, tail1Angle: -22, expression: 'attack', subPhase: 'AttackExecute', groundLock: false }, ease: 'linear' },
    { t: 0.78, pose: { rootX: 8, rootY: -14, bodyAngle: 6, headAngle: 4, subPhase: 'Recovery', groundLock: false }, ease: 'smooth' },
    { t: 1.00, pose: { rootX: 0, rootY: -12, bodyAngle: 0, headAngle: 0, expression: 'normal', subPhase: 'Recovery', groundLock: false }, ease: 'smooth' },
  ]);
}

function matIdentity(): Mat2D { return [1, 0, 0, 1, 0, 0]; }
function matMul(m1: Mat2D, m2: Mat2D): Mat2D {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}
function matTranslate(m: Mat2D, tx: number, ty: number): Mat2D { return matMul(m, [1, 0, 0, 1, tx, ty]); }
function matRotateDeg(m: Mat2D, deg: number): Mat2D {
  const rad = deg * DEG_TO_RAD;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return matMul(m, [c, s, -s, c, 0, 0]);
}
function matScale(m: Mat2D, sx: number, sy: number): Mat2D { return matMul(m, [sx, 0, 0, sy, 0, 0]); }
function applyMatPoint(m: Mat2D, p: Vec2): Vec2 {
  return { x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] };
}

export function solvePetSkeleton(
  petId: PetRigId,
  pose: PetPose,
  groundX: number = PET_DEFAULT_CENTER_X,
  groundY: number = PET_DEFAULT_GROUND_Y,
  scale: number = 1.0
): SolvedPetFrame {
  const spec = PET_RIG_SPECS[petId];

  const evalFrame = (yOff: number): SolvedPetFrame => {
    let mRoot = matIdentity();
    mRoot = matTranslate(mRoot, groundX + pose.rootX * scale, groundY + (pose.rootY + yOff) * scale);
    mRoot = matScale(mRoot, scale, scale);

    const matrices: Partial<Record<PetPartId, Mat2D>> = {};
    let bodyCenter: Vec2 = { x: groundX, y: groundY - 32 };
    let attackOrigin: Vec2 = { x: groundX + 26, y: groundY - 34 };

    if (petId === 'pet_slime') {
      const mBodyPivot = matRotateDeg(matTranslate(mRoot, 0, -4), pose.bodyAngle);
      matrices.torso = matScale(mBodyPivot, pose.bodyScaleX, pose.bodyScaleY);
      const mFace = matTranslate(mBodyPivot, 5, -24 * pose.bodyScaleY);
      matrices.face = mFace;
      matrices.crown = matRotateDeg(matTranslate(mBodyPivot, 0, -52 * pose.bodyScaleY), pose.crownAngle);
      matrices.arm_back = matRotateDeg(matTranslate(mBodyPivot, -22 * pose.bodyScaleX, -22 * pose.bodyScaleY), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBodyPivot, 24 * pose.bodyScaleX, -22 * pose.bodyScaleY), pose.armFrontAngle);
      matrices.arm_front = mArmF;
      matrices.leg_back = matRotateDeg(matTranslate(mRoot, -16, -6), pose.legBackAngle);
      matrices.leg_front = matRotateDeg(matTranslate(mRoot, 16, -6), pose.legFrontAngle);
      bodyCenter = applyMatPoint(mFace, { x: 0, y: 0 });
      attackOrigin = applyMatPoint(mArmF, { x: 16, y: -4 });
    } else if (petId === 'pet_fairy') {
      const mBody = matRotateDeg(matTranslate(mRoot, 0, -24), pose.bodyAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.tail_1 = matRotateDeg(matTranslate(mBody, -10, -4), pose.tail1Angle);
      matrices.wing_back = matScale(matRotateDeg(matTranslate(mBody, -8, -28), pose.wingBackAngle), pose.wingBackScaleX, 1);
      matrices.wing_front = matScale(matRotateDeg(matTranslate(mBody, 4, -28), pose.wingFrontAngle), pose.wingFrontScaleX, 1);
      const mHead = matRotateDeg(matTranslate(mBody, 2, -32), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, 4, -18);
      matrices.arm_back = matRotateDeg(matTranslate(mBody, -10, -24), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBody, 12, -24), pose.armFrontAngle);
      matrices.arm_front = mArmF;
      bodyCenter = applyMatPoint(mBody, { x: 0, y: -18 });
      attackOrigin = applyMatPoint(mArmF, { x: 14, y: -2 });
    } else if (petId === 'pet_dragon') {
      const mBody = matRotateDeg(matTranslate(mRoot, -2, -24), pose.bodyAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.tail_1 = matRotateDeg(matTranslate(mBody, -18, -6), pose.tail1Angle);
      matrices.wing_back = matScale(matRotateDeg(matTranslate(mBody, -8, -26), pose.wingBackAngle), pose.wingBackScaleX, 1);
      matrices.wing_front = matScale(matRotateDeg(matTranslate(mBody, 6, -24), pose.wingFrontAngle), pose.wingFrontScaleX, 1);
      matrices.leg_back = matRotateDeg(matTranslate(mBody, -10, 0), pose.legBackAngle);
      matrices.leg_front = matRotateDeg(matTranslate(mBody, 10, 2), pose.legFrontAngle);
      matrices.arm_back = matRotateDeg(matTranslate(mBody, -4, -18), pose.armBackAngle);
      matrices.arm_front = matRotateDeg(matTranslate(mBody, 14, -18), pose.armFrontAngle);
      const mHead = matRotateDeg(matTranslate(mBody, 14, -30), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, 8, -14);
      bodyCenter = applyMatPoint(mBody, { x: 0, y: -16 });
      attackOrigin = applyMatPoint(mHead, { x: 28, y: -8 });
    } else {
      // pet_fox & pet_cat (quadruped facing right)
      const mBody = matRotateDeg(matTranslate(mRoot, -2, -28), pose.bodyAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.tail_1 = matRotateDeg(matTranslate(mBody, -20, -6), pose.tail1Angle);
      if (petId === 'pet_fox') {
        matrices.tail_2 = matRotateDeg(matTranslate(mBody, -22, -8), pose.tail2Angle);
        matrices.tail_3 = matRotateDeg(matTranslate(mBody, -18, -10), pose.tail3Angle);
      }
      matrices.leg_back = matRotateDeg(matTranslate(mBody, -16, 2), pose.legBackAngle);
      matrices.leg_front = matRotateDeg(matTranslate(mBody, -10, 4), pose.legFrontAngle);
      matrices.arm_back = matRotateDeg(matTranslate(mBody, 14, 2), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBody, 18, 4), pose.armFrontAngle);
      matrices.arm_front = mArmF;
      const mHead = matRotateDeg(matTranslate(mBody, 16, -12), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, 6, -12);
      bodyCenter = applyMatPoint(mBody, { x: 2, y: -4 });
      attackOrigin = petId === 'pet_cat'
        ? applyMatPoint(mArmF, { x: 14, y: 12 })
        : applyMatPoint(mHead, { x: 24, y: -6 });
    }

    return {
      matrices,
      drawOrder: spec.drawOrder,
      attachments: {
        bodyCenter,
        attackOrigin,
        groundContact: { x: groundX + pose.rootX * scale, y: groundY },
      },
      expression: pose.expression,
      subPhase: pose.subPhase ?? 'Idle',
    };
  };

  let solved = evalFrame(0);
  if (pose.groundLock && (petId === 'pet_fox' || petId === 'pet_cat' || petId === 'pet_slime')) {
    const legB = solved.matrices.leg_back;
    const legF = solved.matrices.leg_front;
    const soleY = petId === 'pet_slime' ? 8 : 22;
    let lowestY = -Infinity;
    if (legB) lowestY = Math.max(lowestY, applyMatPoint(legB, { x: 0, y: soleY }).y);
    if (legF) lowestY = Math.max(lowestY, applyMatPoint(legF, { x: 0, y: soleY }).y);
    if (lowestY > -Infinity) {
      const correction = (groundY - lowestY) / Math.max(0.1, scale);
      if (Math.abs(correction) > 0.3 && Math.abs(correction) < 25) {
        solved = evalFrame(correction);
      }
    }
  }
  return solved;
}
