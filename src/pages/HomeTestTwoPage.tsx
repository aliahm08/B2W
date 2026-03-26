import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, Eye, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import FloatingProposalCTA from '../components/FloatingProposalCTA';
import Navbar from '../components/Navbar';
import OurProcess from '../components/OurProcess';
import Seo from '../components/Seo';
import Team from '../components/Team';
import {
  getRankedProjectAreas,
  homeTestCapabilities,
  homeTestExpertise,
  homeTestProjectAreaLookup,
  type HomeTestCapabilityId,
  type HomeTestExpertiseId,
  type HomeTestProjectAreaId,
} from '../content/homeTestTwo';

function toggleStringValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

const projectAreaScoping: Record<
  HomeTestProjectAreaId,
  {
    scopeLabel: string;
    scoping: string[];
    contracting: string[];
  }
> = {
  'profile-build': {
    scopeLabel: 'Profile Build Scope',
    scoping: ['Narrative Scope', 'Profile Architecture', 'Positioning Package'],
    contracting: ['Fixed Scope', 'Single Build', 'One Approval Cycle'],
  },
  'model-build': {
    scopeLabel: 'Model Build Scope',
    scoping: ['Model Inputs', 'Scenario Set', 'Economics Review'],
    contracting: ['Model Build', 'Revision Window', 'Working Session'],
  },
  'documentation-build': {
    scopeLabel: 'Documentation Scope',
    scoping: ['Record Set', 'Evidence Stack', 'Diligence Package'],
    contracting: ['Phased Delivery', 'Document Review', 'Final Compilation'],
  },
  'integrated-proposal': {
    scopeLabel: 'Integrated Scope',
    scoping: ['Profile Layer', 'Model Layer', 'Documentation Layer'],
    contracting: ['Multi-Phase Scope', 'Milestone Contract', 'Integrated Delivery'],
  },
};

const capabilityDeliverables: Record<HomeTestCapabilityId, string[]> = {
  'marketing-data': [
    'Demand signal audit covering acquisition channels, conversion drop-off, and local discovery performance',
    'Messaging and funnel brief tied to the selected project type',
  ],
  financials: [
    'Revenue, margin, and pricing review with the key assumptions made explicit',
    'Operating economics summary to support proposal decisions',
  ],
  'operational-performance': [
    'Workflow and execution review showing where delivery or service friction is slowing the business down',
    'Operational constraints summary for staffing, SOPs, and throughput risk',
  ],
};

const expertiseDeliverables: Record<HomeTestExpertiseId, string[]> = {
  growth: [
    'Growth lane recommendations with the next highest-leverage demand opportunities',
    'Priority experiments or rollout moves aligned to the selected scope',
  ],
  optimization: [
    'Optimization lane recommendations focused on margin, workflow quality, and execution reliability',
    'System change list showing where automation, tooling, or process redesign matters most',
  ],
  diligence: [
    'Diligence lane packet organizing assumptions, records, and proof points for review',
    'Decision-ready documentation summary for leadership, lenders, or buyer conversations',
  ],
};

const timelineTemplates: Record<
  HomeTestProjectAreaId,
  {
    week: string;
    title: string;
    detail: string;
  }[]
> = {
  'profile-build': [
    { week: 'Week 1', title: 'Intake and narrative audit', detail: 'We collect source material, align on positioning, and confirm the proposal angle.' },
    { week: 'Week 2', title: 'Profile draft build', detail: 'The core profile, supporting story, and scope framing are assembled into the first proposal draft.' },
    { week: 'Week 3', title: 'Review and approval', detail: 'We revise, finalize, and prepare the approved materials for handoff or next-phase execution.' },
  ],
  'model-build': [
    { week: 'Week 1', title: 'Input alignment', detail: 'We gather assumptions, financial inputs, and operating constraints for the model structure.' },
    { week: 'Week 2', title: 'Scenario model build', detail: 'We build the model, stress test scenarios, and connect tradeoffs to the project scope.' },
    { week: 'Week 3', title: 'Decision review', detail: 'We review outputs with the client and refine the recommendation set.' },
  ],
  'documentation-build': [
    { week: 'Week 1', title: 'Records intake', detail: 'We map the available material, identify missing items, and structure the documentation stack.' },
    { week: 'Week 2', title: 'Evidence and proof packaging', detail: 'We build the diligence packet and organize source materials into a cleaner review flow.' },
    { week: 'Week 3', title: 'Final diligence review', detail: 'We finalize the packet and confirm readiness for internal or external review.' },
  ],
  'integrated-proposal': [
    { week: 'Week 1', title: 'Discovery and scope lock', detail: 'We align on capabilities, expertise lanes, and the final project shape.' },
    { week: 'Week 2', title: 'Proposal and deliverable build', detail: 'We assemble profile, model, and documentation layers into one proposal environment.' },
    { week: 'Week 3', title: 'Client review and revisions', detail: 'We walk through the preview, tighten scope, and confirm the accepted plan.' },
    { week: 'Week 4', title: 'Launch into delivery', detail: 'The accepted proposal turns into the live engagement timeline and execution plan.' },
  ],
};

export default function HomeTestTwoPage() {
  const [selectedCapabilityIds, setSelectedCapabilityIds] = useState<HomeTestCapabilityId[]>([]);
  const [selectedExpertiseIds, setSelectedExpertiseIds] = useState<HomeTestExpertiseId[]>([]);
  const [selectedProjectAreaId, setSelectedProjectAreaId] = useState<HomeTestProjectAreaId | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSectionId, setOpenSectionId] = useState('capabilities');
  const [timelineDecision, setTimelineDecision] = useState<'accepted' | 'rejected' | null>(null);

  const rankedProjectAreas = useMemo(
    () => getRankedProjectAreas(selectedCapabilityIds, selectedExpertiseIds),
    [selectedCapabilityIds, selectedExpertiseIds],
  );

  useEffect(() => {
    if (!selectedProjectAreaId && rankedProjectAreas[0]) {
      setSelectedProjectAreaId(rankedProjectAreas[0].id);
      return;
    }

    if (selectedProjectAreaId && !rankedProjectAreas.some((item) => item.id === selectedProjectAreaId)) {
      setSelectedProjectAreaId(rankedProjectAreas[0]?.id ?? null);
    }
  }, [rankedProjectAreas, selectedProjectAreaId]);

  const selectedProjectArea = selectedProjectAreaId ? homeTestProjectAreaLookup[selectedProjectAreaId] : null;
  const selectedScoping = selectedProjectAreaId ? projectAreaScoping[selectedProjectAreaId] : null;
  const isComplete = selectedCapabilityIds.length > 0 && selectedExpertiseIds.length > 0 && Boolean(selectedProjectAreaId);
  const selectedCapabilityItems = homeTestCapabilities.filter((item) => selectedCapabilityIds.includes(item.id));
  const selectedExpertiseItems = homeTestExpertise.filter((item) => selectedExpertiseIds.includes(item.id));
  const proposalDeliverables = Array.from(
    new Set([
      ...(selectedCapabilityIds.flatMap((id) => capabilityDeliverables[id] ?? [])),
      ...(selectedExpertiseIds.flatMap((id) => expertiseDeliverables[id] ?? [])),
      ...(selectedProjectArea
        ? [
            `${selectedProjectArea.title} configured as the primary engagement structure`,
            'Proposal preview with deliverables, scope boundaries, and commercial terms',
          ]
        : []),
    ]),
  );
  const proposalScope = Array.from(
    new Set([
      ...(selectedScoping?.scoping ?? []),
      ...(selectedScoping?.contracting ?? []),
      ...(selectedCapabilityItems.map((item) => item.title) ?? []),
      ...(selectedExpertiseItems.map((item) => item.title) ?? []),
    ]),
  );
  const timelineSteps = selectedProjectAreaId ? timelineTemplates[selectedProjectAreaId] : [];

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (selectedCapabilityIds.length === 0) {
      setOpenSectionId('capabilities');
      return;
    }

    if (selectedExpertiseIds.length === 0) {
      setOpenSectionId('expertise-lanes');
      return;
    }

    if (!selectedProjectAreaId) {
      setOpenSectionId('project-types');
      return;
    }

    setOpenSectionId('proposal-preview');
  }, [selectedCapabilityIds, selectedExpertiseIds, selectedProjectAreaId]);

  useEffect(() => {
    setTimelineDecision(null);
  }, [selectedCapabilityIds, selectedExpertiseIds, selectedProjectAreaId]);

  return (
    <>
      <Seo
        title="B2W Home Test 2"
        description="Home test 2 with three selectable proposal sections."
        robots="noindex, nofollow"
      />

      <main className="min-h-screen bg-white text-black">
        <Navbar basePath="/home-test-2" />

        <section id="landing-hero" className="mx-auto max-w-7xl px-6 pb-16 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Proposal Builder</p>
            <h1 className="mt-5 text-5xl font-medium tracking-tight md:text-7xl md:leading-[0.92]">
              Home Test 2
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
              Select capabilities, expertise lanes, and a project type to build a proposal with deliverables, scope, pricing, and a reviewable timeline.
            </p>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="mt-8 inline-flex items-center gap-3 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Begin New Project
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="border-t border-neutral-200 pt-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border border-neutral-200 bg-white p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Capabilities</p>
                <p className="mt-4 text-3xl font-medium tracking-tight text-black">{selectedCapabilityIds.length}</p>
              </div>
              <div className="border border-neutral-200 bg-white p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Expertise Lanes</p>
                <p className="mt-4 text-3xl font-medium tracking-tight text-black">{selectedExpertiseIds.length}</p>
              </div>
              <div className="border border-neutral-200 bg-white p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Project Type</p>
                <p className="mt-4 text-xl font-medium tracking-tight text-black">{selectedProjectArea?.title ?? 'Pending'}</p>
              </div>
            </div>
          </div>
        </section>

        <OurProcess />
        <Team />
        <Footer />

        <AnimatePresence>
          {isDrawerOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setIsDrawerOpen(false)}
              />
              <motion.aside
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto border-t border-black/10 bg-white shadow-[0_-24px_80px_rgba(0,0,0,0.18)]"
              >
                <div className="sticky top-0 z-10 border-b border-black/10 bg-white/95 px-6 py-4 backdrop-blur">
                  <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Start New Project</p>
                      <h2 className="mt-1 text-xl font-medium tracking-tight text-black">Project Builder</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 transition-colors hover:border-black"
                      aria-label="Close project drawer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mx-auto max-w-6xl px-6 py-6">
                  <div className="grid gap-3">
                    {[
                      {
                        id: 'capabilities',
                        step: '01',
                        interactionLabel: 'Capabilities',
                        interactionDetail: `${selectedCapabilityIds.length} selected`,
                        title: 'Select Capabilities',
                        content: (
                          <div className="grid gap-3 md:grid-cols-3">
                            {homeTestCapabilities.map((item) => {
                              const isSelected = selectedCapabilityIds.includes(item.id);

                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setSelectedCapabilityIds((current) => toggleStringValue(current, item.id))}
                                  className={`flex min-h-40 flex-col justify-between border p-4 text-left transition-colors ${
                                    isSelected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-black'
                                  }`}
                                >
                                  <div>
                                    <p className="text-sm font-medium text-black">{item.title}</p>
                                    <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {item.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="border border-black/10 bg-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-600"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <span
                                    className={`mt-6 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                                      isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ),
                      },
                      {
                        id: 'expertise-lanes',
                        step: '02',
                        interactionLabel: 'Expertise Lanes',
                        interactionDetail: `${selectedExpertiseIds.length} selected`,
                        title: 'Select Expertise Lanes',
                        content: (
                          <div className="grid gap-3 md:grid-cols-3">
                            {homeTestExpertise.map((item) => {
                              const isSelected = selectedExpertiseIds.includes(item.id);

                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setSelectedExpertiseIds((current) => toggleStringValue(current, item.id))}
                                  className={`flex min-h-40 flex-col justify-between border p-4 text-left transition-colors ${
                                    isSelected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-black'
                                  }`}
                                >
                                  <div>
                                    <p className={`text-sm font-medium ${item.accentClassName}`}>{item.title}</p>
                                    <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
                                    <div className="mt-4">
                                      <span
                                        className={`inline-flex border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${item.borderClassName} bg-white text-neutral-700`}
                                      >
                                        Expertise Lane
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`mt-6 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                                      isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ),
                      },
                      {
                        id: 'project-types',
                        step: '03',
                        interactionLabel: 'Project Types',
                        interactionDetail: selectedProjectArea?.title ?? 'Pending',
                        title: 'Choose a Project Type',
                        content: (
                          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                            <div className="grid gap-3">
                              {rankedProjectAreas.map((projectArea) => {
                                const isSelected = selectedProjectAreaId === projectArea.id;

                                return (
                                  <button
                                    key={projectArea.id}
                                    type="button"
                                    onClick={() => setSelectedProjectAreaId(projectArea.id)}
                                    className={`flex items-start justify-between gap-4 border p-4 text-left transition-colors ${
                                      isSelected ? 'border-black bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-black'
                                    }`}
                                  >
                                    <div>
                                      <p className={`text-[11px] font-mono uppercase tracking-[0.18em] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        {projectArea.serviceType}
                                      </p>
                                      <p className={`mt-2 text-sm font-medium ${isSelected ? 'text-white' : 'text-black'}`}>{projectArea.title}</p>
                                      <p className={`mt-3 text-sm leading-6 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>{projectArea.summary}</p>
                                      <div className="mt-4 flex flex-wrap gap-2">
                                        {projectArea.tags.map((tag) => (
                                          <span
                                            key={tag}
                                            className={`border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${
                                              isSelected
                                                ? 'border-white/20 bg-white/10 text-white'
                                                : 'border-black/10 bg-white text-neutral-600'
                                            }`}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <span
                                      className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                                        isSelected ? 'border-white bg-white text-black' : 'border-black/15 text-transparent'
                                      }`}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="border border-neutral-200 bg-neutral-50 p-4">
                              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                                {selectedProjectArea?.title ?? 'Project Area'}
                              </p>
                              <p className="mt-3 text-sm leading-6 text-neutral-600">
                                {selectedProjectArea?.detail ?? 'Choose a project type to preview the proposal scope and commercial structure.'}
                              </p>

                              <div className="mt-5">
                                <p className="text-sm font-medium text-black">{selectedScoping?.scopeLabel ?? 'Scope'}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {selectedScoping?.scoping.map((item) => (
                                    <span
                                      key={item}
                                      className="border border-black/10 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700"
                                    >
                                      {item}
                                    </span>
                                  )) ?? null}
                                </div>
                              </div>

                              <div className="mt-6">
                                <p className="text-sm font-medium text-black">Delivery Terms</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {selectedScoping?.contracting.map((item) => (
                                    <span
                                      key={item}
                                      className="border border-black/10 bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700"
                                    >
                                      {item}
                                    </span>
                                  )) ?? null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: 'proposal-preview',
                        step: '04',
                        interactionLabel: 'Proposal Preview',
                        interactionDetail: isComplete ? 'Ready' : 'Locked',
                        title: 'Review Deliverables and Scope',
                        content: (
                          <div className="border border-neutral-200 bg-neutral-50 p-5">
                            <div className="flex items-center gap-3">
                              <Eye className="h-4 w-4 text-black" />
                              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Proposal Preview</p>
                            </div>
                            {isComplete ? (
                              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                                <div>
                                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Deliverables</p>
                                  <div className="mt-3 grid gap-3">
                                    {proposalDeliverables.map((item) => (
                                      <div key={item} className="border border-black/10 bg-white p-4">
                                        <p className="text-sm leading-6 text-neutral-700">{item}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="border border-black/10 bg-white p-4">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Scope</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {proposalScope.map((item) => (
                                        <span key={item} className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700">
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mt-4 border border-black bg-black p-4 text-white">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">Pricing</p>
                                    <p className="mt-3 text-3xl font-medium tracking-tight">$1,000/month</p>
                                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                                      Introductory pricing applies to the first 3 accepted projects. After those 3 slots are taken, pricing returns to the standard starting range of $10,000+/month.
                                    </p>
                                  </div>
                                  <div className="mt-4 border border-black/10 bg-white p-4">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Selected Structure</p>
                                    <p className="mt-3 text-sm font-medium text-black">{selectedProjectArea?.title}</p>
                                    <p className="mt-2 text-sm leading-6 text-neutral-600">{selectedProjectArea?.summary}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-5 grid gap-3 md:grid-cols-3">
                                <div className="border border-dashed border-neutral-300 bg-white p-4" />
                                <div className="border border-dashed border-neutral-300 bg-white p-4" />
                                <div className="border border-dashed border-neutral-300 bg-white p-4" />
                              </div>
                            )}
                          </div>
                        ),
                      },
                      {
                        id: 'timeline',
                        step: '05',
                        interactionLabel: 'Timeline',
                        interactionDetail:
                          !isComplete ? 'Locked' : timelineDecision === 'accepted' ? 'Accepted' : timelineDecision === 'rejected' ? 'Rejected' : 'Awaiting decision',
                        title: 'Accept or Reject Timeline',
                        content: (
                          <div className="border border-neutral-200 bg-neutral-50 p-5">
                            {isComplete ? (
                              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
                                <div className="grid gap-3">
                                  {timelineSteps.map((item) => (
                                    <div key={`${item.week}-${item.title}`} className="border border-black/10 bg-white p-4">
                                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">{item.week}</p>
                                      <p className="mt-2 text-sm font-medium text-black">{item.title}</p>
                                      <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="border border-black/10 bg-white p-4">
                                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Decision</p>
                                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                                    If the proposal preview looks right, the client can accept this timeline and move forward. Otherwise they can reject it and request revisions.
                                  </p>
                                  <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setTimelineDecision('accepted')}
                                      className={`border px-4 py-2 text-sm font-medium transition-colors ${
                                        timelineDecision === 'accepted'
                                          ? 'border-black bg-black text-white'
                                          : 'border-black/15 bg-white text-black hover:border-black'
                                      }`}
                                    >
                                      Accept Timeline
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setTimelineDecision('rejected')}
                                      className={`border px-4 py-2 text-sm font-medium transition-colors ${
                                        timelineDecision === 'rejected'
                                          ? 'border-black bg-neutral-900 text-white'
                                          : 'border-black/15 bg-white text-black hover:border-black'
                                      }`}
                                    >
                                      Reject Timeline
                                    </button>
                                  </div>
                                  <div className="mt-5 border-t border-black/10 pt-4">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Status</p>
                                    <p className="mt-2 text-sm font-medium text-black">
                                      {timelineDecision === 'accepted'
                                        ? 'Timeline accepted'
                                        : timelineDecision === 'rejected'
                                          ? 'Timeline rejected'
                                          : 'No decision yet'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="border border-dashed border-neutral-300 bg-white p-4" />
                            )}
                          </div>
                        ),
                      },
                    ].map((section) => {
                      const isOpen = openSectionId === section.id;

                      return (
                        <div
                          key={section.id}
                          className={`border-t transition-colors ${isOpen ? 'border-neutral-900' : 'border-neutral-200'}`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenSectionId((current) => (current === section.id ? '' : section.id))}
                            className="flex w-full items-start gap-6 px-0 py-6 text-left"
                            aria-expanded={isOpen}
                          >
                            <div className="min-w-14 pt-1 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                              {section.step}
                            </div>
                            <div className="flex-1">
                              <div className="mb-3 flex flex-wrap items-center gap-3">
                                <span
                                  className={`border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] ${
                                    isOpen
                                      ? 'border-neutral-900 bg-neutral-900 text-white'
                                      : 'border-neutral-300 bg-white text-neutral-500'
                                  }`}
                                >
                                  {section.interactionLabel}
                                </span>
                                <span className="text-xs text-neutral-400">{section.interactionDetail}</span>
                              </div>
                              <h3 className={`text-xl font-medium tracking-tight md:text-2xl ${isOpen ? 'text-neutral-950' : 'text-neutral-700'}`}>
                                {section.title}
                              </h3>
                            </div>
                            <ChevronDown
                              className={`mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen ? (
                              <motion.div
                                key={`${section.id}-content`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-neutral-200 py-6">{section.content}</div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <FloatingProposalCTA
          label={selectedProjectArea?.title ?? 'Project Builder'}
          detail={timelineDecision === 'accepted' ? 'Timeline accepted' : isComplete ? 'Proposal ready' : 'Section by section'}
          onClick={() => setIsDrawerOpen(true)}
          buttonLabel="Begin New Project"
        />
      </main>
    </>
  );
}
