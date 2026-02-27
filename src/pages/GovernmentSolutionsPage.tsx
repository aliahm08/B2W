import { motion, Variants } from 'framer-motion';
import { ArrowLeft, FileCheck2, Lock, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const priorities = [
  {
    icon: Scale,
    title: 'Mission-Aligned Design',
    body: 'Link every AI workflow to service outcomes, decision quality, and communication reliability requirements.'
  },
  {
    icon: FileCheck2,
    title: 'Transparent Governance',
    body: 'Create reviewable decision pathways with clear role ownership, policy boundaries, and audit visibility.'
  },
  {
    icon: Lock,
    title: 'Secure Implementation',
    body: 'Run phased pilots with strong controls, defensible risk posture, and durable operational documentation.'
  }
];

const delivery = [
  {
    phase: 'Phase 1',
    title: 'Program Discovery',
    body: 'Align stakeholders on mission goals, risk constraints, and suitable AI use cases.'
  },
  {
    phase: 'Phase 2',
    title: 'Controlled Pilot',
    body: 'Deploy a scoped pilot with governance checkpoints and transparent performance reporting.'
  },
  {
    phase: 'Phase 3',
    title: 'Institutional Scale',
    body: 'Expand proven workflows with training, policy integration, and long-term oversight structure.'
  }
];

export default function GovernmentSolutionsPage() {
  return (
    <div className="page-stack">
      <motion.section className="sub-hero surface-panel" initial="hidden" animate="visible" variants={reveal}>
        <p className="eyebrow">Government Solutions</p>
        <h1>Trusted AI modernization for public sector programs and mission teams.</h1>
        <p>
          B2W helps agencies improve communication clarity and decision quality while meeting governance, risk, and
          accountability expectations.
        </p>

        <div className="sub-hero-metrics">
          <article className="mini-metric">
            <p className="metric-value">Secure</p>
            <p>Staged implementation with strict control boundaries</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Transparent</p>
            <p>Reviewable decision pathways and clear ownership</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Practical</p>
            <p>Mission-first workflows that improve service outcomes</p>
          </article>
        </div>
      </motion.section>

      <motion.section
        className="section-block surface-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <header className="section-head">
          <p className="eyebrow">Focus Areas</p>
          <h2>Where B2W supports public sector programs</h2>
        </header>

        <div className="feature-grid">
          {priorities.map((item) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">
                <item.icon size={19} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="section-block surface-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <header className="section-head">
          <p className="eyebrow">Delivery Cadence</p>
          <h2>Governed rollout from pilot to institutional use</h2>
        </header>

        <div className="timeline-grid">
          {delivery.map((step, index) => (
            <article key={step.title} className="timeline-card">
              <div className="step-top">
                <span className="step-badge">0{index + 1}</span>
                <p className="timeline-time">{step.phase}</p>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="section-block surface-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <div className="checklist-grid">
          <article className="checklist-card">
            <h3>Why teams choose B2W</h3>
            <ul className="bullet-list">
              <li>30 years of combined experience across complex institutions</li>
              <li>Cross-disciplinary delivery team with engineering, design, and product depth</li>
              <li>Implementation plans tied to accountable next-step ownership</li>
            </ul>
          </article>
          <article className="checklist-card">
            <h3>Engagement outcomes</h3>
            <ul className="bullet-list">
              <li>Mission-aligned pilot with measurable service impact</li>
              <li>Clear governance operating model and review cadence</li>
              <li>Scalable adoption roadmap across participating teams</li>
            </ul>
          </article>
        </div>
      </motion.section>

      <motion.section
        className="cta-banner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <div>
          <p className="eyebrow">Return</p>
          <h2>Ready to plan your first mission-aligned AI pilot?</h2>
          <p>Start with a focused briefing and we will shape a secure path from concept to measurable outcomes.</p>
        </div>
        <Link className="btn" to="/">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </motion.section>
    </div>
  );
}
