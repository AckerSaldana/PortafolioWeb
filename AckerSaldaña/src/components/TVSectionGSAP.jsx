import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TVScreen3D from './TVScreen3D';
import { customEases, durations } from '../utils/gsapConfig';

const TVSectionGSAP = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const tvRef = useRef(null);
  const parallaxElementsRef = useRef([]);

  // Parallax effect
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const relativeScroll = scrollY - sectionTop;

      parallaxElementsRef.current.forEach((el, index) => {
        if (!el) return;
        const speed = (index + 1) * 0.03;
        gsap.to(el, {
          y: relativeScroll * speed,
          duration: 0,
        });
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation with scale and rotation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: durations.dramatic,
            ease: customEases.dramatic,
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
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: durations.normal,
            ease: customEases.smooth,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: 0.2,
          }
        );
      }

      // TV animation - dramatic 3D entrance
      if (tvRef.current) {
        gsap.fromTo(
          tvRef.current,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: durations.dramatic,
            ease: customEases.dramatic,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        <div className="mb-20 md:mb-28 text-center">
          <h2
            ref={titleRef}
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
          >
            Project Archive
          </h2>
          <p ref={subtitleRef} className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase">
            Navigate through the retro terminal interface to explore my portfolio
          </p>
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

          <div ref={tvRef} style={{ perspective: '2000px' }} className="relative z-10">
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
