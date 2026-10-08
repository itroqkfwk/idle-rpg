import { GameSaveData, CharacterStats, StageState, GameSettings } from '../types/game';
import { STARTER_EQUIPMENT, createDefaultEquipmentCatalog, getEquipmentPiecesRequired } from '../data/equipment';
import { INITIAL_PETS } from '../data/pets';
import { INITIAL_QUESTS } from '../data/quests';
import { INITIAL_SKILLS, STARTER_EQUIPPED_SKILLS, getSkillPiecesRequired } from '../data/skills';

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
    autoUpgradeEquip: true,
    autoUpgradeSkills: true,
    autoEquipGear: true,
    autoEquipSkills: true,
  };

  const initialCatalog = createDefaultEquipmentCatalog();

  return {
    version: 2,
    lastOnlineTime: Date.now(),
    classId: 'warrior',
    promotion: 'none',
    awakeningUnlocked: false,
    awakeningGauge: 0,
    promotionSeals: 1,
    stats: initialStats,
    equipped: { ...STARTER_EQUIPMENT },
    inventory: [],
    equipmentCatalog: initialCatalog,
    pets: [...INITIAL_PETS],
    activePetId: 'pet_fox',
    stage: initialStage,
    quests: [...INITIAL_QUESTS],
    skills: [...INITIAL_SKILLS],
    equippedSkillIds: [...STARTER_EQUIPPED_SKILLS],
    freeChestLastOpened: 0,
    settings: initialSettings,
    hasSelectedClass: false,
    cheatUsed: false,
    isTestAccount: false,
    questCollapsed: false,
    skillCooldownOff: false,
    infiniteAwakening: false,
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
      settings: {
        ...defaultData.settings,
        ...(parsed.settings || {}),
        autoUpgradeEquip: parsed.settings?.autoUpgradeEquip ?? true,
        autoUpgradeSkills: parsed.settings?.autoUpgradeSkills ?? true,
        autoEquipGear: parsed.settings?.autoEquipGear ?? true,
        autoEquipSkills: parsed.settings?.autoEquipSkills ?? true,
      },
    };

    if (parsed.hasSelectedClass !== undefined) {
      mergedData.hasSelectedClass = parsed.hasSelectedClass;
    } else {
      // Existing save file from prior gameplay
      mergedData.hasSelectedClass = true;
    }
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
    if (mergedData.cheatUsed === undefined) {
      mergedData.cheatUsed = false;
    }
    if (mergedData.isTestAccount === undefined) {
      mergedData.isTestAccount = false;
    }
    if (mergedData.questCollapsed === undefined) {
      mergedData.questCollapsed = false;
    }
    if (mergedData.skillCooldownOff === undefined) {
      mergedData.skillCooldownOff = false;
    }
    if (mergedData.infiniteAwakening === undefined) {
      mergedData.infiniteAwakening = false;
    }
    if (!mergedData.activePetId || !mergedData.pets?.some((p) => p.id === mergedData.activePetId)) {
      mergedData.activePetId = 'pet_fox';
    }
    if (mergedData.pets) {
      mergedData.pets = mergedData.pets.map((p) => (p.id === 'pet_fox' ? { ...p, owned: true } : p));
    }

    // Migrate Equipment Catalog
    const defaultCatalog = createDefaultEquipmentCatalog();
    if (parsed.equipmentCatalog && Array.isArray(parsed.equipmentCatalog) && parsed.equipmentCatalog.length > 0) {
      mergedData.equipmentCatalog = defaultCatalog.map((defItem) => {
        const saved = (parsed.equipmentCatalog as any[])?.find((eq: any) => eq.id === defItem.id);
        if (saved) {
          const level = Math.max(1, saved.level || 1);
          return {
            ...defItem,
            ...saved,
            level,
            pieces: saved.pieces || 0,
            piecesRequired: getEquipmentPiecesRequired(level, defItem.rarity),
            owned: !!saved.owned,
            equipped: !!saved.equipped,
          };
        }
        return defItem;
      });
    } else {
      // Migrate legacy inventory & equipped into catalog
      const catalog = [...defaultCatalog];
      if (parsed.equipped) {
        Object.values(parsed.equipped).forEach((eq) => {
          if (!eq) return;
          const match = catalog.find((c) => (c.slot === eq.slot || (c as any).type === eq.slot) && (c.id === eq.id || c.rarity === eq.rarity));
          if (match) {
            match.owned = true;
            match.equipped = true;
            match.level = Math.max(match.level || 1, eq.level || 1);
          }
        });
      }
      if (parsed.inventory && Array.isArray(parsed.inventory)) {
        parsed.inventory.forEach((eq) => {
          const match = catalog.find((c) => (c.slot === eq.slot || (c as any).type === eq.slot) && (c.id === eq.id || c.rarity === eq.rarity));
          if (match) {
            match.owned = true;
            match.pieces = (match.pieces || 0) + 1;
          }
        });
      }
      mergedData.equipmentCatalog = catalog;
    }

    // Reconstruct equipped map based on equipmentCatalog
    const equippedMap = { ...mergedData.equipped };
    (['weapon', 'helmet', 'armor', 'accessory'] as const).forEach((slot) => {
      const equippedItem = mergedData.equipmentCatalog?.find((eq) => (eq.slot === slot || (eq as any).type === slot) && eq.equipped && eq.owned);
      if (equippedItem) {
        equippedMap[slot] = equippedItem;
      } else {
        const defaultEquipped = defaultCatalog.find((eq) => (eq.slot === slot || (eq as any).type === slot) && eq.equipped);
        if (defaultEquipped) {
          equippedMap[slot] = defaultEquipped;
        }
      }
    });
    mergedData.equipped = equippedMap;


    // Migrate skills (merge with new skills pool & owned effects)
    const baseSkills = INITIAL_SKILLS.map((initS) => {
      const saved = parsed.skills?.find((s) => s.id === initS.id);
      if (saved) {
        const level = Math.max(1, saved.level || 1);
        return {
          ...initS,
          ...saved,
          level,
          pieces: saved.pieces || 0,
          piecesRequired: getSkillPiecesRequired({ ...initS, level }),
          owned: saved.owned ?? initS.owned,
        };
      }
      return { ...initS };
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

