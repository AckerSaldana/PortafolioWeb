const AboutMeWindow = () => {
  const skills = [
    { category: 'Frontend', items: ['React', 'Three.js', 'GSAP', 'Tailwind CSS','JavaScript'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'Supabase', 'Firebase', 'C++'] },
    { category: 'Tools', items: ['Git', 'Docker', 'Vite', 'Figma', 'Azure Devops'] },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/AckerSaldana', icon: 'gh:' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/acker-salda%C3%B1a-452351318/', icon: 'in:' },
    { name: 'Instagram', url: 'https://www.instagram.com/ackersal23/', icon: 'ig:' },
    { name: 'Email', url: 'mailto:codeasdf@outlook.com', icon: '@:' },
  ];

  return (
    <div
      className="h-full overflow-y-auto p-6 font-['Inter']"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Acker Saldaña</h1>
        <p className="text-[#0affc2] font-semibold mb-3">Software Engineer</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Passionate software engineer crafting elegant solutions to complex problems.
          Specialized in building interactive web experiences with modern technologies.
        </p>
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#0affc2]">{'<'}</span>
          Skills
          <span className="text-[#0affc2]">{'/>'}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.map((skillGroup) => (
            <div
              key={skillGroup.category}
              className="bg-white/3 border border-white/8 rounded-md p-3"
            >
              <div className="text-xs font-bold text-[#0affc2] mb-2 uppercase tracking-wider">
                {skillGroup.category}
              </div>
              <div className="space-y-1">
                {skillGroup.items.map((skill) => (
                  <div
                    key={skill}
                    className="text-xs text-gray-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#0affc2] rounded-full" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#0affc2]">{'<'}</span>
          Connect
          <span className="text-[#0affc2]">{'/>'}</span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/3 border border-white/8 rounded-md p-3 flex items-center gap-3 hover:bg-[#0affc2]/15 hover:border-[#0affc2] transition-all group"
            >
              <span className="text-[#0affc2] font-['JetBrains_Mono'] font-bold text-lg">{link.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#0affc2] transition-colors">
                  {link.name}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#0affc2]">{'<'}</span>
          About
          <span className="text-[#0affc2]">{'/>'}</span>
        </h2>
        <div className="bg-white/3 border border-white/8 rounded-md p-4 space-y-3 text-sm text-gray-300 leading-relaxed">
          <p>
            I'm a full-stack developer with a passion for creating beautiful, performant web applications.
            My expertise spans from interactive 3D graphics to scalable backend systems.
          </p>
          <p>
            When I'm not coding, you'll find me exploring new technologies, contributing to open source,
            or designing unique user experiences that push the boundaries of what's possible on the web.
          </p>
          <p className="text-[#0affc2] font-semibold">
            "Solving complex problems with elegant code."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMeWindow;
