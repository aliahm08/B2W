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
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">Ready to simplify?</h2>
        <p className="text-xl text-neutral-600 mb-12 max-w-xl">
          Tell us about your business first. After you submit, we will give you a direct option to book a call.
        </p>
        <div className="max-w-3xl">
          <LeadForm />
        </div>
      </motion.div>
    </section>
  );
}
