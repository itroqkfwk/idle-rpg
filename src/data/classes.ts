import { CharacterClassId, PromotionId } from '../types/game';

export interface ClassConfig {
  id: CharacterClassId;
  name: string;
  subTitle: string;
  avatar: string;
  icon: string;
  description: string;
  statBuffs: {
    hpMult: number;
    defMult: number;
    atkMult: number;
    critRateBonus: number;
  };
  promotionId: PromotionId;
  promotionName: string;
  promotionSubTitle: string;
  promotionDesc: string;
  promotionIcon: string;
  promotionBuffs: {
    atkSpeedBonus: number;
    critRateBonus: number;
    skillDamageBonus: number;
    cooldownReduction: number;
  };
  awakeningSkillId: string;
  awakeningSkillName: string;
}

export const CLASS_CONFIGS: Record<CharacterClassId, ClassConfig> = {
  warrior: {
    id: 'warrior',
    name: '전사',
    subTitle: '강철의 기사',
    avatar: './assets/hero_knight.png',
    icon: '⚔️',
    description: '단단한 갑주와 검을 다루며 전방에서 적을 베어넘기는 근접 딜러/탱커.',
    statBuffs: {
      hpMult: 1.25,
      defMult: 1.30,
      atkMult: 1.0,
      critRateBonus: 0.05,
    },
    promotionId: 'sword_master',
    promotionName: '소드 마스터',
    promotionSubTitle: '황금 검성',
    promotionDesc: '투기를 극한까지 연마하여 황금빛 검기를 자유자재로 다루는 전설의 검성.',
    promotionIcon: '👑⚔️',
    promotionBuffs: {
      atkSpeedBonus: 0.20,
      critRateBonus: 0.15,
      skillDamageBonus: 0.25,
      cooldownReduction: 0.10,
    },
    awakeningSkillId: 'heavenly_blade',
    awakeningSkillName: '천공의 검',
  },
  mage: {
    id: 'mage',
    name: '마법사',
    subTitle: '비전의 술사',
    avatar: './assets/hero_mage.png',
    icon: '🔮',
    description: '원소와 비전 마법을 제어하여 원거리에서 폭발적인 화력을 투사하는 캐스터.',
    statBuffs: {
      hpMult: 0.95,
      defMult: 0.85,
      atkMult: 1.30,
      critRateBonus: 0.08,
    },
    promotionId: 'archmage',
    promotionName: '아크메이지',
    promotionSubTitle: '성좌의 대마도사',
    promotionDesc: '은하와 성좌의 섭리를 깨우쳐 광대한 천체 마법을 강림시키는 최고위 대마법사.',
    promotionIcon: '✨🧙',
    promotionBuffs: {
      atkSpeedBonus: 0.10,
      critRateBonus: 0.12,
      skillDamageBonus: 0.35,
      cooldownReduction: 0.15,
    },
    awakeningSkillId: 'astral_cataclysm',
    awakeningSkillName: '천벌의 비전성좌',
  },
};

export const PROMOTION_REQUIREMENTS = {
  requiredLevel: 30,
  requiredChapter: 3,
  requiredStage: 10,
  requiredGold: 10000,
  requiredSeals: 1,
};
