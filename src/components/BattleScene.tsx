import React from 'react';
import { CharacterStats, Equipment, Monster, Pet, StageState, DamageNumberData } from '../types/game';
import { PlayerCharacter } from './PlayerCharacter';
import { EnemyCharacter } from './EnemyCharacter';
import { PetCompanion } from './PetCompanion';
import { DamageNumbers } from './DamageNumbers';
import { CHAPTERS_DATA } from '../data/monsters';
import { Swords, Skull } from 'lucide-react';

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
  const currentChapter = CHAPTERS_DATA[(stage.chapter - 1) % CHAPTERS_DATA.length];

  return (
    <div className="battle-environment-root">
      {/* 🌲 Layer 0: Sky with Sunlight God Rays */}
      <div className="env-layer layer-sky" style={{ background: currentChapter.bgGradient }}>
        <div className="god-rays" />
        <div className="ambient-sun-orb" />
      </div>

      {/* 🌲 Layer 1: Far Misty Silhouette Mountain Range */}
      <div className="env-layer layer-far-mountains">
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="mountains-svg">
          <path d="M0 80 Q90 30 180 75 T360 40 Q390 60 400 80 L400 120 L0 120 Z" fill="rgba(40, 80, 50, 0.45)" />
        </svg>
      </div>

      {/* 🌲 Layer 2: Midground Ancient Forest Canopy & Fireflies */}
      <div className="env-layer layer-midground-forest">
        <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="canopy-svg">
          {/* Giant Tree Trunks and Foliage */}
          <path
            d="M-20 0 Q40 40 100 0 Q180 50 260 0 Q340 45 420 0 L420 160 L-20 160 Z"
            fill="rgba(25, 55, 30, 0.7)"
          />
        </svg>
        {/* Floating Glowing Fireflies */}
        <div className="firefly firefly-1" />
        <div className="firefly firefly-2" />
        <div className="firefly firefly-3" />
        <div className="firefly firefly-4" />
      </div>

      {/* 🌲 Layer 3: Main Battle Ground Path (Cobblestones & Moss Foliage) */}
      <div className="env-layer layer-ground-path">
        <div className="ground-soil-base">
          {/* Cobblestone Details */}
          <div className="stone-pebble stone-1" />
          <div className="stone-pebble stone-2" />
          <div className="stone-pebble stone-3" />
          <div className="grass-tuft grass-1" />
          <div className="grass-tuft grass-2" />
        </div>
      </div>

      {/* 🌲 Layer 4: Foreground Leaf Vignette (Camera Framing) */}
      <div className="env-layer layer-foreground-vignette">
        <div className="vine-leaf vine-top-left" />
        <div className="vine-leaf vine-top-right" />
      </div>

      {/* Floating Damage Numbers Overlay */}
      <DamageNumbers damages={damages} />

      {/* ⚔️ Main Combat Arena Stage */}
      <div className="combat-arena-stage">
        {/* Left Side: Player Adventurer & Companion Pet */}
        <div className="hero-combat-slot">
          <PlayerCharacter
            stats={stats}
            maxHp={maxHp}
            isAttacking={isPlayerAttacking}
            isHit={isPlayerHit}
            equippedWeapon={equippedWeapon}
          />
          <PetCompanion pet={activePet} />
        </div>

        {/* Center Divider: Boss Indicator */}
        <div className="arena-center-zone">
          {stage.stage === 10 && stage.inBossFight && (
            <div className="boss-banner-stamp game-stroke">
              <Skull size={16} color="#ffffff" />
              <span>BOSS BATTLE</span>
            </div>
          )}
        </div>

        {/* Right Side: Monster Sprite */}
        <div className="enemy-combat-slot">
          <EnemyCharacter
            monster={monster}
            isHit={isMonsterHit}
            isDefeated={isMonsterDefeated}
            isAttacking={isMonsterAttacking}
          />
        </div>
      </div>

      {/* Stage Bottom Action: Boss Challenge or Retreat Button */}
      <div className="battle-action-overlay">
        {stage.stage === 10 && !stage.inBossFight && (
          <button className="btn-game btn-game-gold boss-summon-btn" onClick={onChallengeBoss}>
            <Swords size={20} />
            <span className="game-stroke">보스 소환 도전 (Boss Battle)</span>
          </button>
        )}

        {stage.stage === 10 && stage.inBossFight && (
          <button className="btn-game btn-game-wood boss-retreat-btn" onClick={onRetreatToNormal}>
            <span>일반 사냥으로 후퇴</span>
          </button>
        )}
      </div>

      <style>{`
        .battle-environment-root {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          min-height: 380px;
          user-select: none;
        }

        .env-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Layer 0: Sky & God Rays */
        .layer-sky {
          z-index: 1;
        }
        .god-rays {
          position: absolute;
          top: -20px;
          left: 10%;
          width: 250px;
          height: 300px;
          background: linear-gradient(135deg, rgba(254, 240, 138, 0.28) 0%, transparent 60%);
          transform: rotate(-15deg);
          filter: blur(12px);
          animation: godRaysPulse 6s ease-in-out infinite alternate;
        }
        @keyframes godRaysPulse {
          0% { opacity: 0.5; transform: rotate(-15deg) scaleX(0.9); }
          100% { opacity: 0.9; transform: rotate(-12deg) scaleX(1.15); }
        }

        .ambient-sun-orb {
          position: absolute;
          top: 15px;
          right: 35px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 240, 138, 0.7) 0%, transparent 70%);
        }

        /* Layer 1: Far Mountains */
        .layer-far-mountains {
          z-index: 2;
          display: flex;
          align-items: flex-end;
        }
        .mountains-svg {
          width: 100%;
          height: 90px;
        }

        /* Layer 2: Midground Canopy & Fireflies */
        .layer-midground-forest {
          z-index: 3;
        }
        .canopy-svg {
          width: 100%;
          height: 90px;
        }
        .firefly {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fef08a;
          box-shadow: 0 0 8px #fef08a, 0 0 14px #86efac;
          animation: fireflyAnim 4s ease-in-out infinite;
        }
        .firefly-1 { top: 35%; left: 20%; animation-delay: 0s; }
        .firefly-2 { top: 48%; left: 75%; animation-delay: 1.2s; }
        .firefly-3 { top: 60%; left: 45%; animation-delay: 2.1s; }
        .firefly-4 { top: 25%; left: 60%; animation-delay: 3s; }

        @keyframes fireflyAnim {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(12px, -18px); opacity: 1; }
        }

        /* Layer 3: Ground Soil Base & Cobblestones */
        .layer-ground-path {
          z-index: 4;
          display: flex;
          align-items: flex-end;
        }
        .ground-soil-base {
          width: 100%;
          height: 75px;
          background: linear-gradient(180deg, #446e3e 0%, #2b4a26 40%, #1c3319 100%);
          border-top: 3.5px solid #6b9e5d;
          position: relative;
          box-shadow: inset 0 8px 16px rgba(0, 0, 0, 0.45);
        }
        .stone-pebble {
          position: absolute;
          background: #3b5037;
          border-radius: 50%;
          border: 1px solid #5a7554;
        }
        .stone-1 { width: 14px; height: 7px; top: 18px; left: 15%; }
        .stone-2 { width: 20px; height: 9px; top: 32px; left: 62%; }
        .stone-3 { width: 16px; height: 8px; top: 44px; left: 38%; }

        .grass-tuft {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 9px solid #86efac;
        }
        .grass-1 { top: -9px; left: 28%; }
        .grass-2 { top: -9px; left: 78%; }

        /* Layer 4: Foreground Leaf Vignette */
        .layer-foreground-vignette {
          z-index: 25;
        }
        .vine-leaf {
          position: absolute;
          width: 70px;
          height: 50px;
          background: radial-gradient(circle at 0% 0%, #22421f 0%, #152b13 80%);
          border-radius: 0 0 50px 0;
          opacity: 0.85;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
        }
        .vine-top-left { top: 0; left: 0; }
        .vine-top-right { top: 0; right: 0; transform: scaleX(-1); }

        /* Combat Arena Stage */
        .combat-arena-stage {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 0 16px 36px;
        }

        .hero-combat-slot {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .enemy-combat-slot {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .arena-center-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 45px;
        }

        .boss-banner-stamp {
          background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1.5px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.85);
          animation: bossStampPulse 1.2s infinite;
        }

        @keyframes bossStampPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); box-shadow: 0 0 24px rgba(239, 68, 68, 1); }
        }

        /* Action Buttons Over Battle */
        .battle-action-overlay {
          position: relative;
          z-index: 30;
          display: flex;
          justify-content: center;
          padding: 0 16px 8px;
        }

        .boss-summon-btn {
          width: 100%;
          max-width: 290px;
          min-height: 48px;
          font-size: 1.05rem;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
          animation: summonBounce 2s infinite;
        }

        @keyframes summonBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .boss-retreat-btn {
          font-size: 0.85rem;
          min-height: 38px;
          padding: 6px 16px;
        }
      `}</style>
    </div>
  );
};
