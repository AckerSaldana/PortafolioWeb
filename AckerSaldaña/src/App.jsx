import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import ParticleBackground from './components/ParticleBackground'
import TargetCursor from './components/TargetCursor'
import Skills from './components/Skills'
import TVSection from './components/TVSection'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Projects from './pages/Projects'
import { TransitionProvider } from './context/TransitionContext'
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

function HomePage() {
  return (
    <div className="min-h-screen relative">
      <TargetCursor />
      <ParticleBackground />
      <Navbar />
      
      <div id="home">
        <Hero />
      </div>
      
      <AboutMe />

      <div id="skills">
        <Skills />
      </div>

      <div id="projects">
        <TVSection />
      </div>

      <div id="experience">
        <Experience />
      </div>

      <Contact />
      
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </TransitionProvider>
    </Router>
  )
}

export default App
