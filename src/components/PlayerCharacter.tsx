import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment, DamageNumberData } from '../types/game';

interface PlayerCharacterProps {
  stats: CharacterStats;
  maxHp: number;
  isAttacking: boolean;
  isHit: boolean;
  isVictory?: boolean;
  equippedWeapon?: Equipment;
  isHitStop?: boolean;
  damages?: DamageNumberData[];
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  stats,
  maxHp,
  isAttacking,
  isHit,
  isVictory = false,
  isHitStop,
  damages,
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
      {/* 💥 Overhead Player Damage Numbers */}
      <div className="player-damage-anchor-layer">
        {damages && damages.map((dmg) => (
          <div
            key={dmg.id}
            className="player-dmg-pop"
            style={{ transform: `translateX(${dmg.offsetX ?? 0}px)` }}
          >
            -{dmg.value.toLocaleString()}
          </div>
        ))}
      </div>

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
          isVictory
            ? 'hero-act-victory'
            : isAttacking
            ? 'hero-act-full-attack'
            : isHit
            ? 'hero-act-hit'
            : 'hero-act-idle'
        } ${isHitStop ? 'hit-stop-freeze' : ''}`}
      >
        {/* Soft Ground Contact Shadow */}
        <div className={`character-ground-shadow ${isAttacking ? 'hero-shadow-lunge' : ''}`} />

        {/* Real 2D Anime Knight Sprite */}
        <img
          src="./assets/hero_knight.png"
          alt="Hero Knight"
          className="hero-2d-sprite"
          draggable={false}
        />

        {/* Dynamic Sword Slash Arc */}
        {isAttacking && <div className="hero-slash-arc-vfx" />}

        {/* Dash Ground Dust Puff */}
        {isAttacking && <div className="hero-dash-dust" />}

        {/* Victory Sparkle */}
        {isVictory && <div className="hero-victory-sparkle">✨</div>}
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
          margin-bottom: 6px;
          z-index: 10;
        }

        .combatant-name-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }

        .lvl-badge {
          background: linear-gradient(135deg, #f59e0b, #b45309);
          color: #ffffff;
          font-size: 9px;
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
          width: 88px;
          height: 6px;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(0, 0, 0, 0.6);
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
          color: #cbd5e1;
          text-shadow: 0 1px 2px #000, 0 0 3px #000;
          margin-top: 2px;
          letter-spacing: 0.2px;
        }

        .player-damage-anchor-layer {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 40;
        }

        .player-dmg-pop {
          color: #ef4444;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 1.25rem;
          font-weight: 900;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 4px #000;
          animation: playerDmgPopAnim 0.45s ease-out forwards;
        }

        @keyframes playerDmgPopAnim {
          0% { opacity: 0; transform: scale(0.5) translateY(10px); }
          20% { opacity: 1; transform: scale(1.15) translateY(-4px); }
          100% { opacity: 0; transform: scale(0.9) translateY(-28px); }
        }

        .hit-stop-freeze {
          animation-play-state: paused !important;
        }

        .hero-sprite-wrapper {
          position: relative;
          width: 175px;
          height: 195px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-origin: bottom center;
        }

        .character-ground-shadow {
          position: absolute;
          bottom: 2px;
          width: 125px;
          height: 22px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .hero-shadow-lunge {
          transform: scale(0.85, 0.75) translateX(45px);
          opacity: 0.45;
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
          top: 15%;
          right: -55px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border-right: 8px solid #ffffff;
          border-top: 6px solid #38bdf8;
          border-bottom: 2px solid transparent;
          border-left: transparent;
          box-shadow: 0 0 20px #38bdf8, 0 0 35px #ffffff, inset 0 0 15px #0284c7;
          filter: drop-shadow(0 0 12px #38bdf8);
          animation: slashSweep 0.14s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
          z-index: 20;
          pointer-events: none;
        }

        @keyframes slashSweep {
          0% {
            opacity: 0.2;
            transform: scale(0.4) rotate(-60deg);
          }
          40% {
            opacity: 1;
            transform: scale(1.2) rotate(25deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.4) rotate(90deg);
          }
        }

        /* 💨 Dash Ground Dust Puff */
        .hero-dash-dust {
          position: absolute;
          bottom: 4px;
          left: -12px;
          width: 28px;
          height: 14px;
          border-radius: 50%;
          background: rgba(180, 160, 130, 0.65);
          filter: blur(2px);
          animation: dashDustPuff 0.3s ease-out forwards;
          z-index: 1;
        }

        @keyframes dashDustPuff {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(1.7) translateX(-12px); opacity: 0; }
        }

        /* Hero Idle Animation: Subtle organic breathing rhythm */
        .hero-act-idle {
          animation: heroBreathing 1.8s ease-in-out infinite;
        }

        @keyframes heroBreathing {
          0%, 100% {
            transform: translateY(0) scale(1, 1);
          }
          50% {
            transform: translateY(-1.5px) scale(0.995, 1.008);
          }
        }

        /* 7-Stage Attack Animation (Anticipation -> Dash -> Swing & Contact -> Hit Stop -> Recovery) */
        .hero-act-full-attack {
          animation: heroFullAttackAnim 0.52s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes heroFullAttackAnim {
          0% {
            transform: translateX(0) scale(1);
          }
          15% {
            /* Anticipation (80ms): pulls back 7px */
            transform: translateX(-7px) rotate(-4deg) scale(0.97, 1.03);
          }
          35% {
            /* Dash (90ms): lunges 60px forward towards monster */
            transform: translateX(60px) rotate(8deg) scale(1.08, 0.94);
          }
          48% {
            /* Weapon Swing & Contact (110ms): sword sweeps right through monster */
            transform: translateX(65px) rotate(11deg) scale(1.04, 0.98);
          }
          65% {
            /* Hit Stop Hold (Peak freeze point) */
            transform: translateX(65px) rotate(10deg) scale(1.03, 0.98);
          }
          100% {
            /* Recovery (180ms): steps back smoothly to origin */
            transform: translateX(0) rotate(0deg) scale(1);
          }
        }

        /* Hurt Shake Feedback */
        .hero-act-hit {
          animation: heroHurtShake 0.16s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.7)) brightness(1.2);
        }

        @keyframes heroHurtShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
        }

        /* Victory Stance Animation */
        .hero-act-victory {
          animation: heroVictoryHop 0.5s ease-out forwards;
        }

        @keyframes heroVictoryHop {
          0% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-12px) scale(1.06, 0.95); }
          65% { transform: translateY(-4px) scale(0.98, 1.02); }
          100% { transform: translateY(0) scale(1); }
        }

        .hero-victory-sparkle {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 16px;
          animation: victorySparklePop 0.5s ease-out forwards;
          z-index: 10;
        }

        @keyframes victorySparklePop {
          0% { transform: scale(0.2); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1) translateY(-10px); opacity: 0; }
        }

        /* 🖥️ PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .hero-sprite-wrapper {
            height: clamp(190px, 22vh, 300px);
            width: calc(clamp(190px, 22vh, 300px) * 0.9);
          }

          .character-ground-shadow {
            width: calc(clamp(190px, 22vh, 300px) * 0.65);
            height: calc(clamp(190px, 22vh, 300px) * 0.12);
          }

          @keyframes heroFullAttack {
            0% { transform: translateX(0) rotate(0deg); }
            15% { transform: translateX(-8px) rotate(-3deg) scale(0.97, 1.03); }
            32% { transform: translateX(clamp(65px, 5.5vw, 95px)) rotate(5deg) scale(1.08, 0.94); }
            48% { transform: translateX(clamp(65px, 5.5vw, 95px)) rotate(11deg) scale(1.04, 0.98); }
            65% { transform: translateX(clamp(65px, 5.5vw, 95px)) rotate(10deg) scale(1.03, 0.98); }
            100% { transform: translateX(0) rotate(0deg) scale(1); }
          }
        }
      `}</style>
    </div>
  );
};
