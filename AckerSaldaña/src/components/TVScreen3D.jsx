import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVScreen3D.css';

const TVScreen3D = () => {
  const navigate = useNavigate();
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(0);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLines, setTerminalLines] = useState([
    'PORTFOLIO OS v2.0',
    'ACKER SALDAÑA',
    '----------------',
    "TYPE 'HELP'"
  ]);

  const monitorRef = useRef(null);
  const screenContentRef = useRef(null);
  const noiseCanvasRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const noiseReqRef = useRef(null);
  const audioContextRef = useRef(null);
  const terminalOutputRef = useRef(null);
  const inputLineRef = useRef(null);

  // Mouse tracking for 3D rotation
  useEffect(() => {
    let mouseX = 0, mouseY = 0, currentRotateX = 0, currentRotateY = 0;
    const maxRotX = 15, maxRotY = 20, lerpSpeed = 0.05;

    const handleMouseMove = (e) => {
      const xNorm = (e.clientX / window.innerWidth) * 2 - 1;
      const yNorm = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX = xNorm * maxRotY;
      mouseY = -yNorm * maxRotX;
    };

    const animateScene = () => {
      currentRotateY += (mouseX - currentRotateY) * lerpSpeed;
      currentRotateX += (mouseY - currentRotateX) * lerpSpeed;
      if (monitorRef.current) {
        monitorRef.current.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
      }
      requestAnimationFrame(animateScene);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateScene();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Audio functions
  const initAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const playTone = (freq, type = 'square', len = 0.1) => {
    if (!audioContextRef.current || !isPowerOn) return;
    try {
      const osc = audioContextRef.current.createOscillator();
      const g = audioContextRef.current.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(g);
      g.connect(audioContextRef.current.destination);
      g.gain.value = 0.05;
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + len);
      osc.stop(audioContextRef.current.currentTime + len);
    } catch (e) {}
  };

  // Power toggle
  const togglePower = () => {
    const newPowerState = !isPowerOn;
    setIsPowerOn(newPowerState);

    if (newPowerState) {
      if (screenContentRef.current) {
        screenContentRef.current.classList.remove('off');
        screenContentRef.current.classList.add('on');
      }
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      playTone(600, 'sine', 0.5);
      setTimeout(() => {
        if (newPowerState) setCurrentChannel(0); // Channel 0 is now terminal
      }, 1500);
    } else {
      if (screenContentRef.current) {
        screenContentRef.current.classList.remove('on');
        screenContentRef.current.classList.add('off');
      }
      stopNoise();
    }
  };

  // Channel management - only 2 channels now (0: terminal, 1: static)
  const changeChannel = (dir, e) => {
    if (e) e.preventDefault();
    if (!isPowerOn) return;
    playTone(150);
    stopNoise();
    setCurrentChannel((prev) => (prev + dir + 2) % 2);
  };

  // Static noise effect
  const startNoise = () => {
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 240;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buf = new Uint32Array(idata.data.buffer);
      for (let i = 0; i < buf.length; i++) {
        buf[i] = Math.random() < 0.1 ? 0xffffffff : 0xff000000;
      }
      ctx.putImageData(idata, 0, 0);
      noiseReqRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const stopNoise = () => {
    if (noiseReqRef.current) {
      cancelAnimationFrame(noiseReqRef.current);
    }
  };

  // Terminal
  const focusTerminal = (e) => {
    if (e) e.preventDefault();
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
  };

  const processCommand = (cmd) => {
    const c = cmd.trim().toUpperCase();
    const newLines = [...terminalLines, `> ${cmd}`];

    if (c === 'HELP') {
      newLines.push('COMMANDS: HELP, CLEAR, PROJECTS, ABOUT');
    } else if (c === 'CLEAR') {
      setTerminalLines([]);
      return;
    } else if (c === 'PROJECTS') {
      newLines.push('LOADING PROJECTS...');
      setTerminalLines(newLines);
      setTimeout(() => navigate('/projects'), 1000);
      return;
    } else if (c === 'ABOUT') {
      newLines.push('Software Engineer & Full Stack Developer');
      newLines.push('Passionate about clean code and innovation');
    } else {
      newLines.push('UNKNOWN COMMAND');
    }

    setTerminalLines(newLines.slice(-20)); // Increased from 12 to 20 lines
  };

  // Auto-scroll terminal to keep input line visible
  useEffect(() => {
    if (terminalOutputRef.current && currentChannel === 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (terminalOutputRef.current) {
          // Scroll the terminal output container, not the page
          terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
      });
    }
  }, [terminalLines, terminalInput, currentChannel]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPowerOn || currentChannel !== 0) return; // Terminal is now channel 0

      // Prevent default for terminal-related keys to avoid scrolling
      if (['Enter', 'Backspace', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.key) || e.key.length === 1) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        playTone(400);
        processCommand(terminalInput);
        setTerminalInput('');
      } else if (e.key === 'Backspace') {
        playTone(200);
        setTerminalInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1 && e.key !== ' ') {
        playTone(800, 'square', 0.05);
        setTerminalInput((prev) => prev + e.key.toUpperCase());
      } else if (e.key === ' ') {
        playTone(800, 'square', 0.05);
        setTerminalInput((prev) => prev + ' ');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPowerOn, currentChannel, terminalInput, terminalLines]);

  // Channel effects
  useEffect(() => {
    if (!isPowerOn) return;

    if (currentChannel === 1) {
      startNoise(); // Static is now channel 1
    } else {
      stopNoise();
    }

    if (currentChannel === 0) {
      focusTerminal(); // Terminal is now channel 0
    }

    return () => stopNoise();
  }, [currentChannel, isPowerOn]);

  return (
    <div className="tv-scene">
      <input
        ref={hiddenInputRef}
        type="text"
        className="hidden-input"
        autoComplete="off"
      />

      <div ref={monitorRef} className="monitor-assembly">
        {/* FRONT FACE */}
        <div className="face face-front">
          <div className="screen-housing">
            <div className="glass-surface">
              <div className="crt-overlay" />
              <div className="crt-glare" />

              <div ref={screenContentRef} className="content-layer">
                {/* Channel 0: Terminal (now first) */}
                <div
                  className={`channel-view ${currentChannel === 0 ? 'active' : ''}`}
                  style={{ display: currentChannel === 0 ? 'block' : 'none' }}
                >
                  <div className="terminal-container" onClick={focusTerminal}>
                    <div className="terminal-output" ref={terminalOutputRef}>
                      {terminalLines.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      <div ref={inputLineRef}>
                        {'> '}
                        {terminalInput}
                        <span className="cursor" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel 1: Static (now second) */}
                <div
                  className={`channel-view ${currentChannel === 1 ? 'active' : ''}`}
                  style={{ display: currentChannel === 1 ? 'block' : 'none' }}
                >
                  <canvas ref={noiseCanvasRef} className="noise-canvas" />
                  <div className="static-label">
                    <span>CH 01 - STATIC</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="controls-row">
            <div className="controls-left">
              <div className={`led ${isPowerOn ? 'on' : ''}`} />
              <button className="power-btn cursor-target" onClick={togglePower} title="Power" />
            </div>
            <div className="brand-text">RETRO TERMINAL</div>
            <div className="controls-right">
              <button
                onClick={(e) => changeChannel(-1, e)}
                className="ch-btn cursor-target"
              >
                PREV
              </button>
              <button
                onClick={(e) => changeChannel(1, e)}
                className="ch-btn cursor-target"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="face face-back">
          <div className="back-panel">
            <div className="back-text">
              MODEL: NO. 334-A<br />
              SERIAL: 893-XK-22<br />
              INPUT: 120V ~ 60Hz
            </div>
            <div className="back-ports">
              <div className="port" />
              <div className="port" />
            </div>
          </div>
        </div>

        {/* SIDE FACES */}
        <div className="face face-right" />
        <div className="face face-left" />
        <div className="face face-top" />
        <div className="face face-bottom" />
      </div>
    </div>
  );
};

export default TVScreen3D;
