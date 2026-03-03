import { motion, Variants } from 'framer-motion';
import { Building2, Database, FileText, ShieldAlert } from 'lucide-react';

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function EnterprisesPage() {
  return (
    <div className="page-stack" style={{ gap: '4rem', marginTop: '2rem' }}>
      <motion.section className="hero-grid" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '-0.5rem' }}>Enterprises</p>
          <h1>
            AI consulting for organizations that need
            <span>real adoption, not shelfware.</span>
          </h1>
          <p>
            B2W helps enterprises deploy AI with clear governance, practical workflows, and execution standards that hold
            up under scale.
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
            className="dashboard-window"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ margin: '0 auto', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}
          >
            <header className="dashboard-header">
              <div className="mac-dots">
                <span /> <span /> <span />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8faac8', marginLeft: '1rem', fontWeight: 600 }}>
                B2W SaaS Risk Analytics
              </div>
            </header>
            <div className="dashboard-body">
              <aside className="dashboard-sidebar">
                <div className="dash-icon active"><Building2 size={14} color="#55d9c2" /></div>
                <div className="dash-icon"><Database size={14} color="#a5bee0" /></div>
                <div className="dash-icon"><FileText size={14} color="#a5bee0" /></div>
                <div className="dash-icon"><ShieldAlert size={14} color="#a5bee0" /></div>
              </aside>
              <main className="dashboard-main">
                <div className="dash-widget full">
                  <span className="widget-title">Cross-org Alignment Index</span>
                  <span className="widget-val">87.4%</span>
                  <div className="widget-chart-bar"><div className="widget-chart-fill" style={{ width: '87.4%' }} /></div>
                </div>
                <div className="dash-widget">
                  <span className="widget-title">Delivery Latency</span>
                  <span className="widget-val">-1.2 days</span>
                </div>
                <div className="dash-widget">
                  <span className="widget-title">Risk Anomalies</span>
                  <span className="widget-val" style={{ color: '#ffbd2e' }}>2 detected</span>
                </div>
              </main>
            </div>
          </motion.article>
        </div>
      </motion.section>
    </div>
  );
}
