import React from 'react';
import { Sparkles, Moon } from 'lucide-react';

interface OfflineModalProps {
  seconds: number;
  gold: number;
  exp: number;
  onClaim: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({
  seconds,
  gold,
  exp,
  onClaim,
}) => {
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const parts = [];
    if (h > 0) parts.push(`${h}시간`);
    if (m > 0 || h > 0) parts.push(`${m}분`);
    parts.push(`${s}초`);
    return parts.join(' ');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content offline-modal-content">
        <div className="offline-header-icon">
          <Moon size={32} color="#f59e0b" />
        </div>

        <h2 className="offline-title">방치 보상 획득!</h2>
        <p className="offline-subtext">
          자리를 비운 동안에도 기사단원이<br />
          열심히 몬스터를 사냥했습니다!
        </p>

        <div className="offline-stats-card">
          <div className="offline-stat-row">
            <span className="stat-label">방치 시간</span>
            <span className="stat-val time-val">{formatTime(seconds)}</span>
          </div>
          <div className="stat-divider" />
          <div className="offline-stat-row">
            <span className="stat-label">획득 골드</span>
            <span className="stat-val gold-val">+{gold.toLocaleString()} 🪙</span>
          </div>
          <div className="offline-stat-row">
            <span className="stat-label">획득 경험치</span>
            <span className="stat-val exp-val">+{exp.toLocaleString()} EXP</span>
          </div>
        </div>

        <button className="btn-game btn-game-gold offline-claim-btn" onClick={onClaim}>
          <Sparkles size={16} />
          <span>보상 모두 받기</span>
        </button>
      </div>

      <style>{`
        .offline-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .offline-header-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.25);
        }
        .offline-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #fef08a;
          letter-spacing: 0.5px;
        }
        .offline-subtext {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.45;
        }
        .offline-stats-card {
          width: 100%;
          background: rgba(10, 15, 28, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .offline-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .stat-label {
          color: #94a3b8;
          font-weight: 600;
        }
        .stat-val {
          font-weight: 800;
        }
        .time-val { color: #f8fafc; }
        .gold-val { color: #fef08a; }
        .exp-val { color: #38bdf8; }
        .stat-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }
        .offline-claim-btn {
          width: 100%;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
