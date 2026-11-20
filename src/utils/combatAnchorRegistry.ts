import { CharacterClassId } from '../types/game';

export type CombatSceneContextId = 'main_battle' | 'skill_preview' | 'pet_showcase';

export type VisualRenderMode = 'original_art' | 'skeletal_rig';
export const DEFAULT_VISUAL_RENDER_MODE: VisualRenderMode = 'original_art';

export interface ClientPoint {
  x: number;
  y: number;
}

export interface ClientRectSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HeroSceneAttachments {
  updatedAt: number;
  classId: CharacterClassId;
  clipId: string;
  animState: string;
  weaponGrip: ClientPoint;
  weaponTip: ClientPoint;
  staffTip: ClientPoint;
  leftHand: ClientPoint;
  rightHand: ClientPoint;
  leftFoot: ClientPoint;
  rightFoot: ClientPoint;
  groundContact: ClientPoint;
  bodyCenter: ClientPoint;
  canvasRect?: ClientRectSnapshot;
}

export interface MonsterSceneAttachments {
  updatedAt: number;
  monsterId: string;
  archetype: string;
  clipId: string;
  animState: string;
  bodyCenter: ClientPoint;
  headCenter: ClientPoint;
  attackOrigin: ClientPoint;
  groundContact: ClientPoint;
  canvasRect?: ClientRectSnapshot;
}

export interface PetSceneAttachments {
  updatedAt: number;
  petId: string;
  clipId: string;
  animState: string;
  attackOrigin: ClientPoint;
  bodyCenter: ClientPoint;
  groundContact: ClientPoint;
  canvasRect?: ClientRectSnapshot;
}

declare global {
  interface Window {
    __heroAttachmentPoints?: HeroSceneAttachments;
    __monsterAttachmentPoints?: MonsterSceneAttachments;
    __petAttachmentPoints?: PetSceneAttachments;
  }
}

interface SceneAnchorBucket {
  hero: HeroSceneAttachments | null;
  monster: MonsterSceneAttachments | null;
  pet: PetSceneAttachments | null;
}

const sceneBuckets: Record<CombatSceneContextId, SceneAnchorBucket> = {
  main_battle: { hero: null, monster: null, pet: null },
  skill_preview: { hero: null, monster: null, pet: null },
  pet_showcase: { hero: null, monster: null, pet: null },
};

export const combatAnchorRegistry = {
  setHeroAnchors(sceneId: CombatSceneContextId, data: HeroSceneAttachments): void {
    sceneBuckets[sceneId].hero = data;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      window.__heroAttachmentPoints = data;
    }
  },
  getHeroAnchors(sceneId: CombatSceneContextId = 'main_battle'): HeroSceneAttachments | null {
    return sceneBuckets[sceneId].hero;
  },
  clearHeroAnchors(sceneId: CombatSceneContextId): void {
    sceneBuckets[sceneId].hero = null;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      delete window.__heroAttachmentPoints;
    }
  },

  setMonsterAnchors(sceneId: CombatSceneContextId, data: MonsterSceneAttachments): void {
    sceneBuckets[sceneId].monster = data;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      window.__monsterAttachmentPoints = data;
    }
  },
  getMonsterAnchors(sceneId: CombatSceneContextId = 'main_battle'): MonsterSceneAttachments | null {
    return sceneBuckets[sceneId].monster;
  },
  clearMonsterAnchors(sceneId: CombatSceneContextId): void {
    sceneBuckets[sceneId].monster = null;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      delete window.__monsterAttachmentPoints;
    }
  },

  setPetAnchors(sceneId: CombatSceneContextId, data: PetSceneAttachments): void {
    sceneBuckets[sceneId].pet = data;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      window.__petAttachmentPoints = data;
    }
  },
  getPetAnchors(sceneId: CombatSceneContextId = 'main_battle'): PetSceneAttachments | null {
    return sceneBuckets[sceneId].pet;
  },
  clearPetAnchors(sceneId: CombatSceneContextId): void {
    sceneBuckets[sceneId].pet = null;
    if (sceneId === 'main_battle' && typeof window !== 'undefined') {
      delete window.__petAttachmentPoints;
    }
  },
};
