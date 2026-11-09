import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  CharacterStats,
  DamageNumberData,
  Equipment,
  EquipmentSlot,
  GameSaveData,
  GameSettings,
  Monster,
  Pet,
  Quest,
  StageState,
  Skill,
  SkillEffectType,
  MonsterStatusEffect,
  CharacterClassId,
  PromotionId,
  PrestigeUpgrades,
  DungeonId,
  DungeonEndReason,
  ActiveDungeonRun,
} from './types/game';
import {
  loadGameData,
  saveGameData,
  getDefaultSaveData,
  calculatePrestigeStardustReward,
  getPrestigeUpgradeCost,
  DEFAULT_PRESTIGE_UPGRADES,
} from './utils/storage';
import { getMonsterForStage } from './data/monsters';
import {
  DUNGEONS_DATA,
  checkAndResetDailyDungeonTickets,
  getDungeonDifficultyConfig,
  getDungeonMonster,
} from './data/dungeons';
import {
  generateRandomEquipment,
  createDefaultEquipmentCatalog,
  getEquipmentPiecesRequired,
  getEquipmentUpgradeGoldCost,
  getEquipmentUpgradeStoneCost,
  calculateEquipmentEquippedStats,
  calculateEquipmentOwnedStats,
  calculateTotalEquipmentOwnedBonus,
} from './data/equipment';
import {
  INITIAL_SKILLS,
  STARTER_EQUIPPED_SKILLS,
  STARTER_EQUIPPED_SKILLS_WARRIOR,
  STARTER_EQUIPPED_SKILLS_MAGE,
  calculateSkillOwnedStats,
  calculateTotalSkillOwnedBonus,
  calculateSkillPowerScore,
  getSkillPiecesRequired,
  getSkillUpgradeGoldCost,
} from './data/skills';
import { CLASS_CONFIGS, PROMOTION_REQUIREMENTS } from './data/classes';
import { sound } from './utils/audio';

import { TopHUD } from './components/TopHUD';
import { BattleScene } from './components/BattleScene';
import { QuestWidget } from './components/QuestWidget';
import { BottomNavigation } from './components/BottomNavigation';
import { OfflineModal } from './components/OfflineModal';
import { GachaModal } from './components/GachaModal';
import { SettingsModal } from './components/SettingsModal';
import { DeveloperTestModal } from './components/DeveloperTestModal';
import { ClassSelectScreen } from './components/ClassSelectScreen';
import { PrestigeModal } from './components/PrestigeModal';
import { DungeonResultModal } from './components/DungeonResultModal';

import { HeroPage } from './pages/HeroPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { PetPage } from './pages/PetPage';
import { ShopPage } from './pages/ShopPage';
import { DungeonPage } from './pages/DungeonPage';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // --- Game State from LocalStorage ---
  const [saveData, setSaveData] = useState<GameSaveData>(() => {
    const { data } = loadGameData();
    return data;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const urlTab = new URLSearchParams(window.location.search).get('tab') as ActiveTab | null;
    return urlTab || 'adventure';
  });
  const [offlineReward, setOfflineReward] = useState<{ seconds: number; gold: number; exp: number } | null>(null);
  const [revealedItem, setRevealedItem] = useState<Equipment | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [prestigeVfxEvent, setPrestigeVfxEvent] = useState<{ id: string } | null>(null);
  const [screenShake, setScreenShake] = useState<'none' | 'normal' | 'crit' | 'boss'>('none');
  const [isHitStop, setIsHitStop] = useState(false);

  // Unpack state variables
  const stats = saveData.stats;
  const stage = saveData.stage;

  const equipped = saveData.equipped;
  const inventory = saveData.inventory;
  const pets = saveData.pets;
  const activePetId = saveData.activePetId;
  const quests = saveData.quests;
  const settings = saveData.settings;
  const freeChestLastOpened = saveData.freeChestLastOpened;
  const skills = saveData.skills ?? INITIAL_SKILLS;
  const equippedSkillIds = saveData.equippedSkillIds ?? STARTER_EQUIPPED_SKILLS;
  const classId = saveData.classId ?? 'warrior';
  const promotion = saveData.promotion ?? 'none';
  const awakeningUnlocked = saveData.awakeningUnlocked ?? false;
  const awakeningGauge = saveData.awakeningGauge ?? 0;
  const promotionSeals = saveData.promotionSeals ?? 1;
  const prestigeCount = saveData.prestigeCount ?? 0;
  const stardust = saveData.stardust ?? 0;
  const prestigeUpgrades = saveData.prestigeUpgrades ?? DEFAULT_PRESTIGE_UPGRADES;
  const hasPrestigeUnlocked = saveData.hasPrestigeUnlocked ?? false;
  const enhancementStones = saveData.enhancementStones ?? 0;
  const dungeons = useMemo(() => checkAndResetDailyDungeonTickets(saveData.dungeons), [saveData.dungeons]);

  // --- Dedicated Dungeon Mode State & Refs ---
  const [activeDungeonRun, setActiveDungeonRun] = useState<ActiveDungeonRun | null>(null);
  const activeDungeonRef = useRef<ActiveDungeonRun | null>(null);
  const [dungeonResult, setDungeonResult] = useState<ActiveDungeonRun | null>(null);
  const [dungeonVfxEvent, setDungeonVfxEvent] = useState<{
    id: string;
    type: 'gold_burst' | 'wave_clear' | 'ruins_clear';
  } | null>(null);
  const dungeonEndingRef = useRef(false);
  const savedNormalCombatSnapshotRef = useRef<{
    monster: Monster;
    statuses: MonsterStatusEffect[];
  } | null>(null);

  // Live Auto Skill & Awakening Timeline Engine State
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [activeSkillVfx, setActiveSkillVfx] = useState<{ id: string; type: SkillEffectType } | null>(null);
  const [castingSkillId, setCastingSkillId] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [castingSkillType, setCastingSkillType] = useState<SkillEffectType | null>(null);
  const [isAwakeningCasting, setIsAwakeningCasting] = useState(false);
  const isCastingRef = useRef(false);
  const lastSkillCastTimeRef = useRef<number>(0);

  // QA & Testing helper to trigger VFX instantly
  useEffect(() => {
    (window as any).__triggerSkillVfx = (type: SkillEffectType) => {
      setActiveSkillVfx({ id: `manual_${Date.now()}`, type });
    };
    (window as any).__testPrestigeUnlock = () => {
      setSaveData((prev) => {
        const updated: GameSaveData = {
          ...prev,
          hasPrestigeUnlocked: true,
          promotion: prev.classId === 'mage' ? 'archmage' : 'sword_master',
          awakeningUnlocked: true,
          stats: {
            ...prev.stats,
            level: 35,
            gold: prev.stats.gold + 50000,
          },
          stage: {
            ...prev.stage,
            chapter: 3,
            stage: 10,
            isBossStage: true,
            inBossFight: false,
            highestChapter: 3,
            highestStage: 10,
          },
        };
        saveGameData(updated);
        return updated;
      });
    };
  }, []);

  // Active Pet object
  const activePet = useMemo(() => {
    return pets.find((p) => p.id === activePetId) || null;
  }, [pets, activePetId]);

  // Active Class Awakening Skill
  const awakeningSkill = useMemo(() => {
    return skills.find((s) => s.classId === classId && s.isAwakening) || null;
  }, [skills, classId]);

  // Current Monster
  const [currentMonster, setCurrentMonster] = useState<Monster>(() => {
    return getMonsterForStage(stage.chapter, stage.stage);
  });

  // Combat Animation & FX States
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isMonsterAttacking, setIsMonsterAttacking] = useState(false);
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [isMonsterHit, setIsMonsterHit] = useState(false);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);
  const [damages, setDamages] = useState<DamageNumberData[]>([]);

  // 3-Combo Basic Attack, Pet Assist & Live DPS States
  const [basicComboStep, setBasicComboStep] = useState<1 | 2 | 3>(1);
  const [comboCompletedCount, setComboCompletedCount] = useState<0 | 1 | 2>(0);
  const [isFinisherHit, setIsFinisherHit] = useState<boolean>(false);
  const [hitComboStep, setHitComboStep] = useState<1 | 2 | 3 | null>(null);
  const [isCriticalHit, setIsCriticalHit] = useState<boolean>(false);
  const [basicAttackEvent, setBasicAttackEvent] = useState<{
    id: string;
    comboStep: 1 | 2 | 3;
    classId: CharacterClassId;
  } | null>(null);
  const [petAttackEvent, setPetAttackEvent] = useState<{ id: string; petId: string } | null>(null);
  const [isPetAttacking, setIsPetAttacking] = useState(false);
  const [currentDps, setCurrentDps] = useState<number>(0);

  const basicComboRef = useRef<1 | 2 | 3>(1);
  const comboCompletedCountRef = useRef<0 | 1 | 2>(0);
  const isBasicAttackingRef = useRef<boolean>(false);
  const lastBasicAttackTimeRef = useRef<number>(0);
  const lastSkillEndTimeRef = useRef<number>(0);
  const skillsCastSinceBasicRef = useRef<number>(1);
  const totalBasicAttacksRef = useRef<number>(0);
  const totalSkillCastsRef = useRef<number>(0);
  const recentDamageLogRef = useRef<{ time: number; amount: number }[]>([]);
  const lastMonsterAttackTimeRef = useRef<number>(Date.now());
  const lastBurnTickTimeRef = useRef<number>(0);
  const lastShockTickTimeRef = useRef<number>(0);

  // Reward Feedback & Combat Power FX States
  const [floatingGold, setFloatingGold] = useState<{ id: string; gold: number }[]>([]);
  const [lootAlert, setLootAlert] = useState<{ id: string; item: Equipment } | null>(null);
  const [stageNotice, setStageNotice] = useState<string | null>(null);
  const [cpDelta, setCpDelta] = useState<{ value: number; delta: number } | null>(null);

  // Monster Status Effects (Burn, Freeze, Shock, Armor Break, Stun)
  const [monsterStatuses, setMonsterStatuses] = useState<MonsterStatusEffect[]>([]);
  const monsterStatusesRef = useRef<MonsterStatusEffect[]>([]);
  useEffect(() => {
    monsterStatusesRef.current = monsterStatuses;
  }, [monsterStatuses]);

  // Sound Engine Sync
  useEffect(() => {
    sound.sfxEnabled = settings.sfxEnabled;
    sound.bgmEnabled = settings.bgmEnabled;
  }, [settings]);

  // Check Offline Rewards on Mount
  useEffect(() => {
    const { offlineSeconds } = loadGameData();
    if (offlineSeconds >= 30) {
      const multiplier = stage.chapter * 0.8;
      const gold = Math.floor(offlineSeconds * 3.5 * multiplier);
      const exp = Math.floor(offlineSeconds * 1.5 * multiplier);
      setOfflineReward({ seconds: offlineSeconds, gold, exp });
    }
  }, []);

  // Optimized Auto-Save: single interval on mount with fresh ref to eliminate GC churn
  const saveDataRef = useRef(saveData);
  useEffect(() => {
    saveDataRef.current = saveData;
  }, [saveData]);

  useEffect(() => {
    const timer = setInterval(() => {
      saveGameData(saveDataRef.current);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const equipmentCatalog = useMemo(() => {
    return saveData.equipmentCatalog && saveData.equipmentCatalog.length > 0
      ? saveData.equipmentCatalog
      : createDefaultEquipmentCatalog();
  }, [saveData.equipmentCatalog]);

  // --- Compute Total Combat Stats with Gear, Class Multipliers & Pet Buffs ---
  const combatCalculations = useMemo(() => {
    let equipAtk = 0;
    let equipHp = 0;
    let equipDef = 0;
    let equipCritRate = 0;

    Object.values(equipped).forEach((item) => {
      if (item) {
        equipAtk += item.atk || 0;
        equipHp += item.hp || 0;
        equipDef += item.def || 0;
        equipCritRate += item.critRate || 0;
      }
    });

    const equipOwnedBonus = calculateTotalEquipmentOwnedBonus(equipmentCatalog);
    const skillOwnedBonus = calculateTotalSkillOwnedBonus(skills);

    let petAtkMult = 0;
    let petGoldMult = 0;
    let petCritRateMult = 0;
    let petCritDmgMult = 0;
    let petAtkSpeedMult = 0;

    if (activePet) {
      const petVal = activePet.baseBuffValue * (1 + (activePet.level - 1) * 0.2);
      if (activePet.buffType === 'atk') petAtkMult = petVal;
      if (activePet.buffType === 'gold') petGoldMult = petVal;
      if (activePet.buffType === 'critRate') petCritRateMult = petVal;
      if (activePet.buffType === 'critDmg') petCritDmgMult = petVal;
      if (activePet.buffType === 'atkSpeed') petAtkSpeedMult = petVal;
    }

    const classConf = CLASS_CONFIGS[classId];
    // 전직 시스템 환생 처리: 전직 자격(promotion)은 유지하되 stats.level < 30 일 때는 비활성화, 레벨 30 재도달 시 자동 복구
    const isPromoted = promotion !== 'none' && stats.level >= 30;

    // Layered Base stat adjustments by class (Zero double counting)
    const rawHpBase = stats.baseHp + (stats.hpLevel - 1) * 35 + equipHp + equipOwnedBonus.ownedHp + skillOwnedBonus.ownedHp;
    const rawDefBase = stats.baseDef + (stats.defLevel - 1) * 2 + equipDef + equipOwnedBonus.ownedDef + skillOwnedBonus.ownedDef;
    const rawAtkBase = stats.baseAtk + (stats.atkLevel - 1) * 4 + equipAtk + equipOwnedBonus.ownedAtk + skillOwnedBonus.ownedAtk;

    const baseClassHp = rawHpBase * classConf.statBuffs.hpMult;
    const baseClassDef = rawDefBase * classConf.statBuffs.defMult;
    const baseClassAtk = rawAtkBase * classConf.statBuffs.atkMult;

    // Promotion passive bonuses (Active only when level >= 30)
    const promoAtkSpeed = isPromoted ? classConf.promotionBuffs.atkSpeedBonus : 0;
    const promoCritRate = isPromoted ? classConf.promotionBuffs.critRateBonus : 0;
    const promoSkillDmg = isPromoted ? classConf.promotionBuffs.skillDamageBonus : 0;
    const promoCdReduction = isPromoted ? classConf.promotionBuffs.cooldownReduction : 0;

    // Prestige Permanent Upgrades Multipliers (6 Core Stats)
    const pUpgrades = saveData.prestigeUpgrades || DEFAULT_PRESTIGE_UPGRADES;
    const prestigeAtkMult = (pUpgrades.atkLevel || 0) * 0.10;
    const prestigeHpMult = (pUpgrades.hpLevel || 0) * 0.10;
    const prestigeDefMult = (pUpgrades.defLevel || 0) * 0.10;
    const prestigeGoldMult = (pUpgrades.goldLevel || 0) * 0.08;
    const prestigeExpMult = (pUpgrades.expLevel || 0) * 0.08;
    const prestigeCritDmgBonus = (pUpgrades.critDmgLevel || 0) * 0.05;

    const totalAtk = Math.floor(baseClassAtk * (1 + petAtkMult) * (1 + prestigeAtkMult));
    const totalMaxHp = Math.floor(baseClassHp * (1 + prestigeHpMult));
    const totalDef = Math.floor(baseClassDef * (1 + prestigeDefMult));
    const totalCritRate = Math.min(
      0.85,
      stats.critRate + equipCritRate + (equipOwnedBonus.ownedCritRate / 100) + petCritRateMult + classConf.statBuffs.critRateBonus + promoCritRate
    );
    const totalCritDmg = stats.critDmg + (skillOwnedBonus.ownedCritDmg / 100) + petCritDmgMult + prestigeCritDmgBonus;
    const totalAtkSpeed = stats.atkSpeed * (1 + petAtkSpeedMult + promoAtkSpeed);

    const combatPower = Math.floor(
      totalAtk * 4.0 + totalMaxHp * 0.5 + totalDef * 3.0 + totalCritRate * 500 + (totalCritDmg - 1.5) * 300
    );

    return {
      totalAtk,
      totalMaxHp,
      totalDef,
      totalCritRate,
      totalCritDmg,
      totalAtkSpeed,
      combatPower,
      petGoldMult,
      prestigeGoldMult,
      prestigeExpMult,
      prestigeDefMult,
      prestigeAtkMult,
      prestigeHpMult,
      promoSkillDmg,
      promoCdReduction,
      equipOwnedBonus,
      skillOwnedBonus,
      isPromoted,
    };
  }, [stats, equipped, equipmentCatalog, skills, activePet, classId, promotion, saveData.prestigeUpgrades]);


  // Combat Power Growth Tracking & Floating Chip
  const prevCpRef = useRef(combatCalculations.combatPower);
  const cpInitializedRef = useRef(false);
  useEffect(() => {
    if (!cpInitializedRef.current) {
      cpInitializedRef.current = true;
      prevCpRef.current = combatCalculations.combatPower;
      return;
    }
    if (combatCalculations.combatPower > prevCpRef.current) {
      const delta = combatCalculations.combatPower - prevCpRef.current;
      setCpDelta({ value: combatCalculations.combatPower, delta });
      const timer = setTimeout(() => {
        setCpDelta(null);
      }, 1400);
      prevCpRef.current = combatCalculations.combatPower;
      return () => clearTimeout(timer);
    } else {
      prevCpRef.current = combatCalculations.combatPower;
    }
  }, [combatCalculations.combatPower]);

  // Keep player current HP bounded by totalMaxHp
  useEffect(() => {
    if (stats.currentHp > combatCalculations.totalMaxHp) {
      setSaveData((prev) => ({
        ...prev,
        stats: { ...prev.stats, currentHp: combatCalculations.totalMaxHp },
      }));
    }
  }, [combatCalculations.totalMaxHp]);

  // Spawn floating damage numbers strictly anchored to combatant sprite DOM
  const addDamageNumber = useCallback((val: number, isCritical: boolean, isPlayer: boolean, isSkill?: boolean, skillName?: string) => {
    if (!settings.damageNumbers) return;
    const id = `dmg_${Date.now()}_${Math.random()}`;
    const offsetX = Math.floor((Math.random() - 0.5) * 26);
    const offsetY = Math.floor((Math.random() - 0.5) * 12);

    setDamages((prev) => [...prev.slice(-8), { id, value: val, isCritical, isPlayer, offsetX, offsetY, isSkill, skillName }]);
    setTimeout(() => {
      setDamages((prev) => prev.filter((d) => d.id !== id));
    }, 480);
  }, [settings.damageNumbers]);

  // Helper to update quest progress
  const progressQuest = useCallback((type: Quest['type'], amount: number = 1) => {
    setSaveData((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.type === type && !q.completed) {
          const newCount = q.currentCount + amount;
          return {
            ...q,
            currentCount: newCount,
            completed: newCount >= q.targetCount,
          };
        }
        return q;
      });
      return { ...prev, quests: updatedQuests };
    });
  }, []);

  // --- Dedicated Dungeon Run Settlement & Restoration ---
  const finishDungeonRun = useCallback((reason: DungeonEndReason, overrideRun?: ActiveDungeonRun) => {
    if (dungeonEndingRef.current || !activeDungeonRef.current) return;
    dungeonEndingRef.current = true;

    const currentRun = overrideRun || activeDungeonRef.current;
    // In Gold Mine, surviving the 60s timer with >= 1 goblin kill is the victory condition
    const effectiveReason: DungeonEndReason =
      currentRun.dungeonId === 'gold_mine' && reason === 'timeout' && currentRun.kills > 0
        ? 'victory'
        : reason;

    const settledGold = currentRun.accumulatedGold;
    const settledExp = currentRun.accumulatedExp;
    const settledStones = effectiveReason === 'victory' ? currentRun.accumulatedStones : 0;

    // Compute level-ups & new difficulty unlock synchronously against saveDataRef
    const curSave = saveDataRef.current;
    let tempExp = curSave.stats.exp + settledExp;
    let tempLevel = curSave.stats.level;
    let tempMaxExp = curSave.stats.maxExp;
    while (tempExp >= tempMaxExp) {
      tempExp -= tempMaxExp;
      tempLevel++;
      tempMaxExp = Math.floor(tempMaxExp * 1.35);
    }
    const levelsGained = Math.max(0, tempLevel - curSave.stats.level);

    const curDungeonState = checkAndResetDailyDungeonTickets(curSave.dungeons);
    const curRec = curDungeonState.records[currentRun.dungeonId];
    let unlockedNewDiff: number | undefined;
    if (effectiveReason === 'victory') {
      const nextUnlock = Math.min(5, Math.max(curRec.unlockedDifficulty, currentRun.difficulty + 1));
      if (nextUnlock > curRec.unlockedDifficulty) {
        unlockedNewDiff = nextUnlock;
      }
    }

    if (effectiveReason === 'victory' || levelsGained > 0) {
      sound.playFanfare();
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.5 } });
    } else {
      sound.playMonsterDefeat();
    }

    setSaveData((prev) => {
      let newExp = prev.stats.exp + settledExp;
      let newLevel = prev.stats.level;
      let newMaxExp = prev.stats.maxExp;
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = Math.floor(newMaxExp * 1.35);
      }

      const prevDungeons = checkAndResetDailyDungeonTickets(prev.dungeons);
      const prevRec = prevDungeons.records[currentRun.dungeonId];
      const nextHighestCleared =
        effectiveReason === 'victory'
          ? Math.max(prevRec.highestClearedDifficulty, currentRun.difficulty)
          : prevRec.highestClearedDifficulty;
      const nextUnlocked =
        effectiveReason === 'victory'
          ? Math.min(5, Math.max(prevRec.unlockedDifficulty, currentRun.difficulty + 1))
          : prevRec.unlockedDifficulty;

      const updatedDungeons = {
        ...prevDungeons,
        records: {
          ...prevDungeons.records,
          [currentRun.dungeonId]: {
            ...prevRec,
            unlockedDifficulty: nextUnlocked,
            highestClearedDifficulty: nextHighestCleared,
            totalClears: effectiveReason === 'victory' ? prevRec.totalClears + 1 : prevRec.totalClears,
          },
        },
      };

      const updated: GameSaveData = {
        ...prev,
        enhancementStones: (prev.enhancementStones ?? 0) + settledStones,
        dungeons: updatedDungeons,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold + settledGold,
          exp: newExp,
          level: newLevel,
          maxExp: newMaxExp,
          currentHp: combatCalcRef.current.totalMaxHp,
        },
      };
      saveGameData(updated);
      return updated;
    });

    // Restore normal stage monster & combat state cleanly
    const snapshot = savedNormalCombatSnapshotRef.current;
    const restoredMon =
      snapshot?.monster ||
      getMonsterForStage(
        curSave.stage.chapter,
        curSave.stage.stage === 10 && !curSave.stage.inBossFight ? 9 : curSave.stage.stage
      );
    const restoredStatuses = snapshot?.statuses || [];
    savedNormalCombatSnapshotRef.current = null;

    activeDungeonRef.current = null;
    setActiveDungeonRun(null);

    currentMonsterRef.current = restoredMon;
    setCurrentMonster(restoredMon);
    setMonsterStatuses(restoredStatuses);
    monsterStatusesRef.current = restoredStatuses;
    basicComboRef.current = 1;
    setBasicComboStep(1);
    comboCompletedCountRef.current = 0;
    setComboCompletedCount(0);
    setIsPlayerAttacking(false);
    isBasicAttackingRef.current = false;
    setIsFinisherHit(false);
    setHitComboStep(null);
    setIsCriticalHit(false);
    setIsMonsterDefeated(false);
    isMonsterDefeatedRef.current = false;
    lastMonsterAttackTimeRef.current = Date.now();

    setDungeonResult({
      ...currentRun,
      accumulatedStones: settledStones,
      status: 'ended',
      endReason: effectiveReason,
      levelsGained,
      newDifficultyUnlocked: unlockedNewDiff,
    });
  }, []);

  const handleEnterDungeon = useCallback(
    (dungeonId: DungeonId, difficulty: number) => {
      if (activeDungeonRef.current) return false;
      const curSave = saveDataRef.current;
      const curDungeons = checkAndResetDailyDungeonTickets(curSave.dungeons);
      const rec = curDungeons.records[dungeonId];
      const diffCfg = getDungeonDifficultyConfig(dungeonId, difficulty);
      const cfg = DUNGEONS_DATA[dungeonId];

      if (!rec || difficulty < 1 || difficulty > 5) return false;
      if (difficulty > rec.unlockedDifficulty) return false;
      if (curSave.stats.level < diffCfg.requiredLevel) return false;
      if (rec.ticketsLeft <= 0) return false;

      // Immediately deduct 1 ticket & persist to LocalStorage (no ticket duplication on abandon/refresh)
      setSaveData((prev) => {
        const dState = checkAndResetDailyDungeonTickets(prev.dungeons);
        const pRec = dState.records[dungeonId];
        const updated: GameSaveData = {
          ...prev,
          stats: {
            ...prev.stats,
            currentHp: combatCalcRef.current.totalMaxHp,
          },
          dungeons: {
            ...dState,
            records: {
              ...dState.records,
              [dungeonId]: {
                ...pRec,
                ticketsLeft: Math.max(0, pRec.ticketsLeft - 1),
              },
            },
          },
        };
        saveGameData(updated);
        return updated;
      });

      // Save normal stage combat snapshot
      savedNormalCombatSnapshotRef.current = {
        monster: { ...currentMonsterRef.current },
        statuses: [...monsterStatusesRef.current],
      };

      const firstMon = getDungeonMonster(dungeonId, difficulty, dungeonId === 'gold_mine' ? 0 : 1);
      const newRun: ActiveDungeonRun = {
        dungeonId,
        difficulty,
        timeLeft: cfg.timeLimit,
        maxTime: cfg.timeLimit,
        kills: 0,
        currentWave: 1,
        maxWave: cfg.maxWave,
        accumulatedGold: 0,
        accumulatedExp: 0,
        accumulatedStones: 0,
        status: 'fighting',
      };

      dungeonEndingRef.current = false;
      activeDungeonRef.current = newRun;
      setActiveDungeonRun(newRun);
      setDungeonResult(null);

      currentMonsterRef.current = firstMon;
      setCurrentMonster(firstMon);
      setMonsterStatuses([]);
      monsterStatusesRef.current = [];
      basicComboRef.current = 1;
      setBasicComboStep(1);
      comboCompletedCountRef.current = 0;
      setComboCompletedCount(0);
      setIsPlayerAttacking(false);
      isBasicAttackingRef.current = false;
      setIsFinisherHit(false);
      setHitComboStep(null);
      setIsCriticalHit(false);
      setIsMonsterDefeated(false);
      isMonsterDefeatedRef.current = false;
      lastMonsterAttackTimeRef.current = Date.now();

      sound.playFanfare();
      setStageNotice(`⚔️ [${cfg.name} · ${difficulty}단계] 입장! (입장권 1 소모)`);
      setTimeout(() => setStageNotice(null), 1800);
      setActiveTab('adventure');
      return true;
    },
    []
  );

  const handleAbandonDungeon = useCallback(() => {
    if (!activeDungeonRef.current || dungeonEndingRef.current) return;
    finishDungeonRun('abandoned');
  }, [finishDungeonRun]);

  // --- Monster Defeated Handler ---
  const isMonsterDefeatedRef = useRef(isMonsterDefeated);
  useEffect(() => {
    isMonsterDefeatedRef.current = isMonsterDefeated;
  }, [isMonsterDefeated]);

  const handleMonsterDefeat = useCallback(() => {
    if (isMonsterDefeatedRef.current) return;

    // 🏰 Dedicated Dungeon Mode Monster Defeat Branch (Strictly isolated from Normal Stage)
    if (activeDungeonRef.current) {
      if (dungeonEndingRef.current) return;
      isMonsterDefeatedRef.current = true;
      sound.playMonsterDefeat();
      setIsMonsterDefeated(true);

      const run = activeDungeonRef.current;
      const { petGoldMult, prestigeGoldMult = 0, prestigeExpMult = 0 } = combatCalculations;
      const defeatedMon = currentMonsterRef.current;

      if (run.dungeonId === 'gold_mine') {
        const earnedGold = Math.floor(defeatedMon.goldReward * (1 + petGoldMult + prestigeGoldMult));
        const nextKills = run.kills + 1;
        const nextRun: ActiveDungeonRun = {
          ...run,
          kills: nextKills,
          accumulatedGold: run.accumulatedGold + earnedGold,
        };
        activeDungeonRef.current = nextRun;
        setActiveDungeonRun(nextRun);

        sound.playGold();
        setDungeonVfxEvent({ id: `dg_gold_${Date.now()}`, type: 'gold_burst' });
        const dropId = `dg_drop_${Date.now()}`;
        setFloatingGold((prev) => [...prev.slice(-3), { id: dropId, gold: earnedGold }]);
        setTimeout(() => {
          setFloatingGold((prev) => prev.filter((d) => d.id !== dropId));
        }, 850);

        setTimeout(() => {
          if (!activeDungeonRef.current || dungeonEndingRef.current) return;
          const nextGoblin = getDungeonMonster('gold_mine', run.difficulty, nextKills);
          currentMonsterRef.current = nextGoblin;
          setCurrentMonster(nextGoblin);
          setMonsterStatuses([]);
          monsterStatusesRef.current = [];
          setIsMonsterDefeated(false);
          isMonsterDefeatedRef.current = false;
          lastMonsterAttackTimeRef.current = Date.now();
        }, 220);
        return;
      }

      if (run.dungeonId === 'training_forest') {
        const waveExp = Math.floor(defeatedMon.expReward * (1 + prestigeExpMult));
        const nextKills = run.kills + 1;
        setDungeonVfxEvent({ id: `dg_wave_${Date.now()}`, type: 'wave_clear' });

        if (nextKills >= run.maxWave) {
          const diffCfg = getDungeonDifficultyConfig('training_forest', run.difficulty);
          const clearBonusExp = Math.floor(diffCfg.baseExpReward * 1.6 * (1 + prestigeExpMult));
          const finalRun: ActiveDungeonRun = {
            ...run,
            kills: nextKills,
            currentWave: run.maxWave,
            accumulatedExp: run.accumulatedExp + waveExp + clearBonusExp,
          };
          activeDungeonRef.current = finalRun;
          setActiveDungeonRun(finalRun);
          setTimeout(() => {
            finishDungeonRun('victory', finalRun);
          }, 260);
          return;
        }

        const nextWave = nextKills + 1;
        const nextRun: ActiveDungeonRun = {
          ...run,
          kills: nextKills,
          currentWave: nextWave,
          accumulatedExp: run.accumulatedExp + waveExp,
        };
        activeDungeonRef.current = nextRun;
        setActiveDungeonRun(nextRun);
        setStageNotice(`🌲 수련의 숲 Wave ${nextWave} / ${run.maxWave} 돌파!`);
        setTimeout(() => setStageNotice(null), 1200);

        setTimeout(() => {
          if (!activeDungeonRef.current || dungeonEndingRef.current) return;
          const nextMon = getDungeonMonster('training_forest', run.difficulty, nextWave);
          currentMonsterRef.current = nextMon;
          setCurrentMonster(nextMon);
          setMonsterStatuses([]);
          monsterStatusesRef.current = [];
          setIsMonsterDefeated(false);
          isMonsterDefeatedRef.current = false;
          lastMonsterAttackTimeRef.current = Date.now();
        }, 250);
        return;
      }

      // ancient_ruins boss defeated
      const diffCfg = getDungeonDifficultyConfig('ancient_ruins', run.difficulty);
      const earnedGold = Math.floor(diffCfg.baseGoldReward * (1 + petGoldMult + prestigeGoldMult));
      const earnedExp = Math.floor(diffCfg.baseExpReward * (1 + prestigeExpMult));
      const earnedStones = diffCfg.stoneReward;
      setDungeonVfxEvent({ id: `dg_ruins_${Date.now()}`, type: 'ruins_clear' });

      const finalRun: ActiveDungeonRun = {
        ...run,
        kills: 1,
        accumulatedGold: earnedGold,
        accumulatedExp: earnedExp,
        accumulatedStones: earnedStones,
      };
      activeDungeonRef.current = finalRun;
      setActiveDungeonRun(finalRun);
      setTimeout(() => {
        finishDungeonRun('victory', finalRun);
      }, 280);
      return;
    }

    isMonsterDefeatedRef.current = true;
    sound.playMonsterDefeat();
    setIsMonsterDefeated(true);

    const { petGoldMult, prestigeGoldMult = 0, prestigeExpMult = 0 } = combatCalculations;
    const earnedGold = Math.floor(currentMonster.goldReward * (1 + petGoldMult + prestigeGoldMult));
    const earnedExp = Math.floor(currentMonster.expReward * (1 + prestigeExpMult));

    // 🪙 Trigger Floating Gold Drop FX on Monster defeat
    const dropId = `gold_${Date.now()}`;
    setFloatingGold((prev) => [...prev.slice(-3), { id: dropId, gold: earnedGold }]);
    setTimeout(() => {
      setFloatingGold((prev) => prev.filter((d) => d.id !== dropId));
    }, 900);

    // 18% Chance to drop random equipment
    let droppedItem: Equipment | null = null;
    if (Math.random() < 0.18 || currentMonster.isBoss) {
      droppedItem = generateRandomEquipment(currentMonster.isBoss ? 'rare' : undefined);
      // ⚔️ Trigger Dropped Item Alert
      const lootId = `loot_${Date.now()}`;
      setLootAlert({ id: lootId, item: droppedItem });
      setTimeout(() => {
        setLootAlert((prev) => (prev?.id === lootId ? null : prev));
      }, 1600);
    }

    // Determine next stage progression (3-Chapter Upper Bound Consistency)
    let nextChapter = stage.chapter;
    let nextStageNum = stage.stage;
    if (stage.stage === 10 && stage.inBossFight) {
      if (stage.chapter < 3) {
        nextChapter = stage.chapter + 1;
        nextStageNum = 1;
        setStageNotice(`🎉 챕터 ${nextChapter} 돌파!`);
      } else {
        nextChapter = 3;
        nextStageNum = 10;
        setStageNotice(`🎉 최종 챕터 3-10 보스 토벌 완료!`);
      }
      setTimeout(() => setStageNotice(null), 1600);
    } else if (stage.stage < 10) {
      if (stage.killCount + 1 >= stage.killsRequired) {
        nextStageNum = stage.stage + 1;
        setStageNotice(`⚔️ 스테이지 ${nextChapter}-${nextStageNum} 진입!`);
        setTimeout(() => setStageNotice(null), 1500);
      }
    }

    setTimeout(() => {
      setSaveData((prev) => {
        let newExp = prev.stats.exp + earnedExp;
        let newLevel = prev.stats.level;
        let newMaxExp = prev.stats.maxExp;
        let leveledUp = false;

        while (newExp >= newMaxExp) {
          newExp -= newMaxExp;
          newLevel++;
          newMaxExp = Math.floor(newMaxExp * 1.35);
          leveledUp = true;
        }

        if (leveledUp) {
          sound.playFanfare();
          confetti({ particleCount: 50, spread: 65, origin: { y: 0.5 } });
        } else {
          sound.playGold();
        }

        let newStage = { ...prev.stage };
        let clearedFinalChapter3Boss = false;
        if (newStage.stage === 10 && newStage.inBossFight) {
          sound.playFanfare();
          confetti({ particleCount: 90, spread: 85, origin: { y: 0.5 } });
          progressQuest('defeat_boss', 1);

          if (newStage.chapter < 3) {
            newStage.chapter += 1;
            newStage.stage = 1;
            newStage.killCount = 0;
            newStage.inBossFight = false;
          } else {
            newStage.chapter = 3;
            newStage.stage = 10;
            newStage.killCount = 0;
            newStage.inBossFight = false;
            newStage.highestChapter = 3;
            newStage.highestStage = 10;
            clearedFinalChapter3Boss = true;
          }
        } else if (newStage.stage < 10) {
          newStage.killCount += 1;
          progressQuest('kill_monster', 1);

          if (newStage.killCount >= newStage.killsRequired) {
            newStage.stage += 1;
            newStage.killCount = 0;
            progressQuest('reach_stage', newStage.stage);
          }
        }

        // Track highest chapter & stage (capped cleanly at 3-10)
        if (newStage.chapter > newStage.highestChapter) {
          newStage.highestChapter = Math.min(3, newStage.chapter);
          newStage.highestStage = Math.min(10, newStage.stage);
        } else if (newStage.chapter === newStage.highestChapter && newStage.stage > newStage.highestStage) {
          newStage.highestStage = Math.min(10, newStage.stage);
        }

        const hasUnlockedPrestigeNow =
          prev.hasPrestigeUnlocked ||
          (prev.prestigeCount ?? 0) > 0 ||
          clearedFinalChapter3Boss ||
          (newStage.highestChapter === 3 && newStage.highestStage >= 10);

        if (!prev.hasPrestigeUnlocked && hasUnlockedPrestigeNow) {
          setTimeout(() => {
            setStageNotice('🎉 [환생] 시스템 해금! 영구적인 별가루 성장이 가능합니다.');
            setTimeout(() => setStageNotice(null), 3000);
          }, 600);
        }

        let currentCatalog = prev.equipmentCatalog;
        let currentEquipped = prev.equipped;
        let goldSpentOnAuto = 0;
        if (droppedItem) {
          const res = processEquipmentAcquisition(droppedItem, prev);
          currentCatalog = res.equipmentCatalog;
          currentEquipped = res.equipped;
          goldSpentOnAuto = res.goldSpent;
        }

        // Charge Awakening Gauge on monster kill (+10%, only if level >= 30)
        const nextAwakening = (prev.awakeningUnlocked && newLevel >= 30)
          ? Math.min(100, Math.round(((prev.awakeningGauge ?? 0) + 10) * 10) / 10)
          : 0;

        return {
          ...prev,
          hasPrestigeUnlocked: hasUnlockedPrestigeNow,
          awakeningGauge: nextAwakening,
          equipmentCatalog: currentCatalog,
          equipped: currentEquipped,
          stats: {
            ...prev.stats,
            gold: prev.stats.gold + earnedGold - goldSpentOnAuto,
            exp: newExp,
            level: newLevel,
            maxExp: newMaxExp,
            currentHp: combatCalculations.totalMaxHp,
          },
          inventory: prev.inventory,
          stage: newStage,
        };
      });

      const monStage = (nextStageNum === 10 && !stage.inBossFight) ? 9 : nextStageNum;
      const nextMon = getMonsterForStage(nextChapter, monStage);
      currentMonsterRef.current = nextMon;
      setCurrentMonster(nextMon);
      setMonsterStatuses([]);
      monsterStatusesRef.current = [];
      basicComboRef.current = 1;
      setBasicComboStep(1);
      comboCompletedCountRef.current = 0;
      setComboCompletedCount(0);
      setIsPlayerAttacking(false);
      isBasicAttackingRef.current = false;
      setIsFinisherHit(false);
      setHitComboStep(null);
      setIsCriticalHit(false);
      setIsMonsterDefeated(false);
      isMonsterDefeatedRef.current = false;
      lastMonsterAttackTimeRef.current = Date.now();
    }, 380);
  }, [currentMonster, combatCalculations, stage, progressQuest]);

  // --- Shared Combat Refs (Prevents Interval Reset Starvation on Monster HP Changes!) ---
  const handleMonsterDefeatRef = useRef(handleMonsterDefeat);
  useEffect(() => {
    handleMonsterDefeatRef.current = handleMonsterDefeat;
  }, [handleMonsterDefeat]);

  const addDamageNumberRef = useRef(addDamageNumber);
  useEffect(() => {
    addDamageNumberRef.current = addDamageNumber;
  }, [addDamageNumber]);

  const skillCooldownsRef = useRef(skillCooldowns);
  useEffect(() => {
    skillCooldownsRef.current = skillCooldowns;
  }, [skillCooldowns]);

  const skillsRef = useRef(skills);
  useEffect(() => {
    skillsRef.current = skills;
  }, [skills]);

  const equippedSkillIdsRef = useRef(equippedSkillIds);
  useEffect(() => {
    equippedSkillIdsRef.current = equippedSkillIds;
  }, [equippedSkillIds]);

  const currentMonsterRef = useRef(currentMonster);
  useEffect(() => {
    currentMonsterRef.current = currentMonster;
  }, [currentMonster]);

  const combatCalcRef = useRef(combatCalculations);
  useEffect(() => {
    combatCalcRef.current = combatCalculations;
  }, [combatCalculations]);

  const awakeningUnlockedRef = useRef(awakeningUnlocked);
  useEffect(() => {
    awakeningUnlockedRef.current = awakeningUnlocked;
  }, [awakeningUnlocked]);

  const awakeningGaugeRef = useRef(awakeningGauge);
  useEffect(() => {
    awakeningGaugeRef.current = awakeningGauge;
  }, [awakeningGauge]);

  const awakeningSkillRef = useRef(awakeningSkill);
  useEffect(() => {
    awakeningSkillRef.current = awakeningSkill;
  }, [awakeningSkill]);

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const classIdRef = useRef(classId);
  useEffect(() => {
    classIdRef.current = classId;
  }, [classId]);

  const activePetRef = useRef(activePet);
  useEffect(() => {
    activePetRef.current = activePet;
  }, [activePet]);

  // Expose QA telemetry & preset helpers on window
  useEffect(() => {
    (window as any).__getCombatStats = () => ({
      totalBasicAttacks: totalBasicAttacksRef.current,
      totalSkillCasts: totalSkillCastsRef.current,
      basicComboStep: basicComboRef.current,
      comboCompletedCount: comboCompletedCountRef.current,
      isBasicAttacking: isBasicAttackingRef.current,
      isCasting: isCastingRef.current,
      monsterHp: currentMonsterRef.current?.currentHp,
      monsterStatuses: monsterStatusesRef.current,
    });

    (window as any).__applyCombatTestPreset = (targetClass: CharacterClassId) => {
      totalBasicAttacksRef.current = 0;
      totalSkillCastsRef.current = 0;
      basicComboRef.current = 1;
      skillsCastSinceBasicRef.current = 1;
      isBasicAttackingRef.current = false;
      isCastingRef.current = false;
      setSkillCooldowns({});
      skillCooldownsRef.current = {};

      const eqIds =
        targetClass === 'warrior'
          ? ['flame_sword', 'shield_bash', 'blade_storm', 'sword_wave']
          : ['frost_nova', 'thunder_strike', 'fireball', 'arcane_orb'];

      setSaveData((prev) => {
        const nextSkills = (prev.skills ?? INITIAL_SKILLS).map((s) => ({
          ...s,
          owned: true,
          unlocked: true,
          level: 12,
        }));
        skillsRef.current = nextSkills;
        equippedSkillIdsRef.current = eqIds;
        classIdRef.current = targetClass;

        const updated: GameSaveData = {
          ...prev,
          hasSelectedClass: true,
          classId: targetClass,
          promotion: targetClass === 'warrior' ? 'sword_master' : 'archmage',
          awakeningUnlocked: true,
          awakeningGauge: 55,
          activePetId: 'pet_fox',
          pets: prev.pets.map((p) => ({ ...p, owned: true, level: 8 })),
          skills: nextSkills,
          equippedSkillIds: eqIds,
          stats: {
            ...prev.stats,
            level: 30,
            atkLevel: 35,
            hpLevel: 35,
            defLevel: 30,
            atkSpeed: 1.65,
            gold: 950000,
          },
          stage: {
            ...prev.stage,
            chapter: 2,
            stage: 10,
            inBossFight: true,
          },
        };
        saveGameData(updated);
        return updated;
      });

      const bossMon = {
        ...getMonsterForStage(2, 10),
        maxHp: 500000,
        currentHp: 500000,
      };
      setCurrentMonster(bossMon);
      currentMonsterRef.current = bossMon;
      setIsMonsterDefeated(false);
      isMonsterDefeatedRef.current = false;
    };
  }, []);

  // --- 1. Ref-Stabilized 3-Combo Basic Attack Engine (50ms High-Precision Scheduler) ---
  useEffect(() => {
    const basicTimer = setInterval(() => {
      const now = Date.now();

      // Failsafe auto-recovery: If action lock has been held for > 850ms, force-release it!
      if (isBasicAttackingRef.current && now - lastBasicAttackTimeRef.current > 850) {
        isBasicAttackingRef.current = false;
        setIsPlayerAttacking(false);
      }

      // Combo drop on idle (> 2.2s without attacking): reset string to 1타
      if (comboCompletedCountRef.current > 0 && now - lastBasicAttackTimeRef.current > 2200) {
        basicComboRef.current = 1;
        setBasicComboStep(1);
        comboCompletedCountRef.current = 0;
        setComboCompletedCount(0);
      }

      if (isMonsterDefeatedRef.current || currentMonsterRef.current.currentHp <= 0) return;
      if (isBasicAttackingRef.current || isCastingRef.current) return;

      const calc = combatCalcRef.current;
      const intervalMs = Math.max(300, Math.floor(1000 / calc.totalAtkSpeed));

      if (now - lastBasicAttackTimeRef.current < intervalMs) return;

      // Begin 3-Stage Basic Attack Swing
      lastBasicAttackTimeRef.current = now;
      isBasicAttackingRef.current = true;
      skillsCastSinceBasicRef.current = 0;

      const combo = basicComboRef.current;
      basicComboRef.current = combo === 1 ? 2 : combo === 2 ? 3 : 1;
      setBasicComboStep(combo);
      setIsPlayerAttacking(true);

      const curClass = classIdRef.current;
      setBasicAttackEvent({
        id: `ba_${now}_${combo}`,
        comboStep: combo,
        classId: curClass,
      });
      totalBasicAttacksRef.current += 1;

      const speedScale = Math.min(1.4, Math.max(0.85, (combatCalcRef.current?.totalAtkSpeed || 1.2) / 1.2));
      const baseContactDelay =
        curClass === 'mage'
          ? combo === 1 ? 170 : combo === 2 ? 190 : 230
          : combo === 1 ? 120 : combo === 2 ? 150 : 190;
      const baseAnimDuration =
        curClass === 'mage'
          ? combo === 1 ? 300 : combo === 2 ? 340 : 440
          : combo === 1 ? 280 : combo === 2 ? 320 : 420;

      const contactDelay = Math.round(baseContactDelay / speedScale);
      const animDuration = Math.round(baseAnimDuration / speedScale);

      // End player attack animation at the end of swing duration
      setTimeout(() => {
        setIsPlayerAttacking(false);
        if (combo === 1) {
          comboCompletedCountRef.current = 1;
          setComboCompletedCount(1);
        } else if (combo === 2) {
          comboCompletedCountRef.current = 2;
          setComboCompletedCount(2);
        } else {
          comboCompletedCountRef.current = 0;
          setComboCompletedCount(0);
          setBasicComboStep(1);
        }
      }, animDuration);

      setTimeout(() => {
        if (isMonsterDefeatedRef.current || currentMonsterRef.current.currentHp <= 0) {
          setIsPlayerAttacking(false);
          isBasicAttackingRef.current = false;
          setHitComboStep(null);
          setIsCriticalHit(false);
          return;
        }

        const latestCalc = combatCalcRef.current;
        const targetMon = currentMonsterRef.current;
        const curStage = stageRef.current;

        // 3-Stage Combo Multiplier: 1타 (100%) -> 2타 (120%) -> 3타 피니시 (155%)
        const comboMult = combo === 3 ? 1.55 : combo === 2 ? 1.2 : 1.0;
        const hasArmorBreak = monsterStatusesRef.current.some((s) => s.type === 'armor_break');
        const effDef = targetMon.def * (hasArmorBreak ? 0.12 : 0.3);

        const isCrit = Math.random() < latestCalc.totalCritRate || combo === 3;
        const isBoss = curStage.stage === 10 && curStage.inBossFight;
        const damage = Math.floor(
          Math.max(
            1,
            latestCalc.totalAtk * comboMult * (isCrit ? latestCalc.totalCritDmg : 1) - effDef
          )
        );

        if (isCrit) {
          sound.playCriticalHit();
        } else {
          sound.playAttack();
        }

        const hitStopDuration = combo === 3 ? 70 : isBoss ? 60 : isCrit ? 55 : 40;
        const shakeType: 'normal' | 'crit' | 'boss' =
          combo === 3 || isBoss ? 'crit' : isCrit ? 'crit' : 'normal';

        setIsHitStop(true);
        setIsMonsterHit(true);
        setHitComboStep(combo);
        setIsCriticalHit(isCrit);
        if (combo === 3) {
          setIsFinisherHit(true);
        }
        setScreenShake(shakeType);

        const comboBanner =
          combo === 3
            ? curClass === 'mage'
              ? '✨ 3연타 마력폭발!'
              : '⚡ 3연타 강타!'
            : undefined;
        addDamageNumberRef.current(damage, isCrit, false, combo === 3, comboBanner);
        recentDamageLogRef.current.push({ time: Date.now(), amount: damage });

        // Charge Awakening Gauge on basic attack hit (+2.5%, or +5% on 3rd-hit finisher, only when Lv >= 30)
        const awkGain = combo === 3 ? 5.0 : 2.5;
        setSaveData((prev) => {
          if (!prev.awakeningUnlocked || (prev.stats?.level ?? 1) < 30) return prev;
          return {
            ...prev,
            awakeningGauge: Math.min(100, Math.round(((prev.awakeningGauge ?? 0) + awkGain) * 10) / 10),
          };
        });

        setCurrentMonster((prev) => {
          const nextHp = Math.max(0, prev.currentHp - damage);
          if (nextHp <= 0) {
            handleMonsterDefeatRef.current();
          }
          return { ...prev, currentHp: nextHp };
        });

        setTimeout(() => setIsHitStop(false), hitStopDuration);
        setTimeout(() => setScreenShake('none'), hitStopDuration + 75);
        setTimeout(() => {
          setIsMonsterHit(false);
          setIsFinisherHit(false);
          setHitComboStep(null);
          setIsCriticalHit(false);
        }, hitStopDuration + 80);

        // Release action lock quickly after impact so skills/next swings weave seamlessly
        setTimeout(() => {
          isBasicAttackingRef.current = false;
        }, 60);
      }, contactDelay);
    }, 50);

    return () => clearInterval(basicTimer);
  }, []);

  // --- 2. Auto Skill Engine with Basic Attack Weaving (Single Unified 100ms Tick) ---
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Decrement existing cooldowns by 0.1s
      setSkillCooldowns((prev) => {
        let hasActive = false;
        const updated: Record<string, number> = {};
        for (const [key, val] of Object.entries(prev)) {
          if (val > 0) {
            hasActive = true;
            updated[key] = Math.max(0, Math.round((val - 0.1) * 10) / 10);
          } else {
            updated[key] = 0;
          }
        }
        return hasActive ? updated : prev;
      });

      const now = Date.now();

      // Failsafe auto-recovery: If casting lock has been held for > 1600ms, force-release it!
      if (isCastingRef.current && now - lastSkillCastTimeRef.current > 1600) {
        isCastingRef.current = false;
        setIsCasting(false);
      }

      // 2. Never interrupt an active skill OR an active basic attack swing!
      if (
        isCastingRef.current ||
        isBasicAttackingRef.current ||
        isMonsterDefeatedRef.current ||
        currentMonsterRef.current.currentHp <= 0
      ) {
        return;
      }

      // Enforce post-skill recovery breathing gap and 1:1 Basic Attack <-> Skill Weaving!
      if (now - lastSkillEndTimeRef.current < 160) return;
      if (!saveDataRef.current.skillCooldownOff && skillsCastSinceBasicRef.current >= 1) {
        return;
      }

      // 3. Candidate Selection: Priority 1 Awakening -> Priority 2 Slot 1~4
      let candidate: Skill | null = null;
      let isAwakeningCast = false;

      if (
        awakeningUnlockedRef.current &&
        (saveDataRef.current.stats?.level ?? 1) >= 30 &&
        (awakeningGaugeRef.current ?? 0) >= 100 &&
        awakeningSkillRef.current
      ) {
        candidate = awakeningSkillRef.current;
        isAwakeningCast = true;
      } else {
        const currentSkills = skillsRef.current;
        const currentEquipped = equippedSkillIdsRef.current;
        const currentCds = skillCooldownsRef.current;

        for (let i = 0; i < currentEquipped.length; i++) {
          const sId = currentEquipped[i];
          if (!sId) continue;
          const cd = currentCds[sId] ?? 0;
          if (cd <= 0) {
            const sk = currentSkills.find((s) => s.id === sId && (s.owned || s.unlocked));
            if (sk) {
              candidate = sk;
              break;
            }
          }
        }
      }

      if (!candidate) return;

      // 4. Begin Cast
      const castSkill = candidate;
      lastSkillCastTimeRef.current = now;
      skillsCastSinceBasicRef.current += 1;
      totalSkillCastsRef.current += 1;
      isCastingRef.current = true;
      setIsCasting(true);
      setCastingSkillType(castSkill.effectType);
      setCastingSkillId(castSkill.id);

      const currentCalc = combatCalcRef.current;
      const promoSkillMult = 1 + (currentCalc.promoSkillDmg || 0);
      const mult = (castSkill.baseDamageMult + (castSkill.level - 1) * castSkill.damageMultPerLevel) * promoSkillMult;
      const targetMonster = currentMonsterRef.current;
      const baseSkillDamage = Math.floor(
        Math.max(1, currentCalc.totalAtk * mult - targetMonster.def * 0.25)
      );

      // 💥 Detect Skill Synergies against active Monster Statuses
      let skillDamage = baseSkillDamage;
      let synergyBanner: string | null = null;
      const activeStatuses = monsterStatusesRef.current;

      if (castSkill.synergyTrigger === 'shatter_lightning' && activeStatuses.some((s) => s.type === 'freeze')) {
        skillDamage = Math.floor(baseSkillDamage * 1.5);
        synergyBanner = '⚡ Shatter Lightning (+50%)';
      } else if (castSkill.synergyTrigger === 'flame_burst' && activeStatuses.some((s) => s.type === 'burn')) {
        skillDamage = Math.floor(baseSkillDamage * 1.6);
        synergyBanner = '🔥 Flame Burst (+60%)';
      } else if (castSkill.synergyTrigger === 'cosmic_implosion') {
        skillDamage = Math.floor(baseSkillDamage * 1.6);
        synergyBanner = '🌌 Cosmic Implosion (+60%)';
      } else if (
        castSkill.synergyTrigger === 'armor_shatter' &&
        activeStatuses.some((s) => s.type === 'armor_break' || s.type === 'stun')
      ) {
        skillDamage = Math.floor(baseSkillDamage * 1.8);
        synergyBanner = '⚔️ Armor Shatter (+80%)';
      }

      if (isAwakeningCast) {
        // === AWAKENING SPECTACLE TIMELINE ===
        setIsAwakeningCasting(true);
        setSaveData((prev) => ({
          ...prev,
          awakeningGauge: prev.infiniteAwakening ? 100 : 0,
        }));
        sound.playFanfare();
        setScreenShake('boss');

        // Phase 2: Massive VFX Spawn (240ms)
        const vfxId = `awk_${castSkill.id}_${now}`;
        setTimeout(() => {
          setActiveSkillVfx({ id: vfxId, type: castSkill.effectType });
        }, 240);

        // Phase 3: Catastrophic Impact (480ms)
        setTimeout(() => {
          sound.playCriticalHit();
          setIsHitStop(true);
          setIsMonsterHit(true);
          setIsFinisherHit(true);
          setHitComboStep(3);
          setIsCriticalHit(true);
          setScreenShake('boss');
          addDamageNumberRef.current(skillDamage, true, false, true, synergyBanner || `👑 ${castSkill.name}`);
          recentDamageLogRef.current.push({ time: Date.now(), amount: skillDamage });

          setTimeout(() => setIsHitStop(false), 130);
          setTimeout(() => setScreenShake('none'), 240);
          setTimeout(() => {
            setIsMonsterHit(false);
            setIsFinisherHit(false);
            setHitComboStep(null);
            setIsCriticalHit(false);
          }, 280);

          setCurrentMonster((prev) => {
            const nextHp = Math.max(0, prev.currentHp - skillDamage);
            if (nextHp <= 0) {
              handleMonsterDefeatRef.current();
            }
            return { ...prev, currentHp: nextHp };
          });
        }, 480);

        // Phase 4: Recovery Completes (820ms)
        setTimeout(() => {
          setActiveSkillVfx((prev) => (prev?.id === vfxId ? null : prev));
          setIsAwakeningCasting(false);
          setIsCasting(false);
          isCastingRef.current = false;
          lastSkillEndTimeRef.current = Date.now();
          setCastingSkillId(null);
          setCastingSkillType(null);
        }, 820);
      } else {
        // === NORMAL SKILL TIMELINE ===
        const baseReducedCd = Math.max(
          2,
          Math.round(castSkill.cooldown * (1 - (currentCalc.promoCdReduction || 0)) * 10) / 10
        );
        const reducedCd = saveDataRef.current.skillCooldownOff ? 0.05 : baseReducedCd;
        setSkillCooldowns((prev) => ({
          ...prev,
          [castSkill.id]: reducedCd,
        }));

        // Phase 2: VFX Spawn (160ms)
        const vfxId = `${castSkill.id}_${now}`;
        setTimeout(() => {
          setActiveSkillVfx({ id: vfxId, type: castSkill.effectType });
        }, 160);

        // Phase 3: Impact on Enemy (260ms)
        setTimeout(() => {
          sound.playCriticalHit();
          const shake: 'normal' | 'crit' | 'boss' = castSkill.hits && castSkill.hits > 1 ? 'boss' : 'crit';
          setScreenShake(shake);
          setIsHitStop(true);
          setIsMonsterHit(true);
          setHitComboStep(2);
          setIsCriticalHit(true);
          addDamageNumberRef.current(skillDamage, true, false, true, synergyBanner || castSkill.name);
          recentDamageLogRef.current.push({ time: Date.now(), amount: skillDamage });

          // Apply Status Effects to Monster
          if (castSkill.mechanics?.includes('burn')) {
            setMonsterStatuses((prev) => [...prev.filter((s) => s.type !== 'burn'), { type: 'burn', duration: 3.5 }]);
          }
          if (castSkill.mechanics?.includes('freeze')) {
            setMonsterStatuses((prev) => [...prev.filter((s) => s.type !== 'freeze'), { type: 'freeze', duration: 2.5 }]);
          }
          if (castSkill.mechanics?.includes('shock')) {
            setMonsterStatuses((prev) => [...prev.filter((s) => s.type !== 'shock'), { type: 'shock', duration: 3.0 }]);
          }
          if (castSkill.mechanics?.includes('def_shred')) {
            setMonsterStatuses((prev) => [...prev.filter((s) => s.type !== 'armor_break'), { type: 'armor_break', duration: 4.0 }]);
          }
          if (castSkill.mechanics?.includes('stun')) {
            setMonsterStatuses((prev) => [...prev.filter((s) => s.type !== 'stun'), { type: 'stun', duration: 2.0 }]);
          }

          // Charge Awakening gauge on skill hit (+7%, or 100% if infiniteAwakening cheat is ON, only when Lv >= 30)
          setSaveData((prev) => {
            if (!prev.awakeningUnlocked || (prev.stats?.level ?? 1) < 30) return prev;
            if (prev.infiniteAwakening) return { ...prev, awakeningGauge: 100 };
            return {
              ...prev,
              awakeningGauge: Math.min(100, Math.round(((prev.awakeningGauge ?? 0) + 7) * 10) / 10),
            };
          });

          setTimeout(() => setIsHitStop(false), 70);
          setTimeout(() => setScreenShake('none'), 160);
          setTimeout(() => {
            setIsMonsterHit(false);
            setHitComboStep(null);
            setIsCriticalHit(false);
          }, 200);

          setCurrentMonster((prev) => {
            const nextHp = Math.max(0, prev.currentHp - skillDamage);
            if (nextHp <= 0) {
              handleMonsterDefeatRef.current();
            }
            return { ...prev, currentHp: nextHp };
          });
        }, 260);

        // Phase 4: Recovery Completes (480ms)
        setTimeout(() => {
          setActiveSkillVfx((prev) => (prev?.id === vfxId ? null : prev));
          setIsCasting(false);
          isCastingRef.current = false;
          lastSkillEndTimeRef.current = Date.now();
          setCastingSkillId(null);
          setCastingSkillType(null);
        }, 480);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // --- 3. Active Pet Companion Auto-Assist Loop (Every 2.2s) ---
  useEffect(() => {
    const petTimer = setInterval(() => {
      const pet = activePetRef.current;
      if (!pet || isMonsterDefeatedRef.current || currentMonsterRef.current.currentHp <= 0) return;

      const now = Date.now();
      setIsPetAttacking(true);
      setPetAttackEvent({ id: `pet_${now}`, petId: pet.id });

      // Synchronize with pet leap apex & projectile arrival (240ms)
      setTimeout(() => {
        if (isMonsterDefeatedRef.current || currentMonsterRef.current.currentHp <= 0) {
          setIsPetAttacking(false);
          return;
        }
        const petMult = 0.38 + (pet.level - 1) * 0.08;
        const petDmg = Math.max(1, Math.floor(combatCalcRef.current.totalAtk * petMult));
        addDamageNumberRef.current(petDmg, false, false, true, `🐾 ${pet.name}`);
        recentDamageLogRef.current.push({ time: Date.now(), amount: petDmg });

        setCurrentMonster((prev) => {
          const nextHp = Math.max(0, prev.currentHp - petDmg);
          if (nextHp <= 0) {
            handleMonsterDefeatRef.current();
          }
          return { ...prev, currentHp: nextHp };
        });
      }, 240);

      setTimeout(() => {
        setIsPetAttacking(false);
      }, 390);
    }, 2200);

    return () => clearInterval(petTimer);
  }, []);

  // --- 4. High-Precision Status Effect Decay (100ms), Burn DoT (500ms) & Live DPS ---
  useEffect(() => {
    const dotTimer = setInterval(() => {
      const now = Date.now();

      // 1.1 Burn DoT Tick (every 500ms)
      if (
        !isMonsterDefeatedRef.current &&
        monsterStatusesRef.current.some((s) => s.type === 'burn') &&
        now - lastBurnTickTimeRef.current >= 500
      ) {
        lastBurnTickTimeRef.current = now;
        const burnDmg = Math.max(1, Math.floor(combatCalcRef.current.totalAtk * 0.15));
        addDamageNumberRef.current(burnDmg, false, false, true, '🔥 화상');
        recentDamageLogRef.current.push({ time: now, amount: burnDmg });
        setCurrentMonster((prev) => {
          const nextHp = Math.max(0, prev.currentHp - burnDmg);
          if (nextHp <= 0) {
            handleMonsterDefeatRef.current();
          }
          return { ...prev, currentHp: nextHp };
        });
      }

      // 1.2 Shock DoT Tick (every 500ms)
      if (
        !isMonsterDefeatedRef.current &&
        monsterStatusesRef.current.some((s) => s.type === 'shock') &&
        now - lastShockTickTimeRef.current >= 500
      ) {
        lastShockTickTimeRef.current = now;
        const shockDmg = Math.max(1, Math.floor(combatCalcRef.current.totalAtk * 0.12));
        addDamageNumberRef.current(shockDmg, false, false, true, '⚡ 감전');
        recentDamageLogRef.current.push({ time: now, amount: shockDmg });
        setCurrentMonster((prev) => {
          const nextHp = Math.max(0, prev.currentHp - shockDmg);
          if (nextHp <= 0) {
            handleMonsterDefeatRef.current();
          }
          return { ...prev, currentHp: nextHp };
        });
      }

      // 2. Decay Status Effects (Smooth 100ms tick for tenths-of-second precision)
      setMonsterStatuses((prev) => {
        if (prev.length === 0) {
          monsterStatusesRef.current = [];
          return prev;
        }
        const updated = prev
          .map((s) => ({ ...s, duration: Math.max(0, Math.round((s.duration - 0.1) * 10) / 10) }))
          .filter((s) => s.duration > 0);
        monsterStatusesRef.current = updated;
        return updated;
      });

      // 3. Calculate Accurate Rolling 4-Second Live DPS
      const cutoff = now - 4000;
      recentDamageLogRef.current = recentDamageLogRef.current.filter((entry) => entry.time >= cutoff);
      const entries = recentDamageLogRef.current;
      if (entries.length === 0) {
        setCurrentDps(0);
      } else {
        const sumDmg = entries.reduce((acc, item) => acc + item.amount, 0);
        const timeSpanSec = Math.max(1, Math.min(4, (now - entries[0].time) / 1000));
        setCurrentDps(Math.round(sumDmg / timeSpanSec));
      }
    }, 100);

    return () => clearInterval(dotTimer);
  }, []);

  // --- 5. CC-Aware Monster Attack Tick (100ms Scheduler, 2.4s cadence) ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (isMonsterDefeatedRef.current || currentMonsterRef.current.currentHp <= 0) return;

      const now = Date.now();
      const isCCed = monsterStatusesRef.current.some((s) => s.type === 'freeze' || s.type === 'stun');

      // Freeze / Stun CC stops Monster attack countdown!
      if (isCCed) {
        lastMonsterAttackTimeRef.current = now;
        return;
      }

      if (now - lastMonsterAttackTimeRef.current < 2400) return;
      lastMonsterAttackTimeRef.current = now;

      setIsMonsterAttacking(true);
      setTimeout(() => {
        if (
          isMonsterDefeatedRef.current ||
          monsterStatusesRef.current.some((s) => s.type === 'freeze' || s.type === 'stun')
        ) {
          setIsMonsterAttacking(false);
          return;
        }
        const mon = currentMonsterRef.current;
        const calc = combatCalcRef.current;
        const monsterDmg = Math.floor(Math.max(1, mon.atk - calc.totalDef * 0.35));

        setIsPlayerHit(true);
        addDamageNumberRef.current(monsterDmg, false, true);

        setSaveData((prev) => {
          const nextHp = Math.max(0, prev.stats.currentHp - monsterDmg);
          if (nextHp <= 0) {
            sound.playMonsterDefeat();
            if (activeDungeonRef.current) {
              setTimeout(() => {
                finishDungeonRun('defeat');
              }, 0);
              return {
                ...prev,
                stats: { ...prev.stats, currentHp: calc.totalMaxHp },
              };
            }
            if (prev.stage.inBossFight) {
              const retreatMon = getMonsterForStage(prev.stage.chapter, 9);
              currentMonsterRef.current = retreatMon;
              setCurrentMonster(retreatMon);
              setStageNotice('💀 보스에게 패배했습니다. 일반 스테이지로 복귀합니다.');
              setTimeout(() => setStageNotice(null), 2000);
            }
            return {
              ...prev,
              stats: { ...prev.stats, currentHp: calc.totalMaxHp },
              stage: { ...prev.stage, inBossFight: false, bossTimeLeft: prev.stage.bossMaxTime },
            };
          }
          return {
            ...prev,
            stats: { ...prev.stats, currentHp: nextHp },
          };
        });

        setTimeout(() => setIsMonsterAttacking(false), 150);
        setTimeout(() => setIsPlayerHit(false), 220);
      }, 120);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // --- Boss Battle Timer (30s, safely paused while in DungeonMode) ---
  useEffect(() => {
    if (!stage.inBossFight) return;

    const timer = setInterval(() => {
      if (activeDungeonRef.current) return;
      setSaveData((prev) => {
        if (!prev.stage.inBossFight || activeDungeonRef.current) return prev;
        if (isMonsterDefeatedRef.current) return prev;
        const newTime = prev.stage.bossTimeLeft - 1;
        if (newTime <= 0) {
          const retreatMon = getMonsterForStage(prev.stage.chapter, 9);
          currentMonsterRef.current = retreatMon;
          setCurrentMonster(retreatMon);
          setStageNotice('⏰ 보스 제한시간 초과! 일반 스테이지로 복귀합니다.');
          setTimeout(() => setStageNotice(null), 2000);
          return {
            ...prev,
            stage: {
              ...prev.stage,
              inBossFight: false,
              bossTimeLeft: prev.stage.bossMaxTime,
            },
          };
        }
        return {
          ...prev,
          stage: { ...prev.stage, bossTimeLeft: newTime },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage.inBossFight]);

  // --- Dedicated Dungeon Countdown Timer (1s Tick) ---
  useEffect(() => {
    if (!activeDungeonRun || activeDungeonRun.status !== 'fighting') return;

    const timer = setInterval(() => {
      const cur = activeDungeonRef.current;
      if (!cur || cur.status !== 'fighting' || dungeonEndingRef.current) return;

      const nextTime = cur.timeLeft - 1;
      if (nextTime <= 0) {
        const timedOutRun: ActiveDungeonRun = { ...cur, timeLeft: 0 };
        activeDungeonRef.current = timedOutRun;
        setActiveDungeonRun(timedOutRun);
        finishDungeonRun('timeout', timedOutRun);
        return;
      }

      const updatedRun: ActiveDungeonRun = { ...cur, timeLeft: nextTime };
      activeDungeonRef.current = updatedRun;
      setActiveDungeonRun(updatedRun);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDungeonRun?.dungeonId, activeDungeonRun?.status, finishDungeonRun]);

  // --- Handlers: Hero Enhancements ---
  const handleUpgradeStat = (stat: 'atk' | 'hp' | 'def', count: number) => {
    const getAtkCost = (lvl: number) => Math.floor(25 * Math.pow(1.12, lvl - 1));
    const getHpCost = (lvl: number) => Math.floor(20 * Math.pow(1.10, lvl - 1));
    const getDefCost = (lvl: number) => Math.floor(30 * Math.pow(1.13, lvl - 1));

    setSaveData((prev) => {
      let cost = 0;
      let curLvl = stat === 'atk' ? prev.stats.atkLevel : stat === 'hp' ? prev.stats.hpLevel : prev.stats.defLevel;
      const costFn = stat === 'atk' ? getAtkCost : stat === 'hp' ? getHpCost : getDefCost;

      for (let i = 0; i < count; i++) {
        cost += costFn(curLvl + i);
      }

      if (prev.stats.gold < cost) return prev;

      progressQuest('upgrade_atk', count);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold - cost,
          atkLevel: stat === 'atk' ? prev.stats.atkLevel + count : prev.stats.atkLevel,
          hpLevel: stat === 'hp' ? prev.stats.hpLevel + count : prev.stats.hpLevel,
          defLevel: stat === 'def' ? prev.stats.defLevel + count : prev.stats.defLevel,
        },
      };
    });
  };

  // --- Prestige Permanent Growth & Ascension Handlers ---
  const handleUpgradePrestige = (type: keyof PrestigeUpgrades) => {
    setSaveData((prev) => {
      const currentPUpgrades = prev.prestigeUpgrades || { ...DEFAULT_PRESTIGE_UPGRADES };
      const currentLvl = currentPUpgrades[type] || 0;
      const cost = getPrestigeUpgradeCost(currentLvl);
      const currentStardust = prev.stardust ?? 0;
      if (currentStardust < cost) return prev;

      sound.playPowerUp();
      const updated: GameSaveData = {
        ...prev,
        stardust: Math.max(0, currentStardust - cost),
        prestigeUpgrades: {
          ...currentPUpgrades,
          [type]: currentLvl + 1,
        },
      };
      saveGameData(updated);
      return updated;
    });
  };

  const handleConfirmPrestige = () => {
    const highestCh = Math.max(stage.highestChapter || 1, stage.chapter);
    const highestSt = Math.max(stage.highestStage || 1, stage.stage);
    const rewardStardust = calculatePrestigeStardustReward(highestCh, highestSt, stats.level, prestigeCount);

    sound.playFanfare();
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.45 } });
    setPrestigeVfxEvent({ id: `prestige_${Date.now()}` });
    setStageNotice(`🌟 환생 완료! 별가루 +${rewardStardust.toLocaleString()} 획득과 함께 새롭게 각성합니다.`);
    setTimeout(() => setStageNotice(null), 3200);

    setSaveData((prev) => {
      const newPrestigeCount = (prev.prestigeCount ?? 0) + 1;
      const newStardust = (prev.stardust ?? 0) + rewardStardust;
      const newTotalStardust = (prev.totalStardustEarned ?? 0) + rewardStardust;

      const resetStats: CharacterStats = {
        ...prev.stats,
        level: 1,
        exp: 0,
        maxExp: 100,
        gold: 500,
        atkLevel: 1,
        hpLevel: 1,
        defLevel: 1,
        currentHp: prev.stats.baseHp,
      };

      const resetStage: StageState = {
        ...prev.stage,
        chapter: 1,
        stage: 1,
        killCount: 0,
        killsRequired: 5,
        isBossStage: false,
        bossTimeLeft: 30,
        bossMaxTime: 30,
        inBossFight: false,
        highestChapter: Math.max(prev.stage.highestChapter || 1, prev.stage.chapter),
        highestStage: Math.max(prev.stage.highestStage || 1, prev.stage.stage),
      };

      const updated: GameSaveData = {
        ...prev,
        stats: resetStats,
        stage: resetStage,
        prestigeCount: newPrestigeCount,
        stardust: newStardust,
        totalStardustEarned: newTotalStardust,
        hasPrestigeUnlocked: true,
        awakeningGauge: 0,
      };
      saveGameData(updated);
      return updated;
    });

    // Reset battle loop combat state to Stage 1-1
    const firstMon = getMonsterForStage(1, 1);
    currentMonsterRef.current = firstMon;
    setCurrentMonster(firstMon);
    setMonsterStatuses([]);
    monsterStatusesRef.current = [];
    basicComboRef.current = 1;
    setBasicComboStep(1);
    comboCompletedCountRef.current = 0;
    setComboCompletedCount(0);
    setIsPlayerAttacking(false);
    isBasicAttackingRef.current = false;
    setIsFinisherHit(false);
    setHitComboStep(null);
    setIsCriticalHit(false);
    setIsMonsterDefeated(false);
    isMonsterDefeatedRef.current = false;
    lastMonsterAttackTimeRef.current = Date.now();
  };

  // --- Unified Equipment Acquisition & Piece Processing ---
  const processEquipmentAcquisition = (
    item: Equipment,
    prevData: GameSaveData
  ): {
    equipmentCatalog: Equipment[];
    equipped: Partial<Record<EquipmentSlot, Equipment>>;
    goldSpent: number;
    toastMsg: string;
    acquiredItem: Equipment;
  } => {
    let catalog = [
      ...(prevData.equipmentCatalog && prevData.equipmentCatalog.length > 0
        ? prevData.equipmentCatalog
        : createDefaultEquipmentCatalog()),
    ];
    let newEquipped = { ...prevData.equipped };
    let currentGold = prevData.stats.gold;
    let goldSpent = 0;
    let toast = '';

    const targetIdx = catalog.findIndex((c) => c.type === item.type && c.rarity === item.rarity);
    if (targetIdx !== -1) {
      let catItem = { ...catalog[targetIdx] };
      const pieceGain =
        catItem.rarity === 'mythic' ? 1 : catItem.rarity === 'legendary' ? 2 : catItem.rarity === 'epic' ? 3 : 5;

      if (!catItem.owned) {
        catItem.owned = true;
        catItem.pieces = 0;
        toast = `✨ 신규 장비 [${catItem.name}] 획득! 도감 효과 해금!`;
      } else {
        catItem.pieces = (catItem.pieces || 0) + pieceGain;
        toast = `🧩 [${catItem.name}] 조각 +${pieceGain}개 누적!`;
      }

      // Auto Upgrade Equip if toggle is ON
      if (prevData.settings?.autoUpgradeEquip) {
        let req = getEquipmentPiecesRequired(catItem.level, catItem.rarity);
        let cost = getEquipmentUpgradeGoldCost(catItem.level, catItem.rarity);
        let upgraded = false;
        while (catItem.pieces >= req && currentGold >= cost) {
          catItem.pieces -= req;
          currentGold -= cost;
          goldSpent += cost;
          catItem.level += 1;
          req = getEquipmentPiecesRequired(catItem.level, catItem.rarity);
          cost = getEquipmentUpgradeGoldCost(catItem.level, catItem.rarity);
          upgraded = true;
        }
        if (upgraded) {
          catItem.piecesRequired = req;
          toast += ` (Lv.${catItem.level} 자동 강화!)`;
        }
      }

      // Smart Auto Equip if toggle is ON
      if (prevData.settings?.autoEquipGear) {
        const curEquipped = newEquipped[catItem.slot];
        const score = (i: Equipment | undefined) => {
          if (!i) return 0;
          const eqStats = calculateEquipmentEquippedStats(i);
          return eqStats.atk * 4 + eqStats.hp * 0.5 + eqStats.def * 3 + (eqStats.critRate || 0) * 400 + i.level * 10;
        };

        if (!curEquipped || score(catItem) > score(curEquipped)) {
          catalog = catalog.map((c) => (c.slot === catItem.slot ? { ...c, equipped: false } : c));
          catItem.equipped = true;
          newEquipped[catItem.slot] = catItem;
          toast += ` [자동 장착]`;
        }
      }

      catalog[targetIdx] = catItem;
      return {
        equipmentCatalog: catalog,
        equipped: newEquipped,
        goldSpent,
        toastMsg: toast,
        acquiredItem: catItem,
      };
    }

    return {
      equipmentCatalog: catalog,
      equipped: newEquipped,
      goldSpent: 0,
      toastMsg: `장비 획득: ${item.name}`,
      acquiredItem: item,
    };
  };

  // --- Handlers: Equipment ---
  const handleEquip = (item: Equipment) => {
    setSaveData((prev) => {
      const catalog = [
        ...(prev.equipmentCatalog && prev.equipmentCatalog.length > 0
          ? prev.equipmentCatalog
          : createDefaultEquipmentCatalog()),
      ].map((c) => {
        if (c.slot === item.slot) {
          return { ...c, equipped: c.id === item.id };
        }
        return c;
      });

      const updatedItem = catalog.find((c) => c.id === item.id) || { ...item, equipped: true };

      progressQuest('equip_item', 1);

      return {
        ...prev,
        equipmentCatalog: catalog,
        equipped: {
          ...prev.equipped,
          [item.slot]: updatedItem,
        },
      };
    });
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    setSaveData((prev) => {
      const catalog = (prev.equipmentCatalog || createDefaultEquipmentCatalog()).map((c) =>
        c.slot === slot ? { ...c, equipped: false } : c
      );
      return {
        ...prev,
        equipmentCatalog: catalog,
        equipped: {
          ...prev.equipped,
          [slot]: undefined,
        },
      };
    });
  };

  const handleUpgradeItem = (itemId: string) => {
    setSaveData((prev) => {
      const catalog = [...(prev.equipmentCatalog || createDefaultEquipmentCatalog())];
      const idx = catalog.findIndex((i) => i.id === itemId);
      if (idx === -1) return prev;

      const item = { ...catalog[idx] };
      const req = getEquipmentPiecesRequired(item.level, item.rarity);
      const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);

      if (item.pieces < req || prev.stats.gold < cost) return prev;

      item.pieces -= req;
      item.level += 1;
      item.piecesRequired = getEquipmentPiecesRequired(item.level, item.rarity);
      catalog[idx] = item;

      const newEquipped = { ...prev.equipped };
      if (item.equipped) {
        newEquipped[item.slot] = item;
      }

      return {
        ...prev,
        stats: { ...prev.stats, gold: prev.stats.gold - cost },
        equipmentCatalog: catalog,
        equipped: newEquipped,
      };
    });
  };

  const handleUpgradeItemWithStones = useCallback((itemId: string) => {
    setSaveData((prev) => {
      const catalog = [...(prev.equipmentCatalog || createDefaultEquipmentCatalog())];
      const idx = catalog.findIndex((i) => i.id === itemId);
      if (idx === -1) return prev;

      const item = { ...catalog[idx] };
      if (!item.owned) return prev;

      const stoneCost = getEquipmentUpgradeStoneCost(item.level, item.rarity);
      const currentStones = prev.enhancementStones ?? 0;
      if (currentStones < stoneCost) return prev;

      item.level += 1;
      item.piecesRequired = getEquipmentPiecesRequired(item.level, item.rarity);
      catalog[idx] = item;

      const newEquipped = { ...prev.equipped };
      if (item.equipped) {
        newEquipped[item.slot] = item;
      }

      const updated: GameSaveData = {
        ...prev,
        enhancementStones: currentStones - stoneCost,
        equipmentCatalog: catalog,
        equipped: newEquipped,
      };
      saveGameData(updated);
      return updated;
    });
  }, []);


  const handleBatchUpgradeEquip = () => {
    sound.playFanfare();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setSaveData((prev) => {
      let catalog = [...(prev.equipmentCatalog || createDefaultEquipmentCatalog())];
      let currentGold = prev.stats.gold;
      let totalUpgrades = 0;

      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < catalog.length; i++) {
          const item = catalog[i];
          if (!item.owned) continue;
          const req = getEquipmentPiecesRequired(item.level, item.rarity);
          const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
          if (item.pieces >= req && currentGold >= cost) {
            catalog[i] = {
              ...item,
              level: item.level + 1,
              pieces: item.pieces - req,
              piecesRequired: getEquipmentPiecesRequired(item.level + 1, item.rarity),
            };
            currentGold -= cost;
            totalUpgrades++;
            changed = true;
          }
        }
      }

      if (totalUpgrades > 0) {
        const newEquipped = { ...prev.equipped };
        (['weapon', 'helmet', 'armor', 'accessory'] as EquipmentSlot[]).forEach((slot) => {
          const eqItem = catalog.find((c) => c.type === slot && c.equipped);
          if (eqItem) newEquipped[slot] = eqItem;
        });

        setStageNotice(`⚔️ 장비 일괄 강화 완료! 총 ${totalUpgrades}회 레벨업`);
        setTimeout(() => setStageNotice(null), 1600);

        return {
          ...prev,
          stats: { ...prev.stats, gold: currentGold },
          equipmentCatalog: catalog,
          equipped: newEquipped,
        };
      }
      return prev;
    });
  };

  const handleAutoEquip = () => {
    sound.playFanfare();
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });

    setSaveData((prev) => {
      let catalog = [...(prev.equipmentCatalog || createDefaultEquipmentCatalog())];
      const newEquipped = { ...prev.equipped };
      const slots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'accessory'];

      slots.forEach((slot) => {
        const ownedItems = catalog.filter((item) => item.type === slot && item.owned);
        if (ownedItems.length === 0) return;

        const score = (i: Equipment) => {
          const stats = calculateEquipmentEquippedStats(i);
          return stats.atk * 4 + stats.hp * 0.5 + stats.def * 3 + (stats.critRate || 0) * 400 + i.level * 10;
        };

        ownedItems.sort((a, b) => score(b) - score(a));
        const best = ownedItems[0];

        catalog = catalog.map((c) => (c.type === slot ? { ...c, equipped: c.id === best.id } : c));
        newEquipped[slot] = { ...best, equipped: true };
      });

      setStageNotice('⚔️ 최고 장비 일괄 장착 완료!');
      setTimeout(() => setStageNotice(null), 1600);

      return {
        ...prev,
        equipmentCatalog: catalog,
        equipped: newEquipped,
      };
    });
  };

  // --- Handlers: Pets ---
  const handleSelectPet = (petId: string) => {
    setSaveData((prev) => ({
      ...prev,
      activePetId: petId,
    }));
  };

  const handleUnlockPet = (petId: string, costGems: number) => {
    setSaveData((prev) => {
      if (prev.stats.gems < costGems) return prev;
      const updatedPets = prev.pets.map((p) => (p.id === petId ? { ...p, owned: true } : p));
      return {
        ...prev,
        stats: { ...prev.stats, gems: prev.stats.gems - costGems },
        pets: updatedPets,
        activePetId: petId,
      };
    });
  };

  const handleUpgradePet = (petId: string, costGold: number) => {
    setSaveData((prev) => {
      if (prev.stats.gold < costGold) return prev;
      const updatedPets = prev.pets.map((p) =>
        p.id === petId ? { ...p, level: p.level + 1 } : p
      );
      return {
        ...prev,
        stats: { ...prev.stats, gold: prev.stats.gold - costGold },
        pets: updatedPets,
      };
    });
  };

  // --- Handlers: Shop Chests ---
  const handleOpenFreeChest = () => {
    const rawItem = generateRandomEquipment('common');
    setSaveData((prev) => {
      const res = processEquipmentAcquisition(rawItem, prev);
      setRevealedItem(res.acquiredItem);
      if (res.toastMsg) {
        setStageNotice(res.toastMsg);
        setTimeout(() => setStageNotice(null), 1600);
      }
      return {
        ...prev,
        freeChestLastOpened: Date.now(),
        equipmentCatalog: res.equipmentCatalog,
        equipped: res.equipped,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold - res.goldSpent,
        },
      };
    });
  };

  const handleOpenGoldChest = (cost: number) => {
    const rawItem = generateRandomEquipment();
    setSaveData((prev) => {
      if (prev.stats.gold < cost) return prev;
      const res = processEquipmentAcquisition(rawItem, {
        ...prev,
        stats: { ...prev.stats, gold: prev.stats.gold - cost },
      });
      setRevealedItem(res.acquiredItem);
      if (res.toastMsg) {
        setStageNotice(res.toastMsg);
        setTimeout(() => setStageNotice(null), 1600);
      }
      return {
        ...prev,
        equipmentCatalog: res.equipmentCatalog,
        equipped: res.equipped,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold - cost - res.goldSpent,
        },
      };
    });
  };

  const handleOpenGemChest = (cost: number) => {
    const rawItem = generateRandomEquipment(Math.random() < 0.6 ? 'rare' : 'epic');
    setSaveData((prev) => {
      if (prev.stats.gems < cost) return prev;
      const res = processEquipmentAcquisition(rawItem, prev);
      setRevealedItem(res.acquiredItem);
      if (res.toastMsg) {
        setStageNotice(res.toastMsg);
        setTimeout(() => setStageNotice(null), 1600);
      }
      return {
        ...prev,
        equipmentCatalog: res.equipmentCatalog,
        equipped: res.equipped,
        stats: {
          ...prev.stats,
          gems: prev.stats.gems - cost,
          gold: prev.stats.gold - res.goldSpent,
        },
      };
    });
  };

  const handleBuyGemsWithGold = (goldCost: number, gemGain: number) => {
    sound.playGold();
    setSaveData((prev) => {
      if (prev.stats.gold < goldCost) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold - goldCost,
          gems: prev.stats.gems + gemGain,
        },
      };
    });
  };

  // --- Handlers: Skills ---
  const handleEquipSkill = (slotIndex: number, skillId: string | null) => {
    setSaveData((prev) => {
      const currentEquipped = [...(prev.equippedSkillIds ?? STARTER_EQUIPPED_SKILLS)];
      if (skillId === null) {
        currentEquipped[slotIndex] = null;
      } else {
        for (let i = 0; i < currentEquipped.length; i++) {
          if (currentEquipped[i] === skillId) {
            currentEquipped[i] = null;
          }
        }
        currentEquipped[slotIndex] = skillId;
      }
      return {
        ...prev,
        equippedSkillIds: currentEquipped,
      };
    });
  };

  const handleUpgradeSkill = (skillId: string) => {
    setSaveData((prev) => {
      const currentSkills = prev.skills ?? INITIAL_SKILLS;
      const updated = currentSkills.map((sk) => {
        const req = sk.piecesRequired || getSkillPiecesRequired(sk);
        if (sk.id === skillId && sk.pieces >= req) {
          const nextLvl = sk.level + 1;
          return {
            ...sk,
            level: nextLvl,
            pieces: sk.pieces - req,
            piecesRequired: getSkillPiecesRequired({ ...sk, level: nextLvl }),
            baseDamageMult: Number((sk.baseDamageMult + sk.damageMultPerLevel).toFixed(2)),
          };
        }
        return sk;
      });
      return {
        ...prev,
        skills: updated,
      };
    });
  };

  const handleBatchUpgradeSkills = () => {
    sound.playFanfare();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setSaveData((prev) => {
      let currentSkills = [...(prev.skills || INITIAL_SKILLS)];
      let totalUpgrades = 0;

      currentSkills = currentSkills.map((sk) => {
        if (!sk.owned) return sk;
        let lvl = sk.level;
        let pcs = sk.pieces;
        let req = sk.piecesRequired || getSkillPiecesRequired(sk);

        while (pcs >= req) {
          pcs -= req;
          lvl += 1;
          req = getSkillPiecesRequired({ ...sk, level: lvl });
          totalUpgrades++;
        }

        return {
          ...sk,
          level: lvl,
          pieces: pcs,
          piecesRequired: req,
          baseDamageMult: Number((sk.baseDamageMult + (lvl - sk.level) * sk.damageMultPerLevel).toFixed(2)),
        };
      });

      if (totalUpgrades > 0) {
        setStageNotice(`✨ 스킬 일괄 강화 완료! 총 ${totalUpgrades}회 레벨업`);
        setTimeout(() => setStageNotice(null), 1600);

        return {
          ...prev,
          skills: currentSkills,
        };
      }
      return prev;
    });
  };

  const handleAutoEquipSkills = () => {
    sound.playFanfare();
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });

    setSaveData((prev) => {
      const activeClass = prev.classId || 'warrior';
      const available = (prev.skills || INITIAL_SKILLS).filter(
        (s) => s.classId === activeClass && !s.isAwakening && s.owned
      );

      const isBoss = prev.stage.stage === 10 || prev.stage.inBossFight;
      available.sort((a, b) => calculateSkillPowerScore(b, isBoss) - calculateSkillPowerScore(a, isBoss));

      const newEquipped = [
        available[0]?.id || null,
        available[1]?.id || null,
        available[2]?.id || null,
        available[3]?.id || null,
      ];

      setStageNotice(
        `⚡ ${activeClass === 'warrior' ? '전사' : '마법사'} ${isBoss ? '보스 레이드' : '웨이브 사냥'} 최적 스킬이 자동 장착되었습니다!`
      );
      setTimeout(() => setStageNotice(null), 1600);

      return {
        ...prev,
        equippedSkillIds: newEquipped,
      };
    });
  };

  const handleSummonSkill = (count: 1 | 10) => {
    const cost = count === 1 ? 100 : 900;
    if (saveData.stats.gems < cost) return;

    sound.playFanfare();
    if (count === 10) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    setSaveData((prev) => {
      let updatedSkills = [...(prev.skills ?? INITIAL_SKILLS)];
      const curClass = prev.classId ?? 'warrior';
      const classSkills = updatedSkills.filter((s) => s.classId === curClass && !s.isAwakening);
      const skillIds = classSkills.length > 0 ? classSkills.map((s) => s.id) : updatedSkills.map((s) => s.id);

      for (let i = 0; i < count; i++) {
        const randomId = skillIds[Math.floor(Math.random() * skillIds.length)];
        const pieceGain = Math.floor(Math.random() * 3) + 2; // 2~4 pieces

        updatedSkills = updatedSkills.map((sk) => {
          if (sk.id === randomId) {
            let nextLvl = sk.level;
            let nextPieces = (sk.pieces || 0) + pieceGain;
            let nextReq = sk.piecesRequired || getSkillPiecesRequired(sk);

            // Auto Upgrade Skills if enabled
            if (prev.settings?.autoUpgradeSkills) {
              while (nextPieces >= nextReq) {
                nextPieces -= nextReq;
                nextLvl += 1;
                nextReq = getSkillPiecesRequired({ ...sk, level: nextLvl });
              }
            }

            return {
              ...sk,
              owned: true,
              level: nextLvl,
              pieces: nextPieces,
              piecesRequired: nextReq,
              baseDamageMult: Number((sk.baseDamageMult + (nextLvl - sk.level) * sk.damageMultPerLevel).toFixed(2)),
            };
          }
          return sk;
        });
      }

      // Auto Equip Skills if enabled
      let newEquipped = prev.equippedSkillIds ?? STARTER_EQUIPPED_SKILLS;
      if (prev.settings?.autoEquipSkills) {
        const available = updatedSkills.filter((s) => s.classId === curClass && !s.isAwakening && s.owned);
        available.sort((a, b) => calculateSkillPowerScore(b) - calculateSkillPowerScore(a));
        newEquipped = [
          available[0]?.id || null,
          available[1]?.id || null,
          available[2]?.id || null,
          available[3]?.id || null,
        ];
      }

      setStageNotice(
        count === 1
          ? `🔮 ${curClass === 'warrior' ? '전사' : '마법사'} 스킬 비급서 획득!`
          : `🔮 ${curClass === 'warrior' ? '전사' : '마법사'} 스킬 비급서 10연속 소환 완료!`
      );
      setTimeout(() => setStageNotice(null), 1500);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          gems: prev.stats.gems - cost,
        },
        skills: updatedSkills,
        equippedSkillIds: newEquipped,
      };
    });
  };

  // --- Handlers: Quests ---
  const activeQuest = quests.find((q) => !q.claimed) || null;


  // Ensure cyclical repeating quest if all existing quests were claimed
  useEffect(() => {
    if (quests.length > 0 && quests.every((q) => q.claimed)) {
      setSaveData((prev) => {
        if (!prev.quests.every((q) => q.claimed)) return prev;
        const newQuest: Quest = {
          id: `q_repeat_${Date.now()}`,
          title: '[반복] 숲의 정화 (몬스터 7마리 처치)',
          type: 'kill_monster',
          targetCount: 7,
          currentCount: 0,
          rewardGold: 400,
          rewardGems: 25,
          completed: false,
          claimed: false,
        };
        return {
          ...prev,
          quests: [...prev.quests, newQuest],
        };
      });
    }
  }, [quests]);

  const handleClaimQuest = (questId: string) => {
    sound.playFanfare();
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });

    setSaveData((prev) => {
      const q = prev.quests.find((item) => item.id === questId);
      if (!q || !q.completed || q.claimed) return prev;

      let updated = prev.quests.map((item) =>
        item.id === questId ? { ...item, claimed: true } : item
      );

      // Cyclical repeating quest generator: never leave the player without a goal
      const unclaimedCount = updated.filter((item) => !item.claimed).length;
      if (unclaimedCount === 0) {
        const cycle = Math.floor(updated.length / 3) + 1;
        const repeatTemplates: Omit<Quest, 'id' | 'completed' | 'claimed' | 'currentCount'>[] = [
          {
            title: `[반복] 숲의 정화 (몬스터 ${5 + cycle * 2}마리 처치)`,
            type: 'kill_monster',
            targetCount: 5 + cycle * 2,
            rewardGold: 300 + cycle * 100,
            rewardGems: 20 + cycle * 5,
          },
          {
            title: `[반복] 한계 돌파! 공격력 ${2 + cycle}회 강화`,
            type: 'upgrade_atk',
            targetCount: 2 + cycle,
            rewardGold: 400 + cycle * 120,
            rewardGems: 25 + cycle * 5,
          },
          {
            title: `[반복] 보스 격파 및 수호`,
            type: 'defeat_boss',
            targetCount: 1,
            rewardGold: 1000 + cycle * 300,
            rewardGems: 50 + cycle * 10,
          },
        ];
        const nextTemplate = repeatTemplates[updated.length % repeatTemplates.length];
        const newQuest: Quest = {
          id: `q_repeat_${Date.now()}`,
          ...nextTemplate,
          currentCount: 0,
          completed: false,
          claimed: false,
        };
        updated.push(newQuest);
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold + q.rewardGold,
          gems: prev.stats.gems + q.rewardGems,
        },
        quests: updated,
      };
    });
  };

  // --- Handlers: Boss Fight Controls ---
  const handleChallengeBoss = () => {
    sound.playFanfare();
    setSaveData((prev) => ({
      ...prev,
      stage: { ...prev.stage, inBossFight: true, bossTimeLeft: 30 },
      awakeningGauge: prev.awakeningUnlocked
        ? Math.min(100, Math.round(((prev.awakeningGauge ?? 0) + 20) * 10) / 10)
        : (prev.awakeningGauge ?? 0),
    }));
    setCurrentMonster(getMonsterForStage(stage.chapter, 10));
  };

  const handleRetreatToNormal = () => {
    setSaveData((prev) => ({
      ...prev,
      stage: { ...prev.stage, inBossFight: false },
    }));
    setCurrentMonster(getMonsterForStage(stage.chapter, 9));
  };

  // --- Handlers: Class & Promotion ---
  const handlePromote = () => {
    const isWarrior = classId === 'warrior';
    const targetPromotion: PromotionId = isWarrior ? 'sword_master' : 'archmage';
    const awkSkillId = isWarrior ? 'heavenly_blade' : 'astral_cataclysm';

    sound.playFanfare();
    confetti({ particleCount: 100, spread: 85, origin: { y: 0.5 } });

    setSaveData((prev) => {
      const updatedSkills = (prev.skills ?? INITIAL_SKILLS).map((s) =>
        s.id === awkSkillId ? { ...s, owned: true, unlocked: true } : s
      );

      return {
        ...prev,
        promotion: targetPromotion,
        awakeningUnlocked: true,
        awakeningGauge: 100,
        promotionSeals: Math.max(0, (prev.promotionSeals ?? 1) - 1),
        skills: updatedSkills,
      };
    });

    setStageNotice(`👑 [${isWarrior ? '소드마스터' : '아크메이지'}] 전직 및 각성기 해금 완료!`);
    setTimeout(() => setStageNotice(null), 2500);
  };

  const handleSwitchClass = (newClassId: CharacterClassId) => {
    if (newClassId === classId) return;

    sound.playTap();
    setSaveData((prev) => {
      let newPromo: PromotionId = 'none';
      if (prev.promotion !== 'none') {
        newPromo = newClassId === 'warrior' ? 'sword_master' : 'archmage';
      }

      const newEquipped =
        newClassId === 'warrior' ? STARTER_EQUIPPED_SKILLS_WARRIOR : STARTER_EQUIPPED_SKILLS_MAGE;
      const newAwkId = newClassId === 'warrior' ? 'heavenly_blade' : 'astral_cataclysm';

      const updatedSkills = (prev.skills ?? INITIAL_SKILLS).map((s) => {
        if (s.id === newAwkId && prev.awakeningUnlocked) {
          return { ...s, owned: true, unlocked: true };
        }
        return s;
      });

      return {
        ...prev,
        classId: newClassId,
        promotion: newPromo,
        equippedSkillIds: newEquipped,
        skills: updatedSkills,
      };
    });

    setSkillCooldowns({});
    setIsCasting(false);
    isCastingRef.current = false;
    setCastingSkillId(null);
    setCastingSkillType(null);
    setIsAwakeningCasting(false);
    isBasicAttackingRef.current = false;
    setIsPlayerAttacking(false);
    basicComboRef.current = 1;
    setBasicComboStep(1);
    comboCompletedCountRef.current = 0;
    setComboCompletedCount(0);
    skillsCastSinceBasicRef.current = 1;

    setStageNotice(`⚔️ [${newClassId === 'warrior' ? '전사' : '마법사'}] 직업으로 변경되었습니다.`);
    setTimeout(() => setStageNotice(null), 2000);
  };

  // --- Handlers: Offline & Settings ---
  const handleClaimOfflineReward = () => {
    if (!offlineReward) return;
    sound.playFanfare();
    setSaveData((prev) => {
      let newExp = prev.stats.exp + offlineReward.exp;
      let newLevel = prev.stats.level;
      let newMaxExp = prev.stats.maxExp;
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = Math.floor(newMaxExp * 1.35);
      }
      const updated: GameSaveData = {
        ...prev,
        stats: {
          ...prev.stats,
          gold: prev.stats.gold + offlineReward.gold,
          exp: newExp,
          level: newLevel,
          maxExp: newMaxExp,
        },
      };
      saveGameData(updated);
      return updated;
    });
    setOfflineReward(null);
  };

  const handleResetData = () => {
    if (window.confirm('정말로 게임 데이터를 초기화하시겠습니까? 모든 진행 상황이 초기화됩니다.')) {
      const fresh = getDefaultSaveData();
      saveGameData(fresh);
      setSaveData(fresh);
      setCurrentMonster(getMonsterForStage(1, 1));
      setShowSettings(false);
      sound.playTap();
    }
  };

  const handleFirstClassSelect = (chosenClass: CharacterClassId) => {
    setSaveData((prev) => {
      const starterEquipped =
        chosenClass === 'warrior' ? STARTER_EQUIPPED_SKILLS_WARRIOR : STARTER_EQUIPPED_SKILLS_MAGE;
      const updated: GameSaveData = {
        ...prev,
        classId: chosenClass,
        equippedSkillIds: starterEquipped,
        hasSelectedClass: true,
      };
      saveGameData(updated);
      return updated;
    });
  };

  // Expose Dungeon QA helper functions for automated browser verification
  useEffect(() => {
    (window as any).__dungeonTestHelpers = {
      enterDungeon: (id: DungeonId, diff: number) => handleEnterDungeon(id, diff),
      abandonDungeon: () => handleAbandonDungeon(),
      forceTimeout: () => {
        if (!activeDungeonRef.current) return;
        const r = { ...activeDungeonRef.current, timeLeft: 0 };
        activeDungeonRef.current = r;
        setActiveDungeonRun(r);
        finishDungeonRun('timeout', r);
      },
      forceDefeat: () => {
        if (!activeDungeonRef.current) return;
        finishDungeonRun('defeat');
      },
      killCurrentDungeonMonster: () => {
        if (!activeDungeonRef.current) return;
        currentMonsterRef.current = { ...currentMonsterRef.current, currentHp: 0 };
        setCurrentMonster((prev) => ({ ...prev, currentHp: 0 }));
        handleMonsterDefeatRef.current();
      },
      simulateDateChange: (fakeDateStr: string) => {
        setSaveData((prev) => {
          const curD = checkAndResetDailyDungeonTickets(prev.dungeons);
          const next = checkAndResetDailyDungeonTickets({
            ...curD,
            lastResetDate: fakeDateStr,
          });
          const updated: GameSaveData = { ...prev, dungeons: next };
          saveGameData(updated);
          return updated;
        });
      },
      upgradeItemWithStones: (itemId: string) => handleUpgradeItemWithStones(itemId),
    };
  }, [handleEnterDungeon, handleAbandonDungeon, finishDungeonRun, handleUpgradeItemWithStones]);

  // Badges
  const totalTicketsLeft =
    (dungeons.records.gold_mine?.ticketsLeft || 0) +
    (dungeons.records.training_forest?.ticketsLeft || 0) +
    (dungeons.records.ancient_ruins?.ticketsLeft || 0);
  const badges: Partial<Record<ActiveTab, boolean>> = {
    dungeon: totalTicketsLeft > 0,
    hero: stats.gold >= 50,
    equipment: inventory.length > 0 || enhancementStones > 0,
    pet: pets.some((p) => !p.owned && stats.gems >= p.costGems),
    shop: Date.now() - freeChestLastOpened > 60000,
  };

  if (!saveData.hasSelectedClass) {
    return <ClassSelectScreen onConfirmClass={handleFirstClassSelect} />;
  }

  return (
    <div className="mobile-frame">
      {/* 1. Floating Top Game Crest & HUD */}
      <TopHUD
        stats={stats}
        stage={stage}
        classId={classId}
        promotion={promotion}
        prestigeCount={prestigeCount}
        stardust={stardust}
        hasPrestigeUnlocked={hasPrestigeUnlocked}
        enhancementStones={enhancementStones}
        activeDungeonRun={activeDungeonRun}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setActiveTab('hero')}
      />

      {/* 2. Main Screen Area (Live 5-Layer BattleScene always rendered at top) */}
      <div className="screen-container">
        {/* Battle Scene is Always Live & Active */}
        <BattleScene
          stats={stats}
          maxHp={combatCalculations.totalMaxHp}
          monster={currentMonster}
          stage={stage}
          activePet={activePet}
          equippedWeapon={equipped.weapon}
          isPlayerAttacking={isPlayerAttacking}
          isMonsterAttacking={isMonsterAttacking}
          isPlayerHit={isPlayerHit}
          isMonsterHit={isMonsterHit}
          isMonsterDefeated={isMonsterDefeated}
          isHitStop={isHitStop}
          screenShake={screenShake}
          damages={damages}
          onChallengeBoss={handleChallengeBoss}
          onRetreatToNormal={handleRetreatToNormal}
          floatingGold={floatingGold}
          lootAlert={lootAlert}
          stageNotice={stageNotice}
          cpDelta={cpDelta}
          skills={skills}
          equippedSkillIds={equippedSkillIds}
          skillCooldowns={skillCooldowns}
          activeSkillVfx={activeSkillVfx}
          castingSkillId={castingSkillId}
          activeQuest={activeQuest}
          onClaimQuest={handleClaimQuest}
          classId={classId}
          promotion={combatCalculations.isPromoted ? promotion : 'none'}
          isCasting={isCasting}
          castingSkillType={castingSkillType}
          isAwakeningCasting={isAwakeningCasting}
          awakeningUnlocked={awakeningUnlocked && stats.level >= 30}
          awakeningGauge={stats.level >= 30 ? awakeningGauge : 0}
          awakeningSkill={awakeningSkill}
          basicAttackEvent={basicAttackEvent}
          petAttackEvent={petAttackEvent}
          isPetAttacking={isPetAttacking}
          basicComboStep={basicComboStep}
          comboCompletedCount={comboCompletedCount}
          isFinisherHit={isFinisherHit}
          hitComboStep={hitComboStep}
          isCriticalHit={isCriticalHit}
          monsterStatuses={monsterStatuses}
          currentDps={currentDps}
          prestigeVfxEvent={prestigeVfxEvent}
          activeDungeonRun={activeDungeonRun}
          onAbandonDungeon={handleAbandonDungeon}
          dungeonVfxEvent={dungeonVfxEvent}
        />

        {/* Quest Parchment Ribbon (Displayed only in main Adventure tab when not in Dungeon) */}
        {activeTab === 'adventure' && !activeDungeonRun && (
          <QuestWidget
            quest={activeQuest}
            onClaim={handleClaimQuest}
            isCollapsed={saveData.questCollapsed}
            onToggleCollapse={(collapsed) =>
              setSaveData((prev) => {
                const next = { ...prev, questCollapsed: collapsed };
                saveGameData(next);
                return next;
              })
            }
          />
        )}

        {/* 3. Half-Sheet Drawers for Subpages */}
        {activeTab === 'dungeon' && (
          <DungeonPage
            dungeons={dungeons}
            heroLevel={stats.level}
            heroAtk={combatCalculations.totalAtk}
            enhancementStones={enhancementStones}
            goldBonusMultiplier={1 + combatCalculations.petGoldMult + (combatCalculations.prestigeGoldMult || 0)}
            expBonusMultiplier={1 + (combatCalculations.prestigeExpMult || 0)}
            onEnterDungeon={(id, diff) => {
              handleEnterDungeon(id, diff);
            }}
            onGoToEquipment={() => setActiveTab('equipment')}
            onClose={() => setActiveTab('adventure')}
          />
        )}

        {activeTab === 'hero' && (
          <HeroPage
            stats={stats}
            totalAtk={combatCalculations.totalAtk}
            totalHp={combatCalculations.totalMaxHp}
            totalDef={combatCalculations.totalDef}
            combatPower={combatCalculations.combatPower}
            equipped={equipped}
            activePet={activePet}
            onUpgradeStat={handleUpgradeStat}
            skills={skills}
            equippedSkillIds={equippedSkillIds}
            onEquipSkill={handleEquipSkill}
            onUpgradeSkill={handleUpgradeSkill}
            onBatchUpgradeSkills={handleBatchUpgradeSkills}
            onAutoEquipSkills={handleAutoEquipSkills}
            equipmentOwnedBonus={combatCalculations.equipOwnedBonus}
            skillOwnedBonus={combatCalculations.skillOwnedBonus}
            classId={classId}
            promotion={promotion}
            awakeningUnlocked={awakeningUnlocked}
            promotionSeals={promotionSeals}
            stage={stage}
            onPromote={handlePromote}
            onSwitchClass={handleSwitchClass}
            prestigeCount={prestigeCount}
            stardust={stardust}
            prestigeUpgrades={prestigeUpgrades}
            hasPrestigeUnlocked={hasPrestigeUnlocked}
            onOpenPrestigeModal={() => setShowPrestigeModal(true)}
            onUpgradePrestige={handleUpgradePrestige}
            onClose={() => setActiveTab('adventure')}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentPage
            equipmentCatalog={equipmentCatalog}
            equipped={equipped}
            gold={stats.gold}
            enhancementStones={enhancementStones}
            combatPower={combatCalculations.combatPower}
            onEquip={handleEquip}
            onUpgradeItem={handleUpgradeItem}
            onUpgradeItemWithStones={handleUpgradeItemWithStones}
            onBatchUpgrade={handleBatchUpgradeEquip}
            onAutoEquip={handleAutoEquip}
            onClose={() => setActiveTab('adventure')}
          />
        )}

        {activeTab === 'pet' && (
          <PetPage
            pets={pets}
            activePetId={activePetId}
            gems={stats.gems}
            gold={stats.gold}
            onSelectPet={handleSelectPet}
            onUnlockPet={handleUnlockPet}
            onUpgradePet={handleUpgradePet}
            onClose={() => setActiveTab('adventure')}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage
            gold={stats.gold}
            gems={stats.gems}
            freeChestLastOpened={freeChestLastOpened}
            onOpenFreeChest={handleOpenFreeChest}
            onOpenGoldChest={handleOpenGoldChest}
            onOpenGemChest={handleOpenGemChest}
            onBuyGemsWithGold={handleBuyGemsWithGold}
            onSummonSkill={handleSummonSkill}
            classId={classId}
            onClose={() => setActiveTab('adventure')}
          />
        )}
      </div>

      {/* 4. 3D Tactile Timber Game Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          sound.playTap();
          setActiveTab(tab);
        }}
        badges={badges}
      />

      {/* Modals */}
      {offlineReward && (
        <OfflineModal
          seconds={offlineReward.seconds}
          gold={offlineReward.gold}
          exp={offlineReward.exp}
          onClaim={handleClaimOfflineReward}
        />
      )}

      {revealedItem && (
        <GachaModal
          item={revealedItem}
          onEquip={(item) => {
            handleEquip(item);
            setRevealedItem(null);
          }}
          onClose={() => setRevealedItem(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSaveData((prev) => ({
              ...prev,
              settings: { ...prev.settings, ...newSettings },
            }));
            if ('bgmEnabled' in newSettings) {
              if (newSettings.bgmEnabled) sound.startBgm();
              else sound.stopBgm();
            }
          }}
          onResetData={handleResetData}
          onOpenDevModal={() => {
            setShowSettings(false);
            setShowDevModal(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDevModal && (
        <DeveloperTestModal
          isOpen={showDevModal}
          onClose={() => setShowDevModal(false)}
          saveData={saveData}
          onUpdateSaveData={(updater) => setSaveData(updater)}
          onResetSave={handleResetData}
          onTriggerBoss={handleChallengeBoss}
        />
      )}

      {showPrestigeModal && (
        <PrestigeModal
          isOpen={showPrestigeModal}
          onClose={() => setShowPrestigeModal(false)}
          onConfirmPrestige={handleConfirmPrestige}
          stage={stage}
          stats={stats}
          prestigeCount={prestigeCount}
        />
      )}

      {dungeonResult && (
        <DungeonResultModal
          result={dungeonResult}
          ticketsLeft={dungeons.records[dungeonResult.dungeonId]?.ticketsLeft ?? 0}
          canRetry={
            (dungeons.records[dungeonResult.dungeonId]?.ticketsLeft ?? 0) > 0 &&
            stats.level >= getDungeonDifficultyConfig(dungeonResult.dungeonId, dungeonResult.difficulty).requiredLevel
          }
          onRetry={() => {
            const targetId = dungeonResult.dungeonId;
            const targetDiff = dungeonResult.difficulty;
            setDungeonResult(null);
            handleEnterDungeon(targetId, targetDiff);
          }}
          onClose={() => setDungeonResult(null)}
        />
      )}
    </div>
  );
};

