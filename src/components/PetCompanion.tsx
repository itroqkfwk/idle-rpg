import React from 'react';
import { Pet } from '../types/game';
import { PetSkeletalRig } from './PetSkeletalRig';

interface PetCompanionProps {
  pet: Pet | null;
  isAttacking?: boolean;
  isMoving?: boolean;
  isVictory?: boolean;
}

export const PetCompanion: React.FC<PetCompanionProps> = ({
  pet,
  isAttacking = false,
  isMoving = false,
  isVictory = false,
}) => {
  if (!pet) return null;

  const getPetSprite = (p: Pet) => {
    if (p.id === 'pet_fairy' || p.name.includes('요정')) return './assets/ch5_butterfly.png';
    if (p.id === 'pet_slime' || p.name.includes('슬라임')) return './assets/ch5_slime.png';
    if (p.id === 'pet_cat' || p.name.includes('냥이')) return './assets/ch5_fox.png';
    if (p.id === 'pet_dragon' || p.name.includes('드래곤')) return './assets/ch4_spirit.png';
    return './assets/pet_fox.png';
  };

  return (
    <div
      className="pet-companion-box"
      title={`${pet.name} (${pet.description})`}
      data-pet-id={pet.id}
    >
      <div className={`pet-sprite ${isAttacking ? 'pet-attacking-wrap' : 'pet-idle-wrap'}`}>
        {/* Companion Aura Glow */}
        <div className={`pet-aura-ring ${isAttacking ? 'pet-aura-burst' : ''}`} />
        {/* Articulated 2D Pet Skeletal Rig */}
        <PetSkeletalRig
          petId={pet.id}
          petName={pet.name}
          isAttacking={isAttacking}
          isMoving={isMoving}
          isVictory={isVictory}
          isMainBattlePet={true}
          fallbackSrc={getPetSprite(pet)}
          alt={pet.name}
        />
      </div>

      <style>{`
        .pet-companion-box {
          position: absolute;
          bottom: 4px;
          left: -12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 5;
          pointer-events: none;
          user-select: none;
        }

        .pet-sprite {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pet-aura-ring {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%);
          pointer-events: none;
          transition: transform 0.16s ease, opacity 0.16s ease;
        }

        .pet-aura-burst {
          transform: translate(-50%, -50%) scale(1.45);
          background: radial-gradient(circle, rgba(251, 191, 36, 0.55) 0%, rgba(249, 115, 22, 0.25) 55%, transparent 75%);
        }

        .pet-skeletal-stage {
          position: relative;
          width: 78px;
          height: 68px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .pet-2d-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pet-skeletal-canvas {
          filter: none !important;
          display: block;
        }

        @media (min-width: 768px) {
          .pet-companion-box {
            left: clamp(-4px, 0.8vw, 14px);
            bottom: clamp(4px, 0.8vh, 14px);
          }

          .pet-skeletal-stage {
            width: clamp(82px, 9.2vh, 112px);
            height: clamp(72px, 8vh, 98px);
          }
        }
      `}</style>
    </div>
  );
};
