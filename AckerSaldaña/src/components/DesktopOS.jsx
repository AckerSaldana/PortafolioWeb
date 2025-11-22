import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Window from './Window';
import TerminalWindow from './TerminalWindow';
import ProjectExplorer from './ProjectExplorer';
import PhotoGallery from './PhotoGallery';
import useBreakpoint from '../hooks/useBreakpoint';

const DesktopOS = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet, windowSize } = useBreakpoint();
  const [bootComplete, setBootComplete] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [windows, setWindows] = useState({});
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownLines, setShutdownLines] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const zIndexCounter = useRef(100);
  const shutdownRef = useRef(null);
  const desktopRef = useRef(null);

  // Calculate responsive initial positions based on viewport
  const getResponsivePosition = (index) => {
    if (isMobile) {
      return { x: 10, y: 10 };
    } else if (isTablet) {
      return { x: 50 + (index * 30), y: 50 + (index * 30) };
    }
    return { x: 100 + (index * 50), y: 100 + (index * 50) };
  };

  const apps = {
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      icon: '>_',
      component: TerminalWindow,
      width: isMobile ? windowSize.width - 20 : 600,
      height: isMobile ? windowSize.height - 120 : 400,
      ...getResponsivePosition(0)
    },
    projects: {
      id: 'projects',
      title: 'Project Explorer',
      icon: '📁',
      component: ProjectExplorer,
      width: isMobile ? windowSize.width - 20 : 700,
      height: isMobile ? windowSize.height - 120 : 500,
      ...getResponsivePosition(1)
    },
    gallery: {
      id: 'gallery',
      title: 'Photo Gallery',
      icon: '📷',
      component: PhotoGallery,
      width: isMobile ? windowSize.width - 20 : 800,
      height: isMobile ? windowSize.height - 120 : 600,
      ...getResponsivePosition(2)
    }
  };

  // Boot sequence
  useEffect(() => {
    const bootMessages = [
      { text: 'PORTFOLIO OS v2.0.1', delay: 0 },
      { text: 'Initializing system...', delay: 300 },
      { text: '[OK] Memory check completed', delay: 500 },
      { text: '[OK] Loading React framework...', delay: 700 },
      { text: '[OK] GSAP animation engine ready', delay: 900 },
      { text: '[OK] Three.js renderer initialized', delay: 1100 },
      { text: 'Loading desktop environment...', delay: 1300 },
      { text: '[OK] Desktop ready', delay: 1500 },
      { text: '', delay: 1700 },
      { text: 'Welcome, Acker Saldaña', delay: 1900, special: true }
    ];

    bootMessages.forEach((msg) => {
      setTimeout(() => {
        setBootLines((prev) => [...prev, msg]);
      }, msg.delay);
    });

    setTimeout(() => {
      setBootComplete(true);
      // Auto-open terminal
      setTimeout(() => openWindow('terminal'), 500);
    }, 2200);
  }, []);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindow = (appId) => {
    if (windows[appId] && !minimizedWindows.has(appId)) {
      // Window exists and not minimized, just focus it
      focusWindow(appId);
      return;
    }

    if (minimizedWindows.has(appId)) {
      // Restore minimized window
      const newMinimized = new Set(minimizedWindows);
      newMinimized.delete(appId);
      setMinimizedWindows(newMinimized);
      focusWindow(appId);
      return;
    }

    // Create new window
    const app = apps[appId];
    setWindows({
      ...windows,
      [appId]: {
        ...app,
        zIndex: ++zIndexCounter.current
      }
    });
    setActiveWindow(appId);
  };

  const closeWindow = (appId) => {
    const newWindows = { ...windows };
    delete newWindows[appId];
    setWindows(newWindows);

    if (activeWindow === appId) {
      const remainingWindows = Object.keys(newWindows);
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[0] : null);
    }

    // Remove from minimized if present
    const newMinimized = new Set(minimizedWindows);
    newMinimized.delete(appId);
    setMinimizedWindows(newMinimized);
  };

  const minimizeWindow = (appId) => {
    setMinimizedWindows(new Set([...minimizedWindows, appId]));
  };

  const focusWindow = (appId) => {
    setActiveWindow(appId);
    setWindows({
      ...windows,
      [appId]: {
        ...windows[appId],
        zIndex: ++zIndexCounter.current
      }
    });
  };

  const handleDesktopIconClick = (appId) => {
    openWindow(appId);
    setSelectedIcon(null); // Clear selection when opening
  };

  const handleDesktopIconSelect = (e, appId) => {
    e.stopPropagation();
    setSelectedIcon(appId);
  };

  const handleShutdown = () => {
    setShowStartMenu(false);
    setIsShuttingDown(true);

    const shutdownMessages = [
      { text: 'Shutting down Portfolio OS...', delay: 0 },
      { text: 'Closing all windows...', delay: 400 },
      { text: '[OK] Windows closed', delay: 600 },
      { text: 'Saving state...', delay: 800 },
      { text: '[OK] State saved', delay: 1000 },
      { text: 'Stopping services...', delay: 1200 },
      { text: '[OK] All services stopped', delay: 1400 },
      { text: '', delay: 1600 },
      { text: 'It is now safe to leave', delay: 1800, special: true }
    ];

    shutdownMessages.forEach((msg) => {
      setTimeout(() => {
        setShutdownLines((prev) => [...prev, msg]);
      }, msg.delay);
    });

    // Fade out and navigate
    setTimeout(() => {
      if (shutdownRef.current) {
        gsap.to(shutdownRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.in',
          onComplete: () => {
            navigate('/');
          }
        });
      }
    }, 2500);
  };

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showStartMenu && !e.target.closest('.start-menu') && !e.target.closest('.start-btn')) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStartMenu]);

  // Clear icon selection when clicking on desktop
  useEffect(() => {
    const handleDesktopClick = (e) => {
      if (desktopRef.current && e.target === desktopRef.current) {
        setSelectedIcon(null);
      }
    };

    document.addEventListener('mousedown', handleDesktopClick);
    return () => document.removeEventListener('mousedown', handleDesktopClick);
  }, []);

  // Shutdown screen
  if (isShuttingDown) {
    return (
      <div ref={shutdownRef} className={`fixed inset-0 bg-black z-[200] flex flex-col font-['JetBrains_Mono'] overflow-hidden ${isMobile ? 'p-5' : 'p-10'}`}>
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
            backgroundSize: '100% 4px'
          }}
        />

        {/* Shutdown messages */}
        <div className="relative z-10">
          {shutdownLines.map((line, i) => (
            <div
              key={i}
              className={`mb-1 ${
                line.special
                  ? `text-[#0affc2] font-bold mt-4 ${isMobile ? 'text-base' : 'text-xl'}`
                  : line.text.includes('[OK]')
                  ? 'text-[#0affc2]'
                  : 'text-gray-400'
              } ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ opacity: 0.9 }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Boot screen
  if (!bootComplete) {
    return (
      <div className={`fixed inset-0 bg-black z-[200] flex flex-col font-['JetBrains_Mono'] overflow-hidden ${isMobile ? 'p-5' : 'p-10'}`}>
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
            backgroundSize: '100% 4px'
          }}
        />

        {/* Boot messages */}
        <div className="relative z-10">
          {bootLines.map((line, i) => (
            <div
              key={i}
              className={`mb-1 ${
                line.special
                  ? `text-[#0affc2] font-bold mt-4 ${isMobile ? 'text-base' : 'text-xl'}`
                  : line.text.includes('[OK]')
                  ? 'text-[#0affc2]'
                  : 'text-gray-400'
              } ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ opacity: 0.9 }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0f0f12] overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1f2430 0%, #0a0a0a 100%)'
        }}
      />

      {/* CRT scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[9999] opacity-40"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Desktop Area */}
      <div
        ref={desktopRef}
        className={`absolute top-0 left-0 right-0 z-10 ${isMobile ? 'bottom-16 p-3' : 'bottom-12 p-5'}`}
      >
        {/* Desktop Icons - Responsive Grid */}
        <div className={`grid gap-3 ${
          isMobile ? 'grid-cols-3' : isTablet ? 'grid-cols-4' : 'flex flex-wrap content-start gap-5'
        }`}>
          {Object.keys(apps).map((appId) => {
            const app = apps[appId];
            const isSelected = selectedIcon === appId;
            return (
              <div
                key={appId}
                className={`flex flex-col items-center cursor-pointer p-2 rounded transition-all ${
                  isMobile ? 'w-full' : 'w-20'
                } ${
                  isSelected
                    ? 'bg-[#0affc2]/20 border border-[#0affc2]/40'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                onDoubleClick={() => handleDesktopIconClick(appId)}
                onClick={(e) => {
                  if (isMobile) {
                    handleDesktopIconClick(appId);
                  } else {
                    handleDesktopIconSelect(e, appId);
                  }
                }}
              >
                <div className={`mb-2 flex items-center justify-center bg-gradient-to-br from-[#2a303c] to-[#161b22] rounded-xl border shadow-lg text-[#0affc2] ${
                  isMobile ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl'
                } ${
                  isSelected ? 'border-[#0affc2]/60' : 'border-white/8'
                }`}>
                  {app.icon}
                </div>
                <div className={`text-white text-center ${isMobile ? 'text-xs' : 'text-xs'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  {app.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Windows */}
      {Object.keys(windows).map((appId) => {
        const win = windows[appId];
        const Component = win.component;
        const isMinimized = minimizedWindows.has(appId);

        if (isMinimized) return null;

        return (
          <Window
            key={appId}
            id={appId}
            title={win.title}
            width={win.width}
            height={win.height}
            x={win.x}
            y={win.y}
            isActive={activeWindow === appId}
            onFocus={() => focusWindow(appId)}
            onClose={() => closeWindow(appId)}
            onMinimize={() => minimizeWindow(appId)}
            zIndex={win.zIndex}
          >
            <Component onOpenWindow={openWindow} />
          </Window>
        );
      })}

      {/* Taskbar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-[#0f0f14]/85 backdrop-blur-xl border-t border-white/8 flex items-center justify-between z-[9000] ${
        isMobile ? 'h-16 px-2' : 'h-12 px-4'
      }`}>
        {/* Start Button */}
        <div className="relative">
          <div
            className={`start-btn flex items-center rounded-md cursor-pointer transition-all ${
              showStartMenu ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'
            } ${isMobile ? 'gap-1 px-2 py-2' : 'gap-2 px-3 py-1.5'}`}
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            <div className={`bg-[#0affc2] rounded-sm ${isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
            {!isMobile && <span className="text-[#e0e0e0] font-semibold text-xs font-['Inter']">ASoft</span>}
          </div>

          {/* Start Menu */}
          {showStartMenu && (
            <div className={`start-menu absolute bottom-full left-0 mb-2 bg-[#1a1a1f]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden ${
              isMobile ? 'w-72' : 'w-64'
            }`}>
              {/* User Info */}
              <div className={`border-b border-white/10 bg-white/5 ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className={`font-semibold text-white mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Acker Saldaña</div>
                <div className="text-xs text-gray-400">Full Stack Developer</div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {Object.keys(apps).map((appId) => {
                  const app = apps[appId];
                  return (
                    <button
                      key={appId}
                      onClick={() => {
                        openWindow(appId);
                        setShowStartMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-all text-left"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#2a303c] to-[#161b22] rounded-lg border border-white/8">
                        <span className="text-sm">{app.icon}</span>
                      </div>
                      <span className="text-sm text-gray-300">{app.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="border-t border-white/10 my-2" />

              {/* System Options */}
              <div className="p-2">
                <button
                  onClick={handleShutdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/20 hover:text-red-400 transition-all text-left text-gray-300"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-sm">Shutdown</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className={`flex gap-1 flex-1 overflow-x-auto scrollbar-hide ${isMobile ? 'ml-2' : 'ml-4'}`}>
          {Object.keys(windows).map((appId) => {
            const win = windows[appId];
            const isMinimized = minimizedWindows.has(appId);

            return (
              <button
                key={appId}
                onClick={() => (isMinimized ? openWindow(appId) : focusWindow(appId))}
                className={`rounded transition-all border-b-2 flex-shrink-0 ${
                  isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-4 py-2 text-xs'
                } ${
                  activeWindow === appId && !isMinimized
                    ? 'bg-white/8 text-white border-[#0affc2]'
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                {isMobile ? win.icon : win.title}
              </button>
            );
          })}
        </div>

        {/* Clock */}
        <div className={`text-gray-500 font-['JetBrains_Mono'] flex-shrink-0 ${isMobile ? 'text-[10px] ml-1' : 'text-xs'}`}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default DesktopOS;
