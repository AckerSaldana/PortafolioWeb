/**
 * Projects Data
 * Centralized project information for portfolio showcase
 */

export const projects = [
  {
    id: 'project-1',
    slug: 'path-explorer',
    title: 'PathExplorer',
    tagline: 'AI-Powered Talent Management',
    description: 'AI-powered talent management system with CV parsing, smart project matching, and workforce analytics',
    category: 'Full Stack',
    image: '/images/projects/pathexplorer.jpg',
    video: null,
    techStack: ['React', 'Node.js', 'Supabase', 'OpenAI GPT'],
    links: {
      live: null,
      github: 'https://github.com/AckerSaldana/AMPL',
    },
    metrics: {
      duration: '4 months',
      team: 'Team Project',
      impact: 'AI-driven matching'
    },
    featured: true,
    year: 2024
  },
  {
    id: 'project-2',
    slug: 'aylinn-carre',
    title: 'Aylinn Carré Portfolio',
    tagline: 'Industrial Design Showcase',
    description: 'Industrial design portfolio with sketch-style UI and Firebase-powered admin panel',
    category: 'Web Development',
    image: '/images/projects/aylinn.jpg',
    video: null,
    techStack: ['React 18', 'Firebase', 'Material-UI', 'Vite'],
    links: {
      live: 'https://aylinncarre.com',
      github: 'https://github.com/AckerSaldana/AylinnCarre',
    },
    metrics: {
      duration: '2 months',
      team: 'Solo',
      impact: 'Client Portfolio'
    },
    featured: true,
    year: 2024
  },
  {
    id: 'project-3',
    slug: 'sidney-kylie',
    title: 'Sidney Kylie Architecture',
    tagline: 'Minimalist Architecture Portfolio',
    description: 'Minimalist architect portfolio with circular transitions and Apple-style animations',
    category: 'Web Development',
    image: '/images/projects/sidney.jpg',
    video: null,
    techStack: ['React', 'CSS Modules', 'Custom Animations'],
    links: {
      live: 'https://sidneykylie-d4e5e.web.app',
      github: 'https://github.com/AckerSaldana/SidneyKylie',
    },
    metrics: {
      duration: '3 weeks',
      team: 'Solo',
      impact: 'Premium Design'
    },
    featured: true,
    year: 2024
  },
  {
    id: 'project-4',
    slug: 'portfolio-v2',
    title: 'Portfolio v2.0',
    tagline: 'Interactive Space Odyssey',
    description: 'Personal portfolio with 3D graphics, particle systems, and desktop OS interface',
    category: 'Web Development',
    image: '/images/projects/portfolio.jpg',
    video: null,
    techStack: ['React', 'Three.js', 'GSAP', 'Tailwind CSS'],
    links: {
      live: null,
      github: 'https://github.com/AckerSaldana',
    },
    metrics: {
      duration: '2 months',
      team: 'Solo',
      impact: 'Portfolio Showcase'
    },
    featured: true,
    year: 2024
  }
];

/**
 * Get featured projects for homepage showcase
 */
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured);
};

/**
 * Get project by slug
 */
export const getProjectBySlug = (slug) => {
  return projects.find(project => project.slug === slug);
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category) => {
  return projects.filter(project => project.category === category);
};

/**
 * Get projects by year
 */
export const getProjectsByYear = (year) => {
  return projects.filter(project => project.year === year);
};

export default projects;
