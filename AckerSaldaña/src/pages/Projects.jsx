import { motion } from 'framer-motion';
import { useState, useEffect, lazy, Suspense } from 'react';
import ProjectCard from '../components/ProjectCard';
import TargetCursor from '../components/TargetCursor';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';
import useDevicePerformance from '../hooks/useDevicePerformance';
import useIsMobile from '../hooks/useIsMobile';

// Lazy load the terminal for better initial page load
const PersistentTerminal = lazy(() => import('../components/PersistentTerminal'));
const CSSTerminal = lazy(() => import('../components/CSSTerminal'));

const Projects = () => {
  const { isTransitioning, completeTransition, terminalConfig, preserveTerminal, resetTransition } = useTransition();
  const { performance } = useDevicePerformance();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState('all');
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [terminalReady, setTerminalReady] = useState(false);
  const [useLiteMode, setUseLiteMode] = useState(false);
  const fullText = 'Projects';
  
  // Get terminal quality settings based on device performance
  const getTerminalQuality = () => {
    if (performance === 'low' || isMobile) {
      return {
        scanlineIntensity: 0.05,
        glitchAmount: 0.1,
        flickerAmount: 0.1,
        curvature: 0.02,
        chromaticAberration: 0.05,
        brightness: 0.4,
        noiseAmp: 0.1,
        digitSize: 2.5,
        dpr: 1,
        qualityLevel: 0.3
      };
    } else if (performance === 'medium') {
      return {
        scanlineIntensity: 0.08,
        glitchAmount: 0.2,
        flickerAmount: 0.15,
        curvature: 0.03,
        chromaticAberration: 0.08,
        brightness: 0.35,
        noiseAmp: 0.15,
        digitSize: 2.0,
        dpr: 1.5,
        qualityLevel: 0.6
      };
    } else {
      // High performance - original settings
      return {
        scanlineIntensity: 0.1,
        glitchAmount: 0.3,
        flickerAmount: 0.2,
        curvature: 0.05,
        chromaticAberration: 0.1,
        brightness: 0.3,
        noiseAmp: 0.2,
        digitSize: 1.8,
        dpr: 2,
        qualityLevel: 1.0
      };
    }
  };
  
  const terminalQuality = getTerminalQuality();
  
  // Sample projects data - replace with your actual projects
  const projects = [
    {
      id: 1,
      title: 'PathExplorer - AI Talent Platform',
      category: 'web-apps',
      description: 'AI-powered talent management system with CV parsing, smart project matching, and workforce analytics',
      tech: ['React', 'Node.js', 'Supabase', 'OpenAI GPT', 'Material UI'],
      github: 'https://github.com/AckerSaldana/AMPL',
      demo: null,
      image: '/project1.png'
    },
    {
      id: 2,
      title: 'Aylinn Carré Portfolio',
      category: 'web-apps',
      description: 'Industrial design portfolio with sketch-style UI, dynamic gallery filtering, and Firebase-powered admin panel',
      tech: ['React 18', 'Firebase', 'Material-UI', 'Vite', 'Custom CSS'],
      github: 'https://github.com/AckerSaldana/AylinnCarre',
      demo: 'https://aylinncarre.com',
      image: '/project2.png'
    },
    {
      id: 3,
      title: 'Sidney Kylie Architecture Portfolio',
      category: 'web-apps',
      description: 'Minimalist architect portfolio with circular transitions, parallax effects, and Apple-style scroll animations',
      tech: ['React', 'React Router', 'CSS Modules', 'Custom Animations'],
      github: 'https://github.com/AckerSaldana/SidneyKylie',
      demo: 'https://sidneykylie-d4e5e.web.app',
      image: '/project3.png'
    },
    {
      id: 4,
      title: 'CLI Development Tool',
      category: 'tools',
      description: 'Command-line tool for automating development workflows',
      tech: ['Python', 'Click', 'Docker'],
      github: 'https://github.com/yourusername/project',
      demo: null,
      image: '/project4.png'
    },
    {
      id: 5,
      title: '3D Portfolio Visualizer',
      category: 'experiments',
      description: 'Interactive 3D visualization of portfolio projects using Three.js',
      tech: ['Three.js', 'React Three Fiber', 'GLSL'],
      github: 'https://github.com/yourusername/project',
      demo: 'https://demo.com',
      image: '/project5.png'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', command: 'ls -la' },
    { id: 'web-apps', name: 'Web Applications', command: 'cd web-apps/' },
    { id: 'tools', name: 'Developer Tools', command: 'cd tools/' },
    { id: 'experiments', name: 'Experiments', command: 'cd experiments/' }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check localStorage for lite mode preference
    const savedLiteMode = localStorage.getItem('terminal-lite-mode');
    if (savedLiteMode === 'true' || performance === 'low') {
      setUseLiteMode(true);
    }
    
    // Handle transition from TV
    if (isTransitioning && preserveTerminal) {
      // Terminal is already running from TV, don't reinitialize
      setTerminalReady(true);
      
      // Complete the transition after terminal is ready
      setTimeout(() => {
        completeTransition();
        setShowContent(true);
      }, 800);
    } else {
      // Direct navigation - show everything normally
      setTerminalReady(true);
      setTimeout(() => {
        setShowContent(true);
      }, 400);
    }

    // Typing animation starts after content is shown
    const typingTimer = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 100);
    }, isTransitioning ? 1200 : 800);

    // Cleanup transition state when leaving
    return () => {
      clearTimeout(typingTimer);
      if (preserveTerminal) {
        resetTransition();
      }
    };
  }, [isTransitioning, completeTransition, preserveTerminal, resetTransition, performance]);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="min-h-screen relative">
      <TargetCursor />
      
      {/* Terminal Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <Suspense fallback={
          <div className="w-full h-full bg-black relative overflow-hidden">
            {/* Simple CSS terminal effect while loading */}
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 3px)',
              opacity: 0.03
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#00ff00] font-['JetBrains_Mono'] text-sm animate-pulse">
                INITIALIZING TERMINAL...
              </div>
            </div>
          </div>
        }>
          {useLiteMode ? (
            <CSSTerminal tint="#00ff00" />
          ) : (
            <PersistentTerminal
              terminalKey={preserveTerminal ? "tv-terminal" : "projects-terminal"}
              scale={1}
              containerStyle={{ 
                width: '100%', 
                height: '100%',
              }}
              tint="#00ff00"
              scanlineIntensity={terminalQuality.scanlineIntensity}
              glitchAmount={terminalQuality.glitchAmount}
              flickerAmount={terminalQuality.flickerAmount}
              curvature={terminalQuality.curvature}
              chromaticAberration={terminalQuality.chromaticAberration}
              mouseReact={false}
              brightness={terminalQuality.brightness}
              noiseAmp={terminalQuality.noiseAmp}
              digitSize={terminalQuality.digitSize}
              dpr={terminalQuality.dpr}
              qualityLevel={terminalQuality.qualityLevel}
              pageLoadAnimation={false}
            />
          )}
        </Suspense>
      </motion.div>

      {/* Solid background for content */}
      <div className="fixed inset-0 bg-black z-[1]" />

      {/* Terminal Scanline Effect */}
      <div className="terminal-scanline" />

      {/* Content */}
      <motion.div 
        className="relative z-[5] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Terminal Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-[#333333]"
          initial={{ y: -100 }}
          animate={{ y: showContent ? 0 : -100 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors group font-['JetBrains_Mono'] text-sm">
                  <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                  <span>cd ..</span>
                </Link>
                <span className="text-[#666666] font-['JetBrains_Mono'] text-sm">|</span>
                <span className="text-[#ffb000] font-['JetBrains_Mono'] text-sm">user@portfolio:~/projects$</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Performance Mode Toggle */}
                <button
                  onClick={() => {
                    const newLiteMode = !useLiteMode;
                    setUseLiteMode(newLiteMode);
                    localStorage.setItem('terminal-lite-mode', newLiteMode.toString());
                  }}
                  className="cursor-target text-[#00ff00] font-['JetBrains_Mono'] text-xs hover:text-[#00ff00]/80 transition-colors"
                  title={useLiteMode ? "Switch to Full Terminal" : "Switch to Lite Mode"}
                >
                  [{useLiteMode ? 'LITE' : 'FULL'}]
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse" />
                  <span className="text-[#00ff00] font-['JetBrains_Mono'] text-xs">CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="pt-32 px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Terminal Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12 bg-black border border-[#333333] p-6 font-['JetBrains_Mono']"
            >
              <div className="text-[#666666] text-sm mb-2">
                Last login: {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="mb-4">
                <span className="text-[#ffb000]">user@portfolio</span>
                <span className="text-[#00ff00]">:</span>
                <span className="text-[#4a9eff]">~/projects</span>
                <span className="text-[#00ff00]">$ </span>
                <span className="text-[#00ff00]">{typedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-5 bg-[#00ff00] ml-1"
                />
              </div>
              <div className="text-[#00ff00] text-sm">
                # Showcasing my work and experiments
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-[#666666]">
                <span>total {filteredProjects.length}</span>
                <span>-rw-r--r--</span>
                <span>{categories.find(c => c.id === filter)?.name || 'All Projects'}</span>
              </div>
            </motion.div>

            {/* Terminal Commands Filter */}
            <motion.div 
              className="mb-12 bg-black border border-[#333333] p-4 font-['JetBrains_Mono']"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-[#666666] text-xs mb-3">SELECT CATEGORY:</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-target px-4 py-2 text-sm transition-all border ${
                      filter === category.id
                        ? 'bg-[#00ff00] text-black border-[#00ff00]'
                        : 'bg-black text-[#00ff00] border-[#333333] hover:border-[#00ff00]'
                    }`}
                  >
                    <span className="text-[#ffb000]">$ </span>
                    <span>{category.command}</span>
                    {filter === category.id && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-1.5 h-3 bg-black ml-1 align-middle"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: showContent ? 0.8 + Math.min(0.05 * index, 0.2) : 0 // Cap delay to prevent long waits
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Projects;