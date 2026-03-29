import { motion } from 'motion/react';
import LeadForm from './forms/LeadForm';

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-black pt-10 sm:pt-12 md:pt-16"
      >
        <h2 className="mb-4 max-w-[11ch] text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
          Ready to Simplify?
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
          Tell us about your business. After we have your information, we will schedule a call with you.
        </p>
        <div className="w-full">
          <LeadForm />
        </div>
      </motion.div>
    </section>
  );
}
