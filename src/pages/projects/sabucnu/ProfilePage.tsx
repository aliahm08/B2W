import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Cog,
  ClipboardList,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import Seo from '../../../components/Seo';
import {
  projectPageShellClassName,
  projectPageHeaderClassName,
  projectPageBackLinkClassName,
  projectPageEyebrowClassName,
  projectHeroGridClassNames,
} from '../../../components/projectPageLayout';
import ResponsiveAccordionSection from '../../../components/ResponsiveAccordionSection';

const scorecards = [
  { label: 'Active Crews', value: '12–18', detail: 'field teams across the DMV region' },
  { label: 'Coordination Load', value: 'High', detail: 'daily scheduling changes, multi-site' },
  { label: 'Current Systems', value: 'Manual', detail: 'phone calls, texts, spreadsheets' },
  { label: 'Service Type', value: 'Implementation', detail: 'full operations buildout' },
];

const operationalGaps = [
  {
    title: 'Scheduling fragmentation',
    body: 'Crew assignments are managed through a mix of phone calls, group texts, and spreadsheets. Changes propagate slowly and create downstream confusion on jobsites.',
  },
  {
    title: 'No centralized task tracking',
    body: 'There is no single system of record for what each crew is doing on any given day. Supervisors rely on memory and direct check-ins.',
  },
  {
    title: 'SOP inconsistency',
    body: 'Standard operating procedures exist informally but are not documented, versioned, or enforced. New crew members learn on-the-job without reference material.',
  },
  {
    title: 'Communication bottlenecks',
    body: 'All operational questions flow through one or two managers, creating a single point of failure for decisions that could be handled by documented workflows.',
  },
];

const proposedDeliverables = [
  {
    title: 'Workforce scheduling system',
    body: 'A centralized scheduling tool that replaces fragmented phone and text coordination with a shared calendar, automated crew assignment, and real-time updates.',
  },
  {
    title: 'SOP documentation and deployment',
    body: 'Standardized operating procedures for the 10–15 most repeated workflows, digitized and accessible from the field via mobile.',
  },
  {
    title: 'Field communication layer',
    body: 'A structured channel for crew-to-management communication that reduces ad-hoc interruptions and creates a searchable log of operational decisions.',
  },
  {
    title: 'Operations dashboard',
    body: 'A management-facing view of crew utilization, task completion rates, and scheduling adherence — built to surface problems before they compound.',
  },
];

const expectedOutcomes = [
  'Reduce daily scheduling coordination time by 40–60% through automation and self-serve crew visibility.',
  'Eliminate SOP ambiguity for the most common field workflows within the first 30 days.',
  'Create a searchable communication log that replaces untracked phone and text conversations.',
  'Give management real-time visibility into crew deployment without requiring direct check-ins.',
];

const sectionItems = [
  { id: 'context', label: 'Client Context' },
  { id: 'gaps', label: 'Operational Gaps' },
  { id: 'deliverables', label: 'Proposed Deliverables' },
  { id: 'outcomes', label: 'Expected Outcomes' },
];

export default function SabucnuProfilePage() {
  return (
    <article className={projectPageShellClassName}>
      <Seo
        title="Sabucnu Contractors — Operations"
        description="Operations engagement covering workforce coordination, scheduling automation, SOP deployment, and field-crew communication systems for a trade-services contractor."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={projectPageHeaderClassName}>
          <Link to="/#projects" className={projectPageBackLinkClassName}>
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Construction</span>
            <span className="text-neutral-300">•</span>
            <span>Operations</span>
          </div>

          <section className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
              Operations Implementation
            </p>

            <div className={projectHeroGridClassNames.operations}>
              <div>
                <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                  Sabucnu Contractors
                </h1>

                <p className="mb-5 max-w-3xl text-lg leading-relaxed text-neutral-200 md:text-xl">
                  An operations engagement designed to replace fragmented field coordination
                  with structured scheduling, documented SOPs, and a management-facing
                  operations layer.
                </p>

                <p className="mb-8 max-w-3xl text-sm leading-6 text-neutral-300">
                  Proposed engagement for a trade-services operator coordinating 12–18 field
                  crews across the DMV region. The current operating mode relies on manual
                  phone and text coordination with no centralized system of record.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Operations', 'SOPs', 'Workforce', 'Scheduling'].map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/20 bg-white/5 px-3 py-1 text-xs text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="space-y-4 border border-white/15 bg-white/5 p-5 md:p-6">
                <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                  Manual coordination at scale creates compounding operational risk.
                </h2>
                <p className="text-sm leading-6 text-neutral-300">
                  The business has grown past the point where phone-and-spreadsheet
                  coordination can reliably support daily operations across multiple
                  jobsites.
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {scorecards.map((card) => (
                    <div key={card.label} className="border border-white/15 bg-white/5 p-3">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                        {card.label}
                      </p>
                      <p className="font-medium">{card.value}</p>
                      <p className="mt-1 text-xs text-neutral-400">{card.detail}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        </header>

        <main className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7">
            <ResponsiveAccordionSection
              id="context"
              title="Client Context"
              icon={Users}
              defaultOpen
              className="border border-neutral-200 md:border-0"
              headerClassName="p-4 md:mb-4 md:p-0"
              bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
            >
              <div className="space-y-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                <p>
                  Sabucnu Contractors operates as a <strong className="font-semibold text-black">trade-services general contractor</strong> in
                  the Washington, DC metropolitan area. The company coordinates multiple
                  field crews across residential and commercial jobsites daily.
                </p>
                <p>
                  Growth has outpaced the systems that support it. What worked with 4–6
                  crews no longer scales to 12–18 without structural coordination
                  infrastructure.
                </p>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="gaps"
              title="Operational Gaps"
              icon={ClipboardList}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="space-y-6 p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <div className="space-y-6">
                {operationalGaps.map((item) => (
                  <div key={item.title}>
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                      {item.title}
                    </h4>
                    <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </ResponsiveAccordionSection>
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <ResponsiveAccordionSection
              id="deliverables"
              title="Proposed Deliverables"
              icon={Cog}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="space-y-6 p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <div className="space-y-6">
                {proposedDeliverables.map((item) => (
                  <div key={item.title}>
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                      {item.title}
                    </h4>
                    <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="outcomes"
              title="Expected Outcomes"
              icon={BarChart3}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                {expectedOutcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResponsiveAccordionSection>
          </aside>

          <div className="lg:col-span-12">
            <div className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-neutral-400" />
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                  Engagement Status
                </p>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  Proposed — March 2026
                </span>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-neutral-300">
                This engagement is currently in the proposal stage. The scope,
                timeline, and deliverables described above represent our recommended
                approach based on initial assessment. Final terms will be defined
                during the contracting phase.
              </p>
            </div>
          </div>
        </main>
      </motion.div>
    </article>
  );
}
