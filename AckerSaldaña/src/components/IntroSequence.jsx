import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/intro-sequence.css';

/**
 * Intro Sequence - Mission Briefing
 * Space odyssey narrative introduction shown on first visit
 * Skippable for returning visitors
 */
const IntroSequence = ({ onComplete }) => {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const containerRef = useRef(null);
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);
  const skipButtonRef = useRef(null);

  // Check if user has seen intro before
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenIntro');
    if (seen === 'true') {
      setHasSeenIntro(true);
      onComplete();
    }
  }, [onComplete]);

  // Intro animation sequence
  useEffect(() => {
    if (hasSeenIntro || !containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.setItem('hasSeenIntro', 'true');
        onComplete();
      },
    });

    // Stage 1: Mission Classification (0-2s)
    tl.fromTo(
      stage1Ref.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    )
    .to(stage1Ref.current, {
      opacity: 1,
      duration: 1.2,
    })
    .to(stage1Ref.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.in',
    });

    // Stage 2: Mission Objectives (2-5s)
    tl.fromTo(
      stage2Ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.2'
    )
    .to(stage2Ref.current, {
      opacity: 1,
      duration: 2,
    })
    .to(stage2Ref.current, {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.in',
    });

    // Stage 3: Launch Countdown (5-8s)
    tl.fromTo(
      stage3Ref.current,
      { opacity: 0, scale: 1.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      '-=0.2'
    );

    // Countdown animation
    const countdownText = stage3Ref.current?.querySelector('.countdown');
    if (countdownText) {
      const numbers = [3, 2, 1];
      numbers.forEach((num, index) => {
        tl.to(countdownText, {
          innerHTML: num,
          duration: 0.1,
          ease: 'none',
        }, `+=${index === 0 ? 0 : 0.9}`)
        .to(countdownText, {
          scale: 1.3,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        }, '<');
      });

      // "LAUNCH" text
      tl.to(countdownText, {
        innerHTML: 'LAUNCH',
        scale: 1.5,
        duration: 0.3,
        ease: 'back.out(2)',
      }, '+=0.3');
    }

    // Final fade out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    }, '+=0.5');

    // Skip button fade in
    if (skipButtonRef.current) {
      gsap.fromTo(
        skipButtonRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: 1,
        }
      );
    }

    return () => tl.kill();
  }, [hasSeenIntro, onComplete]);

  const handleSkip = () => {
    setIsSkipping(true);

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        localStorage.setItem('hasSeenIntro', 'true');
        onComplete();
      },
    });
  };

  if (hasSeenIntro) return null;

  return (
    <div
      ref={containerRef}
      className="intro-sequence"
    >
      {/* Stage 1: Mission Classification */}
      <div ref={stage1Ref} className="intro-stage stage-1">
        <div className="classification-label">
          <div className="label-line"></div>
          <span>CLASSIFIED</span>
          <div className="label-line"></div>
        </div>
        <h1 className="mission-title">
          MISSION FILE: ACKER-001
        </h1>
        <p className="mission-subtitle">
          Space Odyssey Portfolio Expedition
        </p>
      </div>

      {/* Stage 2: Mission Objectives */}
      <div ref={stage2Ref} className="intro-stage stage-2">
        <h2 className="objectives-title">MISSION OBJECTIVES</h2>
        <div className="objectives-list">
          <div className="objective">
            <span className="objective-icon">🎯</span>
            <span className="objective-text">EXPLORE DEVELOPER CAPABILITIES</span>
          </div>
          <div className="objective">
            <span className="objective-icon">🚀</span>
            <span className="objective-text">DISCOVER PROJECT INNOVATIONS</span>
          </div>
          <div className="objective">
            <span className="objective-icon">✨</span>
            <span className="objective-text">ESTABLISH CONTACT PROTOCOLS</span>
          </div>
        </div>
      </div>

      {/* Stage 3: Launch Countdown */}
      <div ref={stage3Ref} className="intro-stage stage-3">
        <div className="launch-container">
          <p className="launch-label">INITIATING LAUNCH SEQUENCE</p>
          <div className="countdown">3</div>
        </div>
      </div>

      {/* Skip button */}
      <button
        ref={skipButtonRef}
        onClick={handleSkip}
        className="skip-button cursor-target"
        disabled={isSkipping}
      >
        <span>SKIP</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M13 17l5-5-5-5M6 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Corner accents */}
      <div className="corner-accent corner-tl"></div>
      <div className="corner-accent corner-tr"></div>
      <div className="corner-accent corner-bl"></div>
      <div className="corner-accent corner-br"></div>

      {/* Animated grid background */}
      <div className="grid-background">
        <div className="grid-lines"></div>
      </div>
    </div>
  );
};

export default IntroSequence;
