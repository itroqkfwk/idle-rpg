import React from 'react';
import { Skill, PromotionId } from '../types/game';

interface SkillStatusHUDProps {
  skills: Skill[];
  equippedSkillIds: (string | null)[];
  skillCooldowns: Record<string, number>;
  castingSkillId?: string | null;
  awakeningUnlocked?: boolean;
  awakeningGauge?: number;
  isAwakeningCasting?: boolean;
  promotion?: PromotionId;
  awakeningSkill?: Skill | null;
}

const RARITY_LABEL: Record<string, string> = {
  common: 'N',
  rare: 'R',
  epic: 'E',
  legendary: 'L',
  mythic: 'M',
};

export const SkillStatusHUD: React.FC<SkillStatusHUDProps> = ({
  skills,
  equippedSkillIds,
  skillCooldowns,
  castingSkillId,
  awakeningUnlocked = false,
  awakeningGauge = 0,
  isAwakeningCasting = false,
  promotion = 'none',
  awakeningSkill = null,
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

  const isAwakeningReady = awakeningGauge >= 100;
  const awakeningPercent = Math.min(100, Math.max(0, Math.round(awakeningGauge)));

  return (
    <div className="skill-status-hud-root">
      <div className="skill-hud-container">
        {/* 4 Standard Auto Skill Slots */}
        {slots.map((item) => {
          if (!item.skill) {
            return (
              <div key={item.slotNum} className="rpg-skill-slot slot-empty">
                <span className="slot-empty-num">{item.slotNum}</span>
                <span className="slot-empty-sub">EMPTY</span>
              </div>
            );
          }

          const { skill, cd, isReady, percent, isCasting } = item;
          const rarityBadge = RARITY_LABEL[skill.rarity] || 'N';

          return (
            <div
              key={skill.id}
              className={`rpg-skill-slot rarity-${skill.rarity} ${
                isReady ? 'is-ready-pulse' : 'is-cooling'
              } ${isCasting ? 'is-casting-flash' : ''}`}
              title={`${skill.name} (Lv.${skill.level}) - 자동 발동`}
            >
              {/* Radial Cooldown Conic Overlay */}
              {!isReady && (
                <div
                  className="cooldown-radial-shade"
                  style={{
                    background: `conic-gradient(rgba(0,0,0,0.78) ${100 - percent}%, transparent 0)`,
                  }}
                />
              )}

              {/* Top Row: Rarity Tag & Level */}
              <div className="slot-header-row">
                <span className={`slot-rarity-chip chip-${skill.rarity}`}>{rarityBadge}</span>
                <span className="slot-level-text">Lv.{skill.level}</span>
              </div>

              {/* Center: Skill Icon */}
              <div className="slot-icon-container">
                <span className="skill-icon-glyph">{skill.icon}</span>
                {!isReady && (
                  <span className="cooldown-seconds-tag">{cd.toFixed(1)}s</span>
                )}
              </div>

              {/* Bottom: Skill Name */}
              <div className="slot-footer-name">
                <span className="skill-name-txt">{skill.name}</span>
              </div>

              {/* Ready Pulsing Glow Rim */}
              {isReady && <div className="ready-glow-ring" />}
            </div>
          );
        })}

        {/* 👑 Special Awakening Slot (Unlocked via Promotion) */}
        {awakeningUnlocked && (
          <div
            className={`rpg-skill-slot awakening-skill-slot ${
              isAwakeningReady ? 'is-awakening-ready' : 'is-awakening-charging'
            } ${isAwakeningCasting ? 'is-casting-flash' : ''}`}
            title={`${awakeningSkill?.name || '각성기'} (Lv.${awakeningSkill?.level || 1}) - 100% 충전 시 자동 발동`}
          >
            {/* Awakening Radial/Height Shade */}
            {!isAwakeningReady && (
              <div
                className="cooldown-radial-shade awakening-shade"
                style={{
                  background: `conic-gradient(rgba(10, 5, 20, 0.82) ${100 - awakeningPercent}%, transparent 0)`,
                }}
              />
            )}

            {/* Top Row */}
            <div className="slot-header-row">
              <span className="slot-rarity-chip chip-mythic">AWK</span>
              <span className="slot-level-text">Lv.{awakeningSkill?.level || 1}</span>
            </div>

            {/* Center: Awakening Icon */}
            <div className="slot-icon-container">
              <span className="skill-icon-glyph awakening-glyph">
                {awakeningSkill?.icon || (promotion === 'archmage' ? '✨🌌' : '👑⚡')}
              </span>
              {!isAwakeningReady ? (
                <span className="awakening-gauge-tag">{awakeningPercent}%</span>
              ) : (
                <span className="awakening-ready-tag">READY</span>
              )}
            </div>

            {/* Bottom: Awakening Name */}
            <div className="slot-footer-name">
              <span className="skill-name-txt awakening-title">
                {awakeningSkill?.name || '각성기'}
              </span>
            </div>

            {/* Awakening Animated Glow Ring */}
            {isAwakeningReady && <div className="awakening-glow-ring" />}
          </div>
        )}
      </div>

      <style>{`
        .skill-status-hud-root {
          position: absolute;
          z-index: 60;
          pointer-events: none;
          user-select: none;
          display: flex;
          justify-content: center;
          width: 100%;
          left: 0;
          bottom: 68px;
          transition: bottom 0.2s ease;
        }

        .skill-hud-container {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          background: rgba(11, 18, 33, 0.82);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        }

        /* 📱 Mobile Slot Size: 58px */
        .rpg-skill-slot {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.16);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 3px 4px 2px;
          box-sizing: border-box;
          flex-shrink: 0;
          transition: transform 0.12s ease, border-color 0.15s ease;
        }

        .slot-empty {
          opacity: 0.35;
          border-style: dashed;
          justify-content: center;
          gap: 2px;
        }

        .slot-empty-num {
          font-size: 13px;
          font-weight: 800;
          color: #64748b;
        }

        .slot-empty-sub {
          font-size: 8px;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.5px;
        }

        .slot-header-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 4;
          line-height: 1;
        }

        .slot-rarity-chip {
          font-size: 7.5px;
          font-weight: 900;
          padding: 1px 3px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          letter-spacing: -0.2px;
        }

        .chip-common { color: #94a3b8; background: rgba(148, 163, 184, 0.2); }
        .chip-rare { color: #38bdf8; background: rgba(56, 189, 248, 0.25); }
        .chip-epic { color: #c084fc; background: rgba(192, 132, 252, 0.25); }
        .chip-legendary { color: #fbbf24; background: rgba(251, 191, 36, 0.25); }
        .chip-mythic { color: #f87171; background: rgba(248, 113, 113, 0.28); }

        .slot-level-text {
          font-size: 8px;
          font-weight: 800;
          color: #94a3b8;
          font-family: monospace;
        }

        .slot-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          margin-top: -2px;
        }

        .skill-icon-glyph {
          font-size: 19px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7));
        }

        .cooldown-seconds-tag {
          position: absolute;
          font-size: 9px;
          font-weight: 900;
          color: #f8fafc;
          text-shadow: 0 1px 3px #000, 0 0 4px #000;
          background: rgba(0, 0, 0, 0.55);
          padding: 0 3px;
          border-radius: 4px;
        }

        .slot-footer-name {
          width: 100%;
          text-align: center;
          z-index: 4;
          line-height: 1;
        }

        .skill-name-txt {
          font-size: 8px;
          font-weight: 800;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
        }

        .cooldown-radial-shade {
          position: absolute;
          inset: 0;
          border-radius: 11px;
          z-index: 3;
          pointer-events: none;
        }

        .ready-glow-ring {
          position: absolute;
          inset: 0;
          border-radius: 11px;
          border: 1.5px solid #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.7), inset 0 0 6px rgba(251, 191, 36, 0.3);
          pointer-events: none;
          z-index: 5;
          animation: readyGlowPulse 1.8s infinite alternate;
        }

        @keyframes readyGlowPulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .is-casting-flash {
          transform: scale(1.08);
          filter: brightness(1.5);
        }

        /* Awakening Slot */
        .awakening-skill-slot {
          border: 1.5px solid #eab308;
          background: linear-gradient(145deg, rgba(30, 27, 75, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%);
        }

        .awakening-title {
          color: #fbbf24 !important;
        }

        .awakening-gauge-tag {
          position: absolute;
          font-size: 8.5px;
          font-weight: 900;
          color: #fef08a;
          text-shadow: 0 1px 3px #000, 0 0 3px #000;
          background: rgba(0, 0, 0, 0.65);
          padding: 0 3px;
          border-radius: 4px;
        }

        .awakening-ready-tag {
          position: absolute;
          font-size: 8px;
          font-weight: 900;
          color: #fbbf24;
          text-shadow: 0 0 6px rgba(251, 191, 36, 0.8);
          background: rgba(0, 0, 0, 0.7);
          padding: 0 4px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }

        .is-awakening-ready {
          border-color: #fbbf24;
          box-shadow: 0 0 14px rgba(251, 191, 36, 0.7);
          animation: awakeningPulse 1.2s infinite alternate;
        }

        @keyframes awakeningPulse {
          0% { transform: scale(1); filter: brightness(1); }
          100% { transform: scale(1.04); filter: brightness(1.22); }
        }

        .awakening-glow-ring {
          position: absolute;
          inset: 0;
          border-radius: 11px;
          border: 2px solid #fbbf24;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.8), inset 0 0 8px rgba(245, 158, 11, 0.5);
          pointer-events: none;
          z-index: 5;
        }

        /* Rarity Border Styles */
        .rarity-common { border-color: rgba(148, 163, 184, 0.35); }
        .rarity-rare { border-color: rgba(56, 189, 248, 0.5); box-shadow: 0 0 8px rgba(56, 189, 248, 0.2); }
        .rarity-epic { border-color: rgba(168, 85, 247, 0.6); box-shadow: 0 0 10px rgba(168, 85, 247, 0.25); }
        .rarity-legendary { border-color: rgba(245, 158, 11, 0.7); box-shadow: 0 0 12px rgba(245, 158, 11, 0.3); }
        .rarity-mythic { border-color: rgba(239, 68, 68, 0.8); box-shadow: 0 0 14px rgba(239, 68, 68, 0.35); }

        /* 💻 Compact Desktop Layout (700px ~ 1439px): Slot Size: 66px */
        @media (min-width: 700px) {
          .skill-status-hud-root {
            bottom: calc(var(--bottom-nav-height, 64px) + 16px);
          }

          .skill-hud-container {
            gap: 8px;
            padding: 6px 10px;
            border-radius: 18px;
            background: rgba(11, 18, 33, 0.88);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
          }

          .rpg-skill-slot {
            width: 66px;
            height: 66px;
            border-radius: 14px;
            padding: 4px 5px 3px;
          }

          .slot-rarity-chip {
            font-size: 8px;
            padding: 1px 4px;
          }

          .slot-level-text {
            font-size: 8.5px;
          }

          .skill-icon-glyph {
            font-size: 22px;
          }

          .skill-name-txt {
            font-size: 8.5px;
          }

          .cooldown-seconds-tag, .awakening-gauge-tag {
            font-size: 9.5px;
          }

          .ready-glow-ring, .awakening-glow-ring {
            border-radius: 13px;
          }
        }

        /* 🖥️ Wide Desktop Layout (>= 1440px): Slot Size: 76px */
        @media (min-width: 1440px) {
          .rpg-skill-slot {
            width: 76px;
            height: 76px;
            border-radius: 16px;
            padding: 5px 6px 4px;
          }

          .slot-rarity-chip {
            font-size: 9px;
            padding: 1px 5px;
          }

          .slot-level-text {
            font-size: 9.5px;
          }

          .skill-icon-glyph {
            font-size: 25px;
          }

          .skill-name-txt {
            font-size: 9.5px;
          }

          .cooldown-seconds-tag, .awakening-gauge-tag {
            font-size: 10.5px;
          }

          .ready-glow-ring, .awakening-glow-ring {
            border-radius: 15px;
          }
        }
      `}</style>
    </div>
  );
};
