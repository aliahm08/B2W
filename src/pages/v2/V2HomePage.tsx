import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Calculator, FileStack, Sparkles } from 'lucide-react';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
import ContractorSolutionsCard from '../../components/ContractorSolutionsCard';
import { V2SiteFooter, V2SiteHeader } from '../../components/V2SiteChrome';

export default function V2HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#141714] selection:bg-[#141714] selection:text-white">
      <Seo title="B2W V2 — AI Products for Project Teams" description="Explore B2W products and practical AI solutions for general contractors and engineering firms." canonicalPath="/v2" robots="noindex, nofollow" />
      <V2SiteHeader followPageTheme />
      <main>
        <section data-header-theme="light" className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-black/10 px-5 pb-20 pt-36 sm:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,23,20,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(20,23,20,.055)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[-8rem] top-20 h-[34rem] w-[34rem] rounded-full bg-[#d8e5cf] blur-[110px]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_.62fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#426149]">B2W · Product company</p>
              <h1 className="mt-7 max-w-[10ch] text-[clamp(4rem,10vw,9.5rem)] font-medium leading-[.84] tracking-[-.075em]">
                <DescrambleText text="AI that knows the work." animateOnMount delay={120} />
              </h1>
            </div>
            <div className="border-l border-black/15 pl-6">
              <p className="text-lg leading-8 text-[#4d554e]">B2W builds focused AI agents for project-driven businesses—starting with communication intelligence, then moving toward governed action through business-specific workflows.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/v2/products/jasonai" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#141714] px-6 text-sm font-semibold text-white">Explore JasonAI <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/v2/pricing" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-black/20 bg-white/70 px-6 text-sm font-semibold">Calculate ROI <Calculator className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">Products</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Two agents. Clear roles.</h2></div><p className="max-w-xl text-base leading-7 text-[#596159]">Start with a defined core workflow. Premium agentic capabilities arrive only after the underlying work can be reviewed and trusted.</p></div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {[
              { name: 'JasonAI', icon: Bot, status: 'Core available', tone: 'bg-[#15201a] text-white', accent: 'text-[#9fd4ae]', body: 'Search approved communication and create useful job summaries through a familiar messaging workflow.', to: '/v2/products/jasonai' },
              { name: 'Clara', icon: FileStack, status: 'Concept phase', tone: 'bg-[#fff8fb] text-[#3d1f33]', accent: 'text-[#a76186]', body: 'Turn voice notes and field context into organized scopes, line-item estimates, and reviewable project documents.', to: '/v2/products/clara' },
            ].map((product) => (
              <motion.article key={product.name} whileHover={{ y: -6 }} className={`group flex min-h-[27rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-black/10 p-7 shadow-[0_28px_80px_rgba(20,23,20,.08)] md:p-9 ${product.tone}`}>
                <div><div className="flex items-center justify-between"><product.icon className={`h-8 w-8 ${product.accent}`} /><span className="rounded-full border border-current/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em]">{product.status}</span></div><h3 className="mt-12 text-5xl font-semibold tracking-[-.05em] md:text-7xl">{product.name}</h3><p className="mt-6 max-w-xl text-lg leading-8 opacity-70">{product.body}</p></div>
                <Link to={product.to} className="mt-10 inline-flex items-center gap-2 text-sm font-semibold">Explore product <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              </motion.article>
            ))}
            <ContractorSolutionsCard />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[.7fr_1fr] lg:items-center"><div><Sparkles className="h-8 w-8 text-[#426149]" /><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Core first. Agentic when ready.</h2></div><div><p className="text-lg leading-8 text-[#596159]">Core agents retrieve, organize, and draft with human review. Premium agents will take governed action through workflows designed around each business—but Premium is not yet available.</p><Link to="/v2/pricing" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#141714] px-6 text-sm font-semibold text-white">See pricing and tiers <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <V2SiteFooter />
    </div>
  );
}
