import React from 'react';
import { SkillEffectType, CharacterClassId } from '../types/game';

interface SkillVfxLayerProps {
  activeSkillVfx: { id: string; type: SkillEffectType } | null;
  isAwakeningCasting?: boolean;
  classId?: CharacterClassId;
}

/**
 * SkillVfxLayer:
 * Full-screen cinematic atmosphere overlay.
 * (All procedural blade slashes, projectiles, shockwaves, and lightning are rendered
 * with GPU-accelerated Canvas 2D in BattleFxCanvas.tsx - zero cheap CSS divs or text emojis!)
 */
export const SkillVfxLayer: React.FC<SkillVfxLayerProps> = ({
  activeSkillVfx,
  isAwakeningCasting = false,
  classId = 'warrior',
}) => {
  const isAwakening = isAwakeningCasting || activeSkillVfx?.type === 'heavenly_blade' || activeSkillVfx?.type === 'astral_cataclysm';

  return (
    <div className="skill-vfx-overlay-layer">
      {/* 👑 Cinematic Awakening Sky Dimming & Atmosphere Vignette */}
      {isAwakening && (
        <div
          className={`awakening-cinema-dimmer ${classId === 'warrior' ? 'warrior-golden-dimmer' : 'mage-astral-dimmer'}`}
        />
      )}

      {/* 💥 Awakening Impact White Pulse (Subtle Fullscreen Bloom) */}
      {isAwakening && <div className="awakening-bloom-pulse" />}

      <style>{`
        .skill-vfx-overlay-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 22;
          overflow: hidden;
        }

        /* 👑 Awakening Atmosphere Dark Vignette */
        .awakening-cinema-dimmer {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: cinemaDimmerFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .warrior-golden-dimmer {
          background: radial-gradient(circle at 68% 58%, rgba(245, 158, 11, 0.18) 0%, rgba(10, 10, 15, 0.65) 75%);
        }

        .mage-astral-dimmer {
          background: radial-gradient(circle at 68% 58%, rgba(168, 85, 247, 0.22) 0%, rgba(5, 5, 12, 0.72) 75%);
        }

        @keyframes cinemaDimmerFade {
          0% { opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* 💥 Awakening Fullscreen Bloom Flash */
        .awakening-bloom-pulse {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.28);
          opacity: 0;
          animation: bloomPulseAnim 0.4s ease-out 0.24s forwards;
        }

        @keyframes bloomPulseAnim {
          0% { opacity: 0; }
          30% { opacity: 0.35; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
