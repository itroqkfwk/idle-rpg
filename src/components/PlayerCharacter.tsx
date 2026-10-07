import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment, DamageNumberData, CharacterClassId, PromotionId, SkillEffectType } from '../types/game';

interface PlayerCharacterProps {
  stats: CharacterStats;
  maxHp: number;
  isAttacking: boolean;
  isHit: boolean;
  isVictory?: boolean;
  equippedWeapon?: Equipment;
  isHitStop?: boolean;
  damages?: DamageNumberData[];
  classId?: CharacterClassId;
  promotion?: PromotionId;
  isCasting?: boolean;
  castingSkillType?: SkillEffectType | null;
  isAwakeningCasting?: boolean;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  stats,
  maxHp,
  isAttacking,
  isHit,
  isVictory = false,
  isHitStop,
  damages,
  classId = 'warrior',
  promotion = 'none',
  isCasting = false,
  castingSkillType,
  isAwakeningCasting = false,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((stats.currentHp / maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  const isMage = classId === 'mage';
  const isSwordMaster = promotion === 'sword_master';
  const isArchmage = promotion === 'archmage';

  const roleTitle = isSwordMaster
    ? '소드 마스터'
    : isArchmage
    ? '아크메이지'
    : isMage
    ? '비전 마법사'
    : '기사단원';

  const spriteSrc = isMage ? './assets/hero_mage.png' : './assets/hero_knight.png';

  // Determine active visual animation state
  let actionClass = 'hero-act-idle';
  if (isAwakeningCasting) {
    actionClass = 'hero-act-awakening';
  } else if (isCasting) {
    actionClass = isMage ? 'hero-act-mage-cast' : 'hero-act-warrior-cast';
  } else if (isVictory) {
    actionClass = 'hero-act-victory';
  } else if (isAttacking) {
    actionClass = isMage ? 'hero-act-mage-attack' : 'hero-act-warrior-attack';
  } else if (isHit) {
    actionClass = 'hero-act-hit';
  }

  return (
    <div className={`hero-character-box ${isMage ? 'hero-mage-stance' : ''}`}>
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
          <span className={`name-text ${promotion !== 'none' ? 'promoted-name-text' : ''}`}>
            {roleTitle}
          </span>
        </div>
        <div className="combatant-hp-track">
          <div className="combatant-hp-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div className="combatant-hp-fill hero-hp-fill" style={{ width: `${hpPercent}%` }} />
        </div>
        <div className="combatant-hp-val">
          {stats.currentHp} / {maxHp}
        </div>
      </div>

      {/* Hero 2D Sprite Body & Aura Layer */}
      <div
        className={`hero-sprite-wrapper ${actionClass} ${
          isHitStop ? 'hit-stop-freeze' : ''
        }`}
      >
        {/* Soft Ground Contact Shadow */}
        <div className={`character-ground-shadow ${isAttacking || isCasting ? 'hero-shadow-lunge' : ''}`} />

        {/* 👑 Sword Master Golden Radiant Aura */}
        {isSwordMaster && (
          <div className="swordmaster-aura-ring">
            <div className="sm-aura-glow" />
            <div className="sm-blade-mote mote-1">⚔️</div>
            <div className="sm-blade-mote mote-2">✨</div>
          </div>
        )}

        {/* ✨ Archmage Cosmic Starlight Aura */}
        {isArchmage && (
          <div className="archmage-aura-ring">
            <div className="am-cosmic-circle" />
            <div className="am-star-mote mote-1">✦</div>
            <div className="am-star-mote mote-2">✨</div>
          </div>
        )}

        {/* Real 2D Anime Sprite */}
        <img
          src={spriteSrc}
          alt={roleTitle}
          className="hero-2d-sprite"
          draggable={false}
        />

        {/* Warrior Basic Slash Arc */}
        {!isMage && isAttacking && <div className="hero-slash-arc-vfx" />}

        {/* Mage Basic Staff Glow / Flare */}
        {isMage && isAttacking && <div className="mage-staff-flare-vfx" />}

        {/* Dash Ground Dust Puff */}
        {(isAttacking || isCasting) && !isMage && <div className="hero-dash-dust" />}

        {/* Casting Magic Circle underneath Hero during Skill Cast */}
        {isCasting && (
          <div className={`hero-cast-magic-circle ${isMage ? 'mage-cast-circle' : 'warrior-cast-circle'}`} />
        )}

        {/* Awakening Explosion Aura */}
        {isAwakeningCasting && (
          <div className="hero-awakening-burst-aura">
            <div className="awakening-shockwave" />
            <div className="awakening-pillar-ray" />
          </div>
        )}

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

        .hero-mage-stance {
          transform: translateX(-10px);
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

        .promoted-name-text {
          color: #fbbf24;
          text-shadow: 0 0 8px rgba(251, 191, 36, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8);
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
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
        }

        .combatant-hp-val {
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          margin-top: 2px;
          text-shadow: 0 1px 2px #000;
        }

        /* 2D Sprite Sizing */
        .hero-sprite-wrapper {
          position: relative;
          height: 195px;
          width: 175px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          will-change: transform;
        }

        .character-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 110px;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 75%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .hero-shadow-lunge {
          transform: scaleX(1.3) translateX(30px);
          opacity: 0.8;
        }

        .hero-2d-sprite {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45));
          z-index: 2;
          pointer-events: none;
        }

        /* Hit Stop Freeze Frame */
        .hit-stop-freeze {
          animation-play-state: paused !important;
          filter: brightness(1.35) contrast(1.15) !important;
        }

        /* --- Aura Styles --- */
        .swordmaster-aura-ring {
          position: absolute;
          inset: -10px;
          pointer-events: none;
          z-index: 1;
        }

        .sm-aura-glow {
          position: absolute;
          bottom: 10px;
          left: 15%;
          width: 70%;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, transparent 70%);
          box-shadow: 0 0 24px rgba(245, 158, 11, 0.5);
          animation: smPulse 1.8s infinite alternate;
        }

        .sm-blade-mote {
          position: absolute;
          font-size: 11px;
          animation: smFloat 2.2s infinite ease-in-out;
        }

        .sm-blade-mote.mote-1 { bottom: 30px; left: 10px; animation-delay: 0s; }
        .sm-blade-mote.mote-2 { bottom: 45px; right: 15px; animation-delay: 1.1s; }

        @keyframes smPulse {
          from { transform: scale(0.9); opacity: 0.6; }
          to { transform: scale(1.15); opacity: 1; }
        }

        @keyframes smFloat {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-16px); opacity: 0.9; }
        }

        .archmage-aura-ring {
          position: absolute;
          inset: -10px;
          pointer-events: none;
          z-index: 1;
        }

        .am-cosmic-circle {
          position: absolute;
          bottom: 8px;
          left: 10%;
          width: 80%;
          height: 35px;
          border-radius: 50%;
          border: 1.5px solid rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.4);
          animation: amSpin 6s linear infinite;
        }

        @keyframes amSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .am-star-mote {
          position: absolute;
          font-size: 12px;
          color: #c084fc;
          text-shadow: 0 0 6px #a855f7;
          animation: amStarFloat 2.4s infinite ease-in-out;
        }

        .am-star-mote.mote-1 { bottom: 40px; left: 15px; animation-delay: 0s; }
        .am-star-mote.mote-2 { bottom: 50px; right: 20px; animation-delay: 1.2s; }

        @keyframes amStarFloat {
          0%, 100% { transform: translateY(0) scale(0.8); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }

        /* --- Slash / Flare VFX --- */
        .hero-slash-arc-vfx {
          position: absolute;
          top: 15%;
          right: -25px;
          width: 105px;
          height: 105px;
          border-radius: 50%;
          border-right: 9px solid #ffffff;
          border-top: 8px solid #67e8f9;
          border-left: 2px solid transparent;
          border-bottom: 1px solid transparent;
          filter: drop-shadow(0 0 12px #38bdf8) drop-shadow(0 0 20px #0284c7);
          z-index: 6;
          pointer-events: none;
          animation: slashArcSweep 0.24s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes slashArcSweep {
          0% { transform: scale(0.3) rotate(-60deg); opacity: 0.3; }
          50% { transform: scale(1.15) rotate(15deg); opacity: 1; }
          100% { transform: scale(1.3) rotate(80deg); opacity: 0; }
        }

        .mage-staff-flare-vfx {
          position: absolute;
          top: 25%;
          right: -15px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #38bdf8 50%, transparent 80%);
          box-shadow: 0 0 20px #38bdf8, 0 0 40px #818cf8;
          z-index: 6;
          animation: mageFlare 0.25s ease-out forwards;
        }

        @keyframes mageFlare {
          0% { transform: scale(0.2); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .hero-dash-dust {
          position: absolute;
          bottom: 4px;
          left: 10px;
          width: 32px;
          height: 14px;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(200, 200, 200, 0.2) 60%, transparent 80%);
          border-radius: 50%;
          animation: dustPuff 0.3s ease-out forwards;
        }

        @keyframes dustPuff {
          0% { transform: scale(0.5) translateX(0); opacity: 0.8; }
          100% { transform: scale(1.5) translateX(-20px); opacity: 0; }
        }

        /* --- Cast Magic Circles --- */
        .hero-cast-magic-circle {
          position: absolute;
          bottom: 2px;
          width: 90px;
          height: 25px;
          border-radius: 50%;
          z-index: 1;
          animation: castCirclePulse 0.5s infinite alternate;
        }

        .warrior-cast-circle {
          border: 2px solid #f59e0b;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
        }

        .mage-cast-circle {
          border: 2px solid #a855f7;
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.8), 0 0 28px rgba(56, 189, 248, 0.6);
        }

        @keyframes castCirclePulse {
          from { transform: scale(0.9); opacity: 0.7; }
          to { transform: scale(1.15); opacity: 1; }
        }

        /* --- Awakening Burst Aura --- */
        .hero-awakening-burst-aura {
          position: absolute;
          inset: -30px;
          pointer-events: none;
          z-index: 10;
        }

        .awakening-shockwave {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid #fbbf24;
          box-shadow: 0 0 30px #f59e0b, inset 0 0 20px #fbbf24;
          animation: shockwaveExpand 0.6s ease-out infinite;
        }

        @keyframes shockwaveExpand {
          0% { transform: translateX(-50%) scale(0.4); opacity: 1; }
          100% { transform: translateX(-50%) scale(1.8); opacity: 0; }
        }

        .awakening-pillar-ray {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 240px;
          background: linear-gradient(180deg, transparent 0%, rgba(251, 191, 36, 0.4) 60%, rgba(255, 255, 255, 0.8) 100%);
          box-shadow: 0 0 30px #f59e0b;
          animation: rayPillarPulse 0.4s infinite alternate;
        }

        @keyframes rayPillarPulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }

        /* --- Actions / Animations --- */
        .hero-act-idle {
          animation: heroBreathing 1.8s ease-in-out infinite;
        }

        @keyframes heroBreathing {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          50% { transform: translateY(-2px) scale(0.995, 1.008); }
        }

        /* Warrior 7-Stage Basic Attack */
        .hero-act-warrior-attack {
          animation: warriorFullAttackAnim 0.52s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes warriorFullAttackAnim {
          0% { transform: translateX(0) translateY(0) scale(1); }
          15% { transform: translateX(-12px) translateY(3px) rotate(-6deg) scale(0.95, 1.05); }
          35% { transform: translateX(78px) translateY(-2px) rotate(9deg) scale(1.1, 0.93); }
          50% { transform: translateX(82px) translateY(0) rotate(12deg) scale(1.05, 0.97); }
          65% { transform: translateX(80px) translateY(0) rotate(10deg) scale(1.03, 0.98); }
          85% { transform: translateX(25px) translateY(0) rotate(2deg) scale(0.98, 1.01); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
        }

        /* Mage Ranged Basic Attack (Zero Forward Dash, Pure Stance Casting) */
        .hero-act-mage-attack {
          animation: mageCastAttackAnim 0.5s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes mageCastAttackAnim {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          20% { transform: translateX(-8px) translateY(-3px) rotate(-4deg) scale(0.96, 1.03); }
          45% { transform: translateX(0px) translateY(-15px) rotate(4deg) scale(1.07, 1.02); }
          68% { transform: translateX(0px) translateY(-10px) rotate(2deg) scale(1.03, 1.0); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
        }

        /* Warrior Skill Cast Pose */
        .hero-act-warrior-cast {
          animation: warriorCastAnim 0.56s cubic-bezier(0.15, 0.9, 0.25, 1) forwards;
        }

        @keyframes warriorCastAnim {
          0% { transform: translateX(0) scale(1); }
          20% { transform: translateX(-14px) translateY(4px) rotate(-8deg) scale(0.93, 1.07); }
          45% { transform: translateX(92px) translateY(-3px) rotate(14deg) scale(1.14, 0.9); }
          72% { transform: translateX(88px) translateY(0) rotate(11deg) scale(1.06, 0.95); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
        }

        /* Mage Skill Cast Pose (Levitation & Magic Focus) */
        .hero-act-mage-cast {
          animation: mageSkillCastAnim 0.58s cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        @keyframes mageSkillCastAnim {
          0% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-20px) rotate(-3deg) scale(1.06, 1.06); filter: brightness(1.25); }
          60% { transform: translateY(-16px) rotate(2deg) scale(1.09, 1.03); filter: brightness(1.35); }
          100% { transform: translateY(0) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* Grand Awakening Animation */
        .hero-act-awakening {
          animation: awakeningHeroAnim 1.2s ease-in-out forwards;
        }

        @keyframes awakeningHeroAnim {
          0% { transform: scale(1) translateY(0); filter: brightness(1); }
          20% { transform: scale(1.1) translateY(-12px); filter: brightness(1.5) drop-shadow(0 0 20px #fbbf24); }
          50% { transform: scale(1.18) translateX(25px) translateY(-22px); filter: brightness(1.65) drop-shadow(0 0 35px #f59e0b); }
          80% { transform: scale(1.08) translateX(15px) translateY(-6px); filter: brightness(1.3); }
          100% { transform: scale(1) translateY(0); filter: brightness(1); }
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

        /* Victory Stance */
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

        .player-damage-anchor-layer {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          pointer-events: none;
        }

        .player-dmg-pop {
          font-size: 14px;
          font-weight: 900;
          color: #ef4444;
          text-shadow: 0 0 6px #000, 0 1px 2px #000;
          animation: playerDmgFly 0.45s ease-out forwards;
        }

        @keyframes playerDmgFly {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          40% { transform: translateY(-12px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-24px) scale(1); opacity: 0; }
        }

        /* 🖥️ PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .hero-sprite-wrapper {
            height: clamp(230px, 27vh, 340px);
            width: calc(clamp(230px, 27vh, 340px) * 0.9);
          }

          .character-ground-shadow {
            width: calc(clamp(230px, 27vh, 340px) * 0.65);
            height: calc(clamp(230px, 27vh, 340px) * 0.12);
          }

          @keyframes warriorFullAttackAnim {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            15% { transform: translateX(-14px) translateY(3px) rotate(-5deg) scale(0.96, 1.04); }
            35% { transform: translateX(clamp(85px, 7vw, 135px)) translateY(-2px) rotate(8deg) scale(1.1, 0.93); }
            50% { transform: translateX(clamp(90px, 7.5vw, 140px)) translateY(0) rotate(11deg) scale(1.05, 0.97); }
            65% { transform: translateX(clamp(88px, 7.3vw, 138px)) translateY(0) rotate(10deg) scale(1.03, 0.98); }
            85% { transform: translateX(30px) translateY(0) rotate(2deg) scale(0.98, 1.01); }
            100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
          }

          @keyframes warriorCastAnim {
            0% { transform: translateX(0) scale(1); }
            20% { transform: translateX(-16px) translateY(4px) rotate(-7deg) scale(0.94, 1.06); }
            45% { transform: translateX(clamp(100px, 8.5vw, 160px)) translateY(-3px) rotate(13deg) scale(1.14, 0.9); }
            72% { transform: translateX(clamp(96px, 8.2vw, 154px)) translateY(0) rotate(10deg) scale(1.06, 0.95); }
            100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
          }
        }
      `}</style>
    </div>
  );
};
