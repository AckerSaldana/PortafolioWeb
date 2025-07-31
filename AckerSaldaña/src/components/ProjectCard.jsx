import { motion } from 'framer-motion';
import { useState } from 'react';
import { SiGithub } from 'react-icons/si';
import { HiExternalLink } from 'react-icons/hi';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-black border border-[#333333] overflow-hidden font-['JetBrains_Mono'] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ borderColor: '#00ff00' }}
      transition={{ duration: 0.2 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-[#333333]">
        <div className="flex items-center gap-4">
          <span className="text-[#666666] text-xs">-rwxr-xr-x</span>
          <span className="text-[#ffb000] text-xs">{project.category}/</span>
        </div>
        <span className="text-[#666666] text-xs">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Project Display */}
      <div className="p-4">
        {/* ASCII Art Header */}
        <pre className="text-[#00ff00] text-xs mb-4 overflow-hidden">
{`┌─────────────────────────────┐
│ ${project.title.padEnd(27).slice(0, 27)} │
└─────────────────────────────┘`}
        </pre>

        {/* Project Info */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <span className="text-[#666666] text-xs">NAME:</span>
            <h3 className="text-[#00ff00] text-lg font-bold">{project.title}</h3>
          </div>

          {/* Description */}
          <div>
            <span className="text-[#666666] text-xs">DESC:</span>
            <p className="text-[#00ff00]/80 text-sm mt-1">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <span className="text-[#666666] text-xs">STACK:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-black border border-[#333333] text-[#ffb000]"
                >
                  {tech.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-4 pt-4 border-t border-[#333333] space-y-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#00ff00] hover:bg-[#00ff00] hover:text-black px-2 py-1 transition-colors inline-flex"
            >
              <span>$</span>
              <span>git clone {project.title.toLowerCase().replace(/\s+/g, '-')}.git</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#00ff00] hover:bg-[#00ff00] hover:text-black px-2 py-1 transition-colors inline-flex"
            >
              <span>$</span>
              <span>open {project.title.toLowerCase().replace(/\s+/g, '-')}</span>
            </a>
          )}
        </div>
      </div>

      {/* Hover Effect - Terminal Cursor */}
      {isHovered && (
        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-[#00ff00] text-xs">_</span>
        </motion.div>
      )}

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;