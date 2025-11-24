# Acker Saldaña - Portfolio

An interactive 3D portfolio website built with React, Three.js, and GSAP.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Interactive Features Guide

This portfolio includes several interactive elements to enhance your experience:

### 🖥️ Retro TV Monitor (Projects Section)

The vintage TV monitor showcases projects and includes interactive controls:

- **Power Button**: Click the power button below the screen to turn on the monitor
- **Channel Controls**: Use the channel buttons (◄ / ►) to browse different channels
  - Channel 0: Interactive Terminal
  - Channel 1: Projects Gallery
  - Channel 2: Retro Music Player
- **LED Indicator**: The LED shows the power status (red when on)

### 🎮 Interactive Terminal

When the TV is on Channel 0, you can interact with a working terminal:

- Click inside the terminal window to focus
- Type commands and press Enter
- Try commands like `help`, `about`, `projects`, or `clear`

### ✨ 3D Particle Background

The animated star field responds to your interactions:

- **Mouse Movement**: The particle colors shift as you move your mouse
- **Scroll Animation**: Stars change colors and speed based on scroll position
- **Planets**: Multiple orbiting 3D planets in the background
- **Hold Mouse Down**: Click and hold to accelerate planet rotations

### 🎯 Magnetic Buttons

Primary action buttons have a magnetic effect:

- Hover near buttons in the Hero section to see them pull toward your cursor
- Click for a satisfying particle burst animation

### 🎨 Smooth Scrolling

The entire site features buttery-smooth scrolling powered by Lenis, creating a premium browsing experience.

---

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Three.js + React Three Fiber** - 3D graphics
- **GSAP + ScrollTrigger** - Advanced animations
- **Lenis** - Smooth scrolling
- **Tailwind CSS v4** - Styling
- **Firebase Hosting** - Deployment

## Development

For detailed development information, see [CLAUDE.md](CLAUDE.md).

## Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```
