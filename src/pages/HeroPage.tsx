import React, { useState } from 'react';
import { CharacterStats, Equipment, Pet, Skill } from '../types/game';
import { Sparkles, Shield, Zap, Heart, Swords, X, Wand2, Plus, Check } from 'lucide-react';
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
  skills?: Skill[];
  equippedSkillIds?: (string | null)[];
  onEquipSkill?: (slotIndex: number, skillId: string | null) => void;
  onUpgradeSkill?: (skillId: string) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  stats,
  totalAtk,
  totalHp,
  totalDef,
  combatPower,
  onUpgradeStat,
  onClose,
  skills,
  equippedSkillIds,
  onEquipSkill,
  onUpgradeSkill,
}) => {
  const [subTab, setSubTab] = useState<'stats' | 'skills'>('stats');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
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

  const [bumpStat, setBumpStat] = useState<{ stat: 'atk' | 'hp' | 'def'; amount: number; id: number } | null>(null);

  const handleUpgrade = (stat: 'atk' | 'hp' | 'def', count: number) => {
    sound.playUpgrade();
    setBumpStat({ stat, amount: count, id: Date.now() });
    onUpgradeStat(stat, count);
    setTimeout(() => {
      setBumpStat((prev) => (prev?.stat === stat ? null : prev));
    }, 900);
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
        {/* Sub-tab Switcher: Stats vs Skills */}
        <div className="hero-subtabs-nav">
          <button
            className={`hero-subtab-btn ${subTab === 'stats' ? 'subtab-active' : ''}`}
            onClick={() => {
              sound.playTap();
              setSubTab('stats');
            }}
          >
            <Swords size={13} />
            <span>스탯 강화</span>
          </button>
          <button
            className={`hero-subtab-btn ${subTab === 'skills' ? 'subtab-active' : ''}`}
            onClick={() => {
              sound.playTap();
              setSubTab('skills');
            }}
          >
            <Wand2 size={13} />
            <span>스킬 편성 & 성장</span>
            {skills && skills.some((s) => s.pieces >= s.piecesRequired) && (
              <span className="subtab-badge-dot" />
            )}
          </button>
        </div>

        {subTab === 'stats' ? (
          <>
            {/* Hero Showcase & Combat Power Banner */}
            <div className="combat-power-banner">
              <div className="hero-mini-avatar-box">
                <img src="./assets/hero_knight.png" alt="Hero" className="hero-mini-avatar-img" />
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
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-stat-title">공격력 강화</span>
                      {bumpStat?.stat === 'atk' && (
                        <span className="stat-bump-badge">▲ +{bumpStat.amount}</span>
                      )}
                    </div>
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
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-stat-title">체력 강화</span>
                      {bumpStat?.stat === 'hp' && (
                        <span className="stat-bump-badge">▲ +{bumpStat.amount}</span>
                      )}
                    </div>
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
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-stat-title">방어력 강화</span>
                      {bumpStat?.stat === 'def' && (
                        <span className="stat-bump-badge">▲ +{bumpStat.amount}</span>
                      )}
                    </div>
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
          </>
        ) : (
          <div className="hero-skills-view">
            {/* 1. 4 Equipped Slots Setup */}
            <div className="skills-loadout-panel parchment-panel">
              <div className="loadout-header">
                <span className="loadout-title">자동 스킬 슬롯 편성 (1~4번 자동 순차 발동)</span>
                <span className="loadout-subtitle">슬롯을 선택한 뒤 보유 스킬의 [장착]을 누르세요</span>
              </div>
              <div className="equipped-slots-grid">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const skillId = equippedSkillIds ? equippedSkillIds[slotIdx] : null;
                  const skill = skillId && skills ? skills.find((s) => s.id === skillId) : null;
                  const isSelected = selectedSlotIndex === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      className={`equipped-slot-card ${isSelected ? 'slot-selected' : ''}`}
                      onClick={() => setSelectedSlotIndex(slotIdx)}
                    >
                      <div className="slot-idx-tag">슬롯 {slotIdx + 1}</div>
                      {skill ? (
                        <div className="slot-assigned-info">
                          <span className="slot-assigned-icon">{skill.icon}</span>
                          <span className="slot-assigned-name">{skill.name}</span>
                          <span className="slot-assigned-cd">{skill.cooldown}초</span>
                          {onEquipSkill && (
                            <button
                              className="slot-unequip-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playTap();
                                onEquipSkill(slotIdx, null);
                              }}
                              title="슬롯 해제"
                            >
                              해제
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="slot-empty-prompt">
                          <Plus size={16} color="#64748b" />
                          <span>미장착</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Owned Skills List */}
            <div className="skills-collection-header">
              <span className="collection-title">보유 스킬 ({skills ? skills.length : 0})</span>
              <span className="collection-hint">조각을 모아 스킬 레벨업 & 위력 강화</span>
            </div>

            <div className="skills-collection-list">
              {skills && skills.map((skill) => {
                const isEquippedInSlot = equippedSkillIds?.indexOf(skill.id) ?? -1;
                const isEquipped = isEquippedInSlot !== -1;
                const canLevelUp = skill.pieces >= skill.piecesRequired;

                return (
                  <div key={skill.id} className="parchment-panel skill-card-row">
                    <div className="skill-card-main">
                      <div className="skill-icon-frame">
                        <span className="skill-frame-glyph">{skill.icon}</span>
                        <span className="skill-lvl-badge">Lv.{skill.level}</span>
                      </div>
                      <div className="skill-info-col">
                        <div className="skill-name-row">
                          <span className="skill-name-txt">{skill.name}</span>
                          <span className="skill-cooldown-badge">쿨타임 {skill.cooldown}초</span>
                        </div>
                        <div className="skill-desc-txt">{skill.description}</div>
                        {/* Piece progress bar */}
                        <div className="skill-piece-progress-box">
                          <div className="piece-text-row">
                            <span className="piece-label">스킬 조각</span>
                            <span className="piece-val">
                              {skill.pieces} / {skill.piecesRequired}
                            </span>
                          </div>
                          <div className="piece-track">
                            <div
                              className="piece-fill"
                              style={{
                                width: `${Math.min(100, Math.round((skill.pieces / skill.piecesRequired) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="skill-actions-row">
                      {/* Level Up Button */}
                      <button
                        className="btn-game btn-game-gold skill-action-btn"
                        disabled={!canLevelUp}
                        onClick={() => {
                          if (canLevelUp && onUpgradeSkill) {
                            sound.playFanfare();
                            onUpgradeSkill(skill.id);
                          }
                        }}
                      >
                        <Sparkles size={12} />
                        <span>레벨업</span>
                      </button>

                      {/* Equip / Unequip Button */}
                      {isEquipped ? (
                        <button
                          className="btn-game btn-game-wood skill-action-btn"
                          onClick={() => {
                            if (onEquipSkill) {
                              sound.playTap();
                              onEquipSkill(isEquippedInSlot, null);
                            }
                          }}
                        >
                          <Check size={12} color="#10b981" />
                          <span>슬롯 {isEquippedInSlot + 1} 해제</span>
                        </button>
                      ) : (
                        <button
                          className="btn-game btn-game-ruby skill-action-btn"
                          onClick={() => {
                            if (onEquipSkill) {
                              sound.playTap();
                              onEquipSkill(selectedSlotIndex, skill.id);
                            }
                          }}
                        >
                          <span>슬롯 {selectedSlotIndex + 1}에 장착</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

        .upgrade-name-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-bump-badge {
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          font-weight: 800;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          padding: 1px 5px;
          border-radius: 9999px;
          animation: floatBump 0.85s ease-out forwards;
        }

        @keyframes floatBump {
          0% { transform: translateY(3px) scale(0.9); opacity: 0; }
          30% { transform: translateY(-2px) scale(1.15); opacity: 1; }
          80% { transform: translateY(-4px) scale(1); opacity: 0.9; }
          100% { transform: translateY(-7px) scale(0.95); opacity: 0; }
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

        /* 🔮 Skill System & Subtab Styles */
        .hero-subtabs-nav {
          display: flex;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 4px;
        }

        .hero-subtab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          position: relative;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .hero-subtab-btn.subtab-active {
          background: #f59e0b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
        }

        .subtab-badge-dot {
          position: absolute;
          top: 6px;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        }

        .hero-skills-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skills-loadout-panel {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .loadout-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .loadout-title {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .loadout-subtitle {
          font-size: 10px;
          color: #94a3b8;
        }

        .equipped-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .equipped-slot-card {
          position: relative;
          background: rgba(15, 23, 42, 0.7);
          border: 1.5px dashed rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .equipped-slot-card.slot-selected {
          border-style: solid;
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
        }

        .slot-idx-tag {
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          margin-bottom: 2px;
        }

        .slot-assigned-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          width: 100%;
        }

        .slot-assigned-icon {
          font-size: 20px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .slot-assigned-name {
          font-size: 10px;
          font-weight: 800;
          color: #fef08a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
          text-align: center;
        }

        .slot-assigned-cd {
          font-size: 9px;
          color: #38bdf8;
          font-weight: 700;
        }

        .slot-unequip-btn {
          margin-top: 2px;
          font-size: 8px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
          background: rgba(239, 68, 68, 0.25);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          cursor: pointer;
        }

        .slot-empty-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
        }

        .skills-collection-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 2px;
        }

        .collection-title {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .collection-hint {
          font-size: 10px;
          color: #94a3b8;
        }

        .skills-collection-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skill-card-row {
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skill-card-main {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .skill-icon-frame {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .skill-frame-glyph {
          font-size: 22px;
        }

        .skill-lvl-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          font-size: 8px;
          font-weight: 800;
          background: #f59e0b;
          color: #fff;
          padding: 1px 4px;
          border-radius: 9999px;
        }

        .skill-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .skill-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name-txt {
          font-size: 13px;
          font-weight: 800;
          color: #f8fafc;
        }

        .skill-cooldown-badge {
          font-size: 9px;
          font-weight: 700;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          padding: 1px 6px;
          border-radius: 9999px;
        }

        .skill-desc-txt {
          font-size: 10px;
          color: #cbd5e1;
          line-height: 1.3;
        }

        .skill-piece-progress-box {
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .piece-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
          font-weight: 700;
        }

        .piece-val {
          color: #fef08a;
        }

        .piece-track {
          width: 100%;
          height: 5px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
          overflow: hidden;
        }

        .piece-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .skill-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          padding-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .skill-action-btn {
          min-width: 80px;
          height: 32px;
          font-size: 11px;
          padding: 4px 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};
