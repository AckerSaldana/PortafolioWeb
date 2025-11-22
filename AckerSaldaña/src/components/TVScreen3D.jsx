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
  const pongCanvasRef = useRef(null);
  const pongReqRef = useRef(null);
  const pongStateRef = useRef({
    ball: { x: 200, y: 150, dx: 1.2, dy: 1.2, size: 6 },
    p1: { y: 130, height: 40, dir: 0, score: 0 },
    p2: { y: 130, height: 40, score: 0 }
  });
  const matrixCanvasRef = useRef(null);
  const matrixReqRef = useRef(null);
  const matrixDropsRef = useRef(null);
  const watchIntervalRef = useRef(null);

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
        if (newPowerState) setCurrentChannel(0); // Channel 0 is terminal
      }, 1500);
    } else {
      if (screenContentRef.current) {
        screenContentRef.current.classList.remove('on');
        screenContentRef.current.classList.add('off');
      }
      stopAllChannels();
    }
  };

  // Channel management - 6 channels (0: terminal, 1: static, 2: pong, 3: color bars, 4: matrix, 5: watch)
  const changeChannel = (dir, e) => {
    if (e) e.preventDefault();
    if (!isPowerOn) return;
    playTone(150);
    stopAllChannels();
    setCurrentChannel((prev) => (prev + dir + 6) % 6);
  };

  const stopAllChannels = () => {
    stopNoise();
    stopPong();
    stopMatrix();
    stopWatch();
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

  // Pong Game
  const startPong = () => {
    const canvas = pongCanvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 300;

    // Reset state
    pongStateRef.current = {
      ball: { x: 200, y: 150, dx: 1.2, dy: 1.2, size: 6 },
      p1: { y: 130, height: 40, dir: 0, score: 0 },
      p2: { y: 130, height: 40, score: 0 }
    };

    const ctx = canvas.getContext('2d');

    const loop = () => {
      updatePong(canvas, ctx);
      drawPong(canvas, ctx);
      pongReqRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const updatePong = (canvas, ctx) => {
    const s = pongStateRef.current;
    const w = canvas.width;
    const h = canvas.height;

    // Player 1 movement
    s.p1.y = Math.max(0, Math.min(h - s.p1.height, s.p1.y + s.p1.dir * 4));

    // AI Player 2 movement
    const target = s.ball.y - s.p2.height / 2;
    if (target > s.p2.y + 5) s.p2.y += 2.5;
    else if (target < s.p2.y - 5) s.p2.y -= 2.5;
    s.p2.y = Math.max(0, Math.min(h - s.p2.height, s.p2.y));

    // Ball movement
    s.ball.x += s.ball.dx;
    s.ball.y += s.ball.dy;

    // Ball collision with top/bottom
    if (s.ball.y < 0 || s.ball.y > h) {
      s.ball.dy *= -1;
      playTone(200);
    }

    // Ball collision with paddles
    if (s.ball.x < 20 && s.ball.y > s.p1.y && s.ball.y < s.p1.y + s.p1.height) {
      s.ball.dx = Math.abs(s.ball.dx) + 0.1;
      playTone(400);
    }
    if (s.ball.x > w - 20 && s.ball.y > s.p2.y && s.ball.y < s.p2.y + s.p2.height) {
      s.ball.dx = -(Math.abs(s.ball.dx) + 0.1);
      playTone(400);
    }

    // Scoring
    if (s.ball.x < 0) {
      s.p2.score++;
      resetBall();
      playTone(100, 'sawtooth', 0.4);
    }
    if (s.ball.x > w) {
      s.p1.score++;
      resetBall();
      playTone(600, 'sawtooth', 0.2);
    }
  };

  const resetBall = () => {
    const s = pongStateRef.current;
    s.ball.x = 200;
    s.ball.y = 150;
    s.ball.dx = Math.random() > 0.5 ? 1.2 : -1.2;
    s.ball.dy = Math.random() > 0.5 ? 1.2 : -1.2;
  };

  const drawPong = (canvas, ctx) => {
    const s = pongStateRef.current;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = 'white';
    ctx.fillRect(s.ball.x, s.ball.y, s.ball.size, s.ball.size);

    // Draw paddles
    ctx.fillRect(10, s.p1.y, 10, s.p1.height);
    ctx.fillRect(380, s.p2.y, 10, s.p2.height);

    // Draw score
    ctx.font = '48px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'center';
    ctx.fillText(`${s.p1.score} - ${s.p2.score}`, canvas.width / 2, 60);
  };

  const stopPong = () => {
    if (pongReqRef.current) {
      cancelAnimationFrame(pongReqRef.current);
    }
    // Reset player direction
    if (pongStateRef.current) {
      pongStateRef.current.p1.dir = 0;
    }
  };

  // Matrix Rain
  const startMatrix = () => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth || 580;
    canvas.height = canvas.offsetHeight || 420;

    const ctx = canvas.getContext('2d');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    matrixDropsRef.current = new Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < matrixDropsRef.current.length; i++) {
        const text = String.fromCharCode(0x30a0 + Math.random() * 96);
        ctx.fillText(text, i * fontSize, matrixDropsRef.current[i] * fontSize);

        if (matrixDropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          matrixDropsRef.current[i] = 0;
        }
        matrixDropsRef.current[i]++;
      }

      matrixReqRef.current = requestAnimationFrame(drawMatrix);
    };
    drawMatrix();
  };

  const stopMatrix = () => {
    if (matrixReqRef.current) {
      cancelAnimationFrame(matrixReqRef.current);
    }
  };

  // Watch/Clock
  const startWatch = () => {
    const updateTime = () => {
      const now = new Date();

      // Time
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;

      // Date
      const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

      const month = months[now.getMonth()];
      const date = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      const day = days[now.getDay()];

      const dateStr = `${month} ${date}, ${year}`;

      // Update DOM
      const timeEl = document.getElementById('watch-time');
      const dateEl = document.getElementById('watch-date');
      const dayEl = document.getElementById('watch-day');

      if (timeEl) timeEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
      if (dayEl) dayEl.textContent = day;
    };

    updateTime(); // Initial update
    watchIntervalRef.current = setInterval(updateTime, 1000);
  };

  const stopWatch = () => {
    if (watchIntervalRef.current) {
      clearInterval(watchIntervalRef.current);
      watchIntervalRef.current = null;
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
      newLines.push('COMMANDS: HELP, CLEAR, PROJECTS, ABOUT, PONG');
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
    } else if (c === 'PONG') {
      newLines.push('LOADING GAME...');
      setTerminalLines(newLines);
      setTimeout(() => setCurrentChannel(2), 800);
      return;
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
      if (!isPowerOn) return;

      // Pong controls
      if (currentChannel === 2) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          pongStateRef.current.p1.dir = -1;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          pongStateRef.current.p1.dir = 1;
        }
        return;
      }

      // Terminal controls
      if (currentChannel !== 0) return;

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

    const handleKeyUp = (e) => {
      if (!isPowerOn || currentChannel !== 2) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        pongStateRef.current.p1.dir = 0;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPowerOn, currentChannel, terminalInput, terminalLines]);

  // Channel effects
  useEffect(() => {
    if (!isPowerOn) return;

    stopAllChannels();

    if (currentChannel === 0) {
      focusTerminal(); // Terminal
    } else if (currentChannel === 1) {
      startNoise(); // Static
    } else if (currentChannel === 2) {
      startPong(); // Pong
    } else if (currentChannel === 4) {
      startMatrix(); // Matrix (channel 3 is color bars, no start needed)
    } else if (currentChannel === 5) {
      startWatch(); // Watch
    }

    return () => stopAllChannels();
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

                {/* Channel 2: Pong */}
                <div
                  className={`channel-view ${currentChannel === 2 ? 'active' : ''}`}
                  style={{ display: currentChannel === 2 ? 'block' : 'none' }}
                >
                  <div className="pong-container">
                    <canvas ref={pongCanvasRef} className="pong-canvas" />
                    <div className="pong-hint">USE ARROW KEYS</div>
                  </div>
                </div>

                {/* Channel 3: Color Bars */}
                <div
                  className={`channel-view ${currentChannel === 3 ? 'active' : ''}`}
                  style={{ display: currentChannel === 3 ? 'block' : 'none' }}
                >
                  <div className="color-bars">
                    <div className="cb-row-1">
                      <div className="cb-cell" style={{ background: '#c0c0c0' }} />
                      <div className="cb-cell" style={{ background: '#c0c000' }} />
                      <div className="cb-cell" style={{ background: '#00c0c0' }} />
                      <div className="cb-cell" style={{ background: '#00c000' }} />
                      <div className="cb-cell" style={{ background: '#c000c0' }} />
                      <div className="cb-cell" style={{ background: '#c00000' }} />
                      <div className="cb-cell" style={{ background: '#0000c0' }} />
                    </div>
                    <div className="cb-row-2">
                      <div className="cb-cell" style={{ background: '#0000c0' }} />
                      <div className="cb-cell" style={{ background: '#131313' }} />
                      <div className="cb-cell" style={{ background: '#c000c0' }} />
                      <div className="cb-cell" style={{ background: '#131313' }} />
                      <div className="cb-cell" style={{ background: '#00c0c0' }} />
                      <div className="cb-cell" style={{ background: '#131313' }} />
                      <div className="cb-cell" style={{ background: '#c0c0c0' }} />
                    </div>
                    <div className="cb-row-3">
                      <div className="cb-cell" style={{ background: '#00214c', flex: '1.25' }} />
                      <div className="cb-cell" style={{ background: '#ffffff', flex: '1.25' }} />
                      <div className="cb-cell" style={{ background: '#320063', flex: '1.25' }} />
                      <div className="cb-cell" style={{ background: '#131313', flex: '3.25' }} />
                    </div>
                  </div>
                </div>

                {/* Channel 4: Matrix */}
                <div
                  className={`channel-view ${currentChannel === 4 ? 'active' : ''}`}
                  style={{ display: currentChannel === 4 ? 'block' : 'none' }}
                >
                  <canvas ref={matrixCanvasRef} className="matrix-canvas" />
                </div>

                {/* Channel 5: Watch */}
                <div
                  className={`channel-view ${currentChannel === 5 ? 'active' : ''}`}
                  style={{ display: currentChannel === 5 ? 'block' : 'none' }}
                >
                  <div className="watch-container">
                    <div className="watch-display">
                      <div className="watch-time" id="watch-time">00:00:00</div>
                      <div className="watch-date" id="watch-date">MONTH 00, 0000</div>
                      <div className="watch-day" id="watch-day">DAY</div>
                    </div>
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
            <div className="brand-text">SONY TRINITRON</div>
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
          <div className="back-housing">
            <div className="back-housing-inner">
              {/* Vents */}
              <div className="back-vents">
                <div className="vent-line" />
                <div className="vent-line" />
                <div className="vent-line" />
              </div>

              {/* Label */}
              <div className="back-label">
                <div className="back-text">
                  MODEL: PVM-20L5<br />
                  SERIAL: 893-XK-22<br />
                  100-240V ~ 50/60Hz<br />
                  MADE IN JAPAN
                </div>
              </div>

              {/* Ports */}
              <div className="back-ports">
                <div className="port" />
                <div className="port" />
              </div>
            </div>
          </div>
        </div>

        {/* SIDE FACES */}
        <div className="face face-right" />
        <div className="face face-left" />
        <div className="face face-top" />
        <div className="face face-bottom">
          <div className="foot" style={{ top: '20px', left: '20px' }} />
          <div className="foot" style={{ top: '20px', right: '20px' }} />
          <div className="foot" style={{ bottom: '20px', left: '20px' }} />
          <div className="foot" style={{ bottom: '20px', right: '20px' }} />
        </div>

        {/* SHADOWS & EFFECTS */}
        <div className="floor-shadow" />
        <div className={`glow-shadow ${isPowerOn ? 'on' : ''}`} />
      </div>
    </div>
  );
};

export default TVScreen3D;
