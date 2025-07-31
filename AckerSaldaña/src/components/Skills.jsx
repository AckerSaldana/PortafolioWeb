import { motion } from 'framer-motion';
import { 
  SiCplusplus,
  SiJavascript,
  SiPython,
  SiSwift,
  SiReact,
  SiNextdotjs,
  SiThreedotjs,
  SiNodedotjs,
  SiMysql,
  SiPostgresql,
  SiGit 
} from 'react-icons/si';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const skillCategories = [
    {
      title: 'Languages',
      skills: [
        { name: 'C++', icon: SiCplusplus, color: '#00599C' },
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
        { name: 'Python', icon: SiPython, color: '#3776AB' },
        { name: 'Swift', icon: SiSwift, color: '#FA7343' },
      ]
    },
    {
      title: 'Frontend',
      skills: [
        { name: 'React', icon: SiReact, color: '#61DAFB' },
        { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
        { name: 'Three.js', icon: SiThreedotjs, color: '#ffffff' },
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
        { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      ]
    },
    {
      title: 'Tools',
      skills: [
        { name: 'Git', icon: SiGit, color: '#F05032' },
      ]
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10">
      {/* Subtle space background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-30 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <motion.div 
        className="max-w-6xl mx-auto w-full relative"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div variants={titleVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#4a9eff] text-2xl">✦</span>
            <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider text-white">
              My Stack
            </h2>
          </div>
          
          <p className="text-xl text-gray-400 text-center mb-16">
            Technologies I work with
          </p>

          <motion.div className="space-y-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                variants={categoryVariants}
                className="relative"
              >
                {/* Category title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-4">
                  <span className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#4a9eff]/30 relative overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent animate-shimmer"></span>
                  </span>
                  {category.title}
                </h3>

                {/* Skills grid */}
                <motion.div 
                  className="flex flex-wrap gap-6 pl-0 md:pl-24"
                  variants={containerVariants}
                >
                  {category.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      variants={skillVariants}
                      className="group relative"
                      custom={index}
                    >
                      <div className="relative flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-500 group-hover:scale-[1.02] glass-card">
                        {/* Icon/Badge */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ 
                            backgroundColor: `${skill.color}15`,
                            color: skill.color,
                            boxShadow: `0 0 25px ${skill.color}20`,
                            border: `1px solid ${skill.color}30`,
                          }}
                        >
                          <skill.icon size={26} />
                        </div>
                        
                        {/* Skill name */}
                        <span className="text-gray-300 font-['Inter'] font-medium group-hover:text-white transition-colors">
                          {skill.name}
                        </span>

                        {/* Inner glow */}
                        <div className="glass-card-inner-glow" />
                        
                        {/* Hover glow */}
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${skill.color}10 0%, transparent 70%)`,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;