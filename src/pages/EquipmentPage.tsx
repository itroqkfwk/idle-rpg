import React, { useState } from 'react';
import { Equipment, EquipmentSlot } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';
import { Zap, Sparkles, Check, ArrowUpRight, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface EquipmentPageProps {
  equipped: Partial<Record<EquipmentSlot, Equipment>>;
  inventory: Equipment[];
  gold: number;
  combatPower: number;
  onEquip: (item: Equipment) => void;
  onUnequip: (slot: EquipmentSlot) => void;
  onUpgradeItem: (itemId: string, cost: number) => void;
  onAutoEquip: () => void;
  onClose?: () => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({
  equipped,
  inventory,
  gold,
  combatPower,
  onEquip,
  onUnequip,
  onUpgradeItem,
  onAutoEquip,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);

  const slots: { slot: EquipmentSlot; label: string; placeholderIcon: string }[] = [
    { slot: 'weapon', label: '무기', placeholderIcon: '⚔️' },
    { slot: 'helmet', label: '투구', placeholderIcon: '🪖' },
    { slot: 'armor', label: '갑옷', placeholderIcon: '🛡️' },
    { slot: 'accessory', label: '장신구', placeholderIcon: '💍' },
  ];

  const getUpgradeCost = (item: Equipment) => {
    return Math.floor(100 * Math.pow(1.25, item.level) * RARITY_CONFIGS[item.rarity].multiplier);
  };

  const handleItemClick = (item: Equipment) => {
    sound.playTap();
    setSelectedItem(item);
  };

  const handleEquipAction = (item: Equipment) => {
    sound.playFanfare();
    onEquip(item);
    setSelectedItem(null);
  };

  const handleUnequipAction = (slot: EquipmentSlot) => {
    sound.playTap();
    onUnequip(slot);
    setSelectedItem(null);
  };

  const handleUpgradeAction = (item: Equipment) => {
    const cost = getUpgradeCost(item);
    if (gold >= cost) {
      sound.playUpgrade();
      onUpgradeItem(item.id, cost);
      setSelectedItem({
        ...item,
        level: item.level + 1,
        atk: item.atk > 0 ? Math.floor(item.atk * 1.15) + 2 : 0,
        hp: item.hp > 0 ? Math.floor(item.hp * 1.15) + 15 : 0,
        def: item.def > 0 ? Math.floor(item.def * 1.15) + 2 : 0,
      });
    }
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <span>🎒 장비 관리 & 인벤토리</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} color="#fef08a" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Equipped Paper Doll 4 Slots Row */}
        <div className="parchment-panel paperdoll-slots-panel">
          <div className="paperdoll-grid">
            {slots.map(({ slot, label, placeholderIcon }) => {
              const item = equipped[slot];
              const rarity = item ? RARITY_CONFIGS[item.rarity] : null;

              return (
                <div
                  key={slot}
                  className={`paperdoll-slot ${item ? 'slot-occupied' : 'slot-empty'}`}
                  style={
                    rarity
                      ? {
                          borderColor: rarity.borderColor,
                          background: `radial-gradient(circle, ${rarity.bgColor} 0%, #1e140d 100%)`,
                          boxShadow: `0 0 12px ${rarity.glowColor}`,
                        }
                      : {}
                  }
                  onClick={() => item && handleItemClick(item)}
                >
                  <span className="paperdoll-slot-label">{label}</span>
                  <div className="paperdoll-slot-icon">
                    {item ? item.icon : placeholderIcon}
                  </div>
                  {item ? (
                    <span className="paperdoll-slot-lvl" style={{ color: rarity?.color }}>
                      Lv.{item.level}
                    </span>
                  ) : (
                    <span className="paperdoll-empty-tag">빈 슬롯</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto Equip & Combat Power Bar */}
        <div className="auto-equip-action-bar">
          <div className="power-stat-box">
            <Sparkles size={16} color="#f59e0b" />
            <span className="power-stat-label">전투력:</span>
            <strong className="power-stat-val game-stroke-gold">{combatPower.toLocaleString()}</strong>
          </div>
          <button className="btn-game btn-game-gold auto-equip-press-btn" onClick={onAutoEquip}>
            <Zap size={16} />
            <span className="game-stroke">최고 장비 일괄 장착</span>
          </button>
        </div>

        {/* Inventory Header */}
        <div className="inventory-status-bar">
          <span className="inventory-count-text">보유 장비 ({inventory.length})</span>
          <span className="inventory-guide-tip">터치하여 상세 정보 / 강화</span>
        </div>

        {/* Inventory Grid with Velvet Cushions */}
        <div className="inventory-tiles-grid">
          {inventory.length === 0 ? (
            <div className="empty-backpack-box">
              <span style={{ fontSize: '2.5rem' }}>🎒</span>
              <p>인벤토리가 비어 있습니다.<br />상점에서 장비 상자를 열어보세요!</p>
            </div>
          ) : (
            inventory.map((item) => {
              const rarity = RARITY_CONFIGS[item.rarity];
              const isEquipped = Object.values(equipped).some((eq) => eq?.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`inv-tile-card ${isEquipped ? 'inv-tile-equipped' : ''}`}
                  style={{
                    borderColor: rarity.borderColor,
                    boxShadow: `0 2px 8px ${rarity.glowColor}`,
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  {isEquipped && (
                    <div className="equipped-ribbon-tag">
                      <Check size={10} color="#fff" />
                      <span>장착</span>
                    </div>
                  )}
                  <span className="inv-tile-icon">{item.icon}</span>
                  <span className="inv-tile-name" style={{ color: rarity.color }}>{item.name}</span>
                  <span className="inv-tile-level">Lv.{item.level}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Item Detail / Comparison Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content item-detail-modal-beveled" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header-row">
              <span
                className="detail-rarity-badge"
                style={{
                  background: RARITY_CONFIGS[selectedItem.rarity].bgColor,
                  color: RARITY_CONFIGS[selectedItem.rarity].color,
                  borderColor: RARITY_CONFIGS[selectedItem.rarity].borderColor,
                }}
              >
                {RARITY_CONFIGS[selectedItem.rarity].label}
              </span>
              <h3 className="detail-item-title game-stroke" style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }}>
                {selectedItem.name}
              </h3>
              <span className="detail-slot-badge">{selectedItem.slot.toUpperCase()} Lv.{selectedItem.level}</span>
            </div>

            <div className="detail-icon-stage">{selectedItem.icon}</div>

            {/* Stats Card */}
            <div className="detail-stats-box">
              {selectedItem.atk > 0 && (
                <div className="stat-comparison-row">
                  <span>⚔️ 공격력</span>
                  <strong className="stat-highlight">+{selectedItem.atk}</strong>
                </div>
              )}
              {selectedItem.hp > 0 && (
                <div className="stat-comparison-row">
                  <span>❤️ 체력</span>
                  <strong className="stat-highlight">+{selectedItem.hp}</strong>
                </div>
              )}
              {selectedItem.def > 0 && (
                <div className="stat-comparison-row">
                  <span>🛡️ 방어력</span>
                  <strong className="stat-highlight">+{selectedItem.def}</strong>
                </div>
              )}
              {selectedItem.critRate && (
                <div className="stat-comparison-row">
                  <span>🎯 치명타 확률</span>
                  <strong className="stat-highlight">+{Math.round(selectedItem.critRate * 100)}%</strong>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="detail-action-column">
              <button
                className="btn-game btn-game-gold detail-modal-btn"
                disabled={gold < getUpgradeCost(selectedItem)}
                onClick={() => handleUpgradeAction(selectedItem)}
              >
                <ArrowUpRight size={16} />
                <span className="game-stroke">장비 강화 (🪙 {getUpgradeCost(selectedItem).toLocaleString()})</span>
              </button>

              {equipped[selectedItem.slot]?.id === selectedItem.id ? (
                <button
                  className="btn-game btn-game-wood detail-modal-btn"
                  onClick={() => handleUnequipAction(selectedItem.slot)}
                >
                  <span className="game-stroke">장비 해제</span>
                </button>
              ) : (
                <button
                  className="btn-game btn-game-green detail-modal-btn"
                  onClick={() => handleEquipAction(selectedItem)}
                >
                  <span className="game-stroke">장비 장착</span>
                </button>
              )}

              <button className="btn-game btn-game-wood detail-modal-btn" onClick={() => setSelectedItem(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .paperdoll-slots-panel {
          padding: 10px;
        }

        .paperdoll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .paperdoll-slot {
          background: #24160d;
          border: 2px solid #5a3820;
          border-radius: 14px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.08s ease;
        }
        .paperdoll-slot:active {
          transform: scale(0.95);
        }

        .paperdoll-slot-label {
          font-family: var(--font-game);
          font-size: 0.65rem;
          color: #d4bda8;
        }

        .paperdoll-slot-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paperdoll-slot-lvl {
          font-family: var(--font-game);
          font-size: 0.65rem;
          font-weight: 900;
        }

        .paperdoll-empty-tag {
          font-size: 0.6rem;
          color: #785232;
        }

        .auto-equip-action-bar {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 14px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .power-stat-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .power-stat-label {
          font-family: var(--font-game);
          font-size: 0.8rem;
          color: #d4bda8;
        }

        .power-stat-val {
          font-size: 0.95rem;
        }

        .auto-equip-press-btn {
          min-height: 38px;
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .inventory-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .inventory-count-text {
          font-family: var(--font-game);
          font-size: 0.9rem;
          color: #fef08a;
        }

        .inventory-guide-tip {
          font-size: 0.7rem;
          color: #a8927e;
        }

        .inventory-tiles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .empty-backpack-box {
          grid-column: 1 / -1;
          background: #24160d;
          border: 1.5px dashed #5d3f28;
          border-radius: 16px;
          padding: 28px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #a8927e;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .inv-tile-card {
          position: relative;
          background: #24160d;
          border: 2px solid;
          border-radius: 14px;
          padding: 10px 4px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.08s ease;
        }
        .inv-tile-card:active {
          transform: scale(0.95);
        }

        .equipped-ribbon-tag {
          position: absolute;
          top: -6px;
          right: 4px;
          background: #15803d;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 2px;
          border: 1px solid #86efac;
        }

        .inv-tile-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 3px 5px rgba(0,0,0,0.5));
        }

        .inv-tile-name {
          font-family: var(--font-game);
          font-size: 0.72rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        .inv-tile-level {
          font-size: 0.65rem;
          color: #a8927e;
          font-weight: 700;
        }

        .item-detail-modal-beveled {
          background: linear-gradient(180deg, #422d1d 0%, #2b1d12 100%);
          border: 3px solid #f59e0b;
          border-radius: 20px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }

        .detail-header-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .detail-rarity-badge {
          font-family: var(--font-game);
          font-size: 0.75rem;
          padding: 2px 10px;
          border-radius: 12px;
          border: 1.5px solid;
        }

        .detail-item-title {
          font-size: 1.2rem;
        }

        .detail-slot-badge {
          font-size: 0.72rem;
          color: #d4bda8;
          font-weight: 800;
        }

        .detail-icon-stage {
          font-size: 3.8rem;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));
        }

        .detail-stats-box {
          width: 100%;
          background: #1e130b;
          border: 1.5px solid #5d3f28;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-comparison-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: #d4bda8;
        }

        .stat-highlight {
          color: #fef08a;
          font-family: var(--font-game);
          font-size: 0.95rem;
        }

        .detail-action-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .detail-modal-btn {
          width: 100%;
          min-height: 42px;
        }
      `}</style>
    </div>
  );
};
