import { CHAPTERS_DATA } from './monsters';
import { MonsterCodexRecord, MonsterCodexSaveState } from '../types/game';

export type CodexBonusType = 'atk' | 'gold' | 'exp';

export interface CodexMilestoneTier {
  tier: 1 | 2 | 3;
  requiredKills: number;
  bonusValue: number; // flat ATK when atk, fractional rate (e.g. 0.02 = +2%) when gold/exp
}

export interface MonsterCodexCatalogItem {
  id: string;
  chapter: number;
  chapterName: string;
  stageLabel: string;
  name: string;
  sprite: string;
  isBoss: boolean;
  element: 'grass' | 'water' | 'fire' | 'light' | 'dark';
  description: string;
  bonusType: CodexBonusType;
  tiers: CodexMilestoneTier[];
}

export interface MonsterCodexBonusSummary {
  flatAtk: number;
  goldBonusRate: number; // e.g. 0.05 = +5% Gold
  expBonusRate: number;  // e.g. 0.04 = +4% EXP
  discoveredCount: number;
  defeatedCount: number;
  totalCount: number;
  unlockedTierCount: number;
  totalTierCount: number;
}

const MONSTER_SPRITE_MAP: Record<string, string> = {
  c1_m1: './assets/monster_slime.png',
  c1_m2: './assets/monster_mushroom.png',
  c1_m3: './assets/monster_bee.png',
  c1_m4: './assets/monster_spirit.png',
  c1_boss: './assets/ch1_boss.png',
  c2_m1: './assets/ch2_water_spirit.png',
  c2_m2: './assets/monster_slime.png',
  c2_m3: './assets/monster_mushroom.png',
  c2_boss: './assets/ch2_boss.png',
  c3_m1: './assets/monster_slime.png',
  c3_m2: './assets/ch3_fox.png',
  c3_boss: './assets/ch3_boss.png',
  c4_m1: './assets/ch4_slime.png',
  c4_m2: './assets/ch4_spirit.png',
  c4_m3: './assets/ch4_wolf.png',
  c4_m4: './assets/ch4_golem.png',
  c4_boss: './assets/ch4_boss.png',
  c5_m1: './assets/ch5_slime.png',
  c5_m2: './assets/ch5_butterfly.png',
  c5_m3: './assets/ch5_fox.png',
  c5_m4: './assets/ch5_golem.png',
  c5_boss: './assets/ch5_boss.png',
};

const MONSTER_LORE_MAP: Record<string, { stageLabel: string; description: string; bonusType: CodexBonusType }> = {
  c1_m1: { stageLabel: 'Ch.1-1 ~ 1-2', description: '새싹의 숲 초입에서 흔히 마주치는 말랑한 풀잎 슬라임입니다.', bonusType: 'gold' },
  c1_m2: { stageLabel: 'Ch.1-3 ~ 1-4', description: '촉촉한 숲 바닥의 이끼를 먹고 자라는 꼬마 버섯 몬스터입니다.', bonusType: 'exp' },
  c1_m3: { stageLabel: 'Ch.1-5 ~ 1-6', description: '달콤한 꿀을 지키기 위해 재빠르게 날아다니는 정원 꿀벌입니다.', bonusType: 'atk' },
  c1_m4: { stageLabel: 'Ch.1-7 ~ 1-9', description: '신비의 안개 숲에서 은은한 빛을 내뿜으며 길을 밝히는 요정입니다.', bonusType: 'exp' },
  c1_boss: { stageLabel: 'Ch.1-10 BOSS', description: '고대 룬과 숲의 덩굴이 결합해 깨어난 새싹의 숲 수호 거인입니다.', bonusType: 'atk' },

  c2_m1: { stageLabel: 'Ch.2-1 ~ 2-3', description: '달빛 호수의 순수한 마력이 응집되어 태어난 물방울 정령입니다.', bonusType: 'exp' },
  c2_m2: { stageLabel: 'Ch.2-4 ~ 2-6', description: '연잎 위를 뛰어다니며 물결 파동을 일으키는 개구리 몬스터입니다.', bonusType: 'gold' },
  c2_m3: { stageLabel: 'Ch.2-7 ~ 2-9', description: '단단한 푸른 소라 껍데기로 몸을 보호하는 호숫가 수호 게입니다.', bonusType: 'atk' },
  c2_boss: { stageLabel: 'Ch.2-10 BOSS', description: '달빛 호수 유적의 심연에서 호수를 지키는 고대 수호룡입니다.', bonusType: 'gold' },

  c3_m1: { stageLabel: 'Ch.3-1 ~ 3-4', description: '단풍 골짜기의 뜨거운 불씨가 깃들어 장난을 치는 도깨비입니다.', bonusType: 'atk' },
  c3_m2: { stageLabel: 'Ch.3-5 ~ 3-9', description: '붉은 노을빛 꼬리를 흔들며 민첩하게 돌진하는 여우 정령입니다.', bonusType: 'gold' },
  c3_boss: { stageLabel: 'Ch.3-10 BOSS', description: '타오르는 마그마 룬으로 각성한 노을 제단의 화염 거인입니다.', bonusType: 'atk' },

  c4_m1: { stageLabel: 'Ch.4-1 ~ 4-2', description: '달빛 아래 발광 포자를 뿜는 반투명 민트빛 습지 버섯 슬라임입니다.', bonusType: 'gold' },
  c4_m2: { stageLabel: 'Ch.4-3 ~ 4-4', description: '물안개 사이를 유영하며 마력 파동을 쏘는 청록빛 정령입니다.', bonusType: 'exp' },
  c4_m3: { stageLabel: 'Ch.4-5 ~ 4-6', description: '보랏빛 그림자 털과 룬 문양을 지닌 날렵한 습지 사냥꾼 늑대입니다.', bonusType: 'atk' },
  c4_m4: { stageLabel: 'Ch.4-7 ~ 4-9', description: '이끼 낀 바위와 푸른 달빛 결정이 융합된 묵직한 수호 골렘입니다.', bonusType: 'atk' },
  c4_boss: { stageLabel: 'Ch.4-10 BOSS', description: '달빛 충격파와 그림자 낙하를 다루는 달그림자 성소의 지배자입니다.', bonusType: 'atk' },

  c5_m1: { stageLabel: 'Ch.5-1 ~ 5-2', description: '머리 위에 영롱한 수정 꽃이 피어나는 장밋빛 유리 슬라임입니다.', bonusType: 'gold' },
  c5_m2: { stageLabel: 'Ch.5-3 ~ 5-4', description: '스테인드글라스 같은 날개로 별빛 가루를 흩뿌리는 나비 요정입니다.', bonusType: 'exp' },
  c5_m3: { stageLabel: 'Ch.5-5 ~ 5-6', description: '은하수 꼬리와 사파이어 귀 끝을 지닌 고귀한 별빛 여우입니다.', bonusType: 'gold' },
  c5_m4: { stageLabel: 'Ch.5-7 ~ 5-9', description: '자수정과 금빛 별자리 갑옷으로 중무장한 정원의 파수 골렘입니다.', bonusType: 'atk' },
  c5_boss: { stageLabel: 'Ch.5-10 BOSS', description: '별빛 창과 수정 폭발로 정원의 성소를 지키는 천상의 수호 기사입니다.', bonusType: 'atk' },
};

function buildTiers(chapter: number, isBoss: boolean, bonusType: CodexBonusType): CodexMilestoneTier[] {
  const counts: [number, number, number] = isBoss ? [1, 5, 15] : [10, 50, 200];
  if (bonusType === 'atk') {
    const unit = isBoss ? chapter * 25 : chapter * 10;
    return [
      { tier: 1, requiredKills: counts[0], bonusValue: unit },
      { tier: 2, requiredKills: counts[1], bonusValue: unit * 2 },
      { tier: 3, requiredKills: counts[2], bonusValue: unit * 4 },
    ];
  }
  const rateScale = isBoss ? 0.02 : 0.01;
  return [
    { tier: 1, requiredKills: counts[0], bonusValue: rateScale },
    { tier: 2, requiredKills: counts[1], bonusValue: rateScale * 2 },
    { tier: 3, requiredKills: counts[2], bonusValue: rateScale * 3 },
  ];
}

export const MONSTER_CODEX_CATALOG: MonsterCodexCatalogItem[] = CHAPTERS_DATA.flatMap((ch) => {
  const shortChapter = ch.name.replace(/\s*\(.*?\)/, '');
  const list = [...ch.monsters, ch.boss];
  return list.map((mon) => {
    const meta = MONSTER_LORE_MAP[mon.id] || {
      stageLabel: `Ch.${ch.chapter}`,
      description: `${shortChapter}에 서식하는 몬스터입니다.`,
      bonusType: (mon.isBoss ? 'atk' : 'gold') as CodexBonusType,
    };
    return {
      id: mon.id,
      chapter: ch.chapter,
      chapterName: shortChapter,
      stageLabel: meta.stageLabel,
      name: mon.name.replace(' [BOSS]', ''),
      sprite: MONSTER_SPRITE_MAP[mon.id] || './assets/monster_slime.png',
      isBoss: mon.isBoss,
      element: mon.element,
      description: meta.description,
      bonusType: meta.bonusType,
      tiers: buildTiers(ch.chapter, mon.isBoss, meta.bonusType),
    };
  });
});

const CODEX_ITEM_MAP = new Map<string, MonsterCodexCatalogItem>(
  MONSTER_CODEX_CATALOG.map((item) => [item.id, item])
);

export function getCodexCatalogItem(monsterId: string): MonsterCodexCatalogItem | undefined {
  return CODEX_ITEM_MAP.get(monsterId);
}

/**
 * Normalizes persisted monster codex without ever fabricating historical kills.
 */
export function normalizeMonsterCodex(raw: unknown): MonsterCodexSaveState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const safe: MonsterCodexSaveState = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!CODEX_ITEM_MAP.has(key) || !val || typeof val !== 'object') continue;
    const rec = val as Partial<MonsterCodexRecord>;
    const killCount = Math.max(0, Math.floor(Number(rec.killCount) || 0));
    const discovered = Boolean(rec.discovered || killCount > 0 || rec.firstDefeated);
    const firstDefeated = Boolean(rec.firstDefeated || killCount > 0);
    safe[key] = {
      id: key,
      discovered,
      firstDefeated,
      killCount,
      ...(rec.firstDiscoveredAt ? { firstDiscoveredAt: rec.firstDiscoveredAt } : {}),
      ...(rec.firstDefeatedAt ? { firstDefeatedAt: rec.firstDefeatedAt } : {}),
    };
  }
  return safe;
}

export function recordMonsterDiscovery(
  codex: MonsterCodexSaveState | undefined,
  monsterId: string,
  nowMs: number = Date.now()
): MonsterCodexSaveState {
  if (!CODEX_ITEM_MAP.has(monsterId)) return codex || {};
  const base = codex || {};
  const existing = base[monsterId];
  if (existing?.discovered) return base;
  return {
    ...base,
    [monsterId]: {
      id: monsterId,
      discovered: true,
      firstDefeated: existing?.firstDefeated ?? false,
      killCount: existing?.killCount ?? 0,
      firstDiscoveredAt: existing?.firstDiscoveredAt ?? nowMs,
      ...(existing?.firstDefeatedAt ? { firstDefeatedAt: existing.firstDefeatedAt } : {}),
    },
  };
}

export function recordMonsterDefeat(
  codex: MonsterCodexSaveState | undefined,
  monsterId: string,
  nowMs: number = Date.now()
): MonsterCodexSaveState {
  if (!CODEX_ITEM_MAP.has(monsterId)) return codex || {};
  const base = codex || {};
  const existing = base[monsterId];
  return {
    ...base,
    [monsterId]: {
      id: monsterId,
      discovered: true,
      firstDefeated: true,
      killCount: (existing?.killCount ?? 0) + 1,
      firstDiscoveredAt: existing?.firstDiscoveredAt ?? nowMs,
      firstDefeatedAt: existing?.firstDefeatedAt ?? nowMs,
    },
  };
}

export function calculateMonsterCodexBonuses(
  codex: MonsterCodexSaveState | undefined
): MonsterCodexBonusSummary {
  const records = codex || {};
  let flatAtk = 0;
  let goldBonusRate = 0;
  let expBonusRate = 0;
  let discoveredCount = 0;
  let defeatedCount = 0;
  let unlockedTierCount = 0;
  let totalTierCount = 0;

  for (const item of MONSTER_CODEX_CATALOG) {
    totalTierCount += item.tiers.length;
    const rec = records[item.id];
    if (rec?.discovered) discoveredCount++;
    if (rec?.firstDefeated || (rec?.killCount ?? 0) > 0) defeatedCount++;
    const kills = rec?.killCount ?? 0;

    for (const tier of item.tiers) {
      if (kills >= tier.requiredKills) {
        unlockedTierCount++;
        if (item.bonusType === 'atk') flatAtk += tier.bonusValue;
        else if (item.bonusType === 'gold') goldBonusRate += tier.bonusValue;
        else if (item.bonusType === 'exp') expBonusRate += tier.bonusValue;
      }
    }
  }

  return {
    flatAtk,
    goldBonusRate: Math.round(goldBonusRate * 1000) / 1000,
    expBonusRate: Math.round(expBonusRate * 1000) / 1000,
    discoveredCount,
    defeatedCount,
    totalCount: MONSTER_CODEX_CATALOG.length,
    unlockedTierCount,
    totalTierCount,
  };
}
