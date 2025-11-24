import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProjects } from '../data/projects';
import useDevicePerformance from '../hooks/useDevicePerformance';
import useMobileScrollAnimation from '../hooks/useMobileScrollAnimation';
import '../styles/horizontal-scroll.css';

const HorizontalProjectsGSAP = () => {
  const { performance, isMobile } = useDevicePerformance();

  // MOBILE OPTIMIZATION: Use IntersectionObserver instead of ScrollTrigger
  const { ref: mobileTitleRef, isVisible: titleVisible } = useMobileScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const projects = getFeaturedProjects();

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    // MOBILE: Use vertical scroll fallback (CSS only)
    if (isMobile) {
      console.log('[HorizontalProjects] Mobile detected - using vertical scroll');
      return;
    }

    const ctx = gsap.context(() => {
      const isLowPerformance = performance === 'low';

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: isLowPerformance ? 30 : 60 },
          {
            opacity: 1,
            y: 0,
            duration: isLowPerformance ? 0.8 : 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Subtitle
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: 0.2,
          }
        );
      }

      // Calculate horizontal scroll distance
      const cards = containerRef.current.querySelectorAll('.project-card');
      const cardWidth = cards[0]?.offsetWidth || 0;
      const totalWidth = cardWidth * projects.length;
      const scrollDistance = totalWidth - window.innerWidth;

      // Horizontal scroll animation
      const scrollTween = gsap.to(containerRef.current, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress bar
            if (progressBarRef.current) {
              gsap.to(progressBarRef.current, {
                scaleX: self.progress,
                duration: 0.1,
                ease: 'none'
              });
            }
          }
        },
      });

      // Card reveal animations
      cards.forEach((card, index) => {
        // Fade in as they come into view
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'left center',
              scrub: true,
            },
          }
        );

        // Parallax effect on images
        const img = card.querySelector('.project-image');
        if (img) {
          gsap.fromTo(
            img,
            { x: -50 },
            {
              x: 50,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length, performance, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden"
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        paddingTop: isMobile ? '5rem' : '0',
        paddingBottom: isMobile ? '5rem' : '0'
      }}
    >
      {/* Title Section - Above horizontal scroll */}
      <div className="relative z-20 py-20 px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div
          ref={(el) => {
            if (isMobile) mobileTitleRef.current = el;
          }}
          className="max-w-7xl mx-auto text-center"
        >
          <h2
            ref={titleRef}
            className={`text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase ${
              isMobile ? 'mobile-animate-hidden' : ''
            } ${titleVisible ? 'mobile-animate-visible' : ''}`}
          >
            Discovery Archive
          </h2>
          <p
            ref={subtitleRef}
            className={`text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase ${
              isMobile ? 'mobile-animate-hidden' : ''
            } ${titleVisible ? 'mobile-animate-visible' : ''}`}
            style={titleVisible ? { transitionDelay: '0.2s' } : {}}
          >
            Scroll to explore mission files
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container (Desktop) / Vertical Grid (Mobile) */}
      <div className={isMobile ? 'mobile-projects-grid' : 'horizontal-scroll-wrapper'}>
        <div
          ref={containerRef}
          className={isMobile ? 'mobile-projects-container' : 'horizontal-scroll-container'}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '2rem' : '4rem',
            padding: isMobile ? '2rem' : '0 50vw 0 4rem',
            alignItems: isMobile ? 'center' : 'center'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group"
              style={{
                minWidth: isMobile ? '100%' : 'clamp(600px, 60vw, 800px)',
                maxWidth: isMobile ? '500px' : 'none',
                height: isMobile ? 'auto' : '70vh',
                position: 'relative',
              }}
            >
              {/* Glass card with project content */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg">
                {/* Project Image */}
                <div
                  className="project-image absolute inset-0 bg-gradient-to-br from-[#4a9eff]/20 to-[#7b61ff]/20"
                  style={{
                    backgroundImage: project.image ? `url(${project.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                  {/* Category badge */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-[#4a9eff]/20 border border-[#4a9eff]/30 rounded-full text-[#4a9eff] text-xs md:text-sm font-['JetBrains_Mono'] uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                    {project.title}
                  </h3>

                  {/* Tagline */}
                  <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                    {project.tagline}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/70 text-xs md:text-sm font-['JetBrains_Mono']"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/70 text-xs md:text-sm font-['JetBrains_Mono']">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-target px-6 py-3 bg-[#4a9eff] text-black font-bold rounded-xl hover:bg-[#7b61ff] transition-all duration-300 hover:scale-105"
                      >
                        VIEW PROJECT
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-target px-6 py-3 border-2 border-white/30 text-white font-bold rounded-xl hover:border-[#4a9eff] hover:text-[#4a9eff] transition-all duration-300"
                      >
                        VIEW CODE
                      </a>
                    )}
                  </div>

                  {/* Card counter */}
                  <div className="absolute top-8 right-8 text-white/30 font-['JetBrains_Mono'] text-sm">
                    {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#4a9eff]/10 to-[#7b61ff]/10 blur-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar (Desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] rounded-full origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      )}

      {/* Scroll hint (Desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-12 right-12 z-30 flex items-center gap-3 text-white/40 font-['JetBrains_Mono'] text-xs uppercase tracking-wider">
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-bounce">
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </section>
  );
};

export default HorizontalProjectsGSAP;
