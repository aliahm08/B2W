import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ctaHref, ctaLabel, missionStatement } from '../content/mission';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
};

export default function EnterprisesPage() {
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
          <p className="kicker">Enterprises</p>
          <h1>AI consulting for enterprise clients</h1>
          <p className="hero-support">{missionStatement}</p>
          <a className="btn" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>

        <div className="hero-surface" aria-label="Enterprise consulting preview">
          <div className="surface-topbar">
            <span className="surface-dot" />
            <span className="surface-dot" />
            <span className="surface-dot" />
          </div>
          <div className="surface-panel">
            <div className="panel-row">
              <span className="panel-label">Operating Model Discovery</span>
              <span className="panel-tag">Scoping</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">AI Architecture Plan</span>
              <span className="panel-tag">Drafted</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Integration Track</span>
              <span className="panel-tag">Sequenced</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="content-block" {...revealMotion}>
        <div className="section-header">
          <h2>Consulting Lifecycle Surface</h2>
          <p>
            Structured consulting flow across strategy definition, architecture planning, and integration
            sequencing.
          </p>
        </div>

        <div className="product-surface">
          <div className="surface-head">
            <div className="surface-tabs" role="list" aria-label="Enterprise lifecycle stages">
              <span className="tab-pill active">Strategy</span>
              <span className="tab-pill">Architecture</span>
              <span className="tab-pill">Integration</span>
            </div>
            <span className="surface-state">Consulting View</span>
          </div>

          <div className="surface-layout">
            <aside className="surface-rail" aria-label="Enterprise modules">
              <div className="rail-item active">Business Scope</div>
              <div className="rail-item">System Design</div>
              <div className="rail-item">Data Workflow</div>
              <div className="rail-item">Implementation Plan</div>
            </aside>

            <div className="surface-main">
              <div className="surface-grid">
                <article className="surface-card">
                  <h3>Strategy</h3>
                  <ul>
                    <li>Operating model assessment</li>
                    <li>Prioritization framework</li>
                    <li>Adoption planning</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Architecture</h3>
                  <ul>
                    <li>System design boundaries</li>
                    <li>Data and workflow mapping</li>
                    <li>Integration strategy</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Integration</h3>
                  <ul>
                    <li>Implementation sequencing</li>
                    <li>Governance controls</li>
                    <li>Operational handoff</li>
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
