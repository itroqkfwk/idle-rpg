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
    <div className={`quest-parchment-scroll ${isReady ? 'scroll-claim-ready' : ''}`}>
      {/* Scroll Wooden End Left */}
      <div className="scroll-roller scroll-roller-left" />

      {/* Main Parchment Canvas */}
      <div className="parchment-canvas">
        <div className="quest-meta-col">
          <div className="quest-badge-row">
            <span className="quest-emblem-icon">
              <Scroll size={14} color="#78350f" />
            </span>
            <span className="quest-text-heading">{quest.title}</span>
          </div>

          {/* Wooden Texture Progress Track */}
          <div className="quest-wooden-track">
            <div className="quest-leaf-fill" style={{ width: `${percent}%` }} />
            <span className="quest-step-label game-stroke">
              {quest.currentCount} / {quest.targetCount}
            </span>
          </div>
        </div>

        {/* Wax Seal Action Button or Reward Preview */}
        <div className="quest-action-slot">
          {isReady ? (
            <button className="wax-seal-btn" onClick={() => onClaim(quest.id)}>
              <div className="wax-seal-core">
                <Sparkles size={16} color="#fff" />
                <span className="wax-seal-text">수령!</span>
              </div>
            </button>
          ) : (
            <div className="quest-reward-preview game-stroke">
              <span>🪙 +{quest.rewardGold}</span>
              <span>💎 +{quest.rewardGems}</span>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Wooden End Right */}
      <div className="scroll-roller scroll-roller-right" />

      <style>{`
        .quest-parchment-scroll {
          position: relative;
          margin: 0 12px 6px;
          display: flex;
          align-items: center;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45));
          z-index: 35;
        }

        .scroll-roller {
          width: 12px;
          height: 52px;
          background: linear-gradient(180deg, #8c5b38 0%, #4a2f1b 50%, #2a180c 100%);
          border: 1.5px solid #23160c;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
          flex-shrink: 0;
          z-index: 2;
        }

        .parchment-canvas {
          flex: 1;
          height: 46px;
          background: linear-gradient(180deg, #fef8ee 0%, #f3e6cf 50%, #e6d3b4 100%);
          border-top: 2px solid #caa882;
          border-bottom: 2.5px solid #9c7b55;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .scroll-claim-ready .parchment-canvas {
          background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
          border-color: #f59e0b;
        }

        .quest-meta-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }

        .quest-badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
        }

        .quest-emblem-icon {
          display: flex;
          align-items: center;
        }

        .quest-text-heading {
          font-family: var(--font-game);
          font-size: 0.82rem;
          color: #451a03;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quest-wooden-track {
          position: relative;
          width: 100%;
          height: 10px;
          background: #3a2212;
          border-radius: 6px;
          border: 1px solid #784c28;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quest-leaf-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .quest-step-label {
          position: relative;
          font-size: 0.58rem;
          color: #ffffff;
          line-height: 1;
        }

        .quest-action-slot {
          flex-shrink: 0;
        }

        /* 🔴 3D Wax Seal Button */
        .wax-seal-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f43f5e 0%, #e11d48 50%, #881337 100%);
          border: 2px solid #ffe4e6;
          border-bottom: 4px solid #4c0519;
          box-shadow: 0 4px 10px rgba(225, 29, 72, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.08s ease;
          animation: waxPulse 1.2s infinite;
        }

        @keyframes waxPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); box-shadow: 0 0 16px rgba(244, 63, 94, 0.85); }
        }

        .wax-seal-btn:active {
          transform: translateY(2px) scale(0.95);
          border-bottom-width: 2px;
        }

        .wax-seal-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .wax-seal-text {
          font-family: var(--font-game);
          font-size: 0.55rem;
          color: #fff;
          font-weight: 900;
          line-height: 1;
        }

        .quest-reward-preview {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
          font-size: 0.65rem;
          color: #fef08a;
          line-height: 1.1;
        }
      `}</style>
    </div>
  );
};
