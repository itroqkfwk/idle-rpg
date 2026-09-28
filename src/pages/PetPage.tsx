import React from 'react';
import { Pet } from '../types/game';
import { getPetBuffText } from '../data/pets';
import { Check, Lock, ArrowUpRight, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface PetPageProps {
  pets: Pet[];
  activePetId: string | null;
  gems: number;
  gold: number;
  onSelectPet: (petId: string) => void;
  onUnlockPet: (petId: string, costGems: number) => void;
  onUpgradePet: (petId: string, costGold: number) => void;
  onClose?: () => void;
}

export const PetPage: React.FC<PetPageProps> = ({
  pets,
  activePetId,
  gems,
  gold,
  onSelectPet,
  onUnlockPet,
  onUpgradePet,
  onClose,
}) => {
  const getPetUpgradeCost = (pet: Pet) => Math.floor(300 * Math.pow(1.3, pet.level - 1));

  const handleSelect = (pet: Pet) => {
    if (!pet.owned) return;
    sound.playTap();
    onSelectPet(pet.id);
  };

  const handleUnlock = (pet: Pet) => {
    if (gems >= pet.costGems) {
      sound.playFanfare();
      onUnlockPet(pet.id, pet.costGems);
    }
  };

  const handleUpgrade = (pet: Pet) => {
    const cost = getPetUpgradeCost(pet);
    if (gold >= cost) {
      sound.playUpgrade();
      onUpgradePet(pet.id, cost);
    }
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <span>🐾 숲속 정령 펫 동반자</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} color="#fef08a" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        <div className="pet-roster-list">
          {pets.map((pet) => {
            const isActive = activePetId === pet.id;
            const upgradeCost = getPetUpgradeCost(pet);
            const canAffordUpgrade = gold >= upgradeCost;
            const canAffordUnlock = gems >= pet.costGems;

            return (
              <div
                key={pet.id}
                className={`parchment-panel pet-roster-card ${isActive ? 'pet-card-active' : ''} ${
                  !pet.owned ? 'pet-card-locked' : ''
                }`}
              >
                <div className="pet-card-top-row">
                  {/* Avatar Frame */}
                  <div className="pet-plush-avatar">
                    <span className="pet-emoji-sprite">{pet.icon}</span>
                    {!pet.owned && (
                      <div className="pet-lock-badge">
                        <Lock size={14} color="#fff" />
                      </div>
                    )}
                    {isActive && (
                      <div className="pet-active-crest">
                        <Check size={11} color="#fff" />
                        <span>동행</span>
                      </div>
                    )}
                  </div>

                  <div className="pet-info-col">
                    <div className="pet-title-line">
                      <span className="pet-title-name">{pet.name}</span>
                      {pet.owned && <span className="pet-badge-level">Lv.{pet.level}</span>}
                    </div>
                    <div className="pet-buff-callout game-stroke-gold">
                      ⚡ {getPetBuffText(pet)}
                    </div>
                    <div className="pet-lore-text">{pet.description}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pet-action-bottom">
                  {pet.owned ? (
                    <div className="pet-dual-action-row">
                      <button
                        className="btn-game btn-game-wood pet-lvlup-btn"
                        disabled={!canAffordUpgrade}
                        onClick={() => handleUpgrade(pet)}
                      >
                        <ArrowUpRight size={14} />
                        <span className="game-stroke">강화 (🪙 {upgradeCost.toLocaleString()})</span>
                      </button>

                      <button
                        className={`btn-game ${isActive ? 'btn-game-wood active-companion-btn' : 'btn-game-green'} pet-select-btn`}
                        disabled={isActive}
                        onClick={() => handleSelect(pet)}
                      >
                        <span className="game-stroke">{isActive ? '동행 중' : '동행 선택'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-game btn-game-gold pet-summon-btn"
                      disabled={!canAffordUnlock}
                      onClick={() => handleUnlock(pet)}
                    >
                      <span className="game-stroke">정령 계약 해제 (💎 {pet.costGems})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .pet-roster-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pet-roster-card {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .pet-card-active {
          border-color: #f59e0b;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(245, 158, 11, 0.15);
        }

        .pet-card-locked {
          opacity: 0.8;
          filter: grayscale(0.2);
        }

        .pet-card-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pet-plush-avatar {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #322013;
          border: 2px solid #5d3f28;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pet-emoji-sprite {
          font-size: 2.3rem;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
        }

        .pet-lock-badge {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pet-active-crest {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #15803d;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 2px;
          border: 1px solid #86efac;
        }

        .pet-info-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .pet-title-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pet-title-name {
          font-family: var(--font-game);
          font-size: 0.95rem;
          color: #382110;
        }

        .pet-badge-level {
          background: #2e542e;
          color: #86efac;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 6px;
        }

        .pet-buff-callout {
          font-size: 0.78rem;
          color: #b45309;
        }

        .pet-lore-text {
          font-size: 0.7rem;
          color: #785232;
          line-height: 1.25;
        }

        .pet-dual-action-row {
          display: flex;
          gap: 8px;
        }

        .pet-lvlup-btn {
          flex: 1.2;
          min-height: 40px;
          font-size: 0.8rem;
        }

        .pet-select-btn {
          flex: 1;
          min-height: 40px;
          font-size: 0.82rem;
        }

        .active-companion-btn {
          opacity: 0.85;
          color: #86efac;
        }

        .pet-summon-btn {
          width: 100%;
          min-height: 42px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};
