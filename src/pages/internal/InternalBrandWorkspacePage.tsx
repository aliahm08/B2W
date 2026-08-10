import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Gauge, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WIcon from '../../components/logo/B2WIcon';
import Seo from '../../components/Seo';
import InternalDocumentNav from '../../components/internal/InternalDocumentNav';
import {
  decisionsRequired, gapRows, notNow, ownership, planningHorizons, prioritizationCriteria,
  prioritySequence, readinessDimensions, roadmap, workstreams,
} from '../../content/prioritizedPlan';

const labelClass = 'text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B27]';

function SectionHeading({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return (
    <header className="grid gap-5 border-t border-[#223C33]/12 pt-8 lg:grid-cols-[160px_minmax(0,1fr)]">
      <p className={labelClass}>{number} · {eyebrow}</p>
      <div><h2 className="text-4xl font-medium leading-none tracking-[-0.045em] sm:text-5xl">{title}</h2><p className="mt-5 max-w-3xl text-sm leading-7 text-[#223C33]/60">{description}</p></div>
    </header>
  );
}

export default function InternalBrandWorkspacePage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#17221E]">
      <Seo title="JasonAI Productization Prioritized Plan" description="Private B2W prioritized plan for turning JasonAI from a single-client demo into a repeatable product." robots="noindex, nofollow" canonicalPath="/internal/resources" />

      <header className="sticky top-0 z-40 border-b border-[#223C33]/10 bg-[#F6F3EC]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/internal" aria-label="Return to internal home" className="grid h-9 w-9 place-items-center rounded-full border border-[#223C33]/12 transition hover:bg-white"><ArrowLeft className="h-3.5 w-3.5" /></Link>
            <B2WIcon title="" className="h-8 w-9 text-[#223C33]" />
            <div><p className="b2w-wordmark text-[11px] font-semibold tracking-[0.16em]">B2W</p><p className="text-[8px] uppercase tracking-[0.2em] text-[#223C33]/45">Prioritized plan</p></div>
          </div>
          <span className="hidden rounded-full border border-[#B38B39]/25 bg-[#EDE4D1] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#7A5A1E] sm:inline-flex">JasonAI · Pre-launch</span>
        </div>
        <InternalDocumentNav />
      </header>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.25fr)_400px] xl:items-end">
          <div><p className={labelClass}>JasonAI productization prioritized plan</p><h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[6.25rem]">From single-client demo to repeatable product.</h1></div>
          <div className="rounded-[2rem] bg-[#223C33] p-7 text-white sm:p-8"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D8B56A]">Core question</p><p className="mt-5 text-xl leading-8 tracking-[-0.02em]">What must be true for B2W to deploy JasonAI to the next customer as a product rather than another custom demonstration?</p></div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[['Have', 'A working one-client test demo that creates real value but still depends on custom setup and direct founder support.'], ['Intend', 'A clearly defined package with repeatable technology, onboarding, operations, security, measurement, and commercial terms.'], ['Plan', 'Prove the package with a second suitable customer, measure repeatability and value, refine, then run a controlled launch.']].map(([title, copy]) => <div key={title} className="rounded-2xl border border-[#223C33]/12 bg-white/55 p-6"><p className={labelClass}>{title}</p><p className="mt-4 text-sm leading-7 text-[#223C33]/65">{copy}</p></div>)}
        </div>
      </section>

      <section className="border-y border-[#223C33]/12 bg-white/45"><div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="01" eyebrow="Direction" title="Move through evidence-based horizons." description="The immediate priority is definition and repeatability—not scale or broad feature expansion." />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#223C33]/12 bg-[#223C33]/12 md:grid-cols-4">{planningHorizons.map(([name, copy], index) => <div key={name} className="bg-[#F8F5EE] p-6"><span className="text-[9px] font-mono text-[#223C33]/35">0{index + 1}</span><h3 className="mt-8 text-2xl font-medium">{name}</h3><p className="mt-3 text-sm leading-6 text-[#223C33]/58">{copy}</p></div>)}</div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{prioritizationCriteria.map(([title, question]) => <div key={title} className="flex gap-4 rounded-2xl border border-[#223C33]/10 bg-white p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#997022]" /><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-[#223C33]/55">{question}</p></div></div>)}</div>
      </div></section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="02" eyebrow="Priority sequence" title="Six gates to a controlled launch." description="Each priority has a concrete exit condition. B2W advances only when the condition is met or leadership records an explicit exception." />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">{prioritySequence.map((item) => <article key={item.priority} className="rounded-[1.75rem] border border-[#223C33]/12 bg-white/55 p-7"><div className="flex items-start justify-between gap-5"><span className="text-sm font-mono font-semibold text-[#997022]">{item.priority}</span><ArrowRight className="h-4 w-4 text-[#223C33]/30" /></div><h3 className="mt-8 text-3xl font-medium tracking-[-0.035em]">{item.title}</h3><p className="mt-4 text-sm leading-7 text-[#223C33]/60">{item.summary}</p><div className="mt-6 border-l-2 border-[#D8B56A] pl-4"><p className={labelClass}>Exit condition</p><p className="mt-2 text-xs leading-6 text-[#223C33]/65">{item.exit}</p></div></article>)}</div>
      </section>

      <section className="bg-[#223C33] text-white"><div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="03" eyebrow="Gap analysis" title="Close the distance between demo and product." description="The productization gap is cross-functional. Technical reuse alone is not enough; the package must also be operable, secure, measurable, and commercially clear." />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/15"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-white/8 text-[9px] uppercase tracking-[0.16em] text-white/50"><tr>{['Area', 'What we have', 'What we intend', 'Plan owner'].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr></thead><tbody>{gapRows.map((row) => <tr key={row[0]} className="border-t border-white/10">{row.map((cell, index) => <td key={cell} className={`p-4 text-sm leading-6 ${index === 0 ? 'font-semibold text-white' : 'text-white/65'}`}>{cell}</td>)}</tr>)}</tbody></table></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{workstreams.map(([title, items]) => <div key={title} className="rounded-2xl border border-white/12 bg-white/5 p-6"><h3 className="text-xl font-medium">{title}</h3><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-xs leading-6 text-white/65"><Circle className="mt-2 h-1.5 w-1.5 shrink-0 fill-[#D8B56A] text-[#D8B56A]" />{item}</li>)}</ul></div>)}</div>
      </div></section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="04" eyebrow="Accountability" title="Make ownership and sequence explicit." description="CEO holds market, packaging, measurement, and launch accountability; CTO owns technical productization and security; COO owns repeatable onboarding and support." />
        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <div className="overflow-hidden rounded-2xl border border-[#223C33]/12 bg-white/55">{ownership.map(([area, accountable, support]) => <div key={area} className="grid gap-2 border-b border-[#223C33]/10 p-5 last:border-b-0 sm:grid-cols-[1fr_130px_1fr]"><p className="text-sm font-semibold">{area}</p><p className="text-xs font-semibold text-[#997022]">{accountable}</p><p className="text-xs leading-5 text-[#223C33]/55">{support}</p></div>)}</div>
          <ol className="rounded-2xl border border-[#223C33]/12 bg-[#EDE4D1]/55 p-6">{roadmap.map((step, index) => <li key={step} className="flex gap-4 border-b border-[#223C33]/10 py-3 first:pt-0 last:border-b-0 last:pb-0"><span className="font-mono text-[10px] text-[#997022]">{String(index + 1).padStart(2, '0')}</span><span className="text-sm leading-6">{step}</span></li>)}</ol>
        </div>
      </section>

      <section className="border-y border-[#223C33]/12 bg-white/45"><div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="05" eyebrow="Readiness" title="Measure readiness, not activity." description="Score each dimension as Not defined, Defined, In development, Test-ready, or Validated. Movement requires evidence." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{readinessDimensions.map(([title, question]) => <div key={title} className="rounded-2xl border border-[#223C33]/12 bg-[#F8F5EE] p-6"><div className="flex items-center justify-between gap-4"><Gauge className="h-5 w-5 text-[#997022]" /><span className="rounded-full border border-[#223C33]/12 px-2.5 py-1 text-[8px] uppercase tracking-[0.12em] text-[#223C33]/45">Not scored</span></div><h3 className="mt-8 text-xl font-medium">{title}</h3><p className="mt-3 text-xs leading-6 text-[#223C33]/55">{question}</p></div>)}</div>
      </div></section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading number="06" eyebrow="Leadership decisions" title="Protect focus before expanding scope." description="These decisions unblock the current sequence. The not-now list protects the product team from work that does not prove the next deployment." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2"><div className="rounded-[1.75rem] border border-[#223C33]/12 bg-white/60 p-7"><h3 className="text-2xl font-medium">Decisions required</h3><ol className="mt-6 space-y-4">{decisionsRequired.map((item, index) => <li key={item} className="flex gap-4 text-sm leading-6"><span className="font-mono text-[10px] text-[#997022]">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol></div><div className="rounded-[1.75rem] bg-[#223C33] p-7 text-white"><h3 className="text-2xl font-medium">Not now</h3><p className="mt-3 text-xs leading-6 text-white/55">Visible in the architecture, but not active productization priorities.</p><ul className="mt-6 space-y-4">{notNow.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-white/70"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B56A]" />{item}</li>)}</ul></div></div>
      </section>

      <section className="border-t border-[#223C33]/12 bg-[#EDE4D1]/45"><div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div><p className={labelClass}>Operating hierarchy</p><p className="mt-5 text-3xl font-medium leading-tight tracking-[-0.035em]">Business Plan → Prioritized Plan → Execution Tracker → Supporting Documentation</p></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white/65 p-5"><p className={labelClass}>Weekly</p><p className="mt-3 text-xs leading-6 text-[#223C33]/60">Review active priorities, blockers, evidence, decisions, and stop/not-now items.</p></div><div className="rounded-2xl bg-white/65 p-5"><p className={labelClass}>Monthly</p><p className="mt-3 text-xs leading-6 text-[#223C33]/60">Review readiness scores and confirm the product definition still matches evidence.</p></div><Link to="/internal/resources/website-architecture" className="group rounded-2xl bg-white/65 p-5 transition hover:bg-white"><p className={labelClass}>Supporting documentation</p><p className="mt-3 flex items-end justify-between gap-4 text-xs leading-6 text-[#223C33]/60">Website + business architecture <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p></Link></div>
      </div></section>
    </main>
  );
}
