import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Gem, Clock, X, Store, Wand2 } from 'lucide-react';
import { CharacterClassId } from '../types/game';
import { sound } from '../utils/audio';

interface ShopPageProps {
  gold: number;
  gems: number;
  freeChestLastOpened: number;
  onOpenFreeChest: () => void;
  onOpenGoldChest: (cost: number) => void;
  onOpenGemChest: (cost: number) => void;
  onBuyGemsWithGold: (goldCost: number, gemGain: number) => void;
  onSummonSkill?: (count: 1 | 10) => void;
  onClose?: () => void;
  classId?: CharacterClassId;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  gold,
  gems,
  freeChestLastOpened,
  onOpenFreeChest,
  onOpenGoldChest,
  onOpenGemChest,
  onBuyGemsWithGold,
  onSummonSkill,
  onClose,
  classId = 'warrior',
}) => {
  const FREE_CHEST_COOLDOWN = 60; // 60 seconds
  const [secondsLeft, setSecondsLeft] = useState(0);

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

  const GOLD_CHEST_COST = 500;
  const GEM_CHEST_COST = 100;

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

  const handleGemChest = () => {
    if (gems >= GEM_CHEST_COST) {
      sound.playFanfare();
      onOpenGemChest(GEM_CHEST_COST);
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
          <span>신비한 숲속 잡화점</span>
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
            <span className="merchant-quote">"오늘 들어온 보물 상자가 아주 실하다네!"</span>
          </div>
        </div>

        {/* Chests Showcase */}
        <div className="chests-parchment-list">
          {/* 1. Free Supply Chest */}
          <div className="parchment-panel chest-row-panel">
            <div className="chest-badge-tag free-tag">무료 보급</div>
            <div className="chest-visual-box">🎁</div>
            <div className="chest-details">
              <span className="chest-headline">모험가 보급 상자</span>
              <span className="chest-subtext">일반 ~ 희귀 장비 & 골드</span>
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

          {/* 2. Gold Chest */}
          <div className="parchment-panel chest-row-panel">
            <div className="chest-visual-box">📦</div>
            <div className="chest-details">
              <span className="chest-headline">골드 장비 상자</span>
              <span className="chest-subtext">일반 ~ 영웅 장비 랜덤 드랍</span>
            </div>
            <button
              className="btn-game btn-game-gold chest-open-btn"
              disabled={gold < GOLD_CHEST_COST}
              onClick={handleGoldChest}
            >
              <span>소환</span>
              <span className="chest-price-text">🪙 {GOLD_CHEST_COST}</span>
            </button>
          </div>

          {/* 3. Gem / Artifact Chest */}
          <div className="parchment-panel chest-row-panel gem-chest-theme">
            <div className="chest-badge-tag hot-tag">HOT! 고등급</div>
            <div className="chest-visual-box">👑💎</div>
            <div className="chest-details">
              <span className="chest-headline">빛나는 유물 상자</span>
              <span className="chest-subtext">희귀 ~ 신화 최고급 장비 출현!</span>
            </div>
            <button
              className="btn-game btn-game-ruby chest-open-btn"
              disabled={gems < GEM_CHEST_COST}
              onClick={handleGemChest}
            >
              <Sparkles size={15} />
              <span>보석 소환</span>
              <span className="chest-price-text">💎 {GEM_CHEST_COST}</span>
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

        .gem-chest-theme {
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.2);
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
        }

        .skill-half-btn {
          min-width: 82px;
          min-height: 32px;
          padding: 2px 6px;
          font-size: 10px;
        }

        .chest-visual-box {
          font-size: 2.2rem;
          flex-shrink: 0;
        }

        .chest-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
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
