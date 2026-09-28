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
  activePet,
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
          <span>🛡️ 영웅 성장 수첩</span>
          <span className="hero-level-chip game-stroke">Lv.{stats.level}</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} color="#fef08a" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Combat Power Plaque */}
        <div className="combat-power-banner">
          <div className="power-banner-left">
            <Sparkles size={18} color="#f59e0b" />
            <span className="power-banner-label">종합 전투력</span>
          </div>
          <span className="power-banner-val game-stroke-gold">{combatPower.toLocaleString()}</span>
        </div>

        {/* 4 Core Stat Chips */}
        <div className="core-stats-deck">
          <div className="stat-card-beveled">
            <Swords size={16} color="#ef4444" />
            <div className="stat-texts">
              <span className="stat-name">공격력</span>
              <span className="stat-value">{totalAtk.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-beveled">
            <Heart size={16} color="#22c55e" />
            <div className="stat-texts">
              <span className="stat-name">최대 체력</span>
              <span className="stat-value">{totalHp.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-beveled">
            <Shield size={16} color="#3b82f6" />
            <div className="stat-texts">
              <span className="stat-name">방어력</span>
              <span className="stat-value">{totalDef.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-beveled">
            <Zap size={16} color="#f59e0b" />
            <div className="stat-texts">
              <span className="stat-name">치명 / 공속</span>
              <span className="stat-value">{Math.round(stats.critRate * 100)}% / {stats.atkSpeed.toFixed(1)}/s</span>
            </div>
          </div>
        </div>

        {/* Multiplier Toggle Bar */}
        <div className="upgrade-multiplier-row">
          <span className="multiplier-text">강화 배율:</span>
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
          <div className="parchment-panel upgrade-parchment-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-frame atk-icon-frame">
                <Swords size={20} color="#b91c1c" />
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
              <span className="game-stroke">강화</span>
              <span className="upgrade-cost-text game-stroke">🪙 {atkInfo.cost.toLocaleString()}</span>
            </button>
          </div>

          {/* HP Enhancement */}
          <div className="parchment-panel upgrade-parchment-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-frame hp-icon-frame">
                <Heart size={20} color="#15803d" />
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
              <span className="game-stroke">강화</span>
              <span className="upgrade-cost-text game-stroke">🪙 {hpInfo.cost.toLocaleString()}</span>
            </button>
          </div>

          {/* DEF Enhancement */}
          <div className="parchment-panel upgrade-parchment-row">
            <div className="upgrade-meta-left">
              <div className="upgrade-icon-frame def-icon-frame">
                <Shield size={20} color="#1e40af" />
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
              <span className="game-stroke">강화</span>
              <span className="upgrade-cost-text game-stroke">🪙 {defInfo.cost.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .drawer-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #4a2f1b;
          border: 1.5px solid #8c5b38;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hero-level-chip {
          background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
          color: #ffffff;
          font-size: 0.72rem;
          padding: 1px 8px;
          border-radius: 10px;
          border: 1.5px solid #fff;
        }

        .combat-power-banner {
          background: linear-gradient(180deg, #5c3c26 0%, #3e2617 100%);
          border: 2px solid #f59e0b;
          border-radius: 14px;
          padding: 8px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }

        .power-banner-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .power-banner-label {
          font-family: var(--font-game);
          font-size: 0.85rem;
          color: #fef08a;
        }

        .power-banner-val {
          font-size: 1.25rem;
        }

        .core-stats-deck {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .stat-card-beveled {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 12px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .stat-texts {
          display: flex;
          flex-direction: column;
        }

        .stat-name {
          font-size: 0.65rem;
          color: #a8927e;
          font-weight: 700;
        }

        .stat-value {
          font-family: var(--font-game);
          font-size: 0.88rem;
          color: #fef8ee;
        }

        .upgrade-multiplier-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .multiplier-text {
          font-family: var(--font-game);
          font-size: 0.8rem;
          color: #d4bda8;
        }

        .multiplier-btn-group {
          display: flex;
          gap: 6px;
        }

        .multiplier-pill-btn {
          min-width: 46px;
          height: 28px;
          border-radius: 8px;
          background: #322013;
          border: 1.5px solid #5d3f28;
          color: #d4bda8;
          font-family: var(--font-game);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .multiplier-pill-btn.pill-active {
          background: #f59e0b;
          border-color: #fef08a;
          color: #3a1d00;
          font-weight: 900;
        }

        .stat-upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upgrade-parchment-row {
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

        .upgrade-icon-frame {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          flex-shrink: 0;
        }
        .atk-icon-frame { background: #fee2e2; border-color: #fca5a5; }
        .hp-icon-frame { background: #dcfce7; border-color: #86efac; }
        .def-icon-frame { background: #dbeafe; border-color: #93c5fd; }

        .upgrade-name-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .upgrade-stat-title {
          font-family: var(--font-game);
          font-size: 0.92rem;
          color: #382110;
        }

        .upgrade-stat-level {
          font-size: 0.7rem;
          font-weight: 800;
          color: #15803d;
        }

        .upgrade-stat-gain {
          font-size: 0.68rem;
          color: #785232;
        }

        .upgrade-action-btn {
          min-width: 96px;
          min-height: 42px;
          flex-direction: column;
          gap: 1px;
          padding: 4px 10px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .upgrade-cost-text {
          font-size: 0.68rem;
        }
      `}</style>
    </div>
  );
};
