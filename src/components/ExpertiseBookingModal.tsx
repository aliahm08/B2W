import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, Loader2, RefreshCcw, Send, X } from 'lucide-react';

type BookingSlot = {
  start: string;
  end: string;
};

type ExpertiseBookingModalProps = {
  isOpen: boolean;
  serviceLabel: string;
  onClose: () => void;
};

type ApiResult =
  | { ok: true; configured?: boolean; timezone?: string; slots?: BookingSlot[]; eventId?: string }
  | { ok: false; error?: string };

function getApiError(result: ApiResult): string | undefined {
  return 'error' in result ? result.error : undefined;
}

function formatSlotLabel(slot: BookingSlot, timeZone: string): string {
  const start = new Date(slot.start);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(start);
}

async function readApiResponse(response: Response): Promise<ApiResult> {
  const raw = await response.text();

  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (response.ok) {
      return { ok: true, ...data };
    }
    return { ok: false, error: typeof data.error === 'string' ? data.error : 'Request failed.' };
  } catch {
    return { ok: false, error: response.ok ? undefined : raw || 'Request failed.' };
  }
}

export default function ExpertiseBookingModal({
  isOpen,
  serviceLabel,
  onClose,
}: ExpertiseBookingModalProps) {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [slotsTimezone, setSlotsTimezone] = useState('America/New_York');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleSlots = useMemo(() => slots.slice(0, 8), [slots]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadAvailability();

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

  async function loadAvailability() {
    setIsLoadingSlots(true);
    setAvailabilityError('');

    try {
      const response = await fetch('/api/consultations?action=availability');
      const result = await readApiResponse(response);

      if (!result.ok) {
        throw new Error(getApiError(result) ?? 'Unable to load consultation availability.');
      }

      const nextSlots = result.slots ?? [];
      setSlots(nextSlots);
      setSlotsTimezone(result.timezone ?? 'America/New_York');
      setSelectedSlot((current) =>
        current && nextSlots.some((slot) => slot.start === current.start && slot.end === current.end)
          ? current
          : nextSlots[0] ?? null,
      );

      if (result.configured === false) {
        setAvailabilityError('Calendar booking is not configured yet.');
      }
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Unable to load consultation availability.');
      setSlots([]);
      setSelectedSlot(null);
    } finally {
      setIsLoadingSlots(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setBookingStatus('');

    try {
      const response = await fetch('/api/consultations?action=book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          notes,
          start: selectedSlot.start,
          end: selectedSlot.end,
          service: serviceLabel,
        }),
      });

      const result = await readApiResponse(response);

      if (!result.ok) {
        throw new Error(getApiError(result) ?? 'Unable to book consultation.');
      }

      setBookingStatus('Consultation booked. A calendar invite will be sent to you and B2W shortly.');
      await loadAvailability();
    } catch (error) {
      setBookingStatus(error instanceof Error ? error.message : 'Unable to book consultation.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:text-black"
            aria-label="Close booking modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="border-b border-neutral-200 px-6 py-5 md:px-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Book a call</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-black">{serviceLabel}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Pick an open time and send your details. The event invite will go to your email and to info@b2w-ai.com through the existing calendar workflow.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:px-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-black">
                  <CalendarDays size={16} />
                  Consultation availability
                </div>
                <button
                  type="button"
                  onClick={() => void loadAvailability()}
                  className="inline-flex items-center gap-2 text-xs text-neutral-500 transition-colors hover:text-black"
                >
                  <RefreshCcw size={13} />
                  Refresh
                </button>
              </div>

              {availabilityError ? (
                <div className="mb-4 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                  {availabilityError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {isLoadingSlots ? (
                  <div className="col-span-full flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                    <Loader2 size={14} className="animate-spin" />
                    Loading available slots
                  </div>
                ) : null}

                {!isLoadingSlots && !visibleSlots.length ? (
                  <div className="col-span-full border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                    No slots are currently available.
                  </div>
                ) : null}

                {visibleSlots.map((slot) => {
                  const selected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`border px-4 py-3 text-left text-sm transition-colors ${
                        selected ? 'border-black bg-black text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      {formatSlotLabel(slot, slotsTimezone)}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Work email"
                className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                required
              />
              <input
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Company"
                className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything we should know before the call?"
                rows={5}
                className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              />

              {bookingStatus ? <p className="text-sm text-neutral-600">{bookingStatus}</p> : null}

              <button
                type="submit"
                disabled={!selectedSlot || !name.trim() || !email.trim() || isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? 'Booking...' : 'Book consultation'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
