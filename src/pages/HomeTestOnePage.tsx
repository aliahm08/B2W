import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import B2WLogoMark from '../components/B2WLogoMark';
import { B2WVectorMark } from '../components/BrandVectorMarks';
import Seo from '../components/Seo';

const rotatingClients = [
  { label: 'restaurants', kind: 'smb', intent: 'hybrid' },
  { label: 'bus operations', kind: 'organization', intent: 'hybrid' },
  { label: 'general contractors', kind: 'organization', intent: 'management' },
  { label: 'cafes', kind: 'smb', intent: 'management' },
  { label: 'med spas', kind: 'smb', intent: 'hybrid' },
  { label: 'real estate developers', kind: 'organization', intent: 'hybrid' },
  { label: 'dentists', kind: 'smb', intent: 'hybrid' },
  { label: 'plumbers', kind: 'smb', intent: 'management' },
  { label: 'distribution teams', kind: 'organization', intent: 'platform' },
  { label: 'law firms', kind: 'smb', intent: 'management' },
  { label: 'franchises', kind: 'smb', intent: 'hybrid' },
  { label: 'manufacturing groups', kind: 'organization', intent: 'platform' },
  { label: 'brokerages', kind: 'smb', intent: 'platform' },
  { label: 'retailers', kind: 'smb', intent: 'platform' },
  { label: 'accountants', kind: 'smb', intent: 'platform' },
  { label: 'supermarkets', kind: 'smb', intent: 'management' },
  { label: 'wholesalers', kind: 'smb', intent: 'platform' },
];

const pathways = [
  {
    title: 'Consulting',
    href: '/services',
    key: 'consulting',
  },
  {
    title: 'Clara',
    href: '/clara',
    key: 'clara',
  },
  {
    title: 'AI Solutions',
    href: '/solutions',
    key: 'solutions',
  },
] as const;

type PathwayThemeKey = (typeof pathways)[number]['key'];

const pathwayThemes: Record<PathwayThemeKey, {
  page: string;
  ambientOne: string;
  ambientTwo: string;
  ambientThree: string;
  logo: string;
  eyebrow: string;
  heading: string;
  connector: string;
  rotatingText: string;
  body: string;
  footer: string;
  footerMuted: string;
  contact: string;
  activeButton: string;
  inactiveButton: string;
}> = {
  consulting: {
    page: 'bg-[#f8f6ef] text-neutral-950',
    ambientOne: 'bg-[#158c8c]/10',
    ambientTwo: 'bg-[#6d95c4]/10',
    ambientThree: 'bg-[#c9a35c]/12',
    logo: 'text-black',
    eyebrow: 'text-neutral-500',
    heading: 'text-neutral-950',
    connector: 'text-neutral-600',
    rotatingText: 'text-[#158c8c]',
    body: 'text-neutral-600',
    footer: 'border-neutral-900/10 text-neutral-950',
    footerMuted: 'text-neutral-500',
    contact: 'text-neutral-600 hover:text-neutral-950',
    activeButton: 'border-neutral-950 bg-neutral-950 text-white hover:border-neutral-950 hover:bg-white hover:text-neutral-950',
    inactiveButton: 'border-neutral-950 text-neutral-950 hover:border-b-2 hover:text-[#158c8c]',
  },
  clara: {
    page: 'bg-[#080a0f] text-white',
    ambientOne: 'bg-sky-300/16',
    ambientTwo: 'bg-teal-300/14',
    ambientThree: 'bg-white/8',
    logo: 'text-white',
    eyebrow: 'text-sky-200/70',
    heading: 'text-white',
    connector: 'text-sky-100/80',
    rotatingText: 'text-sky-200',
    body: 'text-neutral-300',
    footer: 'border-white/10 text-white',
    footerMuted: 'text-neutral-500',
    contact: 'text-neutral-400 hover:text-white',
    activeButton: 'border-white bg-white text-black hover:border-sky-100 hover:bg-sky-100 hover:text-black',
    inactiveButton: 'border-white/50 text-white hover:border-b-2 hover:text-sky-200',
  },
  solutions: {
    page: 'bg-[#fffaf0] text-[#141414]',
    ambientOne: 'bg-[#f1b37b]/24',
    ambientTwo: 'bg-[#1f5f7a]/14',
    ambientThree: 'bg-[#d9d2c3]/34',
    logo: 'text-[#141414]',
    eyebrow: 'text-[#9b3d1e]',
    heading: 'text-[#141414]',
    connector: 'text-[#4f463c]',
    rotatingText: 'text-[#1f5f7a]',
    body: 'text-[#4f463c]',
    footer: 'border-[#d9d2c3] text-[#141414]',
    footerMuted: 'text-[#6b6256]',
    contact: 'text-[#4f463c] hover:text-[#141414]',
    activeButton: 'border-[#141414] bg-[#141414] text-white hover:border-[#141414] hover:bg-[#2f2a24] hover:text-white',
    inactiveButton: 'border-[#141414] text-[#141414] hover:border-b-2 hover:text-[#4f463c]',
  },
};

function getThemeGradient(themeKey: PathwayThemeKey) {
  if (themeKey === 'clara') {
    return 'radial-gradient(circle_at_18%_16%,rgba(125,211,252,0.16),transparent_25%),radial-gradient(circle_at_84%_18%,rgba(45,212,191,0.12),transparent_26%),radial-gradient(circle_at_52%_74%,rgba(255,255,255,0.06),transparent_38%),linear-gradient(180deg,#080a0f_0%,#0c1218_100%)';
  }

  if (themeKey === 'solutions') {
    return 'radial-gradient(circle_at_16%_18%,rgba(241,179,123,0.36),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(31,95,122,0.16),transparent_26%),radial-gradient(circle_at_52%_72%,rgba(217,210,195,0.46),transparent_36%),linear-gradient(180deg,#fffaf0_0%,#f8f3e8_100%)';
  }

  return 'radial-gradient(circle_at_16%_10%,rgba(21,140,140,0.1),transparent_22%),radial-gradient(circle_at_84%_16%,rgba(109,149,196,0.1),transparent_20%),radial-gradient(circle_at_52%_76%,rgba(201,163,92,0.1),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8f6ef_34%,#ffffff_100%)';
}

export default function HomeTestOnePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeThemeKey, setActiveThemeKey] = useState<PathwayThemeKey>('consulting');
  const activeClient = rotatingClients[activeIndex];
  const activeTheme = pathwayThemes[activeThemeKey];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % rotatingClients.length);
    }, 1650);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <Seo
        title="Consulting, Clara, and AI Solutions"
        description="Explore B2W consulting, Clara, and AI solutions for practical business execution, operations, and applied AI systems."
        canonicalPath="/"
      />

      <main className={`min-h-screen overflow-hidden transition-colors duration-500 ${activeTheme.page}`}>
        <section className="relative isolate">
          <div
            className="absolute inset-0 transition-[background] duration-500"
            style={{ background: getThemeGradient(activeThemeKey) }}
          />
          <motion.div
            aria-hidden="true"
            className={`absolute -left-24 top-[18%] h-72 w-72 rounded-full blur-3xl transition-colors duration-500 ${activeTheme.ambientOne}`}
            animate={{ x: [0, 48, 12, 0], y: [0, -24, 36, 0], scale: [1, 1.08, 0.96, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className={`absolute right-[-5rem] top-[12%] h-80 w-80 rounded-full blur-3xl transition-colors duration-500 ${activeTheme.ambientTwo}`}
            animate={{ x: [0, -36, -12, 0], y: [0, 28, -18, 0], scale: [1, 0.94, 1.06, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className={`absolute bottom-[-7rem] left-[26%] h-96 w-96 rounded-full blur-3xl transition-colors duration-500 ${activeTheme.ambientThree}`}
            animate={{ x: [0, 22, -18, 0], y: [0, -20, 18, 0], scale: [1, 1.04, 0.98, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6">
            <header className="flex h-20 items-center justify-between gap-4">
              <B2WLogoMark className={`shrink-0 transition-colors duration-500 ${activeTheme.logo}`} />
            </header>

            <div className="flex flex-1 items-center py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-6xl pl-14 pr-14 md:pl-16 md:pr-16 lg:pl-20 lg:pr-20"
              >
                <p className={`mb-5 text-[11px] font-mono uppercase tracking-[0.28em] transition-colors duration-500 md:mb-6 ${activeTheme.eyebrow}`}>
                  Now Accepting Clients
                </p>
                <h1 className="flex w-full max-w-full items-baseline gap-[0.18em] whitespace-nowrap text-[clamp(1.2rem,4.65vw,4.85rem)] font-medium leading-[0.92] tracking-[-0.058em] [transform:scaleY(0.92)] origin-left">
                  <span className="inline-flex shrink-0 items-center gap-[0.12em]">
                    <B2WVectorMark title="" className={`h-[0.66em] w-[0.74em] shrink-0 overflow-visible transition-colors duration-500 ${activeTheme.logo}`} />
                    <span className={`b2w-wordmark inline-block tracking-[-0.09em] transition-colors duration-500 ${activeTheme.heading}`}>B2W</span>
                  </span>
                  <span className={`shrink-0 font-[family-name:var(--font-serif)] italic tracking-[-0.04em] transition-colors duration-500 ${activeTheme.connector}`}>
                    now accepting
                  </span>
                  <span className={`relative inline-flex min-h-[1.18em] min-w-[23ch] items-center overflow-visible py-[0.08em] transition-colors duration-500 ${activeTheme.rotatingText}`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeClient.label}
                        initial={{ opacity: 0, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(8px)' }}
                        transition={{ duration: 0.36, ease: 'easeOut' }}
                        className="block font-[family-name:var(--font-serif)] italic tracking-[-0.03em]"
                      >
                        {activeClient.label}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>

                <p className={`mt-8 max-w-xl text-base leading-7 transition-colors duration-500 md:text-lg ${activeTheme.body}`}>
                  Improve management execution, deploy practical AI systems, and build the operating structure needed to scale with more control.
                </p>

                <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2">
                  {pathways.map((pathway, index) => (
                    <Link
                      key={pathway.title}
                      to={pathway.href}
                      onMouseEnter={() => setActiveThemeKey(pathway.key)}
                      onFocus={() => setActiveThemeKey(pathway.key)}
                      className={
                        activeThemeKey === pathway.key
                          ? `inline-flex min-h-12 items-center whitespace-nowrap border px-5 py-3 text-lg font-medium outline-none transition-colors duration-200 focus:outline-none ${activeTheme.activeButton}`
                          : `inline-flex min-h-12 items-center whitespace-nowrap border-b px-5 py-3 text-lg font-medium transition-[color,border-bottom-width,border-color] duration-200 ${activeTheme.inactiveButton}`
                      }
                    >
                      {pathway.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <footer className={`border-t py-12 transition-colors duration-500 ${activeTheme.footer}`}>
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <h3 className={`text-lg font-medium tracking-tight transition-colors duration-500 ${activeTheme.heading}`}>
                    <span className="b2w-wordmark">B2W LLC</span>
                  </h3>
                  <p className={`mt-2 text-sm transition-colors duration-500 ${activeTheme.footerMuted}`}>© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div className={`flex gap-8 text-sm transition-colors duration-500 ${activeTheme.contact}`}>
                  <a
                    href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry"
                    className="transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
