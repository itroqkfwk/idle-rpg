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
} from './types/game';
import { loadGameData, saveGameData, getDefaultSaveData } from './utils/storage';
import { getMonsterForStage } from './data/monsters';
import { generateRandomEquipment } from './data/equipment';
import { sound } from './utils/audio';

import { TopHUD } from './components/TopHUD';
import { BattleScene } from './components/BattleScene';
import { QuestWidget } from './components/QuestWidget';
import { BottomNavigation } from './components/BottomNavigation';
import { OfflineModal } from './components/OfflineModal';
import { GachaModal } from './components/GachaModal';
import { SettingsModal } from './components/SettingsModal';

import { HeroPage } from './pages/HeroPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { PetPage } from './pages/PetPage';
import { ShopPage } from './pages/ShopPage';
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
  const [isScreenShaking, setIsScreenShaking] = useState(false);

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

  // Active Pet object
  const activePet = useMemo(() => {
    return pets.find((p) => p.id === activePetId) || null;
  }, [pets, activePetId]);

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

  // Auto-Save every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      saveGameData(saveData);
    }, 3000);
    return () => clearInterval(timer);
  }, [saveData]);

  // --- Compute Total Combat Stats with Gear & Pet Buffs ---
  const combatCalculations = useMemo(() => {
    let equipAtk = 0;
    let equipHp = 0;
    let equipDef = 0;
    let equipCritRate = 0;

    Object.values(equipped).forEach((item) => {
      if (item) {
        equipAtk += item.atk;
        equipHp += item.hp;
        equipDef += item.def;
        equipCritRate += item.critRate || 0;
      }
    });

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

    const totalAtk = Math.floor(
      (stats.baseAtk + (stats.atkLevel - 1) * 4 + equipAtk) * (1 + petAtkMult)
    );
    const totalMaxHp = Math.floor(
      (stats.baseHp + (stats.hpLevel - 1) * 35 + equipHp)
    );
    const totalDef = Math.floor(
      stats.baseDef + (stats.defLevel - 1) * 2 + equipDef
    );
    const totalCritRate = Math.min(0.85, stats.critRate + equipCritRate + petCritRateMult);
    const totalCritDmg = stats.critDmg + petCritDmgMult;
    const totalAtkSpeed = stats.atkSpeed * (1 + petAtkSpeedMult);

    const combatPower = Math.floor(
      totalAtk * 4.0 + totalMaxHp * 0.5 + totalDef * 3.0 + totalCritRate * 500
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
    };
  }, [stats, equipped, activePet]);

  // Keep player current HP bounded by totalMaxHp
  useEffect(() => {
    if (stats.currentHp > combatCalculations.totalMaxHp) {
      setSaveData((prev) => ({
        ...prev,
        stats: { ...prev.stats, currentHp: combatCalculations.totalMaxHp },
      }));
    }
  }, [combatCalculations.totalMaxHp]);

  // Screen Shake trigger
  const triggerScreenShake = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 220);
  }, []);

  // Spawn floating damage numbers
  const addDamageNumber = useCallback((val: number, isCritical: boolean, isPlayer: boolean) => {
    if (!settings.damageNumbers) return;
    const id = `dmg_${Date.now()}_${Math.random()}`;
    const x = isPlayer ? 70 + Math.random() * 30 : 220 + Math.random() * 40;
    const y = 160 + Math.random() * 30;

    if (isCritical) {
      triggerScreenShake();
    }

    setDamages((prev) => [...prev.slice(-8), { id, value: val, isCritical, isPlayer, x, y }]);
    setTimeout(() => {
      setDamages((prev) => prev.filter((d) => d.id !== id));
    }, 750);
  }, [settings.damageNumbers, triggerScreenShake]);

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

  // --- Monster Defeated Handler ---
  const handleMonsterDefeat = useCallback(() => {
    sound.playMonsterDefeat();
    setIsMonsterDefeated(true);

    const { petGoldMult } = combatCalculations;
    const earnedGold = Math.floor(currentMonster.goldReward * (1 + petGoldMult));
    const earnedExp = currentMonster.expReward;

    // 18% Chance to drop random equipment
    let droppedItem: Equipment | null = null;
    if (Math.random() < 0.18 || currentMonster.isBoss) {
      droppedItem = generateRandomEquipment(currentMonster.isBoss ? 'rare' : undefined);
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
        if (newStage.stage === 10 && newStage.inBossFight) {
          sound.playFanfare();
          confetti({ particleCount: 90, spread: 85, origin: { y: 0.5 } });
          progressQuest('defeat_boss', 1);

          newStage.chapter += 1;
          newStage.stage = 1;
          newStage.killCount = 0;
          newStage.inBossFight = false;
        } else if (newStage.stage < 10) {
          newStage.killCount += 1;
          progressQuest('kill_monster', 1);

          if (newStage.killCount >= newStage.killsRequired) {
            newStage.stage += 1;
            newStage.killCount = 0;
            progressQuest('reach_stage', newStage.stage);
          }
        }

        const newInventory = droppedItem ? [droppedItem, ...prev.inventory] : prev.inventory;

        return {
          ...prev,
          stats: {
            ...prev.stats,
            gold: prev.stats.gold + earnedGold,
            exp: newExp,
            level: newLevel,
            maxExp: newMaxExp,
            currentHp: combatCalculations.totalMaxHp,
          },
          inventory: newInventory,
          stage: newStage,
        };
      });

      const nextMon = getMonsterForStage(stage.chapter, stage.stage);
      setCurrentMonster(nextMon);
      setIsMonsterDefeated(false);
    }, 380);
  }, [currentMonster, combatCalculations, stage, progressQuest]);

  // --- Auto Combat Tick (Player Attack) ---
  const attackCooldownRef = useRef(false);
  useEffect(() => {
    if (isMonsterDefeated) return;

    const intervalMs = Math.max(400, Math.floor(1000 / combatCalculations.totalAtkSpeed));
    const timer = setInterval(() => {
      if (attackCooldownRef.current || isMonsterDefeated) return;

      attackCooldownRef.current = true;
      setIsPlayerAttacking(true);

      setTimeout(() => {
        const isCrit = Math.random() < combatCalculations.totalCritRate;
        const damage = Math.floor(
          Math.max(1, combatCalculations.totalAtk * (isCrit ? combatCalculations.totalCritDmg : 1) - currentMonster.def * 0.3)
        );

        if (isCrit) {
          sound.playCriticalHit();
        } else {
          sound.playAttack();
        }

        setIsMonsterHit(true);
        addDamageNumber(damage, isCrit, false);

        setCurrentMonster((prev) => {
          const nextHp = Math.max(0, prev.currentHp - damage);
          if (nextHp <= 0) {
            handleMonsterDefeat();
          }
          return { ...prev, currentHp: nextHp };
        });

        setTimeout(() => setIsPlayerAttacking(false), 140);
        setTimeout(() => setIsMonsterHit(false), 200);
        setTimeout(() => {
          attackCooldownRef.current = false;
        }, intervalMs * 0.4);
      }, 100);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [combatCalculations, currentMonster, isMonsterDefeated, handleMonsterDefeat, addDamageNumber]);

  // --- Monster Attack Tick (Every 2.4s) ---
  useEffect(() => {
    if (isMonsterDefeated || currentMonster.currentHp <= 0) return;

    const timer = setInterval(() => {
      if (isMonsterDefeated) return;

      setIsMonsterAttacking(true);
      setTimeout(() => {
        const monsterDmg = Math.floor(
          Math.max(1, currentMonster.atk - combatCalculations.totalDef * 0.35)
        );

        setIsPlayerHit(true);
        addDamageNumber(monsterDmg, false, true);

        setSaveData((prev) => {
          const nextHp = Math.max(0, prev.stats.currentHp - monsterDmg);
          if (nextHp <= 0) {
            sound.playMonsterDefeat();
            return {
              ...prev,
              stats: { ...prev.stats, currentHp: combatCalculations.totalMaxHp },
              stage: { ...prev.stage, inBossFight: false },
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
    }, 2400);

    return () => clearInterval(timer);
  }, [currentMonster, combatCalculations, isMonsterDefeated, addDamageNumber]);

  // --- Boss Battle Timer (30s) ---
  useEffect(() => {
    if (!stage.inBossFight) return;

    const timer = setInterval(() => {
      setSaveData((prev) => {
        if (!prev.stage.inBossFight) return prev;
        const newTime = prev.stage.bossTimeLeft - 1;
        if (newTime <= 0) {
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

  // --- Handlers: Equipment ---
  const handleEquip = (item: Equipment) => {
    setSaveData((prev) => {
      const prevEquipped = prev.equipped[item.slot];
      const newInventory = prev.inventory.filter((i) => i.id !== item.id);
      if (prevEquipped) {
        newInventory.unshift(prevEquipped);
      }

      progressQuest('equip_item', 1);

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [item.slot]: item,
        },
        inventory: newInventory,
      };
    });
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    setSaveData((prev) => {
      const item = prev.equipped[slot];
      if (!item) return prev;
      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [slot]: undefined,
        },
        inventory: [item, ...prev.inventory],
      };
    });
  };

  const handleUpgradeItem = (itemId: string, cost: number) => {
    setSaveData((prev) => {
      if (prev.stats.gold < cost) return prev;

      const upgradeFn = (item: Equipment) => ({
        ...item,
        level: item.level + 1,
        atk: item.atk > 0 ? Math.floor(item.atk * 1.15) + 2 : 0,
        hp: item.hp > 0 ? Math.floor(item.hp * 1.15) + 15 : 0,
        def: item.def > 0 ? Math.floor(item.def * 1.15) + 2 : 0,
      });

      const newEquipped = { ...prev.equipped };
      for (const slot of ['weapon', 'helmet', 'armor', 'accessory'] as EquipmentSlot[]) {
        if (newEquipped[slot]?.id === itemId) {
          newEquipped[slot] = upgradeFn(newEquipped[slot]!);
        }
      }

      const newInv = prev.inventory.map((item) => (item.id === itemId ? upgradeFn(item) : item));

      return {
        ...prev,
        stats: { ...prev.stats, gold: prev.stats.gold - cost },
        equipped: newEquipped,
        inventory: newInv,
      };
    });
  };

  const handleAutoEquip = () => {
    sound.playFanfare();
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });

    setSaveData((prev) => {
      const slots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'accessory'];
      const newEquipped = { ...prev.equipped };
      let newInventory = [...prev.inventory];

      slots.forEach((slot) => {
        const candidates = newInventory.filter((i) => i.slot === slot);
        if (candidates.length === 0) return;

        const score = (i: Equipment) => i.atk * 4 + i.hp * 0.5 + i.def * 3 + (i.critRate || 0) * 400;
        candidates.sort((a, b) => score(b) - score(a));
        const bestItem = candidates[0];

        const currentSlotItem = newEquipped[slot];
        if (!currentSlotItem || score(bestItem) > score(currentSlotItem)) {
          newInventory = newInventory.filter((i) => i.id !== bestItem.id);
          if (currentSlotItem) {
            newInventory.push(currentSlotItem);
          }
          newEquipped[slot] = bestItem;
        }
      });

      return {
        ...prev,
        equipped: newEquipped,
        inventory: newInventory,
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
    const item = generateRandomEquipment('common');
    setRevealedItem(item);
    setSaveData((prev) => ({
      ...prev,
      freeChestLastOpened: Date.now(),
      inventory: [item, ...prev.inventory],
    }));
  };

  const handleOpenGoldChest = (cost: number) => {
    const item = generateRandomEquipment();
    setRevealedItem(item);
    setSaveData((prev) => ({
      ...prev,
      stats: { ...prev.stats, gold: prev.stats.gold - cost },
      inventory: [item, ...prev.inventory],
    }));
  };

  const handleOpenGemChest = (cost: number) => {
    const item = generateRandomEquipment(Math.random() < 0.6 ? 'rare' : 'epic');
    setRevealedItem(item);
    setSaveData((prev) => ({
      ...prev,
      stats: { ...prev.stats, gems: prev.stats.gems - cost },
      inventory: [item, ...prev.inventory],
    }));
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

  // --- Handlers: Quests ---
  const activeQuest = quests.find((q) => !q.claimed) || null;

  const handleClaimQuest = (questId: string) => {
    sound.playFanfare();
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });

    setSaveData((prev) => {
      const q = prev.quests.find((item) => item.id === questId);
      if (!q || !q.completed || q.claimed) return prev;

      const updated = prev.quests.map((item) =>
        item.id === questId ? { ...item, claimed: true } : item
      );

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

  // --- Handlers: Offline & Settings ---
  const handleClaimOfflineReward = () => {
    if (!offlineReward) return;
    sound.playFanfare();
    setSaveData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        gold: prev.stats.gold + offlineReward.gold,
        exp: prev.stats.exp + offlineReward.exp,
      },
    }));
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

  // Badges
  const badges: Partial<Record<ActiveTab, boolean>> = {
    hero: stats.gold >= 50,
    equipment: inventory.length > 0,
    pet: pets.some((p) => !p.owned && stats.gems >= p.costGems),
    shop: Date.now() - freeChestLastOpened > 60000,
  };

  return (
    <div className={`mobile-frame ${isScreenShaking ? 'screen-shake' : ''}`}>
      {/* 1. Floating Top Game Crest & HUD */}
      <TopHUD
        stats={stats}
        stage={stage}
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
          damages={damages}
          onChallengeBoss={handleChallengeBoss}
          onRetreatToNormal={handleRetreatToNormal}
        />

        {/* Quest Parchment Ribbon (Displayed only in main Adventure tab) */}
        {activeTab === 'adventure' && (
          <QuestWidget quest={activeQuest} onClaim={handleClaimQuest} />
        )}

        {/* 3. Half-Sheet Drawers for Subpages */}
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
            onClose={() => setActiveTab('adventure')}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentPage
            equipped={equipped}
            inventory={inventory}
            gold={stats.gold}
            combatPower={combatCalculations.combatPower}
            onEquip={handleEquip}
            onUnequip={handleUnequip}
            onUpgradeItem={handleUpgradeItem}
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
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};
