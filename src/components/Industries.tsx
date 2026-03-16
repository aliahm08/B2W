import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectPipelineContent, type ProjectCard } from '../content/projectPipeline';

function isExternalLink(value: string): boolean {
  return /^https?:\/\//.test(value);
}

const projectTypeOptions = ['All', 'Marketing', 'Operations', 'Financials'] as const;
const capacityOptions = ['All', 'Consulting', 'Implementation', 'Custom Solution'] as const;
const statusOptions = ['All', 'Proposed', 'In-progress', 'Complete'] as const;
const deliverableOptions = [
  'All',
  'Analysis',
  'Dashboard',
  'App',
  'ChatBot',
  'Agent',
  'Website',
  'Promotion',
  'Campaign',
  'Strategy',
  'Training',
  'SOPs',
] as const;

const deliverableKeywords: Record<(typeof deliverableOptions)[number], string[]> = {
  All: [],
  Analysis: ['analysis', 'profile', 'audit', 'diligence', 'assessment', 'buyer package'],
  Dashboard: ['dashboard', 'analytics dashboard', 'reporting'],
  App: ['app', 'application', 'prototype', 'mobile'],
  ChatBot: ['chatbot', 'chat bot'],
  Agent: ['agent', 'assistant', 'copilot', 'bot', 'automation'],
  Website: ['website', 'web design', 'seo', 'site'],
  Promotion: ['promotion', 'social media', 'instagram', 'advertising', 'ads'],
  Campaign: ['campaign', 'content', 'rollout', 'local growth'],
  Strategy: ['strategy', 'proposal', 'plan', 'roadmap'],
  Training: ['training', 'enablement', 'coaching'],
  SOPs: ['sop', 'workflow', 'playbook', 'process'],
};

const deliverableClasses: Record<string, string> = {
  Analysis: 'border-sky-400/30 bg-sky-400/12 text-sky-100',
  Dashboard: 'border-cyan-400/30 bg-cyan-400/12 text-cyan-100',
  App: 'border-violet-400/30 bg-violet-400/12 text-violet-100',
  ChatBot: 'border-fuchsia-400/30 bg-fuchsia-400/12 text-fuchsia-100',
  Agent: 'border-emerald-400/30 bg-emerald-400/12 text-emerald-100',
  Website: 'border-amber-400/30 bg-amber-400/12 text-amber-100',
  Promotion: 'border-rose-400/30 bg-rose-400/12 text-rose-100',
  Campaign: 'border-orange-400/30 bg-orange-400/12 text-orange-100',
  Strategy: 'border-lime-400/30 bg-lime-400/12 text-lime-100',
  Training: 'border-teal-400/30 bg-teal-400/12 text-teal-100',
  SOPs: 'border-stone-300/30 bg-stone-300/10 text-stone-100',
};

type ProjectCardViewModel = ProjectCard & {
  capacityLabel: string;
  deliverables: string[];
  statusLabel: string;
  typeLabel: string;
};

function getStatusClasses(status: string) {
  if (status === 'Complete') {
    return 'border-emerald-400/30 bg-emerald-400/15 text-emerald-100';
  }
  if (status === 'In-progress') {
    return 'border-amber-400/30 bg-amber-400/15 text-amber-100';
  }
  return 'border-neutral-700 bg-neutral-900 text-neutral-100';
}

function getDeliverableClasses(deliverable: string) {
  return deliverableClasses[deliverable] ?? 'border-neutral-700 bg-neutral-900 text-neutral-200';
}

function toSearchText(project: ProjectCard) {
  return [
    project.category,
    project.projectType,
    project.serviceType,
    project.status,
    project.clientDescription,
    project.title,
    project.description,
    project.impact,
    project.tags.map((tag) => tag.label).join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getProjectTypeLabel(project: ProjectCard) {
  const text = toSearchText(project);

  if (
    hasKeyword(text, [
      'financial',
      'finance',
      'ebitda',
      'pricing',
      'margin',
      'cash flow',
      'property sale',
      'sale',
      'acquisition',
      'buyer',
      'diligence',
    ])
  ) {
    return 'Financials';
  }

  if (
    hasKeyword(text, [
      'marketing',
      'instagram',
      'social',
      'seo',
      'website',
      'web design',
      'promotion',
      'campaign',
      'content',
      'brand',
      'growth',
    ])
  ) {
    return 'Marketing';
  }

  return 'Operations';
}

function getCapacityLabel(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes('implementation')) {
    return 'Implementation';
  }

  if (normalized.includes('custom')) {
    return 'Custom Solution';
  }

  return 'Consulting';
}

function getStatusLabel(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'complete' || normalized === 'completed') {
    return 'Complete';
  }

  if (normalized === 'in-progress' || normalized === 'in progress') {
    return 'In-progress';
  }

  return 'Proposed';
}

function getDeliverables(project: ProjectCard) {
  const text = toSearchText(project);
  const matchedDeliverables = deliverableOptions
    .filter((option) => option !== 'All')
    .filter((option) => hasKeyword(text, deliverableKeywords[option]));

  if (matchedDeliverables.length > 0) {
    return matchedDeliverables.slice(0, 4);
  }

  const projectTypeLabel = getProjectTypeLabel(project);

  if (projectTypeLabel === 'Financials') {
    return ['Analysis', 'Strategy'];
  }

  if (projectTypeLabel === 'Marketing') {
    return ['Strategy', 'Promotion'];
  }

  return ['SOPs', 'Agent'];
}

export default function Industries() {
  const { projects } = projectPipelineContent;
  const [selectedProjectType, setSelectedProjectType] = useState<(typeof projectTypeOptions)[number]>('All');
  const [selectedCapacity, setSelectedCapacity] = useState<(typeof capacityOptions)[number]>('All');
  const [selectedStatus, setSelectedStatus] = useState<(typeof statusOptions)[number]>('All');
  const [selectedDeliverable, setSelectedDeliverable] = useState<(typeof deliverableOptions)[number]>('All');

  const projectCards = useMemo<ProjectCardViewModel[]>(
    () =>
      projects.map((project) => ({
        ...project,
        capacityLabel: getCapacityLabel(project.projectType),
        deliverables: getDeliverables(project),
        statusLabel: getStatusLabel(project.status),
        typeLabel: getProjectTypeLabel(project),
      })),
    [projects],
  );

  const filteredProjects = useMemo(
    () => projectCards.filter((project) => {
      const matchesProjectType = selectedProjectType === 'All' || project.typeLabel === selectedProjectType;
      const matchesCapacity = selectedCapacity === 'All' || project.capacityLabel === selectedCapacity;
      const matchesStatus = selectedStatus === 'All' || project.statusLabel === selectedStatus;
      const matchesDeliverable =
        selectedDeliverable === 'All' || project.deliverables.includes(selectedDeliverable);

      return matchesProjectType && matchesCapacity && matchesStatus && matchesDeliverable;
    }),
    [projectCards, selectedProjectType, selectedCapacity, selectedStatus, selectedDeliverable],
  );

  const renderFilterGroup = (
    label: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="space-y-3">
      <span className="block text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === selectedValue;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:border-black hover:text-black'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">Projects</h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-neutral-600">
            Filter by project type, capacity, status, and deliverables. Every card follows the same three-part format:
            metadata on top, title and subtitle in the middle, and deliverables with date started at the bottom.
          </p>
          <div className="h-px w-full bg-neutral-200" />
        </motion.div>

        <div className="mb-8 mt-8 flex items-center justify-between gap-4 text-sm text-neutral-600">
          <span>
            Showing <span className="font-medium text-neutral-950">{filteredProjects.length}</span> of {projects.length}{' '}
            projects
          </span>
        </div>

        <div className="mb-12 border border-black/10 bg-neutral-50 p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-2">
            {renderFilterGroup('Project Type', [...projectTypeOptions], selectedProjectType, (value) =>
              setSelectedProjectType(value as (typeof projectTypeOptions)[number])
            )}
            {renderFilterGroup('Capacity', [...capacityOptions], selectedCapacity, (value) =>
              setSelectedCapacity(value as (typeof capacityOptions)[number])
            )}
            {renderFilterGroup('Status', [...statusOptions], selectedStatus, (value) =>
              setSelectedStatus(value as (typeof statusOptions)[number])
            )}
            {renderFilterGroup('Deliverables', [...deliverableOptions], selectedDeliverable, (value) =>
              setSelectedDeliverable(value as (typeof deliverableOptions)[number])
            )}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="border border-dashed border-black/20 bg-white px-8 py-16 text-center text-neutral-500">
            No projects match the current filter combination.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const hasLink = Boolean(project.link);
              const cardAriaLabel = `View ${project.title}`;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="group relative min-h-[360px] border border-neutral-800 bg-neutral-950 p-8 transition-colors duration-300 hover:border-neutral-600"
                >
                  {hasLink ? (
                    isExternalLink(project.link) ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label={cardAriaLabel}
                      />
                    ) : (
                      <Link to={project.link} className="absolute inset-0 z-10" aria-label={cardAriaLabel} />
                    )
                  ) : null}

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

                  <div className="relative grid h-full grid-rows-[auto,1fr,auto] gap-8">
                    <div>
                      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                        <span className="font-semibold text-stone-100">{project.typeLabel}</span>
                        <span className="text-neutral-700">•</span>
                        <span>{project.capacityLabel}</span>
                        <span className="text-neutral-700">•</span>
                        <span className={`inline-flex border px-2 py-1 text-[10px] tracking-[0.2em] ${getStatusClasses(project.statusLabel)}`}>
                          {project.statusLabel}
                        </span>
                      </div>

                      <div className="max-w-2xl">
                        <h3 className="mb-4 text-2xl font-medium text-stone-50 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-700">
                          {project.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-neutral-200 md:text-base">
                          {project.clientDescription}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-6">
                      <div className="grid gap-5">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                            Deliverables
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.deliverables.map((deliverable) => (
                              <span
                                key={`${project.id}-${deliverable}`}
                                className={`border px-2 py-1 text-xs ${getDeliverableClasses(deliverable)}`}
                              >
                                {deliverable}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                            Date Started
                          </p>
                          <span className="mt-3 inline-flex border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-stone-100">
                            {project.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
