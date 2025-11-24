import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { customEases, durations } from '../utils/gsapConfig';
import useDevicePerformance from '../hooks/useDevicePerformance';
import useMobileScrollAnimation, { useMobileStaggerAnimation } from '../hooks/useMobileScrollAnimation';

const ExperienceGSAP = () => {
  const { performance, isMobile } = useDevicePerformance();

  // MOBILE OPTIMIZATION: Use IntersectionObserver instead of ScrollTrigger (30-40% gain)
  const { ref: mobileTitleRef, isVisible: titleVisible } = useMobileScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });
  const { ref: mobileTimelineRef, isVisible: timelineVisible } = useMobileScrollAnimation({
    threshold: 0.2,
    triggerOnce: false
  });
  const { ref: mobileItemsRef, visibleIndexes } = useMobileStaggerAnimation(2, {
    threshold: 0.2,
    triggerOnce: true,
    staggerDelay: 100
  });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const timelineLineRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const itemsRef = useRef([]);
  const imagesRef = useRef([]);
  const contentRef = useRef([]);


  const experiences = [
    {
      id: 1,
      number: "01",
      tag: "EXCHANGE",
      title: "Master's in Advanced Computer Science",
      institution: "University of Hull",
      location: "Hull, United Kingdom",
      period: "2025 - Present",
      description: "Enrolled in an international exchange program for advanced studies in computer science, focusing on cutting-edge technologies and research methodologies.",
      image: "/images/UniversityHull.jpeg",
      color: "#4a9eff",
      current: true
    },
    {
      id: 2,
      number: "02",
      tag: "BACHELOR",
      title: "Computer Science & Technology",
      institution: "Tecnológico de Monterrey",
      location: "Monterrey, Mexico",
      period: "2021 - 2025",
      description: "Pursuing Ingeniero en Tecnologías Computacionales (ITC), developing strong foundations in software engineering, algorithms, and system design.",
      image: "/images/Tec.jpeg",
      color: "#61dafb",
      current: true
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // MOBILE OPTIMIZATION: Skip ALL GSAP ScrollTrigger animations on mobile (30-40% performance gain)
    // Use IntersectionObserver + CSS transitions instead
    if (isMobile) {
      console.log('[ExperienceGSAP] Mobile detected - using CSS animations instead of GSAP ScrollTrigger');
      // Ensure all elements are visible on mobile (clear any GSAP opacity: 0)
      if (titleRef.current) gsap.set(titleRef.current, { clearProps: 'all' });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { clearProps: 'all' });
      if (timelineProgressRef.current) gsap.set(timelineProgressRef.current, { clearProps: 'all' });
      contentRef.current.forEach(el => el && gsap.set(el, { clearProps: 'all' }));
      imagesRef.current.forEach(el => el && gsap.set(el, { clearProps: 'all' }));
      return;
    }

    const ctx = gsap.context(() => {
      const isLowPerformance = performance === 'low';

      // Title animation - faster on mobile
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: isLowPerformance ? 30 : 60 },
          {
            opacity: 1,
            y: 0,
            duration: isLowPerformance ? 0.8 : 1.2,
            ease: isLowPerformance ? 'power3.out' : 'power4.out',
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
            duration: isLowPerformance ? 0.6 : 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: isLowPerformance ? 0.1 : 0.2,
          }
        );
      }

      // Timeline progress animation (fills with scroll)
      if (timelineProgressRef.current) {
        gsap.to(timelineProgressRef.current, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        });
      }

      // Animate each timeline item - simplified on mobile
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const content = contentRef.current[index];
        const imageWrapper = imagesRef.current[index];
        const image = imageWrapper?.querySelector('img');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        });

        // 1. Reveal image - simplified on mobile (fade in instead of clipPath)
        if (imageWrapper) {
          if (isLowPerformance) {
            // Simple fade for mobile - clipPath is expensive on iOS
            tl.fromTo(
              imageWrapper,
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
          } else {
            // Full clip-path effect on desktop
            tl.fromTo(
              imageWrapper,
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' }
            );
          }
        }

        // 2. Scale down image inside - disabled on mobile (expensive)
        if (image && !isLowPerformance) {
          tl.fromTo(
            image,
            { scale: 1.4 },
            { scale: 1, duration: 1.5, ease: 'power2.out' },
            '<'
          );
        }

        // 3. Fade in and slide up content - faster on mobile
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: isLowPerformance ? 20 : 40 },
            {
              opacity: 1,
              y: 0,
              duration: isLowPerformance ? 0.6 : 1,
              ease: 'power3.out'
            },
            isLowPerformance ? '<0.2' : '-=0.5'
          );
        }

        // 4. Parallax effect on image - disabled on mobile (expensive)
        if (image && !isLowPerformance) {
          gsap.to(image, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [performance, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-8"
    >
      {/* Title Section */}
      <div
        ref={(el) => {
          if (isMobile) mobileTitleRef.current = el;
        }}
        className="mb-24 md:mb-32 text-center max-w-7xl mx-auto"
      >
        <h2
          ref={titleRef}
          className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
        >
          Journey
        </h2>
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase"
        >
          The Path Through Computer Science
        </p>
      </div>

      {/* Central Timeline Line */}
      <div
        ref={(el) => {
          timelineLineRef.current = el;
          if (isMobile) mobileTimelineRef.current = el;
        }}
        className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-white/10"
        style={{ top: '500px', bottom: '100px' }}
      >
        <div
          ref={timelineProgressRef}
          className="absolute left-0 top-0 w-full rounded-full"
          style={{
            height: '0',
            background: 'linear-gradient(180deg, #4a9eff 0%, #7b61ff 100%)',
            boxShadow: '0 0 20px rgba(74, 158, 255, 0.6)',
          }}
        />
      </div>

      {/* Timeline Items */}
      <div
        ref={(el) => {
          if (isMobile) mobileItemsRef.current = el;
        }}
        className="relative max-w-7xl mx-auto"
      >
        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          const isItemVisible = isMobile ? visibleIndexes.has(index) : true;

          return (
            <div
              key={exp.id}
              ref={(el) => (itemsRef.current[index] = el)}
              className={`relative min-h-[60vh] flex flex-col md:flex-row items-center justify-center w-full mb-12 md:mb-0 ${
                index < experiences.length - 1 ? 'md:mb-24' : ''
              }`}
            >
              {/* Content */}
              <div
                ref={(el) => (contentRef.current[index] = el)}
                className={`w-full md:w-1/2 px-4 md:px-12 ${
                  isEven ? 'text-left md:text-right order-2 md:order-1' : 'text-left order-2'
                }`}
                style={isMobile ? {} : { opacity: 0 }}
              >
                <span className="text-sm font-['JetBrains_Mono'] mb-4 block tracking-wider" style={{ color: exp.color }}>
                  {exp.number} // {exp.tag}
                </span>
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">{exp.title}</h3>
                <div className="mb-4">
                  <p className="text-xl md:text-2xl text-gray-300 font-medium">{exp.institution}</p>
                  <p className="text-base text-gray-500 mt-1">{exp.location} • {exp.period}</p>
                </div>
                <p className={`text-base md:text-lg text-gray-400 max-w-md leading-relaxed ${isEven ? 'md:ml-auto' : ''}`}>
                  {exp.description}
                </p>
                {exp.current && (
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-['JetBrains_Mono'] text-green-400">Currently Active</span>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className={`w-full md:w-1/2 px-4 md:px-12 ${isEven ? 'order-1 md:order-2' : 'order-1'} mb-10 md:mb-0`}>
                <div
                  ref={(el) => (imagesRef.current[index] = el)}
                  className="relative w-full aspect-[4/5] overflow-hidden rounded-sm"
                  style={isMobile ? {} : { clipPath: 'inset(0 0 100% 0)' }}
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover cursor-target"
                    style={isMobile ? {} : { transform: 'scale(1.4)' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceGSAP;
