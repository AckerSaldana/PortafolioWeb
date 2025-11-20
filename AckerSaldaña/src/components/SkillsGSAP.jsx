import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SiCplusplus,
  SiJavascript,
  SiPython,
  SiSwift,
  SiReact,
  SiNextdotjs,
  SiThreedotjs,
  SiNodedotjs,
  SiMysql,
  SiPostgresql,
  SiGit
} from 'react-icons/si';
import { customEases, durations, staggerPresets } from '../utils/gsapConfig';

gsap.registerPlugin(ScrollTrigger);

const SkillsGSAP = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const skillCardsRef = useRef([]);
  const parallaxElementsRef = useRef([]);

  // Premium skills data with bento grid sizing
  const skills = [
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', size: 'large', iconSize: 72 },
    { name: 'React', icon: SiReact, color: '#61DAFB', size: 'large', iconSize: 72 },
    { name: 'Three.js', icon: SiThreedotjs, color: '#ffffff', size: 'large', iconSize: 72 },
    { name: 'C++', icon: SiCplusplus, color: '#00599C', size: 'medium', iconSize: 56 },
    { name: 'Python', icon: SiPython, color: '#3776AB', size: 'medium', iconSize: 56 },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', size: 'medium', iconSize: 56 },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', size: 'small', iconSize: 48 },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', size: 'small', iconSize: 48 },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1', size: 'small', iconSize: 48 },
    { name: 'Swift', icon: SiSwift, color: '#FA7343', size: 'small', iconSize: 48 },
    { name: 'Git', icon: SiGit, color: '#F05032', size: 'small', iconSize: 48 },
  ];

  // Parallax effect on scroll - enhanced
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const relativeScroll = scrollY - sectionTop;

      parallaxElementsRef.current.forEach((el, index) => {
        if (!el) return;
        const speed = (index + 1) * 0.05;
        gsap.to(el, {
          y: relativeScroll * speed,
          rotation: relativeScroll * 0.02,
          duration: 0,
        });
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Tilt & Magnetic hover effect for skill cards
  useEffect(() => {
    const cards = skillCardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const handleMouseMove = (e) => {
      cards.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const distX = e.clientX - cardCenterX;
        const distY = e.clientY - cardCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Magnetic effect threshold
        const magneticThreshold = 200;

        if (distance < magneticThreshold) {
          // Calculate magnetic pull (stronger when closer)
          const strength = (magneticThreshold - distance) / magneticThreshold;
          const magneticPull = 0.15;

          gsap.to(card, {
            x: distX * magneticPull * strength,
            y: distY * magneticPull * strength,
            duration: 0.4,
            ease: 'power2.out',
          });
        } else {
          // Reset position
          gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced Card hover with spotlight effect
  const handleCardHover = (e, card) => {
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // 3D tilt with smooth spring
    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Animate icon with bounce
    const icon = card.querySelector('.skill-icon');
    if (icon) {
      gsap.to(icon, {
        scale: 1.15,
        y: -10,
        rotationY: 5,
        duration: 0.5,
        ease: 'back.out(1.4)',
      });
    }

    // Dynamic glow effect
    const glow = card.querySelector('.card-glow');
    if (glow) {
      gsap.to(glow, {
        opacity: 0.8,
        scale: 1.1,
        duration: 0.3,
      });
    }

    // Spotlight that follows cursor
    const spotlight = card.querySelector('.spotlight');
    if (spotlight) {
      gsap.to(spotlight, {
        opacity: 1,
        duration: 0.2,
      });
      // Position spotlight at cursor
      spotlight.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(255, 255, 255, 0.15), transparent 70%)`;
    }

    // Border glow
    const borderGlow = card.querySelector('.border-glow');
    if (borderGlow) {
      gsap.to(borderGlow, {
        opacity: 1,
        duration: 0.3,
      });
    }
  };

  const handleCardLeave = (card) => {
    if (!card) return;

    // Reset 3D transform with elastic bounce
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
    });

    // Reset icon
    const icon = card.querySelector('.skill-icon');
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        y: 0,
        rotationY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      });
    }

    // Fade out glow
    const glow = card.querySelector('.card-glow');
    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.5,
      });
    }

    // Fade out spotlight
    const spotlight = card.querySelector('.spotlight');
    if (spotlight) {
      gsap.to(spotlight, {
        opacity: 0,
        duration: 0.4,
      });
    }

    // Fade out border glow
    const borderGlow = card.querySelector('.border-glow');
    if (borderGlow) {
      gsap.to(borderGlow, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation with scale
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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

      // Skill cards stagger animation - clean entrance only
      skillCardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            rotateX: -10,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: durations.dramatic,
            ease: customEases.dramatic,
            delay: index * 0.08,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 md:px-8 py-32 md:py-40 relative z-10 overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large gradient orb 1 */}
        <div
          ref={(el) => (parallaxElementsRef.current[0] = el)}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(74, 158, 255, 0.8), transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Large gradient orb 2 */}
        <div
          ref={(el) => (parallaxElementsRef.current[1] = el)}
          className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.8), transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Accent orb 3 */}
        <div
          ref={(el) => (parallaxElementsRef.current[2] = el)}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(247, 223, 30, 0.6), transparent 60%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        {/* Premium Title Section */}
        <div className="mb-20 md:mb-28 text-center">
          <h2
            ref={titleRef}
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
          >
            TECH ARSENAL
          </h2>
          <p ref={subtitleRef} className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase">
            Weapons of choice for building exceptional experiences
          </p>
        </div>

        {/* Premium Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {skills.map((skill, index) => {
            // Bento grid sizing logic
            const getSizeClasses = () => {
              if (skill.size === 'large') {
                return 'md:col-span-2 md:row-span-2';
              } else if (skill.size === 'medium') {
                return 'md:col-span-2';
              }
              return '';
            };

            return (
              <div
                key={skill.name}
                ref={(el) => (skillCardsRef.current[index] = el)}
                className={`group relative cursor-target ${getSizeClasses()}`}
                onMouseMove={(e) => handleCardHover(e, skillCardsRef.current[index])}
                onMouseLeave={() => handleCardLeave(skillCardsRef.current[index])}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Main Card */}
                <div
                  className="relative h-full min-h-[180px] md:min-h-[200px] rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {/* Border glow effect */}
                  <div
                    className="border-glow absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
                    style={{
                      padding: '2px',
                      background: `linear-gradient(135deg, ${skill.color}80, ${skill.color}40, ${skill.color}80)`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      filter: 'blur(2px)',
                    }}
                  />

                  {/* Dynamic glow effect */}
                  <div
                    className="card-glow absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${skill.color}80, ${skill.color}40 40%, transparent 70%)`,
                      filter: 'blur(60px)',
                    }}
                  />

                  {/* Spotlight that follows cursor */}
                  <div
                    className="spotlight absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle 200px at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%)',
                      mixBlendMode: 'overlay',
                    }}
                  />

                  {/* Ambient light reflection */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
                    }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8 text-center z-10">
                    {/* Icon */}
                    <div
                      className="skill-icon mb-4 md:mb-6 transition-all will-change-transform"
                      style={{
                        color: skill.color,
                        filter: `drop-shadow(0 4px 20px ${skill.color}60)`,
                      }}
                    >
                      <skill.icon size={skill.iconSize} />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-wide">
                      {skill.name}
                    </h3>

                    {/* Decorative line for large cards */}
                    {skill.size === 'large' && (
                      <div
                        className="mt-4 w-12 h-1 rounded-full opacity-60 transition-all duration-300 group-hover:w-16 group-hover:opacity-100"
                        style={{
                          backgroundColor: skill.color,
                          boxShadow: `0 0 10px ${skill.color}80`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsGSAP;
