import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts in Desktop OS
 * @param {Object} handlers - Object containing shortcut handlers
 */
const useKeyboardShortcuts = ({
  onAltTab,
  onEscape,
  onAltF4,
  onMinimizeAll,
  onMinimizeActive,
  onMaximizeActive,
  onSnapLeft,
  onSnapRight,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Tab - Cycle windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        onAltTab?.();
        return;
      }

      // Escape - Close active window or menu
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }

      // Alt + F4 - Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        onAltF4?.();
        return;
      }

      // Cmd/Win + D - Minimize all (show desktop)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        onMinimizeAll?.();
        return;
      }

      // Cmd/Win + M - Minimize active window
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        onMinimizeActive?.();
        return;
      }

      // Cmd/Win + Up Arrow - Maximize active window
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') {
        e.preventDefault();
        onMaximizeActive?.();
        return;
      }

      // Cmd/Win + Left Arrow - Snap left
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        onSnapLeft?.();
        return;
      }

      // Cmd/Win + Right Arrow - Snap right
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        onSnapRight?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAltTab, onEscape, onAltF4, onMinimizeAll, onMinimizeActive, onMaximizeActive, onSnapLeft, onSnapRight]);
};

export default useKeyboardShortcuts;
