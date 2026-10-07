import React, { useState } from 'react';
import { CharacterStats, Equipment, Pet, Skill, CharacterClassId, PromotionId, StageState } from '../types/game';
import { Sparkles, Shield, Zap, Heart, Swords, X, Wand2, Plus, Check, Crown, ArrowRight, BookOpen } from 'lucide-react';
import { CLASS_CONFIGS, PROMOTION_REQUIREMENTS } from '../data/classes';
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
  classId?: CharacterClassId;
  promotion?: PromotionId;
  awakeningUnlocked?: boolean;
  promotionSeals?: number;
  stage?: StageState;
  onPromote?: () => void;
  onSwitchClass?: (newClassId: CharacterClassId) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  stats,
  totalAtk,
  totalHp,
  totalDef,
  combatPower,
  onUpgradeStat,
  onClose,
  skills = [],
  equippedSkillIds = [null, null, null, null],
  onEquipSkill,
  onUpgradeSkill,
  classId = 'warrior',
  promotion = 'none',
  awakeningUnlocked = false,
  promotionSeals = 1,
  stage = { chapter: 1, stage: 1, killCount: 0, killsRequired: 5, isBossStage: false, bossTimeLeft: 30, bossMaxTime: 30, inBossFight: false, highestChapter: 1, highestStage: 1 },
  onPromote,
  onSwitchClass,
}) => {
  const [subTab, setSubTab] = useState<'stats' | 'skills' | 'promotion'>('stats');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<1 | 10 | 'max'>(1);

  const currentClassConfig = CLASS_CONFIGS[classId];
  const isMage = classId === 'mage';
  const isPromoted = promotion !== 'none';

  // Filter skills strictly to active class and non-awakening for regular 4 slots
  const classSkills = skills.filter((s) => s.classId === classId && !s.isAwakening);
  const awakeningSkill = skills.find((s) => s.classId === classId && s.isAwakening);

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

  // Promotion requirements check
  const reqLevelMet = stats.level >= PROMOTION_REQUIREMENTS.requiredLevel;
  const reqStageMet = (stage.highestChapter > PROMOTION_REQUIREMENTS.requiredChapter) ||
    (stage.highestChapter === PROMOTION_REQUIREMENTS.requiredChapter && stage.highestStage >= PROMOTION_REQUIREMENTS.requiredStage);
  const reqGoldMet = stats.gold >= PROMOTION_REQUIREMENTS.requiredGold;
  const reqSealMet = promotionSeals >= PROMOTION_REQUIREMENTS.requiredSeals;
  const canPromote = reqLevelMet && reqStageMet && reqGoldMet && reqSealMet && !isPromoted;

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Swords size={18} color="#f59e0b" />
          </div>
          <span>영웅 성장 & 전직</span>
          <span className="hero-level-chip">Lv.{stats.level}</span>
          <span className="hero-class-tag">{isPromoted ? currentClassConfig.promotionName : currentClassConfig.name}</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* 3 Sub-tabs Nav */}
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
            <span>스킬 편성</span>
            {classSkills.some((s) => s.pieces >= s.piecesRequired) && (
              <span className="subtab-badge-dot" />
            )}
          </button>
          <button
            className={`hero-subtab-btn ${subTab === 'promotion' ? 'subtab-active' : ''}`}
            onClick={() => {
              sound.playTap();
              setSubTab('promotion');
            }}
          >
            <Crown size={13} />
            <span>전직 & 각성</span>
            {canPromote && <span className="subtab-badge-dot" />}
          </button>
        </div>

        {/* ========================================================
            TAB 1: STATS UPGRADE
           ======================================================== */}
        {subTab === 'stats' && (
          <>
            {/* Combat Power Showcase */}
            <div className="combat-power-banner">
              <div className="hero-mini-avatar-box">
                <img
                  src={isMage ? './assets/hero_mage.png' : './assets/hero_knight.png'}
                  alt="Hero"
                  className="hero-mini-avatar-img"
                />
              </div>
              <div className="power-banner-center">
                <span className="power-banner-label">종합 전투력</span>
                <span className="power-banner-val">{combatPower.toLocaleString()}</span>
              </div>
              <div className="power-banner-badge">
                <Sparkles size={16} color="#f59e0b" />
                <span>{isPromoted ? currentClassConfig.promotionSubTitle : currentClassConfig.subTitle}</span>
              </div>
            </div>

            {/* 4 Core Stats Grid */}
            <div className="core-stats-deck">
              <div className="stat-card-glass">
                <div className="stat-icon-wrapper atk-tint">
                  <Swords size={15} color="#ef4444" />
                </div>
                <div className="stat-texts">
                  <span className="stat-name">공격력 (ATK)</span>
                  <span className="stat-value">{totalAtk.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-card-glass">
                <div className="stat-icon-wrapper hp-tint">
                  <Heart size={15} color="#10b981" />
                </div>
                <div className="stat-texts">
                  <span className="stat-name">최대 체력 (HP)</span>
                  <span className="stat-value">{totalHp.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-card-glass">
                <div className="stat-icon-wrapper def-tint">
                  <Shield size={15} color="#38bdf8" />
                </div>
                <div className="stat-texts">
                  <span className="stat-name">방어력 (DEF)</span>
                  <span className="stat-value">{totalDef.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-card-glass">
                <div className="stat-icon-wrapper crit-tint">
                  <Zap size={15} color="#f59e0b" />
                </div>
                <div className="stat-texts">
                  <span className="stat-name">치명타 확률</span>
                  <span className="stat-value">{Math.round(stats.critRate * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Multiplier Row */}
            <div className="upgrade-multiplier-row">
              <span className="multiplier-text">강화 배율 설정</span>
              <div className="multiplier-btn-group">
                <button
                  className={`multiplier-pill-btn ${multiplier === 1 ? 'pill-active' : ''}`}
                  onClick={() => setMultiplier(1)}
                >
                  +1
                </button>
                <button
                  className={`multiplier-pill-btn ${multiplier === 10 ? 'pill-active' : ''}`}
                  onClick={() => setMultiplier(10)}
                >
                  +10
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
              {/* ATK */}
              <div className="parchment-panel upgrade-card-row">
                <div className="upgrade-meta-left">
                  <div className="upgrade-icon-slot atk-glow">
                    <Swords size={18} color="#ef4444" />
                  </div>
                  <div className="upgrade-name-col">
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-title-txt">공격력 강화</span>
                      {bumpStat?.stat === 'atk' && (
                        <span className="stat-bump-badge">+{bumpStat.amount * 4}</span>
                      )}
                    </div>
                    <span className="upgrade-lvl-txt">
                      Lv.{stats.atkLevel} → <span className="next-lvl-highlight">Lv.{atkInfo.nextLvl}</span>
                    </span>
                  </div>
                </div>
                <button
                  className={`btn-game ${atkInfo.canAfford ? 'btn-game-gold' : 'btn-game-wood'} upgrade-buy-btn`}
                  disabled={!atkInfo.canAfford}
                  onClick={() => handleUpgrade('atk', atkInfo.count)}
                >
                  <span className="buy-count-label">+{atkInfo.count} 레벨</span>
                  <span className="buy-cost-label">🪙 {atkInfo.cost.toLocaleString()}</span>
                </button>
              </div>

              {/* HP */}
              <div className="parchment-panel upgrade-card-row">
                <div className="upgrade-meta-left">
                  <div className="upgrade-icon-slot hp-glow">
                    <Heart size={18} color="#10b981" />
                  </div>
                  <div className="upgrade-name-col">
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-title-txt">생명력 강화</span>
                      {bumpStat?.stat === 'hp' && (
                        <span className="stat-bump-badge">+{bumpStat.amount * 35}</span>
                      )}
                    </div>
                    <span className="upgrade-lvl-txt">
                      Lv.{stats.hpLevel} → <span className="next-lvl-highlight">Lv.{hpInfo.nextLvl}</span>
                    </span>
                  </div>
                </div>
                <button
                  className={`btn-game ${hpInfo.canAfford ? 'btn-game-green' : 'btn-game-wood'} upgrade-buy-btn`}
                  disabled={!hpInfo.canAfford}
                  onClick={() => handleUpgrade('hp', hpInfo.count)}
                >
                  <span className="buy-count-label">+{hpInfo.count} 레벨</span>
                  <span className="buy-cost-label">🪙 {hpInfo.cost.toLocaleString()}</span>
                </button>
              </div>

              {/* DEF */}
              <div className="parchment-panel upgrade-card-row">
                <div className="upgrade-meta-left">
                  <div className="upgrade-icon-slot def-glow">
                    <Shield size={18} color="#38bdf8" />
                  </div>
                  <div className="upgrade-name-col">
                    <div className="upgrade-name-title-row">
                      <span className="upgrade-title-txt">방어력 강화</span>
                      {bumpStat?.stat === 'def' && (
                        <span className="stat-bump-badge">+{bumpStat.amount * 2}</span>
                      )}
                    </div>
                    <span className="upgrade-lvl-txt">
                      Lv.{stats.defLevel} → <span className="next-lvl-highlight">Lv.{defInfo.nextLvl}</span>
                    </span>
                  </div>
                </div>
                <button
                  className={`btn-game ${defInfo.canAfford ? 'btn-game-blue' : 'btn-game-wood'} upgrade-buy-btn`}
                  disabled={!defInfo.canAfford}
                  onClick={() => handleUpgrade('def', defInfo.count)}
                >
                  <span className="buy-count-label">+{defInfo.count} 레벨</span>
                  <span className="buy-cost-label">🪙 {defInfo.cost.toLocaleString()}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ========================================================
            TAB 2: SKILL LOADOUT & COLLECTION (Active Class Only)
           ======================================================== */}
        {subTab === 'skills' && (
          <div className="skills-subtab-container">
            {/* 4 Skill Slots Deck */}
            <div className="parchment-panel skill-slots-deck-panel">
              <div className="slots-deck-header">
                <span className="slots-deck-title">⚡ 자동 발동 스킬 슬롯 (1 ~ 4)</span>
                <span className="slots-deck-desc">슬롯을 선택한 후 아래 보유 스킬을 장착하세요</span>
              </div>

              <div className="equipped-slots-grid">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const skillId = equippedSkillIds[slotIdx];
                  const eqSkill = skillId ? skills.find((s) => s.id === skillId) : null;
                  const isSelected = selectedSlotIndex === slotIdx;

                  return (
                    <div
                      key={slotIdx}
                      className={`hero-skill-slot-card ${isSelected ? 'slot-card-selected' : ''}`}
                      onClick={() => {
                        sound.playTap();
                        setSelectedSlotIndex(slotIdx);
                      }}
                    >
                      <div className="slot-index-pip">슬롯 {slotIdx + 1}</div>
                      {eqSkill ? (
                        <div className="slot-card-body">
                          <span className="slot-skill-glyph">{eqSkill.icon}</span>
                          <span className="slot-skill-name">{eqSkill.name}</span>
                          <span className="slot-skill-lvl">Lv.{eqSkill.level}</span>
                        </div>
                      ) : (
                        <div className="slot-empty-body">
                          <Plus size={16} color="#64748b" />
                          <span className="empty-txt">비어있음</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Owned Class Skills List */}
            <div className="skills-collection-header">
              <span className="collection-title">
                {currentClassConfig.name} 스킬 보관함 ({classSkills.length})
              </span>
              <span className="collection-hint">잡화점에서 비급서를 모아 스킬 레벨업!</span>
            </div>

            <div className="skills-collection-list">
              {classSkills.map((skill) => {
                const isEquippedInSlot = equippedSkillIds.indexOf(skill.id);
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
                          <span>슬롯 {selectedSlotIndex + 1} 장착</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PROMOTION & AWAKENING SYSTEM
           ======================================================== */}
        {subTab === 'promotion' && (
          <div className="promotion-subtab-container">
            {/* Current Class Overview Card */}
            <div className="parchment-panel class-current-card">
              <div className="class-current-avatar-col">
                <img
                  src={isMage ? './assets/hero_mage.png' : './assets/hero_knight.png'}
                  alt={currentClassConfig.name}
                  className="class-current-sprite"
                />
              </div>
              <div className="class-current-info-col">
                <div className="class-badge-title-row">
                  <span className="class-title-large">
                    {isPromoted ? currentClassConfig.promotionName : currentClassConfig.name}
                  </span>
                  <span className={`class-rank-badge ${isPromoted ? 'rank-promoted' : 'rank-base'}`}>
                    {isPromoted ? '각성 달성 👑' : '기본 직업'}
                  </span>
                </div>
                <span className="class-motto-txt">
                  {isPromoted ? currentClassConfig.promotionDesc : currentClassConfig.description}
                </span>
                <div className="class-bonuses-row">
                  <span className="bonus-chip">체력 x{currentClassConfig.statBuffs.hpMult}</span>
                  <span className="bonus-chip">방어 x{currentClassConfig.statBuffs.defMult}</span>
                  <span className="bonus-chip">공격 x{currentClassConfig.statBuffs.atkMult}</span>
                </div>
              </div>
            </div>

            {/* Target Promotion Stage Card */}
            <div className="parchment-panel promotion-dest-card">
              <div className="dest-header">
                <Crown size={16} color="#fbbf24" />
                <span className="dest-title">
                  {isPromoted ? '현재 전직 완료' : `다음 목표: ${currentClassConfig.promotionName}`}
                </span>
              </div>

              {/* Stat Buffs Comparison */}
              <div className="dest-buffs-grid">
                <div className="buff-cell">
                  <span className="buff-cell-label">공격 속도</span>
                  <span className="buff-cell-val">+{Math.round(currentClassConfig.promotionBuffs.atkSpeedBonus * 100)}%</span>
                </div>
                <div className="buff-cell">
                  <span className="buff-cell-label">치명타 확률</span>
                  <span className="buff-cell-val">+{Math.round(currentClassConfig.promotionBuffs.critRateBonus * 100)}%</span>
                </div>
                <div className="buff-cell">
                  <span className="buff-cell-label">스킬 데미지</span>
                  <span className="buff-cell-val">+{Math.round(currentClassConfig.promotionBuffs.skillDamageBonus * 100)}%</span>
                </div>
                <div className="buff-cell">
                  <span className="buff-cell-label">스킬 쿨다운</span>
                  <span className="buff-cell-val">-{Math.round(currentClassConfig.promotionBuffs.cooldownReduction * 100)}%</span>
                </div>
              </div>

              {/* Awakening Skill Showcase */}
              {awakeningSkill && (
                <div className="awakening-preview-box">
                  <div className="awakening-preview-top">
                    <span className="awakening-preview-icon">{awakeningSkill.icon}</span>
                    <div className="awakening-preview-names">
                      <span className="awakening-preview-name">{awakeningSkill.name}</span>
                      <span className="awakening-preview-type">전직 전용 궁극 각성기</span>
                    </div>
                    <span className="awakening-preview-hits">{awakeningSkill.hits}연타 강타</span>
                  </div>
                  <div className="awakening-preview-desc">{awakeningSkill.description}</div>
                  <div className="awakening-rule-hint">
                    ⚡ 전투 중 기본 공격 및 스킬 적중으로 각성 게이지 100% 충전 시 <strong>자동 발동</strong>
                  </div>
                </div>
              )}

              {/* Promotion Requirements Checklist (When not yet promoted) */}
              {!isPromoted && (
                <div className="promotion-checklist-box">
                  <span className="checklist-heading">전직 심사 조건</span>
                  <div className="checklist-item-row">
                    <span className={`check-pip ${reqLevelMet ? 'pip-pass' : 'pip-fail'}`}>
                      {reqLevelMet ? '✓' : '✗'}
                    </span>
                    <span className="check-text">영웅 레벨 30 달성 (현재: Lv.{stats.level})</span>
                  </div>
                  <div className="checklist-item-row">
                    <span className={`check-pip ${reqStageMet ? 'pip-pass' : 'pip-fail'}`}>
                      {reqStageMet ? '✓' : '✗'}
                    </span>
                    <span className="check-text">
                      보스 스테이지 3-10 격파 (현재 진행: {stage.chapter}-{stage.stage})
                    </span>
                  </div>
                  <div className="checklist-item-row">
                    <span className={`check-pip ${reqGoldMet ? 'pip-pass' : 'pip-fail'}`}>
                      {reqGoldMet ? '✓' : '✗'}
                    </span>
                    <span className="check-text">
                      10,000 골드 보유 (현재: {stats.gold.toLocaleString()} 🪙)
                    </span>
                  </div>
                  <div className="checklist-item-row">
                    <span className={`check-pip ${reqSealMet ? 'pip-pass' : 'pip-fail'}`}>
                      {reqSealMet ? '✓' : '✗'}
                    </span>
                    <span className="check-text">
                      전직의 인장 1개 보유 (현재: {promotionSeals}개)
                    </span>
                  </div>

                  <button
                    className={`btn-game ${canPromote ? 'btn-game-gold' : 'btn-game-wood'} promote-action-btn`}
                    disabled={!canPromote}
                    onClick={() => {
                      if (canPromote && onPromote) {
                        sound.playFanfare();
                        onPromote();
                      }
                    }}
                  >
                    <Crown size={15} />
                    <span>{currentClassConfig.promotionName}(으)로 전직하기</span>
                  </button>
                </div>
              )}

              {isPromoted && (
                <div className="promoted-success-banner">
                  <Sparkles size={16} color="#fbbf24" />
                  <span>전직 및 각성기 해금 완료! 전장에서 찬란한 극의를 펼쳐보세요.</span>
                </div>
              )}
            </div>

            {/* Class Switch Section */}
            <div className="parchment-panel class-switch-panel">
              <div className="switch-panel-header">
                <BookOpen size={15} color="#38bdf8" />
                <span className="switch-panel-title">직업 전환 (Warrior ⇄ Mage)</span>
              </div>
              <p className="switch-panel-desc">
                원하는 스타일에 맞춰 전사와 마법사를 자유롭게 전환할 수 있습니다. (성장 레벨 및 골드는 그대로 유지됩니다)
              </p>
              <div className="switch-buttons-row">
                <button
                  className={`btn-game ${classId === 'warrior' ? 'btn-game-wood' : 'btn-game-gold'} switch-btn`}
                  disabled={classId === 'warrior'}
                  onClick={() => {
                    if (classId !== 'warrior' && onSwitchClass) {
                      sound.playTap();
                      onSwitchClass('warrior');
                    }
                  }}
                >
                  <span>⚔️ 전사 (Warrior)로 전환</span>
                </button>
                <button
                  className={`btn-game ${classId === 'mage' ? 'btn-game-wood' : 'btn-game-blue'} switch-btn`}
                  disabled={classId === 'mage'}
                  onClick={() => {
                    if (classId !== 'mage' && onSwitchClass) {
                      sound.playTap();
                      onSwitchClass('mage');
                    }
                  }}
                >
                  <span>🔮 마법사 (Mage)로 전환</span>
                </button>
              </div>
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

        .hero-class-tag {
          font-size: 10px;
          font-weight: 800;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 9999px;
          padding: 1px 7px;
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
          100% { transform: translateY(-12px) scale(1); opacity: 0; }
        }

        .upgrade-title-txt {
          font-size: 13px;
          font-weight: 800;
          color: #f8fafc;
        }

        .upgrade-lvl-txt {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        .next-lvl-highlight {
          color: #38bdf8;
          font-weight: 800;
        }

        .upgrade-buy-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 110px;
          height: 38px;
          padding: 2px 8px;
        }

        .buy-count-label {
          font-size: 11px;
          font-weight: 800;
          line-height: 1.1;
        }

        .buy-cost-label {
          font-size: 10px;
          font-weight: 700;
          opacity: 0.95;
          line-height: 1.1;
        }

        /* --- Sub-tabs Nav --- */
        .hero-subtabs-nav {
          display: flex;
          gap: 6px;
          background: rgba(15, 23, 42, 0.85);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-subtab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          position: relative;
        }

        .subtab-active {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .subtab-badge-dot {
          position: absolute;
          top: 6px;
          right: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        }

        /* --- Skills Deck --- */
        .skills-subtab-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-slots-deck-panel {
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .slots-deck-header {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .slots-deck-title {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .slots-deck-desc {
          font-size: 10px;
          color: #94a3b8;
        }

        .equipped-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .hero-skill-slot-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }

        .slot-card-selected {
          border-color: #fbbf24;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
          transform: translateY(-2px);
        }

        .slot-index-pip {
          font-size: 8px;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 2px;
        }

        .slot-card-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .slot-skill-glyph {
          font-size: 20px;
        }

        .slot-skill-name {
          font-size: 9px;
          font-weight: 800;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 58px;
        }

        .slot-skill-lvl {
          font-size: 8px;
          font-weight: 800;
          color: #fbbf24;
        }

        .slot-empty-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 6px 0;
        }

        .empty-txt {
          font-size: 8px;
          color: #64748b;
          font-weight: 700;
        }

        .skills-collection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 4px;
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
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 12px;
        }

        .skill-card-main {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .skill-icon-frame {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.9);
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .skill-frame-glyph {
          font-size: 22px;
        }

        .skill-lvl-badge {
          position: absolute;
          bottom: -4px;
          font-size: 8px;
          font-weight: 800;
          color: #ffffff;
          background: #d97706;
          border-radius: 4px;
          padding: 1px 4px;
        }

        .skill-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .skill-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name-txt {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .skill-cooldown-badge {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 700;
        }

        .skill-desc-txt {
          font-size: 10px;
          color: #cbd5e1;
          line-height: 1.3;
        }

        .skill-piece-progress-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 3px;
        }

        .piece-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
        }

        .piece-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
        }

        .piece-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          border-radius: 9999px;
        }

        .skill-actions-row {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .skill-action-btn {
          height: 28px;
          font-size: 10px;
          font-weight: 800;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* --- Tab 3: Promotion Styles --- */
        .promotion-subtab-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .class-current-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
        }

        .class-current-avatar-col {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 2px solid #f59e0b;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .class-current-sprite {
          width: 120%;
          height: 120%;
          object-fit: cover;
          transform: translateY(3px);
        }

        .class-current-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .class-badge-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .class-title-large {
          font-size: 14px;
          font-weight: 900;
          color: #f8fafc;
        }

        .class-rank-badge {
          font-size: 9px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
        }

        .rank-base {
          background: rgba(148, 163, 184, 0.2);
          color: #cbd5e1;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .rank-promoted {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .class-motto-txt {
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.3;
        }

        .class-bonuses-row {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }

        .bonus-chip {
          font-size: 9px;
          font-weight: 800;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 4px;
          padding: 1px 5px;
        }

        .promotion-dest-card {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1.5px solid rgba(245, 158, 11, 0.4);
        }

        .dest-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dest-title {
          font-size: 13px;
          font-weight: 900;
          color: #fbbf24;
        }

        .dest-buffs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .buff-cell {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .buff-cell-label {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 700;
        }

        .buff-cell-val {
          font-size: 11px;
          font-weight: 900;
          color: #22c55e;
        }

        .awakening-preview-box {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(251, 191, 36, 0.35);
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .awakening-preview-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .awakening-preview-icon {
          font-size: 18px;
        }

        .awakening-preview-names {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .awakening-preview-name {
          font-size: 12px;
          font-weight: 800;
          color: #fbbf24;
        }

        .awakening-preview-type {
          font-size: 9px;
          color: #94a3b8;
        }

        .awakening-preview-hits {
          font-size: 9px;
          font-weight: 800;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
          padding: 2px 6px;
          border-radius: 9999px;
        }

        .awakening-preview-desc {
          font-size: 10px;
          color: #cbd5e1;
          line-height: 1.3;
        }

        .awakening-rule-hint {
          font-size: 9px;
          color: #fef08a;
          background: rgba(245, 158, 11, 0.1);
          padding: 3px 6px;
          border-radius: 6px;
          margin-top: 2px;
        }

        .promotion-checklist-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(0, 0, 0, 0.25);
          padding: 8px 10px;
          border-radius: 10px;
        }

        .checklist-heading {
          font-size: 11px;
          font-weight: 800;
          color: #cbd5e1;
          margin-bottom: 2px;
        }

        .checklist-item-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .check-pip {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .pip-pass {
          background: #10b981;
          color: #ffffff;
        }

        .pip-fail {
          background: rgba(255, 255, 255, 0.1);
          color: #64748b;
        }

        .check-text {
          font-size: 10px;
          font-weight: 700;
          color: #e2e8f0;
        }

        .promote-action-btn {
          height: 38px;
          margin-top: 6px;
          font-size: 12px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .promoted-success-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 800;
          color: #6ee7b7;
        }

        .class-switch-panel {
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .switch-panel-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .switch-panel-title {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .switch-panel-desc {
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.3;
          margin: 0;
        }

        .switch-buttons-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .switch-btn {
          flex: 1;
          height: 32px;
          font-size: 10px;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};
