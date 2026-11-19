import { CharacterClassId, SkillEffectType } from '../types/game';

export type HeroRigState =
  | 'Idle'
  | 'Move'
  | 'Attack1'
  | 'Attack2'
  | 'Attack3'
  | 'SkillCast'
  | 'Hit'
  | 'Victory'
  | 'Defeat';

export type HeroPartId =
  | 'cape'
  | 'hair_back_l'
  | 'hair_back_r'
  | 'pelvis'
  | 'torso'
  | 'head'
  | 'upper_arm_l'
  | 'forearm_l'
  | 'hand_l'
  | 'offhand'
  | 'upper_arm_r'
  | 'forearm_r'
  | 'hand_r'
  | 'weapon'
  | 'thigh_l'
  | 'shin_l'
  | 'foot_l'
  | 'thigh_r'
  | 'shin_r'
  | 'foot_r';

export type HeadExpression = 'normal' | 'hit' | 'victory' | 'defeat';

export interface Vec2 {
  x: number;
  y: number;
}

/** 2D Affine Transform Matrix [a, b, c, d, tx, ty] in Canvas setTransform order */
export type Mat2D = [number, number, number, number, number, number];

export interface PartSpec {
  id: HeroPartId;
  file: string;
  w: number;      // Logical canonical rig pixels
  h: number;
  pivotX: number; // Joint rotation pivot inside logical w x h
  pivotY: number;
  exportScale: number; // PNG is saved at w*exportScale x h*exportScale
}

export interface HeroAttachmentPoints {
  weaponGrip: Vec2;
  weaponTip: Vec2;
  staffTip: Vec2;
  leftHand: Vec2;
  rightHand: Vec2;
  leftFoot: Vec2;
  rightFoot: Vec2;
  groundContact: Vec2;
  bodyCenter: Vec2;
  headCenter: Vec2;
  rootWorld: Vec2;
}

export interface HeroSkeletonPose {
  rootX: number;
  rootY: number;
  pelvisY: number; // Relative to ground (default -48)
  pelvisAngle: number; // degrees
  torsoAngle: number;
  torsoScaleX?: number;
  torsoScaleY?: number;
  headAngle: number;
  capeAngle: number;
  hairAngleL: number;
  hairAngleR: number;
  // Trailing / Near arm (_l)
  upperArmLAngle: number;
  forearmLAngle: number;
  handLAngle: number;
  offhandAngle: number;
  offhandScale?: number;
  offhandVisible?: boolean;
  // Leading / Weapon arm (_r)
  upperArmRAngle: number;
  forearmRAngle: number;
  handRAngle: number;
  weaponAngle: number;
  weaponScale?: number;
  // Legs
  thighLAngle: number;
  shinLAngle: number;
  footLAngle: number;
  thighRAngle: number;
  shinRAngle: number;
  footRAngle: number;
  // Optional overrides
  expression?: HeadExpression;
  weaponFrontOfTorso?: boolean;
  twoHandGrip?: boolean;
  groundLock?: boolean; // When true, adjusts pelvisY so lowest boot sole touches groundY
  rootAlpha?: number;
}

export type HeroAnimationClipId =
  | 'idle'
  | 'run'
  | 'attack_01'
  | 'attack_02'
  | 'attack_03'
  | 'hit'
  | 'victory'
  | 'defeat'
  // Warrior skill sub-clips
  | 'skill_warrior_heavy_slash'
  | 'skill_warrior_multi_slash'
  | 'skill_warrior_spin'
  | 'skill_warrior_shield_bash'
  | 'skill_warrior_ground_slam'
  | 'skill_warrior_sky_sword'
  | 'skill_warrior_roar_buff'
  | 'skill_warrior_awakening'
  // Mage skill sub-clips
  | 'skill_mage_projectile'
  | 'skill_mage_focus_orb'
  | 'skill_mage_sky_call'
  | 'skill_mage_ground_ritual'
  | 'skill_mage_nova_barrier'
  | 'skill_mage_awakening';

export interface HeroClipMeta {
  id: HeroAnimationClipId;
  folderName: string; // e.g. 'idle', 'run', 'attack_01', ...
  frameCount: number;
  durationMs: number;
  loop: boolean;
  contactTime: number;  // 0..1 normalized
  releaseTime: number;  // 0..1 normalized
  recoveryTime: number; // 0..1 normalized
  interruptPolicy: 'always' | 'after_release' | 'non_interruptible';
}

export const RIG_CANONICAL_W = 320;
export const RIG_CANONICAL_H = 290;
export const RIG_DEFAULT_GROUND_Y = 264;
export const RIG_DEFAULT_CENTER_X = 118;

// Exported 2x PNG resolution for razor-sharp HiDPI Canvas rendering
export const PART_EXPORT_SCALE = 2;

export const CLASS_PART_SPECS: Record<CharacterClassId, Record<HeroPartId, PartSpec>> = {
  warrior: {
    cape:        { id: 'cape',        file: 'cape.png',        w: 96,  h: 98,  pivotX: 58, pivotY: 16, exportScale: PART_EXPORT_SCALE },
    hair_back_l: { id: 'hair_back_l', file: 'hair_back_l.png', w: 20,  h: 20,  pivotX: 10, pivotY: 4,  exportScale: PART_EXPORT_SCALE },
    hair_back_r: { id: 'hair_back_r', file: 'hair_back_r.png', w: 20,  h: 20,  pivotX: 10, pivotY: 4,  exportScale: PART_EXPORT_SCALE },
    pelvis:      { id: 'pelvis',      file: 'pelvis.png',      w: 66,  h: 38,  pivotX: 33, pivotY: 14, exportScale: PART_EXPORT_SCALE },
    torso:       { id: 'torso',       file: 'torso.png',       w: 68,  h: 54,  pivotX: 34, pivotY: 44, exportScale: PART_EXPORT_SCALE },
    head:        { id: 'head',        file: 'head.png',        w: 112, h: 104, pivotX: 56, pivotY: 88, exportScale: PART_EXPORT_SCALE },
    upper_arm_l: { id: 'upper_arm_l', file: 'upper_arm_l.png', w: 30,  h: 34,  pivotX: 15, pivotY: 10, exportScale: PART_EXPORT_SCALE },
    forearm_l:   { id: 'forearm_l',   file: 'forearm_l.png',   w: 28,  h: 32,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    hand_l:      { id: 'hand_l',      file: 'hand_l.png',      w: 24,  h: 24,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    offhand:     { id: 'offhand',     file: 'offhand.png',     w: 36,  h: 44,  pivotX: 18, pivotY: 22, exportScale: PART_EXPORT_SCALE },
    upper_arm_r: { id: 'upper_arm_r', file: 'upper_arm_r.png', w: 30,  h: 34,  pivotX: 15, pivotY: 10, exportScale: PART_EXPORT_SCALE },
    forearm_r:   { id: 'forearm_r',   file: 'forearm_r.png',   w: 28,  h: 32,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    hand_r:      { id: 'hand_r',      file: 'hand_r.png',      w: 24,  h: 24,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    weapon:      { id: 'weapon',      file: 'weapon.png',      w: 48,  h: 126, pivotX: 24, pivotY: 100, exportScale: PART_EXPORT_SCALE },
    thigh_l:     { id: 'thigh_l',     file: 'thigh_l.png',     w: 28,  h: 34,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    shin_l:      { id: 'shin_l',      file: 'shin_l.png',      w: 28,  h: 34,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    foot_l:      { id: 'foot_l',      file: 'foot_l.png',      w: 38,  h: 24,  pivotX: 12, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    thigh_r:     { id: 'thigh_r',     file: 'thigh_r.png',     w: 28,  h: 34,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    shin_r:      { id: 'shin_r',      file: 'shin_r.png',      w: 28,  h: 34,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    foot_r:      { id: 'foot_r',      file: 'foot_r.png',      w: 38,  h: 24,  pivotX: 12, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
  },
  mage: {
    cape:        { id: 'cape',        file: 'cape.png',        w: 84,  h: 72,  pivotX: 44, pivotY: 14, exportScale: PART_EXPORT_SCALE },
    hair_back_l: { id: 'hair_back_l', file: 'hair_back_l.png', w: 46,  h: 72,  pivotX: 28, pivotY: 10, exportScale: PART_EXPORT_SCALE },
    hair_back_r: { id: 'hair_back_r', file: 'hair_back_r.png', w: 42,  h: 68,  pivotX: 14, pivotY: 10, exportScale: PART_EXPORT_SCALE },
    pelvis:      { id: 'pelvis',      file: 'pelvis.png',      w: 74,  h: 46,  pivotX: 37, pivotY: 12, exportScale: PART_EXPORT_SCALE },
    torso:       { id: 'torso',       file: 'torso.png',       w: 62,  h: 52,  pivotX: 31, pivotY: 42, exportScale: PART_EXPORT_SCALE },
    head:        { id: 'head',        file: 'head.png',        w: 122, h: 116, pivotX: 60, pivotY: 96, exportScale: PART_EXPORT_SCALE },
    upper_arm_l: { id: 'upper_arm_l', file: 'upper_arm_l.png', w: 28,  h: 32,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    forearm_l:   { id: 'forearm_l',   file: 'forearm_l.png',   w: 28,  h: 30,  pivotX: 14, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    hand_l:      { id: 'hand_l',      file: 'hand_l.png',      w: 22,  h: 22,  pivotX: 11, pivotY: 7,  exportScale: PART_EXPORT_SCALE },
    offhand:     { id: 'offhand',     file: 'offhand.png',     w: 36,  h: 36,  pivotX: 18, pivotY: 18, exportScale: PART_EXPORT_SCALE },
    upper_arm_r: { id: 'upper_arm_r', file: 'upper_arm_r.png', w: 28,  h: 32,  pivotX: 14, pivotY: 9,  exportScale: PART_EXPORT_SCALE },
    forearm_r:   { id: 'forearm_r',   file: 'forearm_r.png',   w: 28,  h: 30,  pivotX: 14, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    hand_r:      { id: 'hand_r',      file: 'hand_r.png',      w: 22,  h: 22,  pivotX: 11, pivotY: 7,  exportScale: PART_EXPORT_SCALE },
    weapon:      { id: 'weapon',      file: 'weapon.png',      w: 58,  h: 144, pivotX: 29, pivotY: 76, exportScale: PART_EXPORT_SCALE },
    thigh_l:     { id: 'thigh_l',     file: 'thigh_l.png',     w: 24,  h: 32,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    shin_l:      { id: 'shin_l',      file: 'shin_l.png',      w: 24,  h: 30,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    foot_l:      { id: 'foot_l',      file: 'foot_l.png',      w: 36,  h: 24,  pivotX: 11, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    thigh_r:     { id: 'thigh_r',     file: 'thigh_r.png',     w: 24,  h: 32,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    shin_r:      { id: 'shin_r',      file: 'shin_r.png',      w: 24,  h: 30,  pivotX: 12, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
    foot_r:      { id: 'foot_r',      file: 'foot_r.png',      w: 36,  h: 24,  pivotX: 11, pivotY: 8,  exportScale: PART_EXPORT_SCALE },
  },
};

export interface BoneGeometryConfig {
  pelvisToTorso: Vec2;
  torsoToCape: Vec2;
  torsoToHead: Vec2;
  headToHairL: Vec2;
  headToHairR: Vec2;
  torsoToShoulderL: Vec2;
  torsoToShoulderR: Vec2;
  upperArmLen: number;
  forearmLen: number;
  handToGrip: Vec2;
  forearmToOffhand: Vec2;
  pelvisToHipL: Vec2;
  pelvisToHipR: Vec2;
  thighLen: number;
  shinLen: number;
  ankleToSole: number;
  weaponTipLocal: Vec2; // Relative to weapon pivot (weaponGrip)
}

export const CLASS_BONE_GEOMETRY: Record<CharacterClassId, BoneGeometryConfig> = {
  warrior: {
    pelvisToTorso: { x: 0, y: -4 },
    torsoToCape: { x: -8, y: -32 },
    torsoToHead: { x: 2, y: -35 },
    headToHairL: { x: -20, y: -40 },
    headToHairR: { x: 20, y: -40 },
    torsoToShoulderL: { x: -14, y: -28 },
    torsoToShoulderR: { x: 14, y: -28 },
    upperArmLen: 15,
    forearmLen: 14,
    handToGrip: { x: 1, y: 5 },
    forearmToOffhand: { x: -1, y: 12 },
    pelvisToHipL: { x: -10, y: 4 },
    pelvisToHipR: { x: 10, y: 4 },
    thighLen: 18,
    shinLen: 17,
    ankleToSole: 9,
    weaponTipLocal: { x: 0, y: -90 },
  },
  mage: {
    pelvisToTorso: { x: 0, y: -5 },
    torsoToCape: { x: -5, y: -24 },
    torsoToHead: { x: 2, y: -34 },
    headToHairL: { x: -21, y: -42 },
    headToHairR: { x: 21, y: -42 },
    torsoToShoulderL: { x: -13, y: -27 },
    torsoToShoulderR: { x: 13, y: -27 },
    upperArmLen: 14,
    forearmLen: 13,
    handToGrip: { x: 1, y: 5 },
    forearmToOffhand: { x: 2, y: 14 },
    pelvisToHipL: { x: -9, y: 4 },
    pelvisToHipR: { x: 9, y: 4 },
    thighLen: 17,
    shinLen: 16,
    ankleToSole: 9,
    weaponTipLocal: { x: 0, y: -54 },
  },
};

export const HERO_CLIP_CATALOG: Record<HeroAnimationClipId, HeroClipMeta> = {
  idle: { id: 'idle', folderName: 'idle', frameCount: 8, durationMs: 2200, loop: true, contactTime: 0, releaseTime: 0, recoveryTime: 1, interruptPolicy: 'always' },
  run: { id: 'run', folderName: 'run', frameCount: 10, durationMs: 560, loop: true, contactTime: 0.25, releaseTime: 0.5, recoveryTime: 1, interruptPolicy: 'always' },
  attack_01: { id: 'attack_01', folderName: 'attack_01', frameCount: 10, durationMs: 300, loop: false, contactTime: 0.44, releaseTime: 0.40, recoveryTime: 0.72, interruptPolicy: 'after_release' },
  attack_02: { id: 'attack_02', folderName: 'attack_02', frameCount: 10, durationMs: 340, loop: false, contactTime: 0.46, releaseTime: 0.42, recoveryTime: 0.74, interruptPolicy: 'after_release' },
  attack_03: { id: 'attack_03', folderName: 'attack_03', frameCount: 12, durationMs: 440, loop: false, contactTime: 0.54, releaseTime: 0.46, recoveryTime: 0.78, interruptPolicy: 'after_release' },
  hit: { id: 'hit', folderName: 'hit', frameCount: 6, durationMs: 220, loop: false, contactTime: 0.2, releaseTime: 0.2, recoveryTime: 0.8, interruptPolicy: 'always' },
  victory: { id: 'victory', folderName: 'victory', frameCount: 8, durationMs: 520, loop: false, contactTime: 0.35, releaseTime: 0.35, recoveryTime: 0.85, interruptPolicy: 'always' },
  defeat: { id: 'defeat', folderName: 'defeat', frameCount: 8, durationMs: 560, loop: false, contactTime: 0.5, releaseTime: 0.5, recoveryTime: 1, interruptPolicy: 'non_interruptible' },

  skill_warrior_heavy_slash: { id: 'skill_warrior_heavy_slash', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.52, releaseTime: 0.42, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_warrior_multi_slash: { id: 'skill_warrior_multi_slash', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.48, releaseTime: 0.35, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_warrior_spin: { id: 'skill_warrior_spin', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.50, releaseTime: 0.36, recoveryTime: 0.82, interruptPolicy: 'non_interruptible' },
  skill_warrior_shield_bash: { id: 'skill_warrior_shield_bash', folderName: 'skill_cast', frameCount: 10, durationMs: 460, loop: false, contactTime: 0.48, releaseTime: 0.38, recoveryTime: 0.76, interruptPolicy: 'non_interruptible' },
  skill_warrior_ground_slam: { id: 'skill_warrior_ground_slam', folderName: 'skill_cast', frameCount: 10, durationMs: 500, loop: false, contactTime: 0.55, releaseTime: 0.45, recoveryTime: 0.80, interruptPolicy: 'non_interruptible' },
  skill_warrior_sky_sword: { id: 'skill_warrior_sky_sword', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.46, releaseTime: 0.38, recoveryTime: 0.76, interruptPolicy: 'non_interruptible' },
  skill_warrior_roar_buff: { id: 'skill_warrior_roar_buff', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.48, releaseTime: 0.34, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_warrior_awakening: { id: 'skill_warrior_awakening', folderName: 'skill_cast', frameCount: 10, durationMs: 820, loop: false, contactTime: 0.58, releaseTime: 0.44, recoveryTime: 0.84, interruptPolicy: 'non_interruptible' },

  skill_mage_projectile: { id: 'skill_mage_projectile', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.50, releaseTime: 0.40, recoveryTime: 0.76, interruptPolicy: 'non_interruptible' },
  skill_mage_focus_orb: { id: 'skill_mage_focus_orb', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.50, releaseTime: 0.40, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_mage_sky_call: { id: 'skill_mage_sky_call', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.52, releaseTime: 0.38, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_mage_ground_ritual: { id: 'skill_mage_ground_ritual', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.52, releaseTime: 0.40, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_mage_nova_barrier: { id: 'skill_mage_nova_barrier', folderName: 'skill_cast', frameCount: 10, durationMs: 480, loop: false, contactTime: 0.48, releaseTime: 0.38, recoveryTime: 0.78, interruptPolicy: 'non_interruptible' },
  skill_mage_awakening: { id: 'skill_mage_awakening', folderName: 'skill_cast', frameCount: 10, durationMs: 820, loop: false, contactTime: 0.58, releaseTime: 0.44, recoveryTime: 0.84, interruptPolicy: 'non_interruptible' },
};

export function resolveHeroClipId(
  classId: CharacterClassId,
  animState: HeroRigState,
  castingSkillType: SkillEffectType | null = null,
  isAwakeningCasting: boolean = false
): HeroAnimationClipId {
  if (animState === 'Defeat') return 'defeat';
  if (animState === 'SkillCast') {
    if (isAwakeningCasting || castingSkillType === 'heavenly_blade' || castingSkillType === 'ragnarok_cleave' || castingSkillType === 'astral_cataclysm' || castingSkillType === 'absolute_zero') {
      return classId === 'mage' ? 'skill_mage_awakening' : 'skill_warrior_awakening';
    }
    if (classId === 'warrior') {
      switch (castingSkillType) {
        case 'shield_bash':
          return 'skill_warrior_shield_bash';
        case 'whirlwind':
          return 'skill_warrior_spin';
        case 'double_slash':
        case 'blade_storm':
        case 'phantom_blade':
          return 'skill_warrior_multi_slash';
        case 'ground_breaker':
        case 'execution':
          return 'skill_warrior_ground_slam';
        case 'sword_wave':
        case 'wind_blade':
          return 'skill_warrior_sky_sword';
        case 'blood_thirst':
        case 'iron_fortress':
          return 'skill_warrior_roar_buff';
        default:
          return 'skill_warrior_heavy_slash';
      }
    }
    // Mage skills
    switch (castingSkillType) {
      case 'chain_lightning':
      case 'thunder_strike':
      case 'blizzard':
        return 'skill_mage_sky_call';
      case 'flame_pillar':
      case 'gravity_well':
      case 'meteor':
        return 'skill_mage_ground_ritual';
      case 'frost_nova':
      case 'arcane_familiar':
        return 'skill_mage_nova_barrier';
      case 'arcane_orb':
      case 'mana_burst':
      case 'arcane_storm':
        return 'skill_mage_focus_orb';
      default:
        return 'skill_mage_projectile';
    }
  }
  if (animState === 'Attack3') return 'attack_03';
  if (animState === 'Attack2') return 'attack_02';
  if (animState === 'Attack1') return 'attack_01';
  if (animState === 'Hit') return 'hit';
  if (animState === 'Victory') return 'victory';
  if (animState === 'Move') return 'run';
  return 'idle';
}

// =========================================================================
// Keyframe & Math Interpolation Engine
// =========================================================================

const DEG_TO_RAD = Math.PI / 180;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

interface TimedKeyframe {
  t: number; // 0..1
  pose: Partial<HeroSkeletonPose>;
  ease?: 'linear' | 'smooth';
}

function makeDefaultPose(classId: CharacterClassId): HeroSkeletonPose {
  if (classId === 'warrior') {
    return {
      rootX: 0,
      rootY: 0,
      pelvisY: -47,
      pelvisAngle: 0,
      torsoAngle: 2,
      torsoScaleX: 1,
      torsoScaleY: 1,
      headAngle: -1,
      capeAngle: 6,
      hairAngleL: 0,
      hairAngleR: 0,
      upperArmLAngle: 22,
      forearmLAngle: -48,
      handLAngle: 6,
      offhandAngle: -10,
      offhandScale: 0.85,
      offhandVisible: false,
      upperArmRAngle: -24,
      forearmRAngle: -52,
      handRAngle: 14,
      weaponAngle: 96,
      weaponScale: 1,
      thighLAngle: 18,
      shinLAngle: 4,
      footLAngle: -20,
      thighRAngle: -20,
      shinRAngle: 12,
      footRAngle: 8,
      expression: 'normal',
      weaponFrontOfTorso: true,
      groundLock: true,
      rootAlpha: 1,
    };
  }
  return {
    rootX: 0,
    rootY: 0,
    pelvisY: -45,
    pelvisAngle: 0,
    torsoAngle: 1,
    torsoScaleX: 1,
    torsoScaleY: 1,
    headAngle: -1,
    capeAngle: 4,
    hairAngleL: 6,
    hairAngleR: -6,
    upperArmLAngle: 20,
    forearmLAngle: -58,
    handLAngle: 4,
    offhandAngle: 0,
    offhandScale: 0.8,
    offhandVisible: false,
    upperArmRAngle: -38,
    forearmRAngle: -34,
    handRAngle: 10,
    weaponAngle: 76,
    weaponScale: 1,
    thighLAngle: 12,
    shinLAngle: 4,
    footLAngle: -14,
    thighRAngle: -14,
    shinRAngle: 8,
    footRAngle: 6,
    expression: 'normal',
    weaponFrontOfTorso: false,
    groundLock: true,
    rootAlpha: 1,
  };
}

function sampleKeyframes(classId: CharacterClassId, tRaw: number, keys: TimedKeyframe[]): HeroSkeletonPose {
  const t = Math.max(0, Math.min(1, tRaw));
  const base = makeDefaultPose(classId);
  if (keys.length === 0) return base;

  let prev = keys[0];
  let next = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) {
      prev = keys[i];
      next = keys[i + 1];
      break;
    }
  }
  const span = Math.max(0.0001, next.t - prev.t);
  const localT = (t - prev.t) / span;
  const k = next.ease === 'linear' ? localT : easeInOut(localT);

  const out: HeroSkeletonPose = { ...base };
  const numericKeys: (keyof HeroSkeletonPose)[] = [
    'rootX', 'rootY', 'pelvisY', 'pelvisAngle', 'torsoAngle', 'torsoScaleX', 'torsoScaleY',
    'headAngle', 'capeAngle', 'hairAngleL', 'hairAngleR',
    'upperArmLAngle', 'forearmLAngle', 'handLAngle', 'offhandAngle', 'offhandScale',
    'upperArmRAngle', 'forearmRAngle', 'handRAngle', 'weaponAngle', 'weaponScale',
    'thighLAngle', 'shinLAngle', 'footLAngle', 'thighRAngle', 'shinRAngle', 'footRAngle', 'rootAlpha',
  ];

  for (const prop of numericKeys) {
    const va = (prev.pose[prop] as number | undefined) ?? (base[prop] as number);
    const vb = (next.pose[prop] as number | undefined) ?? (base[prop] as number);
    (out[prop] as number) = lerp(va, vb, k);
  }

  out.expression = k < 0.5 ? (prev.pose.expression ?? base.expression) : (next.pose.expression ?? prev.pose.expression ?? base.expression);
  out.offhandVisible = k < 0.5 ? (prev.pose.offhandVisible ?? base.offhandVisible) : (next.pose.offhandVisible ?? prev.pose.offhandVisible ?? base.offhandVisible);
  out.weaponFrontOfTorso = k < 0.5 ? (prev.pose.weaponFrontOfTorso ?? base.weaponFrontOfTorso) : (next.pose.weaponFrontOfTorso ?? prev.pose.weaponFrontOfTorso ?? base.weaponFrontOfTorso);
  out.groundLock = k < 0.5 ? (prev.pose.groundLock ?? base.groundLock) : (next.pose.groundLock ?? prev.pose.groundLock ?? base.groundLock);
  return out;
}

export function evaluateHeroClipPose(
  classId: CharacterClassId,
  clipId: HeroAnimationClipId,
  tNormalized: number
): HeroSkeletonPose {
  const isLoop = HERO_CLIP_CATALOG[clipId]?.loop ?? false;
  const t = isLoop ? ((tNormalized % 1) + 1) % 1 : Math.max(0, Math.min(1, tNormalized));
  const phase = t * Math.PI * 2;
  const isWarrior = classId === 'warrior';

  // 1. IDLE (Grounded multi-joint breathing, arm poise, cape/hair wave)
  if (clipId === 'idle') {
    const breath = Math.sin(phase);
    const sway = Math.cos(phase);
    const pose = makeDefaultPose(classId);
    if (isWarrior) {
      pose.torsoScaleY = 1 + breath * 0.025;
      pose.torsoScaleX = 1 - breath * 0.015;
      pose.torsoAngle = 2 + breath * 2.4;
      pose.headAngle = -1.5 - breath * 1.8;
      pose.capeAngle = 7 + sway * 7;
      pose.upperArmRAngle = -24 + breath * 4.5;
      pose.forearmRAngle = -52 - breath * 3.5;
      pose.weaponAngle = 92 + sway * 4;
      pose.upperArmLAngle = 20 - breath * 3.5;
      pose.forearmLAngle = -50 + breath * 4;
      pose.thighLAngle = 18 + breath * 1.5;
      pose.shinLAngle = 4 - breath * 2;
      pose.thighRAngle = -20 - breath * 1.5;
      pose.shinRAngle = 12 + breath * 2.5;
      pose.groundLock = true;
    } else {
      // Mage gentle buoyant stance + staff poise + twin pigtail drift
      pose.rootY = -2 + breath * 2.5;
      pose.torsoScaleY = 1 + breath * 0.022;
      pose.torsoAngle = 1 + breath * 2.5;
      pose.headAngle = -1 + sway * 2.2;
      pose.hairAngleL = 7 + Math.sin(phase - 0.5) * 6;
      pose.hairAngleR = -7 - Math.sin(phase - 0.4) * 5;
      pose.capeAngle = 5 + Math.cos(phase - 0.3) * 5;
      pose.upperArmRAngle = -38 + breath * 4;
      pose.forearmRAngle = -34 + sway * 3;
      pose.weaponAngle = 75 - breath * 3.5;
      pose.upperArmLAngle = 22 - breath * 3;
      pose.forearmLAngle = -62 - sway * 4;
      pose.thighLAngle = 12 + breath * 2;
      pose.shinLAngle = 6 + breath * 2;
      pose.thighRAngle = -14 - breath * 2;
      pose.shinRAngle = 9 - breath * 2;
      pose.groundLock = false;
    }
    return pose;
  }

  // 2. RUN (Genuine Alternating 2-Leg Sprint Cycle + Opposite Arm Swing + Forward Lean + Grounded Plant)
  if (clipId === 'run') {
    const p1 = phase;
    const p2 = phase + Math.PI;
    const pose = makeDefaultPose(classId);

    const strideAmp = isWarrior ? 38 : 34;
    // Thighs swing 180° out of phase
    const thL = Math.sin(p1) * strideAmp;
    const thR = Math.sin(p2) * strideAmp;
    // Knee bends strongly on recovery back-swing (cos > 0 when pulling forward)
    const knL = 14 + Math.max(0, Math.cos(p1)) * 58 + Math.max(0, -Math.sin(p1)) * 18;
    const knR = 14 + Math.max(0, Math.cos(p2)) * 58 + Math.max(0, -Math.sin(p2)) * 18;
    // Ankles dorsiflex cleanly on strike and push off on toe-off
    const anL = -(thL + knL) * 0.55 + Math.sin(p1 - 0.4) * 14;
    const anR = -(thR + knR) * 0.55 + Math.sin(p2 - 0.4) * 14;

    pose.thighLAngle = thL;
    pose.shinLAngle = knL;
    pose.footLAngle = anL;
    pose.thighRAngle = thR;
    pose.shinRAngle = knR;
    pose.footRAngle = anR;

    // Double-frequency vertical bounce (2 steps per cycle)
    const bounce = -Math.abs(Math.sin(phase)) * 6.5;
    pose.rootY = bounce;
    pose.torsoAngle = (isWarrior ? 15 : 11) + Math.sin(phase * 2) * 3;
    pose.pelvisAngle = 4 + Math.cos(phase * 2) * 2.5;
    pose.headAngle = -8 - Math.sin(phase * 2) * 2;
    pose.capeAngle = 28 + Math.sin(phase * 2 - 0.5) * 12;
    pose.hairAngleL = 22 + Math.sin(phase * 2 - 0.4) * 11;
    pose.hairAngleR = 12 + Math.cos(phase * 2 - 0.4) * 9;

    // Arms swing opposite to legs while gripping sword / staff cleanly
    if (isWarrior) {
      pose.upperArmLAngle = 16 + Math.sin(p2) * 28;
      pose.forearmLAngle = -52 + Math.sin(p2) * 10;
      pose.upperArmRAngle = -22 + Math.sin(p1) * 18;
      pose.forearmRAngle = -48 - Math.cos(p1) * 8;
      pose.weaponAngle = 98 + Math.sin(p1) * 12;
    } else {
      pose.upperArmLAngle = 14 + Math.sin(p2) * 26;
      pose.forearmLAngle = -56 - Math.cos(p2) * 10;
      pose.upperArmRAngle = -32 + Math.sin(p1) * 16;
      pose.forearmRAngle = -36 - Math.sin(p1) * 8;
      pose.weaponAngle = 82 + Math.sin(p1) * 10;
    }
    pose.groundLock = true;
    return pose;
  }

  // 3. ATTACK 1 (Warrior: 1타 횡베기 / Mage: 1타 비전 볼트)
  if (clipId === 'attack_01') {
    if (isWarrior) {
      return sampleKeyframes(classId, t, [
        { t: 0.00, pose: { rootX: 0, torsoAngle: 2, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92, upperArmLAngle: 22 } },
        { t: 0.24, pose: { rootX: -6, torsoAngle: -14, headAngle: 8, capeAngle: -8, upperArmRAngle: -118, forearmRAngle: -36, weaponAngle: 36, upperArmLAngle: -38, forearmLAngle: -52, thighLAngle: 26, shinLAngle: 18, thighRAngle: -24, shinRAngle: 22 }, ease: 'smooth' },
        { t: 0.46, pose: { rootX: 34, torsoAngle: 22, headAngle: -12, capeAngle: 36, upperArmRAngle: -82, forearmRAngle: -12, weaponAngle: 108, handRAngle: 14, upperArmLAngle: 38, forearmLAngle: -35, thighLAngle: 32, shinLAngle: 8, thighRAngle: -42, shinRAngle: 38 }, ease: 'linear' },
        { t: 0.70, pose: { rootX: 24, torsoAngle: 12, headAngle: -6, capeAngle: 24, upperArmRAngle: -62, forearmRAngle: -24, weaponAngle: 124, upperArmLAngle: 30, thighRAngle: -32, shinRAngle: 28 }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 0, torsoAngle: 2, headAngle: -1, capeAngle: 6, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92 }, ease: 'smooth' },
      ]);
    }
    // Mage Attack1: Pull staff back -> thrust staff forward aiming crystal tip toward target
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { rootX: 0, rootY: -1, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76 } },
      { t: 0.26, pose: { rootX: -6, rootY: -4, torsoAngle: -12, headAngle: 6, hairAngleL: -8, capeAngle: -6, upperArmRAngle: -34, forearmRAngle: -42, weaponAngle: 96, upperArmLAngle: -26, forearmLAngle: -44, thighLAngle: 18, shinLAngle: 14, thighRAngle: -14, shinRAngle: 14 }, ease: 'smooth' },
      { t: 0.48, pose: { rootX: 16, rootY: -6, torsoAngle: 14, headAngle: -8, hairAngleL: 24, capeAngle: 22, upperArmRAngle: -82, forearmRAngle: -6, weaponAngle: 158, handRAngle: 6, upperArmLAngle: 28, forearmLAngle: -52, thighLAngle: 20, shinLAngle: 6, thighRAngle: -24, shinRAngle: 20 }, ease: 'linear' },
      { t: 0.76, pose: { rootX: 6, rootY: -2, torsoAngle: 5, upperArmRAngle: -58, forearmRAngle: -26, weaponAngle: 112, hairAngleL: 12 }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: -1, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76 }, ease: 'smooth' },
    ]);
  }

  // 4. ATTACK 2 (Warrior: 2타 올려베기 / Mage: 2타 트윈 나선탄)
  if (clipId === 'attack_02') {
    if (isWarrior) {
      return sampleKeyframes(classId, t, [
        { t: 0.00, pose: { rootX: 0, torsoAngle: 2, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92 } },
        { t: 0.26, pose: { rootX: 6, torsoAngle: 20, headAngle: -8, capeAngle: 16, upperArmRAngle: -18, forearmRAngle: -16, weaponAngle: 108, upperArmLAngle: 32, forearmLAngle: -42, thighLAngle: 28, shinLAngle: 32, thighRAngle: -32, shinRAngle: 42 }, ease: 'smooth' },
        { t: 0.50, pose: { rootX: 38, rootY: -10, torsoAngle: -12, headAngle: 8, capeAngle: 34, upperArmRAngle: -116, forearmRAngle: -18, weaponAngle: 98, upperArmLAngle: -52, forearmLAngle: -44, thighLAngle: 22, shinLAngle: 8, thighRAngle: -28, shinRAngle: 18, groundLock: false }, ease: 'linear' },
        { t: 0.76, pose: { rootX: 18, rootY: -2, torsoAngle: -5, capeAngle: 18, upperArmRAngle: -78, forearmRAngle: -32, weaponAngle: 84 }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 0, rootY: 0, torsoAngle: 2, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92 }, ease: 'smooth' },
      ]);
    }
    // Mage Attack2: Twirling staff forward-up + offhand crystal orb focus
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { rootX: 0, rootY: -1, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76 } },
      { t: 0.28, pose: { rootX: -6, rootY: -8, torsoAngle: -10, hairAngleL: 16, hairAngleR: -18, upperArmRAngle: -106, forearmRAngle: -14, weaponAngle: 142, upperArmLAngle: -52, forearmLAngle: -36, offhandVisible: true, offhandScale: 0.9, groundLock: false }, ease: 'smooth' },
      { t: 0.54, pose: { rootX: 20, rootY: -12, torsoAngle: 14, hairAngleL: 28, hairAngleR: -22, upperArmRAngle: -72, forearmRAngle: -8, weaponAngle: 152, upperArmLAngle: -68, forearmLAngle: -22, offhandVisible: true, offhandScale: 1.05, groundLock: false }, ease: 'linear' },
      { t: 0.80, pose: { rootX: 6, rootY: -3, torsoAngle: 4, upperArmRAngle: -48, forearmRAngle: -28, weaponAngle: 102, offhandVisible: false, groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: -1, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76 }, ease: 'smooth' },
    ]);
  }

  // 5. ATTACK 3 (Warrior: 3타 도약 강타 / Mage: 3타 비전 노바 부유 시전)
  if (clipId === 'attack_03') {
    if (isWarrior) {
      return sampleKeyframes(classId, t, [
        { t: 0.00, pose: { rootX: 0, rootY: 0, torsoAngle: 2, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92 } },
        { t: 0.18, pose: { rootX: -8, rootY: 4, torsoAngle: 16, headAngle: -6, capeAngle: 12, upperArmRAngle: -18, forearmRAngle: -55, weaponAngle: 74, thighLAngle: 36, shinLAngle: 46, thighRAngle: -36, shinRAngle: 52, groundLock: true }, ease: 'smooth' },
        { t: 0.38, pose: { rootX: 24, rootY: -32, torsoAngle: -14, headAngle: 10, capeAngle: 44, upperArmRAngle: -124, forearmRAngle: -14, weaponAngle: 124, upperArmLAngle: -108, forearmLAngle: -24, thighLAngle: 24, shinLAngle: 42, thighRAngle: -54, shinRAngle: 76, groundLock: false }, ease: 'smooth' },
        { t: 0.56, pose: { rootX: 48, rootY: 2, torsoAngle: 26, headAngle: -12, capeAngle: 52, upperArmRAngle: -70, forearmRAngle: -10, weaponAngle: 128, upperArmLAngle: -48, forearmLAngle: -22, thighLAngle: 34, shinLAngle: 34, thighRAngle: -46, shinRAngle: 54, groundLock: true }, ease: 'linear' },
        { t: 0.78, pose: { rootX: 24, rootY: -3, torsoAngle: 12, capeAngle: 22, upperArmRAngle: -54, forearmRAngle: -28, weaponAngle: 112, thighLAngle: 24, shinLAngle: 18, thighRAngle: -30, shinRAngle: 28, groundLock: true }, ease: 'smooth' },
        { t: 1.00, pose: { rootX: 0, rootY: 0, torsoAngle: 2, capeAngle: 6, upperArmRAngle: -24, forearmRAngle: -52, weaponAngle: 92, groundLock: true }, ease: 'smooth' },
      ]);
    }
    // Mage Attack3: High Arcane Levitation -> Raise Staff Forward-High Overhead -> Hurl Arcane Nova -> Graceful Touchdown
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { rootX: 0, rootY: -2, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76, groundLock: false } },
      { t: 0.30, pose: { rootX: -4, rootY: -24, torsoAngle: -12, headAngle: 10, capeAngle: -14, hairAngleL: 34, hairAngleR: -32, upperArmRAngle: -120, forearmRAngle: -14, weaponAngle: 148, upperArmLAngle: -108, forearmLAngle: -20, offhandVisible: true, offhandScale: 1.15, thighLAngle: 18, shinLAngle: 32, thighRAngle: -28, shinRAngle: 44, groundLock: false }, ease: 'smooth' },
      { t: 0.56, pose: { rootX: 22, rootY: -16, torsoAngle: 18, headAngle: -10, capeAngle: 34, hairAngleL: 42, hairAngleR: -20, upperArmRAngle: -82, forearmRAngle: -10, weaponAngle: 108, upperArmLAngle: -54, forearmLAngle: -16, offhandVisible: true, offhandScale: 0.9, thighLAngle: 24, shinLAngle: 20, thighRAngle: -22, shinRAngle: 26, groundLock: false }, ease: 'linear' },
      { t: 0.80, pose: { rootX: 8, rootY: 1, torsoAngle: 5, capeAngle: 14, hairAngleL: 16, hairAngleR: -12, thighLAngle: 20, shinLAngle: 26, thighRAngle: -24, shinRAngle: 28, offhandVisible: false, groundLock: true }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: -2, torsoAngle: 1, upperArmRAngle: -38, forearmRAngle: -34, weaponAngle: 76, groundLock: false }, ease: 'smooth' },
    ]);
  }

  // 6. HIT (Recoil knockback + hit expression, legs grounded)
  if (clipId === 'hit') {
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { expression: 'hit', torsoAngle: -6, headAngle: 6, offhandVisible: isWarrior } },
      { t: 0.32, pose: { rootX: -12, expression: 'hit', offhandVisible: isWarrior, torsoAngle: -20, headAngle: 14, capeAngle: -16, hairAngleL: -18, hairAngleR: 16, upperArmLAngle: -48, forearmLAngle: -48, offhandScale: 1.0, upperArmRAngle: 16, forearmRAngle: -65, weaponAngle: 56, thighLAngle: 26, shinLAngle: 20, thighRAngle: -16, shinRAngle: 24, groundLock: true }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, expression: 'normal', offhandVisible: false, groundLock: true }, ease: 'smooth' },
    ]);
  }

  // 7. VICTORY (Cheerful Hop & Raised Sword / Staff + Happy Expression)
  if (clipId === 'victory') {
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { expression: 'victory', groundLock: true } },
      { t: 0.38, pose: { rootY: -18, expression: 'victory', torsoAngle: -8, headAngle: 6, capeAngle: 28, hairAngleL: 34, hairAngleR: -34, upperArmRAngle: -154, forearmRAngle: -12, weaponAngle: 12, upperArmLAngle: -126, forearmLAngle: -20, thighLAngle: 20, shinLAngle: 38, thighRAngle: -24, shinRAngle: 44, groundLock: false }, ease: 'smooth' },
      { t: 0.72, pose: { rootY: -4, expression: 'victory', torsoAngle: -4, upperArmRAngle: -144, forearmRAngle: -18, weaponAngle: 18, upperArmLAngle: -118, groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootY: 0, expression: 'victory', groundLock: true }, ease: 'smooth' },
    ]);
  }

  // 8. DEFEAT (Knee Drop -> Slump Forward Collapse + Defeat Expression)
  if (clipId === 'defeat') {
    return sampleKeyframes(classId, t, [
      { t: 0.00, pose: { expression: 'defeat', groundLock: true } },
      { t: 0.35, pose: { rootX: -12, rootY: 8, expression: 'defeat', torsoAngle: -16, headAngle: 16, upperArmRAngle: 24, forearmRAngle: -20, weaponAngle: 110, thighLAngle: 42, shinLAngle: 68, thighRAngle: -24, shinRAngle: 76, groundLock: true }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: -20, rootY: 20, pelvisY: -26, expression: 'defeat', pelvisAngle: -18, torsoAngle: -28, headAngle: 26, capeAngle: -28, upperArmLAngle: 48, forearmLAngle: -12, upperArmRAngle: 38, forearmRAngle: -18, weaponAngle: 96, thighLAngle: 58, shinLAngle: 86, thighRAngle: 22, shinRAngle: 88, rootAlpha: 0.85, groundLock: false }, ease: 'smooth' },
    ]);
  }

  // =========================================================================
  // 9. WARRIOR SKILL MOTION SUB-CLIPS (Distinct Choreography per Skill Family!)
  // =========================================================================
  if (clipId === 'skill_warrior_shield_bash') {
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { offhandVisible: true, offhandScale: 1.0, groundLock: true } },
      { t: 0.25, pose: { rootX: -14, torsoAngle: -12, offhandVisible: true, upperArmLAngle: 12, forearmLAngle: -68, offhandAngle: 0, offhandScale: 1.15, upperArmRAngle: -20, forearmRAngle: -48, weaponAngle: 48, thighLAngle: 28, thighRAngle: -32, shinRAngle: 24 }, ease: 'smooth' },
      { t: 0.50, pose: { rootX: 48, torsoAngle: 20, offhandVisible: true, upperArmLAngle: -92, forearmLAngle: -10, offhandAngle: -18, offhandScale: 1.28, upperArmRAngle: -12, forearmRAngle: -40, weaponAngle: 42, thighLAngle: 36, shinLAngle: 10, thighRAngle: -44, shinRAngle: 38 }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, offhandVisible: false, offhandScale: 0.85, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_spin') {
    // 360 Whirlwind Pose: Sword swept horizontally outward while body twists
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.20, pose: { rootX: -8, torsoAngle: -20, upperArmRAngle: 48, forearmRAngle: -18, weaponAngle: -10, upperArmLAngle: 38, capeAngle: 32 }, ease: 'smooth' },
      { t: 0.45, pose: { rootX: 38, rootY: -12, torsoScaleX: 1.04, torsoAngle: 14, capeAngle: 64, upperArmRAngle: -94, forearmRAngle: -10, weaponAngle: 94, upperArmLAngle: 86, forearmLAngle: 10, thighLAngle: -24, thighRAngle: 24, groundLock: false }, ease: 'linear' },
      { t: 0.72, pose: { rootX: 42, rootY: -6, torsoScaleX: 1.0, torsoAngle: 18, capeAngle: 48, upperArmRAngle: -96, forearmRAngle: -14, weaponAngle: 108, weaponFrontOfTorso: true, groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, torsoScaleX: 1.0, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_multi_slash') {
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.20, pose: { rootX: -12, torsoAngle: -14, upperArmRAngle: -138, forearmRAngle: -30, weaponAngle: 16, capeAngle: -10 } },
      { t: 0.38, pose: { rootX: 46, torsoAngle: 22, upperArmRAngle: -78, forearmRAngle: -16, weaponAngle: 118, weaponFrontOfTorso: true }, ease: 'linear' },
      { t: 0.56, pose: { rootX: 52, rootY: -8, torsoAngle: -14, upperArmRAngle: -146, forearmRAngle: -18, weaponAngle: 20, groundLock: false }, ease: 'linear' },
      { t: 0.74, pose: { rootX: 36, rootY: 0, torsoAngle: 18, upperArmRAngle: -88, forearmRAngle: -12, weaponAngle: 112, groundLock: true }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_ground_slam') {
    return evaluateHeroClipPose('warrior', 'attack_03', t);
  }

  if (clipId === 'skill_warrior_sky_sword') {
    // Sword Wave: Pull sword straight back then thrust forward launching sonic crescent from weaponTip
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.26, pose: { rootX: -12, torsoAngle: -18, upperArmRAngle: 46, forearmRAngle: -58, weaponAngle: -32, capeAngle: -12, thighLAngle: 28, thighRAngle: -28 }, ease: 'smooth' },
      { t: 0.52, pose: { rootX: 32, torsoAngle: 22, upperArmRAngle: -92, forearmRAngle: -8, weaponAngle: 92, capeAngle: 36, weaponFrontOfTorso: true }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_roar_buff') {
    // Iron Fortress / Blood Thirst: Hero raises shield & sword skyward, chest expanded & cape flaring wide
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { offhandVisible: true, groundLock: true } },
      { t: 0.28, pose: { rootY: 4, torsoAngle: 8, offhandVisible: true, torsoScaleX: 1.06, torsoScaleY: 0.94, upperArmLAngle: 12, forearmLAngle: -72, upperArmRAngle: 18, forearmRAngle: -64, thighLAngle: 28, shinLAngle: 32, thighRAngle: -28, shinRAngle: 36 }, ease: 'smooth' },
      { t: 0.54, pose: { rootY: -6, torsoAngle: -14, offhandVisible: true, torsoScaleX: 1.08, torsoScaleY: 1.06, headAngle: 12, capeAngle: 46, upperArmLAngle: -88, forearmLAngle: -36, offhandScale: 1.2, upperArmRAngle: -152, forearmRAngle: -16, weaponAngle: 12, weaponFrontOfTorso: true, groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootY: 0, offhandVisible: false, offhandScale: 0.85, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_awakening') {
    // Sword Master Awakening (천공의 검 / 라그나로크): Ascension leap -> Two-hand Golden Sovereign Overhead Hold -> Heaven-Splitting Downward Strike
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { groundLock: true, weaponFrontOfTorso: true } },
      { t: 0.16, pose: { rootX: -12, rootY: 4, torsoAngle: 14, thighLAngle: 34, shinLAngle: 42, thighRAngle: -32, shinRAngle: 44, capeAngle: 20, upperArmRAngle: -18, weaponAngle: 78, weaponFrontOfTorso: true, groundLock: true }, ease: 'smooth' },
      { t: 0.42, pose: { rootX: 22, rootY: -30, torsoAngle: -14, headAngle: 10, capeAngle: 62, upperArmRAngle: -132, forearmRAngle: -14, weaponAngle: 132, weaponScale: 1.24, upperArmLAngle: -122, forearmLAngle: -18, weaponFrontOfTorso: true, thighLAngle: 18, shinLAngle: 38, thighRAngle: -46, shinRAngle: 64, groundLock: false }, ease: 'smooth' },
      { t: 0.62, pose: { rootX: 56, rootY: 0, torsoAngle: 30, headAngle: -14, capeAngle: 54, upperArmRAngle: -66, forearmRAngle: -10, weaponAngle: 128, weaponScale: 1.28, upperArmLAngle: -46, forearmLAngle: -18, weaponFrontOfTorso: true, thighLAngle: 36, shinLAngle: 26, thighRAngle: -48, shinRAngle: 48, groundLock: true }, ease: 'linear' },
      { t: 0.84, pose: { rootX: 30, rootY: 0, torsoAngle: 16, weaponAngle: 118, weaponScale: 1.12, weaponFrontOfTorso: true, groundLock: true }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: 0, weaponScale: 1.0, groundLock: true }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_warrior_heavy_slash') {
    return sampleKeyframes('warrior', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.28, pose: { rootX: -12, torsoAngle: -16, upperArmRAngle: -148, forearmRAngle: -32, weaponAngle: -18, upperArmLAngle: -48, capeAngle: -12 }, ease: 'smooth' },
      { t: 0.54, pose: { rootX: 48, torsoAngle: 26, upperArmRAngle: -72, forearmRAngle: -14, weaponAngle: 124, weaponScale: 1.12, weaponFrontOfTorso: true, capeAngle: 42 }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, weaponScale: 1.0, groundLock: true }, ease: 'smooth' },
    ]);
  }

  // =========================================================================
  // 10. MAGE SKILL MOTION SUB-CLIPS (Distinct Choreography per Spell Family!)
  // =========================================================================
  if (clipId === 'skill_mage_sky_call') {
    // Chain Lightning / Thunder / Blizzard: Lift skyward raising crystal staff straight overhead
    return sampleKeyframes('mage', t, [
      { t: 0.00, pose: { rootY: -2, groundLock: false } },
      { t: 0.30, pose: { rootX: -4, rootY: -24, torsoAngle: -16, headAngle: 14, hairAngleL: 36, hairAngleR: -34, capeAngle: -12, upperArmRAngle: -158, forearmRAngle: -14, weaponAngle: 178, upperArmLAngle: -112, forearmLAngle: -24, offhandVisible: true, thighLAngle: 16, shinLAngle: 28, thighRAngle: -24, shinRAngle: 38, groundLock: false }, ease: 'smooth' },
      { t: 0.58, pose: { rootX: 12, rootY: -18, torsoAngle: 10, hairAngleL: 44, hairAngleR: -28, capeAngle: 26, upperArmRAngle: -122, forearmRAngle: -12, weaponAngle: 162, upperArmLAngle: -72, offhandVisible: true, offhandScale: 1.12, groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: -2, offhandVisible: false, groundLock: false }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_mage_ground_ritual') {
    // Flame Pillar / Gravity Well / Meteor: Tap staff crystal down then erupt upward!
    return sampleKeyframes('mage', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.28, pose: { rootY: 4, torsoAngle: 18, upperArmRAngle: -64, forearmRAngle: -20, weaponAngle: 168, upperArmLAngle: 18, thighLAngle: 26, shinLAngle: 36, thighRAngle: -24, shinRAngle: 38, groundLock: true }, ease: 'smooth' },
      { t: 0.56, pose: { rootX: 10, rootY: -20, torsoAngle: -12, headAngle: 10, hairAngleL: 38, hairAngleR: -38, capeAngle: 24, upperArmRAngle: -136, forearmRAngle: -18, weaponAngle: 168, upperArmLAngle: -124, forearmLAngle: -18, offhandVisible: true, offhandScale: 1.15, groundLock: false }, ease: 'smooth' },
      { t: 1.00, pose: { rootX: 0, rootY: -2, offhandVisible: false, groundLock: false }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_mage_nova_barrier') {
    // Frost Nova / Arcane Familiar: Crouch gathering -> Radial Spread Burst with both arms wide
    return sampleKeyframes('mage', t, [
      { t: 0.00, pose: { groundLock: true } },
      { t: 0.26, pose: { rootY: 5, torsoAngle: 10, upperArmRAngle: -22, forearmRAngle: -66, weaponAngle: 104, upperArmLAngle: -28, forearmLAngle: -68, thighLAngle: 26, shinLAngle: 32, thighRAngle: -24, shinRAngle: 32, groundLock: true }, ease: 'smooth' },
      { t: 0.54, pose: { rootY: -14, torsoAngle: -8, hairAngleL: 46, hairAngleR: -44, capeAngle: 30, upperArmRAngle: -102, forearmRAngle: -10, weaponAngle: 138, upperArmLAngle: 68, forearmLAngle: -12, offhandVisible: true, offhandScale: 1.2, groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootY: -2, offhandVisible: false, groundLock: false }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_mage_focus_orb') {
    // Mana Burst / Arcane Orb: Aim crystal forward straight toward monster + lean bracing recoil
    return sampleKeyframes('mage', t, [
      { t: 0.00, pose: { rootY: -2, groundLock: false } },
      { t: 0.28, pose: { rootX: -10, rootY: -8, torsoAngle: -14, upperArmRAngle: -48, forearmRAngle: -58, weaponAngle: 122, upperArmLAngle: -68, forearmLAngle: -46, offhandVisible: true, groundLock: false }, ease: 'smooth' },
      { t: 0.54, pose: { rootX: 18, rootY: -10, torsoAngle: 12, hairAngleL: 34, hairAngleR: -24, upperArmRAngle: -88, forearmRAngle: -4, weaponAngle: 168, upperArmLAngle: -82, forearmLAngle: -12, offhandVisible: true, offhandScale: 1.22, groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: -2, offhandVisible: false, groundLock: false }, ease: 'smooth' },
    ]);
  }

  if (clipId === 'skill_mage_awakening') {
    // Archmage Awakening (천벌의 비전성좌 / 절대영도): Grand Sky Levitation + Cosmic Constellation Pose
    return sampleKeyframes('mage', t, [
      { t: 0.00, pose: { rootY: -2, groundLock: false } },
      { t: 0.18, pose: { rootY: -6, torsoAngle: 10, thighLAngle: 22, shinLAngle: 30, thighRAngle: -22, shinRAngle: 32, groundLock: false }, ease: 'smooth' },
      { t: 0.44, pose: { rootX: -8, rootY: -44, torsoAngle: -18, headAngle: 14, hairAngleL: 48, hairAngleR: -48, capeAngle: 36, upperArmRAngle: -162, forearmRAngle: -10, weaponAngle: 180, weaponScale: 1.22, upperArmLAngle: -138, forearmLAngle: -16, offhandVisible: true, offhandScale: 1.35, thighLAngle: 18, shinLAngle: 34, thighRAngle: -28, shinRAngle: 42, groundLock: false }, ease: 'smooth' },
      { t: 0.64, pose: { rootX: 22, rootY: -30, torsoAngle: 20, headAngle: -10, hairAngleL: 54, capeAngle: 44, upperArmRAngle: -86, forearmRAngle: -8, weaponAngle: 164, weaponScale: 1.22, upperArmLAngle: -78, forearmLAngle: -12, offhandVisible: true, offhandScale: 1.2, groundLock: false }, ease: 'linear' },
      { t: 1.00, pose: { rootX: 0, rootY: -2, weaponScale: 1.0, offhandVisible: false, groundLock: false }, ease: 'smooth' },
    ]);
  }

  // Default Mage skill cast ('skill_mage_projectile'): Forward crisp aim thrust
  return sampleKeyframes('mage', t, [
    { t: 0.00, pose: { rootY: -2, groundLock: false } },
    { t: 0.28, pose: { rootX: -8, rootY: -10, torsoAngle: -12, upperArmRAngle: -34, forearmRAngle: -42, weaponAngle: 96, upperArmLAngle: -46, groundLock: false }, ease: 'smooth' },
    { t: 0.54, pose: { rootX: 20, rootY: -12, torsoAngle: 16, hairAngleL: 34, upperArmRAngle: -84, forearmRAngle: -6, weaponAngle: 158, groundLock: false }, ease: 'linear' },
    { t: 1.00, pose: { rootX: 0, rootY: -2, groundLock: false }, ease: 'smooth' },
  ]);
}

// =========================================================================
// 2D Matrix Forward Kinematics Solver
// =========================================================================

function matIdentity(): Mat2D {
  return [1, 0, 0, 1, 0, 0];
}

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

function matTranslate(m: Mat2D, tx: number, ty: number): Mat2D {
  return matMul(m, [1, 0, 0, 1, tx, ty]);
}

function matRotateDeg(m: Mat2D, deg: number): Mat2D {
  const rad = deg * DEG_TO_RAD;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return matMul(m, [c, s, -s, c, 0, 0]);
}

function matScale(m: Mat2D, sx: number, sy: number): Mat2D {
  return matMul(m, [sx, 0, 0, sy, 0, 0]);
}

export function applyMatPoint(m: Mat2D, p: Vec2): Vec2 {
  return {
    x: m[0] * p.x + m[2] * p.y + m[4],
    y: m[1] * p.x + m[3] * p.y + m[5],
  };
}

export interface SolvedSkeletonFrame {
  matrices: Record<HeroPartId, Mat2D>;
  drawOrder: HeroPartId[];
  attachments: HeroAttachmentPoints;
  expression: HeadExpression;
  offhandVisible: boolean;
  rootAlpha: number;
}

export function solveHeroSkeleton(
  classId: CharacterClassId,
  pose: HeroSkeletonPose,
  groundX: number = RIG_DEFAULT_CENTER_X,
  groundY: number = RIG_DEFAULT_GROUND_Y,
  rigScale: number = 1.0
): SolvedSkeletonFrame {
  const geo = CLASS_BONE_GEOMETRY[classId];

  const evaluateWithRootYOffset = (yOffset: number): SolvedSkeletonFrame => {
    let mRoot = matIdentity();
    mRoot = matTranslate(mRoot, groundX + pose.rootX * rigScale, groundY + (pose.rootY + yOffset) * rigScale);
    mRoot = matScale(mRoot, rigScale, rigScale);

    // Pelvis sits at (0, pelvisY)
    let mPelvis = matTranslate(mRoot, 0, pose.pelvisY);
    mPelvis = matRotateDeg(mPelvis, pose.pelvisAngle);

    // Left / Near Leg
    let mThighL = matTranslate(mPelvis, geo.pelvisToHipL.x, geo.pelvisToHipL.y);
    mThighL = matRotateDeg(mThighL, pose.thighLAngle);
    let mShinL = matTranslate(mThighL, 0, geo.thighLen);
    mShinL = matRotateDeg(mShinL, pose.shinLAngle);
    let mFootL = matTranslate(mShinL, 0, geo.shinLen);
    mFootL = matRotateDeg(mFootL, pose.footLAngle);

    // Right / Far Leg
    let mThighR = matTranslate(mPelvis, geo.pelvisToHipR.x, geo.pelvisToHipR.y);
    mThighR = matRotateDeg(mThighR, pose.thighRAngle);
    let mShinR = matTranslate(mThighR, 0, geo.thighLen);
    mShinR = matRotateDeg(mShinR, pose.shinRAngle);
    let mFootR = matTranslate(mShinR, 0, geo.shinLen);
    mFootR = matRotateDeg(mFootR, pose.footRAngle);

    // Torso (keep child joint frame unscaled so head/face proportions never stretch)
    let mTorso = matTranslate(mPelvis, geo.pelvisToTorso.x, geo.pelvisToTorso.y);
    mTorso = matRotateDeg(mTorso, pose.torsoAngle);
    const mTorsoDraw = matScale(mTorso, pose.torsoScaleX ?? 1, pose.torsoScaleY ?? 1);

    // Cape behind torso
    let mCape = matTranslate(mTorso, geo.torsoToCape.x, geo.torsoToCape.y);
    mCape = matRotateDeg(mCape, pose.capeAngle);

    // Head & Mage Twin Ponytails
    let mHead = matTranslate(mTorso, geo.torsoToHead.x, geo.torsoToHead.y);
    mHead = matRotateDeg(mHead, pose.headAngle);
    let mHairL = matTranslate(mHead, geo.headToHairL.x, geo.headToHairL.y);
    mHairL = matRotateDeg(mHairL, pose.hairAngleL);
    let mHairR = matTranslate(mHead, geo.headToHairR.x, geo.headToHairR.y);
    mHairR = matRotateDeg(mHairR, pose.hairAngleR);

    // Trailing / Near Arm (_l) + Offhand Shield/Orb
    let mUpperArmL = matTranslate(mTorso, geo.torsoToShoulderL.x, geo.torsoToShoulderL.y);
    mUpperArmL = matRotateDeg(mUpperArmL, pose.upperArmLAngle);
    let mForearmL = matTranslate(mUpperArmL, 0, geo.upperArmLen);
    mForearmL = matRotateDeg(mForearmL, pose.forearmLAngle);
    let mHandL = matTranslate(mForearmL, 0, geo.forearmLen);
    mHandL = matRotateDeg(mHandL, pose.handLAngle);
    let mOffhand = matTranslate(mForearmL, geo.forearmToOffhand.x, geo.forearmToOffhand.y);
    mOffhand = matRotateDeg(mOffhand, pose.offhandAngle);
    const ohS = pose.offhandScale ?? 1;
    mOffhand = matScale(mOffhand, ohS, ohS);

    // Leading / Primary Weapon Arm (_r) + Sword / Crystal Staff
    let mUpperArmR = matTranslate(mTorso, geo.torsoToShoulderR.x, geo.torsoToShoulderR.y);
    mUpperArmR = matRotateDeg(mUpperArmR, pose.upperArmRAngle);
    let mForearmR = matTranslate(mUpperArmR, 0, geo.upperArmLen);
    mForearmR = matRotateDeg(mForearmR, pose.forearmRAngle);
    let mHandR = matTranslate(mForearmR, 0, geo.forearmLen);
    mHandR = matRotateDeg(mHandR, pose.handRAngle);
    let mWeapon = matTranslate(mHandR, geo.handToGrip.x, geo.handToGrip.y);
    mWeapon = matRotateDeg(mWeapon, pose.weaponAngle);
    const wpS = pose.weaponScale ?? 1;
    mWeapon = matScale(mWeapon, wpS, wpS);

    const soleL = applyMatPoint(mFootL, { x: 4, y: geo.ankleToSole });
    const soleR = applyMatPoint(mFootR, { x: 4, y: geo.ankleToSole });
    const gripWorld = applyMatPoint(mWeapon, { x: 0, y: 0 });
    const tipWorld = applyMatPoint(mWeapon, geo.weaponTipLocal);
    const bodyCenter = applyMatPoint(mTorso, { x: 0, y: -18 });
    const headCenter = applyMatPoint(mHead, { x: 0, y: -42 });

    const drawOrder: HeroPartId[] = classId === 'mage'
      ? [
          'cape',
          'hair_back_r',
          'thigh_r',
          'shin_r',
          'foot_r',
          'thigh_l',
          'shin_l',
          'foot_l',
          'pelvis',
          'torso',
          'hair_back_l',
          'head',
          'upper_arm_r',
          'forearm_r',
          'weapon',
          'hand_r',
          'upper_arm_l',
          'forearm_l',
          'hand_l',
          'offhand',
        ]
      : [
          'cape',
          'thigh_r',
          'shin_r',
          'foot_r',
          'thigh_l',
          'shin_l',
          'foot_l',
          'pelvis',
          'torso',
          'head',
          'upper_arm_l',
          'forearm_l',
          'hand_l',
          'offhand',
          'upper_arm_r',
          'forearm_r',
          'weapon',
          'hand_r',
        ];

    return {
      matrices: {
        cape: mCape,
        hair_back_l: mHairL,
        hair_back_r: mHairR,
        pelvis: mPelvis,
        torso: mTorsoDraw,
        head: mHead,
        upper_arm_l: mUpperArmL,
        forearm_l: mForearmL,
        hand_l: mHandL,
        offhand: mOffhand,
        upper_arm_r: mUpperArmR,
        forearm_r: mForearmR,
        hand_r: mHandR,
        weapon: mWeapon,
        thigh_l: mThighL,
        shin_l: mShinL,
        foot_l: mFootL,
        thigh_r: mThighR,
        shin_r: mShinR,
        foot_r: mFootR,
      },
      drawOrder,
      attachments: {
        weaponGrip: gripWorld,
        weaponTip: tipWorld,
        staffTip: tipWorld,
        leftHand: applyMatPoint(mHandL, geo.handToGrip),
        rightHand: gripWorld,
        leftFoot: soleL,
        rightFoot: soleR,
        groundContact: { x: bodyCenter.x, y: groundY },
        bodyCenter,
        headCenter,
        rootWorld: { x: groundX + pose.rootX * rigScale, y: groundY },
      },
      expression: pose.expression ?? 'normal',
      offhandVisible: pose.offhandVisible ?? false,
      rootAlpha: pose.rootAlpha ?? 1,
    };
  };

  let solved = evaluateWithRootYOffset(0);
  // Ground-lock pass: during grounded motions (idle, run, slash), clamp lowest boot sole cleanly onto groundY so feet never hover or sink!
  if (pose.groundLock) {
    const lowestFootY = Math.max(solved.attachments.leftFoot.y, solved.attachments.rightFoot.y);
    const correction = (groundY - lowestFootY) / Math.max(0.1, rigScale);
    if (Math.abs(correction) > 0.25) {
      solved = evaluateWithRootYOffset(correction);
    }
  }
  return solved;
}
