import { startTransition, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  AudioLines,
  BadgeDollarSign,
  Bot,
  Building2,
  Check,
  ChevronRight,
  ClipboardList,
  Layers2,
  Mic,
  Send,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import B2WLogoMark from '../components/B2WLogoMark';
import Seo from '../components/Seo';

type WalkthroughId = 'rowhouse' | 'retail' | 'office';
type SupplierId = 'balanced' | 'value' | 'premium';
type ClientId = 'owner' | 'developer' | 'property';
type DeliveryId = 'email' | 'sms' | 'proposal';
type CostKind = 'material' | 'labor' | 'permit' | 'equipment';

type Walkthrough = {
  id: WalkthroughId;
  title: string;
  site: string;
  summary: string;
  transcript: string;
  extracted: string[];
  defaults: {
    clientId: ClientId;
    deliveryId: DeliveryId;
  };
  lineItems: Array<{
    label: string;
    scope: string;
    kind: CostKind;
    amount: number;
  }>;
};

type SupplierMode = {
  id: SupplierId;
  label: string;
  supplier: string;
  materialFactor: number;
  laborFactor: number;
  markupRate: number;
  contingencyRate: number;
  leadTime: string;
  note: string;
};

type ClientProfile = {
  id: ClientId;
  label: string;
  stance: string;
};

type DeliveryMode = {
  id: DeliveryId;
  label: string;
  description: string;
};

type EstimateConfig = {
  supplierId: SupplierId;
  clientId: ClientId;
  deliveryId: DeliveryId;
  expedite: boolean;
  contingencyRate: number | null;
};

type VersionSnapshot = {
  id: string;
  label: string;
  supplierLabel: string;
  clientLabel: string;
  deliveryLabel: string;
  total: number;
  note: string;
  config: EstimateConfig;
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

const walkthroughs: Walkthrough[] = [
  {
    id: 'rowhouse',
    title: 'Capitol Hill rowhouse repair + finish refresh',
    site: 'Washington, DC / 2,400 SF / occupied residence',
    summary: 'Water intrusion at the rear parapet, two damaged windows, interior patch-and-paint at the stair hall.',
    transcript:
      'Walkthrough log. Rear parapet is leaking into the top-floor landing. We need roughly four-hundred twenty square feet of roof patching, new flashing at the brick return, drywall repair and paint at the stair landing, and two replacement windows on the rear elevation. Client wants a proposal tonight, prefers email, and asked for both a value option and a sharper premium option.',
    extracted: ['420 SF roof repair', 'rear parapet flashing', 'drywall + paint touch-up', '2 replacement windows', 'email delivery'],
    defaults: {
      clientId: 'owner',
      deliveryId: 'email',
    },
    lineItems: [
      { label: 'Roof membrane patch package', scope: '420 SF repair zone', kind: 'material', amount: 5800 },
      { label: 'Parapet flashing and sealants', scope: 'rear return + coping reset', kind: 'material', amount: 3200 },
      { label: 'Window replacements', scope: '2 rear-elevation units', kind: 'material', amount: 4100 },
      { label: 'Interior drywall and paint repair', scope: 'stair landing + top-floor hall', kind: 'labor', amount: 3600 },
      { label: 'Carpentry + roofing labor', scope: '2-day field crew', kind: 'labor', amount: 6400 },
      { label: 'Lift, protection, haul-off', scope: 'access + disposal', kind: 'equipment', amount: 1750 },
      { label: 'Permit + closeout', scope: 'basic permit processing', kind: 'permit', amount: 950 },
    ],
  },
  {
    id: 'retail',
    title: 'Tysons retail vanilla-shell buildout',
    site: 'Tysons, VA / 1,800 SF / landlord delivery',
    summary: 'Demising wall closure, ADA restroom, flooring, storefront patching, and MEP coordination for permit set pricing.',
    transcript:
      'Walkthrough log. This is an eighteen-hundred square foot vanilla-shell retail space. Scope includes closing one demising wall opening, adding an ADA restroom package, polishing the storefront patch, floating and finishing the slab for LVT, and rough coordination for mechanical and electrical tie-ins. Landlord rep wants a formal proposal PDF for internal review by tomorrow morning.',
    extracted: ['demising wall closure', 'ADA restroom package', 'LVT floor prep', 'storefront patch', 'proposal PDF'],
    defaults: {
      clientId: 'developer',
      deliveryId: 'proposal',
    },
    lineItems: [
      { label: 'Metal framing + board closure', scope: 'demising wall and backing', kind: 'material', amount: 6900 },
      { label: 'ADA restroom fixture package', scope: 'toilet, lavatory, accessories', kind: 'material', amount: 8400 },
      { label: 'Storefront patch and finish prep', scope: 'header, infill, skim finish', kind: 'labor', amount: 4300 },
      { label: 'Floor leveling and LVT prep', scope: 'full slab prep', kind: 'labor', amount: 5200 },
      { label: 'Mechanical + electrical rough coordination', scope: 'allowance for field coordination', kind: 'labor', amount: 4700 },
      { label: 'Dumpsters, protection, logistics', scope: 'shell buildout support', kind: 'equipment', amount: 2200 },
      { label: 'Permit drawing allowance', scope: 'submission package support', kind: 'permit', amount: 1800 },
    ],
  },
  {
    id: 'office',
    title: 'Dupont office re-stack and conference build',
    site: 'Washington, DC / 3,200 SF / active office floor',
    summary: 'Two conference rooms, glass fronts, open ceiling cleanup, phased work after hours, and developer-facing communication.',
    transcript:
      'Walkthrough log. Existing office needs a re-stack with two new conference rooms, front glass systems, open-ceiling cleanup, acoustic treatments, and after-hours work because the tenant is still in place. Developer team wants one fast-track scenario and one standard scenario. Their PM prefers a concise text update first, then a polished PDF summary for approval.',
    extracted: ['2 conference rooms', 'glass fronts', 'open ceiling cleanup', 'after-hours phasing', 'SMS + PDF delivery'],
    defaults: {
      clientId: 'property',
      deliveryId: 'sms',
    },
    lineItems: [
      { label: 'Framing, insulation, and drywall', scope: '2 conference rooms', kind: 'material', amount: 9800 },
      { label: 'Glass front package', scope: 'doors, sidelites, hardware', kind: 'material', amount: 12800 },
      { label: 'Ceiling cleanup and acoustic work', scope: 'open ceiling zones', kind: 'labor', amount: 6100 },
      { label: 'Painting and finish touch-up', scope: 'conference interiors + circulation', kind: 'labor', amount: 3200 },
      { label: 'After-hours field labor', scope: 'phased occupancy work', kind: 'labor', amount: 7600 },
      { label: 'Temporary protection and lift access', scope: 'occupied-floor logistics', kind: 'equipment', amount: 2400 },
      { label: 'Permit and inspection allowance', scope: 'tenant improvement filing', kind: 'permit', amount: 2100 },
    ],
  },
];

const suppliers: SupplierMode[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    supplier: 'Atlas regional network',
    materialFactor: 1,
    laborFactor: 1,
    markupRate: 0.12,
    contingencyRate: 0.08,
    leadTime: '7 days',
    note: 'Baseline B2W-style recommendation balancing margin protection and close speed.',
  },
  {
    id: 'value',
    label: 'Value engineered',
    supplier: 'Civic sourcing partners',
    materialFactor: 0.93,
    laborFactor: 0.98,
    markupRate: 0.11,
    contingencyRate: 0.07,
    leadTime: '11 days',
    note: 'Lower material spend and slightly slower fulfillment for price-sensitive bids.',
  },
  {
    id: 'premium',
    label: 'Premium / fast-track',
    supplier: 'Summit priority vendors',
    materialFactor: 1.14,
    laborFactor: 1.05,
    markupRate: 0.13,
    contingencyRate: 0.06,
    leadTime: '4 days',
    note: 'Higher-cost supply path with tighter coordination and faster mobilization.',
  },
];

const clientProfiles: ClientProfile[] = [
  { id: 'owner', label: 'Owner', stance: 'Needs reassurance, clear allowances, and clean next steps.' },
  { id: 'developer', label: 'Developer', stance: 'Wants scope clarity, alternates, and formal decision framing.' },
  { id: 'property', label: 'Property manager', stance: 'Prioritizes disruption control, speed, and tenant communication.' },
];

const deliveryModes: DeliveryMode[] = [
  { id: 'email', label: 'Email', description: 'Detailed written recap with assumptions and alternates.' },
  { id: 'sms', label: 'SMS update', description: 'Short operational summary first, with a formal estimate to follow.' },
  { id: 'proposal', label: 'Proposal PDF', description: 'Polished client-facing summary formatted like a presentation-ready estimate.' },
];

const promptChips = [
  'Make this more value engineered.',
  'Switch to premium suppliers and expedite.',
  'Format this for the developer as a proposal PDF.',
  'Send the owner a short SMS summary instead.',
] as const;

function getWalkthrough(id: WalkthroughId) {
  return walkthroughs.find((item) => item.id === id) ?? walkthroughs[0];
}

function getSupplier(id: SupplierId) {
  return suppliers.find((item) => item.id === id) ?? suppliers[0];
}

function getClientProfile(id: ClientId) {
  return clientProfiles.find((item) => item.id === id) ?? clientProfiles[0];
}

function getDeliveryMode(id: DeliveryId) {
  return deliveryModes.find((item) => item.id === id) ?? deliveryModes[0];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function buildEstimate(walkthrough: Walkthrough, config: EstimateConfig) {
  const supplier = getSupplier(config.supplierId);
  const contingencyRate = config.contingencyRate ?? supplier.contingencyRate;

  const lineItems = walkthrough.lineItems.map((item) => {
    const baseFactor =
      item.kind === 'material'
        ? supplier.materialFactor
        : item.kind === 'labor'
          ? supplier.laborFactor
          : 1;

    const expediteFactor = config.expedite && item.kind !== 'permit' ? 1.06 : 1;
    const amount = Math.round(item.amount * baseFactor * expediteFactor);

    return {
      ...item,
      amount,
    };
  });

  const directCost = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const gcFee = Math.round(directCost * supplier.markupRate);
  const contingency = Math.round(directCost * contingencyRate);
  const expediteFee = config.expedite ? Math.round(directCost * 0.035) : 0;
  const total = directCost + gcFee + contingency + expediteFee;

  return {
    lineItems,
    directCost,
    gcFee,
    contingency,
    contingencyRate,
    expediteFee,
    total,
    supplier,
  };
}

function createAssistantResponse(message: string, currentConfig: EstimateConfig) {
  const text = message.toLowerCase();
  const nextConfig: EstimateConfig = { ...currentConfig };
  const changes: string[] = [];
  const notes: string[] = [];

  if (text.includes('value') || text.includes('budget') || text.includes('cheaper')) {
    if (nextConfig.supplierId !== 'value') {
      nextConfig.supplierId = 'value';
      changes.push('shifted the estimate to the value-engineered supplier path');
    }
    if (nextConfig.expedite) {
      changes.push('removed the rush schedule premium');
    }
    nextConfig.expedite = false;
  }

  if (text.includes('premium') || text.includes('fast-track') || text.includes('faster')) {
    if (nextConfig.supplierId !== 'premium') {
      nextConfig.supplierId = 'premium';
      changes.push('switched material pricing to the premium fast-track vendors');
    }
  }

  if (text.includes('expedite') || text.includes('rush')) {
    if (!nextConfig.expedite) {
      nextConfig.expedite = true;
      changes.push('added an expedited execution allowance');
    }
  }

  if (text.includes('standard') || text.includes('remove expedite') || text.includes('normal timeline')) {
    if (nextConfig.expedite) {
      nextConfig.expedite = false;
      changes.push('removed the rush schedule premium');
    }
    if (text.includes('standard') && nextConfig.supplierId !== 'balanced') {
      nextConfig.supplierId = 'balanced';
      changes.push('returned the estimate to the balanced sourcing mode');
    }
  }

  if (text.includes('owner')) {
    if (nextConfig.clientId !== 'owner') {
      nextConfig.clientId = 'owner';
      changes.push('rewrote the client framing for a homeowner audience');
    }
  }

  if (text.includes('developer')) {
    if (nextConfig.clientId !== 'developer') {
      nextConfig.clientId = 'developer';
      changes.push('reframed the estimate for a developer review process');
    }
  }

  if (text.includes('property manager') || text.includes('pm') || text.includes('tenant')) {
    if (nextConfig.clientId !== 'property') {
      nextConfig.clientId = 'property';
      changes.push('shifted the messaging toward a property-manager audience');
    }
  }

  if (text.includes('email')) {
    if (nextConfig.deliveryId !== 'email') {
      nextConfig.deliveryId = 'email';
      changes.push('set delivery to a detailed email recap');
    }
  }

  if (text.includes('text') || text.includes('sms')) {
    if (nextConfig.deliveryId !== 'sms') {
      nextConfig.deliveryId = 'sms';
      changes.push('set delivery to a concise SMS-style summary');
    }
  }

  if (text.includes('proposal') || text.includes('pdf')) {
    if (nextConfig.deliveryId !== 'proposal') {
      nextConfig.deliveryId = 'proposal';
      changes.push('set delivery to a formal proposal PDF');
    }
  }

  if (text.includes('reduce contingency') || text.includes('tighten contingency')) {
    nextConfig.contingencyRate = 0.05;
    changes.push('tightened contingency to 5%');
  }

  if (text.includes('increase contingency') || text.includes('risk buffer')) {
    nextConfig.contingencyRate = 0.1;
    changes.push('raised contingency to 10% for added risk coverage');
  }

  if (text.includes('why') && text.includes('contingency')) {
    notes.push('Contingency is covering field uncertainty, patch conditions, and coordination risk pulled from the walkthrough notes.');
  }

  if (text.includes('lead time') || text.includes('schedule')) {
    notes.push(`Current supplier lead time is ${getSupplier(nextConfig.supplierId).leadTime}.`);
  }

  const didChange = JSON.stringify(nextConfig) !== JSON.stringify(currentConfig);

  if (!didChange && notes.length === 0) {
    notes.push('I can revise the supplier path, delivery format, client framing, rush schedule, or contingency live from here.');
  }

  const summary =
    changes.length > 0
      ? `Updated live: ${changes.join(', ')}.`
      : 'No pricing inputs changed.';

  return {
    nextConfig,
    didChange,
    response: [summary, ...notes].join(' '),
  };
}

function createDeliveryPreview(clientId: ClientId, deliveryId: DeliveryId, total: number) {
  const client = getClientProfile(clientId);

  if (deliveryId === 'sms') {
    return `Hi, quick update: we have a current working estimate of ${formatCurrency(total)}. Main drivers are scope protection, field labor, and supplier path. I can send the detailed line-item version next.`;
  }

  if (deliveryId === 'proposal') {
    return `${client.label} review copy: total project budget ${formatCurrency(total)} with alternates organized by supplier path, assumptions, and execution tempo.`;
  }

  return `Subject: B2W estimate recap\n\nCurrent budget range is ${formatCurrency(total)}. I attached the line-item breakdown, listed supplier assumptions, and called out the main cost drivers for ${client.label.toLowerCase()} review.`;
}

export default function AppTestOnePage() {
  const [selectedWalkthroughId, setSelectedWalkthroughId] = useState<WalkthroughId>('rowhouse');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);
  const [transcriptVisibleCount, setTranscriptVisibleCount] = useState(0);
  const [isEstimateReady, setIsEstimateReady] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const versionCounterRef = useRef(1);

  const walkthrough = getWalkthrough(selectedWalkthroughId);

  const [config, setConfig] = useState<EstimateConfig>({
    supplierId: 'balanced',
    clientId: walkthrough.defaults.clientId,
    deliveryId: walkthrough.defaults.deliveryId,
    expedite: false,
    contingencyRate: null,
  });

  const estimate = buildEstimate(walkthrough, config);
  const client = getClientProfile(config.clientId);
  const delivery = getDeliveryMode(config.deliveryId);
  const transcriptVisibleText = walkthrough.transcript.slice(0, transcriptVisibleCount);
  const totalVersions = versions.length;

  useEffect(() => {
    setConfig({
      supplierId: 'balanced',
      clientId: walkthrough.defaults.clientId,
      deliveryId: walkthrough.defaults.deliveryId,
      expedite: false,
      contingencyRate: null,
    });
    setIsTranscribing(false);
    setIsTranscriptReady(false);
    setTranscriptVisibleCount(0);
    setIsEstimateReady(false);
    setMessageInput('');
    setMessages([]);
    setVersions([]);
    versionCounterRef.current = 1;
  }, [selectedWalkthroughId, walkthrough.defaults.clientId, walkthrough.defaults.deliveryId]);

  useEffect(() => {
    if (!isTranscriptReady) {
      return;
    }

    setTranscriptVisibleCount(0);
    const intervalId = window.setInterval(() => {
      setTranscriptVisibleCount((current) => {
        if (current >= walkthrough.transcript.length) {
          window.clearInterval(intervalId);
          return current;
        }

        return current + 6;
      });
    }, 20);

    return () => window.clearInterval(intervalId);
  }, [isTranscriptReady, walkthrough.transcript]);

  function appendVersion(label: string, nextConfig: EstimateConfig, note: string) {
    const nextEstimate = buildEstimate(walkthrough, nextConfig);
    const supplier = getSupplier(nextConfig.supplierId);
    const nextClient = getClientProfile(nextConfig.clientId);
    const nextDelivery = getDeliveryMode(nextConfig.deliveryId);

    setVersions((current) => [
      {
        id: `version-${versionCounterRef.current}`,
        label,
        supplierLabel: supplier.label,
        clientLabel: nextClient.label,
        deliveryLabel: nextDelivery.label,
        total: nextEstimate.total,
        note,
        config: nextConfig,
      },
      ...current,
    ].slice(0, 6));

    versionCounterRef.current += 1;
  }

  function handleTranscribe() {
    setIsTranscribing(true);
    setIsTranscriptReady(false);
    setTranscriptVisibleCount(0);

    window.setTimeout(() => {
      setIsTranscribing(false);
      setIsTranscriptReady(true);
    }, 1300);
  }

  function handleEstimateLaunch() {
    setIsEstimateReady(true);
    setMessages([
      {
        id: 'assistant-initial',
        role: 'assistant',
        content:
          'Estimate is live. Ask me to change supplier strategy, swap communication format, tighten contingency, or generate a different client-facing version.',
      },
    ]);
    appendVersion('Baseline estimate', config, 'Derived directly from the walkthrough log.');
  }

  function handlePresetPrompt(prompt: string) {
    setMessageInput(prompt);
    handleMessageSubmit(prompt);
  }

  function handleVersionRestore(version: VersionSnapshot) {
    setConfig(version.config);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-restore-${version.id}`,
        role: 'assistant',
        content: `Restored ${version.label.toLowerCase()} so you can continue refining from that version.`,
      },
    ]);
  }

  function handleMessageSubmit(forcedMessage?: string) {
    const nextMessage = (forcedMessage ?? messageInput).trim();

    if (!nextMessage) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: nextMessage,
    };

    const { nextConfig, didChange, response } = createAssistantResponse(nextMessage, config);

    startTransition(() => {
      setMessages((current) => [
        ...current,
        userMessage,
        {
          id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: 'assistant',
          content: response,
        },
      ]);

      if (didChange) {
        setConfig(nextConfig);
        appendVersion(`Version ${versionCounterRef.current}`, nextConfig, nextMessage);
      }
    });

    setMessageInput('');
  }

  return (
    <>
      <Seo
        title="FieldBoss Estimator Prototype"
        description="Swiss-style AI SaaS estimator prototype for B2W, combining walkthrough voice logging, estimation, and live estimate refinement."
        robots="noindex, nofollow"
      />

      <main className="min-h-screen overflow-hidden bg-[#f5f0e6] text-black">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 12% 12%, rgba(255,255,255,0.82), transparent 24%), radial-gradient(circle at 85% 10%, rgba(212,175,55,0.12), transparent 24%), linear-gradient(180deg, rgba(245,240,230,0.92), rgba(239,232,220,0.94))',
          }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <header className="border border-black/10 bg-white/[0.7] backdrop-blur-sm">
            <div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:px-8">
              <div className="grid gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <B2WLogoMark className="shrink-0" />
                    <div className="border-l border-black/10 pl-4">
                      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">/app-test-1</p>
                      <h1 className="mt-2 text-[clamp(2rem,4vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.08em]">
                        FieldBoss estimator
                      </h1>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 border border-black/10 bg-black px-3 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-white">
                    AI SaaS mock demo
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                  <div className="grid gap-4 border-t border-black/10 pt-4 md:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Design direction</p>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        Swiss grid discipline, quiet B2W palette, and a classic AI workspace structure built around capture, pricing, and refinement.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Interaction model</p>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        Voice walkthrough first, estimation second, AI-assisted revision third. Each state unlocks the next pane.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">B2W fit</p>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        Retains the site’s warm neutrals, strict typography, and premium minimalism while shifting into a product UI cadence.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 border border-black/10 bg-[#111111] p-4 text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/[0.55]">System state</p>
                      <Sparkles className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ['01', isTranscriptReady ? 'Walkthrough logged' : 'Awaiting transcription'],
                        ['02', isEstimateReady ? 'Estimate calculated' : 'Estimate locked'],
                        ['03', isEstimateReady ? 'AI chat active' : 'Chat hidden'],
                      ].map(([step, label]) => (
                        <div key={step} className="border border-white/10 bg-white/[0.05] p-3">
                          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/[0.45]">{step}</p>
                          <p className="mt-3 text-sm leading-5">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="grid gap-4 border border-black/10 bg-white/[0.55] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Client packet</p>
                  <Building2 className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="border-t border-black/10 pt-4">
                  <p className="text-2xl font-medium tracking-[-0.05em]">{client.label}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{client.stance}</p>
                </div>
                  <div className="grid gap-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Delivery</span>
                    <span>{delivery.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Supplier mode</span>
                    <span>{estimate.supplier.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Lead time</span>
                    <span>{estimate.supplier.leadTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Current total</span>
                    <span className="font-medium">{isEstimateReady ? formatCurrency(estimate.total) : 'Locked'}</span>
                  </div>
                </div>
              </aside>
            </div>
          </header>

          <section className="mt-4 grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(360px,0.78fr)]">
            <div className="grid gap-4">
              <section className="grid gap-4 border border-black/10 bg-white/[0.72] p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Step 01 / walkthrough logging</p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Voice-to-text intake</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {walkthroughs.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedWalkthroughId(item.id)}
                        className={`border px-3 py-2 text-left text-xs font-mono uppercase tracking-[0.18em] transition-colors ${
                          item.id === selectedWalkthroughId
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-white/[0.7] text-neutral-600 hover:border-black/25 hover:text-black'
                        }`}
                      >
                        {item.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="grid gap-4 border border-black/10 bg-[#f8f4ec] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Selected walkthrough</p>
                        <p className="mt-2 text-xl font-medium tracking-[-0.04em]">{walkthrough.title}</p>
                        <p className="mt-1 text-sm text-neutral-500">{walkthrough.site}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTranscribe}
                        className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                      >
                        {isTranscribing ? <AudioLines className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {isTranscribing ? 'Transcribing...' : 'Run voice walkthrough'}
                      </button>
                    </div>

                    <p className="text-sm leading-6 text-neutral-700">{walkthrough.summary}</p>

                    <div className="grid gap-3 md:grid-cols-5">
                      {walkthrough.extracted.map((fact) => (
                        <div key={fact} className="border border-black/10 bg-white/[0.7] px-3 py-3 text-xs leading-5 text-neutral-700">
                          {fact}
                        </div>
                      ))}
                    </div>

                    <div className="relative min-h-[180px] border border-black/10 bg-white p-4">
                      {isTranscribing ? (
                        <div className="flex h-full min-h-[140px] items-center justify-center gap-2">
                          {[22, 38, 18, 44, 26, 34, 20].map((height, index) => (
                            <motion.span
                              key={`${height}-${index}`}
                              className="w-2 bg-black"
                              animate={{ height: [height * 0.5, height, height * 0.65] }}
                              transition={{ duration: 0.8 + index * 0.06, repeat: Infinity, ease: 'easeInOut' }}
                              style={{ height }}
                            />
                          ))}
                        </div>
                      ) : isTranscriptReady ? (
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Transcript</p>
                          <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-800">
                            {transcriptVisibleText}
                            {transcriptVisibleCount < walkthrough.transcript.length ? (
                              <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-black align-middle" />
                            ) : null}
                          </p>
                        </div>
                      ) : (
                        <div className="flex min-h-[140px] items-center justify-center border border-dashed border-black/10 bg-[#f8f4ec] px-6 text-center text-sm leading-6 text-neutral-500">
                          The walkthrough transcript appears here after voice logging, then unlocks the estimate workflow.
                        </div>
                      )}
                    </div>
                  </div>

                  <aside className="grid gap-4 border border-black/10 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Scope extraction</p>
                      <ClipboardList className="h-4 w-4 text-neutral-500" />
                    </div>

                    <div className="grid gap-3">
                      {walkthrough.extracted.map((fact) => (
                        <div key={fact} className="flex items-start gap-3 border border-black/10 px-3 py-3 text-sm leading-6">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-[#7a5d17]" />
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleEstimateLaunch}
                      disabled={!isTranscriptReady || isEstimateReady}
                      className="inline-flex items-center justify-between border border-black bg-black px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-neutral-200 disabled:text-neutral-500"
                    >
                      <span>{isEstimateReady ? 'Estimate calculated' : 'Calculate estimation'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <p className="text-sm leading-6 text-neutral-600">
                      The estimate stays locked until the voice log is complete so the pricing stays tied to documented field observations.
                    </p>
                  </aside>
                </div>
              </section>

              <section className="grid gap-4 border border-black/10 bg-white/[0.72] p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Step 02 / estimate engine</p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Tabulated cost breakdown</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suppliers.map((supplier) => (
                      <button
                        key={supplier.id}
                        type="button"
                        onClick={() => setConfig((current) => ({ ...current, supplierId: supplier.id }))}
                        disabled={!isEstimateReady}
                        className={`border px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors ${
                          config.supplierId === supplier.id
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-white text-neutral-600 hover:border-black/25 hover:text-black'
                        } disabled:cursor-not-allowed disabled:opacity-45`}
                      >
                        {supplier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="overflow-hidden border border-black/10 bg-white">
                    <div className="grid grid-cols-[1.6fr_1fr_0.65fr] gap-3 border-b border-black/10 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-500">
                      <span>Scope line</span>
                      <span>Basis</span>
                      <span className="text-right">Cost</span>
                    </div>

                    {estimate.lineItems.map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-[1.6fr_1fr_0.65fr] gap-3 border-b border-black/10 px-4 py-4 text-sm last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">{item.kind}</p>
                        </div>
                        <p className="leading-6 text-neutral-600">{item.scope}</p>
                        <p className="text-right font-medium">{isEstimateReady ? formatCurrency(item.amount) : 'Locked'}</p>
                      </div>
                    ))}

                    <div className="border-t border-black/10 bg-[#f8f4ec] px-4 py-4">
                      {[
                        ['Direct cost subtotal', estimate.directCost],
                        [`GC fee (${Math.round(estimate.supplier.markupRate * 100)}%)`, estimate.gcFee],
                        [`Contingency (${Math.round(estimate.contingencyRate * 100)}%)`, estimate.contingency],
                        ['Expedite allowance', estimate.expediteFee],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between py-1 text-sm">
                          <span className="text-neutral-600">{label}</span>
                          <span className="font-medium">{isEstimateReady ? formatCurrency(Number(value)) : 'Locked'}</span>
                        </div>
                      ))}
                      <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Current total</span>
                        <span className="text-2xl font-medium tracking-[-0.05em]">
                          {isEstimateReady ? formatCurrency(estimate.total) : 'Calculate first'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <aside className="grid gap-4">
                    <div className="border border-black/10 bg-[#111111] p-4 text-white">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/[0.5]">Estimate posture</p>
                        <BadgeDollarSign className="h-4 w-4 text-[#d4af37]" />
                      </div>
                      <p className="mt-4 text-lg font-medium tracking-[-0.04em]">{estimate.supplier.supplier}</p>
                      <p className="mt-2 text-sm leading-6 text-white/[0.72]">{estimate.supplier.note}</p>
                      <div className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/[0.55]">Lead time</span>
                          <span>{estimate.supplier.leadTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/[0.55]">Client mode</span>
                          <span>{client.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/[0.55]">Delivery</span>
                          <span>{delivery.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-black/10 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Live delivery preview</p>
                        <Layers2 className="h-4 w-4 text-neutral-500" />
                      </div>
                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-neutral-700">
                        {isEstimateReady
                          ? createDeliveryPreview(config.clientId, config.deliveryId, estimate.total)
                          : 'Delivery preview appears when the estimate is active.'}
                      </p>
                    </div>
                  </aside>
                </div>
              </section>
            </div>

            <AnimatePresence initial={false}>
              <motion.aside
                key={isEstimateReady ? 'chat-open' : 'chat-closed'}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4"
              >
                <section className="grid min-h-[420px] gap-4 border border-black/10 bg-[#111111] p-4 text-white sm:p-5">
                  <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/[0.5]">Step 03 / AI refinement</p>
                      <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Estimator copilot</h2>
                    </div>
                    <Bot className="h-5 w-5 text-[#d4af37]" />
                  </div>

                  {!isEstimateReady ? (
                    <div className="flex min-h-[320px] items-center justify-center border border-dashed border-white/12 px-6 text-center text-sm leading-6 text-white/[0.55]">
                      The AI chat stays hidden until the estimate is calculated, then it can answer questions and revise the numbers live.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {promptChips.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handlePresetPrompt(prompt)}
                            className="border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-xs leading-5 text-white/[0.82] transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>

                      <div className="grid min-h-[280px] content-start gap-3 overflow-hidden border border-white/10 bg-black/[0.18] p-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`max-w-[92%] border px-4 py-3 text-sm leading-6 ${
                              message.role === 'assistant'
                                ? 'border-white/10 bg-white/[0.06] text-white'
                                : 'ml-auto border-[#d4af37]/20 bg-[#d4af37]/12 text-white'
                            }`}
                          >
                            {message.content}
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleMessageSubmit();
                        }}
                        className="grid gap-3"
                      >
                        <textarea
                          value={messageInput}
                          onChange={(event) => setMessageInput(event.target.value)}
                          rows={4}
                          placeholder="Ask the AI to change supplier strategy, communication mode, timeline, or contingency..."
                          className="w-full resize-none border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-white/[0.35] focus:border-white/30"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-between border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                        >
                          <span>Apply live revision</span>
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </>
                  )}
                </section>

                <section className="grid gap-4 border border-black/10 bg-white/[0.72] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Versioning</p>
                      <h3 className="mt-2 text-xl font-medium tracking-[-0.05em]">Generated estimate paths</h3>
                    </div>
                    <WandSparkles className="h-4 w-4 text-neutral-500" />
                  </div>

                  <div className="grid gap-3">
                    {isEstimateReady && totalVersions > 0 ? (
                      versions.map((version) => (
                        <button
                          key={version.id}
                          type="button"
                          onClick={() => handleVersionRestore(version)}
                          className="grid gap-3 border border-black/10 bg-white px-4 py-4 text-left transition-colors hover:bg-[#f8f4ec]"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium">{version.label}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">{version.supplierLabel}</p>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(version.total)}</span>
                          </div>
                          <p className="text-sm leading-6 text-neutral-600">{version.note}</p>
                          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                            <span>{version.clientLabel}</span>
                            <ChevronRight className="h-3 w-3" />
                            <span>{version.deliveryLabel}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="border border-dashed border-black/10 bg-white px-4 py-8 text-sm leading-6 text-neutral-500">
                        New supplier and client-facing versions appear here after the AI makes live changes.
                      </div>
                    )}
                  </div>
                </section>
              </motion.aside>
            </AnimatePresence>
          </section>
        </div>
      </main>
    </>
  );
}
