import { Pet } from '../types/game';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet_fox',
    name: '붉은 방울 여우',
    icon: '🦊',
    description: '민첩한 눈빛으로 적의 약점을 찾아내어 치명타 확률을 대폭 상승시킵니다.',
    buffType: 'critRate',
    baseBuffValue: 0.05, // +5%
    level: 1,
    owned: true,
    costGems: 0,
    personality: '영리하고 날렵한 숲의 길잡이',
  },
  {
    id: 'pet_fairy',
    name: '햇살 반딧불 요정',
    icon: '🧚‍♀️',
    description: '반짝이는 빛가루를 뿌려 몬스터 처치 시 골드 획득량을 늘려줍니다.',
    buffType: 'gold',
    baseBuffValue: 0.15, // +15%
    level: 1,
    owned: false,
    costGems: 250,
    personality: '명랑하고 반짝이는 것을 좋아하는 요정',
  },
  {
    id: 'pet_slime',
    name: '퐁퐁 슬라임',
    icon: '🟢',
    description: '말랑말랑한 촉감으로 모험가의 사기를 북돋아 공격력을 올려줍니다.',
    buffType: 'atk',
    baseBuffValue: 0.08, // +8%
    level: 1,
    owned: false,
    costGems: 600,
    personality: '느긋하고 호기심 많은 친구',
  },
  {
    id: 'pet_cat',
    name: '달빛 턱시도 냥이',
    icon: '🐱',
    description: '현란한 냥냥 펀치 리듬으로 모험가의 공격 속도를 촉진합니다.',
    buffType: 'atkSpeed',
    baseBuffValue: 0.12, // +12%
    level: 1,
    owned: false,
    costGems: 1200,
    personality: '시크하지만 츄르 앞에선 갸르릉거림',
  },
  {
    id: 'pet_dragon',
    name: '아기 루비 드래곤',
    icon: '🐲',
    description: '작은 불꽃 숨결로 치명타 공격 발생 시 막대한 추가 폭발 데미지를 줍니다.',
    buffType: 'critDmg',
    baseBuffValue: 0.35, // +35%
    level: 1,
    owned: false,
    costGems: 2500,
    personality: '작지만 위대한 용족의 후예',
  },
];

export function getPetBuffText(pet: Pet): string {
  const currentVal = pet.baseBuffValue * (1 + (pet.level - 1) * 0.2);
  const percent = Math.round(currentVal * 100);
  switch (pet.buffType) {
    case 'atk':
      return `전체 공격력 +${percent}%`;
    case 'gold':
      return `골드 획득량 +${percent}%`;
    case 'critRate':
      return `치명타 확률 +${percent}%`;
    case 'atkSpeed':
      return `공격 속도 +${percent}%`;
    case 'critDmg':
      return `치명타 피해량 +${percent}%`;
    default:
      return '';
  }
}
