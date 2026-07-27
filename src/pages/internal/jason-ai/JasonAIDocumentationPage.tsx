import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Braces,
  ChevronDown,
  FileCode2,
  FileText,
  Folder,
  FolderTree,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageHeroTitleClassName,
  projectPageSectionTitleClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../../components/projectPageLayout';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';

type DocumentItem = {
  name: string;
  type: string;
  status: 'Draft' | 'Planned' | 'Living' | 'Required';
  locked?: boolean;
};

type DocumentationSection = {
  id: string;
  label: string;
  path: string;
  icon: typeof Folder;
  description: string;
  items: DocumentItem[];
};

const sections: DocumentationSection[] = [
  {
    id: 'product',
    label: 'Product',
    path: '/docs/product',
    icon: BookOpen,
    description: 'The product definition, intended users, core journeys, requirements, decisions, and roadmap.',
    items: [
      { name: 'README.md', type: 'Product index and orientation', status: 'Living' },
      { name: 'product-charter.md', type: 'Problem, promise, users, and boundaries', status: 'Draft' },
      { name: 'whatsapp-experience.md', type: 'Conversation and interaction specification', status: 'Required' },
      { name: 'roadmap.md', type: 'Milestones, sequencing, and dependencies', status: 'Living' },
      { name: 'decision-log.md', type: 'Material product decisions and rationale', status: 'Planned' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    path: '/skills',
    icon: Bot,
    description: 'The reusable assistant behaviors, instructions, tools, triggers, evaluations, and safe fallbacks.',
    items: [
      { name: 'README.md', type: 'Skill architecture and contribution guide', status: 'Required' },
      { name: 'conversation-triage/SKILL.md', type: 'Classify intent, urgency, and ownership', status: 'Draft' },
      { name: 'follow-up/SKILL.md', type: 'Identify and prepare open-loop follow-ups', status: 'Planned' },
      { name: 'scope-change/SKILL.md', type: 'Detect evidence of changed work or commitments', status: 'Planned' },
      { name: 'executive-brief/SKILL.md', type: 'Prepare an evidence-linked operating brief', status: 'Draft' },
      { name: 'evals/', type: 'Skill test cases, graders, and regression results', status: 'Required' },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    path: '/docs/architecture',
    icon: Workflow,
    description: 'System boundaries, data flow, integrations, model routing, observability, and deployment decisions.',
    items: [
      { name: 'README.md', type: 'Architecture map and system ownership', status: 'Living' },
      { name: 'whatsapp-integration.md', type: 'WhatsApp connection, webhooks, and messaging rules', status: 'Draft' },
      { name: 'context-and-memory.md', type: 'Identity, retrieval, memory, and retention design', status: 'Required' },
      { name: 'model-routing.md', type: 'Model selection, fallbacks, and cost controls', status: 'Planned' },
      { name: 'observability.md', type: 'Logs, traces, metrics, alerts, and incident signals', status: 'Planned' },
      { name: 'adrs/', type: 'Architecture decision records', status: 'Required' },
    ],
  },
  {
    id: 'safety',
    label: 'Safety & Privacy',
    path: '/docs/safety-privacy',
    icon: ShieldCheck,
    description: 'The controls and evidence required to handle real business communication responsibly.',
    items: [
      { name: 'README.md', type: 'Trust program index and ownership', status: 'Required', locked: true },
      { name: 'privacy-model.md', type: 'Data categories, purposes, controls, and processors', status: 'Draft', locked: true },
      { name: 'consent-and-notice.md', type: 'Participant notice and lawful-use requirements', status: 'Required', locked: true },
      { name: 'data-retention.md', type: 'Retention schedules and deletion workflows', status: 'Planned', locked: true },
      { name: 'access-control.md', type: 'Roles, permissions, authentication, and review', status: 'Draft', locked: true },
      { name: 'incident-response.md', type: 'Security and privacy incident playbook', status: 'Required', locked: true },
      { name: 'ai-safety-evals.md', type: 'Risk taxonomy, evaluation suites, and thresholds', status: 'Planned', locked: true },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    path: '/docs/operations',
    icon: Braces,
    description: 'The repeatable guides for local development, deployment, customer onboarding, and incident handling.',
    items: [
      { name: 'README.md', type: 'Operating handbook and owners', status: 'Required' },
      { name: 'local-development.md', type: 'Environment setup and test workflow', status: 'Living' },
      { name: 'deployment.md', type: 'Release, rollback, and environment guide', status: 'Draft' },
      { name: 'customer-onboarding.md', type: 'Configuration, consent, validation, and launch', status: 'Planned' },
      { name: 'runbooks/', type: 'Production operations and recovery procedures', status: 'Required' },
    ],
  },
];

const statusStyles: Record<DocumentItem['status'], string> = {
  Draft: 'bg-amber-50 text-amber-800',
  Planned: 'bg-neutral-100 text-neutral-600',
  Living: 'bg-emerald-50 text-emerald-800',
  Required: 'bg-sky-50 text-sky-800',
};

function DocumentRow({ item }: { item: DocumentItem }) {
  const Icon = item.locked ? LockKeyhole : item.name.endsWith('/') ? Folder : item.name.includes('SKILL') ? Bot : item.name.endsWith('.md') ? FileText : FileCode2;
  return (
    <div className="flex items-center justify-between gap-4 border border-neutral-200 bg-white p-4 transition hover:border-black">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-neutral-100 text-neutral-500">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs font-semibold text-black sm:text-sm">{item.name}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{item.type}</p>
        </div>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusStyles[item.status]}`}>
        {item.status}
      </span>
    </div>
  );
}

function StructurePreview(): ReactNode {
  return (
    <div className="font-mono text-[11px] leading-6 text-neutral-300 sm:text-xs">
      <p className="text-white">jason-ai/</p>
      <p>├── README.md</p>
      <p>├── docs/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── product/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── architecture/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── safety-privacy/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; └── operations/</p>
      <p>├── skills/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── conversation-triage/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── follow-up/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; ├── scope-change/</p>
      <p className="text-neutral-500">│&nbsp;&nbsp; └── evals/</p>
      <p>└── src/</p>
    </div>
  );
}

export default function JasonAIDocumentationPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0];
  const currentIndex = sections.findIndex((section) => section.id === currentSection.id);
  const nextSection = sections[currentIndex + 1];
  const CurrentIcon = currentSection.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI Product Documentation"
        description="Private product documentation structure for JasonAI product, skills, architecture, safety, privacy, and operations."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className={projectPageHeaderClassName}>
          <Link
            to={jasonAIInternalRoutes.proposal}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:bg-neutral-200 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Proposal
          </Link>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">JasonAI</span>
            <span className="text-neutral-300">•</span>
            <span>Documentation</span>
          </div>

          <div className={projectHeroGridClassNames.profile}>
            <div>
              <h1 className={projectPageHeroTitleClassName}>Product Documentation</h1>
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                The working file structure for the product—connecting strategy to specifications, skills, architecture, safety, privacy, and operations.
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  ['Repository', 'jason-ai'],
                  ['Structure', '5 Core Areas'],
                  ['Status', 'Framework'],
                ].map(([label, value], index) => (
                  <div key={label} className={`border border-neutral-200 p-4 text-sm ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{label}</span>
                    <span className="mt-2 block font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Proposed root</p>
              <StructurePreview />
              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-neutral-500">
                This portal is the documentation index. Files can later resolve to repository content, rendered Markdown, or controlled internal documents.
              </p>
            </aside>
          </div>
        </header>

        <main>
          <div className="grid gap-3 border-b border-neutral-100 pb-4 sm:grid-cols-5">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center justify-between gap-3 border px-4 py-3 text-left text-xs font-medium transition ${
                    active ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition sm:hidden ${active ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={currentSection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="mt-8"
            >
              <div className="mb-6 flex items-start gap-3">
                <div className="border border-neutral-200 p-2">
                  <CurrentIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">{currentSection.path}</p>
                  <h2 className={`mt-1 ${projectPageSectionTitleClassName}`}>{currentSection.label}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{currentSection.description}</p>
                </div>
              </div>

              <div className="grid gap-3">
                {currentSection.items.map((item) => (
                  <div key={item.name}>
                    <DocumentRow item={item} />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-neutral-400">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                </p>
                {nextSection ? (
                  <button
                    type="button"
                    onClick={() => setActiveSection(nextSection.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-black"
                  >
                    {nextSection.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <Link to={jasonAIInternalRoutes.proposal} className="inline-flex items-center gap-2 text-sm font-medium text-black">
                    Back to Proposal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </main>
      </motion.div>
      <Footer />
    </article>
  );
}
