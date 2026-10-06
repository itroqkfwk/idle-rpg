import React, { useState } from 'react';
import { Equipment, EquipmentSlot } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';
import { Zap, Sparkles, Check, ArrowUpRight, X, Shield } from 'lucide-react';
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
          <div className="drawer-title-icon">
            <Shield size={18} color="#38bdf8" />
          </div>
          <span>장비 관리 & 인벤토리</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        )}
      </div>

      <div className="drawer-content">
        {/* Equipped Paper Doll 4 Slots Row */}
        <div className="paperdoll-container">
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
            <Sparkles size={15} color="#f59e0b" />
            <span className="power-stat-label">전투력:</span>
            <strong className="power-stat-val">{combatPower.toLocaleString()}</strong>
          </div>
          <button className="btn-game btn-game-gold auto-equip-press-btn" onClick={onAutoEquip}>
            <Zap size={15} />
            <span>최고 장비 일괄 장착</span>
          </button>
        </div>

        {/* Inventory Header */}
        <div className="inventory-status-bar">
          <span className="inventory-count-text">보유 장비 ({inventory.length})</span>
          <span className="inventory-guide-tip">터치하여 상세 정보 / 강화</span>
        </div>

        {/* Inventory Grid */}
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
              <h3 className="detail-item-title" style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }}>
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
                <span>장비 강화 (🪙 {getUpgradeCost(selectedItem).toLocaleString()})</span>
              </button>

              {equipped[selectedItem.slot]?.id === selectedItem.id ? (
                <button
                  className="btn-game btn-game-wood detail-modal-btn"
                  onClick={() => handleUnequipAction(selectedItem.slot)}
                >
                  <span>장비 해제</span>
                </button>
              ) : (
                <button
                  className="btn-game btn-game-green detail-modal-btn"
                  onClick={() => handleEquipAction(selectedItem)}
                >
                  <Check size={16} />
                  <span>장비 장착</span>
                </button>
              )}

              <button className="detail-cancel-btn" onClick={() => setSelectedItem(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .drawer-title-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .paperdoll-container {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 10px;
        }

        .paperdoll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .paperdoll-slot {
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          transition: transform 0.1s ease, border-color 0.15s ease;
        }

        .paperdoll-slot:active {
          transform: scale(0.95);
        }

        .paperdoll-slot-label {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
        }

        .paperdoll-slot-icon {
          font-size: 1.5rem;
          margin: 2px 0;
        }

        .paperdoll-slot-lvl {
          font-size: 10px;
          font-weight: 800;
        }

        .paperdoll-empty-tag {
          font-size: 9px;
          color: #64748b;
        }

        .auto-equip-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 2px 4px;
        }

        .power-stat-box {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .power-stat-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }

        .power-stat-val {
          font-size: 13px;
          font-weight: 800;
          color: #fef08a;
        }

        .auto-equip-press-btn {
          min-height: 36px;
          padding: 6px 14px;
          font-size: 11px;
          border-radius: 10px;
        }

        .inventory-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 4px 0;
        }

        .inventory-count-text {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .inventory-guide-tip {
          font-size: 10px;
          color: #64748b;
        }

        .inventory-tiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .empty-backpack-box {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .inv-tile-card {
          position: relative;
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .inv-tile-card:active {
          transform: scale(0.95);
        }

        .equipped-ribbon-tag {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10b981;
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }

        .inv-tile-icon {
          font-size: 1.5rem;
          margin: 2px 0;
        }

        .inv-tile-name {
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        .inv-tile-level {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 700;
        }

        /* Detail Modal */
        .item-detail-modal-beveled {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .detail-header-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .detail-rarity-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid;
        }

        .detail-item-title {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .detail-slot-badge {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
        }

        .detail-icon-stage {
          font-size: 2.8rem;
          padding: 8px;
        }

        .detail-stats-box {
          width: 100%;
          background: rgba(10, 15, 28, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-comparison-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #94a3b8;
        }

        .stat-highlight {
          color: #38bdf8;
          font-weight: 800;
        }

        .detail-action-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-modal-btn {
          width: 100%;
        }

        .detail-cancel-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          padding: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
