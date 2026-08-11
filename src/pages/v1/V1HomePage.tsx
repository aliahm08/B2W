import { motion } from 'motion/react';
import { ArrowDown, ArrowRight, MessageCircle, Mic } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PreviewFooter from '../../components/PreviewFooter';
import Seo from '../../components/Seo';
import { LiveSiteHeader } from '../../components/V2SiteChrome';

type HeroMode = 'consulting' | 'jasonai' | 'estimates';

const heroModes: Record<HeroMode, {
  label: string;
  statement: string;
  description: string;
  href: string;
  background: string;
  textClass: string;
  accentClass: string;
  glow: string;
}> = {
  consulting: {
    label: 'Consulting',
    statement: 'We take businesses to the next stage.',
    description:
      'We consult with growing businesses, diagnose the real constraint, and bring developers and analysts to build the right service, system, or workflow.',
    href: '/v1/services',
    background: 'linear-gradient(180deg,#fbfaf6 0%,#f7f4ed 55%,#fbfaf6 100%)',
    textClass: 'text-slate-950',
    accentClass: 'text-slate-600',
    glow: 'rgba(36,114,79,0.14)',
  },
  jasonai: {
    label: 'JasonAI',
    statement: 'Turn daily messages into follow-up clarity.',
    description:
      'A WhatsApp-ready assistant that searches approved work communication and turns long job conversations into concise summaries.',
    href: '/v1/jasonai',
    background:
      'radial-gradient(circle at 18% 18%,rgba(178,74,36,0.28),transparent 30%),radial-gradient(circle at 82% 18%,rgba(37,211,102,0.14),transparent 26%),linear-gradient(180deg,#17110f 0%,#2a1710 58%,#fff3e7 100%)',
    textClass: 'text-[#fff7ed]',
    accentClass: 'text-[#f4b28c]',
    glow: 'rgba(178,74,36,0.34)',
  },
  estimates: {
    label: 'Estimates',
    statement: 'Turn field inputs into organized estimates.',
    description:
      'The original Clara workspace for turning voice notes, project context, approvals, and decisions into structured scopes and reviewable estimates.',
    href: '/v1/estimates',
    background:
      'radial-gradient(circle at 16% 18%,rgba(14,116,144,0.20),transparent 30%),radial-gradient(circle at 84% 20%,rgba(186,230,253,0.30),transparent 28%),linear-gradient(180deg,#eef8f8 0%,#ffffff 56%,#082f3a 100%)',
    textClass: 'text-[#082f3a]',
    accentClass: 'text-[#0e7490]',
    glow: 'rgba(14,116,144,0.25)',
  },
};

function ProductTray({
  mode,
  setActiveMode,
}: {
  mode: Exclude<HeroMode, 'consulting'>;
  setActiveMode: (mode: HeroMode) => void;
}) {
  const hero = heroModes[mode];
  const isJasonAI = mode === 'jasonai';
  const Icon = isJasonAI ? MessageCircle : Mic;

  return (
    <motion.article
      onMouseEnter={() => setActiveMode(mode)}
      onMouseLeave={() => setActiveMode('consulting')}
      onFocus={() => setActiveMode(mode)}
      onBlur={() => setActiveMode('consulting')}
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex min-h-[26rem] overflow-hidden rounded-[2rem] border p-6 sm:p-8 ${
        isJasonAI
          ? 'border-[#f4b28c]/70 bg-[#14110f] text-white shadow-[0_28px_90px_rgba(178,74,36,0.22)]'
          : 'border-[#0e7490]/35 bg-white/88 text-[#082f3a] shadow-[0_28px_90px_rgba(14,116,144,0.18)] backdrop-blur'
      }`}
    >
      <motion.div
        aria-hidden="true"
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${isJasonAI ? 'bg-[#b24a24]/34' : 'bg-[#7dd3fc]/35'}`}
        animate={{ scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${hero.accentClass}`}>B2W</span>
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="mt-10 flex flex-1 flex-col justify-end">
          <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl">{hero.label}</h2>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-7">{hero.statement}</p>
          <p className={`mt-3 max-w-xl text-sm font-medium leading-6 sm:text-base ${hero.accentClass}`}>{hero.description}</p>
          <Link
            to={hero.href}
            className={`mt-7 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${
              isJasonAI
                ? 'border-[#f4b28c] bg-[#f4b28c] text-[#14110f] hover:bg-[#ffd7bd]'
                : 'border-[#0e7490] bg-[#082f3a] text-white hover:bg-[#0e7490]'
            }`}
          >
            Explore {hero.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function V1HomePage() {
  const [heroMode, setHeroMode] = useState<HeroMode>('consulting');
  const activeHero = heroModes[heroMode];

  return (
    <>
      <Seo
        title="B2W V1 · Consulting, JasonAI, and Estimates"
        description="B2W helps growing businesses reach the next stage through SMB consulting, JasonAI, and structured project estimates."
        canonicalPath="/v1"
        robots="noindex, nofollow"
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

        <LiveSiteHeader followPageTheme />

        <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              B2W consulting + business tools
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className={`b2w-wordmark mx-auto max-w-[11ch] text-[clamp(3.35rem,12.4vw,10rem)] font-medium leading-[0.82] tracking-[-0.08em] ${activeHero.textClass}`}
            >
              {heroModes.consulting.statement}
            </motion.h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{heroModes.consulting.description}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/v1/services" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-950 bg-slate-950 px-5 py-3 text-base font-semibold text-white shadow-[0_18px_48px_rgba(15,23,42,0.14)] transition-colors hover:bg-[#24724f]">
                Explore Consulting
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="#v1-products" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-950/16 bg-white/78 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.10)] backdrop-blur transition-colors hover:bg-white">
                See Business Tools
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </a>
            </div>
          </div>
        </section>

        <section id="v1-products" className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl scroll-mt-20 content-center gap-6 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10">
          <ProductTray mode="jasonai" setActiveMode={setHeroMode} />
          <ProductTray mode="estimates" setActiveMode={setHeroMode} />
        </section>

        <PreviewFooter />
      </motion.main>
    </>
  );
}
