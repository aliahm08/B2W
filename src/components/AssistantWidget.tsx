import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PenSquare, ReceiptText, Send, X, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { fetchProjectAccessStatus, getProtectedProject } from '../content/projectAccess';

type ProposalOption = 'option-one' | 'option-two' | 'option-three';

type FloatingPageCta =
  | { type: 'proposal'; label: string }
  | { type: 'event'; label: string; eventName: string };

const floatingPageCtas: Record<string, FloatingPageCta> = {
  '/borek-g': { type: 'proposal', label: 'Respond to Proposal' },
  '/uyghur-eats': { type: 'event', label: 'Make an Offer', eventName: 'b2w-uyghur-offer:open' },
};

const proposalOptions: Array<{
  id: ProposalOption;
  title: string;
  pricing: string;
  bullets: string[];
}> = [
  {
    id: 'option-one',
    title: 'Option One: Basic Marketing Strategy Consultation',
    pricing: '$1,200 One-Time',
    bullets: [
      'Detailed analysis of existing marketing strategy across Instagram, TikTok, Google Business, Yelp, Facebook, and email',
      '3-5 specific strategies to implement in the next 3-6 months to drive sales growth',
      '6 hours of dedicated consultation over the next 3 months',
    ],
  },
  {
    id: 'option-two',
    title: 'Option Two: Comprehensive Marketing Strategy & Implementation',
    pricing: '$1,750 onboarding fee + $2,000 ongoing management',
    bullets: [
      'Includes everything in Option One',
      'Social media marketing across TikTok, Instagram, Facebook, Yelp, Google Business, and email',
      '2 onsite sessions per month',
      '3-4 short-form videos per week and 3-4 curated stories per week',
      'Monthly performance summary including reach, engagement, and content insights',
    ],
  },
  {
    id: 'option-three',
    title: 'Option Three: End-to-End Marketing and Digital Presence',
    pricing: 'Proposal provided after discovery',
    bullets: [
      'Includes everything in Option One and Option Two',
      'Website revamp and online ordering system',
      'SEO optimization',
    ],
  },
];

const keyTerms = [
  'Services will be limited to the offerings outlined in the selected option.',
  'Content will be created using a mix of onsite filming and existing in-store footage. Creative direction and execution are determined by B2W based on performance, best practices, and brand alignment.',
  'Posting frequency is based on the selected package and may vary depending on content performance, holidays, and promotions.',
  'Services are delivered according to a predefined content schedule or recurring cadence. Unplanned or last-minute promotional requests fall outside guaranteed scope and may be declined or deferred.',
  'Unless otherwise agreed in writing, content does not require pre-approval prior to posting except for limited factual or brand corrections.',
  'Advertising spend is separate from service fees and is paid directly by the client to the ad platforms. Advertising results are not guaranteed.',
  'We do not guarantee specific sales, foot traffic, or revenue results.',
  'Client retains ownership of all social media accounts and grants appropriate access for content and advertising management during the engagement.',
  'All content created during the engagement may be used by the client for marketing purposes. B2W reserves the right to use content for portfolio, case studies, and promotional materials.',
  'Option Two and Option Three require an initial minimum term of 3 months, then continue month to month unless terminated by either party with 14 days written notice.',
  'Payment is due at the beginning of each service period. Late payment may result in paused services.',
  'Both parties agree to keep non-public business information confidential.',
];

function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    context.scale(ratio, ratio);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2;
    context.strokeStyle = '#111111';
    context.clearRect(0, 0, rect.width, rect.height);
  }, []);

  function getPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function startDrawing(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const point = getPoint(event);
    if (!canvas || !context || !point) return;
    isDrawingRef.current = true;
    context.beginPath();
    context.moveTo(point.x, point.y);
    setHasSignature(true);
  }

  function draw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const point = getPoint(event);
    if (!canvas || !context || !point) return;
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function stopDrawing() {
    isDrawingRef.current = false;
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  }

  return { canvasRef, hasSignature, startDrawing, draw, stopDrawing, clearSignature };
}

export default function AssistantWidget() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBottomPrompted, setIsBottomPrompted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedOption, setSelectedOption] = useState<ProposalOption>('option-two');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isProjectUnlocked, setIsProjectUnlocked] = useState(true);
  const signature = useSignaturePad();
  const protectedProject = useMemo(() => getProtectedProject(pathname), [pathname]);

  const activeFloatingCta = useMemo(() => floatingPageCtas[pathname], [pathname]);
  const isProposalPage = activeFloatingCta?.type === 'proposal';

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      if (!protectedProject) {
        if (isActive) {
          setIsProjectUnlocked(true);
        }
        return;
      }

      const unlocked = await fetchProjectAccessStatus(pathname);
      if (isActive) {
        setIsProjectUnlocked(unlocked);
      }
    };

    void checkAccess();

    function handleAccessChange(event: Event) {
      const detail = (event as CustomEvent<{ path?: string; unlocked?: boolean }>).detail;

      if (detail?.path === pathname) {
        setIsProjectUnlocked(Boolean(detail.unlocked));
        return;
      }

      void checkAccess();
    }

    window.addEventListener('b2w-project-access-change', handleAccessChange as EventListener);
    window.addEventListener('storage', handleAccessChange);

    return () => {
      isActive = false;
      window.removeEventListener('b2w-project-access-change', handleAccessChange as EventListener);
      window.removeEventListener('storage', handleAccessChange);
    };
  }, [pathname, protectedProject]);

  useEffect(() => {
    if (!activeFloatingCta || !isProjectUnlocked) {
      setIsOpen(false);
      setSubmitted(false);
      setIsBottomPrompted(false);
      setHasAutoOpened(false);
    }
  }, [activeFloatingCta, isProjectUnlocked]);

  useEffect(() => {
    if (!activeFloatingCta || !isProjectUnlocked || hasAutoOpened) {
      return;
    }

    let openTimer: number | null = null;

    function handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomThreshold = document.documentElement.scrollHeight - 120;

      if (scrollPosition < bottomThreshold) {
        return;
      }

      setHasAutoOpened(true);
      setIsBottomPrompted(true);

      openTimer = window.setTimeout(() => {
        if (activeFloatingCta.type === 'proposal') {
          setSubmitted(false);
          setIsOpen(true);
          return;
        }

        window.dispatchEvent(new CustomEvent(activeFloatingCta.eventName));
      }, 260);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (openTimer) {
        window.clearTimeout(openTimer);
      }
    };
  }, [activeFloatingCta, hasAutoOpened, isProjectUnlocked]);

  useEffect(() => {
    function handleOpen() {
      if (!isProjectUnlocked) {
        return;
      }
      if (activeFloatingCta?.type !== 'proposal') {
        return;
      }
      setSubmitted(false);
      setIsOpen(true);
    }
    window.addEventListener('b2w-assistant:open', handleOpen as EventListener);
    return () => window.removeEventListener('b2w-assistant:open', handleOpen as EventListener);
  }, [activeFloatingCta, isProjectUnlocked, pathname]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!acceptedTerms || !signature.hasSignature) return;
    window.dispatchEvent(new CustomEvent('b2w-proposal:submitted'));
    setSubmitted(true);
  }

  if (!activeFloatingCta || !isProjectUnlocked) return null;

  return (
    <>
      <AnimatePresence>
        {isProposalPage && isOpen ? (
          <motion.div
            key="proposal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {isProposalPage && isOpen ? (
          <motion.div
            key="proposal-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="pointer-events-auto w-[min(96vw,70rem)] overflow-hidden rounded-[2rem] border border-white/30 bg-white/65 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-6">
              <div>
                <p className="text-sm font-semibold text-black">Proposal Response</p>
                <p className="text-xs text-neutral-600">Select a package, review terms, share information, and sign</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-neutral-600 transition-colors hover:bg-white hover:text-black"
                aria-label="Close proposal response panel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto p-5 md:p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-[1.5rem] border border-black/10 bg-white/70 p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                        <PenSquare size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black">Proposal for Marketing Systems and Growth</h3>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          Bring more people into BorekG consistently by showcasing your food, story, and authenticity
                          through short videos, photos, and proven engagement strategies.
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="rounded-[1.5rem] border border-black/10 bg-white/70 p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h4 className="text-lg font-medium text-black">Select Proposal Option</h4>
                      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Packages</p>
                    </div>
                    <div className="grid gap-3">
                      {proposalOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`block rounded-[1.5rem] border p-4 transition-colors ${
                            selectedOption === option.id ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-neutral-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="proposalOption"
                              value={option.id}
                              checked={selectedOption === option.id}
                              onChange={() => setSelectedOption(option.id)}
                              className="mt-1 h-4 w-4"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{option.title}</p>
                              <p className={`mt-1 text-sm ${selectedOption === option.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {option.pricing}
                              </p>
                              <ul className={`mt-3 list-disc space-y-1 pl-5 text-sm leading-6 ${selectedOption === option.id ? 'text-neutral-200' : 'text-neutral-600'}`}>
                                {option.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                              </ul>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[1.5rem] border border-black/10 bg-white/70 p-4 md:p-5">
                    <h4 className="text-lg font-medium text-black">Key Terms and Assumptions</h4>
                    <ol className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                      {keyTerms.map((term, index) => (
                        <li key={term} className="flex gap-3">
                          <span className="font-medium text-black">{index + 1}.</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="rounded-[1.5rem] border border-black/10 bg-white/70 p-4 md:p-5">
                    <h4 className="text-lg font-medium text-black">Proposal Acceptance</h4>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Share signer details, any final information or requested edits, and complete the digital signature to respond to this proposal.
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">Full name</span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          required
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                          placeholder="Your name"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">Email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                          placeholder="name@example.com"
                        />
                      </label>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Company</span>
                      <input
                        type="text"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                        placeholder="Company or entity"
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Information to share or requested changes</span>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        rows={6}
                        className="w-full rounded-[1.5rem] border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                        placeholder="Share onboarding details, preferred timing, internal notes, or any requested edits to the proposal."
                      />
                    </label>

                    <label className="mt-4 flex items-start gap-3 rounded-[1.5rem] border border-black/10 bg-white/70 p-4">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) => setAcceptedTerms(event.target.checked)}
                        required
                        className="mt-1 h-4 w-4 border-neutral-300"
                      />
                      <span className="text-sm leading-6 text-neutral-700">
                        I confirm I am authorized to approve this proposal, accept the key terms above, and want B2W to prepare the next step for execution.
                      </span>
                    </label>

                    <div className="mt-4 rounded-[1.5rem] border border-black/10 bg-white/70 p-4 md:p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h5 className="text-lg font-medium text-black">Digital Signature</h5>
                          <p className="text-sm leading-6 text-neutral-600">Sign below using your finger, mouse, or stylus.</p>
                        </div>
                        <button
                          type="button"
                          onClick={signature.clearSignature}
                          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="rounded-[1.5rem] border border-dashed border-black/20 bg-white/80 p-3">
                        <canvas
                          ref={signature.canvasRef}
                          onPointerDown={signature.startDrawing}
                          onPointerMove={signature.draw}
                          onPointerUp={signature.stopDrawing}
                          onPointerLeave={signature.stopDrawing}
                          className="h-44 w-full touch-none rounded-[1rem] bg-white"
                        />
                      </div>
                      {!signature.hasSignature ? (
                        <p className="mt-3 text-xs text-neutral-500">Signature required before submitting.</p>
                      ) : null}
                    </div>
                  </section>

                  <div className="flex flex-col gap-3 border-t border-black/10 pt-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs leading-5 text-neutral-500">
                      This response flow is ready to be wired into email, CRM, proposal storage, or a formal e-sign workflow.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                      Submit proposal response
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-[1.5rem] border border-black/10 bg-white/70 p-6">
                  <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Response Ready</p>
                  <h3 className="text-2xl font-medium tracking-tight text-black">Your proposal response has been captured.</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                    The package selection, notes, contact details, and digital signature are ready to route into your preferred approval workflow.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
                    >
                      Edit response
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key={`${pathname}-floating-cta`}
            type="button"
            onClick={() => {
              if (!isProjectUnlocked) {
                return;
              }

              if (activeFloatingCta.type === 'proposal') {
                setSubmitted(false);
                setIsOpen(true);
                return;
              }

              window.dispatchEvent(new CustomEvent(activeFloatingCta.eventName));
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black bg-black text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 ${
              isBottomPrompted ? 'scale-105 px-8 py-5' : 'px-6 py-4'
            }`}
          >
            {activeFloatingCta.type === 'proposal' ? <ReceiptText size={16} /> : <ArrowRight size={16} />}
            {activeFloatingCta.label}
          </motion.button>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
