import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment, DamageNumberData, CharacterClassId, PromotionId, SkillEffectType } from '../types/game';

export type HeroAnimationState =
  | 'Idle'
  | 'Move'
  | 'Attack1'
  | 'Attack2'
  | 'Attack3'
  | 'SkillCast'
  | 'Hit'
  | 'Victory'
  | 'Defeat';

interface PlayerCharacterProps {
  stats: CharacterStats;
  maxHp: number;
  isAttacking: boolean;
  isHit: boolean;
  isVictory?: boolean;
  isDefeated?: boolean;
  isMoving?: boolean;
  attackDurationMs?: number;
  equippedWeapon?: Equipment;
  isHitStop?: boolean;
  damages?: DamageNumberData[];
  classId?: CharacterClassId;
  promotion?: PromotionId;
  isCasting?: boolean;
  castingSkillType?: SkillEffectType | null;
  isAwakeningCasting?: boolean;
  basicComboStep?: 1 | 2 | 3;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  stats,
  maxHp,
  isAttacking,
  isHit,
  isVictory = false,
  isDefeated = false,
  isMoving = false,
  attackDurationMs,
  isHitStop,
  damages,
  classId = 'warrior',
  promotion = 'none',
  isCasting = false,
  castingSkillType = null,
  isAwakeningCasting = false,
  basicComboStep = 1,
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
  const isPromotedActive = promotion !== 'none' && stats.level >= 30;
  const isSwordMaster = isPromotedActive && promotion === 'sword_master';
  const isArchmage = isPromotedActive && promotion === 'archmage';

  const roleTitle = isSwordMaster
    ? '소드 마스터'
    : isArchmage
    ? '아크메이지'
    : isMage
    ? '비전 마법사'
    : '기사단원';

  const spriteSrc = isMage ? './assets/hero_mage.png' : './assets/hero_knight.png';

  // Strict Animation Priority:
  // 1. Defeat > 2. Awakening / SkillCast (obeys weaving lock) > 3. Attack1/2/3 (obeys weaving lock) > 4. Hit > 5. Victory > 6. Move > 7. Idle
  // Note: Hit never cancels an ongoing Attack or SkillCast; instead a non-interrupting hit flash overlay (.hero-hit-while-acting) is applied.
  const resolveAnimState = (): HeroAnimationState => {
    if (isDefeated) return 'Defeat';
    if (isAwakeningCasting || isCasting) return 'SkillCast';
    if (isAttacking) {
      if (basicComboStep === 3) return 'Attack3';
      if (basicComboStep === 2) return 'Attack2';
      return 'Attack1';
    }
    if (isHit) return 'Hit';
    if (isVictory) return 'Victory';
    if (isMoving) return 'Move';
    return 'Idle';
  };

  const heroAnimState = resolveAnimState();
  const isActing =
    heroAnimState === 'Attack1' ||
    heroAnimState === 'Attack2' ||
    heroAnimState === 'Attack3' ||
    heroAnimState === 'SkillCast';
  const isHitDuringAction = isHit && isActing && !isDefeated;

  // Determine active visual animation class
  let actionClass = isMage ? 'hero-act-idle hero-idle-mage' : 'hero-act-idle hero-idle-warrior';
  if (heroAnimState === 'Defeat') {
    actionClass = 'hero-act-defeat';
  } else if (isAwakeningCasting) {
    actionClass = isMage ? 'hero-act-awakening hero-act-awakening-mage' : 'hero-act-awakening hero-act-awakening-warrior';
  } else if (heroAnimState === 'SkillCast') {
    if (isMage) {
      const isNovaSkill =
        castingSkillType === 'meteor' ||
        castingSkillType === 'frost_nova' ||
        castingSkillType === 'mana_burst' ||
        castingSkillType === 'gravity_well' ||
        castingSkillType === 'blizzard';
      actionClass = isNovaSkill ? 'hero-act-mage-cast hero-act-mage-cast-nova' : 'hero-act-mage-cast';
    } else {
      const isSlamSkill =
        castingSkillType === 'ground_breaker' ||
        castingSkillType === 'execution' ||
        castingSkillType === 'ragnarok_cleave';
      const isSpinSkill =
        castingSkillType === 'whirlwind' ||
        castingSkillType === 'blade_storm' ||
        castingSkillType === 'phantom_blade';
      actionClass = isSlamSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-slam'
        : isSpinSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-spin'
        : 'hero-act-warrior-cast';
    }
  } else if (heroAnimState === 'Attack1' || heroAnimState === 'Attack2' || heroAnimState === 'Attack3') {
    actionClass = isMage
      ? `hero-act-mage-attack hero-act-mage-attack-${basicComboStep}`
      : `hero-act-warrior-attack hero-act-warrior-attack-${basicComboStep}`;
  } else if (heroAnimState === 'Hit') {
    actionClass = 'hero-act-hit';
  } else if (heroAnimState === 'Victory') {
    actionClass = 'hero-act-victory';
  } else if (heroAnimState === 'Move') {
    actionClass = 'hero-act-move';
  }

  // Synchronized Ground Shadow State Class
  const getShadowClass = () => {
    if (heroAnimState === 'Defeat') return 'hero-shadow-defeat';
    if (isAwakeningCasting) return 'hero-shadow-awakening';
    if (heroAnimState === 'SkillCast') return isMage ? 'hero-shadow-levitate' : 'hero-shadow-lunge';
    if (heroAnimState === 'Attack3') return isMage ? 'hero-shadow-levitate' : 'hero-shadow-warrior-3';
    if (heroAnimState === 'Attack2') return isMage ? 'hero-shadow-mage-cast' : 'hero-shadow-warrior-2';
    if (heroAnimState === 'Attack1') return isMage ? 'hero-shadow-mage-cast' : 'hero-shadow-lunge';
    if (heroAnimState === 'Move') return 'hero-shadow-move';
    return isMage ? 'hero-shadow-idle-mage' : 'hero-shadow-idle-warrior';
  };

  const defaultAtkDurationSec = isMage
    ? basicComboStep === 3
      ? 0.44
      : basicComboStep === 2
      ? 0.34
      : 0.3
    : basicComboStep === 3
    ? 0.42
    : basicComboStep === 2
    ? 0.32
    : 0.28;

  const computedAtkDurationSec = attackDurationMs
    ? Math.max(0.18, Math.min(0.55, attackDurationMs / 1000))
    : defaultAtkDurationSec;

  const showAfterimage =
    heroAnimState === 'Attack2' ||
    heroAnimState === 'Attack3' ||
    heroAnimState === 'SkillCast';

  return (
    <div
      className={`hero-character-box ${isMage ? 'hero-mage-stance' : ''}`}
      data-anim-state={heroAnimState}
      data-class-id={classId}
    >
      {/* 💥 Overhead Player Damage Numbers */}
      <div className="player-damage-anchor-layer">
        {damages &&
          damages.map((dmg) => (
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
          <span className={`name-text ${isPromotedActive ? 'promoted-name-text' : ''}`}>
            {roleTitle}
          </span>
          {isAttacking && (
            <span className={`combo-step-chip combo-step-${basicComboStep}`}>
              {basicComboStep}타
            </span>
          )}
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
          isHitDuringAction ? 'hero-hit-while-acting' : ''
        } ${isHitStop ? 'hit-stop-freeze' : ''}`}
        data-anim-state={heroAnimState}
        style={
          {
            '--attack-duration': `${computedAtkDurationSec.toFixed(3)}s`,
          } as React.CSSProperties
        }
      >
        {/* Soft Ground Contact Shadow (Synchronized with Jump / Levitation / Lunge) */}
        <div className={`character-ground-shadow ${getShadowClass()}`} />

        {/* 👑 Sword Master Golden Radiant Aura (Pure CSS Geometry - Zero Text Emojis) */}
        {isSwordMaster && (
          <div className="swordmaster-aura-ring">
            <div className="sm-aura-glow" />
            <span className="sm-blade-mote mote-1" />
            <span className="sm-blade-mote mote-2" />
          </div>
        )}

        {/* ✨ Archmage Cosmic Starlight Aura (Pure CSS Geometry - Zero Text Emojis) */}
        {isArchmage && (
          <div className="archmage-aura-ring">
            <div className="am-cosmic-circle" />
            <span className="am-star-mote mote-1" />
            <span className="am-star-mote mote-2" />
          </div>
        )}

        {/* 🔮 Mage Persistent Staff Arcane Glow & Floating Mana Motes */}
        {isMage && (
          <div
            className={`mage-arcane-focus-layer ${
              heroAnimState === 'Attack3' || heroAnimState === 'SkillCast'
                ? 'staff-focus-nova'
                : heroAnimState === 'Attack2'
                ? 'staff-focus-twin'
                : heroAnimState === 'Attack1'
                ? 'staff-focus-bolt'
                : 'staff-focus-idle'
            }`}
          >
            <div className="mage-staff-orb-glow" />
            <span className="mage-idle-mana-mote mana-mote-1" />
            <span className="mage-idle-mana-mote mana-mote-2" />
            <span className="mage-idle-mana-mote mana-mote-3" />
          </div>
        )}

        {/* 👻 Motion Afterimage Ghost Trail (2타 / 3타 / 스킬 시전 시 잔상) */}
        {showAfterimage && (
          <img
            src={spriteSrc}
            alt=""
            aria-hidden="true"
            className={`hero-afterimage-ghost ${isMage ? 'ghost-mage' : 'ghost-warrior'} ${
              heroAnimState === 'Attack3' ? 'ghost-finisher' : ''
            }`}
            draggable={false}
          />
        )}

        {/* Real 2D Anime Sprite (Original PNG 100% Preserved) */}
        <img
          src={spriteSrc}
          alt={roleTitle}
          className="hero-2d-sprite"
          draggable={false}
        />

        {/* Mage Basic Staff Glow / Flare on Attack */}
        {isMage && isAttacking && (
          <div className={`mage-staff-flare-vfx mage-flare-step-${basicComboStep}`} />
        )}

        {/* Dash & Landing Ground Dust Puff */}
        {(isAttacking || isCasting) && !isMage && (
          <div className={`hero-dash-dust ${basicComboStep === 3 ? 'dust-heavy-slam' : ''}`} />
        )}

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

        {/* Pure CSS Geometric Victory Sparkle (Zero Text Emojis) */}
        {isVictory && <div className="hero-victory-sparkle" aria-hidden="true" />}
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

        .combo-step-chip {
          font-size: 9px;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 9999px;
          letter-spacing: 0.3px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        .combo-step-1 {
          background: rgba(56, 189, 248, 0.28);
          border: 1px solid #38bdf8;
          color: #e0f2fe;
        }

        .combo-step-2 {
          background: rgba(251, 191, 36, 0.3);
          border: 1px solid #fbbf24;
          color: #fef08a;
        }

        .combo-step-3 {
          background: linear-gradient(135deg, #f97316, #dc2626);
          border: 1px solid #fde047;
          color: #ffffff;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.7);
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
          transform-origin: 50% 88%;
          will-change: transform, filter;
        }

        /* Synchronized Ground Contact Shadow */
        .character-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 110px;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 75%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
          transition: transform 0.16s ease, opacity 0.16s ease;
        }

        .hero-shadow-idle-warrior {
          animation: shadowIdleWarrior 2.4s ease-in-out infinite;
        }

        @keyframes shadowIdleWarrior {
          0%, 100% { transform: translateX(0) scale(1, 1); opacity: 0.68; }
          40% { transform: translateX(1.5px) scale(0.95, 0.95); opacity: 0.6; }
          75% { transform: translateX(-0.8px) scale(1.03, 1.02); opacity: 0.72; }
        }

        .hero-shadow-idle-mage {
          animation: shadowIdleMage 2.8s ease-in-out infinite;
        }

        @keyframes shadowIdleMage {
          0%, 100% { transform: scale(0.92, 0.9); opacity: 0.56; }
          50% { transform: scale(0.75, 0.74); opacity: 0.36; }
        }

        .hero-shadow-lunge {
          transform: scaleX(1.28) translateX(30px);
          opacity: 0.8;
        }

        .hero-shadow-warrior-2 {
          transform: scale(0.84, 0.8) translateX(38px);
          opacity: 0.5;
        }

        .hero-shadow-warrior-3 {
          animation: shadowWarrior3 var(--attack-duration, 0.42s) ease-out forwards;
        }

        @keyframes shadowWarrior3 {
          0%, 100% { transform: translateX(0) scale(1); opacity: 0.68; }
          36% { transform: translateX(26px) scale(0.56, 0.52); opacity: 0.32; }
          54% { transform: translateX(56px) scale(1.38, 1.18); opacity: 0.9; }
        }

        .hero-shadow-mage-cast {
          transform: translateX(10px) scale(0.86);
          opacity: 0.48;
        }

        .hero-shadow-levitate,
        .hero-shadow-awakening {
          transform: scale(0.64);
          opacity: 0.34;
        }

        .hero-shadow-move {
          transform: translateX(8px) scale(0.94);
          opacity: 0.6;
        }

        .hero-shadow-defeat {
          transform: translateX(-18px) scale(1.15, 0.8);
          opacity: 0.45;
        }

        .hero-2d-sprite {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45));
          transform-origin: 50% 88%;
          z-index: 3;
          pointer-events: none;
        }

        /* Non-interrupting Hit Flash while Hero is mid-attack or mid-skill */
        .hero-hit-while-acting .hero-2d-sprite {
          filter: brightness(2.1) contrast(1.25) drop-shadow(0 0 14px rgba(239, 68, 68, 0.85)) !important;
        }

        /* 👻 Motion Afterimage Ghost Layer */
        .hero-afterimage-ghost {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          z-index: 2;
          opacity: 0;
          transform-origin: 50% 88%;
        }

        .ghost-warrior {
          filter: brightness(1.9) sepia(1) hue-rotate(165deg) saturate(3.5) blur(1.2px);
          animation: afterimageGhostWarrior var(--attack-duration, 0.32s) ease-out forwards;
        }

        .ghost-warrior.ghost-finisher {
          filter: brightness(2.1) sepia(1) hue-rotate(-15deg) saturate(4.5) blur(1.4px);
        }

        .ghost-mage {
          filter: brightness(2.0) sepia(1) hue-rotate(230deg) saturate(4) blur(1.3px);
          animation: afterimageGhostMage var(--attack-duration, 0.34s) ease-out forwards;
        }

        @keyframes afterimageGhostWarrior {
          0% { opacity: 0; transform: translate(0, 0) scale(1); }
          28% { opacity: 0.5; transform: translate(-14px, 4px) scale(0.97, 1.03); }
          65% { opacity: 0.32; transform: translate(-22px, 8px) scale(0.94, 1.05); }
          100% { opacity: 0; transform: translate(-6px, 0) scale(1); }
        }

        @keyframes afterimageGhostMage {
          0% { opacity: 0; transform: translate(0, 0) scale(1); }
          30% { opacity: 0.52; transform: translate(-12px, 6px) scale(1.05); }
          70% { opacity: 0.26; transform: translate(-18px, 10px) scale(1.08); }
          100% { opacity: 0; transform: translate(0, 0) scale(1); }
        }

        /* Hit Stop Freeze Frame */
        .hit-stop-freeze {
          animation-play-state: paused !important;
          filter: brightness(1.35) contrast(1.15) !important;
        }

        /* 🔮 Mage Staff Arcane Glow & Floating Mana Motes (Zero Text Emojis) */
        .mage-arcane-focus-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
        }

        .mage-staff-orb-glow {
          position: absolute;
          top: 24%;
          right: 12%;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224, 242, 254, 0.92) 0%, rgba(56, 189, 248, 0.6) 45%, rgba(168, 85, 247, 0) 75%);
          filter: blur(2px);
          animation: staffOrbPulse 2.0s ease-in-out infinite alternate;
          transition: transform 0.12s ease, filter 0.12s ease;
        }

        .staff-focus-bolt .mage-staff-orb-glow {
          transform: scale(1.55);
          background: radial-gradient(circle, #ffffff 0%, rgba(56, 189, 248, 0.9) 50%, transparent 80%);
          filter: drop-shadow(0 0 10px #38bdf8);
        }

        .staff-focus-twin .mage-staff-orb-glow {
          transform: scale(1.85);
          background: radial-gradient(circle, #ffffff 0%, rgba(192, 132, 252, 0.95) 45%, rgba(56, 189, 248, 0.55) 75%, transparent 95%);
          filter: drop-shadow(0 0 14px #c084fc);
        }

        .staff-focus-nova .mage-staff-orb-glow {
          transform: scale(2.3);
          background: radial-gradient(circle, #ffffff 0%, rgba(250, 204, 21, 0.95) 35%, rgba(168, 85, 247, 0.85) 68%, transparent 95%);
          filter: drop-shadow(0 0 18px #a855f7);
        }

        @keyframes staffOrbPulse {
          0% { transform: scale(0.88); opacity: 0.7; }
          100% { transform: scale(1.18); opacity: 0.98; }
        }

        .mage-idle-mana-mote {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #38bdf8 65%, transparent 100%);
          box-shadow: 0 0 8px #38bdf8;
          opacity: 0.75;
        }

        .mana-mote-1 {
          top: 38%;
          left: 16%;
          animation: floatManaMote 2.6s ease-in-out infinite;
        }

        .mana-mote-2 {
          top: 26%;
          right: 10%;
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, #ffffff 0%, #c084fc 65%, transparent 100%);
          box-shadow: 0 0 8px #c084fc;
          animation: floatManaMote 3.1s ease-in-out 0.7s infinite;
        }

        .mana-mote-3 {
          bottom: 30%;
          right: 20%;
          width: 4px;
          height: 4px;
          animation: floatManaMote 2.3s ease-in-out 1.3s infinite;
        }

        @keyframes floatManaMote {
          0%, 100% { transform: translate(0, 0) scale(0.85); opacity: 0.45; }
          50% { transform: translate(3px, -12px) scale(1.25); opacity: 0.95; }
        }

        /* --- Aura Styles (Pure CSS Geometric Shapes - Zero Text Emojis) --- */
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
          width: 11px;
          height: 11px;
          background: linear-gradient(135deg, #ffffff 0%, #fde047 55%, #f59e0b 100%);
          clip-path: polygon(50% 0%, 66% 34%, 100% 50%, 66% 66%, 50% 100%, 34% 66%, 0% 50%, 34% 34%);
          filter: drop-shadow(0 0 6px #fbbf24);
          animation: smFloat 2.2s infinite ease-in-out;
        }

        .sm-blade-mote.mote-1 { bottom: 30px; left: 10px; animation-delay: 0s; }
        .sm-blade-mote.mote-2 { bottom: 45px; right: 15px; animation-delay: 1.1s; }

        @keyframes smPulse {
          from { transform: scale(0.9); opacity: 0.6; }
          to { transform: scale(1.15); opacity: 1; }
        }

        @keyframes smFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
          50% { transform: translateY(-16px) rotate(45deg); opacity: 0.95; }
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
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #ffffff 0%, #e879f9 55%, #38bdf8 100%);
          clip-path: polygon(50% 0%, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0% 50%, 36% 36%);
          filter: drop-shadow(0 0 6px #a855f7);
          animation: amStarFloat 2.4s infinite ease-in-out;
        }

        .am-star-mote.mote-1 { bottom: 40px; left: 15px; animation-delay: 0s; }
        .am-star-mote.mote-2 { bottom: 50px; right: 20px; animation-delay: 1.2s; }

        @keyframes amStarFloat {
          0%, 100% { transform: translateY(0) scale(0.8) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2) rotate(45deg); opacity: 1; }
        }

        /* --- Slash / Flare VFX --- */
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
          pointer-events: none;
          animation: mageFlare var(--attack-duration, 0.25s) ease-out forwards;
        }

        .mage-flare-step-2 {
          background: radial-gradient(circle, #ffffff 0%, #c084fc 45%, #38bdf8 75%, transparent 90%);
          box-shadow: 0 0 24px #c084fc, 0 0 44px #38bdf8;
        }

        .mage-flare-step-3 {
          width: 68px;
          height: 68px;
          background: radial-gradient(circle, #ffffff 0%, #fde047 35%, #a855f7 68%, transparent 92%);
          box-shadow: 0 0 32px #a855f7, 0 0 56px #fde047;
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
          width: 34px;
          height: 14px;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.65) 0%, rgba(200, 200, 200, 0.25) 60%, transparent 80%);
          border-radius: 50%;
          pointer-events: none;
          animation: dustPuff var(--attack-duration, 0.3s) ease-out forwards;
        }

        .hero-dash-dust.dust-heavy-slam {
          width: 54px;
          height: 20px;
          background: radial-gradient(ellipse, rgba(254, 240, 138, 0.75) 0%, rgba(249, 115, 22, 0.35) 55%, transparent 85%);
        }

        @keyframes dustPuff {
          0% { transform: scale(0.5) translateX(0); opacity: 0.85; }
          100% { transform: scale(1.6) translateX(-24px); opacity: 0; }
        }

        /* --- Cast Magic Circles --- */
        .hero-cast-magic-circle {
          position: absolute;
          bottom: 2px;
          width: 90px;
          height: 25px;
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
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

        /* ==========================================================
           CLASS-DIFFERENTIATED IDLE & MOVE ANIMATIONS
           ========================================================== */
        /* Warrior Idle: Grounded, heavy breathing, subtle weight shift & combat readiness */
        .hero-idle-warrior {
          animation: heroIdleWarrior 2.4s ease-in-out infinite;
        }

        @keyframes heroIdleWarrior {
          0%, 100% { transform: translate(0, 0) scale(1, 1) rotate(0deg); }
          38% { transform: translate(1.5px, -3px) scale(0.992, 1.018) rotate(0.7deg); }
          72% { transform: translate(-0.8px, 1px) scale(1.014, 0.986) rotate(-0.5deg); }
        }

        /* Mage Idle: Gentle arcane levitation, buoyant sway, soft floating rhythm */
        .hero-idle-mage {
          animation: heroIdleMage 2.8s ease-in-out infinite;
        }

        @keyframes heroIdleMage {
          0%, 100% { transform: translate(0, -2px) scale(1, 1) rotate(-0.8deg); }
          50% { transform: translate(2px, -10px) scale(0.988, 1.02) rotate(1.2deg); }
        }

        /* Move State: Brisk forward combat advance step */
        .hero-act-move {
          animation: heroMoveStep 0.36s ease-in-out infinite;
        }

        @keyframes heroMoveStep {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(6px, -6px) rotate(4deg) scale(0.98, 1.03); }
          50% { transform: translate(10px, 0px) rotate(2deg) scale(1.03, 0.97); }
          75% { transform: translate(4px, -4px) rotate(-2deg) scale(0.99, 1.02); }
        }

        /* ==========================================================
           ⚔️ WARRIOR 3-COMBO DISTINCT ATTACK ANIMATIONS
           ========================================================== */
        /* 1타 (횡베기): Short wind-up crouch -> forward dash lunge -> horizontal slash weight shift -> crisp recoil */
        .hero-act-warrior-attack-1 {
          animation: warriorAttack1Anim var(--attack-duration, 0.28s) cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes warriorAttack1Anim {
          0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); }
          20% { transform: translateX(-8px) translateY(3px) rotate(-8deg) scale(1.05, 0.94); }
          44% { transform: translateX(48px) translateY(-2px) rotate(13deg) scale(1.09, 0.93); filter: brightness(1.2); }
          68% { transform: translateX(34px) translateY(1px) rotate(6deg) scale(1.03, 0.97); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); filter: brightness(1); }
        }

        /* 2타 (올려베기): Counter-rotation dip -> upward rising slash -> upper-body lift recoil -> recovery */
        .hero-act-warrior-attack-2 {
          animation: warriorAttack2Anim var(--attack-duration, 0.32s) cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes warriorAttack2Anim {
          0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); }
          24% { transform: translateX(6px) translateY(5px) rotate(11deg) scale(1.06, 0.92); }
          48% {
            transform: translateX(58px) translateY(-16px) rotate(-18deg) scale(0.93, 1.13);
            filter: brightness(1.28) drop-shadow(0 0 12px rgba(251, 191, 36, 0.65));
          }
          74% { transform: translateX(26px) translateY(-6px) rotate(-7deg) scale(0.98, 1.04); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); filter: brightness(1); }
        }

        /* 3타 (지면 강타 & X자 피니시): Power charge -> high aerial leap -> downward ground slam + landing squash -> recovery */
        .hero-act-warrior-attack-3 {
          animation: warriorAttack3Anim var(--attack-duration, 0.42s) cubic-bezier(0.18, 0.9, 0.22, 1) forwards;
        }

        @keyframes warriorAttack3Anim {
          0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); }
          18% {
            /* Power charge compression */
            transform: translateX(-14px) translateY(6px) rotate(-14deg) scale(1.12, 0.87);
            filter: brightness(1.2) drop-shadow(0 0 10px rgba(249, 115, 22, 0.6));
          }
          38% {
            /* High aerial leap */
            transform: translateX(32px) translateY(-36px) rotate(-18deg) scale(0.91, 1.15);
            filter: brightness(1.38) drop-shadow(0 0 16px rgba(249, 115, 22, 0.85));
          }
          54% {
            /* Violent downward ground slam + landing squash compression */
            transform: translateX(84px) translateY(6px) rotate(17deg) scale(1.18, 0.83);
            filter: brightness(1.55) drop-shadow(0 0 22px rgba(239, 68, 68, 0.95));
          }
          76% {
            /* Rebound recoil */
            transform: translateX(38px) translateY(-4px) rotate(4deg) scale(0.97, 1.04);
          }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1, 1); filter: brightness(1); }
        }

        /* ==========================================================
           🔮 MAGE 3-COMBO DISTINCT STANCE CASTING ANIMATIONS
           ========================================================== */
        /* 1타 (비전 볼트): Staff mana gather -> arcane bolt release thrust -> recoil */
        .hero-act-mage-attack-1 {
          animation: mageAttack1Anim var(--attack-duration, 0.3s) cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes mageAttack1Anim {
          0% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
          25% { transform: translateX(-6px) translateY(-5px) rotate(-6deg) scale(0.97, 1.04); filter: brightness(1.2); }
          48% { transform: translateX(18px) translateY(-9px) rotate(9deg) scale(1.06, 0.96); filter: brightness(1.35); }
          76% { transform: translateX(4px) translateY(-3px) rotate(2deg) scale(1.01, 1.0); filter: brightness(1.1); }
          100% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* 2타 (트윈 나선탄): Enhanced dual-hand staff charge -> twin-helix release -> recoil */
        .hero-act-mage-attack-2 {
          animation: mageAttack2Anim var(--attack-duration, 0.34s) cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes mageAttack2Anim {
          0% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
          28% { transform: translateX(-8px) translateY(-10px) rotate(-8deg) scale(0.95, 1.06); filter: brightness(1.25); }
          52% { transform: translateX(22px) translateY(-15px) rotate(12deg) scale(1.09, 0.94); filter: brightness(1.42); }
          78% { transform: translateX(6px) translateY(-6px) rotate(3deg) scale(1.02, 1.0); filter: brightness(1.15); }
          100% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* 3타 (비전 노바): High levitation + mana convergence -> nova orb release -> recoil & landing */
        .hero-act-mage-attack-3 {
          animation: mageAttack3Anim var(--attack-duration, 0.44s) cubic-bezier(0.18, 0.9, 0.25, 1) forwards;
        }

        @keyframes mageAttack3Anim {
          0% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
          30% {
            transform: translateX(-6px) translateY(-28px) rotate(-8deg) scale(0.94, 1.10);
            filter: brightness(1.4) drop-shadow(0 0 16px #c084fc);
          }
          54% {
            transform: translateX(24px) translateY(-20px) rotate(13deg) scale(1.13, 0.92);
            filter: brightness(1.62) drop-shadow(0 0 24px #a855f7);
          }
          80% {
            transform: translateX(6px) translateY(1px) rotate(2deg) scale(1.03, 0.97);
            filter: brightness(1.2);
          }
          100% { transform: translateX(0) translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* Warrior Skill Cast Poses */
        .hero-act-warrior-cast {
          animation: warriorCastAnim 0.48s cubic-bezier(0.15, 0.9, 0.25, 1) forwards;
        }

        .hero-act-warrior-cast-slam {
          animation: warriorAttack3Anim 0.48s cubic-bezier(0.18, 0.9, 0.22, 1) forwards;
        }

        .hero-act-warrior-cast-spin {
          animation: warriorSpinCastAnim 0.48s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }

        @keyframes warriorCastAnim {
          0% { transform: translateX(0) scale(1); }
          20% { transform: translateX(-14px) translateY(4px) rotate(-8deg) scale(0.93, 1.07); }
          45% { transform: translateX(88px) translateY(-4px) rotate(14deg) scale(1.14, 0.9); filter: brightness(1.35); }
          72% { transform: translateX(64px) translateY(0) rotate(9deg) scale(1.06, 0.95); }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); filter: brightness(1); }
        }

        @keyframes warriorSpinCastAnim {
          0% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-10px, 3px) rotate(-12deg) scale(1.06, 0.94); }
          45% { transform: translate(56px, -12px) scaleX(-1) rotate(-10deg) scale(1.12); filter: brightness(1.4) drop-shadow(0 0 16px #fbbf24); }
          72% { transform: translate(62px, -4px) scaleX(1) rotate(12deg) scale(1.08); }
          100% { transform: translate(0, 0) scaleX(1) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* Mage Skill Cast Poses (Levitation & Magic Focus) */
        .hero-act-mage-cast {
          animation: mageSkillCastAnim 0.48s cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        .hero-act-mage-cast-nova {
          animation: mageAttack3Anim 0.48s cubic-bezier(0.18, 0.9, 0.25, 1) forwards;
        }

        @keyframes mageSkillCastAnim {
          0% { transform: translateY(-2px) scale(1); }
          28% { transform: translateY(-22px) rotate(-4deg) scale(1.06, 1.06); filter: brightness(1.3); }
          58% { transform: translateX(16px) translateY(-16px) rotate(6deg) scale(1.10, 0.95); filter: brightness(1.45); }
          100% { transform: translateY(-2px) rotate(0deg) scale(1); filter: brightness(1); }
        }

        /* Grand Awakening Animation */
        .hero-act-awakening {
          animation: awakeningHeroAnim 0.82s ease-in-out forwards;
        }

        @keyframes awakeningHeroAnim {
          0% { transform: scale(1) translateY(0); filter: brightness(1); }
          24% { transform: scale(1.12) translateY(-26px) rotate(-8deg); filter: brightness(1.55) drop-shadow(0 0 22px #fbbf24); }
          54% { transform: scale(1.2) translateX(36px) translateY(-14px) rotate(12deg); filter: brightness(1.8) drop-shadow(0 0 36px #f59e0b); }
          80% { transform: scale(1.06) translateX(14px) translateY(-4px); filter: brightness(1.3); }
          100% { transform: scale(1) translateY(0); filter: brightness(1); }
        }

        /* Hurt Shake Feedback */
        .hero-act-hit {
          animation: heroHurtShake 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.75)) brightness(1.35);
        }

        @keyframes heroHurtShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-10px, 2px) rotate(-5deg) scale(1.04, 0.96); }
          60% { transform: translate(4px, -1px) rotate(2deg); }
          80% { transform: translate(-3px, 0); }
        }

        /* Victory Stance */
        .hero-act-victory {
          animation: heroVictoryHop 0.45s ease-out forwards;
        }

        @keyframes heroVictoryHop {
          0% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-12px) scale(1.06, 0.95); }
          65% { transform: translateY(-4px) scale(0.98, 1.02); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Defeat Stance */
        .hero-act-defeat {
          animation: heroDefeatCollapse 0.5s ease-out forwards;
        }

        @keyframes heroDefeatCollapse {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          35% { transform: translate(-14px, -4px) rotate(-12deg) scale(1.05, 0.95); filter: brightness(2) grayscale(0.4); }
          100% { transform: translate(-22px, 18px) rotate(-24deg) scale(0.92, 0.82); filter: grayscale(0.85) brightness(0.7); opacity: 0.65; }
        }

        /* Pure CSS Geometric Victory Sparkle (Zero Text Emojis) */
        .hero-victory-sparkle {
          position: absolute;
          top: 12px;
          right: 20px;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #f59e0b 100%);
          clip-path: polygon(50% 0%, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0% 50%, 36% 36%);
          filter: drop-shadow(0 0 8px #fbbf24);
          animation: victorySparklePop 0.5s ease-out forwards;
          z-index: 10;
          pointer-events: none;
        }

        @keyframes victorySparklePop {
          0% { transform: scale(0.2) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          100% { transform: scale(0.8) translateY(-12px) rotate(90deg); opacity: 0; }
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

        @media (prefers-reduced-motion: reduce) {
          .hero-idle-warrior,
          .hero-idle-mage,
          .hero-shadow-idle-warrior,
          .hero-shadow-idle-mage {
            animation-duration: 4s;
          }
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
