# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

**Deployment:**
- `firebase deploy` - Deploy to Firebase hosting (requires Firebase CLI)

## Architecture Overview

This is a React portfolio website with advanced 3D graphics and animations built using:
- **Vite** as the build tool (simple config, no webpack)
- **React 19** with pure JavaScript/JSX (no TypeScript)
- **Tailwind CSS v4** with new CSS import syntax (`@import "tailwindcss"`)
- **Three.js + React Three Fiber** for 3D graphics
- **GSAP** with ScrollTrigger for scroll-based animations
- **Lenis** for smooth scrolling integrated with GSAP
- **Framer Motion** for UI animations
- **React Router** for navigation between homepage and projects page
- **Firebase Hosting** for deployment

### Key Architectural Patterns

1. **Smooth Scrolling System**:
   - [SmoothScroll.jsx](src/components/SmoothScroll.jsx) wraps the entire app with Lenis smooth scrolling
   - Integrated with GSAP ScrollTrigger via `gsap.ticker`
   - Exposes `window.lenis` globally for programmatic scrolling
   - Exports utility functions: `scrollTo()`, `stopScroll()`, `startScroll()`

2. **GSAP Animation System**:
   - Centralized config in [utils/gsapConfig.js](src/utils/gsapConfig.js) with custom eases, durations, and animation presets
   - ScrollTrigger registered globally with default settings
   - Components have GSAP-specific versions (e.g., `HeroGSAP.jsx`, `AboutMeGSAP.jsx`)
   - **Note**: StrictMode is temporarily disabled in [main.jsx](src/main.jsx) for GSAP debugging

3. **3D Scene Management**:
   - [ParticleBackground.jsx](src/components/ParticleBackground.jsx) manages the Three.js scene:
     - ~3000 particle star field with scroll-reactive color shifts
     - Multiple orbiting 3D planets loaded from GLB models in `public/models/`
     - Mouse interaction: hold down mouse to accelerate rotation
     - Scroll-based animation speed using ScrollTrigger
     - Performance optimizations via frustum culling and dynamic LOD

4. **Performance Optimization**:
   - [useDevicePerformance.js](src/hooks/useDevicePerformance.js) hook detects device capabilities
   - Dynamically adjusts quality based on:
     - Device memory, CPU cores, connection speed
     - Real-time FPS monitoring with auto-adjustment
     - Mobile detection for optimized rendering
   - Custom hooks in `src/hooks/` for reusable logic patterns

5. **Page Transitions**:
   - [TransitionContext.jsx](src/context/TransitionContext.jsx) manages navigation transitions
   - Preserves terminal state between page transitions
   - Controls transition timing and completion states

6. **Routing Structure**:
   - Two main routes: `/` (homepage) and `/projects` (projects page)
   - Homepage sections: Hero, About, Skills, Projects Preview (TV Section), Experience, Contact
   - All wrapped in `<TransitionProvider>` and `<SmoothScroll>`

7. **Component Naming Convention**:
   - Components with `GSAP` suffix use GSAP for animations (e.g., `HeroGSAP.jsx`)
   - Components without suffix may use Framer Motion or CSS animations
   - This allows gradual migration and A/B testing of animation approaches

8. **Custom Cursor**:
   - [TargetCursor.jsx](src/components/TargetCursor.jsx) implements custom cursor via DOM manipulation
   - Uses `cursor: none` globally in CSS
   - Performance optimized by avoiding React state updates

9. **Styling Approach**:
   - Tailwind v4 with custom CSS variables in [index.css](src/index.css)
   - Theme colors: `midnight`, `charcoal`, `ash`, `silver`, `pearl`, `accent`
   - Fonts: JetBrains Mono (code/mono), Inter (UI/sans-serif)
   - Uses `@theme` directive for Tailwind v4 customization

10. **Responsive Design System**:
   - [useBreakpoint.js](src/hooks/useBreakpoint.js) hook for granular breakpoint detection
   - Breakpoints: mobile (< 768px), tablet (768-1023px), desktop (1024-1439px), wide (1440px+)
   - Mobile-first approach with progressive enhancement
   - Touch-friendly UI with 44px minimum touch targets on mobile
   - Fluid typography using `clamp()` for responsive text scaling

## Development Notes

**Responsive Design Patterns:**
- Use `useBreakpoint` hook for conditional rendering based on screen size
- Use `useDevicePerformance` hook to adjust visual quality based on device capabilities
- Touch event handlers added to all interactive elements (drag, swipe, tap)
- All buttons and interactive elements have minimum 44px touch targets on mobile
- Fluid sizing with `clamp()` instead of fixed pixel values
- Viewport-based units (vw, vh) with min/max constraints

**Component-Specific Responsive Behavior:**
- **Window.jsx**: Auto-sizes to near-fullscreen on mobile, percentage-based on tablet, supports touch drag
- **DesktopOS.jsx**: Responsive grid layout (3 cols mobile, 4 cols tablet), larger touch targets, scrollable taskbar
- **ParticleBackground.jsx**: Reduces particle count (800 mobile, 1500 tablet, 3000 desktop), fewer comets/planets on mobile
- **TV Components**: Use `clamp()` for all dimensions, hide 3D faces on mobile for performance
- **Custom Cursor**: Automatically hidden on mobile/touch devices

**Breakpoint Usage:**
```javascript
import useBreakpoint from './hooks/useBreakpoint';

const { isMobile, isTablet, isDesktop, windowSize } = useBreakpoint();

// Conditional rendering
if (isMobile) {
  return <MobileView />;
}

// Responsive values
const columns = isMobile ? 2 : isTablet ? 3 : 4;
```

**Performance on Mobile:**
- ParticleBackground reduces to 800 particles on mobile (from 3000)
- Only 1 comet on mobile (from 4)
- Planets hidden on mobile devices
- 3D effects simplified or disabled on low-performance devices
- Antialiasing disabled on low-performance devices
- DPR capped at 1.5 on mobile (vs 2 on desktop)



**Working with 3D Models:**
- GLB files stored in `public/models/`
- Update the `planets` array in [ParticleBackground.jsx](src/components/ParticleBackground.jsx) to add new planets
- Models are loaded asynchronously with React Suspense fallbacks

**Adding Animations:**
- Import presets from [utils/gsapConfig.js](src/utils/gsapConfig.js): `animations.fadeIn`, `customEases.smooth`, etc.
- Use ScrollTrigger for scroll-based animations
- Test with `ScrollTrigger.refresh()` if layout changes dynamically

**Performance Considerations:**
- Particle count varies by device: 800 (mobile), 1500 (tablet), 3000 (desktop)
- `useDevicePerformance` hook auto-adjusts quality based on FPS and device capabilities
- Performance levels: 'low', 'medium', 'high' - adjust complexity accordingly
- Use `will-change` CSS property sparingly
- Three.js frustum culling enabled for off-screen objects
- Disable expensive effects on `performance === 'low'` devices

**Smooth Scrolling:**
- Access Lenis instance via `window.lenis`
- Use exported utilities: `scrollTo('#section-id')`, `stopScroll()`, `startScroll()`
- Lenis settings configured in [SmoothScroll.jsx](src/components/SmoothScroll.jsx)

**Firebase Deployment:**
- Build output goes to `dist/` directory
- Firebase config in [firebase.json](firebase.json) uses SPA rewrites
- Run `npm run build` before `firebase deploy`
