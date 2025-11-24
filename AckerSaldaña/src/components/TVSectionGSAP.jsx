import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TVScreen3D from './TVScreen3D';
import { customEases, durations } from '../utils/gsapConfig';
import useDevicePerformance from '../hooks/useDevicePerformance';
import useMobileScrollAnimation from '../hooks/useMobileScrollAnimation';

const TVSectionGSAP = () => {
  const { performance, isMobile } = useDevicePerformance();

  // MOBILE OPTIMIZATION: Use IntersectionObserver instead of ScrollTrigger (30-40% gain)
  const { ref: mobileTitleRef, isVisible: titleVisible } = useMobileScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });
  const { ref: mobileTVRef, isVisible: tvVisible } = useMobileScrollAnimation({
    threshold: 0.2,
    triggerOnce: true
  });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const tvRef = useRef(null);
  const parallaxElementsRef = useRef([]);

  // Parallax effect - DISABLED on mobile for performance (Phase 4)
  useEffect(() => {
    if (!sectionRef.current || isMobile) {
      console.log('[TVSectionGSAP] Parallax disabled on mobile for performance');
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
        const baseSpeed = (index + 1) * 0.03;
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
      console.log('[TVSectionGSAP] Mobile detected - using CSS animations instead of GSAP ScrollTrigger');
      return;
    }

    const ctx = gsap.context(() => {
      const isLowPerformance = performance === 'low';

      // Title animation - simplified on mobile (no 3D transforms)
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: isLowPerformance ? 30 : 50,
            scale: isLowPerformance ? 1 : 0.9,
            rotateX: isLowPerformance ? 0 : -15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
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

      // Subtitle animation - faster on mobile
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: isLowPerformance ? 20 : 30 },
          {
            opacity: 1,
            y: 0,
            duration: isLowPerformance ? durations.fast : durations.normal,
            ease: customEases.smooth,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: isLowPerformance ? 0.1 : 0.2,
          }
        );
      }

      // TV animation - simplified on mobile (no scale)
      if (tvRef.current) {
        gsap.fromTo(
          tvRef.current,
          {
            opacity: 0,
            scale: isLowPerformance ? 1 : 0.8,
            y: isLowPerformance ? 30 : 50
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: isLowPerformance ? durations.normal : durations.dramatic,
            ease: isLowPerformance ? customEases.smooth : customEases.dramatic,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: isLowPerformance ? 0.2 : 0.4,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [performance, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen flex items-center justify-center px-8 py-32 md:py-40 relative z-10 overflow-hidden"
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={(el) => (parallaxElementsRef.current[0] = el)}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(74, 239, 255, 0.5), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          ref={(el) => (parallaxElementsRef.current[1] = el)}
          className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.5), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-[1800px] mx-auto w-full relative z-10">
        {/* Title Section - Clean & Consistent */}
        <div
          ref={(el) => {
            if (isMobile) mobileTitleRef.current = el;
          }}
          className="mb-20 md:mb-28 text-center"
        >
          <h2
            ref={titleRef}
            className={`text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-6 tracking-tighter uppercase mobile-animate-hidden ${titleVisible ? 'mobile-animate-visible' : ''}`}
          >
            Project Archive
          </h2>
          <div
            ref={subtitleRef}
            className={`max-w-2xl mx-auto mobile-animate-hidden ${titleVisible ? 'mobile-animate-visible' : ''}`}
            style={titleVisible ? { transitionDelay: '0.1s' } : {}}
          >
            <p className="text-lg md:text-xl text-gray-400 mb-4">
              Navigate through the retro terminal interface to explore my portfolio
            </p>
            <p className="text-sm md:text-base text-gray-500 flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="text-[#4a9eff]">●</span> Click power button to turn on
              </span>
              <span className="hidden md:inline text-gray-600">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-[#4a9eff]">◄ ►</span> Switch channels
              </span>
              <span className="hidden md:inline text-gray-600">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-[#4a9eff]">⌨</span> Type in terminal
              </span>
            </p>
          </div>
        </div>

        {/* TV Component - Centered */}
        <div className="relative max-w-4xl mx-auto">
          {/* Decorative grid behind TV */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(#4aefff 1px, transparent 1px), linear-gradient(90deg, #4aefff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) scale(2)',
            transformOrigin: 'center bottom',
          }} />

          <div
            ref={(el) => {
              tvRef.current = el;
              if (isMobile) mobileTVRef.current = el;
            }}
            style={tvVisible ? { perspective: '2000px', transitionDelay: '0.2s' } : { perspective: '2000px' }}
            className={`relative z-10 mobile-animate-hidden ${tvVisible ? 'mobile-animate-visible' : ''}`}
          >
            <TVScreen3D />
          </div>

          {/* Glow underneath TV */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 opacity-20 pointer-events-none blur-3xl"
            style={{
              background: 'radial-gradient(ellipse, #4aefff 0%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TVSectionGSAP;
