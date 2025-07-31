import { motion } from 'framer-motion';
import TVScreen from './TVScreen';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const TVSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#4a9eff] text-2xl">✦</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Explore Projects
            </h2>
          </div>
          <p className="text-xl text-gray-400">
            Dive into my portfolio through the terminal
          </p>
        </motion.div>

        {/* TV Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={isVisible ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -15 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <TVScreen />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TVSection;