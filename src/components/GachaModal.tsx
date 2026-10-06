import React, { useEffect } from 'react';
import { Equipment } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';
import confetti from 'canvas-confetti';
import { Sparkles, Check } from 'lucide-react';

interface GachaModalProps {
  item: Equipment;
  onEquip: (item: Equipment) => void;
  onClose: () => void;
}

export const GachaModal: React.FC<GachaModalProps> = ({ item, onEquip, onClose }) => {
  const rarity = RARITY_CONFIGS[item.rarity];

  useEffect(() => {
    if (item.rarity === 'epic' || item.rarity === 'legendary' || item.rarity === 'mythic') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [item]);

  return (
    <div className="modal-backdrop">
      <div className="modal-content gacha-modal-content">
        <div
          className="gacha-title-badge"
          style={{ background: rarity.bgColor, color: rarity.color, borderColor: rarity.borderColor }}
        >
          <Sparkles size={14} />
          <span>{rarity.label} 획득!</span>
        </div>

        {/* Revealed Item Box */}
        <div
          className="gacha-card"
          style={{
            borderColor: rarity.borderColor,
            boxShadow: `0 8px 30px ${rarity.glowColor}`,
            background: `radial-gradient(circle at 50% 30%, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)`,
          }}
        >
          <div className="gacha-item-icon">{item.icon}</div>
          <div className="gacha-item-name" style={{ color: rarity.color }}>
            {item.name}
          </div>
          <div className="gacha-item-slot">{item.slot.toUpperCase()} Lv.{item.level}</div>

          {/* Stats Preview */}
          <div className="gacha-stats-grid">
            {item.atk > 0 && <span className="stat-chip atk-chip">⚔️ ATK +{item.atk}</span>}
            {item.hp > 0 && <span className="stat-chip hp-chip">❤️ HP +{item.hp}</span>}
            {item.def > 0 && <span className="stat-chip def-chip">🛡️ DEF +{item.def}</span>}
            {item.critRate && (
              <span className="stat-chip crit-chip">
                🎯 치명타 +{Math.round(item.critRate * 100)}%
              </span>
            )}
          </div>
        </div>

        <div className="gacha-actions">
          <button className="btn-game btn-game-gold gacha-equip-btn" onClick={() => onEquip(item)}>
            <Check size={16} />
            <span>즉시 장착하기</span>
          </button>
          <button className="btn-game btn-game-wood gacha-close-btn" onClick={onClose}>
            <span>가방에 보관</span>
          </button>
        </div>
      </div>

      <style>{`
        .gacha-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .gacha-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid;
        }

        .gacha-card {
          width: 100%;
          border: 1.5px solid;
          border-radius: 20px;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .gacha-item-icon {
          font-size: 3.5rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
          animation: itemBounce 1.5s ease-in-out infinite;
        }

        @keyframes itemBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .gacha-item-name {
          font-size: 1.2rem;
          font-weight: 900;
        }

        .gacha-item-slot {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }

        .gacha-stats-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
        }

        .stat-chip {
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(10, 15, 28, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }

        .atk-chip { color: #f87171; }
        .hp-chip { color: #34d399; }
        .def-chip { color: #60a5fa; }
        .crit-chip { color: #fbbf24; }

        .gacha-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gacha-equip-btn {
          width: 100%;
          min-height: 42px;
        }

        .gacha-close-btn {
          width: 100%;
          min-height: 38px;
        }
      `}</style>
    </div>
  );
};
