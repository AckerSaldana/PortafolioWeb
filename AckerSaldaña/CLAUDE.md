# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a React portfolio website with advanced 3D graphics built using:
- **Vite** as the build tool (no webpack config needed)
- **React 19** with pure JavaScript/JSX (no TypeScript)
- **Tailwind CSS v4** with CSS imports (new syntax)
- **Three.js + React Three Fiber** for 3D graphics
- **Framer Motion** for animations

### Key Architectural Patterns

1. **3D Scene Management**: The `ParticleBackground` component manages a complex Three.js scene with:
   - Particle star field system
   - Multiple orbiting 3D planet models (GLB format)
   - Animated comets with custom shaders
   - Performance optimizations via frustum culling

2. **Animation System**: Heavy use of Framer Motion for UI animations, combined with Three.js for 3D animations. Custom cursor uses DOM manipulation for performance.

3. **Styling Approach**: Tailwind CSS v4 with custom CSS variables defined in `index.css`. Theme colors and fonts are centralized as CSS custom properties.

4. **Component Structure**: Simple, flat component structure in `src/components/`. Each component is self-contained with its own styling and logic.

## Development Considerations

- **3D Models**: GLB files in `public/`. To add new models, place them in public directory and update the `planets` array in `ParticleBackground.jsx`
- **Performance**: Be mindful of particle count and 3D model complexity. Current setup handles ~1000 particles efficiently
- **Custom Cursor**: Implemented via DOM manipulation for better performance than React state updates
- **Tailwind v4**: Uses new CSS import syntax (`@import "tailwindcss"`) instead of directives

## Common Tasks

**Adding a new section:**
1. Create component in `src/components/`
2. Import and add to `App.jsx`
3. Use existing animation patterns from other components

**Modifying 3D scene:**
1. Edit `ParticleBackground.jsx`
2. Adjust particle count, planet positions, or animation speeds
3. Test performance impact with dev tools

**Updating theme:**
1. Modify CSS custom properties in `src/index.css`
2. Theme colors: midnight, charcoal, ash, silver, pearl, accent
3. Fonts: JetBrains Mono (code), Inter (UI)