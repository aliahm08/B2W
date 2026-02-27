import { motion, Variants } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Landmark,
  Sparkles,
  Users2,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const proofPoints = ['NASA', 'Waymo', 'GE Electric', 'Autodesk', 'GWU', 'CMU', 'Columbia'];

const pathCards = [
  {
    icon: Users2,
    title: 'Individuals',
    audience: 'Professionals and team leads',
    body: 'Create AI-enabled communication habits that reduce noise and improve day-to-day decision quality.',
    outcomes: ['Weekly planning in half the time', 'Clearer stakeholder updates', 'Personalized action workflows'],
    href: '/individuals'
  },
  {
    icon: Building2,
    title: 'Enterprises',
    audience: 'Cross-functional organizations',
    body: 'Deploy practical AI operations that improve alignment across product, engineering, design, and leadership.',
    outcomes: ['Operational handoffs with less friction', 'Prioritized implementation roadmap', 'Measurable productivity gains'],
    href: '/enterprises'
  },
  {
    icon: Landmark,
    title: 'Government Solutions',
    audience: 'Public sector and mission teams',
    body: 'Modernize service workflows with accountable AI governance, transparent decisioning, and resilient execution.',
    outcomes: ['Mission-aligned pilots', 'Audit-friendly governance flow', 'Secure adoption playbooks'],
    href: '/government-solutions'
  }
];

const deliverySteps = [
  {
    label: 'Discover',
    detail: 'Map communication bottlenecks and decision latency across critical workflows.',
    timeframe: 'Week 1',
    icon: BrainCircuit
  },
  {
    label: 'Design',
    detail: 'Co-create a focused AI operating plan with engineering, design, and product leadership.',
    timeframe: 'Weeks 2-3',
    icon: Workflow
  },
  {
    label: 'Deploy',
    detail: 'Launch scoped pilots with clear owners, instrumentation, and adoption support.',
    timeframe: 'Weeks 4-8',
    icon: Sparkles
  }
];

const faqs = [
  {
    question: 'What makes B2W different from a typical AI workshop?',
    answer:
      'We do not stop at education. Every engagement is tied to operational workflows, ownership, and implementation milestones.'
  },
  {
    question: 'Do you only support large organizations?',
    answer:
      'No. We support individual operators, growth-stage companies, enterprise teams, and government programs with fit-for-purpose scopes.'
  },
  {
    question: 'How quickly can we start?',
    answer:
      'Most engagements begin with a short discovery sprint and move into pilot design within the first two weeks.'
  }
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <motion.section className="hero-grid surface-panel" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <p className="eyebrow">B2W-AI.COM</p>
          <h1>
            AI consulting for businesses that need
            <span> better communication and better execution.</span>
          </h1>
          <p>
            B2W develops AI to improve communication and optimize actionable insights. Our team blends engineering,
            design, and product leadership to help organizations run better.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/enterprises">
              Explore Solutions
              <ArrowRight size={16} />
            </Link>
            <a className="btn btn-subtle" href="mailto:team@b2w-ai.com?subject=B2W%20Discovery%20Call">
              Book Strategy Call
            </a>
          </div>
        </div>

        <aside className="hero-insight-card">
          <p className="panel-label">Track Record</p>
          <p className="panel-stat">30 years</p>
          <p className="panel-copy">Combined experience adding value across complex institutions and programs.</p>
          <div className="chip-wrap">
            {proofPoints.map((point) => (
              <span key={point} className="chip">
                {point}
              </span>
            ))}
          </div>
        </aside>
      </motion.section>

      <motion.section
        className="metrics-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <article className="metric-card">
          <p className="metric-value">3</p>
          <p className="metric-label">Solution paths tailored to business context</p>
        </article>
        <article className="metric-card">
          <p className="metric-value">2-8 weeks</p>
          <p className="metric-label">Typical timeline from discovery to pilot launch</p>
        </article>
        <article className="metric-card">
          <p className="metric-value">Cross-functional</p>
          <p className="metric-label">Engineers, designers, and product leaders in one team</p>
        </article>
      </motion.section>

      <motion.section
        className="section-block surface-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <header className="section-head">
          <p className="eyebrow">Choose Your Path</p>
          <h2>Engagement models designed for how your team operates</h2>
        </header>

        <div className="feature-grid">
          {pathCards.map((card) => (
            <article key={card.title} className="feature-card">
              <div className="feature-icon">
                <card.icon size={19} />
              </div>
              <p className="feature-kicker">{card.audience}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <ul className="bullet-list">
                {card.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <Link className="text-link" to={card.href}>
                View {card.title}
                <ArrowRight size={15} />
              </Link>
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
          <p className="eyebrow">How We Deliver</p>
          <h2>A practical sequence from insight to implementation</h2>
        </header>

        <div className="timeline-grid">
          {deliverySteps.map((step, index) => (
            <article key={step.label} className="timeline-card">
              <div className="step-top">
                <span className="step-badge">0{index + 1}</span>
                <step.icon size={18} />
              </div>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
              <p className="timeline-time">{step.timeframe}</p>
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
          <p className="eyebrow">FAQ</p>
          <h2>Common questions before starting with B2W</h2>
        </header>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
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
          <p className="eyebrow">Next Step</p>
          <h2>Explore how your business can run better with B2W</h2>
          <p>
            Bring us one high-friction communication or decision workflow. We will show you how to move from scattered
            information to consistent action.
          </p>
        </div>
        <a className="btn" href="mailto:team@b2w-ai.com?subject=B2W%20Consulting%20Inquiry">
          Start the Conversation
        </a>
      </motion.section>
    </div>
  );
}
