import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectPipelineContent } from '../content/projectPipeline';

export default function Hero() {
  const { hero } = projectPipelineContent;

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[0.9]">
          {hero.headline}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed mb-12">
          {hero.subheadline}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to={hero.primaryCtaHref}
            className="group inline-flex min-h-12 items-center gap-2 border border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            <span>{hero.primaryCtaLabel}</span>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/#contact"
            className="group inline-flex items-center gap-2 border-b border-black pb-1 text-lg font-medium text-black transition-colors hover:text-neutral-600"
          >
            <span>Tell us about your business</span>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
