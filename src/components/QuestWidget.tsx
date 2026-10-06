import React from 'react';
import { Quest } from '../types/game';
import { Scroll, Sparkles } from 'lucide-react';

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
      <div className="quest-content-row">
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

      <style>{`
        .floating-quest-card {
          position: absolute;
          top: 56px;
          left: 14px;
          right: 14px;
          z-index: 30;
          height: 34px;
          background: rgba(15, 23, 42, 0.68);
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

        .quest-content-row {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .quest-reward-preview-pill {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
          font-size: 9px;
          font-weight: 700;
          color: #cbd5e1;
        }

        /* 🖥️ PC Responsive Layout (width >= 768px): Handled by PC Left Side Panel in BattleScene */
        @media (min-width: 768px) {
          .floating-quest-card {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
