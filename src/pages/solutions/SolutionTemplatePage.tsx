import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AiDemoPanel from '../../components/solutions/AiDemoPanel';
import { aiSolutions, getAiSolutionBySlug } from '../../content/aiSolutions';
import Seo from '../../components/Seo';

export default function SolutionTemplatePage() {
  const { slug } = useParams();
  const solution = slug ? getAiSolutionBySlug(slug) : null;

  if (!solution) {
    return (
      <>
        <Seo title="AI Solution Not Found" canonicalPath="/solutions" robots="noindex, nofollow" />
        <article className="min-h-screen bg-[#090b0f] px-6 py-24 text-white">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#11151b] p-8">
            <Link to="/solutions" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to AI solutions
            </Link>
            <h1 className="mt-8 text-4xl font-medium tracking-tight text-white">Solution not found</h1>
          </div>
        </article>
      </>
    );
  }

  const relatedSolutions = aiSolutions.filter((item) => solution.related.includes(item.slug));

  return (
    <>
      <Seo
        title={solution.seoTitle}
        description={solution.seoDescription}
        canonicalPath={`/solutions/${solution.slug}`}
      />

        <article className="min-h-screen bg-[#090b0f] text-white">
        <header className="border-b border-white/8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">B2W</p>
              <p className="mt-1 text-sm font-medium text-white">AI Solutions</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/solutions"
                className="inline-flex rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-white/25 hover:text-white"
              >
                All AI pages
              </Link>
              <Link
                to="/#contact"
                className="inline-flex rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#dfe8ff_100%)] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Talk to B2W
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-7xl px-6 pb-14 pt-16 md:pb-18 md:pt-20">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-20 mx-auto h-72 max-w-5xl rounded-full bg-[radial-gradient(circle,rgba(88,120,255,0.16),transparent_65%)] blur-3xl"
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex flex-wrap gap-3">
            {aiSolutions.map((item) => (
              <Link
                key={item.slug}
                to={`/solutions/${item.slug}`}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  item.slug === solution.slug
                    ? 'bg-[linear-gradient(135deg,#ffffff_0%,#dfe8ff_100%)] text-black'
                    : 'border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] text-neutral-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {item.navLabel}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
            <div>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to AI solutions
              </Link>
              <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-500">{solution.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-[-0.06em] text-white md:text-7xl md:leading-[0.92]">
                {solution.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300 md:text-2xl md:leading-10">
                {solution.description}
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {solution.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[999px] border border-white/10 bg-[linear-gradient(135deg,#141a24_0%,#10151d_100%)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{stat.label}</p>
                    <p className="mt-3 text-xl font-medium tracking-tight text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[44px] border border-white/10 bg-[linear-gradient(180deg,#141923_0%,#0d1117_100%)] p-4 shadow-[0_32px_120px_rgba(0,0,0,0.38)]">
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ opacity: [0.2, 0.9, 0.2], x: ['-8%', '8%', '-8%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <AiDemoPanel mode={solution.slug} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#0d1116]">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">What It Produces</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Outputs designed for action.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                  The point of this system is not just analysis or interface. It is a usable output that the next person
                  in the workflow can immediately operate from.
                </p>
              </div>
              <div className="grid gap-4">
                {solution.outputs.map((output) => (
                  <motion.div
                    key={output}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.16 }}
                  className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#141a24_0%,#10151d_100%)] p-5"
                >
                  <p className="text-sm leading-7 text-neutral-200">{output}</p>
                </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Workflow</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                How this part of the AI stack works.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {solution.workflow.map((step, index) => (
                <motion.div
                  key={step.title}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,#141a24_0%,#10151d_100%)] p-6"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#0d1116]">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Integrations</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Built to work through the systems already in place.
                </h2>
              </div>
              <div className="rounded-[44px] border border-white/10 bg-[linear-gradient(180deg,#141a24_0%,#10151d_100%)] p-6">
                <div className="flex flex-wrap gap-3">
                  {solution.integrations.map((integration) => (
                    <span
                      key={integration}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-300"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="flex items-end justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Related Pages</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Explore the rest of the AI side.
                </h2>
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {relatedSolutions.map((item) => (
                <motion.div key={item.slug} whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
                  <Link
                    to={`/solutions/${item.slug}`}
                    className="group block rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,#141a24_0%,#10151d_100%)] p-6 transition-colors hover:border-white/24"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{item.navLabel}</p>
                    <p className="mt-4 text-2xl font-medium tracking-tight text-white">{item.title}</p>
                    <p className="mt-4 text-sm leading-7 text-neutral-300">{item.summary}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white">
                      Open subpage
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
