import { motion, Variants } from 'framer-motion';
import { ArrowRight, Bot, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const proofPoints = ['Live Demo', 'WhatsApp Integration', 'Slack Bot', 'MS Teams Ready', 'AWS Hosted', 'SOC2 Compliant'];

const solutionCards = [
  {
    icon: Bot,
    title: 'Proactive AI Agents',
    body: 'Automate your day with a personal AI agent accessible via WhatsApp, Slack, or MS Teams. Get alerted before critical events happen and execute tasks on command.',
    href: '/individuals'
  },
  {
    icon: ShieldCheck,
    title: 'SaaS Risk Analytics',
    body: 'A full SaaS enterprise application prioritizing safety mitigation. Connect live data streams and derive actionable insights within a highly secure analytic environment.',
    href: '/enterprises'
  },
  {
    icon: Activity,
    title: 'Public Sector Safety',
    body: 'For defense and civilian agencies requiring compliant risk assessments, secure data handling, and transparent accountability frameworks.',
    href: '/government-solutions'
  }
];

const operatingModel = [
  {
    title: 'Connect Live Data',
    body: 'Seamlessly plug into your existing data streams. Our agents process your live feeds instantly, removing the latency between event and analysis.'
  },
  {
    title: 'Proactive Alerts',
    body: 'Stop reacting. Your customized agent monitors your feeds 24/7 and pings you on your preferred channel (WhatsApp, Slack) minutes before a risk materializes.'
  },
  {
    title: 'Take Action',
    body: 'Respond directly from your chat client or jump into our SaaS platform to mitigate risks in real-time. Turn insights into deterministic action.'
  }
];

// Utility for scroll animations
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function HomePage() {
  return (
    <>
      <motion.section
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow">The Future of Action</p>
        <h1>
          Agents that alert.<br />Systems that protect.
        </h1>
        <p className="hero-copy">
          From a personal AI assistant in your WhatsApp to a full SaaS risk-analytics operations center. B2W builds technology that anticipates problems and executes solutions autonomously.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/individuals">
            Meet Your Agent
          </Link>
          <a className="btn btn-subtle" href="mailto:team@b2w-ai.com">
            Request Enterprise Demo
          </a>
        </div>
      </motion.section>

      <motion.section
        className="trust-strip"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p>Available instantly across your workflow</p>
        <div className="logo-strip">
          {proofPoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header">
          <p className="eyebrow">Product Suite</p>
          <h2>Intelligence scaled for you or your entire organization.</h2>
        </div>

        <div className="bento-grid">
          {solutionCards.map((card, idx) => (
            <div key={card.title} className="bento-item" style={{ gridColumn: idx === 2 ? 'span 12' : 'span 6', minHeight: '260px', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg)', marginBottom: '1.5rem', border: '1px solid var(--line)' }}>
                <card.icon size={24} color="var(--text)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{card.title}</h3>
              <p style={{ color: 'var(--muted)', flex: 1, fontSize: '1.125rem', lineHeight: 1.6 }}>{card.body}</p>
              <Link to={card.href} className="text-link" style={{ marginTop: '2rem' }}>
                Open Spec <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <p className="eyebrow">The B2W Flow</p>
          <h2>How our agents keep you ahead of the curve.</h2>
        </div>
        <div>
          {operatingModel.map((step, index) => (
            <motion.article
              key={step.title}
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <span className="step-number">0{index + 1}</span>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow">Initialize</p>
        <h2>Ready to deploy your agent?</h2>
        <p>
          Connect your accounts and watch your localized AI handle tasks and surface alerts before they become emergencies.
        </p>
        <Link className="btn" to="/individuals" style={{ marginTop: '1.5rem' }}>
          View Live Demo
        </Link>
      </motion.section>
    </>
  );
}
