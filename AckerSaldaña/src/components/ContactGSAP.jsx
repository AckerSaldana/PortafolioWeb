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

  const email = 'codeasdf@outlook.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Spectacular send animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Success animation
        if (successRef.current) {
          gsap.fromTo(
            successRef.current,
            { scale: 0, rotation: -180, opacity: 0 },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
            }
          );
        }

        // Reset after 5 seconds
        setTimeout(() => {
          if (successRef.current) {
            gsap.to(successRef.current, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              onComplete: () => setSubmitStatus(null),
            });
          }
        }, 5000);
      },
    });

    // Button shake and scale
    tl.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
    });

    // Particle burst explosion from button
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;

      const angle = (i / particlesRef.current.length) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
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
          scale: 1,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=1' // Start slightly before previous animation ends
      );
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
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (particlesRef.current[i] = el)}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, #4a9eff, #7b61ff)`,
                boxShadow: '0 0 10px rgba(74, 158, 255, 0.8)',
              }}
            />
          ))}
        </div>
      )}

      {/* Success message overlay */}
      {submitStatus === 'success' && (
        <div
          ref={successRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] px-12 py-8 rounded-3xl border-2 border-green-400 shadow-[0_0_50px_rgba(74,255,74,0.6)]">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🚀</div>
              <div>
                <p className="text-green-400 font-bold text-2xl mb-2">Message Sent!</p>
                <p className="text-gray-300 text-lg">I'll respond soon.</p>
              </div>
            </div>
          </div>
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
