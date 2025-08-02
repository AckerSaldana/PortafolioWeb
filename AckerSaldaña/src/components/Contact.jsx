import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SiGithub, SiLinkedin, SiGmail } from 'react-icons/si';
import { HiOutlineMail, HiOutlineClipboardCopy } from 'react-icons/hi';
import { BsSend } from 'react-icons/bs';

const Contact = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const formRef = useRef(null);

  const email = 'codeasdf@outlook.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual email sending with EmailJS or Formspree
    // For now, simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const socialLinks = [
    { name: 'GitHub', icon: SiGithub, href: 'https://github.com/AckerSaldana', color: '#ffffff' },
    { name: 'LinkedIn', icon: SiLinkedin, href: 'https://www.linkedin.com/in/acker-saldaña-452351318/', color: '#0077B5' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} id="contact" className="min-h-screen flex items-center justify-center px-8 py-20 relative z-10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-[#4a9eff]/20 rounded-full animate-pulse" />
        <div className="absolute bottom-40 left-1/3 w-1.5 h-1.5 bg-[#7b61ff]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Transmission waves effect when submitting */}
        {isSubmitting && (
          <>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 20, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-20 h-20 border-2 border-[#4a9eff]/30 rounded-full" />
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 20, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-20 h-20 border-2 border-[#7b61ff]/30 rounded-full" />
            </motion.div>
          </>
        )}
      </div>

      <motion.div 
        className="max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#4a9eff] text-2xl">✦</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white">
              Establish Connection
            </h2>
          </div>
          <p className="text-xl text-gray-400">
            Let's create something extraordinary together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                <div className="glass-card-inner-glow pointer-events-none" />
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-[#4a9eff]">{'<'}</span>
                  Send Transmission
                  <span className="text-[#4a9eff]">{'/>'}</span>
                </h3>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="relative">
                    <label 
                      htmlFor="name" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        focusedField === 'name' ? 'text-[#4a9eff]' : 'text-gray-400'
                      }`}
                    >
                      Identification
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4a9eff] focus:shadow-[0_0_15px_rgba(74,158,255,0.3)] transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label 
                      htmlFor="email" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        focusedField === 'email' ? 'text-[#4a9eff]' : 'text-gray-400'
                      }`}
                    >
                      Communication Channel
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4a9eff] focus:shadow-[0_0_15px_rgba(74,158,255,0.3)] transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="relative">
                    <label 
                      htmlFor="subject" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        focusedField === 'subject' ? 'text-[#4a9eff]' : 'text-gray-400'
                      }`}
                    >
                      Transmission Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4a9eff] focus:shadow-[0_0_15px_rgba(74,158,255,0.3)] transition-all"
                      placeholder="Project inquiry, collaboration, etc."
                    />
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <label 
                      htmlFor="message" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        focusedField === 'message' ? 'text-[#4a9eff]' : 'text-gray-400'
                      }`}
                    >
                      Message Data
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4a9eff] focus:shadow-[0_0_15px_rgba(74,158,255,0.3)] transition-all resize-none"
                      placeholder="Describe your project or idea..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="cursor-target w-full py-4 bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] text-white font-semibold rounded-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <BsSend size={18} />
                          Send Transmission
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#7b61ff] to-[#4a9eff]"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 text-center flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">✓</span>
                      Transmission successful! I'll respond soon.
                    </motion.div>
                  )}
                </div>
              </div>
            </form>
          </motion.div>

          {/* Direct Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Email Card */}
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
              <div className="glass-card-inner-glow pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-white mb-6">Direct Link</h3>
              
              <div className="space-y-6">
                {/* Email with Copy */}
                <div>
                  <p className="text-gray-400 mb-3">Preferred communication channel:</p>
                  <div className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-white/10">
                    <HiOutlineMail className="text-[#4a9eff] text-xl" />
                    <span className="text-white font-['JetBrains_Mono'] flex-1">{email}</span>
                    <motion.button
                      onClick={copyEmail}
                      className="cursor-target p-2 hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HiOutlineClipboardCopy className={`text-xl ${copiedEmail ? 'text-green-400' : 'text-gray-400'}`} />
                    </motion.button>
                  </div>
                  {copiedEmail && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 text-sm mt-2"
                    >
                      Email copied to clipboard!
                    </motion.p>
                  )}
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-gray-400 mb-3">Connect on platforms:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-white/10 hover:border-[#4a9eff]/50 transition-all group"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon 
                            size={24} 
                            className="transition-colors group-hover:text-[#4a9eff]"
                            style={{ color: link.color }}
                          />
                          <span className="text-white group-hover:text-[#4a9eff] transition-colors">
                            {link.name}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 10px rgba(74, 255, 74, 0.5)',
                          '0 0 20px rgba(74, 255, 74, 0.8)',
                          '0 0 10px rgba(74, 255, 74, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <p className="text-white font-medium">Currently Available</p>
                      <p className="text-gray-400 text-sm">Open to new projects and collaborations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;