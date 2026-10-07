import React from 'react';
import { SkillEffectType, CharacterClassId } from '../types/game';

interface SkillVfxLayerProps {
  activeSkillVfx: { id: string; type: SkillEffectType } | null;
  isAwakeningCasting?: boolean;
  classId?: CharacterClassId;
}

export const SkillVfxLayer: React.FC<SkillVfxLayerProps> = ({
  activeSkillVfx,
  isAwakeningCasting = false,
  classId = 'warrior',
}) => {
  const type = activeSkillVfx?.type;

  return (
    <div className="skill-vfx-overlay-layer">
      {/* =========================================
          ⚔️ WARRIOR SKILLS VFX
         ========================================= */}
      
      {/* 1. Power Slash */}
      {type === 'power_slash' && (
        <div className="vfx-anchor-enemy vfx-power-slash">
          <div className="vfx-flame-slash-arc" />
          <div className="vfx-heavy-impact-spark" />
        </div>
      )}

      {/* 2. Double Slash */}
      {type === 'double_slash' && (
        <div className="vfx-anchor-enemy vfx-double-slash">
          <div className="vfx-cross-slice slice-left" />
          <div className="vfx-cross-slice slice-right" />
          <div className="vfx-cross-spark" />
        </div>
      )}

      {/* 3. Sword Wave / Wind Blade (Projectile) */}
      {(type === 'sword_wave' || type === 'wind_blade') && (
        <div className="vfx-projectile-track vfx-sword-wave-flight">
          <div className="vfx-crescent-wave" />
          <div className="vfx-wave-tail" />
        </div>
      )}

      {/* 4. Whirlwind */}
      {type === 'whirlwind' && (
        <div className="vfx-anchor-enemy vfx-whirlwind">
          <div className="vfx-cyclone-spin ring-1" />
          <div className="vfx-cyclone-spin ring-2" />
          <div className="vfx-spin-slash slash-1" />
          <div className="vfx-spin-slash slash-2" />
          <div className="vfx-spin-slash slash-3" />
        </div>
      )}

      {/* 5. Shield Bash */}
      {type === 'shield_bash' && (
        <div className="vfx-anchor-enemy vfx-shield-bash">
          <div className="vfx-shield-impact-ring" />
          <div className="vfx-bash-shockwave" />
          <div className="vfx-stun-stars">⭐💫⭐</div>
        </div>
      )}

      {/* 6. Blade Storm */}
      {type === 'blade_storm' && (
        <div className="vfx-anchor-enemy vfx-blade-storm">
          <div className="vfx-storm-flurry flurry-1" />
          <div className="vfx-storm-flurry flurry-2" />
          <div className="vfx-storm-flurry flurry-3" />
          <div className="vfx-storm-flurry flurry-4" />
          <div className="vfx-storm-burst" />
        </div>
      )}

      {/* 7. Heavenly Blade (Warrior Awakening) */}
      {(type === 'heavenly_blade' || (isAwakeningCasting && classId === 'warrior')) && (
        <div className="vfx-anchor-enemy vfx-heavenly-blade">
          <div className="vfx-sky-golden-beam" />
          <div className="vfx-heavenly-giant-sword" />
          <div className="vfx-heavenly-ground-shatter" />
          <div className="vfx-heavenly-holy-cross-burst" />
        </div>
      )}

      {/* =========================================
          🔮 MAGE SKILLS VFX
         ========================================= */}

      {/* 1. Magic Missile (3 Projectiles) */}
      {type === 'magic_missile' && (
        <div className="vfx-projectile-track vfx-missiles-group">
          <div className="vfx-missile-orb orb-1" />
          <div className="vfx-missile-orb orb-2" />
          <div className="vfx-missile-orb orb-3" />
        </div>
      )}

      {/* 2. Fireball */}
      {type === 'fireball' && (
        <div className="vfx-fireball-sequence">
          <div className="vfx-fireball-projectile" />
          <div className="vfx-anchor-enemy vfx-fireball-explosion" />
        </div>
      )}

      {/* 3. Ice Spear */}
      {type === 'ice_spear' && (
        <div className="vfx-ice-spear-sequence">
          <div className="vfx-ice-spear-projectile" />
          <div className="vfx-anchor-enemy vfx-ice-shatter-burst" />
        </div>
      )}

      {/* 4. Chain Lightning */}
      {type === 'chain_lightning' && (
        <div className="vfx-anchor-enemy vfx-chain-lightning">
          <div className="vfx-lightning-bolt bolt-1" />
          <div className="vfx-lightning-bolt bolt-2" />
          <div className="vfx-lightning-bolt bolt-3" />
          <div className="vfx-lightning-ground-burst" />
        </div>
      )}

      {/* 5. Meteor / Meteor Slash */}
      {(type === 'meteor' || type === 'meteor_slash') && (
        <div className="vfx-anchor-enemy vfx-meteor-drop">
          <div className="vfx-meteor-streaking-rock" />
          <div className="vfx-meteor-impact-crater" />
          <div className="vfx-meteor-inferno-burst" />
        </div>
      )}

      {/* 6. Arcane Storm */}
      {type === 'arcane_storm' && (
        <div className="vfx-anchor-enemy vfx-arcane-storm">
          <div className="vfx-galaxy-vortex-disc" />
          <div className="vfx-arcane-burst-pulse pulse-1" />
          <div className="vfx-arcane-burst-pulse pulse-2" />
          <div className="vfx-arcane-stardust" />
        </div>
      )}

      {/* 7. Astral Cataclysm (Mage Awakening) */}
      {(type === 'astral_cataclysm' || (isAwakeningCasting && classId === 'mage')) && (
        <div className="vfx-anchor-enemy vfx-astral-cataclysm">
          <div className="vfx-constellation-magic-gate" />
          <div className="vfx-star-shower star-1" />
          <div className="vfx-star-shower star-2" />
          <div className="vfx-star-shower star-3" />
          <div className="vfx-star-shower star-4" />
          <div className="vfx-star-shower star-5" />
          <div className="vfx-supernova-blast" />
        </div>
      )}

      <style>{`
        .skill-vfx-overlay-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 22;
          overflow: hidden;
        }

        /* Enemy Target Anchor Zone (Centered on Monster) */
        .vfx-anchor-enemy {
          position: absolute;
          right: clamp(14%, 22%, 28%);
          bottom: clamp(18%, 24%, 30%);
          width: 200px;
          height: 200px;
          transform: translate(50%, 50%);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Projectile Flight Track from Hero to Monster */
        .vfx-projectile-track {
          position: absolute;
          left: clamp(24%, 30%, 36%);
          bottom: clamp(20%, 25%, 30%);
          width: clamp(180px, 40vw, 380px);
          height: 80px;
        }

        /* --- 1. Power Slash --- */
        .vfx-flame-slash-arc {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border-right: 12px solid #ffffff;
          border-top: 10px solid #f97316;
          border-left: 3px solid transparent;
          border-bottom: transparent;
          filter: drop-shadow(0 0 16px #f97316) drop-shadow(0 0 28px #ef4444);
          animation: flameArcSweep 0.32s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes flameArcSweep {
          0% { transform: scale(0.3) rotate(-80deg); opacity: 0.2; }
          40% { transform: scale(1.25) rotate(15deg); opacity: 1; }
          100% { transform: scale(1.45) rotate(90deg); opacity: 0; }
        }

        .vfx-heavy-impact-spark {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #fbbf24 60%, transparent 100%);
          animation: sparkBurst 0.35s ease-out forwards;
        }

        @keyframes sparkBurst {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        /* --- 2. Double Slash --- */
        .vfx-cross-slice {
          position: absolute;
          width: 140px;
          height: 8px;
          background: linear-gradient(90deg, transparent, #38bdf8 30%, #ffffff 70%, transparent);
          box-shadow: 0 0 16px #0284c7;
          border-radius: 9999px;
        }

        .slice-left {
          transform: rotate(35deg);
          animation: crossSliceAnim 0.28s ease-out forwards;
        }

        .slice-right {
          transform: rotate(-35deg);
          animation: crossSliceAnim 0.28s 0.08s ease-out forwards;
        }

        @keyframes crossSliceAnim {
          0% { transform: scaleX(0.2) rotate(var(--rot, 35deg)); opacity: 0; }
          50% { transform: scaleX(1.4) rotate(var(--rot, 35deg)); opacity: 1; }
          100% { transform: scaleX(1.8) rotate(var(--rot, 35deg)); opacity: 0; }
        }

        .vfx-cross-spark {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #38bdf8 60%, transparent 100%);
          animation: sparkBurst 0.3s 0.1s ease-out forwards;
        }

        /* --- 3. Sword Wave Projectile --- */
        .vfx-crescent-wave {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border-right: 12px solid #ffffff;
          border-top: 8px solid #34d399;
          border-bottom: 3px solid #10b981;
          border-left: transparent;
          filter: drop-shadow(0 0 16px #34d399) drop-shadow(0 0 24px #10b981);
          animation: waveFly 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes waveFly {
          0% { transform: translateX(0) scale(0.6) rotate(15deg); opacity: 0.5; }
          70% { transform: translateX(80%) scale(1.3) rotate(30deg); opacity: 1; }
          100% { transform: translateX(110%) scale(1.5) rotate(40deg); opacity: 0; }
        }

        .vfx-wave-tail {
          position: absolute;
          top: 35px;
          left: 0;
          width: 80px;
          height: 16px;
          background: linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.6));
          border-radius: 9999px;
          animation: waveTailAnim 0.36s ease-out forwards;
        }

        @keyframes waveTailAnim {
          0% { opacity: 0.9; transform: scaleX(0.4); }
          100% { opacity: 0; transform: scaleX(1.8) translateX(60%); }
        }

        /* --- 4. Whirlwind --- */
        .vfx-cyclone-spin {
          position: absolute;
          border-radius: 50%;
          border: 4px solid #38bdf8;
          box-shadow: 0 0 20px #0284c7, inset 0 0 12px #38bdf8;
        }

        .vfx-cyclone-spin.ring-1 {
          width: 170px;
          height: 60px;
          animation: cycloneRotate 0.45s linear infinite;
        }

        .vfx-cyclone-spin.ring-2 {
          width: 130px;
          height: 45px;
          animation: cycloneRotate 0.35s reverse linear infinite;
        }

        @keyframes cycloneRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .vfx-spin-slash {
          position: absolute;
          width: 160px;
          height: 6px;
          background: linear-gradient(90deg, transparent, #ffffff 50%, transparent);
          border-radius: 9999px;
          box-shadow: 0 0 12px #38bdf8;
        }

        .slash-1 { transform: rotate(-30deg); animation: sparkBurst 0.2s 0.05s ease-out forwards; }
        .slash-2 { transform: rotate(20deg); animation: sparkBurst 0.2s 0.15s ease-out forwards; }
        .slash-3 { transform: rotate(-65deg); animation: sparkBurst 0.2s 0.25s ease-out forwards; }

        /* --- 5. Shield Bash --- */
        .vfx-shield-impact-ring {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 8px solid #fbbf24;
          box-shadow: 0 0 25px #f59e0b, inset 0 0 15px #ffffff;
          animation: sparkBurst 0.35s ease-out forwards;
        }

        .vfx-bash-shockwave {
          position: absolute;
          width: 180px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid #ffffff;
          box-shadow: 0 0 20px #f59e0b;
          animation: sparkBurst 0.35s 0.05s ease-out forwards;
        }

        .vfx-stun-stars {
          position: absolute;
          top: -20px;
          font-size: 16px;
          animation: stunStarsSpin 0.5s ease-out forwards;
        }

        @keyframes stunStarsSpin {
          0% { transform: scale(0.2) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1.4) translateY(-20px) rotate(360deg); opacity: 0; }
        }

        /* --- 6. Blade Storm --- */
        .vfx-storm-flurry {
          position: absolute;
          width: 180px;
          height: 6px;
          background: linear-gradient(90deg, transparent, #fbbf24 30%, #ffffff 70%, transparent);
          box-shadow: 0 0 16px #f59e0b, 0 0 24px #ef4444;
          border-radius: 9999px;
        }

        .flurry-1 { transform: rotate(-45deg); animation: sparkBurst 0.16s 0.04s ease-out forwards; }
        .flurry-2 { transform: rotate(35deg); animation: sparkBurst 0.16s 0.12s ease-out forwards; }
        .flurry-3 { transform: rotate(-15deg); animation: sparkBurst 0.16s 0.20s ease-out forwards; }
        .flurry-4 { transform: rotate(65deg); animation: sparkBurst 0.16s 0.28s ease-out forwards; }

        .vfx-storm-burst {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #f59e0b 50%, transparent 80%);
          animation: sparkBurst 0.4s 0.3s ease-out forwards;
        }

        /* --- 7. Heavenly Blade (Awakening) --- */
        .vfx-sky-golden-beam {
          position: absolute;
          top: -300px;
          width: 30px;
          height: 450px;
          background: linear-gradient(180deg, transparent 0%, #ffffff 40%, #fbbf24 90%);
          box-shadow: 0 0 40px #f59e0b, 0 0 70px #fbbf24;
          border-radius: 9999px;
          animation: skyBeamCrash 0.45s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes skyBeamCrash {
          0% { transform: translateY(-200px) scaleX(0.3); opacity: 0; }
          40% { transform: translateY(0) scaleX(1.4); opacity: 1; }
          100% { transform: translateY(30px) scaleX(1.8); opacity: 0; }
        }

        .vfx-heavenly-giant-sword {
          position: absolute;
          top: -180px;
          width: 18px;
          height: 320px;
          background: linear-gradient(180deg, #ffffff 0%, #fbbf24 60%, #b45309 100%);
          box-shadow: 0 0 35px #ffffff, 0 0 60px #f59e0b;
          border-radius: 4px;
          transform: rotate(20deg);
          animation: swordSlashDown 0.5s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }

        @keyframes swordSlashDown {
          0% { transform: translateY(-120px) rotate(20deg) scale(0.5); opacity: 0.2; }
          50% { transform: translateY(40px) rotate(20deg) scale(1.2); opacity: 1; }
          100% { transform: translateY(80px) rotate(20deg) scale(1.4); opacity: 0; }
        }

        .vfx-heavenly-ground-shatter {
          position: absolute;
          bottom: 10px;
          width: 220px;
          height: 60px;
          border-radius: 50%;
          border: 8px solid #ffffff;
          box-shadow: 0 0 40px #fbbf24, inset 0 0 25px #f59e0b;
          animation: sparkBurst 0.5s 0.25s ease-out forwards;
        }

        .vfx-heavenly-holy-cross-burst {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #ffffff 0%, #fbbf24 50%, transparent 80%);
          animation: sparkBurst 0.5s 0.3s ease-out forwards;
        }

        /* --- MAGE VFX --- */
        /* Magic Missile */
        .vfx-missiles-group {
          position: absolute;
          inset: 0;
        }

        .vfx-missile-orb {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #38bdf8 60%, #818cf8 100%);
          box-shadow: 0 0 16px #38bdf8, 0 0 24px #6366f1;
        }

        .orb-1 {
          top: 10px;
          animation: missileTrack1 0.34s ease-out forwards;
        }
        .orb-2 {
          top: 30px;
          animation: missileTrack2 0.34s 0.05s ease-out forwards;
        }
        .orb-3 {
          top: 50px;
          animation: missileTrack3 0.34s 0.10s ease-out forwards;
        }

        @keyframes missileTrack1 {
          0% { transform: translateX(0) scale(0.6); opacity: 0.5; }
          100% { transform: translateX(110%) scale(1.4); opacity: 0; }
        }
        @keyframes missileTrack2 {
          0% { transform: translateX(0) translateY(-8px) scale(0.6); opacity: 0.5; }
          100% { transform: translateX(110%) translateY(4px) scale(1.4); opacity: 0; }
        }
        @keyframes missileTrack3 {
          0% { transform: translateX(0) translateY(8px) scale(0.6); opacity: 0.5; }
          100% { transform: translateX(110%) translateY(-6px) scale(1.4); opacity: 0; }
        }

        /* Fireball */
        .vfx-fireball-projectile {
          position: absolute;
          left: clamp(24%, 30%, 36%);
          bottom: clamp(22%, 26%, 32%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #f97316 60%, #ef4444 100%);
          box-shadow: 0 0 24px #f97316, 0 0 40px #ef4444;
          animation: fireballFly 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        @keyframes fireballFly {
          0% { transform: translateX(0) scale(0.5); opacity: 0.7; }
          100% { transform: translateX(clamp(150px, 35vw, 340px)) scale(1.3); opacity: 0; }
        }

        .vfx-fireball-explosion {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #fbbf24 35%, #ef4444 70%, transparent 90%);
          box-shadow: 0 0 50px #ef4444;
          animation: sparkBurst 0.4s 0.22s ease-out forwards;
        }

        /* Ice Spear */
        .vfx-ice-spear-projectile {
          position: absolute;
          left: clamp(24%, 30%, 36%);
          bottom: clamp(22%, 26%, 32%);
          width: 75px;
          height: 14px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, #a5f3fc 40%, #ffffff 80%, #38bdf8 100%);
          box-shadow: 0 0 20px #38bdf8, 0 0 35px #0284c7;
          animation: iceSpearFly 0.32s ease-out forwards;
        }

        @keyframes iceSpearFly {
          0% { transform: translateX(0) scaleX(0.5); opacity: 0.6; }
          100% { transform: translateX(clamp(150px, 35vw, 340px)) scaleX(1.5); opacity: 0; }
        }

        .vfx-ice-shatter-burst {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 6px solid #a5f3fc;
          box-shadow: 0 0 30px #38bdf8, inset 0 0 20px #0284c7;
          animation: sparkBurst 0.38s 0.24s ease-out forwards;
        }

        /* Chain Lightning */
        .vfx-lightning-bolt {
          position: absolute;
          top: -260px;
          width: 10px;
          height: 340px;
          background: linear-gradient(180deg, transparent 0%, #38bdf8 30%, #ffffff 80%);
          box-shadow: 0 0 25px #38bdf8, 0 0 40px #0284c7;
          border-radius: 9999px;
        }

        .bolt-1 { left: 40%; transform: rotate(8deg); animation: lightningStrike 0.25s ease-out forwards; }
        .bolt-2 { left: 55%; transform: rotate(-12deg); animation: lightningStrike 0.25s 0.08s ease-out forwards; }
        .bolt-3 { left: 45%; transform: rotate(5deg); animation: lightningStrike 0.25s 0.16s ease-out forwards; }

        @keyframes lightningStrike {
          0% { transform: translateY(-100px) scaleY(0.4); opacity: 0; }
          50% { transform: translateY(0) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(20px) scaleY(1.4); opacity: 0; }
        }

        .vfx-lightning-ground-burst {
          position: absolute;
          bottom: 20px;
          width: 170px;
          height: 50px;
          border-radius: 50%;
          border: 6px solid #ffffff;
          box-shadow: 0 0 35px #38bdf8;
          animation: sparkBurst 0.4s 0.12s ease-out forwards;
        }

        /* Meteor */
        .vfx-meteor-streaking-rock {
          position: absolute;
          top: -220px;
          right: -80px;
          width: 16px;
          height: 400px;
          background: linear-gradient(180deg, transparent 0%, #fbbf24 30%, #ef4444 80%, #ffffff 100%);
          box-shadow: 0 0 35px #ef4444, 0 0 60px #fbbf24;
          transform: rotate(35deg);
          border-radius: 9999px;
          animation: meteorRockDrop 0.42s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes meteorRockDrop {
          0% { transform: translateY(-180px) rotate(35deg) scaleY(0.4); opacity: 0.2; }
          50% { transform: translateY(0) rotate(35deg) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(50px) rotate(35deg) scaleY(1.4); opacity: 0; }
        }

        .vfx-meteor-impact-crater {
          position: absolute;
          bottom: 20px;
          width: 180px;
          height: 55px;
          border-radius: 50%;
          border: 8px solid #fbbf24;
          box-shadow: 0 0 35px #ef4444;
          animation: sparkBurst 0.45s 0.2s ease-out forwards;
        }

        .vfx-meteor-inferno-burst {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #ffffff 0%, #f97316 40%, #ef4444 70%, transparent 90%);
          animation: sparkBurst 0.45s 0.22s ease-out forwards;
        }

        /* Arcane Storm */
        .vfx-galaxy-vortex-disc {
          position: absolute;
          width: 190px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid #c084fc;
          box-shadow: 0 0 30px #a855f7, inset 0 0 20px #38bdf8;
          animation: cycloneRotate 0.55s linear infinite;
        }

        .vfx-arcane-burst-pulse {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #a855f7 60%, transparent 100%);
        }

        .pulse-1 { width: 150px; height: 150px; animation: sparkBurst 0.35s 0.1s ease-out forwards; }
        .pulse-2 { width: 180px; height: 180px; animation: sparkBurst 0.35s 0.25s ease-out forwards; }

        .vfx-arcane-stardust {
          position: absolute;
          font-size: 14px;
          animation: stunStarsSpin 0.5s ease-out forwards;
        }

        /* Astral Cataclysm (Mage Awakening) */
        .vfx-constellation-magic-gate {
          position: absolute;
          top: -160px;
          width: 260px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid #38bdf8;
          box-shadow: 0 0 40px #a855f7, 0 0 60px #38bdf8, inset 0 0 30px #ffffff;
          animation: gatePulsate 1.2s ease-out forwards;
        }

        @keyframes gatePulsate {
          0% { transform: scale(0.4) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.1) rotate(90deg); opacity: 1; }
          100% { transform: scale(1.3) rotate(180deg); opacity: 0; }
        }

        .vfx-star-shower {
          position: absolute;
          width: 12px;
          height: 140px;
          background: linear-gradient(180deg, transparent 0%, #38bdf8 40%, #ffffff 80%);
          box-shadow: 0 0 20px #38bdf8, 0 0 35px #a855f7;
          border-radius: 9999px;
          transform: rotate(25deg);
        }

        .star-1 { top: -140px; left: 10%; animation: starShowerDrop 0.35s 0.1s ease-out forwards; }
        .star-2 { top: -150px; left: 30%; animation: starShowerDrop 0.35s 0.2s ease-out forwards; }
        .star-3 { top: -160px; left: 50%; animation: starShowerDrop 0.35s 0.3s ease-out forwards; }
        .star-4 { top: -150px; left: 70%; animation: starShowerDrop 0.35s 0.4s ease-out forwards; }
        .star-5 { top: -140px; left: 85%; animation: starShowerDrop 0.35s 0.5s ease-out forwards; }

        @keyframes starShowerDrop {
          0% { transform: translateY(-80px) rotate(25deg) scaleY(0.4); opacity: 0; }
          50% { transform: translateY(60px) rotate(25deg) scaleY(1.3); opacity: 1; }
          100% { transform: translateY(120px) rotate(25deg) scaleY(1.6); opacity: 0; }
        }

        .vfx-supernova-blast {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #38bdf8 40%, #a855f7 70%, transparent 95%);
          box-shadow: 0 0 60px #38bdf8, 0 0 100px #a855f7;
          animation: sparkBurst 0.6s 0.55s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
