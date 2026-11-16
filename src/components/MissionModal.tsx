import React, { useState, useEffect } from 'react';
import { ActiveTab, MissionFrequency, MissionProgressItem, MissionsSaveState } from '../types/game';
import {
  formatCountdownMs,
  getMsUntilNextKstDailyReset,
  getMsUntilNextKstWeeklyReset,
} from '../data/missions';
import { CalendarCheck, CheckCircle2, Clock, Sparkles, X, ArrowRight } from 'lucide-react';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: MissionsSaveState;
  onClaimMission: (missionId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  missions,
  onClaimMission,
  onNavigateTab,
}) => {
  const [activeFreq, setActiveFreq] = useState<MissionFrequency>('daily');
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!isOpen) return;
    setNowMs(Date.now());
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const dailyClaimable = missions.daily.filter((m) => !m.claimed && m.currentCount >= m.targetCount).length;
  const weeklyClaimable = missions.weekly.filter((m) => !m.claimed && m.currentCount >= m.targetCount).length;

  const list = activeFreq === 'daily' ? missions.daily : missions.weekly;
  const sortedList = [...list].sort((a, b) => {
    const rank = (m: MissionProgressItem) => {
      if (!m.claimed && m.currentCount >= m.targetCount) return 0; // Claimable first
      if (!m.claimed) return 1; // In progress
      return 2; // Already claimed
    };
    return rank(a) - rank(b);
  });

  const resetRemaining =
    activeFreq === 'daily'
      ? formatCountdownMs(getMsUntilNextKstDailyReset(nowMs))
      : formatCountdownMs(getMsUntilNextKstWeeklyReset(nowMs));

  const resetLabel = activeFreq === 'daily' ? '매일 00:00 KST 초기화' : '매주 월요일 00:00 KST 초기화';

  return (
    <div
      className="mission-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mission-modal-panel" role="dialog" aria-label="일일 및 주간 미션">
        {/* Header */}
        <div className="mission-modal-header">
          <div className="mission-header-title-wrap">
            <div className="mission-header-icon">
              <CalendarCheck size={18} color="#a5b4fc" />
            </div>
            <div>
              <h2 className="mission-modal-title">일일 · 주간 미션</h2>
              <p className="mission-modal-sub">실제 전투·성장·던전 활동으로 보상을 획득하세요.</p>
            </div>
          </div>
          <button className="mission-close-btn" onClick={onClose} aria-label="미션 창 닫기">
            <X size={18} />
          </button>
        </div>

        {/* Daily / Weekly Switcher & KST Reset Timer */}
        <div className="mission-toolbar">
          <div className="mission-tabs">
            <button
              className={`mission-tab-btn ${activeFreq === 'daily' ? 'tab-active' : ''}`}
              onClick={() => setActiveFreq('daily')}
            >
              <span>일일 미션 (5)</span>
              {dailyClaimable > 0 && <span className="mission-tab-badge">{dailyClaimable}</span>}
            </button>
            <button
              className={`mission-tab-btn ${activeFreq === 'weekly' ? 'tab-active' : ''}`}
              onClick={() => setActiveFreq('weekly')}
            >
              <span>주간 미션 (3)</span>
              {weeklyClaimable > 0 && <span className="mission-tab-badge">{weeklyClaimable}</span>}
            </button>
          </div>
          <div className="mission-reset-chip" title={resetLabel}>
            <Clock size={12} color="#93c5fd" />
            <span>초기화 {resetRemaining}</span>
          </div>
        </div>

        {/* Mission List */}
        <div className="mission-list-scroll">
          {sortedList.map((m) => {
            const pct = Math.min(100, Math.floor((m.currentCount / Math.max(1, m.targetCount)) * 100));
            const isComplete = m.currentCount >= m.targetCount;
            const canClaim = isComplete && !m.claimed;

            return (
              <div
                key={m.id}
                className={`mission-card ${canClaim ? 'card-claimable' : m.claimed ? 'card-claimed' : ''}`}
              >
                <div className="mission-card-main">
                  <div className="mission-card-top">
                    <span className="mission-card-title">{m.title}</span>
                    <span className="mission-card-count">
                      {m.currentCount.toLocaleString()} / {m.targetCount.toLocaleString()}
                    </span>
                  </div>
                  <p className="mission-card-desc">{m.description}</p>

                  <div className="mission-progress-track">
                    <div
                      className={`mission-progress-fill ${canClaim ? 'fill-ready' : m.claimed ? 'fill-done' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mission-rewards-row">
                    {m.rewardGold > 0 && <span className="m-reward-chip gold">골드 +{m.rewardGold.toLocaleString()}</span>}
                    {m.rewardGems > 0 && <span className="m-reward-chip gem">보석 +{m.rewardGems}</span>}
                    {m.rewardStones > 0 && <span className="m-reward-chip stone">강화석 +{m.rewardStones}</span>}
                  </div>
                </div>

                <div className="mission-card-action">
                  {m.claimed ? (
                    <span className="mission-done-badge">
                      <CheckCircle2 size={14} />
                      <span>완료됨</span>
                    </span>
                  ) : canClaim ? (
                    <button className="mission-claim-btn" onClick={() => onClaimMission(m.id)}>
                      <Sparkles size={13} />
                      <span>보상 수령</span>
                    </button>
                  ) : m.shortcutTab && m.shortcutTab !== 'adventure' ? (
                    <button
                      className="mission-go-btn"
                      onClick={() => {
                        onNavigateTab(m.shortcutTab!);
                        onClose();
                      }}
                    >
                      <span>바로가기</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <span className="mission-progress-pct">{pct}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          .mission-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 120;
            background: rgba(2, 6, 23, 0.72);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
          }
          .mission-modal-panel {
            width: 100%;
            max-width: 520px;
            max-height: min(84vh, 660px);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.97) 0%, rgba(17, 24, 39, 0.98) 100%);
            border: 1px solid rgba(129, 140, 248, 0.35);
            border-radius: 18px;
            box-shadow: 0 24px 55px rgba(0, 0, 0, 0.75);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            color: #f8fafc;
          }
          .mission-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(30, 41, 59, 0.55);
          }
          .mission-header-title-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .mission-header-icon {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(129, 140, 248, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mission-modal-title {
            margin: 0;
            font-size: 16px;
            font-weight: 900;
            color: #f8fafc;
          }
          .mission-modal-sub {
            margin: 2px 0 0;
            font-size: 11px;
            color: #94a3b8;
          }
          .mission-close-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 9px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #cbd5e1;
            cursor: pointer;
          }
          .mission-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            flex-wrap: wrap;
            padding: 10px 16px;
            background: rgba(15, 23, 42, 0.7);
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }
          .mission-tabs {
            display: flex;
            gap: 6px;
          }
          .mission-tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(30, 41, 59, 0.8);
            color: #94a3b8;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
          }
          .mission-tab-btn.tab-active {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            border-color: rgba(199, 210, 254, 0.65);
            color: #ffffff;
          }
          .mission-tab-badge {
            min-width: 16px;
            height: 16px;
            padding: 0 4px;
            border-radius: 9999px;
            background: #ef4444;
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .mission-reset-chip {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 700;
            color: #bfdbfe;
            background: rgba(30, 58, 138, 0.35);
            border: 1px solid rgba(96, 165, 250, 0.3);
            padding: 4px 9px;
            border-radius: 9999px;
          }
          .mission-list-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 12px 16px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .mission-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px;
            border-radius: 13px;
            background: rgba(30, 41, 59, 0.62);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .mission-card.card-claimable {
            border-color: rgba(251, 191, 36, 0.72);
            background: linear-gradient(135deg, rgba(67, 56, 202, 0.25), rgba(217, 119, 6, 0.18));
            box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
          }
          .mission-card.card-claimed {
            opacity: 0.62;
          }
          .mission-card-main {
            flex: 1;
            min-width: 0;
          }
          .mission-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }
          .mission-card-title {
            font-size: 13px;
            font-weight: 900;
            color: #f8fafc;
          }
          .mission-card-count {
            font-size: 11px;
            font-weight: 800;
            color: #cbd5e1;
          }
          .mission-card-desc {
            margin: 3px 0 7px;
            font-size: 11px;
            color: #94a3b8;
          }
          .mission-progress-track {
            width: 100%;
            height: 6px;
            border-radius: 9999px;
            background: rgba(15, 23, 42, 0.85);
            overflow: hidden;
            margin-bottom: 7px;
          }
          .mission-progress-fill {
            height: 100%;
            border-radius: 9999px;
            background: linear-gradient(90deg, #3b82f6, #818cf8);
            transition: width 0.25s ease;
          }
          .mission-progress-fill.fill-ready {
            background: linear-gradient(90deg, #f59e0b, #fbbf24);
          }
          .mission-progress-fill.fill-done {
            background: #10b981;
          }
          .mission-rewards-row {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          .m-reward-chip {
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.14);
          }
          .m-reward-chip.gold {
            color: #fef08a;
            background: rgba(245, 158, 11, 0.16);
            border-color: rgba(245, 158, 11, 0.35);
          }
          .m-reward-chip.gem {
            color: #67e8f9;
            background: rgba(56, 189, 248, 0.16);
            border-color: rgba(56, 189, 248, 0.35);
          }
          .m-reward-chip.stone {
            color: #e9d5ff;
            background: rgba(168, 85, 247, 0.2);
            border-color: rgba(168, 85, 247, 0.4);
          }
          .mission-card-action {
            flex-shrink: 0;
            display: flex;
            align-items: center;
          }
          .mission-claim-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 7px 11px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.35);
            background: linear-gradient(135deg, #10b981, #059669);
            color: #ffffff;
            font-size: 11px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(16, 185, 129, 0.45);
          }
          .mission-go-btn {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 6px 10px;
            border-radius: 9px;
            border: 1px solid rgba(129, 140, 248, 0.45);
            background: rgba(79, 70, 229, 0.28);
            color: #c7d2fe;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
          }
          .mission-done-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #34d399;
            font-size: 11px;
            font-weight: 800;
          }
          .mission-progress-pct {
            font-size: 12px;
            font-weight: 900;
            color: #94a3b8;
            min-width: 36px;
            text-align: right;
          }
        `}</style>
      </div>
    </div>
  );
};
