import { ArrowRight, Check, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { CTASection, Eyebrow, PageIntro, SectionHeading, pageWidth } from '../../components/site/PublicUI';
import { services } from '../../content/unifiedSite';

const layerNotes = [
  ['Direction', 'Decide what matters, what evidence is missing, and what must be true before money or attention moves.'],
  ['Operating design', 'Translate the decision into information, roles, rules, interfaces, and a workflow the team can actually use.'],
  ['Accountable delivery', 'Build, document, launch, and measure the approved intervention with clear ownership.'],
] as const;

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="Strategy, Systems, and Implementation" description="B2W helps businesses decide what matters, organize how the work moves, and implement the right intervention with accountable ownership." canonicalPath="/services" />

      <PageIntro eyebrow="B2W · Services" title="One operating sequence. Three ways to enter it." description="The service architecture follows the Business Plan: Strategy sets direction, Systems makes the direction usable, and Implementation carries it into the business. A customer can begin at the layer where the condition is visible." primary={{ label: 'Discuss the business condition', to: 'mailto:info@b2w-ai.com' }} secondary={{ label: 'See JasonAI', to: '/jasonai' }} />

      <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-ink)] text-white">
        <div className={`${pageWidth} py-12 sm:py-16`}>
          <div className="grid gap-px border border-white/15 bg-white/15 md:grid-cols-3">
            {layerNotes.map(([title, body], index) => (
              <article key={title} className="bg-[var(--b2w-ink)] p-6 sm:p-8"><p className="font-mono text-[10px] text-[#8fc2d7]">0{index + 1}</p><h2 className="mt-8 text-2xl font-medium">{title}</h2><p className="mt-4 text-sm leading-7 text-white/55">{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading index="01 · Information architecture" title="Each service answers five questions before it asks for a sale." description="The condition, the work, the output, the intended customer, and the next action stay together. That makes the offer legible without flattening every engagement into a fixed package." />
        <div className="space-y-8">
          {services.map((service, index) => (
            <article id={service.id} key={service.id} className="scroll-mt-28 border border-[var(--b2w-line)] bg-white">
              <header className={`grid gap-8 border-b border-[var(--b2w-line)] p-7 sm:p-9 lg:grid-cols-[160px_minmax(0,1fr)_320px] lg:items-end ${index === 1 ? 'bg-[var(--b2w-rust-dark)] text-white' : 'bg-[var(--b2w-canvas)]'}`}>
                <div><p className={`font-mono text-[10px] ${index === 1 ? 'text-[#8fc2d7]' : 'text-[var(--b2w-rust)]'}`}>{service.number}</p><p className={`mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] ${index === 1 ? 'text-white/45' : 'text-[var(--b2w-ink-faint)]'}`}>Operating layer</p></div>
                <h2 className="text-5xl font-medium leading-none tracking-[-0.06em] sm:text-6xl">{service.title}</h2>
                <p className={`text-sm leading-7 ${index === 1 ? 'text-white/62' : 'text-[var(--b2w-ink-muted)]'}`}>{service.condition}</p>
              </header>
              <div className="grid gap-px bg-[var(--b2w-line)] md:grid-cols-3">
                {[
                  ['What B2W does', service.work],
                  ['What the business receives', service.output],
                  ['Who should use this path', service.customer],
                ].map(([label, body]) => (
                  <div key={label} className="min-h-64 bg-white p-6 sm:p-7"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-rust)]">{label}</p><p className="mt-8 text-sm leading-7 text-[var(--b2w-ink-muted)]">{body}</p></div>
                ))}
              </div>
              <footer className="flex flex-col justify-between gap-5 border-t border-[var(--b2w-line)] bg-[var(--b2w-canvas)] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
                <p className="flex items-center gap-3 text-sm font-medium"><Check className="h-4 w-4 text-[var(--b2w-green)]" />The scope follows the diagnosis.</p>
                <Link to={service.href} className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--b2w-rust)]">{service.nextAction}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
            <div><Eyebrow tone="rust">The founder standard</Eyebrow><h2 className="mt-5 max-w-[13ch] text-5xl font-medium leading-[.95] tracking-[-0.055em] sm:text-6xl">Clarity before scope. Evidence before claims. Ownership before motion.</h2></div>
            <ol className="border-t border-[var(--b2w-line)]">
              {[
                ['Orient', 'Name the condition, the decision owner, and the outcome that actually matters.'],
                ['Diagnose', 'Collect enough evidence to locate the real constraint instead of treating the symptom.'],
                ['Resolve', 'Choose the smallest useful intervention and make the tradeoffs explicit.'],
                ['Prove', 'Review the output, its sources, its limits, and how success will be measured.'],
                ['Advance', 'Approve one next action with an owner, a date, and a gate.'],
              ].map(([title, body], index) => (
                <li key={title} className="grid gap-4 border-b border-[var(--b2w-line)] py-5 sm:grid-cols-[60px_150px_minmax(0,1fr)] sm:items-center"><span className="font-mono text-[10px] text-[var(--b2w-rust)]">0{index + 1}</span><span className="text-lg font-semibold">{title}</span><span className="flex gap-3 text-sm leading-7 text-[var(--b2w-ink-muted)]"><Circle className="mt-2 h-2 w-2 shrink-0 fill-[var(--b2w-rust)] text-[var(--b2w-rust)]" />{body}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Begin with the condition" title="Do not buy the solution before the problem is clear." description="Tell us what changed, where the work is breaking down, and what the business needs to understand or accomplish next." action={{ label: 'Book a founder conversation', to: 'mailto:info@b2w-ai.com' }} secondary={{ label: 'Review JasonAI', to: '/jasonai' }} />
    </div>
  );
}
