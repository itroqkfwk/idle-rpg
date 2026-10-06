import React from 'react';
import { Skill } from '../types/game';

interface SkillStatusHUDProps {
  skills: Skill[];
  equippedSkillIds: (string | null)[];
  skillCooldowns: Record<string, number>;
  castingSkillId?: string | null;
}

export const SkillStatusHUD: React.FC<SkillStatusHUDProps> = ({
  skills,
  equippedSkillIds,
  skillCooldowns,
  castingSkillId,
}) => {
  const slots = [0, 1, 2, 3].map((idx) => {
    const skillId = equippedSkillIds[idx];
    const skill = skillId ? skills.find((s) => s.id === skillId) : null;
    const cd = skillId ? (skillCooldowns[skillId] ?? 0) : 0;
    const maxCd = skill?.cooldown ?? 1;
    const isReady = skill !== null && cd <= 0.05;
    const percent = skill ? Math.min(100, Math.max(0, ((maxCd - cd) / maxCd) * 100)) : 0;
    const isCasting = skillId !== null && castingSkillId === skillId;

    return {
      slotNum: idx + 1,
      skill,
      cd,
      isReady,
      percent,
      isCasting,
    };
  });

  return (
    <div className="skill-status-hud-root">
      <div className="skill-hud-container">
        {slots.map((item) => {
          if (!item.skill) {
            return (
              <div key={item.slotNum} className="skill-slot-box slot-empty">
                <span className="slot-empty-num">{item.slotNum}</span>
              </div>
            );
          }

          const { skill, cd, isReady, percent, isCasting } = item;

          return (
            <div
              key={skill.id}
              className={`skill-slot-box rarity-${skill.rarity} ${
                isReady ? 'is-ready-pulse' : 'is-cooling'
              } ${isCasting ? 'is-casting-flash' : ''}`}
              title={`${skill.name} (자동 발동)`}
            >
              {/* Radial or Linear Cooldown Shade */}
              {!isReady && (
                <div
                  className="cooldown-dark-shade"
                  style={{ height: `${100 - percent}%` }}
                />
              )}

              {/* Skill Icon */}
              <div className="skill-icon-glyph">{skill.icon}</div>

              {/* Skill Name (Visible on PC) */}
              <div className="skill-label-col">
                <span className="skill-name-text">{skill.name}</span>
                <span className={`skill-cd-text ${isReady ? 'ready-text' : ''}`}>
                  {isReady ? 'READY' : `${cd.toFixed(1)}s`}
                </span>
              </div>

              {/* Mobile Timer Badge */}
              <div className="mobile-cd-tag">
                {isReady ? 'RDY' : `${Math.ceil(cd)}s`}
              </div>

              {/* Ready Glow Rim */}
              {isReady && <div className="ready-glow-ring" />}
            </div>
          );
        })}
      </div>

      <style>{`
        .skill-status-hud-root {
          position: absolute;
          z-index: 25;
          pointer-events: none;
          user-select: none;
          display: flex;
          justify-content: center;
          width: 100%;
          left: 0;
          bottom: 74px;
        }

        .skill-hud-container {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: rgba(11, 18, 33, 0.75);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
        }

        .skill-slot-box {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.16);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .slot-empty {
          opacity: 0.35;
          border-style: dashed;
        }

        .slot-empty-num {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
        }

        .skill-icon-glyph {
          font-size: 18px;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
        }

        .cooldown-dark-shade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.72);
          z-index: 3;
          pointer-events: none;
          transition: height 0.1s linear;
        }

        .skill-label-col {
          display: none; /* Shown on PC */
        }

        .mobile-cd-tag {
          position: absolute;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 8px;
          font-weight: 900;
          color: #f8fafc;
          text-shadow: 0 1px 2px #000, 0 0 2px #000;
          z-index: 4;
          white-space: nowrap;
        }

        .is-ready-pulse .mobile-cd-tag {
          color: #fef08a;
        }

        .ready-glow-ring {
          position: absolute;
          inset: 0;
          border-radius: 9px;
          border: 1.5px solid #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.6), inset 0 0 6px rgba(251, 191, 36, 0.3);
          pointer-events: none;
          z-index: 5;
          animation: readyGlowPulse 1.8s infinite alternate;
        }

        @keyframes readyGlowPulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .is-casting-flash {
          transform: scale(1.12);
          filter: brightness(1.6);
        }

        /* Rarity Border Accents */
        .rarity-common { border-color: rgba(148, 163, 184, 0.4); }
        .rarity-rare { border-color: rgba(56, 189, 248, 0.5); }
        .rarity-epic { border-color: rgba(168, 85, 247, 0.6); }
        .rarity-legendary { border-color: rgba(245, 158, 11, 0.7); }

        /* 🖥️ PC Responsive Skill Status Bar (width >= 768px) */
        @media (min-width: 768px) {
          .skill-status-hud-root {
            bottom: 84px;
          }

          .skill-hud-container {
            gap: 12px;
            padding: 6px 14px;
            border-radius: 16px;
            background: rgba(11, 18, 33, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
          }

          .skill-slot-box {
            width: 140px;
            height: 44px;
            border-radius: 12px;
            padding: 0 8px;
            justify-content: flex-start;
            gap: 8px;
          }

          .skill-icon-glyph {
            font-size: 20px;
          }

          .skill-label-col {
            display: flex;
            flex-direction: column;
            gap: 1px;
            z-index: 4;
            min-width: 0;
            flex: 1;
          }

          .skill-name-text {
            font-size: 11px;
            font-weight: 800;
            color: #f8fafc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          }

          .skill-cd-text {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            font-family: monospace;
          }

          .ready-text {
            color: #fbbf24;
            font-weight: 900;
            text-shadow: 0 0 6px rgba(251, 191, 36, 0.6);
          }

          .mobile-cd-tag {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
