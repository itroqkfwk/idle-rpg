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
    { tab: 'adventure', label: '모험', icon: <Swords size={18} /> },
    { tab: 'hero', label: '영웅', icon: <User size={18} /> },
    { tab: 'equipment', label: '장비', icon: <Shield size={18} /> },
    { tab: 'pet', label: '펫', icon: <Sparkles size={18} /> },
    { tab: 'shop', label: '상점', icon: <Store size={18} /> },
  ];

  return (
    <nav className="game-floating-dock-nav">
      <div className="nav-dock-container">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const hasBadge = Boolean(badges[item.tab]);

          return (
            <button
              key={item.tab}
              className={`nav-dock-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              onClick={() => onTabChange(item.tab)}
              aria-label={item.label}
            >
              {/* Active Indicator Glow Pill */}
              {isActive && <div className="active-pill-glow" />}

              <div className="nav-icon-container">
                {item.icon}
                {hasBadge && <div className="nav-ruby-dot" />}
              </div>
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .game-floating-dock-nav {
          position: absolute;
          bottom: max(8px, env(safe-area-inset-bottom));
          left: 8px;
          right: 8px;
          z-index: 50;
          user-select: none;
          box-sizing: border-box;
        }

        .nav-dock-container {
          height: 56px;
          background: rgba(11, 17, 32, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px;
          box-sizing: border-box;
          width: 100%;
        }

        .nav-dock-item {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 46px;
          border: none;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          color: #94a3b8;
          transition: transform 0.1s ease, color 0.15s ease;
          padding: 0;
        }

        .nav-dock-item:active {
          transform: scale(0.92);
        }

        .nav-item-active {
          color: #f59e0b;
        }

        .active-pill-glow {
          position: absolute;
          inset: 2px;
          background: rgba(245, 158, 11, 0.12);
          border-radius: 10px;
          border: 1px solid rgba(245, 158, 11, 0.25);
          pointer-events: none;
        }

        .nav-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-ruby-dot {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        }

        .nav-item-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1px;
        }
      `}</style>
    </nav>
  );
};
