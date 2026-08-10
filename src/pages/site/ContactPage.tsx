import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, Mail, MessageSquareText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { PageIntro, pageWidth } from '../../components/site/PublicUI';
import { getSourceMetadata, submitInternalForm } from '../../lib/engagement';
import { trackSiteEvent } from '../../lib/siteAnalytics';

const inquiryOptions = [
  ['Service inquiry', 'service'],
  ['JasonAI interest', 'jasonai'],
  ['WhatsApp setup', 'setup'],
  ['Partnership inquiry', 'partnership'],
  ['General question', 'general'],
] as const;

function getInquiryType(value: string | null) {
  return inquiryOptions.find(([, id]) => id === value)?.[0] ?? 'Service inquiry';
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const [inquiryType, setInquiryType] = useState(() => getInquiryType(searchParams.get('type')));
  const focus = searchParams.get('focus') ?? '';

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackSiteEvent('contact_form_started', { inquiryType });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    const form = new FormData(event.currentTarget);
    const message = String(form.get('message') ?? '').trim();
    const result = await submitInternalForm('/api/contact-lead', {
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      company: String(form.get('company') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      website: '',
      inquiryType,
      normalizedProjectArea: inquiryType,
      projectAreas: [inquiryType],
      message: focus ? `Focus: ${focus}\n\n${message}` : message,
      websiteUrl: String(form.get('websiteUrl') ?? ''),
      ...getSourceMetadata({ formType: 'unified_contact', actionType: 'contact_form_completed' }),
    });

    if (!result.ok) {
      setStatus('error');
      setError(result.error ?? 'Unable to send your inquiry right now.');
      return;
    }

    setStatus('success');
    trackSiteEvent('contact_form_completed', { inquiryType });
  };

  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="Contact B2W" description="Contact B2W about services, JasonAI, WhatsApp setup, partnerships, or a general business question." canonicalPath="/contact" />
      <PageIntro eyebrow="Contact" title="Start with the reason for the conversation." description="Choose the inquiry path, share the business condition in plain language, and explain what a useful next outcome would look like. B2W will review the request and respond with the right next step." />

      <section className="border-y border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_360px]`}>
          {status === 'success' ? (
            <section aria-live="polite" className="rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-green-soft)] p-8 sm:p-10">
              <CheckCircle2 className="h-8 w-8 text-[var(--b2w-green-dark)]" />
              <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-green-dark)]">Complete</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em]">Your inquiry has been sent.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--b2w-ink-muted)]">B2W will review the condition, confirm the right conversation, and follow up using the contact information you provided.</p>
            </section>
          ) : (
            <form onSubmit={submit} onFocus={markStarted} className="rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-6 sm:p-9">
              <fieldset>
                <legend className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold-dark)]">Why are you contacting B2W?</legend>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {inquiryOptions.map(([label]) => <button key={label} type="button" onClick={() => { setInquiryType(label); markStarted(); }} aria-pressed={inquiryType === label} className={`min-h-12 rounded-xl border px-4 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] ${inquiryType === label ? 'border-[var(--b2w-forest)] bg-[var(--b2w-forest)] text-white' : 'border-[var(--b2w-line)] bg-white hover:border-[var(--b2w-forest)]/40'}`}>{label}</button>)}
                </div>
              </fieldset>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  ['name', 'Name', 'text', 'Your name', 'name'],
                  ['email', 'Work email', 'email', 'name@business.com', 'email'],
                  ['company', 'Business', 'text', 'Business name', 'organization'],
                  ['phone', 'Phone', 'tel', 'Best number', 'tel'],
                ].map(([name, label, type, placeholder, autoComplete]) => <label key={name} className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input required name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} className="min-h-12 w-full rounded-xl border border-[var(--b2w-line)] bg-white px-4 text-sm outline-none transition focus:border-[var(--b2w-forest)] focus:ring-2 focus:ring-[var(--b2w-gold)]/35" /></label>)}
              </div>
              <label className="mt-5 block"><span className="mb-2 block text-sm font-semibold">What is happening, and what should happen next?</span><textarea required name="message" rows={6} defaultValue={focus ? `I want to discuss ${focus}. ` : ''} placeholder="Describe the condition, the friction, the evidence you have, and the outcome that matters." className="w-full rounded-xl border border-[var(--b2w-line)] bg-white p-4 text-sm leading-6 outline-none transition focus:border-[var(--b2w-forest)] focus:ring-2 focus:ring-[var(--b2w-gold)]/35" /></label>
              <label className="sr-only">Website<input name="websiteUrl" tabIndex={-1} autoComplete="off" /></label>
              {status === 'error' ? <p role="alert" className="mt-4 rounded-xl border border-[var(--b2w-risk)]/30 bg-red-50 p-4 text-sm text-[var(--b2w-risk)]">{error}</p> : null}
              <button disabled={status === 'submitting'} type="submit" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--b2w-forest)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--b2w-forest-deep)] disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}{status === 'submitting' ? 'Sending inquiry' : 'Send inquiry'}</button>
            </form>
          )}

          <aside className="space-y-5">
            <div className="rounded-[1.5rem] bg-[var(--b2w-forest)] p-6 text-white"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold)]">What happens next</p><ol className="mt-6 space-y-5">{['B2W reviews the request and routes it to the right conversation.', 'We follow up to clarify fit, evidence, timing, or the current product boundary.', 'The next step is a call, a resource, or a scoped proposal—not an automatic commitment.'].map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-white/70"><span className="font-mono text-[10px] text-[var(--b2w-gold)]">0{index + 1}</span>{item}</li>)}</ol></div>
            <div className="rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-6"><Mail className="h-5 w-5 text-[var(--b2w-gold-dark)]" /><p className="mt-5 text-sm leading-7 text-[var(--b2w-ink-muted)]">Prefer email? Write directly to <a className="font-semibold text-[var(--b2w-ink)] underline underline-offset-4" href="mailto:info@b2w-ai.com">info@b2w-ai.com</a>.</p></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
