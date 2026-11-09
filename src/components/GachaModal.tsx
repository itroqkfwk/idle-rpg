import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Equipment, EquipmentRarity, SummonResultItem } from '../types/game';
import {
  RARITY_CONFIGS,
  EQUIPMENT_SUMMON_COST_1,
  EQUIPMENT_SUMMON_COST_10,
  EQUIPMENT_PITY_LIMIT,
  getHighestEquipmentRarity,
  calculateEquipmentEquippedStats,
  calculateEquipmentOwnedStats,
} from '../data/equipment';
import { drawEquipmentSummonRitual } from './BattleFxCanvas';
import confetti from 'canvas-confetti';
import { Sparkles, Check, FastForward, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface GachaModalProps {
  item?: Equipment | null;
  results?: SummonResultItem[] | null;
  sessionId?: string;
  gems?: number;
  pityCount?: number;
  onSummonAgain?: (count: 1 | 10) => void;
  onRitualComplete?: () => void;
  onEquip: (item: Equipment) => void;
  onClose: () => void;
}

const RARITY_RITUAL_NAMES: Record<EquipmentRarity, string> = {
  common: '은은한 별빛의 공명...',
  rare: '푸른 마법진이 깨어납니다!',
  epic: '영웅의 보랏빛 마력이 확산됩니다!',
  legendary: '황금빛 태양 기둥이 강림합니다!!',
  mythic: '신화의 다층 마법진과 태초의 빛기둥이 폭발합니다!!!',
};

export const GachaModal: React.FC<GachaModalProps> = ({
  item,
  results,
  sessionId = 'default_session',
  gems = 0,
  pityCount = 0,
  onSummonAgain,
  onRitualComplete,
  onEquip,
  onClose,
}) => {
  const effectiveResults: SummonResultItem[] = useMemo(() => {
    if (results && results.length > 0) return results;
    if (item) {
      return [
        {
          id: `single_${item.id}`,
          item,
          isNew: (item.ownedCount || 1) <= 1 && (item.pieces || 0) === 0,
          piecesGained: 0,
        },
      ];
    }
    return [];
  }, [results, item]);

  const highestRarity: EquipmentRarity = useMemo(() => {
    return getHighestEquipmentRarity(effectiveResults.map((r) => r.item.rarity));
  }, [effectiveResults]);

  const highestRarityConfig = RARITY_CONFIGS[highestRarity];
  const isMultiPull = effectiveResults.length > 1;

  const [phase, setPhase] = useState<'animating' | 'revealed'>('animating');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const ritualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  const ritualDurationMs = useMemo(() => {
    if (highestRarity === 'mythic') return 1100;
    if (highestRarity === 'legendary') return 920;
    if (highestRarity === 'epic') return 760;
    if (highestRarity === 'rare') return 640;
    return 520;
  }, [highestRarity]);

  // Reset animation phase when a new summon session starts
  useEffect(() => {
    setPhase('animating');
    setSelectedIdx(0);
    startTimeRef.current = performance.now();

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setPhase('revealed');
      onRitualComplete?.();
      if (highestRarity === 'epic' || highestRarity === 'legendary' || highestRarity === 'mythic') {
        confetti({
          particleCount: highestRarity === 'mythic' ? 85 : 50,
          spread: highestRarity === 'mythic' ? 80 : 60,
          origin: { y: 0.55 },
        });
      }
    }, ritualDurationMs);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionId, ritualDurationMs, highestRarity]);

  // Pure Canvas 2D Summon Ritual Loop (Zero Text Emojis, Cleaned up on unmount)
  useEffect(() => {
    const canvas = ritualCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (canvas.width !== rect.width || canvas.height !== rect.height)) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const w = canvas.width || 320;
      const h = canvas.height || 180;
      ctx.clearRect(0, 0, w, h);

      const elapsedMs = now - startTimeRef.current;
      const elapsedSec = elapsedMs / 1000;
      const prog = phase === 'animating' ? Math.min(1, elapsedMs / ritualDurationMs) : 0.5 + Math.sin(elapsedSec * 2) * 0.15;
      const scale = phase === 'animating' ? 1.1 : 0.72;

      drawEquipmentSummonRitual(ctx, w / 2, h / 2, highestRarity, prog, elapsedSec, scale);

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [highestRarity, phase, ritualDurationMs, sessionId]);

  const handleSkipAnimation = () => {
    if (phase !== 'animating') return;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    sound.playTap();
    setPhase('revealed');
    onRitualComplete?.();
  };

  const handleSummonMore = (count: 1 | 10) => {
    if (phase === 'animating' || !onSummonAgain) return;
    const cost = count === 1 ? EQUIPMENT_SUMMON_COST_1 : EQUIPMENT_SUMMON_COST_10;
    if (gems < cost) return;
    onSummonAgain(count);
  };

  if (effectiveResults.length === 0) return null;

  const activeResult = effectiveResults[selectedIdx] || effectiveResults[0];
  const activeItem = activeResult.item;
  const activeRarity = RARITY_CONFIGS[activeItem.rarity];
  const newUnlockCount = effectiveResults.filter((r) => r.isNew).length;
  const totalPiecesGained = effectiveResults.reduce((sum, r) => sum + (r.piecesGained || 0), 0);

  return (
    <div
      className="modal-backdrop gacha-modal-backdrop"
      onClick={() => {
        if (phase === 'revealed') onClose();
      }}
    >
      <div
        className={`modal-content gacha-modal-content ${isMultiPull ? 'gacha-modal-multi' : ''}`}
        style={{
          borderColor: highestRarityConfig.borderColor,
          boxShadow: `0 16px 48px rgba(0, 0, 0, 0.85), 0 0 28px ${highestRarityConfig.glowColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Rarity Header Badge */}
        <div className="gacha-top-bar">
          <div
            className="gacha-title-badge"
            style={{
              background: highestRarityConfig.bgColor,
              color: highestRarityConfig.color,
              borderColor: highestRarityConfig.borderColor,
            }}
          >
            <Sparkles size={14} />
            <span>
              {phase === 'animating'
                ? `${highestRarityConfig.label} 등급 소환 의식 진행 중`
                : isMultiPull
                ? `장비 10회 연속 소환 완료! (최고: ${highestRarityConfig.label})`
                : `${activeRarity.label} 장비 획득!`}
            </span>
          </div>

          <div className="gacha-pity-pill" data-testid="summon-modal-pity">
            <span>천장 마일리지:</span>
            <strong>
              {pityCount} / {EQUIPMENT_PITY_LIMIT}
            </strong>
          </div>
        </div>

        {/* Canvas 2D Summon Ritual Stage */}
        <div className={`gacha-canvas-stage ${phase === 'animating' ? 'stage-animating' : 'stage-revealed'}`}>
          <canvas
            ref={ritualCanvasRef}
            data-testid="summon-vfx-canvas"
            className="gacha-ritual-canvas"
          />
          {phase === 'animating' && (
            <div className="gacha-ritual-overlay">
              <div
                className="gacha-ritual-caption"
                style={{ color: highestRarityConfig.color }}
              >
                {RARITY_RITUAL_NAMES[highestRarity]}
              </div>
              <button
                type="button"
                data-testid="summon-skip-btn"
                className="btn-game btn-game-wood gacha-skip-btn"
                onClick={handleSkipAnimation}
              >
                <FastForward size={15} />
                <span>연출 건너뛰기 (Skip)</span>
              </button>
            </div>
          )}
        </div>

        {/* Revealed Content Area */}
        {phase === 'revealed' && (
          <>
            {!isMultiPull ? (
              /* Single Summon Result Card */
              <div
                className="gacha-card"
                data-testid="summon-single-card"
                style={{
                  borderColor: activeRarity.borderColor,
                  boxShadow: `0 6px 24px ${activeRarity.glowColor}`,
                  background: `radial-gradient(circle at 50% 25%, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.96) 100%)`,
                }}
              >
                <div className="gacha-card-badges-row">
                  {activeResult.isNew ? (
                    <span className="gacha-tag-pill tag-new">NEW 신규 해금!</span>
                  ) : (
                    <span className="gacha-tag-pill tag-dup">
                      중복 획득 · 조각 +{activeResult.piecesGained} (보유 {activeItem.ownedCount || 1}개)
                    </span>
                  )}
                  {activeResult.isPityTriggered && (
                    <span className="gacha-tag-pill tag-pity">🌟 30회 천장 확정!</span>
                  )}
                </div>

                <div className="gacha-item-icon">{activeItem.icon}</div>
                <div className="gacha-item-name" style={{ color: activeRarity.color }}>
                  {activeItem.name}
                </div>
                <div className="gacha-item-slot">
                  {(activeItem.slot || activeItem.type || 'weapon').toUpperCase()} · Lv.{activeItem.level} · 조각 {activeItem.pieces}/{activeItem.piecesRequired}
                </div>

                {/* Stats Preview */}
                {(() => {
                  const eqStats = calculateEquipmentEquippedStats(activeItem);
                  const owStats = calculateEquipmentOwnedStats(activeItem);
                  return (
                    <div className="gacha-stats-grid">
                      {eqStats.atk > 0 && <span className="stat-chip atk-chip">장착 ATK +{eqStats.atk}</span>}
                      {eqStats.hp > 0 && <span className="stat-chip hp-chip">장착 HP +{eqStats.hp}</span>}
                      {eqStats.def > 0 && <span className="stat-chip def-chip">장착 DEF +{eqStats.def}</span>}
                      {eqStats.critRate > 0 && (
                        <span className="stat-chip crit-chip">치명타 +{Math.round(eqStats.critRate * 100)}%</span>
                      )}
                      {owStats.ownedAtk > 0 && <span className="stat-chip owned-chip">보유 ATK +{owStats.ownedAtk}</span>}
                      {owStats.ownedHp > 0 && <span className="stat-chip owned-chip">보유 HP +{owStats.ownedHp}</span>}
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* 10x Multi Summon Individual Results Grid */
              <div className="gacha-multi-section">
                <div className="gacha-multi-summary-bar">
                  <span>총 {effectiveResults.length}회 개별 결과</span>
                  <span>
                    신규 해금: <strong className="text-green">{newUnlockCount}종</strong>
                  </span>
                  <span>
                    획득 조각: <strong className="text-blue">+{totalPiecesGained}개</strong>
                  </span>
                </div>

                <div className="gacha-multi-grid" data-testid="summon-results-grid">
                  {effectiveResults.map((res, idx) => {
                    const rConf = RARITY_CONFIGS[res.item.rarity];
                    const isSelected = idx === selectedIdx;
                    const isHighTier = res.item.rarity === 'legendary' || res.item.rarity === 'mythic';

                    return (
                      <div
                        key={res.id || `${res.item.id}_${idx}`}
                        data-testid={`summon-result-item-${idx}`}
                        className={`gacha-mini-card ${isSelected ? 'mini-selected' : ''} ${isHighTier ? 'mini-high-tier' : ''}`}
                        style={{
                          borderColor: rConf.borderColor,
                          boxShadow: isSelected
                            ? `0 0 12px ${rConf. borderColor}`
                            : isHighTier
                            ? `0 0 10px ${rConf.glowColor}`
                            : 'none',
                        }}
                        onClick={() => {
                          sound.playTap();
                          setSelectedIdx(idx);
                        }}
                      >
                        <div className="mini-card-top">
                          <span className="mini-idx">#{idx + 1}</span>
                          {res.isPityTriggered ? (
                            <span className="mini-badge badge-pity">천장</span>
                          ) : res.isGuaranteedRarePlus ? (
                            <span className="mini-badge badge-guar">보장</span>
                          ) : res.isNew ? (
                            <span className="mini-badge badge-new">NEW</span>
                          ) : (
                            <span className="mini-badge badge-dup">+{res.piecesGained}조각</span>
                          )}
                        </div>
                        <div className="mini-icon">{res.item.icon}</div>
                        <div className="mini-name" style={{ color: rConf.color }}>
                          {res.item.name}
                        </div>
                        <div className="mini-meta">
                          <span style={{ color: rConf.color }}>{rConf.label}</span>
                          <span>Lv.{res.item.level}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Item Quick Inspector Bar */}
                {activeItem && (
                  <div className="gacha-selected-inspector">
                    <div className="inspector-left">
                      <span className="inspector-icon">{activeItem.icon}</span>
                      <div className="inspector-text">
                        <strong style={{ color: activeRarity.color }}>
                          [{activeRarity.label}] {activeItem.name} (Lv.{activeItem.level})
                        </strong>
                        <span>
                          보유 {activeItem.ownedCount || 1}개 · 조각 {activeItem.pieces}/{activeItem.piecesRequired} · 보유효과 ATK+{calculateEquipmentOwnedStats(activeItem).ownedAtk} / HP+{calculateEquipmentOwnedStats(activeItem).ownedHp}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-game btn-game-gold inspector-equip-btn"
                      onClick={() => onEquip(activeItem)}
                    >
                      <Check size={13} />
                      <span>장착</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="gacha-actions">
              {!isMultiPull && (
                <button
                  type="button"
                  className="btn-game btn-game-gold gacha-equip-btn"
                  onClick={() => onEquip(activeItem)}
                >
                  <Check size={16} />
                  <span>즉시 장착하기</span>
                </button>
              )}

              {onSummonAgain && (
                <div className="gacha-resummon-row">
                  <button
                    type="button"
                    data-testid="summon-again-1-btn"
                    className="btn-game btn-game-wood gacha-resummon-btn"
                    disabled={gems < EQUIPMENT_SUMMON_COST_1}
                    onClick={() => handleSummonMore(1)}
                  >
                    <RotateCcw size={14} />
                    <span>1회 재소환 (💎 {EQUIPMENT_SUMMON_COST_1})</span>
                  </button>
                  <button
                    type="button"
                    data-testid="summon-again-10-btn"
                    className="btn-game btn-game-ruby gacha-resummon-btn"
                    disabled={gems < EQUIPMENT_SUMMON_COST_10}
                    onClick={() => handleSummonMore(10)}
                  >
                    <Sparkles size={14} />
                    <span>10회 재소환 (💎 {EQUIPMENT_SUMMON_COST_10})</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                data-testid="summon-confirm-btn"
                className="btn-game btn-game-wood gacha-close-btn"
                onClick={onClose}
              >
                <span>확인 (인벤토리 보관)</span>
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .gacha-modal-backdrop {
          z-index: 80;
          padding: 10px;
        }

        .gacha-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 14px;
          width: 100%;
          max-width: 370px;
          background: rgba(11, 18, 33, 0.96);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
        }

        .gacha-modal-multi {
          max-width: 480px;
        }

        @media (min-width: 768px) {
          .gacha-modal-multi {
            max-width: 580px;
          }
        }

        .gacha-top-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .gacha-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid;
        }

        .gacha-pity-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 800;
          color: #fde047;
          background: rgba(245, 158, 11, 0.16);
          border: 1px solid rgba(245, 158, 11, 0.4);
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .gacha-canvas-stage {
          position: relative;
          width: 100%;
          border-radius: 16px;
          background: radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.9), rgba(7, 11, 20, 0.98));
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          transition: height 0.2s ease;
        }

        .stage-animating {
          height: 220px;
        }

        .stage-revealed {
          height: 76px;
        }

        .gacha-ritual-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .gacha-ritual-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
        }

        .gacha-ritual-caption {
          font-size: 12px;
          font-weight: 900;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
          background: rgba(15, 23, 42, 0.72);
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .gacha-skip-btn {
          min-height: 34px;
          padding: 4px 14px;
          font-size: 11px;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .gacha-card {
          width: 100%;
          border: 1.5px solid;
          border-radius: 16px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .gacha-card-badges-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .gacha-tag-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .tag-new {
          background: rgba(16, 185, 129, 0.22);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.5);
        }

        .tag-dup {
          background: rgba(56, 189, 248, 0.2);
          color: #7dd3fc;
          border: 1px solid rgba(56, 189, 248, 0.45);
        }

        .tag-pity {
          background: rgba(245, 158, 11, 0.25);
          color: #fde047;
          border: 1px solid rgba(245, 158, 11, 0.55);
        }

        .gacha-item-icon {
          font-size: 2.8rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
          animation: itemBounce 1.5s ease-in-out infinite;
        }

        @keyframes itemBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .gacha-item-name {
          font-size: 1.1rem;
          font-weight: 900;
        }

        .gacha-item-slot {
          font-size: 10.5px;
          font-weight: 700;
          color: #94a3b8;
        }

        .gacha-stats-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 5px;
          margin-top: 4px;
        }

        .stat-chip {
          font-size: 10px;
          font-weight: 800;
          padding: 3px 7px;
          border-radius: 6px;
          background: rgba(10, 15, 28, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }

        .atk-chip { color: #f87171; }
        .hp-chip { color: #34d399; }
        .def-chip { color: #60a5fa; }
        .crit-chip { color: #fbbf24; }
        .owned-chip { color: #c084fc; }

        /* 10-Pull Grid Styles */
        .gacha-multi-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gacha-multi-summary-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 10.5px;
          color: #cbd5e1;
          font-weight: 700;
        }

        .gacha-multi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          max-height: 245px;
          overflow-y: auto;
          padding: 2px;
        }

        @media (min-width: 520px) {
          .gacha-multi-grid {
            grid-template-columns: repeat(5, 1fr);
            max-height: 270px;
          }
        }

        .gacha-mini-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 6px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.12s ease;
        }

        .gacha-mini-card:hover {
          transform: translateY(-1px);
        }

        .mini-selected {
          background: rgba(30, 41, 59, 0.95);
        }

        .mini-card-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8.5px;
          font-weight: 800;
        }

        .mini-idx {
          color: #64748b;
        }

        .mini-badge {
          padding: 1px 4px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 900;
        }

        .badge-new { background: #10b981; color: #fff; }
        .badge-dup { background: rgba(56, 189, 248, 0.25); color: #7dd3fc; }
        .badge-pity { background: #f59e0b; color: #fff; }
        .badge-guar { background: #8b5cf6; color: #fff; }

        .mini-icon {
          font-size: 1.55rem;
          line-height: 1.15;
        }

        .mini-name {
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .mini-meta {
          display: flex;
          gap: 4px;
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
        }

        .gacha-selected-inspector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 6px 10px;
          text-align: left;
        }

        .inspector-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .inspector-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
        }

        .inspector-text {
          display: flex;
          flex-direction: column;
          font-size: 10px;
          color: #94a3b8;
          min-width: 0;
        }

        .inspector-text strong {
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .inspector-equip-btn {
          min-height: 30px;
          padding: 4px 10px;
          font-size: 10.5px;
          flex-shrink: 0;
        }

        .gacha-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gacha-resummon-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          width: 100%;
        }

        .gacha-resummon-btn {
          min-height: 38px;
          font-size: 11px;
          padding: 4px 8px;
        }

        .gacha-equip-btn {
          width: 100%;
          min-height: 38px;
          font-size: 11.5px;
        }

        .gacha-close-btn {
          width: 100%;
          min-height: 36px;
          font-size: 11.5px;
        }
      `}</style>
    </div>
  );
};
