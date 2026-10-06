import { Monster } from '../types/game';

export interface ChapterTheme {
  chapter: number;
  name: string;
  subTitle: string;
  bgGradient: string;
  accentColor: string;
  monsters: Omit<Monster, 'currentHp'>[];
  boss: Omit<Monster, 'currentHp'>;
}

export const CHAPTERS_DATA: ChapterTheme[] = [
  {
    chapter: 1,
    name: '새싹의 숲 (Green Sprout Forest)',
    subTitle: '초보 모험가가 첫 발을 내딛는 평화롭고 따스한 숲속',
    bgGradient: 'linear-gradient(180deg, #d8ecd2 0%, #a4cca2 60%, #76a874 100%)',
    accentColor: '#5a8d58',
    monsters: [
      {
        id: 'c1_m1',
        name: '풀잎 슬라임',
        icon: '🟢',
        maxHp: 45,
        atk: 4,
        def: 1,
        expReward: 8,
        goldReward: 15,
        isBoss: false,
        element: 'grass'
      },
      {
        id: 'c1_m2',
        name: '꼬마 버섯돌이',
        icon: '🍄',
        maxHp: 75,
        atk: 7,
        def: 2,
        expReward: 14,
        goldReward: 25,
        isBoss: false,
        element: 'grass'
      },
      {
        id: 'c1_m3',
        name: '숲속 꿀벌',
        icon: '🐝',
        maxHp: 120,
        atk: 10,
        def: 3,
        expReward: 22,
        goldReward: 40,
        isBoss: false,
        element: 'grass'
      },
      {
        id: 'c1_m4',
        name: '숲속 반딧불 요정',
        icon: '🧚‍♂️',
        maxHp: 180,
        atk: 15,
        def: 5,
        expReward: 35,
        goldReward: 65,
        isBoss: false,
        element: 'light'
      }
    ],
    boss: {
      id: 'c1_boss',
      name: '고대 바위 골렘 [BOSS]',
      icon: '🗿',
      maxHp: 1200,
      atk: 32,
      def: 12,
      expReward: 350,
      goldReward: 800,
      isBoss: true,
      element: 'grass'
    }
  },
  {
    chapter: 2,
    name: '달빛 호숫가 (Moonlight Lake)',
    subTitle: '은은한 달빛이 수면 위로 반짝이는 신비로운 호수',
    bgGradient: 'linear-gradient(180deg, #cde3f7 0%, #9bc2e8 60%, #689ccd 100%)',
    accentColor: '#3c72a6',
    monsters: [
      {
        id: 'c2_m1',
        name: '물방울 정령',
        icon: '💧',
        maxHp: 320,
        atk: 25,
        def: 8,
        expReward: 60,
        goldReward: 120,
        isBoss: false,
        element: 'water'
      },
      {
        id: 'c2_m2',
        name: '연잎 개구리',
        icon: '🐸',
        maxHp: 480,
        atk: 35,
        def: 12,
        expReward: 95,
        goldReward: 190,
        isBoss: false,
        element: 'water'
      },
      {
        id: 'c2_m3',
        name: '푸른빛 소라게',
        icon: '🐚',
        maxHp: 720,
        atk: 48,
        def: 22,
        expReward: 150,
        goldReward: 290,
        isBoss: false,
        element: 'water'
      }
    ],
    boss: {
      id: 'c2_boss',
      name: '호수의 수호룡 [BOSS]',
      icon: '🐉🌊',
      maxHp: 4800,
      atk: 95,
      def: 35,
      expReward: 1200,
      goldReward: 2800,
      isBoss: true,
      element: 'water'
    }
  },
  {
    chapter: 3,
    name: '노을빛 단풍 골짜기 (Autumn Valley)',
    subTitle: '붉은 단풍잎이 흩날리는 따뜻하지만 거친 골짜기',
    bgGradient: 'linear-gradient(180deg, #fed7aa 0%, #fba07a 60%, #e07a5f 100%)',
    accentColor: '#c25838',
    monsters: [
      {
        id: 'c3_m1',
        name: '불씨 도깨비',
        icon: '🔥',
        maxHp: 1200,
        atk: 75,
        def: 28,
        expReward: 240,
        goldReward: 450,
        isBoss: false,
        element: 'fire'
      },
      {
        id: 'c3_m2',
        name: '붉은 꼬리 여우',
        icon: '🦊',
        maxHp: 1800,
        atk: 110,
        def: 40,
        expReward: 380,
        goldReward: 700,
        isBoss: false,
        element: 'fire'
      }
    ],
    boss: {
      id: 'c3_boss',
      name: '화염의 바위 거인 [BOSS]',
      icon: '🌋🗿',
      maxHp: 12500,
      atk: 220,
      def: 80,
      expReward: 3500,
      goldReward: 7500,
      isBoss: true,
      element: 'fire'
    }
  }
];

export function getMonsterForStage(chapter: number, stage: number): Monster {
  const chData = CHAPTERS_DATA[(chapter - 1) % CHAPTERS_DATA.length];
  const scale = 1 + (chapter - 1) * 2.2 + (stage - 1) * 0.18;

  if (stage === 10) {
    const bossTemplate = chData.boss;
    const hp = Math.floor(bossTemplate.maxHp * scale);
    return {
      ...bossTemplate,
      maxHp: hp,
      currentHp: hp,
      atk: Math.floor(bossTemplate.atk * scale),
      def: Math.floor(bossTemplate.def * scale),
      expReward: Math.floor(bossTemplate.expReward * scale),
      goldReward: Math.floor(bossTemplate.goldReward * scale),
    };
  }

  const normalList = chData.monsters;
  // Stage bracket mapping for stages 1 to 9:
  // Stages 1-2: index 0 (Slime)
  // Stages 3-4: index 1 (Mushroom)
  // Stages 5-6: index 2 (Bee)
  // Stages 7-9: index 3 (Spirit)
  const stageBracketMap = [0, 0, 1, 1, 2, 2, 3, 3, 3];
  const bracketIndex = stageBracketMap[Math.min(Math.max(1, stage), 9) - 1] ?? 0;
  const template = normalList[bracketIndex % normalList.length];
  const hp = Math.floor(template.maxHp * scale);

  return {
    ...template,
    maxHp: hp,
    currentHp: hp,
    atk: Math.floor(template.atk * scale),
    def: Math.floor(template.def * scale),
    expReward: Math.floor(template.expReward * scale),
    goldReward: Math.floor(template.goldReward * scale),
  };
}
