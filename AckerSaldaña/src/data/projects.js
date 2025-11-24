/**
 * Projects Data
 * Centralized project information for portfolio showcase
 */

export const projects = [
  {
    id: 'project-1',
    slug: 'portfolio-v2',
    title: 'Portfolio v2.0',
    tagline: 'Interactive Space Odyssey',
    description: 'A performance-first portfolio with 3D graphics, GSAP animations, and space-themed narrative. Features include interactive 3D TV, particle systems, and playable Pong game.',
    category: 'Web Development',
    image: '/images/projects/portfolio.jpg', // Update with actual path
    video: null,
    techStack: ['React', 'Three.js', 'GSAP', 'Tailwind CSS v4', 'Vite', 'Firebase'],
    links: {
      live: 'https://your-portfolio.com',
      github: 'https://github.com/yourusername/portfolio',
    },
    metrics: {
      duration: '3 months',
      team: 'Solo',
      impact: 'Awwwards Nominee'
    },
    featured: true,
    year: 2024
  },
  {
    id: 'project-2',
    slug: 'project-name-2',
    title: 'Project Name 2',
    tagline: 'Short compelling tagline',
    description: 'Detailed description of the project, what problem it solves, and how you built it. Focus on impact and innovation.',
    category: 'Full Stack',
    image: '/images/projects/project-2.jpg',
    video: null,
    techStack: ['React', 'Node.js', 'MongoDB', 'Docker'],
    links: {
      live: 'https://project2.com',
      github: 'https://github.com/yourusername/project2',
    },
    metrics: {
      duration: '2 months',
      team: '3 developers',
      impact: '+200% performance boost'
    },
    featured: true,
    year: 2024
  },
  {
    id: 'project-3',
    slug: 'project-name-3',
    title: 'Project Name 3',
    tagline: 'Another great project',
    description: 'Description focusing on technical challenges, solutions implemented, and results achieved. Highlight unique features.',
    category: 'Mobile App',
    image: '/images/projects/project-3.jpg',
    video: null,
    techStack: ['React Native', 'Python', 'PostgreSQL'],
    links: {
      live: 'https://project3.com',
      github: 'https://github.com/yourusername/project3',
    },
    metrics: {
      duration: '4 months',
      team: 'Solo',
      impact: '10k+ users'
    },
    featured: true,
    year: 2023
  },
  {
    id: 'project-4',
    slug: 'project-name-4',
    title: 'Project Name 4',
    tagline: 'Innovative solution',
    description: 'Project description highlighting the problem space, your approach, and the technology choices you made.',
    category: 'AI/ML',
    image: '/images/projects/project-4.jpg',
    video: null,
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    links: {
      live: null, // Private or internal project
      github: 'https://github.com/yourusername/project4',
    },
    metrics: {
      duration: '6 months',
      team: '2 developers',
      impact: '95% accuracy'
    },
    featured: true,
    year: 2023
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
