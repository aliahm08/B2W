import { motion, Variants } from 'framer-motion';
import { ArrowLeft, FileKey, Fingerprint, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const priorities = [
  {
    icon: FileKey,
    title: 'Mission Protocol',
    body: 'Map LLM interactions strictly to service outcomes, accuracy thresholds, and citizen data confidentiality standards.'
  },
  {
    icon: Fingerprint,
    title: 'Deny by Default',
    body: 'Architect networks with reviewable loops, transparent decision logs, and immutable accountability traces.'
  },
  {
    icon: Lock,
    title: 'Zero-Trust Deploy',
    body: 'Structure all components around rigid risk controls, phased sandboxing, and continuous compliance auditing.'
  }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function GovernmentSolutionsPage() {
  return (
    <>
      <motion.section
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow" style={{ color: 'var(--text)' }}>For Federal</p>
        <h1>
          Secured intelligence.<br />
          Mission critical.
        </h1>
        <p className="hero-copy">
          B2W architectures empower agencies and federal partners to scale decision-making securely, maintaining the highest standard of data governance and rigorous compliance logic.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header">
          <p className="eyebrow">Public Sector Spec</p>
          <h2>Hardened focus areas.</h2>
        </div>
        <div className="bento-grid">
          {priorities.map((item) => (
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="section-header">
          <p className="eyebrow">Node Specs</p>
          <h2>Why B2W for Federal.</h2>
        </div>
        <div className="bento-grid">
          <div className="bento-item" style={{ gridColumn: 'span 4' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.04em' }}>30 Years</p>
            <p className="eyebrow" style={{ marginTop: '0.5rem' }}>Legacy</p>
            <p style={{ marginTop: '1rem', color: 'var(--muted)', lineHeight: 1.6 }}>Combined operations across high-stakes, maximum-security institutions and classified technical programs.</p>
          </div>
          <div className="bento-item" style={{ gridColumn: 'span 4' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.04em' }}>Full-Stack</p>
            <p className="eyebrow" style={{ marginTop: '0.5rem' }}>Integration</p>
            <p style={{ marginTop: '1rem', color: 'var(--muted)', lineHeight: 1.6 }}>Engineers, cryptographers, and product leads compiling solutions under a single operational namespace.</p>
          </div>
          <div className="bento-item" style={{ gridColumn: 'span 4' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.04em' }}>100%</p>
            <p className="eyebrow" style={{ marginTop: '0.5rem' }}>Deterministic</p>
            <p style={{ marginTop: '1rem', color: 'var(--muted)', lineHeight: 1.6 }}>Every query mapped directly to next-step clearance and operational ownership paths.</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="eyebrow">Dispatching</p>
        <h2>Initialize mission-aligned deployment.</h2>
        <p>We scope for security, total transparency, and hardware-level durability from day zero.</p>
        <Link className="btn" to="/" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Return Home
        </Link>
      </motion.section>
    </>
  );
}
