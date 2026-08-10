import { ArrowLeft, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WIcon from '../../components/logo/B2WIcon';
import InternalDocumentNav from '../../components/internal/InternalDocumentNav';
import Seo from '../../components/Seo';

export default function ClaraComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#17221E]">
      <Seo title="Clara · Concept Phase" description="Private B2W product placeholder for Clara." robots="noindex, nofollow" canonicalPath="/internal/products/clara" />
      <header className="border-b border-[#223C33]/10 bg-[#F6F3EC]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-5 sm:px-8">
          <Link to="/internal/portal" aria-label="Return to Products" className="grid h-9 w-9 place-items-center rounded-full border border-[#223C33]/12 transition hover:bg-white"><ArrowLeft className="h-3.5 w-3.5" /></Link>
          <B2WIcon title="" className="h-8 w-9 text-[#223C33]" />
          <div><p className="b2w-wordmark text-[11px] font-semibold tracking-[0.16em]">B2W</p><p className="text-[8px] uppercase tracking-[0.2em] text-[#223C33]/45">Products</p></div>
        </div>
        <InternalDocumentNav />
      </header>
      <section className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#997022]">Product concept · Concept phase</p><h1 className="mt-5 text-6xl font-medium tracking-[-0.06em] sm:text-8xl">Clara</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#223C33]/62">Clara remains visible in B2W’s product architecture, but it is not an active productization workstream. JasonAI repeatability and controlled launch come first.</p></div>
        <div className="rounded-[2rem] border border-[#223C33]/12 bg-white/60 p-7"><Clock3 className="h-6 w-6 text-[#997022]" /><p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#997022]">Activation gate</p><p className="mt-3 text-sm leading-7 text-[#223C33]/62">Define Clara’s customer, primary workflow, evidence threshold, and relationship to JasonAI before moving it from concept phase into the prioritized plan.</p><Link to="/internal/resources" className="mt-7 inline-flex min-h-10 items-center rounded-full bg-[#223C33] px-5 text-xs font-semibold text-white">View prioritized plan</Link></div>
      </section>
    </main>
  );
}
