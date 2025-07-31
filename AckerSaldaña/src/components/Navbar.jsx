import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects', isLink: true, path: '/projects' },
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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isProjectsPage]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2a]/50">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo/Name */}
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-[#4a9eff] text-xl">✦</span>
                  <span className="text-xl font-bold text-white">Acker Saldaña</span>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((item) => (
                    item.isLink ? (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`relative text-sm font-medium transition-colors ${
                          activeSection === item.id 
                            ? 'text-[#4a9eff]' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <motion.div
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                        >
                          {item.label}
                          {activeSection === item.id && (
                            <motion.div
                              layoutId="navbar-indicator"
                              className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#4a9eff]"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`relative text-sm font-medium transition-colors ${
                          activeSection === item.id 
                            ? 'text-[#4a9eff]' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        {item.label}
                        {activeSection === item.id && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#4a9eff]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    )
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-gray-400 hover:text-white transition-colors"
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

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#2a2a2a]/50"
                >
                  <div className="px-8 py-4 space-y-4">
                    {navItems.map((item) => (
                      item.isLink ? (
                        <Link
                          key={item.id}
                          to={item.path}
                          className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                            activeSection === item.id 
                              ? 'text-[#4a9eff]' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                            activeSection === item.id 
                              ? 'text-[#4a9eff]' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
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