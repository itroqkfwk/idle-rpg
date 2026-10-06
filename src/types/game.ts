export type EquipmentSlot = 'weapon' | 'helmet' | 'armor' | 'accessory';

export type EquipmentRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  level: number;
  atk: number;
  hp: number;
  def: number;
  critRate?: number;
  icon: string;
  description: string;
}

export type PetBuffType = 'atk' | 'gold' | 'critRate' | 'critDmg' | 'atkSpeed';

export interface Pet {
  id: string;
  name: string;
  icon: string;
  description: string;
  buffType: PetBuffType;
  baseBuffValue: number; // e.g. 0.05 for +5%
  level: number;
  owned: boolean;
  costGems: number;
  personality: string;
}

export interface Monster {
  id: string;
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  expReward: number;
  goldReward: number;
  isBoss: boolean;
  element: 'grass' | 'water' | 'fire' | 'light' | 'dark';
}

export interface CharacterStats {
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  gems: number;
  
  // Enhancement levels
  atkLevel: number;
  hpLevel: number;
  defLevel: number;
  
  // Base stats (before enhancements & equipment)
  baseAtk: number;
  baseHp: number;
  baseDef: number;
  
  // Current combat state
  currentHp: number;
  
  // Attack Speed & Crit
  critRate: number; // e.g. 0.10 = 10%
  critDmg: number;  // e.g. 1.50 = 150%
  atkSpeed: number; // attacks per second (e.g. 1.2)
}

export interface StageState {
  chapter: number;
  stage: number; // 1 ~ 10
  killCount: number;
  killsRequired: number;
  isBossStage: boolean;
  bossTimeLeft: number; // 30s countdown
  bossMaxTime: number;
  inBossFight: boolean;
  highestChapter: number;
  highestStage: number;
}

export type QuestType = 'kill_monster' | 'upgrade_atk' | 'reach_stage' | 'equip_item' | 'defeat_boss';

export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  targetCount: number;
  currentCount: number;
  rewardGold: number;
  rewardGems: number;
  completed: boolean;
  claimed: boolean;
}

export interface DamageNumberData {
  id: string;
  value: number;
  isCritical: boolean;
  isPlayer: boolean;
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
}

export type ActiveTab = 'adventure' | 'hero' | 'equipment' | 'pet' | 'shop';

export interface GameSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  damageNumbers: boolean;
  autoBossRetry: boolean;
}

export interface GameSaveData {
  version: number;
  lastOnlineTime: number;
  stats: CharacterStats;
  equipped: Partial<Record<EquipmentSlot, Equipment>>;
  inventory: Equipment[];
  pets: Pet[];
  activePetId: string | null;
  stage: StageState;
  quests: Quest[];
  freeChestLastOpened: number;
  settings: GameSettings;
}
