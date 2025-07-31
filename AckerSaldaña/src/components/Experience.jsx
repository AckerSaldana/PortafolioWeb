import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { FaGraduationCap, FaUniversity } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { MdLocationOn } from 'react-icons/md';

const Experience = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const experiences = [
    {
      id: 1,
      title: "Master's in Advanced Computer Science",
      institution: "University of Hull",
      location: "Hull, United Kingdom",
      period: "2025 - Present",
      status: "7th Semester Exchange Program",
      description: "Enrolled in an international exchange program for advanced studies in computer science, focusing on cutting-edge technologies and research methodologies.",
      highlights: [
        "International academic experience",
        "Advanced algorithms and data structures",
        "Machine learning and AI",
        "Research methodologies"
      ],
      icon: HiAcademicCap,
      color: "#4a9eff",
      current: true
    },
    {
      id: 2,
      title: "B.S. in Computer Science and Technology",
      institution: "Tecnológico de Monterrey",
      location: "Monterrey, Mexico",
      period: "2021 - 2025",
      status: "Currently in 7th Semester",
      description: "Pursuing Ingeniero en Tecnologías Computacionales (ITC), developing strong foundations in software engineering, algorithms, and system design.",
      highlights: [
        "Full-stack development",
        "Software engineering principles",
        "Database systems",
        "Computer networks",
        "Mobile app development"
      ],
      icon: FaGraduationCap,
      color: "#61dafb",
      current: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren"
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
        type: "spring",
        damping: 20,
        stiffness: 100
      },
    },
  };

  const lineVariants = {
    hidden: { 
      scaleY: 0,
      opacity: 0 
    },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        opacity: { duration: 0.3 }
      },
    },
  };

  return (
    <section ref={ref} id="experience" className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-10 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <motion.div 
        className="max-w-6xl mx-auto w-full relative"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Section Title */}
        <motion.div variants={titleVariants} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#4a9eff] text-2xl">✦</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white">
              Academic Journey
            </h2>
          </div>
          <p className="text-xl text-gray-400">
            My educational path in computer science
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Central timeline line */}
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4a9eff]/30 to-transparent"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ 
              delay: 0.8,
              duration: 0.8,
              ease: "easeOut",
              opacity: { duration: 0.3 }
            }}
            style={{ transformOrigin: 'top' }}
          />
          
          {/* Traveling light effect */}
          {isVisible && (
            <motion.div
              className="absolute left-8 md:left-1/2 w-px h-20 -translate-x-1/2"
              initial={{ top: '-10%', opacity: 0 }}
              animate={{ 
                top: '110%', 
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 1,
                delay: 1,
                ease: "easeInOut"
              }}
              style={{
                background: 'linear-gradient(to bottom, transparent, #4a9eff, transparent)',
                filter: 'blur(2px)',
                boxShadow: '0 0 20px #4a9eff'
              }}
            />
          )}

          {/* Experience cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={exp.id}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  transition={{ delay: index * 0.3 + 1.4 }}
                  className={`relative flex items-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
                >
                  {/* Timeline node */}
                  <motion.div 
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ 
                      delay: index * 0.3 + 1.6,
                      duration: 0.5,
                      type: "spring",
                      damping: 15
                    }}
                  >
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.2 }}
                    >
                      {/* Glow effect for current */}
                      {exp.current && (
                        <motion.div
                          className="absolute -inset-4 rounded-full"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            background: `radial-gradient(circle, ${exp.color}40 0%, transparent 70%)`,
                            filter: 'blur(8px)'
                          }}
                        />
                      )}
                      
                      {/* Main circle */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center relative bg-[#0a0a0a]"
                        style={{ 
                          border: `2px solid ${exp.color}`,
                        }}
                      >
                        <FaGraduationCap size={24} style={{ color: exp.color }} />
                        
                        {/* Rotating ring for current */}
                        {exp.current && (
                          <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{
                              background: `conic-gradient(from 0deg, transparent, ${exp.color}30, transparent)`,
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Content card */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:ml-auto md:pl-20' : 'md:mr-auto md:pr-20'} pl-24 md:pl-0 md:pr-0`}>
                    <motion.div 
                      className="glass-card p-8 rounded-2xl relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="glass-card-inner-glow pointer-events-none" />
                      
                      {/* Period badge */}
                      <div className="flex items-center gap-4 mb-4">
                        <span 
                          className="text-sm font-['JetBrains_Mono'] px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${exp.color}20`,
                            color: exp.color,
                            border: `1px solid ${exp.color}40`
                          }}
                        >
                          {exp.period}
                        </span>
                        {exp.current && (
                          <motion.span 
                            className="text-xs font-['JetBrains_Mono'] text-green-400 flex items-center gap-2"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            Current
                          </motion.span>
                        )}
                      </div>

                      {/* Title and institution */}
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUniversity className="text-gray-400" size={16} />
                        <p className="text-lg text-gray-300 font-['Inter']">{exp.institution}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <MdLocationOn className="text-gray-400" size={16} />
                        <p className="text-sm text-gray-400">{exp.location}</p>
                      </div>

                      {/* Status */}
                      <p className="text-sm font-['JetBrains_Mono'] text-[#4a9eff] mb-4">{exp.status}</p>

                      {/* Description */}
                      <p className="text-gray-300 mb-6 leading-relaxed">{exp.description}</p>

                      {/* Highlights */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Key Focus Areas:</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.highlights.map((highlight, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Future indicator */}
          <motion.div 
            className="relative flex items-center justify-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ 
              delay: experiences.length * 0.3 + 1.8,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-gray-500 text-xl">?</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;