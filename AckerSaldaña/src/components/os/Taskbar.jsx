import { useState, useRef } from 'react';
import { Win11Logo, SearchIcon, WifiIcon, SpeakerIcon, BellIcon } from './AppIcons';

const TaskbarButton = ({ icon, onClick, isActive, isOpen, tooltip, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef(null);

  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 400);
  };
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={onClick}
        aria-label={tooltip || 'Taskbar button'}
        className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all duration-150 ${
          isActive
            ? 'bg-white/10'
            : 'hover:bg-white/8'
        } ${className}`}
      >
        {icon}
        {isOpen && (
          <div className={`absolute bottom-0.5 rounded-full transition-all duration-200 ${
            isActive ? 'w-4 h-[3px] bg-[#60cdff]' : 'w-1.5 h-[3px] bg-white/40'
          }`} />
        )}
      </button>
      {showTooltip && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md text-[11px] text-white whitespace-nowrap pointer-events-none"
          style={{
            background: 'rgba(44, 44, 44, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.14)',
          }}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

const Taskbar = ({
  apps,
  windows,
  activeWindow,
  minimizedWindows,
  onOpenWindow,
  onFocusWindow,
  onToggleStartMenu,
  showStartMenu,
  time,
  onToggleNotifications,
  onToggleSearch,
  isMobile,
}) => {
  const handleAppClick = (appId) => {
    const isOpen = !!windows[appId];
    const isMinimized = minimizedWindows.has(appId);

    if (isMinimized) {
      onOpenWindow(appId);
    } else if (isOpen) {
      if (activeWindow === appId) {
        // Already focused, minimize it (toggle behavior)
        onOpenWindow(appId);
      } else {
        onFocusWindow(appId);
      }
    } else {
      onOpenWindow(appId);
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[9000] flex items-center ${
        isMobile ? 'h-14' : 'h-12'
      }`}
      style={{
        background: 'rgba(32, 32, 32, 0.80)',
        backdropFilter: 'blur(30px) saturate(125%)',
        WebkitBackdropFilter: 'blur(30px) saturate(125%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center gap-0.5">
        {/* Start button */}
        <div role="menubar">
          <TaskbarButton
            icon={<Win11Logo size={18} />}
            onClick={onToggleStartMenu}
            isActive={showStartMenu}
            tooltip="Start"
            className="start-btn"
          />
        </div>

        {/* Search */}
        {!isMobile && (
          <TaskbarButton
            icon={<SearchIcon size={18} className="text-white/60" />}
            onClick={onToggleSearch}
            tooltip="Search"
          />
        )}

        {/* Separator */}
        <div className="w-px h-6 bg-white/8 mx-1" />

        {/* App icons */}
        {Object.keys(apps).map((appId) => {
          const app = apps[appId];
          const isOpen = !!windows[appId];
          const isActive = activeWindow === appId && !minimizedWindows.has(appId);
          const IconComponent = app.icon;

          return (
            <TaskbarButton
              key={appId}
              icon={<IconComponent size={20} />}
              onClick={() => handleAppClick(appId)}
              isOpen={isOpen}
              isActive={isActive}
              tooltip={app.title}
            />
          );
        })}
      </div>

      {/* System tray - right side */}
      <div className={`absolute right-0 top-0 h-full flex items-center gap-1 ${isMobile ? 'pr-2' : 'pr-3'}`}>
        {!isMobile && (
          <>
            <button className="p-1.5 rounded hover:bg-white/8 transition-colors text-white/50 hover:text-white/70">
              <WifiIcon size={14} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/8 transition-colors text-white/50 hover:text-white/70">
              <SpeakerIcon size={14} />
            </button>
          </>
        )}
        <button
          onClick={onToggleNotifications}
          className="p-1.5 rounded hover:bg-white/8 transition-colors text-white/50 hover:text-white/70"
        >
          <BellIcon size={14} />
        </button>
        <button
          onClick={onToggleNotifications}
          className={`rounded-md hover:bg-white/8 transition-colors flex flex-col items-end leading-tight ${
            isMobile ? 'px-1.5 py-1' : 'px-2 py-1'
          }`}
          style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        >
          <span className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isMobile && (
            <span className="text-[10px] text-white/40">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
