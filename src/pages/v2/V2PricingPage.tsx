import { ArrowRight, Bot, Check, FileStack, Sparkles, Workflow, X } from 'lucide-react';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
import { V2SiteFooter, V2SiteHeader } from '../../components/V2SiteChrome';
import JasonAIPricingCalculator from '../JasonAIPricingCalculator';

const tierRows = [
  {
    agent: 'JasonAI',
    icon: Bot,
    accent: 'text-[#426149]',
    coreStatus: 'Available',
    coreTone: 'bg-emerald-100 text-emerald-800',
    corePrice: '$99 / month',
    setup: '$2,000 one-time setup',
    offer: 'Pre-launch: $25 / month for year one and setup waived',
    core: ['Approved communication search', 'Job and project summaries', 'WhatsApp-based assistant access'],
    premium: ['Business-specific workflow design', 'Governed action across connected systems', 'Approval gates and accountable handoffs'],
  },
  {
    agent: 'Clara',
    icon: FileStack,
    accent: 'text-[#a76186]',
    coreStatus: 'Concept phase',
    coreTone: 'bg-fuchsia-100 text-fuchsia-800',
    corePrice: 'Pricing to be announced',
    setup: 'Not available for purchase',
    offer: 'Join the product update list for launch timing',
    core: ['Voice and field-note capture', 'Structured scopes and assumptions', 'Editable estimate and document drafts'],
    premium: ['Business-specific workflow design', 'Governed project actions and routing', 'Approval gates and accountable handoffs'],
  },
] as const;

export default function V2PricingPage() {
  const openReview = () => {
    window.location.href = 'mailto:info@b2w-ai.com?subject=B2W%20ROI%20and%20Pricing%20Review';
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#141714] selection:bg-[#141714] selection:text-white">
      <Seo title="B2W V2 Pricing, Tiers, and ROI" description="Compare Core and Premium tiers for JasonAI and Clara, review current availability, and calculate the potential ROI of communication intelligence." canonicalPath="/v2/pricing" robots="noindex, nofollow" />
      <V2SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-black/10 px-5 pb-24 pt-40 sm:px-8 md:pb-32 md:pt-48">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(20,23,20,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(20,23,20,.055)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[-6rem] top-0 h-[32rem] w-[32rem] rounded-full bg-[#d8e5cf] blur-[110px]" />
          <div className="relative mx-auto max-w-7xl"><p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#426149]">Pricing · ROI · Availability</p><h1 className="mt-8 max-w-[10ch] text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[.86] tracking-[-.075em]"><DescrambleText text="Start with value you can measure." animateOnMount delay={120} /></h1><p className="mt-8 max-w-3xl text-lg leading-8 text-[#596159] md:text-xl">Every agent begins with a focused Core tier. Premium adds governed action through workflows designed for the business—but Premium is not yet available for any agent.</p></div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">Agent tiers</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Core now. Premium later.</h2></div><p className="max-w-xl leading-7 text-[#596159]">Core helps teams retrieve, organize, and draft. Premium will take action only through defined, reviewable, business-specific workflows.</p></div>
          <div className="mt-12 space-y-6">
            {tierRows.map((row) => (
              <article key={row.agent} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_70px_rgba(20,23,20,.07)]">
                <div className="flex flex-wrap items-center justify-between gap-5 border-b border-black/10 px-6 py-5 md:px-8"><div className="flex items-center gap-3"><row.icon className={`h-7 w-7 ${row.accent}`} /><h3 className="text-2xl font-semibold">{row.agent}</h3></div><span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] ${row.coreTone}`}>Core · {row.coreStatus}</span></div>
                <div className="grid lg:grid-cols-2">
                  <div className="p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#426149]">Core</p><p className="mt-4 text-3xl font-semibold">{row.corePrice}</p><p className="mt-2 text-sm text-[#6b716b]">{row.setup}</p><p className="mt-4 rounded-xl bg-[#eef4ea] px-4 py-3 text-sm font-semibold text-[#35513b]">{row.offer}</p><div className="mt-7 space-y-3 border-t border-black/10 pt-6">{row.core.map((item) => <p key={item} className="flex gap-2 text-sm leading-6 text-[#4d554e]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#426149]" />{item}</p>)}</div></div>
                  <div className="border-t border-black/10 bg-[#151b17] p-6 text-white lg:border-l lg:border-t-0 md:p-8"><div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#b8cdbb]">Premium</p><span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-white/55">Not available</span></div><p className="mt-4 text-3xl font-semibold">Custom</p><p className="mt-2 text-sm text-white/48">Pricing follows workflow scope and connected systems.</p><div className="mt-7 space-y-3 border-t border-white/12 pt-6">{row.premium.map((item) => <p key={item} className="flex gap-2 text-sm leading-6 text-white/68"><Workflow className="mt-1 h-4 w-4 shrink-0 text-[#9fd4ae]" />{item}</p>)}</div></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-8"><JasonAIPricingCalculator onBookReview={openReview} variant="embedded" context="project-teams" /></section>

        <section className="bg-[#111714] px-5 py-20 text-white sm:px-8 md:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.65fr_1fr]"><div><Sparkles className="h-8 w-8 text-[#9fd4ae]" /><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] md:text-6xl">What Premium means.</h2></div><div><p className="text-lg leading-8 text-white/66">Premium is not a larger prompt window or a bundle of generic automation. It is an agent configured to take action through workflows specific to the business, with permissions, review points, and accountable handoffs defined before launch.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{['Takes action from approved signals', 'Follows business-specific workflows', 'Uses defined permissions and approvals', 'Keeps people in control of exceptions'].map((item) => <p key={item} className="flex gap-2 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm text-white/72"><Check className="h-4 w-4 shrink-0 text-[#9fd4ae]" />{item}</p>)}</div><div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-300/20 bg-amber-200/10 p-4 text-sm text-amber-100"><X className="h-4 w-4 shrink-0" />Premium is not currently available for JasonAI or Clara.</div><button type="button" onClick={openReview} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#111714]">Review the numbers with B2W <ArrowRight className="h-4 w-4" /></button></div></div></section>
      </main>
      <V2SiteFooter dark />
    </div>
  );
}
