import { Link } from 'react-router-dom';

const priorities = [
  {
    title: 'Mission-Oriented Design',
    body: 'Map AI initiatives to service outcomes, response quality, and constituent communication standards.'
  },
  {
    title: 'Governance by Default',
    body: 'Build reviewable workflows with transparent decision paths and clear accountability roles.'
  },
  {
    title: 'Secure Implementation',
    body: 'Structure pilots around risk controls, staged rollout, and audit-friendly operating documentation.'
  }
];

export default function GovernmentSolutionsPage() {
  return (
    <div className="page-stack">
      <section className="subpage-hero reveal">
        <p className="eyebrow">Government Solutions</p>
        <h1>Trusted AI modernization for public sector programs.</h1>
        <p>
          B2W helps agencies and partners improve service communication and decision quality while maintaining rigorous
          governance expectations.
        </p>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Public sector focus areas</h2>
        </div>
        <div className="card-grid">
          {priorities.map((item) => (
            <article key={item.title} className="surface-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Why B2W</h2>
        </div>
        <div className="outcome-grid">
          <article className="outcome-card">
            <p className="outcome-metric">30 Years</p>
            <p>Combined experience across high-stakes institutions and technical programs</p>
          </article>
          <article className="outcome-card">
            <p className="outcome-metric">Cross-Disciplinary</p>
            <p>Engineers, designers, and product leaders operating as one integrated team</p>
          </article>
          <article className="outcome-card">
            <p className="outcome-metric">Actionable</p>
            <p>Every insight tied to next-step implementation and operational ownership</p>
          </article>
        </div>
      </section>

      <section className="cta-section reveal">
        <div>
          <p className="eyebrow">Engage B2W</p>
          <h2>Plan your first mission-aligned AI pilot</h2>
          <p>We scope for value, transparency, and durability from day one.</p>
        </div>
        <Link className="btn" to="/">
          Return Home
        </Link>
      </section>
    </div>
  );
}
