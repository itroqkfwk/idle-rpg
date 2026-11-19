import React, { useState, useEffect } from 'react';
import { CharacterStats, Equipment, DamageNumberData, CharacterClassId, PromotionId, SkillEffectType } from '../types/game';
import { HeroSkeletalRig } from './HeroSkeletalRig';
import { HeroRigState } from '../data/heroAnimationClips';
import { preloadAllHeroRigAssets } from '../utils/heroRigAssetCache';

export type HeroAnimationState = HeroRigState;

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
  useEffect(() => {
    preloadAllHeroRigAssets();
  }, []);

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
        castingSkillType === 'frost_nova' ||
        castingSkillType === 'mana_burst' ||
        castingSkillType === 'gravity_well' ||
        castingSkillType === 'absolute_zero';
      const isSkySkill =
        castingSkillType === 'chain_lightning' ||
        castingSkillType === 'thunder_strike' ||
        castingSkillType === 'blizzard' ||
        castingSkillType === 'flame_pillar' ||
        castingSkillType === 'meteor' ||
        castingSkillType === 'astral_cataclysm';
      actionClass = isNovaSkill
        ? 'hero-act-mage-cast hero-act-mage-cast-nova'
        : isSkySkill
        ? 'hero-act-mage-cast hero-act-mage-cast-sky'
        : 'hero-act-mage-cast';
    } else {
      const isSlamSkill =
        castingSkillType === 'ground_breaker' ||
        castingSkillType === 'execution' ||
        castingSkillType === 'ragnarok_cleave' ||
        castingSkillType === 'heavenly_blade';
      const isSpinSkill =
        castingSkillType === 'whirlwind' ||
        castingSkillType === 'blade_storm' ||
        castingSkillType === 'phantom_blade';
      const isFortressSkill =
        castingSkillType === 'iron_fortress' ||
        castingSkillType === 'blood_thirst';
      const isBashSkill = castingSkillType === 'shield_bash';
      actionClass = isSlamSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-slam'
        : isSpinSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-spin'
        : isFortressSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-fortress'
        : isBashSkill
        ? 'hero-act-warrior-cast hero-act-warrior-cast-bash'
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

  return (
    <div
      className={`hero-character-box ${isMage ? 'hero-mage-stance' : ''}`}
      data-anim-state={heroAnimState}
      data-class-id={classId}
    >
      {/* 💥 Overhead Player Damage Numbers */}
      <div className="player-damage-anchor-layer">
        {damages &&
          damages.slice(-4).map((dmg, idx) => (
            <div
              key={dmg.id}
              className="player-dmg-pop"
              style={{
                left: `calc(50% + ${dmg.offsetX ?? ((idx % 3) - 1) * 20}px)`,
                top: `${-idx * 16}px`,
              }}
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
        {/* Soft Outer Ambient Ground Shadow (Rig canvas draws precise foot-synced contact shadow) */}
        <div className="character-ground-shadow" style={{ opacity: 0.25 }} />

        {/* Sword Master Golden Radiant Aura (Pure CSS Geometry - Zero Text Emojis) */}
        {isSwordMaster && (
          <div className="swordmaster-aura-ring">
            <div className="sm-aura-glow" />
            <span className="sm-blade-mote mote-1" />
            <span className="sm-blade-mote mote-2" />
          </div>
        )}

        {/* Archmage Cosmic Starlight Aura (Pure CSS Geometry - Zero Text Emojis) */}
        {isArchmage && (
          <div className="archmage-aura-ring">
            <div className="am-cosmic-circle" />
            <span className="am-star-mote mote-1" />
            <span className="am-star-mote mote-2" />
          </div>
        )}

        {/* Real 2D Articulated Skeletal Rig (Using Independent Part PNGs & Original Head Art) */}
        <HeroSkeletalRig
          classId={classId}
          animState={heroAnimState}
          castingSkillType={castingSkillType}
          isAwakeningCasting={isAwakeningCasting}
          isHitStop={Boolean(isHitStop)}
          attackDurationMs={attackDurationMs}
          isMainBattleHero={true}
          fallbackSrc={spriteSrc}
          alt={roleTitle}
        />

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
           ARTICULATED SKELETAL STAGE SIZING (Zero Full-Image Wobble!)
           ========================================================== */
        .hero-skeletal-stage {
          position: absolute;
          bottom: -18px;
          left: -16%;
          height: 128%;
          aspect-ratio: 320 / 290;
          width: auto;
          z-index: 3;
          pointer-events: none;
          will-change: transform;
          transform: translateZ(0);
          contain: layout style;
        }

        .hero-skeletal-canvas {
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
          filter: none !important;
        }

        .hero-fallback-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .hero-hit-while-acting .hero-skeletal-canvas {
          opacity: 0.92;
        }

        .hero-act-hit .hero-skeletal-canvas {
          opacity: 0.9;
        }

        .hero-act-awakening .hero-skeletal-canvas {
          opacity: 1;
        }

        .hero-act-defeat .hero-skeletal-canvas {
          opacity: 0.75;
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

        /* PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .hero-sprite-wrapper {
            height: clamp(230px, 27vh, 340px);
            width: calc(clamp(230px, 27vh, 340px) * 0.9);
          }

          .character-ground-shadow {
            width: calc(clamp(230px, 27vh, 340px) * 0.65);
            height: calc(clamp(230px, 27vh, 340px) * 0.12);
          }
        }
      `}</style>
    </div>
  );
};
