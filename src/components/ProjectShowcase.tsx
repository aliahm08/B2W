import { motion } from 'motion/react';
import { showcaseProjects } from '../content/projectShowcaseCards';

function getStatusClasses(status: string) {
  if (status === 'Complete') {
    return 'border-emerald-400/30 bg-emerald-400/15 text-emerald-100';
  }
  if (status === 'In-progress') {
    return 'border-amber-400/30 bg-amber-400/15 text-amber-100';
  }
  return 'border-neutral-700 bg-neutral-900 text-neutral-100';
}

export default function ProjectShowcase() {
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
          <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">
            Project Types
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-neutral-600">
            B2W supports marketing, financial, and operations work across small and midsize businesses.
          </p>
          <div className="h-px w-full bg-neutral-200" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {showcaseProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative min-h-[360px] border border-neutral-800 bg-neutral-950 p-8 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

              <div className="relative grid h-full grid-rows-[auto,1fr,auto] gap-8">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                    <span className="font-semibold text-stone-100">
                      {project.category}
                    </span>
                    <span className="text-neutral-700">•</span>
                    <span>{project.serviceType}</span>
                    <span className="text-neutral-700">•</span>
                    <span
                      className={`inline-flex border px-2 py-1 text-[10px] tracking-[0.2em] ${getStatusClasses(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="max-w-2xl">
                    <h3 className="mb-4 text-2xl font-medium text-stone-50">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-200 md:text-base">
                      {project.clientDescription}
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-6 flex items-end justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {project.date}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
