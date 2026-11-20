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
      <div className={`pet-sprite ${isAttacking ? 'anim-pet-attack' : 'anim-pet-bounce'}`}>
        {/* Companion Aura Glow */}
        <div className={`pet-aura-ring ${isAttacking ? 'pet-aura-burst' : ''}`} />
        {/* Original 2D Companion Sprite with Live Co-op Anchor Publishing */}
        <PetSkeletalRig
          petId={pet.id}
          petName={pet.name}
          isAttacking={isAttacking}
          isMoving={isMoving}
          isVictory={isVictory}
          isMainBattlePet={true}
          renderMode="original_art"
          fallbackSrc={getPetSprite(pet)}
          alt={pet.name}
        />
        {/* Soft Ground Shadow */}
        <div className="pet-shadow" />
      </div>

      <style>{`
        .pet-companion-box {
          position: absolute;
          bottom: 4px;
          left: -4px;
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
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.24) 0%, transparent 70%);
          pointer-events: none;
          transition: transform 0.16s ease, opacity 0.16s ease;
        }

        .pet-aura-burst {
          transform: translate(-50%, -50%) scale(1.45);
          background: radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(249, 115, 22, 0.28) 55%, transparent 75%);
        }

        .pet-skeletal-stage {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .pet-2d-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        canvas.pet-skeletal-canvas {
          filter: none !important;
          display: block;
        }

        img.pet-original-art-sprite {
          display: block;
        }

        .pet-shadow {
          width: 34px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, transparent 70%);
          margin-top: -3px;
        }

        .anim-pet-bounce {
          animation: petHop 1.9s ease-in-out infinite;
        }

        .anim-pet-attack {
          animation: petAttackLunge 0.38s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes petAttackLunge {
          0% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(20px, -12px) rotate(8deg) scale(1.14); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes petHop {
          0%, 100% { transform: translateY(0) scale(1); }
          45% { transform: translateY(-6px) scale(0.98, 1.02); }
          80% { transform: translateY(0) scale(1.01, 0.99); }
        }

        @media (min-width: 768px) {
          .pet-companion-box {
            left: clamp(-2px, 0.8vw, 12px);
            bottom: clamp(4px, 0.8vh, 12px);
          }

          .pet-skeletal-stage {
            width: clamp(54px, 6.4vh, 72px);
            height: clamp(54px, 6.4vh, 72px);
          }

          .pet-shadow {
            width: clamp(36px, 4.2vh, 48px);
            height: clamp(8px, 1vh, 11px);
          }
        }
      `}</style>
    </div>
  );
};
