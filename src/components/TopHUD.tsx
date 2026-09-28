import React from 'react';
import { CharacterStats, StageState } from '../types/game';
import { Compass } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/monsters';

interface TopHUDProps {
  stats: CharacterStats;
  stage: StageState;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  stats,
  stage,
  onOpenSettings,
  onOpenProfile,
}) => {
  const currentChapter = CHAPTERS_DATA[(stage.chapter - 1) % CHAPTERS_DATA.length];
  const expPercent = Math.min(100, Math.floor((stats.exp / stats.maxExp) * 100));

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    return (num / 1000000000).toFixed(2) + 'B';
  };

  return (
    <header className="game-top-hud">
      {/* 🛡️ Left: Golden Profile Crest */}
      <div className="profile-crest-slot" onClick={onOpenProfile} title="영웅 프로필">
        <div className="crest-avatar-ring">
          <span className="crest-face">🧑‍🌾</span>
          <div className="crest-ribbon-level game-stroke">
            Lv.{stats.level}
          </div>
        </div>

        {/* EXP Arc Mini Progress */}
        <div className="exp-capsule-badge" title={`EXP: ${stats.exp} / ${stats.maxExp}`}>
          <div className="exp-fill-bar" style={{ width: `${expPercent}%` }} />
          <span className="exp-ratio-text">{expPercent}%</span>
        </div>
      </div>

      {/* 🌿 Center: Wooden Stage Plaque */}
      <div className="stage-plaque-slot">
        <div className="stage-wooden-board">
          <div className="stage-title-text game-stroke-gold">
            {stage.isBossStage ? '🔥 BOSS 관문' : `${currentChapter.name} ${stage.stage}`}
          </div>

          {/* 5-Pip Leaf Stage Progress Indicator */}
          {stage.stage < 10 ? (
            <div className="leaf-pip-row">
              {Array.from({ length: stage.killsRequired }).map((_, i) => (
                <div
                  key={i}
                  className={`leaf-pip ${i < stage.killCount ? 'leaf-active' : ''}`}
                />
              ))}
            </div>
          ) : (
            <div className={`boss-timer-capsule ${stage.bossTimeLeft <= 10 ? 'timer-emergency' : ''}`}>
              ⏱️ {stage.bossTimeLeft}초
            </div>
          )}
        </div>
      </div>

      {/* 🪙 Right: 3D Currency Pouches & Compass Settings */}
      <div className="currencies-crest-slot">
        {/* Gold Pouch */}
        <div className="currency-pouch gold-pouch">
          <div className="pouch-icon-3d">🪙</div>
          <span className="pouch-val game-stroke">{formatNumber(stats.gold)}</span>
        </div>

        {/* Gem Pouch */}
        <div className="currency-pouch gem-pouch">
          <div className="pouch-icon-3d">💎</div>
          <span className="pouch-val game-stroke">{formatNumber(stats.gems)}</span>
        </div>

        {/* Compass Settings Button */}
        <button className="compass-settings-btn" onClick={onOpenSettings} title="게임 설정">
          <Compass size={20} color="#fef08a" />
        </button>
      </div>

      <style>{`
        .game-top-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 84px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px 0;
          z-index: 40;
          pointer-events: none;
        }

        .game-top-hud > * {
          pointer-events: auto;
        }

        /* 🛡️ Left: Profile Crest */
        .profile-crest-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .profile-crest-slot:active {
          transform: scale(0.95);
        }

        .crest-avatar-ring {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, #fef8ee 0%, #ecdcc8 100%);
          border: 3px solid #f59e0b;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crest-face {
          font-size: 1.6rem;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
        }

        .crest-ribbon-level {
          position: absolute;
          bottom: -6px;
          background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 1px 7px;
          border-radius: 10px;
          border: 1.5px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .exp-capsule-badge {
          width: 52px;
          height: 6px;
          background: #23160c;
          border: 1px solid #78350f;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .exp-fill-bar {
          height: 100%;
          background: linear-gradient(90deg, #4ade80, #22c55e);
          transition: width 0.3s ease;
        }

        .exp-ratio-text {
          display: none;
        }

        /* 🌿 Center: Wooden Stage Plaque */
        .stage-plaque-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stage-wooden-board {
          background: linear-gradient(180deg, #6c462b 0%, #4a2f1b 60%, #321f12 100%);
          border: 2px solid #8c5b38;
          border-bottom: 3.5px solid #1a0f07;
          border-radius: 14px;
          padding: 4px 14px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.45);
        }

        .stage-title-text {
          font-size: 0.84rem;
          color: #fef08a;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .leaf-pip-row {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .leaf-pip {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22150a;
          border: 1.5px solid #5a3820;
          transition: all 0.2s ease;
        }

        .leaf-active {
          background: radial-gradient(circle, #86efac 0%, #22c55e 100%);
          border-color: #fef08a;
          box-shadow: 0 0 6px #22c55e;
          transform: scale(1.15);
        }

        .boss-timer-capsule {
          font-family: var(--font-game);
          font-size: 0.72rem;
          color: #ffffff;
          background: #dc2626;
          padding: 1px 7px;
          border-radius: 8px;
          border: 1px solid #fca5a5;
        }

        .timer-emergency {
          animation: timerBlink 0.8s infinite;
        }
        @keyframes timerBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* 🪙 Right: 3D Currency Pouches & Compass Settings */
        .currencies-crest-slot {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .currency-pouch {
          background: linear-gradient(180deg, #382416 0%, #22140a 100%);
          border: 1.5px solid #784c2a;
          border-bottom: 3px solid #140b05;
          border-radius: 12px;
          padding: 3px 8px 3px 5px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
        }

        .pouch-icon-3d {
          font-size: 1rem;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
        }

        .pouch-val {
          font-size: 0.8rem;
          color: #ffffff;
          line-height: 1;
        }

        .gold-pouch .pouch-val {
          color: #fef08a;
        }

        .gem-pouch .pouch-val {
          color: #7dd3fc;
        }

        .compass-settings-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(180deg, #8c5b38 0%, #4a2f1b 100%);
          border: 2px solid #f59e0b;
          border-bottom: 3.5px solid #23160c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.08s ease;
        }

        .compass-settings-btn:active {
          transform: translateY(2px);
          border-bottom-width: 1.5px;
        }
      `}</style>
    </header>
  );
};
