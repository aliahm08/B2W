import { motion } from 'motion/react';
import ActionLink from './ActionLink';
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

        <div className="flex flex-wrap gap-5">
          <ActionLink href={hero.primaryCtaHref}>{hero.primaryCtaLabel}</ActionLink>
          <ActionLink href={hero.secondaryCtaHref} variant="outline">{hero.secondaryCtaLabel}</ActionLink>
        </div>
      </motion.div>
    </section>
  );
}
