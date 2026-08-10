import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DescrambleText from '../../components/DescrambleText';
import { HomeSiteFooter, HomeSiteHeader } from '../../components/HomeSiteChrome';
import Seo from '../../components/Seo';

const contractorActions = ['grow', 'optimize', 'search', 'scale', 'follow up'];

const destinations = [
  {
    label: 'JasonAI',
    title: 'Find the job detail buried in the conversation.',
    body: 'Search approved WhatsApp work group chats and turn long contractor conversations into direct answers and useful summaries.',
    to: '/jasonai',
  },
  {
    label: 'Workflows',
    title: 'See where AI fits into a contractor business.',
    body: 'Review practical workflows for trade businesses, contracting firms, and AEC companies—from a question to a checked next step.',
    to: '/workflows',
  },
  {
    label: 'Pricing',
    title: 'Price the assistant and model the return.',
    body: 'Review the current JasonAI plan, calculate potential ROI, and compare standard pricing with the founding offer.',
    to: '/pricing',
  },
] as const;

export default function V3HomePage() {
  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActionIndex((current) => (current + 1) % contractorActions.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfaf6] text-[#111827] selection:bg-[#111315] selection:text-white">
      <Seo
        title="B2W V3 — AI Workflows for Contractors"
        description="B2W equips contractors with JasonAI, practical AI workflows, and clear ROI modeling."
        canonicalPath="/v3"
        robots="noindex, nofollow"
      />
      <HomeSiteHeader textClass="text-slate-950" />

      <main>
        <section data-header-theme="light" className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4b28c]/16 blur-[120px]" />
          <div className="relative mx-auto w-full max-w-7xl text-center">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9b3d1e]">
              B2W · AI for contractors
            </motion.p>
            <h1 className="mx-auto mt-8 max-w-[12ch] text-[clamp(3.5rem,10vw,9.5rem)] font-medium leading-[0.86] tracking-[-0.075em]">
              <DescrambleText text="We equip contractors to" animateOnView delay={100} />{' '}
              <span className="relative inline-grid min-w-[5.5ch] text-left text-[#b24a24]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={contractorActions[actionIndex]}
                    className="col-start-1 row-start-1"
                    initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {contractorActions[actionIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Start with the communication your team already uses. Find answers faster, improve repeat workflows, and make growth easier to manage.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/jasonai" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#111315] px-6 text-sm font-semibold text-white transition hover:bg-[#b24a24]">
                See JasonAI <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/workflows" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 text-sm font-semibold transition hover:border-black/30">
                Explore workflows <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section data-header-theme="light" className="border-y border-black/10 bg-[#f3efe6] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {destinations.map((item, index) => (
              <motion.article key={item.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} className="flex min-h-80 flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(17,19,21,.06)]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b3d1e]">{item.label}</p>
                <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em]">{item.title}</h2>
                <p className="mt-5 text-sm leading-7 text-slate-600">{item.body}</p>
                <Link to={item.to} className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">
                  Open {item.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <div className="bg-[#f3efe6]"><HomeSiteFooter className="text-slate-500" /></div>
    </div>
  );
}
