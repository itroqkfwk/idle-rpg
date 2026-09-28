import React, { useState, useEffect } from 'react';
import { Monster } from '../types/game';

interface EnemyCharacterProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
  isAttacking: boolean;
}

export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({
  monster,
  isHit,
  isDefeated,
  isAttacking,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((monster.currentHp / monster.maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  // Render distinct 2D Vector Monster Sprite depending on monster ID or element
  const renderMonsterGraphic = () => {
    if (monster.id.includes('slime') || monster.name.includes('슬라임') || monster.name.includes('정령')) {
      // 🟢 2D Vector Slime (Squash & Stretch with cute highlights)
      return (
        <svg viewBox="0 0 100 100" className="monster-vector-svg">
          <defs>
            <radialGradient id="slime-grad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="55%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>
          {/* Slime Jelly Body */}
          <path
            d="M50 16 C68 16 88 38 88 64 C88 84 74 88 50 88 C26 88 12 84 12 64 C12 38 32 16 50 16 Z"
            fill="url(#slime-grad)"
            stroke="#14532d"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Glossy Highlights */}
          <ellipse cx="38" cy="34" rx="10" ry="5" fill="#ffffff" opacity="0.75" transform="rotate(-20 38 34)" />
          <circle cx="30" cy="45" r="3" fill="#ffffff" opacity="0.6" />

          {/* Cute Mischievous Eyes */}
          <circle cx="42" cy="54" r="5" fill="#14532d" />
          <circle cx="43.5" cy="52.5" r="1.8" fill="#ffffff" />
          <circle cx="64" cy="54" r="5" fill="#14532d" />
          <circle cx="65.5" cy="52.5" r="1.8" fill="#ffffff" />

          {/* Mouth */}
          <path d="M49 64 Q53 69 57 64" stroke="#14532d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    }

    if (monster.id.includes('boss') || monster.isBoss) {
      // 👑 2D Vector Boss (Ancient Mushroom Elder / Dragon Guardian)
      return (
        <svg viewBox="0 0 130 130" className="monster-vector-svg boss-svg">
          <defs>
            <radialGradient id="boss-cap-grad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
            <radialGradient id="crown-gold" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Imperial Boss Crown */}
          <path
            d="M45 28 L52 14 L65 24 L78 14 L85 28 Z"
            fill="url(#crown-gold)"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="52" cy="14" r="2.5" fill="#ef4444" stroke="#451a03" strokeWidth="1" />
          <circle cx="65" cy="24" r="3" fill="#38bdf8" stroke="#451a03" strokeWidth="1" />
          <circle cx="78" cy="14" r="2.5" fill="#ef4444" stroke="#451a03" strokeWidth="1" />

          {/* Huge Boss Mushroom Cap */}
          <path
            d="M20 62 C20 32 110 32 110 62 C110 68 20 68 20 62 Z"
            fill="url(#boss-cap-grad)"
            stroke="#450a0a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Polka Dots */}
          <circle cx="45" cy="46" r="7" fill="#ffffff" opacity="0.85" />
          <circle cx="75" cy="44" r="9" fill="#ffffff" opacity="0.85" />
          <circle cx="95" cy="54" r="5" fill="#ffffff" opacity="0.85" />

          {/* Sturdy Trunk Body */}
          <path
            d="M38 64 C36 94 40 108 44 114 C56 116 74 116 86 114 C90 108 94 94 92 64 Z"
            fill="#faeedd"
            stroke="#451a03"
            strokeWidth="3.5"
          />

          {/* Wise Boss Beard & Grumpy Brows */}
          <path d="M48 76 L58 82 M82 76 L72 82" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          {/* Fierce Glowing Eyes */}
          <circle cx="53" cy="84" r="5" fill="#ef4444" stroke="#451a03" strokeWidth="2" />
          <circle cx="77" cy="84" r="5" fill="#ef4444" stroke="#451a03" strokeWidth="2" />
          <circle cx="54" cy="83" r="1.5" fill="#fff" />
          <circle cx="78" cy="83" r="1.5" fill="#fff" />

          {/* Long Elder Beard */}
          <path d="M56 94 Q65 110 74 94 Q65 104 56 94" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
        </svg>
      );
    }

    // 🍄 Default 2D Mushroom / Forest Creature
    return (
      <svg viewBox="0 0 100 100" className="monster-vector-svg">
        <defs>
          <radialGradient id="mush-cap" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>
        {/* Cap */}
        <path
          d="M16 52 C16 26 84 26 84 52 C84 58 16 58 16 52 Z"
          fill="url(#mush-cap)"
          stroke="#450a0a"
          strokeWidth="3"
        />
        <circle cx="36" cy="38" r="5" fill="#fff" opacity="0.85" />
        <circle cx="60" cy="36" r="6.5" fill="#fff" opacity="0.85" />

        {/* Stem */}
        <path
          d="M32 54 C30 76 34 88 38 92 C46 94 54 94 62 92 C66 88 70 76 68 54 Z"
          fill="#fbf0e0"
          stroke="#382110"
          strokeWidth="3"
        />

        {/* Angry / Cute Face */}
        <line x1="39" y1="64" x2="47" y2="68" stroke="#382110" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="61" y1="64" x2="53" y2="68" stroke="#382110" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="44" cy="72" r="3.5" fill="#1f140a" />
        <circle cx="56" cy="72" r="3.5" fill="#1f140a" />
        <circle cx="45" cy="71" r="1.2" fill="#fff" />
        <circle cx="57" cy="71" r="1.2" fill="#fff" />
      </svg>
    );
  };

  return (
    <div className="monster-character-box">
      {/* 2-Layer Overhead HP Bar with Ghost Lag */}
      <div className={`monster-hp-gauge-container ${monster.isBoss ? 'boss-gauge-width' : ''}`}>
        <div className="monster-name-tag game-stroke">
          <span>{monster.name}</span>
          <span className="monster-hp-nums">{monster.currentHp} / {monster.maxHp}</span>
        </div>
        <div className="hp-track-beveled monster-hp-track">
          <div className="hp-bar-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div
            className={`hp-bar-main ${monster.isBoss ? 'hp-fill-boss' : 'hp-fill-monster'}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Monster Sprite Stage */}
      <div
        className={`monster-sprite-stage ${
          isDefeated ? 'monster-defeat-anim' : isHit ? 'hit-flash-white' : isAttacking ? 'monster-lunge-anim' : 'monster-squash-idle'
        } ${monster.isBoss ? 'boss-scale-box' : ''}`}
      >
        {/* Boss Ground Magik Aura */}
        {monster.isBoss && <div className="boss-magic-ring" />}

        {/* Ground Contact Shadow */}
        <div className="monster-ground-shadow" />

        {/* 2D Vector Sprite */}
        {renderMonsterGraphic()}
      </div>

      <style>{`
        .monster-character-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 15;
        }

        .monster-hp-gauge-container {
          width: 95px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 4px;
        }

        .boss-gauge-width {
          width: 140px;
        }

        .monster-name-tag {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          color: #ffffff;
          line-height: 1.1;
        }

        .monster-hp-nums {
          color: var(--gold-highlight);
          font-size: 0.62rem;
        }

        .monster-hp-track {
          width: 100%;
          height: 10px;
        }

        .monster-sprite-stage {
          position: relative;
          width: 110px;
          height: 115px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.08s ease;
        }

        .boss-scale-box {
          width: 155px;
          height: 155px;
        }

        .monster-vector-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45));
        }

        .monster-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 65px;
          height: 15px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(16, 26, 16, 0.65) 0%, transparent 75%);
          z-index: -1;
        }

        /* 🟢 Squash & Stretch Idle Animation */
        .monster-squash-idle {
          animation: monsterJellyBreathe 1.8s ease-in-out infinite;
        }

        @keyframes monsterJellyBreathe {
          0%, 100% {
            transform: scale(1, 1) translateY(0);
          }
          40% {
            transform: scale(1.08, 0.92) translateY(3px);
          }
          70% {
            transform: scale(0.94, 1.06) translateY(-6px);
          }
        }

        /* Monster Attack Lunge */
        .monster-lunge-anim {
          animation: monsterLungeAction 0.26s ease-in-out;
        }

        @keyframes monsterLungeAction {
          0% { transform: translateX(0); }
          50% { transform: translateX(-28px) scale(1.1, 0.95); }
          100% { transform: translateX(0); }
        }

        /* Monster Defeat Poof */
        .monster-defeat-anim {
          animation: monsterPoofFade 0.4s ease-out forwards;
        }

        @keyframes monsterPoofFade {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          40% { transform: scale(1.3) translateY(-10px); opacity: 0.8; filter: brightness(2); }
          100% { transform: scale(0.2) translateY(20px); opacity: 0; filter: blur(6px); }
        }

        /* Boss Magic Circle */
        .boss-magic-ring {
          position: absolute;
          bottom: -4px;
          width: 120px;
          height: 35px;
          border-radius: 50%;
          border: 2px dashed rgba(244, 63, 94, 0.8);
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
          animation: rotateMagicRing 8s linear infinite;
          z-index: -1;
        }

        @keyframes rotateMagicRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
