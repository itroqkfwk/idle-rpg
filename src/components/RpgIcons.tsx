import React from 'react';
import { EquipmentRarity, EquipmentSlot, SkillEffectType, DungeonId } from '../types/game';
import { RARITY_CONFIGS } from '../data/equipment';

export interface SkillElementMeta {
  element: 'fire' | 'ice' | 'lightning' | 'arcane' | 'wind' | 'blood' | 'holy' | 'physical';
  label: string;
  color: string;
  bg: string;
  border: string;
  castMotionLabel: string;
  vfxSummary: string;
}

export function getSkillElementMeta(effectType: SkillEffectType | string): SkillElementMeta {
  switch (effectType) {
    case 'fireball':
    case 'flame_sword':
    case 'flame_pillar':
    case 'meteor':
    case 'power_slash':
      return {
        element: 'fire',
        label: '화염',
        color: '#fb923c',
        bg: 'rgba(249, 115, 22, 0.16)',
        border: 'rgba(251, 146, 60, 0.48)',
        castMotionLabel: '열화 응축 → 화염 궤적 방출 → 폭발 및 잔열',
        vfxSummary: '고열 중심광과 나선 불꽃 궤적, 적중 시 화염 돔 폭발 및 화상 잔열 파티클',
      };
    case 'ice_spear':
    case 'blizzard':
    case 'frost_nova':
    case 'absolute_zero':
      return {
        element: 'ice',
        label: '빙결',
        color: '#38bdf8',
        bg: 'rgba(56, 189, 248, 0.16)',
        border: 'rgba(103, 232, 249, 0.48)',
        castMotionLabel: '한기 결집 → 빙결정 투사/확산 → 빙결 파편 산란',
        vfxSummary: '육각 빙결정 마법진과 날카로운 얼음 창·서리 파편, 적중 시 냉기 파동',
      };
    case 'chain_lightning':
    case 'thunder_strike':
      return {
        element: 'lightning',
        label: '번개',
        color: '#facc15',
        bg: 'rgba(250, 204, 21, 0.16)',
        border: 'rgba(253, 224, 71, 0.5)',
        castMotionLabel: '전하 충전 → 불규칙 전격 분기 → 낙뢰 섬광',
        vfxSummary: '다중 분기 플라즈마 전격과 순간 섬광, 감전 스파크 체인',
      };
    case 'sword_wave':
    case 'wind_blade':
    case 'whirlwind':
      return {
        element: 'wind',
        label: '질풍',
        color: '#34d399',
        bg: 'rgba(16, 185, 129, 0.16)',
        border: 'rgba(52, 211, 153, 0.48)',
        castMotionLabel: '자세 압축 → 초승달 검기/회오리 회전 → 진공 충격',
        vfxSummary: '곡선형 비취 검기와 다중 회전 태풍 궤적, 속도감 있는 충격파',
      };
    case 'blood_thirst':
    case 'execution':
    case 'ragnarok_cleave':
      return {
        element: 'blood',
        label: '혈기·심연',
        color: '#f87171',
        bg: 'rgba(239, 68, 68, 0.18)',
        border: 'rgba(248, 113, 113, 0.52)',
        castMotionLabel: '투기 개방 → 수직 단죄/연속 참격 → 생명력 흡수·파쇄',
        vfxSummary: '진홍빛 대참격과 심연 균열, 피격 지점으로부터 영웅에게 회수되는 혈기 입자',
      };
    case 'shield_bash':
    case 'iron_fortress':
    case 'heavenly_blade':
      return {
        element: 'holy',
        label: '성광·수호',
        color: '#fbbf24',
        bg: 'rgba(245, 158, 11, 0.18)',
        border: 'rgba(251, 191, 36, 0.52)',
        castMotionLabel: '성광 결계 전개 → 황금 검강/방패 강타 → 대지 균열',
        vfxSummary: '육각 황금 수호 방패와 천공의 대검강, 성스러운 십자 섬광',
      };
    case 'magic_missile':
    case 'arcane_orb':
    case 'gravity_well':
    case 'mana_burst':
    case 'arcane_familiar':
    case 'astral_cataclysm':
    case 'arcane_storm':
      return {
        element: 'arcane',
        label: '비전·성좌',
        color: '#c084fc',
        bg: 'rgba(168, 85, 247, 0.18)',
        border: 'rgba(192, 132, 252, 0.52)',
        castMotionLabel: '기하학 마법진 회전 → 비전 투사체/광선 → 초신성 붕괴',
        vfxSummary: '정교한 기하학 마법진과 나선 마탄, 중력장 왜곡 및 성좌 폭격',
      };
    default:
      return {
        element: 'physical',
        label: '검술',
        color: '#60a5fa',
        bg: 'rgba(59, 130, 246, 0.16)',
        border: 'rgba(96, 165, 250, 0.48)',
        castMotionLabel: '검세 준비 → 고속 연속 참격 → 잔상 수렴',
        vfxSummary: '예리한 검기 궤적과 다중 공간 잔상, 타격 방향 스파크',
      };
  }
}

export const SkillEmblem: React.FC<{
  effectType: SkillEffectType | string;
  size?: number;
  className?: string;
}> = ({ effectType, size = 34, className = '' }) => {
  const meta = getSkillElementMeta(effectType);
  const uid = `sk_${effectType}`;

  const renderGlyph = () => {
    switch (effectType) {
      case 'power_slash':
        return (
          <>
            <path d="M7 29 C14 14, 24 8, 34 7 C27 15, 20 22, 12 33 Z" fill="#fb923c" opacity="0.88" />
            <path d="M9 28 L31 8 L33 10 L11 30 Z" fill="#fef08a" />
            <path d="M7 31 L13 25 M9 33 L15 27" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="28" cy="12" r="2.5" fill="#ffffff" />
          </>
        );
      case 'double_slash':
        return (
          <>
            <path d="M7 9 L33 31" stroke="#38bdf8" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M33 9 L7 31" stroke="#fbbf24" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M9 11 L31 29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M31 11 L9 29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3.5" fill="#fef08a" />
          </>
        );
      case 'sword_wave':
      case 'wind_blade':
        return (
          <>
            <path d="M9 9 C26 11, 33 20, 27 32 C31 22, 23 15, 9 14 Z" fill="#10b981" />
            <path d="M13 7 C29 9, 36 19, 29 33 C33 21, 26 13, 13 11 Z" fill="#6ee7b7" />
            <path d="M6 20 Q16 17 24 20" stroke="#a7f3d0" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M5 25 Q14 23 21 25" stroke="#34d399" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </>
        );
      case 'whirlwind':
        return (
          <>
            <path d="M20 6 A13 13 0 0 1 33 19 C33 24 28 24 25 20" stroke="#fbbf24" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M34 20 A13 13 0 0 1 21 33 C16 33 16 28 20 25" stroke="#34d399" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M20 34 A13 13 0 0 1 7 21 C7 16 12 16 15 20" stroke="#fef08a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M6 20 A13 13 0 0 1 19 7 C24 7 24 12 20 15" stroke="#f59e0b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3.2" fill="#ffffff" />
          </>
        );
      case 'shield_bash':
        return (
          <>
            <path d="M20 6 L31 11 V20 C31 27 25 32 20 34 C15 32 9 27 9 20 V11 Z" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.6" />
            <path d="M20 10 L27 13.5 V19.5 C27 24.5 23 28 20 29.8 C17 28 13 24.5 13 19.5 V13.5 Z" fill="#f59e0b" opacity="0.85" />
            <path d="M20 12 V27 M15 18 H25" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M34 15 L37 13 M34 20 L38 20 M34 25 L37 27" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'blade_storm':
        return (
          <>
            <path d="M6 14 L34 26 M6 26 L34 14 M15 6 L25 34 M26 6 L14 34" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M20 5 L23 20 L20 35 L17 20 Z" fill="#fef08a" stroke="#f97316" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
          </>
        );
      case 'ground_breaker':
        return (
          <>
            <path d="M18 6 H22 L24 21 H16 Z" fill="#fbbf24" />
            <ellipse cx="20" cy="28" rx="13" ry="4.5" fill="none" stroke="#f97316" strokeWidth="2.4" />
            <path d="M8 29 L13 23 L16 28 M24 28 L27 22 L32 29" stroke="#fde047" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
            <path d="M12 31 L20 26 L28 31" stroke="#ef4444" strokeWidth="2" fill="none" />
          </>
        );
      case 'blood_thirst':
        return (
          <>
            <path d="M10 10 C18 6, 28 10, 31 20 C26 14, 18 13, 11 17 Z" fill="#ef4444" />
            <path d="M9 22 C17 18, 27 22, 30 32 C25 26, 17 25, 10 29 Z" fill="#dc2626" />
            <path d="M20 13 C23 18, 24 21, 24 24 A4 4 0 0 1 16 24 C16 21, 17 18, 20 13 Z" fill="#fecaca" stroke="#ef4444" strokeWidth="1.4" />
          </>
        );
      case 'execution':
        return (
          <>
            <path d="M15 5 H25 L28 24 L20 34 L12 24 Z" fill="#dc2626" stroke="#fecaca" strokeWidth="1.6" />
            <path d="M20 7 V31" stroke="#ffffff" strokeWidth="2.2" />
            <path d="M8 25 H32" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'flame_sword':
        return (
          <>
            <path d="M9 31 L29 9" stroke="#fde047" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M12 28 C10 20, 16 16, 19 10 C21 16, 27 14, 25 22 C29 19, 31 24, 23 29 Z" fill="#f97316" opacity="0.88" />
            <path d="M15 26 C15 20, 19 17, 22 13 C23 18, 26 20, 21 26 Z" fill="#fef08a" />
          </>
        );
      case 'iron_fortress':
        return (
          <>
            <polygon points="20,5 32,12 32,26 20,34 8,26 8,12" fill="rgba(245,158,11,0.22)" stroke="#fbbf24" strokeWidth="2.4" />
            <path d="M13 14 H16 V17 H20 V14 H23 V17 H27 V27 H13 Z" fill="#fde047" stroke="#b45309" strokeWidth="1.2" />
            <rect x="18" y="21" width="4" height="6" rx="2" fill="#1e293b" />
          </>
        );
      case 'phantom_blade':
        return (
          <>
            {[-28, -14, 0, 14, 28].map((deg, idx) => (
              <g key={deg} transform={`rotate(${deg} 20 28)`}>
                <path
                  d="M20 7 L22 23 L20 27 L18 23 Z"
                  fill={idx === 2 ? '#f0abfc' : '#a855f7'}
                  opacity={idx === 2 ? 1 : 0.72}
                />
              </g>
            ))}
            <circle cx="20" cy="27" r="3" fill="#38bdf8" />
          </>
        );
      case 'heavenly_blade':
        return (
          <>
            <circle cx="20" cy="19" r="12" fill="none" stroke="#fde047" strokeWidth="1.8" strokeDasharray="3 2" />
            <path d="M20 4 L24 22 L20 35 L16 22 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M9 17 L20 14 L31 17 L25 20 L20 18 L15 20 Z" fill="#fbbf24" />
            <circle cx="20" cy="17" r="2.6" fill="#ffffff" />
          </>
        );
      case 'ragnarok_cleave':
        return (
          <>
            <circle cx="20" cy="20" r="12" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
            <path d="M6 8 L34 32 M34 8 L6 32" stroke="#f97316" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M8 10 L32 30 M32 10 L8 30" stroke="#fef08a" strokeWidth="1.4" strokeLinecap="round" />
            <polygon points="20,9 23,17 31,20 23,23 20,31 17,23 9,20 17,17" fill="#ffffff" />
          </>
        );
      case 'magic_missile':
        return (
          <>
            <path d="M7 28 Q14 14 29 10" stroke="#38bdf8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M8 31 Q18 22 32 18" stroke="#c084fc" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M12 33 Q22 28 30 27" stroke="#38bdf8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="29" cy="10" r="3.2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="32" cy="18" r="3.2" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1.2" />
            <circle cx="30" cy="27" r="2.8" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.2" />
          </>
        );
      case 'fireball':
      case 'meteor':
        return (
          <>
            <path d="M7 29 C11 19, 17 13, 27 9 C26 19, 23 26, 14 31 Z" fill="#ea580c" />
            <circle cx="23" cy="17" r="8.5" fill="#f97316" stroke="#fde047" strokeWidth="1.6" />
            <circle cx="24" cy="16" r="4.5" fill="#fef08a" />
            <circle cx="12" cy="26" r="2" fill="#fb923c" />
          </>
        );
      case 'ice_spear':
        return (
          <>
            <polygon points="33,7 24,21 19,16" fill="#67e8f9" />
            <polygon points="33,7 16,24 12,20" fill="#e0f2fe" />
            <path d="M8 32 L26 14" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <polygon points="14,22 18,26 11,29" fill="#38bdf8" />
          </>
        );
      case 'chain_lightning':
        return (
          <>
            <polyline points="23,5 13,18 22,18 11,34" fill="none" stroke="#38bdf8" strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points="23,5 13,18 22,18 11,34" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points="22,18 30,24 26,32" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          </>
        );
      case 'blizzard':
        return (
          <>
            <path d="M20 7 V33 M9 13 L31 27 M31 13 L9 27" stroke="#67e8f9" strokeWidth="2.4" strokeLinecap="round" />
            <polygon points="20,13 26,20 20,27 14,20" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.4" />
            <circle cx="20" cy="20" r="2.5" fill="#38bdf8" />
          </>
        );
      case 'arcane_orb':
        return (
          <>
            <circle cx="20" cy="20" r="11" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="20" cy="20" r="7.5" fill="#9333ea" stroke="#f0abfc" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="3.5" fill="#ffffff" />
            <circle cx="9" cy="16" r="2" fill="#38bdf8" />
            <circle cx="31" cy="24" r="2" fill="#f0abfc" />
          </>
        );
      case 'thunder_strike':
        return (
          <>
            <ellipse cx="20" cy="31" rx="11" ry="3.5" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="22,4 11,19 19,19 14,32 29,15 21,15" fill="#fde047" stroke="#f59e0b" strokeWidth="1.2" />
          </>
        );
      case 'frost_nova':
        return (
          <>
            <polygon points="20,5 23,15 33,12 26,20 33,28 23,25 20,35 17,25 7,28 14,20 7,12 17,15" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.4" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
          </>
        );
      case 'flame_pillar':
        return (
          <>
            <ellipse cx="20" cy="31" rx="11" ry="3.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <path d="M13 31 C11 21, 16 14, 20 5 C24 14, 29 21, 27 31 Z" fill="#f97316" />
            <path d="M16 31 C15 23, 18 17, 20 10 C22 17, 25 23, 24 31 Z" fill="#fef08a" />
          </>
        );
      case 'gravity_well':
        return (
          <>
            <ellipse cx="20" cy="20" rx="13" ry="6" transform="rotate(-25 20 20)" fill="none" stroke="#a855f7" strokeWidth="2.2" />
            <ellipse cx="20" cy="20" rx="13" ry="6" transform="rotate(35 20 20)" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="6" fill="#090d16" stroke="#e879f9" strokeWidth="2" />
          </>
        );
      case 'mana_burst':
      case 'arcane_storm':
        return (
          <>
            <polygon points="20,5 24,16 35,20 24,24 20,35 16,24 5,20 16,16" fill="#e879f9" stroke="#a855f7" strokeWidth="1.4" />
            <circle cx="20" cy="20" r="5" fill="#ffffff" />
          </>
        );
      case 'arcane_familiar':
        return (
          <>
            <path d="M20 15 C11 8, 7 15, 13 22 C9 25, 13 30, 19 24" fill="#f0abfc" opacity="0.85" />
            <path d="M20 15 C29 8, 33 15, 27 22 C31 25, 27 30, 21 24" fill="#67e8f9" opacity="0.85" />
            <circle cx="20" cy="19" r="4.5" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
          </>
        );
      case 'astral_cataclysm':
        return (
          <>
            <circle cx="20" cy="20" r="12" fill="none" stroke="#c084fc" strokeWidth="1.6" />
            <polygon points="20,7 23,17 33,20 23,23 20,33 17,23 7,20 17,17" fill="#fef08a" stroke="#a855f7" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="2.2" fill="#38bdf8" />
            <circle cx="29" cy="11" r="2.2" fill="#f472b6" />
            <circle cx="29" cy="29" r="2.2" fill="#38bdf8" />
          </>
        );
      case 'absolute_zero':
        return (
          <>
            <circle cx="20" cy="20" r="12" fill="rgba(14,165,233,0.22)" stroke="#67e8f9" strokeWidth="1.8" />
            <polygon points="20,4 25,15 36,20 25,25 20,36 15,25 4,20 15,15" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.4" />
            <polygon points="20,11 23,17 29,20 23,23 20,29 17,23 11,20 17,17" fill="#38bdf8" />
          </>
        );
      default:
        return <circle cx="20" cy="20" r="8" fill={meta.color} />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`rpg-skill-emblem ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={uid} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={meta.color} stopOpacity="0.38" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.92" />
        </radialGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill={`url(#${uid})`}
        stroke={meta.border}
        strokeWidth="1.6"
      />
      {renderGlyph()}
    </svg>
  );
};

export const EquipmentEmblem: React.FC<{
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  size?: number;
  silhouette?: boolean;
}> = ({ slot, rarity, size = 38, silhouette = false }) => {
  const conf = RARITY_CONFIGS[rarity] || RARITY_CONFIGS.common;
  const primary = silhouette ? '#334155' : conf.color;
  const accent = silhouette ? '#1e293b' : '#fef08a';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={silhouette ? 'rpg-equip-emblem is-silhouette' : 'rpg-equip-emblem'}
      aria-hidden="true"
    >
      {slot === 'weapon' && (
        <>
          <path d="M10 30 L29 11 L32 8 L30 14 L13 31 Z" fill={primary} stroke="#f8fafc" strokeWidth="1.2" />
          <path d="M11 23 L17 29" stroke={accent} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M7 33 L12 28" stroke="#94a3b8" strokeWidth="2.6" strokeLinecap="round" />
          {(rarity === 'legendary' || rarity === 'mythic') && !silhouette && (
            <circle cx="24" cy="16" r="2.5" fill="#ffffff" />
          )}
        </>
      )}
      {slot === 'helmet' && (
        <>
          <path
            d="M9 24 C9 13, 31 13, 31 24 L29 30 H24 L23 23 H17 L16 30 H11 Z"
            fill={primary}
            stroke="#f8fafc"
            strokeWidth="1.3"
          />
          <path d="M15 14 L20 9 L25 14" stroke={accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {slot === 'armor' && (
        <>
          <path
            d="M13 10 L20 13 L27 10 L32 16 L28 21 L27 32 H13 L12 21 L8 16 Z"
            fill={primary}
            stroke="#f8fafc"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <polygon points="20,16 23,21 20,26 17,21" fill={accent} />
        </>
      )}
      {slot === 'accessory' && (
        <>
          <circle cx="20" cy="22" r="9" fill="none" stroke={accent} strokeWidth="3" />
          <polygon points="20,8 25,13 20,17 15,13" fill={primary} stroke="#ffffff" strokeWidth="1.1" />
        </>
      )}
    </svg>
  );
};

export const DungeonEmblem: React.FC<{ dungeonId: DungeonId; size?: number }> = ({ dungeonId, size = 44 }) => {
  if (dungeonId === 'gold_mine') {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
        <rect x="2" y="2" width="40" height="40" rx="12" fill="rgba(245, 158, 11, 0.18)" stroke="rgba(251, 191, 36, 0.55)" strokeWidth="1.6" />
        <path d="M9 33 L16 17 L28 17 L35 33 Z" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="18" cy="27" r="4" fill="#fbbf24" />
        <circle cx="25" cy="28" r="3.5" fill="#fde047" />
        <circle cx="21" cy="23" r="3.5" fill="#f59e0b" />
        <polygon points="22,9 24,13 28,14 24,16 22,20 20,16 16,14 20,13" fill="#fef08a" />
      </svg>
    );
  }
  if (dungeonId === 'training_forest') {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
        <rect x="2" y="2" width="40" height="40" rx="12" fill="rgba(16, 185, 129, 0.18)" stroke="rgba(52, 211, 153, 0.55)" strokeWidth="1.6" />
        <polygon points="22,8 33,24 27,24 34,33 10,33 17,24 11,24" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.3" />
        <rect x="19.5" y="33" width="5" height="5" rx="1" fill="#92400e" />
        <circle cx="14" cy="14" r="2" fill="#fef08a" />
        <circle cx="31" cy="16" r="1.8" fill="#6ee7b7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(192, 132, 252, 0.55)" strokeWidth="1.6" />
      <polygon points="22,7 32,16 28,35 16,35 12,16" fill="#6d28d9" stroke="#ddd6fe" strokeWidth="1.5" />
      <polygon points="22,12 27,19 22,29 17,19" fill="#c084fc" />
      <circle cx="22" cy="19" r="2.5" fill="#ffffff" />
    </svg>
  );
};

export const ShopChestEmblem: React.FC<{
  variant: 'relic_altar' | 'free_chest' | 'gold_chest' | 'skill_tome_warrior' | 'skill_tome_mage';
  size?: number;
}> = ({ variant, size = 46 }) => {
  if (variant === 'relic_altar') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="3" y="3" width="42" height="42" rx="13" fill="rgba(239, 68, 68, 0.18)" stroke="rgba(251, 191, 36, 0.65)" strokeWidth="1.8" />
        <polygon points="24,8 35,18 24,33 13,18" fill="#38bdf8" stroke="#fef08a" strokeWidth="1.6" />
        <polygon points="24,11 31,18 24,29 17,18" fill="#e0f2fe" />
        <path d="M12 37 H36 L33 41 H15 Z" fill="#fbbf24" />
      </svg>
    );
  }
  if (variant === 'free_chest') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="3" y="3" width="42" height="42" rx="13" fill="rgba(16, 185, 129, 0.18)" stroke="rgba(52, 211, 153, 0.55)" strokeWidth="1.6" />
        <rect x="11" y="19" width="26" height="17" rx="3" fill="#059669" stroke="#a7f3d0" strokeWidth="1.5" />
        <path d="M11 23 H37 M24 19 V36" stroke="#fde047" strokeWidth="3" />
        <path d="M17 18 C17 13, 23 14, 24 18 C25 14, 31 13, 31 18" stroke="#fde047" strokeWidth="2.4" fill="none" />
      </svg>
    );
  }
  if (variant === 'gold_chest') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="3" y="3" width="42" height="42" rx="13" fill="rgba(245, 158, 11, 0.18)" stroke="rgba(251, 191, 36, 0.55)" strokeWidth="1.6" />
        <rect x="10" y="16" width="28" height="20" rx="4" fill="#92400e" stroke="#fbbf24" strokeWidth="2" />
        <path d="M10 24 H38" stroke="#fbbf24" strokeWidth="2.5" />
        <rect x="21" y="21" width="6" height="7" rx="2" fill="#fef08a" stroke="#b45309" strokeWidth="1.2" />
      </svg>
    );
  }
  const isMage = variant === 'skill_tome_mage';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="13"
        fill={isMage ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
        stroke={isMage ? 'rgba(192, 132, 252, 0.6)' : 'rgba(96, 165, 250, 0.6)'}
        strokeWidth="1.6"
      />
      <rect
        x="13"
        y="10"
        width="22"
        height="28"
        rx="3"
        fill={isMage ? '#581c87' : '#1e3a8a'}
        stroke="#fde047"
        strokeWidth="1.8"
      />
      <polygon
        points="24,16 27,22 33,24 27,26 24,32 21,26 15,24 21,22"
        fill={isMage ? '#e879f9' : '#38bdf8'}
      />
    </svg>
  );
};
