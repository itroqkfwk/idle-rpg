import React, { useState, useEffect } from 'react';
import { Monster } from '../types/game';
import { Skull } from 'lucide-react';

interface EnemyCharacterProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
  isAttacking: boolean;
}

export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({
  monster,
  isHit,
  isDefeated,
  isAttacking,
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
        }`}
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

        {/* Impact Hit Starburst VFX */}
        {isHit && (
          <div className="enemy-hit-burst-vfx">
            <div className="star-sparkle spark-1">✦</div>
            <div className="star-sparkle spark-2">✦</div>
          </div>
        )}
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

        .enemy-sprite-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-origin: bottom center;
        }

        /* Distinct Silhouettes and Proportions */
        .slime-size {
          width: 130px;
          height: 118px;
        }

        .medium-size {
          width: 135px;
          height: 155px;
        }

        .boss-size {
          width: 195px;
          height: 195px;
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
          width: 95px;
          height: 16px;
        }

        .boss-ground-shadow {
          width: 160px;
          height: 24px;
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

        /* 💥 Impact Starburst */
        .enemy-hit-burst-vfx {
          position: absolute;
          top: 35%;
          left: 40%;
          pointer-events: none;
          z-index: 12;
        }

        .star-sparkle {
          position: absolute;
          font-size: 22px;
          color: #fef08a;
          text-shadow: 0 0 8px #ff0055, 0 0 14px #ffffff;
          animation: sparkPop 0.25s ease-out forwards;
        }

        .spark-1 {
          transform: translate(-10px, -15px);
        }
        .spark-2 {
          transform: translate(15px, 5px);
          animation-delay: 0.05s;
        }

        @keyframes sparkPop {
          0% { transform: scale(0.3) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.4) rotate(45deg); opacity: 0; }
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
          50% { transform: translateY(-5px) rotate(1.5deg); }
        }

        .bee-act-idle {
          animation: beeHover 1.2s ease-in-out infinite;
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

        /* Hit Shake & Brightness Flash */
        .enemy-act-hit {
          animation: enemyHitShake 0.16s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          filter: brightness(2) drop-shadow(0 0 14px rgba(255, 255, 255, 0.9));
        }

        @keyframes enemyHitShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          50% { transform: translateX(-6px); }
          75% { transform: translateX(3px); }
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
