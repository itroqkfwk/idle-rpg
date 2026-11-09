import React, { useState } from 'react';
import { DungeonId, DungeonSaveState } from '../types/game';
import { DUNGEONS_DATA, DAILY_DUNGEON_TICKETS, getDungeonDifficultyConfig } from '../data/dungeons';
import { Compass, Clock, Lock, Swords, ShieldAlert, CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react';

interface DungeonPageProps {
  dungeons: DungeonSaveState;
  heroLevel: number;
  heroAtk: number;
  enhancementStones: number;
  goldBonusMultiplier?: number;
  expBonusMultiplier?: number;
  onEnterDungeon: (dungeonId: DungeonId, difficulty: number) => void;
  onGoToEquipment?: () => void;
  onClose?: () => void;
}

export const DungeonPage: React.FC<DungeonPageProps> = ({
  dungeons,
  heroLevel,
  heroAtk,
  enhancementStones,
  goldBonusMultiplier = 1,
  expBonusMultiplier = 1,
  onEnterDungeon,
  onGoToEquipment,
  onClose,
}) => {
  const [selectedDiffs, setSelectedDiffs] = useState<Record<DungeonId, number>>(() => ({
    gold_mine: Math.min(
      dungeons.records.gold_mine?.unlockedDifficulty || 1,
      heroLevel >= 40 ? 5 : heroLevel >= 30 ? 4 : heroLevel >= 20 ? 3 : heroLevel >= 10 ? 2 : 1
    ),
    training_forest: Math.min(
      dungeons.records.training_forest?.unlockedDifficulty || 1,
      heroLevel >= 40 ? 5 : heroLevel >= 30 ? 4 : heroLevel >= 20 ? 3 : heroLevel >= 10 ? 2 : 1
    ),
    ancient_ruins: Math.min(
      dungeons.records.ancient_ruins?.unlockedDifficulty || 1,
      heroLevel >= 40 ? 5 : heroLevel >= 30 ? 4 : heroLevel >= 20 ? 3 : heroLevel >= 10 ? 2 : 1
    ),
  }));

  const dungeonList: DungeonId[] = ['gold_mine', 'training_forest', 'ancient_ruins'];

  const handleSelectDiff = (dungeonId: DungeonId, diff: number) => {
    setSelectedDiffs((prev) => ({ ...prev, [dungeonId]: diff }));
  };

  return (
    <div className="half-sheet-drawer">
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Compass size={18} color="#fbbf24" />
          </div>
          <span>특수 성장 던전 (Special Dungeons)</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        <div className="dungeon-page-container">
          {/* Header Banner */}
          <div className="dungeon-header-card">
            <div className="dungeon-header-top">
              <p className="dungeon-sub-desc" style={{ margin: 0, flex: 1 }}>
                일일 입장권을 사용하여 골드, 대량 경험치, 장비 강화석을 집중 수급하세요.
              </p>

              <div className="dungeon-stone-wallet">
                <div className="stone-wallet-info">
                  <span className="stone-wallet-label">보유 장비 강화석</span>
                  <span className="stone-wallet-val">🔷 {enhancementStones.toLocaleString()}개</span>
                </div>
                {onGoToEquipment && (
                  <button className="stone-use-link-btn" onClick={onGoToEquipment}>
                    <span>장비 강화</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="dungeon-policy-bar">
              <span>📅 일일 입장: 던전별 {DAILY_DUNGEON_TICKETS}회 (자정 초기화 · {dungeons.lastResetDate})</span>
              <span>⚠️ 입장 즉시 1회 차감 (포기/패배 시 미반환)</span>
            </div>
          </div>

      {/* 3 Dungeon Cards */}
      <div className="dungeon-cards-grid">
        {dungeonList.map((dungeonId) => {
          const cfg = DUNGEONS_DATA[dungeonId];
          const progress = dungeons.records[dungeonId] || {
            unlockedDifficulty: 1,
            highestClearedDifficulty: 0,
            ticketsLeft: DAILY_DUNGEON_TICKETS,
            totalClears: 0,
          };
          const selectedDiff = selectedDiffs[dungeonId] || 1;
          const diffCfg = getDungeonDifficultyConfig(dungeonId, selectedDiff);

          const isUnlocked = selectedDiff <= progress.unlockedDifficulty;
          const meetsLevel = heroLevel >= diffCfg.requiredLevel;
          const hasTickets = progress.ticketsLeft > 0;
          const canEnter = isUnlocked && meetsLevel && hasTickets;

          // Calculate expected reward preview
          let rewardPreviewText = '';
          if (dungeonId === 'gold_mine') {
            const perKillGold = Math.floor(diffCfg.baseGoldReward * goldBonusMultiplier);
            rewardPreviewText = `고블린 1마리당 약 +${perKillGold.toLocaleString()} G (처치 비례 누적)`;
          } else if (dungeonId === 'training_forest') {
            // 5 waves sum (0.7 + 0.85 + 1.0 + 1.2 + 1.65 = 5.4x) + 1.6x clear bonus = ~7.0x baseExpReward
            const estTotalExp = Math.floor(diffCfg.baseExpReward * 7.0 * expBonusMultiplier);
            rewardPreviewText = `5웨이브 완주 시 약 +${estTotalExp.toLocaleString()} EXP`;
          } else {
            rewardPreviewText = `보스 격파 시 장비 강화석 +${diffCfg.stoneReward}개 확정 (+${diffCfg.baseGoldReward.toLocaleString()} G)`;
          }

          return (
            <div
              key={dungeonId}
              className="dungeon-item-card"
              style={{ borderColor: `${cfg.accentColor}44` }}
              data-testid={`dungeon-card-${dungeonId}`}
            >
              {/* Card Top Header */}
              <div className="dungeon-card-head">
                <div>
                  <div className="dungeon-badge-row">
                    <span className="dungeon-type-tag" style={{ background: cfg.accentColor }}>
                      {cfg.badgeText}
                    </span>
                    <span className="dungeon-time-tag">
                      <Clock size={11} /> 제한시간 {cfg.timeLimit}초
                    </span>
                    {progress.highestClearedDifficulty > 0 && (
                      <span className="dungeon-cleared-tag">
                        <CheckCircle2 size={11} /> 최고 {progress.highestClearedDifficulty}단계 클리어
                      </span>
                    )}
                  </div>
                  <h3 className="dungeon-card-title">{cfg.name}</h3>
                  <p className="dungeon-card-desc">{cfg.description}</p>
                </div>

                <div className="dungeon-ticket-box" data-testid={`tickets-${dungeonId}`}>
                  <span className="ticket-box-label">남은 횟수</span>
                  <span className={`ticket-box-val ${progress.ticketsLeft === 0 ? 'ticket-empty' : ''}`}>
                    🎫 {progress.ticketsLeft} / {DAILY_DUNGEON_TICKETS}
                  </span>
                </div>
              </div>

              {/* Difficulty 1~5 Selector */}
              <div className="dungeon-diff-selector">
                {[1, 2, 3, 4, 5].map((diff) => {
                  const dCfg = getDungeonDifficultyConfig(dungeonId, diff);
                  const diffUnlocked = diff <= progress.unlockedDifficulty;
                  const diffCleared = diff <= progress.highestClearedDifficulty;
                  const diffLevelOk = heroLevel >= dCfg.requiredLevel;
                  const isSelected = selectedDiff === diff;

                  return (
                    <button
                      key={diff}
                      type="button"
                      data-testid={`diff-btn-${dungeonId}-${diff}`}
                      className={`dungeon-diff-btn ${isSelected ? 'diff-selected' : ''} ${
                        !diffUnlocked ? 'diff-locked' : !diffLevelOk ? 'diff-level-gated' : ''
                      }`}
                      style={
                        isSelected
                          ? {
                              borderColor: cfg.accentColor,
                              background: `${cfg.accentColor}28`,
                            }
                          : undefined
                      }
                      onClick={() => handleSelectDiff(dungeonId, diff)}
                    >
                      <div className="diff-btn-top">
                        <span>{diff}단계</span>
                        {!diffUnlocked ? (
                          <Lock size={10} color="#64748b" />
                        ) : diffCleared ? (
                          <Sparkles size={10} color="#fbbf24" />
                        ) : null}
                      </div>
                      <span className={`diff-req-lvl ${!diffLevelOk ? 'lvl-short' : ''}`}>
                        Lv.{dCfg.requiredLevel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Difficulty Spec Box */}
              <div className="dungeon-spec-box">
                <div className="spec-row">
                  <span className="spec-label">선택 난이도</span>
                  <span className="spec-val" style={{ color: cfg.accentColor }}>
                    {diffCfg.name}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">입장 조건 / 권장 공격력</span>
                  <span className="spec-val">
                    <span className={meetsLevel ? 'cond-ok' : 'cond-fail'}>영웅 Lv.{diffCfg.requiredLevel} 이상</span>
                    {' · '}
                    <span className={heroAtk >= diffCfg.recommendedAtk ? 'cond-ok' : 'cond-warn'}>
                      권장 ATK {diffCfg.recommendedAtk.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">핵심 보상</span>
                  <span className="spec-val reward-highlight">{rewardPreviewText}</span>
                </div>
              </div>

              {/* Action Enter Button */}
              <button
                type="button"
                data-testid={`enter-dungeon-${dungeonId}`}
                className={`dungeon-enter-btn ${canEnter ? 'btn-ready' : 'btn-disabled'}`}
                style={
                  canEnter
                    ? {
                        background: `linear-gradient(135deg, ${cfg.accentColor}, #1e293b)`,
                        borderColor: cfg.accentColor,
                      }
                    : undefined
                }
                disabled={!canEnter}
                onClick={() => canEnter && onEnterDungeon(dungeonId, selectedDiff)}
              >
                {!isUnlocked ? (
                  <>
                    <Lock size={15} />
                    <span>이전 단계({selectedDiff - 1}단계) 클리어 시 해금</span>
                  </>
                ) : !meetsLevel ? (
                  <>
                    <ShieldAlert size={15} />
                    <span>영웅 Lv.{diffCfg.requiredLevel} 달성 시 입장 가능 (해금 완료)</span>
                  </>
                ) : !hasTickets ? (
                  <>
                    <Clock size={15} />
                    <span>오늘의 입장권을 모두 소진했습니다 (0/{DAILY_DUNGEON_TICKETS})</span>
                  </>
                ) : (
                  <>
                    <Swords size={16} />
                    <span>
                      {cfg.name} {selectedDiff}단계 입장 (🎫 -1)
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .dungeon-page-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 2px 24px 2px;
          color: #f8fafc;
          user-select: none;
        }

        .drawer-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .dungeon-header-card {
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.88));
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
        }

        .dungeon-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .dungeon-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dungeon-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dungeon-main-title {
          margin: 0;
          font-size: 15px;
          font-weight: 900;
          color: #fef08a;
        }

        .dungeon-sub-desc {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #94a3b8;
        }

        .dungeon-stone-wallet {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(30, 58, 138, 0.35);
          border: 1px solid rgba(96, 165, 250, 0.4);
          border-radius: 12px;
          padding: 6px 10px;
        }

        .stone-wallet-info {
          display: flex;
          flex-direction: column;
        }

        .stone-wallet-label {
          font-size: 9.5px;
          color: #93c5fd;
          font-weight: 700;
        }

        .stone-wallet-val {
          font-size: 13px;
          font-weight: 900;
          color: #ffffff;
        }

        .stone-use-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 9px;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.35);
          border: 1px solid rgba(147, 197, 253, 0.5);
          color: #eff6ff;
          font-size: 10.5px;
          font-weight: 800;
          cursor: pointer;
        }

        .dungeon-policy-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 6px;
          font-size: 10px;
          color: #cbd5e1;
          background: rgba(2, 6, 23, 0.55);
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .dungeon-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dungeon-item-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .dungeon-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .dungeon-badge-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .dungeon-type-tag {
          font-size: 9px;
          font-weight: 900;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 6px;
          letter-spacing: 0.4px;
        }

        .dungeon-time-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 7px;
          border-radius: 6px;
        }

        .dungeon-cleared-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 800;
          color: #fde047;
          background: rgba(234, 179, 8, 0.16);
          border: 1px solid rgba(250, 204, 21, 0.35);
          padding: 1px 7px;
          border-radius: 6px;
        }

        .dungeon-card-title {
          margin: 0;
          font-size: 15px;
          font-weight: 900;
          color: #f8fafc;
        }

        .dungeon-card-desc {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.35;
        }

        .dungeon-ticket-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(2, 6, 23, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 5px 9px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .ticket-box-label {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 700;
        }

        .ticket-box-val {
          font-size: 12px;
          font-weight: 900;
          color: #fef08a;
        }

        .ticket-box-val.ticket-empty {
          color: #ef4444;
        }

        .dungeon-diff-selector {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }

        .dungeon-diff-btn {
          background: rgba(30, 41, 59, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 6px 4px;
          color: #e2e8f0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          transition: all 0.15s ease;
        }

        .dungeon-diff-btn.diff-selected {
          color: #ffffff;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .dungeon-diff-btn.diff-locked {
          opacity: 0.5;
        }

        .diff-btn-top {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 900;
        }

        .diff-req-lvl {
          font-size: 9.5px;
          font-weight: 700;
          color: #94a3b8;
        }

        .diff-req-lvl.lvl-short {
          color: #f87171;
        }

        .dungeon-spec-box {
          background: rgba(2, 6, 23, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }

        .spec-label {
          color: #94a3b8;
          font-weight: 700;
        }

        .spec-val {
          color: #f1f5f9;
          font-weight: 800;
          text-align: right;
        }

        .cond-ok {
          color: #34d399;
        }

        .cond-warn {
          color: #fbbf24;
        }

        .cond-fail {
          color: #f87171;
        }

        .reward-highlight {
          color: #fef08a;
        }

        .dungeon-enter-btn {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 12.5px;
          font-weight: 900;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          transition: transform 0.1s ease, filter 0.15s ease;
        }

        .dungeon-enter-btn.btn-ready:active {
          transform: scale(0.98);
        }

        .dungeon-enter-btn.btn-disabled {
          background: rgba(30, 41, 59, 0.6);
          color: #64748b;
          border-color: rgba(255, 255, 255, 0.08);
          cursor: not-allowed;
        }
      `}</style>
        </div>
      </div>
    </div>
  );
};
