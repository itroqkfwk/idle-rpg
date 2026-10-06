import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment } from '../types/game';

interface PlayerCharacterProps {
  stats: CharacterStats;
  maxHp: number;
  isAttacking: boolean;
  isHit: boolean;
  equippedWeapon?: Equipment;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  stats,
  maxHp,
  isAttacking,
  isHit,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((stats.currentHp / maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  return (
    <div className="hero-character-box">
      {/* Sleek Overhead HP Bar */}
      <div className="combatant-hp-cluster">
        <div className="combatant-name-tag">
          <span className="lvl-badge">Lv.{stats.level}</span>
          <span className="name-text">기사단원</span>
        </div>
        <div className="combatant-hp-track">
          <div className="combatant-hp-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div className="combatant-hp-fill hero-hp-fill" style={{ width: `${hpPercent}%` }} />
        </div>
        <div className="combatant-hp-val">
          {stats.currentHp} / {maxHp}
        </div>
      </div>

      {/* Hero 2D Sprite Body */}
      <div
        className={`hero-sprite-wrapper ${
          isAttacking ? 'hero-act-lunge' : 'hero-act-idle'
        } ${isHit ? 'hero-act-hit' : ''}`}
      >
        {/* Soft Ground Contact Shadow */}
        <div className="character-ground-shadow" />

        {/* Real 2D Anime Knight Sprite */}
        <img
          src="/assets/hero_knight.png"
          alt="Hero Knight"
          className="hero-2d-sprite"
          draggable={false}
        />

        {/* Dynamic Sword Slash Arc */}
        {isAttacking && <div className="hero-slash-arc-vfx" />}
      </div>

      <style>{`
        .hero-character-box {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
        }

        .combatant-hp-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
          z-index: 10;
        }

        .combatant-name-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 3px;
        }

        .lvl-badge {
          background: linear-gradient(135deg, #f59e0b, #b45309);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .name-text {
          font-size: 11px;
          font-weight: 700;
          color: #f1f5f9;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 2px #000;
        }

        .combatant-hp-track {
          position: relative;
          width: 90px;
          height: 8px;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(0, 0, 0, 0.6);
        }

        .combatant-hp-ghost {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #fef08a;
          border-radius: 9999px;
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .combatant-hp-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 9999px;
          transition: width 0.15s ease-out;
        }

        .hero-hp-fill {
          background: linear-gradient(90deg, #10b981 0%, #34d399 70%, #6ee7b7 100%);
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
        }

        .combatant-hp-val {
          font-size: 9px;
          font-weight: 800;
          color: #e2e8f0;
          text-shadow: 0 1px 2px #000, 0 0 3px #000;
          margin-top: 2px;
          letter-spacing: 0.2px;
        }

        .hero-sprite-wrapper {
          position: relative;
          width: 140px;
          height: 160px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-origin: bottom center;
        }

        .character-ground-shadow {
          position: absolute;
          bottom: 2px;
          width: 95px;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        .hero-2d-sprite {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
          z-index: 2;
          pointer-events: none;
        }

        /* ⚔️ Slash Arc Blade Wave VFX */
        .hero-slash-arc-vfx {
          position: absolute;
          top: 25%;
          right: -45px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border-right: 7px solid #ffffff;
          border-top: 5px solid #38bdf8;
          border-bottom: 2px solid transparent;
          border-left: transparent;
          filter: drop-shadow(0 0 12px #38bdf8) drop-shadow(0 0 20px #ffffff);
          animation: slashSweep 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
          z-index: 15;
          pointer-events: none;
        }

        @keyframes slashSweep {
          0% {
            opacity: 0.9;
            transform: scale(0.6) rotate(-45deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.25) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.5) rotate(110deg);
          }
        }

        /* Hero Animations */
        .hero-act-idle {
          animation: heroBreathing 2.2s ease-in-out infinite;
        }

        @keyframes heroBreathing {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.01, 0.99);
          }
        }

        .hero-act-lunge {
          animation: heroLungeAnim 0.22s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        @keyframes heroLungeAnim {
          0% {
            transform: translateX(0) scale(1);
          }
          40% {
            transform: translateX(34px) scale(1.06, 0.96);
          }
          100% {
            transform: translateX(0) scale(1);
          }
        }

        .hero-act-hit {
          animation: heroHurtShake 0.24s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.8)) brightness(1.2);
        }

        @keyframes heroHurtShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
};
