import React from 'react';
import { DamageNumberData } from '../types/game';

interface DamageNumbersProps {
  damages: DamageNumberData[];
}

export const DamageNumbers: React.FC<DamageNumbersProps> = ({ damages }) => {
  return (
    <div className="damage-numbers-layer">
      {damages.map((dmg) => (
        <div
          key={dmg.id}
          className={`damage-number-pop ${
            dmg.isCritical
              ? 'dmg-crit'
              : dmg.isPlayer
              ? 'dmg-player-hit'
              : 'dmg-normal'
          }`}
          style={{
            left: `${dmg.x}px`,
            top: `${dmg.y}px`,
          }}
        >
          {dmg.isCritical && <span className="crit-burst-label">CRIT! </span>}
          {dmg.value.toLocaleString()}
        </div>
      ))}

      <style>{`
        .damage-numbers-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 50;
        }
        .crit-burst-label {
          font-size: 0.6em;
          display: block;
          line-height: 1;
          letter-spacing: 1.5px;
          color: #fef08a;
          text-shadow: 0 0 10px #ff0055, -2px -2px 0 #78350f, 2px -2px 0 #78350f, -2px 2px 0 #78350f, 2px 2px 0 #78350f;
        }
      `}</style>
    </div>
  );
};
