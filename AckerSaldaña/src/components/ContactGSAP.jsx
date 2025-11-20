import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { HiOutlineMail, HiOutlineClipboardCopy } from 'react-icons/hi';
import { BsSend } from 'react-icons/bs';
import { customEases, durations } from '../utils/gsapConfig';

const ContactGSAP = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const contactInfoRef = useRef(null);
  const buttonRef = useRef(null);
  const particlesRef = useRef([]);
  const successRef = useRef(null);

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
  const [transmissionStatus, setTransmissionStatus] = useState('');

  const email = 'codeasdf@outlook.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Multi-stage transmission animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setTransmissionStatus('');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Success animation - Award-winning style
        if (successRef.current) {
          const tl = gsap.timeline();

          // Backdrop fade in
          tl.fromTo(
            successRef.current.querySelector('.absolute.inset-0'),
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.out' }
          );

          // Main text reveal with scale and blur
          tl.fromTo(
            successRef.current.querySelector('h1'),
            {
              opacity: 0,
              scale: 1.2,
              filter: 'blur(20px)',
            },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power3.out',
            },
            '-=0.2'
          );

          // Subtext stagger
          tl.fromTo(
            successRef.current.querySelectorAll('.space-y-2 p'),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
            },
            '-=0.5'
          );

          // Signal bars
          tl.fromTo(
            successRef.current.querySelectorAll('.mt-12 > div'),
            { scaleY: 0, opacity: 0 },
            {
              scaleY: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: 'elastic.out(1, 0.5)',
            },
            '-=0.3'
          );

          // Corner accents
          tl.fromTo(
            successRef.current.querySelectorAll('.absolute.w-16'),
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: 'back.out(2)',
            },
            '-=0.5'
          );
        }

        // Reset after 3.5 seconds with elegant fade out
        setTimeout(() => {
          if (successRef.current) {
            const tl = gsap.timeline({
              onComplete: () => setSubmitStatus(null),
            });

            // Fade out in reverse order
            tl.to(successRef.current.querySelectorAll('.absolute.w-16'), {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              stagger: 0.03,
              ease: 'power2.in',
            });

            tl.to(
              successRef.current.querySelector('h1'),
              {
                opacity: 0,
                scale: 0.9,
                filter: 'blur(10px)',
                duration: 0.5,
                ease: 'power2.in',
              },
              '-=0.2'
            );

            tl.to(
              successRef.current,
              {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
              },
              '-=0.2'
            );
          }
        }, 3500);
      },
    });

    // Stage 1: ENCRYPTING (0-0.8s)
    tl.call(() => setTransmissionStatus('ENCRYPTING PACKET DATA...'));

    // Button pulse
    tl.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
    });

    // Form glitch effect
    tl.to(formRef.current, {
      x: -2,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: 'none',
    }, '<');

    // Stage 2: UPLOADING (0.8-1.6s)
    tl.call(() => setTransmissionStatus('UPLOADING TO DEEP SPACE...'), '+=0.5');

    // Warp speed particle burst
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;

      const angle = (i / particlesRef.current.length) * Math.PI * 2;
      const distance = 250 + Math.random() * 150; // Increased distance for warp effect
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      tl.fromTo(
        particle,
        {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 1,
        },
        {
          x,
          y,
          scale: 1.5, // Larger scale for warp effect
          opacity: 0,
          duration: 0.8, // Faster for warp speed
          ease: 'power4.out',
        },
        '-=0.7'
      );
    });

    // Stage 3: SIGNAL LOCKED (1.6-2.0s)
    tl.call(() => setTransmissionStatus('SIGNAL LOCKED: SENT'), '+=0.6');

    // Final flash
    tl.to(formRef.current, {
      opacity: 0.3,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);

    // Animate copy feedback
    gsap.fromTo(
      '.copy-feedback',
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );

    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const socialLinks = [
    { name: 'GitHub', icon: SiGithub, href: 'https://github.com/AckerSaldana', color: '#ffffff' },
    { name: 'LinkedIn', icon: SiLinkedin, href: 'https://www.linkedin.com/in/acker-saldaña-452351318/', color: '#0077B5' },
  ];

  // Scroll animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Subtitle
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
            delay: 0.2,
          }
        );
      }

      // Form reveal
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Contact info reveal
      gsap.fromTo(
        contactInfoRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full py-32 md:py-64 px-4 md:px-8"
    >
      {/* Particles for send animation - only render when sending */}
      {isSubmitting && (
        <>
          {/* Warp speed star particles */}
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  background: i % 3 === 0 ? '#4a9eff' : i % 3 === 1 ? '#7b61ff' : '#4aefff',
                  boxShadow: `0 0 ${10 + Math.random() * 10}px currentColor`,
                }}
              />
            ))}
          </div>

          {/* Radio wave ripples */}
          <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
            <svg className="absolute w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="0"
                fill="none"
                stroke="#4a9eff"
                strokeWidth="2"
                opacity="0.6"
                className="animate-[radio-wave_1.5s_ease-out_infinite]"
              />
              <circle
                cx="50%"
                cy="50%"
                r="0"
                fill="none"
                stroke="#7b61ff"
                strokeWidth="2"
                opacity="0.6"
                className="animate-[radio-wave_1.5s_ease-out_0.5s_infinite]"
              />
              <circle
                cx="50%"
                cy="50%"
                r="0"
                fill="none"
                stroke="#4aefff"
                strokeWidth="2"
                opacity="0.6"
                className="animate-[radio-wave_1.5s_ease-out_1s_infinite]"
              />
            </svg>
          </div>

          {/* Transmission status display */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="bg-black/90 backdrop-blur-xl px-8 py-6 rounded-2xl border-2 border-[#4a9eff] shadow-[0_0_50px_rgba(74,158,255,0.6)]">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-[#4a9eff] rounded-full animate-pulse shadow-[0_0_15px_rgba(74,158,255,0.8)]" />
                <p className="text-[#4a9eff] font-['JetBrains_Mono'] text-lg font-bold tracking-wider animate-pulse">
                  {transmissionStatus}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success message overlay - Award-winning design */}
      {submitStatus === 'success' && (
        <div
          ref={successRef}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

          {/* Success content */}
          <div className="relative z-10 text-center px-8">
            {/* Main heading with gradient */}
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black leading-[0.85] tracking-tighter mb-8"
                style={{
                  background: 'linear-gradient(135deg, #4a9eff 0%, #7b61ff 50%, #4aefff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 80px rgba(74, 158, 255, 0.3)',
                }}>
              SENT
            </h1>

            {/* Subtext */}
            <div className="space-y-2">
              <p className="text-white/90 text-xl md:text-2xl font-light tracking-wide">
                Message transmitted successfully
              </p>
              <p className="text-white/50 text-sm md:text-base font-['JetBrains_Mono'] tracking-wider">
                I'll get back to you soon
              </p>
            </div>

            {/* Animated signal bars */}
            <div className="mt-12 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-[#4a9eff] to-[#7b61ff] rounded-full"
                  style={{
                    height: `${(i + 1) * 8}px`,
                    animation: `signal-pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                    boxShadow: '0 0 10px rgba(74, 158, 255, 0.5)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Animated corner accents */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#4a9eff]/30 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#7b61ff]/30 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#4aefff]/30 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#4a9eff]/30 rounded-br-lg" />
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="mb-32 md:mb-48 text-center">
          <h2
            ref={titleRef}
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black text-white mb-8 tracking-tighter uppercase"
          >
            Connect
          </h2>
          <p ref={subtitleRef} className="text-lg md:text-xl text-gray-400 opacity-70 tracking-wide uppercase">
            Let's build something extraordinary
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form - Minimalist Design */}
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder=" "
                  className="cursor-target peer w-full px-0 py-4 bg-transparent border-b-2 border-white/20 text-white text-xl placeholder-transparent focus:outline-none focus:border-[#4a9eff] transition-all duration-300"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-0 -top-6 text-sm font-['JetBrains_Mono'] uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:text-sm ${
                    focusedField === 'name' ? 'text-[#4a9eff]' : 'text-gray-400'
                  }`}
                >
                  Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder=" "
                  className="cursor-target peer w-full px-0 py-4 bg-transparent border-b-2 border-white/20 text-white text-xl placeholder-transparent focus:outline-none focus:border-[#4a9eff] transition-all duration-300"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-0 -top-6 text-sm font-['JetBrains_Mono'] uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:text-sm ${
                    focusedField === 'email' ? 'text-[#4a9eff]' : 'text-gray-400'
                  }`}
                >
                  Email
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder=" "
                  className="cursor-target peer w-full px-0 py-4 bg-transparent border-b-2 border-white/20 text-white text-xl placeholder-transparent focus:outline-none focus:border-[#4a9eff] transition-all duration-300"
                />
                <label
                  htmlFor="subject"
                  className={`absolute left-0 -top-6 text-sm font-['JetBrains_Mono'] uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:text-sm ${
                    focusedField === 'subject' ? 'text-[#4a9eff]' : 'text-gray-400'
                  }`}
                >
                  Subject
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={6}
                  placeholder=" "
                  className="cursor-target peer w-full px-0 py-4 bg-transparent border-b-2 border-white/20 text-white text-xl placeholder-transparent focus:outline-none focus:border-[#4a9eff] transition-all duration-300 resize-none"
                />
                <label
                  htmlFor="message"
                  className={`absolute left-0 -top-6 text-sm font-['JetBrains_Mono'] uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:text-sm ${
                    focusedField === 'message' ? 'text-[#4a9eff]' : 'text-gray-400'
                  }`}
                >
                  Message
                </label>
              </div>

              {/* Send Button - Elegant Design */}
              <button
                ref={buttonRef}
                type="submit"
                className="cursor-target relative group w-full py-6 bg-white text-black font-bold text-xl rounded-none border-2 border-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all duration-300"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 font-['JetBrains_Mono'] uppercase tracking-wider">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-black/30 border-t-black group-hover:border-white/30 group-hover:border-t-white rounded-full animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <BsSend size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Contact Info - Clean Cards */}
          <div ref={contactInfoRef} className="space-y-6">
            {/* Email Card */}
            <div className="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-[#4a9eff]/50 transition-all duration-300">
              <p className="text-gray-400 mb-4 text-sm font-['JetBrains_Mono'] uppercase tracking-wider">Email</p>
              <div className="flex items-center gap-4">
                <HiOutlineMail className="text-[#4a9eff] text-3xl" />
                <span className="text-white font-['JetBrains_Mono'] flex-1 text-lg break-all">
                  {email}
                </span>
                <button
                  onClick={copyEmail}
                  className="cursor-target p-3 hover:bg-[#4a9eff]/20 rounded-xl transition-all"
                  title="Copy email"
                >
                  <HiOutlineClipboardCopy
                    className={`text-2xl transition-colors ${copiedEmail ? 'text-green-400' : 'text-gray-400 group-hover:text-[#4a9eff]'}`}
                  />
                </button>
              </div>
              {copiedEmail && (
                <p className="copy-feedback text-green-400 text-sm mt-3 flex items-center gap-2">
                  <span>✓</span>
                  Copied!
                </p>
              )}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-gray-400 mb-4 text-sm font-['JetBrains_Mono'] uppercase tracking-wider">Connect</p>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-[#4a9eff]/50 hover:scale-105 transition-all"
                    >
                      <Icon
                        size={32}
                        className="transition-all group-hover:scale-110"
                        style={{ color: link.color }}
                      />
                      <span className="text-white font-semibold group-hover:text-[#4a9eff] transition-colors">
                        {link.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability Badge */}
            <div className="p-6 bg-gradient-to-br from-green-400/10 to-[#4a9eff]/10 rounded-2xl border border-green-400/30">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(74,255,74,0.8)]" />
                <div>
                  <p className="text-white font-bold text-lg">Available for Projects</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Open to collaborations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactGSAP;
