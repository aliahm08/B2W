import { Link } from 'react-router-dom';

const offerings = [
  {
    title: 'AI Clarity Sessions',
    body: 'Translate fast-moving AI trends into practical decisions for your role, team, and next quarter.'
  },
  {
    title: 'Communication Workflows',
    body: 'Improve how you brief, align, and follow through across product, design, engineering, and leadership.'
  },
  {
    title: 'Personal Action Systems',
    body: 'Build high-signal AI copilots for notes, synthesis, and decision prep without adding tool overhead.'
  }
];

export default function IndividualsPage() {
  return (
    <div className="page-stack">
      <section className="subpage-hero reveal">
        <p className="eyebrow">Individuals</p>
        <h1>AI support for professionals who need better signal, less noise.</h1>
        <p>
          We help individual operators and leaders integrate AI into daily execution so communication is cleaner and
          decisions are faster.
        </p>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>What you get</h2>
        </div>
        <div className="card-grid">
          {offerings.map((item) => (
            <article key={item.title} className="surface-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Typical outcomes</h2>
        </div>
        <div className="outcome-grid">
          <article className="outcome-card">
            <p className="outcome-metric">2x</p>
            <p>faster weekly planning and prioritization</p>
          </article>
          <article className="outcome-card">
            <p className="outcome-metric">Clearer</p>
            <p>cross-functional updates and stakeholder communication</p>
          </article>
          <article className="outcome-card">
            <p className="outcome-metric">Higher</p>
            <p>confidence in turning insights into concrete next actions</p>
          </article>
        </div>
      </section>

      <section className="cta-section reveal">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2>Upgrade your personal operating system with B2W</h2>
          <p>Start with a scoped session and expand into a repeatable AI-enabled workflow.</p>
        </div>
        <Link className="btn" to="/enterprises">
          See Enterprise Path
        </Link>
      </section>
    </div>
  );
}
