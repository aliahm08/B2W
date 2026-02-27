import { motion, Variants } from 'framer-motion';
import { ArrowRight, BarChart3, Network, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const capabilities = [
  {
    icon: Network,
    title: 'Workflow Architecture',
    body: 'Connect fragmented communication channels, documentation, and decision points into one operational AI layer.'
  },
  {
    icon: ShieldCheck,
    title: 'Adoption and Governance',
    body: 'Align leadership and delivery teams around clear usage policies, change management, and ownership models.'
  },
  {
    icon: BarChart3,
    title: 'Outcome Instrumentation',
    body: 'Track productivity, quality, and cycle-time impact so every AI initiative has measurable business value.'
  }
];

const roadmap = [
  {
    phase: 'Days 1-30',
    title: 'Operational Diagnostic',
    body: 'Prioritize high-friction workflows and establish success metrics with executive and delivery leads.'
  },
  {
    phase: 'Days 31-60',
    title: 'Pilot and Enablement',
    body: 'Deploy focused pilots in selected teams and drive adoption through role-based enablement sessions.'
  },
  {
    phase: 'Days 61-90',
    title: 'Scale Blueprint',
    body: 'Codify governance, rollout sequencing, and KPI cadence for durable cross-org implementation.'
  }
];

export default function EnterprisesPage() {
  return (
    <div className="page-stack">
      <motion.section className="sub-hero surface-panel" initial="hidden" animate="visible" variants={reveal}>
        <p className="eyebrow">Enterprises</p>
        <h1>Operational AI consulting for organizations that need real adoption, not shelfware.</h1>
        <p>
          B2W helps enterprises deploy AI with clear governance, practical workflows, and execution standards that hold
          up under scale.
        </p>

        <div className="sub-hero-metrics">
          <article className="mini-metric">
            <p className="metric-value">90 days</p>
            <p>From diagnostic to enterprise scale plan</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Cross-team</p>
            <p>Product, design, engineering, ops alignment</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Measured</p>
            <p>Business outcomes tied to delivery metrics</p>
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
          <p className="eyebrow">Core Capabilities</p>
          <h2>Built for enterprise complexity</h2>
        </header>

        <div className="feature-grid">
          {capabilities.map((item) => (
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
          <p className="eyebrow">Rollout Model</p>
          <h2>A staged path from assessment to scale</h2>
        </header>

        <div className="timeline-grid">
          {roadmap.map((step, index) => (
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
            <h3>Leadership alignment</h3>
            <ul className="bullet-list">
              <li>Define where AI should and should not be used</li>
              <li>Clarify ownership between product, engineering, and operations</li>
              <li>Set a decision cadence with visible KPI accountability</li>
            </ul>
          </article>
          <article className="checklist-card">
            <h3>Delivery acceleration</h3>
            <ul className="bullet-list">
              <li>Reduce communication drag in execution-critical workflows</li>
              <li>Shorten feedback loops between teams and leadership</li>
              <li>Scale pilots into repeatable operational standards</li>
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
          <p className="eyebrow">Public Sector</p>
          <h2>Need mission-grade governance and accountability?</h2>
          <p>See how B2W structures secure deployments for public sector and regulated environments.</p>
        </div>
        <Link className="btn" to="/government-solutions">
          View Government Solutions
          <ArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  );
}
