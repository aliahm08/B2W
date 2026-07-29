import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, LockKeyhole, Mail, MessageCircle, Mic } from 'lucide-react';
import B2WIcon from '../components/logo/B2WIcon';
import Seo from '../components/Seo';

type HeroMode = 'consulting' | 'jasonai' | 'clara';

const heroModes: Record<HeroMode, {
  label: string;
  statement: string;
  description: string;
  href: string;
  background: string;
  textClass: string;
  subtextClass: string;
  accentClass: string;
  glow: string;
  footerClass: string;
}> = {
  consulting: {
    label: 'Consulting',
    statement: 'We take businesses to the next stage.',
    description:
      'We consult with growing businesses, diagnose the real constraint, and bring developers and analysts to build the right service, system, or workflow.',
    href: '/services',
    background:
      'linear-gradient(180deg,#fbfaf6 0%,#f7f4ed 55%,#fbfaf6 100%)',
    textClass: 'text-slate-950',
    subtextClass: 'text-slate-600',
    accentClass: 'border-slate-950 bg-slate-950 text-white hover:bg-[#24724f]',
    glow: 'rgba(36,114,79,0.14)',
    footerClass: 'text-slate-500',
  },
  jasonai: {
    label: 'Turn daily messages into follow-up clarity.',
    statement: 'Turn daily messages into follow-up clarity.',
    description:
      'A WhatsApp-ready assistant for field teams that catches scope changes, missed follow-ups, and job context before details slip.',
    href: '/jasonai',
    background:
      'radial-gradient(circle at 18% 18%,rgba(178,74,36,0.28),transparent 30%),radial-gradient(circle at 82% 18%,rgba(37,211,102,0.14),transparent 26%),linear-gradient(180deg,#17110f 0%,#2a1710 58%,#fff3e7 100%)',
    textClass: 'text-[#fff7ed]',
    subtextClass: 'text-[#f4b28c]',
    accentClass: 'border-[#f4b28c] bg-[#14110f] text-white hover:bg-[#2a1710]',
    glow: 'rgba(178,74,36,0.34)',
    footerClass: 'text-[#fff7ed]/62',
  },
  clara: {
    label: 'Evolve project inputs into organized action.',
    statement: 'Evolve project inputs into organized action.',
    description:
      'Project tools for turning voice notes, estimates, approvals, and decisions into structured scopes and next actions.',
    href: '/clara',
    background:
      'radial-gradient(circle at 16% 18%,rgba(166,101,137,0.24),transparent 30%),radial-gradient(circle at 84% 20%,rgba(232,203,218,0.42),transparent 28%),linear-gradient(180deg,#fbf5f8 0%,#fffafd 56%,#3d1f33 100%)',
    textClass: 'text-[#3d1f33]',
    subtextClass: 'text-[#9a5f7d]',
    accentClass: 'border-[#9a5f7d] bg-white/86 text-[#3d1f33] hover:bg-[#fbf0f5]',
    glow: 'rgba(166,101,137,0.28)',
    footerClass: 'text-[#3d1f33]/70',
  },
};

function HeaderLogo() {
  return (
    <div className="inline-flex min-h-10 items-center gap-3">
      <span className="inline-flex items-center gap-3">
        <B2WIcon title="" className="h-8 w-9 shrink-0 overflow-visible sm:h-9 sm:w-10" />
      </span>
    </div>
  );
}

function ProductFrame({
  mode,
  setActiveMode,
}: {
  mode: Exclude<HeroMode, 'consulting'>;
  setActiveMode: (mode: HeroMode) => void;
}) {
  const hero = heroModes[mode];
  const Icon = mode === 'jasonai' ? MessageCircle : Mic;
  const isJasonAI = mode === 'jasonai';
  const frameClass = isJasonAI
    ? 'border-[#f4b28c]/70 bg-[#14110f] text-white shadow-[0_28px_90px_rgba(178,74,36,0.22)]'
    : 'border-[#b889a1]/45 bg-[#fff8fb]/95 text-[#3d1f33] shadow-[0_28px_90px_rgba(126,73,103,0.18)]';
  const eyebrowClass = isJasonAI ? 'text-[#f4b28c]' : 'text-[#9a5f7d]';
  const buttonClass = isJasonAI
    ? 'border-[#f4b28c] bg-[#f4b28c] text-[#14110f] hover:bg-[#ffd7bd]'
    : 'border-[#7e4967] bg-[#3d1f33] text-white hover:bg-[#7e4967]';

  return (
    <motion.article
      layout
      onMouseEnter={() => setActiveMode(mode)}
      onMouseLeave={() => setActiveMode('consulting')}
      onFocus={() => setActiveMode(mode)}
      onBlur={() => setActiveMode('consulting')}
      className={`group relative flex min-h-[26rem] overflow-hidden rounded-[32px] border p-6 transition-colors sm:p-8 ${frameClass}`}
      initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
          isJasonAI ? 'bg-[#b24a24]/34' : 'bg-[#d9a9c2]/42'
        }`}
        animate={{ scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${eyebrowClass}`}>
            {mode === 'jasonai' ? 'JasonAI' : 'Clara'}
          </span>
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="mt-10 flex flex-1 flex-col justify-end">
          <h2 className="max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            {hero.label}
          </h2>
          <div className="grid grid-rows-[1fr] opacity-100 transition-all duration-500 ease-out lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
            <div className="overflow-hidden">
              <div className="pt-3">
                <p className={`max-w-xl text-sm font-medium leading-6 sm:text-base ${eyebrowClass}`}>
                  {hero.description}
                </p>
                <Link
                  to={hero.href}
                  className={`mt-7 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${buttonClass}`}
                >
                  {mode === 'jasonai' ? 'Explore JasonAI' : 'Open Clara'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}


export default function HomeTestOnePage() {
  const [heroMode, setHeroMode] = useState<HeroMode>('consulting');
  const activeHero = heroModes[heroMode];

  return (
    <>
      <Seo
        title="Consulting, Clara, and JasonAI"
        description="B2W helps growing businesses solve problems through consulting, developer and analyst support, Clara project tools, and JasonAI."
        canonicalPath="/"
      />
      <motion.main
        className="relative min-h-screen overflow-hidden text-[#111827]"
        animate={{ background: activeHero.background }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden="true"
          className="fixed left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{ backgroundColor: activeHero.glow, scale: heroMode === 'consulting' ? 1 : 1.08 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.header
          className="fixed top-0 left-0 right-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 mix-blend-difference text-white"
          initial={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" aria-label="B2W home" className="inline-flex items-center">
            <HeaderLogo />
          </Link>
          <a
            href="mailto:info@b2w-ai.com"
            className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold shadow-sm transition-all hover:bg-white hover:text-black"
          >
            <span>Contact</span>
            <Mail className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5" />
          </a>
        </motion.header>

        <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-5 pt-20 pb-16 sm:px-8 lg:px-10">
          <motion.div
            layout
            className="mx-auto flex max-w-6xl flex-col items-center text-center"
            transition={{ layout: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } }}
          >
            <motion.h1
              layout
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className={`b2w-wordmark mx-auto max-w-[11ch] text-[clamp(3.35rem,12.4vw,11rem)] font-medium leading-[0.82] tracking-[-0.08em] ${activeHero.textClass}`}
            >
              {heroModes.consulting.statement}
            </motion.h1>

            <motion.div
              layout
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
              transition={{ layout: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } }}
            >
              <Link
                to="/services"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-950 bg-slate-950 px-5 py-3 text-base font-semibold text-white shadow-[0_18px_48px_rgba(15,23,42,0.14)] transition-colors hover:bg-[#24724f]"
              >
                Explore Consulting
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>
              <a
                href="#products"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-950/16 bg-white/95 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.10)] transition-colors hover:bg-white"
              >
                See Products
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 group-focus-visible:translate-y-1" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        <section
          id="products"
          className="relative z-10 mx-auto grid w-full max-w-7xl content-center gap-6 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-16"
        >
          <ProductFrame mode="jasonai" setActiveMode={setHeroMode} />
          <ProductFrame mode="clara" setActiveMode={setHeroMode} />
        </section>

        <motion.footer
          className={`relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-sm sm:px-8 lg:px-10 ${activeHero.footerClass}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.56, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>B2W LLC</span>
          <Link
            to="/internal"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-xs font-semibold transition hover:bg-white/15"
          >
            <LockKeyhole className="h-3.5 w-3.5" />
            Internal
          </Link>
        </motion.footer>
      </motion.main>
    </>
  );
}
