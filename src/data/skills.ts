import { Skill } from '../types/game';

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'power_slash',
    name: '파워 슬래시',
    rarity: 'common',
    description: '검에 투기를 집중시켜 전방의 적에게 묵직한 강타를 내리꽂습니다.',
    baseDamageMult: 1.80, // ATK x 180%
    damageMultPerLevel: 0.10, // Lv당 +10%
    cooldown: 5.0, // 5초
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'power_slash',
    icon: '⚔️',
  },
  {
    id: 'wind_blade',
    name: '바람의 칼날',
    rarity: 'rare',
    description: '원거리에서 날카로운 청록빛 비취 검기를 날려 적을 깊게 베어냅니다.',
    baseDamageMult: 1.45, // ATK x 145%
    damageMultPerLevel: 0.08, // Lv당 +8%
    cooldown: 4.0, // 4초
    level: 1,
    pieces: 0,
    piecesRequired: 2,
    owned: true,
    effectType: 'wind_blade',
    icon: '🌪️',
  },
  {
    id: 'whirlwind',
    name: '회전 베기',
    rarity: 'epic',
    description: '광풍처럼 360도 회전하며 눈 깜짝할 사이에 3연속 참격을 퍼붓습니다.',
    baseDamageMult: 1.10, // ATK x 110% x 3연타
    damageMultPerLevel: 0.06, // Lv당 +6%
    cooldown: 8.0, // 8초
    level: 1,
    pieces: 0,
    piecesRequired: 3,
    owned: false,
    effectType: 'whirlwind',
    icon: '🌀',
  },
  {
    id: 'meteor_slash',
    name: '유성 낙하 베기',
    rarity: 'legendary',
    description: '창공을 찢고 붉은 유성을 소환해 파괴적인 대검격을 가합니다. 보스전 우선 발동!',
    baseDamageMult: 3.50, // ATK x 350%
    damageMultPerLevel: 0.20, // Lv당 +20%
    cooldown: 14.0, // 14초
    level: 1,
    pieces: 0,
    piecesRequired: 4,
    owned: false,
    effectType: 'meteor_slash',
    bossPriority: true,
    icon: '☄️',
  },
];

export const STARTER_EQUIPPED_SKILLS: (string | null)[] = [
  'power_slash',
  'wind_blade',
  null,
  null,
];
