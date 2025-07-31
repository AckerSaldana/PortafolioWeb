import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersistentTerminal from '../components/PersistentTerminal';
import ProjectCard from '../components/ProjectCard';
import CustomCursor from '../components/CustomCursor';
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
    { id: 'all', name: 'All Projects', command: '> ls -la' },
    { id: 'web-apps', name: 'Web Applications', command: '> cd /web-apps' },
    { id: 'tools', name: 'Developer Tools', command: '> cd /tools' },
    { id: 'experiments', name: 'Experiments', command: '> cd /experiments' }
  ];

  useEffect(() => {
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
          tint="#4aefff"
          scanlineIntensity={0.2}
          glitchAmount={0.8}
          flickerAmount={0.6}
          curvature={0.1}
          chromaticAberration={0.3}
          mouseReact={true}
          brightness={0.6}
          noiseAmp={0.5}
          digitSize={1.8}
          pageLoadAnimation={false}
        />
      </motion.div>

      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/40 z-[1]" />

      {/* Content */}
      <motion.div 
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: showContent ? 0 : -100 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-['JetBrains_Mono'] text-sm">back to main</span>
            </Link>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="pt-32 px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Title with typing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-16 relative"
            >
              {/* Title background */}
              <div className="absolute inset-0 -inset-x-8 -inset-y-4 bg-gradient-to-r from-black/90 via-black/80 to-transparent rounded-lg blur-xl" />
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-['JetBrains_Mono'] font-bold mb-4">
                  <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    <span className="text-[#4aefff]">$</span> {typedText}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1 h-14 md:h-16 bg-white ml-3 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  />
                </h1>
                <p className="text-gray-300 font-['Inter'] text-lg md:text-xl">
                  Showcasing my work and experiments
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 font-['JetBrains_Mono']">
                  <span>// {filteredProjects.length} projects</span>
                  <span>• {categories.find(c => c.id === filter)?.name || 'All'}</span>
                </div>
              </div>
            </motion.div>

            {/* Filter Categories */}
            <motion.div 
              className="mb-12 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-4 font-['JetBrains_Mono'] text-sm rounded-lg transition-all backdrop-blur-md ${
                    filter === category.id
                      ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(74,158,255,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{
                    border: filter === category.id ? '1px solid rgba(74, 158, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="block text-xs text-[#4aefff] mb-1">{category.command}</span>
                  <span className="block font-semibold">{category.name}</span>
                  {filter === category.id && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-to-r from-[#4aefff]/10 to-transparent rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
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
    </div>
  );
};

export default Projects;