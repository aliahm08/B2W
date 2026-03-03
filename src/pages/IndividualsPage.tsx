import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ctaHref, ctaLabel, missionStatement } from '../content/mission';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
};

export default function IndividualsPage() {
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
          <p className="kicker">Individuals</p>
          <h1>AI services for Individuals</h1>
          <p className="hero-support">{missionStatement}</p>
          <a className="btn" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>

        <div className="hero-surface" aria-label="Individuals workflow preview">
          <div className="surface-topbar">
            <span className="surface-dot" />
            <span className="surface-dot" />
            <span className="surface-dot" />
          </div>
          <div className="surface-panel">
            <div className="panel-row">
              <span className="panel-label">SOP Configuration</span>
              <span className="panel-tag">Defined</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Assistant Rules</span>
              <span className="panel-tag">Active</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">Delegated Response Scope</span>
              <span className="panel-tag">Controlled</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="content-block" {...revealMotion}>
        <div className="section-header">
          <h2>Workflow Surface</h2>
          <p>
            Individuals define communication rules, review summaries, and control where the assistant can
            act on their behalf.
          </p>
        </div>

        <div className="product-surface">
          <div className="surface-head">
            <div className="surface-tabs" role="list" aria-label="Individuals workflow stages">
              <span className="tab-pill active">Configuration</span>
              <span className="tab-pill">Assistant</span>
              <span className="tab-pill">Deployment</span>
            </div>
            <span className="surface-state">Workflow View</span>
          </div>

          <div className="surface-layout">
            <aside className="surface-rail" aria-label="Individuals modules">
              <div className="rail-item active">SOP Intake</div>
              <div className="rail-item">Behavior Rules</div>
              <div className="rail-item">Escalation</div>
              <div className="rail-item">Action Queue</div>
            </aside>

            <div className="surface-main">
              <div className="surface-grid">
                <article className="surface-card">
                  <h3>Configuration</h3>
                  <ul>
                    <li>SOP mapping</li>
                    <li>Communication preferences</li>
                    <li>Escalation policy</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Assistant Behavior</h3>
                  <ul>
                    <li>Summary generation</li>
                    <li>Conversation routing</li>
                    <li>Approval thresholds</li>
                  </ul>
                </article>
                <article className="surface-card">
                  <h3>Deployment</h3>
                  <ul>
                    <li>Message handling scope</li>
                    <li>Action execution boundaries</li>
                    <li>Feedback loop updates</li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="content-block" {...revealMotion}>
        <div className="section-header">
          <h2>Capabilities</h2>
        </div>
        <div className="capability-grid">
          <article className="capability-card">
            <h3>Communication Optimization</h3>
            <p>Structure inbound and outbound communication through clear assistant rules.</p>
          </article>
          <article className="capability-card">
            <h3>Workflow Structuring</h3>
            <p>Translate individual SOPs into configurable behavior and response boundaries.</p>
          </article>
          <article className="capability-card">
            <h3>Action Coordination</h3>
            <p>Manage approvals and delegated actions through a single operating surface.</p>
          </article>
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
