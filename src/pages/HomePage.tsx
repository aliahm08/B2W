import { motion, Variants } from 'framer-motion';
import { ctaHref, ctaLabel, missionPillars, missionStatement } from '../content/mission';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } }
};

export default function HomePage() {
  return (
    <div className="page-stack">
      <motion.section className="hero-block" initial="hidden" animate="visible" variants={fadeIn}>
        <p className="kicker">B2W Plan</p>
        <h1>{missionStatement}</h1>
        <a className="btn" href={ctaHref}>
          {ctaLabel}
        </a>
      </motion.section>

      <motion.section
        className="content-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeIn}
      >
        <h2>Core Offerings</h2>
        <ul className="mission-list">
          {missionPillars.map((pillar) => (
            <li key={pillar.path}>{pillar.label}</li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
