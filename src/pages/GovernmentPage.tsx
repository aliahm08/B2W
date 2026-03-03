import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ctaHref, ctaLabel, missionStatement } from '../content/mission';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
};

export default function GovernmentPage() {
  const prefersReducedMotion = useReducedMotion();
  const heroMotion = prefersReducedMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const, variants: fadeIn };
  const revealMotion = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-70px' },
        variants: fadeIn
      };

  return (
    <div className="page-stack">
      <motion.section className="hero-block hero-grid" {...heroMotion}>
        <div className="hero-copy">
          <p className="kicker">Government</p>
          <h1>AI platforms for federal agencies</h1>
          <p className="hero-support">{missionStatement}</p>
          <a className="btn" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>

        <div className="hero-surface" aria-label="Government platform preview">
          <div className="surface-topbar">
            <span className="surface-dot" />
            <span className="surface-dot" />
            <span className="surface-dot" />
          </div>
          <div className="surface-panel">
            <div className="panel-row">
              <span className="panel-label">Security Control Layer</span>
              <span className="panel-tag">Scoped</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Compliance Mapping</span>
              <span className="panel-tag">Structured</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Workflow Governance</span>
              <span className="panel-tag">Managed</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="content-block" {...revealMotion}>
        <div className="section-header">
          <h2>Platform Control Surface</h2>
          <p>
            Structured platform controls for secure operations, compliance alignment, and governed workflow
            execution.
          </p>
        </div>

        <div className="product-surface">
          <div className="surface-head">
            <div className="surface-tabs" role="list" aria-label="Government platform controls">
              <span className="tab-pill active">Security</span>
              <span className="tab-pill">Compliance</span>
              <span className="tab-pill">Governance</span>
            </div>
            <span className="surface-state">Control View</span>
          </div>

          <div className="surface-layout">
            <aside className="surface-rail" aria-label="Government modules">
              <div className="rail-item active">Identity</div>
              <div className="rail-item">Policy</div>
              <div className="rail-item">Review</div>
              <div className="rail-item">Escalation</div>
            </aside>

            <div className="surface-main">
              <div className="surface-grid">
                <article className="surface-card">
                  <h3>Security</h3>
                  <ul>
                    <li>Access boundaries</li>
                    <li>Identity controls</li>
                    <li>Operational safeguards</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Compliance</h3>
                  <ul>
                    <li>Policy mapping</li>
                    <li>Review checkpoints</li>
                    <li>Audit alignment</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Governance</h3>
                  <ul>
                    <li>Decision routing</li>
                    <li>Escalation paths</li>
                    <li>Oversight workflow</li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="cta-block" {...revealMotion}>
        <h2>Explore how your operations can run better with B2W.</h2>
        <a className="btn" href={ctaHref}>
          {ctaLabel}
        </a>
      </motion.section>
    </div>
  );
}
