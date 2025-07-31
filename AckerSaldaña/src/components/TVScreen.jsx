import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersistentTerminal from './PersistentTerminal';
import './TVScreen.css';

const TVScreen = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);

  const handleViewProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="tv-container">
      {/* TV Frame */}
      <div className="tv-frame">
        {/* Top speaker grille */}
        <div className="tv-speaker-grille">
          <div className="grille-line"></div>
          <div className="grille-line"></div>
          <div className="grille-line"></div>
        </div>

        {/* Brand badge */}
        <div className="tv-brand">SPACE X</div>

        {/* Control panel */}
        <div className="tv-controls">
          <div className="tv-knob">
            <div className="knob-indicator"></div>
          </div>
          <div className="tv-knob">
            <div className="knob-indicator"></div>
          </div>
        </div>
      </div>

      {/* TV Screen */}
      <div className="tv-screen">
        {/* Terminal Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}>
          <PersistentTerminal
            terminalKey="tv-terminal"
            scale={1}
            containerStyle={{ 
              width: '100%', 
              height: '100%'
            }}
            tint="#4aefff"
            scanlineIntensity={0.15}
            glitchAmount={0.5}
            flickerAmount={0.3}
            curvature={0.15}
            chromaticAberration={0.2}
            mouseReact={false}
            brightness={0.6}
            noiseAmp={0.3}
            digitSize={2.2}
            pageLoadAnimation={false}
          />
        </div>

        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 2
        }} />

        {/* Button Content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.95)',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ marginBottom: '3rem' }}>
                  <p style={{ 
                    color: '#4aff4a', 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    marginBottom: '1rem',
                    textShadow: '0 0 10px rgba(74, 255, 74, 0.5)'
                  }}>
                    {'>'} SYSTEM READY
                  </p>
                  <p style={{ 
                    color: '#4aefff', 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '16px',
                    opacity: 0.9,
                    textShadow: '0 0 10px rgba(74, 158, 255, 0.3)'
                  }}>
                    ACCESS PORTFOLIO DATABASE
                  </p>
                </div>
                
                <motion.button
                  onClick={handleViewProjects}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '1rem 3rem',
                    background: 'rgba(74, 158, 255, 0.2)',
                    border: '2px solid #4a9eff',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textShadow: '0 0 15px rgba(74, 158, 255, 0.8)',
                    boxShadow: '0 0 30px rgba(74, 158, 255, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(74, 158, 255, 0.5)';
                    e.target.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(74, 158, 255, 0.3)';
                    e.target.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.4)';
                  }}
                >
                  VIEW PROJECTS
                </motion.button>
                
                <p style={{ 
                  color: '#888888', 
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  marginTop: '2rem',
                  opacity: 0.7
                }}>
                  PRESS TO CONTINUE
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TV Stand */}
      <div className="tv-stand">
        <div className="stand-neck"></div>
        <div className="stand-base"></div>
      </div>
    </div>
  );
};

export default TVScreen;