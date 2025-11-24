import { useState } from 'react';

const SkillsWindow = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const skillsData = [
    { name: 'React', level: 95, category: 'frontend', color: '#61dafb' },
    { name: 'Three.js', level: 85, category: 'frontend', color: '#000000' },
    { name: 'GSAP', level: 90, category: 'frontend', color: '#88ce02' },
    { name: 'Tailwind CSS', level: 92, category: 'frontend', color: '#06b6d4' },
    { name: 'JavaScript', level: 95, category: 'frontend', color: '#f7df1e' },
    { name: 'Node.js', level: 88, category: 'backend', color: '#68a063' },
    { name: 'Python', level: 82, category: 'backend', color: '#3776ab' },
    { name: 'Supabase', level: 80, category: 'backend', color: '#3ecf8e' },
    { name: 'Firebase', level: 85, category: 'backend', color: '#ffca28' },
    { name: 'PostgreSQL', level: 78, category: 'backend', color: '#336791' },
    { name: 'Git', level: 90, category: 'tools', color: '#f05032' },
    { name: 'Docker', level: 75, category: 'tools', color: '#2496ed' },
    { name: 'Vite', level: 88, category: 'tools', color: '#646cff' },
    { name: 'Figma', level: 85, category: 'tools', color: '#f24e1e' },
  ];

  const categories = [
    { id: 'all', name: 'All Skills', icon: '*' },
    { id: 'frontend', name: 'Frontend', icon: 'ui' },
    { id: 'backend', name: 'Backend', icon: 'srv' },
    { id: 'tools', name: 'Tools', icon: 'dev' },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? skillsData
      : skillsData.filter((skill) => skill.category === activeCategory);

  return (
    <div
      className="h-full overflow-y-auto p-6 font-['Inter']"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Technical Skills</h1>
        <p className="text-gray-400 text-sm">
          A comprehensive overview of my technical expertise and proficiency levels
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeCategory === category.id
                ? 'bg-[#0affc2] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <span className="mr-2 font-['JetBrains_Mono']">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {filteredSkills.map((skill, index) => (
          <div
            key={skill.name}
            className="group"
            style={{
              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white group-hover:text-[#0affc2] transition-colors">
                {skill.name}
              </span>
              <span className="text-xs font-mono text-gray-500">
                {skill.level}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0affc2] to-[#0affc2]/60 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${skill.level}%`,
                  animation: `slideIn 0.8s ease-out ${index * 0.1}s both`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/3 border border-white/8 rounded-md p-2 text-center">
            <div className="font-bold text-[#0affc2]">90-100%</div>
            <div className="text-gray-500">Expert</div>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-md p-2 text-center">
            <div className="font-bold text-white">80-89%</div>
            <div className="text-gray-500">Advanced</div>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-md p-2 text-center">
            <div className="font-bold text-white">70-79%</div>
            <div className="text-gray-500">Intermediate</div>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-md p-2 text-center">
            <div className="font-bold text-white">{'<70%'}</div>
            <div className="text-gray-500">Beginner</div>
          </div>
        </div>
      </div>

      {/* Add animations via style tag */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsWindow;
