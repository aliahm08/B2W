import { ArrowRight, Check, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import DescrambleText from '../components/DescrambleText';
import { HomeSiteFooter } from '../components/HomeSiteChrome';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import Seo from '../components/Seo';
import JasonAIPricingCalculator from './JasonAIPricingCalculator';

const included = [
  'JasonAI in approved WhatsApp work group chats',
  'Search across approved business communication',
  'Clear job and time-period summaries',
  'Guided source mapping and setup',
] as const;

export default function PricingPage() {
  const bookReview = () => {
    window.location.href = 'mailto:info@b2w-ai.com?subject=JasonAI%20pricing%20and%20ROI%20review';
  };
  const discussClara = () => {
    window.location.href = '/contact?type=clara';
  };

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#161311] selection:bg-[#161311] selection:text-white">
      <Seo />
      <LiveSiteHeader />

      <main>
        <section data-header-theme="light" className="relative overflow-hidden px-5 pb-20 pt-40 sm:px-8 sm:pb-28 sm:pt-48 lg:px-10">
          <div aria-hidden="true" className="absolute right-[-8rem] top-0 h-[34rem] w-[34rem] rounded-full bg-[#f4b28c]/24 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#9b3d1e]">JasonAI · Plans and return</p>
            <h1 className="mt-8 max-w-[11ch] break-words text-[clamp(3.15rem,15vw,8.5rem)] font-medium leading-[.88] tracking-[-.07em] sm:text-[clamp(4rem,9vw,8.5rem)] sm:leading-[.86] sm:tracking-[-.075em]">
              <DescrambleText text="Price the assistant. Model the return." animateOnMount delay={100} />
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#655d57] sm:text-xl">Review the available JasonAI offer for approved WhatsApp conversations, then explore Clara as a customized document-workspace concept with no published plan or price.</p>
          </div>
        </section>

        <section data-header-theme="dark" className="bg-[#151210] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#f4b28c]">Available plan</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">JasonAI Assistant</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/58">The Admin for approved WhatsApp work group chats: find context, answer questions, and summarize the work.</p>
            </div>
            <article className="rounded-[2rem] border border-white/14 bg-white p-7 text-[#161311] sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3"><MessageCircle className="h-6 w-6 text-[#b24a24]" /><p className="font-semibold">Standard pricing</p></div>
                  <p className="mt-5 text-5xl font-semibold tracking-[-.05em]">$99<span className="text-lg font-medium text-black/45"> / month</span></p>
                  <p className="mt-2 text-sm text-black/52">$2,000 one-time setup</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-800">Available now</span>
              </div>
              <div className="mt-8 grid gap-3 border-t border-black/10 pt-7 sm:grid-cols-2">
                {included.map((item) => <p key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-[#b24a24]" />{item}</p>)}
              </div>
              <button type="button" onClick={bookReview} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#161311] px-6 text-sm font-semibold text-white transition hover:bg-[#b24a24]">Book a free demo <ArrowRight className="h-4 w-4" /></button>
            </article>

            <div className="border-t border-white/14 pt-8 lg:col-span-2 lg:grid lg:grid-cols-[.72fr_1.28fr] lg:gap-8">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#f4b28c]">Concept phase</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Clara</h2>
                <p className="mt-5 max-w-lg text-lg leading-8 text-white/58">Your private AI workspace for turning site notes, company knowledge, and project context into reviewable documents.</p>
              </div>
              <article className="mt-8 rounded-[2rem] border border-white/14 bg-[#2b1828] p-7 text-white sm:p-9 lg:mt-0">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3"><Sparkles className="h-6 w-6 text-[#f4b28c]" /><p className="font-semibold">Private AI workspace</p></div>
                    <p className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">No published price</p>
                    <p className="mt-2 text-sm text-white/58">Clara is not generally available and does not have a published plan or price.</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-amber-900">Concept only</span>
                </div>
                <div className="mt-8 grid gap-3 border-t border-white/14 pt-7 sm:grid-cols-2">
                  {['Create estimates and documents from site context', 'Use approved company knowledge and preferences', 'Keep drafts and conversations in one private workspace', 'Review outputs before sharing or using them'].map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-white/78"><Check className="mt-1 h-4 w-4 shrink-0 text-[#f4b28c]" />{item}</p>)}
                </div>
                <button type="button" onClick={discussClara} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#161311] transition hover:bg-[#f4b28c]">Discuss the concept <ArrowRight className="h-4 w-4" /></button>
              </article>
            </div>
          </div>
        </section>

        <section id="roi" data-header-theme="light" className="border-y border-black/10 bg-[#eee7da] py-8">
          <JasonAIPricingCalculator onBookReview={bookReview} variant="embedded" context="project-teams" />
        </section>

        <section data-header-theme="light" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <div><ShieldCheck className="h-8 w-8 text-[#b24a24]" /><h2 className="mt-6 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Focused scope. Clear boundaries.</h2></div>
            <div className="space-y-4 text-lg leading-8 text-[#655d57]"><p>JasonAI searches only the business communication approved during setup. People review its answers before acting on them.</p><p>Clara is a concept for keeping company documents, preferences, and drafts in a permissioned workspace. It is not available or priced. Other B2W products and bundles are not available for purchase.</p></div>
          </div>
        </section>
      </main>

      <div className="bg-[#fbf7f1]"><HomeSiteFooter className="text-[#655d57]" /></div>
    </div>
  );
}
