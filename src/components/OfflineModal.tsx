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
          <Moon size={36} color="#f59e0b" />
        </div>

        <h2 className="offline-title">WELCOME BACK!</h2>
        <p className="offline-subtext">
          자리를 비운 동안에도 작은 모험가가<br />
          열심히 몬스터를 사냥하고 있었습니다!
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

        <button className="cozy-btn cozy-btn-gold offline-claim-btn" onClick={onClaim}>
          <Sparkles size={18} />
          <span>보상 모두 받기</span>
        </button>
      </div>

      <style>{`
        .offline-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .offline-header-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
        }
        .offline-title {
          font-family: var(--font-accent);
          font-size: 1.8rem;
          color: var(--cozy-brown);
          letter-spacing: 1px;
        }
        .offline-subtext {
          font-size: 0.85rem;
          color: var(--cozy-brown-light);
          line-height: 1.45;
          margin: 6px 0 16px;
        }
        .offline-stats-card {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid var(--border-soft);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .offline-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-divider {
          height: 1px;
          background: var(--border-soft);
          margin: 2px 0;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--cozy-brown-light);
        }
        .stat-val {
          font-size: 0.95rem;
          font-weight: 900;
        }
        .time-val {
          color: var(--sage-green-dark);
        }
        .gold-val {
          color: #b45309;
        }
        .exp-val {
          color: #0284c7;
        }
        .offline-claim-btn {
          width: 100%;
          min-height: 48px;
          font-size: 1.05rem;
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
        }
      `}</style>
    </div>
  );
};
