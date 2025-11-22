import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HeroGSAP from './components/HeroGSAP'
import AboutMeGSAP from './components/AboutMeGSAP'
import ParticleBackground from './components/ParticleBackground'
import TargetCursor from './components/TargetCursor'
import SkillsGSAP from './components/SkillsGSAP'
import TVSectionGSAP from './components/TVSectionGSAP'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ExperienceGSAP from './components/ExperienceGSAP'
import ContactGSAP from './components/ContactGSAP'
import ProjectsGSAP from './pages/ProjectsGSAP'
import { TransitionProvider } from './context/TransitionContext'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from './hooks/useIntersectionObserver'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'

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

function HomePage() {
  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0a' }}>
      <TargetCursor />
      <ScrollProgress />
      <ParticleBackground />
      <Navbar />

      <div id="home">
        <HeroGSAP />
      </div>

      <AboutMeGSAP />

      <div id="skills">
        <SkillsGSAP />
      </div>

      <div id="projects">
        <TVSectionGSAP />
      </div>

      <div id="experience">
        <ExperienceGSAP />
      </div>

      <ContactGSAP />

      <Footer />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true); // Enabled for dramatic entrance

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Router>
            <SmoothScroll>
              <TransitionProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsGSAP />} />
                </Routes>
              </TransitionProvider>
            </SmoothScroll>
          </Router>
        </motion.div>
      )}
    </>
  )
}

export default App
