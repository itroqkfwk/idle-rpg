import React from 'react';
import { ActiveDungeonRun } from '../types/game';
import { DUNGEONS_DATA, DAILY_DUNGEON_TICKETS } from '../data/dungeons';
import { Trophy, Clock, Skull, Flag, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';

interface DungeonResultModalProps {
  result: ActiveDungeonRun | null;
  ticketsLeft: number;
  canRetry: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export const DungeonResultModal: React.FC<DungeonResultModalProps> = ({
  result,
  ticketsLeft,
  canRetry,
  onRetry,
  onClose,
}) => {
  if (!result) return null;

  const cfg = DUNGEONS_DATA[result.dungeonId];
  const reason = result.endReason || 'victory';

  const getHeaderMeta = () => {
    if (reason === 'victory') {
      return {
        title: '던전 공략 완료!',
        subtitle: 'DUNGEON CLEAR',
        color: '#fbbf24',
        bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.95))',
        icon: <Trophy size={26} color="#fbbf24" />,
      };
    }
    if (reason === 'timeout') {
      return {
        title: '제한시간 종료',
        subtitle: 'TIME OVER',
        color: '#38bdf8',
        bgGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(15, 23, 42, 0.95))',
        icon: <Clock size={26} color="#38bdf8" />,
      };
    }
    if (reason === 'defeat') {
      return {
        title: '전투 패배',
        subtitle: 'DEFEATED',
        color: '#ef4444',
        bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.95))',
        icon: <Skull size={26} color="#ef4444" />,
      };
    }
    return {
      title: '던전 중도 포기',
      subtitle: 'ABANDONED',
      color: '#94a3b8',
      bgGradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(15, 23, 42, 0.95))',
      icon: <Flag size={26} color="#94a3b8" />,
    };
  };

  const meta = getHeaderMeta();

  return (
    <div className="dungeon-result-overlay" data-testid="dungeon-result-modal">
      <div className="dungeon-result-card" style={{ borderColor: `${meta.color}66`, background: meta.bgGradient }}>
        <div className="result-header-block">
          <div className="result-icon-circle" style={{ borderColor: meta.color }}>
            {meta.icon}
          </div>
          <span className="result-sub-tag" style={{ color: meta.color }}>
            {meta.subtitle}
          </span>
          <h3 className="result-main-title">{meta.title}</h3>
          <p className="result-dungeon-name">
            {cfg.name} · <strong>{result.difficulty}단계</strong>
          </p>
        </div>

        {/* New Difficulty Unlock Alert */}
        {result.newDifficultyUnlocked && (
          <div className="result-unlock-banner" data-testid="dungeon-unlock-banner">
            <Sparkles size={15} color="#fde047" />
            <span>
              신규 난이도 해금! <strong>{result.newDifficultyUnlocked}단계</strong>에 도전할 수 있습니다.
            </span>
          </div>
        )}

        {/* Combat & Reward Breakdown */}
        <div className="result-stats-box">
          {result.dungeonId === 'gold_mine' && (
            <>
              <div className="result-stat-row">
                <span>처치한 황금 고블린</span>
                <strong>{result.kills}마리</strong>
              </div>
              <div className="result-stat-row highlight-gold">
                <span>정산 획득 골드</span>
                <strong data-testid="result-gold">🪙 +{result.accumulatedGold.toLocaleString()} G</strong>
              </div>
            </>
          )}

          {result.dungeonId === 'training_forest' && (
            <>
              <div className="result-stat-row">
                <span>돌파한 수련 웨이브</span>
                <strong>
                  {result.kills} / {result.maxWave} 웨이브
                </strong>
              </div>
              <div className="result-stat-row highlight-exp">
                <span>정산 획득 경험치</span>
                <strong data-testid="result-exp">✨ +{result.accumulatedExp.toLocaleString()} EXP</strong>
              </div>
              {(result.levelsGained || 0) > 0 && (
                <div className="result-stat-row highlight-lvl">
                  <span>성장 레벨 상승</span>
                  <strong>🆙 +{result.levelsGained} 레벨업!</strong>
                </div>
              )}
            </>
          )}

          {result.dungeonId === 'ancient_ruins' && (
            <>
              <div className="result-stat-row">
                <span>유적 수호 보스 결전</span>
                <strong>{reason === 'victory' ? '격파 성공' : '격파 실패'}</strong>
              </div>
              <div className="result-stat-row highlight-stone">
                <span>획득 장비 강화석</span>
                <strong data-testid="result-stones">🔷 +{result.accumulatedStones.toLocaleString()}개</strong>
              </div>
              {result.accumulatedGold > 0 && (
                <div className="result-stat-row highlight-gold">
                  <span>추가 획득 골드</span>
                  <strong>🪙 +{result.accumulatedGold.toLocaleString()} G</strong>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="result-actions-row">
          <button
            type="button"
            data-testid="dungeon-retry-btn"
            className={`result-btn retry-btn ${!canRetry || ticketsLeft <= 0 ? 'btn-disabled' : ''}`}
            disabled={!canRetry || ticketsLeft <= 0}
            onClick={onRetry}
          >
            <RotateCcw size={15} />
            <span>
              다시 도전 (🎫 {ticketsLeft}/{DAILY_DUNGEON_TICKETS})
            </span>
          </button>

          <button
            type="button"
            data-testid="dungeon-close-btn"
            className="result-btn close-btn"
            onClick={onClose}
          >
            <ArrowLeft size={15} />
            <span>돌아가기</span>
          </button>
        </div>
      </div>

      <style>{`
        .dungeon-result-overlay {
          position: fixed;
          inset: 0;
          z-index: 120;
          background: rgba(2, 6, 23, 0.78);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          user-select: none;
        }

        .dungeon-result-card {
          width: min(100%, 380px);
          border: 1.5px solid rgba(251, 191, 36, 0.45);
          border-radius: 20px;
          padding: 20px 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          gap: 14px;
          color: #f8fafc;
          animation: resultPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes resultPopIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .result-header-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
        }

        .result-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.85);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
        }

        .result-sub-tag {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .result-main-title {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #ffffff;
        }

        .result-dungeon-name {
          margin: 0;
          font-size: 12px;
          color: #cbd5e1;
        }

        .result-unlock-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(234, 179, 8, 0.2);
          border: 1px solid rgba(250, 204, 21, 0.5);
          border-radius: 12px;
          padding: 8px 10px;
          font-size: 11.5px;
          color: #fef08a;
        }

        .result-stats-box {
          background: rgba(2, 6, 23, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #cbd5e1;
        }

        .result-stat-row strong {
          font-size: 13px;
          font-weight: 900;
          color: #ffffff;
        }

        .highlight-gold strong {
          color: #fbbf24;
        }

        .highlight-exp strong {
          color: #34d399;
        }

        .highlight-lvl strong {
          color: #38bdf8;
        }

        .highlight-stone strong {
          color: #c084fc;
        }

        .result-actions-row {
          display: flex;
          gap: 8px;
        }

        .result-btn {
          flex: 1;
          padding: 10px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .retry-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #ffffff;
          border-color: #fbbf24;
        }

        .retry-btn.btn-disabled {
          background: rgba(30, 41, 59, 0.6);
          color: #64748b;
          border-color: rgba(255, 255, 255, 0.08);
          cursor: not-allowed;
        }

        .close-btn {
          background: rgba(30, 41, 59, 0.9);
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};
