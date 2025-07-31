import { memo, forwardRef } from 'react';
import FaultyTerminal from './FaultyTerminal';

// Memoized terminal that only re-renders if key prop changes
const PersistentTerminal = memo(forwardRef(({ 
  terminalKey = "default",
  scale = 1.2,
  containerStyle = {},
  containerClassName = "",
  ...terminalProps 
}, ref) => {
  // Default terminal configuration
  const defaultConfig = {
    scale: 1.2,
    tint: "#4aefff",
    scanlineIntensity: 0.2,
    glitchAmount: 0.8,
    flickerAmount: 0.6,
    curvature: 0.1,
    chromaticAberration: 0.3,
    mouseReact: true,
    brightness: 0.8,
    noiseAmp: 0.5,
    digitSize: 1.8,
    pageLoadAnimation: true,
  };

  // Merge with provided props
  const finalConfig = { ...defaultConfig, ...terminalProps };

  return (
    <div 
      ref={ref}
      className={`persistent-terminal-wrapper ${containerClassName}`}
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.8s cubic-bezier(0.43, 0.13, 0.23, 0.96)',
        position: 'relative',
        ...containerStyle
      }}
    >
      <FaultyTerminal
        key={terminalKey}
        {...finalConfig}
      />
    </div>
  );
}), (prevProps, nextProps) => {
  // Only re-render if terminalKey changes
  return prevProps.terminalKey === nextProps.terminalKey;
});

PersistentTerminal.displayName = 'PersistentTerminal';

export default PersistentTerminal;