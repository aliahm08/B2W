import { motion, Variants } from 'framer-motion';
import { ctaHref, ctaLabel, missionStatement } from '../content/mission';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } }
};

type MissionPageProps = {
  pillar: string;
};

export default function MissionPage({ pillar }: MissionPageProps) {
  return (
    <div className="page-stack">
      <motion.section className="hero-block" initial="hidden" animate="visible" variants={fadeIn}>
        <p className="kicker">B2W Plan</p>
        <h1>{pillar}</h1>
        <p>{missionStatement}</p>
        <a className="btn" href={ctaHref}>
          {ctaLabel}
        </a>
      </motion.section>
    </div>
  );
}
