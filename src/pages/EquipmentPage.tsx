import React, { useState } from 'react';
import { Equipment, EquipmentSlot } from '../types/game';
import {
  RARITY_CONFIGS,
  getEquipmentPiecesRequired,
  getEquipmentUpgradeGoldCost,
  calculateEquipmentEquippedStats,
  calculateEquipmentOwnedStats,
  calculateTotalEquipmentOwnedBonus,
} from '../data/equipment';
import { Zap, Sparkles, Check, ArrowUpRight, X, Shield, Layers, ChevronsUp } from 'lucide-react';
import { sound } from '../utils/audio';

interface EquipmentPageProps {
  equipmentCatalog: Equipment[];
  equipped: Partial<Record<EquipmentSlot, Equipment>>;
  gold: number;
  combatPower: number;
  onEquip: (item: Equipment) => void;
  onUpgradeItem: (itemId: string) => void;
  onBatchUpgrade: () => void;
  onAutoEquip: () => void;
  onClose?: () => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({
  equipmentCatalog,
  equipped,
  gold,
  combatPower,
  onEquip,
  onUpgradeItem,
  onBatchUpgrade,
  onAutoEquip,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | 'all'>('all');

  const slots: { slot: EquipmentSlot; label: string; placeholderIcon: string }[] = [
    { slot: 'weapon', label: '무기', placeholderIcon: '⚔️' },
    { slot: 'helmet', label: '투구', placeholderIcon: '🪖' },
    { slot: 'armor', label: '갑옷', placeholderIcon: '🛡️' },
    { slot: 'accessory', label: '장신구', placeholderIcon: '💍' },
  ];

  const ownedItemsCount = equipmentCatalog.filter((item) => item.owned).length;
  const totalItemsCount = equipmentCatalog.length;
  const totalOwnedBonus = calculateTotalEquipmentOwnedBonus(equipmentCatalog);

  // Check how many items can be upgraded right now
  const upgradeableItems = equipmentCatalog.filter((item) => {
    if (!item.owned) return false;
    const req = getEquipmentPiecesRequired(item.level, item.rarity);
    const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
    return item.pieces >= req && gold >= cost;
  });

  const filteredCatalog = equipmentCatalog.filter((item) => {
    if (filterSlot === 'all') return true;
    return (item.slot || item.type) === filterSlot;
  });


  const handleItemClick = (item: Equipment) => {
    sound.playTap();
    setSelectedItem(item);
  };

  const handleEquipAction = (item: Equipment) => {
    if (!item.owned) return;
    sound.playFanfare();
    onEquip(item);
    setSelectedItem(null);
  };

  const handleUpgradeAction = (item: Equipment) => {
    const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
    const req = getEquipmentPiecesRequired(item.level, item.rarity);
    if (gold >= cost && item.pieces >= req) {
      sound.playUpgrade();
      onUpgradeItem(item.id);
      // Update selected item preview
      const nextLevel = item.level + 1;
      setSelectedItem({
        ...item,
        level: nextLevel,
        pieces: item.pieces - req,
        piecesRequired: getEquipmentPiecesRequired(nextLevel, item.rarity),
      });
    }
  };

  const handleBatchUpgradeAction = () => {
    if (upgradeableItems.length === 0) return;
    sound.playUpgrade();
    onBatchUpgrade();
  };

  return (
    <div className="half-sheet-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title">
          <div className="drawer-title-icon">
            <Shield size={18} color="#38bdf8" />
          </div>
          <span>장비 도감 & 무기고</span>
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
                    <span className="paperdoll-empty-tag">미장착</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Power Summary Card */}
        <div className="collection-summary-card">
          <div className="collection-card-header">
            <div className="collection-title-row">
              <Layers size={16} color="#fbbf24" />
              <strong className="collection-card-title">장비 수집 & 보유 효과 (계정 상시 적용)</strong>
            </div>
            <div className="collection-badge">
              수집 {ownedItemsCount} / {totalItemsCount}
            </div>
          </div>
          <div className="collection-stats-grid">
            <div className="collection-stat-chip">
              <span className="stat-name">보유 ATK</span>
              <strong className="stat-val text-red">+{totalOwnedBonus.ownedAtk.toLocaleString()}</strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">보유 HP</span>
              <strong className="stat-val text-green">+{totalOwnedBonus.ownedHp.toLocaleString()}</strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">보유 DEF</span>
              <strong className="stat-val text-blue">+{totalOwnedBonus.ownedDef.toLocaleString()}</strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">치명타 확률</span>
              <strong className="stat-val text-yellow">+{totalOwnedBonus.ownedCritRate}%</strong>
            </div>
          </div>
        </div>

        {/* Action Controls: Combat Power, Auto-Equip, Batch-Upgrade */}
        <div className="equip-control-action-bar">
          <div className="power-stat-box">
            <Sparkles size={15} color="#f59e0b" />
            <span className="power-stat-label">전투력:</span>
            <strong className="power-stat-val">{combatPower.toLocaleString()}</strong>
          </div>
          <div className="equip-action-btns">
            <button
              className="btn-game btn-game-gold equip-batch-btn"
              disabled={upgradeableItems.length === 0}
              onClick={handleBatchUpgradeAction}
              title="강화 가능한 모든 장비 일괄 레벨업"
            >
              <ChevronsUp size={15} />
              <span>일괄 강화 ({upgradeableItems.length})</span>
            </button>
            <button className="btn-game btn-game-blue equip-auto-btn" onClick={onAutoEquip}>
              <Zap size={15} />
              <span>자동 장착</span>
            </button>
          </div>
        </div>

        {/* Slot Filter Tabs */}
        <div className="equip-filter-tabs">
          {(
            [
              ['all', '전체'],
              ['weapon', '무기'],
              ['helmet', '투구'],
              ['armor', '갑옷'],
              ['accessory', '장신구'],
            ] as const
          ).map(([slotKey, label]) => (
            <button
              key={slotKey}
              className={`filter-tab-pill ${filterSlot === slotKey ? 'active' : ''}`}
              onClick={() => setFilterSlot(slotKey)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Equipment Catalog Grid */}
        <div className="inventory-tiles-grid">
          {filteredCatalog.map((item) => {
            const rarity = RARITY_CONFIGS[item.rarity];
            const isEquipped = item.equipped;
            const reqPieces = getEquipmentPiecesRequired(item.level, item.rarity);
            const canUpgrade = item.owned && item.pieces >= reqPieces && gold >= getEquipmentUpgradeGoldCost(item.level, item.rarity);
            const equippedStats = calculateEquipmentEquippedStats(item);
            const ownedStats = calculateEquipmentOwnedStats(item);

            return (
              <div
                key={item.id}
                className={`inv-tile-card ${isEquipped ? 'inv-tile-equipped' : ''} ${!item.owned ? 'inv-tile-locked' : ''}`}
                style={{
                  borderColor: item.owned ? rarity.borderColor : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: item.owned ? `0 2px 10px ${rarity.glowColor}` : 'none',
                }}
                onClick={() => handleItemClick(item)}
              >
                {/* Badges */}
                {isEquipped ? (
                  <div className="equipped-ribbon-tag">
                    <Check size={10} color="#fff" />
                    <span>장착</span>
                  </div>
                ) : canUpgrade ? (
                  <div className="can-upgrade-badge">
                    <ArrowUpRight size={10} color="#fff" />
                    <span>UP</span>
                  </div>
                ) : null}

                <div className="inv-tile-icon-wrap">
                  <span className="inv-tile-icon">{item.icon}</span>
                  {!item.owned && <div className="lock-overlay-icon">🔒</div>}
                </div>

                <div className="inv-tile-info">
                  <span className="inv-tile-name" style={{ color: item.owned ? rarity.color : '#64748b' }}>
                    {item.name}
                  </span>
                  <div className="inv-tile-meta-row">
                    <span className="inv-tile-level" style={{ color: item.owned ? '#f8fafc' : '#475569' }}>
                      {item.owned ? `Lv.${item.level}` : '미보유'}
                    </span>
                    <span className="inv-tile-rarity-tag" style={{ color: rarity.color }}>
                      {rarity.label}
                    </span>
                  </div>

                  {/* Piece progress bar */}
                  {item.owned && (
                    <div className="piece-progress-bar-wrap">
                      <div
                        className="piece-progress-bar-fill"
                        style={{
                          width: `${Math.min(100, (item.pieces / reqPieces) * 100)}%`,
                          backgroundColor: item.pieces >= reqPieces ? '#22c55e' : '#38bdf8',
                        }}
                      />
                      <span className="piece-progress-text">
                        {item.pieces} / {reqPieces}
                      </span>
                    </div>
                  )}

                  {/* Mini stats preview */}
                  {item.owned && (
                    <div className="inv-tile-mini-stat">
                      <span>보유 +{ownedStats.ownedAtk || ownedStats.ownedDef || ownedStats.ownedHp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail / Upgrade Modal */}
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
              <span className="detail-slot-badge">
                {(selectedItem.slot || selectedItem.type || '').toUpperCase()} {selectedItem.owned ? `Lv.${selectedItem.level}` : '미보유'}
              </span>

            </div>

            <div className="detail-icon-stage">{selectedItem.icon}</div>

            {/* Pieces status */}
            {selectedItem.owned && (
              <div className="detail-piece-meter">
                <div className="meter-label-row">
                  <span>조각 누적 진행도</span>
                  <strong>
                    {selectedItem.pieces} / {getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)}
                  </strong>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedItem.pieces / getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Split Stats: Equipped Effect vs Owned Effect */}
            <div className="detail-stats-dual-box">
              {/* Equipped Effect */}
              <div className="stats-box-section">
                <div className="section-label-header">
                  <span>🗡️ 장착 효과 (착용 시 적용)</span>
                </div>
                {(() => {
                  const eqStats = calculateEquipmentEquippedStats(selectedItem);
                  return (
                    <div className="stat-lines">
                      {eqStats.atk > 0 && <div>공격력 +{eqStats.atk}</div>}
                      {eqStats.hp > 0 && <div>최대 체력 +{eqStats.hp}</div>}
                      {eqStats.def > 0 && <div>방어력 +{eqStats.def}</div>}
                      {eqStats.critRate > 0 && <div>치명타율 +{Math.round(eqStats.critRate * 100)}%</div>}
                    </div>
                  );
                })()}
              </div>

              {/* Owned Effect */}
              <div className="stats-box-section">
                <div className="section-label-header">
                  <span>👑 보유 효과 (상시 누적)</span>
                </div>
                {(() => {
                  const owStats = calculateEquipmentOwnedStats(selectedItem);
                  return (
                    <div className="stat-lines">
                      {owStats.ownedAtk > 0 && <div className="text-red">보유 ATK +{owStats.ownedAtk}</div>}
                      {owStats.ownedHp > 0 && <div className="text-green">보유 HP +{owStats.ownedHp}</div>}
                      {owStats.ownedDef > 0 && <div className="text-blue">보유 DEF +{owStats.ownedDef}</div>}
                      {owStats.ownedCritRate > 0 && <div className="text-yellow">보유 치명타율 +{owStats.ownedCritRate}%</div>}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Actions */}
            {selectedItem.owned ? (
              <div className="detail-action-column">
                <button
                  className="btn-game btn-game-gold detail-modal-btn"
                  disabled={
                    selectedItem.pieces < getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity) ||
                    gold < getEquipmentUpgradeGoldCost(selectedItem.level, selectedItem.rarity)
                  }
                  onClick={() => handleUpgradeAction(selectedItem)}
                >
                  <ArrowUpRight size={16} />
                  <span>
                    장비 강화 (🪙 {getEquipmentUpgradeGoldCost(selectedItem.level, selectedItem.rarity).toLocaleString()} · 🧩 {getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)}개)
                  </span>
                </button>

                {selectedItem.equipped ? (
                  <div className="currently-equipped-banner">현재 장착 중인 장비입니다</div>
                ) : (
                  <button className="btn-game btn-game-blue detail-modal-btn" onClick={() => handleEquipAction(selectedItem)}>
                    <Check size={16} />
                    <span>장비 장착</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="detail-unacquired-notice">
                상점에서 장비 소환 시 획득하여 영구 보유 효과를 해금할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .paperdoll-container {
          margin-bottom: 8px;
        }

        .paperdoll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .paperdoll-slot {
          background: rgba(15, 23, 42, 0.75);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.2s ease;
        }

        .paperdoll-slot:hover {
          transform: translateY(-1px);
        }

        .paperdoll-slot-label {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
        }

        .paperdoll-slot-icon {
          font-size: 20px;
          line-height: 1.2;
        }

        .paperdoll-slot-lvl {
          font-size: 10px;
          font-weight: 800;
        }

        .paperdoll-empty-tag {
          font-size: 9px;
          color: #64748b;
          font-weight: 600;
        }

        .collection-summary-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          margin-bottom: 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .collection-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .collection-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .collection-card-title {
          font-size: 11px;
          color: #fde68a;
          font-weight: 800;
        }

        .collection-badge {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fde047;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .collection-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .collection-stat-chip {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .collection-stat-chip .stat-name {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 600;
        }

        .collection-stat-chip .stat-val {
          font-size: 11px;
          font-weight: 800;
        }

        .text-red { color: #f87171; }
        .text-green { color: #4ade80; }
        .text-blue { color: #60a5fa; }
        .text-yellow { color: #facc15; }

        .equip-control-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 12px;
          margin-bottom: 8px;
        }

        .equip-action-btns {
          display: flex;
          gap: 6px;
        }

        .equip-batch-btn {
          min-height: 32px;
          padding: 4px 10px;
          font-size: 11px;
        }

        .equip-auto-btn {
          min-height: 32px;
          padding: 4px 12px;
          font-size: 11px;
        }

        .equip-filter-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
          overflow-x: auto;
        }

        .filter-tab-pill {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .filter-tab-pill.active {
          background: #3b82f6;
          border-color: #60a5fa;
          color: #ffffff;
        }

        .inv-tile-card {
          position: relative;
          background: rgba(15, 23, 42, 0.7);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .inv-tile-card:hover {
          transform: translateY(-2px);
        }

        .inv-tile-locked {
          opacity: 0.55;
          filter: grayscale(0.5);
        }

        .inv-tile-icon-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 4px;
        }

        .inv-tile-icon {
          font-size: 1.8rem;
        }

        .lock-overlay-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          font-size: 1.1rem;
          border-radius: 8px;
        }

        .can-upgrade-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #10b981;
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 1px;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
          z-index: 2;
        }

        .inv-tile-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .inv-tile-name {
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .inv-tile-meta-row {
          display: flex;
          gap: 4px;
          font-size: 10px;
        }

        .inv-tile-level {
          font-weight: 800;
        }

        .inv-tile-rarity-tag {
          font-weight: 700;
          font-size: 9px;
        }

        .piece-progress-bar-wrap {
          width: 100%;
          height: 12px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          margin-top: 3px;
        }

        .piece-progress-bar-fill {
          height: 100%;
          transition: width 0.2s ease;
        }

        .piece-progress-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .inv-tile-mini-stat {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 2px;
        }

        .detail-piece-meter {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 8px;
        }

        .meter-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }

        .meter-track {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 4px;
        }

        .detail-stats-dual-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stats-box-section {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-label-header {
          font-size: 10px;
          font-weight: 800;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 4px;
        }

        .stat-lines {
          font-size: 11px;
          font-weight: 700;
          line-height: 1.4;
        }

        .currently-equipped-banner {
          text-align: center;
          padding: 8px;
          font-size: 11px;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
        }

        .detail-unacquired-notice {
          text-align: center;
          padding: 12px;
          font-size: 11px;
          color: #94a3b8;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
