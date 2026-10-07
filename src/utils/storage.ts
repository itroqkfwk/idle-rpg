import { GameSaveData, CharacterStats, StageState, GameSettings } from '../types/game';
import { STARTER_EQUIPMENT } from '../data/equipment';
import { INITIAL_PETS } from '../data/pets';
import { INITIAL_QUESTS } from '../data/quests';
import { INITIAL_SKILLS, STARTER_EQUIPPED_SKILLS } from '../data/skills';

const SAVE_KEY = 'COZY_IDLE_RPG_SAVE_V1';

export function getDefaultSaveData(): GameSaveData {
  const initialStats: CharacterStats = {
    level: 1,
    exp: 0,
    maxExp: 100,
    gold: 500,
    gems: 100,
    atkLevel: 1,
    hpLevel: 1,
    defLevel: 1,
    baseAtk: 12,
    baseHp: 180,
    baseDef: 5,
    currentHp: 180,
    critRate: 0.05,
    critDmg: 1.50,
    atkSpeed: 1.0,
  };

  const initialStage: StageState = {
    chapter: 1,
    stage: 1,
    killCount: 0,
    killsRequired: 5,
    isBossStage: false,
    bossTimeLeft: 30,
    bossMaxTime: 30,
    inBossFight: false,
    highestChapter: 1,
    highestStage: 1,
  };

  const initialSettings: GameSettings = {
    bgmEnabled: false,
    sfxEnabled: true,
    damageNumbers: true,
    autoBossRetry: false,
  };

  return {
    version: 1,
    lastOnlineTime: Date.now(),
    classId: 'warrior',
    promotion: 'none',
    awakeningUnlocked: false,
    awakeningGauge: 0,
    promotionSeals: 1,
    stats: initialStats,
    equipped: { ...STARTER_EQUIPMENT },
    inventory: [],
    pets: [...INITIAL_PETS],
    activePetId: 'pet_fox',
    stage: initialStage,
    quests: [...INITIAL_QUESTS],
    skills: [...INITIAL_SKILLS],
    equippedSkillIds: [...STARTER_EQUIPPED_SKILLS],
    freeChestLastOpened: 0,
    settings: initialSettings,
  };
}

export function loadGameData(): { data: GameSaveData; offlineSeconds: number } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return { data: getDefaultSaveData(), offlineSeconds: 0 };
    }
    const parsed: GameSaveData = JSON.parse(raw);
    const now = Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((now - (parsed.lastOnlineTime || now)) / 1000));
    
    // Cap at 12 hours (43,200 seconds)
    const cappedSeconds = Math.min(elapsedSeconds, 12 * 3600);

    const defaultData = getDefaultSaveData();
    const mergedData: GameSaveData = {
      ...defaultData,
      ...parsed,
      lastOnlineTime: now,
    };
    if (!mergedData.classId) {
      mergedData.classId = 'warrior';
    }
    if (!mergedData.promotion) {
      mergedData.promotion = 'none';
    }
    if (mergedData.awakeningUnlocked === undefined) {
      mergedData.awakeningUnlocked = false;
    }
    if (mergedData.awakeningGauge === undefined) {
      mergedData.awakeningGauge = 0;
    }
    if (mergedData.promotionSeals === undefined) {
      mergedData.promotionSeals = 1;
    }
    if (!mergedData.activePetId || !mergedData.pets?.some((p) => p.id === mergedData.activePetId)) {
      mergedData.activePetId = 'pet_fox';
    }
    if (mergedData.pets) {
      mergedData.pets = mergedData.pets.map((p) => (p.id === 'pet_fox' ? { ...p, owned: true } : p));
    }

    // Migrate skills (merge with new skills pool)
    const baseSkills = INITIAL_SKILLS.map((initS) => {
      const saved = parsed.skills?.find((s) => s.id === initS.id);
      return saved ? { ...initS, ...saved } : { ...initS };
    });
    mergedData.skills = baseSkills;
    mergedData.equippedSkillIds = parsed.equippedSkillIds || [...STARTER_EQUIPPED_SKILLS];

    return {
      data: mergedData,
      offlineSeconds: cappedSeconds,
    };
  } catch (err) {
    console.error('Failed to load save data:', err);
    return { data: getDefaultSaveData(), offlineSeconds: 0 };
  }
}

export function saveGameData(data: GameSaveData): void {
  try {
    const toSave: GameSaveData = {
      ...data,
      lastOnlineTime: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save game data:', err);
  }
}
