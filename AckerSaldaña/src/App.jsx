import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import Skills from './components/Skills'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from './hooks/useIntersectionObserver'

function AnimatedSection({ id, title }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  
  return (
    <motion.section 
      ref={ref}
      id={id} 
      className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-400 opacity-30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </motion.h2>
      </div>
    </motion.section>
  );
}

function App() {
  return (
    <div className="min-h-screen relative">
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      
      <div id="home">
        <Hero />
      </div>
      
      <AboutMe />

      <div id="skills">
        <Skills />
      </div>

      {/* Placeholder sections for future content */}
      <AnimatedSection id="projects" title="Projects Coming Soon" />
      <AnimatedSection id="experience" title="Experience Coming Soon" />
      <AnimatedSection id="contact" title="Contact Coming Soon" />
    </div>
  )
}

export default App
