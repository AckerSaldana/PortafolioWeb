import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { passive: true });
  }, []);

  const roles = ['Software Engineer', 'Full Stack Developer', 'Problem Solver'];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative min-h-screen flex flex-col justify-center px-8 overflow-hidden z-10">
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(74, 158, 255, 0.15), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-base font-['JetBrains_Mono'] text-[#4a9eff] mb-4">Hello, I'm</h2>
          
          <h1 className="text-5xl md:text-7xl font-bold font-['Inter'] text-[#e0e0e0] mb-6">
            Acker Saldaña
          </h1>

          <div className="h-16 mb-8 flex items-center">
            <motion.p
              key={currentRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-xl md:text-2xl text-gray-300 font-['Inter']"
            >
              {roles[currentRole]}
            </motion.p>
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
            Crafting elegant solutions to complex problems. Passionate about clean code, 
            innovative design, and building experiences that make a difference.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-target px-8 py-3 bg-[#4a9eff] text-[#0a0a0a] font-medium rounded-lg hover:bg-[#3a8eef] transition-colors relative z-20"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => navigate('/projects')}
            >
              View Projects
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-target px-8 py-3 border border-[#4a9eff] text-[#4a9eff] font-medium rounded-lg hover:bg-[#4a9eff]/10 transition-colors relative z-20"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 15, 0],
            opacity: showArrow ? 1 : 0
          }}
          transition={{ 
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-400 text-sm font-['JetBrains_Mono'] uppercase tracking-wider">Scroll</span>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;