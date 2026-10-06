import React from 'react';
import { GameSettings } from '../types/game';
import { Volume2, VolumeX, Music, Trash2, X, Settings } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
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
        </div>

        {/* Reset Data Danger Zone */}
        <div className="settings-danger-box">
          <button className="reset-data-btn" onClick={onResetData}>
            <Trash2 size={15} color="#ef4444" />
            <span>게임 데이터 초기화</span>
          </button>
        </div>

        <div className="settings-footer">
          <span>기사단 모험기 v2.0.0</span>
          <span>Commercial 2D Mobile Idle RPG</span>
        </div>
      </div>

      <style>{`
        .settings-modal-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
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

        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-option-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 15, 28, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 10px 12px;
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

        .settings-danger-box {
          margin-top: 4px;
        }

        .reset-data-btn {
          width: 100%;
          min-height: 38px;
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
          font-size: 10px;
          color: #64748b;
          padding-top: 6px;
        }
      `}</style>
    </div>
  );
};
