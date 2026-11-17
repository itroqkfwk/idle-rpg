import React, { useMemo, useState } from 'react';
import { BookOpen, X, Crown, CheckCircle2, Lock, Swords, Coins, Sparkles } from 'lucide-react';
import { MonsterCodexSaveState } from '../types/game';
import {
  MONSTER_CODEX_CATALOG,
  MonsterCodexCatalogItem,
  calculateMonsterCodexBonuses,
} from '../data/monsterCodex';
import { sound } from '../utils/audio';
import { GameModalPortal } from './GameModalPortal';

interface MonsterCodexModalProps {
  codex: MonsterCodexSaveState;
  onClose: () => void;
}

export const MonsterCodexModal: React.FC<MonsterCodexModalProps> = ({ codex, onClose }) => {
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(MONSTER_CODEX_CATALOG[0]?.id || 'c1_m1');

  const summary = useMemo(() => calculateMonsterCodexBonuses(codex), [codex]);
  const discoveryPct =
    summary.totalCount > 0 ? Math.round((summary.discoveredCount / summary.totalCount) * 100) : 0;

  const filteredEntries = useMemo(() => {
    if (selectedChapter === 'all') return MONSTER_CODEX_CATALOG;
    return MONSTER_CODEX_CATALOG.filter((item) => item.chapter === selectedChapter);
  }, [selectedChapter]);

  const activeItem: MonsterCodexCatalogItem =
    MONSTER_CODEX_CATALOG.find((e) => e.id === selectedId) || filteredEntries[0] || MONSTER_CODEX_CATALOG[0];
  const activeRec = codex[activeItem.id];
  const isActiveDiscovered = Boolean(activeRec?.discovered);
  const activeKills = activeRec?.killCount ?? 0;

  const formatBonusTag = (item: MonsterCodexCatalogItem, val: number) => {
    if (item.bonusType === 'atk') return `공격력 +${val}`;
    if (item.bonusType === 'gold') return `골드 +${Math.round(val * 100)}%`;
    return `경험치 +${Math.round(val * 100)}%`;
  };

  return (
    <GameModalPortal
      isOpen={true}
      onClose={() => {
        sound.playTap();
        onClose();
      }}
      overlayClassName="codex-modal-overlay"
      dataTestId="monster-codex-modal"
      ariaLabel="몬스터 도감"
    >
      <div className="codex-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="codex-modal-header">
          <div className="codex-title-group">
            <div className="codex-icon-badge">
              <BookOpen size={18} color="#38bdf8" />
            </div>
            <div>
              <h2 className="codex-title">몬스터 도감</h2>
              <p className="codex-subtitle">
                발견 {summary.discoveredCount}/{summary.totalCount} ({discoveryPct}%) · 첫 처치{' '}
                {summary.defeatedCount}/{summary.totalCount}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="codex-close-btn"
            aria-label="도감 닫기"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cumulative Codex Bonuses Banner */}
        <div className="codex-bonus-summary-bar" data-testid="codex-bonus-summary">
          <span className="codex-bonus-chip atk">
            <Swords size={13} />
            <span>공격력 +{summary.flatAtk.toLocaleString()}</span>
          </span>
          <span className="codex-bonus-chip gold">
            <Coins size={13} />
            <span>골드 +{Math.round(summary.goldBonusRate * 100)}%</span>
          </span>
          <span className="codex-bonus-chip exp">
            <Sparkles size={13} />
            <span>경험치 +{Math.round(summary.expBonusRate * 100)}%</span>
          </span>
          <span className="codex-tier-total">
            보너스 단계 {summary.unlockedTierCount}/{summary.totalTierCount}
          </span>
        </div>

        {/* Chapter Filter Pills */}
        <div className="codex-chapter-tabs" role="tablist">
          <button
            type="button"
            className={`codex-ch-btn ${selectedChapter === 'all' ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              setSelectedChapter('all');
            }}
          >
            전체 ({MONSTER_CODEX_CATALOG.length})
          </button>
          {[1, 2, 3, 4, 5].map((ch) => (
            <button
              key={ch}
              type="button"
              className={`codex-ch-btn ${selectedChapter === ch ? 'active' : ''}`}
              onClick={() => {
                sound.playTap();
                setSelectedChapter(ch);
              }}
            >
              Ch.{ch}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="codex-scroll-body">
          {/* Selected Monster Detail Inspector */}
          <div className="codex-detail-card" data-testid="codex-detail-card">
            <div className="codex-detail-avatar">
              <img
                src={activeItem.sprite}
                alt={isActiveDiscovered ? activeItem.name : '미발견 몬스터'}
                className={!isActiveDiscovered ? 'codex-silhouette' : ''}
                draggable={false}
              />
              {activeItem.isBoss && (
                <span className="codex-detail-boss-tag">
                  <Crown size={11} /> BOSS
                </span>
              )}
            </div>

            <div className="codex-detail-info">
              <div className="codex-detail-top">
                <h3>{isActiveDiscovered ? activeItem.name : '??? (미발견)'}</h3>
                <span className="codex-stage-pill">{activeItem.stageLabel}</span>
              </div>
              <p className="codex-detail-lore">
                {isActiveDiscovered
                  ? activeItem.description
                  : `${activeItem.stageLabel} 지역에서 조우하면 정보가 해금됩니다.`}
              </p>
              <div className="codex-kill-count-row">
                <span>누적 처치</span>
                <strong data-testid="codex-detail-kills">{activeKills.toLocaleString()}회</strong>
              </div>

              <div className="codex-milestones-list">
                {activeItem.tiers.map((tier) => {
                  const unlocked = activeKills >= tier.requiredKills;
                  const pct = Math.min(100, Math.round((activeKills / tier.requiredKills) * 100));
                  return (
                    <div key={tier.tier} className={`codex-tier-row ${unlocked ? 'unlocked' : ''}`}>
                      <div className="tier-left">
                        {unlocked ? (
                          <CheckCircle2 size={13} color="#4ade80" />
                        ) : (
                          <Lock size={12} color="#64748b" />
                        )}
                        <span>{tier.requiredKills}마리 처치</span>
                      </div>
                      <div className="tier-bar-wrap">
                        <div className="tier-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="tier-reward">{formatBonusTag(activeItem, tier.bonusValue)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monster Card Grid */}
          <div className="codex-grid" data-testid="codex-monster-grid">
            {filteredEntries.map((item) => {
              const rec = codex[item.id];
              const discovered = Boolean(rec?.discovered);
              const defeated = Boolean(rec?.firstDefeated || (rec?.killCount ?? 0) > 0);
              const kills = rec?.killCount ?? 0;
              const unlockedTiers = item.tiers.filter((t) => kills >= t.requiredKills).length;
              const isSelected = activeItem.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`codex-card-${item.id}`}
                  className={`codex-card ${isSelected ? 'selected' : ''} ${discovered ? 'discovered' : 'locked'}`}
                  onClick={() => {
                    sound.playTap();
                    setSelectedId(item.id);
                  }}
                >
                  <div className="codex-card-badges">
                    <span className="codex-card-ch">Ch.{item.chapter}</span>
                    {item.isBoss && (
                      <span className="codex-card-boss" title="보스 몬스터">
                        <Crown size={10} />
                      </span>
                    )}
                  </div>
                  <div className="codex-card-img-box">
                    <img
                      src={item.sprite}
                      alt={discovered ? item.name : '미발견'}
                      className={!discovered ? 'codex-silhouette' : ''}
                      draggable={false}
                    />
                  </div>
                  <div className="codex-card-name">{discovered ? item.name : '???'}</div>
                  <div className="codex-card-meta">
                    <span>{defeated ? `${kills.toLocaleString()} 처치` : discovered ? '조우함' : '미발견'}</span>
                    <span className="codex-pips">
                      {[1, 2, 3].map((p) => (
                        <i key={p} className={p <= unlockedTiers ? 'on' : ''} />
                      ))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .codex-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 125;
          background: rgba(2, 6, 23, 0.78);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          box-sizing: border-box;
        }
        .codex-modal-panel {
          width: 100%;
          max-width: 680px;
          max-height: 88vh;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.99) 100%);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #f8fafc;
        }
        .codex-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }
        .codex-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .codex-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.14);
          border: 1px solid rgba(56, 189, 248, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .codex-title {
          font-size: 16px;
          font-weight: 900;
          margin: 0;
          color: #f8fafc;
        }
        .codex-subtitle {
          font-size: 11px;
          color: #94a3b8;
          margin: 2px 0 0;
        }
        .codex-close-btn {
          min-width: 44px;
          min-height: 44px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .codex-bonus-summary-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }
        .codex-bonus-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .codex-bonus-chip.atk { color: #fca5a5; border-color: rgba(248, 113, 113, 0.3); }
        .codex-bonus-chip.gold { color: #fde047; border-color: rgba(250, 204, 21, 0.3); }
        .codex-bonus-chip.exp { color: #7dd3fc; border-color: rgba(56, 189, 248, 0.3); }
        .codex-tier-total {
          margin-left: auto;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
        }
        .codex-chapter-tabs {
          display: flex;
          gap: 6px;
          padding: 8px 16px;
          overflow-x: auto;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .codex-ch-btn {
          min-height: 44px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(30, 41, 59, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
        }
        .codex-ch-btn.active {
          background: rgba(56, 189, 248, 0.2);
          border-color: rgba(56, 189, 248, 0.65);
          color: #e0f2fe;
        }
        .codex-scroll-body {
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .codex-detail-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(148, 163, 184, 0.22);
        }
        .codex-detail-avatar {
          position: relative;
          width: 82px;
          height: 82px;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }
        .codex-detail-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .codex-detail-boss-tag {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 1px 6px;
          border-radius: 999px;
          background: #7c3aed;
          color: #fef08a;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }
        .codex-detail-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .codex-detail-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }
        .codex-detail-top h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 900;
          color: #f8fafc;
        }
        .codex-stage-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(56, 189, 248, 0.16);
          color: #7dd3fc;
        }
        .codex-detail-lore {
          margin: 0;
          font-size: 11.5px;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .codex-kill-count-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #94a3b8;
        }
        .codex-kill-count-row strong {
          color: #fef08a;
        }
        .codex-milestones-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .codex-tier-row {
          display: grid;
          grid-template-columns: 92px 1fr 78px;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: #94a3b8;
        }
        .codex-tier-row.unlocked {
          color: #bbf7d0;
          font-weight: 700;
        }
        .tier-left {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .tier-bar-wrap {
          height: 5px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          overflow: hidden;
        }
        .tier-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #4ade80);
          border-radius: 999px;
        }
        .tier-reward {
          text-align: right;
          font-weight: 800;
          color: #fef08a;
          white-space: nowrap;
        }
        .codex-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(126px, 1fr));
          gap: 8px;
        }
        .codex-card {
          min-height: 44px;
          padding: 8px;
          border-radius: 12px;
          background: rgba(20, 29, 48, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          color: inherit;
          text-align: center;
        }
        .codex-card.selected {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.14);
          box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.35);
        }
        .codex-card.locked {
          opacity: 0.72;
        }
        .codex-card-badges {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .codex-card-ch {
          font-size: 9.5px;
          font-weight: 800;
          color: #94a3b8;
        }
        .codex-card-boss {
          color: #fbbf24;
          display: inline-flex;
        }
        .codex-card-img-box {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .codex-card-img-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .codex-silhouette {
          filter: brightness(0) opacity(0.38);
        }
        .codex-card-name {
          font-size: 11px;
          font-weight: 800;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .codex-card-meta {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9.5px;
          color: #94a3b8;
        }
        .codex-pips {
          display: inline-flex;
          gap: 2px;
        }
        .codex-pips i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.35);
        }
        .codex-pips i.on {
          background: #4ade80;
        }
        @media (max-width: 520px) {
          .codex-detail-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .codex-detail-info {
            width: 100%;
          }
          .codex-tier-row {
            grid-template-columns: 82px 1fr 70px;
          }
          .codex-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </GameModalPortal>
  );
};
