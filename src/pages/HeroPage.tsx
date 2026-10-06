import React, { useState } from 'react';
import { CharacterStats, Equipment, Pet } from '../types/game';
import { Sparkles, Shield, Zap, Heart, Swords, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroPageProps {
  stats: CharacterStats;
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  combatPower: number;
  equipped: Partial<Record<string, Equipment>>;
  activePet: Pet | null;
  onUpgradeStat: (stat: 'atk' | 'hp' | 'def', count: number) => void;
  onClose?: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  stats,
  totalAtk,
  totalHp,
  totalDef,
  combatPower,
  onUpgradeStat,
  onClose,
}) => {
  const [multiplier, setMultiplier] = useState<1 | 10 | 'max'>(1);

  const getAtkCost = (level: number) => Math.floor(25 * Math.pow(1.12, level - 1));
  const getHpCost = (level: number) => Math.floor(20 * Math.pow(1.10, level - 1));
  const getDefCost = (level: number) => Math.floor(30 * Math.pow(1.13, level - 1));

  const calculateUpgradeInfo = (stat: 'atk' | 'hp' | 'def') => {
    let currentLvl = stat === 'atk' ? stats.atkLevel : stat === 'hp' ? stats.hpLevel : stats.defLevel;
    const costFn = stat === 'atk' ? getAtkCost : stat === 'hp' ? getHpCost : getDefCost;

    let targetCount = 1;
    let totalCost = 0;

    if (multiplier === 1) {
      targetCount = 1;
      totalCost = costFn(currentLvl);
    } else if (multiplier === 10) {
      targetCount = 10;
      for (let i = 0; i < 10; i++) {
        totalCost += costFn(currentLvl + i);
      }
    } else {
      let tempGold = stats.gold;
      let count = 0;
      while (tempGold >= costFn(currentLvl + count) && count < 100) {
        tempGold -= costFn(currentLvl + count);
        totalCost += costFn(currentLvl + count);
        count++;
      }
      targetCount = Math.max(1, count);
    }

    return {
      count: targetCount,
      cost: totalCost,
      canAfford: stats.gold >= totalCost && totalCost > 0,
      nextLvl: currentLvl + targetCount,
    };
  };

  const atkInfo = calculateUpgradeInfo('atk');
  const hpInfo = calculateUpgradeInfo('hp');
  const defInfo = calculateUpgradeInfo('def');

  const handleUpgrade = (stat: 'atk' | 'hp' | 'def', count: number) => {
    sound.playUpgrade();
    onUpgradeStat(stat, count);
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Swords size={18} color="#f59e0b" />
          </div>
          <span>영웅 성장 & 스탯</span>
          <span className="hero-level-chip">Lv.{stats.level}</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Hero Showcase & Combat Power Banner */}
        <div className="combat-power-banner">
          <div className="hero-mini-avatar-box">
            <img src="/assets/hero_knight.png" alt="Hero" className="hero-mini-avatar-img" />
          </div>
          <div className="power-banner-center">
            <span className="power-banner-label">종합 전투력</span>
            <span className="power-banner-val">{combatPower.toLocaleString()}</span>
          </div>
          <div className="power-banner-badge">
            <Sparkles size={16} color="#f59e0b" />
            <span>강자</span>
          </div>
        </div>

        {/* 4 Core Stat Chips */}
        <div className="core-stats-deck">
          <div className="stat-card-glass">
            <div className="stat-icon-wrapper atk-tint">
              <Swords size={15} color="#ef4444" />
            </div>
            <div className="stat-texts">
              <span className="stat-name">공격력</span>
              <span className="stat-value">{totalAtk.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-glass">
            <div className="stat-icon-wrapper hp-tint">
              <Heart size={15} color="#10b981" />
            </div>
            <div className="stat-texts">
              <span className="stat-name">최대 체력</span>
              <span className="stat-value">{totalHp.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-glass">
            <div className="stat-icon-wrapper def-tint">
              <Shield size={15} color="#38bdf8" />
            </div>
            <div className="stat-texts">
              <span className="stat-name">방어력</span>
              <span className="stat-value">{totalDef.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-glass">
            <div className="stat-icon-wrapper crit-tint">
              <Zap size={15} color="#f59e0b" />
            </div>
            <div className="stat-texts">
              <span className="stat-name">치명타 / 공속</span>
              <span className="stat-value">
                {Math.round(stats.critRate * 100)}% / {stats.atkSpeed.toFixed(1)}/s
              </span>
            </div>
          </div>
        </div>

        {/* Multiplier Toggle Bar */}
        <div className="upgrade-multiplier-row">
          <span className="multiplier-text">강화 배율</span>
          <div className="multiplier-btn-group">
            <button
              className={`multiplier-pill-btn ${multiplier === 1 ? 'pill-active' : ''}`}
              onClick={() => setMultiplier(1)}
            >
              x1
            </button>
            <button
              className={`multiplier-pill-btn ${multiplier === 10 ? 'pill-active' : ''}`}
              onClick={() => setMultiplier(10)}
            >
              x10
            </button>
            <button
              className={`multiplier-pill-btn ${multiplier === 'max' ? 'pill-active' : ''}`}
              onClick={() => setMultiplier('max')}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Stat Upgrade Cards */}
        <div className="stat-upgrade-list">
          {/* ATK Enhancement */}
          <div className="parchment-panel upgrade-card-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-slot atk-glow">
                <Swords size={20} color="#f87171" />
              </div>
              <div className="upgrade-name-col">
                <span className="upgrade-stat-title">공격력 강화</span>
                <span className="upgrade-stat-level">Lv.{stats.atkLevel} → {atkInfo.nextLvl}</span>
                <span className="upgrade-stat-gain">기본 ATK +{atkInfo.count * 4}</span>
              </div>
            </div>
            <button
              className="btn-game btn-game-gold upgrade-action-btn"
              disabled={!atkInfo.canAfford}
              onClick={() => handleUpgrade('atk', atkInfo.count)}
            >
              <span>강화</span>
              <span className="upgrade-cost-text">🪙 {atkInfo.cost.toLocaleString()}</span>
            </button>
          </div>

          {/* HP Enhancement */}
          <div className="parchment-panel upgrade-card-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-slot hp-glow">
                <Heart size={20} color="#34d399" />
              </div>
              <div className="upgrade-name-col">
                <span className="upgrade-stat-title">체력 강화</span>
                <span className="upgrade-stat-level">Lv.{stats.hpLevel} → {hpInfo.nextLvl}</span>
                <span className="upgrade-stat-gain">기본 HP +{hpInfo.count * 35}</span>
              </div>
            </div>
            <button
              className="btn-game btn-game-green upgrade-action-btn"
              disabled={!hpInfo.canAfford}
              onClick={() => handleUpgrade('hp', hpInfo.count)}
            >
              <span>강화</span>
              <span className="upgrade-cost-text">🪙 {hpInfo.cost.toLocaleString()}</span>
            </button>
          </div>

          {/* DEF Enhancement */}
          <div className="parchment-panel upgrade-card-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-slot def-glow">
                <Shield size={20} color="#60a5fa" />
              </div>
              <div className="upgrade-name-col">
                <span className="upgrade-stat-title">방어력 강화</span>
                <span className="upgrade-stat-level">Lv.{stats.defLevel} → {defInfo.nextLvl}</span>
                <span className="upgrade-stat-gain">기본 DEF +{defInfo.count * 2}</span>
              </div>
            </div>
            <button
              className="btn-game btn-game-wood upgrade-action-btn"
              disabled={!defInfo.canAfford}
              onClick={() => handleUpgrade('def', defInfo.count)}
            >
              <span>강화</span>
              <span className="upgrade-cost-text">🪙 {defInfo.cost.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .drawer-title-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .drawer-close-btn:active {
          background: rgba(255, 255, 255, 0.2);
        }

        .hero-level-chip {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .combat-power-banner {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 16px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .hero-mini-avatar-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 1.5px solid #f59e0b;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .hero-mini-avatar-img {
          width: 120%;
          height: 120%;
          object-fit: cover;
          transform: translateY(2px);
        }

        .power-banner-center {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .power-banner-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }

        .power-banner-val {
          font-size: 1.35rem;
          font-weight: 900;
          color: #fef08a;
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
          letter-spacing: 0.5px;
        }

        .power-banner-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 800;
          color: #fef08a;
        }

        .core-stats-deck {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .stat-card-glass {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-icon-wrapper {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .atk-tint { background: rgba(239, 68, 68, 0.15); }
        .hp-tint { background: rgba(16, 185, 129, 0.15); }
        .def-tint { background: rgba(56, 189, 248, 0.15); }
        .crit-tint { background: rgba(245, 158, 11, 0.15); }

        .stat-texts {
          display: flex;
          flex-direction: column;
        }

        .stat-name {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
        }

        .stat-value {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .upgrade-multiplier-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 4px;
        }

        .multiplier-text {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
        }

        .multiplier-btn-group {
          display: flex;
          gap: 6px;
        }

        .multiplier-pill-btn {
          min-width: 44px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .multiplier-pill-btn.pill-active {
          background: #f59e0b;
          border-color: #f59e0b;
          color: #ffffff;
        }

        .stat-upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upgrade-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
        }

        .upgrade-meta-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .upgrade-icon-slot {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .atk-glow { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); }
        .hp-glow { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
        .def-glow { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); }

        .upgrade-name-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .upgrade-stat-title {
          font-size: 13px;
          font-weight: 800;
          color: #f8fafc;
        }

        .upgrade-stat-level {
          font-size: 11px;
          font-weight: 700;
          color: #10b981;
        }

        .upgrade-stat-gain {
          font-size: 10px;
          color: #94a3b8;
        }

        .upgrade-action-btn {
          min-width: 88px;
          min-height: 40px;
          flex-direction: column;
          gap: 1px;
          padding: 4px 10px;
          font-size: 12px;
          flex-shrink: 0;
        }

        .upgrade-cost-text {
          font-size: 10px;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};
