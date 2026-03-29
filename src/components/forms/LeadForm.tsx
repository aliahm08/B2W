import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getSourceMetadata, openCalendly, submitInternalForm } from '../../lib/engagement';
import { FormTemplate } from './FormTemplate';

export const publicProjectAreas = ['Growth', 'Optimization', 'Due Diligence'] as const;
export type PublicProjectArea = (typeof publicProjectAreas)[number];
export type NormalizedProjectArea = PublicProjectArea;

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  selectedProjectAreas: PublicProjectArea[];
  message: string;
  websiteUrl: string;
};

type LeadFormProps = {
  heading?: string;
  intro?: string;
  submitLabel?: string;
  preselectedProjectAreas?: PublicProjectArea[];
};

const defaultState: LeadFormState = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  selectedProjectAreas: [],
  message: '',
  websiteUrl: '',
};

function normalizeProjectArea(selectedProjectAreas: PublicProjectArea[]): NormalizedProjectArea | '' {
  return selectedProjectAreas[0] ?? '';
}

const EMPTY_ARRAY: PublicProjectArea[] = [];
const publicProjectAreaOptions: PublicProjectArea[] = ['Growth', 'Optimization', 'Due Diligence'];
const FULL_SERVICE_PACKAGE = 'Full Service Package';
const budgetOptions = [
  'Under $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
] as const;
const submissionTimeline = [
  'Request received and logged.',
  'Budget and service fit reviewed by B2W.',
  'Follow-up email or call scheduled with next steps.',
] as const;
const serviceCardStyles: Record<
  PublicProjectArea,
  {
    selected: string;
    unselected: string;
    checkSelected: string;
    checkUnselected: string;
  }
> = {
  Growth: {
    selected: 'border-emerald-300 bg-emerald-50 text-emerald-950',
    unselected: 'border-black/10 bg-white text-neutral-800 hover:border-black/25 hover:bg-neutral-50',
    checkSelected: 'text-emerald-700 opacity-100',
    checkUnselected: 'text-neutral-400 opacity-35',
  },
  Optimization: {
    selected: 'border-sky-300 bg-sky-50 text-sky-950',
    unselected: 'border-black/10 bg-white text-neutral-800 hover:border-black/25 hover:bg-neutral-50',
    checkSelected: 'text-sky-700 opacity-100',
    checkUnselected: 'text-neutral-400 opacity-35',
  },
  'Due Diligence': {
    selected: 'border-amber-300 bg-amber-50 text-amber-950',
    unselected: 'border-black/10 bg-white text-neutral-800 hover:border-black/25 hover:bg-neutral-50',
    checkSelected: 'text-amber-700 opacity-100',
    checkUnselected: 'text-neutral-400 opacity-35',
  },
};
const fullServiceCheckOrder: PublicProjectArea[] = ['Growth', 'Optimization', 'Due Diligence'];

export default function LeadForm({
  heading = 'Contact Us',
  intro = 'Share the basic first. Once we have your information, we will schedule a call with you.',
  submitLabel = 'Request a consultation',
  preselectedProjectAreas = EMPTY_ARRAY,
}: LeadFormProps) {
  const [state, setState] = useState<LeadFormState>({
    ...defaultState,
    selectedProjectAreas: preselectedProjectAreas,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState('');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('');
  const [isBudgetSubmitting, setIsBudgetSubmitting] = useState(false);
  const [isBudgetConfirmed, setIsBudgetConfirmed] = useState(false);

  useEffect(() => {
    setState((current) => ({
      ...current,
      selectedProjectAreas: preselectedProjectAreas,
    }));
  }, [preselectedProjectAreas]);

  const normalizedProjectArea = useMemo(
    () => normalizeProjectArea(state.selectedProjectAreas),
    [state.selectedProjectAreas],
  );
  const hasFullServiceSelection = publicProjectAreaOptions.every((area) => state.selectedProjectAreas.includes(area));

  function toggleProjectArea(area: PublicProjectArea) {
    setState((current) => {
      const nextAreas = current.selectedProjectAreas.includes(area)
        ? current.selectedProjectAreas.filter((item) => item !== area)
        : [...current.selectedProjectAreas, area];

      return {
        ...current,
        selectedProjectAreas: nextAreas,
      };
    });
  }

  function toggleFullServicePackage() {
    setState((current) => {
      const hasCompleteSelection = publicProjectAreaOptions.every((area) => current.selectedProjectAreas.includes(area));

      return {
        ...current,
        selectedProjectAreas: hasCompleteSelection ? [] : [...publicProjectAreaOptions],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitInternalForm('/api/contact-lead', {
      name: state.name.trim(),
      email: state.email.trim(),
      company: state.businessName.trim(),
      phone: state.phone.trim(),
      website: '',
      projectAreas: state.selectedProjectAreas,
      inquiryType: normalizedProjectArea || 'General inquiry',
      normalizedProjectArea,
      message: state.message.trim(),
      websiteUrl: state.websiteUrl.trim(),
      ...getSourceMetadata({
        formType: 'lead_inquiry',
        actionType: 'lead_submission',
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit your inquiry.');
      return;
    }

    setSubmittedLeadId(result.submissionId ?? '');
    setSelectedBudgetRange('');
    setIsBudgetConfirmed(false);
    setStatus('success');
    setState({
      ...defaultState,
      selectedProjectAreas: preselectedProjectAreas,
    });
  }

  async function handleBudgetSelect(option: (typeof budgetOptions)[number]) {
    if (!submittedLeadId || isBudgetSubmitting) {
      return;
    }

    setIsBudgetSubmitting(true);
    setErrorMessage('');

    const result = await submitInternalForm('/api/contact-lead', {
      submissionId: submittedLeadId,
      budgetRange: option,
    });

    if (!result.ok) {
      setErrorMessage(result.error ?? 'Unable to save budget.');
      setIsBudgetSubmitting(false);
      return;
    }

    setSelectedBudgetRange(option);
    setIsBudgetConfirmed(true);
    setIsBudgetSubmitting(false);
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <section className="border border-black/10 bg-white p-5 sm:p-6 md:p-7">
        <div className="mb-6">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">{heading}</h3>
        </div>

        <div className="space-y-6">
          <div className="border border-black/10 bg-neutral-50 px-4 py-4">
            <p className="text-sm font-medium text-neutral-900">Submission received.</p>
            <p className="mt-1 text-sm text-neutral-600">
              We have your request and will review the information you submitted.
            </p>
          </div>

          {submittedLeadId ? (
            <div className="space-y-3 border-t border-black/10 pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Budget</p>
              {isBudgetConfirmed && selectedBudgetRange ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white">
                    <Check className="h-4 w-4" />
                    <span>{selectedBudgetRange}</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsBudgetConfirmed(false)}
                      className="text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4"
                    >
                      Edit budget
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600">
                    Add your budget to this submission.
                  </p>
                  {errorMessage ? (
                    <p className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-700">
                      {errorMessage}
                    </p>
                  ) : null}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => void handleBudgetSelect(option)}
                        disabled={isBudgetSubmitting}
                        className={`flex items-center gap-3 border px-4 py-4 text-left text-sm transition-colors ${
                          selectedBudgetRange === option
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-white text-neutral-800 hover:border-black/30'
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        <Check className={`h-4 w-4 ${selectedBudgetRange === option ? 'opacity-100' : 'opacity-25'}`} />
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-3 border-t border-black/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Book a Call</p>
            <p className="text-sm text-neutral-600">
              Want to move faster? Book a call as the next step.
            </p>
                    <button
                      type="button"
                      onClick={openCalendly}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white sm:w-auto"
                    >
                      Book a call
                      <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 border-t border-black/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Timeline</p>
            <div className="space-y-2">
              {submissionTimeline.map((item, index) => (
                <div key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center border border-black/10 bg-neutral-50 text-[11px] font-medium text-neutral-600">
                    {index + 1}
                  </span>
                  <span className="pt-1">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/10 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-5 text-neutral-500">{'This request has been submitted. Additional budget details can still be attached above.'}</p>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white opacity-80"
            >
              Request Submitted
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <FormTemplate
      eyebrow="Contact Us"
      title={heading}
      intro={intro}
      onSubmit={handleSubmit}
      footerNote="This is the primary intake flow for prospective businesses. Booking is offered after submission as a follow-on option."
      submitLabel={submitLabel}
      submittingLabel="Submitting..."
      submitDisabled={status === 'submitting' || state.selectedProjectAreas.length === 0}
      isSubmitting={status === 'submitting'}
    >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Name</span>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              required
              autoComplete="name"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Work email</span>
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
              required
              autoComplete="email"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="name@business.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Business</span>
            <input
              type="text"
              name="business_name"
              value={state.businessName}
              onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
              required
              autoComplete="organization"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Business name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
              required
              autoComplete="tel"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="(555) 555-5555"
            />
          </label>
        </div>

        <label className="hidden">
          <span className="mb-2 block text-sm font-medium text-neutral-800">Leave this field empty</span>
          <input
            type="text"
            name="websiteUrl"
            tabIndex={-1}
            autoComplete="off"
            value={state.websiteUrl}
            onChange={(event) => setState((current) => ({ ...current, websiteUrl: event.target.value }))}
            className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none"
          />
        </label>

        <fieldset className="block">
          <legend className="mb-2 block text-sm font-medium text-neutral-800">Services Desired</legend>
          <p className="mb-3 text-xs leading-5 text-neutral-500">
            Select the services you want to discuss.
          </p>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {!hasFullServiceSelection ? (
                <motion.div
                  key="individual-services"
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {publicProjectAreaOptions.map((area) => {
                      const isSelected = state.selectedProjectAreas.includes(area);
                      const styles = serviceCardStyles[area];

                      return (
                        <div key={area}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => toggleProjectArea(area)}
                            className={`flex min-h-14 w-full items-center gap-3 border px-4 py-4 text-left text-sm transition-all duration-200 ${
                              isSelected ? styles.selected : styles.unselected
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Check className={`h-4 w-4 ${isSelected ? styles.checkSelected : styles.checkUnselected}`} />
                              <span>{area}</span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <motion.div
              animate={{
                scale: hasFullServiceSelection ? 1 : 1,
                y: hasFullServiceSelection ? 0 : 0,
              }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <button
                type="button"
                aria-pressed={hasFullServiceSelection}
                onClick={toggleFullServicePackage}
                className={`flex min-h-14 w-full items-center gap-3 border px-4 text-left text-sm transition-all duration-300 ${
                  hasFullServiceSelection
                    ? 'border-black bg-black py-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]'
                    : 'border-black/10 bg-white py-4 text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Check className={`h-4 w-4 ${hasFullServiceSelection ? 'opacity-100' : 'opacity-30'}`} />
                  <div>
                    <span className="block">{FULL_SERVICE_PACKAGE}</span>
                    {hasFullServiceSelection ? (
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2"
                      >
                        {fullServiceCheckOrder.map((area, index) => {
                          const styles = serviceCardStyles[area];

                          return (
                            <motion.span
                              key={area}
                              initial={{ opacity: 0, scale: 0.8, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.08, ease: 'easeOut' }}
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white/8 ${styles.checkSelected.replace(' opacity-100', '')} ${
                                area === 'Growth'
                                  ? 'border-emerald-500/40'
                                  : area === 'Optimization'
                                    ? 'border-sky-500/40'
                                    : 'border-amber-500/40'
                              }`}
                              aria-hidden="true"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </motion.span>
                          );
                        })}
                      </motion.span>
                    ) : null}
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">What do you need help with?</span>
          <textarea
            name="message"
            value={state.message}
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            required
            autoComplete="off"
            rows={5}
            className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
            placeholder="What do you want to improve, and how urgent is it?"
          />
        </label>

        {status === 'error' ? (
          <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}
    </FormTemplate>
  );
}
