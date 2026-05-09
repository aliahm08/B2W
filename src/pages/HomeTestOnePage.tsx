import { AnimatePresence, motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import B2WLogoMark from '../components/B2WLogoMark';
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
  },
  {
    title: 'Clara',
    href: '/clara',
  },
  {
    title: 'AI Solutions',
    href: '/solutions',
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
        title="Consulting, Clara, and AI Solutions"
        description="Explore B2W consulting, Clara, and AI solutions for practical business execution, operations, and applied AI systems."
        canonicalPath="/"
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

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6">
            <header className="flex h-20 items-center justify-between gap-4">
              <B2WLogoMark className="shrink-0" />

              <div className="flex items-center gap-4">
                <Link
                  to="/client/uyghur-eats"
                  aria-label="Client login"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black transition-colors hover:border-black hover:bg-white"
                >
                  <LogIn className="h-4 w-4" />
                </Link>
              </div>
            </header>

            <div className="flex flex-1 items-center py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-6xl pl-14 pr-14 md:pl-16 md:pr-16 lg:pl-20 lg:pr-20"
              >
                <p className="mb-5 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 md:mb-6">
                  Now Accepting Clients
                </p>
                <h1 className="flex w-full max-w-full items-baseline gap-[0.16em] whitespace-nowrap text-[clamp(1.35rem,5.9vw,5.9rem)] font-medium leading-[0.88] tracking-[-0.065em] [transform:scaleY(0.92)] origin-left">
                  <span className="b2w-wordmark inline-block shrink-0 tracking-[-0.09em] text-black">B2W</span>
                  <span className="shrink-0 font-light text-black">/</span>
                  <span className={`relative inline-flex min-h-[1.18em] min-w-[23ch] items-center overflow-visible py-[0.08em] ${activeClientColorClass}`}>
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

                <p className="mt-8 max-w-xl text-base leading-7 text-neutral-600 md:text-lg">
                  Improve management execution, deploy practical AI systems, and build the operating structure needed to scale with more control.
                </p>

                <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2">
                  {pathways.map((pathway, index) => (
                    <Link
                      key={pathway.title}
                      to={pathway.href}
                      className={
                        index === 0
                          ? 'inline-flex min-h-12 items-center whitespace-nowrap border border-black bg-black px-5 py-3 text-lg font-medium text-white outline-none transition-colors duration-150 hover:border-black hover:bg-white hover:text-black focus:outline-none'
                          : 'inline-flex min-h-12 items-center whitespace-nowrap border-b border-black px-5 py-3 text-lg font-medium text-black transition-[color,border-bottom-width] duration-150 hover:border-b-2 hover:text-neutral-600'
                      }
                    >
                      {pathway.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <footer className="border-t border-black/10 py-12">
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-black">
                    <span className="b2w-wordmark">B2W LLC</span>
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div className="flex gap-8 text-sm text-neutral-600">
                  <a
                    href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry"
                    className="hover:text-black transition-colors"
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
