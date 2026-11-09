import { DungeonId, DungeonSaveState, Monster } from '../types/game';

export interface DungeonDifficultyConfig {
  difficulty: number; // 1 ~ 5
  name: string;
  requiredLevel: number;
  recommendedAtk: number;
  monsterHp: number;
  monsterAtk: number;
  monsterDef: number;
  baseGoldReward: number;   // per kill in gold_mine
  baseExpReward: number;    // per wave in training_forest (total across 5 waves + clear bonus)
  stoneReward: number;      // on boss clear in ancient_ruins
}

export interface DungeonConfig {
  id: DungeonId;
  name: string;
  subtitle: string;
  description: string;
  ruleSummary: string;
  rewardLabel: string;
  timeLimit: number; // seconds
  maxWave: number;   // 0 for continuous, 5 for wave, 1 for boss
  dailyTickets: number;
  accentColor: string;
  badgeText: string;
  difficulties: DungeonDifficultyConfig[];
}

export const DAILY_DUNGEON_TICKETS = 3;

export const DUNGEONS_DATA: Record<DungeonId, DungeonConfig> = {
  gold_mine: {
    id: 'gold_mine',
    name: '황금 고블린 동굴',
    subtitle: 'GOLD GOBLIN CAVE',
    description: '보물 자루를 짊어진 황금 고블린이 끝없이 출몰하는 비밀 광산입니다.',
    ruleSummary: '제한시간 60초 · 연속 출몰 · 처치 시마다 골드 누적',
    rewardLabel: '대량 골드 (Gold)',
    timeLimit: 60,
    maxWave: 0,
    dailyTickets: DAILY_DUNGEON_TICKETS,
    accentColor: '#f59e0b',
    badgeText: 'GOLD DUNGEON',
    difficulties: [
      {
        difficulty: 1,
        name: '1단계 · 초급 광산',
        requiredLevel: 1,
        recommendedAtk: 15,
        monsterHp: 140,
        monsterAtk: 7,
        monsterDef: 2,
        baseGoldReward: 160,
        baseExpReward: 0,
        stoneReward: 0,
      },
      {
        difficulty: 2,
        name: '2단계 · 은빛 광맥',
        requiredLevel: 10,
        recommendedAtk: 60,
        monsterHp: 780,
        monsterAtk: 22,
        monsterDef: 8,
        baseGoldReward: 520,
        baseExpReward: 0,
        stoneReward: 0,
      },
      {
        difficulty: 3,
        name: '3단계 · 황금 회랑',
        requiredLevel: 20,
        recommendedAtk: 180,
        monsterHp: 3200,
        monsterAtk: 58,
        monsterDef: 20,
        baseGoldReward: 1600,
        baseExpReward: 0,
        stoneReward: 0,
      },
      {
        difficulty: 4,
        name: '4단계 · 왕실 금고',
        requiredLevel: 30,
        recommendedAtk: 480,
        monsterHp: 12500,
        monsterAtk: 135,
        monsterDef: 48,
        baseGoldReward: 4800,
        baseExpReward: 0,
        stoneReward: 0,
      },
      {
        difficulty: 5,
        name: '5단계 · 심연의 황금향',
        requiredLevel: 40,
        recommendedAtk: 1200,
        monsterHp: 42000,
        monsterAtk: 310,
        monsterDef: 110,
        baseGoldReward: 14500,
        baseExpReward: 0,
        stoneReward: 0,
      },
    ],
  },
  training_forest: {
    id: 'training_forest',
    name: '수련의 숲',
    subtitle: 'ANCIENT TRAINING GROVE',
    description: '고대 정령들이 수련생의 한계를 시험하는 5웨이브 결계의 숲입니다.',
    ruleSummary: '제한시간 90초 · 5웨이브 돌파 · 마지막 웨이브 클리어 보너스',
    rewardLabel: '대량 경험치 (EXP)',
    timeLimit: 90,
    maxWave: 5,
    dailyTickets: DAILY_DUNGEON_TICKETS,
    accentColor: '#10b981',
    badgeText: 'EXP DUNGEON',
    difficulties: [
      {
        difficulty: 1,
        name: '1단계 · 초심자의 숲',
        requiredLevel: 1,
        recommendedAtk: 18,
        monsterHp: 190,
        monsterAtk: 9,
        monsterDef: 3,
        baseGoldReward: 0,
        baseExpReward: 75,
        stoneReward: 0,
      },
      {
        difficulty: 2,
        name: '2단계 · 안개 낀 수련장',
        requiredLevel: 10,
        recommendedAtk: 75,
        monsterHp: 980,
        monsterAtk: 28,
        monsterDef: 10,
        baseGoldReward: 0,
        baseExpReward: 260,
        stoneReward: 0,
      },
      {
        difficulty: 3,
        name: '3단계 · 정령의 시험장',
        requiredLevel: 20,
        recommendedAtk: 210,
        monsterHp: 4100,
        monsterAtk: 72,
        monsterDef: 25,
        baseGoldReward: 0,
        baseExpReward: 820,
        stoneReward: 0,
      },
      {
        difficulty: 4,
        name: '4단계 · 수호자의 성역',
        requiredLevel: 30,
        recommendedAtk: 560,
        monsterHp: 15500,
        monsterAtk: 165,
        monsterDef: 58,
        baseGoldReward: 0,
        baseExpReward: 2400,
        stoneReward: 0,
      },
      {
        difficulty: 5,
        name: '5단계 · 초월자의 비경',
        requiredLevel: 40,
        recommendedAtk: 1400,
        monsterHp: 52000,
        monsterAtk: 370,
        monsterDef: 130,
        baseGoldReward: 0,
        baseExpReward: 7200,
        stoneReward: 0,
      },
    ],
  },
  ancient_ruins: {
    id: 'ancient_ruins',
    name: '고대 유적',
    subtitle: 'FORGOTTEN RELIC SANCTUM',
    description: '잠든 고대 수호 골렘과 1:1 결전을 벌여 장비 강화석을 획득하는 유적입니다.',
    ruleSummary: '제한시간 30초 · 유적 보스 1:1 결전 · 처치 시 강화석 지급',
    rewardLabel: '장비 강화석 (Enhancement Stone)',
    timeLimit: 30,
    maxWave: 1,
    dailyTickets: DAILY_DUNGEON_TICKETS,
    accentColor: '#8b5cf6',
    badgeText: 'BOSS RUINS',
    difficulties: [
      {
        difficulty: 1,
        name: '1단계 · 유적 입구 수호병',
        requiredLevel: 1,
        recommendedAtk: 22,
        monsterHp: 920,
        monsterAtk: 14,
        monsterDef: 5,
        baseGoldReward: 120,
        baseExpReward: 40,
        stoneReward: 3,
      },
      {
        difficulty: 2,
        name: '2단계 · 봉인된 석실 거신',
        requiredLevel: 10,
        recommendedAtk: 90,
        monsterHp: 4800,
        monsterAtk: 42,
        monsterDef: 16,
        baseGoldReward: 360,
        baseExpReward: 120,
        stoneReward: 6,
      },
      {
        difficulty: 3,
        name: '3단계 · 비전 코어 집행자',
        requiredLevel: 20,
        recommendedAtk: 260,
        monsterHp: 19500,
        monsterAtk: 105,
        monsterDef: 38,
        baseGoldReward: 950,
        baseExpReward: 320,
        stoneReward: 11,
      },
      {
        difficulty: 4,
        name: '4단계 · 태양석 심판관',
        requiredLevel: 30,
        recommendedAtk: 680,
        monsterHp: 72000,
        monsterAtk: 240,
        monsterDef: 85,
        baseGoldReward: 2500,
        baseExpReward: 850,
        stoneReward: 18,
      },
      {
        difficulty: 5,
        name: '5단계 · 태고의 유적 군주',
        requiredLevel: 40,
        recommendedAtk: 1650,
        monsterHp: 240000,
        monsterAtk: 520,
        monsterDef: 185,
        baseGoldReward: 6500,
        baseExpReward: 2200,
        stoneReward: 30,
      },
    ],
  },
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultDungeonState(): DungeonSaveState {
  return {
    lastResetDate: getTodayDateString(),
    records: {
      gold_mine: {
        unlockedDifficulty: 1,
        highestClearedDifficulty: 0,
        ticketsLeft: DAILY_DUNGEON_TICKETS,
        totalClears: 0,
      },
      training_forest: {
        unlockedDifficulty: 1,
        highestClearedDifficulty: 0,
        ticketsLeft: DAILY_DUNGEON_TICKETS,
        totalClears: 0,
      },
      ancient_ruins: {
        unlockedDifficulty: 1,
        highestClearedDifficulty: 0,
        ticketsLeft: DAILY_DUNGEON_TICKETS,
        totalClears: 0,
      },
    },
  };
}

export function checkAndResetDailyDungeonTickets(state?: DungeonSaveState): DungeonSaveState {
  const today = getTodayDateString();
  const def = createDefaultDungeonState();
  if (!state || !state.records) {
    return def;
  }

  const isNewDay = state.lastResetDate !== today;
  const dungeonIds: DungeonId[] = ['gold_mine', 'training_forest', 'ancient_ruins'];
  const nextRecords = { ...def.records };

  for (const id of dungeonIds) {
    const prevRec = state.records[id];
    if (prevRec) {
      nextRecords[id] = {
        unlockedDifficulty: Math.min(5, Math.max(1, prevRec.unlockedDifficulty || 1)),
        highestClearedDifficulty: Math.min(5, Math.max(0, prevRec.highestClearedDifficulty || 0)),
        ticketsLeft: isNewDay
          ? DAILY_DUNGEON_TICKETS
          : Math.min(DAILY_DUNGEON_TICKETS, Math.max(0, prevRec.ticketsLeft ?? DAILY_DUNGEON_TICKETS)),
        totalClears: Math.max(0, prevRec.totalClears || 0),
      };
    }
  }

  return {
    lastResetDate: today,
    records: nextRecords,
  };
}

export function getDungeonDifficultyConfig(dungeonId: DungeonId, difficulty: number): DungeonDifficultyConfig {
  const dungeon = DUNGEONS_DATA[dungeonId];
  const clamped = Math.min(5, Math.max(1, difficulty));
  return dungeon.difficulties.find((d) => d.difficulty === clamped) || dungeon.difficulties[0];
}

export function getDungeonMonster(
  dungeonId: DungeonId,
  difficulty: number,
  stepIndex: number // killCount for gold_mine, wave (1~5) for training_forest, 1 for ancient_ruins
): Monster {
  const diffCfg = getDungeonDifficultyConfig(dungeonId, difficulty);

  if (dungeonId === 'gold_mine') {
    const killScale = 1 + Math.min(25, Math.max(0, stepIndex)) * 0.04;
    const rewardScale = 1 + Math.min(25, Math.max(0, stepIndex)) * 0.03;
    const goblinNames = [
      '황금 자루 고블린',
      '보석 도굴꾼 임프',
      '황금 왕관 고블린',
      '대금고 약탈꾼',
    ];
    const name = `${goblinNames[stepIndex % goblinNames.length]} (Lv.${difficulty})`;
    const maxHp = Math.floor(diffCfg.monsterHp * killScale);
    return {
      id: `dg_gold_imp_d${difficulty}_${stepIndex}`,
      name,
      icon: 'imp',
      maxHp,
      currentHp: maxHp,
      atk: diffCfg.monsterAtk,
      def: diffCfg.monsterDef,
      expReward: 0,
      goldReward: Math.floor(diffCfg.baseGoldReward * rewardScale),
      isBoss: false,
      element: 'fire',
    };
  }

  if (dungeonId === 'training_forest') {
    const wave = Math.min(5, Math.max(1, stepIndex));
    // Wave 1..5 scaling: 0.75x, 0.9x, 1.05x, 1.25x, 1.55x
    const waveHpMults = [0.75, 0.9, 1.05, 1.25, 1.55];
    const waveExpMults = [0.7, 0.85, 1.0, 1.2, 1.65];
    const waveSprites = ['sprout', 'mushroom', 'turtle', 'wolf', 'gargoyle'];
    const waveTitles = [
      '1웨이브 · 숲의 파수꾼',
      '2웨이브 · 포자 수호령',
      '3웨이브 · 바위 등껍질 거북',
      '4웨이브 · 청랑의 환영',
      '5웨이브 · 수련의 숲 수호자',
    ];
    const idx = wave - 1;
    const maxHp = Math.floor(diffCfg.monsterHp * waveHpMults[idx]);
    const expReward = Math.floor(diffCfg.baseExpReward * waveExpMults[idx]);

    return {
      id: `dg_exp_${waveSprites[idx]}_d${difficulty}_w${wave}`,
      name: waveTitles[idx],
      icon: waveSprites[idx],
      maxHp,
      currentHp: maxHp,
      atk: Math.floor(diffCfg.monsterAtk * (0.9 + idx * 0.08)),
      def: Math.floor(diffCfg.monsterDef * (0.9 + idx * 0.08)),
      expReward,
      goldReward: 0,
      isBoss: wave === 5,
      element: 'grass',
    };
  }

  // ancient_ruins
  const bossTitles = [
    '유적 입구 수호 거신',
    '봉인된 석실 골렘',
    '비전 코어 집행자',
    '태양석 심판관 골렘',
    '태고의 유적 군주',
  ];
  const bossName = bossTitles[Math.min(4, Math.max(0, difficulty - 1))];
  return {
    id: `dg_ruins_golem_d${difficulty}`,
    name: bossName,
    icon: 'boss_golem',
    maxHp: diffCfg.monsterHp,
    currentHp: diffCfg.monsterHp,
    atk: diffCfg.monsterAtk,
    def: diffCfg.monsterDef,
    expReward: diffCfg.baseExpReward,
    goldReward: diffCfg.baseGoldReward,
    isBoss: true,
    element: 'light',
  };
}

export function getDungeonEnvironment(dungeonId: DungeonId) {
  if (dungeonId === 'gold_mine') {
    return {
      bgGradient: 'from-[#2a1b08] via-[#452c0c] to-[#1f1406]',
      groundColor: 'bg-[#362209]',
      accentColor: '#f59e0b',
      chapterNumber: 101,
      chapterName: '황금 고블린 동굴',
      description: '금빛 광맥이 번뜩이는 비밀 채굴장',
    };
  }
  if (dungeonId === 'training_forest') {
    return {
      bgGradient: 'from-[#07261d] via-[#0e4232] to-[#061f17]',
      groundColor: 'bg-[#092e22]',
      accentColor: '#10b981',
      chapterNumber: 102,
      chapterName: '수련의 숲',
      description: '고대 정령의 마력이 흐르는 수련 결계',
    };
  }
  return {
    bgGradient: 'from-[#1b1035] via-[#2e1b5b] to-[#140b29]',
    groundColor: 'bg-[#1f123d]',
    accentColor: '#8b5cf6',
    chapterNumber: 103,
    chapterName: '고대 유적',
    description: '잊혀진 태고의 유적 심장부',
  };
}
