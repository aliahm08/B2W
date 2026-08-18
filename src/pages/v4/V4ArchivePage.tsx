import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  CircleDollarSign,
  ClipboardList,
  FileChartColumn,
  FileSpreadsheet,
  FileText,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Radio,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Upload,
  UsersRound,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
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

const solutionSections = [
  {
    slug: 'project-coordination',
    label: 'Project coordination',
    title: 'Keep decisions, commitments, and next steps connected.',
    body: 'JasonAI can follow the information already moving between the office, field, client, and vendors so people spend less time repeating status and reconstructing what happened.',
    features: ['Summarize recent project activity', 'Surface unanswered questions and commitments', 'Draft accurate owner and team updates'],
    prompt: 'What changed on Maple Street this week, and what still needs an owner?',
    result: 'A sourced summary with decisions, open items, owners, and deadlines.',
    icon: MessageCircle,
    accent: '#25D366',
  },
  {
    slug: 'estimating',
    label: 'Estimating',
    title: 'Move from scattered scope to a reviewed estimate draft.',
    body: 'Bring together conversations, drawings, supplier information, and existing company formats before the estimate is prepared for human review.',
    features: ['Extract scope from chats and documents', 'Identify allowances, exclusions, and missing information', 'Draft estimates in your existing structure'],
    prompt: 'Update the estimate for limestone, two extra field days, and the revised supplier price.',
    result: 'A draft revision with the changed scope, price impact, and items requiring confirmation.',
    icon: FileText,
    accent: '#f4b28c',
  },
  {
    slug: 'field-information',
    label: 'Field information',
    title: 'Make job-site information useful beyond the moment it was sent.',
    body: 'Photos, drawings, voice notes, and site updates can become searchable project context instead of disappearing into a message thread.',
    features: ['Summarize voice notes and daily updates', 'Review photos and drawings alongside project context', 'Surface changes, risks, and follow-up work'],
    prompt: 'Compare today’s site note and photos with the approved drawing. What needs attention?',
    result: 'A concise field review with observed differences, risks, and recommended follow-ups.',
    icon: Camera,
    accent: '#a9c7a8',
  },
] as const;

const useCases = [
  ['client-communication', 'Client communication', 'Draft responses and project updates from actual project context.', Send],
  ['operations', 'Operations', 'Create SOPs, checklists, and internal documentation.', ClipboardList],
  ['financial-review', 'Financial review', 'Analyze spreadsheets, invoices, budgets, and project performance.', FileSpreadsheet],
] as const;

const faqItems = [
  ['Is JasonAI just ChatGPT in WhatsApp?', 'No. General-purpose AI starts with the information you provide. JasonAI is designed to work with the ongoing information generated by your projects and business.'],
  ['Do I need to change how my team works?', 'No. JasonAI is designed to work through communication channels and tools your team already uses.'],
  ['What can JasonAI read?', 'Only the information and channels you explicitly connect or provide.'],
  ['Does my team need another app?', 'Not necessarily. JasonAI can operate directly through existing communication channels such as WhatsApp.'],
  ['Can JasonAI create estimates and proposals?', 'Yes. JasonAI can generate draft documents using the business and project information provided to it, with human review before use.'],
  ['Can JasonAI take actions automatically?', 'Agent capabilities are under development. Current answers, documents, and analysis remain separate from future approved actions.'],
  ['How much does it cost?', 'JasonAI can currently be started for free through the current early-access offer.'],
] as const;

const BOOK_DEMO_URL = 'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=b24a24';
const HERO_HANDOFF_DURATION = 1.05;
const HERO_HANDOFF_EASE = [0.22, 1, 0.36, 1] as const;
const communicationChannels = [
  { label: 'Texts / SMS', detail: 'Clients + crews', icon: MessageCircle, tone: '#8fbd9b' },
  { label: 'Phone calls', detail: 'Calls + transcripts', icon: Phone, tone: '#f4b28c' },
  { label: 'Email', detail: 'Inbox + attachments', icon: Mail, tone: '#a9c7a8' },
  { label: 'WhatsApp groups', detail: 'Project conversations', icon: Radio, tone: '#25D366' },
  { label: 'Other channels', detail: 'Files + connected tools', icon: MoreHorizontal, tone: '#c5a36a' },
] as const;

const rawCommunicationLog = [
  { time: '08:42:17', message: 'Owner approved the lobby limestone.', status: 'decision', from: 'Sarah Kim', role: 'Owner', channel: 'Text / SMS', project: '214 King' },
  { time: '09:16:04', message: 'Supplier revision adds $2,840.', status: 'cost', from: 'Capital Stone', role: 'Supplier', channel: 'Email', project: '214 King' },
  { time: '10:03:51', message: 'Field lead says the finish adds two install days.', status: 'schedule', from: 'Malik Thompson', role: 'Field lead', channel: 'Phone call', project: '214 King' },
  { time: '11:08:29', message: 'Project manager asks who is updating the owner.', status: 'action', from: 'Elena Brooks', role: 'Project manager', channel: 'WhatsApp', project: 'Harbor Dental' },
  { time: '11:42:10', message: 'Change-order template uploaded to the project folder.', status: 'file', from: 'Google Drive', role: 'Connected source', channel: 'File upload', project: '214 King' },
  { time: '12:07:33', message: 'Crew can start revised work on Thursday.', status: 'update', from: 'Luis Ortega', role: 'Superintendent', channel: 'WhatsApp', project: 'Pinecrest Offices' },
  { time: '12:18:09', message: 'Client requested the revised total before 3 PM.', status: 'request', from: 'Sarah Kim', role: 'Owner', channel: 'Text / SMS', project: 'Easton Retail' },
  { time: '12:31:44', message: 'Limestone lead time confirmed at five business days.', status: 'supply', from: 'Capital Stone', role: 'Supplier', channel: 'Email', project: '214 King' },
  { time: '12:46:20', message: 'Malik assigned to coordinate site access.', status: 'owner', from: 'Luis Ortega', role: 'Superintendent', channel: 'Phone call', project: 'Harbor Dental' },
  { time: '13:02:58', message: 'Updated reflected-ceiling sketch added.', status: 'file', from: 'Ana Ruiz', role: 'Designer', channel: 'File upload', project: 'Pinecrest Offices' },
  { time: '13:17:12', message: 'Thursday delivery window accepted by the site team.', status: 'confirmed', from: 'Malik Thompson', role: 'Field lead', channel: 'WhatsApp', project: '214 King' },
  { time: '13:29:36', message: 'Owner update is ready for review.', status: 'review', from: 'Elena Brooks', role: 'Project manager', channel: 'Email', project: 'Easton Retail' },
] as const;

const NAV_SECTION_IDS = [
  'overview',
  'capabilities',
  'agents',
  'how-it-works',
  'project-example',
  'control',
  'use-cases',
  'project-coordination',
  'estimating',
  'field-information',
  'client-communication',
  'operations',
  'financial-review',
  'why-jasonai',
  'pricing',
  'faq',
] as const;

function V4Header({ basePath }: { basePath: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<(typeof NAV_SECTION_IDS)[number]>('overview');
  const [heroMinimal, setHeroMinimal] = useState(true);
  const { pathname } = useLocation();
  const homePath = basePath || '/';
  const anchor = (id: string) => `${homePath}#${id}`;

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      setHeroMinimal(window.scrollY < 40);
      const readingLine = window.innerHeight * .38;
      let currentSection: (typeof NAV_SECTION_IDS)[number] = 'overview';

      for (const id of NAV_SECTION_IDS) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= readingLine) currentSection = id;
        else break;
      }

      setActiveSection((current) => current === currentSection ? current : currentSection);
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [pathname]);

  const navigation = [
    {
      label: 'Overview',
      href: anchor('capabilities'),
      activeSections: ['overview', 'capabilities', 'agents', 'how-it-works', 'project-example', 'control'],
      items: [
        ['Overview', anchor('capabilities'), 'See what JasonAI can understand, create, and review.'],
        ['How it works', anchor('how-it-works'), 'Connect project context, ask naturally, and review the result.'],
        ['Project example', anchor('project-example'), 'Follow information across one working week.'],
        ['Security & control', anchor('control'), 'Choose what the assistant can access.'],
      ],
    },
    {
      label: 'Examples',
      href: anchor('use-cases'),
      activeSections: ['use-cases', 'project-coordination', 'estimating', 'field-information', 'client-communication', 'operations', 'financial-review'],
      items: [
        ['Example overview', anchor('use-cases'), 'Start with the work contractors handle every day.'],
        ['Project coordination', anchor('project-coordination'), 'Decisions, commitments, and open items.'],
        ['Estimating', anchor('estimating'), 'Turn scope and context into drafts.'],
        ['Field information', anchor('field-information'), 'Review drawings, photos, and updates.'],
      ],
    },
    { label: 'Why JasonAI', href: anchor('why-jasonai'), activeSections: ['why-jasonai'] },
  ] as const;
  const pricingActive = activeSection === 'pricing' || activeSection === 'faq';

  useEffect(() => {
    if (heroMinimal) {
      setMenuOpen(false);
      setOpenDropdown(null);
    }
  }, [heroMinimal]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-500 sm:px-5 ${heroMinimal ? 'pt-7 sm:pt-8' : 'pt-3'}`}>
      <div className={`mx-auto flex items-center rounded-full border border-white/12 bg-[#14110f]/78 text-white shadow-[0_16px_50px_rgba(0,0,0,.16)] backdrop-blur-2xl transition-[height,max-width,padding] duration-500 ${heroMinimal ? 'h-12 max-w-[13.5rem] justify-center px-3' : 'h-16 max-w-7xl justify-between px-4 sm:px-5'}`}>
        <Link to={homePath} aria-label="JasonAI by B2W home" className="inline-flex items-center gap-2.5"><B2WIcon title="" className="h-9 w-10 text-white sm:h-8 sm:w-9" /><span className="hidden whitespace-nowrap text-sm font-semibold tracking-[-.03em] sm:inline sm:text-base"><DescrambleText text="JasonAI" autoRepeatInterval={11000} /> <span className="font-normal text-white/48">by</span> B2W</span></Link>
        {!heroMinimal ? <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const active = (item.activeSections as readonly string[]).includes(activeSection);
            if (!('items' in item)) {
              return <Link key={item.label} to={item.href} aria-current={active ? 'location' : undefined} className={`rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/7 hover:text-white ${active ? 'bg-white/8 text-[#f4b28c]' : 'text-white/62'}`}><DescrambleText text={item.label} /></Link>;
            }
            const open = openDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenDropdown(null); }}
              >
                <Link to={item.href} aria-current={active ? 'location' : undefined} aria-haspopup="true" aria-expanded={open} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/7 hover:text-white ${active ? 'bg-white/8 text-[#f4b28c]' : 'text-white/62'}`} onFocus={() => setOpenDropdown(item.label)} onClick={() => setOpenDropdown(null)}>
                  <DescrambleText text={item.label} /><ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
                </Link>
                <div className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                  <div className="rounded-[1.35rem] border border-white/12 bg-[#14110f]/96 p-2 shadow-[0_24px_70px_rgba(0,0,0,.38)] backdrop-blur-2xl">
                    {item.items.map(([label, href, description]) => <Link key={label} to={href} onClick={() => setOpenDropdown(null)} className="group block rounded-2xl px-4 py-3 transition hover:bg-white/7"><DescrambleText text={label} className="block text-sm font-semibold text-white/88 group-hover:text-white" /><span className="mt-1 block text-xs leading-5 text-white/38">{description}</span></Link>)}
                  </div>
                </div>
              </div>
            );
          })}
        </nav> : null}
        {!heroMinimal ? <div className="flex items-center gap-2">
          <Link to={anchor('pricing')} aria-current={pricingActive ? 'location' : undefined} className={`hidden min-h-10 items-center justify-center rounded-full px-3 text-sm font-medium transition hover:bg-white/7 hover:text-white lg:inline-flex ${pricingActive ? 'bg-white/8 text-[#f4b28c]' : 'text-white/58'}`}><DescrambleText text="Pricing" /></Link>
          <a href={BOOK_DEMO_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#f4b28c] px-4 text-sm font-semibold text-[#14110f] transition hover:bg-[#ffd9c0]"><DescrambleText text="Book demo" /></a>
          <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div> : null}
      </div>
      {!heroMinimal && menuOpen ? <nav aria-label="Mobile primary navigation" className="mx-auto mt-2 max-h-[calc(100vh-6.5rem)] max-w-7xl overflow-y-auto rounded-[1.5rem] border border-white/12 bg-[#14110f]/95 p-3 text-white shadow-2xl backdrop-blur-2xl lg:hidden">{navigation.map((item) => { const active = (item.activeSections as readonly string[]).includes(activeSection); return <div key={item.label} className="border-b border-white/8 py-2"><Link to={item.href} aria-current={active ? 'location' : undefined} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/8 hover:text-white ${active ? 'bg-white/8 text-[#f4b28c]' : 'text-white/82'}`}><DescrambleText text={item.label} /></Link>{'items' in item ? <div className="grid pl-3">{item.items.slice(1).map((subitem) => <Link key={subitem[0]} to={subitem[1]} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2 text-xs text-white/48 hover:bg-white/8 hover:text-white"><DescrambleText text={subitem[0]} /></Link>)}</div> : null}</div>; })}<Link to={anchor('pricing')} aria-current={pricingActive ? 'location' : undefined} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/8 ${pricingActive ? 'bg-white/8 text-[#f4b28c]' : 'text-white/82'}`}><DescrambleText text="Pricing" /></Link></nav> : null}
    </header>
  );
}

function V4Footer({ basePath }: { basePath: string }) {
  const homePath = basePath || '/';
  const anchor = (id: string) => `${homePath}#${id}`;
  const groups = [
    ['Product', [['JasonAI', anchor('capabilities')], ['Capabilities', anchor('capabilities')], ['How it works', anchor('how-it-works')], ['Pricing', anchor('pricing')], ['Agent capabilities', anchor('agents')]]],
    ['Examples', [['Project coordination', anchor('project-coordination')], ['Estimating', anchor('estimating')], ['Operations', anchor('operations')], ['Field information', anchor('field-information')]]],
    ['Company', [['Why JasonAI', anchor('why-jasonai')], ['Contact', 'mailto:info@b2w-ai.com'], ['Privacy', anchor('control')], ['Terms', 'mailto:info@b2w-ai.com?subject=JasonAI%20terms']]],
    ['Resources', [['Project demo', anchor('project-example')], ['Economic model', anchor('why-jasonai')], ['FAQs', anchor('faq')]]],
  ] as const;

  return (
    <footer className="bg-[#08090a] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><Link to={homePath} className="inline-flex items-center gap-3"><B2WIcon title="" className="h-10 w-11" /><span className="text-xl font-semibold">B2W</span></Link><p className="mt-5 max-w-sm text-sm leading-7 text-white/50">We build tools that reduce the cost of communication for project-driven businesses.</p><p className="mt-4 text-sm text-white/38">Washington, DC</p></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{groups.map(([title, links]) => <div key={title}><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">{title}</p><ul className="mt-4 space-y-2.5">{links.map(([label, href]) => <li key={label}>{href.startsWith('mailto:') ? <a href={href} className="text-sm text-white/52 transition hover:text-white"><DescrambleText text={label} /></a> : <Link to={href} className="text-sm text-white/52 transition hover:text-white"><DescrambleText text={label} /></Link>}</li>)}</ul></div>)}</div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/32 sm:flex-row"><p>© 2026 B2W LLC</p><p>Privacy · Terms</p></div>
      </div>
    </footer>
  );
}

function ContractorFlowBackground() {
  const reduceMotion = useReducedMotion();
  const signalTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 4.6, repeat: Infinity, ease: 'linear' as const };

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ delay: .04, duration: .48, ease: HERO_HANDOFF_EASE }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[30rem] w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden"
    >
      <svg viewBox="0 0 1200 480" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hero-signal-inbound" x1="0" x2="1">
            <stop offset="0" stopColor="#25D366" stopOpacity=".06" />
            <stop offset=".72" stopColor="#f4b28c" stopOpacity=".55" />
            <stop offset="1" stopColor="#f4b28c" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id="hero-signal-inbound-reverse" x1="1" x2="0">
            <stop offset="0" stopColor="#a9c7a8" stopOpacity=".06" />
            <stop offset=".72" stopColor="#f4b28c" stopOpacity=".55" />
            <stop offset="1" stopColor="#f4b28c" stopOpacity=".95" />
          </linearGradient>
          <radialGradient id="hero-node-glow">
            <stop offset="0" stopColor="#f4b28c" stopOpacity=".24" />
            <stop offset="1" stopColor="#f4b28c" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d="M78 62C288 62 438 172 600 240" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1.3" />
        <path d="M102 430C322 430 458 330 600 240" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1.3" />
        <path d="M1122 62C912 62 762 172 600 240" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1.3" />
        <path d="M1098 430C878 430 742 330 600 240" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1.3" />

        <motion.path d="M78 62C288 62 438 172 600 240M102 430C322 430 458 330 600 240" fill="none" stroke="url(#hero-signal-inbound)" strokeWidth="2.2" strokeLinecap="round" pathLength="1" strokeDasharray=".022 .14" animate={reduceMotion ? undefined : { strokeDashoffset: [0, -1] }} transition={signalTransition} />
        <motion.path d="M1122 62C912 62 762 172 600 240M1098 430C878 430 742 330 600 240" fill="none" stroke="url(#hero-signal-inbound-reverse)" strokeWidth="2.2" strokeLinecap="round" pathLength="1" strokeDasharray=".022 .14" animate={reduceMotion ? undefined : { strokeDashoffset: [0, -1] }} transition={signalTransition} />

        {!reduceMotion ? <>
          <circle r="4" fill="#f4b28c"><animateMotion dur="3.2s" repeatCount="indefinite" path="M78 62C288 62 438 172 600 240" /><animate attributeName="opacity" values="0;1;1;0" dur="3.2s" repeatCount="indefinite" /></circle>
          <circle r="4" fill="#f4b28c"><animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite" path="M1122 62C912 62 762 172 600 240" /><animate attributeName="opacity" values="0;1;1;0" dur="3.2s" begin="1.6s" repeatCount="indefinite" /></circle>
          <circle r="3.5" fill="#a9c7a8"><animateMotion dur="3.8s" begin=".8s" repeatCount="indefinite" path="M102 430C322 430 458 330 600 240" /><animate attributeName="opacity" values="0;1;1;0" dur="3.8s" begin=".8s" repeatCount="indefinite" /></circle>
          <circle r="3.5" fill="#f4b28c"><animateMotion dur="3.8s" begin="2.7s" repeatCount="indefinite" path="M1098 430C878 430 742 330 600 240" /><animate attributeName="opacity" values="0;1;1;0" dur="3.8s" begin="2.7s" repeatCount="indefinite" /></circle>
        </> : null}

        <circle cx="600" cy="240" r="118" fill="url(#hero-node-glow)" />
        <motion.circle cx="600" cy="240" r="62" fill="none" stroke="#f4b28c" strokeOpacity=".28" strokeWidth="1" style={{ transformOrigin: '600px 240px' }} animate={reduceMotion ? undefined : { scale: [.77, 1.26], opacity: [.5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }} />
      </svg>
    </motion.div>
  );
}

function CommunicationChannelStreams({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative isolate mx-auto w-full max-w-3xl pb-14">
      <svg aria-hidden="true" viewBox="0 0 1000 138" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 z-0 h-28 w-full overflow-visible drop-shadow-[0_0_8px_rgba(244,178,140,.16)]">
        {[100, 300, 500, 700, 900].map((x, index) => {
          const path = `M${x} 0 C${x} 48 ${500 + (x - 500) * .15} 68 500 138`;
          const tone = communicationChannels[index].tone;
          return <g key={x}>
            <path d={path} fill="none" stroke="white" strokeOpacity=".12" strokeWidth="3" />
            <motion.path d={path} fill="none" stroke={tone} strokeLinecap="round" strokeWidth="1.45" animate={reduceMotion ? { strokeOpacity: .48 } : { strokeOpacity: [.24, .7, .24] }} transition={{ duration: 2.2, delay: index * .16, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.circle r="4.5" fill={tone} animate={reduceMotion ? undefined : { cx: [x, x + (500 - x) * .56, 500], cy: [0, 67, 136], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.75, delay: index * .24, repeat: Infinity, ease: 'linear' }} />
          </g>;
        })}
        <path d="M500 126V146" stroke="#f4b28c" strokeOpacity=".9" strokeWidth="1.5" />
        <circle cx="500" cy="134" r="8" fill="none" stroke="#f4b28c" strokeOpacity=".2" />
      </svg>
      <div className="relative z-20 grid grid-cols-5 gap-1.5">
        {communicationChannels.map(({ label, icon: Icon, tone }, index) => <div key={label} className="relative z-20 flex min-w-0 flex-col items-center"><motion.span animate={reduceMotion ? undefined : { boxShadow: [`0 0 0 0 ${tone}00`, `0 0 0 6px ${tone}18`, `0 0 0 0 ${tone}00`] }} transition={{ duration: 2.1, delay: index * .28, repeat: Infinity }} className="relative z-20 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-[#101310] shadow-[0_0_0_5px_rgba(16,19,16,.9)]" style={{ color: tone }}><Icon className="h-4 w-4" /></motion.span><span className="relative z-20 mt-2 hidden max-w-full truncate bg-[#14110f]/88 px-1 text-center font-mono text-[7px] uppercase tracking-[.1em] text-white/58 sm:block">{label}</span></div>)}
      </div>
    </div>
  );
}

function CommunicationStreamCTA({ onActivate }: { onActivate: () => void }) {
  return <div className="relative isolate mx-auto mt-8 w-full max-w-4xl"><ContractorFlowBackground /><button type="button" onClick={onActivate} className="group relative z-20 mx-auto flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#ffd9c0]/45 bg-[#f4b28c] px-7 py-3.5 text-base font-semibold text-[#14110f] shadow-[0_18px_60px_rgba(244,178,140,.24)] transition hover:bg-[#ffd9c0] sm:text-lg"><DescrambleText text="Turn this into useful work" /> <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button></div>;
}

function CommunicationLogStageCopy({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.header
      initial={reduceMotion ? undefined : { opacity: .42, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : .52, ease: HERO_HANDOFF_EASE }}
      className="relative z-30 mx-auto mb-6 max-w-2xl px-3 text-center before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#14110f] sm:mb-8"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#f4b28c]">The communication layer</p>
      <h2 className="mx-auto mt-3 max-w-[20ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[.98] tracking-[-.05em]">Every conversation becomes a project record.</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/48 sm:text-base sm:leading-7">JasonAI keeps each signal connected to its source, so missed information becomes clear context your team can use.</p>
    </motion.header>
  );
}

function LiveCommunicationTerminal({ reduceMotion, feedOffset }: { reduceMotion: boolean | null; feedOffset: number }) {
  const visibleEvents = Array.from({ length: 6 }, (_, slot) => {
    const sequence = feedOffset + slot;
    return { ...rawCommunicationLog[sequence % rawCommunicationLog.length], sequence };
  });

  return (
    <motion.div key="live-terminal" initial={reduceMotion ? undefined : { opacity: .5, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ delay: reduceMotion ? 0 : .14, duration: reduceMotion ? 0 : .64, ease: HERO_HANDOFF_EASE }} className="relative min-h-[31rem] overflow-hidden rounded-[1.6rem] bg-[#050806] px-5 pb-5 pt-6 text-white shadow-[0_35px_100px_rgba(0,0,0,.48)] sm:px-8 sm:pb-8">
      <div className="mx-auto flex max-w-3xl items-end justify-between gap-4 border-b border-white/18 pb-4"><div><p className="font-mono text-[8px] uppercase tracking-[.18em] text-[#9fc2a2]">All-project communication</p><p className="mt-1.5 text-sm font-semibold text-white">RB Contracting</p></div><span className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.12em] text-white/62"><span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-[#8fbd9b] opacity-60" /><span className="relative h-1.5 w-1.5 rounded-full bg-[#8fbd9b]" /></span>Receiving</span></div>
      <div className="mx-auto max-w-3xl overflow-hidden">
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleEvents.map(({ time, message, channel, sequence }) => <motion.div key={sequence} data-log-event layout={!reduceMotion} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -26 }} transition={{ duration: reduceMotion ? .12 : .48, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-[3.6rem_minmax(0,1fr)] items-start border-b border-white/10 py-4 font-mono text-[10px] leading-5 sm:grid-cols-[4.6rem_minmax(0,1fr)_5.5rem] sm:text-[11px]">
                <span className="text-[#9fc2a2]">{time.slice(0, 5)}</span><span className="pr-3 font-medium text-white/90"><span className="mr-2 text-[#f4b28c]">›</span>{message}</span><span className="hidden whitespace-nowrap text-right text-[7px] uppercase tracking-[.07em] text-[#9fc2a2]/78 sm:block">{channel}</span>
              </motion.div>)}
            </AnimatePresence>
            <motion.div animate={reduceMotion ? undefined : { opacity: [.45, 1, .45] }} transition={{ duration: 1.8, repeat: Infinity }} className="grid grid-cols-[3.6rem_minmax(0,1fr)] py-4 font-mono text-[10px] sm:grid-cols-[4.6rem_minmax(0,1fr)] sm:text-[11px]"><span className="text-[#9fc2a2]">LIVE</span><span className="text-white/58"><span className="mr-2 text-[#f4b28c]">›</span>Waiting for the next communication<span className="ml-1 inline-block h-3 w-1 animate-pulse bg-[#9fc2a2] align-middle" /></span></motion.div>
          </div>
          <footer data-log-counter={feedOffset + 6} className="flex flex-wrap items-center justify-between gap-2 border-t border-white/18 pt-3 font-mono text-[8px] uppercase tracking-[.12em] text-white/38"><span>Event {String(feedOffset + 6).padStart(3, '0')} retained</span><span className="text-[#9fc2a2]">Next item in a few seconds</span></footer>
      </div>
    </motion.div>
  );
}

function CleanedCommunicationTable({ reduceMotion, feedOffset }: { reduceMotion: boolean | null; feedOffset: number }) {
  const visibleEvents = Array.from({ length: 6 }, (_, slot) => {
    const sequence = feedOffset + slot;
    return { ...rawCommunicationLog[sequence % rawCommunicationLog.length], sequence };
  });

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <motion.header initial={reduceMotion ? undefined : { opacity: .45, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .55, ease: HERO_HANDOFF_EASE }} className="mx-auto mb-7 max-w-2xl px-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9fc2a2]">The organized project record</p>
        <h2 className="mt-3 text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[.98] tracking-[-.05em]">The same stream, cleaned and connected.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/52 sm:text-base sm:leading-7">JasonAI clarifies each message, then adds the people, source, project, and project signal your team needs to act.</p>
      </motion.header>

      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#f4f6f1] text-[#172019] shadow-[0_35px_100px_rgba(0,0,0,.42)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8ddd5] bg-white px-5 py-4 sm:px-6">
          <div><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[#4f7f52]">All-project communication register</p><p className="mt-1 text-sm font-semibold">RB Contracting</p></div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3ede0] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[.1em] text-[#315e3a]"><span className="h-1.5 w-1.5 rounded-full bg-[#4f7f52]" />6 records linked</span>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-[4.5rem_9rem_7.5rem_7.5rem_minmax(0,1fr)_6rem] gap-3 border-b border-[#d8ddd5] bg-[#e9ede6] px-5 py-3 font-mono text-[7px] font-semibold uppercase tracking-[.12em] text-black/38">
            <span>Time</span><span>From</span><span>Channel</span><span>Project</span><span>Message</span><span>Type</span>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            {visibleEvents.map(({ time, from, role, channel, project, message, status, sequence }, index) => (
              <motion.div key={sequence} layout={!reduceMotion} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? .1 : .4, delay: reduceMotion ? 0 : index * .025 }} className="grid grid-cols-[4.5rem_9rem_7.5rem_7.5rem_minmax(0,1fr)_6rem] items-center gap-3 border-b border-[#d8ddd5] bg-white px-5 py-3.5 last:border-0">
                <span className="font-mono text-[9px] text-[#4f7f52]">{time.slice(0, 5)}</span>
                <span className="min-w-0"><strong className="block truncate text-[10px] font-semibold">{from}</strong><small className="mt-0.5 block truncate text-[7px] text-black/38">{role}</small></span>
                <span className="text-[9px] text-black/54">{channel}</span>
                <span className="text-[9px] font-medium text-black/58">{project}</span>
                <span className="text-[10px] leading-4 text-black/72">{message}</span>
                <span className="w-fit rounded-full bg-[#edf1ea] px-2 py-1 font-mono text-[7px] uppercase tracking-[.06em] text-[#315e3a]">{status}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="divide-y divide-[#d8ddd5] md:hidden">
          {visibleEvents.map(({ time, from, role, channel, project, message, status, sequence }, index) => (
            <motion.article key={sequence} initial={reduceMotion ? undefined : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * .04 }} className="bg-white p-5">
              <div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] text-[#4f7f52]">{time.slice(0, 5)}</span><span className="rounded-full bg-[#edf1ea] px-2 py-1 font-mono text-[7px] uppercase tracking-[.06em] text-[#315e3a]">{status}</span></div>
              <div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold">{from}</p><p className="mt-0.5 text-[9px] text-black/40">{role}</p></div><p className="text-right text-[9px] text-black/42">{channel}<br />{project}</p></div>
              <p className="mt-3 border-t border-[#e4e8e1] pt-3 text-[11px] leading-5 text-black/72">{message}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountabilityDashboard({ reduceMotion, showLog }: { reduceMotion: boolean | null; showLog: () => void }) {
  type DashboardScreen = 'accountability' | 'projects' | 'performance' | 'log' | 'settings' | 'help';
  const [activeScreen, setActiveScreen] = useState<DashboardScreen>('accountability');
  const [messageQuery, setMessageQuery] = useState('');
  const [searchSummary, setSearchSummary] = useState('Search every approved message, call, email, and project update.');
  const [enabledSources, setEnabledSources] = useState(['Email', 'Texts / SMS', 'Phone calls', 'WhatsApp']);
  const projects = [
    {
      name: '214 King Street', client: 'King Street Holdings', owner: 'Elena Park', status: 'Attention needed',
      detail: 'Change order CO-014 is approved in messages but still needs an accountable owner.', update: 'Client email · 18 min ago',
      tone: 'border-[#e7c9bb] bg-[#fff7f2]', badge: 'bg-[#f1ddd2] text-[#963b24]', bar: 'bg-[#bf5a38]',
      measures: [['Schedule', 68], ['Decisions', 42], ['Actions', 36]],
    },
    {
      name: 'Harbor Dental', client: 'Harbor Dental Group', owner: 'Malik Reed', status: 'Needs review',
      detail: 'Thursday access is unconfirmed. The field team is waiting before locking the schedule.', update: 'Phone call · 31 min ago',
      tone: 'border-[#dfd2a9] bg-[#fffdf3]', badge: 'bg-[#f0e4bd] text-[#75570f]', bar: 'bg-[#c79b29]',
      measures: [['Schedule', 54], ['Decisions', 72], ['Actions', 58]],
    },
    {
      name: 'Easton Retail', client: 'Easton Retail Partners', owner: 'Avery Cole', status: 'On track',
      detail: 'The revised client total was sent. Finish selections and delivery dates are confirmed.', update: 'Text message · 46 min ago',
      tone: 'border-[#cbdac8] bg-[#f6faf4]', badge: 'bg-[#dce9dc] text-[#315e3a]', bar: 'bg-[#56825a]',
      measures: [['Schedule', 84], ['Decisions', 92], ['Actions', 78]],
    },
    {
      name: 'Linden Offices', client: 'Linden Property Co.', owner: 'Jordan Ellis', status: 'On track',
      detail: 'Inspection passed and closeout photos are linked. Final owner update is queued.', update: 'Photo upload · 1 hr ago',
      tone: 'border-[#d5ddd2] bg-white', badge: 'bg-[#dce9dc] text-[#315e3a]', bar: 'bg-[#56825a]',
      measures: [['Schedule', 94], ['Decisions', 88], ['Actions', 86]],
    },
  ] as const;
  const accountabilityViews: Array<{ id: DashboardScreen; label: string; icon: typeof ClipboardList }> = [
    { id: 'accountability', label: 'Accountability', icon: ShieldCheck },
    { id: 'projects', label: 'Projects', icon: ClipboardList },
    { id: 'performance', label: 'Performance', icon: UsersRound },
    { id: 'log', label: 'Information log', icon: SquareTerminal },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: CircleHelp },
  ];

  const screenMeta: Record<DashboardScreen, { eyebrow: string; title: string; description: string }> = {
    accountability: { eyebrow: 'RB Contracting / owner overview', title: 'Accountability', description: 'Actions, risks, and the questions worth asking right now.' },
    projects: { eyebrow: 'RB Contracting / project portfolio', title: 'Projects', description: 'Every project, its current health, and the communication behind it.' },
    performance: { eyebrow: 'RB Contracting / service delivery', title: 'Team & service performance', description: 'See delivery health without turning activity into surveillance.' },
    log: { eyebrow: 'RB Contracting / communication record', title: 'Information log', description: 'The source-linked record across every approved communication channel.' },
    settings: { eyebrow: 'RB Contracting / workspace controls', title: 'Settings', description: 'Control sources, permissions, notifications, and review rules.' },
    help: { eyebrow: 'RB Contracting / support', title: 'Help center', description: 'Get answers, learn the workspace, or reach the B2W team.' },
  };

  const searchMessages = () => {
    const query = messageQuery.trim();
    if (!query) return;
    setSearchSummary(`Found 8 related messages across 3 projects for “${query}”. Most recent: Harbor Dental phone call, 31 minutes ago.`);
  };

  return (
    <motion.div key="accountability-dashboard" initial={reduceMotion ? undefined : { opacity: .4, y: 10, scale: .995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: reduceMotion ? 0 : .3, ease: [0.22, 1, 0.36, 1] }} className="min-h-[38rem] bg-[#eef1ec] text-[#172019]">
      <div className="flex min-h-[38rem] flex-col lg:grid lg:grid-cols-[9rem_1fr]">
        <aside className="flex border-b border-white/10 bg-[#101713] lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-r border-white/10 px-3 py-3 lg:border-b lg:border-r-0 lg:px-4"><span className="grid h-7 w-7 place-items-center bg-[#dfe9d8] text-[#17321f]"><Sparkles className="h-3.5 w-3.5" /></span><div className="hidden lg:block"><p className="text-[10px] font-semibold text-white">RB Contracting</p><p className="font-mono text-[6px] uppercase tracking-[.14em] text-[#9fc2a2]">Owner workspace</p></div></div>
          <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto p-1.5 lg:block lg:space-y-1 lg:overflow-visible lg:p-2.5">{accountabilityViews.map(({ id, label, icon: Icon }) => {
            const active = activeScreen === id;
            return <button key={id} type="button" onClick={() => setActiveScreen(id)} className={`flex min-h-9 shrink-0 items-center justify-center gap-1.5 px-2.5 text-[7px] font-semibold transition sm:text-[8px] lg:w-full lg:justify-start lg:px-3 ${active ? 'bg-[#dfe9d8] text-[#17321f]' : 'text-white/42 hover:bg-white/[.05] hover:text-white'}`}><Icon className={`h-3.5 w-3.5 ${active ? 'text-[#4f7f52]' : 'text-[#9fc2a2]/55'}`} /><span className="whitespace-nowrap">{label}</span></button>;
          })}</nav>
          <div className="hidden border-t border-white/10 p-3 lg:block"><p className="flex items-center gap-2 font-mono text-[7px] uppercase text-[#9fc2a2]"><span className="h-1.5 w-1.5 rounded-full bg-[#8fbd9b]" />All projects live</p><p className="mt-2 text-[7px] leading-4 text-white/28">Every action and risk stays linked to its communication source.</p></div>
        </aside>

        <main className="relative min-w-0 p-3 pb-32 sm:p-4 sm:pb-32 lg:p-5 lg:pb-32">
          <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[7px] uppercase tracking-[.16em] text-[#4f7f52]">{screenMeta[activeScreen].eyebrow}</p><h2 className="mt-1.5 text-xl font-semibold tracking-[-.04em] sm:text-2xl">{screenMeta[activeScreen].title}</h2><p className="mt-1 text-[9px] text-black/42">{screenMeta[activeScreen].description}</p></div><button type="button" onClick={activeScreen === 'log' ? showLog : () => setActiveScreen('log')} className="inline-flex min-h-9 items-center gap-2 border border-black/10 bg-white px-3 text-[8px] font-semibold text-black/48 transition hover:border-[#4f7f52]/35 hover:text-[#315e3a]"><SquareTerminal className="h-3.5 w-3.5" />{activeScreen === 'log' ? 'Watch live intake' : 'Open information log'}</button></header>

          {activeScreen === 'projects' ? <>
          <section className="mt-4 grid grid-cols-2 gap-px border border-[#d7dcd6] bg-[#d7dcd6] sm:grid-cols-4">{[
            ['Active projects', '12', '$1.8m contracted'], ['Attention needed', '2', 'Cost · access'], ['Open decisions', '5', '2 owner approvals'], ['On track', '10', '83% of portfolio'],
          ].map(([label, value, detail], index) => <motion.div key={label} initial={reduceMotion ? undefined : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + index * .06 }} className="bg-white p-3"><p className="text-[7px] font-semibold uppercase tracking-[.12em] text-black/32">{label}</p><p className={`mt-2 font-mono text-lg font-semibold ${index === 1 ? 'text-[#a24321]' : 'text-[#172019]'}`}>{value}</p><p className="mt-1 text-[7px] text-black/36">{detail}</p></motion.div>)}</section>

          <section className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {projects.map((project, index) => <motion.button key={project.name} type="button" initial={reduceMotion ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14 + index * .06 }} className={`group min-w-0 border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(23,32,25,.08)] ${project.tone}`}>
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[11px] font-semibold">{project.name}</p><p className="mt-1 truncate text-[7px] text-black/36">{project.client} · {project.owner}</p></div><span className={`shrink-0 px-2 py-1 font-mono text-[6px] font-semibold uppercase tracking-[.06em] ${project.badge}`}>{project.status}</span></div>
              <p className="mt-3 line-clamp-2 min-h-8 text-[8px] leading-4 text-black/54">{project.detail}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">{project.measures.map(([label, value]) => <div key={label}><div className="flex items-center justify-between gap-1 font-mono text-[6px] uppercase text-black/32"><span>{label}</span><span>{value}%</span></div><div className="mt-1.5 h-1 overflow-hidden bg-black/[.07]"><motion.div initial={reduceMotion ? undefined : { width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: .24 + index * .06, duration: .55 }} className={`h-full ${project.bar}`} /></div></div>)}</div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/[.07] pt-2.5"><span className="inline-flex min-w-0 items-center gap-1.5 truncate font-mono text-[6px] uppercase tracking-[.05em] text-black/34"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#56825a]" />{project.update}</span><ArrowRight className="h-3 w-3 shrink-0 text-black/24 transition group-hover:translate-x-0.5 group-hover:text-[#315e3a]" /></div>
            </motion.button>)}
          </section>
          </> : null}

          {activeScreen === 'accountability' ? <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
            <section className="border border-[#d7dcd6] bg-white">
              <div className="flex items-center justify-between border-b border-[#e2e5e0] p-3"><div><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Owner action queue</p><h3 className="mt-1 text-sm font-semibold">What needs to move today</h3></div><span className="bg-[#f4e8df] px-2 py-1 font-mono text-[6px] uppercase text-[#a24321]">3 priority</span></div>
              {[['214 King Street', 'Assign an owner to CO-014 before client review', 'Cost + schedule · due now'], ['Harbor Dental', 'Confirm site access with the field lead', 'Schedule · due 2:00 PM'], ['Easton Retail', 'Approve the revised owner update', 'Client waiting · due 3:00 PM']].map(([project, action, detail], index) => <motion.button key={project} type="button" onClick={() => setActiveScreen('projects')} initial={reduceMotion ? undefined : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 + index * .06 }} className="flex w-full items-center gap-3 border-b border-[#e2e5e0] p-3 text-left last:border-b-0 hover:bg-[#fafbf8]"><span className="grid h-7 w-7 shrink-0 place-items-center border border-[#d7dcd6] font-mono text-[8px] text-[#4f7f52]">0{index + 1}</span><span className="min-w-0 flex-1"><span className="block font-mono text-[6px] uppercase tracking-[.1em] text-[#4f7f52]">{project}</span><span className="mt-1 block truncate text-[9px] font-semibold text-black/70">{action}</span><span className="mt-1 block text-[7px] text-black/34">{detail}</span></span><ArrowRight className="h-3 w-3 text-black/25" /></motion.button>)}
            </section>
            <div className="grid gap-3">
              <section className="border border-[#e2c7b7] bg-[#fff8f3] p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#a24321]">Highest potential risk</p><h3 className="mt-1.5 text-xs font-semibold">214 King · unapproved exposure</h3></div><span className="bg-[#f1ddd2] px-2 py-1 font-mono text-[6px] uppercase text-[#a24321]">High</span></div><p className="mt-2 text-[8px] leading-4 text-black/52">Messages confirm a $2,840 finish change and two added days. The change order still has no accountable owner.</p><button type="button" onClick={() => setActiveScreen('projects')} className="mt-3 text-[7px] font-semibold text-[#8f3e25]">Open project →</button></section>
              <section className="border border-[#c9d9c9] bg-[#e9f0e7] p-3"><div className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#4f7f52]" /><div><p className="text-[9px] font-semibold">Suggested things to ask</p><p className="font-mono text-[6px] uppercase tracking-[.1em] text-[#4f7f52]">Based on today’s communication</p></div></div><div className="mt-3 grid gap-1.5">{['Which commitments still need an owner?', 'What could affect this week’s schedule?', 'Who is waiting for a response?'].map((question) => <button key={question} type="button" onClick={() => { setMessageQuery(question); setSearchSummary('Ready to search the complete communication record.'); }} className="flex items-center justify-between gap-3 border border-[#c9d9c9] bg-white px-3 py-2 text-left text-[7px] font-semibold text-[#315e3a]"><span>{question}</span><ArrowRight className="h-3 w-3 shrink-0" /></button>)}</div></section>
            </div>
          </div> : null}

          {activeScreen === 'performance' ? <div className="mt-4 grid gap-3">
            <section className="grid grid-cols-2 gap-px border border-[#d7dcd6] bg-[#d7dcd6] sm:grid-cols-4">{[['On-time actions', '91%', '+4% this month'], ['Client response', '2.1h', '38 min faster'], ['First-time complete', '87%', 'Across 12 projects'], ['Open handoffs', '3', '1 needs attention']].map(([label, value, detail], index) => <div key={label} className="bg-white p-3"><p className="text-[7px] font-semibold uppercase tracking-[.1em] text-black/32">{label}</p><p className={`mt-2 font-mono text-lg font-semibold ${index === 3 ? 'text-[#a24321]' : ''}`}>{value}</p><p className="mt-1 text-[7px] text-black/34">{detail}</p></div>)}</section>
            <section className="grid gap-3 sm:grid-cols-[1.1fr_.9fr]">
              <div className="border border-[#d7dcd6] bg-white"><div className="border-b border-[#e2e5e0] p-3"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Team delivery</p><h3 className="mt-1 text-sm font-semibold">Work moving as promised</h3></div>{[['Elena Park', 'Project management', 92], ['Malik Reed', 'Field coordination', 84], ['Avery Cole', 'Client service', 89]].map(([name, service, score]) => <div key={name} className="grid grid-cols-[1fr_6rem] items-center gap-3 border-b border-[#e2e5e0] p-3 last:border-b-0"><div><p className="text-[9px] font-semibold">{name}</p><p className="mt-1 text-[7px] text-black/35">{service} · confirmed outcomes</p></div><div><div className="flex justify-between font-mono text-[6px] uppercase text-black/30"><span>Delivery</span><span>{score}%</span></div><div className="mt-1.5 h-1 bg-black/[.07]"><div className="h-full bg-[#56825a]" style={{ width: `${score}%` }} /></div></div></div>)}</div>
              <div className="border border-[#d7dcd6] bg-[#f8faf6] p-3"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Service health</p><h3 className="mt-1 text-sm font-semibold">Where operations need support</h3><div className="mt-3 space-y-3">{[['Change management', 74, '2 approvals open'], ['Field coordination', 88, 'Access is the main delay'], ['Client updates', 93, 'All current']].map(([label, value, detail]) => <div key={label as string}><div className="flex items-end justify-between gap-3"><div><p className="text-[8px] font-semibold">{label}</p><p className="mt-0.5 text-[6px] text-black/34">{detail}</p></div><span className="font-mono text-[8px]">{value}%</span></div><div className="mt-1.5 h-1.5 bg-black/[.07]"><div className="h-full bg-[#56825a]" style={{ width: `${value}%` }} /></div></div>)}</div></div>
            </section>
          </div> : null}

          {activeScreen === 'log' ? <section className="mt-4 overflow-hidden border border-[#d7dcd6] bg-white"><div className="grid grid-cols-[3.5rem_5.5rem_minmax(0,1fr)_5.5rem] gap-2 border-b border-[#d7dcd6] bg-[#e9ede6] px-3 py-2 font-mono text-[6px] uppercase tracking-[.1em] text-black/36"><span>Time</span><span>Source</span><span>Original message</span><span>Project</span></div>{rawCommunicationLog.slice(0, 7).map(({ time, channel, message, project, from }, index) => <motion.div key={`${time}-${message}`} initial={reduceMotion ? undefined : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} className="grid grid-cols-[3.5rem_5.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 border-b border-[#e2e5e0] px-3 py-2.5 last:border-b-0"><span className="font-mono text-[7px] text-[#4f7f52]">{time.slice(0, 5)}</span><span className="truncate text-[7px] text-black/48">{channel}</span><span className="min-w-0 truncate text-[8px] text-black/66"><strong className="mr-1 font-semibold text-black/78">{from}:</strong>{message}</span><span className="truncate text-[7px] text-black/38">{project}</span></motion.div>)}</section> : null}

          {activeScreen === 'settings' ? <div className="mt-4 grid gap-3 sm:grid-cols-2"><section className="border border-[#d7dcd6] bg-white"><div className="border-b border-[#e2e5e0] p-3"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Connected sources</p><h3 className="mt-1 text-sm font-semibold">Communication channels</h3></div>{['Email', 'Texts / SMS', 'Phone calls', 'WhatsApp', 'Google Drive'].map((source) => { const enabled = enabledSources.includes(source); return <button key={source} type="button" onClick={() => setEnabledSources((current) => enabled ? current.filter((item) => item !== source) : [...current, source])} className="flex w-full items-center justify-between border-b border-[#e2e5e0] px-3 py-3 text-left last:border-b-0"><span><span className="block text-[9px] font-semibold">{source}</span><span className="mt-0.5 block text-[6px] text-black/34">{enabled ? 'Approved and receiving' : 'Not connected'}</span></span><span className={`relative h-4 w-7 rounded-full transition ${enabled ? 'bg-[#56825a]' : 'bg-black/15'}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${enabled ? 'left-3.5' : 'left-0.5'}`} /></span></button>; })}</section><section className="grid gap-3"><div className="border border-[#d7dcd6] bg-white p-3"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Review controls</p><h3 className="mt-1 text-sm font-semibold">Human approval required</h3><p className="mt-2 text-[8px] leading-4 text-black/46">Documents, external messages, and project changes remain drafts until an approved person reviews them.</p><span className="mt-3 inline-flex bg-[#dce9dc] px-2 py-1 font-mono text-[6px] uppercase text-[#315e3a]">Enabled</span></div><div className="border border-[#d7dcd6] bg-white p-3"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-[#4f7f52]">Workspace access</p><h3 className="mt-1 text-sm font-semibold">6 approved team members</h3><p className="mt-2 text-[8px] leading-4 text-black/46">Owners control which projects, sources, and actions each person can access.</p><button type="button" className="mt-3 text-[7px] font-semibold text-[#315e3a]">Manage permissions →</button></div></section></div> : null}

          {activeScreen === 'help' ? <div className="mt-4 grid gap-3 sm:grid-cols-2"><section className="border border-[#d7dcd6] bg-white p-4"><CircleHelp className="h-5 w-5 text-[#4f7f52]" /><h3 className="mt-3 text-sm font-semibold">Learn the workspace</h3><p className="mt-2 text-[8px] leading-4 text-black/46">Short guides for reviewing accountability, tracing information to its source, and controlling connected channels.</p><div className="mt-3 grid gap-1.5">{['Start with Accountability', 'Understand project health', 'Search the information log'].map((item) => <button key={item} type="button" className="flex items-center justify-between border border-[#e2e5e0] px-3 py-2 text-left text-[7px] font-semibold">{item}<ArrowRight className="h-3 w-3 text-black/25" /></button>)}</div></section><section className="border border-[#d7dcd6] bg-[#172019] p-4 text-white"><MessageCircle className="h-5 w-5 text-[#9fc2a2]" /><h3 className="mt-3 text-sm font-semibold">Talk to B2W support</h3><p className="mt-2 text-[8px] leading-4 text-white/42">Get help with a connected source, permissions, or the way your company’s workspace is configured.</p><button type="button" className="mt-4 bg-[#f4b28c] px-3 py-2 text-[7px] font-semibold text-[#172019]">Start a support conversation</button><p className="mt-3 font-mono text-[6px] uppercase tracking-[.08em] text-white/25">Typical response · under one business day</p></section></div> : null}

          {!['settings', 'help'].includes(activeScreen) ? <motion.form onSubmit={(event) => { event.preventDefault(); searchMessages(); }} initial={reduceMotion ? undefined : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38 }} className="absolute inset-x-3 bottom-16 z-10 border border-[#b9c9b7] bg-[#172019] p-2 shadow-[0_18px_45px_rgba(23,32,25,.24)] sm:inset-x-4 lg:inset-x-5">
            <div className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center bg-[#dfe9d8] text-[#17321f]"><Search className="h-3.5 w-3.5" /></span><label className="min-w-0 flex-1"><span className="sr-only">Search project messages</span><input value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} placeholder="Ask across every project message…" className="w-full bg-transparent text-[9px] text-white outline-none placeholder:text-white/35" /></label><button type="submit" aria-label="Search messages" className="grid h-8 w-8 shrink-0 place-items-center bg-[#f4b28c] text-[#172019] transition hover:bg-[#ffc29f]"><Send className="h-3.5 w-3.5" /></button></div>
            <p className="mt-1.5 truncate px-10 font-mono text-[6px] uppercase tracking-[.06em] text-white/35">{searchSummary}</p>
          </motion.form> : null}
        </main>
      </div>
    </motion.div>
  );
}

function JasonAIHero() {
  const reduceMotion = useReducedMotion();
  const [heroScene, setHeroScene] = useState<'intro' | 'log' | 'table' | 'dashboard'>('intro');
  const [feedOffset, setFeedOffset] = useState(0);
  const visualizationStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const feedTimer = window.setInterval(() => setFeedOffset((current) => current + 1), reduceMotion ? 4200 : 2800);
    return () => window.clearInterval(feedTimer);
  }, [reduceMotion]);

  useEffect(() => {
    let frame = 0;
    const updateFromScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const visualizationStage = visualizationStageRef.current;
        if (!visualizationStage) return;
        const bounds = visualizationStage.getBoundingClientRect();
        const introBoundary = Math.min(window.innerHeight * .32, 320);
        if (window.scrollY < 36 || bounds.top > introBoundary) setHeroScene('intro');
        else if (window.innerWidth < 1024 || bounds.top > -window.innerHeight * .5) setHeroScene('log');
        else if (bounds.top > -window.innerHeight * 1.25) setHeroScene('table');
        else setHeroScene('dashboard');
      });
    };
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, []);

  const scrollToLog = () => {
    const stage = visualizationStageRef.current;
    if (!stage) return;
    const target = window.scrollY + stage.getBoundingClientRect().top - Math.min(window.innerHeight * .32, 320) + 24;
    window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="overview" data-header-theme="dark" className="relative overflow-x-clip bg-[#14110f] pb-20 pt-32 text-white sm:pb-28 sm:pt-40 lg:pt-44">
      <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.06]" />
      <motion.div aria-hidden="true" className="absolute -left-40 top-8 h-[34rem] w-[34rem] rounded-full bg-[#b24a24]/32 blur-[110px]" animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [.45, .75, .45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#24724f]/16 blur-[100px]" animate={reduceMotion ? undefined : { y: [0, -18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div animate={{ opacity: heroScene === 'intro' ? 1 : 0, y: heroScene === 'intro' ? 0 : -34 }} transition={{ duration: reduceMotion ? 0 : .68, ease: HERO_HANDOFF_EASE }} className={`mx-auto max-w-5xl text-center ${heroScene === 'intro' ? '' : 'pointer-events-none'}`}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold uppercase tracking-[.2em] text-[#f4b28c]">The AI assistant for general contractors</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-7 max-w-[16ch] text-[clamp(2.7rem,7vw,6.5rem)] font-medium leading-[.94] tracking-[-.06em]"><span className="inline-block whitespace-nowrap">Contractors,</span>{' '}<span className="inline-block whitespace-nowrap">meet <em className="font-normal">your</em></span>{' '}<span className="inline-block whitespace-nowrap">integrated AI</span>{' '}<span className="inline-block whitespace-nowrap">assistant.</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} className="mx-auto mt-8 max-w-3xl text-[clamp(1.05rem,1.7vw,1.4rem)] leading-[1.55] text-white/64">JasonAI follows the communication already moving through your projects and turns missed decisions, changes, and commitments into useful work.</motion.p>
          <motion.ul initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="mx-auto mt-6 grid w-fit grid-cols-1 gap-x-8 gap-y-2 text-left text-sm font-medium text-white/72 sm:grid-cols-2">{['Find missed decisions', 'Create the next document', 'Flag cost and schedule impact', 'Show who needs to act'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-[#25D366]" />{item}</li>)}</motion.ul>
          {heroScene === 'intro' ? <CommunicationStreamCTA onActivate={scrollToLog} /> : null}
          <a href={BOOK_DEMO_URL} target="_blank" rel="noreferrer" className="group relative mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white/58 underline decoration-white/18 underline-offset-4 transition hover:text-white"><DescrambleText text="Book a demo" /> <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></a>
          <p className="mt-3 text-xs text-white/36">Scroll to watch the communication become organized project intelligence.</p>
        </motion.div>

        <div ref={visualizationStageRef} data-hero-stage className="relative mt-4 lg:h-[300vh]">
          <div className="space-y-24 lg:hidden">
            <div><CommunicationLogStageCopy reduceMotion={reduceMotion} /><div className="relative z-10 mb-3"><CommunicationChannelStreams reduceMotion={reduceMotion} /><span aria-hidden="true" className="absolute bottom-[-.75rem] left-1/2 h-6 w-px -translate-x-1/2 bg-gradient-to-b from-[#f4b28c] to-[#f4b28c]/20" /></div><LiveCommunicationTerminal reduceMotion={reduceMotion} feedOffset={feedOffset} /></div>
            <CleanedCommunicationTable reduceMotion={reduceMotion} feedOffset={feedOffset} />
            <div className="overflow-hidden rounded-[1.5rem] border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,.38)]"><AccountabilityDashboard reduceMotion={reduceMotion} showLog={scrollToLog} /></div>
          </div>
          <div className="hidden lg:sticky lg:top-20 lg:flex lg:min-h-[calc(100vh-5rem)] lg:w-full lg:items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {heroScene === 'log' ? <motion.div key="log-screen" data-hero-screen initial={reduceMotion ? undefined : { opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: reduceMotion ? 0 : HERO_HANDOFF_DURATION, ease: HERO_HANDOFF_EASE }} className="relative mx-auto w-full max-w-4xl shrink-0"><CommunicationLogStageCopy reduceMotion={reduceMotion} /><div className="relative z-10 mb-3"><CommunicationChannelStreams reduceMotion={reduceMotion} /><span aria-hidden="true" className="absolute bottom-[-.75rem] left-1/2 h-6 w-px -translate-x-1/2 bg-gradient-to-b from-[#f4b28c] to-[#f4b28c]/20" /></div><LiveCommunicationTerminal reduceMotion={reduceMotion} feedOffset={feedOffset} /></motion.div> : heroScene === 'table' ? <motion.div key="table-screen" data-hero-screen initial={reduceMotion ? undefined : { opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: reduceMotion ? 0 : .72, ease: HERO_HANDOFF_EASE }} className="relative mx-auto w-full max-w-6xl shrink-0"><CleanedCommunicationTable reduceMotion={reduceMotion} feedOffset={feedOffset} /></motion.div> : heroScene === 'dashboard' ? <motion.div key="dashboard-screen" data-hero-screen initial={{ opacity: .4, scale: .995 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .998 }} transition={{ duration: reduceMotion ? 0 : .22, ease: HERO_HANDOFF_EASE }} className="relative mx-auto w-full max-w-6xl shrink-0 overflow-hidden rounded-[1.75rem] border border-white/12 shadow-[0_35px_100px_rgba(0,0,0,.42)]"><AccountabilityDashboard reduceMotion={reduceMotion} showLog={() => { setHeroScene('log'); const stage = visualizationStageRef.current; if (stage) window.scrollTo({ top: window.scrollY + stage.getBoundingClientRect().top + window.innerHeight * .25, behavior: reduceMotion ? 'auto' : 'smooth' }); }} /></motion.div> : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
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

export default function V4HomePage({
  basePath = '/v4',
  canonicalPath = '/communication',
  isArchive = true,
}: {
  basePath?: string;
  canonicalPath?: string;
  isArchive?: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);
  const reduceMotion = useReducedMotion();
  const homePath = basePath || '/';
  const anchor = (id: string) => `${homePath}#${id}`;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fbfaf6] text-slate-950">
      <Seo
        title="JasonAI for Contractor Communication"
        description="JasonAI turns missed contractor communication into connected project context, useful answers, reviewable documents, and clear next actions."
        canonicalPath={canonicalPath}
        robots={isArchive ? 'noindex, nofollow' : undefined}
      />
      <V4Header basePath={basePath} />

      <main>
        <>
        <JasonAIHero />

        <section className="relative overflow-hidden border-b border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.025]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10">
            <div><p className="text-sm font-semibold text-[#a24321]">The information already exists</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.8rem,5vw,5.25rem)] font-medium leading-[.96] tracking-[-.052em]">Your projects already contain the answers.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">They are just buried across messages, emails, documents, spreadsheets, drawings, photos, and conversations. JasonAI connects those sources so your team can ask useful questions without searching through everything manually.</p></div>
            <div className="rounded-[2rem] border border-slate-950/10 bg-white/78 p-5 shadow-[0_28px_80px_rgba(15,23,42,.09)] sm:p-7">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{sourceTypes.map(([Icon, label], index) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="flex items-center gap-2.5 rounded-2xl border border-slate-950/8 bg-[#fbfaf6] p-3 text-xs font-semibold text-slate-600"><Icon className="h-4 w-4 text-[#a24321]" />{label}</motion.div>)}</div>
              <div className="my-5 flex items-center justify-center gap-3"><span className="h-px flex-1 bg-slate-950/10" /><ChevronDown className="h-5 w-5 text-slate-400" /><span className="h-px flex-1 bg-slate-950/10" /></div>
              <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-[1.35rem] bg-[#14110f] p-4 text-white"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4b28c] text-[#14110f]"><Bot className="h-5 w-5" /></span><div><p className="text-sm font-semibold">JasonAI</p><p className="text-[10px] text-white/42">connected project context</p></div></div>
              <div className="my-5 flex items-center justify-center gap-3"><span className="h-px flex-1 bg-slate-950/10" /><ChevronDown className="h-5 w-5 text-slate-400" /><span className="h-px flex-1 bg-slate-950/10" /></div>
              <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-[#dcebd8] p-4"><p className="text-xs font-semibold text-[#10271c]">What happened?</p><p className="mt-2 text-[11px] leading-5 text-[#10271c]/58">Decisions, approvals, changes, and project history.</p></div><div className="rounded-2xl bg-[#fff0e6] p-4"><p className="text-xs font-semibold text-[#7f321a]">What happens next?</p><p className="mt-2 text-[11px] leading-5 text-[#7f321a]/62">Open items, follow-ups, documents, and actions.</p></div></div>
            </div>
          </div>
        </section>

        </>

        <>
        <section id="capabilities" className="relative border-b border-slate-950/10 bg-[#fbfaf6] py-24 sm:py-32">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.025]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <div><p className="text-sm font-semibold text-[#a24321]">What JasonAI does</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.8rem,4.8vw,5rem)] font-medium leading-[.96] tracking-[-.05em]">From project noise to useful work.</h2></div>
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
        </>

        <section id="agents" className="relative overflow-hidden bg-[#10271c] py-24 text-white sm:py-32">
          <motion.div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a9c7a8]/20" animate={{ scale: [1, 1.12, 1], opacity: [.3, .7, .3] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="relative mx-auto w-full max-w-6xl px-5 text-center sm:px-8"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[#a9c7a8]"><Sparkles className="h-6 w-6" /></span><p className="mt-7 text-sm font-semibold text-[#a9c7a8]">Agent capabilities</p><h2 className="mx-auto mt-4 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[.95] tracking-[-.052em]">Today, JasonAI helps you understand the work. Next, it will help you do it.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/52">Upcoming capabilities are intended to take approved actions across business systems—not operate beyond the permissions you provide.</p><div className="mt-10 flex flex-wrap justify-center gap-2.5">{['Send the follow-up', 'Update the estimate', 'Create the task', 'Prepare the report', 'Notify the team'].map((label) => <span key={label} className="rounded-full border border-white/14 bg-white/7 px-4 py-2.5 text-xs text-white/65">{label}</span>)}</div><a href="mailto:info@b2w-ai.com?subject=JasonAI%20agent%20early%20access" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#10271c]"><DescrambleText text="Join early access" /> <ArrowRight className="h-4 w-4" /></a></div>
        </section>

        <section id="how-it-works" className="bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"><div className="mx-auto max-w-4xl text-center"><p className="text-sm font-semibold text-[#a24321]">How it works</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]"><DescrambleText text="Connect. Ask. Act." animateOnView delay={80} /></h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">No complicated implementation. No new workflow to learn.</p></div><div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-slate-950/10 lg:grid-cols-3">{[['01', 'Connect', 'Add JasonAI to a communication channel or upload existing information.', Upload], ['02', 'Ask', 'Talk naturally about your projects and business.', MessageCircle], ['03', 'Act', 'Get answers, documents, analysis, and eventually approved actions.', Zap]].map(([number, title, body, Icon]) => <article key={String(number)} className="min-h-80 bg-white p-7 sm:p-8"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-slate-400">{String(number)}</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-5 w-5" /></span></div><h3 className="mt-16 text-4xl font-semibold tracking-[-.05em]">{String(title)}</h3><p className="mt-5 text-sm leading-7 text-slate-600">{String(body)}</p></article>)}</div></div>
        </section>

        <section id="project-example" className="bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
              <div className="lg:sticky lg:top-28"><p className="text-sm font-semibold text-[#a24321]">Example project</p><h2 className="mt-4 max-w-[18ch] text-[clamp(2rem,8.5vw,3.5rem)] font-medium leading-[.98] tracking-[-.052em] lg:text-[clamp(3rem,4.15vw,3.6rem)]"><span className="inline-block whitespace-nowrap">One project.</span>{' '}<span className="inline-block whitespace-nowrap">Hundreds of messages.</span>{' '}<span className="inline-block whitespace-nowrap">One assistant.</span></h2><p className="mt-7 text-lg leading-8 text-slate-600">One question instead of searching four systems.</p></div>
              <div>
                <div className="space-y-3">{projectTimeline.map(([day, body, Icon], index) => <motion.article key={day} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="grid gap-4 rounded-[1.4rem] border border-slate-950/10 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.05)] sm:grid-cols-[100px_44px_1fr] sm:items-center"><p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-400">{day}</p><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7f4ed] text-[#a24321]"><Icon className="h-4 w-4" /></span><p className="text-sm leading-7 text-slate-700">{body}</p></motion.article>)}</div>
                <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#14110f] p-6 text-white sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">JasonAI · Thursday answer</p><p className="mt-4 text-xl font-semibold leading-8 tracking-[-.025em]">The tile changed from ceramic to limestone. Supplier pricing adds $2,840. The field note confirms two extra installation days. I drafted the revised estimate for review.</p><div className="mt-7 grid gap-2 sm:grid-cols-2">{['Summarized the change', 'Found supplier pricing', 'Extracted site details', 'Drafted revised estimate'].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2.5 text-xs text-white/58"><Check className="h-3.5 w-3.5 text-[#25D366]" />{item}</div>)}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="control" className="border-y border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-10"><div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><LockKeyhole className="h-5 w-5" /></span><p className="mt-7 text-sm font-semibold text-[#a24321]">Security and control</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.8rem,4.7vw,4.85rem)] font-medium leading-[.96] tracking-[-.05em]">Your business. Your information. Your control.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['Choose what JasonAI can access.', 'Keep projects separated.', 'Control who can ask what.', 'Remove integrations whenever you want.', 'Require human review before use.', 'Limit future actions to approved permissions.'].map((item) => <div key={item} className="flex min-h-28 items-start gap-3 rounded-[1.35rem] border border-slate-950/10 bg-white/70 p-5 text-sm font-medium leading-6 text-slate-700"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#24724f]" />{item}</div>)}</div></div>
        </section>

        <section id="use-cases" className="scroll-mt-24 border-y border-slate-950/10 bg-[#f7f4ed] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <div><p className="text-sm font-semibold text-[#a24321]">Examples</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.8rem,4.8vw,5rem)] font-medium leading-[.96] tracking-[-.05em]">Built around the work contractors actually do.</h2></div>
              <p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">Use the same connected project context for coordination, estimating, and the information coming from the field.</p>
            </div>

            <div className="mt-14 space-y-5">
              {solutionSections.map((solution, index) => {
                const Icon = solution.icon;
                return (
                  <motion.article id={solution.slug} key={solution.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ delay: index * .06 }} className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/82 shadow-[0_22px_65px_rgba(15,23,42,.07)]">
                    <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                      <div className="p-7 sm:p-9 lg:p-11">
                        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f]" style={{ color: solution.accent }}><Icon className="h-5 w-5" /></span><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#a24321]">{solution.label}</p></div>
                        <h3 className="mt-8 max-w-[18ch] text-[clamp(2.25rem,4vw,4.5rem)] font-medium leading-[.98] tracking-[-.05em]">{solution.title}</h3>
                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">{solution.body}</p>
                        <ul className="mt-8 space-y-3">{solution.features.map((feature) => <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-[#24724f]" />{feature}</li>)}</ul>
                      </div>
                      <div className="flex min-h-[27rem] items-center bg-[#14110f] p-6 text-white sm:p-9 lg:p-11">
                        <div className="w-full rounded-[1.5rem] border border-white/12 bg-white/[.055] p-5 sm:p-6">
                          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">Ask JasonAI</p>
                          <p className="mt-4 text-xl font-semibold leading-8 tracking-[-.025em]">“{solution.prompt}”</p>
                          <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-white/10" /><ArrowRight className="h-4 w-4 text-white/34" /><span className="h-px flex-1 bg-white/10" /></div>
                          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a9c7a8]">Useful result</p>
                          <p className="mt-3 text-sm leading-7 text-white/58">{solution.result}</p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-14"><p className="text-sm font-semibold text-[#a24321]">More ways to use the same context</p><div className="mt-6 grid gap-4 md:grid-cols-3">{useCases.map(([slug, title, body, Icon], index) => <motion.article id={slug} key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="min-h-60 scroll-mt-28 rounded-[1.5rem] border border-slate-950/10 bg-white/72 p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#14110f] text-[#f4b28c]"><Icon className="h-5 w-5" /></span><h3 className="mt-9 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-slate-600">{body}</p></motion.article>)}</div></div>
          </div>
        </section>

        <section id="why-jasonai" className="bg-[#f7f4ed] py-24 sm:py-32">
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
            <p className="mt-5 text-xs leading-5 text-slate-500">Illustrative small-contractor model, not a guarantee. Standalone price compares current individual paid plans: ChatGPT Plus $20/month, Google AI Pro $19.99/month, and Claude Pro $20/month. JasonAI price reflects the current free early-access offer. Time saved and annual value should be validated against each business.</p>

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
              <a href="mailto:info@b2w-ai.com?subject=JasonAI%20free%20early%20access" className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#14110f] px-6 py-3 font-semibold text-white transition hover:bg-[#a24321] lg:mt-0"><DescrambleText text="Try JasonAI" /> <ArrowRight className="h-4 w-4" /></a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#24724f]" /> Human review remains required</span>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus" target="_blank" rel="noreferrer">ChatGPT pricing</a>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://one.google.com/about/plans" target="_blank" rel="noreferrer">Google AI pricing</a>
              <a className="underline underline-offset-4 hover:text-slate-950" href="https://support.anthropic.com/en/articles/8325610-how-much-does-claude-pro-cost" target="_blank" rel="noreferrer">Claude pricing</a>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24 bg-[#fbfaf6] py-24 sm:py-32">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.72fr] lg:items-center"><div><p className="text-sm font-semibold text-[#a24321]">Simple early-access pricing</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.8rem,5vw,5.25rem)] font-medium leading-[.96] tracking-[-.05em]">Start using JasonAI for free.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">More powerful integrations, customization, and agent capabilities can be added as JasonAI grows.</p></div><div className="rounded-[2rem] bg-[#14110f] p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.2)] sm:p-8"><p className="text-sm font-semibold text-[#f4b28c]">JasonAI Free</p><p className="mt-5 text-7xl font-medium tracking-[-.06em]">$0</p><ul className="mt-8 space-y-3">{['Connect JasonAI', 'Ask project questions', 'Search and summarize', 'Generate documents', 'Analyze files'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-white/65"><Check className="h-4 w-4 text-[#25D366]" />{item}</li>)}</ul><a href="mailto:info@b2w-ai.com?subject=Get%20started%20with%20JasonAI%20Free" className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f4b28c] px-6 py-3 font-semibold text-[#14110f]"><DescrambleText text="Get started free" /> <ArrowRight className="h-4 w-4" /></a><p className="mt-4 text-center text-[10px] text-white/30">Subject to fit and early-access availability.</p></div></div>

          <div id="faq" className="mx-auto mt-24 w-full max-w-5xl scroll-mt-28 px-5 sm:mt-32 sm:px-8"><div className="border-t border-slate-950/12 pt-16"><p className="text-sm font-semibold text-[#a24321]">Pricing and product FAQs</p><h2 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.96] tracking-[-.05em]">What contractors usually ask first.</h2><div className="mt-12 overflow-hidden rounded-[1.75rem] border border-slate-950/10 bg-white/76">{faqItems.map(([question, answer], index) => { const open = activeFaq === index; return <div key={question} className="border-b border-slate-950/10 last:border-0"><button type="button" onClick={() => setActiveFaq(open ? -1 : index)} aria-expanded={open} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"><span className="text-base font-semibold sm:text-lg">{question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="max-w-3xl px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{answer}</p></div></div></div>; })}</div></div></div>
        </section>

        <section className="bg-[#14110f] px-5 py-24 text-center text-white sm:py-32"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold text-[#f4b28c]">Your business is already talking.</p><h2 className="mx-auto mt-4 text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[.95] tracking-[-.052em]">Give it an assistant that can keep up.</h2><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><a href="mailto:info@b2w-ai.com?subject=Try%20JasonAI%20Free" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f4b28c] px-6 py-3 font-semibold text-[#14110f]"><DescrambleText text="Try JasonAI free" /> <ArrowRight className="h-4 w-4" /></a><a href="mailto:info@b2w-ai.com?subject=Talk%20to%20B2W" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/16 px-6 py-3 font-semibold text-white"><DescrambleText text="Talk to B2W" /> <ArrowRight className="h-4 w-4" /></a></div></div></section>
      </main>

      <V4Footer basePath={basePath} />
    </div>
  );
}
