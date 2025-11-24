import { projects } from '../data/projects';

const ProjectExplorer = () => {

  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-white/3 border border-white/8 rounded-md p-4 cursor-pointer transition-all hover:bg-[#0affc2]/15 hover:border-[#0affc2] group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-[#0affc2] font-bold text-sm group-hover:text-[#0affc2]">
                {project.title}
              </div>
              <div className="text-xs text-gray-500">#{(index + 1).toString().padStart(3, '0')}</div>
            </div>

            <div className="text-xs text-gray-400 mb-3 leading-relaxed">
              {project.description}
            </div>

            <div className="text-xs text-[#0affc2]/70 mb-3">
              &lt;{project.techStack.join(', ')}&gt;
            </div>

            <div className="flex gap-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-[#0affc2] transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub →
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
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
