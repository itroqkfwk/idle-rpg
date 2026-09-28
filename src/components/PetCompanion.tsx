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
        <span className="pet-icon">{pet.icon}</span>
        <div className="pet-shadow" />
      </div>

      <style>{`
        .pet-companion-box {
          position: absolute;
          bottom: 12px;
          left: -20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          pointer-events: none;
        }
        .pet-sprite {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pet-icon {
          font-size: 2rem;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
        }
        .pet-shadow {
          width: 22px;
          height: 6px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          margin-top: -4px;
        }
        .anim-pet-bounce {
          animation: petHop 1.4s ease-in-out infinite;
        }
        @keyframes petHop {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-12px) scale(1.08, 0.95);
          }
          50% {
            transform: translateY(-14px) scale(0.95, 1.05);
          }
          80% {
            transform: translateY(0) scale(1.05, 0.95);
          }
        }
      `}</style>
    </div>
  );
};
