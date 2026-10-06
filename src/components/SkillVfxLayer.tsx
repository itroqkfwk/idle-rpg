import React from 'react';
import { SkillEffectType } from '../types/game';

interface SkillVfxLayerProps {
  activeSkillVfx: { id: string; type: SkillEffectType } | null;
}

export const SkillVfxLayer: React.FC<SkillVfxLayerProps> = ({ activeSkillVfx }) => {
  if (!activeSkillVfx) return null;

  const { type } = activeSkillVfx;

  return (
    <div className="skill-vfx-overlay-layer">
      {/* 1. Power Slash VFX: Fiery Heavy Crushing Slash */}
      {type === 'power_slash' && (
        <div className="vfx-power-slash">
          <div className="vfx-slash-flame-arc" />
          <div className="vfx-heavy-impact-spark" />
        </div>
      )}

      {/* 2. Wind Blade VFX: Emerald Flying Crescent Blade Wave */}
      {type === 'wind_blade' && (
        <div className="vfx-wind-blade">
          <div className="vfx-crescent-projectile" />
          <div className="vfx-wind-gust-tail" />
        </div>
      )}

      {/* 3. Whirlwind VFX: 360-Degree Cyan Spinning Cyclone */}
      {type === 'whirlwind' && (
        <div className="vfx-whirlwind">
          <div className="vfx-cyclone-ring ring-1" />
          <div className="vfx-cyclone-ring ring-2" />
          <div className="vfx-triple-hit-slice slice-1" />
          <div className="vfx-triple-hit-slice slice-2" />
          <div className="vfx-triple-hit-slice slice-3" />
        </div>
      )}

      {/* 4. Meteor Slash VFX: Crimson Sky-Shattering Meteor Beam & Impact */}
      {type === 'meteor_slash' && (
        <div className="vfx-meteor-slash">
          <div className="vfx-meteor-beam" />
          <div className="vfx-meteor-crater-shockwave" />
          <div className="vfx-meteor-debris-burst" />
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

        /* ⚔️ Power Slash Styles */
        .vfx-power-slash {
          position: absolute;
          right: 22%;
          bottom: 25%;
          width: 180px;
          height: 180px;
          transform: translate(50%, 50%);
        }

        .vfx-slash-flame-arc {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border-right: 12px solid #ffffff;
          border-top: 10px solid #f97316;
          border-left: 4px solid transparent;
          border-bottom: transparent;
          filter: drop-shadow(0 0 16px #f97316) drop-shadow(0 0 28px #ef4444);
          animation: flameArcSweep 0.28s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes flameArcSweep {
          0% { transform: scale(0.3) rotate(-80deg); opacity: 0.2; }
          40% { transform: scale(1.25) rotate(15deg); opacity: 1; }
          100% { transform: scale(1.45) rotate(90deg); opacity: 0; }
        }

        .vfx-heavy-impact-spark {
          position: absolute;
          top: 40%;
          left: 40%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #fbbf24 60%, transparent 100%);
          animation: heavySparkBurst 0.3s ease-out forwards;
        }

        @keyframes heavySparkBurst {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* 🌪️ Wind Blade Styles */
        .vfx-wind-blade {
          position: absolute;
          bottom: 25%;
          left: 32%;
          width: 140px;
          height: 90px;
        }

        .vfx-crescent-projectile {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border-right: 10px solid #ffffff;
          border-top: 7px solid #34d399;
          border-bottom: 2px solid #10b981;
          border-left: transparent;
          filter: drop-shadow(0 0 14px #34d399) drop-shadow(0 0 24px #10b981);
          animation: windBladeFly 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes windBladeFly {
          0% { transform: translateX(0) scale(0.6) rotate(10deg); opacity: 0.4; }
          60% { transform: translateX(110px) scale(1.2) rotate(25deg); opacity: 1; }
          100% { transform: translateX(160px) scale(1.4) rotate(40deg); opacity: 0; }
        }

        .vfx-wind-gust-tail {
          position: absolute;
          top: 30px;
          left: -20px;
          width: 70px;
          height: 18px;
          background: linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.5));
          border-radius: 9999px;
          animation: windTailFade 0.32s ease-out forwards;
        }

        @keyframes windTailFade {
          0% { opacity: 0.8; transform: scaleX(0.5); }
          100% { opacity: 0; transform: scaleX(1.8) translateX(60px); }
        }

        /* 🌀 Whirlwind Styles */
        .vfx-whirlwind {
          position: absolute;
          bottom: 22%;
          left: 45%;
          transform: translateX(-50%);
          width: 240px;
          height: 240px;
        }

        .vfx-cyclone-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 6px dashed #38bdf8;
          box-shadow: 0 0 24px #0284c7, inset 0 0 16px #38bdf8;
        }

        .ring-1 {
          animation: spinCyclone 0.35s linear infinite;
        }

        .ring-2 {
          transform: scale(0.8) rotate(45deg);
          border-color: #ffffff;
          animation: spinCycloneReverse 0.35s linear infinite;
        }

        @keyframes spinCyclone {
          0% { transform: scale(0.6) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.25) rotate(180deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(360deg); opacity: 0; }
        }

        @keyframes spinCycloneReverse {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(-180deg); opacity: 1; }
          100% { transform: scale(1.3) rotate(-360deg); opacity: 0; }
        }

        .vfx-triple-hit-slice {
          position: absolute;
          right: -20px;
          top: 35%;
          width: 80px;
          height: 6px;
          background: #ffffff;
          box-shadow: 0 0 12px #38bdf8;
          border-radius: 9999px;
        }

        .slice-1 { transform: rotate(-25deg); animation: slicePop 0.12s 0.05s ease-out forwards; opacity: 0; }
        .slice-2 { transform: rotate(15deg); animation: slicePop 0.12s 0.15s ease-out forwards; opacity: 0; }
        .slice-3 { transform: rotate(-50deg); animation: slicePop 0.12s 0.25s ease-out forwards; opacity: 0; }

        @keyframes slicePop {
          0% { opacity: 0; transform: scaleX(0.2); }
          50% { opacity: 1; transform: scaleX(1.3); }
          100% { opacity: 0; transform: scaleX(1.6); }
        }

        /* ☄️ Meteor Slash Styles */
        .vfx-meteor-slash {
          position: absolute;
          right: 22%;
          bottom: 25%;
          width: 220px;
          height: 400px;
          transform: translate(50%, 50%);
        }

        .vfx-meteor-beam {
          position: absolute;
          top: -200px;
          right: -80px;
          width: 14px;
          height: 380px;
          background: linear-gradient(180deg, transparent 0%, #fbbf24 30%, #ef4444 80%, #ffffff 100%);
          box-shadow: 0 0 30px #ef4444, 0 0 50px #fbbf24;
          transform: rotate(35deg);
          border-radius: 9999px;
          animation: meteorCrash 0.35s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes meteorCrash {
          0% { transform: translateY(-160px) rotate(35deg) scaleY(0.4); opacity: 0.2; }
          40% { transform: translateY(0) rotate(35deg) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(40px) rotate(35deg) scaleY(1.4); opacity: 0; }
        }

        .vfx-meteor-crater-shockwave {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 40px;
          border-radius: 50%;
          border: 6px solid #fbbf24;
          box-shadow: 0 0 25px #ef4444, inset 0 0 15px #f59e0b;
          animation: craterShockwave 0.35s ease-out forwards;
        }

        @keyframes craterShockwave {
          0% { transform: translateX(-50%) scale(0.3); opacity: 0.9; }
          100% { transform: translateX(-50%) scale(1.6); opacity: 0; }
        }

        .vfx-meteor-debris-burst {
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #ffffff 0%, #ef4444 60%, transparent 100%);
          border-radius: 50%;
          animation: debrisBurst 0.32s ease-out forwards;
        }

        @keyframes debrisBurst {
          0% { transform: translateX(-50%) scale(0.2); opacity: 1; }
          100% { transform: translateX(-50%) scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
