import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { HiArrowUp } from 'react-icons/hi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const heroTextRef = useRef(null);
  const backToTopRef = useRef(null);
  const [time, setTime] = useState(new Date());
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animations
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero text reveal
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (backToTopRef.current) {
      gsap.to(backToTopRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
      });
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') return;

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: SiGithub, href: 'https://github.com/AckerSaldana' },
    { name: 'LinkedIn', icon: SiLinkedin, href: 'https://www.linkedin.com/in/acker-saldaña-452351318/' },
  ];

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <footer ref={footerRef} className="relative w-full bg-black pt-48 pb-8 px-8 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#4a9eff]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[#7b61ff]/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1800px] mx-auto">
        {/* Hero CTA Section */}
        <div className="mb-32 md:mb-48 text-center">
          <div ref={heroTextRef} className="mb-16 md:mb-24">
            <h2 className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-black tracking-tighter text-white">
              <span className="block">LET'S CREATE</span>
              <span className="block">SOMETHING</span>
              <span className="block bg-gradient-to-r from-white via-[#4a9eff] to-[#7b61ff] bg-clip-text text-transparent">
                LEGENDARY
              </span>
            </h2>
          </div>

          {/* Horizontal divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          {/* Navigation - Compact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.3em] text-gray-500 mb-8">
              Navigation
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <div key={link.name}>
                  {location.pathname === '/' ? (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="cursor-target group text-gray-400 hover:text-white transition-colors text-lg font-['Inter'] flex items-center gap-2"
                    >
                      <span className="w-0 h-px bg-white group-hover:w-6 transition-all duration-300" />
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to="/"
                      onClick={() => {
                        setTimeout(() => scrollToSection(link.id), 100);
                      }}
                      className="cursor-target group text-gray-400 hover:text-white transition-colors text-lg font-['Inter'] flex items-center gap-2"
                    >
                      <span className="w-0 h-px bg-white group-hover:w-6 transition-all duration-300" />
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.3em] text-gray-500 mb-8">
              Connect
            </h3>
            <div className="space-y-6">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredSocial(link.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="cursor-target group flex items-center gap-4 text-gray-400 hover:text-white transition-all"
                  >
                    <div className="w-12 h-12 border border-white/20 group-hover:border-white flex items-center justify-center transition-all group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <span className="text-lg font-['Inter']">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.3em] text-gray-500 mb-8">
              Info
            </h3>
            <div className="space-y-4 text-gray-400 font-['Inter']">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Available for work</span>
              </div>
              <p className="text-sm">Monterrey, Mexico</p>
              <p className="text-xs text-gray-600 font-['JetBrains_Mono']">
                {time.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Back to Top - Right aligned */}
          <div className="md:col-span-3 flex justify-start md:justify-end">
            <button
              ref={backToTopRef}
              onClick={scrollToTop}
              className="cursor-target group flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 border-2 border-white/30 group-hover:border-white rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-2">
                <HiArrowUp size={32} className="text-white" />
              </div>
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">
                Top
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Bar - Ultra minimal */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-6 text-xs text-gray-600 font-['Inter']">
              <span>© {new Date().getFullYear()} Acker Saldaña</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">All rights reserved</span>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-4 text-xs text-gray-600 font-['Inter']">
              <span>Designed & Built by Acker</span>
              <span>•</span>
              <span className="font-['JetBrains_Mono']">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal corner decorations */}
      <div className="absolute bottom-0 left-0 w-px h-24 bg-gradient-to-t from-white/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-24 bg-gradient-to-t from-white/10 to-transparent" />
    </footer>
  );
};

export default Footer;
