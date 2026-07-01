import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AiDemoPanel from '../../components/solutions/AiDemoPanel';
import AiSolutionsForm from '../../components/forms/AiSolutionsForm';
import { aiSolutions, getAiSolutionBySlug } from '../../content/aiSolutions';
import Seo from '../../components/Seo';

export default function SolutionTemplatePage() {
  const { slug } = useParams();
  const solution = slug ? getAiSolutionBySlug(slug) : null;

  if (!solution) {
    return (
      <>
        <Seo title="AI Solution Not Found" canonicalPath="/clara" robots="noindex, nofollow" />
        <article className="min-h-screen bg-[#160f15] px-6 py-24 text-white">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-[#e8cbd9]/12 bg-[#2b1724] p-8">
            <Link to="/clara" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
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
        canonicalPath={`/clara/${solution.slug}`}
      />

      <article className="min-h-screen text-white">
        <section className="relative mx-auto max-w-7xl px-6 pb-14 pt-10 md:pb-18 md:pt-16">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-20 mx-auto h-72 max-w-5xl rounded-full bg-[radial-gradient(circle,rgba(166,101,137,0.20),transparent_65%)] blur-3xl"
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] xl:items-start">
            <div>
              <Link
                to="/clara"
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
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-neutral-400">
                {solution.integrations.slice(0, 4).map((integration) => (
                  <span key={integration}>{integration}</span>
                ))}
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {solution.stats.map((stat) => (
                  <div key={stat.label} className="border-l border-white/12 pl-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{stat.label}</p>
                    <p className="mt-2 text-xl font-medium tracking-tight text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative xl:-mr-8">
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,rgba(166,101,137,0.22),transparent_58%)] blur-3xl"
                animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.98, 1.03, 0.98] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <AiDemoPanel mode={solution.slug} />
            </div>
          </div>
        </section>

        <section className="border-t border-[#e8cbd9]/10 bg-[#1d121b]">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="bg-white/[0.025] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Best Fit</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  When this is the right system.
                </h2>
                <ul className="mt-6 space-y-4">
                  {solution.fitSignals.map((signal) => (
                    <li key={signal} className="flex items-start gap-3 text-sm leading-7 text-neutral-300">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d9a9c2]" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.025] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Success Signals</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  What good looks like in production.
                </h2>
                <ul className="mt-6 space-y-4">
                  {solution.successSignals.map((signal) => (
                    <li key={signal} className="flex items-start gap-3 text-sm leading-7 text-neutral-300">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#e8cbd9]" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">What B2W Builds</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Implementation designed around the real workflow.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                  The work is not just a demo or interface. B2W builds the input flow, business logic, output layer, and
                  operational handoff so the system can be used day to day.
                </p>
              </div>
              <div className="grid gap-4">
                {solution.buildIncludes.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm leading-7 text-neutral-200">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e8cbd9]/10 bg-[#1d121b]">
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
                    className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0"
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
                  className="bg-white/[0.025] p-6"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e8cbd9]/10 bg-[#1d121b]">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Example Deployments</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                Common ways teams put this to work.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {solution.useCases.map((useCase) => (
                <motion.div
                  key={useCase.title}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white/[0.025] p-6"
                >
                  <p className="text-2xl font-medium tracking-tight text-white">{useCase.title}</p>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">{useCase.body}</p>
                  <div className="mt-6 border-l border-white/10 pl-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Outcome</p>
                    <p className="mt-2 text-sm leading-7 text-neutral-200">{useCase.outcome}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Implementation Modes</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                Different levels of autonomy, same business logic.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {solution.implementationModes.map((mode) => (
                <motion.div
                  key={mode.title}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white/[0.025] p-6"
                >
                  <p className="text-2xl font-medium tracking-tight text-white">{mode.title}</p>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">{mode.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e8cbd9]/10 bg-[#1d121b]">
          <div className="mx-auto max-w-7xl px-6 py-18 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Integrations</p>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Built to work through the systems already in place.
                </h2>
              </div>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {solution.integrations.map((integration) => (
                    <span
                      key={integration}
                      className="text-sm text-neutral-300"
                    >
                      {integration}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8">
          <div id="ai-intake" className="mx-auto max-w-7xl scroll-mt-32 px-6 py-18 md:py-24">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Start Here</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                Scope this AI workflow with B2W.
              </h2>
            </div>
            <AiSolutionsForm
              heading={`Talk to B2W about ${solution.navLabel.toLowerCase()}`}
              intro={solution.intakePrompt}
              sourceLabel={`AI Solutions: ${solution.navLabel}`}
              preselectedSolutions={[solution.slug]}
              submitLabel={`Request ${solution.navLabel} AI`}
            />
          </div>
        </section>

        <section className="border-t border-[#e8cbd9]/10 bg-[#1d121b]">
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
                    to={`/clara/${item.slug}`}
                    className="group block bg-white/[0.025] p-6 transition-colors hover:bg-white/[0.04]"
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
