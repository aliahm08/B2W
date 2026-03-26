import { useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { parseKitchenSolutionSlug } from '../../content/kitchen';
import { openCalendly } from '../../lib/engagement';

export default function KitchenPreviewPage() {
  const { slug } = useParams();
  const solution = slug ? parseKitchenSolutionSlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!solution) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border border-neutral-200 bg-white p-8">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Kitchen by B2W
          </Link>
          <h1 className="mt-8 text-4xl font-medium tracking-tight text-neutral-950">Preview proposal not found</h1>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Kitchen by B2W
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Preview Proposal</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {solution.name}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                {solution.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Proposal Note</p>
              <p className="mt-4 text-base leading-7 text-neutral-200">
                This is a preview proposal generated from the selected Kitchen by B2W configuration. Final scope, pacing, and pricing are refined after a conversation with the client.
              </p>
              <button
                type="button"
                onClick={openCalendly}
                className="mt-6 inline-flex items-center gap-2 border border-white bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                Schedule a call
                <ExternalLink className="h-4 w-4" />
              </button>
            </aside>
          </div>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-8">
            <section className="grid gap-6 md:grid-cols-3">
              {[
                ['Information', solution.information],
                ['Integration', solution.integration],
                ['Production', solution.production],
              ].map(([label, items]) => (
                <div key={label} className="border border-neutral-200 bg-white p-6">
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">{label}</p>
                  <div className="mt-4 space-y-4">
                    {(items as typeof solution.information).map((item) => (
                      <div key={item.id}>
                        <h2 className="text-xl font-medium tracking-tight text-neutral-950">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="border border-neutral-200 bg-white p-6 md:p-8">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Deliverables In View</p>
              <ul className="space-y-4">
                {solution.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-black" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-neutral-200 bg-white p-6 md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">What This Proposal Includes</p>
              <ul className="space-y-4">
                {solution.proposalHighlights.map((item) => (
                  <li key={item} className="text-sm leading-6 text-neutral-600">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border border-neutral-200 bg-white p-6 md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Engagement Flow</p>
              <ol className="space-y-4">
                <li className="text-sm leading-6 text-neutral-600">1. Confirm business context, constraints, and urgency on a call.</li>
                <li className="text-sm leading-6 text-neutral-600">2. Refine the data access, integration depth, and production scope required.</li>
                <li className="text-sm leading-6 text-neutral-600">3. Convert this preview into a tailored B2W proposal with final sequencing.</li>
              </ol>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
