import { MissionEventType, MissionFrequency, MissionProgressItem, MissionsSaveState } from '../types/game';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface MissionTemplate {
  id: string;
  frequency: MissionFrequency;
  eventType: MissionEventType;
  title: string;
  description: string;
  targetCount: number;
  rewardGold: number;
  rewardGems: number;
  rewardStones: number;
  shortcutTab: 'adventure' | 'hero' | 'shop' | 'dungeon';
}

export const DAILY_MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'daily_kill_50',
    frequency: 'daily',
    eventType: 'monster_killed',
    title: '필드 몬스터 토벌',
    description: '전투에서 몬스터 50마리를 처치하세요.',
    targetCount: 50,
    rewardGold: 2500,
    rewardGems: 30,
    rewardStones: 0,
    shortcutTab: 'adventure',
  },
  {
    id: 'daily_stat_10',
    frequency: 'daily',
    eventType: 'stat_upgraded',
    title: '영웅 수련의 길',
    description: '영웅 스탯(공격력/체력/방어력)을 10회 강화하세요.',
    targetCount: 10,
    rewardGold: 1800,
    rewardGems: 25,
    rewardStones: 2,
    shortcutTab: 'hero',
  },
  {
    id: 'daily_summon_5',
    frequency: 'daily',
    eventType: 'equipment_summoned',
    title: '전설을 향한 소환',
    description: '장비 소환을 5회 진행하세요.',
    targetCount: 5,
    rewardGold: 2000,
    rewardGems: 40,
    rewardStones: 3,
    shortcutTab: 'shop',
  },
  {
    id: 'daily_dungeon_1',
    frequency: 'daily',
    eventType: 'dungeon_cleared',
    title: '던전 개척자',
    description: '특수 던전을 1회 클리어하세요.',
    targetCount: 1,
    rewardGold: 3000,
    rewardGems: 45,
    rewardStones: 4,
    shortcutTab: 'dungeon',
  },
  {
    id: 'daily_stage_3',
    frequency: 'daily',
    eventType: 'stage_cleared',
    title: '앞으로 나아가는 발걸음',
    description: '일반 스테이지를 3회 돌파하세요.',
    targetCount: 3,
    rewardGold: 2200,
    rewardGems: 35,
    rewardStones: 2,
    shortcutTab: 'adventure',
  },
];

export const WEEKLY_MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'weekly_kill_500',
    frequency: 'weekly',
    eventType: 'monster_killed',
    title: '주간 대토벌 작전',
    description: '몬스터를 누적 500마리 처치하세요.',
    targetCount: 500,
    rewardGold: 18000,
    rewardGems: 180,
    rewardStones: 15,
    shortcutTab: 'adventure',
  },
  {
    id: 'weekly_dungeon_10',
    frequency: 'weekly',
    eventType: 'dungeon_cleared',
    title: '주간 던전 정복자',
    description: '특수 던전을 누적 10회 클리어하세요.',
    targetCount: 10,
    rewardGold: 22000,
    rewardGems: 220,
    rewardStones: 25,
    shortcutTab: 'dungeon',
  },
  {
    id: 'weekly_summon_30',
    frequency: 'weekly',
    eventType: 'equipment_summoned',
    title: '무기고 대확장',
    description: '장비 소환을 누적 30회 진행하세요.',
    targetCount: 30,
    rewardGold: 15000,
    rewardGems: 260,
    rewardStones: 20,
    shortcutTab: 'shop',
  },
];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Returns YYYY-MM-DD in KST (UTC+9).
 */
export function getKstDateKey(nowMs: number = Date.now()): string {
  const kstDate = new Date(nowMs + KST_OFFSET_MS);
  const y = kstDate.getUTCFullYear();
  const m = pad2(kstDate.getUTCMonth() + 1);
  const d = pad2(kstDate.getUTCDate());
  return `${y}-${m}-${d}`;
}

/**
 * Returns the Monday YYYY-MM-DD key in KST (UTC+9) for weekly Monday 00:00 resets.
 */
export function getKstWeekKey(nowMs: number = Date.now()): string {
  const kstDate = new Date(nowMs + KST_OFFSET_MS);
  // getUTCDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayOfWeek = kstDate.getUTCDay();
  const diffFromMonday = (dayOfWeek + 6) % 7;
  const mondayKst = new Date(
    Date.UTC(kstDate.getUTCFullYear(), kstDate.getUTCMonth(), kstDate.getUTCDate() - diffFromMonday)
  );
  const y = mondayKst.getUTCFullYear();
  const m = pad2(mondayKst.getUTCMonth() + 1);
  const d = pad2(mondayKst.getUTCDate());
  return `${y}-${m}-${d}`;
}

/**
 * Milliseconds remaining until next KST 00:00.
 */
export function getMsUntilNextKstDailyReset(nowMs: number = Date.now()): number {
  const kstNow = nowMs + KST_OFFSET_MS;
  const nextMidnightKst = (Math.floor(kstNow / DAY_MS) + 1) * DAY_MS;
  return Math.max(0, nextMidnightKst - kstNow);
}

/**
 * Milliseconds remaining until next Monday 00:00 KST.
 */
export function getMsUntilNextKstWeeklyReset(nowMs: number = Date.now()): number {
  const kstDate = new Date(nowMs + KST_OFFSET_MS);
  const dayOfWeek = kstDate.getUTCDay();
  const daysUntilNextMonday = 7 - ((dayOfWeek + 6) % 7);
  const nextMondayUtcMs =
    Date.UTC(
      kstDate.getUTCFullYear(),
      kstDate.getUTCMonth(),
      kstDate.getUTCDate() + daysUntilNextMonday,
      0,
      0,
      0,
      0
    ) - KST_OFFSET_MS;
  return Math.max(0, nextMondayUtcMs - nowMs);
}

export function formatCountdownMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (days > 0) {
    return `${days}일 ${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;
  }
  return `${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;
}

function createMissionItemsFromTemplates(
  templates: MissionTemplate[],
  savedList?: MissionProgressItem[]
): MissionProgressItem[] {
  return templates.map((tpl) => {
    const saved = savedList?.find((s) => s.id === tpl.id);
    const currentCount = saved ? Math.max(0, Math.min(tpl.targetCount, Math.floor(saved.currentCount || 0))) : 0;
    return {
      id: tpl.id,
      frequency: tpl.frequency,
      eventType: tpl.eventType,
      title: tpl.title,
      description: tpl.description,
      targetCount: tpl.targetCount,
      currentCount,
      rewardGold: tpl.rewardGold,
      rewardGems: tpl.rewardGems,
      rewardStones: tpl.rewardStones,
      claimed: saved ? Boolean(saved.claimed) : false,
      shortcutTab: tpl.shortcutTab,
    };
  });
}

export function createDefaultMissionsState(nowMs: number = Date.now()): MissionsSaveState {
  return {
    lastDailyResetKst: getKstDateKey(nowMs),
    lastWeeklyResetKst: getKstWeekKey(nowMs),
    daily: createMissionItemsFromTemplates(DAILY_MISSION_TEMPLATES),
    weekly: createMissionItemsFromTemplates(WEEKLY_MISSION_TEMPLATES),
  };
}

/**
 * Checks KST daily (00:00 KST) and weekly (Monday 00:00 KST) reset boundaries.
 * Unclaimed rewards from the previous period are forfeited cleanly upon reset.
 */
export function checkAndResetMissions(
  state?: MissionsSaveState,
  nowMs: number = Date.now()
): MissionsSaveState {
  const todayKst = getKstDateKey(nowMs);
  const thisWeekKst = getKstWeekKey(nowMs);

  if (!state || typeof state !== 'object') {
    return createDefaultMissionsState(nowMs);
  }

  const dailyNeedsReset = state.lastDailyResetKst !== todayKst;
  const weeklyNeedsReset = state.lastWeeklyResetKst !== thisWeekKst;

  const nextDaily = dailyNeedsReset
    ? createMissionItemsFromTemplates(DAILY_MISSION_TEMPLATES)
    : createMissionItemsFromTemplates(DAILY_MISSION_TEMPLATES, state.daily);

  const nextWeekly = weeklyNeedsReset
    ? createMissionItemsFromTemplates(WEEKLY_MISSION_TEMPLATES)
    : createMissionItemsFromTemplates(WEEKLY_MISSION_TEMPLATES, state.weekly);

  return {
    lastDailyResetKst: todayKst,
    lastWeeklyResetKst: thisWeekKst,
    daily: nextDaily,
    weekly: nextWeekly,
  };
}

export function applyMissionEvent(
  state: MissionsSaveState | undefined,
  eventType: MissionEventType,
  amount: number = 1,
  nowMs: number = Date.now()
): MissionsSaveState {
  const normalized = checkAndResetMissions(state, nowMs);
  const safeAmount = Math.max(0, Math.floor(amount));
  if (safeAmount <= 0) return normalized;

  const updateList = (list: MissionProgressItem[]) =>
    list.map((item) => {
      if (item.eventType !== eventType) return item;
      const nextCount = Math.min(item.targetCount, item.currentCount + safeAmount);
      if (nextCount === item.currentCount) return item;
      return {
        ...item,
        currentCount: nextCount,
      };
    });

  return {
    ...normalized,
    daily: updateList(normalized.daily),
    weekly: updateList(normalized.weekly),
  };
}

export interface MissionClaimOutcome {
  nextState: MissionsSaveState;
  claimedMission: MissionProgressItem | null;
}

/**
 * Atomically marks a completed & unclaimed mission as claimed.
 * Returns null claimedMission if ineligible, already claimed, or reset across boundary.
 */
export function claimMissionReward(
  state: MissionsSaveState | undefined,
  missionId: string,
  nowMs: number = Date.now()
): MissionClaimOutcome {
  const normalized = checkAndResetMissions(state, nowMs);
  let claimedMission: MissionProgressItem | null = null;

  const claimInList = (list: MissionProgressItem[]) =>
    list.map((item) => {
      if (item.id !== missionId) return item;
      if (item.claimed || item.currentCount < item.targetCount) return item;
      const claimedItem = { ...item, claimed: true };
      claimedMission = claimedItem;
      return claimedItem;
    });

  const nextDaily = claimInList(normalized.daily);
  const nextWeekly = claimedMission ? normalized.weekly : claimInList(normalized.weekly);

  return {
    nextState: {
      ...normalized,
      daily: nextDaily,
      weekly: nextWeekly,
    },
    claimedMission,
  };
}

export function getClaimableMissionsCount(
  state: MissionsSaveState | undefined,
  nowMs: number = Date.now()
): { daily: number; weekly: number; total: number } {
  const normalized = checkAndResetMissions(state, nowMs);
  const daily = normalized.daily.filter((m) => !m.claimed && m.currentCount >= m.targetCount).length;
  const weekly = normalized.weekly.filter((m) => !m.claimed && m.currentCount >= m.targetCount).length;
  return { daily, weekly, total: daily + weekly };
}
