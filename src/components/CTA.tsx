import { motion } from 'motion/react';
import LeadForm from './forms/LeadForm';

export default function CTA() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-black pt-12 md:pt-16"
      >
        <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">Ready to Simplify?</h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-neutral-600">
          Tell us about your business. After we have your information, we will schedule a call with you.
        </p>
        <div className="w-full">
          <LeadForm />
        </div>
      </motion.div>
    </section>
  );
}
