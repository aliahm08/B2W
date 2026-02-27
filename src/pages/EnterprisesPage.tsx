import { Link } from 'react-router-dom';

const capabilities = [
  {
    title: 'AI Workflow Architecture',
    body: 'Design systems that connect internal knowledge, communication channels, and key decisions.'
  },
  {
    title: 'Cross-Functional Adoption',
    body: 'Align executives, product, engineering, and operations around shared AI practices and outcomes.'
  },
  {
    title: 'Outcome Instrumentation',
    body: 'Track productivity and quality metrics so AI performance is visible and accountable.'
  }
];

const roadmap = [
  {
    title: '30-Day Diagnostic',
    body: 'Assess communication and insight bottlenecks, then define high-value use cases with clear owners.'
  },
  {
    title: '60-Day Pilot Layer',
    body: 'Deploy focused pilots across selected teams with enablement sessions and rapid iteration loops.'
  },
  {
    title: '90-Day Scale Plan',
    body: 'Roll out operating playbooks, governance checks, and expansion roadmap for sustained impact.'
  }
];

export default function EnterprisesPage() {
  return (
    <div className="page-stack">
      <section className="subpage-hero reveal">
        <p className="eyebrow">Enterprises</p>
        <h1>Operational AI consulting for organizations that need real adoption.</h1>
        <p>
          B2W helps enterprises deploy AI responsibly across teams while improving communication velocity and execution
          quality.
        </p>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Enterprise capabilities</h2>
        </div>
        <div className="card-grid">
          {capabilities.map((item) => (
            <article key={item.title} className="surface-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Engagement roadmap</h2>
        </div>
        <div className="path-grid">
          {roadmap.map((step, index) => (
            <article key={step.title} className="path-card">
              <p className="path-index">0{index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section reveal">
        <div>
          <p className="eyebrow">Briefing</p>
          <h2>Bring B2W into your next quarter planning cycle</h2>
          <p>
            We partner with engineering, design, and product leadership to deliver high-confidence AI operating gains.
          </p>
        </div>
        <Link className="btn" to="/government-solutions">
          View Government Solutions
        </Link>
      </section>
    </div>
  );
}
