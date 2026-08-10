import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  CircleDashed,
  Compass,
  FileText,
  FolderTree,
  Gauge,
  Globe2,
  Landmark,
  LockKeyhole,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import InternalDocumentNav from '../../components/internal/InternalDocumentNav';
import B2WIcon from '../../components/logo/B2WIcon';
import Seo from '../../components/Seo';

type ArchitectureState = {
  label: 'Have now' | 'Intend next' | 'Should plan';
  summary: string;
  items: string[];
};

type ArchitectureLayer = {
  id: string;
  title: string;
  purpose: string;
  route?: string;
  Icon: typeof Globe2;
  states: ArchitectureState[];
};

const publicLayers: ArchitectureLayer[] = [
  {
    id: 'home',
    title: 'Home',
    purpose: 'Orient visitors to B2W, establish the company system, and route them to services or JasonAI.',
    route: '/',
    Icon: Landmark,
    states: [
      { label: 'Have now', summary: 'A unified company-level homepage.', items: ['Strategy, Systems, Implementation framing', 'JasonAI identified as the current product', 'Resources and trust language connected to the same system'] },
      { label: 'Intend next', summary: 'Make the homepage the reliable orientation layer.', items: ['Validate message clarity with prospects', 'Measure service and JasonAI routing', 'Refine proof using verified customer evidence'] },
      { label: 'Should plan', summary: 'Personalize orientation only when evidence supports it.', items: ['Industry-aware entry points', 'Returning-visitor continuity', 'No personalization that weakens privacy or clarity'] },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    purpose: 'Organize B2W work around the business condition and decision—not a generic deliverables list.',
    route: '/services',
    Icon: Compass,
    states: [
      { label: 'Have now', summary: 'Three clear intervention categories.', items: ['Strategy', 'Systems', 'Implementation', 'Condition, work, output, customer, and next action for each'] },
      { label: 'Intend next', summary: 'Connect services to repeatable commercial scopes.', items: ['Evidence-backed examples for each category', 'Scope ranges and decision gates', 'Case studies mapped to service outcomes'] },
      { label: 'Should plan', summary: 'Build a governed service catalog.', items: ['Owner and review cadence for service content', 'Reusable engagement templates', 'Performance feedback from delivery into service design'] },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    purpose: 'Explain products through agents, workflows, and pricing while separating current and future capability.',
    route: '/products',
    Icon: Bot,
    states: [
      { label: 'Have now', summary: 'JasonAI is the current commercial agent.', items: ['Agents index', 'Workflow stage map', '$99 subscription and $2,000 WhatsApp setup', 'Overview, How It Works, Questions, and Privacy'] },
      { label: 'Intend next', summary: 'Prove the current product wedge.', items: ['Communication search and summaries', 'Action extraction and source-linked reporting in development', 'Measured activation, answer quality, and trust'] },
      { label: 'Should plan', summary: 'Expand only after the wedge is trusted.', items: ['Governed actions across approved systems', 'Additional agents only after validation', 'Tiering tied to real capability and service cost'] },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    purpose: 'Help users participate in a decision through guides, tools, demonstrations, and case studies.',
    route: '/resources',
    Icon: Sparkles,
    states: [
      { label: 'Have now', summary: 'A four-part resource system and guided pathfinder.', items: ['Guides', 'Tools', 'Demonstrations', 'Case Studies', 'Input → transform → review → complete interaction'] },
      { label: 'Intend next', summary: 'Turn current operating artifacts into useful public resources.', items: ['Publish decision-ready guides', 'Add verified demonstrations', 'Connect case studies to services and product workflows'] },
      { label: 'Should plan', summary: 'Run resources as a measurable learning system.', items: ['Resource editorial calendar', 'Named owner and review status', 'Search and engagement feedback into content priorities'] },
    ],
  },
  {
    id: 'company',
    title: 'About + Contact',
    purpose: 'Explain company credibility, how B2W works, and route each inquiry to one useful next step.',
    route: '/about',
    Icon: Building2,
    states: [
      { label: 'Have now', summary: 'Concrete company explanation and one routed contact form.', items: ['Who B2W serves', 'Why strategy, systems, and products connect', 'Service, JasonAI, WhatsApp setup, partnership, and general inquiry types'] },
      { label: 'Intend next', summary: 'Add proof without generic company language.', items: ['Verified team and partner credentials', 'Response expectations by inquiry type', 'Clearer commercial qualification rules'] },
      { label: 'Should plan', summary: 'Create a durable company trust layer.', items: ['Legal and security pages as required', 'Accessibility statement and review cadence', 'Partnership and contributor governance'] },
    ],
  },
  {
    id: 'shared-experience',
    title: 'Shared experience system',
    purpose: 'Keep every public page inside one brand, navigation, search, interaction, and measurement model.',
    Icon: Search,
    states: [
      { label: 'Have now', summary: 'A shared B2W shell and visual language.', items: ['Canonical Clara-derived B2W mark', 'Header, product menu, search, footer, buttons, and status labels', 'Ink-and-paper parent identity with mineral-blue JasonAI signal and restrained semantic states'] },
      { label: 'Intend next', summary: 'Validate the system across devices and assistive use.', items: ['Keyboard and screen-reader review', 'Desktop, tablet, and mobile QA', 'Broken-link, console, and search review'] },
      { label: 'Should plan', summary: 'Govern the design system as a product.', items: ['Component documentation', 'Accessibility regression checks', 'Change review for tokens, navigation, and core patterns'] },
    ],
  },
];

const internalLayers: ArchitectureLayer[] = [
  {
    id: 'operating-map',
    title: 'Operating Map',
    purpose: 'Company direction, business model, commercial phases, ownership, strategic priorities, and decision gates.',
    route: '/internal/business-plan',
    Icon: Route,
    states: [
      { label: 'Have now', summary: 'A working Business Plan expressed as an Operating Map.', items: ['Strategy, Systems, and Implementation', 'Ownership and phase gates', 'JasonAI commercial progression'] },
      { label: 'Intend next', summary: 'Make decisions easier to audit.', items: ['Named gate owners', 'Decision dates and supporting evidence', 'Current priorities separated from historical plans'] },
      { label: 'Should plan', summary: 'Connect the map to live operating records.', items: ['Decision register', 'Scenario planning', 'Automatic links to goals, risks, and approved changes'] },
    ],
  },
  {
    id: 'product-direction',
    title: 'Product Direction',
    purpose: 'Product vision, current state, roadmap, capabilities, dependencies, and product decisions.',
    route: '/internal/portal',
    Icon: Workflow,
    states: [
      { label: 'Have now', summary: 'A Gurge-based product and portfolio direction environment.', items: ['JasonAI direction and five-phase roadmap', 'Client and product context', 'Current-versus-planned product documentation'] },
      { label: 'Intend next', summary: 'Move from read-only direction to governed updates.', items: ['Editable owners, priorities, statuses, evidence, and notes', 'Decision history', 'AI-assisted summaries with deterministic fallbacks'] },
      { label: 'Should plan', summary: 'Make direction the source for public product claims.', items: ['Approved capability registry', 'Release and claim gates', 'Dependencies linked to engineering and commercial readiness'] },
    ],
  },
  {
    id: 'tracking',
    title: 'Tracking',
    purpose: 'Goals, KPIs, milestones, owners, status, risks, blockers, and next actions.',
    route: '/internal/portal/product/kpi-tracker',
    Icon: Gauge,
    states: [
      { label: 'Have now', summary: 'JasonAI performance goals, KPI tracking, and project status views.', items: ['Five-phase goals and gates', 'Assignments and reported results', 'Green, gold, and red operating states'] },
      { label: 'Intend next', summary: 'Extend tracking from JasonAI to the full company system.', items: ['Company-level goal hierarchy', 'Service delivery and resource metrics', 'Owner, risk, blocker, and next-action consistency'] },
      { label: 'Should plan', summary: 'Build a reliable executive operating cadence.', items: ['Weekly and monthly reviews', 'Metric definitions and data owners', 'Historical trends, alerts, and decision triggers'] },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation',
    purpose: 'Meeting notes, interviews, workflows, requirements, onboarding, technical guides, decisions, and evidence.',
    route: '/internal/portal/product/documentation',
    Icon: FileText,
    states: [
      { label: 'Have now', summary: 'A product documentation framework plus business and brand resources.', items: ['Product, skills, architecture, safety/privacy, and operations indexes', 'JasonAI vision and ideal customer profile', 'This website and business architecture set'] },
      { label: 'Intend next', summary: 'Turn document indexes into maintained records.', items: ['Repository-backed or rendered source documents', 'Meeting and interview templates', 'Architecture decisions and onboarding guides'] },
      { label: 'Should plan', summary: 'Create evidence-aware documentation governance.', items: ['Named document owners and review dates', 'Canonical-versus-supporting record rules', 'Search permissions, retention, and change history'] },
    ],
  },
];

const productStates: ArchitectureLayer[] = [
  {
    id: 'jasonai-state',
    title: 'JasonAI capability boundary',
    purpose: 'Keep product, commercial, trust, and public claims synchronized.',
    route: '/jasonai',
    Icon: ShieldCheck,
    states: [
      { label: 'Have now', summary: 'A narrow current product and explicit commercial assumptions.', items: ['$99/month for JasonAI Assistant', '$2,000 WhatsApp integration and onboarding', 'Approved communication search and summaries', 'Customer source control and human review'] },
      { label: 'Intend next', summary: 'Add evidence and reporting before broader action.', items: ['Action-item extraction', 'Status reporting', 'Source-linked answers', 'Measured answer quality, activation, and trust'] },
      { label: 'Should plan', summary: 'Move to governed action only after controls are proven.', items: ['Financial or contractual automation remains future', 'Authority and escalation rules', 'Security, consent, retention, and evaluation gates'] },
    ],
  },
  {
    id: 'commercial-state',
    title: 'Commercial system',
    purpose: 'Connect each page to one primary commercial objective and a reviewable intake path.',
    route: '/contact',
    Icon: CheckCircle2,
    states: [
      { label: 'Have now', summary: 'Routed contact and clear JasonAI pricing.', items: ['Five inquiry types', 'Service and product CTAs', 'Form start and completion event names', 'Pricing and JasonAI engagement signals'] },
      { label: 'Intend next', summary: 'Define qualification and response operations.', items: ['Inquiry routing owner', 'Response-time target', 'WhatsApp setup readiness', 'Service-scope and product-fit criteria'] },
      { label: 'Should plan', summary: 'Close the loop from interest to outcome.', items: ['Lead-source and conversion reporting', 'Onboarding-stage tracking', 'Customer outcome reviews', 'Privacy-safe lifecycle measurement'] },
    ],
  },
];

const statusStyles: Record<ArchitectureState['label'], string> = {
  'Have now': 'bg-[#E3EEE5] text-[#315A3B]',
  'Intend next': 'bg-[#EFE3C7] text-[#76591D]',
  'Should plan': 'bg-[#EADCE5] text-[#684155]',
};

function DocumentLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8B6B27]">{children}</p>;
}

function StateColumn({ state }: { state: ArchitectureState }) {
  return (
    <div className="bg-white p-5 sm:p-6">
      <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusStyles[state.label]}`}>{state.label}</span>
      <p className="mt-5 text-sm font-semibold leading-6 text-[#17221E]">{state.summary}</p>
      <ul className="mt-4 space-y-3">
        {state.items.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-5 text-[#223C33]/62"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{item}</li>)}
      </ul>
    </div>
  );
}

function ArchitectureLayerCard({ layer }: { layer: ArchitectureLayer }) {
  return (
    <article id={layer.id} className="scroll-mt-36 overflow-hidden border border-[#223C33]/14 bg-[#223C33]/14">
      <header className="grid gap-6 bg-[#F8F5EE] p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <layer.Icon className="h-5 w-5 text-[#8B6B27]" />
          <h3 className="mt-5 text-3xl font-medium tracking-[-0.04em]">{layer.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#223C33]/62">{layer.purpose}</p>
        </div>
        {layer.route ? <Link to={layer.route} className="group inline-flex min-h-11 items-center justify-between gap-4 rounded-full border border-[#223C33]/15 bg-white px-5 text-xs font-semibold">Open current route<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></Link> : null}
      </header>
      <div className="grid gap-px lg:grid-cols-3">{layer.states.map((state) => <StateColumn key={state.label} state={state} />)}</div>
    </article>
  );
}

function DocumentSection({ number, id, title, description, layers }: { number: string; id: string; title: string; description: string; layers: ArchitectureLayer[] }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-[#223C33]/12 py-16 sm:py-24">
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <header>
          <DocumentLabel>Document {number}</DocumentLabel>
          <h2 className="mt-5 text-4xl font-medium leading-none tracking-[-0.045em]">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#223C33]/60">{description}</p>
        </header>
        <div className="space-y-5">{layers.map((layer) => <ArchitectureLayerCard key={layer.id} layer={layer} />)}</div>
      </div>
    </section>
  );
}

export default function WebsiteArchitectureDocumentsPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#17221E]">
      <Seo title="B2W Website and Business Architecture" description="Private B2W architecture documents mapping the current website and business system, intended next state, and planned future state." robots="noindex, nofollow" canonicalPath="/internal/resources/website-architecture" />
      <header className="sticky top-0 z-40 border-b border-[#223C33]/10 bg-[#F6F3EC]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3"><Link to="/internal/resources" aria-label="Return to Resources" className="grid h-9 w-9 place-items-center rounded-full border border-[#223C33]/12 transition hover:bg-white"><ArrowLeft className="h-3.5 w-3.5" /></Link><B2WIcon title="" className="h-8 w-9 text-[#223C33]" /><div><p className="b2w-wordmark text-[11px] font-semibold tracking-[0.16em]">B2W</p><p className="text-[8px] uppercase tracking-[0.2em] text-[#223C33]/45">Architecture documents</p></div></div>
          <div className="hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#223C33]/45 sm:flex"><CircleDashed className="h-3.5 w-3.5 text-[#8B6B27]" />Living system · 2026.08</div>
        </div>
        <InternalDocumentNav />
      </header>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.25fr)_360px] xl:items-end">
          <div><DocumentLabel>Website + business architecture</DocumentLabel><h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[6rem]">What B2W has, intends to build, and should plan.</h1></div>
          <div className="border-l border-[#223C33]/14 pl-6"><p className="text-base leading-8 text-[#223C33]/65">A summarized document set connecting the new public sitemap to the internal operating environment, product boundary, commercial system, and governance model.</p><div className="mt-6 grid gap-2">{[['01', 'Public website', '#public-website'], ['02', 'Internal workspace', '#internal-workspace'], ['03', 'Product + commercial', '#product-commercial'], ['04', 'Governance', '#governance']].map(([number, label, href]) => <a key={number} href={href} className="group flex items-center justify-between border-b border-[#223C33]/12 py-2 text-xs font-semibold"><span><span className="mr-3 font-mono text-[#8B6B27]">{number}</span>{label}</span><ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></a>)}</div></div>
        </div>
      </section>

      <section className="border-y border-[#223C33]/12 bg-[#EAE5D9]"><div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8"><div className="grid gap-px overflow-hidden border border-[#223C33]/12 bg-[#223C33]/12 md:grid-cols-3">{[
        ['Have now', 'Implemented or already represented by a current route, component, document, product behavior, or commercial rule.'],
        ['Intend next', 'The declared next state that should guide near-term content, product, and operating work.'],
        ['Should plan', 'A governed future capability that needs evidence, ownership, dependencies, and an explicit decision before commitment.'],
      ].map(([title, body]) => <div key={title} className="bg-[#F8F5EE] p-6"><span className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusStyles[title as ArchitectureState['label']]}`}>{title}</span><p className="mt-4 text-sm leading-7 text-[#223C33]/65">{body}</p></div>)}</div></div></section>

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <DocumentSection number="01" id="public-website" title="Public website hierarchy" description="The customer-facing system for understanding B2W, choosing a path, reviewing proof and boundaries, and taking one useful next action." layers={publicLayers} />
        <DocumentSection number="02" id="internal-workspace" title="Internal operating environment" description="The workspace is organized around direction, product decisions, tracking, and documentation—not disconnected pages." layers={internalLayers} />
        <DocumentSection number="03" id="product-commercial" title="Product + commercial boundary" description="The public promise, product state, pricing, trust controls, and inquiry path must agree with the internal source of truth." layers={productStates} />

        <section id="governance" className="scroll-mt-32 border-t border-[#223C33]/12 py-16 sm:py-24">
          <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
            <header><DocumentLabel>Document 04</DocumentLabel><h2 className="mt-5 text-4xl font-medium leading-none tracking-[-0.045em]">Governance and review</h2><p className="mt-5 text-sm leading-7 text-[#223C33]/60">The rules that keep the site and business architecture coherent as new work is added.</p></header>
            <div className="grid gap-px overflow-hidden border border-[#223C33]/12 bg-[#223C33]/12 sm:grid-cols-2">
              {[
                ['Shared components', 'The public header, footer, logo, buttons, search, layout patterns, status indicators, and calls to action are canonical. Review system changes centrally before creating variants.'],
                ['Content ownership', 'Services belongs to the service owner; product claims and pricing to the product and commercial owners; Resources to a named editorial owner; company and trust pages to the executive owner.'],
                ['Claim review', 'Before publishing, compare every capability statement with Product Direction. Label it Available now, In development, Planned, or Future. Do not use future capability to justify current pricing.'],
                ['Canonical routes', 'The new sitemap is canonical. Legacy URLs redirect to the closest current route. Client and internal routes remain preserved and noindex unless an owner explicitly changes access and indexing.'],
                ['New-page rule', 'Every new page must declare its parent, audience, business condition, primary objective, evidence, status, owner, canonical URL, search entry, and one primary next action.'],
                ['Review cadence', 'Review public claims and pricing at product releases; routes and metadata at every public information-architecture change; internal goals and risks in the operating cadence; core governance quarterly.'],
              ].map(([title, body], index) => <article key={title} className="min-h-64 bg-white p-6"><div className="flex items-center justify-between"><FolderTree className="h-5 w-5 text-[#8B6B27]" /><span className="font-mono text-[9px] text-[#223C33]/35">0{index + 1}</span></div><h3 className="mt-9 text-xl font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#223C33]/62">{body}</p></article>)}
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#223C33]/12 bg-[#17221E] text-white"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 px-5 py-10 sm:flex-row sm:items-center sm:px-8"><div className="flex items-center gap-3"><LockKeyhole className="h-4 w-4 text-[#D8B56A]" /><p className="text-sm font-medium">Architecture decisions belong in the Resources workspace and remain private by default.</p></div><Link to="/internal/resources" className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-white">Return to Resources<ArrowRight className="h-3.5 w-3.5" /></Link></div></footer>
    </main>
  );
}
