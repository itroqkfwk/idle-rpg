import React from 'react';
import { Pet } from '../types/game';
import { getPetBuffText } from '../data/pets';
import { Check, Lock, ArrowUpRight, X, Sparkles } from 'lucide-react';
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

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  const getPetSprite = (p: Pet) => {
    if (p.id.includes('fox') || p.name.includes('여우')) return './assets/pet_fox.png';
    if (p.id.includes('slime') || p.name.includes('슬라임')) return './assets/monster_slime.png';
    if (p.id.includes('fairy') || p.name.includes('요정')) return './assets/monster_spirit.png';
    return './assets/pet_fox.png';
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <span>숲속 정령 펫 동반자</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Active Pet Showcase Pedestal */}
        {activePet && (
          <div className="pet-showcase-pedestal">
            <div className="pedestal-glow-ring" />
            <div className="pedestal-sprite-container">
              <img
                src={getPetSprite(activePet)}
                alt={activePet.name}
                className="pedestal-pet-img"
              />
            </div>
            <div className="pedestal-meta-info">
              <div className="pedestal-title-row">
                <span className="pedestal-pet-name">{activePet.name}</span>
                {activePet.owned && <span className="pedestal-lvl-tag">Lv.{activePet.level}</span>}
              </div>
              <div className="pedestal-buff-badge">
                <Sparkles size={13} color="#f59e0b" />
                <span>{getPetBuffText(activePet)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pet Roster List */}
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
                  <div className="pet-avatar-frame">
                    <img src={getPetSprite(pet)} alt={pet.name} className="pet-thumb-img" />
                    {!pet.owned && (
                      <div className="pet-lock-badge">
                        <Lock size={12} color="#fff" />
                      </div>
                    )}
                    {isActive && (
                      <div className="pet-active-crest">
                        <Check size={10} color="#fff" />
                        <span>동행</span>
                      </div>
                    )}
                  </div>

                  <div className="pet-info-col">
                    <div className="pet-title-line">
                      <span className="pet-title-name">{pet.name}</span>
                      {pet.owned && <span className="pet-badge-level">Lv.{pet.level}</span>}
                    </div>
                    <div className="pet-buff-callout">
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
                        <span>강화 (🪙 {upgradeCost.toLocaleString()})</span>
                      </button>

                      <button
                        className={`btn-game ${isActive ? 'btn-game-wood active-companion-btn' : 'btn-game-green'} pet-select-btn`}
                        disabled={isActive}
                        onClick={() => handleSelect(pet)}
                      >
                        <span>{isActive ? '동행 중' : '동행 선택'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-game btn-game-gold pet-unlock-full-btn"
                      disabled={!canAffordUnlock}
                      onClick={() => handleUnlock(pet)}
                    >
                      <Lock size={14} />
                      <span>소환 해금 (💎 {pet.costGems.toLocaleString()})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

        /* Pedestal Showcase */
        .pet-showcase-pedestal {
          position: relative;
          background: radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 75%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px;
          padding: 16px 12px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .pedestal-glow-ring {
          position: absolute;
          bottom: 46px;
          width: 90px;
          height: 24px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
          border: 1px solid rgba(245, 158, 11, 0.4);
          pointer-events: none;
        }

        .pedestal-sprite-container {
          position: relative;
          width: 84px;
          height: 84px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 6px;
        }

        .pedestal-pet-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 12px rgba(245, 158, 11, 0.4));
          animation: showcasePetFloat 2.2s ease-in-out infinite;
        }

        @keyframes showcasePetFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .pedestal-meta-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .pedestal-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pedestal-pet-name {
          font-size: 14px;
          font-weight: 800;
          color: #f8fafc;
        }

        .pedestal-lvl-tag {
          font-size: 10px;
          font-weight: 800;
          color: #fef08a;
          background: rgba(245, 158, 11, 0.2);
          padding: 1px 6px;
          border-radius: 9999px;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .pedestal-buff-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #fef08a;
          background: rgba(15, 23, 42, 0.6);
          padding: 3px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .pet-roster-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pet-roster-card {
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pet-card-active {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.2);
        }

        .pet-card-locked {
          opacity: 0.75;
        }

        .pet-card-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pet-avatar-frame {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .pet-thumb-img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        .pet-emoji-sprite {
          font-size: 1.6rem;
        }

        .pet-lock-badge {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pet-active-crest {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #10b981;
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          padding: 1px 0;
        }

        .pet-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .pet-title-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pet-title-name {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .pet-badge-level {
          font-size: 10px;
          font-weight: 800;
          color: #10b981;
        }

        .pet-buff-callout {
          font-size: 11px;
          font-weight: 700;
          color: #fef08a;
        }

        .pet-lore-text {
          font-size: 10px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pet-action-bottom {
          display: flex;
        }

        .pet-dual-action-row {
          width: 100%;
          display: flex;
          gap: 6px;
        }

        .pet-lvlup-btn {
          flex: 1;
          min-height: 36px;
          font-size: 11px;
          padding: 4px 8px;
        }

        .pet-select-btn {
          flex: 1;
          min-height: 36px;
          font-size: 11px;
          padding: 4px 8px;
        }

        .active-companion-btn {
          opacity: 0.6;
          cursor: default;
        }

        .pet-unlock-full-btn {
          width: 100%;
          min-height: 36px;
          font-size: 11px;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
};
