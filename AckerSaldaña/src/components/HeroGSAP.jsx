import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { customEases, durations } from '../utils/gsapConfig';
import { scrollTo } from './SmoothScroll';

const HeroGSAP = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showArrow, setShowArrow] = useState(true);
  const [currentRole, setCurrentRole] = useState(0);

  // Refs for animation targets
  const containerRef = useRef(null);
  const gradientRef = useRef(null);
  const greetingRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const arrowRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const magneticRefs = useRef([]);

  const roles = ['Software Engineer', 'Full Stack Developer', 'Problem Solver'];

  // Enhanced mouse move effect for gradient (increased opacity)
  useEffect(() => {
    if (!gradientRef.current) return;

    const xTo = gsap.quickTo(gradientRef.current, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(gradientRef.current, 'y', { duration: 0.6, ease: 'power3' });

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating elements parallax removed per user request

  // Magnetic button effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      magneticRefs.current.forEach((button) => {
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        const distX = e.clientX - buttonCenterX;
        const distY = e.clientY - buttonCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const threshold = 100;

        if (distance < threshold) {
          const pull = 0.4;
          gsap.to(button, {
            x: distX * pull,
            y: distY * pull,
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY < 50;
      if (shouldShow !== showArrow) {
        setShowArrow(shouldShow);
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            opacity: shouldShow ? 1 : 0,
            duration: 0.3,
            ease: customEases.smooth,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showArrow]);

  // Character-by-character name reveal
  useEffect(() => {
    if (!containerRef.current || !nameRef.current) return;

    // Check all refs exist before setting initial states
    if (!buttonsRef.current || !arrowRef.current || !greetingRef.current || !roleRef.current || !descriptionRef.current) {
      console.warn('[HeroGSAP] Some refs are missing, aborting animation');
      return;
    }

    // Set initial states for award-winning entrance sequence
    // NAME COMES FIRST - most important element
    gsap.set(nameRef.current, {
      opacity: 0,
      scale: 1.1,
      y: 40,
      filter: 'blur(20px)',
    });

    gsap.set(greetingRef.current, {
      opacity: 0,
      x: -30,
    });

    gsap.set([roleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
    });

    gsap.set(buttonsRef.current.children || [], {
      opacity: 0,
      y: 30,
      scale: 0.9,
    });

    gsap.set(arrowRef.current, {
      opacity: 0,
      scale: 0,
    });

    // Create master timeline - NAME FIRST for maximum impact
    const tl = gsap.timeline({
      delay: 0.3,
    });

    // 1. NAME - Hero entrance with dramatic scale + blur reveal
    tl.to(nameRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power4.out',
    });

    // 2. GREETING - Quick slide in from left
    tl.to(greetingRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.8');

    // 3. ROLE - Fade up with blur
    tl.to(roleRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3');

    // 4. DESCRIPTION - Smooth fade up
    tl.to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4');

    // 5. BUTTONS - Staggered pop-in with bounce
    const buttons = Array.from(buttonsRef.current?.children || []);
    if (buttons.length > 0) {
      tl.to(buttons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.7)',
      }, '-=0.3');
    }

    // 6. ARROW - Final elastic bounce
    tl.to(arrowRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'elastic.out(1, 0.5)',
    }, '-=0.4');

    // Arrow bounce animation
    gsap.to(arrowRef.current, {
      y: 15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 2,
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Enhanced role rotation with spectacular glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextRole = (currentRole + 1) % roles.length;

      if (roleRef.current) {
        const container = roleRef.current.parentElement;

        // Create glitch layers for chromatic aberration effect
        const glitchLayers = [];
        for (let i = 0; i < 3; i++) {
          const layer = document.createElement('div');
          layer.className = 'absolute inset-0 pointer-events-none text-2xl md:text-3xl lg:text-4xl font-medium ml-6';
          layer.style.fontFamily = "'Inter', sans-serif";
          layer.textContent = roles[currentRole];
          layer.style.opacity = '0';

          // Different colors for chromatic aberration
          if (i === 0) layer.style.color = '#ff0040'; // Red
          if (i === 1) layer.style.color = '#00ff9f'; // Green
          if (i === 2) layer.style.color = '#4a9eff'; // Blue

          container.appendChild(layer);
          glitchLayers.push(layer);
        }

        const tl = gsap.timeline({
          onComplete: () => {
            glitchLayers.forEach(layer => layer.remove());
          }
        });

        // Phase 1: Glitch out with chromatic aberration
        tl.to(roleRef.current, {
          opacity: 0.3,
          filter: 'blur(2px)',
          duration: 0.1,
          ease: 'power2.in',
        })
        .to(glitchLayers[0], {
          opacity: 0.7,
          x: -8,
          duration: 0.05,
        }, '<')
        .to(glitchLayers[1], {
          opacity: 0.7,
          x: 4,
          duration: 0.05,
        }, '<')
        .to(glitchLayers[2], {
          opacity: 0.7,
          x: 8,
          duration: 0.05,
        }, '<')

        // Phase 2: Intense glitch
        .to(roleRef.current, {
          opacity: 0,
          x: -20,
          skewX: 15,
          duration: 0.15,
        })
        .to(glitchLayers, {
          opacity: 0,
          stagger: 0.02,
          duration: 0.1,
        }, '<')

        // Phase 3: Quick flash multiple times
        .to(roleRef.current, {
          opacity: 0.8,
          x: 15,
          skewX: -15,
          filter: 'blur(4px) brightness(1.5)',
          duration: 0.05,
        })
        .to(roleRef.current, {
          opacity: 0.2,
          x: -5,
          skewX: 5,
          duration: 0.05,
        })
        .to(roleRef.current, {
          opacity: 0.6,
          x: 10,
          skewX: -10,
          duration: 0.05,
        })

        // Phase 4: Change text and glitch in
        .call(() => {
          setCurrentRole(nextRole);
          // Update glitch layers with new text
          glitchLayers.forEach(layer => {
            layer.textContent = roles[nextRole];
          });
        })
        .fromTo(glitchLayers[0], {
          opacity: 0.8,
          x: -12,
        }, {
          opacity: 0,
          x: 0,
          duration: 0.2,
        })
        .fromTo(glitchLayers[1], {
          opacity: 0.8,
          x: 6,
        }, {
          opacity: 0,
          x: 0,
          duration: 0.2,
        }, '<')
        .fromTo(glitchLayers[2], {
          opacity: 0.8,
          x: 12,
        }, {
          opacity: 0,
          x: 0,
          duration: 0.2,
        }, '<')

        // Phase 5: Final reveal with particles
        .fromTo(roleRef.current, {
          opacity: 0,
          x: 15,
          skewX: -10,
          filter: 'blur(4px)',
        }, {
          opacity: 1,
          x: 0,
          skewX: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power3.out',
        }, '<0.1')


      } else {
        setCurrentRole(nextRole);
      }
    }, 4000); // Increased interval to 4s to enjoy the animation

    return () => clearInterval(interval);
  }, [currentRole, roles]);

  // Enhanced button interactions
  const handleButtonHover = (e, isEntering) => {
    const button = e.currentTarget;

    gsap.to(button, {
      scale: isEntering ? 1.05 : 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
    });

    // Find and animate the glow
    const glow = button.querySelector('.button-glow');
    if (glow) {
      gsap.to(glow, {
        opacity: isEntering ? 0.3 : 0,
        duration: 0.3,
      });
    }
  };

  const handleButtonClick = (e) => {
    const button = e.currentTarget;

    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: customEases.smooth,
    });

    // Particle burst effect
    const rect = button.getBoundingClientRect();
    const particles = 8;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-[#4a9eff] rounded-full pointer-events-none';
      particle.style.left = `${rect.width / 2}px`;
      particle.style.top = `${rect.height / 2}px`;
      button.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particles;
      const distance = 50;

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-8 overflow-hidden z-10">
      {/* Gradient background removed per user request */}

      {/* Decorative elements removed per user request */}

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Greeting */}
        <h2
          ref={greetingRef}
          className="text-sm md:text-base font-['JetBrains_Mono'] text-[#4a9eff] mb-6 md:mb-8 tracking-[0.25em] uppercase font-medium"
          style={{ willChange: 'transform, opacity' }}
        >
          {'<'} Hello, I'm {'/>'}
        </h2>

        {/* Name - CLEAN BOLD TYPOGRAPHY */}
        <h1
          ref={nameRef}
          className="text-[clamp(4rem,15vw,12rem)] font-black leading-[0.9] tracking-[-0.04em] mb-12 md:mb-16"
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#ffffff',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="block">Acker</span>
          <span className="block" style={{
            background: 'linear-gradient(90deg, #ffffff 0%, #4a9eff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Saldaña
          </span>
        </h1>

        {/* Role (rotating) with enhanced glitch effect */}
        <div className="h-16 md:h-20 mb-10 md:mb-16 flex items-center relative">
          {/* Simple border bar */}
          <div className="absolute left-0 top-0 w-2 h-full bg-[#4a9eff]" />

          <p
            ref={roleRef}
            className="text-2xl md:text-3xl lg:text-4xl text-[#e0e0e0] font-['Inter'] font-medium ml-6 relative"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {roles[currentRole]}
          </p>
        </div>

        {/* Description with larger text */}
        <p
          ref={descriptionRef}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-16 md:mb-20 leading-relaxed"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          Crafting <span className="text-[#4a9eff] font-semibold">elegant solutions</span> to complex problems.
          Passionate about clean code, innovative design, and building experiences that make a{' '}
          <span className="text-[#7b61ff] font-semibold">difference</span>.
        </p>

        {/* Enhanced buttons with magnetic effect */}
        <div ref={buttonsRef} className="flex flex-wrap gap-6">
          <button
            ref={(el) => (magneticRefs.current[0] = el)}
            className="cursor-target group relative px-10 py-4 bg-[#4a9eff] text-[#0a0a0a] font-bold text-lg rounded-xl overflow-hidden"
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleButtonClick(e);
            }}
            onClick={() => navigate('/projects')}
          >
            <div className="button-glow absolute inset-0 bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] opacity-0" />
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          <button
            ref={(el) => (magneticRefs.current[1] = el)}
            className="cursor-target group relative px-10 py-4 border-2 border-[#4a9eff] text-[#4a9eff] font-bold text-lg rounded-xl overflow-hidden"
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleButtonClick(e);
            }}
            onClick={() => {
              scrollTo('#contact', { offset: -80 });
            }}
          >
            <div className="button-glow absolute inset-0 bg-[#4a9eff]/10 opacity-0" />
            <span className="relative z-10">Contact Me</span>
          </button>
        </div>
      </div>

      {/* Enhanced scroll arrow */}
      <div
        ref={arrowRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-gray-400 text-xs font-['JetBrains_Mono'] uppercase tracking-[0.2em] opacity-60">
          Explore More
        </span>
        <div className="w-6 h-10 border-2 border-gray-400/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-[#4a9eff] rounded-full animate-[scroll_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default HeroGSAP;
