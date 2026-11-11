import React from 'react';
import { CharacterStats, StageState, CharacterClassId, PromotionId, ActiveDungeonRun } from '../types/game';
import { Settings } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/monsters';
import { DUNGEONS_DATA } from '../data/dungeons';

interface TopHUDProps {
  stats: CharacterStats;
  maxHp?: number;
  stage: StageState;
  classId?: CharacterClassId;
  promotion?: PromotionId;
  prestigeCount?: number;
  stardust?: number;
  hasPrestigeUnlocked?: boolean;
  enhancementStones?: number;
  activeDungeonRun?: ActiveDungeonRun | null;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  stats,
  maxHp,
  stage,
  classId = 'warrior',
  promotion = 'none',
  prestigeCount = 0,
  stardust = 0,
  hasPrestigeUnlocked = false,
  enhancementStones = 0,
  activeDungeonRun = null,
  onOpenSettings,
  onOpenProfile,
}) => {
  const safeChapterIdx = Math.min(CHAPTERS_DATA.length - 1, Math.max(0, stage.chapter - 1));
  const currentChapter = CHAPTERS_DATA[safeChapterIdx];
  const expPercent = Math.min(100, Math.floor((stats.exp / Math.max(1, stats.maxExp)) * 100));
  const currentHp = stats.currentHp ?? stats.baseHp;
  const effectiveMaxHp = maxHp && maxHp > 0 ? maxHp : Math.max(1, stats.baseHp + (stats.hpLevel - 1) * 35);
  const hpPercent = Math.min(100, Math.max(0, Math.round((currentHp / effectiveMaxHp) * 100)));

  const chapterShortName = currentChapter.name.replace(/\s*\(.*?\)/, '');

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    return (num / 1000000000).toFixed(2) + 'B';
  };

  const isMage = classId === 'mage';
  const isPromoted = promotion !== 'none' && stats.level >= 30;
  const isPendingPromotion = promotion !== 'none' && stats.level < 30;
  const classNameText = isPromoted
    ? promotion === 'sword_master'
      ? '소드 마스터'
      : '아크메이지'
    : isPendingPromotion
    ? `${isMage ? '마법사' : '전사'} (Lv.30 복구)`
    : isMage
    ? '마법사'
    : '전사';

  const avatarSrc = isMage ? './assets/hero_mage.png' : './assets/hero_knight.png';

  return (
    <header className="game-top-hud">
      {/* 🛡️ Left Zone: Hero Profile Capsule */}
      <div
        className={`profile-capsule-btn ${isPromoted ? 'promoted-profile-glow' : isPendingPromotion ? 'pending-profile-glow' : ''}`}
        onClick={onOpenProfile}
        title={isPendingPromotion ? '전직 자격 보존 중 (Lv.30 달성 시 자동 복구)' : '영웅 프로필'}
      >
        <div className={`profile-avatar-thumb ${isPromoted ? 'promoted-avatar-ring' : isPendingPromotion ? 'pending-avatar-ring' : ''}`}>
          <img
            src={avatarSrc}
            alt="Hero Avatar"
            className="avatar-img-crop"
          />
          {isPromoted && <div className="promoted-crown-pip">👑</div>}
          {isPendingPromotion && (
            <div className="promoted-crown-pip" style={{ filter: 'grayscale(0.6) opacity(0.8)' }} title="Lv.30 복구 대기">
              ⏳
            </div>
          )}
        </div>
        <div className="profile-info-col">
          <div className="profile-row-top">
            <span className="profile-lvl-tag">Lv.{stats.level}</span>
            {prestigeCount > 0 && (
              <span className="profile-prestige-tag" title={`환생 ${prestigeCount}회`}>
                ★{prestigeCount}
              </span>
            )}
            <span className={`profile-name ${isPromoted ? 'promoted-name-gold' : isPendingPromotion ? 'pending-name-txt' : ''}`}>
              {classNameText}
            </span>
          </div>
          {/* Readable HP & EXP Dual Micro-Bars */}
          <div className="profile-bars-stack">
            <div className="profile-bar-line" title={`HP: ${currentHp.toLocaleString()} / ${effectiveMaxHp.toLocaleString()} (${hpPercent}%)`}>
              <div className="profile-hp-track">
                <div className="profile-hp-fill" style={{ width: `${hpPercent}%` }} />
              </div>
              <span className="profile-bar-pct hp-pct-txt">{hpPercent}%</span>
            </div>
            <div className="profile-bar-line" title={`EXP: ${stats.exp.toLocaleString()} / ${stats.maxExp.toLocaleString()} (${expPercent}%)`}>
              <div className="profile-exp-track">
                <div className="profile-exp-fill" style={{ width: `${expPercent}%` }} />
              </div>
              <span className="profile-bar-pct exp-pct-txt">{expPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌲 Center Zone: Stage or Active Dungeon Progression Badge */}
      <div className="stage-capsule-badge">
        {activeDungeonRun ? (
          <>
            <div className="stage-name-text" style={{ color: DUNGEONS_DATA[activeDungeonRun.dungeonId].accentColor }}>
              ⚔️ {DUNGEONS_DATA[activeDungeonRun.dungeonId].name} · {activeDungeonRun.difficulty}단계
            </div>
            <div className={`stage-boss-timer ${activeDungeonRun.timeLeft <= 10 ? 'timer-hurry' : ''}`}>
              ⏱️ {activeDungeonRun.timeLeft}초
              {activeDungeonRun.dungeonId === 'training_forest'
                ? ` · W${activeDungeonRun.currentWave}/${activeDungeonRun.maxWave}`
                : activeDungeonRun.dungeonId === 'gold_mine'
                ? ` · ${activeDungeonRun.kills}처치`
                : ' · 보스 결전'}
            </div>
          </>
        ) : (
          <>
            <div className="stage-name-text">
              {stage.isBossStage && stage.inBossFight ? (
                <span className="boss-stage-text">🔥 Ch.{stage.chapter}-10 BOSS</span>
              ) : stage.stage === 10 ? (
                <span className="boss-ready-text">⚔️ Ch.{stage.chapter}-10 보스 대기</span>
              ) : (
                <span>Ch.{stage.chapter}-{stage.stage} {chapterShortName}</span>
              )}
            </div>

            {stage.stage < 10 ? (
              <div className="stage-pips-row" title={`스테이지 처치 진행도: ${stage.killCount} / ${stage.killsRequired}`}>
                {Array.from({ length: stage.killsRequired }).map((_, i) => (
                  <div
                    key={i}
                    className={`stage-pip ${i < stage.killCount ? 'pip-filled' : ''}`}
                  />
                ))}
                <span className="stage-kill-count-txt">{stage.killCount}/{stage.killsRequired}</span>
              </div>
            ) : stage.inBossFight ? (
              <div className={`stage-boss-timer ${stage.bossTimeLeft <= 10 ? 'timer-hurry' : ''}`}>
                ⏱️ 남은 시간 {stage.bossTimeLeft}초
              </div>
            ) : (
              <div className="stage-boss-ready-sub">
                보스 소환 가능
              </div>
            )}
          </>
        )}
      </div>

      {/* 🪙 Right Zone: Currency Badges & Settings */}
      <div className="currencies-right-cluster">
        {/* Gold Capsule */}
        <div className="currency-pill gold-pill" title={`보유 골드: ${stats.gold.toLocaleString()}`}>
          <span className="currency-icon">🪙</span>
          <span className="currency-val">{formatNumber(stats.gold)}</span>
        </div>

        {/* Gem Capsule */}
        <div className="currency-pill gem-pill" title={`보유 보석: ${stats.gems.toLocaleString()}`}>
          <span className="currency-icon">💎</span>
          <span className="currency-val">{formatNumber(stats.gems)}</span>
        </div>

        {/* Enhancement Stone Capsule */}
        <div className="currency-pill stone-pill" title={`보유 장비 강화석: ${enhancementStones.toLocaleString()}개 (고대 유적 보상)`}>
          <span className="currency-icon">🔷</span>
          <span className="currency-val">{formatNumber(enhancementStones)}</span>
        </div>

        {/* Stardust Capsule */}
        {(prestigeCount > 0 || hasPrestigeUnlocked || stardust > 0) && (
          <div className="currency-pill stardust-pill" title={`보유 별가루: ${stardust.toLocaleString()}개 (환생 영구 재화)`}>
            <span className="currency-icon">✨</span>
            <span className="currency-val">{formatNumber(stardust)}</span>
          </div>
        )}

        {/* Settings Circular Button */}
        <button className="settings-circle-btn" onClick={onOpenSettings} title="설정" aria-label="설정 열기">
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
          background: linear-gradient(180deg, rgba(8, 12, 22, 0.85) 0%, rgba(8, 12, 22, 0.4) 75%, transparent 100%);
          backdrop-filter: blur(8px);
          user-select: none;
          box-sizing: border-box;
        }

        /* Hero Profile Capsule */
        .profile-capsule-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px 2px 2px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.1s ease, border-color 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          flex-shrink: 0;
        }

        .promoted-profile-glow {
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.25), 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .profile-capsule-btn:active {
          transform: scale(0.96);
        }

        .profile-avatar-thumb {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1.5px solid #f59e0b;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .promoted-avatar-ring {
          border-color: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.7);
        }

        .promoted-crown-pip {
          position: absolute;
          top: -2px;
          right: -2px;
          font-size: 8px;
          line-height: 1;
        }

        .avatar-img-crop {
          width: 120%;
          height: 120%;
          object-fit: cover;
          transform: translateY(1px);
        }

        .profile-info-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .profile-row-top {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .profile-lvl-tag {
          font-size: 9px;
          font-weight: 800;
          color: #fef08a;
        }

        .profile-prestige-tag {
          font-size: 8px;
          font-weight: 800;
          color: #fde047;
          background: rgba(168, 85, 247, 0.35);
          border: 1px solid rgba(251, 191, 36, 0.6);
          padding: 1px 4px;
          border-radius: 4px;
          line-height: 1;
        }

        .profile-name {
          font-size: 10px;
          font-weight: 800;
          color: #f8fafc;
        }

        .promoted-name-gold {
          color: #fbbf24;
          text-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
        }

        .profile-exp-track,
        .profile-hp-track {
          width: 42px;
          height: 3.5px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          overflow: hidden;
        }

        .profile-hp-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 9999px;
          transition: width 0.25s ease;
        }

        .profile-exp-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .profile-bars-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5px;
          margin-top: 1px;
        }

        .profile-bar-line {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .profile-bar-pct {
          font-size: 7.5px;
          font-weight: 800;
          line-height: 1;
          font-family: monospace;
        }

        .hp-pct-txt {
          color: #6ee7b7;
        }

        .exp-pct-txt {
          color: #7dd3fc;
        }

        /* Center Stage Capsule */
        .stage-capsule-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3px 12px;
          background: rgba(15, 23, 42, 0.85);
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
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        }

        .boss-ready-text {
          color: #fbbf24;
          text-shadow: 0 0 6px rgba(251, 191, 36, 0.45);
        }

        .stage-boss-ready-sub {
          font-size: 8.5px;
          font-weight: 800;
          color: #fde047;
          line-height: 1.1;
        }

        .stage-pips-row {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 2px;
        }

        .stage-kill-count-txt {
          font-size: 8px;
          font-weight: 800;
          color: #fde047;
          margin-left: 2px;
          line-height: 1;
          font-family: monospace;
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
          gap: 5px;
          flex-shrink: 0;
        }

        .currency-pill {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 2px 7px;
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

        .stardust-pill {
          background: rgba(88, 28, 135, 0.45);
          border-color: rgba(192, 132, 252, 0.45);
        }

        .stardust-pill .currency-val {
          color: #d8b4fe;
          text-shadow: 0 0 6px rgba(168, 85, 247, 0.5);
        }

        .stone-pill {
          background: rgba(30, 58, 138, 0.5);
          border-color: rgba(96, 165, 250, 0.5);
        }

        .stone-pill .currency-val {
          color: #93c5fd;
          text-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
        }

        @media (max-width: 480px) {
          .game-top-hud {
            padding: 4px 5px;
            gap: 3px;
          }
          .profile-capsule-btn {
            padding: 2px 5px 2px 2px;
            gap: 4px;
          }
          .profile-avatar-thumb {
            width: 24px;
            height: 24px;
          }
          .profile-name {
            display: none;
          }
          .profile-exp-track,
          .profile-hp-track {
            width: 30px;
          }
          .profile-bar-pct {
            font-size: 7px;
          }
          .currencies-right-cluster {
            gap: 2px;
          }
          .currency-pill {
            padding: 2px 4px;
            gap: 2px;
          }
          .currency-val {
            font-size: 8.5px;
          }
          .currency-icon {
            font-size: 8.5px;
          }
          .stage-capsule-badge {
            padding: 2px 6px;
          }
          .stage-name-text {
            font-size: 8.5px;
          }
          .settings-circle-btn {
            width: 22px;
            height: 22px;
          }
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

        /* 🖥️ PC Responsive 3-Zone Layout (width >= 768px) */
        @media (min-width: 768px) {
          .game-top-hud {
            position: fixed;
            top: clamp(14px, 2vh, 22px);
            left: clamp(24px, 3.5vw, 44px);
            right: clamp(24px, 3.5vw, 44px);
            max-width: 1480px;
            margin: 0 auto;
            height: 60px;
            padding: 0 16px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: linear-gradient(180deg, rgba(11, 17, 32, 0.94) 0%, rgba(11, 17, 32, 0.84) 100%);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.2) inset;
          }

          .profile-capsule-btn {
            padding: 3px 14px 3px 3px;
            gap: 10px;
          }

          .profile-avatar-thumb {
            width: 38px;
            height: 38px;
          }

          .profile-name {
            font-size: 13px;
          }

          .profile-lvl-tag {
            font-size: 11px;
            padding: 1px 6px;
          }

          .profile-exp-track,
          .profile-hp-track {
            width: 75px;
            height: 4px;
          }
          .profile-bar-pct {
            font-size: 9px;
          }

          .stage-capsule-badge {
            padding: 5px 20px;
          }

          .stage-name-text {
            font-size: 13px;
          }

          .currencies-right-cluster {
            gap: 10px;
          }

          .currency-pill {
            padding: 6px 14px;
            font-size: 12px;
          }

          .currency-val {
            font-size: 12px;
          }

          .currency-icon {
            font-size: 12px;
          }

          .settings-circle-btn {
            width: 34px;
            height: 34px;
          }
        }
      `}</style>
    </header>
  );
};
