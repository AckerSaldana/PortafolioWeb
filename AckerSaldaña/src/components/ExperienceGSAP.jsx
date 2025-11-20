import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { customEases, durations } from '../utils/gsapConfig';

const ExperienceGSAP = () => {
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

    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
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
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: 0.2,
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

      // Animate each timeline item
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

        // 1. Reveal image with clip-path mask effect
        if (imageWrapper) {
          tl.fromTo(
            imageWrapper,
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' }
          );
        }

        // 2. Scale down image inside (parallax zoom effect)
        if (image) {
          tl.fromTo(
            image,
            { scale: 1.4 },
            { scale: 1, duration: 1.5, ease: 'power2.out' },
            '<' // Start at same time as previous
          );
        }

        // 3. Fade in and slide up content
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.5' // Start slightly before image finishes
          );
        }

        // 4. Parallax effect on image during scroll
        if (image) {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full py-32 md:py-64 px-4 md:px-8"
    >
      {/* Title Section */}
      <div className="mb-32 md:mb-48 text-center max-w-7xl mx-auto">
        <h2
          ref={titleRef}
          className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
        >
          Journey
        </h2>
        <p ref={subtitleRef} className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase">
          The Path Through Computer Science
        </p>
      </div>

      {/* Central Timeline Line */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-white/10"
        ref={timelineLineRef}
        style={{ top: '500px', bottom: '100px' }}>
        <div
          ref={timelineProgressRef}
          className="absolute left-0 top-0 w-full h-0 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #4a9eff 0%, #7b61ff 100%)',
            boxShadow: '0 0 20px rgba(74, 158, 255, 0.6)',
          }}
        />
      </div>

      {/* Timeline Items */}
      <div className="relative max-w-7xl mx-auto">
        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={exp.id}
              ref={(el) => (itemsRef.current[index] = el)}
              className={`relative min-h-[60vh] flex flex-col md:flex-row items-center justify-center w-full mb-32 md:mb-0 ${
                index < experiences.length - 1 ? 'md:mb-48' : ''
              }`}
            >
              {/* Content */}
              <div
                ref={(el) => (contentRef.current[index] = el)}
                className={`w-full md:w-1/2 px-4 md:px-12 ${
                  isEven ? 'text-left md:text-right order-2 md:order-1' : 'text-left order-2'
                } opacity-0`}
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
                  style={{ clipPath: 'inset(0 0 100% 0)' }}
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover cursor-target"
                    style={{ transform: 'scale(1.4)' }}
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
