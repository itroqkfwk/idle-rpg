import React, { useState, useEffect } from 'react';
import { Monster, DamageNumberData } from '../types/game';
import { Skull } from 'lucide-react';

interface EnemyCharacterProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
  isAttacking: boolean;
  isHitStop?: boolean;
  damages?: DamageNumberData[];
}

export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({
  monster,
  isHit,
  isDefeated,
  isAttacking,
  isHitStop,
  damages,
}) => {
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const hpPercent = Math.max(0, Math.min(100, Math.round((monster.currentHp / monster.maxHp) * 100)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setGhostHpPercent(hpPercent);
    }, 350);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  const isBoss = monster.isBoss || monster.id.includes('boss');

  // Determine monster sprite & idle animation type
  const getMonsterType = () => {
    if (isBoss) return { sprite: '/assets/boss_golem.png', idleClass: 'boss-act-idle', sizeClass: 'boss-size' };
    if (monster.id.includes('m2') || monster.name.includes('버섯')) {
      return { sprite: '/assets/monster_mushroom.png', idleClass: 'mushroom-act-idle', sizeClass: 'medium-size' };
    }
    if (monster.id.includes('m3') || monster.name.includes('벌') || monster.name.includes('다람쥐')) {
      return { sprite: '/assets/monster_bee.png', idleClass: 'bee-act-idle', sizeClass: 'medium-size' };
    }
    if (monster.id.includes('m4') || monster.name.includes('요정') || monster.name.includes('정령')) {
      return { sprite: '/assets/monster_spirit.png', idleClass: 'spirit-act-idle', sizeClass: 'medium-size' };
    }
    return { sprite: '/assets/monster_slime.png', idleClass: 'slime-act-idle', sizeClass: 'slime-size' };
  };

  const monsterConfig = getMonsterType();

  return (
    <div className={`enemy-character-box ${isBoss ? 'is-boss-combatant' : ''}`}>
      {/* 💥 Overhead Damage Numbers strictly anchored to Monster Sprite */}
      <div className="monster-damage-anchor-layer">
        {damages && damages.map((dmg) => (
          <div
            key={dmg.id}
            className={`monster-dmg-pop ${dmg.isCritical ? 'dmg-crit' : 'dmg-normal'}`}
            style={{ transform: `translateX(${dmg.offsetX ?? 0}px)` }}
          >
            {dmg.isCritical && <span className="crit-burst-label">CRIT!</span>}
            {dmg.value.toLocaleString()}
          </div>
        ))}
      </div>

      {/* Overhead Enemy HP Cluster */}
      <div className="combatant-hp-cluster">
        <div className="combatant-name-tag">
          {isBoss ? (
            <span className="boss-lvl-badge">
              <Skull size={10} /> BOSS
            </span>
          ) : (
            <span className="enemy-lvl-badge">MONSTER</span>
          )}
          <span className="enemy-name-text">{monster.name}</span>
        </div>

        <div className={`combatant-hp-track ${isBoss ? 'boss-hp-track' : ''}`}>
          <div className="combatant-hp-ghost" style={{ width: `${ghostHpPercent}%` }} />
          <div
            className={`combatant-hp-fill ${isBoss ? 'boss-hp-fill' : 'enemy-hp-fill'}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="combatant-hp-val">
          {monster.currentHp} / {monster.maxHp}
        </div>
      </div>

      {/* 2D Sprite Body Stage */}
      <div
        className={`enemy-sprite-wrapper ${
          isDefeated
            ? 'enemy-act-defeat'
            : isHit
            ? 'enemy-act-hit'
            : isAttacking
            ? 'enemy-act-attack'
            : monsterConfig.idleClass
        } ${isHitStop ? 'hit-stop-freeze' : ''}`}
      >
        {/* Soft Ground Contact Shadow */}
        <div className={`character-ground-shadow ${isBoss ? 'boss-ground-shadow' : 'normal-ground-shadow'}`} />

        {/* 2D Monster Sprite */}
        <img
          src={monsterConfig.sprite}
          alt={monster.name}
          className={`monster-2d-sprite ${monsterConfig.sizeClass}`}
          draggable={false}
        />

        {/* Impact Hit Torso Spark & Flash VFX */}
        {isHit && (
          <div className="enemy-hit-burst-vfx">
            <div className="impact-flash-ring" />
            <div className="star-sparkle spark-1">✦</div>
            <div className="star-sparkle spark-2">✦</div>
            <div className="star-sparkle spark-3">✦</div>
          </div>
        )}

        {/* Ground Knockback Dust */}
        {isHit && <div className="enemy-knockback-dust" />}
      </div>

      <style>{`
        .enemy-character-box {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
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

        .enemy-lvl-badge {
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 9999px;
          letter-spacing: 0.5px;
        }

        .boss-lvl-badge {
          background: linear-gradient(135deg, #ef4444, #991b1b);
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          padding: 1px 6px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
        }

        .enemy-name-text {
          font-size: 11px;
          font-weight: 800;
          color: #f8fafc;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 2px #000;
        }

        .combatant-hp-track {
          position: relative;
          width: 88px;
          height: 6px;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .boss-hp-track {
          width: 130px;
          height: 9px;
          border-color: rgba(239, 68, 68, 0.6);
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

        .enemy-hp-fill {
          background: linear-gradient(90deg, #ea580c 0%, #f97316 70%, #fdba74 100%);
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
        }

        .boss-hp-fill {
          background: linear-gradient(90deg, #b91c1c 0%, #ef4444 60%, #f87171 100%);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.85);
        }

        .combatant-hp-val {
          font-size: 9px;
          font-weight: 800;
          color: #cbd5e1;
          text-shadow: 0 1px 2px #000;
          margin-top: 2px;
        }

        /* 💥 Overhead Damage Numbers strictly anchored to Monster Head */
        .monster-damage-anchor-layer {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .monster-dmg-pop {
          position: absolute;
          bottom: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          letter-spacing: -0.5px;
          white-space: nowrap;
          pointer-events: none;
        }

        .dmg-normal {
          color: #ffffff;
          font-size: 1.35rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 4px #000;
          animation: monsterDmgPopAnim 0.42s ease-out forwards;
        }

        .dmg-crit {
          color: #fde047;
          font-size: 1.7rem;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px #ea580c;
          animation: monsterCritPopAnim 0.45s cubic-bezier(0.18, 0.9, 0.32, 1.25) forwards;
        }

        @keyframes monsterDmgPopAnim {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(10px);
          }
          20% {
            opacity: 1;
            transform: scale(1.18) translateY(-4px);
          }
          40% {
            transform: scale(1) translateY(-14px);
          }
          80% {
            opacity: 1;
            transform: scale(1) translateY(-24px);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translateY(-32px);
          }
        }

        @keyframes monsterCritPopAnim {
          0% {
            opacity: 0;
            transform: scale(0.4) translateY(12px);
          }
          25% {
            opacity: 1;
            transform: scale(1.35) translateY(-8px);
          }
          50% {
            transform: scale(1.08) translateY(-18px);
          }
          80% {
            opacity: 1;
            transform: scale(1) translateY(-28px);
          }
          100% {
            opacity: 0;
            transform: scale(0.85) translateY(-38px);
          }
        }

        .crit-burst-label {
          display: block;
          font-size: 0.58em;
          line-height: 1;
          letter-spacing: 1.5px;
          color: #f97316;
          text-shadow: 0 0 8px #fde047, 0 1px 3px #000;
          text-align: center;
        }

        .hit-stop-freeze {
          animation-play-state: paused !important;
        }

        .enemy-sprite-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-origin: bottom center;
        }

        /* Distinct Silhouettes and Proportions (Meeting 390x844 spec) */
        .slime-size {
          width: 148px;
          height: 140px;
        }

        .medium-size {
          width: 155px;
          height: 175px;
        }

        .boss-size {
          width: 230px;
          height: 235px;
        }

        .character-ground-shadow {
          position: absolute;
          bottom: 2px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        .normal-ground-shadow {
          width: 105px;
          height: 18px;
        }

        .boss-ground-shadow {
          width: 175px;
          height: 26px;
        }

        .monster-2d-sprite {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
          z-index: 2;
          pointer-events: none;
        }

        /* 💥 Impact Torso Flash & Starburst */
        .enemy-hit-burst-vfx {
          position: absolute;
          top: 45%;
          left: 45%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 15;
        }

        .impact-flash-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, rgba(254, 240, 138, 0.75) 45%, transparent 75%);
          animation: impactFlashRing 0.15s ease-out forwards;
        }

        @keyframes impactFlashRing {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }

        .star-sparkle {
          position: absolute;
          font-size: 24px;
          color: #fef08a;
          text-shadow: 0 0 8px #ff0055, 0 0 16px #ffffff;
          animation: sparkPop 0.22s ease-out forwards;
        }

        .spark-1 {
          transform: translate(-12px, -18px);
        }
        .spark-2 {
          transform: translate(16px, 6px);
          animation-delay: 0.04s;
        }
        .spark-3 {
          transform: translate(-6px, 14px);
          animation-delay: 0.08s;
        }

        @keyframes sparkPop {
          0% { transform: scale(0.3) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.4) rotate(45deg); opacity: 0; }
        }

        .enemy-knockback-dust {
          position: absolute;
          bottom: 2px;
          right: 20px;
          width: 26px;
          height: 12px;
          border-radius: 50%;
          background: rgba(180, 170, 140, 0.65);
          filter: blur(2px);
          animation: knockbackDust 0.28s ease-out forwards;
        }

        @keyframes knockbackDust {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.6) translateX(12px); opacity: 0; }
        }

        /* Idle Animations by Monster Archetype */
        .slime-act-idle {
          animation: slimeSquash 1.6s ease-in-out infinite;
        }

        @keyframes slimeSquash {
          0%, 100% { transform: scale(1, 1); }
          45% { transform: scale(1.08, 0.92) translateY(2px); }
          70% { transform: scale(0.95, 1.05) translateY(-4px); }
        }

        .mushroom-act-idle {
          animation: mushroomBob 1.8s ease-in-out infinite;
        }

        @keyframes mushroomBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }

        .bee-act-idle {
          animation: beeHover 0.85s ease-in-out infinite;
        }

        @keyframes beeHover {
          0%, 100% { transform: translateY(-16px) scale(1); }
          50% { transform: translateY(-24px) scale(1.02); }
        }

        .spirit-act-idle {
          animation: spiritFloat 2.2s ease-in-out infinite;
        }

        @keyframes spiritFloat {
          0%, 100% { transform: translateY(-12px) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); filter: drop-shadow(0 0 12px rgba(52, 211, 153, 0.7)); }
        }

        .boss-act-idle {
          animation: bossRumble 2.4s ease-in-out infinite;
        }

        @keyframes bossRumble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02, 0.98); }
        }

        /* Attack Lunge */
        .enemy-act-attack {
          animation: enemyLungeAnim 0.22s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        @keyframes enemyLungeAnim {
          0% { transform: translateX(0); }
          40% { transform: translateX(-34px) scale(1.06); }
          100% { transform: translateX(0); }
        }

        /* Hit Knockback & White Flash (Contact Reaction) */
        .enemy-act-hit {
          animation: enemyKnockbackAnim 0.24s cubic-bezier(0.2, 0.85, 0.3, 1) forwards;
          filter: brightness(2.8) contrast(1.25) drop-shadow(0 0 16px rgba(255, 255, 255, 0.95));
        }

        @keyframes enemyKnockbackAnim {
          0% { transform: translateX(0) scale(1, 1); }
          25% { transform: translateX(9px) scale(0.92, 1.08); }
          65% { transform: translateX(4px) scale(1.04, 0.96); }
          100% { transform: translateX(0) scale(1, 1); }
        }

        /* Defeat Fade & Scale Down */
        .enemy-act-defeat {
          animation: enemyDefeatDissolve 0.36s ease-in forwards;
        }

        @keyframes enemyDefeatDissolve {
          0% { opacity: 1; transform: scale(1); filter: brightness(2); }
          50% { opacity: 0.6; transform: scale(1.1) translateY(-6px); filter: brightness(3) drop-shadow(0 0 20px #f59e0b); }
          100% { opacity: 0; transform: scale(0.3) translateY(16px); filter: brightness(1); }
        }
      `}</style>
    </div>
  );
};
