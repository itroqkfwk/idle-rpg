import { Equipment, EquipmentRarity, EquipmentSlot } from '../types/game';

export interface RarityConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  multiplier: number;
}

export const RARITY_CONFIGS: Record<EquipmentRarity, RarityConfig> = {
  common: {
    label: '일반',
    color: '#64748b',
    bgColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    glowColor: 'transparent',
    multiplier: 1.0,
  },
  rare: {
    label: '희귀',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    borderColor: '#7dd3fc',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    multiplier: 1.8,
  },
  epic: {
    label: '영웅',
    color: '#9333ea',
    bgColor: '#f3e8ff',
    borderColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    multiplier: 3.2,
  },
  legendary: {
    label: '전설',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fcd34d',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    multiplier: 6.0,
  },
  mythic: {
    label: '신화',
    color: '#e11d48',
    bgColor: '#ffe4e6',
    borderColor: '#fda4af',
    glowColor: 'rgba(244, 63, 94, 0.75)',
    multiplier: 12.0,
  },
};

/**
 * Calculates pieces required for next level based on current level and rarity curve.
 * Lv.1: 2, Lv.2: 3, Lv.3: 4, Lv.4: 5, with gentle scaling thereafter.
 */
export function getEquipmentPiecesRequired(level: number, rarity: EquipmentRarity): number {
  const rarityMult = rarity === 'mythic' ? 1.5 : rarity === 'legendary' ? 1.3 : rarity === 'epic' ? 1.15 : 1.0;
  if (level === 1) return Math.floor(2 * rarityMult);
  if (level === 2) return Math.floor(3 * rarityMult);
  if (level === 3) return Math.floor(4 * rarityMult);
  if (level === 4) return Math.floor(5 * rarityMult);
  return Math.floor((5 + (level - 4) * 1.5) * rarityMult);
}

/**
 * Upgrade gold cost based on level and rarity.
 */
export function getEquipmentUpgradeGoldCost(level: number, rarity: EquipmentRarity): number {
  const mult = RARITY_CONFIGS[rarity].multiplier;
  return Math.floor(60 * Math.pow(1.14, level - 1) * mult);
}

/**
 * Calculate actual equipped effect stats scaling with level.
 */
export function calculateEquipmentEquippedStats(item: Equipment): {
  atk: number;
  hp: number;
  def: number;
  critRate: number;
  critDmg: number;
} {
  const growth = 1 + (item.level - 1) * 0.16;
  return {
    atk: Math.floor(item.atk * growth),
    hp: Math.floor(item.hp * growth),
    def: Math.floor(item.def * growth),
    critRate: item.critRate || 0,
    critDmg: item.critDmg || 0,
  };
}

/**
 * Calculate actual owned effect stats scaling with level.
 */
export function calculateEquipmentOwnedStats(item: Equipment): {
  ownedAtk: number;
  ownedHp: number;
  ownedDef: number;
  ownedCritRate: number;
} {
  if (!item.owned) {
    return { ownedAtk: 0, ownedHp: 0, ownedDef: 0, ownedCritRate: 0 };
  }
  const growth = 1 + (item.level - 1) * 0.12;
  return {
    ownedAtk: Math.floor(item.ownedAtk * growth),
    ownedHp: Math.floor(item.ownedHp * growth),
    ownedDef: Math.floor(item.ownedDef * growth),
    ownedCritRate: item.ownedCritRate ? Number((item.ownedCritRate * growth).toFixed(3)) : 0,
  };
}


/**
 * Master catalog of 20 canonical equipment items (4 slots x 5 rarities).
 */
export const MASTER_EQUIPMENT_LIST: Equipment[] = [
  // ==========================================
  // ⚔️ WEAPONS (무기)
  // ==========================================
  {
    id: 'wp_wood_sword',
    name: '수련용 목검',
    slot: 'weapon',
    rarity: 'common',
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    ownedCount: 1,
    owned: true,
    atk: 10,
    hp: 0,
    def: 0,
    critRate: 0.02,
    critDmg: 0.05,
    ownedAtk: 4,
    ownedHp: 15,
    ownedDef: 1,
    icon: '🗡️',
    description: '모험을 시작한 초보자를 위해 깎아 만든 튼튼한 목검.',
  },
  {
    id: 'wp_silver_sword',
    name: '기사단의 은검',
    slot: 'weapon',
    rarity: 'rare',
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    ownedCount: 0,
    owned: false,
    atk: 25,
    hp: 0,
    def: 0,
    critRate: 0.03,
    critDmg: 0.08,
    ownedAtk: 10,
    ownedHp: 35,
    ownedDef: 3,
    icon: '⚔️',
    description: '달빛 아래 정련된 은빛 칼날로 부정한 기운을 베어냅니다.',
  },
  {
    id: 'wp_flame_sword',
    name: '화염군주의 마검',
    slot: 'weapon',
    rarity: 'epic',
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    ownedCount: 0,
    owned: false,
    atk: 58,
    hp: 0,
    def: 0,
    critRate: 0.05,
    critDmg: 0.15,
    ownedAtk: 24,
    ownedHp: 80,
    ownedDef: 6,
    icon: '🔥🗡️',
    description: '타오르는 불꽃의 정령이 깃든 붉은 칼날의 마검.',
  },
  {
    id: 'wp_sun_balmung',
    name: '태양빛 발뭉',
    slot: 'weapon',
    rarity: 'legendary',
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    ownedCount: 0,
    owned: false,
    atk: 130,
    hp: 0,
    def: 0,
    critRate: 0.08,
    critDmg: 0.25,
    ownedAtk: 55,
    ownedHp: 180,
    ownedDef: 15,
    icon: '☀️⚔️',
    description: '태양의 심장에서 추출한 영겁의 빛을 품은 신성 대검.',
  },
  {
    id: 'wp_apocalypse',
    name: '종말의 에스칼리버',
    slot: 'weapon',
    rarity: 'mythic',
    level: 1,
    pieces: 0,
    piecesRequired: 8,
    ownedCount: 0,
    owned: false,
    atk: 280,
    hp: 0,
    def: 0,
    critRate: 0.12,
    critDmg: 0.45,
    ownedAtk: 120,
    ownedHp: 400,
    ownedDef: 35,
    icon: '👑🗡️',
    description: '차원의 경계를 가르는 궁극의 성검. 일격에 모든 것을 파멸시킵니다.',
  },

  // ==========================================
  // 🪖 HELMETS (투구)
  // ==========================================
  {
    id: 'hl_cloth_cap',
    name: '질긴 천 두건',
    slot: 'helmet',
    rarity: 'common',
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    ownedCount: 1,
    owned: true,
    atk: 0,
    hp: 45,
    def: 3,
    ownedAtk: 2,
    ownedHp: 25,
    ownedDef: 2,
    icon: '🧢',
    description: '햇빛과 먼지를 막아주는 부드럽고 질긴 천 두건.',
  },
  {
    id: 'hl_feather_helm',
    name: '기사단 깃털투구',
    slot: 'helmet',
    rarity: 'rare',
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 110,
    def: 8,
    ownedAtk: 5,
    ownedHp: 60,
    ownedDef: 5,
    icon: '🪖',
    description: '푸른 깃털로 장식된 견고한 강철 투구.',
  },
  {
    id: 'hl_mithril_visor',
    name: '용맹의 미스릴 바이저',
    slot: 'helmet',
    rarity: 'epic',
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 240,
    def: 18,
    ownedAtk: 12,
    ownedHp: 130,
    ownedDef: 10,
    icon: '🛡️',
    description: '가볍고 단단한 미스릴 합금으로 안면을 보호하는 전면 바이저.',
  },
  {
    id: 'hl_holy_crown',
    name: '성전사의 황금관',
    slot: 'helmet',
    rarity: 'legendary',
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 520,
    def: 38,
    ownedAtk: 28,
    ownedHp: 280,
    ownedDef: 22,
    icon: '👑',
    description: '축복받은 성전사에게만 하사되는 눈부신 황금빛 투구.',
  },
  {
    id: 'hl_valkyrie_helm',
    name: '불멸의 발키리 윙헬름',
    slot: 'helmet',
    rarity: 'mythic',
    level: 1,
    pieces: 0,
    piecesRequired: 8,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 1150,
    def: 82,
    ownedAtk: 60,
    ownedHp: 650,
    ownedDef: 50,
    icon: '🪽👑',
    description: '전장을 지배하는 전승의 날개가 조각된 신화급 수호 투구.',
  },

  // ==========================================
  // 🛡️ ARMORS (갑옷)
  // ==========================================
  {
    id: 'ar_leather_tunic',
    name: '초보자 가죽 조끼',
    slot: 'armor',
    rarity: 'common',
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    ownedCount: 1,
    owned: true,
    atk: 0,
    hp: 65,
    def: 5,
    ownedAtk: 2,
    ownedHp: 35,
    ownedDef: 3,
    icon: '🦺',
    description: '약한 야수의 발톱을 막아줄 수 있는 질긴 가죽 조끼.',
  },
  {
    id: 'ar_plate_mail',
    name: '강철 플레이트메일',
    slot: 'armor',
    rarity: 'rare',
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 160,
    def: 12,
    ownedAtk: 6,
    ownedHp: 85,
    ownedDef: 7,
    icon: '🥋',
    description: '겹겹이 덧댄 강철 판금으로 심장을 철통같이 지켜냅니다.',
  },
  {
    id: 'ar_obsidian_armor',
    name: '흑요석 드래곤아머',
    slot: 'armor',
    rarity: 'epic',
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 360,
    def: 26,
    ownedAtk: 15,
    ownedHp: 190,
    ownedDef: 15,
    icon: '🐉🛡️',
    description: '흑룡의 비늘과 흑요석을 융합하여 제작한 칠흑의 갑옷.',
  },
  {
    id: 'ar_guardian_chest',
    name: '빛의 가디언 체스트',
    slot: 'armor',
    rarity: 'legendary',
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 780,
    def: 56,
    ownedAtk: 35,
    ownedHp: 420,
    ownedDef: 32,
    icon: '✨🛡️',
    description: '고대 수호자의 결계가 둘러져 있어 어떤 충격도 분산시킵니다.',
  },
  {
    id: 'ar_titanium_plate',
    name: '태초의 티타늄 성갑',
    slot: 'armor',
    rarity: 'mythic',
    level: 1,
    pieces: 0,
    piecesRequired: 8,
    ownedCount: 0,
    owned: false,
    atk: 0,
    hp: 1750,
    def: 125,
    ownedAtk: 80,
    ownedHp: 950,
    ownedDef: 70,
    icon: '💎🛡️',
    description: '천계의 금속으로 주조된 불멸의 갑주. 불굴의 생명력을 선사합니다.',
  },

  // ==========================================
  // 💍 ACCESSORIES (장신구)
  // ==========================================
  {
    id: 'ac_wood_ring',
    name: '행운의 나무 반지',
    slot: 'accessory',
    rarity: 'common',
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    ownedCount: 1,
    owned: true,
    atk: 4,
    hp: 25,
    def: 2,
    critRate: 0.02,
    ownedAtk: 3,
    ownedHp: 15,
    ownedDef: 1,
    ownedCritRate: 0.005,
    icon: '💍',
    description: '작은 행운을 빌어주는 소박한 나무 조각 반지.',
  },
  {
    id: 'ac_emerald_ring',
    name: '에메랄드 링',
    slot: 'accessory',
    rarity: 'rare',
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    ownedCount: 0,
    owned: false,
    atk: 10,
    hp: 60,
    def: 4,
    critRate: 0.03,
    ownedAtk: 8,
    ownedHp: 35,
    ownedDef: 3,
    ownedCritRate: 0.008,
    icon: '💚💍',
    description: '숲의 마력이 응축된 비취빛 보석이 세공된 정교한 반지.',
  },
  {
    id: 'ac_flame_seal',
    name: '화염군주의 인장',
    slot: 'accessory',
    rarity: 'epic',
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    ownedCount: 0,
    owned: false,
    atk: 22,
    hp: 130,
    def: 10,
    critRate: 0.05,
    ownedAtk: 18,
    ownedHp: 75,
    ownedDef: 6,
    ownedCritRate: 0.012,
    icon: '🔥💍',
    description: '타오르는 불꽃 군주의 낙인이 새겨져 착용자의 투지를 불태웁니다.',
  },
  {
    id: 'ac_hourglass_ring',
    name: '시간의 모래시계 링',
    slot: 'accessory',
    rarity: 'legendary',
    level: 1,
    pieces: 0,
    piecesRequired: 5,
    ownedCount: 0,
    owned: false,
    atk: 50,
    hp: 280,
    def: 22,
    critRate: 0.07,
    ownedAtk: 40,
    ownedHp: 160,
    ownedDef: 14,
    ownedCritRate: 0.018,
    icon: '⏳💍',
    description: '시간의 흐름을 늦추어 찰나의 순간 치명타를 적중시킵니다.',
  },
  {
    id: 'ac_origin_ring',
    name: '우주를 품은 오리진 링',
    slot: 'accessory',
    rarity: 'mythic',
    level: 1,
    pieces: 0,
    piecesRequired: 8,
    ownedCount: 0,
    owned: false,
    atk: 110,
    hp: 620,
    def: 48,
    critRate: 0.10,
    ownedAtk: 90,
    ownedHp: 380,
    ownedDef: 30,
    ownedCritRate: 0.025,
    icon: '🌌💍',
    description: '우주의 정수가 담긴 궁극의 고대 아티팩트 반지.',
  },
];

/**
 * Creates an initial equipment catalog lookup map with default starter items owned and equipped.
 */
export function createDefaultEquipmentCatalog(): Equipment[] {
  return MASTER_EQUIPMENT_LIST.map((item) => {
    const isStarter = ['wp_wood_sword', 'hl_cloth_cap', 'ar_leather_tunic', 'ac_wood_ring'].includes(item.id);
    return {
      ...item,
      slot: item.slot,
      type: item.slot,
      owned: isStarter,
      ownedCount: isStarter ? 1 : 0,
      level: 1,
      pieces: 0,
      equipped: isStarter,
    };
  });
}


export const STARTER_EQUIPMENT: Partial<Record<EquipmentSlot, Equipment>> = {
  weapon: MASTER_EQUIPMENT_LIST.find((e) => e.id === 'wp_wood_sword')!,
  helmet: MASTER_EQUIPMENT_LIST.find((e) => e.id === 'hl_cloth_cap')!,
  armor: MASTER_EQUIPMENT_LIST.find((e) => e.id === 'ar_leather_tunic')!,
  accessory: MASTER_EQUIPMENT_LIST.find((e) => e.id === 'ac_wood_ring')!,
};

/**
 * Calculates sum of all owned effects across the entire equipment collection.
 */
export function calculateTotalEquipmentOwnedBonus(catalog: Record<string, Equipment> | Equipment[]): {
  ownedAtk: number;
  ownedHp: number;
  ownedDef: number;
  ownedCritRate: number;
  atk: number;
  hp: number;
  def: number;
  critRate: number;
} {
  const list = Array.isArray(catalog) ? catalog : Object.values(catalog);
  let atk = 0;
  let hp = 0;
  let def = 0;
  let critRate = 0;

  list.forEach((item) => {
    if (item.owned) {
      const stats = calculateEquipmentOwnedStats(item);
      atk += stats.ownedAtk;
      hp += stats.ownedHp;
      def += stats.ownedDef;
      critRate += stats.ownedCritRate;
    }
  });

  return {
    ownedAtk: atk,
    ownedHp: hp,
    ownedDef: def,
    ownedCritRate: Number(critRate.toFixed(3)),
    atk,
    hp,
    def,
    critRate: Number(critRate.toFixed(3)),
  };
}


/**
 * Generates random equipment drop picking from the master catalog by weighted rarity.
 */
export function generateRandomEquipment(targetRarity?: EquipmentRarity, targetSlot?: EquipmentSlot): Equipment {
  const slots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'accessory'];
  const slot = targetSlot || slots[Math.floor(Math.random() * slots.length)];

  let rarity: EquipmentRarity = targetRarity || 'common';
  if (!targetRarity) {
    const roll = Math.random() * 100;
    if (roll < 55) rarity = 'common';
    else if (roll < 83) rarity = 'rare';
    else if (roll < 95) rarity = 'epic';
    else if (roll < 99) rarity = 'legendary';
    else rarity = 'mythic';
  }

  const matching = MASTER_EQUIPMENT_LIST.filter((e) => e.slot === slot && e.rarity === rarity);
  const picked = matching.length > 0 ? matching[Math.floor(Math.random() * matching.length)] : MASTER_EQUIPMENT_LIST[0];

  return {
    ...picked,
    level: 1,
    pieces: 1,
    ownedCount: 1,
  };
}
