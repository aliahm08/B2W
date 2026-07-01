import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileText, Mic } from 'lucide-react';
import Seo from '../../components/Seo';

const voiceNote =
  'I am repairing a 1200 square foot living room with 6 windows, 2 archways, and one door to the basement staircase. The ceilings are approximately 13 feet tall, and there are 12 spot lights. We need to replace all window frames, caulk all seals and fix the glass on 3 windows. The carpeting needs to be removed, trashed, and the original wood flooring needs to be sanded, buffed, and polished assuming no damage.';

const noteRegions = [
  {
    label: 'Room',
    detail: '1,200 sq ft base scope',
    startWord: 4,
    endWord: 8,
  },
  {
    label: 'Openings',
    detail: '6 windows, 2 archways, 1 basement stair door',
    startWord: 10,
    endWord: 20,
  },
  {
    label: 'Ceiling',
    detail: '13 ft ceiling height, 12 spot lights',
    startWord: 25,
    endWord: 33,
  },
  {
    label: 'Windows',
    detail: 'Replace frames, caulk seals, repair 3 panes',
    startWord: 37,
    endWord: 50,
  },
  {
    label: 'Flooring',
    detail: 'Remove carpet, dispose, sand, buff, polish',
    startWord: 52,
    endWord: 69,
  },
];

function MiniRecordGlyph() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black" aria-hidden="true">
      <span className="flex h-4 items-center gap-[2px]">
        {[7, 10, 14, 11].map((height, index) => (
          <span key={`${height}-${index}`} className="w-[2px] rounded-full bg-white" style={{ height }} />
        ))}
      </span>
    </span>
  );
}

function RecordIcon({ isRecording }: { isRecording: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label="Record voice note"
      className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black shadow-[0_24px_70px_rgba(0,0,0,0.42)] ring-1 ring-white/12 md:h-28 md:w-28"
      animate={isRecording ? { scale: [1, 0.92, 1.04, 1] } : { scale: 1 }}
      transition={
        isRecording
          ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.22, 1, 0.36, 1] }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[#f5dce8]/40"
        animate={isRecording ? { scale: [1, 1.45], opacity: [0.55, 0] } : { scale: 1, opacity: 0 }}
        transition={isRecording ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' } : { duration: 0.45, ease: 'easeInOut' }}
      />
      <span className="flex h-12 items-center gap-[4px]">
        {[18, 26, 34, 42, 30, 22].map((height, index) => (
          <motion.span
            key={height}
            className="w-[5px] rounded-full bg-white"
            animate={isRecording ? { height: [height * 0.58, height, height * 0.72] } : { height }}
            transition={
              isRecording
                ? { duration: 0.8, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }
                : { duration: 0.5, delay: index * 0.035, ease: 'easeInOut' }
            }
          />
        ))}
      </span>
    </motion.button>
  );
}

function VoiceCaptureSection({
  shouldStart,
  onOrganize,
}: {
  shouldStart: boolean;
  onOrganize: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [hasAutoOrganized, setHasAutoOrganized] = useState(false);
  const [isTranscriptHighlighted, setIsTranscriptHighlighted] = useState(false);
  const words = useMemo(() => voiceNote.split(' '), []);
  const transcriptComplete = visibleWordCount >= words.length;
  const organizeThreshold = Math.ceil(words.length * 0.67);
  const canOrganizeScope = visibleWordCount >= organizeThreshold;
  const isActive = shouldStart || hasEntered;
  const isRecording = isActive && !transcriptComplete;

  const beginOrganizing = useCallback(
    (shouldScroll: boolean) => {
      if (!canOrganizeScope) {
        return;
      }

      setIsTranscriptHighlighted(true);

      window.setTimeout(() => {
        onOrganize();

        if (shouldScroll) {
          window.setTimeout(() => {
            document.getElementById('organized-line-items')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }, 900);
    },
    [canOrganizeScope, onOrganize],
  );

  useEffect(() => {
    if (!isActive || transcriptComplete) {
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleWordCount((current) => Math.min(words.length, current + 1));
    }, 72);

    return () => window.clearInterval(timer);
  }, [isActive, transcriptComplete, words.length]);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      if (window.scrollY > 180 && rect.top < viewportHeight * 0.78) {
        setHasEntered(true);
      }

      if (rect.top < -viewportHeight * 0.28) {
        setVisibleWordCount(words.length);
        if (!hasAutoOrganized) {
          setHasAutoOrganized(true);
          setIsTranscriptHighlighted(true);
          window.setTimeout(() => {
            onOrganize();
          }, 900);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAutoOrganized, onOrganize, words.length]);

  const organizeScope = () => {
    beginOrganizing(true);
  };

  return (
    <section
      id="see-how"
      ref={sectionRef}
      className="relative z-10 border-t border-[#e8cbd9]/10 bg-[#120c11] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative rounded-[1.75rem] border border-[#e8cbd9]/12 bg-[#1a1118]/88 p-4 shadow-[0_34px_100px_rgba(0,0,0,0.34)] backdrop-blur md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <RecordIcon isRecording={isRecording} />
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <motion.span
                    className={`h-2 w-2 rounded-full ${transcriptComplete ? 'bg-[#bae6fd]' : 'bg-red-400'}`}
                    animate={{ opacity: transcriptComplete ? 0.85 : [0.55, 1, 0.55] }}
                    transition={transcriptComplete ? { duration: 0.35, ease: 'easeInOut' } : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      boxShadow: transcriptComplete ? '0 0 18px rgba(186,230,253,0.55)' : '0 0 18px rgba(248,113,113,0.8)',
                    }}
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5dce8]/70">
                    {transcriptComplete ? 'Recording complete' : 'Recording active'}
                  </p>
                </div>
                <p className="text-sm text-neutral-400">{visibleWordCount} words captured</p>
              </div>
            </div>
            <p className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
              00:38 voice note
            </p>
          </div>

          <div className="min-h-[23rem] rounded-[1.25rem] border border-white/8 bg-[#0f0a0e] p-4 md:min-h-[18rem] md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">Live transcript</p>
            <p className="mt-4 text-[1rem] leading-8 text-neutral-500 md:text-[1.2rem] md:leading-9">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  className={`rounded-md px-[1px] transition-colors ${
                    isTranscriptHighlighted && noteRegions.some((region) => index >= region.startWord && index <= region.endWord)
                      ? 'bg-[#bae6fd]/16 text-[#f0f9ff] ring-1 ring-[#bae6fd]/28'
                      : index < visibleWordCount
                        ? 'text-neutral-100'
                        : 'text-neutral-700'
                  }`}
                  initial={false}
                  animate={{
                    opacity: index < visibleWordCount ? 1 : 0.32,
                    y: isTranscriptHighlighted && noteRegions.some((region) => index >= region.startWord && index <= region.endWord) ? [0, -1, 0] : 0,
                  }}
                  transition={{ duration: 0.24, delay: isTranscriptHighlighted ? index * 0.006 : 0 }}
                >
                  {word}{index === words.length - 1 ? '' : ' '}
                </motion.span>
              ))}
            </p>
          </div>

          <button
            type="button"
            onClick={organizeScope}
            disabled={!canOrganizeScope}
            className={`mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#e8cbd9]/60 ${
              canOrganizeScope
                ? 'clara-cta bg-[#f5dce8] text-[#2b1724] shadow-[0_12px_34px_rgba(184,137,161,0.2)] hover:opacity-95'
                : 'cursor-not-allowed border border-white/10 bg-white/[0.04] text-neutral-500'
            }`}
            data-clara-cta={canOrganizeScope ? 'page' : undefined}
          >
            <FileText className="h-4 w-4" />
            Organize scope
          </button>
        </div>
      </div>
    </section>
  );
}

function OrganizedLineItemsSection() {
  return (
    <section
      id="organized-line-items"
      className="relative z-10 border-t border-[#bae6fd]/10 bg-[#0f0a0e] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#bae6fd]/70">Organized scope</p>
          <h2 className="mt-4 max-w-lg text-[2.5rem] font-medium leading-[1.02] text-white md:text-[4rem]">Scope from the note.</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-neutral-400">
            Clara turns the highlighted phrases into a clean scope structure.
          </p>
        </motion.div>

        <div className="space-y-4">
          {noteRegions.map((region, index) => (
            <motion.div
              key={region.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.38, delay: index * 0.08 }}
              className="rounded-2xl border border-white/8 bg-[#171017] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#bae6fd]">{region.label}</p>
              <p className="mt-3 text-lg font-semibold text-white">{region.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SolutionsLandingPage() {
  const [shouldStartRecording, setShouldStartRecording] = useState(false);
  const [showOrganizedScope, setShowOrganizedScope] = useState(false);

  const scrollToRecording = () => {
    setShouldStartRecording(true);
    document.getElementById('see-how')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Seo
        title="Clara Project Estimates"
        description="Clara turns voice notes into organized project scopes and line-item estimates with contingency, live web pricing signals, and company material library context."
        canonicalPath="/clara"
      />

      <div className="solutions-page min-h-screen text-white">
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'linear-gradient(to bottom, black, transparent 84%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 42% at 50% 28%, rgba(216,169,194,0.16), transparent 66%), radial-gradient(ellipse 45% 35% at 82% 72%, rgba(45,212,191,0.06), transparent 66%)',
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mx-auto mb-9 max-w-4xl text-center md:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="clara-page-dim-on-cta inline-flex items-center gap-2 rounded-full border border-[#d9a9c2]/20 bg-[#d9a9c2]/[0.07] px-4 py-1.5"
              >
                <Mic className="h-3.5 w-3.5 text-[#e8cbd9]" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#f5dce8]/84">Voice to estimate</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="clara-page-dim-on-cta mt-6 text-[3rem] font-medium leading-[1.02] md:text-[5.5rem] md:leading-[0.94]"
              >
                Estimate your project in seconds.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="clara-page-dim-on-cta mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-400 md:text-xl"
              >
                Record a field note. Clara turns it into an organized scope, then generates a line-item estimate with contingency.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="mt-7 flex flex-wrap justify-center gap-3"
              >
                <button
                  type="button"
                  onClick={scrollToRecording}
                  data-clara-cta="page"
                  className="clara-cta relative z-[110] inline-flex min-h-12 overflow-hidden rounded-full bg-[#f5dce8] px-6 py-3 text-sm font-semibold text-[#2b1724] shadow-[0_0_0_1px_rgba(245,220,232,0.24)] transition-[box-shadow,opacity] duration-200 hover:opacity-95 hover:shadow-[0_14px_38px_rgba(184,137,161,0.24)] focus:outline-none focus:ring-2 focus:ring-[#e8cbd9]/60"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <MiniRecordGlyph />
                    See How
                  </span>
                </button>
                <a
                  href="https://chat.b2w-ai.com"
                  target="_blank"
                  rel="noreferrer"
                  data-clara-cta="page"
                  className="relative z-[110] inline-flex min-h-12 items-center gap-2 rounded-full border border-[#e8cbd9]/16 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#e8cbd9]/32 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-[#e8cbd9]/60"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Test Demo
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>
        <VoiceCaptureSection shouldStart={shouldStartRecording} onOrganize={() => setShowOrganizedScope(true)} />
        {showOrganizedScope ? <OrganizedLineItemsSection /> : null}
      </div>
    </>
  );
}
