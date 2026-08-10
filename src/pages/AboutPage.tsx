import { ArrowRight, Blocks, Compass, ShieldCheck, UsersRound } from 'lucide-react';
import Seo from '../components/Seo';
import { CTASection, EvidenceBlock, PageIntro, SectionHeading, pageWidth } from '../components/site/PublicUI';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo
        title="About B2W"
        description="B2W builds practical AI products for General Contracting businesses, beginning with JasonAI and the communication behind every active job."
        canonicalPath="/about"
      />
      <PageIntro
        eyebrow="About B2W"
        title="Make AI useful by starting with how the business works."
        description="B2W is a product company focused on General Contracting. We build practical AI around project communication, job context, and reviewed operating workflows so contractors can recover what happened without surrendering judgment or adopting another heavy system."
        primary={{ label: 'Discuss a business condition', to: '/contact' }}
      />

      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="01 · Who we serve" title="General contractors managing more job context than their tools can hold together." description="The strongest fit is an owner-led or operator-led General Contracting business with active projects, consequential customer decisions, and too much field and office context held together by memory and disconnected messages." />
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-4">
            {[
              { title: 'Owners', body: 'Need a clearer read on what is constraining the business and what deserves investment next.', Icon: Compass },
              { title: 'Operators', body: 'Need workflows, information, and accountability that match the way the team actually works.', Icon: UsersRound },
              { title: 'Builders', body: 'Need a precise scope, business context, ownership, and evidence to implement the right thing.', Icon: Blocks },
              { title: 'Product users', body: 'Need AI capability with explicit source boundaries, current-stage labels, and human review.', Icon: ShieldCheck },
            ].map((item) => <article key={item.title} className="min-h-72 bg-[var(--b2w-canvas)] p-7"><item.Icon className="h-5 w-5 text-[var(--b2w-gold-dark)]" /><h2 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">{item.title}</h2><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{item.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading index="02 · How B2W works" title="Strategy, systems, and AI belong in one operating sequence." description="The combination matters because no single layer resolves the full condition." />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ['Strategy defines the decision', 'B2W frames the condition, tests assumptions, and identifies the few decisions that change the operating path.'],
            ['Systems make the decision usable', 'Workflows, information structures, interfaces, and controls translate the choice into repeatable behavior.'],
            ['Implementation and products keep it alive', 'Builders carry the scope into use; focused products such as JasonAI improve repeatable work after launch.'],
          ].map(([title, body], index) => <article key={title} className={`rounded-[1.5rem] p-7 ${index === 1 ? 'bg-[var(--b2w-forest)] text-white' : 'border border-[var(--b2w-line)] bg-white'}`}><p className={`font-mono text-[10px] ${index === 1 ? 'text-[var(--b2w-gold)]' : 'text-[var(--b2w-gold-dark)]'}`}>0{index + 1}</p><h2 className="mt-12 text-3xl font-medium leading-tight tracking-[-0.04em]">{title}</h2><p className={`mt-5 text-sm leading-7 ${index === 1 ? 'text-white/65' : 'text-[var(--b2w-ink-muted)]'}`}>{body}</p></article>)}
        </div>
      </section>

      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="03 · Our focus" title="One industry. One operating problem worth solving deeply." description="B2W is focused on General Contracting because every project depends on communication moving accurately between owners, office teams, field crews, subcontractors, and customers." tone="rust" />
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-3">
            {[
              ['Job communication', 'Recover project context', 'JasonAI begins with approved communication so owners can find what changed without rereading every project thread.', 'Current product'],
              ['Project documents', 'Structure field evidence', 'Scopes, field reports, change orders, punch lists, and work packages translate job evidence into reviewable records.', 'Available resources'],
              ['Contractor workflows', 'Advance with control', 'Estimation and broader project workflows develop only after sources, human review, and operating responsibility are proven.', 'Product direction'],
            ].map(([area, priority, body, status], index) => <article key={area} className={`min-h-80 p-7 ${index === 2 ? 'bg-[var(--b2w-rust-dark)] text-white' : 'bg-[var(--b2w-canvas)]'}`}><p className={`font-mono text-[9px] uppercase tracking-[0.17em] ${index === 2 ? 'text-[var(--b2w-gold)]' : 'text-[var(--b2w-gold-dark)]'}`}>{status}</p><h2 className="mt-10 text-3xl font-medium tracking-[-0.04em]">{area}</h2><p className={`mt-3 text-sm font-semibold ${index === 2 ? 'text-white' : 'text-[var(--b2w-ink)]'}`}>{priority}</p><p className={`mt-5 text-sm leading-7 ${index === 2 ? 'text-white/65' : 'text-[var(--b2w-ink-muted)]'}`}>{body}</p></article>)}
          </div>
          <p className="mt-8 max-w-4xl text-xl leading-9 tracking-[-0.02em] text-[var(--b2w-ink-muted)]">General contractors do not need technology to replace their judgment. They need tools that equip the people they already trust with better project context and more efficient ways to work.</p>
        </div>
      </section>

      <section className="border-b border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="04 · Credibility" title="Credibility comes from the way the work is handled." description="B2W's strongest evidence is operational: clear sources, visible assumptions, working artifacts, explicit boundaries, and accountability through delivery." tone="green" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <EvidenceBlock label="Cross-functional depth">Engineering, product design, finance, infrastructure, robotics, and operating analysis.</EvidenceBlock>
            <EvidenceBlock label="Concrete artifacts">Profiles, models, portals, proposals, workflows, documentation, and working product interfaces.</EvidenceBlock>
            <EvidenceBlock label="Source discipline">Claims and recommendations remain connected to the evidence and assumptions that support them.</EvidenceBlock>
            <EvidenceBlock label="Visible boundaries">Current, planned, and future capability are separated before commercial or operating decisions are made.</EvidenceBlock>
          </div>
        </div>
      </section>

      <section id="team" className={`${pageWidth} scroll-mt-28 py-16 sm:py-24`}>
        <SectionHeading index="05 · Team" title="More than ten years of working together." description="The Business Plan names a simple leadership structure: direction, operating optimization, and secure technical delivery." />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ['Ali', 'CEO', 'Believes every business owner should have practical tools that alleviate pain points and enable growth.'],
            ['Aaron', 'COO', 'Keeps each client on a pathway toward a more optimized, accountable business.'],
            ['Feng', 'CTO', 'Leads the technical work with close attention to security and the controls users require.'],
          ].map(([name, role, body]) => <article key={name} className="rounded-[1.5rem] border border-[var(--b2w-line)] bg-white p-7"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold-dark)]">{role}</p><h2 className="mt-8 text-3xl font-medium tracking-[-0.04em]">{name}</h2><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{body}</p></article>)}
        </div>
        <div className="mt-7 flex justify-end"><a href="mailto:info@b2w-ai.com?subject=B2W%20Partnership%20Inquiry" className="group inline-flex min-h-12 items-center justify-between gap-8 rounded-full border border-[var(--b2w-line)] bg-white px-5 text-sm font-semibold">Introduce your practice<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></a></div>
      </section>

      <CTASection eyebrow="Advance" title="Bring B2W a condition worth resolving." description="Share what changed, where the friction is visible, and what decision or outcome matters next. B2W will route the conversation to the right path." action={{ label: 'Contact B2W', to: '/contact' }} secondary={{ label: 'Explore services', to: '/services' }} />
    </div>
  );
}
