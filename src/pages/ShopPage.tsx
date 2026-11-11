import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Gem, Clock, X, Store, Info } from 'lucide-react';
import { CharacterClassId } from '../types/game';
import {
  RARITY_CONFIGS,
  EQUIPMENT_RARITY_ORDER,
  EQUIPMENT_SUMMON_PROBABILITIES,
  EQUIPMENT_SUMMON_COST_1,
  EQUIPMENT_SUMMON_COST_10,
  EQUIPMENT_GOLD_CHEST_COST,
  EQUIPMENT_PITY_LIMIT,
  EQUIPMENT_MYTHIC_PITY_LIMIT,
  validateEquipmentSummonProbabilities,
} from '../data/equipment';
import { sound } from '../utils/audio';

interface ShopPageProps {
  gold: number;
  gems: number;
  freeChestLastOpened: number;
  equipmentPityCount?: number;
  totalEquipmentSummons?: number;
  onOpenFreeChest: () => void;
  onOpenGoldChest: (cost: number) => void;
  onOpenGemChest: (cost: number) => void;
  onSummonEquipment?: (count: 1 | 10) => void;
  onBuyGemsWithGold: (goldCost: number, gemGain: number) => void;
  onSummonSkill?: (count: 1 | 10) => void;
  onClose?: () => void;
  classId?: CharacterClassId;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  gold,
  gems,
  freeChestLastOpened,
  equipmentPityCount = 0,
  totalEquipmentSummons = 0,
  onOpenFreeChest,
  onOpenGoldChest,
  onOpenGemChest,
  onSummonEquipment,
  onBuyGemsWithGold,
  onSummonSkill,
  onClose,
  classId = 'warrior',
}) => {
  const FREE_CHEST_COOLDOWN = 60; // 60 seconds
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showRatesDetail, setShowRatesDetail] = useState(true);

  useEffect(() => {
    const updateCooldown = () => {
      const elapsed = Math.floor((Date.now() - freeChestLastOpened) / 1000);
      const remaining = Math.max(0, FREE_CHEST_COOLDOWN - elapsed);
      setSecondsLeft(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [freeChestLastOpened]);

  const GOLD_CHEST_COST = EQUIPMENT_GOLD_CHEST_COST;
  const GEM_CHEST_COST_1 = EQUIPMENT_SUMMON_COST_1;
  const GEM_CHEST_COST_10 = EQUIPMENT_SUMMON_COST_10;
  const probCheck = validateEquipmentSummonProbabilities();

  const handleFreeChest = () => {
    if (secondsLeft === 0) {
      sound.playFanfare();
      onOpenFreeChest();
    }
  };

  const handleGoldChest = () => {
    if (gold >= GOLD_CHEST_COST) {
      sound.playFanfare();
      onOpenGoldChest(GOLD_CHEST_COST);
    }
  };

  const handleEquipSummon = (count: 1 | 10) => {
    const cost = count === 1 ? GEM_CHEST_COST_1 : GEM_CHEST_COST_10;
    if (gems < cost) return;
    sound.playFanfare();
    if (onSummonEquipment) {
      onSummonEquipment(count);
    } else if (count === 1) {
      onOpenGemChest(cost);
    }
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Store size={18} color="#f59e0b" />
          </div>
          <span>신비한 숲속 잡화점 & 소환 제단</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Squirrel Merchant Banner */}
        <div className="merchant-encounter-banner">
          <div className="merchant-npc-icon-box">🐿️</div>
          <div className="merchant-speech-bubble">
            <span className="merchant-name">잡화점 상인 도토리</span>
            <span className="merchant-quote">"10회 연속 소환 시 희귀 이상 보장, 30회마다 전설~신화 장비가 확정이라네!"</span>
          </div>
        </div>

        {/* Chests Showcase */}
        <div className="chests-parchment-list">
          {/* 1. Featured Gem Equipment Summon Altar (1x & 10x + Pity + Rates) */}
          <div className="parchment-panel equip-summon-altar-panel gem-chest-theme" data-testid="shop-equip-summon-panel">
            <div className="chest-badge-tag hot-tag">HOT! 장비 소환 제단</div>

            <div className="summon-altar-top-row">
              <div className="chest-visual-box">👑💎</div>
              <div className="chest-details">
                <span className="chest-headline">빛나는 유물 장비 소환</span>
                <span className="chest-subtext">
                  일반 ~ 신화 전 부위 장비 출현 · 10연차 희귀+ 보장 (누적 {totalEquipmentSummons}회)
                </span>
              </div>
              <div className="skill-summon-btns-group">
                <button
                  type="button"
                  data-testid="shop-summon-equip-1"
                  className="btn-game btn-game-ruby chest-open-btn skill-half-btn"
                  disabled={gems < GEM_CHEST_COST_1}
                  onClick={() => handleEquipSummon(1)}
                >
                  <span>1회 소환</span>
                  <span className="chest-price-text">💎 {GEM_CHEST_COST_1}</span>
                </button>
                <button
                  type="button"
                  data-testid="shop-summon-equip-10"
                  className="btn-game btn-game-gold chest-open-btn skill-half-btn"
                  disabled={gems < GEM_CHEST_COST_10}
                  onClick={() => handleEquipSummon(10)}
                >
                  <span>10회 (-10%)</span>
                  <span className="chest-price-text">💎 {GEM_CHEST_COST_10}</span>
                </button>
              </div>
            </div>

            {/* Pity Progress Bars (30x Legendary+ & 60x Mythic Guaranteed) */}
            <div className="summon-pity-box" data-testid="shop-equip-pity-box">
              <div className="pity-label-row">
                <span>🌟 전설~신화 천장 (30회 달성 시 전설~신화 확정!)</span>
                <strong data-testid="shop-equip-pity-text">
                  {equipmentPityCount} / {EQUIPMENT_PITY_LIMIT}
                </strong>
              </div>
              <div className="pity-progress-track">
                <div
                  className="pity-progress-fill"
                  style={{
                    width: `${Math.min(100, (equipmentPityCount / EQUIPMENT_PITY_LIMIT) * 100)}%`,
                  }}
                />
              </div>

              <div className="pity-label-row" style={{ marginTop: '6px' }}>
                <span style={{ color: '#fca5a5' }}>🔥 신화 확정 천장 (60회 달성 시 신화 100% 확정!)</span>
                <strong data-testid="shop-equip-mythic-pity-text" style={{ color: '#fca5a5' }}>
                  {totalEquipmentSummons % EQUIPMENT_MYTHIC_PITY_LIMIT} / {EQUIPMENT_MYTHIC_PITY_LIMIT}
                </strong>
              </div>
              <div className="pity-progress-track">
                <div
                  className="pity-progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      ((totalEquipmentSummons % EQUIPMENT_MYTHIC_PITY_LIMIT) / EQUIPMENT_MYTHIC_PITY_LIMIT) * 100
                    )}%`,
                    background: 'linear-gradient(90deg, #ef4444, #f97316)',
                  }}
                />
              </div>
            </div>

            {/* Summon Rarity Probabilities Table (Single Source of Truth) */}
            <div className="summon-rates-section">
              <div
                className="summon-rates-header"
                onClick={() => setShowRatesDetail((prev) => !prev)}
              >
                <span className="rates-title">
                  <Info size={12} color="#93c5fd" />
                  등급별 등장 확률 안내 (합계 {probCheck.total}%)
                </span>
                <span className="rates-toggle-label">{showRatesDetail ? '접기 ▲' : '펼치기 ▼'}</span>
              </div>
              {showRatesDetail && (
                <div className="summon-rates-pills" data-testid="shop-equip-rates-table">
                  {EQUIPMENT_RARITY_ORDER.map((rarity) => {
                    const conf = RARITY_CONFIGS[rarity];
                    const prob = EQUIPMENT_SUMMON_PROBABILITIES[rarity];
                    return (
                      <div
                        key={rarity}
                        className="rate-pill-item"
                        style={{ borderColor: conf.borderColor }}
                        data-testid={`rate-pill-${rarity}`}
                      >
                        <span className="rate-rarity-name" style={{ color: conf.color }}>
                          {conf.label}
                        </span>
                        <strong className="rate-rarity-val">{prob}%</strong>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Free Supply Chest */}
          <div className="parchment-panel chest-row-panel">
            <div className="chest-badge-tag free-tag">무료 보급</div>
            <div className="chest-visual-box">🎁</div>
            <div className="chest-details">
              <span className="chest-headline">모험가 보급 상자</span>
              <span className="chest-subtext">일반 장비 & 조각 무료 보급 (60초 쿨타임)</span>
            </div>
            <button
              className={`btn-game ${secondsLeft === 0 ? 'btn-game-green' : 'btn-game-wood'} chest-open-btn`}
              disabled={secondsLeft > 0}
              onClick={handleFreeChest}
            >
              {secondsLeft === 0 ? (
                <>
                  <Gift size={15} />
                  <span>무료 개봉</span>
                </>
              ) : (
                <>
                  <Clock size={15} />
                  <span>{secondsLeft}초 대기</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Gold Chest */}
          <div className="parchment-panel chest-row-panel">
            <div className="chest-visual-box">📦</div>
            <div className="chest-details">
              <span className="chest-headline">골드 장비 상자</span>
              <span className="chest-subtext">사냥 골드로 장비 1회 소환 (기본 확률 적용)</span>
            </div>
            <button
              data-testid="shop-gold-chest-btn"
              className="btn-game btn-game-gold chest-open-btn"
              disabled={gold < GOLD_CHEST_COST}
              onClick={handleGoldChest}
            >
              <span>1회 소환</span>
              <span className="chest-price-text">🪙 {GOLD_CHEST_COST}</span>
            </button>
          </div>

          {/* 4. Skill Summon (스킬 비급서 소환) */}
          <div className="parchment-panel chest-row-panel skill-summon-theme">
            <div className="chest-badge-tag new-tag">{classId === 'mage' ? '마법사' : '전사'} 전용</div>
            <div className="chest-visual-box">{classId === 'mage' ? '🔮📜' : '⚔️📜'}</div>
            <div className="chest-details">
              <span className="chest-headline">
                {classId === 'mage' ? '비전 마법서 소환' : '강철 검결서 소환'}
              </span>
              <span className="chest-subtext">
                {classId === 'mage' ? '마법사 전용 스킬 조각 & 완제품' : '전사 전용 스킬 조각 & 완제품'}
              </span>
            </div>
            <div className="skill-summon-btns-group">
              <button
                className="btn-game btn-game-wood chest-open-btn skill-half-btn"
                disabled={gems < 100}
                onClick={() => {
                  if (gems >= 100 && onSummonSkill) {
                    onSummonSkill(1);
                  }
                }}
              >
                <span>1회 소환</span>
                <span className="chest-price-text">💎 100</span>
              </button>
              <button
                className="btn-game btn-game-gold chest-open-btn skill-half-btn"
                disabled={gems < 900}
                onClick={() => {
                  if (gems >= 900 && onSummonSkill) {
                    onSummonSkill(10);
                  }
                }}
              >
                <span>10회 (-10%)</span>
                <span className="chest-price-text">💎 900</span>
              </button>
            </div>
          </div>
        </div>

        {/* Currency Exchange Station */}
        <div className="parchment-panel exchange-station-panel">
          <div className="exchange-station-header">
            <Gem size={16} color="#38bdf8" />
            <span className="exchange-station-title">골드로 보석 환전소</span>
          </div>
          <div className="exchange-station-body">
            <div className="exchange-text-group">
              <span className="exchange-ratio-text">🪙 2,000 골드 → 💎 50 보석</span>
              <span className="exchange-note">사냥 골드를 모아 보석으로 교환하세요</span>
            </div>
            <button
              data-testid="shop-exchange-gems-btn"
              className="btn-game btn-game-wood exchange-press-btn"
              disabled={gold < 2000}
              onClick={() => onBuyGemsWithGold(2000, 50)}
            >
              <span>환전</span>
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
        }

        .merchant-encounter-banner {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .merchant-npc-icon-box {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .merchant-speech-bubble {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .merchant-name {
          font-size: 12px;
          font-weight: 800;
          color: #fef08a;
        }

        .merchant-quote {
          font-size: 11px;
          color: #cbd5e1;
        }

        .chests-parchment-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chest-row-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          gap: 10px;
        }

        .equip-summon-altar-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 14px;
          gap: 10px;
        }

        .summon-altar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .summon-pity-box {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 10px;
          padding: 6px 10px;
        }

        .pity-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #fde68a;
          margin-bottom: 4px;
        }

        .pity-progress-track {
          width: 100%;
          height: 7px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 9999px;
          overflow: hidden;
        }

        .pity-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          border-radius: 9999px;
          transition: width 0.25s ease;
        }

        .summon-rates-section {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 6px 10px;
        }

        .summon-rates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 10px;
          color: #cbd5e1;
          font-weight: 700;
        }

        .rates-title {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .rates-toggle-label {
          font-size: 9.5px;
          color: #94a3b8;
        }

        .summon-rates-pills {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          margin-top: 6px;
        }

        .rate-pill-item {
          background: rgba(10, 15, 28, 0.85);
          border: 1px solid;
          border-radius: 6px;
          padding: 3px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .rate-rarity-name {
          font-size: 9px;
          font-weight: 800;
        }

        .rate-rarity-val {
          font-size: 10px;
          color: #f8fafc;
          font-weight: 900;
        }

        .gem-chest-theme {
          border-color: rgba(239, 68, 68, 0.45);
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.22);
        }

        .skill-summon-theme {
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
        }

        .chest-badge-tag {
          position: absolute;
          top: -7px;
          left: 14px;
          font-size: 9px;
          font-weight: 800;
          color: #fff;
          padding: 1px 7px;
          border-radius: 9999px;
        }
        .free-tag { background: #10b981; }
        .hot-tag { background: #ef4444; }
        .new-tag { background: #a855f7; }

        .skill-summon-btns-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
        }

        .skill-half-btn {
          min-width: 86px;
          min-height: 32px;
          padding: 2px 8px;
          font-size: 10px;
        }

        .chest-visual-box {
          font-size: 2.1rem;
          flex-shrink: 0;
        }

        .chest-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .chest-headline {
          font-size: 13px;
          font-weight: 800;
          color: #f8fafc;
        }

        .chest-subtext {
          font-size: 10px;
          color: #94a3b8;
        }

        .chest-open-btn {
          min-width: 90px;
          min-height: 38px;
          flex-direction: column;
          gap: 1px;
          font-size: 11px;
          padding: 4px 10px;
          flex-shrink: 0;
        }

        .chest-price-text {
          font-size: 10px;
          opacity: 0.9;
        }

        .exchange-station-panel {
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exchange-station-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .exchange-station-title {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .exchange-station-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .exchange-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exchange-ratio-text {
          font-size: 12px;
          font-weight: 800;
          color: #38bdf8;
        }

        .exchange-note {
          font-size: 10px;
          color: #94a3b8;
        }

        .exchange-press-btn {
          min-width: 70px;
          min-height: 36px;
          font-size: 11px;
          padding: 4px 12px;
        }
      `}</style>
    </div>
  );
};
