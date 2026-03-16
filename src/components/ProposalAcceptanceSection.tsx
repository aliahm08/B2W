import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, PenSquare, Send, X } from 'lucide-react';
import type { ProposalContent } from '../content/proposals';

type ProposalAcceptanceSectionProps = {
  pathname: string;
  proposal: ProposalContent;
  isOpen: boolean;
  onClose: () => void;
  selectedOptionId: string;
  onSelectedOptionChange: (optionId: string) => void;
};

type ProposalSubmissionState = {
  fullName: string;
  email: string;
  company: string;
  selectedOptionId: string;
  notes: string;
  acceptedTerms: boolean;
};

type ProposalSubmitResponse = {
  documentId: string;
  documentUrl: string;
  pdfUrl: string;
  createdAt: string;
};

export function getProposalCacheKey(pathname: string): string {
  return `b2w-proposal-response:${pathname}`;
}

function useSignaturePad(isOpen: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

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

  function toDataUrl() {
    return canvasRef.current?.toDataURL('image/png') ?? '';
  }

  return { canvasRef, hasSignature, startDrawing, draw, stopDrawing, clearSignature, toDataUrl };
}

export default function ProposalAcceptanceSection({
  pathname,
  proposal,
  isOpen,
  onClose,
  selectedOptionId,
  onSelectedOptionChange,
}: ProposalAcceptanceSectionProps) {
  const signature = useSignaturePad(isOpen);
  const [state, setState] = useState<ProposalSubmissionState>({
    fullName: '',
    email: '',
    company: '',
    selectedOptionId,
    notes: '',
    acceptedTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<ProposalSubmitResponse | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(getProposalCacheKey(pathname));
      if (!raw) return;

      const cached = JSON.parse(raw) as Partial<ProposalSubmissionState>;
      setState({
        fullName: String(cached.fullName ?? ''),
        email: String(cached.email ?? ''),
        company: String(cached.company ?? ''),
        selectedOptionId: proposal.options.some((option) => option.id === cached.selectedOptionId)
          ? String(cached.selectedOptionId)
          : selectedOptionId,
        notes: String(cached.notes ?? ''),
        acceptedTerms: Boolean(cached.acceptedTerms),
      });
    } catch {
      window.localStorage.removeItem(getProposalCacheKey(pathname));
    }
  }, [pathname, proposal, selectedOptionId]);

  useEffect(() => {
    setState((current) => (current.selectedOptionId === selectedOptionId ? current : { ...current, selectedOptionId }));
  }, [selectedOptionId]);

  useEffect(() => {
    window.localStorage.setItem(getProposalCacheKey(pathname), JSON.stringify(state));
  }, [pathname, state]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.acceptedTerms || !signature.hasSignature) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/proposals/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: pathname,
          fullName: state.fullName,
          email: state.email,
          company: state.company,
          notes: state.notes,
          selectedOptionId: state.selectedOptionId,
          acceptedTerms: state.acceptedTerms,
          signatureDataUrl: signature.toDataUrl(),
        }),
      });

      const payload = await response.json() as Partial<ProposalSubmitResponse> & { error?: string };

      if (!response.ok || !payload.documentId || !payload.documentUrl || !payload.pdfUrl || !payload.createdAt) {
        throw new Error(payload.error || 'Unable to submit the signed proposal.');
      }

      setSubmitSuccess({
        documentId: payload.documentId,
        documentUrl: payload.documentUrl,
        pdfUrl: payload.pdfUrl,
        createdAt: payload.createdAt,
      });
      window.dispatchEvent(new CustomEvent('b2w-proposal:submitted'));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the signed proposal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedOption = proposal.options.find((option) => option.id === state.selectedOptionId) ?? proposal.options[0];

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Proposal Finalization</p>
                <h2 className="mt-1 text-xl font-medium text-black">{proposal.acceptanceHeading}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 transition-colors hover:border-black"
                aria-label="Close proposal finalization"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-6 md:px-8 md:py-8">
              {!submitSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <section className="border border-black/10 bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Selected Scope</p>
                    <div className="mt-3 border border-black bg-black p-4 text-white">
                      <p className="text-lg font-medium">{selectedOption?.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-neutral-300">
                        <span>{selectedOption?.price}</span>
                        <span>•</span>
                        <span>{selectedOption?.timeline}</span>
                      </div>
                    </div>
                    {proposal.options.length > 1 ? (
                      <div className="mt-4 grid gap-3">
                        {proposal.options.map((option) => (
                          <label key={option.id} className="flex items-start gap-3 border border-black/10 px-4 py-3">
                            <input
                              type="radio"
                              name="proposalOption"
                              value={option.id}
                              checked={state.selectedOptionId === option.id}
                              onChange={() => {
                                setState((current) => ({ ...current, selectedOptionId: option.id }));
                                onSelectedOptionChange(option.id);
                              }}
                              className="mt-1 h-4 w-4"
                            />
                            <div>
                              <p className="text-sm font-medium text-black">{option.title}</p>
                              <p className="mt-1 text-sm text-neutral-600">{option.price} · {option.timeline}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </section>

                  <section className="border border-black/10 bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Section 4</p>
                    <h3 className="mt-2 text-2xl font-medium text-black">Key Terms and Assumptions</h3>
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-black">Key Terms</p>
                        <ol className="mt-3 space-y-3 text-sm leading-6 text-neutral-700">
                          {proposal.terms.map((term, index) => (
                            <li key={term} className="flex gap-3">
                              <span className="font-medium text-black">{index + 1}.</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Assumptions</p>
                        <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-700">
                          {proposal.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="border border-black/10 bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Section 5</p>
                    <h3 className="mt-2 text-2xl font-medium text-black">Signature</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{proposal.acceptanceIntro}</p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">Full name</span>
                        <input
                          type="text"
                          value={state.fullName}
                          onChange={(event) => setState((current) => ({ ...current, fullName: event.target.value }))}
                          required
                          className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                          placeholder="Your name"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">Email</span>
                        <input
                          type="email"
                          value={state.email}
                          onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                          required
                          className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                          placeholder="name@example.com"
                        />
                      </label>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Company</span>
                      <input
                        type="text"
                        value={state.company}
                        onChange={(event) => setState((current) => ({ ...current, company: event.target.value }))}
                        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="Company or entity"
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Final notes or requested changes</span>
                      <textarea
                        value={state.notes}
                        onChange={(event) => setState((current) => ({ ...current, notes: event.target.value }))}
                        rows={5}
                        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="Share onboarding details, preferred timing, internal notes, or requested edits."
                      />
                    </label>

                    <label className="mt-4 flex items-start gap-3 border border-black/10 p-4">
                      <input
                        type="checkbox"
                        checked={state.acceptedTerms}
                        onChange={(event) => setState((current) => ({ ...current, acceptedTerms: event.target.checked }))}
                        required
                        className="mt-1 h-4 w-4"
                      />
                      <span className="text-sm leading-6 text-neutral-700">
                        I confirm I am authorized to approve this proposal, accept the selected scope plus the key terms and assumptions, and want B2W to prepare the next step.
                      </span>
                    </label>

                    <div className="mt-4 border border-black/10 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <PenSquare size={18} className="text-black" />
                            <p className="text-lg font-medium text-black">Digital Signature</p>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-neutral-600">Sign below using your finger, mouse, or stylus.</p>
                        </div>
                        <button
                          type="button"
                          onClick={signature.clearSignature}
                          className="border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="border border-dashed border-black/20 bg-white p-3">
                        <canvas
                          ref={signature.canvasRef}
                          onPointerDown={signature.startDrawing}
                          onPointerMove={signature.draw}
                          onPointerUp={signature.stopDrawing}
                          onPointerLeave={signature.stopDrawing}
                          className="h-44 w-full touch-none bg-white"
                        />
                      </div>
                      {!signature.hasSignature ? <p className="mt-3 text-xs text-neutral-500">Signature required before submitting.</p> : null}
                    </div>
                  </section>

                  {submitError ? (
                    <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{submitError}</p>
                  ) : null}

                  <div className="flex flex-col gap-3 border-t border-black/10 pt-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs leading-5 text-neutral-500">
                      Signed transcript delivery is sent to the signer email and to info@b2w-ai.com.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit signed proposal'}
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-medium uppercase tracking-[0.22em]">Signed</p>
                  </div>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-black">{proposal.successHeading}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">{proposal.successBody}</p>
                  <a
                    href={submitSuccess.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex border border-black/10 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
                  >
                    Open signed transcript
                  </a>
                  <a
                    href={submitSuccess.pdfUrl}
                    className="mt-3 inline-flex border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
