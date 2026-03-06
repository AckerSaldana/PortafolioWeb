import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HeroGSAP from './components/HeroGSAP'
import AboutMeGSAP from './components/AboutMeGSAP'
import TargetCursor from './components/TargetCursor'
import SkillsGSAP from './components/SkillsGSAP'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ExperienceGSAP from './components/ExperienceGSAP'
import ContactGSAP from './components/ContactGSAP'
import { TransitionProvider } from './context/TransitionContext'
import { motion } from 'framer-motion'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'
import { useResponsiveScaler } from './hooks/useResponsiveScaler'

// Lazy load heavy components — Three.js canvas and TV section are large dependency trees
const ParticleBackground = lazy(() => import('./components/ParticleBackground'))
const TVSectionGSAP = lazy(() => import('./components/TVSectionGSAP'))
const ProjectsGSAP = lazy(() => import('./pages/ProjectsGSAP'))
const CursorDebug = lazy(() => import('./components/CursorDebug'))

function HomePage() {
  const { wrapperRef } = useResponsiveScaler({
    designWidth: 2400,
    designHeight: 1080,
    minScale: 0.3,
    maxScale: 1.0,
    mobileBreakpoint: 768,
    centerContent: true,
    debounceDelay: 150
  });

  // Debug mode - enable with ?debug=cursor in URL
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'cursor';

  return (
    <div className="relative w-full" style={{ background: '#0a0a0a' }}>
      <TargetCursor />
      <ScrollProgress />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      {isDebugMode && (
        <Suspense fallback={null}>
          <CursorDebug />
        </Suspense>
      )}

      {/* Navbar outside scaled wrapper for full-width display */}
      <Navbar />

      {/* Scalable content wrapper */}
      <div ref={wrapperRef} className="scaler-wrapper">
        <div id="home">
          <HeroGSAP />
        </div>

        <AboutMeGSAP />

        <div id="skills">
          <SkillsGSAP />
        </div>

        <div id="projects">
          <Suspense fallback={null}>
            <TVSectionGSAP />
          </Suspense>
        </div>

        <div id="experience">
          <ExperienceGSAP />
        </div>
      </div>

      {/* Contact and Footer outside scaled wrapper for full-width display */}
      <ContactGSAP />
      <Footer />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
                  <Route path="/projects" element={
                    <Suspense fallback={null}>
                      <ProjectsGSAP />
                    </Suspense>
                  } />
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
