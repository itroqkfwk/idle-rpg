import React from 'react';
import { CharacterStats, Equipment, Monster, Pet, StageState, DamageNumberData } from '../types/game';
import { PlayerCharacter } from './PlayerCharacter';
import { EnemyCharacter } from './EnemyCharacter';
import { PetCompanion } from './PetCompanion';
import { DamageNumbers } from './DamageNumbers';
import { Swords, Skull, Flame } from 'lucide-react';

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
}) => {
  const isBossFight = stage.stage === 10 && stage.inBossFight;

  return (
    <div className={`battle-environment-root ${isBossFight ? 'boss-battle-mode' : ''}`}>
      {/* 🌲 Layer 1: High-Res 2D Painted Forest Panorama Backdrop */}
      <div className="battle-bg-container">
        <img
          src="/assets/forest_bg.jpg"
          alt="Battle Forest Background"
          className="battle-bg-image"
          draggable={false}
        />

        {/* ☀️ Layer 2: Sunlight Godrays Streaming from Canopy */}
        <div className="god-rays-overlay" />

        {/* 🍃 Layer 3: Natural Floating Leaves drifting through the wind */}
        <div className="floating-leaves-container">
          <div className="falling-leaf leaf-1">🍃</div>
          <div className="falling-leaf leaf-2">🍂</div>
          <div className="falling-leaf leaf-3">🍃</div>
          <div className="falling-leaf leaf-4">🌿</div>
        </div>

        {/* ✨ Layer 4: Glowing Fireflies & Forest Pollen Motes */}
        <div className="ambient-fireflies">
          <div className="firefly firefly-1" />
          <div className="firefly firefly-2" />
          <div className="firefly firefly-3" />
          <div className="firefly firefly-4" />
        </div>

        {/* 🌿 Layer 5: Foreground Foliage Vignette (Cinematic Depth) */}
        <div className="foreground-bush bush-left" />
        <div className="foreground-bush bush-right" />

        {/* 🩸 Boss Encounter Crimson Pulse Vignette */}
        {isBossFight && <div className="boss-vignette-pulse" />}
      </div>

      {/* Floating Damage Numbers */}
      <DamageNumbers damages={damages} />

      {/* ⚔️ Main Combat Arena Stage */}
      <div className="combat-arena-stage">
        {/* Left Side: Adventurer Knight & Companion Pet */}
        <div className="combatant-slot hero-slot">
          <PlayerCharacter
            stats={stats}
            maxHp={maxHp}
            isAttacking={isPlayerAttacking}
            isHit={isPlayerHit}
            isVictory={isMonsterDefeated}
            equippedWeapon={equippedWeapon}
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

        {/* Right Side: Monster Sprite */}
        <div className="combatant-slot enemy-slot">
          <EnemyCharacter
            monster={monster}
            isHit={isMonsterHit}
            isDefeated={isMonsterDefeated}
            isAttacking={isMonsterAttacking}
          />
        </div>
      </div>

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

        /* ⚔️ Combat Arena Stage */
        .combat-arena-stage {
          position: relative;
          z-index: 6;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 16px 84px 16px;
          box-sizing: border-box;
        }

        .combatant-slot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-slot {
          align-self: flex-end;
          margin-left: 10px;
        }

        .enemy-slot {
          align-self: flex-end;
          margin-right: 10px;
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

        /* Floating Bottom Bar (Above Bottom Navigation) */
        .battle-bottom-floating-bar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 6px;
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
      `}</style>
    </div>
  );
};
