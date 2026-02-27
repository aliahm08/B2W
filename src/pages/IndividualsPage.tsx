import { motion } from 'framer-motion';
import { Bot, ChevronRight, MessageSquare, Smartphone, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const capabilities = [
  {
    icon: Smartphone,
    title: 'WhatsApp Native',
    body: 'Text your agent natural language commands directly in WhatsApp. It parses intent, connects to your APIs, and executes tasks silently.'
  },
  {
    icon: MessageSquare,
    title: 'Slack & Teams',
    body: 'Add the agent to your enterprise channels. It listens for actionable context and flags risks before they escalate.'
  },
  {
    icon: Zap,
    title: 'Proactive Alerting',
    body: 'Stop querying dashboards. The agent monitors the delta in your live data and pushes push-notifications only when a threshold is breached.'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export function DemoPlaceholder() {
  const [activeMessage, setActiveMessage] = useState(0);
  const messages = [
    "Agent: [AWS-Hosted Demo Init]",
    "Agent: Listening to live data stream...",
    "Agent: ⚠️ Anomaly detected in East Region.",
    "User: Mitigate immediately.",
    "Agent: ✅ Mitigation protocol executed."
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      background: '#050505',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      fontFamily: '"JetBrains Mono", monospace, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <Bot color="#45e1cb" size={20} />
        <span style={{ color: '#fff', fontSize: '0.875rem' }}>B2W Agent • AWS Live Instance</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '200px' }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.5, duration: 0.5 }}
            style={{
              color: msg.startsWith('User:') ? '#888' : '#fff',
              fontSize: '0.875rem',
              background: msg.startsWith('User:') ? 'transparent' : 'rgba(255,255,255,0.05)',
              padding: msg.startsWith('User:') ? '0' : '0.5rem 0.75rem',
              borderRadius: '8px',
              width: 'fit-content',
              alignSelf: msg.startsWith('User:') ? 'flex-end' : 'flex-start'
            }}
          >
            {msg}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function IndividualsPage() {
  return (
    <>
      <motion.section
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow" style={{ color: 'var(--text)' }}>Personal AI Agents</p>
        <h1>
          Your workflow.<br />
          Automated.
        </h1>
        <p className="hero-copy">
          We deploy specialized AI agents directly into the apps you already use—WhatsApp, Slack, and MS Teams. Stop managing tools and start commanding action.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        style={{ padding: '0 1rem' }}
      >
        <DemoPlaceholder />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header">
          <p className="eyebrow">Agent Capabilities</p>
          <h2>Intelligence on your terms.</h2>
        </div>
        <div className="bento-grid">
          {capabilities.map((item) => (
            <div key={item.title} className="bento-item" style={{ gridColumn: 'span 4', minHeight: '260px', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg)', marginBottom: '1.5rem', border: '1px solid var(--line)' }}>
                <item.icon size={24} color="var(--text)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--muted)', flex: 1, fontSize: '1.125rem', lineHeight: 1.6 }}>{item.body}</p>
            </div>
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
        <p className="eyebrow">Deploy Today</p>
        <h2>Ready to integrate your agent?</h2>
        <p>Connect your WhatsApp or Slack workspace in seconds and experience zero-latency intelligence.</p>
        <Link className="btn" to="/enterprises" style={{ marginTop: '1.5rem' }}>
          Explore Enterprise SaaS <ChevronRight size={18} style={{ marginLeft: '0.25rem' }} />
        </Link>
      </motion.section>
    </>
  );
}
