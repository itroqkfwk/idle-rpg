export type EquipmentSlot = 'weapon' | 'helmet' | 'armor' | 'accessory';

export type EquipmentRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  type?: EquipmentSlot;
  rarity: EquipmentRarity;
  level: number;
  pieces: number;
  piecesRequired: number;
  ownedCount: number;
  owned: boolean;
  equipped?: boolean;
  atk: number; // Equipped effect
  hp: number;  // Equipped effect
  def: number; // Equipped effect
  critRate?: number; // Equipped effect
  critDmg?: number;  // Equipped effect
  ownedAtk: number;  // Owned collection effect
  ownedHp: number;   // Owned collection effect
  ownedDef: number;  // Owned collection effect
  ownedCritRate?: number; // Owned collection effect
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
  atkBonus?: number;
  hpBonus?: number;
  defBonus?: number;
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
  progress?: number;
  maxProgress?: number;
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
  isSkill?: boolean;
  skillName?: string;
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
}

export type CharacterClassId = 'warrior' | 'mage';

export type PromotionId = 'none' | 'sword_master' | 'archmage' | 'gladiator';


export type SkillEffectType =
  // Warrior skills (14)
  | 'power_slash'
  | 'double_slash'
  | 'sword_wave'
  | 'whirlwind'
  | 'shield_bash'
  | 'blade_storm'
  | 'ground_breaker'
  | 'blood_thirst'
  | 'execution'
  | 'flame_sword'
  | 'iron_fortress'
  | 'phantom_blade'
  | 'heavenly_blade'
  | 'ragnarok_cleave'
  // Mage skills (14)
  | 'magic_missile'
  | 'fireball'
  | 'ice_spear'
  | 'chain_lightning'
  | 'blizzard'
  | 'arcane_orb'
  | 'thunder_strike'
  | 'frost_nova'
  | 'flame_pillar'
  | 'gravity_well'
  | 'mana_burst'
  | 'arcane_familiar'
  | 'astral_cataclysm'
  | 'absolute_zero'
  // Legacy aliases
  | 'meteor'
  | 'arcane_storm'
  | 'wind_blade'
  | 'meteor_slash';

export type SkillMechanicType =
  | 'single'
  | 'aoe'
  | 'multi_hit'
  | 'pierce'
  | 'knockback'
  | 'pull'
  | 'stun'
  | 'freeze'
  | 'burn'
  | 'bleed'
  | 'shock'
  | 'def_shred'
  | 'atk_buff'
  | 'atk_speed'
  | 'crit_buff'
  | 'shield'
  | 'lifesteal'
  | 'execute'
  | 'summon'
  | 'hazard'
  | 'chain'
  | 'boss_slayer';

export type StatusEffectType = 'burn' | 'freeze' | 'shock' | 'armor_break' | 'stun';

export interface MonsterStatusEffect {
  type: StatusEffectType;
  duration: number; // in seconds
  value?: number;    // e.g. def reduction % or dot damage
  timer?: number;
}

export type SkillSynergyType =
  | 'shatter_lightning'
  | 'flame_burst'
  | 'cosmic_implosion'
  | 'armor_shatter';

export interface SkillPowerScoreVector {
  totalScore: number;
  bossDamage: number;
  aoeDamage: number;
  survival: number;
  utility: number;
}

export interface Skill {
  id: string;
  name: string;
  rarity: EquipmentRarity;
  classId: CharacterClassId;
  description: string;
  baseDamageMult: number; // e.g. 1.8 for 180%
  damageMultPerLevel: number; // e.g. 0.08 for +8%
  cooldown: number; // cooldown in seconds
  level: number;
  pieces: number; // duplicate pieces
  piecesRequired: number; // required pieces to level up (e.g. level * 2)
  owned: boolean;
  unlocked?: boolean;
  effectType: SkillEffectType;
  bossPriority?: boolean;
  isAwakening?: boolean;
  hits?: number;
  icon: string;
  mechanics?: SkillMechanicType[];
  synergyTrigger?: SkillSynergyType;
  // Owned Collection Effects
  ownedAtk?: number;
  ownedHp?: number;
  ownedDef?: number;
  ownedCritDmg?: number;
}

export interface SkillSlotState {
  skillId: string | null;
  currentCooldown: number; // in seconds (0 = ready)
  maxCooldown: number;
}

export type ActiveTab = 'adventure' | 'hero' | 'equipment' | 'pet' | 'shop';

export interface GameSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  damageNumbers: boolean;
  autoBossRetry: boolean;
  autoUpgradeEquip: boolean;
  autoUpgradeSkills: boolean;
  autoEquipGear: boolean;
  autoEquipSkills: boolean;
}

export interface GameSaveData {
  version: number;
  lastOnlineTime: number;
  classId: CharacterClassId;
  promotion: PromotionId;
  awakeningUnlocked: boolean;
  awakeningGauge: number; // 0 ~ 100%
  promotionSeals: number;
  stats: CharacterStats;
  equipped: Partial<Record<EquipmentSlot, Equipment>>;
  inventory: Equipment[];
  equipmentCatalog?: Equipment[];
  pets: Pet[];

  activePetId: string | null;
  stage: StageState;
  quests: Quest[];
  skills: Skill[];
  equippedSkillIds: (string | null)[];
  freeChestLastOpened: number;
  settings: GameSettings;
  hasSelectedClass?: boolean;
  cheatUsed?: boolean;
  isTestAccount?: boolean;
  questCollapsed?: boolean;
  skillCooldownOff?: boolean;
  infiniteAwakening?: boolean;
}


