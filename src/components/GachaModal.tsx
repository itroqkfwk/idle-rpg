import React, { useEffect } from 'react';
import { Equipment } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface GachaModalProps {
  item: Equipment;
  onEquip: (item: Equipment) => void;
  onClose: () => void;
}

export const GachaModal: React.FC<GachaModalProps> = ({ item, onEquip, onClose }) => {
  const rarity = RARITY_CONFIGS[item.rarity];

  useEffect(() => {
    // Fire confetti for epic, legendary, mythic
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
        <div className="gacha-title-badge" style={{ background: rarity.bgColor, color: rarity.color, borderColor: rarity.borderColor }}>
          <Sparkles size={14} />
          <span>{rarity.label} 획득!</span>
        </div>

        {/* Revealed Item Box */}
        <div
          className="gacha-card"
          style={{
            borderColor: rarity.borderColor,
            boxShadow: `0 8px 30px ${rarity.glowColor}`,
            background: `radial-gradient(circle at 50% 30%, #ffffff 0%, ${rarity.bgColor} 100%)`,
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
          <button className="cozy-btn cozy-btn-gold gacha-equip-btn" onClick={() => onEquip(item)}>
            <span>즉시 장착하기</span>
          </button>
          <button className="cozy-btn cozy-btn-outline gacha-close-btn" onClick={onClose}>
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
          font-size: 0.85rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1.5px solid;
        }
        .gacha-card {
          width: 100%;
          border: 2px solid;
          border-radius: 20px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .gacha-item-icon {
          font-size: 4.2rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
          animation: itemBounce 1.5s ease-in-out infinite;
        }
        @keyframes itemBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .gacha-item-name {
          font-size: 1.25rem;
          font-weight: 900;
        }
        .gacha-item-slot {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--cozy-brown-light);
          letter-spacing: 0.5px;
        }
        .gacha-stats-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
        }
        .stat-chip {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          color: var(--cozy-brown);
        }
        .gacha-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }
        .gacha-equip-btn {
          width: 100%;
          min-height: 48px;
        }
        .gacha-close-btn {
          width: 100%;
          min-height: 42px;
        }
      `}</style>
    </div>
  );
};
