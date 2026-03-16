import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, PenSquare, Send } from 'lucide-react';
import type { ProposalContent } from '../content/proposals';

type ProposalAcceptanceSectionProps = {
  pathname: string;
  proposal: ProposalContent;
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
  createdAt: string;
};

const sectionId = 'proposal-signature';

function getProposalCacheKey(pathname: string): string {
  return `b2w-proposal-response:${pathname}`;
}

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

  function toDataUrl() {
    return canvasRef.current?.toDataURL('image/png') ?? '';
  }

  return { canvasRef, hasSignature, startDrawing, draw, stopDrawing, clearSignature, toDataUrl };
}

function defaultOptionId(proposal: ProposalContent): string {
  return proposal.options[0]?.id ?? '';
}

export function scrollToProposalSignatureSection() {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ProposalAcceptanceSection({ pathname, proposal }: ProposalAcceptanceSectionProps) {
  const signature = useSignaturePad();
  const [state, setState] = useState<ProposalSubmissionState>({
    fullName: '',
    email: '',
    company: '',
    selectedOptionId: defaultOptionId(proposal),
    notes: '',
    acceptedTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<ProposalSubmitResponse | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(getProposalCacheKey(pathname));
      if (!raw) {
        return;
      }

      const cached = JSON.parse(raw) as Partial<ProposalSubmissionState>;
      setState({
        fullName: String(cached.fullName ?? ''),
        email: String(cached.email ?? ''),
        company: String(cached.company ?? ''),
        selectedOptionId: proposal.options.some((option) => option.id === cached.selectedOptionId)
          ? String(cached.selectedOptionId)
          : defaultOptionId(proposal),
        notes: String(cached.notes ?? ''),
        acceptedTerms: Boolean(cached.acceptedTerms),
      });
    } catch {
      window.localStorage.removeItem(getProposalCacheKey(pathname));
    }
  }, [pathname, proposal]);

  useEffect(() => {
    window.localStorage.setItem(getProposalCacheKey(pathname), JSON.stringify(state));
  }, [pathname, state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.acceptedTerms || !signature.hasSignature) {
      return;
    }

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

      if (!response.ok || !payload.documentId || !payload.documentUrl || !payload.createdAt) {
        throw new Error(payload.error || 'Unable to submit the signed proposal.');
      }

      setSubmitSuccess({
        documentId: payload.documentId,
        documentUrl: payload.documentUrl,
        createdAt: payload.createdAt,
      });
      window.dispatchEvent(new CustomEvent('b2w-proposal:submitted'));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the signed proposal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasMultipleOptions = proposal.options.length > 1;

  return (
    <section id={sectionId} className="rounded-[2rem] border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
      <div className="max-w-3xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Proposal Acceptance</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">{proposal.acceptanceHeading}</h2>
        <p className="mt-4 text-sm leading-6 text-neutral-300 md:text-base">{proposal.acceptanceIntro}</p>
      </div>

      {!submitSuccess ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {hasMultipleOptions ? (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Selected Scope</h3>
                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Packages</p>
              </div>
              <div className="mt-4 grid gap-3">
                {proposal.options.map((option) => {
                  const isSelected = state.selectedOptionId === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`rounded-[1.5rem] border p-4 transition-colors ${
                        isSelected ? 'border-white bg-white text-black' : 'border-white/10 bg-transparent text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="proposalOption"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setState((current) => ({ ...current, selectedOptionId: option.id }))}
                          className="mt-1 h-4 w-4"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{option.title}</p>
                          <div className={`mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] ${isSelected ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            <span>{option.price}</span>
                            <span>•</span>
                            <span>{option.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Scope</p>
              <h3 className="mt-2 text-lg font-medium">{proposal.options[0]?.title}</h3>
              <p className="mt-2 text-sm text-neutral-300">{proposal.options[0]?.price} · {proposal.options[0]?.timeline}</p>
            </section>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-100">Full name</span>
              <input
                type="text"
                value={state.fullName}
                onChange={(event) => setState((current) => ({ ...current, fullName: event.target.value }))}
                required
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-white"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-100">Email</span>
              <input
                type="email"
                value={state.email}
                onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                required
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-white"
                placeholder="name@example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-100">Company</span>
            <input
              type="text"
              value={state.company}
              onChange={(event) => setState((current) => ({ ...current, company: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-white"
              placeholder="Company or entity"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-100">Final notes or requested changes</span>
            <textarea
              value={state.notes}
              onChange={(event) => setState((current) => ({ ...current, notes: event.target.value }))}
              rows={6}
              className="w-full rounded-[1.5rem] border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-white"
              placeholder="Share onboarding details, preferred timing, internal notes, or requested edits."
            />
          </label>

          <label className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <input
              type="checkbox"
              checked={state.acceptedTerms}
              onChange={(event) => setState((current) => ({ ...current, acceptedTerms: event.target.checked }))}
              required
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm leading-6 text-neutral-200">
              I confirm I am authorized to approve this proposal, accept the terms and assumptions shown on this page, and want B2W to prepare the next execution step.
            </span>
          </label>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <PenSquare size={18} />
                  <h3 className="text-lg font-medium">Digital Signature</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-300">Sign below using your finger, mouse, or stylus.</p>
              </div>
              <button
                type="button"
                onClick={signature.clearSignature}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white"
              >
                Clear
              </button>
            </div>
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/20 bg-white p-3">
              <canvas
                ref={signature.canvasRef}
                onPointerDown={signature.startDrawing}
                onPointerMove={signature.draw}
                onPointerUp={signature.stopDrawing}
                onPointerLeave={signature.stopDrawing}
                className="h-44 w-full touch-none rounded-[1rem] bg-white"
              />
            </div>
            {!signature.hasSignature ? <p className="mt-3 text-xs text-neutral-400">Signature required before submitting.</p> : null}
          </section>

          {submitError ? (
            <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{submitError}</p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-5 text-neutral-400">
              Signed transcript delivery is sent to the signer email and to info@b2w-ai.com.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit signed proposal'}
              <Send size={14} />
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 text-emerald-300">
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium uppercase tracking-[0.22em]">Signed</p>
          </div>
          <h3 className="mt-4 text-2xl font-medium tracking-tight">{proposal.successHeading}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">{proposal.successBody}</p>
          <a
            href={submitSuccess.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white"
          >
            Open signed transcript
          </a>
        </div>
      )}
    </section>
  );
}
