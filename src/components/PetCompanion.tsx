import React from 'react';
import { Pet } from '../types/game';

interface PetCompanionProps {
  pet: Pet | null;
}

export const PetCompanion: React.FC<PetCompanionProps> = ({ pet }) => {
  if (!pet) return null;

  const getPetSprite = (p: Pet) => {
    if (p.id.includes('fox') || p.name.includes('여우')) return './assets/pet_fox.png';
    if (p.id.includes('fairy') || p.name.includes('요정')) return './assets/monster_spirit.png';
    return './assets/pet_fox.png';
  };

  return (
    <div className="pet-companion-box" title={`${pet.name} (${pet.description})`}>
      <div className="pet-sprite anim-pet-bounce">
        {/* Companion Aura Glow */}
        <div className="pet-aura-ring" />
        {/* Real 2D Companion Sprite */}
        <img
          src={getPetSprite(pet)}
          alt={pet.name}
          className="pet-2d-sprite"
          draggable={false}
        />
        {/* Soft Ground Shadow */}
        <div className="pet-shadow" />
      </div>

      <style>{`
        .pet-companion-box {
          position: absolute;
          bottom: 8px;
          left: 8px;
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
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%);
          filter: blur(4px);
          pointer-events: none;
        }

        .pet-2d-sprite {
          width: 44px;
          height: 44px;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(245, 158, 11, 0.5));
        }

        .pet-shadow {
          width: 32px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, transparent 70%);
          margin-top: -4px;
        }

        .anim-pet-bounce {
          animation: petHop 1.8s ease-in-out infinite;
        }

        @keyframes petHop {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-6px) scale(1.04, 0.96);
          }
          50% {
            transform: translateY(-8px) scale(0.97, 1.03);
          }
          80% {
            transform: translateY(0) scale(1.02, 0.98);
          }
        }

        /* 🖥️ PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .pet-companion-box {
            left: clamp(8px, 1.5vw, 24px);
            bottom: clamp(8px, 1.2vh, 18px);
          }

          .pet-2d-sprite {
            width: clamp(44px, 5.5vh, 64px);
            height: clamp(44px, 5.5vh, 64px);
          }

          .pet-shadow {
            width: clamp(32px, 4vh, 48px);
            height: clamp(8px, 1vh, 12px);
          }
        }
      `}</style>
    </div>
  );
};
