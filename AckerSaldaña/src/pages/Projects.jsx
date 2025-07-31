import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersistentTerminal from '../components/PersistentTerminal';
import ProjectCard from '../components/ProjectCard';
import CustomCursor from '../components/CustomCursor';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';

const Projects = () => {
  const { isTransitioning, completeTransition, terminalConfig, preserveTerminal, resetTransition } = useTransition();
  const [filter, setFilter] = useState('all');
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [terminalReady, setTerminalReady] = useState(false);
  const fullText = 'Projects';
  
  // Sample projects data - replace with your actual projects
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web-apps',
      description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
      github: 'https://github.com/yourusername/project',
      demo: 'https://demo.com',
      image: '/project1.png'
    },
    {
      id: 2,
      title: 'Task Management System',
      category: 'web-apps',
      description: 'Collaborative task management tool with real-time updates',
      tech: ['Next.js', 'Socket.io', 'MongoDB', 'JWT'],
      github: 'https://github.com/yourusername/project',
      demo: 'https://demo.com',
      image: '/project2.png'
    },
    {
      id: 3,
      title: 'CLI Development Tool',
      category: 'tools',
      description: 'Command-line tool for automating development workflows',
      tech: ['Python', 'Click', 'Docker'],
      github: 'https://github.com/yourusername/project',
      demo: null,
      image: '/project3.png'
    },
    {
      id: 4,
      title: '3D Portfolio Visualizer',
      category: 'experiments',
      description: 'Interactive 3D visualization of portfolio projects using Three.js',
      tech: ['Three.js', 'React Three Fiber', 'GLSL'],
      github: 'https://github.com/yourusername/project',
      demo: 'https://demo.com',
      image: '/project4.png'
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
  }, [isTransitioning, completeTransition, preserveTerminal, resetTransition]);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="min-h-screen relative">
      <CustomCursor />
      
      {/* Terminal Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <PersistentTerminal
          terminalKey={preserveTerminal ? "tv-terminal" : "projects-terminal"}
          scale={1}
          containerStyle={{ 
            width: '100%', 
            height: '100%',
          }}
          tint="#00ff00"
          scanlineIntensity={0.1}
          glitchAmount={0.3}
          flickerAmount={0.2}
          curvature={0.05}
          chromaticAberration={0.1}
          mouseReact={false}
          brightness={0.3}
          noiseAmp={0.2}
          digitSize={1.8}
          pageLoadAnimation={false}
        />
      </motion.div>

      {/* Solid background for content */}
      <div className="fixed inset-0 bg-black z-[1]" />

      {/* Terminal Scanline Effect */}
      <div className="terminal-scanline" />

      {/* Content */}
      <motion.div 
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Terminal Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#333333]"
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
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse" />
                <span className="text-[#00ff00] font-['JetBrains_Mono'] text-xs">CONNECTED</span>
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
                    className={`px-4 py-2 text-sm transition-all border ${
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
                  transition={{ duration: 0.5, delay: 0.8 + (0.1 * index) }}
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