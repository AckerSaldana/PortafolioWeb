import { motion } from 'framer-motion';
import CodeDisplay from './CodeDisplay';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AboutMe = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const paragraphVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const codeDisplayVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} id="about" className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10">
      <motion.div 
        className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div variants={titleVariants} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#4a9eff] text-2xl">✦</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              About Me
            </h2>
          </div>
          <p className="text-xl text-gray-400">
            Get to know me better
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.p 
              variants={paragraphVariants}
              className="text-xl text-gray-300 leading-relaxed font-['Inter']"
            >
              I'm a <span className="text-[#4a9eff] font-semibold">Computer Science student</span> at Tecnológico de Monterrey, 
              currently pursuing a Master's degree in Advanced Computer Science at the University of Hull. My passion lies in 
              solving complex problems through clean, scalable software solutions. I specialize in modern web development with 
              <span className="text-[#4a9eff]"> React</span> and <span className="text-[#4a9eff]">JavaScript</span>, robust databases using 
              <span className="text-[#4a9eff]"> PostgreSQL</span> and <span className="text-[#4a9eff]">MySQL</span>, and creating immersive 
              3D experiences with <span className="text-[#4a9eff]">Three.js</span>.
            </motion.p>
            <motion.p 
              variants={paragraphVariants}
              className="text-xl text-gray-300 leading-relaxed font-['Inter']"
            >
              Beyond technical skills, I'm driven by curiosity for emerging technologies and continuous learning. I'm also pursuing 
              an International Diploma to develop multicultural competencies, believing that diverse perspectives and inclusive 
              environments are key to innovation. For me, programming is about building bridges between technology and human needs, 
              creating software that makes a genuine difference.
            </motion.p>
            <motion.div 
              variants={buttonVariants}
              className="flex gap-4 pt-4"
            >
              <button className="px-6 py-2 bg-[#4a9eff]/10 text-[#4a9eff] border border-[#4a9eff]/30 rounded-lg hover:bg-[#4a9eff]/20 transition-colors">
                Download CV
              </button>
              <button className="px-6 py-2 bg-[#4a9eff]/10 text-[#4a9eff] border border-[#4a9eff]/30 rounded-lg hover:bg-[#4a9eff]/20 transition-colors">
                GitHub Profile
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div variants={codeDisplayVariants}>
            <CodeDisplay />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;