import { useRef, useState } from 'react';
import gsap from 'gsap';
import { customEases } from '../utils/gsapConfig';

const ProjectCardGSAP = ({ project, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const contentRef = useRef(null);
  const borderRef = useRef(null);
  const chromaLayerRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        borderColor: '#00ff00',
        y: -8,
        rotateX: -2,
        rotateY: 2,
        z: 50,
        boxShadow: `
          0 30px 60px rgba(0, 255, 0, 0.3),
          0 0 40px rgba(0, 255, 0, 0.2),
          0 0 80px rgba(0, 255, 0, 0.1),
          inset 0 0 20px rgba(0, 255, 0, 0.05)
        `,
        duration: 0.4,
        ease: customEases.smooth,
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.25,
        duration: 0.4,
        ease: customEases.smooth,
      });
    }

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: -4,
        duration: 0.4,
        ease: customEases.smooth,
      });
    }

    if (borderRef.current) {
      gsap.to(borderRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: customEases.smooth,
      });
    }

    if (chromaLayerRef.current) {
      gsap.to(chromaLayerRef.current, {
        opacity: 0.6,
        duration: 0.2,
        ease: customEases.smooth,
      });
    }

    if (cursorRef.current) {
      gsap.fromTo(
        cursorRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        borderColor: '#333333',
        y: 0,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        boxShadow: '0 0 0 rgba(0, 255, 0, 0)',
        duration: 0.5,
        ease: customEases.smooth,
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: customEases.smooth,
      });
    }

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.4,
        ease: customEases.smooth,
      });
    }

    if (borderRef.current) {
      gsap.to(borderRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: customEases.smooth,
      });
    }

    if (chromaLayerRef.current) {
      gsap.to(chromaLayerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: customEases.smooth,
      });
    }

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        ease: customEases.smooth,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative bg-black/90 backdrop-blur-md border-2 border-[#333333] overflow-hidden font-['JetBrains_Mono'] group h-full flex flex-col transition-all ${
        featured ? 'min-h-[500px]' : 'min-h-[400px]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic Animated Border */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-sm opacity-0 pointer-events-none holographic-border"
        style={{
          background: 'linear-gradient(90deg, rgba(0,255,0,0.3), rgba(0,255,159,0.3), rgba(74,158,255,0.3), rgba(123,97,255,0.3), rgba(0,255,0,0.3))',
          backgroundSize: '200% 100%',
          animation: 'holographic-shift 3s linear infinite',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Chromatic Aberration Layer */}
      <div
        ref={chromaLayerRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          mixBlendMode: 'screen',
          background: `
            radial-gradient(circle at 30% 50%, rgba(255, 0, 64, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(0, 255, 159, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated phosphor glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Terminal Header with macOS traffic lights */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 border-b-2 border-[#333333] relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] hover:brightness-110 transition-all cursor-pointer phosphor-glow-box" />
          </div>
          <span className="text-[#666666] text-xs">-rwxr-xr-x</span>
          <span className="text-[#ffb000] text-xs font-bold">{project.category}/</span>
        </div>
        <span className="text-[#666666] text-xs">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Project Display */}
      <div ref={contentRef} className={`flex-1 flex flex-col ${featured ? 'p-8' : 'p-6'} relative z-10`}>
        {/* ASCII Art Header with Phosphor Glow */}
        <pre className={`phosphor-glow-text ${featured ? 'text-sm' : 'text-xs'} mb-6 overflow-hidden`} style={{ color: '#00ff00' }}>
{featured ? (
`╔${'═'.repeat(project.title.length + 2)}╗
║ ${project.title} ║
╚${'═'.repeat(project.title.length + 2)}╝`
) : (
`┌─────────────────────────────┐
│ ${project.title.padEnd(27).slice(0, 27)} │
└─────────────────────────────┘`
)}
        </pre>

        {/* Project Info */}
        <div className="space-y-5 flex-1">
          {/* Title */}
          <div>
            <span className="text-[#666666] text-xs flex items-center gap-2">
              <span className="text-[#00ff00] phosphor-glow-text">►</span> NAME:
            </span>
            <h3 className={`text-[#00ff00] phosphor-glow-text font-bold mt-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <div>
            <span className="text-[#666666] text-xs flex items-center gap-2">
              <span className="text-[#00ff00] phosphor-glow-text">►</span> DESC:
            </span>
            <p className={`text-[#00ff00]/90 mt-2 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="pt-2">
            <span className="text-[#666666] text-xs flex items-center gap-2 mb-3">
              <span className="text-[#00ff00] phosphor-glow-text">►</span> STACK:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className={`text-xs px-3 py-1.5 bg-black/70 border border-[#00ff00]/30 text-[#ffb000] hover:border-[#00ff00] hover:bg-[#00ff00]/10 hover:text-[#00ff00] hover:phosphor-glow-border transition-all cursor-pointer ${
                    featured ? 'text-sm px-4 py-2' : ''
                  }`}
                >
                  {tech.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Command Links */}
        <div className="mt-6 pt-6 border-t-2 border-[#333333]/50 space-y-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target flex items-center gap-2 text-sm text-[#00ff00] hover:bg-[#00ff00] hover:text-black px-4 py-2.5 transition-all border border-transparent hover:border-[#00ff00] hover:phosphor-glow-border group/link"
            >
              <span className="font-bold">$</span>
              <span className="group-hover/link:translate-x-2 transition-transform">
                git clone {project.title.toLowerCase().replace(/\s+/g, '-')}.git
              </span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target flex items-center gap-2 text-sm text-[#00ff00] hover:bg-[#00ff00] hover:text-black px-4 py-2.5 transition-all border border-transparent hover:border-[#00ff00] hover:phosphor-glow-border group/link"
            >
              <span className="font-bold">$</span>
              <span className="group-hover/link:translate-x-2 transition-transform">
                open {project.title.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Featured Badge with Glow */}
      {featured && (
        <div className="absolute top-20 right-4 px-4 py-1.5 bg-[#00ff00] text-black text-xs font-bold z-20 phosphor-glow-border">
          FEATURED
        </div>
      )}

      {/* Hover Effect - Blinking Terminal Cursor */}
      {isHovered && (
        <div ref={cursorRef} className="absolute bottom-6 right-6 z-20" style={{ opacity: 0 }}>
          <span className="text-[#00ff00] text-xl phosphor-glow-text animate-pulse font-bold">_</span>
        </div>
      )}

      {/* Enhanced Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
          }}
        />
      </div>

      {/* Corner Accents with Glow */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#00ff00]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 phosphor-glow-border" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#00ff00]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 phosphor-glow-border" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#00ff00]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 phosphor-glow-border" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#00ff00]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 phosphor-glow-border" />
    </div>
  );
};

export default ProjectCardGSAP;
