import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CircleDot,
  ChevronDown,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { HomeSiteFooter } from '../components/HomeSiteChrome';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import { JasonAIVectorMark } from '../components/BrandVectorMarks';
import DescrambleText from '../components/DescrambleText';
import GurgeIcon from '../components/gurge/GurgeIcon';
import Seo from '../components/Seo';
import { jasonAIFaqs, jasonAIObjections } from '../content/jasonAIQuestions';
import JasonAIPricingCalculator from './JasonAIPricingCalculator';

export type MarketPageId =
  | 'food-and-beverage'
  | 'general-contracting'
  | 'real-estate-management'
  | 'ai-roi'
  | 'agentic-workflows';

type MarketPageConfig = {
  type: 'Industry' | 'Solution';
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  briefTitle: string;
  signals: Array<{ label: string; value: string }>;
  capabilities: Array<{ title: string; body: string }>;
  workflow: Array<{ title: string; body: string }>;
  outcomes: string[];
  closeTitle: string;
  closeBody: string;
  audiences?: string[];
  agents?: Array<{
    product: 'JasonAI' | 'Clara' | 'Gurge';
    status: 'Available now' | 'Concept phase';
    title: string;
    body: string;
    workflows: string[];
    to: string;
  }>;
};

const pageConfigs: Record<MarketPageId, MarketPageConfig> = {
  'food-and-beverage': {
    type: 'Industry',
    eyebrow: 'Food & Beverage',
    title: 'Run every location with fewer missed tasks and handoffs.',
    description: 'Keep daily issues, maintenance, catering work, location standards, and manager updates organized across restaurants, cafes, franchises, and supermarkets.',
    path: '/industries/food-and-beverage',
    seoTitle: 'AI Systems for Food & Beverage',
    seoDescription: 'B2W helps restaurants, cafes, franchises, and supermarkets connect daily operations, location standards, projects, and management reporting.',
    audiences: ['Restaurants', 'Cafes', 'Franchises', 'Supermarkets'],
    briefTitle: 'See what needs attention today',
    signals: [
      { label: 'Locations', value: 'Easy to compare' },
      { label: 'Tasks', value: 'Clearly assigned' },
      { label: 'Reports', value: 'Up to date' },
    ],
    capabilities: [
      { title: 'Assign daily follow-up', body: 'Turn recurring issues and handoffs into clear tasks with an owner and due date.' },
      { title: 'Compare locations', body: 'See which locations are on track, where problems repeat, and what each team needs.' },
      { title: 'Manage catering and projects', body: 'Keep inquiries, approvals, preparation, delivery, and event notes together from start to finish.' },
    ],
    workflow: [
      { title: 'Collect the update', body: 'Bring a request, issue, or manager update into one place.' },
      { title: 'Match it to the work', body: 'Connect it to the right location, event, person, and standard.' },
      { title: 'Assign the next step', body: 'Give someone clear responsibility while managers keep final control.' },
      { title: 'Review every location', body: 'Turn daily activity into a simple report that shows where help is needed.' },
    ],
    outcomes: ['Fewer missed follow-ups', 'Clear responsibility at each location', 'Faster and more accurate manager reports'],
    agents: [
      {
        product: 'JasonAI',
        status: 'Available now',
        title: 'Find answers in your work group chats.',
        body: 'Ask JasonAI about approved manager, vendor, catering, and location messages in WhatsApp instead of searching through long conversations.',
        workflows: ['Summarize a location issue before the leadership meeting', 'Find the vendor decision behind a delayed repair', 'Turn an event thread into a clean handoff'],
        to: '/jasonai',
      },
      {
        product: 'Clara',
        status: 'Concept phase',
        title: 'Turn spoken notes into scopes and estimates.',
        body: 'Use Clara to organize notes from a walk-through or event brief into editable work items, quantities, and pricing.',
        workflows: ['Record a walk-through and draft the repair scope', 'Build an event estimate from a voice brief', 'Structure materials, quantities, and contingency'],
        to: '/clara',
      },
      {
        product: 'Gurge',
        status: 'Concept phase',
        title: 'Manage locations and open work in one place.',
        body: 'Use Gurge to track locations, jobs, owners, overdue items, and management reports without combining separate spreadsheets.',
        workflows: ['Compare open issues across every location', 'Assign and review recurring operating work', 'Produce a portfolio-level management report'],
        to: '/gurge',
      },
    ],
    closeTitle: 'Start with the work your team loses track of most often.',
    closeBody: 'Choose one recurring task, handoff, or report. We will map a simpler way to manage it.',
  },
  'general-contracting': {
    type: 'Industry',
    eyebrow: 'General Contracting',
    title: 'Find job information faster and keep field work moving.',
    description: 'Help field and office teams find decisions, changes, requests, and updates in approved work messages. Start with search and summaries, then add more workflows when the team is ready.',
    path: '/industries/general-contracting',
    seoTitle: 'AI Systems for General Contractors',
    seoDescription: 'B2W helps trade businesses, contracting firms, and AEC companies connect field communication, job context, scopes, follow-up, and management reporting with practical AI workflows.',
    audiences: ['Trade businesses', 'Contracting firms', 'AEC companies'],
    briefTitle: 'Answers without searching every message',
    signals: [
      { label: 'Messages', value: 'Approved only' },
      { label: 'Answers', value: 'Easy to check' },
      { label: 'Workflows', value: 'Added as needed' },
    ],
    capabilities: [
      { title: 'Search job messages', body: 'Ask a job question and find the relevant detail across approved field and office conversations.' },
      { title: 'Summarize what changed', body: 'Turn scattered updates into a short summary the project manager can check before following up.' },
      { title: 'Add repeatable workflows', body: 'Add intake, handoff, and reporting steps after the team is comfortable with the answers.' },
    ],
    workflow: [
      { title: 'Ask a question', body: 'Use WhatsApp to ask about a job, customer request, change, or follow-up.' },
      { title: 'Search approved messages', body: 'JasonAI checks only the conversations the business has allowed it to use.' },
      { title: 'Get a short answer', body: 'Receive the relevant details in a summary that is quick to review.' },
      { title: 'Follow up', body: 'Use the answer to make the next decision, contact the customer, or hand work to the right person.' },
    ],
    outcomes: ['Faster answers about active jobs', 'Less time searching messages', 'Cleaner handoffs between field and office'],
    agents: [
      {
        product: 'JasonAI',
        status: 'Available now',
        title: 'Find the job detail buried in the conversation.',
        body: 'Search approved field and office communication, then turn long project threads into concise answers and reviewable job summaries.',
        workflows: ['Find where a customer change was approved', 'Summarize this week’s project communication', 'Prepare the PM before a customer follow-up'],
        to: '/jasonai',
      },
      {
        product: 'Clara',
        status: 'Concept phase',
        title: 'Turn field notes into a usable scope and estimate.',
        body: 'Capture a spoken project brief, organize the work, and produce editable line items with quantities, pricing, and contingency.',
        workflows: ['Record a site walk and generate the first scope', 'Convert scope items into an editable estimate', 'Prepare a customer-ready project breakdown'],
        to: '/clara',
      },
      {
        product: 'Gurge',
        status: 'Concept phase',
        title: 'Manage every job from one dashboard.',
        body: 'Use Gurge to track jobs, locations, owners, progress, problems, and reports from a single management dashboard.',
        workflows: ['Review every active job by owner and status', 'Flag jobs that need management attention', 'Open a company report and drill down to task details'],
        to: '/gurge',
      },
    ],
    closeTitle: 'Start with one job question your team answers every week.',
    closeBody: 'JasonAI searches approved work messages and returns short job summaries through WhatsApp.',
  },
  'real-estate-management': {
    type: 'Industry',
    eyebrow: 'Real Estate Management',
    audiences: ['Airbnb & short-term rentals', 'Commercial properties', 'Residential properties', 'Mixed-use developers'],
    title: 'Keep every property, project, and update in one place.',
    description: 'Help owners and property teams track renovations, maintenance, responsibilities, deadlines, and portfolio reports without rebuilding updates from messages and spreadsheets.',
    path: '/industries/real-estate-management',
    seoTitle: 'AI Systems for Real Estate Management',
    seoDescription: 'B2W helps owners and property teams track properties, renovations, maintenance, responsibilities, and portfolio reports in one place.',
    briefTitle: 'See what is happening across the portfolio',
    signals: [
      { label: 'Properties', value: 'In one place' },
      { label: 'Decisions', value: 'Easy to find' },
      { label: 'Updates', value: 'Ready to report' },
    ],
    capabilities: [
      { title: 'Track work across properties', body: 'See open work, owners, risks, and progress across the portfolio, then open any property for details.' },
      { title: 'Manage renovations', body: 'Keep scopes, approvals, milestones, decisions, and changes together for each project.' },
      { title: 'Report maintenance clearly', body: 'Turn recurring property updates into reports that show what is complete, delayed, and waiting for approval.' },
    ],
    workflow: [
      { title: 'Collect the update', body: 'Bring approved property, vendor, and project information into one place.' },
      { title: 'File it correctly', body: 'Match each update to the right property, project, owner, decision, and due date.' },
      { title: 'Flag what needs attention', body: 'Show managers the delays, open questions, and approvals that require a decision.' },
      { title: 'Create the report', body: 'Summarize portfolio activity while keeping the source details available for review.' },
    ],
    outcomes: ['A clear view of every property', 'Faster follow-up on delays and approvals', 'Reports that take less time to prepare'],
    agents: [
      {
        product: 'JasonAI',
        status: 'Available now',
        title: 'Search the communication surrounding every property.',
        body: 'Ask JasonAI to find details in approved owner, tenant, vendor, and project messages so the team can answer questions faster.',
        workflows: ['Find the decision behind a renovation change', 'Summarize vendor communication for one property', 'Prepare context before an owner or tenant update'],
        to: '/jasonai',
      },
      {
        product: 'Clara',
        status: 'Concept phase',
        title: 'Build scopes and estimates from property walk-throughs.',
        body: 'Turn voice notes from inspections and renovation walks into structured scopes, editable quantities, and project estimates.',
        workflows: ['Record a unit walk and draft the make-ready scope', 'Estimate a renovation from inspection notes', 'Create consistent scopes across properties'],
        to: '/clara',
      },
      {
        product: 'Gurge',
        status: 'Concept phase',
        title: 'Manage properties, projects, and reporting together.',
        body: 'Use Gurge to see portfolio progress and open the property, owner, milestone, or problem behind each result.',
        workflows: ['Review renovations across the portfolio', 'Track property-level ownership and escalation', 'Generate management reporting with source context'],
        to: '/gurge',
      },
    ],
    closeTitle: 'Spend less time rebuilding property updates.',
    closeBody: 'Start with the maintenance, renovation, or reporting task that takes the most manual coordination today.',
  },
  'ai-roi': {
    type: 'Solution',
    eyebrow: 'AI (ROI)',
    title: 'See what AI could save—and what it will cost.',
    description: 'Use your current team size, workload, time, and labor cost to estimate the value of faster work. Compare that value with setup and subscription pricing before you decide to move forward.',
    path: '/solutions/ai-roi',
    seoTitle: 'AI ROI Planning for Operating Teams',
    seoDescription: 'Build a practical AI business case around time recovered and measurable outcomes, then review current JasonAI pricing and available communication workflows.',
    briefTitle: 'Check the numbers before you invest',
    signals: [
      { label: 'Current work', value: 'Measured' },
      { label: 'Potential savings', value: 'Estimated' },
      { label: 'Results', value: 'Compared' },
    ],
    capabilities: [
      { title: 'Measure the work today', body: 'Enter the time, volume, handoffs, delays, and review effort in the current process.' },
      { title: 'Estimate recoverable time', body: 'Calculate the value of time the team may save without counting benefits that cannot be measured yet.' },
      { title: 'Include the full price', body: 'Compare potential savings with setup, subscription, training, review, and ongoing management costs.' },
    ],
    workflow: [
      { title: 'Measure today', body: 'Record how long the current task takes and how often the team completes it.' },
      { title: 'Estimate the return', body: 'Use clear assumptions to calculate a possible range, not a guaranteed result.' },
      { title: 'Run a small test', body: 'Try one useful workflow with clear limits and a person checking the output.' },
      { title: 'Compare the result', body: 'Measure the test against the old process and decide whether to expand it.' },
    ],
    outcomes: ['A clear cost and savings estimate', 'A specific target for the test', 'A better decision about whether to proceed'],
    closeTitle: 'Know the target before the test begins.',
    closeBody: 'Bring one recurring task. We will measure the current cost, estimate possible savings, and define the result required to continue.',
  },
  'agentic-workflows': {
    type: 'Solution',
    eyebrow: 'Agentic Workflows',
    title: 'Use AI to handle repeat work—with people in control.',
    description: 'Set clear rules for what information AI may use, what it may prepare, which actions need approval, and how every result is recorded for review.',
    path: '/solutions/agentic-workflows',
    seoTitle: 'Agentic Workflows for Business Operations',
    seoDescription: 'Use AI for repeatable business tasks with approved information, clear rules, human review, recorded actions, and measurable results.',
    briefTitle: 'Automation your team can check and control',
    signals: [
      { label: 'Information', value: 'Approved' },
      { label: 'Decisions', value: 'Checked by people' },
      { label: 'Actions', value: 'Recorded' },
    ],
    capabilities: [
      { title: 'Choose what starts the workflow', body: 'Define which messages, forms, events, or business conditions may trigger the process.' },
      { title: 'Prepare the next step', body: 'Collect the allowed information and draft a recommendation, document, or action within set rules.' },
      { title: 'Require approval where needed', body: 'Send sensitive decisions to a person and keep a record of every approved action.' },
    ],
    workflow: [
      { title: 'Notice', body: 'Identify an approved event that should start the workflow.' },
      { title: 'Collect', body: 'Gather the allowed information, rules, and history needed to respond.' },
      { title: 'Prepare', body: 'Draft the recommendation, document, message, or next action for review.' },
      { title: 'Approve and record', body: 'Let the right person approve sensitive work, complete the allowed action, and save the result.' },
    ],
    outcomes: ['Fewer missed handoffs', 'Clear approval rules', 'A repeatable process with a full activity record'],
    closeTitle: 'Define the rules before AI takes action.',
    closeBody: 'Start with one repeatable task, the information it may use, and the person responsible for final approval.',
  },
};

const reveal = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const capabilityIcons = [Layers3, Gauge, ShieldCheck] as const;

export default function MarketDetailPage({ page }: { page: MarketPageId }) {
  const config = pageConfigs[page];
  const isIndustryPage = config.type === 'Industry';
  const subject = encodeURIComponent(`${config.eyebrow} — B2W introduction`);

  return (
    <div className={`min-h-screen selection:bg-[#111315] selection:text-white ${isIndustryPage ? 'bg-[#0d1510] text-white' : 'bg-[#f3efe6] text-[#172019]'}`}>
      <Seo title={config.seoTitle} description={config.seoDescription} canonicalPath={config.path} />
      <LiveSiteHeader followPageTheme />

      <section data-header-theme="dark" className="relative overflow-hidden bg-[#101a13] px-5 pb-20 pt-36 text-white sm:px-8 sm:pb-28 sm:pt-44 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[32rem] w-[32rem] rounded-full bg-[#6b9b6e]/20 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)] lg:items-end">
          <motion.div {...reveal}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9bc49f]">B2W / {config.type} / {config.eyebrow}</p>
            <h1 className="mt-8 max-w-5xl text-[clamp(3.4rem,8vw,7.5rem)] font-medium leading-[0.89] tracking-[-0.07em]">
              <DescrambleText text={config.title} animateOnView delay={120} />
            </h1>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.14 }} className="border-l border-white/15 pl-6 sm:pl-8">
            <p className="text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{config.description}</p>
            {config.audiences ? (
              <div className="mt-6">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/38">Built for</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {config.audiences.map((audience) => (
                    <span key={audience} className="rounded-full border border-white/15 bg-white/[.055] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/72">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <a href={`mailto:info@b2w-ai.com?subject=${subject}`} className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-[#172019] transition hover:bg-[#cce2ce]">
              <DescrambleText text="Talk about your workflow" />
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {page === 'ai-roi' ? (
        <>
          <div data-header-theme="light" id="roi-calculator" className="scroll-mt-28">
            <JasonAIPricingCalculator
              variant="embedded"
              context="cross-industry"
              onBookReview={() => {
                window.location.href = 'mailto:info@b2w-ai.com?subject=AI%20ROI%20review';
              }}
            />
          </div>

          <section data-header-theme="dark" className="border-b border-[#50352a] bg-[#14110f] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <div className="flex items-center gap-3 text-[#f4b28c]">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b24a24]/18"><JasonAIVectorMark title="" animated={false} className="h-6 w-6" /></span>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">JasonAI · Available now</p>
                  </div>
                  <h2 className="mt-7 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">What you get with JasonAI today.</h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                  The calculator estimates the value of searching work messages and creating summaries. It does not count future automation, mistakes that might be prevented, or billing that might be recovered.
                </p>
              </motion.div>

              <div className="mt-14 grid gap-5 lg:grid-cols-[.72fr_.72fr_1.56fr]">
                <motion.article {...reveal} className="flex min-h-72 flex-col rounded-[1.75rem] border border-white/15 bg-white/[.045] p-6">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/42">Standard pricing</p>
                  <p className="mt-7 text-5xl font-semibold tracking-[-0.05em]">$99</p>
                  <p className="mt-1 text-sm text-white/55">per month</p>
                  <div className="mt-auto border-t border-white/12 pt-5">
                    <p className="text-sm font-semibold">$2,000 one-time implementation</p>
                    <p className="mt-2 text-xs leading-5 text-white/45">We connect approved message sources, set up WhatsApp, train the team, and test the first use case.</p>
                  </div>
                </motion.article>

                <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="flex min-h-72 flex-col rounded-[1.75rem] border border-[#f4b28c]/35 bg-[#b24a24]/14 p-6">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f4b28c]">Founding offer</p>
                  <p className="mt-7 text-5xl font-semibold tracking-[-0.05em]">$25</p>
                  <p className="mt-1 text-sm text-white/55">per month for year one</p>
                  <div className="mt-auto border-t border-[#f4b28c]/20 pt-5">
                    <p className="text-sm font-semibold">$0 setup with the founding offer</p>
                    <p className="mt-2 text-xs leading-5 text-white/45">Founders help a small group of early customers set up and test JasonAI.</p>
                  </div>
                </motion.article>

                <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.16 }} className="rounded-[1.75rem] border border-white/15 bg-white p-6 text-[#14110f] sm:p-7">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b24a24]">Included right now</p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">JasonAI is an AI WhatsApp assistant in your work group chats.</h3>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {[
                      'JasonAI access through WhatsApp',
                      'Search across approved business communication',
                      'Concise job or time-period summaries',
                      'Guided source mapping and workflow setup',
                    ].map((feature) => (
                      <div key={feature} className="flex gap-3 border-t border-[#14110f]/12 pt-4 text-sm font-semibold leading-6">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#b24a24]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-7 border-l-2 border-[#1f5f7a] pl-4 text-xs leading-6 text-[#4f463c]">
                    Automatic action lists, status reports, and answers with source links are still being built. JasonAI does not automate financial or contract decisions.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/jasonai" className="inline-flex min-h-11 items-center gap-2 bg-[#14110f] px-4 text-sm font-semibold text-white hover:bg-[#b24a24]">See JasonAI <ArrowRight className="h-4 w-4" /></Link>
                    <Link to="/jasonai/pricing" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#14110f] px-4 text-sm font-semibold hover:bg-[#fffaf0]">See all pricing</Link>
                  </div>
                </motion.article>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <section data-header-theme={isIndustryPage ? 'dark' : 'light'} className={`px-5 py-20 sm:px-8 sm:py-28 lg:px-10 ${isIndustryPage ? 'bg-[#0d1510]' : ''}`}>
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className={`grid gap-10 border-b pb-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end ${isIndustryPage ? 'border-white/15' : 'border-[#172019]/15'}`}>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4f7f52]">What improves</p>
              <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">{config.briefTitle}</h2>
            </div>
            <div className={`grid overflow-hidden rounded-[1.75rem] border sm:grid-cols-3 ${isIndustryPage ? 'border-white/15 bg-white/[.045]' : 'border-[#172019]/15 bg-white'}`}>
              {config.signals.map((signal, index) => (
                <div key={signal.label} className={`p-6 sm:p-7 ${index ? isIndustryPage ? 'border-t border-white/15 sm:border-l sm:border-t-0' : 'border-t border-[#172019]/15 sm:border-l sm:border-t-0' : ''}`}>
                  <p className={`font-mono text-[9px] uppercase tracking-[0.18em] ${isIndustryPage ? 'text-white/45' : 'text-[#172019]/45'}`}>{signal.label}</p>
                  <p className="mt-4 text-xl font-semibold tracking-tight">{signal.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-5 pt-16 md:grid-cols-3">
            {config.capabilities.map((capability, index) => {
              const CapabilityIcon = capabilityIcons[index];
              return (
                <motion.article key={capability.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className={`group min-h-72 rounded-[1.75rem] border p-7 transition hover:-translate-y-1 hover:border-[#7cad82]/70 ${isIndustryPage ? 'border-white/15 bg-white/[.045] hover:bg-white/[.07] hover:shadow-[0_22px_60px_rgba(0,0,0,.24)]' : 'border-[#172019]/15 bg-white hover:shadow-[0_22px_60px_rgba(23,32,25,.10)]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] ${isIndustryPage ? 'text-white/40' : 'text-[#172019]/40'}`}>0{index + 1}</span>
                    <CapabilityIcon className={`h-5 w-5 ${isIndustryPage ? 'text-[#9bc49f]' : 'text-[#4f7f52]'}`} />
                  </div>
                  <h3 className="mt-20 text-2xl font-semibold tracking-[-0.03em]">{capability.title}</h3>
                  <p className={`mt-4 text-sm leading-6 ${isIndustryPage ? 'text-white/55' : 'text-[#172019]/60'}`}>{capability.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {config.agents ? (
        <section data-header-theme="dark" className="border-y border-white/10 bg-[#101a13] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9bc49f]">Products for this industry</p>
                <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">Choose the product that matches the work.</h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                Start with the problem costing the most time today. Add other products when the team needs help with messages, scopes, or management reporting.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {config.agents.map((agent, index) => {
                const isJasonAI = agent.product === 'JasonAI';
                const isClara = agent.product === 'Clara';

                return (
                  <motion.article
                    key={agent.product}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: index * 0.08 }}
                    className="group flex min-h-[36rem] flex-col rounded-[2rem] border border-white/15 bg-white/[.045] p-6 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[.065] sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${
                        isJasonAI ? 'bg-[#b24a24]/20 text-[#f4b28c]' : isClara ? 'bg-[#d9a9c2]/15 text-[#f5dce8]' : 'bg-[#9bc49f]/15 text-[#9bc49f]'
                      }`}>
                        {isJasonAI ? <JasonAIVectorMark title="" animated={false} className="h-7 w-7" /> : null}
                        {isClara ? <img src="/brand/clara-logo-solid.png" alt="" className="h-7 w-7 object-contain" /> : null}
                        {agent.product === 'Gurge' ? <GurgeIcon name="brand" className="h-6 w-6" /> : null}
                      </span>
                      <span className={`rounded-full px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${
                        agent.status === 'Available now' ? 'bg-[#f4b28c]/12 text-[#f4b28c]' : 'bg-white/8 text-white/55'
                      }`}>{agent.status}</span>
                    </div>

                    <p className={`mt-7 text-xs font-semibold uppercase tracking-[0.16em] ${
                      isJasonAI ? 'text-[#f4b28c]' : isClara ? 'text-[#f5dce8]' : 'text-[#9bc49f]'
                    }`}>{agent.product} · {agent.product === 'JasonAI' ? 'Admin' : agent.product === 'Clara' ? 'Expert' : 'Operator'}</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">{agent.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/55">{agent.body}</p>

                    <div className="mt-8 border-t border-white/12 pt-6">
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">How you could use it</p>
                      <ul className="mt-4 space-y-3">
                        {agent.workflows.map((workflow) => (
                          <li key={workflow} className="flex gap-3 text-sm leading-6 text-white/72">
                            <ArrowRight className={`mt-1 h-3.5 w-3.5 shrink-0 ${isJasonAI ? 'text-[#f4b28c]' : isClara ? 'text-[#d9a9c2]' : 'text-[#9bc49f]'}`} />
                            <span>{workflow}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link to={agent.to} className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-white transition hover:text-[#9bc49f]">
                      See {agent.product}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {page === 'general-contracting' ? (
        <section data-header-theme="dark" className="border-y border-[#50352a] bg-[#14110f] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b24a24]">Questions contractor owners ask first</p>
                <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                  The practical questions come before the software.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                What changes for the crew, where JasonAI fits beside the systems you already use, which communication it can review, and how the founding offer works.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {jasonAIObjections.map((item, index) => (
                <motion.article
                  key={item.question}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.06 }}
                  className="flex min-h-72 flex-col rounded-[1.75rem] border border-[#50352a] bg-[#14110f] p-6 text-white"
                >
                  <span className="font-mono text-[10px] text-[#f4b28c]">0{index + 1}</span>
                  <h3 className="mt-10 text-xl font-semibold leading-tight tracking-[-0.025em]">{item.question}</h3>
                  <p className="mt-auto pt-8 text-sm leading-6 text-white/60">{item.answer}</p>
                </motion.article>
              ))}
            </div>

            <motion.div {...reveal} className="mt-20 grid gap-10 border-t border-white/15 pt-14 lg:grid-cols-[.58fr_1.42fr]">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4f7f52]">Details before a conversation</p>
                <h3 className="mt-5 max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">Straight answers about setup, privacy, fit, and price.</h3>
              </div>
              <div className="grid content-start gap-3 sm:grid-cols-2">
                {jasonAIFaqs.map((item, index) => (
                  <motion.details
                    key={item.question}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: (index % 4) * 0.04 }}
                    className="group self-start overflow-hidden rounded-[1.25rem] border border-white/15 bg-white/[.055] open:border-[#f4b28c]/45"
                  >
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold marker:content-none">
                      <span>{item.question}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#b24a24] transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="border-t border-white/12 px-5 py-5 text-sm leading-7 text-white/60">{item.answer}</p>
                  </motion.details>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      ) : null}

      <section data-header-theme="dark" id="workflow" className="bg-[#101a13] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9bc49f]">The operating flow</p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">From signal to a useful next action.</h2>
          </motion.div>
          <div className="mt-16 grid overflow-hidden rounded-[1.75rem] border-l border-t border-white/15 md:grid-cols-2 xl:grid-cols-4">
            {config.workflow.map((step, index) => (
              <motion.article key={step.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="min-h-64 border-b border-r border-white/15 p-6 sm:p-8">
                <div className="flex items-center justify-between text-[#9bc49f]">
                  <CircleDot className="h-4 w-4" />
                  <span className="font-mono text-[10px]">0{index + 1}</span>
                </div>
                <h3 className="mt-16 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section data-header-theme={isIndustryPage ? 'dark' : 'light'} className={`px-5 py-20 sm:px-8 sm:py-28 lg:px-10 ${isIndustryPage ? 'bg-[#0d1510]' : ''}`}>
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <motion.div {...reveal}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4f7f52]">Designed outcome</p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">Better work should be visible.</h2>
          </motion.div>
          <div className={`border-t ${isIndustryPage ? 'border-white/20' : 'border-[#172019]/20'}`}>
            {config.outcomes.map((outcome, index) => (
              <motion.div key={outcome} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className={`flex min-h-24 items-center gap-5 border-b py-6 ${isIndustryPage ? 'border-white/20' : 'border-[#172019]/20'}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isIndustryPage ? 'bg-[#9bc49f]/15 text-[#9bc49f]' : 'bg-[#dce9dc] text-[#315f38]'}`}><Check className="h-4 w-4" /></span>
                <p className="text-xl font-semibold tracking-tight sm:text-2xl">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section data-header-theme="dark" className="bg-[#172019] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <motion.div {...reveal} className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[#9bc49f]"><Sparkles className="h-4 w-4" /><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">Start with one workflow</span></div>
            <h2 className="mt-7 text-4xl font-medium leading-[1] tracking-[-0.05em] sm:text-7xl">{config.closeTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">{config.closeBody}</p>
          </div>
          <a href={`mailto:info@b2w-ai.com?subject=${subject}`} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-[#172019] transition hover:bg-[#cce2ce]">
            <DescrambleText text="Book an introduction" />
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </section>

      <div data-header-theme="dark" className="bg-[#172019]"><HomeSiteFooter className="text-white/55" /></div>
    </div>
  );
}
