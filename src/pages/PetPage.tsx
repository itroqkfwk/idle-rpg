import React, { useState } from 'react';
import { Pet } from '../types/game';
import { getPetBuffText } from '../data/pets';
import { Check, Lock, ArrowUpRight, X, Sparkles, Swords } from 'lucide-react';
import { sound } from '../utils/audio';
import { PetSkeletalRig } from '../components/PetSkeletalRig';

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

  const [inspectedPetId, setInspectedPetId] = useState<string>(activePetId || pets[0]?.id || 'pet_fox');
  const activePet = pets.find((p) => p.id === inspectedPetId) || pets.find((p) => p.id === activePetId) || pets[0];

  const getPetTheme = (p: Pet) => {
    if (p.id === 'pet_fairy' || p.name.includes('요정')) {
      return { sprite: './assets/ch5_butterfly.png', color: '#38bdf8', coopLabel: '빛가루 마력탄 협동 사격 (골드 보너스)' };
    }
    if (p.id === 'pet_slime' || p.name.includes('슬라임')) {
      return { sprite: './assets/ch5_slime.png', color: '#10b981', coopLabel: '탄성 점프 바디슬램 협동 타격 (공격력 증폭)' };
    }
    if (p.id === 'pet_cat' || p.name.includes('냥이')) {
      return { sprite: './assets/ch5_fox.png', color: '#c084fc', coopLabel: '달빛 질풍 할퀴기 협동 연타 (공격속도 가속)' };
    }
    if (p.id === 'pet_dragon' || p.name.includes('드래곤')) {
      return { sprite: './assets/ch4_spirit.png', color: '#f87171', coopLabel: '루비 브레스 화염구 협동 포격 (치명타 피해 증폭)' };
    }
    return { sprite: './assets/pet_fox.png', color: '#f59e0b', coopLabel: '화염 여우불 협동 급습 (치명타 확률 상승)' };
  };

  const getPetSprite = (p: Pet) => getPetTheme(p).sprite;

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
        {/* Active / Inspected Pet Showcase Pedestal */}
        {activePet && (() => {
          const theme = getPetTheme(activePet);
          const nextPet: Pet = { ...activePet, level: activePet.level + 1 };
          const isCurrentlyEquipped = activePetId === activePet.id;
          return (
            <div
              className="pet-showcase-pedestal"
              data-testid="pet-showcase-pedestal"
              style={{
                borderColor: `${theme.color}66`,
                background: `radial-gradient(circle at 50% 45%, ${theme.color}24 0%, rgba(15, 23, 42, 0.9) 78%)`,
              }}
            >
              <div className="pedestal-glow-ring" style={{ borderColor: `${theme.color}88` }} />
              <div className={`pedestal-sprite-container ${!activePet.owned ? 'icon-silhouette' : ''}`}>
                <PetSkeletalRig
                  petId={activePet.id}
                  petName={activePet.name}
                  isMainBattlePet={false}
                  sceneContext="pet_showcase"
                  fallbackSrc={theme.sprite}
                  alt={activePet.name}
                  className="pedestal-pet-rig"
                />
              </div>
              <div className="pedestal-meta-info">
                <div className="pedestal-title-row">
                  <span className="pedestal-pet-name" style={{ color: theme.color }}>{activePet.name}</span>
                  <span className="pedestal-lvl-tag">
                    {activePet.owned ? `Lv.${activePet.level}` : '미해금'}
                  </span>
                  {isCurrentlyEquipped && (
                    <span className="pedestal-lvl-tag" style={{ background: 'rgba(16,185,129,0.25)', color: '#6ee7b7', borderColor: '#10b981' }}>
                      전투 동행 중
                    </span>
                  )}
                </div>
                <div className="pedestal-buff-badge">
                  <Sparkles size={13} color={theme.color} />
                  <span>
                    {getPetBuffText(activePet)} → <strong style={{ color: '#4ade80' }}>Lv.{activePet.level + 1}: {getPetBuffText(nextPet)}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>
                  <Swords size={11} color={theme.color} />
                  <span>{theme.coopLabel}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Pet Roster List */}
        <div className="pet-roster-list">
          {pets.map((pet) => {
            const isActive = activePetId === pet.id;
            const isInspected = activePet?.id === pet.id;
            const theme = getPetTheme(pet);
            const upgradeCost = getPetUpgradeCost(pet);
            const canAffordUpgrade = gold >= upgradeCost;
            const canAffordUnlock = gems >= pet.costGems;

            return (
              <div
                key={pet.id}
                data-testid={`pet-card-${pet.id}`}
                className={`parchment-panel pet-roster-card ${isActive ? 'pet-card-active' : ''} ${
                  !pet.owned ? 'pet-card-locked' : ''
                }`}
                style={{
                  borderColor: isActive ? '#10b981' : isInspected ? theme.color : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  sound.playTap();
                  setInspectedPetId(pet.id);
                }}
              >
                <div className="pet-card-top-row">
                  {/* Avatar Frame */}
                  <div className="pet-avatar-frame" style={{ borderColor: `${theme.color}66` }}>
                    <img src={theme.sprite} alt={pet.name} className="pet-thumb-img" />
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
                      <span className="pet-title-name" style={{ color: pet.owned ? '#f8fafc' : '#cbd5e1' }}>{pet.name}</span>
                      {pet.owned ? (
                        <span className="pet-badge-level">Lv.{pet.level}</span>
                      ) : (
                        <span className="pet-badge-level" style={{ color: '#94a3b8' }}>미보유</span>
                      )}
                    </div>
                    <div className="pet-buff-callout" style={{ color: theme.color }}>
                      {getPetBuffText(pet)} · {theme.coopLabel.split(' ')[0]} 협동 공격
                    </div>
                    <div className="pet-lore-text">{pet.description}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pet-action-bottom" onClick={(e) => e.stopPropagation()}>
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

        .pedestal-pet-rig {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .pedestal-pet-rig canvas.pet-skeletal-canvas {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: none !important;
        }

        .pedestal-pet-rig img.pet-original-art-sprite,
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
