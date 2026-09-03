import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface ContactBannerProps {
  title?: string;
}

export const ContactBanner: React.FC<ContactBannerProps> = ({
  title = "Manage Context & Mitigate Drift",
}) => {
  return (
    <section className="relative w-full min-h-screen snap-start py-24 px-6 overflow-hidden bg-[#050505]">
      {/* Blending Gradient at the top to transition from dark section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />

      {/* Animated Background Aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full z-0"
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-white/10 p-10 lg:p-16 rounded-[3rem] shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start text-left">
            {/* Left Side: Copy */}
            <div className="flex flex-col h-full justify-center">
              <div className="inline-flex w-fit p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-8">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>

              <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                {title}
              </h2>

              <p className="text-lg text-indigo-200/80 mb-10 max-w-lg leading-relaxed">
                An AI&apos;s context window is its memory limit. Prevent off-topic drift by isolating new topics in fresh chats, providing up-to-date context, and keeping your instructions explicit.
              </p>
            </div>

            {/* Right Side: Evaluation Checklist */}
            <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
              <p className="mb-6 text-sm font-bold uppercase tracking-wider text-purple-300">
                Before you use an AI output, always evaluate:
              </p>
              <ul className="space-y-4 text-indigo-100/90">
                <li><strong>Accuracy:</strong> Is the information factually sound?</li>
                <li><strong>Bias:</strong> Does it unfairly favor one perspective?</li>
                <li><strong>Relevancy:</strong> Did it stay on topic?</li>
                <li><strong>Consistency:</strong> Is the tone and quality uniform?</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full" />
      <div className="absolute top-1/4 left-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full" />
    </section>
  );
};
