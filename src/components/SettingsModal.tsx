import React from 'react';
import { GameSettings } from '../types/game';
import { Volume2, VolumeX, Music, Trash2, X } from 'lucide-react';

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
          <h3 className="settings-title">⚙️ 게임 설정</h3>
          <button className="settings-close-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-options-list">
          {/* BGM Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              <Music size={18} color="var(--sage-green-dark)" />
              <div className="option-texts">
                <span className="option-name">배경음악 (BGM)</span>
                <span className="option-desc">힐링 멜로디 루프</span>
              </div>
            </div>
            <button
              className={`cozy-toggle-btn ${settings.bgmEnabled ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ bgmEnabled: !settings.bgmEnabled })}
            >
              {settings.bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="settings-option-item">
            <div className="option-info">
              {settings.sfxEnabled ? <Volume2 size={18} color="var(--sage-green-dark)" /> : <VolumeX size={18} color="#94a3b8" />}
              <div className="option-texts">
                <span className="option-name">효과음 (SFX)</span>
                <span className="option-desc">타격, 코인, 레벨업 사운드</span>
              </div>
            </div>
            <button
              className={`cozy-toggle-btn ${settings.sfxEnabled ? 'active' : ''}`}
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
                <span className="option-name">데미지 숫자 표시</span>
                <span className="option-desc">전투 시 플로팅 텍스트</span>
              </div>
            </div>
            <button
              className={`cozy-toggle-btn ${settings.damageNumbers ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ damageNumbers: !settings.damageNumbers })}
            >
              {settings.damageNumbers ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Reset Data Danger Zone */}
        <div className="settings-danger-box">
          <button className="cozy-btn cozy-btn-outline reset-data-btn" onClick={onResetData}>
            <Trash2 size={16} color="var(--accent-red)" />
            <span style={{ color: 'var(--accent-red)' }}>게임 데이터 초기화</span>
          </button>
        </div>

        <div className="settings-footer">
          <span>포근한 숲속 모험단 v1.0.0</span>
          <span>Designed for Mobile & PC</span>
        </div>
      </div>

      <style>{`
        .settings-modal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .settings-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--cozy-brown);
        }
        .settings-close-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--cozy-brown-light);
        }
        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .settings-option-item {
          background: #ffffff;
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .option-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .option-texts {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .option-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--cozy-brown);
        }
        .option-desc {
          font-size: 0.7rem;
          color: var(--cozy-brown-light);
        }
        .cozy-toggle-btn {
          min-width: 58px;
          height: 32px;
          border-radius: 16px;
          border: 1.5px solid var(--border-soft);
          background: #f1f5f9;
          color: #94a3b8;
          font-weight: 900;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cozy-toggle-btn.active {
          background: var(--sage-green-dark);
          color: #ffffff;
          border-color: var(--sage-green-dark);
        }
        .settings-danger-box {
          margin-top: 6px;
        }
        .reset-data-btn {
          width: 100%;
          min-height: 40px;
          border-color: rgba(244, 63, 94, 0.3);
          font-size: 0.82rem;
        }
        .settings-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.68rem;
          color: var(--cozy-brown-light);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
