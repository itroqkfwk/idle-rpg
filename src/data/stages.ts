export type EnvironmentTheme =
  | 'forest_entrance'
  | 'forest_deep'
  | 'forest_mystic'
  | 'lake_entrance'
  | 'lake_wetland'
  | 'lake_ruins'
  | 'autumn_trail'
  | 'autumn_valley'
  | 'autumn_shrine'
  | 'boss_crimson';

export type AmbientParticleType = 'leaves' | 'fireflies' | 'water_orbs' | 'maple_leaves' | 'boss_embers';

export interface StageEnvironment {
  mapId: string;
  chapter: number;
  stageMin: number;
  stageMax: number;
  areaName: string;
  subTitle: string;
  bgImage: string;
  theme: EnvironmentTheme;
  ambientParticleType: AmbientParticleType;
  filterStyle: string; // CSS filters for seamless dynamic lighting
  fogGradient: string;
  vignetteColor: string;
}

export const STAGE_ENVIRONMENTS: StageEnvironment[] = [
  // ==========================================
  // CHAPTER 1: 새싹의 숲 (Sprout Forest)
  // ==========================================
  {
    mapId: 'forest_entrance',
    chapter: 1,
    stageMin: 1,
    stageMax: 3,
    areaName: '새싹의 숲 입구',
    subTitle: '따스한 햇살이 비치는 푸른 숲길',
    bgImage: './assets/forest_bg.jpg',
    theme: 'forest_entrance',
    ambientParticleType: 'leaves',
    filterStyle: 'brightness(1.02) saturate(1.05)',
    fogGradient: 'radial-gradient(ellipse at 50% 20%, rgba(254, 240, 138, 0.12) 0%, transparent 70%)',
    vignetteColor: 'rgba(16, 185, 129, 0.08)',
  },
  {
    mapId: 'forest_deep',
    chapter: 1,
    stageMin: 4,
    stageMax: 6,
    areaName: '깊은 수풀 숲',
    subTitle: '울창한 수목이 우거진 깊은 녹음',
    bgImage: './assets/forest_bg.jpg',
    theme: 'forest_deep',
    ambientParticleType: 'leaves',
    filterStyle: 'brightness(0.92) contrast(1.1) saturate(1.15)',
    fogGradient: 'radial-gradient(ellipse at 50% 30%, rgba(5, 150, 105, 0.18) 0%, transparent 65%)',
    vignetteColor: 'rgba(6, 78, 59, 0.22)',
  },
  {
    mapId: 'forest_mystic',
    chapter: 1,
    stageMin: 7,
    stageMax: 9,
    areaName: '신비의 안개 숲',
    subTitle: '고대 마력이 서린 푸른 안개 숲',
    bgImage: './assets/forest_bg.jpg',
    theme: 'forest_mystic',
    ambientParticleType: 'fireflies',
    filterStyle: 'brightness(0.85) contrast(1.15) hue-rotate(15deg) saturate(1.1)',
    fogGradient: 'radial-gradient(ellipse at 50% 40%, rgba(56, 189, 248, 0.22) 0%, transparent 75%)',
    vignetteColor: 'rgba(15, 23, 42, 0.28)',
  },
  {
    mapId: 'forest_boss',
    chapter: 1,
    stageMin: 10,
    stageMax: 10,
    areaName: '고대수 수호자의 제단',
    subTitle: '숲의 고대 골렘이 잠든 보스 구역',
    bgImage: './assets/forest_bg.jpg',
    theme: 'boss_crimson',
    ambientParticleType: 'boss_embers',
    filterStyle: 'brightness(0.78) contrast(1.25) saturate(1.25)',
    fogGradient: 'radial-gradient(ellipse at 50% 40%, rgba(239, 68, 68, 0.25) 0%, transparent 80%)',
    vignetteColor: 'rgba(153, 27, 27, 0.35)',
  },

  // ==========================================
  // CHAPTER 2: 달빛 호숫가 (Moonlit Lake)
  // ==========================================
  {
    mapId: 'lake_entrance',
    chapter: 2,
    stageMin: 1,
    stageMax: 3,
    areaName: '달빛 호숫가 입구',
    subTitle: '은은한 밤하늘과 푸른 수련이 빛나는 호수',
    bgImage: './assets/lake_bg.jpg',
    theme: 'lake_entrance',
    ambientParticleType: 'water_orbs',
    filterStyle: 'brightness(1.0) saturate(1.05)',
    fogGradient: 'radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
    vignetteColor: 'rgba(12, 74, 110, 0.18)',
  },
  {
    mapId: 'lake_wetland',
    chapter: 2,
    stageMin: 4,
    stageMax: 6,
    areaName: '푸른 습지',
    subTitle: '신비로운 물안개가 피어오르는 습지대',
    bgImage: './assets/lake_bg.jpg',
    theme: 'lake_wetland',
    ambientParticleType: 'water_orbs',
    filterStyle: 'brightness(0.92) contrast(1.12) saturate(1.15)',
    fogGradient: 'radial-gradient(ellipse at 50% 35%, rgba(14, 165, 233, 0.22) 0%, transparent 70%)',
    vignetteColor: 'rgba(8, 47, 73, 0.25)',
  },
  {
    mapId: 'lake_ruins',
    chapter: 2,
    stageMin: 7,
    stageMax: 9,
    areaName: '달빛 석조 유적',
    subTitle: '고대 문명의 석조 기둥과 오로라',
    bgImage: './assets/lake_bg.jpg',
    theme: 'lake_ruins',
    ambientParticleType: 'fireflies',
    filterStyle: 'brightness(0.86) contrast(1.2) hue-rotate(-10deg) saturate(1.2)',
    fogGradient: 'radial-gradient(ellipse at 50% 40%, rgba(168, 85, 247, 0.22) 0%, transparent 75%)',
    vignetteColor: 'rgba(59, 7, 100, 0.3)',
  },
  {
    mapId: 'lake_boss',
    chapter: 2,
    stageMin: 10,
    stageMax: 10,
    areaName: '심연 호수의 심장',
    subTitle: '호수의 군주가 도사리는 보스 구역',
    bgImage: './assets/lake_bg.jpg',
    theme: 'boss_crimson',
    ambientParticleType: 'boss_embers',
    filterStyle: 'brightness(0.8) contrast(1.3) saturate(1.3)',
    fogGradient: 'radial-gradient(ellipse at 50% 40%, rgba(225, 29, 72, 0.28) 0%, transparent 80%)',
    vignetteColor: 'rgba(136, 19, 55, 0.38)',
  },

  // ==========================================
  // CHAPTER 3: 노을빛 단풍 골짜기 (Autumn Valley)
  // ==========================================
  {
    mapId: 'autumn_trail',
    chapter: 3,
    stageMin: 1,
    stageMax: 3,
    areaName: '노을빛 단풍 산책로',
    subTitle: '황금빛 석양과 붉은 단풍잎이 흩날리는 길',
    bgImage: './assets/autumn_bg.jpg',
    theme: 'autumn_trail',
    ambientParticleType: 'maple_leaves',
    filterStyle: 'brightness(1.02) saturate(1.1)',
    fogGradient: 'radial-gradient(ellipse at 50% 25%, rgba(251, 146, 60, 0.18) 0%, transparent 70%)',
    vignetteColor: 'rgba(124, 45, 18, 0.16)',
  },
  {
    mapId: 'autumn_valley',
    chapter: 3,
    stageMin: 4,
    stageMax: 6,
    areaName: '붉은 단풍 골짜기',
    subTitle: '타오르는 듯한 진홍빛 단풍 절경',
    bgImage: './assets/autumn_bg.jpg',
    theme: 'autumn_valley',
    ambientParticleType: 'maple_leaves',
    filterStyle: 'brightness(0.94) contrast(1.12) saturate(1.2)',
    fogGradient: 'radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
    vignetteColor: 'rgba(153, 27, 27, 0.24)',
  },
  {
    mapId: 'autumn_shrine',
    chapter: 3,
    stageMin: 7,
    stageMax: 9,
    areaName: '골짜기 고대 사당로',
    subTitle: '신령한 석조 등불과 황금빛 안개',
    bgImage: './assets/autumn_bg.jpg',
    theme: 'autumn_shrine',
    ambientParticleType: 'maple_leaves',
    filterStyle: 'brightness(0.88) contrast(1.18) saturate(1.25)',
    fogGradient: 'radial-gradient(ellipse at 50% 35%, rgba(245, 158, 11, 0.24) 0%, transparent 75%)',
    vignetteColor: 'rgba(120, 53, 15, 0.28)',
  },
  {
    mapId: 'autumn_boss',
    chapter: 3,
    stageMin: 10,
    stageMax: 10,
    areaName: '노을 제단 정상',
    subTitle: '화염의 지배자가 군림하는 보스 구역',
    bgImage: './assets/autumn_bg.jpg',
    theme: 'boss_crimson',
    ambientParticleType: 'boss_embers',
    filterStyle: 'brightness(0.8) contrast(1.3) saturate(1.35)',
    fogGradient: 'radial-gradient(ellipse at 50% 40%, rgba(220, 38, 38, 0.3) 0%, transparent 80%)',
    vignetteColor: 'rgba(127, 29, 29, 0.4)',
  },
];

/**
 * Returns the exact StageEnvironment configuration for a given chapter, stage and boss state.
 * Cycles smoothly through chapters if player progresses past chapter 3.
 */
export function getStageEnvironment(chapter: number, stage: number, isBossFight: boolean): StageEnvironment {
  const normChapter = ((chapter - 1) % 3) + 1;
  const normStage = Math.max(1, Math.min(10, stage));

  if (normStage === 10 && isBossFight) {
    const bossEnv = STAGE_ENVIRONMENTS.find((e) => e.chapter === normChapter && e.stageMin === 10);
    if (bossEnv) return bossEnv;
  }

  const found = STAGE_ENVIRONMENTS.find(
    (e) => e.chapter === normChapter && normStage >= e.stageMin && normStage <= e.stageMax
  );

  return found || STAGE_ENVIRONMENTS[0];
}
