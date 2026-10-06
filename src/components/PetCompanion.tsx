import React from 'react';
import { Pet } from '../types/game';

interface PetCompanionProps {
  pet: Pet | null;
}

export const PetCompanion: React.FC<PetCompanionProps> = ({ pet }) => {
  if (!pet) return null;

  return (
    <div className="pet-companion-box" title={`${pet.name} (${pet.description})`}>
      <div className="pet-sprite anim-pet-bounce">
        {/* Real 2D Flame Fox Sprite */}
        <img
          src="/assets/pet_fox.png"
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
          bottom: 4px;
          left: -28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          pointer-events: none;
          user-select: none;
        }

        .pet-sprite {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pet-2d-sprite {
          width: 68px;
          height: 68px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 6px rgba(249, 115, 22, 0.4));
        }

        .pet-shadow {
          width: 44px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 70%);
          margin-top: -6px;
        }

        .anim-pet-bounce {
          animation: petHop 1.6s ease-in-out infinite;
        }

        @keyframes petHop {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-8px) scale(1.05, 0.95);
          }
          50% {
            transform: translateY(-10px) scale(0.96, 1.04);
          }
          80% {
            transform: translateY(0) scale(1.03, 0.97);
          }
        }
      `}</style>
    </div>
  );
};
