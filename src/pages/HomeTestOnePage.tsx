import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
    title: 'Management Services',
    href: '/',
  },
  {
    title: 'AI Platform',
    href: '/capabilities',
  },
];

export default function HomeTestOnePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeClient = rotatingClients[activeIndex];
  const activeClientColorClass =
    activeClient.intent === 'management'
      ? 'text-[#5d4a2a]'
      : activeClient.intent === 'platform'
        ? 'text-[#315ea8]'
        : 'text-[#2f6a5d]';

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % rotatingClients.length);
    }, 1650);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <Seo
        title="B2W | SMB Home Prototype"
        description="Prototype homepage for B2W with rotating SMB positioning, consulting services, AI platform entry, and a client login."
      />

      <main className="min-h-screen overflow-hidden bg-[#f5f0e6] text-black">
        <section className="relative isolate">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.48),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(216,201,176,0.58),transparent_24%),radial-gradient(circle_at_52%_72%,rgba(224,212,189,0.38),transparent_34%),linear-gradient(180deg,#f8f3ea_0%,#f1e8d9_100%)]" />
          <motion.div
            aria-hidden="true"
            className="absolute -left-24 top-[18%] h-72 w-72 rounded-full bg-white/30 blur-3xl"
            animate={{ x: [0, 48, 12, 0], y: [0, -24, 36, 0], scale: [1, 1.08, 0.96, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute right-[-5rem] top-[12%] h-80 w-80 rounded-full bg-[#d8c9b0]/28 blur-3xl"
            animate={{ x: [0, -36, -12, 0], y: [0, 28, -18, 0], scale: [1, 0.94, 1.06, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[-7rem] left-[26%] h-96 w-96 rounded-full bg-[#e8dcc8]/24 blur-3xl"
            animate={{ x: [0, 22, -18, 0], y: [0, -20, 18, 0], scale: [1, 1.04, 0.98, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-6">
            <div className="flex items-start justify-between gap-4">
              <motion.div
                aria-hidden="true"
                className="text-black/80"
                animate={{ rotate: [0, 3, -2, 0], y: [0, -2, 1, 0], opacity: [0.82, 1, 0.88, 0.82] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 140 120" className="h-12 w-14 md:h-14 md:w-16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {[
                    'M70 8C95 19 109 39 112 58C116 81 101 101 78 111C56 119 31 112 18 92C5 73 7 48 24 29C37 14 53 7 70 8Z',
                    'M70 12C92 22 104 40 106 57C109 77 96 94 76 103C57 110 37 104 25 87C14 71 15 50 29 34C40 21 54 13 70 12Z',
                    'M70 16C89 25 99 41 101 56C103 73 91 88 74 95C58 102 42 97 32 83C22 69 22 52 34 39C43 28 55 19 70 16Z',
                    'M70 21C85 29 94 43 95 56C97 70 87 82 73 88C59 94 46 90 37 79C29 67 29 54 39 43C47 34 56 26 70 21Z',
                  ].map((path, index) => (
                    <motion.path
                      key={path}
                      d={path}
                      stroke="currentColor"
                      strokeWidth="1.15"
                      strokeLinecap="round"
                      opacity={0.24 + index * 0.12}
                      animate={{ pathLength: [0.88, 1, 0.9], opacity: [0.18 + index * 0.1, 0.34 + index * 0.12, 0.18 + index * 0.1] }}
                      transition={{ duration: 5.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </svg>
              </motion.div>

              <Link
                to="/client/uyghur-eats"
                className="inline-flex min-h-10 items-center text-sm font-medium text-neutral-500 transition-colors hover:text-black"
              >
                Client Login
              </Link>
            </div>

            <div className="flex flex-1 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-6xl"
              >
                <h1 className="flex w-full items-baseline gap-[0.22em] whitespace-nowrap text-[clamp(1.65rem,7.1vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.065em] [transform:scaleY(0.92)] origin-left">
                  <span className="b2w-wordmark inline-block shrink-0 tracking-[-0.09em] text-black">B2W</span>
                  <span className="shrink-0 text-black/72">/</span>
                  <span className={`relative inline-block min-h-[0.98em] min-w-[23ch] overflow-hidden ${activeClientColorClass}`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeClient.label}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.36, ease: 'easeOut' }}
                        className="block font-[family-name:var(--font-serif)] italic tracking-[-0.03em]"
                      >
                        {activeClient.label}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-base leading-7 text-neutral-600 md:text-lg">
                  B2W helps businesses improve management execution, deploy practical AI systems, and build the operating structure needed to scale with more control.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                  {pathways.map((pathway, index) => (
                    <Link
                      key={pathway.title}
                      to={pathway.href}
                      className={
                        index === 0
                          ? 'inline-flex min-h-12 items-center border border-black bg-black px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-neutral-800'
                          : 'inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:text-neutral-600'
                      }
                    >
                      {pathway.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <footer className="flex justify-start pb-6 pt-10">
              <a
                href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry"
                className="inline-flex min-h-10 items-center text-sm font-medium text-neutral-500 transition-colors hover:text-black"
              >
                Contact
              </a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
