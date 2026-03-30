import { motion } from 'motion/react';
import { ArrowRight, BookOpenText, BriefcaseBusiness, FileStack, LayoutPanelTop, ShieldCheck, Sparkles, TimerReset, Waypoints, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientCommunicationForm from '../../components/forms/ClientCommunicationForm';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const valueAdds = [
  {
    title: 'Engineer the actual workflow',
    body: 'We build around the real internal path from brief to review to presentation, instead of shipping disconnected AI demos.',
    icon: Workflow,
  },
  {
    title: 'Reduce narrative and coordination drag',
    body: 'Project memory, retrieval, summarization, and assembly become faster and less dependent on scattered manual work.',
    icon: TimerReset,
  },
  {
    title: 'Create reusable internal infrastructure',
    body: 'The value compounds because each pilot becomes a reusable operating layer for future teams and projects.',
    icon: Waypoints,
  },
  {
    title: 'Keep design judgment in the studio',
    body: 'The systems are structured to support partner and team review, not to replace authorship or critical decision-making.',
    icon: Sparkles,
  },
] as const;

const overviewCards = [
  {
    title: 'Development Dashboard',
    to: `${fosterPartnersBasePath}/development-dashboard`,
    body:
      'The product-facing side of the portal, where design, build, and development lifecycle demos explain the AI development plan before integration begins.',
    icon: LayoutPanelTop,
    note: 'Contains interactive demo subpages',
  },
  {
    title: 'Scope',
    to: `${fosterPartnersBasePath}/scope`,
    body:
      'What B2W is being retained to build, which workflows are in phase one, and where the engagement boundaries sit.',
    icon: FileStack,
    note: 'Contract overview page',
  },
  {
    title: 'Operating Model',
    to: `${fosterPartnersBasePath}/operating-model`,
    body:
      'How we embed with Foster + Partners, run working sessions, prototype against live workflows, and move from pilot to wider rollout.',
    icon: BriefcaseBusiness,
    note: 'Contract overview page',
  },
  {
    title: 'Governance',
    to: `${fosterPartnersBasePath}/governance`,
    body:
      'How approvals, human review, information handling, and model behavior are structured so the system is usable at firm level.',
    icon: ShieldCheck,
    note: 'Contract overview page',
  },
  {
    title: 'Terms',
    to: `${fosterPartnersBasePath}/terms`,
    body:
      'Commercial framing, assumptions, change control, IP allocation, confidentiality, and the working shape of the contract.',
    icon: BookOpenText,
    note: 'Contract overview page',
  },
] as const;

const workflowRead = [
  {
    title: 'Design communications is a systems problem',
    body:
      'The bottleneck is rarely one missing image or one missing sentence. It is the repeated work of retrieving context, aligning reviewers, packaging options, and preserving narrative consistency across teams.',
  },
  {
    title: 'The right AI layer is internal and operational',
    body:
      'The most useful systems for Foster + Partners are engines that help teams brief, retrieve, review, summarize, and assemble. They need to strengthen the studio workflow, not distract from it.',
  },
  {
    title: 'The first win should be concrete',
    body:
      'A contained pilot around one live workflow is the right starting point. It lets the firm evaluate speed, trust, review quality, and engineering fit before broader adoption.',
  },
] as const;

export default function FosterPartnersOverviewPage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | B2W Partnership Overview"
      seoDescription="Overview of a proposed development partnership between B2W and Foster + Partners."
      eyebrow="Partnership Overview"
      heading="B2W as the development partner for Foster + Partners."
      summary="This homepage is the overview of the proposed partnership. It is built to explain how we see the opportunity, how we understand the workflow around Narinder Sagoo and the wider firm, and how the contract would be structured across dedicated subpages."
      asideLabel="Overview"
      asideHeading="A portal for the partnership, not a one-off pitch."
      asideSummary="The overview page frames the relationship. The contract-defining details live in separate pages so each workstream can be reviewed clearly and negotiated directly."
      metrics={[
        { label: 'Client', value: 'Foster + Partners' },
        { label: 'Primary sponsor', value: 'Narinder Sagoo' },
        { label: 'Role for B2W', value: 'Development partner' },
        { label: 'Portal split', value: 'Overview + dashboard' },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {valueAdds.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="border border-neutral-200 bg-neutral-50 p-5">
              <div className="inline-flex border border-neutral-200 bg-white p-3 text-black">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-medium tracking-tight text-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="border border-neutral-900 bg-neutral-950 p-6 text-white">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Value-add map</p>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)_64px_minmax(0,1fr)] md:items-center">
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Current state</p>
              <p className="mt-3 text-sm leading-6 text-neutral-200">Project context, reviews, and presentation logic are distributed across decks, folders, notes, and people.</p>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <ArrowRight className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">B2W layer</p>
              <p className="mt-3 text-sm leading-6 text-neutral-200">We engineer project memory, retrieval, review tracking, and presentation assembly into one operational system.</p>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <ArrowRight className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Firm outcome</p>
              <p className="mt-3 text-sm leading-6 text-neutral-200">Faster story formation, clearer handoffs, reusable studio intelligence, and more controlled AI adoption.</p>
            </div>
          </div>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">How the portal is split</p>
          <div className="mt-5 space-y-4">
            <div className="border border-neutral-200 p-4">
              <p className="text-sm font-medium text-black">1. Overview</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Use this side of the portal for the relationship itself: scope, operating model, governance, and terms.</p>
            </div>
            <div className="border border-neutral-200 p-4">
              <p className="text-sm font-medium text-black">2. Development Dashboard</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Use the dashboard side for the product we plan to develop before integration: lifecycle demos, module logic, and pre-integration review.</p>
            </div>
            <div className="border border-neutral-200 p-4">
              <p className="text-sm font-medium text-black">3. Redline in context</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Review contract pages and dashboard pages separately so commercial discussion and product discussion do not get mixed together.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.to}
              className="group border border-neutral-200 bg-white p-5 transition-colors hover:border-black"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="border border-neutral-200 p-3 text-black transition-colors group-hover:border-black">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-black" />
              </div>
              <h2 className="mt-6 text-xl font-medium tracking-tight text-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
              <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">{item.note}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">What the overview covers</p>
          <div className="mt-5 space-y-4">
            {[
              ...workflowRead,
              {
                title: 'The dashboard handles the development narrative',
                body:
                  'The AI development plan, demo logic, and lifecycle sequencing now live in the development dashboard so the overview stays focused on the partnership framework itself.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-neutral-200 p-4">
                <h3 className="text-lg font-medium tracking-tight text-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-950 p-6 text-white">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Partnership thesis</p>
          <p className="mt-4 text-sm leading-6 text-neutral-300">
            Foster + Partners does not need generic AI experimentation. The firm needs engineers who can build the
            internal systems behind high-stakes design communication: project memory, retrieval, review capture,
            presentation assembly, and controlled deployment into real studio workflows.
          </p>
          <p className="mt-4 text-sm leading-6 text-neutral-300">
            That is the partnership model here. B2W would be retained as the development partner to build and maintain that layer with the same
            seriousness the firm applies to design quality itself.
          </p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-32 border-t border-neutral-200 pt-10 md:pt-12">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
          <ClientCommunicationForm
            clientName="Foster + Partners"
            projectName="Foster + Partners Development Partnership"
            title="Send a message to B2W"
            intro="Use this channel for comments on the partnership overview, requests for a scoped pilot, or contract redlines on the linked pages."
          />
        </motion.div>
      </section>
    </FosterPartnersPageFrame>
  );
}
