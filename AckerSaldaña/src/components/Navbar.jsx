import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectsPage = location.pathname === '/projects';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolled down more than 100px or on projects page
      if (currentScrollY > 100 || isProjectsPage) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      // Update active section based on scroll position (only on homepage)
      if (!isProjectsPage) {
        const sections = navItems.map(item => ({
          id: item.id,
          element: document.getElementById(item.id)
        })).filter(item => item.element);
        
        const currentSection = sections.find(section => {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
          setActiveSection(currentSection.id);
        }
      } else {
        setActiveSection('projects');
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll, { passive: true });
  }, [isProjectsPage]);

  const scrollToSection = (sectionId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsMobileMenuOpen(false);

    // If we're on the projects page and trying to go to a homepage section
    if (isProjectsPage && sectionId !== 'projects') {
      // Navigate to homepage first, then scroll after navigation completes
      navigate('/', { replace: false });
      // Wait for navigation and component mount
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Use Lenis smooth scroll if available
          if (window.lenis) {
            // Account for viewport scale when calculating scroll position
            const scale = parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue('--viewport-scale') || 1
            );
            const top = element.offsetTop * scale;
            window.lenis.scrollTo(top, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    }
    // If we're on homepage or trying to go to projects from homepage
    else if (sectionId === 'projects' && !isProjectsPage) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Use Lenis smooth scroll if available
        if (window.lenis) {
          // Account for viewport scale when calculating scroll position
          const scale = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--viewport-scale') || 1
          );
          const top = element.offsetTop * scale;
          window.lenis.scrollTo(top, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    // Same page scrolling
    else {
      const element = document.getElementById(sectionId);
      if (element) {
        // Use Lenis smooth scroll if available
        if (window.lenis) {
          // Account for viewport scale when calculating scroll position
          const scale = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--viewport-scale') || 1
          );
          const top = element.offsetTop * scale;
          window.lenis.scrollTo(top, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl"
        >
          <div className="relative">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4a9eff] via-[#7b61ff] to-[#4a9eff] opacity-20 blur-sm" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4a9eff] via-[#7b61ff] to-[#4a9eff] opacity-10 animate-gradient" />
            
            {/* Starfield effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute top-2 left-10 w-0.5 h-0.5 bg-white/30 rounded-full" />
              <div className="absolute top-4 right-20 w-0.5 h-0.5 bg-white/20 rounded-full" />
              <div className="absolute bottom-3 left-1/3 w-0.5 h-0.5 bg-white/25 rounded-full" />
              <div className="absolute top-3 right-1/4 w-0.5 h-0.5 bg-white/20 rounded-full" />
            </div>
            
            {/* Main navbar container */}
            <div className="relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-[#4a9eff]/10">
              <div className="px-8 py-3">
                <div className="flex items-center justify-between">
                {/* Logo/Name */}
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <span className="text-[#4a9eff] text-2xl">✦</span>
                    <div className="absolute inset-0 blur-sm bg-[#4a9eff]/30" />
                  </motion.div>
                  <span className="text-lg font-bold text-white">
                    Acker Saldaña
                  </span>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={(e) => scrollToSection(item.id, e)}
                      className="cursor-target relative group px-4 py-2 rounded-full transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`relative z-10 text-sm font-medium transition-all ${
                        activeSection === item.id 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                      
                      {/* Active indicator */}
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-[#4a9eff]/20 to-[#7b61ff]/20 rounded-full"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="cursor-target md:hidden text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="px-8 py-4 space-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => scrollToSection(item.id, e)}
                        className={`cursor-target block w-full text-left py-2 text-sm font-medium transition-colors ${
                          activeSection === item.id
                            ? 'text-[#4a9eff]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;