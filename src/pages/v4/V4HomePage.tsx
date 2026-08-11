import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Building2,
  Camera,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  FileChartColumn,
  FileSpreadsheet,
  FileText,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import Seo from '../../components/Seo';
import B2WIcon from '../../components/logo/B2WIcon';

const capabilities = [
  {
    number: '01',
    title: 'Find the project context',
    description: 'Summarize, search, and respond using the project conversations your team has already had.',
    example: '“What did we promise the Maple Street client?”',
    icon: Search,
    accent: '#25D366',
  },
  {
    number: '02',
    title: 'Create the next document',
    description: 'Generate SOPs, estimates, and proposals in line with the way your business actually works.',
    example: 'Conversation → reviewed proposal draft',
    icon: FileText,
    accent: '#f4b28c',
  },
  {
    number: '03',
    title: 'Review almost anything',
    description: 'Analyze and provide feedback on accounting, planning, and technical material across the formats your projects already use.',
    example: 'Sheets · slides · sites · photos · video · audio · drawings',
    icon: FileChartColumn,
    accent: '#a9c7a8',
  },
] as const;

const summaryOptions = [
  {
    label: 'No AI',
    kicker: 'Manual communication',
    time: '0 hrs',
    price: '$0',
    value: '$0',
    note: 'Baseline',
    tone: 'bg-[#f7f4ed]',
    featured: false,
  },
  {
    label: 'ChatGPT, Gemini, or Claude',
    kicker: 'Standalone assistant',
    time: '3–5 hrs',
    price: '≈ $20/mo',
    value: '≈ $30k/yr',
    note: 'You bring the context',
    tone: 'bg-white',
    featured: false,
  },
  {
    label: 'JasonAI',
    kicker: 'Embedded assistant',
    time: '8–12 hrs',
    price: '$0 beta',
    value: '≈ $70k/yr',
    note: 'Context is already there',
    tone: 'bg-[#14110f] text-white',
    featured: true,
  },
] as const;

const valueRows = [
  ['Writing, analysis, brainstorming', '$5k–$15k/yr', '$5k–$15k/yr'],
  ['Information retrieval', '$3k–$8k/yr', '$10k–$20k/yr'],
  ['Summaries & catching up', '$3k–$7k/yr', '$8k–$15k/yr'],
  ['Coordination / admin reduction', '$5k–$12k/yr', '$15k–$30k/yr'],
  ['Avoided mistakes / missed items', '$1k–$5k/yr', '$5k–$20k+/yr'],
  ['Additional owner capacity / revenue', '$5k–$15k/yr', '$10k–$50k+/yr'],
  ['Typical total potential value', '≈ $20k–$50k/yr', '≈ $40k–$100k+/yr'],
  ['Deep / power-user potential', '≈ $75k+/yr', '≈ $100k–$200k+/yr'],
] as const;

const operatingRows = [
  ['You have to open it', 'Already where work happens'],
  ['You provide the context', 'Context is already present'],
  ['You ask it what to analyze', 'Can continuously understand discussions'],
  ['Mostly helps with intentional tasks', 'Can catch things you forget to ask about'],
  ['Information must often be copied in', 'Information enters naturally through conversation'],
  ['Primarily saves individual time', 'Saves owner and team coordination time'],
  ['Produces answers', 'Can surface actions, commitments, deadlines, and risks'],
  ['Reactive', 'Potentially proactive'],
] as const;

const formatChips = ['XLSX', 'PPTX', 'PDF', 'JPG', 'MP4', 'VOICE', 'DWG'];

const sourceTypes = [
  [MessageCircle, 'Messages'],
  [Mail, 'Emails'],
  [FileText, 'Documents'],
  [Camera, 'Photos'],
  [Mic, 'Voice notes'],
  [Paperclip, 'Drawings'],
] as const;

const channelCards = [
  [MessageCircle, 'WhatsApp', 'Add JasonAI to project group chats.', '#25D366'],
  [Mail, 'Gmail', 'Ask questions across project email.', '#f4b28c'],
  [Upload, 'Web', 'Upload files and work directly with JasonAI.', '#a9c7a8'],
  [Workflow, 'More coming', 'Teams, SMS, project-management, accounting, and internal systems.', '#c5a36a'],
] as const;

const summaryRows = [
  ['Searches project conversations', 'Manual', 'Requires context', 'Built in'],
  ['Summarizes project activity', 'Manual', 'Copy / paste', 'On demand'],
  ['Understands ongoing projects', 'No', 'Limited', 'Yes'],
  ['Creates project documents', 'Manual', 'Assisted', 'From project context'],
  ['Surfaces outstanding items', 'Manual', 'Prompted', 'Context-aware'],
  ['Lives in existing communication', '—', 'Usually separate', 'Yes'],
  ['Estimated annual owner value', '$0', '≈ $20k–$50k', '≈ $40k–$100k+'],
  ['Entry price', 'Existing labor', '≈ $20–$30/mo*', 'Free'],
] as const;

const valueCards = [
  ['Find information faster', '$10k–$20k / year', 'Less time searching through conversations, files, and emails.', Search],
  ['Reduce coordination', '$15k–$30k / year', 'Fewer calls, status checks, repeated questions, and manual summaries.', MessageCircle],
  ['Catch missed information', '$5k–$20k+ / year', 'Surface forgotten tasks, unanswered questions, and project commitments.', ShieldCheck],
  ['Create additional capacity', '$10k–$50k+ / year', 'Return time to estimating, selling, managing, and delivering projects.', Zap],
] as const;

const projectTimeline = [
  ['Monday', 'Client requests a material change in WhatsApp.', MessageCircle],
  ['Tuesday', 'Supplier sends updated pricing through email.', Mail],
  ['Wednesday', 'Superintendent posts a voice note from site.', Mic],
  ['Thursday', 'Owner asks what changed and how it affects the estimate.', Search],
] as const;

const useCases = [
  ['project-coordination', 'Project coordination', 'Keep track of conversations, decisions, and outstanding items.', MessageCircle],
  ['estimating', 'Estimating', 'Turn scope, chats, and supporting documents into estimates.', FileText],
  ['client-communication', 'Client communication', 'Draft responses and project updates from actual project context.', Send],
  ['operations', 'Operations', 'Create SOPs, checklists, and internal documentation.', ClipboardList],
  ['financial-review', 'Financial review', 'Analyze spreadsheets, invoices, budgets, and project performance.', FileSpreadsheet],
  ['field-information', 'Field information', 'Analyze photos, drawings, voice notes, and job-site updates.', Camera],
] as const;

const faqItems = [
  ['Is JasonAI just ChatGPT in WhatsApp?', 'No. General-purpose AI starts with the information you provide. JasonAI is designed to work with the ongoing information generated by your projects and business.'],
  ['Do I need to change how my team works?', 'No. JasonAI is designed to work through communication channels and tools your team already uses.'],
  ['What can JasonAI read?', 'Only the information and channels you explicitly connect or provide.'],
  ['Does my team need another app?', 'Not necessarily. JasonAI can operate directly through existing communication channels such as WhatsApp.'],
  ['Can JasonAI create estimates and proposals?', 'Yes. JasonAI can generate draft documents using the business and project information provided to it, with human review before use.'],
  ['Can JasonAI take actions automatically?', 'Agent capabilities are under development. Current answers, documents, and analysis remain separate from future approved actions.'],
  ['How much does it cost?', 'JasonAI can currently be started for free through the V4 early-access concept.'],
] as const;

function V4Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigation = [
    {
      label: 'JasonAI',
      href: '/v4/jasonai',
      activePaths: ['/v4/jasonai', '/v4/how-it-works'],
      items: [
        ['Product overview', '/v4/jasonai', 'What JasonAI can understand and create.'],
        ['Capabilities', '/v4/jasonai#capabilities', 'Search, documents, and file analysis.'],
        ['How it works', '/v4/how-it-works', 'See the workflow through one project.'],
        ['Security & control', '/v4/how-it-works#control', 'Choose what the assistant can access.'],
      ],
    },
    {
      label: 'Solutions',
      href: '/v4/solutions',
      activePaths: ['/v4/solutions'],
      items: [
        ['Solution overview', '/v4/solutions', 'Start with the contractor use cases.'],
        ['Project coordination', '/v4/solutions#project-coordination', 'Decisions, commitments, and open items.'],
        ['Estimating', '/v4/solutions#estimating', 'Turn scope and context into drafts.'],
        ['Field information', '/v4/solutions#field-information', 'Review drawings, photos, and updates.'],
      ],
    },
    { label: 'Why JasonAI', href: '/v4/why-jasonai', activePaths: ['/v4/why-jasonai'] },
    { label: 'Pricing', href: '/v4/pricing', activePaths: ['/v4/pricing'] },
    {
      label: 'Resources',
      href: '/v4/faq',
      activePaths: ['/v4/faq'],
      items: [
        ['FAQs', '/v4/faq', 'Direct answers about access, fit, and cost.'],
        ['Project example', '/v4/how-it-works#project-example', 'Follow information across a working week.'],
        ['Economic model', '/v4/why-jasonai', 'Compare time, price, and annual value.'],
      ],
    },
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/12 bg-[#14110f]/78 px-4 text-white shadow-[0_16px_50px_rgba(0,0,0,.16)] backdrop-blur-2xl sm:px-5">
        <Link to="/v4" aria-label="B2W V4 home" className="inline-flex items-center gap-2.5"><B2WIcon title="" className="h-8 w-9 text-white" /><span className="font-semibold tracking-[-.03em]">B2W</span></Link>
        <nav aria-label="V4 navigation" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const active = item.activePaths.includes(pathname as never);
            if (!('items' in item)) {
              return <Link key={item.label} to={item.href} aria-current={active ? 'page' : undefined} className={`rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/7 hover:text-white ${active ? 'text-[#f4b28c]' : 'text-white/62'}`}>{item.label}</Link>;
            }
            const open = openDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onFocus={() => setOpenDropdown(item.label)}
                onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenDropdown(null); }}
              >
                <button type="button" aria-expanded={open} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/7 hover:text-white ${active ? 'text-[#f4b28c]' : 'text-white/62'}`} onClick={() => setOpenDropdown(open ? null : item.label)}>
                  {item.label}<ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                  <div className="rounded-[1.35rem] border border-white/12 bg-[#14110f]/96 p-2 shadow-[0_24px_70px_rgba(0,0,0,.38)] backdrop-blur-2xl">
                    {item.items.map(([label, href, description]) => <Link key={label} to={href} onClick={() => setOpenDropdown(null)} className="group block rounded-2xl px-4 py-3 transition hover:bg-white/7"><span className="block text-sm font-semibold text-white/88 group-hover:text-white">{label}</span><span className="mt-1 block text-xs leading-5 text-white/38">{description}</span></Link>)}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/v4/pricing" className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#f4b28c] px-4 text-sm font-semibold text-[#14110f] transition hover:bg-[#ffd9c0]">Try free</Link>
          <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>
      {menuOpen ? <nav aria-label="Mobile V4 navigation" className="mx-auto mt-2 max-h-[calc(100vh-6.5rem)] max-w-7xl overflow-y-auto rounded-[1.5rem] border border-white/12 bg-[#14110f]/95 p-3 text-white shadow-2xl backdrop-blur-2xl lg:hidden">{navigation.map((item) => <div key={item.label} className="border-b border-white/8 py-2 last:border-0"><Link to={item.href} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/8 hover:text-white ${item.activePaths.includes(pathname as never) ? 'text-[#f4b28c]' : 'text-white/82'}`}>{item.label}</Link>{'items' in item ? <div className="grid pl-3">{item.items.slice(1).map(([label, href]) => <Link key={label} to={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2 text-xs text-white/48 hover:bg-white/8 hover:text-white">{label}</Link>)}</div> : null}</div>)}</nav> : null}
    </header>
  );
}

function V4Footer() {
  const groups = [
    ['Product', [['JasonAI', '/v4/jasonai'], ['Capabilities', '/v4/jasonai#capabilities'], ['How it works', '/v4/how-it-works'], ['Pricing', '/v4/pricing'], ['Agent capabilities', '/v4/jasonai#agents']]],
    ['Solutions', [['Project coordination', '/v4/solutions#project-coordination'], ['Estimating', '/v4/solutions#estimating'], ['Operations', '/v4/solutions#operations'], ['Field information', '/v4/solutions#field-information']]],
    ['Company', [['Why JasonAI', '/v4/why-jasonai'], ['Contact', 'mailto:info@b2w-ai.com'], ['Privacy', '/v4/how-it-works#control'], ['Terms', 'mailto:info@b2w-ai.com?subject=JasonAI%20terms']]],
    ['Resources', [['Project demo', '/v4/how-it-works#project-example'], ['Economic model', '/v4/why-jasonai'], ['FAQs', '/v4/faq']]],
  ] as const;

  return (
    <footer className="bg-[#08090a] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><Link to="/v4" className="inline-flex items-center gap-3"><B2WIcon title="" className="h-10 w-11" /><span className="text-xl font-semibold">B2W</span></Link><p className="mt-5 max-w-sm text-sm leading-7 text-white/50">We build tools that reduce the cost of communication for project-driven businesses.</p><p className="mt-4 text-sm text-white/38">Washington, DC</p></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{groups.map(([title, links]) => <div key={title}><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">{title}</p><ul className="mt-4 space-y-2.5">{links.map(([label, href]) => <li key={label}>{href.startsWith('mailto:') ? <a href={href} className="text-sm text-white/52 transition hover:text-white">{label}</a> : <Link to={href} className="text-sm text-white/52 transition hover:text-white">{label}</Link>}</li>)}</ul></div>)}</div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/32 sm:flex-row"><p>© 2026 B2W LLC</p><p>Privacy · Terms</p></div>
      </div>
    </footer>
  );
}

function ContractorWorkplaceGraphic() {
  return (
    <motion.figure initial={{ opacity: 0, x: 24, filter: 'blur(12px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ delay: .18, duration: .8, ease: [0.22, 1, 0.36, 1] }} className="relative isolate -mx-5 min-h-[24rem] overflow-hidden sm:mx-0 sm:min-h-[30rem] lg:-mr-24 lg:min-h-[36rem]">
      <img src="/images/v4/jasonai-contractor-workplace-hero.png" alt="Abstract contractor workbench with drawings, field tools, framing, and traced project-information lines" className="absolute inset-0 h-full w-full object-cover object-right" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#14110f_0%,rgba(20,17,15,.72)_12%,transparent_42%),linear-gradient(0deg,#14110f_0%,transparent_28%,transparent_78%,rgba(20,17,15,.8)_100%)]" />
      <figcaption className="absolute bottom-5 right-5 rounded-full border border-white/12 bg-[#14110f]/68 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/58 backdrop-blur-md sm:bottom-8 sm:right-8">Field work · office work · one context</figcaption>
    </motion.figure>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/84 shadow-[0_24px_70px_rgba(15,23,42,.08)] backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-950/10 bg-[#f7f4ed] text-xs uppercase tracking-[.13em] text-slate-500">
              <th className="px-6 py-5 font-semibold">Value driver</th>
              <th className="px-6 py-5 font-semibold">Standalone AI</th>
              <th className="bg-[#14110f] px-6 py-5 font-semibold text-[#f4b28c]">JasonAI in business chats</th>
            </tr>
          </thead>
          <tbody>
            {valueRows.map((row, index) => {
              const isTotal = index >= valueRows.length - 2;
              return (
                <tr key={row[0]} className={`border-b border-slate-950/8 last:border-0 ${isTotal ? 'font-semibold' : ''}`}>
                  <td className="px-6 py-5 text-sm text-slate-800">{row[0]}</td>
                  <td className="px-6 py-5 text-sm text-slate-700">{row[1]}</td>
                  <td className="bg-[#14110f] px-6 py-5 text-sm text-white">{row[2]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type V4PageName = 'home' | 'product' | 'how-it-works' | 'solutions' | 'why-jasonai' | 'pricing' | 'faq';

const pageMeta: Record<Exclude<V4PageName, 'home'>, { eyebrow: string; title: string; description: string; seoTitle: string; canonical: string }> = {
  product: { eyebrow: 'JasonAI', title: 'One assistant across the work your team already does.', description: 'Explore how JasonAI finds project context, creates business documents, analyzes files, and expands toward approved actions.', seoTitle: 'JasonAI Capabilities for Contractors', canonical: '/jasonai' },
  'how-it-works': { eyebrow: 'How it works', title: 'Connect the information. Ask naturally. Move the work forward.', description: 'See one project move across WhatsApp, email, voice notes, files, answers, reviewed documents, and controlled actions.', seoTitle: 'How JasonAI Works', canonical: '/jasonai/how-it-works' },
  solutions: { eyebrow: 'Solutions', title: 'Built around the work contractors actually do.', description: 'Use shared project context across coordination, estimating, client communication, operations, financial review, and field information.', seoTitle: 'JasonAI Solutions for Contractors', canonical: '/solutions/business-use-cases' },
  'why-jasonai': { eyebrow: 'Why JasonAI?', title: 'Reduce the cost of communication.', description: 'Compare manual work, standalone AI, and an assistant embedded where project information is created.', seoTitle: 'Why JasonAI Reduces Communication Costs', canonical: '/jasonai' },
  pricing: { eyebrow: 'Pricing', title: 'Start using JasonAI for free.', description: 'Begin with project questions, search, summaries, document generation, and file analysis through the V4 early-access concept.', seoTitle: 'JasonAI Free Early-Access Pricing', canonical: '/pricing' },
  faq: { eyebrow: 'Resources · FAQs', title: 'Direct answers before you connect your business information.', description: 'Review common questions about fit, workflow changes, access, documents, agent capabilities, and early-access pricing.', seoTitle: 'JasonAI Frequently Asked Questions', canonical: '/jasonai/questions' },
};

function V4PageIntro({ page }: { page: Exclude<V4PageName, 'home'> }) {
  const meta = pageMeta[page];
  return (
    <section className="relative overflow-hidden bg-[#14110f] pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
      <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.055]" />
      <div aria-hidden="true" className="absolute -left-28 top-12 h-80 w-80 rounded-full bg-[#b24a24]/24 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#f4b28c]">{meta.eyebrow}</p><h1 className="mt-6 max-w-[14ch] text-[clamp(3rem,6.6vw,6.5rem)] font-medium leading-[.94] tracking-[-.055em]">{meta.title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/56">{meta.description}</p></div>
    </section>
  );
}

export default function V4HomePage({ page = 'home' }: { page?: V4PageName }) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);
  const routeMeta = page === 'home' ? null : pageMeta[page];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fbfaf6] text-slate-950">
      <Seo
        title={routeMeta?.seoTitle ?? 'B2W V4 — JasonAI for Contractor Communication'}
        description={routeMeta?.description ?? 'JasonAI reduces the cost of contractor communication by living inside the tools teams already use and turning existing project information into useful work.'}
        canonicalPath={routeMeta?.canonical ?? '/'}
        robots="noindex, nofollow"
      />
      <V4Header />

      <main>
        {page !== 'home' ? <V4PageIntro page={page} /> : null}
        {page === 'home' ? <>
        <section id="overview" data-header-theme="dark" className="relative overflow-hidden bg-[#14110f] pb-24 pt-32 text-white sm:pb-32 sm:pt-40 lg:pt-48">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.06]" />
          <motion.div aria-hidden="true" className="absolute -left-40 top-8 h-[34rem] w-[34rem] rounded-full bg-[#b24a24]/32 blur-[110px]" animate={{ scale: [1, 1.1, 1], opacity: [.45, .75, .45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div aria-hidden="true" className="absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#24724f]/16 blur-[100px]" animate={{ y: [0, -18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

          <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,.78fr)] lg:items-center lg:px-10">
            <div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold uppercase tracking-[.2em] text-[#f4b28c]">B2W · JasonAI</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-[10.5ch] text-[clamp(3.4rem,7.2vw,7rem)] font-medium leading-[.93] tracking-[-.06em]">
                A contractor’s new assistant.
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }} className="mt-8 max-w-2xl text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.45] text-white/68">
                Integrate JasonAI into WhatsApp, Gmail, or <em className="text-white">anywhere</em> you want. <a href="mailto:info@b2w-ai.com?subject=JasonAI%20free%20early%20access" className="font-semibold text-white underline decoration-[#f4b28c] decoration-2 underline-offset-8">For free.</a>
              </motion.p>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/48 sm:text-base">Find information, create documents, analyze project files, and act on conversations without changing the way your business already works.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/v4/pricing" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f4b28c] px-6 py-3 font-semibold text-[#14110f] transition hover:bg-[#ffd9c0]">Get free early access <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
                <Link to="/v4/why-jasonai" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/6 px-6 py-3 font-semibold text-white transition hover:bg-white/10">See the value <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-white/40"><Check className="h-3.5 w-3.5 text-[#25D366]" /> No new project-management system required.</p>
            </div>
            <ContractorWorkplaceGraphic />
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.025]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10">
            <div><p className="text-sm font-semibold text-[#a24321]">The information already exists</p><h2 className="mt-4 text-[clamp(3rem,6.8vw,6.5rem)] font-medium leading-[.95] tracking-[-.052em]">Your projects already contain the answers.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">They are just buried across messages, emails, documents, spreadsheets, drawings, photos, and conversations. JasonAI connects those sources so your team can ask useful questions without searching through everything manually.</p></div>
            <div className="rounded-[2rem] border border-slate-950/10 bg-white/78 p-5 shadow-[0_28px_80px_rgba(15,23,42,.09)] sm:p-7">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{sourceTypes.map(([Icon, label], index) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="flex items-center gap-2.5 rounded-2xl border border-slate-950/8 bg-[#fbfaf6] p-3 text-xs font-semibold text-slate-600"><Icon className="h-4 w-4 text-[#a24321]" />{label}</motion.div>)}</div>
              <div className="my-5 flex items-center justify-center gap-3"><span className="h-px flex-1 bg-slate-950/10" /><ChevronDown className="h-5 w-5 text-slate-400" /><span className="h-px flex-1 bg-slate-950/10" /></div>
              <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-[1.35rem] bg-[#14110f] p-4 text-white"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4b28c] text-[#14110f]"><Bot className="h-5 w-5" /></span><div><p className="text-sm font-semibold">JasonAI</p><p className="text-[10px] text-white/42">connected project context</p></div></div>
              <div className="my-5 flex items-center justify-center gap-3"><span className="h-px flex-1 bg-slate-950/10" /><ChevronDown className="h-5 w-5 text-slate-400" /><span className="h-px flex-1 bg-slate-950/10" /></div>
              <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-[#dcebd8] p-4"><p className="text-xs font-semibold text-[#10271c]">What happened?</p><p className="mt-2 text-[11px] leading-5 text-[#10271c]/58">Decisions, approvals, changes, and project history.</p></div><div className="rounded-2xl bg-[#fff0e6] p-4"><p className="text-xs font-semibold text-[#7f321a]">What happens next?</p><p className="mt-2 text-[11px] leading-5 text-[#7f321a]/62">Open items, follow-ups, documents, and actions.</p></div></div>
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf6] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-sm font-semibold text-[#a24321]">Explore JasonAI</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">One clear journey, with the detail where you need it.</h2></div><p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">Start with the product, understand the workflow, then validate the economic case and pricing.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[
          ['Product', 'Answers, documents, file analysis, integrations, and future agent capabilities.', '/v4/jasonai', Bot],
          ['How it works', 'A concrete project example, the Connect → Ask → Act workflow, and information controls.', '/v4/how-it-works', Workflow],
          ['Solutions', 'Contractor use cases across coordination, estimating, field work, operations, and finance.', '/v4/solutions', Building2],
          ['Why JasonAI', 'The functional comparison, annual value model, and source of communication savings.', '/v4/why-jasonai', CircleDollarSign],
          ['Pricing', 'The free early-access offer and what is included today.', '/v4/pricing', DollarSign],
          ['FAQs', 'Straight answers about access, workflow change, documents, actions, and cost.', '/v4/faq', FileText],
        ].map(([title, body, to, Icon]) => <Link key={String(title)} to={String(to)} className="group min-h-64 rounded-[1.5rem] border border-slate-950/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,.08)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-5 w-5" /></span><h3 className="mt-9 text-2xl font-semibold tracking-[-.04em]">{String(title)}</h3><p className="mt-4 text-sm leading-7 text-slate-600">{String(body)}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#a24321]">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div></section>
        </> : null}

        {page === 'product' ? <>
        <section id="capabilities" className="relative border-b border-slate-950/10 bg-[#fbfaf6] py-24 sm:py-32">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.025]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><p className="text-sm font-semibold text-[#a24321]">What JasonAI does</p><h2 className="mt-4 text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">From project noise to useful work.</h2></div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">JasonAI meets the team where the information already lives, understands how your business works, and helps turn scattered context into a clear next move.</p>
            </div>

            <div className="mt-14 space-y-6">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article key={item.number} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * .08, duration: .48 }} className="group grid min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/82 p-6 shadow-[0_20px_60px_rgba(15,23,42,.07)] sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10">
                    <div className="flex flex-col"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-slate-400">{item.number}</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"><Icon className="h-5 w-5" style={{ color: item.accent }} /></span></div><h3 className="mt-10 text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[.96] tracking-[-.05em]">{item.title}</h3><p className="mt-6 max-w-xl text-base leading-8 text-slate-600">{item.description}</p><p className="mt-auto border-t border-slate-950/10 pt-5 text-sm font-semibold text-slate-500">{item.example}</p></div>
                    <div className="flex flex-col justify-center">
                    {index === 0 ? (
                      <div className="rounded-[1.4rem] bg-[#f4f2ec] p-4">
                        {['What did the client approve for the kitchen?', 'What are we waiting on for Project Oak?', 'Summarize everything that happened this week.', 'Did anyone confirm countertop delivery?'].map((text, row) => <motion.div key={text} className={`mb-2 flex items-start gap-2 rounded-2xl px-4 py-3 text-xs leading-5 last:mb-0 ${row === 2 ? 'ml-7 bg-[#14110f] text-white' : 'mr-7 bg-white text-slate-600'}`} initial={{ opacity: .35, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: .2 + row * .14 }}>{row === 2 ? <Bot className="mt-0.5 h-3.5 w-3.5 text-[#f4b28c]" /> : <MessageCircle className="mt-0.5 h-3.5 w-3.5 text-[#24724f]" />}{text}</motion.div>)}
                      </div>
                    ) : index === 1 ? (
                      <div><div className="flex items-center gap-3 rounded-2xl bg-[#f4f2ec] p-4 text-xs font-semibold text-slate-600"><MessageCircle className="h-4 w-4 text-[#24724f]" /> Project chat <ArrowRight className="ml-auto h-4 w-4" /> JasonAI</div><div className="relative mx-auto mt-6 h-52 max-w-sm">{[0, 1, 2].map((sheet) => <motion.div key={sheet} className="absolute inset-x-0 rounded-[1.2rem] border border-slate-950/10 bg-[#fffaf2] p-5 shadow-lg" style={{ top: sheet * 14, scale: 1 - sheet * .035, zIndex: 3 - sheet }} animate={{ y: [0, sheet === 0 ? -3 : 0, 0] }} transition={{ duration: 3, repeat: Infinity, delay: sheet * .25 }}><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#a24321]">Proposal.pdf</p><div className="mt-4 h-2 w-24 rounded bg-[#b24a24]/25" /><div className="mt-3 h-1.5 w-full rounded bg-black/8" /><div className="mt-2 h-1.5 w-3/4 rounded bg-black/8" /></motion.div>)}</div><p className="text-center text-xs text-slate-500">Estimates · Proposals · SOPs · Updates · Reports · Checklists</p></div>
                    ) : (
                      <div className="rounded-[1.4rem] bg-[#15251e] p-5"><div className="flex min-h-32 flex-wrap content-center gap-2">{formatChips.map((format, chip) => <motion.span key={format} initial={{ opacity: 0, scale: .8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: chip * .06 }} className="rounded-full border border-white/12 bg-white/7 px-3 py-2 font-mono text-[10px] text-[#c7dfc5]">{format}</motion.span>)}</div><div className="mt-5 space-y-2 border-t border-white/10 pt-5">{['Which projects are over budget?', 'Review this estimate for missing scope.', 'Compare these drawings with the client request.'].map((query) => <p key={query} className="rounded-xl bg-white/6 px-3 py-2.5 text-xs text-white/60">“{query}”</p>)}</div></div>
                    )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#14110f] py-24 text-white sm:py-32">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.05]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-4xl text-center"><p className="text-sm font-semibold text-[#f4b28c]">One assistant, wherever you work</p><h2 className="mt-4 text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[.95] tracking-[-.052em]">Don’t change how your company communicates.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/52">Bring JasonAI to the tools your team already uses.</p></div>
            <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{channelCards.map(([Icon, title, body, color], index) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="min-h-64 rounded-[1.6rem] border border-white/10 bg-white/[.055] p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8" style={{ color }}><Icon className="h-5 w-5" /></span><h3 className="mt-10 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-white/48">{body}</p></motion.article>)}</div>
            <div className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-full border border-[#f4b28c]/25 bg-[#f4b28c]/8 px-5 py-3 text-sm font-semibold text-[#f4b28c]"><Bot className="h-4 w-4" /> JasonAI stays at the center</div>
          </div>
        </section>
        </> : null}

        {page === 'why-jasonai' ? <section id="why-jasonai" className="bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <p className="text-sm font-semibold text-[#a24321]">Why JasonAI?</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
              <h2 className="text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[.94] tracking-[-.052em]">Reduce the cost of communication.</h2>
              <p className="max-w-xl text-lg leading-8 text-slate-600">Every project generates hundreds of messages, questions, files, approvals, updates, and decisions. Standalone AI helps after you provide the information. JasonAI can already be where the information is created.</p>
            </div>

            <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/82 shadow-[0_24px_70px_rgba(15,23,42,.08)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead><tr className="border-b border-slate-950/10 bg-[#fbfaf6] text-[10px] font-semibold uppercase tracking-[.13em] text-slate-500"><th className="px-6 py-5">Capability</th><th className="px-6 py-5">No AI</th><th className="px-6 py-5">ChatGPT / Gemini / Claude</th><th className="bg-[#14110f] px-6 py-5 text-[#f4b28c]">JasonAI</th></tr></thead>
                  <tbody>{summaryRows.map((row) => <tr key={row[0]} className="border-b border-slate-950/8 text-sm last:border-0"><td className="px-6 py-4 font-medium text-slate-800">{row[0]}</td><td className="px-6 py-4 text-slate-500">{row[1]}</td><td className="px-6 py-4 text-slate-600">{row[2]}</td><td className="bg-[#14110f] px-6 py-4 font-semibold text-white">{row[3]}</td></tr>)}</tbody>
                </table>
              </div>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {summaryOptions.map((option, index) => (
                <motion.article key={option.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className={`relative overflow-hidden rounded-[1.75rem] border border-slate-950/10 p-6 shadow-[0_20px_55px_rgba(15,23,42,.07)] sm:p-7 ${option.tone}`}>
                  {option.featured ? <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.06]" /> : null}
                  <div className="relative">
                    <p className={`text-[10px] font-semibold uppercase tracking-[.16em] ${option.featured ? 'text-[#f4b28c]' : 'text-slate-400'}`}>{option.kicker}</p>
                    <h3 className="mt-3 min-h-14 text-2xl font-semibold leading-tight tracking-[-.035em]">{option.label}</h3>
                    <div className={`mt-8 divide-y ${option.featured ? 'divide-white/12' : 'divide-slate-950/10'}`}>
                      {[
                        ['Potential time saved / week', option.time],
                        ['Current comparison price', option.price],
                        ['Illustrative annual value', option.value],
                      ].map(([label, value]) => <div key={label} className="flex items-end justify-between gap-5 py-4"><span className={`text-xs ${option.featured ? 'text-white/45' : 'text-slate-500'}`}>{label}</span><strong className="text-xl tracking-[-.03em]">{value}</strong></div>)}
                    </div>
                    <p className={`mt-6 flex items-center gap-2 text-xs font-semibold ${option.featured ? 'text-[#f4b28c]' : 'text-slate-500'}`}><Zap className="h-3.5 w-3.5" />{option.note}</p>
                  </div>
                </motion.article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">Illustrative small-contractor model, not a guarantee. Standalone price compares current individual paid plans: ChatGPT Plus $20/month, Google AI Pro $19.99/month, and Claude Pro $20/month. JasonAI price reflects the free V4 early-access concept. Time saved and annual value should be validated against each business.</p>

            <div className="mt-20"><p className="text-sm font-semibold text-[#a24321]">Where does the value come from?</p><div className="mt-6 grid gap-4 md:grid-cols-2">{valueCards.map(([title, value, body, Icon], index) => <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="rounded-[1.5rem] border border-slate-950/10 bg-white/72 p-6 sm:p-7"><div className="flex items-start justify-between gap-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-4 w-4" /></span><strong className="text-right text-xl tracking-[-.035em] text-[#a24321]">{value}</strong></div><h3 className="mt-8 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{body}</p></motion.article>)}</div></div>

            <div className="mt-16">
              <button type="button" onClick={() => setDetailsOpen((open) => !open)} aria-expanded={detailsOpen} aria-controls="jasonai-value-detail" className="flex w-full items-center justify-between gap-6 border-y border-slate-950/12 py-5 text-left">
                <span><span className="block text-xs font-semibold uppercase tracking-[.16em] text-[#a24321]">Detailed model</span><span className="mt-2 block text-2xl font-semibold tracking-[-.035em]">Where the additional value comes from</span></span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-950 text-white"><ChevronDown className={`h-5 w-5 transition ${detailsOpen ? 'rotate-180' : ''}`} /></span>
              </button>
              <div id="jasonai-value-detail" className={`grid transition-[grid-template-rows,opacity] duration-500 ${detailsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="pt-8"><ComparisonTable /></div>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-9 lg:grid-cols-[.65fr_1.35fr]">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><CircleDollarSign className="h-5 w-5" /></span>
                <h3 className="mt-6 text-4xl font-medium leading-[.98] tracking-[-.05em]">Why the embedded version can be worth more.</h3>
                <p className="mt-5 text-sm leading-7 text-slate-600">The biggest difference is not the model. It is whether the assistant sits outside the workflow or participates in the communication system around it.</p>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/82 shadow-[0_24px_70px_rgba(15,23,42,.08)]">
                <div className="grid grid-cols-2 border-b border-slate-950/10 bg-[#f7f4ed] text-xs font-semibold uppercase tracking-[.12em] text-slate-500"><div className="p-5 sm:px-7">Standalone AI</div><div className="bg-[#14110f] p-5 text-[#f4b28c] sm:px-7">JasonAI</div></div>
                {operatingRows.map((row) => <div key={row[0]} className="grid grid-cols-2 border-b border-slate-950/8 text-sm last:border-0"><div className="p-5 leading-6 text-slate-600 sm:px-7">{row[0]}</div><div className="bg-[#14110f] p-5 font-medium leading-6 text-white sm:px-7">{row[1]}</div></div>)}
              </div>
            </div>

            <div className="mt-16 rounded-[1.75rem] border border-[#b24a24]/20 bg-[#fff7ed] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#a24321]">The difference in one sentence</p><blockquote className="mt-4 text-[clamp(1.55rem,3vw,2.5rem)] font-semibold leading-[1.2] tracking-[-.04em]">Standalone AI increases the productivity of the person using it. JasonAI increases the productivity of the communication system around that person.</blockquote></div>
              <a href="mailto:info@b2w-ai.com?subject=JasonAI%20free%20early%20access" className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#14110f] px-6 py-3 font-semibold text-white transition hover:bg-[#a24321] lg:mt-0">Try JasonAI <ArrowRight className="h-4 w-4" /></a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#24724f]" /> Human review remains required</span>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus" target="_blank" rel="noreferrer">ChatGPT pricing</a>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://one.google.com/about/plans" target="_blank" rel="noreferrer">Google AI pricing</a>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://support.anthropic.com/en/articles/8325610-how-much-does-claude-pro-cost" target="_blank" rel="noreferrer">Claude pricing</a>
            </div>
          </div>
        </section> : null}

        {page === 'how-it-works' ? <section id="project-example" className="bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
              <div className="lg:sticky lg:top-28"><p className="text-sm font-semibold text-[#a24321]">Example project</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.95] tracking-[-.052em]">One project. Hundreds of messages. One assistant.</h2><p className="mt-7 text-lg leading-8 text-slate-600">One question instead of searching four systems.</p></div>
              <div>
                <div className="space-y-3">{projectTimeline.map(([day, body, Icon], index) => <motion.article key={day} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="grid gap-4 rounded-[1.4rem] border border-slate-950/10 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.05)] sm:grid-cols-[100px_44px_1fr] sm:items-center"><p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-400">{day}</p><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7f4ed] text-[#a24321]"><Icon className="h-4 w-4" /></span><p className="text-sm leading-7 text-slate-700">{body}</p></motion.article>)}</div>
                <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#14110f] p-6 text-white sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">JasonAI · Thursday answer</p><p className="mt-4 text-xl font-semibold leading-8 tracking-[-.025em]">The tile changed from ceramic to limestone. Supplier pricing adds $2,840. The field note confirms two extra installation days. I drafted the revised estimate for review.</p><div className="mt-7 grid gap-2 sm:grid-cols-2">{['Summarized the change', 'Found supplier pricing', 'Extracted site details', 'Drafted revised estimate'].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2.5 text-xs text-white/58"><Check className="h-3.5 w-3.5 text-[#25D366]" />{item}</div>)}</div></div>
              </div>
            </div>
          </div>
        </section> : null}

        {page === 'solutions' ? <section id="use-cases" className="border-y border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="text-sm font-semibold text-[#a24321]">Contractor use cases</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">Built for the work contractors actually do.</h2></div><p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">One shared project context can support office, field, client, operational, and financial work.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{useCases.map(([title, body, Icon], index) => <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="min-h-64 rounded-[1.5rem] border border-slate-950/10 bg-white/72 p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-5 w-5" /></span><h3 className="mt-10 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-slate-600">{body}</p></motion.article>)}</div></div>
        </section> : null}

        {page === 'product' ? <section id="agents" className="relative overflow-hidden bg-[#10271c] py-24 text-white sm:py-32">
          <motion.div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a9c7a8]/20" animate={{ scale: [1, 1.12, 1], opacity: [.3, .7, .3] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="relative mx-auto w-full max-w-6xl px-5 text-center sm:px-8"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[#a9c7a8]"><Sparkles className="h-6 w-6" /></span><p className="mt-7 text-sm font-semibold text-[#a9c7a8]">Agent capabilities</p><h2 className="mx-auto mt-4 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[.95] tracking-[-.052em]">Today, JasonAI helps you understand the work. Next, it will help you do it.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/52">Upcoming capabilities are intended to take approved actions across business systems—not operate beyond the permissions you provide.</p><div className="mt-10 flex flex-wrap justify-center gap-2.5">{['Send the follow-up', 'Update the estimate', 'Create the task', 'Prepare the report', 'Notify the team'].map((label) => <span key={label} className="rounded-full border border-white/14 bg-white/7 px-4 py-2.5 text-xs text-white/65">{label}</span>)}</div><a href="mailto:info@b2w-ai.com?subject=JasonAI%20agent%20early%20access" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#10271c]">Join early access <ArrowRight className="h-4 w-4" /></a></div>
        </section> : null}

        {page === 'how-it-works' ? <section id="how-it-works" className="bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"><div className="mx-auto max-w-4xl text-center"><p className="text-sm font-semibold text-[#a24321]">How it works</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">Connect. Ask. Act.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">No complicated implementation. No new workflow to learn.</p></div><div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-slate-950/10 lg:grid-cols-3">{[['01', 'Connect', 'Add JasonAI to a communication channel or upload existing information.', Upload], ['02', 'Ask', 'Talk naturally about your projects and business.', MessageCircle], ['03', 'Act', 'Get answers, documents, analysis, and eventually approved actions.', Zap]].map(([number, title, body, Icon]) => <article key={String(number)} className="min-h-80 bg-white p-7 sm:p-8"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-slate-400">{String(number)}</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-5 w-5" /></span></div><h3 className="mt-16 text-4xl font-semibold tracking-[-.05em]">{String(title)}</h3><p className="mt-5 text-sm leading-7 text-slate-600">{String(body)}</p></article>)}</div></div>
        </section> : null}

        {page === 'how-it-works' ? <section id="control" className="border-y border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-10"><div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><LockKeyhole className="h-5 w-5" /></span><p className="mt-7 text-sm font-semibold text-[#a24321]">Security and control</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">Your business. Your information. Your control.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['Choose what JasonAI can access.', 'Keep projects separated.', 'Control who can ask what.', 'Remove integrations whenever you want.', 'Require human review before use.', 'Limit future actions to approved permissions.'].map((item) => <div key={item} className="flex min-h-28 items-start gap-3 rounded-[1.35rem] border border-slate-950/10 bg-white/70 p-5 text-sm font-medium leading-6 text-slate-700"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#24724f]" />{item}</div>)}</div></div>
        </section> : null}

        {page === 'pricing' ? <section id="pricing" className="bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.72fr] lg:items-center"><div><p className="text-sm font-semibold text-[#a24321]">Simple early-access pricing</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">Start using JasonAI for free.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">More powerful integrations, customization, and agent capabilities can be added as JasonAI grows.</p></div><div className="rounded-[2rem] bg-[#14110f] p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.2)] sm:p-8"><p className="text-sm font-semibold text-[#f4b28c]">JasonAI Free</p><p className="mt-5 text-7xl font-medium tracking-[-.06em]">$0</p><ul className="mt-8 space-y-3">{['Connect JasonAI', 'Ask project questions', 'Search and summarize', 'Generate documents', 'Analyze files'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-white/65"><Check className="h-4 w-4 text-[#25D366]" />{item}</li>)}</ul><a href="mailto:info@b2w-ai.com?subject=Get%20started%20with%20JasonAI%20Free" className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f4b28c] px-6 py-3 font-semibold text-[#14110f]">Get started free <ArrowRight className="h-4 w-4" /></a><p className="mt-4 text-center text-[10px] text-white/30">Subject to fit and early-access availability.</p></div></div>
        </section> : null}

        {page === 'faq' ? <section id="faq" className="border-t border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8"><p className="text-sm font-semibold text-[#a24321]">FAQs</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">What contractors usually ask first.</h2><div className="mt-12 overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/76">{faqItems.map(([question, answer], index) => { const open = activeFaq === index; return <div key={question} className="border-b border-slate-950/10 last:border-0"><button type="button" onClick={() => setActiveFaq(open ? -1 : index)} aria-expanded={open} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"><span className="text-base font-semibold sm:text-lg">{question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="max-w-3xl px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{answer}</p></div></div></div>; })}</div></div>
        </section> : null}

        <section className="bg-[#14110f] px-5 py-24 text-center text-white sm:py-32"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold text-[#f4b28c]">Your business is already talking.</p><h2 className="mx-auto mt-4 text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[.95] tracking-[-.052em]">Give it an assistant that can keep up.</h2><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><a href="mailto:info@b2w-ai.com?subject=Try%20JasonAI%20Free" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f4b28c] px-6 py-3 font-semibold text-[#14110f]">Try JasonAI free <ArrowRight className="h-4 w-4" /></a><a href="mailto:info@b2w-ai.com?subject=Talk%20to%20B2W" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/16 px-6 py-3 font-semibold text-white">Talk to B2W <ArrowRight className="h-4 w-4" /></a></div></div></section>
      </main>

      <V4Footer />
    </div>
  );
}
