import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { projects } from '../content/caseStudies';

export default function Industries() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group border border-neutral-200 p-8 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[400px] bg-white origin-center"
          >
            {project.link && (
              <Link to={project.link} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
                <span className="font-semibold text-neutral-900">{project.category}</span>
                <span className="text-neutral-300">•</span>
                <span>{project.serviceType}</span>
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
                  {project.tags.map(tag => (
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
    </section>
  );
}
