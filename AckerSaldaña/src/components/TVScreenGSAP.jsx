import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import PersistentTerminal from './PersistentTerminal';
import { customEases, durations } from '../utils/gsapConfig';
import './TVScreen.css';

const TVScreenGSAP = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);
  const [volume, setVolume] = useState(5);
  const [channel, setChannel] = useState(1);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const buttonContentRef = useRef(null);
  const buttonRef = useRef(null);
  const knob1Ref = useRef(null);
  const knob2Ref = useRef(null);
  const screenRef = useRef(null);
  const scanlineRef = useRef(null);
  const staticRef = useRef(null);

  const handleViewProjects = () => {
    // Channel change effect before navigation
    gsap.to(screenRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        navigate('/projects');
      },
    });
  };

  const handleKnob1Interact = (direction) => {
    const newVolume = Math.max(0, Math.min(10, volume + direction));
    setVolume(newVolume);

    // Rotate knob
    gsap.to(knob1Ref.current, {
      rotation: `+=${direction * 36}`,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Visual feedback
    gsap.fromTo(
      knob1Ref.current,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      }
    );
  };

  const handleKnob2Interact = (direction) => {
    const newChannel = Math.max(1, Math.min(99, channel + direction));
    setChannel(newChannel);

    // Rotate knob
    gsap.to(knob2Ref.current, {
      rotation: `+=${direction * 36}`,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Channel static effect
    gsap.fromTo(
      staticRef.current,
      { opacity: 0.8 },
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      }
    );

    // Visual feedback
    gsap.fromTo(
      knob2Ref.current,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      }
    );
  };

  const togglePower = () => {
    if (isPowerOn) {
      // Turn off animation
      gsap.to(screenRef.current, {
        opacity: 0,
        scaleY: 0.01,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setIsPowerOn(false),
      });
    } else {
      // Turn on animation - set state first
      setIsPowerOn(true);
      // Small delay to ensure state is updated
      setTimeout(() => {
        gsap.fromTo(
          screenRef.current,
          { opacity: 0, scaleY: 0.01 },
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.6,
            ease: 'power2.out',
          }
        );
      }, 10);
    }
  };

  useEffect(() => {
    if (!buttonContentRef.current) return;

    // Fade in button content
    gsap.fromTo(
      buttonContentRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: customEases.smooth,
      }
    );

    // Scanline animation
    if (scanlineRef.current) {
      gsap.to(scanlineRef.current, {
        y: '100%',
        duration: 2,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

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

        {/* Brand badge with enhanced styling */}
        <div className="tv-brand" style={{
          textShadow: '0 0 10px rgba(74, 239, 255, 0.5)',
          letterSpacing: '3px',
        }}>
          RETRO TERMINAL
        </div>

        {/* Status indicators */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '20px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isPowerOn ? '#4aff4a' : '#333',
            boxShadow: isPowerOn ? '0 0 10px #4aff4a' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{
            color: '#666',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            textTransform: 'uppercase',
          }}>
            {isPowerOn ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Control panel with interactive elements */}
        <div className="tv-controls">
          {/* Volume control */}
          <div style={{ textAlign: 'center' }}>
            <div
              ref={knob1Ref}
              className="tv-knob cursor-target"
              onClick={() => handleKnob1Interact(1)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleKnob1Interact(-1);
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
              title="Click to increase, Right-click to decrease volume"
            >
              <div className="knob-indicator"></div>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '9px',
              color: '#666',
              fontFamily: 'JetBrains Mono, monospace',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}>
              <span>VOL</span>
              <div style={{
                display: 'flex',
                gap: '2px',
                marginTop: '4px',
              }}>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3px',
                      height: i < volume ? '8px' : '4px',
                      backgroundColor: i < volume ? '#4aefff' : '#333',
                      boxShadow: i < volume ? '0 0 5px #4aefff' : 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Channel control */}
          <div style={{ textAlign: 'center' }}>
            <div
              ref={knob2Ref}
              className="tv-knob cursor-target"
              onClick={() => handleKnob2Interact(1)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleKnob2Interact(-1);
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
              title="Click to increase, Right-click to decrease channel"
            >
              <div className="knob-indicator"></div>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '9px',
              color: '#666',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <div>CH</div>
              <div style={{
                marginTop: '4px',
                color: '#4aefff',
                fontSize: '11px',
                fontWeight: 'bold',
                textShadow: '0 0 5px #4aefff',
              }}>
                {channel.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Power button */}
          <div
            className="cursor-target"
            onClick={togglePower}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1a1a1a',
              border: '2px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginLeft: '10px',
            }}
            title="Power On/Off"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.1,
                borderColor: isPowerOn ? '#ff4444' : '#4aff4a',
                boxShadow: `0 0 15px ${isPowerOn ? '#ff4444' : '#4aff4a'}`,
                duration: 0.2,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                borderColor: '#333',
                boxShadow: 'none',
                duration: 0.2,
              });
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: isPowerOn ? '#4aff4a' : '#333',
              boxShadow: isPowerOn ? '0 0 8px #4aff4a' : 'none',
              transition: 'all 0.3s',
            }} />
          </div>
        </div>
      </div>

      {/* TV Screen */}
      <div className="tv-screen" ref={screenRef}>
        {/* Static/Noise effect (visible during channel changes) */}
        <div
          ref={staticRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            zIndex: 50,
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px)',
            animation: 'staticNoise 0.1s infinite',
          }}
        />

        {/* Animated scanline */}
        <div
          ref={scanlineRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(74, 239, 255, 0.1) 50%, transparent 100%)',
            zIndex: 20,
            pointerEvents: 'none',
            opacity: isPowerOn ? 0.3 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Terminal Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            opacity: isPowerOn ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        >
          <PersistentTerminal
            terminalKey="tv-terminal"
            scale={1}
            containerStyle={{
              width: '100%',
              height: '100%',
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isPowerOn ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.95)',
            zIndex: 2,
            transition: 'background 0.5s',
          }}
        />

        {/* Button Content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            opacity: isPowerOn ? 1 : 0,
            transition: 'opacity 0.5s',
            pointerEvents: isPowerOn ? 'auto' : 'none',
          }}
        >
          {showButton && isPowerOn && (
            <div
              ref={buttonContentRef}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(0, 0, 0, 0.85)',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Decorative corner elements */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '40px',
                height: '40px',
                borderTop: '2px solid #4aefff',
                borderLeft: '2px solid #4aefff',
                opacity: 0.3,
              }} />
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderTop: '2px solid #4aefff',
                borderRight: '2px solid #4aefff',
                opacity: 0.3,
              }} />
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                width: '40px',
                height: '40px',
                borderBottom: '2px solid #4aefff',
                borderLeft: '2px solid #4aefff',
                opacity: 0.3,
              }} />
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderBottom: '2px solid #4aefff',
                borderRight: '2px solid #4aefff',
                opacity: 0.3,
              }} />

              <div style={{ marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                <p
                  style={{
                    color: '#4aff4a',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '20px',
                    marginBottom: '1.5rem',
                    textShadow: '0 0 15px rgba(74, 255, 74, 0.6)',
                    letterSpacing: '1px',
                  }}
                >
                  {'>'} TERMINAL_ACTIVE
                </p>
                <p
                  style={{
                    color: '#4aefff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    opacity: 0.9,
                    textShadow: '0 0 10px rgba(74, 239, 255, 0.4)',
                    marginBottom: '0.5rem',
                  }}
                >
                  PORTFOLIO DATABASE v2.0
                </p>
                <p
                  style={{
                    color: '#7b61ff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '14px',
                    opacity: 0.7,
                    textShadow: '0 0 8px rgba(123, 97, 255, 0.3)',
                  }}
                >
                  5 projects · Interactive terminal · Full access granted
                </p>
              </div>

              <button
                ref={buttonRef}
                className="cursor-target"
                onClick={handleViewProjects}
                onMouseEnter={(e) => {
                  gsap.to(buttonRef.current, {
                    scale: 1.08,
                    background: 'rgba(74, 239, 255, 0.4)',
                    boxShadow: '0 0 40px rgba(74, 239, 255, 0.7), inset 0 0 20px rgba(74, 239, 255, 0.2)',
                    duration: 0.3,
                    ease: customEases.smooth,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(buttonRef.current, {
                    scale: 1,
                    background: 'rgba(74, 239, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(74, 239, 255, 0.5)',
                    duration: 0.3,
                    ease: customEases.smooth,
                  });
                }}
                style={{
                  padding: '1.2rem 3.5rem',
                  background: 'rgba(74, 239, 255, 0.15)',
                  border: '2px solid #4aefff',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '3px',
                  cursor: 'pointer',
                  textShadow: '0 0 20px rgba(74, 239, 255, 0.8)',
                  boxShadow: '0 0 30px rgba(74, 239, 255, 0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>ENTER TERMINAL</span>
                {/* Shimmer effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                }} />
              </button>

              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p
                  style={{
                    color: '#888888',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    opacity: 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#4aff4a',
                    boxShadow: '0 0 8px #4aff4a',
                    animation: 'pulse 2s infinite',
                  }} />
                  SYSTEM ONLINE
                </p>
                <p
                  style={{
                    color: '#666',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    opacity: 0.5,
                  }}
                >
                  Hint: Try the interactive controls above
                </p>
              </div>
            </div>
          )}
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

export default TVScreenGSAP;
