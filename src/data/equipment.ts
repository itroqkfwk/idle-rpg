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

export const STARTER_EQUIPMENT: Partial<Record<EquipmentSlot, Equipment>> = {
  weapon: {
    id: 'starter_wooden_sword',
    name: '수련용 목검',
    slot: 'weapon',
    rarity: 'common',
    level: 1,
    atk: 8,
    hp: 0,
    def: 0,
    critRate: 0.02,
    icon: '🗡️',
    description: '모험을 시작한 초보자를 위해 깎아 만든 튼튼한 목검.',
  },
  helmet: {
    id: 'starter_cloth_cap',
    name: '질긴 천 두건',
    slot: 'helmet',
    rarity: 'common',
    level: 1,
    atk: 0,
    hp: 40,
    def: 2,
    icon: '🧢',
    description: '햇빛과 먼지를 막아주는 부드러운 천 두건.',
  },
  armor: {
    id: 'starter_leather_tunic',
    name: '초보자 가죽 조끼',
    slot: 'armor',
    rarity: 'common',
    level: 1,
    atk: 0,
    hp: 60,
    def: 4,
    icon: '🦺',
    description: '약한 야수의 발톱을 막아줄 수 있는 질긴 가죽 조끼.',
  },
  accessory: {
    id: 'starter_wooden_ring',
    name: '행운의 나무 반지',
    slot: 'accessory',
    rarity: 'common',
    level: 1,
    atk: 3,
    hp: 20,
    def: 1,
    critRate: 0.03,
    icon: '💍',
    description: '작은 행운을 빌어주는 소박한 나무 조각 반지.',
  },
};

const ITEM_NAME_POOLS: Record<EquipmentSlot, { prefix: string; names: Record<EquipmentRarity, string>; icon: string }[]> = {
  weapon: [
    {
      prefix: '검',
      names: {
        common: '견습생 철검',
        rare: '기사단의 은검',
        epic: '룬 각인 브로드소드',
        legendary: '태양빛 발뭉',
        mythic: '종말의 에스칼리버',
      },
      icon: '⚔️',
    },
    {
      prefix: '지팡이',
      names: {
        common: '참나무 지팡이',
        rare: '사파이어 완드',
        epic: '정령왕의 에테르 스태프',
        legendary: '세계수의 가지',
        mythic: '천상의 별빛 메테오라',
      },
      icon: '🪄',
    },
    {
      prefix: '활',
      names: {
        common: '사냥꾼 숏보우',
        rare: '바람의 롱보우',
        epic: '매의 눈 합성궁',
        legendary: '질풍의 가일포스',
        mythic: '신궁 아르테미스',
      },
      icon: '🏹',
    },
  ],
  helmet: [
    {
      prefix: '투구',
      names: {
        common: '무쇠 바스켓헬름',
        rare: '기사단 깃털투구',
        epic: '용맹의 미스릴 바이저',
        legendary: '성전사의 황금관',
        mythic: '불멸의 발키리 윙헬름',
      },
      icon: '🪖',
    },
    {
      prefix: '모자',
      names: {
        common: '여행자 가죽 모자',
        rare: '마법사 펠트햇',
        epic: '별빛 예언가 후드',
        legendary: '현자의 오리하르콘 티아라',
        mythic: '전지전능의 관',
      },
      icon: '👑',
    },
  ],
  armor: [
    {
      prefix: '갑옷',
      names: {
        common: '단단한 사슬갑옷',
        rare: '강철 플레이트메일',
        epic: '흑요석 드래곤아머',
        legendary: '빛의 가디언 체스트',
        mythic: '태초의 티타늄 성갑',
      },
      icon: '🛡️',
    },
    {
      prefix: '로브',
      names: {
        common: '수도사 삼베로브',
        rare: '마력직조 실크로브',
        epic: '극광의 오로라 맨틀',
        legendary: '대마법사 하이퍼코트',
        mythic: '무한의 성운의 망토',
      },
      icon: '🥋',
    },
  ],
  accessory: [
    {
      prefix: '반지',
      names: {
        common: '황동 링',
        rare: '에메랄드 링',
        epic: '화염군주의 인장',
        legendary: '시간의 모래시계 링',
        mythic: '우주를 품은 오리진 링',
      },
      icon: '💍',
    },
    {
      prefix: '목걸이',
      names: {
        common: '뼈 조각 목걸이',
        rare: '달빛 수정 펜던트',
        epic: '불사조의 깃털 목걸이',
        legendary: '드래곤 하트 아뮬렛',
        mythic: '신의 숨결 목걸이',
      },
      icon: '📿',
    },
  ],
};

export function generateRandomEquipment(targetRarity?: EquipmentRarity, targetSlot?: EquipmentSlot): Equipment {
  const slots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'accessory'];
  const slot = targetSlot || slots[Math.floor(Math.random() * slots.length)];

  // Rarity determination
  let rarity: EquipmentRarity = targetRarity || 'common';
  if (!targetRarity) {
    const roll = Math.random() * 100;
    if (roll < 55) rarity = 'common';
    else if (roll < 83) rarity = 'rare';
    else if (roll < 95) rarity = 'epic';
    else if (roll < 99) rarity = 'legendary';
    else rarity = 'mythic';
  }

  const pool = ITEM_NAME_POOLS[slot];
  const itemType = pool[Math.floor(Math.random() * pool.length)];
  const name = itemType.names[rarity];
  const mult = RARITY_CONFIGS[rarity].multiplier;

  let atk = 0;
  let hp = 0;
  let def = 0;
  let critRate = 0;

  if (slot === 'weapon') {
    atk = Math.floor((12 + Math.random() * 10) * mult);
    critRate = Number(((0.02 + Math.random() * 0.04) * (mult > 2 ? 1.5 : 1)).toFixed(3));
  } else if (slot === 'helmet') {
    hp = Math.floor((40 + Math.random() * 30) * mult);
    def = Math.floor((3 + Math.random() * 4) * mult);
  } else if (slot === 'armor') {
    hp = Math.floor((70 + Math.random() * 50) * mult);
    def = Math.floor((6 + Math.random() * 6) * mult);
  } else if (slot === 'accessory') {
    atk = Math.floor((5 + Math.random() * 6) * mult);
    hp = Math.floor((25 + Math.random() * 25) * mult);
    def = Math.floor((2 + Math.random() * 3) * mult);
    critRate = Number(((0.01 + Math.random() * 0.03) * (mult > 2 ? 1.4 : 1)).toFixed(3));
  }

  return {
    id: `item_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name,
    slot,
    rarity,
    level: 1,
    atk,
    hp,
    def,
    critRate: critRate > 0 ? critRate : undefined,
    icon: itemType.icon,
    description: `${RARITY_CONFIGS[rarity].label} 등급의 아름다운 ${slot} 장비입니다.`,
  };
}
