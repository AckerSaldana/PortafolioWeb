import { useState } from 'react';

const ProjectExplorer = () => {
  const projects = [
    {
      id: 1,
      name: 'PathExplorer',
      desc: 'AI-powered talent management system with CV parsing, smart project matching, and workforce analytics',
      tech: 'React, Node.js, Supabase, OpenAI GPT',
      github: 'https://github.com/AckerSaldana/AMPL',
      demo: null
    },
    {
      id: 2,
      name: 'Aylinn Carré Portfolio',
      desc: 'Industrial design portfolio with sketch-style UI and Firebase-powered admin panel',
      tech: 'React 18, Firebase, Material-UI, Vite',
      github: 'https://github.com/AckerSaldana/AylinnCarre',
      demo: 'https://aylinncarre.com'
    },
    {
      id: 3,
      name: 'Sidney Kylie Architecture',
      desc: 'Minimalist architect portfolio with circular transitions and Apple-style animations',
      tech: 'React, CSS Modules, Custom Animations',
      github: 'https://github.com/AckerSaldana/SidneyKylie',
      demo: 'https://sidneykylie-d4e5e.web.app'
    },
    {
      id: 4,
      name: 'Portfolio v2.0',
      desc: 'Personal portfolio with 3D graphics, particle systems, and desktop OS interface',
      tech: 'React, Three.js, GSAP, Tailwind CSS',
      github: 'https://github.com/AckerSaldana',
      demo: null
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/3 border border-white/8 rounded-md p-4 cursor-pointer transition-all hover:bg-[#0affc2]/15 hover:border-[#0affc2] group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-[#0affc2] font-bold text-sm group-hover:text-[#0affc2]">
                {project.name}
              </div>
              <div className="text-xs text-gray-500">#{project.id.toString().padStart(3, '0')}</div>
            </div>

            <div className="text-xs text-gray-400 mb-3 leading-relaxed">
              {project.desc}
            </div>

            <div className="text-xs text-[#0affc2]/70 mb-3">
              &lt;{project.tech}&gt;
            </div>

            <div className="flex gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-[#0affc2] transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-[#0affc2]/10 border border-[#0affc2]/30 rounded hover:bg-[#0affc2]/20 hover:border-[#0affc2] transition-all text-[#0affc2]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectExplorer;
