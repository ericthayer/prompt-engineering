import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Consulting',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Received!</h3>
        <p className="text-gray-400">Our team will reach out to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
        <input
          required
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all focus:ring-1 focus:ring-purple-500/30"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
        <input
          required
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all focus:ring-1 focus:ring-purple-500/30"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="service" className="text-sm font-medium text-gray-400 ml-1">Service Type</label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all focus:ring-1 focus:ring-purple-500/30"
        >
          <option value="Consulting">Technical Consulting</option>
          <option value="ThreeJS">Three.js Development</option>
          <option value="Design">UI/UX Design</option>
          <option value="Other">Other Inquiry</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-400 ml-1">Message</label>
        <textarea
          required
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your project..."
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all focus:ring-1 focus:ring-purple-500/30 resize-none"
        />
      </div>

      <div className="md:col-span-2 pt-4">
        <button
          disabled={status === 'submitting'}
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-900/20"
        >
          {status === 'submitting' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              Send Message
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
