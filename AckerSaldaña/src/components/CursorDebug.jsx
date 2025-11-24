import { useEffect, useState } from 'react';

/**
 * Diagnostic component for debugging cursor visibility issues
 * Displays cursor position, viewport scale, and cursor element status
 *
 * Usage: Add <CursorDebug /> temporarily to App.jsx to debug cursor issues
 * Remove before production
 */
const CursorDebug = () => {
  const [debug, setDebug] = useState({
    viewport: '',
    scale: '',
    cursorElement: null,
    mousePos: { x: 0, y: 0 },
    cursorVisible: false,
    cursorStyles: {}
  });

  useEffect(() => {
    const updateDebug = (e) => {
      const cursor = document.querySelector('.target-cursor-wrapper');
      const scale = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--viewport-scale') || 1
      );

      if (cursor) {
        const computed = getComputedStyle(cursor);
        const rect = cursor.getBoundingClientRect();

        setDebug({
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          scale: scale.toFixed(3),
          cursorElement: cursor ? 'Found' : 'Not found',
          mousePos: { x: e?.clientX || 0, y: e?.clientY || 0 },
          cursorVisible: rect.top >= 0 && rect.left >= 0,
          cursorStyles: {
            position: computed.position,
            zIndex: computed.zIndex,
            visibility: computed.visibility,
            opacity: computed.opacity,
            display: computed.display,
            transform: computed.transform
          }
        });
      }
    };

    document.addEventListener('mousemove', updateDebug);
    updateDebug(); // Initial check

    return () => document.removeEventListener('mousemove', updateDebug);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#0affc2',
        padding: '12px',
        borderRadius: '8px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        zIndex: 999999,
        pointerEvents: 'none',
        maxWidth: '300px',
        border: '1px solid #0affc2'
      }}
    >
      <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
        🔍 Cursor Debug
      </div>
      <div style={{ lineHeight: '1.5' }}>
        <div><strong>Viewport:</strong> {debug.viewport}</div>
        <div><strong>Scale:</strong> {debug.scale}</div>
        <div><strong>Mouse:</strong> {debug.mousePos.x}, {debug.mousePos.y}</div>
        <div><strong>Cursor Element:</strong> {debug.cursorElement}</div>
        <div><strong>Visible:</strong> {debug.cursorVisible ? '✅' : '❌'}</div>
        <div style={{ marginTop: '8px', borderTop: '1px solid #0affc2', paddingTop: '8px' }}>
          <div><strong>position:</strong> {debug.cursorStyles.position}</div>
          <div><strong>z-index:</strong> {debug.cursorStyles.zIndex}</div>
          <div><strong>visibility:</strong> {debug.cursorStyles.visibility}</div>
          <div><strong>opacity:</strong> {debug.cursorStyles.opacity}</div>
          <div><strong>display:</strong> {debug.cursorStyles.display}</div>
        </div>
        {window.innerWidth === 1920 && window.innerHeight === 1080 && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            background: '#ff5722',
            color: '#fff',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            ⚠️ 1920x1080 DETECTED
          </div>
        )}
      </div>
    </div>
  );
};

export default CursorDebug;
