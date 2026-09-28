import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Gem, Clock, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShopPageProps {
  gold: number;
  gems: number;
  freeChestLastOpened: number;
  onOpenFreeChest: () => void;
  onOpenGoldChest: (cost: number) => void;
  onOpenGemChest: (cost: number) => void;
  onBuyGemsWithGold: (goldCost: number, gemGain: number) => void;
  onClose?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  gold,
  gems,
  freeChestLastOpened,
  onOpenFreeChest,
  onOpenGoldChest,
  onOpenGemChest,
  onBuyGemsWithGold,
  onClose,
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
          <span>🎁 신비한 숲속 잡화점</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} color="#fef08a" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Squirrel Merchant Banner */}
        <div className="merchant-encounter-banner">
          <span className="merchant-npc-icon">🐿️</span>
          <div className="merchant-speech-bubble">
            <span className="merchant-name">잡화점 상인 도토리</span>
            <span className="merchant-quote">"오늘 들어온 보물 상자가 아주 실하다네!"</span>
          </div>
        </div>

        {/* Chests Showcase */}
        <div className="chests-parchment-list">
          {/* 1. Free Supply Chest */}
          <div className="parchment-panel chest-row-panel free-chest-theme">
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
                  <Gift size={16} />
                  <span className="game-stroke">무료 개봉</span>
                </>
              ) : (
                <>
                  <Clock size={16} />
                  <span className="game-stroke">{secondsLeft}초 대기</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Gold Chest */}
          <div className="parchment-panel chest-row-panel gold-chest-theme">
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
              <span className="game-stroke">소환</span>
              <span className="chest-price-text game-stroke">🪙 {GOLD_CHEST_COST}</span>
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
              <span className="game-stroke">보석 소환</span>
              <span className="chest-price-text game-stroke">💎 {GEM_CHEST_COST}</span>
            </button>
          </div>
        </div>

        {/* Currency Exchange Station */}
        <div className="parchment-panel exchange-station-panel">
          <div className="exchange-station-header">
            <Gem size={18} color="#0284c7" />
            <span className="exchange-station-title">골드로 보석 환전</span>
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
              <span className="game-stroke">환전</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .merchant-encounter-banner {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 14px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .merchant-npc-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .merchant-speech-bubble {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .merchant-name {
          font-family: var(--font-game);
          font-size: 0.85rem;
          color: #fef08a;
        }

        .merchant-quote {
          font-size: 0.72rem;
          color: #d4bda8;
          font-style: italic;
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

        .chest-badge-tag {
          position: absolute;
          top: -8px;
          left: 14px;
          font-family: var(--font-game);
          font-size: 0.62rem;
          color: #fff;
          padding: 1px 7px;
          border-radius: 6px;
          border: 1px solid #fff;
        }
        .free-tag { background: #15803d; }
        .hot-tag { background: #be123c; }

        .chest-visual-box {
          font-size: 2.4rem;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
          flex-shrink: 0;
        }

        .chest-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .chest-headline {
          font-family: var(--font-game);
          font-size: 0.95rem;
          color: #382110;
        }

        .chest-subtext {
          font-size: 0.7rem;
          color: #785232;
        }

        .chest-open-btn {
          min-width: 95px;
          min-height: 44px;
          flex-direction: column;
          gap: 1px;
          padding: 4px 10px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .chest-price-text {
          font-size: 0.68rem;
        }

        .exchange-station-panel {
          padding: 12px 14px;
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
          font-family: var(--font-game);
          font-size: 0.9rem;
          color: #382110;
        }

        .exchange-station-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .exchange-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exchange-ratio-text {
          font-family: var(--font-game);
          font-size: 0.82rem;
          color: #1e3a8a;
        }

        .exchange-note {
          font-size: 0.68rem;
          color: #785232;
        }

        .exchange-press-btn {
          min-height: 38px;
          padding: 6px 16px;
          font-size: 0.82rem;
        }
      `}</style>
    </div>
  );
};
