import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JasonAIVectorMark } from '../components/BrandVectorMarks';
import DescrambleText from '../components/DescrambleText';
import GurgeIcon from '../components/gurge/GurgeIcon';
import { HomeSiteFooter } from '../components/HomeSiteChrome';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import Seo from '../components/Seo';

type AgentId = 'jasonai' | 'clara' | 'gurge';
type IndustryId = 'general-contracting' | 'food-and-beverage' | 'real-estate-management';
type ProblemId = 'communication' | 'scope' | 'management';
type WorkStyleId = 'channels' | 'process' | 'portfolio';

const agents = [
  {
    id: 'jasonai' as const,
    name: 'JasonAI',
    status: 'Pre-launch',
    to: '/jasonai',
    color: 'text-[#f4b28c]',
    surface: 'border-[#f4b28c]/25 bg-[#b24a24]/10',
    bestFor: 'Finding decisions, requests, and updates in approved work messages.',
    input: 'WhatsApp, messages, email, call notes, and approved job communication.',
    output: 'Direct answers and short summaries.',
    change: 'Small. Teams continue working in familiar group chats.',
    control: 'The business chooses which messages JasonAI can search, and people check the answer.',
  },
  {
    id: 'clara' as const,
    name: 'Clara',
    status: 'Concept phase',
    to: '/clara',
    color: 'text-[#f5dce8]',
    surface: 'border-[#d9a9c2]/25 bg-[#d9a9c2]/10',
    bestFor: 'Turning spoken or written project notes into scopes and estimates.',
    input: 'Voice notes, site observations, requirements, quantities, and pricing rules.',
    output: 'Organized scopes, editable line items, estimates, and approval-ready drafts.',
    change: 'Medium. Teams review and edit the document before it is complete.',
    control: 'Every output can be edited and must be approved before it is shared.',
  },
  {
    id: 'gurge' as const,
    name: 'Gurge',
    status: 'Concept phase',
    to: '/gurge',
    color: 'text-[#9bc49f]',
    surface: 'border-[#9bc49f]/25 bg-[#9bc49f]/10',
    bestFor: 'Managing jobs, locations, responsibilities, problems, and reports.',
    input: 'Structured jobs, locations, owners, milestones, updates, and operating rules.',
    output: 'Dashboards, assigned responsibilities, problem lists, and detailed reports.',
    change: 'Larger. Managers use Gurge as the main place to review active work.',
    control: 'Access is based on each person’s role, and every update can be reviewed.',
  },
] as const;

const industryLabels: Record<IndustryId, string> = {
  'general-contracting': 'General Contracting',
  'food-and-beverage': 'Food & Beverage',
  'real-estate-management': 'Real Estate Management',
};

const problemOptions: Array<{ id: ProblemId; label: string; detail: string }> = [
  { id: 'communication', label: 'Information is buried', detail: 'People spend too much time finding the message, decision, request, or update.' },
  { id: 'scope', label: 'Inputs are hard to structure', detail: 'Site notes and requirements take too long to become a usable scope or estimate.' },
  { id: 'management', label: 'Management lacks one view', detail: 'Jobs, locations, owners, progress, and reports are difficult to read together.' },
];

const workStyleOptions: Array<{ id: WorkStyleId; label: string; detail: string }> = [
  { id: 'channels', label: 'We work mostly in messages', detail: 'The team should keep its current communication habits.' },
  { id: 'process', label: 'We have a repeatable process', detail: 'The work is understood, but capture and handoffs need structure.' },
  { id: 'portfolio', label: 'We manage many jobs or locations', detail: 'Leadership needs ownership, exceptions, and reporting above individual work.' },
];

const workflowByIndustry: Record<IndustryId, Record<AgentId, string[]>> = {
  'general-contracting': {
    jasonai: ['Approve field and office communication sources', 'Search a job question or summarize the active thread', 'Review the answer before customer or crew follow-up'],
    clara: ['Record the site walk or project brief', 'Transform notes into scope and editable line items', 'Review pricing, contingency, and the customer-ready output'],
    gurge: ['Connect jobs, owners, milestones, and updates', 'Flag projects that need management attention', 'Open a company report and drill down to job details'],
  },
  'food-and-beverage': {
    jasonai: ['Approve manager, vendor, and event communication', 'Find the decision or summarize the operating issue', 'Prepare a clean leadership or location handoff'],
    clara: ['Capture repair, improvement, or event requirements', 'Create an organized scope and editable estimate', 'Review quantities and approvals before work begins'],
    gurge: ['Connect locations, recurring work, and accountable owners', 'Review operating exceptions across the business', 'Produce a current multi-location management report'],
  },
  'real-estate-management': {
    jasonai: ['Approve property, tenant, vendor, and project channels', 'Find the decision or summarize property communication', 'Prepare the owner, tenant, or vendor response'],
    clara: ['Record an inspection or renovation walk-through', 'Generate a consistent property scope and estimate', 'Review work packages before approval or procurement'],
    gurge: ['Connect properties, projects, owners, and milestones', 'Surface exceptions and escalation across the portfolio', 'Move from portfolio reporting into source detail'],
  },
};

function AgentMark({ agent }: { agent: AgentId }) {
  if (agent === 'jasonai') return <JasonAIVectorMark title="" animated={false} className="h-7 w-7" />;
  if (agent === 'clara') return <img src="/brand/clara-logo-solid.png" alt="" className="h-7 w-7 object-contain" />;
  return <GurgeIcon name="brand" className="h-6 w-6" />;
}

const reveal = {
  initial: { opacity: 0, y: 28, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.66, ease: [0.22, 1, 0.36, 1] as const },
};

export default function AgentComparisonPage() {
  const [industry, setIndustry] = useState<IndustryId | null>(null);
  const [problem, setProblem] = useState<ProblemId | null>(null);
  const [workStyle, setWorkStyle] = useState<WorkStyleId | null>(null);

  const recommendedAgent = useMemo<AgentId | null>(() => {
    if (!problem || !workStyle) return null;
    if (problem === 'communication') return 'jasonai';
    if (problem === 'scope') return 'clara';
    if (problem === 'management') return 'gurge';
    if (workStyle === 'channels') return 'jasonai';
    if (workStyle === 'process') return 'clara';
    return 'gurge';
  }, [problem, workStyle]);

  const recommendation = recommendedAgent ? agents.find((agent) => agent.id === recommendedAgent) : null;
  const quizComplete = Boolean(industry && problem && workStyle && recommendation);
  const currentStep = industry ? problem ? workStyle ? 4 : 3 : 2 : 1;

  const resetQuiz = () => {
    setIndustry(null);
    setProblem(null);
    setWorkStyle(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1510] text-white">
      <Seo
        title="Compare B2W AI Agents"
        description="Compare JasonAI, Clara, and Gurge, then use the Create Your Solution quiz to identify a practical starting agent and workflow for your business."
        canonicalPath="/solutions/compare-agents"
      />
      <LiveSiteHeader followPageTheme />

      <main>
        <section data-header-theme="dark" className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44 lg:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-[34rem] w-[34rem] rounded-full bg-[#6b9b6e]/20 blur-[120px]" />
          <motion.div {...reveal} className="relative mx-auto max-w-7xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9bc49f]">Solutions / Compare agents</p>
            <h1 className="mt-8 max-w-6xl text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.88] tracking-[-0.07em]">
              <DescrambleText text="Choose the right starting agent." animateOnView delay={120} />
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/62 sm:text-xl sm:leading-9">
              JasonAI finds information in work messages. Clara turns notes into scopes and estimates. Gurge helps managers track jobs and locations. Compare them, then choose the product that solves your most urgent problem.
            </p>
            <a href="#create-your-solution" className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-[#172019] transition hover:bg-[#cce2ce]">
              Create your solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </section>

        <section data-header-theme="dark" className="border-y border-white/10 bg-[#101a13] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <motion.div {...reveal} className="max-w-4xl">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9bc49f]">Agent comparison</p>
              <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">Three products for three kinds of work.</h2>
            </motion.div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {agents.map((agent, index) => (
                <motion.article key={agent.id} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className={`flex flex-col rounded-[1.75rem] border p-6 sm:p-7 ${agent.surface}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-black/18 ${agent.color}`}><AgentMark agent={agent.id} /></span>
                    <span className="rounded-full bg-white/8 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60">{agent.status}</span>
                  </div>
                  <h3 className={`mt-8 text-3xl font-semibold ${agent.color}`}>{agent.name}</h3>
                  <p className="mt-3 min-h-20 text-base font-semibold leading-7">{agent.bestFor}</p>
                  {[
                    ['Inputs', agent.input],
                    ['Outputs', agent.output],
                    ['Team change', agent.change],
                    ['Control', agent.control],
                  ].map(([label, value]) => (
                    <div key={label} className="border-t border-white/12 py-4 first:mt-5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/38">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-white/65">{value}</p>
                    </div>
                  ))}
                  <Link to={agent.to} className="group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
                    Explore {agent.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="create-your-solution" data-header-theme="light" className="scroll-mt-24 bg-[#f3efe6] px-5 py-20 text-[#172019] sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4f7f52]">Create your solution</p>
                <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">Start with the operating problem.</h2>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Step {Math.min(currentStep, 3)} of 3</span>
                  <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 text-[#4f7f52] hover:text-[#172019]"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
                </div>
                <div className="mt-3 h-1.5 bg-[#172019]/10"><motion.div className="h-full bg-[#4f7f52]" animate={{ width: `${quizComplete ? 100 : (currentStep - 1) * 33.333}%` }} /></div>
              </div>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <div className="space-y-5">
                <fieldset className="rounded-[1.5rem] border border-[#172019]/15 bg-white p-5 sm:p-6">
                  <legend className="px-2 text-sm font-semibold">1. Which industry are you operating in?</legend>
                  <div className="mt-3 grid gap-2">
                    {(Object.entries(industryLabels) as Array<[IndustryId, string]>).map(([id, label]) => (
                      <button key={id} type="button" onClick={() => setIndustry(id)} className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-semibold transition ${industry === id ? 'border-[#172019] bg-[#172019] text-white' : 'border-[#172019]/15 hover:border-[#4f7f52]'}`}>
                        {label}{industry === id ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 opacity-35" />}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset disabled={!industry} className="rounded-[1.5rem] border border-[#172019]/15 bg-white p-5 disabled:opacity-45 sm:p-6">
                  <legend className="px-2 text-sm font-semibold">2. What creates the most friction?</legend>
                  <div className="mt-3 grid gap-2">
                    {problemOptions.map((option) => (
                      <button key={option.id} type="button" onClick={() => setProblem(option.id)} className={`rounded-xl border px-4 py-3 text-left transition ${problem === option.id ? 'border-[#172019] bg-[#172019] text-white' : 'border-[#172019]/15 hover:border-[#4f7f52]'}`}>
                        <span className="block text-sm font-semibold">{option.label}</span><span className={`mt-1 block text-xs leading-5 ${problem === option.id ? 'text-white/60' : 'text-[#172019]/55'}`}>{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset disabled={!problem} className="rounded-[1.5rem] border border-[#172019]/15 bg-white p-5 disabled:opacity-45 sm:p-6">
                  <legend className="px-2 text-sm font-semibold">3. How does the work operate today?</legend>
                  <div className="mt-3 grid gap-2">
                    {workStyleOptions.map((option) => (
                      <button key={option.id} type="button" onClick={() => setWorkStyle(option.id)} className={`rounded-xl border px-4 py-3 text-left transition ${workStyle === option.id ? 'border-[#172019] bg-[#172019] text-white' : 'border-[#172019]/15 hover:border-[#4f7f52]'}`}>
                        <span className="block text-sm font-semibold">{option.label}</span><span className={`mt-1 block text-xs leading-5 ${workStyle === option.id ? 'text-white/60' : 'text-[#172019]/55'}`}>{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <motion.aside layout className="min-h-[34rem] rounded-[2rem] border border-[#172019] bg-[#172019] p-6 text-white shadow-[0_28px_80px_rgba(23,32,25,.16)] sm:p-8 lg:sticky lg:top-28 lg:self-start">
                {!quizComplete || !industry || !recommendation ? (
                  <div className="flex min-h-[30rem] flex-col justify-between">
                    <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9bc49f]">Your recommendation</p><h3 className="mt-5 text-4xl font-medium leading-tight">Complete the three questions to build a starting solution.</h3></div>
                    <p className="text-sm leading-7 text-white/50">The result recommends a starting point, not automatic deployment. B2W validates sources, controls, ownership, and measurable value before expansion.</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}>
                    <div className="flex items-center justify-between gap-4"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9bc49f]">Recommended starting agent</p><span className="rounded-full bg-white/8 px-3 py-1 font-mono text-[9px] uppercase text-white/55">{recommendation.status}</span></div>
                    <div className={`mt-8 flex items-center gap-4 ${recommendation.color}`}><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/8"><AgentMark agent={recommendation.id} /></span><h3 className="text-4xl font-semibold">{recommendation.name}</h3></div>
                    <p className="mt-6 text-lg font-semibold leading-8">{recommendation.bestFor}</p>
                    <p className="mt-3 text-sm leading-7 text-white/55">Recommended for {industryLabels[industry]} based on your selected operating problem and current work style.</p>
                    <div className="mt-9 border-t border-white/15 pt-7"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Possible first workflow</p><ol className="mt-5 space-y-4">{workflowByIndustry[industry][recommendation.id].map((step, index) => <li key={step} className="flex gap-4 text-sm leading-6 text-white/72"><span className={`font-mono text-xs ${recommendation.color}`}>0{index + 1}</span><span>{step}</span></li>)}</ol></div>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to={recommendation.to} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#172019] hover:bg-[#cce2ce]">Explore {recommendation.name}<ArrowRight className="h-4 w-4" /></Link><a href={`mailto:info@b2w-ai.com?subject=${encodeURIComponent(`${industryLabels[industry]} solution review`)}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-semibold hover:bg-white/8">Review this solution</a></div>
                  </motion.div>
                )}
              </motion.aside>
            </div>
          </div>
        </section>

        <section data-header-theme="dark" className="bg-[#172019] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
          <motion.div {...reveal} className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9bc49f]">Build with control</p><h2 className="mt-6 max-w-5xl text-4xl font-medium leading-[1] tracking-[-0.05em] sm:text-7xl">Choose the first workflow before choosing the whole system.</h2></div>
            <a href="mailto:info@b2w-ai.com?subject=B2W%20agent%20comparison" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-[#172019] hover:bg-[#cce2ce]">Talk through the fit<ArrowRight className="h-4 w-4" /></a>
          </motion.div>
        </section>
      </main>

      <div data-header-theme="dark" className="bg-[#172019]"><HomeSiteFooter className="text-white/55" /></div>
    </div>
  );
}
