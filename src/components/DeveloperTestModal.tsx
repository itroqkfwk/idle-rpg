import React, { useState } from 'react';
import { GameSaveData, Skill, Equipment, PromotionId } from '../types/game';
import { getEquipmentPiecesRequired } from '../data/equipment';
import { getSkillPiecesRequired } from '../data/skills';
import { saveGameData } from '../utils/storage';


export const DEV_CHEAT_CODE = 'TEST-ALL-UNLOCK';

interface DeveloperTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: GameSaveData;
  onUpdateSaveData: (updater: (prev: GameSaveData) => GameSaveData) => void;
  onResetSave: () => void;
  onTriggerBoss: () => void;
}

export const DeveloperTestModal: React.FC<DeveloperTestModalProps> = ({
  isOpen,
  onClose,
  saveData,
  onUpdateSaveData,
  onResetSave,
  onTriggerBoss,
}) => {
  const [activeTab, setActiveTab] = useState<'currency' | 'character' | 'equipment' | 'skills' | 'stage' | 'pets'>('currency');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const applyCheat = (actionName: string, modifier: (prev: GameSaveData) => GameSaveData) => {
    onUpdateSaveData((prev) => {
      const updated = modifier(prev);
      const full: GameSaveData = {
        ...updated,
        cheatUsed: true,
        isTestAccount: true,
      };
      saveGameData(full);
      return full;
    });
    showToast(`적용 완료: ${actionName}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dev-modal-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(239, 68, 68, 0.3)',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#1e1b4b',
            borderBottom: '1px solid #3730a3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛠️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fca5a5' }}>
                DEVELOPER QA TEST SUITE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                치트 플래그 ON · TEST-ALL-UNLOCK
              </div>
            </div>
          </div>
          <button
            className="dev-modal-close-btn"
            onClick={onClose}
            style={{
              padding: '6px 12px',
              backgroundColor: '#334155',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div
            style={{
              backgroundColor: '#22c55e',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.85rem',
              padding: '6px 12px',
              textAlign: 'center',
            }}
          >
            {toastMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '8px 12px',
            backgroundColor: '#111827',
            borderBottom: '1px solid #1f2937',
            overflowX: 'auto',
          }}
        >
          {(
            [
              ['currency', '💰 재화'],
              ['character', '👤 캐릭터'],
              ['equipment', '⚔️ 장비'],
              ['skills', '✨ 스킬'],
              ['stage', '🗺️ 스테이지'],
              ['pets', '🐾 펫/퀘스트'],
            ] as const
          ).map(([tabKey, label]) => (
            <button
              key={tabKey}
              data-dev-tab={tabKey}
              onClick={() => setActiveTab(tabKey)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: activeTab === tabKey ? 800 : 500,
                backgroundColor: activeTab === tabKey ? '#ef4444' : '#1f2937',
                color: activeTab === tabKey ? '#fff' : '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div
          style={{
            padding: '16px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* TAB: CURRENCY */}
          {activeTab === 'currency' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="골드 +1,000,000"
                desc="100만 골드 획득"
                onClick={() =>
                  applyCheat('골드 +1,000,000', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, gold: prev.stats.gold + 1_000_000 },
                  }))
                }
              />
              <CheatButton
                label="골드 +10,000,000"
                desc="1,000만 골드 획득"
                onClick={() =>
                  applyCheat('골드 +10,000,000', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, gold: prev.stats.gold + 10_000_000 },
                  }))
                }
              />
              <CheatButton
                label="다이아 +10,000"
                desc="1만 다이아 획득"
                onClick={() =>
                  applyCheat('다이아 +10,000', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, gems: prev.stats.gems + 10_000 },
                  }))
                }
              />
              <CheatButton
                label="다이아 +100,000"
                desc="10만 다이아 획득"
                onClick={() =>
                  applyCheat('다이아 +100,000', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, gems: prev.stats.gems + 100_000 },
                  }))
                }
              />
              <CheatButton
                label="재화 99,999,999 풀충전"
                desc="골드 & 다이아 9999만"
                highlight
                onClick={() =>
                  applyCheat('재화 MAX 풀충전', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, gold: 99_999_999, gems: 99_999_999 },
                  }))
                }
              />
            </div>
          )}

          {/* TAB: CHARACTER */}
          {activeTab === 'character' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="Lv. 30 즉시 달성"
                desc="전직 조건 즉시 충족"
                onClick={() =>
                  applyCheat('Lv. 30 달성', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, level: 30, exp: 0, maxExp: 3000 },
                    promotionSeals: Math.max(prev.promotionSeals || 0, 1),
                  }))
                }
              />
              <CheatButton
                label="Lv. 100 달성"
                desc="만렙급 초고스펙"
                onClick={() =>
                  applyCheat('Lv. 100 달성', (prev) => ({
                    ...prev,
                    stats: { ...prev.stats, level: 100, exp: 0, maxExp: 10000 },
                  }))
                }
              />
              <CheatButton
                label="전직 즉시 완료"
                desc={saveData.classId === 'warrior' ? '글래디에이터 전직' : '아크메이지 전직'}
                onClick={() =>
                  applyCheat('전직 완료', (prev) => {
                    const promo: PromotionId = prev.classId === 'warrior' ? 'gladiator' : 'archmage';
                    return {
                      ...prev,
                      promotion: promo,
                      awakeningUnlocked: true,
                    };
                  })
                }
              />
              <CheatButton
                label="각성기 즉시 해금"
                desc="Mythic 각성 스킬 잠금 해제"
                onClick={() =>
                  applyCheat('각성기 해금', (prev) => {
                    const awkId = prev.classId === 'warrior' ? 'heavenly_blade' : 'astral_cataclysm';
                    return {
                      ...prev,
                      awakeningUnlocked: true,
                      skills: prev.skills.map((s) => (s.id === awkId ? { ...s, owned: true } : s)),
                    };
                  })
                }
              />
              <CheatButton
                label="각성 게이지 100%"
                desc="전투 중 즉시 각성 발동 가능"
                onClick={() =>
                  applyCheat('각성 게이지 100%', (prev) => ({
                    ...prev,
                    awakeningGauge: 100,
                  }))
                }
              />
              <CheatButton
                label="기본 스탯 레벨 100씩"
                desc="공격/체력/방어 레벨 +100"
                onClick={() =>
                  applyCheat('스탯 레벨 +100', (prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      atkLevel: prev.stats.atkLevel + 100,
                      hpLevel: prev.stats.hpLevel + 100,
                      defLevel: prev.stats.defLevel + 100,
                    },
                  }))
                }
              />
            </div>
          )}

          {/* TAB: EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="모든 장비 잠금 해제"
                desc="20종 전 장비 보유 (수집 100%)"
                highlight
                onClick={() =>
                  applyCheat('장비 20종 해금', (prev) => ({
                    ...prev,
                    equipmentCatalog: (prev.equipmentCatalog || []).map((eq: Equipment) => ({
                      ...eq,
                      owned: true,
                    })),
                  }))
                }
              />
              <CheatButton
                label="모든 장비 조각 +10"
                desc="강화 가능 조각 누적"
                onClick={() =>
                  applyCheat('장비 조각 +10', (prev) => ({
                    ...prev,
                    equipmentCatalog: (prev.equipmentCatalog || []).map((eq: Equipment) => ({
                      ...eq,
                      pieces: (eq.pieces || 0) + 10,
                    })),
                  }))
                }
              />
              <CheatButton
                label="모든 장비 Lv. 10 세팅"
                desc="전 장비 레벨 10으로 설정"
                onClick={() =>
                  applyCheat('장비 Lv. 10 세팅', (prev) => ({
                    ...prev,
                    equipmentCatalog: (prev.equipmentCatalog || []).map((eq: Equipment) => ({
                      ...eq,
                      owned: true,
                      level: 10,
                      piecesRequired: getEquipmentPiecesRequired(10, eq.rarity),
                    })),
                  }))
                }
              />
              <CheatButton
                label="모든 장비 Lv. 30 (MAX)"
                desc="전 장비 레벨 30 극대화"
                highlight
                onClick={() =>
                  applyCheat('장비 Lv. 30 세팅', (prev) => ({
                    ...prev,
                    equipmentCatalog: (prev.equipmentCatalog || []).map((eq: Equipment) => ({
                      ...eq,
                      owned: true,
                      level: 30,
                      piecesRequired: getEquipmentPiecesRequired(30, eq.rarity),
                    })),
                  }))
                }
              />
              <CheatButton
                label="신화(Mythic) 세트 자동 장착"
                desc="무기/투구/갑옷/반지 신화 장착"
                onClick={() =>
                  applyCheat('신화 풀세트 장착', (prev) => {
                    const mythics = (prev.equipmentCatalog || []).filter((e: Equipment) => e.rarity === 'mythic');
                    const updatedCatalog = (prev.equipmentCatalog || []).map((eq: Equipment) => {
                      if (eq.rarity === 'mythic') {
                        return { ...eq, owned: true, equipped: true };
                      }
                      return { ...eq, equipped: false };
                    });
                    const equippedMap = { ...prev.equipped };
                    mythics.forEach((m: Equipment) => {
                      equippedMap[m.slot] = { ...m, owned: true, equipped: true };
                    });
                    return {
                      ...prev,
                      equipmentCatalog: updatedCatalog,
                      equipped: equippedMap,
                    };
                  })
                }
              />
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && (

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="현재 직업 스킬 전체 해금"
                desc={`${saveData.classId === 'warrior' ? '전사' : '마법사'} 스킬 7종 해금`}
                onClick={() =>
                  applyCheat('현재 직업 스킬 해금', (prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) => (s.classId === prev.classId ? { ...s, owned: true } : s)),
                  }))
                }
              />
              <CheatButton
                label="전 직업 스킬 100% 해금"
                desc="전사 + 마법사 모든 스킬 보유"
                highlight
                onClick={() =>
                  applyCheat('전 직업 스킬 해금', (prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) => ({ ...s, owned: true })),
                  }))
                }
              />
              <CheatButton
                label="스킬 조각 +100 일괄 지급"
                desc="모든 스킬에 조각 100개 지급"
                onClick={() =>
                  applyCheat('스킬 조각 +100', (prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) => ({ ...s, pieces: (s.pieces || 0) + 100 })),
                  }))
                }
              />
              <CheatButton
                label="모든 스킬 Lv. 10 세팅"
                desc="전 스킬 레벨 10으로 설정"
                onClick={() =>
                  applyCheat('스킬 Lv. 10 세팅', (prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) => ({
                      ...s,
                      owned: true,
                      level: 10,
                      piecesRequired: getSkillPiecesRequired({ ...s, level: 10 }),
                    })),
                  }))
                }
              />
              <CheatButton
                label="모든 스킬 Lv. 30 (MAX)"
                desc="전 스킬 레벨 30 극대화"
                highlight
                onClick={() =>
                  applyCheat('스킬 Lv. 30 세팅', (prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) => ({
                      ...s,
                      owned: true,
                      level: 30,
                      piecesRequired: getSkillPiecesRequired({ ...s, level: 30 }),
                    })),
                  }))
                }
              />
            </div>
          )}

          {/* TAB: STAGE */}
          {activeTab === 'stage' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="Stage 1-1 (초원의 시작)"
                desc="기본 첫 번째 스테이지로 이동"
                onClick={() =>
                  applyCheat('1-1 이동', (prev) => ({
                    ...prev,
                    stage: { ...prev.stage, chapter: 1, stage: 1, inBossFight: false, killCount: 0 },
                  }))
                }
              />
              <CheatButton
                label="Stage 1-10 (Ch.1 보스)"
                desc="고블린 킹 보스 스테이지"
                onClick={() =>
                  applyCheat('1-10 이동', (prev) => ({
                    ...prev,
                    stage: {
                      ...prev.stage,
                      chapter: 1,
                      stage: 10,
                      isBossStage: true,
                      inBossFight: false,
                      killCount: 0,
                      highestChapter: Math.max(prev.stage.highestChapter, 1),
                      highestStage: Math.max(prev.stage.highestStage, 10),
                    },
                  }))
                }
              />
              <CheatButton
                label="Stage 2-1 (정령의 호수)"
                desc="2챕터 물가 테마로 이동"
                onClick={() =>
                  applyCheat('2-1 이동', (prev) => ({
                    ...prev,
                    stage: {
                      ...prev.stage,
                      chapter: 2,
                      stage: 1,
                      inBossFight: false,
                      killCount: 0,
                      highestChapter: Math.max(prev.stage.highestChapter, 2),
                      highestStage: Math.max(prev.stage.highestStage, 1),
                    },
                  }))
                }
              />
              <CheatButton
                label="Stage 3-10 (최종 보스)"
                desc="단풍 계곡 드래곤 보스전"
                highlight
                onClick={() =>
                  applyCheat('3-10 이동', (prev) => ({
                    ...prev,
                    stage: {
                      ...prev.stage,
                      chapter: 3,
                      stage: 10,
                      isBossStage: true,
                      inBossFight: false,
                      killCount: 0,
                      highestChapter: 3,
                      highestStage: 10,
                    },
                  }))
                }
              />
              <CheatButton
                label="보스전 즉시 소환"
                desc="현재 스테이지 보스전 바로 강제 진입"
                highlight
                onClick={() => {
                  onTriggerBoss();
                  showToast('보스전 즉시 소환됨!');
                }}
              />
            </div>
          )}

          {/* TAB: PETS & QUESTS & RESET */}
          {activeTab === 'pets' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <CheatButton
                label="펫 전체 해금 & Lv. 10"
                desc="모든 펫 수집 및 10레벨"
                onClick={() =>
                  applyCheat('펫 전체 해금', (prev) => ({
                    ...prev,
                    pets: prev.pets.map((p) => ({ ...p, owned: true, level: 10 })),
                  }))
                }
              />
              <CheatButton
                label="퀘스트 전체 완료"
                desc="모든 퀘스트 보상 즉시 수령 가능"
                onClick={() =>
                  applyCheat('퀘스트 전체 완료', (prev) => ({
                    ...prev,
                    quests: prev.quests.map((q) => ({ ...q, currentCount: q.targetCount, completed: true })),
                  }))
                }
              />

              <div style={{ gridColumn: '1 / -1', marginTop: '12px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                <CheatButton
                  label="⚠️ 세이브 데이터 완전 초기화"
                  desc="신규 설치 계정 상태로 즉시 롤백 (치트 상태 해제)"
                  danger
                  onClick={() => {
                    if (window.confirm('정말로 세이브 데이터를 완전 초기화하시겠습니까? 초기 상태로 돌아갑니다.')) {
                      onResetSave();
                      onClose();
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#090d16',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <div>
            치트 상태: {saveData.cheatUsed ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>USED (테스트 계정)</span> : <span style={{ color: '#22c55e' }}>CLEAN</span>}
          </div>
          <div>모든 치트 조작은 실시간으로 저장됩니다.</div>
        </div>
      </div>
    </div>
  );
};

interface CheatButtonProps {
  label: string;
  desc: string;
  onClick: () => void;
  highlight?: boolean;
  danger?: boolean;
}

const CheatButton: React.FC<CheatButtonProps> = ({ label, desc, onClick, highlight, danger }) => {
  return (
    <button
      className="dev-cheat-btn"
      data-cheat-label={label}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '10px 12px',
        backgroundColor: danger ? '#450a0a' : highlight ? '#1e293b' : '#172554',
        border: danger ? '1px solid #dc2626' : highlight ? '1px solid #f59e0b' : '1px solid #2563eb',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.1s, background-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: '0.85rem',
          color: danger ? '#fca5a5' : highlight ? '#fbbf24' : '#93c5fd',
          marginBottom: '2px',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{desc}</span>
    </button>
  );
};
