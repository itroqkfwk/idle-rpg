import React, { useState, useMemo } from 'react';
import { Equipment, EquipmentRarity, EquipmentSlot, ActiveTab } from '../types/game';
import {
  RARITY_CONFIGS,
  EQUIPMENT_RARITY_ORDER,
  EQUIPMENT_SUMMON_PROBABILITIES,
  EQUIPMENT_SUMMON_COST_1,
  EQUIPMENT_SUMMON_COST_10,
  EQUIPMENT_PITY_LIMIT,
  EQUIPMENT_MYTHIC_PITY_LIMIT,
  EQUIPMENT_SYNTHESIS_PIECES_REQUIRED,
  MASTER_EQUIPMENT_LIST,
  getEquipmentPiecesRequired,
  getEquipmentUpgradeGoldCost,
  getEquipmentUpgradeStoneCost,
  getNextEquipmentRarity,
  calculateEquipmentEquippedStats,
  calculateEquipmentOwnedStats,
  calculateTotalEquipmentOwnedBonus,
  validateEquipmentSummonProbabilities,
} from '../data/equipment';
import {
  Zap,
  Sparkles,
  Check,
  ArrowUpRight,
  X,
  Shield,
  Layers,
  ChevronsUp,
  Combine,
  Target,
  Info,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface EquipmentPageProps {
  equipmentCatalog: Equipment[];
  equipped: Partial<Record<EquipmentSlot, Equipment>>;
  gold: number;
  gems?: number;
  enhancementStones?: number;
  equipmentPityCount?: number;
  totalEquipmentSummons?: number;
  combatPower: number;
  onEquip: (item: Equipment) => void;
  onUpgradeItem: (itemId: string) => void;
  onUpgradeItemWithStones?: (itemId: string) => void;
  onSynthesizeItem?: (itemId: string) => void;
  onBatchSynthesize?: () => void;
  onBatchUpgrade: () => void;
  onAutoEquip: () => void;
  onSummonEquipment?: (count: 1 | 10) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onClose?: () => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({
  equipmentCatalog,
  equipped,
  gold,
  gems = 0,
  enhancementStones = 0,
  equipmentPityCount = 0,
  totalEquipmentSummons = 0,
  combatPower,
  onEquip,
  onUpgradeItem,
  onUpgradeItemWithStones,
  onSynthesizeItem,
  onBatchSynthesize,
  onBatchUpgrade,
  onAutoEquip,
  onSummonEquipment,
  onNavigateTab,
  onClose,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'codex' | 'inventory' | 'actionable'>('codex');
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<EquipmentRarity | 'all'>('all');
  const [showProbTable, setShowProbTable] = useState(false);
  const mythicPityProgress = totalEquipmentSummons % EQUIPMENT_MYTHIC_PITY_LIMIT;

  const slots: { slot: EquipmentSlot; label: string; placeholderIcon: string }[] = [
    { slot: 'weapon', label: '무기', placeholderIcon: '⚔️' },
    { slot: 'helmet', label: '투구', placeholderIcon: '🪖' },
    { slot: 'armor', label: '갑옷', placeholderIcon: '🛡️' },
    { slot: 'accessory', label: '장신구', placeholderIcon: '💍' },
  ];

  // Always derive selectedItem live from equipmentCatalog so level/pieces/equipped stay 100% reactive
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return equipmentCatalog.find((item) => item.id === selectedItemId) || null;
  }, [equipmentCatalog, selectedItemId]);

  const ownedItemsCount = equipmentCatalog.filter((item) => item.owned).length;
  const totalItemsCount = equipmentCatalog.length;
  const totalCollectionRate = totalItemsCount > 0 ? Math.round((ownedItemsCount / totalItemsCount) * 100) : 0;
  const totalOwnedBonus = calculateTotalEquipmentOwnedBonus(equipmentCatalog);
  const probValidation = validateEquipmentSummonProbabilities();

  // Rarity-specific collection progress
  const rarityCollectionStats = useMemo(() => {
    return EQUIPMENT_RARITY_ORDER.map((rarity) => {
      const itemsOfRarity = equipmentCatalog.filter((i) => i.rarity === rarity);
      const ownedOfRarity = itemsOfRarity.filter((i) => i.owned).length;
      const totalOfRarity = itemsOfRarity.length;
      const rate = totalOfRarity > 0 ? Math.round((ownedOfRarity / totalOfRarity) * 100) : 0;
      return {
        rarity,
        label: RARITY_CONFIGS[rarity].label,
        color: RARITY_CONFIGS[rarity].color,
        borderColor: RARITY_CONFIGS[rarity].borderColor,
        owned: ownedOfRarity,
        total: totalOfRarity,
        rate,
      };
    });
  }, [equipmentCatalog]);

  // Items eligible for Rarity Synthesis (duplicate pieces >= 5 & rarity < mythic)
  const synthesizableItems = useMemo(() => {
    return equipmentCatalog.filter((item) => {
      if (!item.owned || item.rarity === 'mythic') return false;
      return (item.pieces || 0) >= EQUIPMENT_SYNTHESIS_PIECES_REQUIRED;
    });
  }, [equipmentCatalog]);

  // Items eligible for Gold+Piece Upgrade
  const upgradeableItems = useMemo(() => {
    return equipmentCatalog.filter((item) => {
      if (!item.owned) return false;
      const req = getEquipmentPiecesRequired(item.level, item.rarity);
      const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
      return item.pieces >= req && gold >= cost;
    });
  }, [equipmentCatalog, gold]);

  // Items eligible for Stone Upgrade
  const stoneUpgradeableItems = useMemo(() => {
    return equipmentCatalog.filter((item) => {
      if (!item.owned) return false;
      const stoneCost = getEquipmentUpgradeStoneCost(item.level, item.rarity);
      return enhancementStones >= stoneCost;
    });
  }, [equipmentCatalog, enhancementStones]);

  // Next Growth Goal Indicator
  const nextGrowthGoal = useMemo(() => {
    if (synthesizableItems.length > 0) {
      const first = synthesizableItems[0];
      const nextR = getNextEquipmentRarity(first.rarity);
      const nextName =
        MASTER_EQUIPMENT_LIST.find((e) => e.slot === (first.slot || first.type) && e.rarity === nextR)?.name ||
        '상위 장비';
      return `합성 가능: [${first.name}] 조각 ${EQUIPMENT_SYNTHESIS_PIECES_REQUIRED}개로 [${nextName}] 합성 가능!`;
    }
    if (stoneUpgradeableItems.length > 0) {
      const target = stoneUpgradeableItems.find((i) => i.equipped) || stoneUpgradeableItems[0];
      return `돌파 가능: 보유 강화석(${enhancementStones}개)으로 [${target.name}] Lv.${target.level + 1} 돌파 가능!`;
    }
    if (upgradeableItems.length > 0) {
      const first = upgradeableItems[0];
      return `강화 가능: [${first.name}] Lv.${first.level + 1} 조각 강화 가능!`;
    }
    const unowned = equipmentCatalog.find((i) => !i.owned);
    if (unowned) {
      return `수집 목표: [${RARITY_CONFIGS[unowned.rarity].label} · ${unowned.name}] 획득 시 보유 ATK +${unowned.ownedAtk} / HP +${unowned.ownedHp} 해금`;
    }
    return '전체 장비 도감 100% 달성! 장비 강화 및 돌파로 보유 효과를 극대화하세요.';
  }, [synthesizableItems, stoneUpgradeableItems, upgradeableItems, equipmentCatalog, enhancementStones]);

  const actionableItemsCount = useMemo(() => {
    return equipmentCatalog.filter((item) => {
      if (!item.owned) return false;
      const canSynth = item.rarity !== 'mythic' && (item.pieces || 0) >= EQUIPMENT_SYNTHESIS_PIECES_REQUIRED;
      const req = getEquipmentPiecesRequired(item.level, item.rarity);
      const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
      const canGoldUp = item.pieces >= req && gold >= cost;
      const canStoneUp = enhancementStones >= getEquipmentUpgradeStoneCost(item.level, item.rarity);
      return canSynth || canGoldUp || canStoneUp;
    }).length;
  }, [equipmentCatalog, gold, enhancementStones]);

  const filteredCatalog = useMemo(() => {
    return equipmentCatalog.filter((item) => {
      if (viewMode === 'inventory' && !item.owned) return false;
      if (viewMode === 'actionable') {
        if (!item.owned) return false;
        const canSynth = item.rarity !== 'mythic' && (item.pieces || 0) >= EQUIPMENT_SYNTHESIS_PIECES_REQUIRED;
        const req = getEquipmentPiecesRequired(item.level, item.rarity);
        const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
        const canGoldUp = item.pieces >= req && gold >= cost;
        const canStoneUp = enhancementStones >= getEquipmentUpgradeStoneCost(item.level, item.rarity);
        if (!canSynth && !canGoldUp && !canStoneUp) return false;
      }
      const slotMatch = filterSlot === 'all' || (item.slot || item.type) === filterSlot;
      const rarityMatch = filterRarity === 'all' || item.rarity === filterRarity;
      return slotMatch && rarityMatch;
    });
  }, [equipmentCatalog, viewMode, filterSlot, filterRarity, gold, enhancementStones]);

  const handleItemClick = (item: Equipment) => {
    sound.playTap();
    setSelectedItemId(item.id);
  };

  const handleEquipAction = (item: Equipment) => {
    if (!item.owned) return;
    sound.playFanfare();
    onEquip(item);
  };

  const handleUpgradeAction = (item: Equipment) => {
    const cost = getEquipmentUpgradeGoldCost(item.level, item.rarity);
    const req = getEquipmentPiecesRequired(item.level, item.rarity);
    if (gold >= cost && item.pieces >= req) {
      sound.playUpgrade();
      onUpgradeItem(item.id);
    }
  };

  const handleStoneUpgradeAction = (item: Equipment) => {
    if (!onUpgradeItemWithStones || !item.owned) return;
    const stoneCost = getEquipmentUpgradeStoneCost(item.level, item.rarity);
    if (enhancementStones >= stoneCost) {
      sound.playUpgrade();
      onUpgradeItemWithStones(item.id);
    }
  };

  const handleSingleSynthesizeAction = (item: Equipment) => {
    if (!onSynthesizeItem || !item.owned || item.rarity === 'mythic') return;
    if ((item.pieces || 0) < EQUIPMENT_SYNTHESIS_PIECES_REQUIRED) return;
    sound.playFanfare();
    onSynthesizeItem(item.id);
  };

  const handleBatchSynthesizeAction = () => {
    if (!onBatchSynthesize || synthesizableItems.length === 0) return;
    sound.playFanfare();
    onBatchSynthesize();
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
              const item =
                equipmentCatalog.find((e) => (e.slot || e.type) === slot && e.equipped && e.owned) ||
                equipped[slot];
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
                  <div className="paperdoll-slot-icon">{item ? item.icon : placeholderIcon}</div>
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

        {/* Quick Equipment Summon Bar */}
        {onSummonEquipment && (
          <div className="equip-quick-summon-card" data-testid="equip-quick-summon-card">
            <div className="quick-summon-top">
              <div className="quick-summon-info">
                <span className="quick-summon-title">
                  ✨ 장비 소환 제단 (💎 보유: <strong>{gems.toLocaleString()}</strong>)
                </span>
                <div className="quick-pity-dual-row" data-testid="equip-pity-indicator">
                  <div className="pity-mini-box">
                    <div className="pity-mini-label">
                      <span>전설~신화 천장 (30회)</span>
                      <strong>{equipmentPityCount} / {EQUIPMENT_PITY_LIMIT}</strong>
                    </div>
                    <div className="pity-mini-track">
                      <div
                        className="pity-mini-fill legendary-fill"
                        style={{ width: `${Math.min(100, (equipmentPityCount / EQUIPMENT_PITY_LIMIT) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="pity-mini-box">
                    <div className="pity-mini-label">
                      <span>신화 확정 천장 (60회)</span>
                      <strong>{mythicPityProgress} / {EQUIPMENT_MYTHIC_PITY_LIMIT}</strong>
                    </div>
                    <div className="pity-mini-track">
                      <div
                        className="pity-mini-fill mythic-fill"
                        style={{ width: `${Math.min(100, (mythicPityProgress / EQUIPMENT_MYTHIC_PITY_LIMIT) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="quick-summon-btns">
                <button
                  type="button"
                  data-testid="equip-summon-1"
                  className="btn-game btn-game-ruby quick-summon-btn"
                  disabled={gems < EQUIPMENT_SUMMON_COST_1}
                  onClick={() => {
                    sound.playFanfare();
                    onSummonEquipment(1);
                  }}
                >
                  <span>1회 소환</span>
                  <span className="quick-cost">💎 {EQUIPMENT_SUMMON_COST_1}</span>
                </button>
                <button
                  type="button"
                  data-testid="equip-summon-10"
                  className="btn-game btn-game-gold quick-summon-btn"
                  disabled={gems < EQUIPMENT_SUMMON_COST_10}
                  onClick={() => {
                    sound.playFanfare();
                    onSummonEquipment(10);
                  }}
                >
                  <span>10회 연속</span>
                  <span className="quick-cost">💎 {EQUIPMENT_SUMMON_COST_10}</span>
                </button>
              </div>
            </div>

            <div className="quick-summon-rates-row">
              <button
                type="button"
                className="rates-toggle-btn"
                onClick={() => setShowProbTable((prev) => !prev)}
              >
                <Info size={11} color="#93c5fd" />
                <span>
                  등급 확률: 일반 55% · 희귀 28% · 영웅 12% · 전설 4% · 신화 1% (합계 {probValidation.total}%)
                </span>
              </button>
            </div>
            {showProbTable && (
              <div className="quick-prob-grid" data-testid="equip-prob-grid">
                {EQUIPMENT_RARITY_ORDER.map((r) => (
                  <div key={r} className="quick-prob-chip" style={{ borderColor: RARITY_CONFIGS[r].borderColor }}>
                    <span style={{ color: RARITY_CONFIGS[r].color }}>{RARITY_CONFIGS[r].label}</span>
                    <strong>{EQUIPMENT_SUMMON_PROBABILITIES[r]}%</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collection Power & Codex Progress Summary Card */}
        <div className="collection-summary-card" data-testid="collection-summary-card">
          <div className="collection-card-header">
            <div className="collection-title-row">
              <Layers size={16} color="#fbbf24" />
              <strong className="collection-card-title">장비 도감 수집 현황 & 보유 효과 (계정 상시 적용)</strong>
            </div>
            <div className="collection-badge" data-testid="collection-total-badge">
              수집 {ownedItemsCount} / {totalItemsCount} ({totalCollectionRate}%)
            </div>
          </div>

          {/* Overall Collection Progress Bar */}
          <div className="collection-progress-bar-track">
            <div
              className="collection-progress-bar-fill"
              style={{ width: `${totalCollectionRate}%` }}
            />
          </div>

          {/* Rarity-by-Rarity Collection Rate Row */}
          <div className="rarity-collection-row" data-testid="rarity-collection-row">
            {rarityCollectionStats.map((rc) => (
              <div
                key={rc.rarity}
                className="rarity-collection-pill"
                style={{ borderColor: rc.borderColor }}
                data-testid={`rarity-col-${rc.rarity}`}
              >
                <span className="rc-label" style={{ color: rc.color }}>
                  {rc.label}
                </span>
                <strong className="rc-val">
                  {rc.owned}/{rc.total} ({rc.rate}%)
                </strong>
              </div>
            ))}
          </div>

          {/* Total Owned Bonus Stats */}
          <div className="collection-stats-grid">
            <div className="collection-stat-chip">
              <span className="stat-name">보유 ATK</span>
              <strong className="stat-val text-red" data-testid="total-owned-atk">
                +{totalOwnedBonus.ownedAtk.toLocaleString()}
              </strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">보유 HP</span>
              <strong className="stat-val text-green" data-testid="total-owned-hp">
                +{totalOwnedBonus.ownedHp.toLocaleString()}
              </strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">보유 DEF</span>
              <strong className="stat-val text-blue" data-testid="total-owned-def">
                +{totalOwnedBonus.ownedDef.toLocaleString()}
              </strong>
            </div>
            <div className="collection-stat-chip">
              <span className="stat-name">치명타 확률</span>
              <strong className="stat-val text-yellow" data-testid="total-owned-crit">
                +{totalOwnedBonus.ownedCritRate}%
              </strong>
            </div>
          </div>

          {/* Next Growth Goal Banner */}
          <div className="next-growth-goal-banner" data-testid="next-growth-goal">
            <Target size={13} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>{nextGrowthGoal}</span>
          </div>
        </div>

        {/* Action Controls: Combat Power, Enhancement Stones, Batch Synthesize, Batch Upgrade, Auto-Equip */}
        <div className="equip-control-action-bar">
          <div className="power-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span className="power-stat-label">전투력:</span>
              <strong className="power-stat-val" data-testid="equip-combat-power">
                {combatPower.toLocaleString()}
              </strong>
            </div>
            <div
              data-testid="equip-stone-count"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(30, 58, 138, 0.45)',
                border: '1px solid rgba(96, 165, 250, 0.45)',
                borderRadius: '9999px',
                padding: '2px 8px',
                fontSize: '11px',
                color: '#93c5fd',
                fontWeight: 800,
              }}
            >
              <span>🔷 강화석:</span>
              <strong style={{ color: '#ffffff' }}>{enhancementStones.toLocaleString()}개</strong>
            </div>
          </div>
          <div className="equip-action-btns">
            {onBatchSynthesize && (
              <button
                type="button"
                data-testid="equip-batch-synthesize-btn"
                className="btn-game btn-game-green equip-batch-btn"
                disabled={synthesizableItems.length === 0}
                onClick={handleBatchSynthesizeAction}
                title="중복 조각 5개 이상 보유 장비 상위 등급 일괄 합성"
              >
                <Combine size={14} />
                <span>일괄 합성 ({synthesizableItems.length})</span>
              </button>
            )}
            <button
              type="button"
              data-testid="equip-batch-upgrade-btn"
              className="btn-game btn-game-gold equip-batch-btn"
              disabled={upgradeableItems.length === 0}
              onClick={handleBatchUpgradeAction}
              title="강화 가능한 모든 장비 일괄 레벨업"
            >
              <ChevronsUp size={14} />
              <span>일괄 강화 ({upgradeableItems.length})</span>
            </button>
            <button
              type="button"
              data-testid="equip-auto-equip-btn"
              className="btn-game btn-game-blue equip-auto-btn"
              onClick={onAutoEquip}
            >
              <Zap size={14} />
              <span>자동 장착</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher (Codex vs Inventory vs Actionable) & Dual Filter Bar */}
        <div className="equip-filters-wrapper">
          <div className="equip-view-mode-tabs" data-testid="equip-view-mode-tabs">
            <button
              type="button"
              data-testid="view-mode-codex"
              className={`view-mode-pill ${viewMode === 'codex' ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setViewMode('codex');
              }}
            >
              📚 전체 도감 ({totalItemsCount})
            </button>
            <button
              type="button"
              data-testid="view-mode-inventory"
              className={`view-mode-pill ${viewMode === 'inventory' ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setViewMode('inventory');
              }}
            >
              🎒 보유 인벤토리 ({ownedItemsCount})
            </button>
            <button
              type="button"
              data-testid="view-mode-actionable"
              className={`view-mode-pill ${viewMode === 'actionable' ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setViewMode('actionable');
              }}
            >
              ⚡ 합성·강화 가능 ({actionableItemsCount})
            </button>
          </div>

          <div className="equip-filter-tabs">
            {(
              [
                ['all', '전체 부위'],
                ['weapon', '무기'],
                ['helmet', '투구'],
                ['armor', '갑옷'],
                ['accessory', '장신구'],
              ] as const
            ).map(([slotKey, label]) => (
              <button
                key={slotKey}
                type="button"
                data-testid={`filter-slot-${slotKey}`}
                className={`filter-tab-pill ${filterSlot === slotKey ? 'active' : ''}`}
                onClick={() => setFilterSlot(slotKey)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="equip-filter-tabs rarity-filter-tabs">
            <button
              type="button"
              data-testid="filter-rarity-all"
              className={`filter-tab-pill ${filterRarity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRarity('all')}
            >
              전체 등급
            </button>
            {EQUIPMENT_RARITY_ORDER.map((rKey) => {
              const rConf = RARITY_CONFIGS[rKey];
              const isActive = filterRarity === rKey;
              return (
                <button
                  key={rKey}
                  type="button"
                  data-testid={`filter-rarity-${rKey}`}
                  className={`filter-tab-pill ${isActive ? 'active' : ''}`}
                  style={
                    isActive
                      ? { background: rConf.color, borderColor: rConf.borderColor, color: '#fff' }
                      : { color: rConf.color, borderColor: 'rgba(255,255,255,0.12)' }
                  }
                  onClick={() => setFilterRarity(rKey)}
                >
                  {rConf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Catalog Grid */}
        <div className="inventory-tiles-grid" data-testid="equipment-catalog-grid">
          {filteredCatalog.map((item) => {
            const rarity = RARITY_CONFIGS[item.rarity];
            const isEquipped = item.equipped;
            const reqPieces = getEquipmentPiecesRequired(item.level, item.rarity);
            const canSynthesize =
              item.owned && item.rarity !== 'mythic' && (item.pieces || 0) >= EQUIPMENT_SYNTHESIS_PIECES_REQUIRED;
            const canUpgrade =
              item.owned && item.pieces >= reqPieces && gold >= getEquipmentUpgradeGoldCost(item.level, item.rarity);
            const canStoneUpgrade =
              item.owned && enhancementStones >= getEquipmentUpgradeStoneCost(item.level, item.rarity);
            const ownedStats = calculateEquipmentOwnedStats(item);
            const baseOwnedStats = {
              atk: item.ownedAtk,
              hp: item.ownedHp,
              def: item.ownedDef,
            };
            const isHighRarity = item.rarity === 'legendary' || item.rarity === 'mythic';

            return (
              <div
                key={item.id}
                data-testid={`equip-card-${item.id}`}
                className={`inv-tile-card ${isEquipped ? 'inv-tile-equipped' : ''} ${
                  !item.owned ? 'inv-tile-locked' : ''
                } ${isHighRarity && item.owned ? 'inv-tile-high-rarity' : ''} ${
                  canSynthesize ? 'inv-tile-synthesizable' : ''
                }`}
                style={{
                  borderColor: item.owned ? rarity.borderColor : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: item.owned ? `0 2px 12px ${rarity.glowColor}` : 'none',
                }}
                onClick={() => handleItemClick(item)}
              >
                {/* Status Badges */}
                {isEquipped ? (
                  <div className="equipped-ribbon-tag">
                    <Check size={10} color="#fff" />
                    <span>장착</span>
                  </div>
                ) : canSynthesize ? (
                  <div className="can-synthesize-badge" data-testid={`badge-synth-${item.id}`}>
                    <Combine size={10} color="#fff" />
                    <span>합성 가능</span>
                  </div>
                ) : canUpgrade || canStoneUpgrade ? (
                  <div className="can-upgrade-badge">
                    <ArrowUpRight size={10} color="#fff" />
                    <span>강화 가능</span>
                  </div>
                ) : null}

                {/* Level & Owned Count Header */}
                <div className="inv-tile-top-meta">
                  <span
                    className={`inv-tile-level-chip ${item.owned && item.level > 1 ? 'lvl-enhanced' : ''}`}
                    style={{ color: item.owned ? (item.level > 1 ? '#fde047' : '#f8fafc') : '#475569' }}
                  >
                    {item.owned ? `Lv.${item.level}${item.level > 1 ? ' ★' : ''}` : '미획득'}
                  </span>
                  <span className="inv-tile-owned-count">
                    {item.owned ? `보유 ${Math.max(1, item.ownedCount || 1)}개` : '0개'}
                  </span>
                </div>

                {/* Silhouette for unowned vs normal icon for owned */}
                <div className="inv-tile-icon-wrap">
                  <span className={`inv-tile-icon ${!item.owned ? 'icon-silhouette' : ''}`}>{item.icon}</span>
                  {!item.owned && <div className="lock-overlay-icon">미보유</div>}
                </div>

                <div className="inv-tile-info">
                  <span className="inv-tile-name" style={{ color: item.owned ? rarity.color : '#64748b' }}>
                    {item.name}
                  </span>
                  <div className="inv-tile-meta-row">
                    <span className="inv-tile-rarity-tag" style={{ color: rarity.color }}>
                      {rarity.label}
                    </span>
                    <span className="inv-tile-slot-tag">
                      {(item.slot || item.type) === 'weapon'
                        ? '무기'
                        : (item.slot || item.type) === 'helmet'
                        ? '투구'
                        : (item.slot || item.type) === 'armor'
                        ? '갑옷'
                        : '장신구'}
                    </span>
                  </div>

                  {/* Piece progress bar */}
                  {item.owned ? (
                    <div className="piece-progress-bar-wrap">
                      <div
                        className="piece-progress-bar-fill"
                        style={{
                          width: `${Math.min(100, (item.pieces / reqPieces) * 100)}%`,
                          backgroundColor: canSynthesize
                            ? '#10b981'
                            : item.pieces >= reqPieces
                            ? '#22c55e'
                            : '#38bdf8',
                        }}
                      />
                      <span className="piece-progress-text">
                        조각 {item.pieces} / {reqPieces}
                      </span>
                    </div>
                  ) : (
                    <div className="piece-progress-bar-wrap unowned-bar">
                      <span className="piece-progress-text">소환·합성으로 획득</span>
                    </div>
                  )}

                  {/* Owned Collection Effect Preview */}
                  <div className="inv-tile-mini-stat">
                    {item.owned ? (
                      <span>
                        보유효과: ATK+{ownedStats.ownedAtk} · HP+{ownedStats.ownedHp}
                      </span>
                    ) : (
                      <span className="unowned-stat-preview">
                        해금 시: ATK+{baseOwnedStats.atk} · HP+{baseOwnedStats.hp}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail / Upgrade / Synthesis Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItemId(null)}>
          <div
            className="modal-content item-detail-modal-beveled"
            data-testid="equipment-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
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
              <button
                type="button"
                className="detail-close-x-btn"
                onClick={() => setSelectedItemId(null)}
                title="닫기"
              >
                <X size={16} color="#94a3b8" />
              </button>
            </div>

            <div className="detail-sub-meta-row">
              <span className="detail-slot-badge">
                {(selectedItem.slot || selectedItem.type || '').toUpperCase()} ·{' '}
                {selectedItem.owned ? `현재 Lv.${selectedItem.level}` : '미획득'}
              </span>
              <span className="detail-owned-count-badge" data-testid="detail-owned-count">
                보유 수량: {selectedItem.owned ? Math.max(1, selectedItem.ownedCount || 1) : 0}개 · 보유 조각:{' '}
                {selectedItem.pieces || 0}개
              </span>
            </div>

            <div className="detail-icon-stage">
              <span className={!selectedItem.owned ? 'icon-silhouette' : ''}>{selectedItem.icon}</span>
            </div>

            {/* Pieces status */}
            {selectedItem.owned && (
              <div className="detail-piece-meter">
                <div className="meter-label-row">
                  <span>중복 조각 보유량 (강화 필요: {getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)}개 / 합성 필요: {EQUIPMENT_SYNTHESIS_PIECES_REQUIRED}개)</span>
                  <strong data-testid="detail-piece-count">
                    {selectedItem.pieces}개
                  </strong>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedItem.pieces /
                          getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Split Stats: Current vs Next Level (+1) Preview */}
            {(() => {
              const curEq = calculateEquipmentEquippedStats(selectedItem);
              const nextItemObj: Equipment = { ...selectedItem, owned: true, level: selectedItem.level + 1 };
              const nextEq = calculateEquipmentEquippedStats(nextItemObj);
              const curOw = calculateEquipmentOwnedStats({ ...selectedItem, owned: true });
              const nextOw = calculateEquipmentOwnedStats(nextItemObj);

              return (
                <div className="detail-stats-dual-box" data-testid="detail-stats-comparison">
                  {/* Equipped Effect (Current -> Next Level) */}
                  <div className="stats-box-section">
                    <div className="section-label-header">
                      <span>🗡️ 장착 효과 (Lv.{selectedItem.level} → Lv.{selectedItem.level + 1})</span>
                    </div>
                    <div className="stat-lines">
                      {curEq.atk > 0 && (
                        <div>
                          공격력 +{curEq.atk}{' '}
                          <span className="next-lvl-delta">
                            → +{nextEq.atk} (+{nextEq.atk - curEq.atk})
                          </span>
                        </div>
                      )}
                      {curEq.hp > 0 && (
                        <div>
                          최대 체력 +{curEq.hp}{' '}
                          <span className="next-lvl-delta">
                            → +{nextEq.hp} (+{nextEq.hp - curEq.hp})
                          </span>
                        </div>
                      )}
                      {curEq.def > 0 && (
                        <div>
                          방어력 +{curEq.def}{' '}
                          <span className="next-lvl-delta">
                            → +{nextEq.def} (+{nextEq.def - curEq.def})
                          </span>
                        </div>
                      )}
                      {curEq.critRate > 0 && <div>치명타율 +{Math.round(curEq.critRate * 100)}%</div>}
                    </div>
                  </div>

                  {/* Owned Effect (Current -> Next Level) */}
                  <div className="stats-box-section">
                    <div className="section-label-header">
                      <span>👑 보유 효과 (Lv.{selectedItem.level} → Lv.{selectedItem.level + 1})</span>
                    </div>
                    <div className="stat-lines">
                      {curOw.ownedAtk > 0 && (
                        <div className="text-red">
                          보유 ATK +{curOw.ownedAtk}{' '}
                          <span className="next-lvl-delta">→ +{nextOw.ownedAtk}</span>
                        </div>
                      )}
                      {curOw.ownedHp > 0 && (
                        <div className="text-green">
                          보유 HP +{curOw.ownedHp}{' '}
                          <span className="next-lvl-delta">→ +{nextOw.ownedHp}</span>
                        </div>
                      )}
                      {curOw.ownedDef > 0 && (
                        <div className="text-blue">
                          보유 DEF +{curOw.ownedDef}{' '}
                          <span className="next-lvl-delta">→ +{nextOw.ownedDef}</span>
                        </div>
                      )}
                      {curOw.ownedCritRate > 0 && (
                        <div className="text-yellow">보유 치명타율 +{curOw.ownedCritRate}%</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Enhancement Stone & Gold Status Info Panel */}
            {selectedItem.owned && (
              <div className="stone-upgrade-status-panel" data-testid="stone-upgrade-status-panel">
                {(() => {
                  const reqStones = getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity);
                  const canStone = enhancementStones >= reqStones;
                  const stoneShortage = Math.max(0, reqStones - enhancementStones);
                  const reqGold = getEquipmentUpgradeGoldCost(selectedItem.level, selectedItem.rarity);
                  const goldShortage = Math.max(0, reqGold - gold);
                  return (
                    <>
                      <div className="stone-status-item">
                        <span>필요 강화석</span>
                        <strong data-testid="detail-req-stones">🔷 {reqStones}개</strong>
                      </div>
                      <div className="stone-status-item">
                        <span>보유 강화석</span>
                        <strong data-testid="detail-cur-stones">🔷 {enhancementStones}개</strong>
                      </div>
                      <div className="stone-status-item">
                        <span>돌파 가능 여부</span>
                        <strong
                          data-testid="detail-stone-can-upgrade"
                          style={{ color: canStone ? '#34d399' : '#f87171' }}
                        >
                          {canStone ? '돌파 가능' : `🔷 ${stoneShortage}개 부족`}
                        </strong>
                      </div>
                      {(!canStone || goldShortage > 0) && (
                        <div className="detail-shortage-nav-row">
                          {!canStone && (
                            <button
                              type="button"
                              className="detail-shortage-go-btn stone-go"
                              onClick={() => {
                                sound.playTap();
                                setSelectedItemId(null);
                                if (onNavigateTab) onNavigateTab('dungeon');
                              }}
                            >
                              🏛️ 강화석 {stoneShortage}개 부족 → 고대 유적 던전 이동
                            </button>
                          )}
                          {goldShortage > 0 && (
                            <button
                              type="button"
                              className="detail-shortage-go-btn gold-go"
                              onClick={() => {
                                sound.playTap();
                                setSelectedItemId(null);
                                if (onNavigateTab) onNavigateTab('dungeon');
                              }}
                            >
                              ⛏️ 골드 {goldShortage.toLocaleString()} 부족 → 황금 광산 이동
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Actions */}
            {selectedItem.owned ? (
              <div className="detail-action-column">
                {/* 1. Rarity Synthesis Button (For Common ~ Legendary) */}
                {selectedItem.rarity !== 'mythic' && onSynthesizeItem && (
                  <button
                    type="button"
                    data-testid="single-synthesize-btn"
                    className="btn-game btn-game-green detail-modal-btn"
                    disabled={(selectedItem.pieces || 0) < EQUIPMENT_SYNTHESIS_PIECES_REQUIRED}
                    onClick={() => handleSingleSynthesizeAction(selectedItem)}
                  >
                    <Combine size={15} />
                    <span>
                      상위 등급 합성 (🧩 조각 {EQUIPMENT_SYNTHESIS_PIECES_REQUIRED}개 소모 →{' '}
                      {
                        MASTER_EQUIPMENT_LIST.find(
                          (e) =>
                            e.slot === (selectedItem.slot || selectedItem.type) &&
                            e.rarity === getNextEquipmentRarity(selectedItem.rarity)
                        )?.name
                      }{' '}
                      획득)
                    </span>
                  </button>
                )}

                {/* 2. Gold + Piece Upgrade Button */}
                <button
                  type="button"
                  data-testid="gold-upgrade-btn"
                  className="btn-game btn-game-gold detail-modal-btn"
                  disabled={
                    selectedItem.pieces < getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity) ||
                    gold < getEquipmentUpgradeGoldCost(selectedItem.level, selectedItem.rarity)
                  }
                  onClick={() => handleUpgradeAction(selectedItem)}
                >
                  <ArrowUpRight size={15} />
                  <span>
                    조각 장비 강화 (🪙 {getEquipmentUpgradeGoldCost(selectedItem.level, selectedItem.rarity).toLocaleString()} · 🧩{' '}
                    {getEquipmentPiecesRequired(selectedItem.level, selectedItem.rarity)}개)
                  </span>
                </button>

                {/* 3. Enhancement Stone Upgrade Button */}
                {onUpgradeItemWithStones && (
                  <button
                    type="button"
                    data-testid="stone-upgrade-btn"
                    className="btn-game detail-modal-btn"
                    style={{
                      background:
                        enhancementStones >= getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity)
                          ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                          : 'rgba(30, 41, 59, 0.6)',
                      borderColor:
                        enhancementStones >= getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity)
                          ? '#a78bfa'
                          : 'rgba(255, 255, 255, 0.1)',
                      color:
                        enhancementStones >= getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity)
                          ? '#ffffff'
                          : '#64748b',
                    }}
                    disabled={enhancementStones < getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity)}
                    onClick={() => handleStoneUpgradeAction(selectedItem)}
                  >
                    <Sparkles size={15} />
                    <span>
                      강화석 돌파 강화 (🔷 {getEquipmentUpgradeStoneCost(selectedItem.level, selectedItem.rarity)}개 소모 · 보유 {enhancementStones}개)
                    </span>
                  </button>
                )}

                {/* 4. Equip Button */}
                {selectedItem.equipped ? (
                  <div className="currently-equipped-banner">현재 장착 중인 장비입니다 (합성 시에도 장착 유지)</div>
                ) : (
                  <button
                    type="button"
                    data-testid="equip-item-btn"
                    className="btn-game btn-game-blue detail-modal-btn"
                    onClick={() => handleEquipAction(selectedItem)}
                  >
                    <Check size={15} />
                    <span>장비 장착</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="detail-unacquired-notice">
                장비 소환 또는 하위 등급 장비 5조각 합성으로 획득하여 영구 보유 효과를 해금할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .quick-pity-dual-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          margin-top: 2px;
        }

        .pity-mini-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 4px 7px;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pity-mini-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          font-size: 9.5px;
          color: #cbd5e1;
        }

        .pity-mini-label strong {
          font-size: 10px;
          font-weight: 800;
          color: #fef08a;
        }

        .pity-mini-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          overflow: hidden;
        }

        .pity-mini-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.25s ease;
        }

        .pity-mini-fill.legendary-fill {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .pity-mini-fill.mythic-fill {
          background: linear-gradient(90deg, #ef4444, #f97316);
        }

        .equip-view-mode-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          margin-bottom: 4px;
        }

        .view-mode-pill {
          padding: 6px 8px;
          border-radius: 9px;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          font-size: 10.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          text-align: center;
        }

        .view-mode-pill.active {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(37, 99, 235, 0.35));
          border-color: #38bdf8;
          color: #f8fafc;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
        }

        .inv-tile-synthesizable {
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.45), inset 0 0 8px rgba(16, 185, 129, 0.18) !important;
        }

        .detail-shortage-nav-row {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px dashed rgba(255, 255, 255, 0.12);
        }

        .detail-shortage-go-btn {
          flex: 1;
          min-width: 140px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 10.5px;
          font-weight: 800;
          cursor: pointer;
          text-align: center;
          transition: transform 0.1s ease;
        }

        .detail-shortage-go-btn:active {
          transform: scale(0.97);
        }

        .detail-shortage-go-btn.stone-go {
          background: rgba(30, 58, 138, 0.55);
          border: 1px solid rgba(96, 165, 250, 0.55);
          color: #bfdbfe;
        }

        .detail-shortage-go-btn.gold-go {
          background: rgba(120, 53, 15, 0.55);
          border: 1px solid rgba(251, 191, 36, 0.55);
          color: #fef08a;
        }

        .paperdoll-container {
          margin-bottom: 6px;
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

        /* Quick Summon Card */
        .equip-quick-summon-card {
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.92));
          border: 1px solid rgba(244, 63, 94, 0.4);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quick-summon-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-summon-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .quick-summon-title {
          font-size: 11.5px;
          font-weight: 800;
          color: #f8fafc;
        }

        .quick-summon-title strong {
          color: #38bdf8;
        }

        .quick-summon-pity {
          font-size: 10px;
          color: #fde68a;
        }

        .quick-summon-btns {
          display: flex;
          gap: 6px;
        }

        .quick-summon-btn {
          min-height: 34px;
          padding: 4px 10px;
          font-size: 10.5px;
          display: flex;
          flex-direction: column;
          gap: 0px;
        }

        .quick-cost {
          font-size: 9.5px;
          opacity: 0.95;
        }

        .quick-summon-rates-row {
          display: flex;
          align-items: center;
        }

        .rates-toggle-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 9.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 0;
        }

        .quick-prob-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }

        .quick-prob-chip {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid;
          border-radius: 6px;
          padding: 2px 4px;
          font-size: 9px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .collection-summary-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .collection-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
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
          white-space: nowrap;
        }

        .collection-progress-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 9999px;
          overflow: hidden;
        }

        .collection-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #10b981, #f59e0b);
          border-radius: 9999px;
          transition: width 0.25s ease;
        }

        .rarity-collection-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }

        .rarity-collection-pill {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid;
          border-radius: 6px;
          padding: 3px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .rc-label {
          font-size: 8.5px;
          font-weight: 800;
        }

        .rc-val {
          font-size: 9px;
          color: #e2e8f0;
          font-weight: 800;
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
          padding: 5px 4px;
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

        .next-growth-goal-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(14, 116, 144, 0.22);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 5px 8px;
          font-size: 10px;
          color: #e0f2fe;
          font-weight: 700;
        }

        .text-red { color: #f87171; }
        .text-green { color: #4ade80; }
        .text-blue { color: #60a5fa; }
        .text-yellow { color: #facc15; }

        .equip-control-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 10px;
        }

        .equip-action-btns {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .equip-batch-btn {
          min-height: 32px;
          padding: 4px 9px;
          font-size: 10.5px;
        }

        .equip-auto-btn {
          min-height: 32px;
          padding: 4px 10px;
          font-size: 10.5px;
        }

        .btn-game-blue {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          border-color: rgba(147, 197, 253, 0.4);
        }

        .equip-filters-wrapper {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .equip-filter-tabs {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .filter-tab-pill {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 10.5px;
          font-weight: 700;
          padding: 4px 10px;
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

        .inventory-tiles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        @media (min-width: 520px) {
          .inventory-tiles-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .inv-tile-card {
          position: relative;
          background: rgba(15, 23, 42, 0.78);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
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

        .inv-tile-high-rarity {
          border-width: 2px;
        }

        .inv-tile-locked {
          opacity: 0.68;
          background: rgba(9, 13, 24, 0.88);
        }

        .inv-tile-top-meta {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9.5px;
          margin-bottom: 3px;
        }

        .inv-tile-level-chip {
          font-weight: 900;
        }

        .lvl-enhanced {
          text-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
        }

        .inv-tile-owned-count {
          color: #94a3b8;
          font-weight: 700;
          font-size: 9px;
        }

        .inv-tile-icon-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 8px;
          margin-bottom: 4px;
        }

        .inv-tile-icon {
          font-size: 1.75rem;
          transition: filter 0.2s ease;
        }

        .icon-silhouette {
          filter: brightness(0.15) contrast(1.5) grayscale(1);
          opacity: 0.65;
        }

        .lock-overlay-icon {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(15, 23, 42, 0.9);
          color: #64748b;
          font-size: 8px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .equipped-ribbon-tag {
          position: absolute;
          top: -6px;
          left: 8px;
          background: #2563eb;
          color: #fff;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 2px;
          z-index: 2;
        }

        .can-synthesize-badge {
          position: absolute;
          top: -6px;
          right: 8px;
          background: #059669;
          color: #fff;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 2px;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          z-index: 2;
        }

        .can-upgrade-badge {
          position: absolute;
          top: -6px;
          right: 8px;
          background: #d97706;
          color: #fff;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 2px;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.8);
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
          gap: 6px;
          font-size: 9.5px;
          align-items: center;
        }

        .inv-tile-rarity-tag {
          font-weight: 800;
        }

        .inv-tile-slot-tag {
          color: #94a3b8;
          font-size: 9px;
        }

        .piece-progress-bar-wrap {
          width: 100%;
          height: 12px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          margin-top: 2px;
        }

        .unowned-bar {
          background: rgba(30, 41, 59, 0.5);
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
          font-size: 8.5px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
        }

        .inv-tile-mini-stat {
          font-size: 9px;
          color: #cbd5e1;
          font-weight: 700;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .unowned-stat-preview {
          color: #64748b;
        }

        /* Detail Modal */
        .item-detail-modal-beveled {
          max-height: 88vh;
          overflow-y: auto;
          padding: 16px;
        }

        .detail-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .detail-rarity-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid;
        }

        .detail-item-title {
          font-size: 1.05rem;
          font-weight: 900;
          flex: 1;
          text-align: center;
        }

        .detail-close-x-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .detail-sub-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #94a3b8;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 4px;
        }

        .detail-owned-count-badge {
          color: #fde68a;
          font-weight: 700;
        }

        .detail-icon-stage {
          font-size: 2.6rem;
          text-align: center;
          padding: 8px;
          background: rgba(15, 23, 42, 0.7);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .detail-piece-meter {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 7px 10px;
          margin-bottom: 8px;
        }

        .meter-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }

        .meter-track {
          width: 100%;
          height: 7px;
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
          gap: 6px;
          margin-bottom: 8px;
        }

        .stats-box-section {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 7px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-label-header {
          font-size: 9.5px;
          font-weight: 800;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 3px;
        }

        .stat-lines {
          font-size: 10.5px;
          font-weight: 700;
          line-height: 1.45;
        }

        .next-lvl-delta {
          color: #34d399;
          font-size: 9.5px;
          font-weight: 800;
        }

        .stone-upgrade-status-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          background: rgba(30, 58, 138, 0.25);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 8px;
          padding: 6px 8px;
          margin-bottom: 10px;
        }

        .stone-status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 9.5px;
          color: #94a3b8;
          gap: 1px;
        }

        .stone-status-item strong {
          font-size: 10.5px;
          color: #f8fafc;
        }

        .detail-action-column {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-modal-btn {
          width: 100%;
          min-height: 38px;
          font-size: 11px;
          padding: 6px 10px;
        }

        .currently-equipped-banner {
          text-align: center;
          padding: 8px;
          font-size: 10.5px;
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
