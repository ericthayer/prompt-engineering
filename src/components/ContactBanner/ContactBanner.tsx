import React from 'react';
import { motion } from 'framer-motion';

interface ContactBannerProps {
  title?: string;
}

export const ContactBanner: React.FC<ContactBannerProps> = ({
  title = "Manage Context & Mitigate Drift",
}) => {
  return (
    <section id="evaluation" className="relative w-full min-h-[100dvh] snap-start overflow-hidden bg-[#10100f] px-6 py-16 lg:py-20">
      {/* Blending Gradient at the top to transition from dark section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />

      {/* Animated Background Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_25%,rgba(234,88,12,0.2),transparent_35%)]" />

      <div className="relative z-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-orange-200/20 bg-stone-950/80 p-8 backdrop-blur-xl md:p-12 lg:p-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start text-left">
            {/* Left Side: Copy */}
            <div className="flex flex-col h-full justify-center">
              <h2 className="type-section mb-6 font-extrabold leading-[1.05] tracking-tight text-white">
                {title}
              </h2>

              <p className="type-body max-w-[65ch] leading-relaxed text-stone-300">
                An AI&apos;s context window is its memory limit. Prevent off-topic drift by isolating new topics in fresh chats, providing up-to-date context, and keeping your instructions explicit.
              </p>
            </div>

            {/* Right Side: Evaluation Checklist */}
            <div className="border border-stone-700 bg-stone-900 p-6 md:p-8">
              <p className="type-label mb-6 font-bold tracking-[0.12em] text-orange-300">
                Before you use an AI output, always evaluate:
              </p>
              <ul className="type-card grid gap-4 text-stone-200">
                <li className="border-l-2 border-orange-300 pl-4"><strong className="text-white">Accuracy:</strong> Is the information factually sound?</li>
                <li className="border-l-2 border-orange-300 pl-4"><strong className="text-white">Bias:</strong> Does it unfairly favor one perspective?</li>
                <li className="border-l-2 border-orange-300 pl-4"><strong className="text-white">Relevancy:</strong> Did it stay on topic?</li>
                <li className="border-l-2 border-orange-300 pl-4"><strong className="text-white">Consistency:</strong> Is the tone and quality uniform?</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
