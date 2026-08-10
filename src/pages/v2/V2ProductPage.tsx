import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, FileStack, LockKeyhole, MessageSquareText, Search, Sparkles, Workflow } from 'lucide-react';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
import { V2SiteFooter, V2SiteHeader } from '../../components/V2SiteChrome';

type ProductId = 'jasonai' | 'clara';

const products = {
  jasonai: {
    name: 'JasonAI',
    status: 'Core available',
    title: 'Find the job context without chasing the thread.',
    description: 'JasonAI searches the business communication you approve and turns long project conversations into useful answers and summaries through WhatsApp.',
    color: '#9fd4ae',
    features: [
      { icon: Search, title: 'Communication search', body: 'Ask what was discussed, decided, requested, or changed across approved sources.' },
      { icon: MessageSquareText, title: 'Job summaries', body: 'Turn scattered project communication into a concise, reviewable job update.' },
      { icon: LockKeyhole, title: 'Approved context', body: 'Start with the sources and business boundaries your team explicitly approves.' },
    ],
  },
  clara: {
    name: 'Clara',
    status: 'Concept phase',
    title: 'Turn field context into a structured starting point.',
    description: 'Clara converts voice notes and project context into organized scopes, line-item estimates, and reviewable documents for project teams.',
    color: '#e8cbd9',
    features: [
      { icon: MessageSquareText, title: 'Voice capture', body: 'Record the project conditions while the context is still fresh.' },
      { icon: FileStack, title: 'Structured scopes', body: 'Organize work, quantities, assumptions, and exclusions into a reviewable scope.' },
      { icon: Sparkles, title: 'Estimate drafting', body: 'Generate editable line items with pricing context and contingency for human review.' },
    ],
  },
} as const;

export default function V2ProductPage({ product }: { product: ProductId }) {
  const config = products[product];
  const Icon = product === 'jasonai' ? Bot : FileStack;

  return (
    <div className="min-h-screen bg-[#111714] text-white selection:bg-white selection:text-black">
      <Seo title={`${config.name} — B2W V2`} description={config.description} canonicalPath={`/v2/products/${product}`} robots="noindex, nofollow" />
      <V2SiteHeader theme="dark" />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-24 pt-40 sm:px-8 md:pb-32 md:pt-48">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[-8rem] top-[-5rem] h-[34rem] w-[34rem] rounded-full opacity-30 blur-[120px]" style={{ backgroundColor: config.color }} />
          <div className="relative mx-auto max-w-7xl">
            <div className="flex items-center gap-3"><Icon className="h-7 w-7" style={{ color: config.color }} /><span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em]">{config.status}</span></div>
            <h1 className="mt-10 max-w-[11ch] text-[clamp(4rem,9vw,8rem)] font-medium leading-[.88] tracking-[-.07em]"><DescrambleText text={config.title} animateOnMount delay={120} /></h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/62 md:text-xl">{config.description}</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="mailto:info@b2w-ai.com?subject=B2W%20Product%20Demo" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#111714]">Request a demo <ArrowRight className="h-4 w-4" /></a><Link to="/v2/pricing" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold">Pricing and tiers</Link></div>
          </div>
        </section>

        <section className="bg-[#f6f3eb] px-5 py-20 text-[#141714] sm:px-8 md:py-28">
          <div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">Core capability</p><h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-.04em] md:text-6xl">A focused job to do—before autonomy.</h2>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">{config.features.map((feature) => <article key={feature.title} className="rounded-[1.5rem] border border-black/10 bg-white p-7"><feature.icon className="h-7 w-7 text-[#426149]" /><h3 className="mt-10 text-2xl font-semibold">{feature.title}</h3><p className="mt-4 leading-7 text-[#596159]">{feature.body}</p></article>)}</div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 md:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1fr]"><div><Workflow className="h-8 w-8" style={{ color: config.color }} /><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Premium adds governed action.</h2></div><div className="rounded-[1.75rem] border border-white/12 bg-white/[.04] p-7 md:p-9"><p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: config.color }}>Premium · Not available</p><p className="mt-5 text-xl leading-8 text-white/72">Premium agents will take action through business-specific workflows—preparing follow-up, routing work, updating systems, and advancing approved steps with human controls.</p><div className="mt-7 grid gap-3 text-sm text-white/68">{['Business-specific workflow design', 'Approval gates and accountable handoffs', 'Action across connected systems'].map((item) => <p key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: config.color }} />{item}</p>)}</div></div></div></section>
      </main>
      <V2SiteFooter dark />
    </div>
  );
}
