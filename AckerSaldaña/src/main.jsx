import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/gsapConfig'
import App from './App.jsx'

// TEMPORARILY DISABLED STRICT MODE FOR DEBUGGING GSAP ISSUES
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
