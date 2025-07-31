import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiGithub, SiLinkedin, SiGmail } from 'react-icons/si';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const [time, setTime] = useState(new Date());
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: '◆' },
    { name: 'About', href: '#about', icon: '◆' },
    { name: 'Skills', href: '#skills', icon: '◆' },
    { name: 'Projects', href: '/projects', icon: '◆' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: SiGithub, href: 'https://github.com/AckerSaldana', color: '#ffffff' },
    { name: 'LinkedIn', icon: SiLinkedin, href: 'https://www.linkedin.com/in/acker-saldaña-452351318/', color: '#0077B5' },
    { name: 'Email', icon: SiGmail, href: 'mailto:codeasdf@outlook.com', color: '#EA4335' },
  ];

  const scrollToSection = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-20 mt-32">
      {/* Divider - Conditional based on page */}
      <div className="w-full overflow-hidden mb-8">
        {isProjectsPage ? (
          // Terminal-style divider for projects page
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4aefff]/30 to-transparent"></div>
            <motion.div 
              className="px-6 font-['JetBrains_Mono'] text-[#4aefff]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <pre className="text-xs">
                {`[==============]`}
              </pre>
            </motion.div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4aefff]/30 to-transparent"></div>
          </div>
        ) : (
          // Space-style divider for main page
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <motion.div 
              className="px-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-[#4a9eff] text-2xl">✦</span>
            </motion.div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        {/* Background Effects - Conditional */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isProjectsPage ? (
            // Terminal scanlines effect for projects page
            <>
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(74, 239, 255, 0.1) 2px,
                    rgba(74, 239, 255, 0.1) 4px
                  )`
                }}
              />
              <motion.div 
                className="absolute inset-0 opacity-10"
                animate={{ 
                  backgroundPosition: ['0% 0%', '0% 100%'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  background: `linear-gradient(
                    180deg,
                    transparent 0%,
                    rgba(74, 239, 255, 0.1) 50%,
                    transparent 100%
                  )`,
                  backgroundSize: '100% 200%'
                }}
              />
            </>
          ) : (
            // Floating particles for main page
            <>
              <motion.div 
                className="absolute top-10 left-1/4 w-1 h-1 bg-white/20 rounded-full"
                animate={{ 
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-[#4a9eff]/30 rounded-full"
                animate={{ 
                  y: [20, -20, 20],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              />
              <motion.div 
                className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/15 rounded-full"
                animate={{ 
                  x: [-10, 10, -10],
                  opacity: [0.15, 0.4, 0.15]
                }}
                transition={{ duration: 12, repeat: Infinity, delay: 4 }}
              />
            </>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Navigation */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={`p-8 rounded-2xl relative overflow-hidden group ${isProjectsPage ? 'bg-black/60 border border-[#4aefff]/30' : 'glass-card'}`} style={{ position: 'relative', zIndex: 10 }}>
                {!isProjectsPage && <div className="glass-card-inner-glow pointer-events-none" />}
                
                <h3 className="text-white font-['Inter'] text-lg mb-6 flex items-center gap-3">
                  {isProjectsPage ? (
                    <>
                      <span className="text-[#4aefff] font-['JetBrains_Mono'] text-sm">~/nav$</span>
                      <motion.span
                        className="inline-block w-2 h-4 bg-[#4aefff]"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </>
                  ) : (
                    <>
                      <motion.span 
                        className="text-[#4a9eff]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✦
                      </motion.span>
                      Navigation
                    </>
                  )}
                </h3>
                
                <ul className="space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="text-gray-400 hover:text-white transition-all font-['Inter'] text-sm flex items-center gap-3 group relative z-20 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <motion.span 
                          className={`${isProjectsPage ? 'text-[#4aefff]' : 'text-[#4a9eff]'} text-xs`}
                          animate={hoveredLink === link.name ? { rotate: 180 } : { rotate: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isProjectsPage ? '>' : link.icon}
                        </motion.span>
                        <span className="relative">
                          {link.name}
                          {hoveredLink === link.name && (
                            <motion.div
                              className={`absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r ${isProjectsPage ? 'from-[#4aefff]' : 'from-[#4a9eff]'} to-transparent`}
                              layoutId="linkUnderline"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Connect */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className={`p-8 rounded-2xl relative overflow-hidden group ${isProjectsPage ? 'bg-black/60 border border-[#4aefff]/30' : 'glass-card'}`} style={{ position: 'relative', zIndex: 10 }}>
                {!isProjectsPage && <div className="glass-card-inner-glow pointer-events-none" />}
                
                <h3 className="text-white font-['Inter'] text-lg mb-6 flex items-center gap-3">
                  {isProjectsPage ? (
                    <>
                      <span className="text-[#4aefff] font-['JetBrains_Mono'] text-sm">~/connect$</span>
                      <motion.span
                        className="inline-block w-2 h-4 bg-[#4aefff]"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </>
                  ) : (
                    <>
                      <motion.span 
                        className="text-[#4a9eff]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        ✦
                      </motion.span>
                      Connect
                    </>
                  )}
                </h3>
                
                <ul className="space-y-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.li 
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <motion.a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setHoveredSocial(link.name)}
                          onMouseLeave={() => setHoveredSocial(null)}
                          className="flex items-center gap-4 group relative z-20 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <motion.div
                            className={`w-10 h-10 ${isProjectsPage ? 'rounded' : 'rounded-lg'} flex items-center justify-center transition-all duration-300`}
                            style={{ 
                              backgroundColor: hoveredSocial === link.name ? 
                                (isProjectsPage ? `${link.color}15` : `${link.color}20`) : 
                                (isProjectsPage ? 'rgba(74, 239, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)'),
                              border: `1px solid ${hoveredSocial === link.name ? 
                                (isProjectsPage ? `${link.color}30` : `${link.color}40`) : 
                                (isProjectsPage ? 'rgba(74, 239, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)')}`,
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Icon 
                              size={20} 
                              className="transition-colors"
                              style={{ color: hoveredSocial === link.name ? link.color : '#e0e0e0' }}
                            />
                          </motion.div>
                          <span className={`text-gray-400 hover:text-white transition-colors ${isProjectsPage ? "font-['JetBrains_Mono']" : "font-['Inter']"} text-sm`}>
                            {isProjectsPage ? `[${link.name}]` : link.name}
                          </span>
                        </motion.a>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className={`p-8 rounded-2xl relative overflow-hidden group ${isProjectsPage ? 'bg-black/60 border border-[#4aefff]/30' : 'glass-card'}`} style={{ position: 'relative', zIndex: 10 }}>
                {!isProjectsPage && <div className="glass-card-inner-glow pointer-events-none" />}
                
                <h3 className="text-white font-['Inter'] text-lg mb-6 flex items-center gap-3">
                  {isProjectsPage ? (
                    <>
                      <span className="text-[#4aefff] font-['JetBrains_Mono'] text-sm">~/status$</span>
                      <motion.span
                        className="inline-block w-2 h-4 bg-[#4aefff]"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </>
                  ) : (
                    <>
                      <motion.span 
                        className="text-[#4a9eff]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        ✦
                      </motion.span>
                      Status
                    </>
                  )}
                </h3>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {isProjectsPage ? (
                      <span className="text-green-400 font-['JetBrains_Mono'] text-sm">[OK]</span>
                    ) : (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            '0 0 10px rgba(74, 255, 74, 0.5)',
                            '0 0 20px rgba(74, 255, 74, 0.8)',
                            '0 0 10px rgba(74, 255, 74, 0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                    )}
                    <span className={`text-gray-400 ${isProjectsPage ? "font-['JetBrains_Mono']" : "font-['Inter']"} text-sm`}>
                      {isProjectsPage ? 'System status:' : 'System'} <span className="text-green-400">{isProjectsPage ? 'OPERATIONAL' : 'Online'}</span>
                    </span>
                  </motion.div>
                  
                  <div className="text-gray-400 font-['JetBrains_Mono'] text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`${isProjectsPage ? 'text-[#4aefff]' : 'text-[#4a9eff]'} text-xs`}>{isProjectsPage ? '>' : '▪'}</span>
                      <span>{isProjectsPage ? 'ver:' : 'Version'} <span className="text-white">1.0.0</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${isProjectsPage ? 'text-[#4aefff]' : 'text-[#4a9eff]'} text-xs`}>{isProjectsPage ? '>' : '▪'}</span>
                      <span>{isProjectsPage ? 'uptime:' : 'Time'} <span className="text-white">{time.toLocaleTimeString()}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${isProjectsPage ? 'text-[#4aefff]' : 'text-[#4a9eff]'} text-xs`}>{isProjectsPage ? '>' : '▪'}</span>
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker size={14} className={isProjectsPage ? 'text-[#4aefff]' : 'text-[#4a9eff]'} />
                        <span>{isProjectsPage ? 'loc:' : ''} Monterrey, N.L</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className={`text-gray-400 ${isProjectsPage ? "font-['JetBrains_Mono']" : "font-['Inter']"} text-sm`}>
                  {isProjectsPage ? `> Copyright (c) ${new Date().getFullYear()} Acker Saldaña` : `© ${new Date().getFullYear()} Acker Saldaña`}
                </p>
                <p className={`text-gray-500 ${isProjectsPage ? "font-['JetBrains_Mono']" : "font-['Inter']"} text-xs mt-2 flex items-center gap-2 justify-center md:justify-start`}>
                  {isProjectsPage ? (
                    <span>// Powered by caffeine and code</span>
                  ) : (
                    <span>Crafted with the love of space I got from my grandfather</span>
                  )}
                </p>
              </div>
              
              {/* Logo */}
              {isProjectsPage ? (
                <motion.div 
                  className="font-['JetBrains_Mono'] text-xs text-[#4aefff]/60"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <pre>
{`╔═╗╔═╗
╠═╣╚═╗ 
╩ ╩╚═╝ v1.0`}
                  </pre>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center gap-2 text-[#4a9eff]/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 blur-md bg-[#4a9eff]/20"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="relative text-2xl font-['JetBrains_Mono'] font-bold">AS</span>
                  </div>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#4a9eff]/30 to-transparent" />
                  <span className="text-xs font-['JetBrains_Mono']">2025</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;