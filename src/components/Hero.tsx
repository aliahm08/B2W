import { motion } from 'motion/react';
import ActionLink from './ActionLink';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[0.9]">
          We build intelligence.
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed mb-12">
          Solving complex problems with simple, effective AI solutions. No hype. Just results.
        </p>

        <div className="flex flex-wrap gap-5">
          <ActionLink href="/#capabilities">Explore capabilities</ActionLink>
          <ActionLink href="/#industries" variant="outline">See Projects</ActionLink>
        </div>
      </motion.div>
    </section>
  );
}
