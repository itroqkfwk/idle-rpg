import React from 'react';
import { CharacterStats, StageState } from '../types/game';
import { Settings } from 'lucide-react';
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

  // Extract clean Korean title without English parenthesis e.g. "새싹의 숲"
  const chapterShortName = currentChapter.name.replace(/\s*\(.*?\)/, '');

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    return (num / 1000000000).toFixed(2) + 'B';
  };

  return (
    <header className="game-top-hud">
      {/* 🛡️ Left: Hero Profile Capsule */}
      <div className="profile-capsule-btn" onClick={onOpenProfile} title="영웅 프로필">
        <div className="profile-avatar-thumb">
          <img
            src="./assets/hero_knight.png"
            alt="Hero Avatar"
            className="avatar-img-crop"
          />
        </div>
        <div className="profile-info-col">
          <div className="profile-row-top">
            <span className="profile-lvl-tag">Lv.{stats.level}</span>
            <span className="profile-name">기사</span>
          </div>
          {/* Slim EXP bar */}
          <div className="profile-exp-track" title={`EXP: ${stats.exp} / ${stats.maxExp}`}>
            <div className="profile-exp-fill" style={{ width: `${expPercent}%` }} />
          </div>
        </div>
      </div>

      {/* 🌲 Center: Stage Progression Badge */}
      <div className="stage-capsule-badge">
        <div className="stage-name-text">
          {stage.isBossStage ? (
            <span className="boss-stage-text">🔥 BOSS</span>
          ) : (
            <span>{chapterShortName} {stage.chapter}-{stage.stage}</span>
          )}
        </div>

        {stage.stage < 10 ? (
          <div className="stage-pips-row">
            {Array.from({ length: stage.killsRequired }).map((_, i) => (
              <div
                key={i}
                className={`stage-pip ${i < stage.killCount ? 'pip-filled' : ''}`}
              />
            ))}
          </div>
        ) : (
          <div className={`stage-boss-timer ${stage.bossTimeLeft <= 10 ? 'timer-hurry' : ''}`}>
            ⏱️ {stage.bossTimeLeft}초
          </div>
        )}
      </div>

      {/* 🪙 Right: Currency Badges & Settings */}
      <div className="currencies-right-cluster">
        {/* Gold Capsule */}
        <div className="currency-pill gold-pill">
          <span className="currency-icon">🪙</span>
          <span className="currency-val">{formatNumber(stats.gold)}</span>
        </div>

        {/* Gem Capsule */}
        <div className="currency-pill gem-pill">
          <span className="currency-icon">💎</span>
          <span className="currency-val">{formatNumber(stats.gems)}</span>
        </div>

        {/* Settings Circular Button */}
        <button className="settings-circle-btn" onClick={onOpenSettings} title="설정">
          <Settings size={14} color="#94a3b8" />
        </button>
      </div>

      <style>{`
        .game-top-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 10px;
          z-index: 40;
          background: linear-gradient(180deg, rgba(8, 12, 22, 0.82) 0%, rgba(8, 12, 22, 0.35) 75%, transparent 100%);
          backdrop-filter: blur(8px);
          user-select: none;
          box-sizing: border-box;
        }

        /* Hero Profile Capsule */
        .profile-capsule-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 2px 7px 2px 2px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          flex-shrink: 0;
        }

        .profile-capsule-btn:active {
          transform: scale(0.96);
        }

        .profile-avatar-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: 1.5px solid #f59e0b;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .avatar-img-crop {
          width: 130%;
          height: 130%;
          object-fit: cover;
          transform: translateY(2px);
        }

        .profile-info-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .profile-row-top {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .profile-lvl-tag {
          font-size: 9px;
          font-weight: 800;
          color: #fef08a;
        }

        .profile-name {
          font-size: 10px;
          font-weight: 700;
          color: #f8fafc;
        }

        .profile-exp-track {
          width: 38px;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          overflow: hidden;
        }

        .profile-exp-fill {
          height: 100%;
          background: #38bdf8;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        /* Center Stage Capsule */
        .stage-capsule-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3px 10px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          flex-shrink: 0;
        }

        .stage-name-text {
          font-size: 10px;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .boss-stage-text {
          color: #ef4444;
          text-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
        }

        .stage-pips-row {
          display: flex;
          gap: 3px;
          margin-top: 2px;
        }

        .stage-pip {
          width: 5px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          transition: background 0.2s ease;
        }

        .pip-filled {
          background: #f59e0b;
          box-shadow: 0 0 4px #f59e0b;
        }

        .stage-boss-timer {
          font-size: 9px;
          font-weight: 800;
          color: #fef08a;
        }

        .timer-hurry {
          color: #ef4444;
          animation: pulseTimer 0.6s infinite alternate;
        }

        @keyframes pulseTimer {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }

        /* Currencies Cluster */
        .currencies-right-cluster {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .currency-pill {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 2px 6px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .currency-icon {
          font-size: 10px;
        }

        .currency-val {
          font-size: 10px;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: 0.2px;
        }

        .gold-pill .currency-val {
          color: #fef08a;
        }

        .gem-pill .currency-val {
          color: #67e8f9;
        }

        .settings-circle-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: transform 0.1s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
        }

        .settings-circle-btn:active {
          transform: scale(0.92);
        }
      `}</style>
    </header>
  );
};
