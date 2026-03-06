import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Window from './Window';
import TerminalWindow from './TerminalWindow';
import ProjectExplorer from './ProjectExplorer';
import PhotoGallery from './PhotoGallery';
import AboutMeWindow from './AboutMeWindow';
import ContactWindow from './ContactWindow';
import SkillsWindow from './SkillsWindow';
import OSCursor from './OSCursor';
import Taskbar from './os/Taskbar';
import StartMenu from './os/StartMenu';
import ContextMenu from './os/ContextMenu';
import NotificationCenter from './os/NotificationCenter';
import DesktopWidgets from './os/DesktopWidgets';
import SnapPreview from './os/SnapPreview';
import SettingsWindow from './SettingsWindow';
import { TerminalIcon, ProjectsIcon, AboutIcon, SkillsIcon, ContactIcon, GalleryIcon, SettingsIcon, RefreshIcon, PaletteIcon } from './os/AppIcons';
import useBreakpoint from '../hooks/useBreakpoint';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const DesktopOS = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet, windowSize } = useBreakpoint();

  // Boot state
  const [bootComplete, setBootComplete] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [desktopReady, setDesktopReady] = useState(false);

  // Window management
  const [windows, setWindows] = useState({});
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [maximizedWindows, setMaximizedWindows] = useState(new Set());
  const [snappedWindows, setSnappedWindows] = useState({});

  // UI state
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [dragSnapPreview] = useState(null);

  // Settings state
  const defaultWallpaper = 'radial-gradient(ellipse at 30% 20%, #1a3a5c 0%, #0d1b2a 35%, #0a0e17 60%, #060608 100%)';
  const [osSettings, setOsSettings] = useState({
    wallpaper: defaultWallpaper,
    accentColor: '#60cdff',
    showWidgets: true,
  });

  const zIndexCounter = useRef(100);
  const shutdownRef = useRef(null);
  const desktopRef = useRef(null);

  // Responsive initial positions
  const getResponsivePosition = (index) => {
    if (isMobile) return { x: 10, y: 10 };
    if (isTablet) return { x: 50 + (index * 30), y: 50 + (index * 30) };
    return { x: 100 + (index * 50), y: 80 + (index * 40) };
  };

  const apps = useMemo(() => ({
    terminal: {
      id: 'terminal', title: 'Terminal', icon: TerminalIcon,
      component: TerminalWindow,
      width: isMobile ? windowSize.width - 20 : 600,
      height: isMobile ? windowSize.height - 120 : 400,
      ...getResponsivePosition(0)
    },
    about: {
      id: 'about', title: 'About Me', icon: AboutIcon,
      component: AboutMeWindow,
      width: isMobile ? windowSize.width - 20 : 650,
      height: isMobile ? windowSize.height - 120 : 550,
      ...getResponsivePosition(1)
    },
    skills: {
      id: 'skills', title: 'Skills', icon: SkillsIcon,
      component: SkillsWindow,
      width: isMobile ? windowSize.width - 20 : 600,
      height: isMobile ? windowSize.height - 120 : 500,
      ...getResponsivePosition(2)
    },
    projects: {
      id: 'projects', title: 'Project Explorer', icon: ProjectsIcon,
      component: ProjectExplorer,
      width: isMobile ? windowSize.width - 20 : 700,
      height: isMobile ? windowSize.height - 120 : 500,
      ...getResponsivePosition(3)
    },
    contact: {
      id: 'contact', title: 'Contact', icon: ContactIcon,
      component: ContactWindow,
      width: isMobile ? windowSize.width - 20 : 550,
      height: isMobile ? windowSize.height - 120 : 600,
      ...getResponsivePosition(4)
    },
    gallery: {
      id: 'gallery', title: 'Photo Gallery', icon: GalleryIcon,
      component: PhotoGallery,
      width: isMobile ? windowSize.width - 20 : 800,
      height: isMobile ? windowSize.height - 120 : 600,
      ...getResponsivePosition(5)
    },
    settings: {
      id: 'settings', title: 'Settings', icon: SettingsIcon,
      component: SettingsWindow,
      width: isMobile ? windowSize.width - 20 : 750,
      height: isMobile ? windowSize.height - 120 : 500,
      ...getResponsivePosition(6)
    }
  }), [isMobile, isTablet, windowSize.width, windowSize.height]);

  // === Boot sequence ===
  useEffect(() => {
    const steps = [
      { progress: 15, delay: 200 },
      { progress: 35, delay: 500 },
      { progress: 60, delay: 900 },
      { progress: 85, delay: 1300 },
      { progress: 100, delay: 1700 },
    ];
    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setBootProgress(progress), delay);
    });
    setTimeout(() => {
      setBootComplete(true);
      setTimeout(() => openWindow('terminal'), 500);
    }, 2200);
  }, []);

  // Desktop entrance animation
  useEffect(() => {
    if (bootComplete) {
      const timer = setTimeout(() => setDesktopReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [bootComplete]);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // === Window management ===
  const openWindow = (appId) => {
    if (windows[appId] && !minimizedWindows.has(appId)) {
      focusWindow(appId);
      return;
    }
    if (minimizedWindows.has(appId)) {
      const newMinimized = new Set(minimizedWindows);
      newMinimized.delete(appId);
      setMinimizedWindows(newMinimized);
      focusWindow(appId);
      return;
    }
    const app = apps[appId];
    setWindows(prev => ({
      ...prev,
      [appId]: { ...app, zIndex: ++zIndexCounter.current }
    }));
    setActiveWindow(appId);
  };

  const closeWindow = (appId) => {
    const newWindows = { ...windows };
    delete newWindows[appId];
    setWindows(newWindows);
    if (activeWindow === appId) {
      const remaining = Object.keys(newWindows);
      setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
    const newMinimized = new Set(minimizedWindows);
    newMinimized.delete(appId);
    setMinimizedWindows(newMinimized);
    const newMaximized = new Set(maximizedWindows);
    newMaximized.delete(appId);
    setMaximizedWindows(newMaximized);
    const { [appId]: _, ...restSnapped } = snappedWindows;
    setSnappedWindows(restSnapped);
  };

  const minimizeWindow = (appId) => {
    setMinimizedWindows(new Set([...minimizedWindows, appId]));
    if (activeWindow === appId) {
      const visibleWindows = Object.keys(windows).filter(
        id => id !== appId && !minimizedWindows.has(id)
      );
      setActiveWindow(visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1] : null);
    }
  };

  const maximizeWindow = (appId) => {
    const { [appId]: _, ...restSnapped } = snappedWindows;
    setSnappedWindows(restSnapped);
    const newMaximized = new Set(maximizedWindows);
    if (newMaximized.has(appId)) {
      newMaximized.delete(appId);
    } else {
      newMaximized.add(appId);
    }
    setMaximizedWindows(newMaximized);
  };

  const snapWindow = (appId, zone) => {
    if (zone === 'maximize') {
      maximizeWindow(appId);
      return;
    }
    const newMaximized = new Set(maximizedWindows);
    newMaximized.delete(appId);
    setMaximizedWindows(newMaximized);
    setSnappedWindows(prev => ({ ...prev, [appId]: zone }));
  };

  const focusWindow = (appId) => {
    setActiveWindow(appId);
    setWindows(prev => ({
      ...prev,
      [appId]: { ...prev[appId], zIndex: ++zIndexCounter.current }
    }));
  };

  // === Desktop interactions ===
  const handleDesktopIconClick = (appId) => {
    openWindow(appId);
    setSelectedIcon(null);
  };

  const handleDesktopIconSelect = (e, appId) => {
    e.stopPropagation();
    setSelectedIcon(appId);
  };

  const handleDesktopRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const contextMenuItems = [
    { label: 'View', icon: null, onClick: () => {} },
    { label: 'Sort by', icon: null, onClick: () => {} },
    { label: 'Refresh', icon: RefreshIcon, onClick: () => window.location.reload(), shortcut: 'F5' },
    { separator: true },
    { label: 'New Terminal', icon: TerminalIcon, onClick: () => openWindow('terminal') },
    { label: 'Open Projects', icon: ProjectsIcon, onClick: () => openWindow('projects') },
    { separator: true },
    { label: 'Personalize', icon: PaletteIcon, onClick: () => openWindow('settings') },
  ];

  // === Keyboard shortcuts ===
  const handleAltTab = () => {
    const windowIds = Object.keys(windows).filter(id => !minimizedWindows.has(id));
    if (windowIds.length === 0) return;
    const currentIndex = windowIds.indexOf(activeWindow);
    const nextIndex = (currentIndex + 1) % windowIds.length;
    focusWindow(windowIds[nextIndex]);
  };

  const handleEscape = () => {
    if (showStartMenu) { setShowStartMenu(false); return; }
    if (showNotifications) { setShowNotifications(false); return; }
    if (contextMenu) { setContextMenu(null); return; }
    if (activeWindow) closeWindow(activeWindow);
  };

  const handleAltF4 = () => {
    if (activeWindow) closeWindow(activeWindow);
  };

  const handleMinimizeAll = () => {
    setMinimizedWindows(new Set(Object.keys(windows)));
    setActiveWindow(null);
  };

  const handleMinimizeActive = () => {
    if (activeWindow) minimizeWindow(activeWindow);
  };

  const handleMaximizeActive = () => {
    if (activeWindow) maximizeWindow(activeWindow);
  };

  const handleSnapLeft = () => {
    if (activeWindow) snapWindow(activeWindow, 'left-half');
  };

  const handleSnapRight = () => {
    if (activeWindow) snapWindow(activeWindow, 'right-half');
  };

  useKeyboardShortcuts({
    onAltTab: handleAltTab,
    onEscape: handleEscape,
    onAltF4: handleAltF4,
    onMinimizeAll: handleMinimizeAll,
    onMinimizeActive: handleMinimizeActive,
    onMaximizeActive: handleMaximizeActive,
    onSnapLeft: handleSnapLeft,
    onSnapRight: handleSnapRight,
  });

  // === Shutdown ===
  const handleShutdown = () => {
    setShowStartMenu(false);
    setIsShuttingDown(true);
    setTimeout(() => {
      if (shutdownRef.current) {
        gsap.to(shutdownRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.in',
          onComplete: () => navigate('/'),
        });
      }
    }, 2000);
  };

  // Clear icon selection on desktop click
  useEffect(() => {
    const handler = (e) => {
      if (desktopRef.current && e.target === desktopRef.current) {
        setSelectedIcon(null);
        setShowStartMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // === Shutdown screen ===
  if (isShuttingDown) {
    return (
      <div ref={shutdownRef} className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
        <div className="text-2xl font-light text-white mb-6" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
          Shutting down...
        </div>
        <div className="win11-spinner">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="win11-spinner-dot" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // === Boot screen ===
  if (!bootComplete) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
        <div className="mb-10">
          <div className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            Portfolio<span className="text-[#60cdff] font-semibold">OS</span>
          </div>
        </div>
        <div className="win11-spinner mb-8">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="win11-spinner-dot" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <div className="w-48 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${bootProgress}%`, background: '#60cdff' }}
          />
        </div>
      </div>
    );
  }

  // === Desktop ===
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#202020' }}>
      <OSCursor />

      {/* Wallpaper */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: osSettings.wallpaper,
          opacity: desktopReady ? 1 : 0,
        }}
      />

      {/* Desktop Area */}
      <div
        ref={desktopRef}
        className={`absolute top-0 left-0 right-0 z-10 ${isMobile ? 'bottom-14 p-3' : 'bottom-12 p-5'}`}
        onContextMenu={handleDesktopRightClick}
      >
        <div className={`grid gap-1 ${
          isMobile ? 'grid-cols-3' : isTablet ? 'grid-cols-4' : 'flex flex-wrap content-start gap-1'
        }`}>
          {Object.keys(apps).map((appId) => {
            const app = apps[appId];
            const IconComponent = app.icon;
            const isSelected = selectedIcon === appId;
            return (
              <div
                key={appId}
                className={`desktop-icon flex flex-col items-center cursor-pointer rounded-md transition-all duration-150 ${
                  isMobile ? 'w-full p-2' : 'w-[76px] p-2'
                } ${
                  isSelected
                    ? 'bg-white/10 border border-white/15'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                style={{ opacity: desktopReady ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}
                onDoubleClick={() => handleDesktopIconClick(appId)}
                onClick={(e) => {
                  if (isMobile) handleDesktopIconClick(appId);
                  else handleDesktopIconSelect(e, appId);
                }}
              >
                <div className={`mb-1.5 flex items-center justify-center ${
                  isMobile ? 'w-12 h-12' : 'w-10 h-10'
                }`}>
                  <IconComponent size={isMobile ? 36 : 30} />
                </div>
                <div
                  className={`text-center leading-tight ${isMobile ? 'text-[11px]' : 'text-[11px]'} ${
                    isSelected ? 'text-white' : 'text-white/80'
                  }`}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                >
                  {app.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widgets */}
      {osSettings.showWidgets && (
        <div className="transition-opacity duration-500 delay-500" style={{ opacity: desktopReady ? 1 : 0 }}>
          <DesktopWidgets />
        </div>
      )}

      {/* Snap Preview */}
      <SnapPreview snapZone={dragSnapPreview} taskbarHeight={isMobile ? 56 : 48} />

      {/* Windows */}
      {Object.keys(windows).map((appId) => {
        const win = windows[appId];
        const Component = win.component;
        const IconComponent = win.icon;
        const isMinimized = minimizedWindows.has(appId);
        const isMaximized = maximizedWindows.has(appId);
        const snapZone = snappedWindows[appId] || null;

        return (
          <Window
            key={appId}
            id={appId}
            title={win.title}
            icon={IconComponent}
            width={win.width}
            height={win.height}
            x={win.x}
            y={win.y}
            isActive={activeWindow === appId}
            isMinimized={isMinimized}
            isMaximized={isMaximized}
            snapZone={snapZone}
            onFocus={() => focusWindow(appId)}
            onClose={() => closeWindow(appId)}
            onMinimize={() => minimizeWindow(appId)}
            onMaximize={() => maximizeWindow(appId)}
            onSnap={(zone) => snapWindow(appId, zone)}
            zIndex={win.zIndex}
          >
            <Component
              onOpenWindow={openWindow}
              {...(appId === 'settings' ? { settings: osSettings, onSettingsChange: setOsSettings } : {})}
            />
          </Window>
        );
      })}

      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu
          apps={apps}
          onOpenApp={openWindow}
          onShutdown={handleShutdown}
          onClose={() => setShowStartMenu(false)}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        time={time}
      />

      {/* Taskbar */}
      <Taskbar
        apps={apps}
        windows={windows}
        activeWindow={activeWindow}
        minimizedWindows={minimizedWindows}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onToggleStartMenu={() => {
          setShowStartMenu(prev => !prev);
          setShowNotifications(false);
        }}
        showStartMenu={showStartMenu}
        time={time}
        onToggleNotifications={() => {
          setShowNotifications(prev => !prev);
          setShowStartMenu(false);
        }}
        onToggleSearch={() => setShowStartMenu(true)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default DesktopOS;
