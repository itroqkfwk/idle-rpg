import React from 'react';
import { ActiveTab } from '../types/game';
import { Swords, User, Shield, Sparkles, Store } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  badges?: Partial<Record<ActiveTab, boolean | number>>;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  badges = {},
}) => {
  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'adventure', label: '모험', icon: <Swords size={20} /> },
    { tab: 'hero', label: '영웅', icon: <User size={20} /> },
    { tab: 'equipment', label: '장비', icon: <Shield size={20} /> },
    { tab: 'pet', label: '펫', icon: <Sparkles size={20} /> },
    { tab: 'shop', label: '상점', icon: <Store size={20} /> },
  ];

  return (
    <nav className="game-console-nav">
      <div className="nav-timber-frame">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const hasBadge = Boolean(badges[item.tab]);

          return (
            <button
              key={item.tab}
              className={`game-nav-btn ${isActive ? 'nav-btn-active' : 'nav-btn-inactive'}`}
              onClick={() => onTabChange(item.tab)}
              aria-label={item.label}
            >
              {/* Active Golden Aura Pillar */}
              {isActive && <div className="active-light-beam" />}

              <div className="nav-btn-core">
                <div className="nav-icon-slot">
                  {item.icon}
                  {hasBadge && <div className="ruby-badge-gem" />}
                </div>
                <span className="nav-btn-text game-stroke">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        .game-console-nav {
          position: relative;
          width: 100%;
          background: linear-gradient(180deg, #422d1d 0%, #2b1d12 40%, #170e08 100%);
          border-top: 3.5px solid #d97706;
          padding-bottom: max(6px, env(safe-area-inset-bottom));
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.7), inset 0 2px 0 rgba(254, 240, 138, 0.4);
          z-index: 50;
        }

        .nav-timber-frame {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 6px 8px 4px;
          gap: 6px;
        }

        /* 3D Tactile Nav Button */
        .game-nav-btn {
          flex: 1;
          position: relative;
          min-height: 52px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: transform 0.08s ease, filter 0.08s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
        }

        .nav-btn-inactive {
          background: linear-gradient(180deg, #5c3c26 0%, #3e2617 60%, #29180c 100%);
          border: 1.5px solid #784c28;
          border-bottom: 4px solid #140b05;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.35);
          color: #d4bda8;
        }
        .nav-btn-inactive:active {
          transform: translateY(3px);
          border-bottom-width: 1.5px;
        }

        /* 🌟 Raised 6px Upward with Golden Aura */
        .nav-btn-active {
          transform: translateY(-8px);
          background: linear-gradient(180deg, #fef08a 0%, #f59e0b 45%, #b45309 100%);
          border: 2px solid #fff;
          border-bottom: 5px solid #451a03;
          box-shadow: 0 8px 18px rgba(245, 158, 11, 0.55), 0 0 12px rgba(254, 240, 138, 0.8);
          color: #ffffff;
        }
        .nav-btn-active:active {
          transform: translateY(-5px);
          border-bottom-width: 2px;
        }

        .active-light-beam {
          position: absolute;
          top: -12px;
          width: 30px;
          height: 12px;
          background: radial-gradient(ellipse at center, rgba(254, 240, 138, 0.8) 0%, transparent 70%);
          pointer-events: none;
        }

        .nav-btn-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          position: relative;
          z-index: 2;
        }

        .nav-icon-slot {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
        }

        .nav-btn-text {
          font-size: 0.68rem;
          color: #ffffff;
          line-height: 1;
        }

        .nav-btn-active .nav-btn-text {
          color: #ffffff;
          font-weight: 900;
        }

        /* 💎 Ruby Gem Badge Dot */
        .ruby-badge-gem {
          position: absolute;
          top: -4px;
          right: -6px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fda4af 0%, #f43f5e 50%, #9f1239 100%);
          border: 1.5px solid #ffffff;
          box-shadow: 0 0 6px #f43f5e;
          animation: gemBlink 1.5s infinite;
        }

        @keyframes gemBlink {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); box-shadow: 0 0 10px #f43f5e; }
        }
      `}</style>
    </nav>
  );
};
