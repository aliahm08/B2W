import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import Seo from '../../components/Seo';
import { explainerContent } from '../../content/dataExplainers';

export default function DataExplainerPage() {
  const location = useLocation();
  const content = useMemo(
    () => explainerContent[location.pathname] ?? explainerContent['/growth'],
    [location.pathname],
  );
  const [openItem, setOpenItem] = useState(content.examples[0]?.label ?? '');
  const isGreenAccent = content.accent === 'green';

  useEffect(() => {
    setOpenItem(content.examples[0]?.label ?? '');
  }, [content]);

  const handleToggle = (label: string) => {
    setOpenItem((current) => (current === label ? '' : label));
  };

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 border-b border-neutral-200 pb-10 md:pb-12"
        >
          <Link
            to="/#capabilities"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
          >
            Back to homepage capabilities
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-start">
            <div>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{content.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-500 md:text-2xl">
                {content.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">What This Shows</p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Concrete examples of the inputs we use before recommending changes.
              </h2>
              <p className="text-sm leading-6 text-neutral-300">{content.description}</p>
            </aside>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 md:grid-cols-2"
        >
          <div
            className={`p-6 md:p-7 ${
              isGreenAccent ? 'border border-emerald-200 bg-emerald-50/40' : 'border border-neutral-200 bg-white'
            }`}
          >
            <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">
              {content.examplesLabel ?? 'Example Inputs'}
            </h2>
            <ul className="space-y-3">
              {content.examples.map((item) => (
                <li
                  key={item.label}
                  className={`transition-colors ${
                    isGreenAccent
                      ? 'border border-emerald-200 bg-white hover:border-emerald-300'
                      : 'border border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item.label)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                    aria-expanded={openItem === item.label}
                  >
                    <Check className={`h-4 w-4 shrink-0 ${isGreenAccent ? 'text-emerald-700' : 'text-neutral-700'}`} />
                    <span className="flex-1 text-base font-medium leading-relaxed text-neutral-900">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                        openItem === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openItem === item.label ? (
                    <div
                      className={`px-4 py-4 text-sm leading-relaxed text-neutral-600 ${
                        isGreenAccent ? 'border-t border-emerald-200 bg-emerald-50/50' : 'border-t border-neutral-200'
                      }`}
                    >
                      {item.detail}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-neutral-200 bg-white p-6 md:p-7">
            <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">What We Use It For</h2>
            <ul className="space-y-4">
              {content.decisions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 border-t border-neutral-200 pt-8"
        >
          <div className="flex flex-col gap-5 border border-neutral-900 bg-neutral-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Next Step</p>
              <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                Want us to review your {content.eyebrow.toLowerCase()} inputs?
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Share your current business context and we can assess what data is available, what it is saying, and where the highest-leverage opportunities are.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/#contact"
                className="inline-flex min-h-12 items-center justify-center border border-white px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Tell us about your business
              </Link>
              <a
                href="mailto:info@b2w-ai.com?subject=Capability%20Review"
                className="inline-flex min-h-12 items-center justify-center border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Email B2W
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
