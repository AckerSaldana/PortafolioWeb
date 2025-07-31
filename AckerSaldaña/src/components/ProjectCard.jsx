import { motion } from 'framer-motion';
import { useState } from 'react';
import { SiGithub } from 'react-icons/si';
import { HiExternalLink } from 'react-icons/hi';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [bootSequence, setBootSequence] = useState([]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Simulate boot sequence
    const sequences = [
      'Initializing...',
      'Loading modules...',
      'System ready.',
    ];
    
    sequences.forEach((text, index) => {
      setTimeout(() => {
        setBootSequence(prev => [...prev, text]);
      }, index * 200);
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setBootSequence([]), 300);
  };

  return (
    <motion.div
      className="relative bg-black/90 border border-gray-800 rounded-lg overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
        </div>
        <span className="font-['JetBrains_Mono'] text-xs text-gray-500">
          {project.category}/
        </span>
      </div>

      {/* Project Image / ASCII Art */}
      <div className="relative h-48 bg-gray-950 overflow-hidden">
        {project.image ? (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
            {/* Placeholder for actual image */}
            <div className="w-full h-full flex items-center justify-center">
              <pre className="text-[#4aefff] text-xs font-['JetBrains_Mono'] opacity-20">
{`
   ╔═══════════════╗
   ║               ║
   ║   [PROJECT]   ║
   ║               ║
   ╚═══════════════╝
`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <pre className="text-[#4aefff] text-xs font-['JetBrains_Mono']">
{`
   ╔═══════════════╗
   ║               ║
   ║   [PROJECT]   ║
   ║               ║
   ╚═══════════════╝
`}
            </pre>
          </div>
        )}

        {/* Boot sequence overlay */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4"
          >
            {bootSequence.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-400 text-xs font-['JetBrains_Mono']"
              >
                {'>'} {text}
              </motion.p>
            ))}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-['JetBrains_Mono'] font-bold text-[#4aefff] mb-2">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 font-['Inter'] leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-['JetBrains_Mono'] mb-2">
            $ stack --list
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-900 text-green-400 rounded font-['JetBrains_Mono']"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-4 border-t border-gray-800">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#4aefff] transition-colors font-['JetBrains_Mono']"
            >
              <SiGithub size={16} />
              <span>{'>'} view_source</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#4aefff] transition-colors font-['JetBrains_Mono']"
            >
              <HiExternalLink size={16} />
              <span>{'>'} live_demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Glitch effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 mix-blend-screen" />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;