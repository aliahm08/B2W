import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('b2w-assistant:open', { detail: { tab: 'book' } }));
  };

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-black pt-12 md:pt-16"
      >
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">
          Ready to simplify?
        </h2>
        <p className="text-xl text-neutral-600 mb-12 max-w-xl">
          Let's discuss how we can apply focused intelligence to your specific challenges.
        </p>

        <motion.button
          type="button"
          onClick={openBooking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 border border-black bg-black px-8 py-4 text-lg font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Book a consultation
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
