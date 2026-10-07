import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { Volume2, VolumeX, Music, Trash2, X, Settings, Shield, Sparkles, KeyRound } from 'lucide-react';
import { DEV_CHEAT_CODE } from './DeveloperTestModal';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetData: () => void;
  onClose: () => void;
  onOpenDevModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
  onOpenDevModal,
}) => {
  const [cheatCode, setCheatCode] = useState('');
  const [cheatFeedback, setCheatFeedback] = useState<string | null>(null);

  const handleApplyCheatCode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cheatCode.trim();
    if (trimmed.toUpperCase() === DEV_CHEAT_CODE) {
      setCheatFeedback('치트 인증 성공! 테스트 모드를 실행합니다.');
      setCheatCode('');
      setTimeout(() => {
        setCheatFeedback(null);
        if (onOpenDevModal) {
          onOpenDevModal();
        }
      }, 500);
    } else {
      setCheatFeedback('유효하지 않은 개발자 코드입니다.');
      setTimeout(() => setCheatFeedback(null), 3000);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content settings-modal-content">
        <div className="settings-header">
          <div className="settings-title-row">
            <Settings size={18} color="#f59e0b" />
            <h3 className="settings-title">게임 설정</h3>
          </div>
          <button className="settings-close-icon-btn" onClick={onClose} title="닫기">
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        <div className="settings-options-list">
          <div className="settings-section-title">기본 환경 설정</div>

          {/* BGM Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <Music size={18} color="#38bdf8" />
              <div className="option-texts">
                <span className="option-name">배경음악 (BGM)</span>
                <span className="option-desc">판타지 배경 멜로디 루프</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.bgmEnabled ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ bgmEnabled: !settings.bgmEnabled })}
            >
              {settings.bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              {settings.sfxEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#94a3b8" />}
              <div className="option-texts">
                <span className="option-name">효과음 (SFX)</span>
                <span className="option-desc">타격, 코인, 레벨업 사운드</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.sfxEnabled ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ sfxEnabled: !settings.sfxEnabled })}
            >
              {settings.sfxEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Damage Numbers Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <span style={{ fontSize: '1.1rem' }}>💥</span>
              <div className="option-texts">
                <span className="option-name">데미지 텍스트</span>
                <span className="option-desc">전투 시 플로팅 데미지 표시</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.damageNumbers ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ damageNumbers: !settings.damageNumbers })}
            >
              {settings.damageNumbers ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="settings-section-title" style={{ marginTop: '6px' }}>자동 관리 시스템 (방치형 편의)</div>

          {/* Auto Upgrade Equip Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <Shield size={18} color="#60a5fa" />
              <div className="option-texts">
                <span className="option-name">장비 자동 강화</span>
                <span className="option-desc">조각 및 골드 충족 시 자동 레벨업</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.autoUpgradeEquip ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ autoUpgradeEquip: !settings.autoUpgradeEquip })}
            >
              {settings.autoUpgradeEquip ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto Upgrade Skills Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <Sparkles size={18} color="#c084fc" />
              <div className="option-texts">
                <span className="option-name">스킬 자동 강화</span>
                <span className="option-desc">스킬 조각 충족 시 자동 레벨업</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.autoUpgradeSkills ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ autoUpgradeSkills: !settings.autoUpgradeSkills })}
            >
              {settings.autoUpgradeSkills ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto Equip Gear Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <span style={{ fontSize: '1.1rem' }}>🗡️</span>
              <div className="option-texts">
                <span className="option-name">장비 스마트 자동 장착</span>
                <span className="option-desc">전투력 상승 시 상위 장비 자동 착용</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.autoEquipGear ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ autoEquipGear: !settings.autoEquipGear })}
            >
              {settings.autoEquipGear ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto Equip Skills Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <span style={{ fontSize: '1.1rem' }}>🔮</span>
              <div className="option-texts">
                <span className="option-name">스킬 스마트 자동 편성</span>
                <span className="option-desc">직업 DPS 최적화 스킬 자동 세팅</span>
              </div>
            </div>
            <button
              className={`modern-toggle-btn ${settings.autoEquipSkills ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ autoEquipSkills: !settings.autoEquipSkills })}
            >
              {settings.autoEquipSkills ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Developer / QA Cheat Input Zone */}
        <div className="settings-cheat-box">
          <div className="settings-cheat-header">
            <KeyRound size={14} color="#f59e0b" />
            <span>개발자 / QA 코드 입력</span>
          </div>
          <form onSubmit={handleApplyCheatCode} className="settings-cheat-form">
            <input
              type="text"
              value={cheatCode}
              onChange={(e) => setCheatCode(e.target.value)}
              placeholder="코드 입력 (예: TEST-ALL-UNLOCK)"
              className="settings-cheat-input"
            />
            <button type="submit" className="settings-cheat-submit-btn">
              인증
            </button>
          </form>
          {cheatFeedback && (
            <div className={`settings-cheat-feedback ${cheatFeedback.includes('성공') ? 'success' : 'error'}`}>
              {cheatFeedback}
            </div>
          )}
        </div>

        {/* Reset Data Danger Zone */}
        <div className="settings-danger-box">
          <button className="reset-data-btn" onClick={onResetData}>
            <Trash2 size={15} color="#ef4444" />
            <span>게임 데이터 초기화</span>
          </button>
        </div>

        <div className="settings-footer">
          <span>기사단 모험기 v2.1.0</span>
          <span>Commercial 2D Mobile Idle RPG · Growth & Collection Engine</span>
        </div>
      </div>

      <style>{`
        .settings-modal-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 85vh;
          overflow-y: auto;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .settings-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .settings-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .settings-close-icon-btn {
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

        .settings-section-title {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding-left: 2px;
        }

        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .settings-option-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 15, 28, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 12px;
        }

        .option-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .option-texts {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .option-name {
          font-size: 12px;
          font-weight: 800;
          color: #f8fafc;
        }

        .option-desc {
          font-size: 10px;
          color: #94a3b8;
        }

        .modern-toggle-btn {
          min-width: 48px;
          height: 26px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .modern-toggle-btn.active {
          background: #10b981;
          border-color: #34d399;
          color: #ffffff;
        }

        .settings-cheat-box {
          background: rgba(30, 27, 75, 0.4);
          border: 1px solid rgba(129, 140, 248, 0.2);
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .settings-cheat-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #a5b4fc;
        }

        .settings-cheat-form {
          display: flex;
          gap: 6px;
        }

        .settings-cheat-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          color: #f8fafc;
          padding: 6px 10px;
          font-size: 11px;
        }

        .settings-cheat-input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .settings-cheat-submit-btn {
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .settings-cheat-submit-btn:active {
          background: #2563eb;
        }

        .settings-cheat-feedback {
          font-size: 10px;
          font-weight: 700;
          padding-left: 2px;
        }

        .settings-cheat-feedback.success {
          color: #34d399;
        }

        .settings-cheat-feedback.error {
          color: #f87171;
        }

        .settings-danger-box {
          margin-top: 2px;
        }

        .reset-data-btn {
          width: 100%;
          min-height: 34px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 12px;
          color: #f87171;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .reset-data-btn:active {
          background: rgba(239, 68, 68, 0.2);
        }

        .settings-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 9px;
          color: #64748b;
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
};

