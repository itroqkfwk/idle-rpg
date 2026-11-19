import { BossPatternType, Monster } from '../types/game';

export type MonsterArchetype =
  | 'slime'
  | 'mushroom'
  | 'flying'
  | 'spirit'
  | 'beast'
  | 'golem'
  | 'boss_c1'
  | 'boss_c2'
  | 'boss_c3'
  | 'boss_c4'
  | 'boss_c5';

export type MonsterRigId =
  | 'c1_m1' | 'c1_m2' | 'c1_m3' | 'c1_m4' | 'c1_boss'
  | 'c2_m1' | 'c2_m2' | 'c2_m3' | 'c2_boss'
  | 'c3_m1' | 'c3_m2' | 'c3_boss'
  | 'c4_m1' | 'c4_m2' | 'c4_m3' | 'c4_m4' | 'c4_boss'
  | 'c5_m1' | 'c5_m2' | 'c5_m3' | 'c5_m4' | 'c5_boss'
  | 'dg_gold' | 'dg_ruins';

export type MonsterRigState =
  | 'Idle'
  | 'Move'
  | 'AttackPrep'
  | 'Attack'
  | 'SpecialAttack'
  | 'Phase2Transition'
  | 'Hit1'
  | 'Hit2'
  | 'Hit3'
  | 'CC'
  | 'Defeat';

export type MonsterPartId =
  | 'shadow_aura'
  | 'halo'
  | 'wing_back'
  | 'wing_front'
  | 'tail'
  | 'cape'
  | 'leg_back'
  | 'leg_front'
  | 'arm_back'
  | 'torso'
  | 'face'
  | 'head'
  | 'crown'
  | 'arm_front'
  | 'weapon';

export type Mat2D = [number, number, number, number, number, number];

export interface Vec2 {
  x: number;
  y: number;
}

export interface MonsterPartSpec {
  id: MonsterPartId;
  file: string;
  w: number;
  h: number;
  pivotX: number;
  pivotY: number;
  exportScale: number;
}

export interface MonsterRigSpec {
  rigId: MonsterRigId;
  archetype: MonsterArchetype;
  isBoss: boolean;
  canonicalW: number;
  canonicalH: number;
  centerX: number;
  groundY: number;
  parts: Partial<Record<MonsterPartId, MonsterPartSpec>>;
  drawOrder: MonsterPartId[];
  sourcePng?: string;
}

export interface MonsterPose {
  rootX: number;
  rootY: number;
  rootAlpha: number;
  bodyAngle: number;
  bodyScaleX: number;
  bodyScaleY: number;
  headAngle: number;
  crownAngle: number;
  tailAngle: number;
  capeAngle: number;
  haloAngle: number;
  haloScale: number;
  wingBackAngle: number;
  wingBackScaleX: number;
  wingFrontAngle: number;
  wingFrontScaleX: number;
  armBackX: number;
  armBackY: number;
  armBackAngle: number;
  armFrontX: number;
  armFrontY: number;
  armFrontAngle: number;
  weaponAngle: number;
  weaponScale: number;
  legBackAngle: number;
  legFrontAngle: number;
  hitFlashAlpha: number;
  groundLock: boolean;
  expression: 'normal' | 'hit' | 'attack';
}

export interface MonsterAttachmentPoints {
  bodyCenter: Vec2;
  headCenter: Vec2;
  attackOrigin: Vec2;
  groundContact: Vec2;
}

export interface SolvedMonsterFrame {
  matrices: Partial<Record<MonsterPartId, Mat2D>>;
  drawOrder: MonsterPartId[];
  attachments: MonsterAttachmentPoints;
  rootAlpha: number;
  hitFlashAlpha: number;
  expression: 'normal' | 'hit' | 'attack';
}

export type MonsterClipId =
  | 'idle'
  | 'move'
  | 'attack'
  | 'attack_prep'
  | 'special_attack'
  | 'phase2_transition'
  | 'hit_1'
  | 'hit_2'
  | 'hit_3'
  | 'cc_frozen'
  | 'defeat';

export interface MonsterClipMeta {
  id: MonsterClipId;
  durationMs: number;
  loop: boolean;
}

export const MONSTER_CLIP_CATALOG: Record<MonsterClipId, MonsterClipMeta> = {
  idle: { id: 'idle', durationMs: 1800, loop: true },
  move: { id: 'move', durationMs: 620, loop: true },
  attack: { id: 'attack', durationMs: 320, loop: false },
  attack_prep: { id: 'attack_prep', durationMs: 780, loop: false },
  special_attack: { id: 'special_attack', durationMs: 420, loop: false },
  phase2_transition: { id: 'phase2_transition', durationMs: 680, loop: false },
  hit_1: { id: 'hit_1', durationMs: 170, loop: false },
  hit_2: { id: 'hit_2', durationMs: 220, loop: false },
  hit_3: { id: 'hit_3', durationMs: 300, loop: false },
  cc_frozen: { id: 'cc_frozen', durationMs: 800, loop: true },
  defeat: { id: 'defeat', durationMs: 400, loop: false },
};

export const MONSTER_EXPORT_SCALE = 2;

const RIG_META: Record<MonsterRigId, { archetype: MonsterArchetype; isBoss: boolean; sourcePng?: string }> = {
  c1_m1:   { archetype: 'slime',    isBoss: false, sourcePng: './assets/monster_slime.png' },
  c1_m2:   { archetype: 'mushroom', isBoss: false, sourcePng: './assets/monster_mushroom.png' },
  c1_m3:   { archetype: 'flying',   isBoss: false, sourcePng: './assets/monster_bee.png' },
  c1_m4:   { archetype: 'spirit',   isBoss: false, sourcePng: './assets/monster_spirit.png' },
  c1_boss: { archetype: 'boss_c1',  isBoss: true,  sourcePng: './assets/boss_golem.png' },

  c2_m1:   { archetype: 'spirit',   isBoss: false, sourcePng: './assets/ch4_spirit.png' },
  c2_m2:   { archetype: 'slime',    isBoss: false },
  c2_m3:   { archetype: 'mushroom', isBoss: false },
  c2_boss: { archetype: 'boss_c2',  isBoss: true },

  c3_m1:   { archetype: 'slime',    isBoss: false },
  c3_m2:   { archetype: 'beast',    isBoss: false, sourcePng: './assets/pet_fox.png' },
  c3_boss: { archetype: 'boss_c3',  isBoss: true },

  c4_m1:   { archetype: 'slime',    isBoss: false, sourcePng: './assets/ch4_slime.png' },
  c4_m2:   { archetype: 'spirit',   isBoss: false, sourcePng: './assets/ch4_spirit.png' },
  c4_m3:   { archetype: 'beast',    isBoss: false, sourcePng: './assets/ch4_wolf.png' },
  c4_m4:   { archetype: 'golem',    isBoss: false, sourcePng: './assets/ch4_golem.png' },
  c4_boss: { archetype: 'boss_c4',  isBoss: true,  sourcePng: './assets/ch4_boss.png' },

  c5_m1:   { archetype: 'slime',    isBoss: false, sourcePng: './assets/ch5_slime.png' },
  c5_m2:   { archetype: 'flying',   isBoss: false, sourcePng: './assets/ch5_butterfly.png' },
  c5_m3:   { archetype: 'beast',    isBoss: false, sourcePng: './assets/ch5_fox.png' },
  c5_m4:   { archetype: 'golem',    isBoss: false, sourcePng: './assets/ch5_golem.png' },
  c5_boss: { archetype: 'boss_c5',  isBoss: true,  sourcePng: './assets/ch5_boss.png' },

  dg_gold:  { archetype: 'spirit',  isBoss: false },
  dg_ruins: { archetype: 'boss_c1', isBoss: true, sourcePng: './assets/boss_golem.png' },
};

export const ALL_MONSTER_RIG_IDS = Object.keys(RIG_META) as MonsterRigId[];

export function resolveMonsterRigId(monster: Pick<Monster, 'id' | 'name' | 'isBoss'>): MonsterRigId {
  const id = monster.id || '';
  if (id in RIG_META) return id as MonsterRigId;
  if (id.startsWith('dg_gold_')) return 'dg_gold';
  if (id.startsWith('dg_ruins_')) return 'dg_ruins';
  if (id.startsWith('dg_exp_')) {
    if (id.includes('_w2')) return 'c1_m2';
    if (id.includes('_w3')) return 'c2_m3';
    if (id.includes('_w4')) return 'c4_m3';
    if (id.includes('_w5')) return 'c4_m4';
    return 'c1_m1';
  }
  if (monster.isBoss) return 'c1_boss';
  if (monster.name.includes('버섯')) return 'c1_m2';
  if (monster.name.includes('벌')) return 'c1_m3';
  if (monster.name.includes('정령') || monster.name.includes('요정')) return 'c1_m4';
  if (monster.name.includes('늑대') || monster.name.includes('여우')) return 'c4_m3';
  if (monster.name.includes('골렘')) return 'c4_m4';
  return 'c1_m1';
}

export const MONSTER_CANONICAL_W = 260;
export const MONSTER_CANONICAL_H = 260;
export const MONSTER_BOSS_CANONICAL_W = 320;
export const MONSTER_BOSS_CANONICAL_H = 310;

function sp(id: MonsterPartId, file: string, w: number, h: number, pivotX: number, pivotY: number): MonsterPartSpec {
  return { id, file, w, h, pivotX, pivotY, exportScale: MONSTER_EXPORT_SCALE };
}

function buildRigSpec(rigId: MonsterRigId): MonsterRigSpec {
  const meta = RIG_META[rigId];
  const arch = meta.archetype;
  const isBoss = meta.isBoss;
  const canonicalW = isBoss ? MONSTER_BOSS_CANONICAL_W : MONSTER_CANONICAL_W;
  const canonicalH = isBoss ? MONSTER_BOSS_CANONICAL_H : MONSTER_CANONICAL_H;
  const centerX = isBoss ? 172 : 134;
  const groundY = isBoss ? 286 : 236;

  if (arch === 'slime') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        leg_back: sp('leg_back', 'leg_back.png', 32, 24, 16, 6),
        leg_front: sp('leg_front', 'leg_front.png', 32, 24, 16, 6),
        torso: sp('torso', 'torso.png', 132, 114, 66, 102),
        face: sp('face', 'face.png', 96, 56, 48, 28),
        arm_back: sp('arm_back', 'arm_back.png', 30, 34, 15, 8),
        arm_front: sp('arm_front', 'arm_front.png', 30, 34, 15, 8),
        crown: sp('crown', 'crown.png', 94, 72, 47, 62),
      },
      drawOrder: ['leg_back', 'arm_back', 'leg_front', 'torso', 'face', 'crown', 'arm_front'],
    };
  }

  if (arch === 'mushroom') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        leg_back: sp('leg_back', 'leg_back.png', 32, 30, 16, 6),
        leg_front: sp('leg_front', 'leg_front.png', 32, 30, 16, 6),
        arm_back: sp('arm_back', 'arm_back.png', 34, 34, 24, 10),
        torso: sp('torso', 'torso.png', 92, 92, 46, 80),
        face: sp('face', 'face.png', 74, 44, 37, 22),
        crown: sp('crown', 'crown.png', 148, 92, 74, 78),
        arm_front: sp('arm_front', 'arm_front.png', 34, 34, 10, 10),
      },
      drawOrder: ['leg_back', 'arm_back', 'leg_front', 'torso', 'face', 'crown', 'arm_front'],
    };
  }

  if (arch === 'flying') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        wing_back: sp('wing_back', 'wing_back.png', 92, 118, 74, 66),
        tail: sp('tail', 'tail.png', 74, 72, 36, 12),
        leg_back: sp('leg_back', 'leg_back.png', 36, 40, 18, 6),
        torso: sp('torso', 'torso.png', 76, 82, 38, 66),
        arm_back: sp('arm_back', 'arm_back.png', 28, 34, 20, 8),
        head: sp('head', 'head.png', 88, 86, 44, 72),
        face: sp('face', 'face.png', 66, 44, 33, 22),
        arm_front: sp('arm_front', 'arm_front.png', 28, 34, 10, 8),
        wing_front: sp('wing_front', 'wing_front.png', 92, 118, 18, 66),
      },
      drawOrder: ['wing_back', 'wing_front', 'tail', 'leg_back', 'arm_back', 'torso', 'head', 'face', 'arm_front'],
    };
  }

  if (arch === 'spirit') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        halo: sp('halo', 'halo.png', 120, 120, 60, 60),
        wing_back: sp('wing_back', 'wing_back.png', 72, 92, 12, 48),
        tail: sp('tail', 'tail.png', 68, 78, 34, 12),
        arm_back: sp('arm_back', 'arm_back.png', 38, 42, 19, 21),
        torso: sp('torso', 'torso.png', 96, 104, 48, 56),
        face: sp('face', 'face.png', 68, 42, 34, 21),
        crown: sp('crown', 'crown.png', 78, 46, 39, 36),
        wing_front: sp('wing_front', 'wing_front.png', 72, 92, 60, 48),
        arm_front: sp('arm_front', 'arm_front.png', 38, 42, 19, 21),
      },
      drawOrder: ['halo', 'wing_back', 'wing_front', 'tail', 'arm_back', 'torso', 'face', 'crown', 'arm_front'],
    };
  }

  if (arch === 'beast') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        tail: sp('tail', 'tail.png', 96, 98, 16, 72),
        leg_back: sp('leg_back', 'leg_back.png', 52, 62, 26, 12),
        arm_back: sp('arm_back', 'arm_back.png', 48, 64, 24, 12),
        torso: sp('torso', 'torso.png', 128, 78, 64, 46),
        leg_front: sp('leg_front', 'leg_front.png', 54, 64, 27, 12),
        arm_front: sp('arm_front', 'arm_front.png', 50, 66, 25, 12),
        head: sp('head', 'head.png', 96, 92, 56, 62),
        face: sp('face', 'face.png', 66, 46, 33, 23),
      },
      drawOrder: ['tail', 'leg_back', 'arm_back', 'torso', 'leg_front', 'arm_front', 'head', 'face'],
    };
  }

  if (arch === 'golem') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        leg_back: sp('leg_back', 'leg_back.png', 46, 68, 23, 12),
        arm_back: sp('arm_back', 'arm_back.png', 62, 104, 34, 20),
        leg_front: sp('leg_front', 'leg_front.png', 48, 70, 24, 12),
        torso: sp('torso', 'torso.png', 112, 98, 56, 80),
        head: sp('head', 'head.png', 74, 70, 37, 56),
        face: sp('face', 'face.png', 50, 32, 25, 16),
        arm_front: sp('arm_front', 'arm_front.png', 66, 108, 30, 20),
      },
      drawOrder: ['leg_back', 'arm_back', 'leg_front', 'torso', 'head', 'face', 'arm_front'],
    };
  }

  // Boss archetypes: boss_c1, boss_c2, boss_c3, boss_c4, boss_c5
  if (arch === 'boss_c4' || arch === 'boss_c5') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        halo: sp('halo', 'halo.png', 164, 164, 82, 82),
        cape: sp('cape', 'cape.png', 180, 170, 90, 24),
        leg_back: sp('leg_back', 'leg_back.png', 48, 86, 24, 12),
        arm_back: sp('arm_back', 'arm_back.png', 62, 106, 36, 18),
        leg_front: sp('leg_front', 'leg_front.png', 50, 88, 25, 12),
        torso: sp('torso', 'torso.png', 122, 108, 61, 88),
        head: sp('head', 'head.png', 82, 86, 41, 70),
        face: sp('face', 'face.png', 54, 34, 27, 17),
        weapon: sp('weapon', 'weapon.png', 74, 208, 37, 152),
        arm_front: sp('arm_front', 'arm_front.png', 64, 108, 28, 18),
      },
      drawOrder: ['halo', 'cape', 'leg_back', 'arm_back', 'leg_front', 'torso', 'head', 'face', 'weapon', 'arm_front'],
    };
  }

  if (arch === 'boss_c2') {
    return {
      rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
      sourcePng: meta.sourcePng,
      parts: {
        wing_back: sp('wing_back', 'wing_back.png', 112, 128, 18, 84),
        tail: sp('tail', 'tail.png', 124, 106, 22, 72),
        leg_back: sp('leg_back', 'leg_back.png', 52, 78, 26, 12),
        arm_back: sp('arm_back', 'arm_back.png', 68, 108, 38, 20),
        leg_front: sp('leg_front', 'leg_front.png', 54, 80, 27, 12),
        torso: sp('torso', 'torso.png', 132, 114, 66, 92),
        head: sp('head', 'head.png', 102, 98, 56, 74),
        face: sp('face', 'face.png', 64, 38, 32, 19),
        wing_front: sp('wing_front', 'wing_front.png', 112, 128, 18, 84),
        arm_front: sp('arm_front', 'arm_front.png', 70, 112, 30, 20),
      },
      drawOrder: ['wing_back', 'wing_front', 'tail', 'leg_back', 'arm_back', 'leg_front', 'torso', 'head', 'face', 'arm_front'],
    };
  }

  // boss_c1 & boss_c3: Heavy Titan Colossus
  return {
    rigId, archetype: arch, isBoss, canonicalW, canonicalH, centerX, groundY,
    sourcePng: meta.sourcePng,
    parts: {
      halo: sp('halo', 'halo.png', 150, 150, 75, 75),
      leg_back: sp('leg_back', 'leg_back.png', 56, 82, 28, 14),
      arm_back: sp('arm_back', 'arm_back.png', 78, 126, 44, 22),
      leg_front: sp('leg_front', 'leg_front.png', 58, 84, 29, 14),
      torso: sp('torso', 'torso.png', 148, 120, 74, 98),
      head: sp('head', 'head.png', 88, 82, 44, 68),
      face: sp('face', 'face.png', 58, 34, 29, 17),
      arm_front: sp('arm_front', 'arm_front.png', 82, 130, 34, 22),
    },
    drawOrder: ['halo', 'leg_back', 'arm_back', 'leg_front', 'torso', 'head', 'face', 'arm_front'],
  };
}

export const MONSTER_RIG_SPECS: Record<MonsterRigId, MonsterRigSpec> = ALL_MONSTER_RIG_IDS.reduce((acc, id) => {
  acc[id] = buildRigSpec(id);
  return acc;
}, {} as Record<MonsterRigId, MonsterRigSpec>);

// ============================================================================
// Pose Evaluation (Archetype-Differentiated + 5 Boss Pattern Differentiation)
// ============================================================================

const DEG_TO_RAD = Math.PI / 180;
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function defaultMonsterPose(): MonsterPose {
  return {
    rootX: 0, rootY: 0, rootAlpha: 1,
    bodyAngle: 0, bodyScaleX: 1, bodyScaleY: 1,
    headAngle: 0, crownAngle: 0, tailAngle: 0, capeAngle: 0,
    haloAngle: 0, haloScale: 1,
    wingBackAngle: 0, wingBackScaleX: 1,
    wingFrontAngle: 0, wingFrontScaleX: 1,
    armBackX: 0, armBackY: 0, armBackAngle: 0,
    armFrontX: 0, armFrontY: 0, armFrontAngle: 0,
    weaponAngle: -42, weaponScale: 1,
    legBackAngle: 0, legFrontAngle: 0,
    hitFlashAlpha: 0, groundLock: true, expression: 'normal',
  };
}

interface Key { t: number; pose: Partial<MonsterPose>; ease?: 'linear' | 'smooth'; }

function sampleKeys(tRaw: number, keys: Key[]): MonsterPose {
  const t = Math.max(0, Math.min(1, tRaw));
  const base = defaultMonsterPose();
  let p = keys[0];
  let n = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) { p = keys[i]; n = keys[i + 1]; break; }
  }
  const span = Math.max(0.0001, n.t - p.t);
  const localT = (t - p.t) / span;
  const k = n.ease === 'linear' ? localT : easeInOut(localT);
  const out: MonsterPose = { ...base };
  const numKeys: (keyof MonsterPose)[] = [
    'rootX', 'rootY', 'rootAlpha', 'bodyAngle', 'bodyScaleX', 'bodyScaleY',
    'headAngle', 'crownAngle', 'tailAngle', 'capeAngle', 'haloAngle', 'haloScale',
    'wingBackAngle', 'wingBackScaleX', 'wingFrontAngle', 'wingFrontScaleX',
    'armBackX', 'armBackY', 'armBackAngle', 'armFrontX', 'armFrontY', 'armFrontAngle',
    'weaponAngle', 'weaponScale', 'legBackAngle', 'legFrontAngle', 'hitFlashAlpha',
  ];
  for (const prop of numKeys) {
    const a = (p.pose[prop] as number | undefined) ?? (base[prop] as number);
    const b = (n.pose[prop] as number | undefined) ?? (base[prop] as number);
    (out[prop] as number) = lerp(a, b, k);
  }
  out.groundLock = k < 0.5 ? (p.pose.groundLock ?? true) : (n.pose.groundLock ?? true);
  out.expression = k < 0.5 ? (p.pose.expression ?? 'normal') : (n.pose.expression ?? 'normal');
  return out;
}

export function resolveMonsterClipId(state: MonsterRigState): MonsterClipId {
  switch (state) {
    case 'Move': return 'move';
    case 'AttackPrep': return 'attack_prep';
    case 'Attack': return 'attack';
    case 'SpecialAttack': return 'special_attack';
    case 'Phase2Transition': return 'phase2_transition';
    case 'Hit1': return 'hit_1';
    case 'Hit2': return 'hit_2';
    case 'Hit3': return 'hit_3';
    case 'CC': return 'cc_frozen';
    case 'Defeat': return 'defeat';
    default: return 'idle';
  }
}

export function evaluateMonsterClipPose(
  archetype: MonsterArchetype,
  clipId: MonsterClipId,
  tNorm: number,
  options?: { bossPattern?: BossPatternType | null; bossPhase?: 1 | 2 }
): MonsterPose {
  const isLoop = MONSTER_CLIP_CATALOG[clipId]?.loop ?? false;
  const t = isLoop ? ((tNorm % 1) + 1) % 1 : Math.max(0, Math.min(1, tNorm));
  const phase = t * Math.PI * 2;
  const sin = Math.sin(phase);
  const cos = Math.cos(phase);
  const isBossArch = archetype.startsWith('boss_') || archetype === 'golem';
  const pattern = options?.bossPattern ?? null;
  const bossPhase = options?.bossPhase ?? 1;

  // --- CC Frozen / Stunned ---
  if (clipId === 'cc_frozen') {
    const pose = defaultMonsterPose();
    pose.rootX = Math.sin(t * Math.PI * 6) * 0.8;
    pose.bodyAngle = 2;
    pose.expression = 'hit';
    pose.wingBackScaleX = 0.85;
    pose.wingFrontScaleX = 0.85;
    return pose;
  }

  // --- HIT 1 / HIT 2 / HIT 3 (Weighted by Monster Mass: Boss/Golem low knockback!) ---
  if (clipId === 'hit_1' || clipId === 'hit_2' || clipId === 'hit_3') {
    const heavyScale = isBossArch ? 0.38 : 1.0;
    const kx = (clipId === 'hit_3' ? 20 : clipId === 'hit_2' ? 12 : 7) * heavyScale;
    const tilt = (clipId === 'hit_3' ? 16 : clipId === 'hit_2' ? 10 : 5) * (isBossArch ? 0.45 : 1.0);
    const squashX = archetype === 'slime' ? (clipId === 'hit_3' ? 1.24 : 1.14) : (isBossArch ? 1.05 : 1.10);
    const squashY = archetype === 'slime' ? (clipId === 'hit_3' ? 0.78 : 0.86) : (isBossArch ? 0.95 : 0.90);
    return sampleKeys(t, [
      { t: 0.00, pose: { rootX: 0, hitFlashAlpha: 0.85, expression: 'hit' } },
      { t: 0.28, pose: { rootX: kx, rootY: clipId === 'hit_3' ? (isBossArch ? -2 : -8) : 0, bodyAngle: tilt, bodyScaleX: squashX, bodyScaleY: squashY, headAngle: tilt * 1.1, crownAngle: -tilt * 1.3, tailAngle: 18, armBackAngle: -32, armFrontAngle: 36, weaponAngle: -28, legBackAngle: 12, legFrontAngle: -10, hitFlashAlpha: 0.92, expression: 'hit', groundLock: !isBossArch && clipId === 'hit_3' ? false : true }, ease: 'smooth' },
      { t: 0.65, pose: { rootX: kx * 0.35, bodyAngle: -tilt * 0.3, bodyScaleX: 0.97, bodyScaleY: 1.03, armBackAngle: 8, armFrontAngle: -8, hitFlashAlpha: 0.15, expression: 'hit' }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, bodyAngle: 0, bodyScaleX: 1, bodyScaleY: 1, hitFlashAlpha: 0, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  // --- DEFEAT (Archetype-specific Collapse / Dispersal / Fall) ---
  if (clipId === 'defeat') {
    if (archetype === 'flying') {
      return sampleKeys(t, [
        { t: 0.00, pose: { rootY: -18, wingBackScaleX: 0.8, wingFrontScaleX: 0.8, expression: 'hit', groundLock: false } },
        { t: 0.35, pose: { rootX: 12, rootY: -4, bodyAngle: 28, wingBackAngle: 36, wingFrontAngle: 42, wingBackScaleX: 0.45, wingFrontScaleX: 0.45, expression: 'hit', rootAlpha: 0.9, groundLock: false }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 18, rootY: 18, bodyAngle: 68, bodyScaleX: 0.85, bodyScaleY: 0.65, wingBackAngle: 64, wingFrontAngle: 68, rootAlpha: 0, expression: 'hit', groundLock: false }, ease: 'smooth' },
      ]);
    }
    if (archetype === 'spirit') {
      return sampleKeys(t, [
        { t: 0.00, pose: { rootY: -14, expression: 'hit', groundLock: false } },
        { t: 0.40, pose: { rootX: 8, rootY: -22, bodyScaleX: 1.22, bodyScaleY: 0.72, haloScale: 1.4, armBackX: -18, armFrontX: 18, tailAngle: 26, rootAlpha: 0.7, groundLock: false }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 10, rootY: -36, bodyScaleX: 0.3, bodyScaleY: 0.25, haloScale: 1.85, armBackX: -36, armFrontX: 36, rootAlpha: 0, groundLock: false }, ease: 'smooth' },
      ]);
    }
    if (archetype === 'slime' || archetype === 'mushroom') {
      return sampleKeys(t, [
        { t: 0.00, pose: { expression: 'hit' } },
        { t: 0.38, pose: { rootX: 10, bodyAngle: archetype === 'mushroom' ? 28 : 8, bodyScaleX: 1.32, bodyScaleY: 0.54, crownAngle: 34, armFrontAngle: 45, rootAlpha: 0.85 }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 14, bodyAngle: archetype === 'mushroom' ? 68 : 12, bodyScaleX: 1.56, bodyScaleY: 0.22, crownAngle: 72, rootAlpha: 0 }, ease: 'smooth' },
      ]);
    }
    // Golem / Beast / Boss heavy crumble
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'hit' } },
      { t: 0.42, pose: { rootX: 10, rootY: 10, bodyAngle: 18, headAngle: 22, armBackAngle: 46, armFrontAngle: 52, weaponAngle: 42, legBackAngle: 34, legFrontAngle: -28, rootAlpha: 0.85, groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 16, rootY: 34, bodyAngle: 42, bodyScaleY: 0.62, headAngle: 35, armBackAngle: 78, armFrontAngle: 84, weaponAngle: 78, rootAlpha: 0, groundLock: false }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 1: SLIME ---
  if (archetype === 'slime') {
    if (clipId === 'idle') {
      const p = defaultMonsterPose();
      p.bodyScaleX = 1 + sin * 0.07;
      p.bodyScaleY = 1 - sin * 0.06;
      p.crownAngle = Math.cos(phase - 0.6) * 8;
      p.armBackAngle = -8 + sin * 10;
      p.armFrontAngle = 8 - sin * 10;
      return p;
    }
    if (clipId === 'move') {
      return sampleKeys(t, [
        { t: 0.00, pose: { bodyScaleX: 1.12, bodyScaleY: 0.88, legBackAngle: 12, legFrontAngle: -10 } },
        { t: 0.35, pose: { rootX: -10, rootY: -22, bodyScaleX: 0.90, bodyScaleY: 1.12, crownAngle: 12, legBackAngle: 26, legFrontAngle: -24, groundLock: false }, ease: 'smooth' },
        { t: 0.72, pose: { rootX: -4, rootY: 2, bodyScaleX: 1.16, bodyScaleY: 0.84, crownAngle: -10 }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 0, rootY: 0, bodyScaleX: 1.04, bodyScaleY: 0.96 }, ease: 'smooth' },
      ]);
    }
    // Slime attack: Rearward compression coil -> Forward bouncy lunge -> Landing squash
    return sampleKeys(t, [
      { t: 0.00, pose: { bodyScaleX: 1, bodyScaleY: 1, expression: 'attack' } },
      { t: 0.25, pose: { rootX: 10, bodyAngle: 10, bodyScaleX: 1.18, bodyScaleY: 0.80, crownAngle: 16, armFrontAngle: 28, expression: 'attack' }, ease: 'smooth' },
      { t: 0.52, pose: { rootX: -42, rootY: -18, bodyAngle: -18, bodyScaleX: 0.92, bodyScaleY: 1.12, crownAngle: -18, armFrontAngle: -46, armBackAngle: -32, expression: 'attack', groundLock: false }, ease: 'linear' },
      { t: 0.80, pose: { rootX: -12, rootY: 0, bodyScaleX: 1.14, bodyScaleY: 0.86, crownAngle: 12 }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyScaleX: 1, bodyScaleY: 1, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 2: MUSHROOM / SHELL CRITTER ---
  if (archetype === 'mushroom') {
    if (clipId === 'idle') {
      const p = defaultMonsterPose();
      p.bodyScaleY = 1 + sin * 0.03;
      p.bodyAngle = cos * 2.5;
      p.crownAngle = -cos * 5;
      p.armBackAngle = -10 + sin * 9;
      p.armFrontAngle = 10 - sin * 9;
      return p;
    }
    if (clipId === 'move') {
      const p = defaultMonsterPose();
      p.rootY = -Math.abs(sin) * 8;
      p.bodyAngle = sin * 6;
      p.crownAngle = -sin * 9;
      p.legBackAngle = sin * 32;
      p.legFrontAngle = -sin * 32;
      p.armBackAngle = -sin * 26;
      p.armFrontAngle = sin * 26;
      return p;
    }
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack' } },
      { t: 0.26, pose: { rootX: 8, bodyAngle: 14, crownAngle: 18, bodyScaleY: 0.90, legBackAngle: 22, legFrontAngle: -18, expression: 'attack' }, ease: 'smooth' },
      { t: 0.50, pose: { rootX: -36, rootY: -8, bodyAngle: -24, crownAngle: -22, armFrontAngle: -56, armBackAngle: -42, legBackAngle: 34, legFrontAngle: -30, expression: 'attack', groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, bodyAngle: 0, crownAngle: 0, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 3: FLYING (BEE / STAINED-GLASS BUTTERFLY) ---
  if (archetype === 'flying') {
    const fastFlap = Math.sin(t * Math.PI * 8);
    if (clipId === 'idle') {
      const p = defaultMonsterPose();
      p.rootY = -18 + sin * 7;
      p.bodyAngle = -3 + cos * 3.5;
      p.headAngle = -cos * 3;
      p.wingFrontAngle = fastFlap * 24;
      p.wingFrontScaleX = 0.62 + Math.abs(fastFlap) * 0.38;
      p.wingBackAngle = -fastFlap * 22;
      p.wingBackScaleX = 0.58 + Math.abs(fastFlap) * 0.40;
      p.tailAngle = Math.sin(phase - 0.7) * 14;
      p.armBackAngle = 10 + sin * 8;
      p.armFrontAngle = -10 - sin * 8;
      p.groundLock = false;
      return p;
    }
    if (clipId === 'move') {
      const p = defaultMonsterPose();
      p.rootX = -6 + sin * 8;
      p.rootY = -20 + cos * 9;
      p.bodyAngle = -10 + sin * 4;
      p.wingFrontAngle = fastFlap * 28;
      p.wingFrontScaleX = 0.55 + Math.abs(fastFlap) * 0.45;
      p.wingBackAngle = -fastFlap * 26;
      p.wingBackScaleX = 0.52 + Math.abs(fastFlap) * 0.44;
      p.tailAngle = 18 + Math.sin(phase - 0.5) * 16;
      p.groundLock = false;
      return p;
    }
    return sampleKeys(t, [
      { t: 0.00, pose: { rootY: -18, wingFrontScaleX: 0.85, wingBackScaleX: 0.85, expression: 'attack', groundLock: false } },
      { t: 0.28, pose: { rootX: 12, rootY: -30, bodyAngle: 10, wingFrontAngle: -28, wingBackAngle: 28, armFrontAngle: -54, armBackAngle: -48, expression: 'attack', groundLock: false }, ease: 'smooth' },
      { t: 0.54, pose: { rootX: -40, rootY: -14, bodyAngle: -20, wingFrontAngle: 32, wingBackAngle: -32, armFrontAngle: -88, armBackAngle: -72, expression: 'attack', groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: -18, bodyAngle: 0, wingFrontAngle: 0, wingBackAngle: 0, expression: 'normal', groundLock: false }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 4: ELEMENTAL SPIRIT ---
  if (archetype === 'spirit') {
    if (clipId === 'idle') {
      const p = defaultMonsterPose();
      p.rootY = -16 + sin * 8;
      p.bodyAngle = cos * 3.5;
      p.tailAngle = Math.sin(phase - 0.9) * 18;
      p.haloAngle = t * 360;
      p.armBackX = Math.cos(phase) * 5;
      p.armBackY = Math.sin(phase) * 7;
      p.armFrontX = -Math.cos(phase) * 5;
      p.armFrontY = -Math.sin(phase) * 7;
      p.crownAngle = cos * 6;
      p.groundLock = false;
      return p;
    }
    if (clipId === 'move') {
      const p = defaultMonsterPose();
      p.rootY = -18 + sin * 6;
      p.bodyAngle = -11 + cos * 3;
      p.tailAngle = 22 + Math.sin(phase - 0.6) * 18;
      p.haloAngle = t * 360;
      p.armBackY = -4 + sin * 6;
      p.armFrontY = 4 - sin * 6;
      p.groundLock = false;
      return p;
    }
    return sampleKeys(t, [
      { t: 0.00, pose: { rootY: -16, haloScale: 1, expression: 'attack', groundLock: false } },
      { t: 0.28, pose: { rootX: 10, rootY: -24, bodyAngle: 8, haloScale: 1.24, armBackX: -12, armBackY: -8, armFrontX: -10, armFrontY: -8, tailAngle: 20, expression: 'attack', groundLock: false }, ease: 'smooth' },
      { t: 0.56, pose: { rootX: -32, rootY: -14, bodyAngle: -16, haloScale: 1.45, armBackX: -28, armFrontX: -32, tailAngle: -18, expression: 'attack', groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: -16, haloScale: 1, expression: 'normal', groundLock: false }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 5: QUADRUPED BEAST (WOLF / FOX) ---
  if (archetype === 'beast') {
    if (clipId === 'idle') {
      const p = defaultMonsterPose();
      p.bodyScaleY = 1 + sin * 0.025;
      p.headAngle = sin * 4;
      p.tailAngle = Math.sin(phase - 0.4) * 14;
      p.armFrontAngle = sin * 3;
      p.legBackAngle = -sin * 3;
      return p;
    }
    if (clipId === 'move') {
      const p = defaultMonsterPose();
      p.rootY = -Math.abs(sin) * 10;
      p.bodyAngle = -4 + Math.cos(phase * 2) * 4;
      p.headAngle = 4 - Math.cos(phase * 2) * 4;
      p.tailAngle = Math.sin(phase - 0.5) * 18;
      p.armFrontAngle = sin * 34;
      p.legBackAngle = sin * 34;
      p.armBackAngle = -sin * 34;
      p.legFrontAngle = -sin * 34;
      return p;
    }
    // Wolf/Fox: Low pounce crouch -> Airborne leap slash -> Land & recover
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack' } },
      { t: 0.24, pose: { rootX: 12, rootY: 6, bodyAngle: -8, headAngle: 10, bodyScaleY: 0.90, tailAngle: 24, armFrontAngle: 36, armBackAngle: 30, legFrontAngle: -32, legBackAngle: -36, expression: 'attack' }, ease: 'smooth' },
      { t: 0.50, pose: { rootX: -48, rootY: -22, bodyAngle: 12, headAngle: -8, armFrontAngle: -54, armBackAngle: -44, legFrontAngle: 42, legBackAngle: 48, tailAngle: -16, expression: 'attack', groundLock: false }, ease: 'linear' },
      { t: 0.80, pose: { rootX: -14, rootY: 2, bodyAngle: -6, armFrontAngle: 14, legBackAngle: -12 }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, headAngle: 0, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  // --- ARCHETYPE 6 & 7: GOLEM & CHAPTER 1~5 BOSSES ---
  if (clipId === 'phase2_transition') {
    const p2Angle = archetype === 'boss_c5' ? -154 : -138;
    return sampleKeys(t, [
      { t: 0.00, pose: { bodyScaleX: 1, bodyScaleY: 1, haloScale: 1, expression: 'attack' } },
      { t: 0.35, pose: { rootY: 5, bodyAngle: 12, armBackAngle: 48, armFrontAngle: 42, weaponAngle: 45, haloScale: 1.35, capeAngle: 26, expression: 'attack' }, ease: 'smooth' },
      { t: 0.65, pose: { rootY: -16, bodyAngle: -14, headAngle: -12, armBackAngle: -135, armFrontAngle: p2Angle, weaponAngle: -12, haloAngle: 180, haloScale: 1.65, capeAngle: 46, expression: 'attack', groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootY: 0, haloAngle: 360, haloScale: 1.25, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'idle') {
    const p = defaultMonsterPose();
    const breathAmp = isBossArch ? 0.028 : 0.022;
    p.bodyScaleY = 1 + sin * breathAmp;
    p.bodyAngle = cos * (archetype === 'boss_c4' || archetype === 'boss_c5' ? 2.2 : 1.6);
    p.headAngle = -cos * 2;
    p.capeAngle = 8 + Math.sin(phase - 0.5) * (bossPhase === 2 ? 14 : 7);
    p.tailAngle = Math.sin(phase - 0.5) * 14;
    p.wingFrontAngle = sin * 12;
    p.wingBackAngle = -sin * 10;
    p.haloAngle = t * (bossPhase === 2 ? 360 : 180);
    p.haloScale = bossPhase === 2 ? 1.16 + sin * 0.05 : 1.0 + sin * 0.03;
    p.armBackAngle = -6 + sin * 6;
    p.armFrontAngle = 8 - sin * 6;
    p.weaponAngle = archetype === 'boss_c5' ? -54 + cos * 4 : -42 + sin * 5;
    return p;
  }

  if (clipId === 'move') {
    const p = defaultMonsterPose();
    p.rootY = -Math.abs(sin) * 6;
    p.bodyAngle = -5 + Math.cos(phase * 2) * 3;
    p.legBackAngle = sin * 24;
    p.legFrontAngle = -sin * 24;
    p.armBackAngle = -sin * 22;
    p.armFrontAngle = sin * 22;
    p.haloAngle = t * 360;
    p.capeAngle = 16 + sin * 10;
    p.tailAngle = sin * 14;
    return p;
  }

  if (clipId === 'attack_prep') {
    if (archetype === 'boss_c4') {
      if (pattern === 'shadow_drop') {
        return sampleKeys(t, [
          { t: 0.00, pose: { expression: 'attack', weaponAngle: -42 } },
          { t: 0.55, pose: { rootY: -22, bodyAngle: -8, armFrontAngle: -115, weaponAngle: 25, armBackAngle: -96, capeAngle: 38, haloAngle: 180, haloScale: 1.4, expression: 'attack', groundLock: false }, ease: 'smooth' },
          { t: 1.00, pose: { rootY: -26, bodyAngle: -10, armFrontAngle: -125, weaponAngle: 25, armBackAngle: -104, capeAngle: 44, haloAngle: 320, haloScale: 1.5, expression: 'attack', groundLock: false }, ease: 'smooth' },
        ]);
      }
      // moonlight_shockwave prep: draw greatsword far behind right shoulder
      return sampleKeys(t, [
        { t: 0.00, pose: { expression: 'attack', weaponAngle: -42 } },
        { t: 0.55, pose: { rootX: 12, bodyAngle: 12, armFrontAngle: 38, weaponAngle: 18, armBackAngle: 32, capeAngle: -14, haloScale: 1.35, haloAngle: 180, expression: 'attack' }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 16, bodyAngle: 16, armFrontAngle: 48, weaponAngle: 24, armBackAngle: 42, capeAngle: -18, haloScale: 1.48, haloAngle: 360, expression: 'attack' }, ease: 'smooth' },
      ]);
    }
    if (archetype === 'boss_c5') {
      if (pattern === 'crystal_explosion') {
        return sampleKeys(t, [
          { t: 0.00, pose: { expression: 'attack', weaponAngle: -54 } },
          { t: 0.55, pose: { rootY: -24, bodyAngle: -8, armFrontAngle: -118, weaponAngle: 20, armBackAngle: -110, haloAngle: 180, haloScale: 1.45, capeAngle: 36, expression: 'attack', groundLock: false }, ease: 'smooth' },
          { t: 1.00, pose: { rootY: -28, bodyAngle: -12, armFrontAngle: -128, weaponAngle: 22, armBackAngle: -120, haloAngle: 360, haloScale: 1.6, capeAngle: 42, expression: 'attack', groundLock: false }, ease: 'smooth' },
        ]);
      }
      // starlight_spear prep: couch spear at shoulder aimed left
      return sampleKeys(t, [
        { t: 0.00, pose: { expression: 'attack', weaponAngle: -54 } },
        { t: 0.55, pose: { rootX: 16, bodyAngle: 10, armFrontAngle: -32, weaponAngle: -64, armBackAngle: -46, haloScale: 1.38, haloAngle: 200, expression: 'attack' }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 20, bodyAngle: 14, armFrontAngle: -28, weaponAngle: -72, armBackAngle: -54, haloScale: 1.52, haloAngle: 360, expression: 'attack' }, ease: 'smooth' },
      ]);
    }
    // Ch.1 / Ch.2 / Ch.3 Boss telegraph wind-up
    return sampleKeys(t, [
      { t: 0.00, pose: { expression: 'attack' } },
      { t: 0.60, pose: { rootX: 12, rootY: -4, bodyAngle: 14, armFrontAngle: 122, armBackAngle: 112, wingFrontAngle: 34, wingBackAngle: -32, haloScale: 1.4, expression: 'attack' }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 16, rootY: -6, bodyAngle: 18, armFrontAngle: 138, armBackAngle: 128, haloScale: 1.55, expression: 'attack' }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'special_attack') {
    if (archetype === 'boss_c4') {
      if (pattern === 'shadow_drop') {
        return sampleKeys(t, [
          { t: 0.00, pose: { rootY: -24, armFrontAngle: -125, weaponAngle: 25, expression: 'attack', groundLock: false } },
          { t: 0.42, pose: { rootX: -48, rootY: 4, bodyAngle: -20, armFrontAngle: -52, weaponAngle: -44, weaponScale: 1.18, armBackAngle: -36, capeAngle: 48, haloScale: 1.5, expression: 'attack', groundLock: true }, ease: 'linear' },
          { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, weaponAngle: -42, weaponScale: 1, expression: 'normal' }, ease: 'smooth' },
        ]);
      }
      return sampleKeys(t, [
        { t: 0.00, pose: { rootX: 16, armFrontAngle: 48, weaponAngle: 24, expression: 'attack' } },
        { t: 0.44, pose: { rootX: -44, bodyAngle: -18, armFrontAngle: -54, weaponAngle: -38, weaponScale: 1.15, armBackAngle: -64, capeAngle: 42, haloScale: 1.45, expression: 'attack' }, ease: 'linear' },
        { t: 1.00, pose: { rootX: 0, bodyAngle: 0, weaponAngle: -42, weaponScale: 1, expression: 'normal' }, ease: 'smooth' },
      ]);
    }
    if (archetype === 'boss_c5') {
      if (pattern === 'crystal_explosion') {
        return sampleKeys(t, [
          { t: 0.00, pose: { rootY: -26, armFrontAngle: -128, weaponAngle: 22, expression: 'attack', groundLock: false } },
          { t: 0.42, pose: { rootX: -38, rootY: 4, bodyAngle: -18, armFrontAngle: -48, weaponAngle: -46, weaponScale: 1.2, armBackAngle: -48, capeAngle: 48, haloScale: 1.6, expression: 'attack', groundLock: true }, ease: 'linear' },
          { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, weaponAngle: -54, weaponScale: 1, expression: 'normal' }, ease: 'smooth' },
        ]);
      }
      return sampleKeys(t, [
        { t: 0.00, pose: { rootX: 20, armFrontAngle: -28, weaponAngle: -72, expression: 'attack' } },
        { t: 0.42, pose: { rootX: -52, bodyAngle: -16, armFrontAngle: -44, weaponAngle: -34, weaponScale: 1.18, armBackAngle: -56, capeAngle: 44, haloScale: 1.5, expression: 'attack' }, ease: 'linear' },
        { t: 1.00, pose: { rootX: 0, bodyAngle: 0, weaponAngle: -54, weaponScale: 1, expression: 'normal' }, ease: 'smooth' },
      ]);
    }
    // Ch.1~3 Special Attack: Massive overhead double-fist / drake lunge
    return sampleKeys(t, [
      { t: 0.00, pose: { rootX: 16, armFrontAngle: 136, armBackAngle: 126, expression: 'attack' } },
      { t: 0.46, pose: { rootX: -48, rootY: 2, bodyAngle: -22, armFrontAngle: -102, armBackAngle: -94, wingFrontAngle: -32, wingBackAngle: 32, legBackAngle: 22, legFrontAngle: -22, haloScale: 1.5, expression: 'attack' }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  // Basic Attack (Golem / All 5 Bosses): heavy windup -> crushing forward strike
  if (archetype === 'boss_c4' || archetype === 'boss_c5') {
    const idleWpn = archetype === 'boss_c5' ? -54 : -42;
    return sampleKeys(t, [
      { t: 0.00, pose: { weaponAngle: idleWpn, expression: 'attack' } },
      { t: 0.28, pose: { rootX: 10, bodyAngle: 12, armFrontAngle: 36, weaponAngle: 16, armBackAngle: 24, capeAngle: -8, expression: 'attack' }, ease: 'smooth' },
      { t: 0.54, pose: { rootX: -36, bodyAngle: -16, armFrontAngle: -48, weaponAngle: -42, armBackAngle: -48, capeAngle: 36, expression: 'attack' }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, bodyAngle: 0, weaponAngle: idleWpn, expression: 'normal' }, ease: 'smooth' },
    ]);
  }

  return sampleKeys(t, [
    { t: 0.00, pose: { expression: 'attack' } },
    { t: 0.28, pose: { rootX: 10, rootY: -4, bodyAngle: 12, armFrontAngle: 112, armBackAngle: 88, wingFrontAngle: 24, tailAngle: 20, expression: 'attack' }, ease: 'smooth' },
    { t: 0.54, pose: { rootX: -38, rootY: 2, bodyAngle: -18, armFrontAngle: -96, armBackAngle: -78, wingFrontAngle: -28, legBackAngle: 18, legFrontAngle: -18, expression: 'attack' }, ease: 'linear' },
    { t: 1.00, pose: { rootX: 0, rootY: 0, bodyAngle: 0, expression: 'normal' }, ease: 'smooth' },
  ]);
}

// ============================================================================
// 2D Matrix Forward Kinematics Solver for Monsters & Bosses
// ============================================================================

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

export function solveMonsterSkeleton(
  rigId: MonsterRigId,
  pose: MonsterPose,
  groundX?: number,
  groundY?: number,
  scale: number = 1.0
): SolvedMonsterFrame {
  const spec = MONSTER_RIG_SPECS[rigId];
  const arch = spec.archetype;
  const gx = groundX ?? spec.centerX;
  const gy = groundY ?? spec.groundY;

  const evalFrame = (yOffset: number): SolvedMonsterFrame => {
    let mRoot = matIdentity();
    mRoot = matTranslate(mRoot, gx + pose.rootX * scale, gy + (pose.rootY + yOffset) * scale);
    mRoot = matScale(mRoot, scale, scale);

    const matrices: Partial<Record<MonsterPartId, Mat2D>> = {};
    let bodyCenter: Vec2 = { x: gx, y: gy - 60 };
    let headCenter: Vec2 = { x: gx, y: gy - 90 };
    let attackOrigin: Vec2 = { x: gx - 42, y: gy - 60 };

    if (arch === 'slime') {
      const mTorsoPivot = matRotateDeg(matTranslate(mRoot, 0, -4), pose.bodyAngle);
      const mTorso = matScale(mTorsoPivot, pose.bodyScaleX, pose.bodyScaleY);
      matrices.torso = mTorso;
      const mFace = matTranslate(mTorsoPivot, -6, -42 * pose.bodyScaleY);
      matrices.face = mFace;
      const mCrown = matRotateDeg(matTranslate(mTorsoPivot, 0, -88 * pose.bodyScaleY), pose.crownAngle);
      matrices.crown = mCrown;
      const mArmB = matRotateDeg(matTranslate(mTorsoPivot, -44 * pose.bodyScaleX, -38 * pose.bodyScaleY), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mTorsoPivot, 42 * pose.bodyScaleX, -38 * pose.bodyScaleY), pose.armFrontAngle);
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;
      const mLegB = matRotateDeg(matTranslate(mRoot, -28, -12), pose.legBackAngle);
      const mLegF = matRotateDeg(matTranslate(mRoot, 26, -12), pose.legFrontAngle);
      matrices.leg_back = mLegB;
      matrices.leg_front = mLegF;
      bodyCenter = applyMatPoint(mFace, { x: 0, y: 0 });
      headCenter = applyMatPoint(mCrown, { x: 0, y: -16 });
      attackOrigin = applyMatPoint(mArmB, { x: -16, y: 6 });
    } else if (arch === 'mushroom') {
      const mPelvis = matTranslate(mRoot, 0, -24);
      const mLegB = matRotateDeg(matTranslate(mPelvis, -18, 0), pose.legBackAngle);
      const mLegF = matRotateDeg(matTranslate(mPelvis, 18, 0), pose.legFrontAngle);
      matrices.leg_back = mLegB;
      matrices.leg_front = mLegF;
      const mTorso = matRotateDeg(mPelvis, pose.bodyAngle);
      matrices.torso = matScale(mTorso, pose.bodyScaleX, pose.bodyScaleY);
      matrices.face = matTranslate(mTorso, -4, -36);
      matrices.crown = matRotateDeg(matTranslate(mTorso, 0, -64), pose.crownAngle);
      const mArmB = matRotateDeg(matTranslate(mTorso, -32, -40), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mTorso, 32, -40), pose.armFrontAngle);
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;
      bodyCenter = applyMatPoint(mTorso, { x: 0, y: -36 });
      headCenter = applyMatPoint(mTorso, { x: 0, y: -74 });
      attackOrigin = applyMatPoint(mArmB, { x: -18, y: 8 });
    } else if (arch === 'flying') {
      const mBody = matRotateDeg(matTranslate(mRoot, 0, -48), pose.bodyAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.tail = matRotateDeg(matTranslate(mBody, 18, -6), pose.tailAngle);
      matrices.leg_back = matRotateDeg(matTranslate(mBody, 0, -4), pose.legBackAngle);
      const mHead = matRotateDeg(matTranslate(mBody, -4, -52), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, -4, -30);
      matrices.wing_back = matScale(matRotateDeg(matTranslate(mBody, -8, -46), pose.wingBackAngle), pose.wingBackScaleX, 1);
      matrices.wing_front = matScale(matRotateDeg(matTranslate(mBody, 12, -46), pose.wingFrontAngle), pose.wingFrontScaleX, 1);
      const mArmB = matRotateDeg(matTranslate(mBody, -18, -44), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBody, 18, -44), pose.armFrontAngle);
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;
      bodyCenter = applyMatPoint(mBody, { x: 0, y: -32 });
      headCenter = applyMatPoint(mHead, { x: 0, y: -32 });
      attackOrigin = applyMatPoint(mArmB, { x: -18, y: 6 });
    } else if (arch === 'spirit') {
      const mBody = matRotateDeg(matTranslate(mRoot, 0, -68), pose.bodyAngle);
      matrices.halo = matScale(matRotateDeg(matTranslate(mBody, 0, -6), pose.haloAngle), pose.haloScale, pose.haloScale);
      matrices.tail = matRotateDeg(matTranslate(mBody, 4, 24), pose.tailAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.face = matTranslate(mBody, -5, -4);
      matrices.crown = matRotateDeg(matTranslate(mBody, 0, -42), pose.crownAngle);
      matrices.wing_back = matScale(matRotateDeg(matTranslate(mBody, -12, -14), pose.wingBackAngle), pose.wingBackScaleX, 1);
      matrices.wing_front = matScale(matRotateDeg(matTranslate(mBody, 14, -14), pose.wingFrontAngle), pose.wingFrontScaleX, 1);
      const mArmB = matRotateDeg(matTranslate(mBody, -38 + pose.armBackX, 4 + pose.armBackY), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBody, 38 + pose.armFrontX, 4 + pose.armFrontY), pose.armFrontAngle);
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;
      bodyCenter = applyMatPoint(mBody, { x: 0, y: 0 });
      headCenter = applyMatPoint(mBody, { x: 0, y: -34 });
      attackOrigin = applyMatPoint(mArmB, { x: -16, y: 0 });
    } else if (arch === 'beast') {
      const mBody = matRotateDeg(matTranslate(mRoot, 4, -58), pose.bodyAngle);
      matrices.torso = matScale(mBody, pose.bodyScaleX, pose.bodyScaleY);
      matrices.tail = matRotateDeg(matTranslate(mBody, 44, -6), pose.tailAngle);
      const mLegB = matRotateDeg(matTranslate(mBody, 34, 4), pose.legBackAngle);
      const mLegF = matRotateDeg(matTranslate(mBody, 24, 6), pose.legFrontAngle);
      const mArmB = matRotateDeg(matTranslate(mBody, -34, 4), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mBody, -24, 6), pose.armFrontAngle);
      matrices.leg_back = mLegB;
      matrices.leg_front = mLegF;
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;
      const mHead = matRotateDeg(matTranslate(mBody, -40, -14), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, -16, -8);
      bodyCenter = applyMatPoint(mBody, { x: -6, y: -4 });
      headCenter = applyMatPoint(mHead, { x: -12, y: -12 });
      attackOrigin = applyMatPoint(mHead, { x: -32, y: 4 });
    } else {
      // golem & boss_c1 .. boss_c5
      const legY = spec.isBoss ? -66 : -54;
      const hipDx = spec.isBoss ? 22 : 18;
      const shoulderY = spec.isBoss ? -72 : -58;
      const shoulderDx = spec.isBoss ? 48 : 38;
      const headY = spec.isBoss ? -84 : -70;

      const mPelvis = matTranslate(mRoot, 0, legY);
      const mLegB = matRotateDeg(matTranslate(mPelvis, -hipDx, 0), pose.legBackAngle);
      const mLegF = matRotateDeg(matTranslate(mPelvis, hipDx, 0), pose.legFrontAngle);
      matrices.leg_back = mLegB;
      matrices.leg_front = mLegF;

      const mTorso = matRotateDeg(matTranslate(mPelvis, 0, -4), pose.bodyAngle);
      matrices.torso = matScale(mTorso, pose.bodyScaleX, pose.bodyScaleY);

      if (spec.parts.halo) {
        matrices.halo = matScale(matRotateDeg(matTranslate(mTorso, 0, headY - 12), pose.haloAngle), pose.haloScale, pose.haloScale);
      }
      if (spec.parts.cape) {
        matrices.cape = matRotateDeg(matTranslate(mTorso, 6, shoulderY), pose.capeAngle);
      }
      if (spec.parts.tail) {
        matrices.tail = matRotateDeg(matTranslate(mTorso, 28, -10), pose.tailAngle);
      }
      if (spec.parts.wing_back) {
        matrices.wing_back = matScale(matRotateDeg(matTranslate(mTorso, -16, shoulderY - 8), pose.wingBackAngle), pose.wingBackScaleX, 1);
      }
      if (spec.parts.wing_front) {
        matrices.wing_front = matScale(matRotateDeg(matTranslate(mTorso, 18, shoulderY - 8), pose.wingFrontAngle), pose.wingFrontScaleX, 1);
      }

      const mHead = matRotateDeg(matTranslate(mTorso, 0, headY), pose.headAngle);
      matrices.head = mHead;
      matrices.face = matTranslate(mHead, -4, -30);

      const mArmB = matRotateDeg(matTranslate(mTorso, -shoulderDx, shoulderY), pose.armBackAngle);
      const mArmF = matRotateDeg(matTranslate(mTorso, shoulderDx, shoulderY), pose.armFrontAngle);
      matrices.arm_back = mArmB;
      matrices.arm_front = mArmF;

      if (spec.parts.weapon) {
        const handAnchorY = spec.isBoss ? 72 : 56;
        let mWeapon = matTranslate(mArmF, -10, handAnchorY);
        mWeapon = matRotateDeg(mWeapon, pose.weaponAngle);
        mWeapon = matScale(mWeapon, pose.weaponScale, pose.weaponScale);
        matrices.weapon = mWeapon;
        attackOrigin = applyMatPoint(mWeapon, { x: 0, y: -135 });
      } else {
        attackOrigin = applyMatPoint(mArmB, { x: -24, y: spec.isBoss ? 78 : 64 });
      }

      bodyCenter = applyMatPoint(mTorso, { x: 0, y: shoulderY * 0.55 });
      headCenter = applyMatPoint(mHead, { x: 0, y: -28 });
    }

    return {
      matrices,
      drawOrder: spec.drawOrder,
      attachments: {
        bodyCenter,
        headCenter,
        attackOrigin,
        groundContact: { x: gx + pose.rootX * scale, y: gy },
      },
      rootAlpha: pose.rootAlpha,
      hitFlashAlpha: pose.hitFlashAlpha,
      expression: pose.expression,
    };
  };

  let solved = evalFrame(0);
  // Perform ground-lock adjustment for legged archetypes so feet never sink below groundY
  if (pose.groundLock && (arch === 'slime' || arch === 'mushroom' || arch === 'beast' || arch === 'golem' || arch.startsWith('boss_'))) {
    const legBackM = solved.matrices.leg_back;
    const legFrontM = solved.matrices.leg_front;
    const soleYOffset = arch === 'slime' ? 12 : arch === 'mushroom' ? 24 : arch === 'beast' ? 50 : spec.isBoss ? 66 : 54;
    let lowestY = -Infinity;
    if (legBackM) lowestY = Math.max(lowestY, applyMatPoint(legBackM, { x: 0, y: soleYOffset }).y);
    if (legFrontM) lowestY = Math.max(lowestY, applyMatPoint(legFrontM, { x: 0, y: soleYOffset }).y);
    if (lowestY > -Infinity) {
      const correction = (gy - lowestY) / Math.max(0.1, scale);
      if (Math.abs(correction) > 0.3 && Math.abs(correction) < 40) {
        solved = evalFrame(correction);
      }
    }
  }
  return solved;
}
