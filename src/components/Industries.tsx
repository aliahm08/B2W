import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, LockKeyhole, MoveRight } from 'lucide-react';
import ProjectAccessPrompt from './ProjectAccessPrompt';
import ProjectTagPill from './ProjectTagPill';
import { projectPipelineContent } from '../content/projectPipeline';
import { protectedProjects } from '../content/projectAccess';

function isExternalLink(value: string): boolean {
  return /^https?:\/\//.test(value);
}

function getCardState(index: number, isProtected: boolean, hasLink: boolean) {
  if (!hasLink) {
    return {
      label: 'small-generic',
      articleClassName: 'min-h-[360px]',
      shellClassName: 'bg-[#f3f0e8]',
      accentClassName: 'bg-[linear-gradient(135deg,rgba(0,0,0,0.08),transparent_45%)]',
    };
  }

  if (isProtected) {
    return {
      label: 'expanded-specific',
      articleClassName: 'md:col-span-2 min-h-[420px]',
      shellClassName: 'bg-[#111111] text-white',
      accentClassName: 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%)]',
    };
  }

  if (index % 3 === 0) {
    return {
      label: 'expanded-generic',
      articleClassName: 'xl:col-span-2 min-h-[390px]',
      shellClassName: 'bg-[#f7f4ed]',
      accentClassName: 'bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_28%)]',
    };
  }

  return {
    label: 'small-specific',
    articleClassName: 'min-h-[390px]',
    shellClassName: 'bg-white',
    accentClassName: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_42%)]',
  };
}

function getStatusClasses(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'complete' || normalized === 'completed') {
    return 'border-emerald-900/20 bg-emerald-950 text-white';
  }
  if (normalized === 'in-progress' || normalized === 'in progress') {
    return 'border-black bg-black text-white';
  }
  return 'border-[#d6c9a8] bg-[#f5ebcf] text-neutral-900';
}

export default function Industries() {
  const { projects } = projectPipelineContent;
  const [selectedBusinessType, setSelectedBusinessType] = useState('All');
  const [selectedProjectType, setSelectedProjectType] = useState('All');
  const [activeProtectedPath, setActiveProtectedPath] = useState<string | null>(null);

  const businessTypes = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );

  const projectTypes = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((project) => project.projectType)))],
    [projects],
  );

  const filteredProjects = useMemo(
    () => projects.filter((project) => {
      const matchesBusinessType = selectedBusinessType === 'All' || project.category === selectedBusinessType;
      const matchesProjectType = selectedProjectType === 'All' || project.projectType === selectedProjectType;
      return matchesBusinessType && matchesProjectType;
    }),
    [projects, selectedBusinessType, selectedProjectType],
  );

  const protectedProjectMap = useMemo(
    () => Object.fromEntries(protectedProjects.map((project) => [project.path, project])),
    [],
  );

  const activeProtectedProject = activeProtectedPath ? protectedProjectMap[activeProtectedPath] : undefined;

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
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
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
    <section
      className="bg-[linear-gradient(180deg,#f8f4ea_0%,#f5f5ef_40%,#ffffff_100%)] py-28"
      id="industries"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-500">Project Index</p>
          <div className="mt-5 flex flex-col gap-6 border-t border-black/10 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-medium tracking-tight text-neutral-950 md:text-5xl">Projects</h2>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                Structured as consulting, implementation, and custom-solution work. Each card follows the same system:
                project type and capacity up top, title and subtitle in the middle, deliverables and start date at the bottom.
              </p>
            </div>
            <div className="rounded-full border border-black/10 bg-white/80 px-4 py-3 text-sm text-neutral-600">
              Showing <span className="font-medium text-neutral-950">{filteredProjects.length}</span> of {projects.length} projects
            </div>
          </div>
        </motion.div>

        <div className="mb-10 grid gap-6 rounded-[32px] border border-black/10 bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-8 lg:grid-cols-2">
          {renderFilterGroup('Project Type', businessTypes, selectedBusinessType, setSelectedBusinessType)}
          {renderFilterGroup('Capacity', projectTypes, selectedProjectType, setSelectedProjectType)}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-black/20 bg-white/80 px-8 py-16 text-center text-neutral-500">
            No projects match the current filter combination.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const protectedProject = protectedProjectMap[project.link];
              const hasLink = Boolean(project.link);
              const cardState = getCardState(index, Boolean(protectedProject), hasLink);
              const displayTone = protectedProject ? 'dark' : 'light';
              const cardAriaLabel = protectedProject ? 'Open project access options' : `View ${project.title}`;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className={`group relative overflow-hidden rounded-[30px] border border-black/10 ${cardState.articleClassName}`}
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
                    ) : protectedProject ? (
                      <button
                        type="button"
                        className="absolute inset-0 z-10"
                        aria-label={cardAriaLabel}
                        onClick={() => setActiveProtectedPath(project.link)}
                      />
                    ) : (
                      <Link to={project.link} className="absolute inset-0 z-10" aria-label={cardAriaLabel} />
                    )
                  ) : null}

                  <div className={`absolute inset-0 ${cardState.accentClassName}`} />

                  <div className={`relative flex h-full flex-col justify-between p-6 md:p-7 ${cardState.shellClassName}`}>
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em]">
                          <span className={protectedProject ? 'text-neutral-300' : 'text-neutral-500'}>{project.category}</span>
                          <span className={protectedProject ? 'text-white/25' : 'text-neutral-300'}>•</span>
                          <span className={protectedProject ? 'text-neutral-200' : 'text-neutral-700'}>{project.projectType}</span>
                          <span className={protectedProject ? 'text-white/25' : 'text-neutral-300'}>•</span>
                          <span className={protectedProject ? 'text-neutral-200' : 'text-neutral-700'}>{project.serviceType}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {protectedProject ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/90">
                              <LockKeyhole className="h-3.5 w-3.5" />
                              Confidential
                            </span>
                          ) : null}
                          <span className={`rounded-full border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] ${getStatusClasses(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-10 max-w-2xl">
                        <p className={`text-sm leading-6 ${protectedProject ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {project.clientDescription}
                        </p>
                        <h3 className={`mt-4 text-3xl font-medium tracking-tight ${protectedProject ? 'text-white' : 'text-neutral-950'}`}>
                          {project.title}
                        </h3>
                        <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${protectedProject ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className={`mt-10 border-t pt-6 ${protectedProject ? 'border-white/12' : 'border-black/8'}`}>
                      <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                          <p className={`text-[11px] font-mono uppercase tracking-[0.24em] ${protectedProject ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Deliverables
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <ProjectTagPill key={`${tag.label}-${tag.tier}`} tag={tag} tone={displayTone} />
                            ))}
                          </div>
                        </div>

                        <div className="min-w-[126px]">
                          <p className={`text-[11px] font-mono uppercase tracking-[0.24em] ${protectedProject ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Date Started
                          </p>
                          <p className={`mt-3 text-sm font-medium ${protectedProject ? 'text-white' : 'text-neutral-950'}`}>
                            {project.date}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <p className={`text-sm leading-6 ${protectedProject ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {project.impact}
                        </p>
                        {hasLink ? (
                          <span className={`inline-flex items-center gap-2 text-sm font-medium ${protectedProject ? 'text-white' : 'text-neutral-950'}`}>
                            {protectedProject ? 'Choose access' : 'Open project'}
                            {protectedProject ? <MoveRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </span>
                        ) : (
                          <span className={`text-sm ${protectedProject ? 'text-neutral-500' : 'text-neutral-400'}`}>Private archive</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {activeProtectedProject ? (
        <ProjectAccessPrompt
          isOpen
          path={activeProtectedProject.path}
          title={activeProtectedProject.maskedTitle}
          subtitle={activeProtectedProject.subtitle}
          onClose={() => setActiveProtectedPath(null)}
          initialMethod={activeProtectedProject.view}
          onStatusChange={() => undefined}
        />
      ) : null}
    </section>
  );
}
