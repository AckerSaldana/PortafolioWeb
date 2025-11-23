import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeDisplayGSAP from './CodeDisplayGSAP';
import { fadeInOnScroll, staggerFadeIn } from '../utils/scrollAnimations';
import { customEases, durations, staggerPresets } from '../utils/gsapConfig';
import useDevicePerformance from '../hooks/useDevicePerformance';
import useMobileScrollAnimation, { useMobileStaggerAnimation } from '../hooks/useMobileScrollAnimation';

const AboutMeGSAP = () => {
  const { performance, isMobile } = useDevicePerformance();

  // MOBILE OPTIMIZATION: Use IntersectionObserver instead of ScrollTrigger (30-40% gain)
  const { ref: mobileTitleRef, isVisible: titleVisible } = useMobileScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });
  const { ref: mobileContentRef, isVisible: contentVisible } = useMobileScrollAnimation({
    threshold: 0.15,
    triggerOnce: true,
    rootMargin: '0px 0px -15% 0px'
  });
  const { ref: mobileStatsRef, visibleIndexes: statsVisible } = useMobileStaggerAnimation(3, {
    threshold: 0.1,
    triggerOnce: true,
    staggerDelay: 100
  });
  const { ref: mobileCodeRef, isVisible: codeVisible } = useMobileScrollAnimation({
    threshold: 0.05,
    triggerOnce: true
  });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const paragraphsRef = useRef(null);
  const pullQuoteRef = useRef(null);
  const statsRef = useRef([]);
  const buttonsRef = useRef(null);
  const codeDisplayRef = useRef(null);
  const parallaxElementsRef = useRef([]);

  const [stats] = useState([
    { label: 'Years Experience', value: 2, suffix: '+' },
    { label: 'Projects Completed', value: 20, suffix: '+' },
    { label: 'Technologies', value: 10, suffix: '+' },
  ]);

  // Debug contentVisible state on mobile
  useEffect(() => {
    if (isMobile) {
      console.log('[AboutMeGSAP] Mobile detected');
      console.log('[AboutMeGSAP] contentVisible:', contentVisible);
      console.log('[AboutMeGSAP] mobileContentRef.current:', mobileContentRef.current);
      console.log('[AboutMeGSAP] paragraphsRef.current:', paragraphsRef.current);
    }
  }, [contentVisible, isMobile, mobileContentRef, paragraphsRef]);

  // Parallax effect - DISABLED on mobile for performance (Phase 4)
  useEffect(() => {
    if (!sectionRef.current || isMobile) {
      console.log('[AboutMeGSAP] Parallax disabled on mobile for performance');
      return;
    }

    let rafId = null;
    let isScheduled = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const relativeScroll = scrollY - sectionTop;

      parallaxElementsRef.current.forEach((el, index) => {
        if (!el) return;
        const baseSpeed = (index + 1) * 0.05;
        gsap.to(el, {
          y: relativeScroll * baseSpeed,
          duration: 0,
        });
      });

      isScheduled = false;
    };

    const handleScroll = () => {
      if (!isScheduled) {
        isScheduled = true;
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // MOBILE OPTIMIZATION: Skip ALL GSAP ScrollTrigger animations on mobile (30-40% performance gain)
    // Use IntersectionObserver + CSS transitions instead
    if (isMobile) {
      console.log('[AboutMeGSAP] Mobile detected - using CSS animations instead of GSAP ScrollTrigger');
      return;
    }

    const ctx = gsap.context(() => {
      const isLowPerformance = performance === 'low';

      // Title animation - simplified on mobile (no scale)
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: isLowPerformance ? 30 : 50,
            scale: isLowPerformance ? 1 : 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isLowPerformance ? durations.fast : durations.dramatic,
            ease: isLowPerformance ? customEases.smooth : customEases.dramatic,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: durations.normal,
            ease: customEases.smooth,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        );
      }

      // Paragraphs stagger animation from left
      if (paragraphsRef.current) {
        const paragraphs = gsap.utils.toArray(paragraphsRef.current.children);
        gsap.fromTo(
          paragraphs,
          {
            opacity: 0,
            x: -60,
          },
          {
            opacity: 1,
            x: 0,
            duration: durations.normal,
            stagger: staggerPresets.slow,
            ease: customEases.smooth,
            scrollTrigger: {
              trigger: paragraphsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Pull quote animation - simplified on mobile (no 3D transforms)
      gsap.fromTo(
        pullQuoteRef.current,
        {
          opacity: 0,
          y: isLowPerformance ? 20 : 30,
          scale: isLowPerformance ? 1 : 0.95,
          rotateX: isLowPerformance ? 0 : -10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: isLowPerformance ? durations.fast : durations.dramatic,
          ease: isLowPerformance ? customEases.smooth : customEases.dramatic,
          scrollTrigger: {
            trigger: pullQuoteRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animated stat counters
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;

        const counter = stat.querySelector('.stat-value');
        const targetValue = parseInt(counter.textContent);

        gsap.fromTo(
          stat,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: durations.normal,
            delay: index * 0.1,
            ease: customEases.smooth,
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            onStart: () => {
              // Animate counter
              gsap.fromTo(
                { val: 0 },
                {
                  val: targetValue,
                  duration: 2,
                  ease: 'power2.out',
                  onUpdate: function () {
                    counter.textContent = Math.floor(this.targets()[0].val);
                  },
                }
              );
            },
          }
        );
      });

      // Buttons animation - simplified on mobile (no scale)
      if (buttonsRef.current) {
        const buttons = gsap.utils.toArray(buttonsRef.current.children);
        gsap.fromTo(
          buttons,
          {
            opacity: 0,
            y: isLowPerformance ? 15 : 20,
            scale: isLowPerformance ? 1 : 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isLowPerformance ? durations.fast * 0.8 : durations.fast,
            stagger: isLowPerformance ? staggerPresets.fast * 0.5 : staggerPresets.fast,
            ease: isLowPerformance ? customEases.smooth : customEases.bounce,
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Code display slide in - simplified on mobile (no 3D transforms)
      gsap.fromTo(
        codeDisplayRef.current,
        {
          opacity: 0,
          x: isLowPerformance ? 50 : 100,
          rotateY: isLowPerformance ? 0 : -15,
          scale: isLowPerformance ? 1 : 0.9,
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          duration: isLowPerformance ? durations.normal : durations.dramatic,
          ease: isLowPerformance ? customEases.smooth : customEases.dramatic,
          scrollTrigger: {
            trigger: codeDisplayRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [performance, isMobile]);

  // Enhanced button hover animations
  const handleButtonHover = (e, isEntering) => {
    const button = e.currentTarget;

    gsap.to(button, {
      scale: isEntering ? 1.05 : 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
    });

    // Animate the glow
    const glow = button.querySelector('.button-glow');
    if (glow) {
      gsap.to(glow, {
        opacity: isEntering ? 0.3 : 0,
        duration: 0.3,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen flex items-center justify-center px-8 py-32 md:py-40 relative z-10 overflow-hidden"
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={(el) => (parallaxElementsRef.current[0] = el)}
          className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(74, 158, 255, 0.5), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          ref={(el) => (parallaxElementsRef.current[1] = el)}
          className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.5), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        {/* Title Section - Enhanced spacing and size */}
        <div
          ref={isMobile ? mobileTitleRef : null}
          className="mb-24 md:mb-32 text-center md:text-left"
        >
          <h2
            ref={titleRef}
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
            style={isMobile ? {
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            } : {}}
          >
            About Me
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase ml-0 md:ml-20"
            style={isMobile ? {
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            } : {}}
          >
            Bridging technology & human needs
          </p>
        </div>

        {/* Asymmetric Content Grid - 60/40 split */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24 items-start">
          {/* Left Column: Text Content (60%) */}
          <div className="space-y-12 text-center md:text-left">
            <div
              ref={(el) => {
                paragraphsRef.current = el;
                if (isMobile) {
                  mobileContentRef.current = el;
                  console.log('[AboutMeGSAP] Ref assigned:', el);
                }
              }}
              className="space-y-8"
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-['Inter']">
                I'm a{' '}
                <span className="text-[#4a9eff] font-semibold">
                  Computer Science student
                </span>{' '}
                at Tecnológico de Monterrey, currently pursuing a Master's
                degree in Advanced Computer Science at the University of Hull.
              </p>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-['Inter']">
                My passion lies in solving complex problems through clean,
                scalable software solutions. I specialize in modern web
                development with
                <span className="text-[#4a9eff]"> React</span> and{' '}
                <span className="text-[#4a9eff]">JavaScript</span>, robust
                databases using
                <span className="text-[#4a9eff]"> PostgreSQL</span> and{' '}
                <span className="text-[#4a9eff]">MySQL</span>, and creating
                immersive 3D experiences with{' '}
                <span className="text-[#4a9eff]">Three.js</span>.
              </p>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-['Inter']">
                Beyond technical skills, I'm driven by curiosity for emerging
                technologies and continuous learning. I'm also pursuing an
                International Diploma to develop multicultural competencies,
                believing that diverse perspectives and inclusive environments
                are key to innovation.
              </p>
            </div>

            {/* Pull Quote - Premium Typography */}
            <div
              ref={pullQuoteRef}
              className="relative pl-0 md:pl-8 py-8 border-l-0 md:border-l-4 border-t-4 md:border-t-0 border-[#4a9eff] my-12 pt-8 md:pt-8"
              style={{
                perspective: '1000px',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-['Inter']">
                "Building bridges between technology and human needs"
              </p>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#4a9eff] via-[#7b61ff] to-transparent hidden md:block" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a9eff] via-[#7b61ff] to-transparent md:hidden" />
            </div>

            {/* Stat Counters */}
            <div
              ref={isMobile ? mobileStatsRef : null}
              className="grid grid-cols-3 gap-8 py-12"
            >
              {stats.map((stat, index) => {
                const isStatVisible = isMobile ? statsVisible.has(index) : true;
                return (
                  <div
                    key={index}
                    ref={(el) => (statsRef.current[index] = el)}
                    className="relative group"
                    style={isMobile ? {
                      opacity: isStatVisible ? 1 : 0,
                      transform: isStatVisible ? 'translateY(0)' : 'translateY(30px)',
                      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                    } : {}}
                  >
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl font-bold text-[#4a9eff] mb-3 font-['Inter']">
                      <span className="stat-value">{stat.value}</span>
                      <span>{stat.suffix}</span>
                    </div>
                    <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-['JetBrains_Mono']">
                      {stat.label}
                    </div>
                  </div>
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4a9eff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
              })}
            </div>

            {/* Enhanced Buttons with glows */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap gap-6 pt-8 justify-center md:justify-start"
            >
              <button
                className="cursor-target relative px-8 py-4 bg-[#4a9eff] text-[#0a0a0a] font-bold text-lg rounded-xl overflow-hidden group"
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                onClick={() =>
                  window.open(
                    'https://drive.google.com/file/d/1S6QGyCKlFwG4JYqd4cT0NXxI4rE7ZhB8/view?usp=sharing',
                    '_blank'
                  )
                }
              >
                <div className="button-glow absolute inset-0 bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] opacity-0" />
                <span className="relative z-10 flex items-center gap-2">
                  Download CV
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-y-1 transition-transform">
                    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <button
                className="cursor-target relative px-8 py-4 border-2 border-[#4a9eff] text-[#4a9eff] font-bold text-lg rounded-xl overflow-hidden group"
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                onClick={() =>
                  window.open('https://github.com/AckerSaldana', '_blank')
                }
              >
                <div className="button-glow absolute inset-0 bg-[#4a9eff]/10 opacity-0" />
                <span className="relative z-10 flex items-center gap-2">
                  GitHub Profile
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Code Display (40%) */}
          <div
            ref={(el) => {
              codeDisplayRef.current = el;
              if (isMobile && mobileCodeRef) mobileCodeRef.current = el;
            }}
            style={isMobile ? {
              perspective: '1000px',
              opacity: codeVisible ? 1 : 0,
              transform: codeVisible ? 'translate3d(0, 0, 0)' : 'translate3d(30px, 0, 0)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            } : { perspective: '1000px' }}
          >
            <CodeDisplayGSAP />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeGSAP;
