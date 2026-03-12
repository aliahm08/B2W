import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Bot, CalendarDays, Loader2, RefreshCcw, Send, Sparkles, User } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type BookingSlot = {
  start: string;
  end: string;
};

type ChatBotProps = {
  activeTab?: 'chat' | 'book';
  onTabChange?: (tab: 'chat' | 'book') => void;
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 'assistant-intro',
  role: 'assistant',
  content:
    'Ask about B2W services, industries, case studies, or use the booking tab to schedule a consultation.',
};

function formatSlotLabel(slot: BookingSlot, timeZone: string): string {
  const start = new Date(slot.start);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });

  return formatter.format(start);
}

export default function ChatBot({ activeTab = 'chat', onTabChange }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'book'>(activeTab);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [slotsTimezone, setSlotsTimezone] = useState('America/New_York');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingCompany, setBookingCompany] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedTab === 'book') {
      void loadAvailability();
    }
  }, [selectedTab]);

  const visibleSlots = useMemo(() => slots.slice(0, 8), [slots]);

  async function loadAvailability() {
    setIsLoadingSlots(true);
    setAvailabilityError('');

    try {
      const response = await fetch('/api/consultations/availability');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to load consultation availability.');
      }

      setSlots(data.slots ?? []);
      setSlotsTimezone(data.timezone ?? 'America/New_York');
      setSelectedSlot((current) =>
        current && (data.slots ?? []).some((slot: BookingSlot) => slot.start === current.start && slot.end === current.end)
          ? current
          : (data.slots ?? [])[0] ?? null,
      );

      if (data.configured === false) {
        setAvailabilityError('Calendar booking is not configured yet. You can still ask questions in chat.');
      }
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Unable to load consultation availability.');
      setSlots([]);
      setSelectedSlot(null);
    } finally {
      setIsLoadingSlots(false);
    }
  }

  function switchTab(tab: 'chat' | 'book') {
    setSelectedTab(tab);
    onTabChange?.(tab);
  }

  async function handleChatSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || isTyping) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        role: 'user' as const,
        content: input.trim(),
      },
    ];

    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to reach the assistant.');
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content:
            error instanceof Error
              ? `I hit a configuration problem: ${error.message}`
              : 'I hit a configuration problem reaching the assistant.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function handleBookingSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedSlot || isSubmittingBooking) {
      return;
    }

    setIsSubmittingBooking(true);
    setBookingStatus('');

    try {
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          company: bookingCompany,
          notes: bookingNotes,
          start: selectedSlot.start,
          end: selectedSlot.end,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to book consultation.');
      }

      setBookingStatus('Consultation booked. A calendar invite will be sent shortly.');
      setBookingNotes('');
      await loadAvailability();
    } catch (error) {
      setBookingStatus(error instanceof Error ? error.message : 'Unable to book consultation.');
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-neutral-200 bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black">B2W Assistant</h3>
            <p className="text-xs text-neutral-500">Services, case studies, and consultation booking</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => switchTab('chat')}
            className={`rounded-full px-3 py-2 text-sm transition-colors ${
              selectedTab === 'chat' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => switchTab('book')}
            className={`rounded-full px-3 py-2 text-sm transition-colors ${
              selectedTab === 'book' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            Book time
          </button>
        </div>
      </div>

      {selectedTab === 'chat' ? (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === 'user' ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                  }`}
                >
                  {message.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-tr-sm bg-black text-white'
                      : 'rounded-tl-sm border border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-black">
                  <Bot size={15} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-500">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-neutral-200 bg-white p-3">
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask what B2W can build for your team..."
                className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-black outline-none transition-colors focus:border-black"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto bg-white p-4">
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

          <p className="mb-4 text-sm leading-relaxed text-neutral-600">
            Pick an open slot, then send your details. Access is restricted to the calendars and Drive locations configured on the server.
          </p>

          {availabilityError ? (
            <div className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              {availabilityError}
            </div>
          ) : null}

          <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {isLoadingSlots ? (
              <div className="col-span-full flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                <Loader2 size={14} className="animate-spin" />
                Loading available slots
              </div>
            ) : null}

            {!isLoadingSlots && !visibleSlots.length ? (
              <div className="col-span-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
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
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected ? 'border-black bg-black text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {formatSlotLabel(slot, slotsTimezone)}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-3">
            <input
              type="text"
              value={bookingName}
              onChange={(event) => setBookingName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              required
            />
            <input
              type="email"
              value={bookingEmail}
              onChange={(event) => setBookingEmail(event.target.value)}
              placeholder="Work email"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              required
            />
            <input
              type="text"
              value={bookingCompany}
              onChange={(event) => setBookingCompany(event.target.value)}
              placeholder="Company"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
            />
            <textarea
              value={bookingNotes}
              onChange={(event) => setBookingNotes(event.target.value)}
              placeholder="What do you want help with?"
              rows={4}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
            />

            {bookingStatus ? <p className="text-sm text-neutral-600">{bookingStatus}</p> : null}

            <button
              type="submit"
              disabled={!selectedSlot || !bookingName.trim() || !bookingEmail.trim() || isSubmittingBooking}
              className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmittingBooking ? 'Booking...' : 'Book consultation'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
