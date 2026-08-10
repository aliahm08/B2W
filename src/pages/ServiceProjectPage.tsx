import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Seo from '../components/Seo';
import LeadForm, { type PublicProjectArea } from '../components/forms/LeadForm';
import { servicePageContent } from '../content/servicePages';

export default function ServiceProjectPage() {
  const location = useLocation();
  const content = useMemo(
    () => servicePageContent[location.pathname] ?? servicePageContent['/services/marketing-advisory'],
    [location.pathname],
  );
  const projectAreas: PublicProjectArea[] = content.preselectedProjectAreas;

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-12 border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            Back to homepage projects
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-start">
            <div>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{content.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-500 md:text-2xl">
                {content.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Service Snapshot</p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Practical support shaped around the business constraints you already have.
              </h2>
              <p className="text-sm leading-6 text-neutral-300">
                Share your situation, urgency, and current business context. B2W uses that intake to assess fit, define the right scope, and recommend the next step.
              </p>
            </aside>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="border border-neutral-200 bg-white p-6 md:p-7">
                <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Outcomes</h2>
                <ul className="space-y-4">
                  {content.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-neutral-200 bg-white p-6 md:p-7">
                <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Scope</h2>
                <ul className="space-y-4">
                  {content.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-8 md:pt-10">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">How It Starts</p>
              <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
                Share your business context, current constraints, and what you want to improve. B2W uses that information
                to understand whether the project is a fit and what the right scope should look like.
              </p>
            </div>
          </div>

          <aside className="border border-black/10 bg-white p-5 sm:p-6 md:p-7 lg:sticky lg:top-28">
            <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Inquiry Form</p>
            <div className="mt-4">
              <LeadForm
                intro="The matching project area is preselected for this page, but you can adjust it if your needs span multiple areas."
                submitLabel="Send Inquiry"
                preselectedProjectAreas={projectAreas}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
