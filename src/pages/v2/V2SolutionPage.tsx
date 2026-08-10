import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, FileStack, HardHat, Ruler, Workflow } from 'lucide-react';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
import { V2SiteFooter, V2SiteHeader } from '../../components/V2SiteChrome';

type SolutionId = 'general-contractors' | 'engineering-firms';

const solutions = {
  'general-contractors': {
    name: 'General Contractors',
    title: 'Keep field context attached to the job.',
    description: 'Connect communication, scopes, estimates, decisions, and follow-up without forcing field and office teams into another daily system.',
    icon: HardHat,
    signals: ['Job communication', 'Scope changes', 'Owner requests', 'Crew follow-up'],
    workflows: [
      ['Find the decision', 'JasonAI searches approved messages and call notes for the request, date, or commitment behind the work.'],
      ['Build the scope', 'Clara turns a field note into an organized scope and editable estimate for review.'],
      ['Advance the work', 'Premium agents will route approved follow-up through business-specific operating workflows.'],
    ],
  },
  'engineering-firms': {
    name: 'Engineering Firms',
    title: 'Make technical context easier to retrieve, review, and act on.',
    description: 'Connect project correspondence, field observations, design decisions, deliverables, and client follow-up around the work that technical teams already perform.',
    icon: Ruler,
    signals: ['Project correspondence', 'Field observations', 'Design decisions', 'Review comments'],
    workflows: [
      ['Retrieve project context', 'JasonAI finds the approved correspondence, decision, or client request behind a project question.'],
      ['Structure field input', 'Clara organizes spoken observations into reviewable scopes, assumptions, and project documents.'],
      ['Govern the next step', 'Premium agents will prepare and route actions through firm-specific review and approval workflows.'],
    ],
  },
} as const;

export default function V2SolutionPage({ solution }: { solution: SolutionId }) {
  const config = solutions[solution];
  const Icon = config.icon;
  return (
    <div className="min-h-screen bg-[#111714] text-white selection:bg-white selection:text-black">
      <Seo title={`${config.name} AI Solutions — B2W V2`} description={config.description} canonicalPath={`/v2/solutions/${solution}`} robots="noindex, nofollow" />
      <V2SiteHeader theme="dark" />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-24 pt-40 sm:px-8 md:pb-32 md:pt-48"><div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:72px_72px]" /><div className="relative mx-auto max-w-7xl"><div className="flex items-center gap-3 text-[#9fd4ae]"><Icon className="h-7 w-7" /><span className="font-mono text-[10px] font-semibold uppercase tracking-[.2em]">Solution · {config.name}</span></div><h1 className="mt-9 max-w-[11ch] text-[clamp(4rem,9vw,8rem)] font-medium leading-[.88] tracking-[-.07em]"><DescrambleText text={config.title} animateOnMount delay={120} /></h1><p className="mt-8 max-w-3xl text-lg leading-8 text-white/62 md:text-xl">{config.description}</p></div></section>

        <section className="bg-[#f6f3eb] px-5 py-20 text-[#141714] sm:px-8 md:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">Signals already in the business</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{config.signals.map((signal, index) => <div key={signal} className="rounded-[1.25rem] border border-black/10 bg-white p-6"><span className="font-mono text-[10px] text-[#7c847c]">0{index + 1}</span><p className="mt-8 text-xl font-semibold">{signal}</p></div>)}</div></div></section>

        <section className="px-5 py-20 sm:px-8 md:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.55fr_1fr]"><div><Workflow className="h-8 w-8 text-[#9fd4ae]" /><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] md:text-6xl">A possible agent workflow.</h2><p className="mt-6 leading-7 text-white/60">Core agents help retrieve and structure. Premium agents will add controlled action once the workflow is ready.</p></div><div className="space-y-3">{config.workflows.map(([title, body], index) => <article key={title} className="grid gap-5 rounded-[1.5rem] border border-white/12 bg-white/[.04] p-6 sm:grid-cols-[3rem_1fr]"><span className="font-mono text-xs text-[#9fd4ae]">0{index + 1}</span><div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-white/62">{body}</p></div></article>)}</div></div></section>

        <section className="bg-[#dfe9d8] px-5 py-20 text-[#141714] sm:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">Available agents</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Start with the core job.</h2></div><Link to="/v2/pricing" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#141714] px-6 text-sm font-semibold text-white">Compare tiers <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-10 grid gap-4 lg:grid-cols-2"><Link to="/v2/products/jasonai" className="rounded-[1.5rem] border border-black/10 bg-white/70 p-7"><Bot className="h-7 w-7 text-[#426149]" /><div className="mt-10 flex items-center justify-between"><h3 className="text-3xl font-semibold">JasonAI</h3><span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase text-emerald-800">Core available</span></div><p className="mt-4 leading-7 text-[#596159]">Approved communication search and project summaries.</p></Link><Link to="/v2/products/clara" className="rounded-[1.5rem] border border-black/10 bg-[#fff8fb] p-7"><FileStack className="h-7 w-7 text-[#a76186]" /><div className="mt-10 flex items-center justify-between"><h3 className="text-3xl font-semibold">Clara</h3><span className="rounded-full bg-fuchsia-100 px-3 py-1 text-[10px] font-semibold uppercase text-fuchsia-800">Concept phase</span></div><p className="mt-4 leading-7 text-[#725568]">Voice-to-scope, estimates, and structured project documents.</p></Link></div></div></section>
      </main>
      <V2SiteFooter />
    </div>
  );
}
