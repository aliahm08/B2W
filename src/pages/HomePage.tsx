import { Link } from 'react-router-dom';

const proofPoints = ['NASA', 'Waymo', 'GE Electric', 'Autodesk', 'GWU', 'CMU', 'Columbia'];

const solutionCards = [
  {
    title: 'Individuals',
    body: 'For founders and leaders building AI literacy, communication clarity, and practical decision support.',
    href: '/individuals'
  },
  {
    title: 'Enterprises',
    body: 'For organizations that need production-ready AI workflows, better alignment, and measurable operating gains.',
    href: '/enterprises'
  },
  {
    title: 'Government Solutions',
    body: 'For public sector teams modernizing service delivery with trusted AI implementation and accountable governance.',
    href: '/government-solutions'
  }
];

const operatingModel = [
  {
    title: 'Discover',
    body: 'We map communication bottlenecks, workflow friction, and the specific decisions that drive business performance.'
  },
  {
    title: 'Design',
    body: 'Engineers, designers, and product leaders co-create a focused AI plan tied to operational outcomes.'
  },
  {
    title: 'Deploy',
    body: 'We ship quickly, instrument impact, and help teams sustain adoption with clear ownership and feedback loops.'
  }
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero reveal">
        <div className="hero-content">
          <p className="eyebrow">B2W-AI.COM</p>
          <h1>
            AI consulting that helps your business
            <span> communicate better and run better.</span>
          </h1>
          <p className="hero-copy">
            B2W develops AI to improve communication and optimize actionable insights. We are a consulting team of
            engineers, designers, and product leaders focused on measurable business outcomes.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/enterprises">
              Explore Solutions
            </Link>
            <a className="btn btn-subtle" href="mailto:team@b2w-ai.com">
              Book Strategy Call
            </a>
          </div>
        </div>

        <aside className="hero-panel reveal-delayed">
          <p className="panel-label">Track Record</p>
          <p className="panel-stat">30 years</p>
          <p className="panel-copy">Combined experience delivering value in complex organizations.</p>
          <div className="chip-row">
            {proofPoints.slice(0, 4).map((point) => (
              <span key={point} className="chip">
                {point}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="trust-strip reveal">
        <p>Built across teams and institutions including:</p>
        <div className="logo-strip">
          {proofPoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <p className="eyebrow">Where We Help</p>
          <h2>Three pathways to smarter execution</h2>
        </div>
        <div className="card-grid">
          {solutionCards.map((card) => (
            <article key={card.title} className="surface-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <Link to={card.href} className="text-link">
                View {card.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <p className="eyebrow">How B2W Works</p>
          <h2>Execution structure that keeps momentum</h2>
        </div>
        <div className="path-grid">
          {operatingModel.map((step, index) => (
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
          <p className="eyebrow">Get Started</p>
          <h2>Explore how your business can run better with B2W</h2>
          <p>
            Bring us your highest-friction communication and decision workflows. We will help your team move from
            scattered data to clear action.
          </p>
        </div>
        <a className="btn" href="mailto:team@b2w-ai.com">
          Start the Conversation
        </a>
      </section>
    </div>
  );
}
