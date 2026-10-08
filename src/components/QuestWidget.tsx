import React from 'react';
import { Quest } from '../types/game';
import { Scroll, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuestWidgetProps {
  quest: Quest | null;
  onClaim: (questId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const QuestWidget: React.FC<QuestWidgetProps> = ({
  quest,
  onClaim,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  if (!quest) return null;

  const percent = Math.min(100, Math.floor((quest.currentCount / quest.targetCount) * 100));
  const isReady = quest.currentCount >= quest.targetCount && !quest.claimed;

  return (
    <div
      className={`floating-quest-card ${isReady ? 'quest-ready-glow' : ''} ${
        isCollapsed ? 'quest-is-collapsed' : ''
      }`}
    >
      {/* 📱 Mobile Single Row Ribbon View (width < 700px) */}
      <div className="quest-mobile-view">
        <div className="quest-icon-bubble">
          <Scroll size={13} color="#f59e0b" />
        </div>

        <div className="quest-info-body">
          <div className="quest-title-row">
            <span className="quest-title-text" title={quest.title}>{quest.title}</span>
            <span className="quest-count-tag">
              {quest.currentCount}/{quest.targetCount}
            </span>
          </div>

          <div className="quest-mini-progress">
            <div className="quest-mini-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Claim Button displayed only when ready */}
        {isReady && (
          <div className="quest-action-slot">
            <button className="quest-claim-pill-btn" onClick={() => onClaim(quest.id)}>
              <Sparkles size={11} color="#ffffff" />
              <span>보상 받기</span>
            </button>
          </div>
        )}
      </div>

      {/* 🖥️ PC / Compact Desktop View (width >= 700px) */}
      <div className="quest-pc-view">
        {isCollapsed ? (
          /* Collapsed Minimized Button */
          <button
            className="quest-collapsed-toggle-btn"
            onClick={() => onToggleCollapse?.(false)}
            title="퀘스트 트래커 펼치기"
          >
            <div className="collapsed-icon-wrap">
              <Scroll size={14} color="#f59e0b" />
              {isReady && <span className="collapsed-notif-dot" />}
            </div>
            <span className="collapsed-txt">QUEST</span>
            <ChevronLeft size={13} color="#94a3b8" />
          </button>
        ) : (
          /* Expanded Dark Glass Tracker Card */
          <div className="quest-pc-card-inner">
            <div className="quest-pc-top">
              <div className="quest-pc-header-left">
                <div className="quest-pc-icon-frame">
                  <Scroll size={13} color="#f59e0b" />
                </div>
                <div className="quest-pc-title-col">
                  <span className="quest-pc-badge-lbl">QUEST</span>
                  <span className="quest-pc-title" title={quest.title}>{quest.title}</span>
                </div>
              </div>

              <div className="quest-pc-header-right">
                <span className="quest-pc-count">
                  {quest.currentCount} / {quest.targetCount}
                </span>
                <button
                  className="quest-pc-collapse-btn"
                  onClick={() => onToggleCollapse?.(true)}
                  title="퀘스트 접기"
                >
                  <ChevronRight size={13} color="#94a3b8" />
                </button>
              </div>
            </div>

            <div className="quest-mini-progress pc-progress-track">
              <div className="quest-mini-fill" style={{ width: `${percent}%` }} />
            </div>

            <div className="quest-pc-footer">
              <div className="quest-pc-rewards">
                <span className="quest-reward-chip">🪙 +{quest.rewardGold.toLocaleString()}</span>
                <span className="quest-reward-chip gem-chip">💎 +{quest.rewardGems}</span>
              </div>
              {isReady && (
                <button className="quest-pc-claim-btn" onClick={() => onClaim(quest.id)}>
                  <CheckCircle2 size={12} />
                  <span>보상 수령</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Base (Mobile) */
        .floating-quest-card {
          position: absolute;
          top: 56px;
          left: 14px;
          right: 14px;
          z-index: 50;
          height: 34px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          padding: 0 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          user-select: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }

        .quest-ready-glow {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.35), 0 4px 16px rgba(0, 0, 0, 0.5);
          animation: questPulse 2s infinite alternate;
        }

        @keyframes questPulse {
          from { border-color: rgba(245, 158, 11, 0.4); }
          to { border-color: rgba(245, 158, 11, 0.9); }
        }

        .quest-mobile-view {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .quest-pc-view {
          display: none;
        }

        .quest-icon-bubble {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .quest-info-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .quest-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
        }

        .quest-title-text {
          font-size: 11px;
          font-weight: 700;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quest-count-tag {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          flex-shrink: 0;
        }

        .quest-mini-progress {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          overflow: hidden;
        }

        .quest-mini-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .quest-action-slot {
          flex-shrink: 0;
        }

        .quest-claim-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.5);
          transition: transform 0.1s ease;
          animation: claimBounce 1.5s infinite;
        }

        @keyframes claimBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        .quest-claim-pill-btn:active {
          transform: scale(0.94);
        }

        /* 🖥️ PC / Compact Desktop Layout (width >= 700px): Relocate to Right Side! */
        @media (min-width: 700px) {
          .floating-quest-card {
            position: fixed;
            top: clamp(74px, 10.5vh, 120px);
            right: clamp(16px, 2.8vw, 36px);
            left: auto;
            bottom: auto;
            width: clamp(230px, 19vw, 275px);
            height: auto;
            min-height: 74px;
            border-radius: 14px;
            padding: 8px 12px;
            background: rgba(7, 13, 28, 0.82);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: stretch;
            transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                        min-height 0.25s ease,
                        background-color 0.2s ease,
                        box-shadow 0.2s ease;
          }

          .floating-quest-card.quest-is-collapsed {
            width: auto;
            min-height: 38px;
            padding: 4px 10px;
            border-radius: 9999px;
            background: rgba(7, 13, 28, 0.72);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          }

          .quest-mobile-view {
            display: none;
          }

          .quest-pc-view {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .quest-collapsed-toggle-btn {
            display: flex;
            align-items: center;
            gap: 7px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 2px 4px;
            color: #f1f5f9;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }

          .collapsed-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .collapsed-notif-dot {
            position: absolute;
            top: -2px;
            right: -3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ef4444;
            box-shadow: 0 0 6px #ef4444;
          }

          .collapsed-txt {
            color: #cbd5e1;
            font-size: 11px;
            font-weight: 800;
          }

          .quest-pc-card-inner {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            gap: 6px;
          }

          .quest-pc-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 6px;
          }

          .quest-pc-header-left {
            display: flex;
            align-items: center;
            gap: 7px;
            min-width: 0;
            flex: 1;
          }

          .quest-pc-icon-frame {
            width: 24px;
            height: 24px;
            border-radius: 7px;
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid rgba(245, 158, 11, 0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .quest-pc-title-col {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
          }

          .quest-pc-badge-lbl {
            font-size: 9px;
            font-weight: 900;
            color: #f59e0b;
            letter-spacing: 0.5px;
          }

          .quest-pc-title {
            font-size: 11px;
            font-weight: 800;
            color: #f1f5f9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .quest-pc-header-right {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
          }

          .quest-pc-count {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
          }

          .quest-pc-collapse-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 6px;
            padding: 3px 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s ease;
          }

          .quest-pc-collapse-btn:hover {
            background: rgba(255, 255, 255, 0.16);
          }

          .pc-progress-track {
            height: 4px;
            margin: 2px 0;
          }

          .quest-pc-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
          }

          .quest-pc-rewards {
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .quest-reward-chip {
            font-size: 9px;
            font-weight: 800;
            color: #fef08a;
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 9999px;
            padding: 1px 6px;
          }

          .gem-chip {
            color: #67e8f9;
            background: rgba(56, 189, 248, 0.15);
            border-color: rgba(56, 189, 248, 0.3);
          }

          .quest-pc-claim-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 9999px;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
            animation: claimBounce 1.5s infinite;
          }
        }
      `}</style>
    </div>
  );
};
