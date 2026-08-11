import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Seo from '../components/Seo';
import { tierPageContent } from '../content/tierPages';

export default function TierPage() {
  const location = useLocation();
  const contentPathname = location.pathname.replace(/^\/(?:preview|v[1-3])(?=\/)/, '') || '/';
  const content = useMemo(
    () => tierPageContent[contentPathname] ?? tierPageContent['/tiers/basic-advisory'],
    [contentPathname],
  );

  return (
    <>
      <Seo title={content.seoTitle} description={content.description} />
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
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Tier Snapshot</p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                What this tier is built to handle.
              </h2>
              <div className="space-y-3 text-sm leading-6 text-neutral-300">
                {content.outputs.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="border border-neutral-200 bg-white p-6 md:p-7">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Best Fit</p>
            <ul className="space-y-4">
              {content.fit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-neutral-200 bg-white p-6 md:p-7">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Included</p>
            <ul className="space-y-4">
              {content.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-neutral-200 bg-white p-6 md:p-7">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Typical Timeline</p>
            <ul className="space-y-4">
              {content.timeline.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-neutral-200 bg-white p-6 md:p-7">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Expected Outputs</p>
            <ul className="space-y-4">
              {content.outputs.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-neutral-600">Already Have a Project with Us?</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4">
              Enter Client Portal
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
