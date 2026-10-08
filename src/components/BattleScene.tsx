import React from 'react';
import {
  CharacterStats,
  Equipment,
  Monster,
  Pet,
  StageState,
  DamageNumberData,
  Skill,
  SkillEffectType,
  Quest,
  CharacterClassId,
  PromotionId,
} from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';
import { PlayerCharacter } from './PlayerCharacter';
import { EnemyCharacter } from './EnemyCharacter';
import { PetCompanion } from './PetCompanion';
import { DamageNumbers } from './DamageNumbers';
import { SkillVfxLayer } from './SkillVfxLayer';
import { SkillStatusHUD } from './SkillStatusHUD';
import { BattleFxCanvas } from './BattleFxCanvas';
import { getStageEnvironment } from '../data/stages';
import { Swords, Skull, Flame } from 'lucide-react';

export interface FloatingGoldDrop {
  id: string;
  gold: number;
}

export interface LootAlertData {
  id: string;
  item: Equipment;
}

interface BattleSceneProps {
  stats: CharacterStats;
  maxHp: number;
  monster: Monster;
  stage: StageState;
  activePet: Pet | null;
  equippedWeapon?: Equipment;
  isPlayerAttacking: boolean;
  isMonsterAttacking: boolean;
  isPlayerHit: boolean;
  isMonsterHit: boolean;
  isMonsterDefeated: boolean;
  damages: DamageNumberData[];
  onChallengeBoss: () => void;
  onRetreatToNormal: () => void;
  floatingGold?: FloatingGoldDrop[];
  lootAlert?: LootAlertData | null;
  stageNotice?: string | null;
  cpDelta?: { value: number; delta: number } | null;
  isHitStop?: boolean;
  screenShake?: 'none' | 'normal' | 'crit' | 'boss';
  skills?: Skill[];
  equippedSkillIds?: (string | null)[];
  skillCooldowns?: Record<string, number>;
  activeSkillVfx?: { id: string; type: SkillEffectType } | null;
  castingSkillId?: string | null;
  activeQuest?: Quest | null;
  onClaimQuest?: (questId: string) => void;
  classId?: CharacterClassId;
  promotion?: PromotionId;
  isCasting?: boolean;
  castingSkillType?: SkillEffectType | null;
  isAwakeningCasting?: boolean;
  awakeningUnlocked?: boolean;
  awakeningGauge?: number;
  awakeningSkill?: Skill | null;
}

export const BattleScene: React.FC<BattleSceneProps> = ({
  stats,
  maxHp,
  monster,
  stage,
  activePet,
  equippedWeapon,
  isPlayerAttacking,
  isMonsterAttacking,
  isPlayerHit,
  isMonsterHit,
  isMonsterDefeated,
  damages,
  onChallengeBoss,
  onRetreatToNormal,
  floatingGold,
  lootAlert,
  stageNotice,
  cpDelta,
  isHitStop,
  screenShake,
  skills,
  equippedSkillIds,
  skillCooldowns,
  activeSkillVfx,
  castingSkillId,
  activeQuest,
  onClaimQuest,
  classId = 'warrior',
  promotion = 'none',
  isCasting = false,
  castingSkillType = null,
  isAwakeningCasting = false,
  awakeningUnlocked = false,
  awakeningGauge = 0,
  awakeningSkill = null,
}) => {
  const isBossFight = stage.stage === 10 && stage.inBossFight;
  const stageEnv = getStageEnvironment(stage.chapter, stage.stage, isBossFight);

  return (
    <div className={`battle-environment-root ${isBossFight ? 'boss-battle-mode' : ''}`}>
      {/* 🌲 Dynamic 2D Painted Environment Panorama Backdrop */}
      <div className="battle-bg-container" style={{ filter: stageEnv.filterStyle }}>
        <img
          key={stageEnv.bgImage}
          src={stageEnv.bgImage}
          alt={stageEnv.areaName}
          className="battle-bg-image"
          draggable={false}
        />

        {/* ☀️ Dynamic Sunlight / Mystic Fog Streaming Overlay */}
        <div className="god-rays-overlay" style={{ background: stageEnv.fogGradient }} />

        {/* 🍃 Ambient Leaves / Orbs / Embers rendered via GPU Canvas in BattleFxCanvas */}

        {/* ✨ Ambient Fireflies & Glowing Motes */}
        {(stageEnv.ambientParticleType === 'fireflies' || stageEnv.ambientParticleType === 'water_orbs') && (
          <div className="ambient-fireflies">
            <div className="firefly firefly-1" />
            <div className="firefly firefly-2" />
            <div className="firefly firefly-3" />
            <div className="firefly firefly-4" />
          </div>
        )}

        {/* 🌿 Foreground Foliage Vignette (Cinematic Depth) */}
        <div className="foreground-bush bush-left" />
        <div className="foreground-bush bush-right" />

        {/* 🌿 Atmospheric Silhouette Contrast Overlay */}
        <div className="battle-ground-vignette" />

        {/* 🩸 Boss Encounter Crimson Pulse Vignette */}
        {isBossFight && <div className="boss-vignette-pulse" />}
      </div>

      {/* 🔮 Lightweight HTML5 Canvas 2D Projectiles & Impact Bursts */}
      <BattleFxCanvas
        activeSkillVfx={activeSkillVfx ?? null}
        isAwakeningCasting={isAwakeningCasting}
        classId={classId}
        isPlayerAttacking={isPlayerAttacking}
        isMonsterHit={isMonsterHit}
        ambientType={stageEnv.ambientParticleType}
      />

      {/* ⚡ Combat Power Growth Chip */}
      {cpDelta && (
        <div className="battle-cp-delta-chip">
          <span className="cp-chip-icon">⚡</span>
          <span className="cp-chip-label">전투력</span>
          <span className="cp-chip-val">{cpDelta.value.toLocaleString()}</span>
          <span className="cp-chip-up">▲ +{cpDelta.delta.toLocaleString()}</span>
        </div>
      )}

      {/* 🌟 Stage/Chapter Transition Notice */}
      {stageNotice && (
        <div className="battle-stage-notice-banner">
          <span>{stageNotice}</span>
        </div>
      )}

      {/* ⚔️ Loot Drop Alert Banner */}
      {lootAlert && (
        <div
          className="battle-loot-alert-banner"
          style={{
            borderColor: RARITY_CONFIGS[lootAlert.item.rarity].borderColor,
            boxShadow: `0 4px 16px ${RARITY_CONFIGS[lootAlert.item.rarity].glowColor}`,
          }}
        >
          <span className="loot-sparkle">✨</span>
          <span className="loot-text" style={{ color: RARITY_CONFIGS[lootAlert.item.rarity].color }}>
            [{lootAlert.item.icon} {lootAlert.item.name}] 획득!
          </span>
        </div>
      )}

      {/* 🔮 Layer 5.8: Skill Visual Effects Layer */}
      <SkillVfxLayer
        activeSkillVfx={activeSkillVfx ?? null}
        isAwakeningCasting={isAwakeningCasting}
        classId={classId}
      />

      {/* ⚔️ Main Combat Arena Stage */}
      <div className={`combat-arena-stage ${screenShake && screenShake !== 'none' ? `shake-${screenShake}` : ''}`}>
        {/* Left Side: Adventurer Hero & Companion Pet */}
        <div className="combatant-slot hero-slot">
          <PlayerCharacter
            stats={stats}
            maxHp={maxHp}
            isAttacking={isPlayerAttacking}
            isHit={isPlayerHit}
            isVictory={isMonsterDefeated}
            equippedWeapon={equippedWeapon}
            isHitStop={isHitStop}
            damages={damages.filter((d) => d.isPlayer)}
            classId={classId}
            promotion={promotion}
            isCasting={isCasting}
            castingSkillType={castingSkillType}
            isAwakeningCasting={isAwakeningCasting}
          />
          <PetCompanion pet={activePet} />
        </div>

        {/* Center: Boss Encounter Alert Badge */}
        {isBossFight && (
          <div className="arena-center-banner">
            <div className="boss-alert-badge">
              <Skull size={15} color="#ef4444" />
              <span>BOSS RAID</span>
              <Flame size={15} color="#f97316" />
            </div>
          </div>
        )}

        {/* Right Side: Monster Sprite & Floating Gold Drops */}
        <div className="combatant-slot enemy-slot">
          {floatingGold && floatingGold.map((drop) => (
            <div key={drop.id} className="floating-gold-drop">
              +{drop.gold.toLocaleString()} <span className="gold-coin-glyph">🪙</span>
            </div>
          ))}
          <EnemyCharacter
            monster={monster}
            isHit={isMonsterHit}
            isDefeated={isMonsterDefeated}
            isAttacking={isMonsterAttacking}
            isHitStop={isHitStop}
            damages={damages.filter((d) => !d.isPlayer)}
          />
        </div>
      </div>

      {/* 🔮 Live Auto Skill Status HUD */}
      <SkillStatusHUD
        skills={skills ?? []}
        equippedSkillIds={equippedSkillIds ?? []}
        skillCooldowns={skillCooldowns ?? {}}
        castingSkillId={castingSkillId}
        awakeningUnlocked={awakeningUnlocked}
        awakeningGauge={awakeningGauge}
        isAwakeningCasting={isAwakeningCasting}
        promotion={promotion}
        awakeningSkill={awakeningSkill}
      />

      {/* Floating Bottom Status / Boss Trigger Overlay */}
      <div className="battle-bottom-floating-bar">
        {stage.stage === 10 && !stage.inBossFight && (
          <button className="floating-boss-btn" onClick={onChallengeBoss}>
            <Skull size={17} color="#ffffff" />
            <span>보스 소환 도전 (Boss Battle)</span>
          </button>
        )}

        {stage.stage === 10 && stage.inBossFight && (
          <button className="floating-retreat-btn" onClick={onRetreatToNormal}>
            <span>일반 사냥으로 후퇴</span>
          </button>
        )}

        {stage.stage < 10 && (
          <div className="floating-auto-hunt-pill">
            <span className="pulse-hunting-dot" />
            <Swords size={12} color="#94a3b8" />
            <span>자동 사냥 진행 중...</span>
          </div>
        )}
      </div>

      <style>{`
        .battle-environment-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          user-select: none;
        }

        .battle-bg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .battle-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          transform: scale(1.03);
          transition: filter 0.5s ease;
        }

        .boss-battle-mode .battle-bg-image {
          filter: brightness(0.82) contrast(1.15) saturate(1.1);
        }

        /* ☀️ Sunlight Godrays */
        .god-rays-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(254, 240, 138, 0.18) 0%, rgba(254, 240, 138, 0.05) 35%, transparent 60%);
          pointer-events: none;
        }

        /* 🍃 Falling Leaves Animation */
        .floating-leaves-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .falling-leaf {
          position: absolute;
          font-size: 14px;
          opacity: 0.7;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          animation: leafDrift linear infinite;
        }

        .leaf-1 { top: -20px; left: 15%; animation-duration: 7s; animation-delay: 0s; }
        .leaf-2 { top: -20px; left: 45%; animation-duration: 9s; animation-delay: 2.5s; font-size: 12px; }
        .leaf-3 { top: -20px; left: 75%; animation-duration: 8s; animation-delay: 4s; }
        .leaf-4 { top: -20px; left: 90%; animation-duration: 10s; animation-delay: 1s; font-size: 11px; }

        @keyframes leafDrift {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translate(60px, 580px) rotate(360deg);
            opacity: 0;
          }
        }

        /* ✨ Fireflies */
        .ambient-fireflies {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fef08a;
          box-shadow: 0 0 8px 3px rgba(254, 240, 138, 0.85);
          animation: fireflyFloat 4.5s ease-in-out infinite;
        }

        .firefly-1 { top: 35%; left: 22%; animation-delay: 0s; }
        .firefly-2 { top: 48%; left: 78%; animation-delay: 1.8s; }
        .firefly-3 { top: 58%; left: 42%; animation-delay: 3s; }
        .firefly-4 { top: 25%; left: 65%; animation-delay: 2.2s; }

        @keyframes fireflyFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(10px, -14px); opacity: 0.95; }
        }

        /* 🌿 Foreground Foliage Framing */
        .foreground-bush {
          position: absolute;
          bottom: 0px;
          width: 105px;
          height: 70px;
          border-radius: 50% 50% 0 0;
          background: radial-gradient(ellipse at center, rgba(16, 44, 20, 0.72) 0%, transparent 80%);
          filter: blur(5px);
          pointer-events: none;
          z-index: 8;
          animation: bushWindSway 6s ease-in-out infinite alternate;
        }

        .bush-left { left: -30px; }
        .bush-right { right: -30px; animation-delay: -3s; }

        @keyframes bushWindSway {
          0% { transform: skewX(-2deg); }
          100% { transform: skewX(3deg); }
        }

        /* Boss Vignette Pulse */
        .boss-vignette-pulse {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 90px rgba(185, 28, 28, 0.5);
          pointer-events: none;
          animation: vignettePulse 2.5s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes vignettePulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }

        /* ⚔️ Combat Arena Stage - Elevated Baseline onto Forest Pathway */
        .combat-arena-stage {
          position: relative;
          z-index: 6;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
          padding: 0 12px 170px 12px;
          box-sizing: border-box;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        .combatant-slot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-slot {
          align-self: flex-end;
          width: 175px;
          flex-shrink: 0;
        }

        .enemy-slot {
          align-self: flex-end;
          width: 165px;
          flex-shrink: 0;
        }

        /* Scoped Screen Shake on Battle Stage Only */
        @keyframes scopedShakeNormal {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 0.8px); }
          50% { transform: translate(1px, -0.8px); }
          75% { transform: translate(-0.6px, -0.5px); }
        }

        @keyframes scopedShakeCrit {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2.5px, 1.8px); }
          40% { transform: translate(2.5px, -1.8px); }
          60% { transform: translate(-1.8px, -1.2px); }
          80% { transform: translate(1.2px, 1.2px); }
        }

        @keyframes scopedShakeBoss {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3.5px, 2.5px); }
          40% { transform: translate(3.5px, -2.5px); }
          60% { transform: translate(-2.5px, -2px); }
          80% { transform: translate(2px, 1.5px); }
        }

        .shake-normal {
          animation: scopedShakeNormal 0.12s ease-out;
        }

        .shake-crit {
          animation: scopedShakeCrit 0.16s ease-out;
        }

        .shake-boss {
          animation: scopedShakeBoss 0.22s ease-out;
        }

        /* Ground Vignette & Contrast Control */
        .battle-ground-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 65% at 50% 68%, transparent 40%, rgba(10, 15, 25, 0.38) 100%),
                      linear-gradient(to top, rgba(10, 15, 25, 0.72) 0%, rgba(10, 15, 25, 0.25) 30%, transparent 60%);
          pointer-events: none;
          z-index: 4;
        }

        /* Center Boss Alert */
        .arena-center-banner {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .boss-alert-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(239, 68, 68, 0.6);
          border-radius: 9999px;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.45);
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        /* Floating Bottom Bar (Cleanly anchored above bottom dock and skill HUD) */
        .battle-bottom-floating-bar {
          position: absolute;
          bottom: 136px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          pointer-events: auto;
          box-sizing: border-box;
        }

        .floating-boss-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: transform 0.1s ease, filter 0.1s ease;
        }

        .floating-boss-btn:active {
          transform: scale(0.96);
          filter: brightness(0.9);
        }

        .floating-retreat-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .floating-auto-hunt-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 12px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
        }

        .pulse-hunting-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: huntDotPulse 1.8s ease-in-out infinite;
        }

        @keyframes huntDotPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* 🪙 Floating Gold Drops */
        .floating-gold-drop {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          color: #fde047;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 15px;
          font-weight: 900;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(234, 179, 8, 0.6);
          pointer-events: none;
          z-index: 25;
          display: flex;
          align-items: center;
          gap: 3px;
          animation: goldFloatUp 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes goldFloatUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -10px) scale(1.15);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -35px) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -55px) scale(0.95);
          }
        }

        .gold-coin-glyph {
          font-size: 13px;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
        }

        /* ⚔️ Dropped Item Loot Alert */
        .battle-loot-alert-banner {
          position: absolute;
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.92);
          border: 1.5px solid #f59e0b;
          border-radius: 9999px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 30;
          pointer-events: none;
          animation: lootPopIn 1.6s ease-out forwards;
        }

        @keyframes lootPopIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -12px) scale(0.85);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.06);
          }
          30% {
            transform: translate(-50%, 0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.92);
          }
        }

        .loot-text {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.2px;
        }

        /* 🌟 Stage Notice Banner */
        .battle-stage-notice-banner {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1.5px solid rgba(245, 158, 11, 0.6);
          color: #fef08a;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.3);
          z-index: 30;
          pointer-events: none;
          animation: stageNoticeAnim 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes stageNoticeAnim {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.85);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.04);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.95);
          }
        }

        /* ⚡ CP Delta Chip */
        .battle-cp-delta-chip {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(15, 23, 42, 0.88);
          border: 1.5px solid rgba(245, 158, 11, 0.5);
          padding: 4px 10px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 30;
          pointer-events: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), 0 0 10px rgba(245, 158, 11, 0.2);
          animation: cpDeltaAnim 1.4s ease-out forwards;
        }

        @keyframes cpDeltaAnim {
          0% { opacity: 0; transform: translateY(-8px) scale(0.9); }
          20% { opacity: 1; transform: translateY(0) scale(1.05); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-6px) scale(0.95); }
        }

        .cp-chip-icon { font-size: 11px; }
        .cp-chip-label { font-size: 10px; font-weight: 700; color: #94a3b8; }
        .cp-chip-val { font-size: 11px; font-weight: 800; color: #f8fafc; }
        .cp-chip-up { font-size: 11px; font-weight: 800; color: #22c55e; }

        .pc-side-panel {
          display: none;
        }

        /* 🖥️ PC Responsive Layout (width >= 768px) */
        @media (min-width: 768px) {
          .battle-bg-image {
            object-fit: cover;
            object-position: center 34%;
            transform: scale(1.0);
          }

          .combat-arena-stage {
            width: min(62vw, 1100px);
            margin: 0 auto;
            gap: clamp(24px, 4.5vw, 64px);
            padding: 0 24px clamp(130px, 16vh, 200px) 24px;
          }

          .hero-slot {
            width: clamp(220px, 20vw, 320px);
          }

          .enemy-slot {
            width: clamp(210px, 19vw, 310px);
          }

          .battle-bottom-floating-bar {
            bottom: 162px;
          }

          .floating-boss-btn {
            padding: 9px 24px;
            font-size: 13px;
          }

          .floating-retreat-btn {
            padding: 7px 18px;
            font-size: 12px;
          }

          .floating-auto-hunt-pill {
            display: none !important;
          }
        }

        /* 🖥️ Low Height PC Screens (e.g. 1366x768, 1280x720, max-height: 800px) */
        @media (min-width: 768px) and (max-height: 800px) {
          .combat-arena-stage {
            padding-bottom: clamp(100px, 14vh, 140px);
            gap: clamp(20px, 3.5vw, 48px);
          }

          .battle-bottom-floating-bar {
            bottom: 148px;
          }
        }

        /* 🖥️ Ultra-wide Screens (width >= 1600px) */
        @media (min-width: 1600px) {
          .combat-arena-stage {
            max-width: 1200px;
          }
        }
      `}</style>
    </div>
  );
};
