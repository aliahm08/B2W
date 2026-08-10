import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Bot, Calculator, Check, Clock3, DollarSign, Layers3, LockKeyhole, MessageSquareText, RotateCcw, ShieldCheck, TrendingUp, Users, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import BusinessHorizonExplorer from '../../components/site/BusinessHorizonExplorer';
import { ButtonLink, CTASection, EvidenceBlock, PageIntro, SectionHeading, StatusBadge, pageWidth } from '../../components/site/PublicUI';
import { stageOrder, workflows } from '../../content/unifiedSite';

export function ProductsIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="B2W Products: Now, Next, and Future" description="See JasonAI as B2W's current assistant, the workflows planned next, and the longer-term governed agent platform direction." canonicalPath="/products" />
      <PageIntro
        eyebrow="Products"
        title="One useful assistant now. A governed platform only after proof."
        description="JasonAI is the current commercial assistant for general contractors. Clara and Gurge remain clearly labeled directions inside the Business Plan—not available products."
        primary={{ label: 'Explore JasonAI', to: '/jasonai', variant: 'product' }}
        secondary={{ label: 'Review pricing', to: '/products/pricing' }}
        tone="rust"
      />
      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="01 · Product model" title="Agents perform the work. Workflows explain the value." description="Pricing separates the recurring product from the implementation needed to make it useful in a real business." tone="rust" />
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { title: 'Agents', body: 'The assistant a team works with. JasonAI is available now for approved communication search and job summaries.', to: '/products/agents', Icon: Bot, status: 'Available now' as const },
              { title: 'Workflows', body: 'The real user actions and outcomes the product supports, with current and planned stages kept visible.', to: '/products/workflows', Icon: Workflow, status: 'Available now' as const },
              { title: 'Pricing', body: 'The $99 product subscription, $2,000 WhatsApp setup, founder consultation, included scope, and expansion boundaries.', to: '/products/pricing', Icon: Layers3, status: 'Published' as const },
            ].map((item) => (
              <Link key={item.title} to={item.to} className="group flex min-h-[340px] flex-col rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-[var(--b2w-shadow)]">
                <div className="flex items-center justify-between"><item.Icon className="h-5 w-5 text-[var(--b2w-rust)]" /><StatusBadge stage={item.status} /></div>
                <h2 className="mt-16 text-3xl font-medium tracking-[-0.04em]">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{item.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">Open {item.title}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading index="02 · Product direction" title="Read the product, pricing, and success model by horizon." description="The internal NOW, FUTURE, and IDEAL structure is translated into Now, Up next, and In store so the destination stays visible without overstating the current release." tone="rust" />
        <BusinessHorizonExplorer compact />
      </section>
      <CTASection eyebrow="Current product" title="Start with JasonAI’s communication-search wedge." description="The near-term product is deliberately narrow: approved communication search and useful job summaries through a channel contractor teams already use." action={{ label: 'Meet JasonAI', to: '/jasonai', variant: 'product' }} tone="rust" />
    </div>
  );
}

export function AgentsPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="B2W Agents and JasonAI" description="JasonAI is B2W's current commercial agent for searching approved contractor communication and creating job summaries." canonicalPath="/products/agents" />
      <PageIntro eyebrow="Products · Agents" title="One current agent. Clear boundaries." description="JasonAI is the agent B2W currently offers. Future agents may extend the system into other workflows, but they are not presented as available products." primary={{ label: 'Open JasonAI', to: '/jasonai', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
            <article className="rounded-[2rem] bg-[var(--b2w-rust-dark)] p-7 text-white sm:p-10">
              <div className="flex items-center justify-between gap-4"><Bot className="h-6 w-6 text-[var(--b2w-gold)]" /><StatusBadge stage="Available now" /></div>
              <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold)]">JasonAI</p>
              <h1 className="mt-4 max-w-[13ch] text-5xl font-medium leading-[.96] tracking-[-0.05em]">Search the work your team already discussed.</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">A WhatsApp-ready assistant for contractor businesses that searches approved communication and turns long job threads into concise summaries.</p>
              <ButtonLink to="/jasonai" variant="secondary" className="mt-8 border-white/15 bg-white text-[var(--b2w-rust-dark)]">JasonAI overview</ButtonLink>
            </article>
            <aside className="rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-7">
              <LockKeyhole className="h-6 w-6 text-[var(--b2w-gold-dark)]" />
              <p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold-dark)]">Planned agent model</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">Future agents stay off the shelf until proven.</h2>
              <p className="mt-5 text-sm leading-7 text-[var(--b2w-ink-muted)]">The Business Plan places Clara in a next management-agent direction and Gurge in the longer-term operator-agent direction. Neither name, workflow, price, nor availability should be treated as commercial until product direction marks it available.</p>
              <div className="mt-8"><StatusBadge stage="Planned" /></div>
            </aside>
          </div>
        </div>
      </section>
      <CTASection eyebrow="Agent fit" title="See whether JasonAI fits the way your team communicates." description="A fit review starts with the sources your team uses, the job questions they lose time answering, and the controls the business requires." action={{ label: 'Request a JasonAI review', to: '/contact?type=jasonai', variant: 'product' }} secondary={{ label: 'Read the privacy model', to: '/jasonai/privacy' }} tone="rust" />
    </div>
  );
}

export function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="B2W Product Workflows" description="See the product workflows B2W supports now, is developing, and may add later, explained through user actions and outcomes." canonicalPath="/products/workflows" />
      <PageIntro eyebrow="Products · Workflows" title="Understand what the product helps people do." description="Workflow stages make the product boundary explicit. Available work is usable today; development and future work remain promises to test—not capabilities to imply." primary={{ label: 'Review JasonAI', to: '/jasonai', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          {stageOrder.filter((stage) => workflows.some((workflow) => workflow.stage === stage)).map((stage, groupIndex) => (
            <section key={stage} className={groupIndex ? 'mt-16 border-t border-[var(--b2w-line)] pt-16' : ''}>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><StatusBadge stage={stage} /><h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">{stage}</h2></div><p className="max-w-md text-sm leading-6 text-[var(--b2w-ink-muted)]">{stage === 'Available now' ? 'Usable within the current JasonAI product boundary.' : stage === 'In development' ? 'Being developed after the core search and summary workflow.' : 'Requires proven controls, customer demand, and owner approval.'}</p></div>
              <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] md:grid-cols-2">
                {workflows.filter((workflow) => workflow.stage === stage).map((workflow) => (
                  <article key={workflow.title} className="min-h-72 bg-[var(--b2w-canvas)] p-7">
                    <MessageSquareText className="h-5 w-5 text-[var(--b2w-rust)]" />
                    <h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em]">{workflow.title}</h3>
                    <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-ink-faint)]">User action</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--b2w-ink-muted)]">{workflow.action}</p>
                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-ink-faint)]">Outcome</p>
                    <p className="mt-2 text-sm font-medium leading-6">{workflow.outcome}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <CTASection eyebrow="Workflow fit" title="Start with one urgent, reviewable workflow." description="B2W begins with a narrow outcome the business can verify before adding more sources, reporting, or action capability." action={{ label: 'Discuss workflow fit', to: '/contact?type=jasonai', variant: 'product' }} tone="rust" />
    </div>
  );
}

function RangeField({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-[1.25rem] border border-[var(--b2w-line)] bg-white/70 p-5">
      <span className="flex items-center justify-between gap-4"><span className="text-sm font-semibold">{label}</span><span className="rounded-full bg-[var(--b2w-rust-soft)] px-3 py-1 text-xs font-semibold text-[var(--b2w-rust-dark)]">{value}{suffix}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-5 w-full accent-[var(--b2w-rust)]" />
      <span className="mt-2 flex justify-between text-[9px] text-[var(--b2w-ink-faint)]"><span>{min}{suffix}</span><span>{max}{suffix}</span></span>
    </label>
  );
}

function ROICalculator() {
  const [people, setPeople] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(2);
  const [hourlyValue, setHourlyValue] = useState(45);
  const [recoverableShare, setRecoverableShare] = useState(30);

  const monthlyHoursReviewed = people * hoursPerWeek * 4.33;
  const monthlyHoursRecovered = monthlyHoursReviewed * (recoverableShare / 100);
  const monthlyTimeValue = monthlyHoursRecovered * hourlyValue;
  const monthlyCost = 99;
  const setupCost = 2000;
  const firstYearCost = monthlyCost * 12 + setupCost;
  const firstYearValue = monthlyTimeValue * 12;
  const firstYearNet = firstYearValue - firstYearCost;
  const roiPercent = firstYearCost ? (firstYearNet / firstYearCost) * 100 : 0;
  const paybackMonths = setupCost && monthlyTimeValue > monthlyCost ? setupCost / (monthlyTimeValue - monthlyCost) : 0;
  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, value));
  const reset = () => { setPeople(4); setHoursPerWeek(2); setHourlyValue(45); setRecoverableShare(30); };

  return (
    <div id="roi-calculator" className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] shadow-[var(--b2w-shadow)]">
      <div className="grid lg:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)]">
        <div className="p-6 sm:p-9">
          <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--b2w-rust-dark)] text-white"><Calculator className="h-5 w-5" /></span><div><p className="text-sm font-semibold">Your operating inputs</p><p className="mt-1 text-xs text-[var(--b2w-ink-faint)]">Adjust assumptions to fit your team.</p></div></div><button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[var(--b2w-ink-muted)] transition hover:bg-white"><RotateCcw className="h-3.5 w-3.5" />Reset</button></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <RangeField label="People searching for context" value={people} min={1} max={20} suffix="" onChange={setPeople} />
            <RangeField label="Hours per person each week" value={hoursPerWeek} min={.5} max={10} step={.5} suffix=" hr" onChange={setHoursPerWeek} />
            <RangeField label="Loaded hourly value" value={hourlyValue} min={20} max={150} step={5} suffix="/hr" onChange={setHourlyValue} />
            <RangeField label="Potentially recoverable share" value={recoverableShare} min={10} max={60} step={5} suffix="%" onChange={setRecoverableShare} />
          </div>
          <div className="mt-4 border border-[var(--b2w-line)] bg-white/70 p-5"><p className="text-sm font-semibold">Launch pricing basis</p><div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs text-[var(--b2w-ink-muted)]"><span><strong className="text-[var(--b2w-ink)]">$99/month</strong> product access</span><span><strong className="text-[var(--b2w-ink)]">$2,000 once</strong> WhatsApp setup</span></div></div>
        </div>

        <div className="relative overflow-hidden bg-[var(--b2w-rust-dark)] p-6 text-white sm:p-9">
          <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--b2w-rust)]/45 blur-3xl" animate={{ scale: [1, 1.08, 1], opacity: [.65, 1, .65] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="relative z-10"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold)]">Illustrative first-year result</p><div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[{ label: 'Time reviewed monthly', value: `${monthlyHoursReviewed.toFixed(0)} hr`, Icon: Clock3 }, { label: 'Potential time recovered', value: `${monthlyHoursRecovered.toFixed(1)} hr/mo`, Icon: Users }, { label: 'Potential annual time value', value: money(firstYearValue), Icon: DollarSign }, { label: 'First-year JasonAI cost', value: money(firstYearCost), Icon: Calculator }].map((metric) => <div key={metric.label} className="rounded-[1.25rem] border border-white/10 bg-white/[.06] p-5"><metric.Icon className="h-4 w-4 text-[var(--b2w-gold)]" /><p className="mt-6 text-[9px] uppercase tracking-[0.14em] text-white/45">{metric.label}</p><AnimatePresence mode="wait"><motion.p key={metric.value} initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -4 }} className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{metric.value}</motion.p></AnimatePresence></div>)}
          </div>
          <div className="mt-4 rounded-[1.5rem] bg-white p-6 text-[var(--b2w-ink)]"><div className="flex items-start justify-between gap-5"><div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--b2w-rust)]">Potential first-year net value</p><AnimatePresence mode="wait"><motion.p key={Math.round(firstYearNet)} initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -5 }} className="mt-3 text-5xl font-medium tracking-[-0.055em]">{firstYearNet >= 0 ? money(firstYearNet) : `−${money(Math.abs(firstYearNet))}`}</motion.p></AnimatePresence></div><TrendingUp className={`h-6 w-6 ${firstYearNet >= 0 ? 'text-[var(--b2w-green)]' : 'rotate-180 text-[var(--b2w-rust)]'}`} /></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--b2w-line)] pt-4 text-xs text-[var(--b2w-ink-muted)]"><span>Illustrative ROI: <strong className="text-[var(--b2w-ink)]">{Math.round(roiPercent)}%</strong></span>{paybackMonths > 0 ? <span>Setup payback: <strong className="text-[var(--b2w-ink)]">{paybackMonths.toFixed(1)} months</strong></span> : <span>Setup payback is not reached under these assumptions</span>}</div></div>
          <p className="mt-5 text-[10px] leading-5 text-white/45">This estimate models only time potentially recovered from communication search and summary work. It is not a guarantee and excludes billing recovery, prevented errors, automation, action extraction, and other current or future capabilities.</p></div>
        </div>
      </div>
    </div>
  );
}

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="JasonAI Pricing and WhatsApp Setup" description="JasonAI is $99 per month, with a one-time $2,000 WhatsApp integration and founder-led setup fee. Model the current workflow with the ROI calculator." canonicalPath="/products/pricing" />
      <PageIntro eyebrow="JasonAI · Pricing" title="One monthly product. One hands-on setup." description="The $99 subscription covers JasonAI access. The one-time $2,000 setup covers the WhatsApp integration, approved-source mapping, onboarding, and validation required to make the first workflow useful." primary={{ label: 'Book a founder review', to: '/contact?type=jasonai', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="01 · Launch offer" title="Know what is recurring, what is implementation, and what is custom." description="The launch structure keeps the product, the WhatsApp setup, and founder-led contracting workflow work commercially distinct." tone="rust" />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-7 sm:p-9">
              <div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-ink-faint)]">JasonAI Assistant</p><StatusBadge stage="Available now" /></div>
              <div className="mt-10 flex items-end gap-3"><p className="text-6xl font-medium tracking-[-0.06em]">$99</p><p className="pb-2 text-sm text-[var(--b2w-ink-muted)]">per month</p></div>
              <p className="mt-3 text-base font-semibold">Recurring product access</p>
              <ul className="mt-8 space-y-4">
                {['JasonAI assistant access', 'Approved communication search', 'Job and thread summaries', 'WhatsApp interaction after setup', 'Current release updates within the agreed product boundary'].map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--b2w-green)]" />{item}</li>)}
              </ul>
              <ButtonLink to="/contact?type=jasonai" variant="secondary" className="mt-10" eventLabel="JasonAI pricing inquiry">Discuss JasonAI</ButtonLink>
            </article>
            <article className="flex flex-col rounded-[2rem] bg-[var(--b2w-rust-dark)] p-7 text-white sm:p-9">
              <div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8fc2d7]">WhatsApp integration</p><span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--b2w-rust-dark)]">Founder-led</span></div>
              <div className="mt-10 flex items-end gap-3"><p className="text-6xl font-medium tracking-[-0.06em]">$2,000</p><p className="pb-2 text-sm text-white/60">one time</p></div>
              <p className="mt-3 text-base font-semibold">Configuration and onboarding</p>
              <ul className="mt-8 space-y-4 text-white/75">
                {['Approved-source and access mapping', 'WhatsApp workflow configuration', 'Founder-led business and workflow review', 'Team onboarding and first-use support', 'Validation of the first useful search and summary flow'].map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8fc2d7]" />{item}</li>)}
              </ul>
              <Link to="/contact?type=jasonai" className="mt-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--b2w-rust-dark)]">Plan the integration<ArrowRight className="h-4 w-4" /></Link>
            </article>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <EvidenceBlock label="Included now">Search and summaries across the approved sources configured for the customer, within the agreed current workflow.</EvidenceBlock>
            <EvidenceBlock label="Founder consultation">General contracting workflows beyond the current assistant are diagnosed and scoped separately with B2W’s founders.</EvidenceBlock>
            <EvidenceBlock label="Not included yet">Action extraction, source-linked reporting, and governed automation are not part of the current release unless explicitly contracted after validation.</EvidenceBlock>
          </div>
        </div>
      </section>
      <section className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading index="02 · ROI calculator" title="Model the value of recovering context faster." description="Use your own time and labor assumptions. The calculator stays inside JasonAI’s current search-and-summary boundary and separates potential time value from price." tone="rust" />
        <ROICalculator />
      </section>
      <CTASection eyebrow="Commercial next step" title="Confirm the first useful workflow before setup." description="B2W will review the communication problem, approved sources, current product boundary, and WhatsApp integration requirements before asking for a commitment." action={{ label: 'Book a founder review', to: '/contact?type=jasonai', variant: 'product' }} secondary={{ label: 'Read common questions', to: '/jasonai/questions' }} tone="rust" />
    </div>
  );
}
