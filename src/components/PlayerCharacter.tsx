import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';

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
  equippedWeapon,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((stats.currentHp / maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  // Weapon Glow and Aura based on Rarity
  const weaponRarity = equippedWeapon ? RARITY_CONFIGS[equippedWeapon.rarity] : RARITY_CONFIGS.common;

  return (
    <div className="hero-character-box">
      {/* 2-Layer Overhead HP Bar with Ghost Lag */}
      <div className="hero-hp-gauge-container">
        <div className="hp-track-beveled hero-hp-track">
          <div className="hp-bar-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div className="hp-bar-main hp-fill-hero" style={{ width: `${hpPercent}%` }} />
        </div>
        <div className="hero-hp-text game-stroke">
          {stats.currentHp} / {maxHp}
        </div>
      </div>

      {/* Hero Character Container */}
      <div className={`hero-sprite-stage ${isAttacking ? 'hero-lunge' : 'hero-idle'} ${isHit ? 'hero-hit-shake' : ''}`}>
        {/* Ground Contact Shadow */}
        <div className="hero-ground-shadow" />

        {/* Slash Arc Blade Wave VFX (Triggered during attack) */}
        {isAttacking && <div className="slash-arc-effect" />}

        {/* 2D Vector Adventurer SVG */}
        <svg viewBox="0 0 120 130" className="hero-vector-svg">
          <defs>
            <filter id="weapon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="blade-glow-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor={weaponRarity.color} />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="hair-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8d5b38" />
              <stop offset="100%" stopColor="#4a2e18" />
            </linearGradient>
            <linearGradient id="cape-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#558855" />
              <stop offset="100%" stopColor="#2c522c" />
            </linearGradient>
          </defs>

          {/* Flowing Emerald Cape */}
          <path
            d="M40 55 C30 85 24 105 20 110 C45 116 75 116 95 110 C90 100 85 85 78 55 Z"
            fill="url(#cape-grad)"
            stroke="#1a331a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Character Body / Armor */}
          <rect x="42" y="52" width="34" height="42" rx="10" fill="#e2d6c6" stroke="#23160c" strokeWidth="2.5" />
          
          {/* Leather Belt & Golden Buckle */}
          <rect x="42" y="70" width="34" height="8" fill="#5a3a22" stroke="#23160c" strokeWidth="2" />
          <rect x="54" y="69" width="10" height="10" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

          {/* Sturdy Boots */}
          <rect x="44" y="90" width="12" height="22" rx="5" fill="#3a2414" stroke="#23160c" strokeWidth="2.5" />
          <rect x="62" y="90" width="12" height="22" rx="5" fill="#3a2414" stroke="#23160c" strokeWidth="2.5" />
          {/* Boot Straps */}
          <line x1="44" y1="98" x2="56" y2="98" stroke="#d97706" strokeWidth="2" />
          <line x1="62" y1="98" x2="74" y2="98" stroke="#d97706" strokeWidth="2" />

          {/* Cute Round Head */}
          <circle cx="59" cy="38" r="22" fill="#ffe3cf" stroke="#23160c" strokeWidth="2.5" />

          {/* Voluminous Adventurer Hair */}
          <path
            d="M37 38 C37 18 81 18 81 38 C81 28 72 22 59 22 C46 22 37 28 37 38 Z"
            fill="url(#hair-grad)"
            stroke="#23160c"
            strokeWidth="2.5"
          />
          <path
            d="M37 38 Q42 28 52 32 Q59 24 68 32 Q77 28 81 38"
            fill="url(#hair-grad)"
            stroke="#23160c"
            strokeWidth="2.5"
          />

          {/* Red Adventurer Headband */}
          <path d="M37 34 Q59 31 81 34 L81 40 Q59 37 37 40 Z" fill="#e11d48" stroke="#881337" strokeWidth="2" />
          <circle cx="59" cy="36" r="3" fill="#fef08a" stroke="#78350f" strokeWidth="1" />

          {/* Expressive Anime Eyes with Blinking */}
          <g className="hero-eyes-group">
            {/* Left Eye */}
            <ellipse cx="51" cy="40" rx="3.2" ry="4.5" fill="#23160c" />
            <circle cx="52.2" cy="38.5" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="42" r="0.7" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="67" cy="40" rx="3.2" ry="4.5" fill="#23160c" />
            <circle cx="68.2" cy="38.5" r="1.5" fill="#ffffff" />
            <circle cx="66" cy="42" r="0.7" fill="#ffffff" />
          </g>

          {/* Rosy Cheeks */}
          <circle cx="46" cy="46" r="3.5" fill="#f43f5e" opacity="0.45" />
          <circle cx="72" cy="46" r="3.5" fill="#f43f5e" opacity="0.45" />

          {/* Confident Smirk */}
          <path d="M55 47 Q59 51 63 47" stroke="#7c3a20" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Right Arm & Heroic Weapon with Glow */}
          <g className={`hero-weapon-arm ${isAttacking ? 'weapon-strike-anim' : ''}`}>
            {/* Gauntlet */}
            <rect x="76" y="58" width="10" height="14" rx="4" fill="#8c6242" stroke="#23160c" strokeWidth="2" />
            
            {/* Sword Blade with Rarity Aura */}
            <path
              d="M80 58 L82 12 Q83 6 85 12 L87 58 Z"
              fill="url(#blade-glow-grad)"
              stroke="#23160c"
              strokeWidth="2.5"
              filter="url(#weapon-glow)"
            />
            {/* Sword Fuller Groove */}
            <line x1="84.5" y1="18" x2="84.5" y2="52" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Crossguard & Pommel */}
            <rect x="74" y="58" width="19" height="5" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1.8" />
            <circle cx="83.5" cy="74" r="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      <style>{`
        .hero-character-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 15;
        }

        .hero-hp-gauge-container {
          width: 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin-bottom: 4px;
        }

        .hero-hp-track {
          width: 100%;
          height: 10px;
        }

        .hero-hp-text {
          font-size: 0.68rem;
          color: #ffffff;
          line-height: 1;
        }

        .hero-sprite-stage {
          position: relative;
          width: 120px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-vector-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45));
        }

        .hero-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 70px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(16, 26, 16, 0.65) 0%, transparent 75%);
          z-index: -1;
        }

        /* Idle Breathing Animation */
        .hero-idle {
          animation: heroBreathe 2.4s ease-in-out infinite;
        }

        @keyframes heroBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px) scale(1.02, 0.98); }
        }

        /* Forward Lunge Strike */
        .hero-lunge {
          animation: heroLungeAnim 0.28s ease-in-out forwards;
        }

        @keyframes heroLungeAnim {
          0% { transform: translateX(0) scale(1); }
          30% { transform: translateX(-8px) scale(0.96, 1.04); } /* Anticipation */
          60% { transform: translateX(36px) scale(1.12, 0.94); } /* Strike */
          100% { transform: translateX(0) scale(1); }
        }

        /* Hit Shake */
        .hero-hit-shake {
          animation: heroShakeAnim 0.22s ease-in-out;
        }

        @keyframes heroShakeAnim {
          0%, 100% { transform: translateX(0); filter: none; }
          30% { transform: translateX(-8px); filter: brightness(2) saturate(1.8); }
          70% { transform: translateX(6px); }
        }

        /* Eyes Blink Animation */
        .hero-eyes-group {
          animation: eyeBlink 4s ease-in-out infinite;
          transform-origin: 59px 40px;
        }

        @keyframes eyeBlink {
          0%, 94%, 98%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }

        /* Weapon Strike Arc Animation */
        .weapon-strike-anim {
          transform-origin: 83px 62px;
          animation: swordSlash 0.28s ease-in-out;
        }

        @keyframes swordSlash {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(-35deg); }
          65% { transform: rotate(70deg) translate(6px, -4px); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
