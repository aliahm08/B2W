import { motion, Variants } from 'framer-motion';
import { ArrowRight, MessageSquareText, PanelsTopLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const offerings = [
  {
    icon: MessageSquareText,
    title: 'Communication Optimization',
    body: 'Improve how you prepare updates, frame decisions, and align stakeholders through AI-assisted communication systems.'
  },
  {
    icon: PanelsTopLeft,
    title: 'Personal Workflow Design',
    body: 'Build lightweight AI workflows for planning, synthesis, follow-up, and execution using the tools you already use.'
  },
  {
    icon: Target,
    title: 'Decision Clarity Coaching',
    body: 'Translate noisy inputs into clear next actions with structured prompts, reviews, and repeatable templates.'
  }
];

const engagement = [
  {
    phase: 'Week 1',
    title: 'Clarity Sprint',
    body: 'Identify top communication bottlenecks and define the highest-leverage AI opportunities.'
  },
  {
    phase: 'Weeks 2-3',
    title: 'Workflow Build',
    body: 'Implement and test personal workflows with real tasks and measurable checkpoints.'
  },
  {
    phase: 'Weeks 4+',
    title: 'Performance Loop',
    body: 'Refine, scale, and maintain your operating system through a repeatable feedback rhythm.'
  }
];

export default function IndividualsPage() {
  return (
    <div className="page-stack">
      <motion.section className="sub-hero surface-panel" initial="hidden" animate="visible" variants={reveal}>
        <p className="eyebrow">Individuals</p>
        <h1>AI support for professionals who need better signal and faster follow-through.</h1>
        <p>
          B2W helps you integrate AI into daily execution so communication becomes clearer, priorities stay aligned, and
          actions are easier to ship.
        </p>

        <div className="sub-hero-metrics">
          <article className="mini-metric">
            <p className="metric-value">2x</p>
            <p>Faster weekly planning and recap cycles</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Higher</p>
            <p>Confidence in turning insight into action</p>
          </article>
          <article className="mini-metric">
            <p className="metric-value">Clearer</p>
            <p>Cross-functional updates and stakeholder alignment</p>
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
          <p className="eyebrow">What You Get</p>
          <h2>Designed for high-agency operators</h2>
        </header>

        <div className="feature-grid">
          {offerings.map((item) => (
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
          <p className="eyebrow">Engagement Rhythm</p>
          <h2>Simple structure, compounding outcomes</h2>
        </header>

        <div className="timeline-grid">
          {engagement.map((step, index) => (
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
            <h3>Best fit if you are</h3>
            <ul className="bullet-list">
              <li>Leading projects that depend on clear cross-team communication</li>
              <li>Managing high context loads and frequent priority changes</li>
              <li>Looking for practical AI workflows instead of generic prompt tips</li>
            </ul>
          </article>
          <article className="checklist-card">
            <h3>Expected outcomes</h3>
            <ul className="bullet-list">
              <li>Personal AI system mapped to your real weekly cadence</li>
              <li>Reusable templates for updates, decisions, and follow-through</li>
              <li>A clear plan to keep improving after initial setup</li>
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
          <p className="eyebrow">Progression</p>
          <h2>Need to scale beyond personal workflows?</h2>
          <p>Move from individual systems to cross-functional enterprise operating models.</p>
        </div>
        <Link className="btn" to="/enterprises">
          Explore Enterprise Path
          <ArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  );
}
