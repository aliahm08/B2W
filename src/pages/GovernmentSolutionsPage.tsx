import { motion, Variants } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function GovernmentSolutionsPage() {
  return (
    <div className="page-stack" style={{ gap: '4rem', marginTop: '2rem' }}>
      <motion.section className="hero-grid" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '-0.5rem' }}>Government Solutions</p>
          <h1>
            Trusted AI modernization for public sector
            <span>programs and mission teams.</span>
          </h1>
          <p>
            B2W helps agencies improve communication clarity and decision quality while meeting governance, risk, and
            accountability expectations.
          </p>
          <div className="hero-actions">
            <a className="btn" href="mailto:team@b2w-ai.com?subject=B2W%20Discovery%20Call">
              Get Started
            </a>
            <a className="btn btn-subtle" href="mailto:team@b2w-ai.com?subject=B2W%20Demo%20Request">
              Book a Demo
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="demo-showcase-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <div className="demo-content-area" style={{ maxWidth: '900px', margin: '0 auto', border: 'none', background: 'transparent', boxShadow: 'none' }}>
          <motion.article
            className="secure-terminal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ margin: '0 auto', maxWidth: '650px', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}
          >
            <header className="terminal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TerminalSquare size={14} /> Mission Decisioning Gateway v4.2
              </div>
              <div className="terminal-status">
                <span className="terminal-badge" /> EXECUTING
              </div>
            </header>
            <div className="terminal-body" style={{ height: '300px' }}>
              <div className="log-entry">
                <span className="log-time">[14:02:01]</span>
                <span className="log-level info">INFO</span>
                <span className="log-msg">Connecting to secure intelligence feed... OK</span>
              </div>
              <div className="log-entry">
                <span className="log-time">[14:02:05]</span>
                <span className="log-level info">INFO</span>
                <span className="log-msg">Scanning operational policy constraints...</span>
              </div>
              <div className="log-entry">
                <span className="log-time">[14:02:06]</span>
                <span className="log-level warn">WARN</span>
                <span className="log-msg">Clearance level mismatch detected on node 4. Rerouting...</span>
              </div>
              <div className="log-entry">
                <span className="log-time">[14:02:08]</span>
                <span className="log-level success">PASS</span>
                <span className="log-msg">Audit log generated. Action pathway approved.</span>
              </div>
              <div className="log-entry">
                <span className="log-time">[14:02:10]</span>
                <span className="log-level info">INFO</span>
                <span className="log-msg">Awaiting next instruction..._</span>
              </div>
            </div>
          </motion.article>
        </div>
      </motion.section>
    </div>
  );
}
