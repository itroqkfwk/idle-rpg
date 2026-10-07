import React from 'react';
import { Quest } from '../types/game';
import { Scroll, Sparkles, CheckCircle2 } from 'lucide-react';

interface QuestWidgetProps {
  quest: Quest | null;
  onClaim: (questId: string) => void;
}

export const QuestWidget: React.FC<QuestWidgetProps> = ({ quest, onClaim }) => {
  if (!quest) return null;

  const percent = Math.min(100, Math.floor((quest.currentCount / quest.targetCount) * 100));
  const isReady = quest.currentCount >= quest.targetCount && !quest.claimed;

  return (
    <div className={`floating-quest-card ${isReady ? 'quest-ready-glow' : ''}`}>
      {/* Mobile Single Row View */}
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

      {/* PC Compact Card View (Rendered via CSS on >= 768px) */}
      <div className="quest-pc-view">
        <div className="quest-pc-top">
          <div className="quest-pc-header-left">
            <Scroll size={13} color="#f59e0b" />
            <span className="quest-pc-title">{quest.title}</span>
          </div>
          <span className="quest-pc-count">
            {quest.currentCount} / {quest.targetCount}
          </span>
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

      <style>{`
        .floating-quest-card {
          position: absolute;
          top: 56px;
          left: 14px;
          right: 14px;
          z-index: 30;
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

        /* 🖥️ PC Responsive Layout (width >= 768px): Compact HUD in bottom-left above Bottom Nav */
        @media (min-width: 768px) {
          .floating-quest-card {
            position: fixed;
            top: auto;
            bottom: 84px;
            left: clamp(24px, 3.5vw, 44px);
            right: auto;
            width: clamp(230px, 18vw, 280px);
            height: clamp(62px, 7.8vh, 76px);
            border-radius: 14px;
            padding: 8px 12px;
            background: rgba(11, 18, 33, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: stretch;
          }

          .quest-mobile-view {
            display: none;
          }

          .quest-pc-view {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
          }

          .quest-pc-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
          }

          .quest-pc-header-left {
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 0;
          }

          .quest-pc-title {
            font-size: 11px;
            font-weight: 800;
            color: #f1f5f9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .quest-pc-count {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            flex-shrink: 0;
          }

          .pc-progress-track {
            height: 4px;
            margin: 4px 0;
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
