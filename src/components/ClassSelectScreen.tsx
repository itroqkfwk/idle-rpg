import React, { useState } from 'react';
import { CharacterClassId } from '../types/game';
import { Swords, Wand2, Shield, Sparkles, Heart, Zap, Flame, Crown, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ClassSelectScreenProps {
  onConfirmClass: (selectedClass: CharacterClassId) => void;
}

export const ClassSelectScreen: React.FC<ClassSelectScreenProps> = ({ onConfirmClass }) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClassId>('warrior');

  const handleSelect = (cls: CharacterClassId) => {
    if (selectedClass !== cls) {
      sound.playTap();
      setSelectedClass(cls);
    }
  };

  const handleConfirm = () => {
    sound.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onConfirmClass(selectedClass);
  };

  return (
    <div className="class-select-screen-root">
      {/* 🌌 Atmospheric Backdrop with Fantasy Particles */}
      <div className="class-select-backdrop">
        <div className="class-select-fog" />
        <div className="class-select-runes" />
      </div>

      {/* 👑 Screen Header */}
      <div className="class-select-header">
        <div className="class-select-crest">
          <Crown size={22} color="#f59e0b" />
          <span>DESTINY AWAKENING</span>
          <Crown size={22} color="#f59e0b" />
        </div>
        <h1 className="class-select-title">운명의 직업을 선택하십시오</h1>
        <p className="class-select-subtitle">
          선택한 직업에 따라 고유의 기본 공격 모션, 스킬 풀, 전직 및 각성기가 결정됩니다.
        </p>
      </div>

      {/* ⚔️ Interactive Character Showcase Arenas */}
      <div className="class-showcase-container">
        {/* 1. Warrior Card */}
        <div
          className={`class-card ${selectedClass === 'warrior' ? 'class-card-active active-warrior' : ''}`}
          onClick={() => handleSelect('warrior')}
        >
          {selectedClass === 'warrior' && <div className="active-card-glow-halo" />}

          <div className="class-card-top-badge">
            <Swords size={16} />
            <span>근접 딜러 / 탱커</span>
          </div>

          <div className="class-character-stage">
            <div className="character-pedestal" />
            <img
              src="./assets/hero_knight.png"
              alt="전사 (Warrior)"
              className="class-showcase-sprite warrior-sprite"
            />
            {selectedClass === 'warrior' && <div className="warrior-aura-flame" />}
          </div>

          <div className="class-card-info">
            <div className="class-card-name-row">
              <h2 className="class-name">전사</h2>
              <span className="class-name-en">Warrior</span>
            </div>

            <p className="class-desc">
              단단한 강철 갑주와 대검을 다루며, 최전선에서 적의 공격을 버텨내고 묵직한 참격으로 전장을 장악합니다.
            </p>

            {/* Stat Profile Bars */}
            <div className="class-stat-matrix">
              <div className="stat-row">
                <span className="stat-label">
                  <Heart size={12} color="#ef4444" /> 생명력 (HP)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-red" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="stat-row">
                <span className="stat-label">
                  <Shield size={12} color="#3b82f6" /> 방어력 (DEF)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-blue" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="stat-row">
                <span className="stat-label">
                  <Zap size={12} color="#f59e0b" /> 공격력 (ATK)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-gold" style={{ width: '74%' }} />
                </div>
              </div>
            </div>

            {/* Signature Skills Preview */}
            <div className="class-skills-preview">
              <span className="skills-preview-title">대표 스킬</span>
              <div className="skill-pills-row">
                <div className="skill-preview-pill">
                  <span>⚔️ 파워 슬래시</span>
                </div>
                <div className="skill-preview-pill">
                  <span>🗡️ 더블 슬래시</span>
                </div>
                <div className="skill-preview-pill">
                  <span>🌀 검기 방출</span>
                </div>
              </div>
            </div>

            {/* Ultimate Promotion Target */}
            <div className="promotion-preview-tag">
              <Crown size={13} color="#f59e0b" />
              <span>전직 목표: <strong>소드 마스터</strong> (각성기: 천공의 검)</span>
            </div>
          </div>
        </div>

        {/* 2. Mage Card */}
        <div
          className={`class-card ${selectedClass === 'mage' ? 'class-card-active active-mage' : ''}`}
          onClick={() => handleSelect('mage')}
        >
          {selectedClass === 'mage' && <div className="active-card-glow-halo" />}

          <div className="class-card-top-badge badge-mage">
            <Wand2 size={16} />
            <span>원거리 폭딜 / 광역 마법</span>
          </div>

          <div className="class-character-stage">
            <div className="character-pedestal pedestal-mage" />
            <img
              src="./assets/hero_mage.png"
              alt="마법사 (Mage)"
              className="class-showcase-sprite mage-sprite"
            />
            {selectedClass === 'mage' && <div className="mage-aura-arcane" />}
          </div>

          <div className="class-card-info">
            <div className="class-card-name-row">
              <h2 className="class-name">마법사</h2>
              <span className="class-name-en">Mage</span>
            </div>

            <p className="class-desc">
              신비로운 비전 마력과 원소 마법을 구사하며, 원거리에서 강력한 마법을 연속 영창하여 다수의 적을 단숨에 섬멸합니다.
            </p>

            {/* Stat Profile Bars */}
            <div className="class-stat-matrix">
              <div className="stat-row">
                <span className="stat-label">
                  <Sparkles size={12} color="#a855f7" /> 마법력 (MATK)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-purple" style={{ width: '95%' }} />
                </div>
              </div>
              <div className="stat-row">
                <span className="stat-label">
                  <Flame size={12} color="#f97316" /> 치명타 (CRIT)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-orange" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="stat-row">
                <span className="stat-label">
                  <Shield size={12} color="#3b82f6" /> 방어력 (DEF)
                </span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill fill-blue" style={{ width: '55%' }} />
                </div>
              </div>
            </div>

            {/* Signature Skills Preview */}
            <div className="class-skills-preview">
              <span className="skills-preview-title">대표 스킬</span>
              <div className="skill-pills-row">
                <div className="skill-preview-pill">
                  <span>🔮 매직 미사일</span>
                </div>
                <div className="skill-preview-pill">
                  <span>🔥 파이어볼</span>
                </div>
                <div className="skill-preview-pill">
                  <span>⚡ 체인 라이트닝</span>
                </div>
              </div>
            </div>

            {/* Ultimate Promotion Target */}
            <div className="promotion-preview-tag">
              <Crown size={13} color="#a855f7" />
              <span>전직 목표: <strong>아크메이지</strong> (각성기: 아스트랄 카타클리즘)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Bottom Confirm Action Bar */}
      <div className="class-select-footer">
        <button
          className={`class-confirm-btn ${selectedClass === 'warrior' ? 'btn-warrior' : 'btn-mage'}`}
          onClick={handleConfirm}
        >
          <div className="btn-inner">
            {selectedClass === 'warrior' ? <Swords size={20} /> : <Wand2 size={20} />}
            <span>
              {selectedClass === 'warrior' ? '[전사]로 모험 시작' : '[마법사]로 모험 시작'}
            </span>
            <Check size={20} />
          </div>
        </button>
      </div>

      {/* 🎨 Dedicated Styles */}
      <style>{`
        .class-select-screen-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background: #090d16;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(14px, 2vh, 24px) 20px clamp(14px, 2vh, 26px);
          gap: clamp(8px, 1.4vh, 16px);
          overflow-y: auto;
          user-select: none;
        }

        .class-select-backdrop {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(circle at 50% 30%, #172554 0%, #090d16 80%);
        }

        .class-select-fog {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
        }

        .class-select-header {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 600px;
          margin-bottom: 16px;
        }

        .class-select-crest {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 14px;
          border-radius: 9999px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .class-select-title {
          font-size: 26px;
          font-weight: 900;
          color: #f8fafc;
          margin: 0 0 6px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        .class-select-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
        }

        .class-showcase-container {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 24px;
          width: 100%;
          max-width: 960px;
          margin: 12px 0;
        }

        .class-card {
          flex: 1;
          max-width: 440px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 2px solid rgba(51, 65, 85, 0.6);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        }

        .class-card:hover {
          transform: translateY(-4px);
          border-color: rgba(148, 163, 184, 0.6);
        }

        .class-card-active.active-warrior {
          border-color: #f59e0b;
          box-shadow: 0 0 35px rgba(245, 158, 11, 0.35), 0 16px 40px rgba(0, 0, 0, 0.6);
          background: rgba(30, 27, 46, 0.9);
        }

        .class-card-active.active-mage {
          border-color: #38bdf8;
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.35), 0 16px 40px rgba(0, 0, 0, 0.6);
          background: rgba(15, 30, 56, 0.9);
        }

        .class-card-top-badge {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #f87171;
          font-size: 11px;
          font-weight: 700;
        }

        .badge-mage {
          background: rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.35);
          color: #c084fc;
        }

        .class-character-stage {
          position: relative;
          width: 100%;
          height: clamp(155px, 20vh, 210px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 6px 0;
        }

        .character-pedestal {
          position: absolute;
          bottom: 12px;
          width: 160px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(245, 158, 11, 0.35) 0%, transparent 70%);
          filter: blur(4px);
        }

        .pedestal-mage {
          background: radial-gradient(ellipse, rgba(56, 189, 248, 0.35) 0%, transparent 70%);
        }

        .class-showcase-sprite {
          position: relative;
          z-index: 2;
          height: clamp(145px, 19vh, 195px);
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.7));
          transition: transform 0.3s ease;
        }

        .class-card:hover .class-showcase-sprite {
          transform: scale(1.05);
        }

        .class-card-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .class-card-name-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .class-name {
          font-size: 22px;
          font-weight: 900;
          color: #f8fafc;
          margin: 0;
        }

        .class-name-en {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .class-desc {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }

        .class-stat-matrix {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(0, 0, 0, 0.25);
          padding: 8px 12px;
          border-radius: 10px;
        }

        .stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 11px;
          color: #cbd5e1;
        }

        .stat-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 90px;
          font-weight: 600;
        }

        .stat-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.5s ease;
        }

        .fill-red { background: linear-gradient(90deg, #ef4444, #f87171); }
        .fill-blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .fill-gold { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .fill-purple { background: linear-gradient(90deg, #9333ea, #c084fc); }
        .fill-orange { background: linear-gradient(90deg, #f97316, #fb923c); }

        .class-skills-preview {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .skills-preview-title {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
        }

        .skill-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-preview-pill {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 11px;
          color: #e2e8f0;
          font-weight: 600;
        }

        .promotion-preview-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #cbd5e1;
          padding: 6px 10px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px dashed rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          margin-top: 4px;
        }

        .class-select-footer {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          margin-top: 14px;
        }

        .class-confirm-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 14px;
          border: none;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .btn-warrior {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .btn-warrior:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.55);
        }

        .btn-mage {
          background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
          color: #0f172a;
          box-shadow: 0 8px 25px rgba(56, 189, 248, 0.4);
        }

        .btn-mage:hover {
          background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(56, 189, 248, 0.55);
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .class-showcase-container {
            flex-direction: column;
            align-items: center;
            gap: 14px;
          }

          .class-card {
            width: 100%;
            padding: 16px;
          }

          .class-character-stage {
            height: 160px;
          }

          .class-showcase-sprite {
            height: 150px;
          }

          .class-select-title {
            font-size: 21px;
          }
        }
      `}</style>
    </div>
  );
};
