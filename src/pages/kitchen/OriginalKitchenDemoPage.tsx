import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CapabilitiesKitchen from '../../archived/CapabilitiesKitchen';
import Seo from '../../components/Seo';

export default function OriginalKitchenDemoPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-white pb-24 pt-24 text-black">
      <Seo />
      <section className="mx-auto max-w-7xl px-6">
        <div className="border-b border-neutral-200 pb-8">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Kitchen by B2W
          </Link>
          <div className="mt-6 max-w-3xl">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Archived Demo</p>
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-neutral-950 md:text-6xl">
              Original Kitchen Interface
            </h1>
            <p className="mt-5 text-base leading-7 text-neutral-600 md:text-lg">
              This page keeps the original Kitchen demo exactly as a separate experience so you can compare it against the new builder without losing the earlier information architecture.
            </p>
          </div>
        </div>
      </section>

      <section>
        <CapabilitiesKitchen />
      </section>
    </article>
  );
}
