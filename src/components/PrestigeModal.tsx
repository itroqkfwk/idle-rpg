import React from 'react';
import { Sparkles, RotateCcw, ShieldCheck, AlertCircle, X, Award, ChevronRight } from 'lucide-react';
import { StageState, CharacterStats } from '../types/game';
import { calculatePrestigeStardustReward } from '../utils/storage';
import { sound } from '../utils/audio';

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrestige: () => void;
  stage: StageState;
  stats: CharacterStats;
  prestigeCount: number;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  onClose,
  onConfirmPrestige,
  stage,
  stats,
  prestigeCount,
}) => {
  if (!isOpen) return null;

  const highestCh = Math.min(3, Math.max(stage.highestChapter || 1, stage.chapter));
  const highestSt = Math.min(10, Math.max(stage.highestStage || 1, stage.stage));
  const expectedStardust = calculatePrestigeStardustReward(highestCh, highestSt, stats.level, prestigeCount);

  const chapterPoints = Math.max(0, highestCh - 1) * 120;
  const stagePoints = Math.max(0, highestSt) * 12;
  const levelPoints = Math.floor(Math.max(1, stats.level) * 1.5);
  const prestigeBonusPercent = Math.round(prestigeCount * 15);

  const handleConfirm = () => {
    sound.playFanfare();
    onConfirmPrestige();
    onClose();
  };

  return (
    <div
      className="prestige-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playTap();
          onClose();
        }
      }}
    >
      <div className="prestige-modal-container">
        {/* Header */}
        <div className="prestige-modal-header">
          <div className="prestige-header-title-row">
            <span className="prestige-header-icon">🌟</span>
            <div>
              <h2 className="prestige-title">시간의 윤회 — 환생 (Prestige)</h2>
              <p className="prestige-subtitle">현재의 시공간을 초월하여 영구적인 별빛의 힘을 부여받습니다.</p>
            </div>
          </div>
          <button className="prestige-close-btn" onClick={() => { sound.playTap(); onClose(); }}>
            <X size={18} />
          </button>
        </div>

        <div className="prestige-modal-content">
          {/* Stardust Reward Callout */}
          <div className="prestige-reward-banner">
            <div className="prestige-reward-top">
              <span className="prestige-reward-label">환생 시 획득 가능한 영구 재화</span>
              <span className="prestige-bonus-tag">현재 환생 {prestigeCount}회 (+{prestigeBonusPercent}%)</span>
            </div>
            <div className="prestige-reward-amount">
              <Sparkles className="sparkle-spin" size={26} color="#fbbf24" />
              <span className="reward-number">+{expectedStardust.toLocaleString()}</span>
              <span className="reward-unit">별가루 (Stardust)</span>
            </div>
            {/* Calculation Breakdown Chips */}
            <div className="prestige-breakdown-row">
              <div className="breakdown-chip" title="챕터 점수">
                <span className="chip-label">최고 챕터 {highestCh}</span>
                <span className="chip-val">+{chapterPoints}</span>
              </div>
              <div className="breakdown-chip" title="스테이지 점수">
                <span className="chip-label">최고 {highestCh}-{highestSt}</span>
                <span className="chip-val">+{stagePoints}</span>
              </div>
              <div className="breakdown-chip" title="영웅 레벨 점수">
                <span className="chip-label">영웅 Lv.{stats.level}</span>
                <span className="chip-val">+{levelPoints}</span>
              </div>
              {prestigeCount > 0 && (
                <div className="breakdown-chip highlight" title="누적 환생 횟수 가산">
                  <span className="chip-label">환생 보너스</span>
                  <span className="chip-val">x{(1 + prestigeCount * 0.15).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reset vs Retain Comparison Cards */}
          <div className="prestige-policy-grid">
            {/* Reset Column */}
            <div className="policy-card reset-card">
              <div className="policy-header reset-header">
                <RotateCcw size={15} color="#f87171" />
                <span>초기화 항목</span>
              </div>
              <ul className="policy-list">
                <li><span className="dot dot-red" />영웅 레벨 및 경험치 (Lv.1 복귀)</li>
                <li><span className="dot dot-red" />일반 골드 (500 골드로 재시작)</li>
                <li><span className="dot dot-red" />골드 스탯 레벨 (공/체/방 1레벨)</li>
                <li><span className="dot dot-red" />진행 스테이지 (1-1 스테이지 복귀)</li>
                <li><span className="dot dot-red" />각성 게이지 (0% 초기화)</li>
              </ul>
            </div>

            {/* Retain Column */}
            <div className="policy-card retain-card">
              <div className="policy-header retain-header">
                <ShieldCheck size={15} color="#34d399" />
                <span>영구 유지 항목</span>
              </div>
              <ul className="policy-list">
                <li><span className="dot dot-green" />별가루 및 6대 영구 강화 효과 (공/체/방/골드/경험치/치명피해)</li>
                <li><span className="dot dot-green" />보유 장비 및 도감 보유 효과 전체</li>
                <li><span className="dot dot-green" />보유 펫 및 펫 육성 레벨</li>
                <li><span className="dot dot-green" />스킬 카드 및 스킬 강화 레벨</li>
                <li><span className="dot dot-green" />다이아몬드 (유료 보석 재화)</li>
                <li><span className="dot dot-green" />전직 자격 영구 보존 (Lv.30 달성 시 자동 복구)</li>
                <li><span className="dot dot-green" />던전 난이도 해금 기록 및 보유 장비 강화석</li>
              </ul>
            </div>
          </div>

          <div className="prestige-notice-box">
            <AlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>
              환생을 진행하면 영웅 레벨과 스테이지가 1로 초기화되지만, 획득한 별가루로 <strong>공격력, 방어력, 체력, 골드, 경험치, 치명타 피해</strong>를 영구 증폭하여 이전보다 훨씬 빠르고 강력하게 성장할 수 있습니다.
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="prestige-modal-footer">
          <button
            className="prestige-cancel-btn"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
          >
            돌아가기
          </button>
          <button
            className="prestige-action-btn"
            onClick={handleConfirm}
          >
            <Sparkles size={16} />
            <span>환생 실행 및 별가루 +{expectedStardust.toLocaleString()} 수령</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .prestige-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(4, 7, 18, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          animation: prestigeFadeIn 0.2s ease-out;
        }

        @keyframes prestigeFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .prestige-modal-container {
          width: 100%;
          max-width: 520px;
          background: linear-gradient(180deg, #131b31 0%, #0c1122 100%);
          border: 1px solid rgba(168, 85, 247, 0.35);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.2);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #f8fafc;
        }

        .prestige-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: rgba(19, 27, 49, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .prestige-header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .prestige-header-icon {
          font-size: 1.6rem;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
        }

        .prestige-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .prestige-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }

        .prestige-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .prestige-close-btn:hover {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.1);
        }

        .prestige-modal-content {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .prestige-reward-banner {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.45) 0%, rgba(30, 27, 75, 0.65) 100%);
          border: 1px solid rgba(192, 132, 252, 0.4);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.15);
        }

        .prestige-reward-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
        }

        .prestige-reward-label {
          color: #e2e8f0;
          font-weight: 600;
        }

        .prestige-bonus-tag {
          color: #fbbf24;
          font-weight: 700;
          background: rgba(245, 158, 11, 0.15);
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .prestige-reward-amount {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .reward-number {
          font-size: 1.85rem;
          font-weight: 900;
          color: #fef08a;
          text-shadow: 0 0 16px rgba(251, 191, 36, 0.5);
          letter-spacing: -0.5px;
        }

        .reward-unit {
          font-size: 0.85rem;
          color: #d8b4fe;
          font-weight: 600;
        }

        .sparkle-spin {
          animation: sparklePulse 2.4s infinite ease-in-out;
        }

        @keyframes sparklePulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.15) rotate(15deg); opacity: 1; }
        }

        .prestige-breakdown-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .breakdown-chip {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
        }

        .breakdown-chip.highlight {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.12);
        }

        .chip-label {
          color: #94a3b8;
        }

        .chip-val {
          color: #f1f5f9;
          font-weight: 700;
        }

        .breakdown-chip.highlight .chip-val {
          color: #fbbf24;
        }

        .prestige-policy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 480px) {
          .prestige-policy-grid {
            grid-template-columns: 1fr;
          }
        }

        .policy-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reset-card {
          border-color: rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.04);
        }

        .retain-card {
          border-color: rgba(16, 185, 129, 0.25);
          background: rgba(16, 185, 129, 0.04);
        }

        .policy-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .reset-header {
          color: #f87171;
        }

        .retain-header {
          color: #34d399;
        }

        .policy-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .policy-list li {
          font-size: 0.73rem;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-red {
          background: #ef4444;
          box-shadow: 0 0 4px #ef4444;
        }

        .dot-green {
          background: #10b981;
          box-shadow: 0 0 4px #10b981;
        }

        .prestige-notice-box {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.74rem;
          color: #e2e8f0;
          line-height: 1.45;
        }

        .prestige-modal-footer {
          display: flex;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(19, 27, 49, 0.9);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .prestige-cancel-btn {
          flex: 1;
          height: 42px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .prestige-cancel-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          color: #f1f5f9;
        }

        .prestige-action-btn {
          flex: 2;
          height: 42px;
          background: linear-gradient(135deg, #7c3aed 0%, #d97706 100%);
          border: 1px solid rgba(251, 191, 36, 0.5);
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 800;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transition: all 0.15s;
        }

        .prestige-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.35);
          filter: brightness(1.1);
        }

        .prestige-action-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
