import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Check, LineChart, Target, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import LeadForm, { type PublicProjectArea } from '../components/forms/LeadForm';
import { getExpertisePageBySlug } from '../content/expertisePages';

function getIconForSlug(slug: string) {
  if (slug === 'growth') {
    return Target;
  }

  if (slug === 'optimization') {
    return LineChart;
  }

  return Wallet;
}

function formatProjectAreas(areas: PublicProjectArea[]) {
  return areas.join(' + ');
}

export default function ExpertisePage() {
  const { slug } = useParams();
  const page = slug ? getExpertisePageBySlug(slug) : undefined;

  if (!page) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border border-neutral-200 bg-white p-8">
          <Link to="/#expertise" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Expertise
          </Link>
          <h1 className="mt-8 text-4xl font-medium tracking-tight text-neutral-950">Expertise page not found</h1>
        </div>
      </section>
    );
  }

  const Icon = getIconForSlug(page.slug);

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/#expertise" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Expertise
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{page.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                {page.summary}
              </p>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-white" />
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Client Profile Lens</p>
              </div>
              <p className="mt-5 text-base leading-7 text-neutral-200">{page.profileLens}</p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Primary Intake Routing</p>
                <p className="mt-2 text-sm leading-6 text-neutral-300">{formatProjectAreas(page.preselectedProjectAreas)}</p>
              </div>
            </motion.aside>
          </div>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="space-y-10">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {page.profileInputs.map((item) => (
                <div key={item} className="border border-neutral-200 bg-white p-6">
                  <p className="text-sm leading-7 text-neutral-700">{item}</p>
                </div>
              ))}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="border border-neutral-200 bg-white p-6 md:p-8"
            >
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">How We Prioritize</p>
              <ul className="space-y-4">
                {page.priorities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <div className="grid gap-8 md:grid-cols-2">
              {page.sections.map((section) => (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="border border-neutral-200 bg-white p-6 md:p-7"
                >
                  <h2 className="text-2xl font-medium tracking-tight text-neutral-950">{section.title}</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-700">{section.body}</p>
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                        <span className="mt-2 h-2 w-2 shrink-0 bg-black" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="border border-neutral-200 bg-white p-6 md:p-7"
              >
                <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Example Priorities</p>
                <ul className="space-y-4">
                  {page.exampleMoves.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="border border-neutral-200 bg-white p-6 md:p-7"
              >
                <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">What This Unlocks</p>
                <ul className="space-y-4">
                  {page.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="grid gap-8 border-t border-neutral-200 pt-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <div>
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Best Fit</p>
                <ul className="space-y-3">
                  {page.fit.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Engagement Model</p>
                <p className="text-base leading-7 text-neutral-700">{page.engagementNote}</p>
              </div>
            </motion.section>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="border border-black/10 bg-white p-5 sm:p-6 md:p-7 lg:sticky lg:top-28"
          >
            <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Start The Conversation</p>
            <p className="mb-6 text-sm leading-6 text-neutral-600">
              Share what the business is trying to solve now. We use that starting point to determine whether the first move should focus on growth, optimization, diligence, or a broader business scope.
            </p>
            <LeadForm
              intro="The closest intake area for this expertise page is already selected, but you can adjust it if your needs cross multiple parts of the business."
              submitLabel={`Request ${page.title} Support`}
              preselectedProjectAreas={page.preselectedProjectAreas}
            />
          </motion.aside>
        </div>
      </section>
    </>
  );
}
