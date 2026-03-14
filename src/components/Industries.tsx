import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectPipelineContent } from '../content/projectPipeline';

function isExternalLink(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export default function Industries() {
  const { projects } = projectPipelineContent;
  const [selectedBusinessType, setSelectedBusinessType] = useState('All');
  const [selectedProjectType, setSelectedProjectType] = useState('All');

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

  const renderFilterGroup = (
    label: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="space-y-3">
      <span className="block text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === selectedValue;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
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
    <section className="py-32 px-6 max-w-7xl mx-auto bg-neutral-50" id="industries">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-medium tracking-tight mb-4">Projects</h2>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="mb-12 flex flex-col gap-8 border border-neutral-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Project Index</p>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600 md:text-base">
              Filter by business type and engagement model to isolate comparable work.
            </p>
          </div>
          <div className="text-sm text-neutral-500">
            Showing <span className="font-medium text-neutral-900">{filteredProjects.length}</span> of {projects.length} projects
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {renderFilterGroup('Business Type', businessTypes, selectedBusinessType, setSelectedBusinessType)}
          {renderFilterGroup('Project Type', projectTypes, selectedProjectType, setSelectedProjectType)}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-white px-8 py-16 text-center text-neutral-500">
          No projects match the current filter combination.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group border border-neutral-200 p-8 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[400px] bg-white origin-center"
          >
            {project.link && (
              isExternalLink(project.link) ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.title}`}
                />
              ) : (
                <Link to={project.link} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />
              )
            )}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
                  <span className="font-semibold text-neutral-900">{project.category}</span>
                  <span className="text-neutral-300">•</span>
                  <span>{project.projectType}</span>
                  <span className="text-neutral-300">•</span>
                  <span>{project.serviceType}</span>
                </div>
                <span className="border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-600">
                  {project.status}
                </span>
              </div>

              <div className="text-sm text-neutral-500 italic mb-2">
                {project.clientDescription}
              </div>

              <h3 className="text-2xl font-medium mb-4 text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                {project.title}
              </h3>

              <p className="text-neutral-600 leading-relaxed mb-8 text-sm md:text-base">
                {project.description}
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <div className="mb-4">
                <span className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">Impact</span>
                <span className="text-lg font-medium text-neutral-900">{project.impact}</span>
              </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">{project.date}</span>
                </div>
              </div>
          </motion.div>
        ))}
        </div>
      )}
    </section>
  );
}
