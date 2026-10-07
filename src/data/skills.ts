import { Skill } from '../types/game';

export const INITIAL_SKILLS: Skill[] = [
  // ==============================
  // ⚔️ Warrior Skill Pool (전사)
  // ==============================
  {
    id: 'power_slash',
    name: '파워 슬래시',
    rarity: 'common',
    classId: 'warrior',
    description: '검에 묵직한 투기를 담아 전방의 적을 강하게 내려칩니다.',
    baseDamageMult: 1.80, // ATK x 180%
    damageMultPerLevel: 0.10,
    cooldown: 5.0,
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'power_slash',
    hits: 1,
    icon: '⚔️',
    ownedAtk: 15,
    ownedHp: 100,
    ownedDef: 5,
    ownedCritDmg: 0,
  },
  {
    id: 'double_slash',
    name: '더블 슬래시',
    rarity: 'common',
    classId: 'warrior',
    description: '전광석화의 속도로 검을 교차해 2연속 참격을 입힙니다.',
    baseDamageMult: 1.05, // ATK x 105% x 2타
    damageMultPerLevel: 0.07,
    cooldown: 5.5,
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'double_slash',
    hits: 2,
    icon: '🗡️',
    ownedAtk: 20,
    ownedHp: 60,
    ownedDef: 0,
    ownedCritDmg: 2,
  },
  {
    id: 'sword_wave',
    name: '검기 방출',
    rarity: 'rare',
    classId: 'warrior',
    description: '검끝에서 예리한 초승달 모양의 비취 검기를 날려 적을 베어냅니다.',
    baseDamageMult: 1.60,
    damageMultPerLevel: 0.09,
    cooldown: 6.0,
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    owned: false,
    effectType: 'sword_wave',
    hits: 1,
    icon: '🌊',
    ownedAtk: 35,
    ownedHp: 220,
    ownedDef: 10,
    ownedCritDmg: 2,
  },
  {
    id: 'whirlwind',
    name: '회오리 베기',
    rarity: 'rare',
    classId: 'warrior',
    description: '회전하는 태풍처럼 칼날을 휘둘러 적에게 4연타의 큰 상흔을 남깁니다.',
    baseDamageMult: 0.95, // ATK x 95% x 4타
    damageMultPerLevel: 0.06,
    cooldown: 8.0,
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    owned: false,
    effectType: 'whirlwind',
    hits: 4,
    icon: '🌀',
    ownedAtk: 45,
    ownedHp: 150,
    ownedDef: 18,
    ownedCritDmg: 3,
  },
  {
    id: 'shield_bash',
    name: '방패 가격',
    rarity: 'epic',
    classId: 'warrior',
    description: '강철 방패로 적의 머리를 강타하여 적을 위축시키고 강력한 충격을 줍니다.',
    baseDamageMult: 2.10,
    damageMultPerLevel: 0.12,
    cooldown: 10.0,
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    owned: false,
    effectType: 'shield_bash',
    hits: 1,
    icon: '🛡️',
    ownedAtk: 60,
    ownedHp: 480,
    ownedDef: 35,
    ownedCritDmg: 0,
  },
  {
    id: 'blade_storm',
    name: '블레이드 스톰',
    rarity: 'legendary',
    classId: 'warrior',
    description: '무수한 잔상을 남기며 폭풍우 같은 6연타 검무를 펼칩니다. 보스전 우선 발동!',
    baseDamageMult: 0.70, // ATK x 70% x 6타 = 420%
    damageMultPerLevel: 0.08,
    cooldown: 12.0,
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    owned: false,
    effectType: 'blade_storm',
    bossPriority: true,
    hits: 6,
    icon: '🌪️',
    ownedAtk: 120,
    ownedHp: 650,
    ownedDef: 30,
    ownedCritDmg: 6,
  },
  {
    id: 'heavenly_blade',
    name: '천공의 검',
    rarity: 'mythic',
    classId: 'warrior',
    description: '소드 마스터의 극의. 황금 투기를 폭발시키며 하늘을 가르는 대검강 3연타를 작렬합니다.',
    baseDamageMult: 3.20, // 320% x 3타 = 960%
    damageMultPerLevel: 0.25,
    cooldown: 0,
    level: 1,
    pieces: 0,
    piecesRequired: 10,
    owned: false,
    isAwakening: true,
    effectType: 'heavenly_blade',
    hits: 3,
    icon: '👑⚡',
    ownedAtk: 260,
    ownedHp: 1600,
    ownedDef: 60,
    ownedCritDmg: 12,
  },

  // ==============================
  // 🔮 Mage Skill Pool (마법사)
  // ==============================
  {
    id: 'magic_missile',
    name: '매직 미사일',
    rarity: 'common',
    classId: 'mage',
    description: '순수한 마력으로 벼려낸 마탄 3발을 적을 향해 고속 투사합니다.',
    baseDamageMult: 0.60, // 60% x 3타 = 180%
    damageMultPerLevel: 0.05,
    cooldown: 4.5,
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'magic_missile',
    hits: 3,
    icon: '🔮',
    ownedAtk: 18,
    ownedHp: 70,
    ownedDef: 3,
    ownedCritDmg: 2,
  },
  {
    id: 'fireball',
    name: '파이어볼',
    rarity: 'common',
    classId: 'mage',
    description: '응축된 화염구를 날려 적중 시 거대한 열화 폭발을 일으킵니다.',
    baseDamageMult: 2.10, // MATK x 210%
    damageMultPerLevel: 0.12,
    cooldown: 6.0,
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'fireball',
    hits: 1,
    icon: '🔥',
    ownedAtk: 24,
    ownedHp: 90,
    ownedDef: 4,
    ownedCritDmg: 2,
  },
  {
    id: 'ice_spear',
    name: '아이스 스피어',
    rarity: 'rare',
    classId: 'mage',
    description: '절대영도의 얼음 창을 소환하여 적의 심장을 관통합니다.',
    baseDamageMult: 1.85,
    damageMultPerLevel: 0.10,
    cooldown: 7.0,
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    owned: false,
    effectType: 'ice_spear',
    hits: 1,
    icon: '❄️',
    ownedAtk: 38,
    ownedHp: 180,
    ownedDef: 12,
    ownedCritDmg: 3,
  },
  {
    id: 'chain_lightning',
    name: '체인 라이트닝',
    rarity: 'rare',
    classId: 'mage',
    description: '뇌운에서 전격을 끌어내려 적에게 3회 연속 벼락을 내리꽂습니다.',
    baseDamageMult: 1.15, // MATK x 115% x 3타
    damageMultPerLevel: 0.08,
    cooldown: 8.0,
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    owned: false,
    effectType: 'chain_lightning',
    hits: 3,
    icon: '⚡',
    ownedAtk: 48,
    ownedHp: 160,
    ownedDef: 10,
    ownedCritDmg: 4,
  },
  {
    id: 'meteor',
    name: '메테오',
    rarity: 'epic',
    classId: 'mage',
    description: '우주 저편에서 타오르는 거대 운석을 낙하시켜 전장을 뒤흔듭니다. 보스전 우선 발동!',
    baseDamageMult: 3.40,
    damageMultPerLevel: 0.20,
    cooldown: 13.0,
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    owned: false,
    effectType: 'meteor',
    bossPriority: true,
    hits: 1,
    icon: '☄️',
    ownedAtk: 85,
    ownedHp: 320,
    ownedDef: 20,
    ownedCritDmg: 6,
  },
  {
    id: 'arcane_storm',
    name: '아케인 스톰',
    rarity: 'legendary',
    classId: 'mage',
    description: '비전 마법의 소용돌이를 열어 5회 연속 차원 폭격을 가합니다.',
    baseDamageMult: 0.90, // MATK x 90% x 5타 = 450%
    damageMultPerLevel: 0.08,
    cooldown: 11.0,
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    owned: false,
    effectType: 'arcane_storm',
    hits: 5,
    icon: '🌌',
    ownedAtk: 135,
    ownedHp: 520,
    ownedDef: 25,
    ownedCritDmg: 8,
  },
  {
    id: 'astral_cataclysm',
    name: '천벌의 비전성좌',
    rarity: 'mythic',
    classId: 'mage',
    description: '아크메이지의 비의. 찬란한 성좌 게이트를 개방하여 별빛 운석 융단폭격을 쏟아붓습니다.',
    baseDamageMult: 2.00, // 200% x 5타 = 1000%
    damageMultPerLevel: 0.25,
    cooldown: 0,
    level: 1,
    pieces: 0,
    piecesRequired: 10,
    owned: false,
    isAwakening: true,
    effectType: 'astral_cataclysm',
    hits: 5,
    icon: '✨🌌',
    ownedAtk: 280,
    ownedHp: 1350,
    ownedDef: 50,
    ownedCritDmg: 14,
  },

  // Legacy mappings for backward compatibility
  {
    id: 'wind_blade',
    name: '바람의 칼날',
    rarity: 'rare',
    classId: 'warrior',
    description: '원거리에서 비취 검기를 날립니다.',
    baseDamageMult: 1.45,
    damageMultPerLevel: 0.08,
    cooldown: 4.0,
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'sword_wave',
    icon: '🌪️',
    ownedAtk: 30,
    ownedHp: 140,
    ownedDef: 8,
    ownedCritDmg: 2,
  },
  {
    id: 'meteor_slash',
    name: '유성 낙하 베기',
    rarity: 'legendary',
    classId: 'warrior',
    description: '붉은 유성을 소환해 대검격을 가합니다.',
    baseDamageMult: 3.50,
    damageMultPerLevel: 0.20,
    cooldown: 14.0,
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    owned: false,
    effectType: 'blade_storm',
    bossPriority: true,
    icon: '☄️',
    ownedAtk: 105,
    ownedHp: 580,
    ownedDef: 25,
    ownedCritDmg: 6,
  },
];

export const STARTER_EQUIPPED_SKILLS_WARRIOR: (string | null)[] = [
  'power_slash',
  'double_slash',
  null,
  null,
];

export const STARTER_EQUIPPED_SKILLS_MAGE: (string | null)[] = [
  'magic_missile',
  'fireball',
  null,
  null,
];

export const STARTER_EQUIPPED_SKILLS = STARTER_EQUIPPED_SKILLS_WARRIOR;

export function getSkillPiecesRequired(skill: Skill): number {
  const baseReq = skill.rarity === 'mythic' ? 10 : skill.rarity === 'legendary' ? 5 : skill.rarity === 'epic' ? 4 : skill.rarity === 'rare' ? 3 : 2;
  const growthRate = skill.rarity === 'mythic' ? 8 : skill.rarity === 'legendary' ? 5 : skill.rarity === 'epic' ? 4 : skill.rarity === 'rare' ? 3 : 2;
  return baseReq + (skill.level - 1) * growthRate;
}

export function getSkillUpgradeGoldCost(skill: Skill): number {
  const baseCost = skill.rarity === 'mythic' ? 10000 : skill.rarity === 'legendary' ? 5000 : skill.rarity === 'epic' ? 2500 : skill.rarity === 'rare' ? 1000 : 400;
  return baseCost * skill.level;
}

export function calculateSkillOwnedStats(skill: Skill): {
  ownedAtk: number;
  ownedHp: number;
  ownedDef: number;
  ownedCritDmg: number;
} {
  if (!skill.owned) {
    return { ownedAtk: 0, ownedHp: 0, ownedDef: 0, ownedCritDmg: 0 };
  }
  const levelMult = 1 + (skill.level - 1) * 0.15;
  return {
    ownedAtk: Math.floor((skill.ownedAtk || 0) * levelMult),
    ownedHp: Math.floor((skill.ownedHp || 0) * levelMult),
    ownedDef: Math.floor((skill.ownedDef || 0) * levelMult),
    ownedCritDmg: Number(((skill.ownedCritDmg || 0) * levelMult).toFixed(1)),
  };
}

export function calculateTotalSkillOwnedBonus(skills: Skill[]): {
  ownedAtk: number;
  ownedHp: number;
  ownedDef: number;
  ownedCritDmg: number;
} {
  let totalAtk = 0;
  let totalHp = 0;
  let totalDef = 0;
  let totalCritDmg = 0;

  for (const skill of skills) {
    if (skill.owned) {
      const stats = calculateSkillOwnedStats(skill);
      totalAtk += stats.ownedAtk;
      totalHp += stats.ownedHp;
      totalDef += stats.ownedDef;
      totalCritDmg += stats.ownedCritDmg;
    }
  }

  return {
    ownedAtk: totalAtk,
    ownedHp: totalHp,
    ownedDef: totalDef,
    ownedCritDmg: Number(totalCritDmg.toFixed(1)),
  };
}

/**
 * Calculates Expected DPS / combat rating for a skill to drive Smart Auto-Equip.
 */
export function calculateSkillPowerScore(skill: Skill): number {
  if (skill.isAwakening) return 999999;
  const currentMult = skill.baseDamageMult + (skill.level - 1) * skill.damageMultPerLevel;
  const hits = skill.hits || 1;
  const totalMult = currentMult * hits;
  const cd = Math.max(skill.cooldown, 1);
  const dpsWeight = (totalMult / cd) * 100;
  const bossBonus = skill.bossPriority ? 30 : 0;
  const rarityBonus = skill.rarity === 'mythic' ? 50 : skill.rarity === 'legendary' ? 35 : skill.rarity === 'epic' ? 20 : skill.rarity === 'rare' ? 10 : 0;
  return Math.round(dpsWeight + bossBonus + rarityBonus + skill.level * 5);
}

