import { useState } from 'react';

const ContactWindow = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate sending (replace with actual email service)
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setStatus('success');
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div
      className="h-full overflow-y-auto p-6 font-['Inter']"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Get In Touch</h1>
        <p className="text-gray-400 text-sm">
          Have a project in mind? Let's collaborate and build something amazing together.
        </p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Name <span className="text-[#ff5f57]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0affc2] transition-colors placeholder:text-gray-600"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email <span className="text-[#ff5f57]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0affc2] transition-colors placeholder:text-gray-600"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Subject <span className="text-[#ff5f57]">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0affc2] transition-colors placeholder:text-gray-600"
            placeholder="What's this about?"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Message <span className="text-[#ff5f57]">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0affc2] transition-colors resize-none placeholder:text-gray-600"
            placeholder="Tell me about your project..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'sending' || status === 'success'}
          className={`w-full py-3 rounded-md font-semibold text-sm transition-all ${
            status === 'success'
              ? 'bg-[#28c840] text-white cursor-not-allowed'
              : status === 'sending'
              ? 'bg-white/10 text-gray-400 cursor-wait'
              : 'bg-[#0affc2] text-black hover:brightness-110'
          }`}
        >
          {status === 'idle' && 'Send Message'}
          {status === 'sending' && 'Sending...'}
          {status === 'success' && '✓ Message Sent!'}
          {status === 'error' && 'Error - Try Again'}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="text-center text-sm text-[#28c840] bg-[#28c840]/10 border border-[#28c840]/30 rounded-md py-2">
            Thanks for reaching out! I'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="text-center text-sm text-[#ff5f57] bg-[#ff5f57]/10 border border-[#ff5f57]/30 rounded-md py-2">
            Something went wrong. Please try again.
          </div>
        )}
      </form>

      {/* Additional Contact Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          Or email me directly at{' '}
          <a href="mailto:acker@example.com" className="text-[#0affc2] hover:underline">
            acker@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactWindow;
