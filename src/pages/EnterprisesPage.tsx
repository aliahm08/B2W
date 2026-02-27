import { motion, Variants } from 'framer-motion';
import { Activity, BarChart3, ChevronRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilities = [
  {
    icon: ShieldAlert,
    title: 'Safety Mitigation',
    body: 'Automated compliance checks and real-time safety guardrails. The system prevents high-risk actions before they execute.'
  },
  {
    icon: Activity,
    title: 'Live Data Streams',
    body: 'Connect directly to your AWS instances, internal databases, or external APIs. The SaaS platform processes live telemetry at scale.'
  },
  {
    icon: BarChart3,
    title: 'Risk Analytics',
    body: 'Turn unstructured noise into actionable risk matrices. Command your operations center with deterministic insight cards.'
  }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export function DashboardPlaceholder() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      background: '#fff',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid var(--line)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '2rem'
    }}>
      <div style={{ borderRight: '1px solid var(--line)', paddingRight: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Live AWS Connector</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>us-east-1 // Connected</span>
          </div>
        </div>
        <div>
          <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Global Risk Index</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.04em' }}>14.2%</div>
        </div>
      </div>
      <div>
        <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>Active Mitigation Events</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { tag: 'CRITICAL', text: 'Anomalous traffic spike in API gateway. Agent applied rate limits.', color: '#EF4444' },
            { tag: 'WARNING', text: 'Database latency exceeded 200ms threshold.', color: '#F59E0B' },
            { tag: 'INFO', text: 'Routine snapshot completed successfully.', color: '#3B82F6' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--line)' }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.color, padding: '0.25rem 0.5rem', background: `${item.color}15`, borderRadius: '4px', height: 'fit-content' }}>
                {item.tag}
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0 }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EnterprisesPage() {
  return (
    <>
      <motion.section
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow" style={{ color: 'var(--text)' }}>Enterprise SaaS</p>
        <h1>
          Total visibility.<br />
          Instant mitigation.
        </h1>
        <p className="hero-copy">
          A full-stack SaaS application built for engineering and operations leaders. Connect your data, monitor live risk analytics, and let B2W safeguard your systems in real-time.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        style={{ padding: '0 1rem' }}
      >
        <DashboardPlaceholder />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header">
          <p className="eyebrow">Platform Capabilities</p>
          <h2>The operations center you deserve.</h2>
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
        <p className="eyebrow">Command Center</p>
        <h2>Connect your AWS environment today.</h2>
        <p>
          Experience the B2W SaaS platform with a live, sandboxed integration using your own secure data streams.
        </p>
        <Link className="btn" to="/government-solutions" style={{ marginTop: '1.5rem' }}>
          View Security Specs <ChevronRight size={18} style={{ marginLeft: '0.25rem' }} />
        </Link>
      </motion.section>
    </>
  );
}
