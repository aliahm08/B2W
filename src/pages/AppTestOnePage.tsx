import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
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
  Clock3,
  FileText,
  Layers2,
  Mail,
  Mic,
  Phone,
  Send,
  SlidersHorizontal,
  WandSparkles,
  Workflow,
} from 'lucide-react';
import Seo from '../components/Seo';
import FieldBossIcon from '../components/uyghur-eats/FieldBossIcon';

type AppSection = 'overview' | 'capture' | 'estimate' | 'scenarios' | 'delivery' | 'activity';
type WalkthroughId = 'rowhouse' | 'retail' | 'office';
type SupplierId = 'balanced' | 'value' | 'premium';
type ClientId = 'owner' | 'developer' | 'property';
type DeliveryId = 'email' | 'sms' | 'proposal';
type CostKind = 'material' | 'labor' | 'permit' | 'equipment';

type Contact = {
  id: string;
  name: string;
  role: string;
  preferred: DeliveryId;
  value: string;
};

type SeedLineItem = {
  id: string;
  label: string;
  scope: string;
  kind: CostKind;
  amount: number;
};

type DraftLineItem = SeedLineItem & {
  included: boolean;
};

type Walkthrough = {
  id: WalkthroughId;
  clientName: string;
  title: string;
  site: string;
  summary: string;
  transcript: string;
  extracted: string[];
  contacts: Contact[];
  defaults: {
    clientId: ClientId;
    deliveryId: DeliveryId;
  };
  lineItems: SeedLineItem[];
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

type ActivityEntry = {
  id: string;
  title: string;
  detail: string;
  stamp: string;
};

type AssistantResult = {
  nextConfig: EstimateConfig;
  didChange: boolean;
  response: string;
  action: 'none' | 'generate-scenarios' | 'send-delivery';
};

const appSections: Array<{ id: AppSection; label: string; blurb: string }> = [
  { id: 'capture', label: 'Workspace', blurb: 'Capture, bid, edit' },
  { id: 'scenarios', label: 'Versions', blurb: 'Alternates' },
  { id: 'delivery', label: 'Send', blurb: 'Client output' },
  { id: 'activity', label: 'Log', blurb: 'Recent actions' },
];

const mockAssets = ['Photos', 'Measurements', 'Vendor notes', 'Permit memo'] as const;

const walkthroughs: Walkthrough[] = [
  {
    id: 'rowhouse',
    clientName: 'Grayson Residence',
    title: 'Capitol Hill rowhouse repair + finish refresh',
    site: 'Washington, DC / 2,400 SF / occupied residence',
    summary: 'Water intrusion at the rear parapet, two damaged windows, and interior patch-and-paint at the stair hall.',
    transcript:
      'Walkthrough log. Rear parapet is leaking into the top-floor landing. We need roughly four-hundred twenty square feet of roof patching, new flashing at the brick return, drywall repair and paint at the stair landing, and two replacement windows on the rear elevation. Client wants a proposal tonight, prefers email, and asked for both a value option and a sharper premium option.',
    extracted: ['420 SF roof repair', 'rear parapet flashing', 'drywall + paint touch-up', '2 replacement windows', 'email delivery'],
    contacts: [
      { id: 'rowhouse-owner', name: 'Amelia Grayson', role: 'Owner', preferred: 'email', value: 'amelia@graysonhome.com' },
      { id: 'rowhouse-manager', name: 'Nate Crew', role: 'Site contact', preferred: 'sms', value: '(202) 555-0192' },
    ],
    defaults: {
      clientId: 'owner',
      deliveryId: 'email',
    },
    lineItems: [
      { id: 'roof-patch', label: 'Roof membrane patch package', scope: '420 SF repair zone', kind: 'material', amount: 5800 },
      { id: 'flashing', label: 'Parapet flashing and sealants', scope: 'rear return + coping reset', kind: 'material', amount: 3200 },
      { id: 'windows', label: 'Window replacements', scope: '2 rear-elevation units', kind: 'material', amount: 4100 },
      { id: 'drywall-paint', label: 'Interior drywall and paint repair', scope: 'stair landing + top-floor hall', kind: 'labor', amount: 3600 },
      { id: 'roof-labor', label: 'Carpentry + roofing labor', scope: '2-day field crew', kind: 'labor', amount: 6400 },
      { id: 'lift-hauloff', label: 'Lift, protection, haul-off', scope: 'access + disposal', kind: 'equipment', amount: 1750 },
      { id: 'permit-closeout', label: 'Permit + closeout', scope: 'basic permit processing', kind: 'permit', amount: 950 },
    ],
  },
  {
    id: 'retail',
    clientName: 'Avenue Retail Partners',
    title: 'Tysons retail vanilla-shell buildout',
    site: 'Tysons, VA / 1,800 SF / landlord delivery',
    summary: 'Demising wall closure, ADA restroom, flooring, storefront patching, and MEP coordination for permit pricing.',
    transcript:
      'Walkthrough log. This is an eighteen-hundred square foot vanilla-shell retail space. Scope includes closing one demising wall opening, adding an ADA restroom package, polishing the storefront patch, floating and finishing the slab for LVT, and rough coordination for mechanical and electrical tie-ins. Landlord rep wants a formal proposal PDF for internal review by tomorrow morning.',
    extracted: ['demising wall closure', 'ADA restroom package', 'LVT floor prep', 'storefront patch', 'proposal PDF'],
    contacts: [
      { id: 'retail-dev', name: 'Maya Chen', role: 'Development manager', preferred: 'proposal', value: 'maya@avenueretail.com' },
      { id: 'retail-pm', name: 'Luis Herrera', role: 'Project manager', preferred: 'sms', value: '(703) 555-0164' },
    ],
    defaults: {
      clientId: 'developer',
      deliveryId: 'proposal',
    },
    lineItems: [
      { id: 'framing-board', label: 'Metal framing + board closure', scope: 'demising wall and backing', kind: 'material', amount: 6900 },
      { id: 'restroom-fixtures', label: 'ADA restroom fixture package', scope: 'toilet, lavatory, accessories', kind: 'material', amount: 8400 },
      { id: 'storefront-patch', label: 'Storefront patch and finish prep', scope: 'header, infill, skim finish', kind: 'labor', amount: 4300 },
      { id: 'slab-prep', label: 'Floor leveling and LVT prep', scope: 'full slab prep', kind: 'labor', amount: 5200 },
      { id: 'mep-coordination', label: 'Mechanical + electrical rough coordination', scope: 'allowance for field coordination', kind: 'labor', amount: 4700 },
      { id: 'logistics', label: 'Dumpsters, protection, logistics', scope: 'shell buildout support', kind: 'equipment', amount: 2200 },
      { id: 'permit-drawing', label: 'Permit drawing allowance', scope: 'submission package support', kind: 'permit', amount: 1800 },
    ],
  },
  {
    id: 'office',
    clientName: '17th Street Property Group',
    title: 'Dupont office re-stack and conference build',
    site: 'Washington, DC / 3,200 SF / active office floor',
    summary: 'Two conference rooms, glass fronts, open ceiling cleanup, phased work after hours, and property-manager communication.',
    transcript:
      'Walkthrough log. Existing office needs a re-stack with two new conference rooms, front glass systems, open-ceiling cleanup, acoustic treatments, and after-hours work because the tenant is still in place. Developer team wants one fast-track scenario and one standard scenario. Their PM prefers a concise text update first, then a polished PDF summary for approval.',
    extracted: ['2 conference rooms', 'glass fronts', 'open ceiling cleanup', 'after-hours phasing', 'SMS + PDF delivery'],
    contacts: [
      { id: 'office-pm', name: 'Jordan Mills', role: 'Property manager', preferred: 'sms', value: '(202) 555-0106' },
      { id: 'office-owner', name: 'Reed Alvarez', role: 'Asset manager', preferred: 'proposal', value: 'reed@17streetpg.com' },
    ],
    defaults: {
      clientId: 'property',
      deliveryId: 'sms',
    },
    lineItems: [
      { id: 'conference-rooms', label: 'Framing, insulation, and drywall', scope: '2 conference rooms', kind: 'material', amount: 9800 },
      { id: 'glass-fronts', label: 'Glass front package', scope: 'doors, sidelites, hardware', kind: 'material', amount: 12800 },
      { id: 'ceiling-cleanup', label: 'Ceiling cleanup and acoustic work', scope: 'open ceiling zones', kind: 'labor', amount: 6100 },
      { id: 'paint-touchup', label: 'Painting and finish touch-up', scope: 'conference interiors + circulation', kind: 'labor', amount: 3200 },
      { id: 'after-hours-labor', label: 'After-hours field labor', scope: 'phased occupancy work', kind: 'labor', amount: 7600 },
      { id: 'temporary-protection', label: 'Temporary protection and lift access', scope: 'occupied-floor logistics', kind: 'equipment', amount: 2400 },
      { id: 'permit-inspection', label: 'Permit and inspection allowance', scope: 'tenant improvement filing', kind: 'permit', amount: 2100 },
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
    note: 'Baseline B2W recommendation balancing margin protection and close speed.',
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
    note: 'Lower material spend and slower fulfillment for price-sensitive bids.',
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
  { id: 'owner', label: 'Owner', stance: 'Needs reassurance, clean allowances, and obvious next steps.' },
  { id: 'developer', label: 'Developer', stance: 'Wants clear scope logic, alternates, and formal decision framing.' },
  { id: 'property', label: 'Property manager', stance: 'Prioritizes disruption control, speed, and tenant coordination.' },
];

const deliveryModes: DeliveryMode[] = [
  { id: 'email', label: 'Email', description: 'Detailed written recap with assumptions and alternates.' },
  { id: 'sms', label: 'SMS update', description: 'Short operational summary first, with a formal estimate to follow.' },
  { id: 'proposal', label: 'Proposal PDF', description: 'Polished client-facing summary formatted like a presentation-ready estimate.' },
];

const quickPromptChips = [
  'Make this more value engineered.',
  'Switch to premium suppliers and expedite.',
  'Generate alternate versions for all suppliers.',
  'Send this to the client as a proposal PDF.',
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

function createLineDrafts(walkthrough: Walkthrough) {
  return walkthrough.lineItems.map((item) => ({
    ...item,
    included: true,
  }));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function createStamp() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildEstimate(lineDrafts: DraftLineItem[], config: EstimateConfig) {
  const supplier = getSupplier(config.supplierId);
  const contingencyRate = config.contingencyRate ?? supplier.contingencyRate;

  const lineItems = lineDrafts
    .filter((item) => item.included)
    .map((item) => {
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

  const materialCost = lineItems.filter((item) => item.kind === 'material').reduce((sum, item) => sum + item.amount, 0);
  const laborCost = lineItems.filter((item) => item.kind === 'labor').reduce((sum, item) => sum + item.amount, 0);
  const permitCost = lineItems.filter((item) => item.kind === 'permit').reduce((sum, item) => sum + item.amount, 0);
  const equipmentCost = lineItems.filter((item) => item.kind === 'equipment').reduce((sum, item) => sum + item.amount, 0);

  return {
    lineItems,
    directCost,
    gcFee,
    contingency,
    contingencyRate,
    expediteFee,
    total,
    materialCost,
    laborCost,
    permitCost,
    equipmentCost,
    supplier,
  };
}

function createAssistantResponse(message: string, currentConfig: EstimateConfig): AssistantResult {
  const text = message.toLowerCase();
  const nextConfig: EstimateConfig = { ...currentConfig };
  const changes: string[] = [];
  const notes: string[] = [];
  let action: AssistantResult['action'] = 'none';

  if (text.includes('value') || text.includes('budget') || text.includes('cheaper')) {
    if (nextConfig.supplierId !== 'value') {
      nextConfig.supplierId = 'value';
      changes.push('shifted the estimate to the value-engineered supplier path');
    }
    if (nextConfig.expedite) {
      nextConfig.expedite = false;
      changes.push('removed the rush schedule premium');
    }
  }

  if (text.includes('premium') || text.includes('fast-track') || text.includes('faster')) {
    if (nextConfig.supplierId !== 'premium') {
      nextConfig.supplierId = 'premium';
      changes.push('switched material pricing to the premium fast-track vendors');
    }
  }

  if (text.includes('balanced') || text.includes('standard')) {
    if (nextConfig.supplierId !== 'balanced') {
      nextConfig.supplierId = 'balanced';
      changes.push('returned the estimate to the balanced sourcing mode');
    }
  }

  if (text.includes('expedite') || text.includes('rush')) {
    if (!nextConfig.expedite) {
      nextConfig.expedite = true;
      changes.push('added an expedited execution allowance');
    }
  }

  if (text.includes('remove expedite') || text.includes('normal timeline')) {
    if (nextConfig.expedite) {
      nextConfig.expedite = false;
      changes.push('removed the rush schedule premium');
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

  if (text.includes('property manager') || text.includes('tenant') || text.includes('building team')) {
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

  if (text.includes('alternate') || text.includes('scenario') || text.includes('compare') || text.includes('version')) {
    action = 'generate-scenarios';
    notes.push('I can spin up multiple supplier and communication versions from the current estimate state.');
  }

  if (text.includes('send') || text.includes('share') || text.includes('deliver')) {
    action = 'send-delivery';
    notes.push('I can queue a mock send using the current contact and delivery mode.');
  }

  if (text.includes('lead time') || text.includes('schedule')) {
    notes.push(`Current supplier lead time is ${getSupplier(nextConfig.supplierId).leadTime}.`);
  }

  if (text.includes('why') && text.includes('contingency')) {
    notes.push('Contingency is covering field uncertainty, patch conditions, and coordination risk pulled from the walkthrough notes.');
  }

  const didChange = JSON.stringify(nextConfig) !== JSON.stringify(currentConfig);

  if (!didChange && notes.length === 0) {
    notes.push('I can revise supplier strategy, delivery format, client framing, rush schedule, or generate alternate versions live from here.');
  }

  const summary = changes.length > 0 ? `Updated live: ${changes.join(', ')}.` : 'No pricing inputs changed.';

  return {
    nextConfig,
    didChange,
    response: [summary, ...notes].join(' '),
    action,
  };
}

function createDeliveryPreview(
  walkthrough: Walkthrough,
  clientId: ClientId,
  deliveryId: DeliveryId,
  total: number,
  note: string,
  contact: Contact,
) {
  const client = getClientProfile(clientId);
  const noteBlock = note.trim() ? `\n\nExtra note: ${note.trim()}` : '';

  if (deliveryId === 'sms') {
    return `To: ${contact.name}\n\nQuick update for ${walkthrough.clientName}: current working estimate is ${formatCurrency(total)}. Main drivers are labor coordination, supplier path, and scope protection. Formal line-item detail can follow next.${noteBlock}`;
  }

  if (deliveryId === 'proposal') {
    return `Proposal cover note\n\nClient: ${walkthrough.clientName}\nAudience: ${client.label}\nCurrent project budget: ${formatCurrency(total)}\nDelivery stance: ${client.stance}\nFormat: formal proposal PDF with assumptions, alternates, and execution tempo.${noteBlock}`;
  }

  return `Subject: ${walkthrough.clientName} estimate recap\n\nHi ${contact.name},\n\nWe have a current working budget of ${formatCurrency(total)} for the scoped work at ${walkthrough.site}. I attached the line-item estimate, called out supplier assumptions, and highlighted the main cost drivers for ${client.label.toLowerCase()} review.${noteBlock}`;
}

function createVersionSnapshot(
  walkthrough: Walkthrough,
  lineDrafts: DraftLineItem[],
  label: string,
  config: EstimateConfig,
  note: string,
  idSeed: number,
): VersionSnapshot {
  const estimate = buildEstimate(lineDrafts, config);
  const supplier = getSupplier(config.supplierId);
  const client = getClientProfile(config.clientId);
  const delivery = getDeliveryMode(config.deliveryId);

  return {
    id: `version-${idSeed}`,
    label,
    supplierLabel: supplier.label,
    clientLabel: client.label,
    deliveryLabel: delivery.label,
    total: estimate.total,
    note,
    config,
  };
}

export default function AppTestOnePage() {
  const [activeSection, setActiveSection] = useState<AppSection>('capture');
  const [selectedWalkthroughId, setSelectedWalkthroughId] = useState<WalkthroughId>('rowhouse');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);
  const [transcriptVisibleCount, setTranscriptVisibleCount] = useState(0);
  const [transcriptDraft, setTranscriptDraft] = useState(walkthroughs[0].transcript);
  const [selectedFacts, setSelectedFacts] = useState<string[]>(walkthroughs[0].extracted);
  const [uploadedAssets, setUploadedAssets] = useState<string[]>(['Photos']);
  const [isEstimateReady, setIsEstimateReady] = useState(false);
  const [lineDrafts, setLineDrafts] = useState<DraftLineItem[]>(() => createLineDrafts(walkthroughs[0]));
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [selectedContactId, setSelectedContactId] = useState(walkthroughs[0].contacts[0].id);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [allowanceLabel, setAllowanceLabel] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('1200');
  const [toast, setToast] = useState<string | null>(null);

  const versionCounterRef = useRef(1);
  const activityCounterRef = useRef(1);

  const walkthrough = getWalkthrough(selectedWalkthroughId);

  const [config, setConfig] = useState<EstimateConfig>({
    supplierId: 'balanced',
    clientId: walkthroughs[0].defaults.clientId,
    deliveryId: walkthroughs[0].defaults.deliveryId,
    expedite: false,
    contingencyRate: null,
  });

  const selectedContact =
    walkthrough.contacts.find((contact) => contact.id === selectedContactId) ?? walkthrough.contacts[0];
  const estimate = useMemo(() => buildEstimate(lineDrafts, config), [lineDrafts, config]);
  const transcriptVisibleText = transcriptDraft.slice(0, transcriptVisibleCount);
  const captureReady = isTranscriptReady && transcriptDraft.trim().length > 40;
  const estimateUnlocked = captureReady && selectedFacts.length >= 3;
  const workflowProgress = [captureReady, isEstimateReady, versions.length > 0].filter(Boolean).length;

  const supplierComparisons = useMemo(
    () =>
      suppliers.map((supplier) => ({
        id: supplier.id,
        label: supplier.label,
        leadTime: supplier.leadTime,
        total: buildEstimate(lineDrafts, { ...config, supplierId: supplier.id }).total,
      })),
    [config, lineDrafts],
  );

  const deliveryPreview = createDeliveryPreview(
    walkthrough,
    config.clientId,
    config.deliveryId,
    estimate.total,
    deliveryNote,
    selectedContact,
  );

  function pushActivity(title: string, detail: string) {
    setActivity((current) => [
      {
        id: `activity-${activityCounterRef.current}`,
        title,
        detail,
        stamp: createStamp(),
      },
      ...current,
    ].slice(0, 18));
    activityCounterRef.current += 1;
  }

  function showToast(message: string) {
    setToast(message);
  }

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    setConfig({
      supplierId: 'balanced',
      clientId: walkthrough.defaults.clientId,
      deliveryId: walkthrough.defaults.deliveryId,
      expedite: false,
      contingencyRate: null,
    });
    setLineDrafts(createLineDrafts(walkthrough));
    setSelectedFacts(walkthrough.extracted);
    setTranscriptDraft(walkthrough.transcript);
    setUploadedAssets(['Photos']);
    setSelectedContactId(walkthrough.contacts[0].id);
    setIsTranscribing(false);
    setIsTranscriptReady(false);
    setTranscriptVisibleCount(0);
    setIsEstimateReady(false);
    setVersions([]);
    setDeliveryNote('');
    setAllowanceLabel('');
    setAllowanceAmount('1200');
    setMessages([
      {
        id: 'assistant-welcome',
        role: 'assistant',
        content:
          'Mock copilot is live. I will update app state directly without calling a real model. Ask for supplier swaps, delivery changes, contingency edits, or alternate versions.',
      },
    ]);
    setActivity([
      {
        id: 'activity-seed',
        title: 'Job loaded',
        detail: `Opened ${walkthrough.title} for ${walkthrough.clientName}.`,
        stamp: createStamp(),
      },
    ]);
    versionCounterRef.current = 1;
    activityCounterRef.current = 2;
  }, [selectedWalkthroughId, walkthrough]);

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
    }, 18);

    return () => window.clearInterval(intervalId);
  }, [isTranscriptReady, walkthrough.transcript]);

  function pushVersion(version: VersionSnapshot) {
    setVersions((current) => [version, ...current].slice(0, 8));
    versionCounterRef.current += 1;
  }

  function handleTranscribe() {
    setActiveSection('capture');
    setIsTranscribing(true);
    setIsTranscriptReady(false);
    setTranscriptVisibleCount(0);

    window.setTimeout(() => {
      setIsTranscribing(false);
      setIsTranscriptReady(true);
      pushActivity('Walkthrough transcribed', `Mock voice transcript created for ${walkthrough.clientName}.`);
      showToast('Walkthrough transcript ready');
    }, 1200);
  }

  function handleSaveTranscriptEdits() {
    setTranscriptVisibleCount(transcriptDraft.length);
    pushActivity('Transcript updated', 'Field notes were edited and saved into the estimate workspace.');
    showToast('Transcript edits saved');
  }

  function handleFactToggle(fact: string) {
    setSelectedFacts((current) =>
      current.includes(fact) ? current.filter((item) => item !== fact) : [...current, fact],
    );
  }

  function handleAssetToggle(asset: string) {
    setUploadedAssets((current) =>
      current.includes(asset) ? current.filter((item) => item !== asset) : [...current, asset],
    );
  }

  function handleEstimateLaunch() {
    if (!estimateUnlocked) {
      showToast('Finish the walkthrough first');
      return;
    }

    setIsEstimateReady(true);
    setActiveSection('estimate');
    pushActivity('Estimate activated', 'The cost engine is now unlocked and fully editable.');
    showToast('Estimate workspace unlocked');

    if (versions.length === 0) {
      pushVersion(
        createVersionSnapshot(
          walkthrough,
          lineDrafts,
          'Baseline estimate',
          config,
          'Derived directly from the walkthrough log.',
          versionCounterRef.current,
        ),
      );
    }
  }

  function updateLine(lineId: string, updater: (line: DraftLineItem) => DraftLineItem) {
    setLineDrafts((current) => current.map((line) => (line.id === lineId ? updater(line) : line)));
  }

  function handleAddAllowance() {
    const amount = Number(allowanceAmount);
    if (!allowanceLabel.trim() || !Number.isFinite(amount) || amount <= 0) {
      showToast('Add a label and amount first');
      return;
    }

    setLineDrafts((current) => [
      ...current,
      {
        id: `allowance-${Date.now()}`,
        label: allowanceLabel.trim(),
        scope: 'Manual allowance',
        kind: 'material',
        amount,
        included: true,
      },
    ]);
    setAllowanceLabel('');
    setAllowanceAmount('1200');
    pushActivity('Allowance added', `Added ${formatCurrency(amount)} for ${allowanceLabel.trim()}.`);
    showToast('Allowance added');
  }

  function handleGenerateScenarioSet(source = 'Generated alternate supplier scenarios from the current estimate.') {
    const nextVersions = [
      createVersionSnapshot(
        walkthrough,
        lineDrafts,
        'Value path',
        { ...config, supplierId: 'value', expedite: false, deliveryId: 'email' },
        'Lower-cost sourcing for price-sensitive review.',
        versionCounterRef.current,
      ),
      createVersionSnapshot(
        walkthrough,
        lineDrafts,
        'Balanced path',
        { ...config, supplierId: 'balanced' },
        'Baseline B2W recommendation.',
        versionCounterRef.current + 1,
      ),
      createVersionSnapshot(
        walkthrough,
        lineDrafts,
        'Premium fast-track',
        { ...config, supplierId: 'premium', expedite: true, deliveryId: 'proposal' },
        'Speed-focused version with premium vendor coverage.',
        versionCounterRef.current + 2,
      ),
    ];

    setVersions((current) => [...nextVersions, ...current].slice(0, 8));
    versionCounterRef.current += nextVersions.length;
    setActiveSection('scenarios');
    pushActivity('Scenario set generated', source);
    showToast('Created three alternate versions');
  }

  function handleRestoreVersion(version: VersionSnapshot) {
    setConfig(version.config);
    setActiveSection('estimate');
    pushActivity('Version restored', `Loaded ${version.label.toLowerCase()} back into the live estimate.`);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-restore-${version.id}`,
        role: 'assistant',
        content: `Restored ${version.label.toLowerCase()} so you can continue editing from that scenario.`,
      },
    ]);
  }

  function handleQueueDraft() {
    pushActivity(
      'Draft queued',
      `Prepared a ${getDeliveryMode(config.deliveryId).label.toLowerCase()} draft for ${selectedContact.name}.`,
    );
    showToast('Draft queued');
  }

  function handleMockSend(source = 'Manual send from delivery workspace.') {
    pushActivity(
      'Mock delivery sent',
      `${getDeliveryMode(config.deliveryId).label} sent to ${selectedContact.name} via ${selectedContact.value}. ${source}`,
    );
    setActiveSection('delivery');
    showToast('Mock send complete');
  }

  function handleCreateFollowUpTask() {
    pushActivity('Follow-up task created', `Created a next-step reminder for ${selectedContact.name}.`);
    showToast('Follow-up created');
  }

  function handleMessageSubmit(forcedMessage?: string) {
    const nextMessage = (forcedMessage ?? messageInput).trim();

    if (!nextMessage) {
      return;
    }

    if (!isEstimateReady) {
      setMessages((current) => [
        ...current,
        { id: `user-${Date.now()}`, role: 'user', content: nextMessage },
        {
          id: `assistant-blocked-${Date.now()}`,
          role: 'assistant',
          content: 'Run the walkthrough and activate the estimate first. After that I can manipulate every part of the mock app live.',
        },
      ]);
      setMessageInput('');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: nextMessage,
    };

    const result = createAssistantResponse(nextMessage, config);

    startTransition(() => {
      setMessages((current) => [
        ...current,
        userMessage,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.response,
        },
      ]);

      if (result.didChange) {
        setConfig(result.nextConfig);
        pushVersion(
          createVersionSnapshot(
            walkthrough,
            lineDrafts,
            `Version ${versionCounterRef.current}`,
            result.nextConfig,
            nextMessage,
            versionCounterRef.current,
          ),
        );
        pushActivity('Estimate revised by copilot', nextMessage);
      }

      if (result.action === 'generate-scenarios') {
        handleGenerateScenarioSet('Generated from mock copilot request.');
      }

      if (result.action === 'send-delivery') {
        handleMockSend('Triggered from mock copilot.');
      }
    });

    setMessageInput('');
  }

  function renderOverview() {
    return (
      <section className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            ['Workflow progress', `${workflowProgress}/3`, 'Capture, estimate, versions'],
            ['Included scope lines', `${estimate.lineItems.length}`, 'Live estimate basis'],
            ['Versions generated', `${versions.length}`, 'Alternate bid paths'],
            ['Client-ready total', isEstimateReady ? formatCurrency(estimate.total) : 'Locked', 'Current live estimate'],
          ].map(([label, value, detail]) => (
            <div key={label} className="border border-black/10 bg-white/[0.72] p-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{label}</p>
              <p className="mt-4 text-3xl font-medium tracking-[-0.06em]">{value}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
          <div className="grid gap-4 border border-black/10 bg-white/[0.72] p-5">
            <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Operations board</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">{walkthrough.clientName}</h2>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Live workspace</p>
                <p className="mt-2 text-sm text-neutral-700">{walkthrough.site}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="border border-black/10 bg-[#f8f4ec] p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Open issues</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.04em]">Parapet leak, window replacement, finish repair</p>
              </div>
              <div className="border border-black/10 bg-[#f8f4ec] p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Current owner</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.04em]">{selectedContact.name}</p>
              </div>
              <div className="border border-black/10 bg-[#f8f4ec] p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Delivery lane</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.04em]">{getDeliveryMode(config.deliveryId).label}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {([
                ['Walkthrough workspace', () => setActiveSection('capture')],
                ['Open estimate', handleEstimateLaunch],
                ['Build alternates', () => handleGenerateScenarioSet('Generated from the operations board.')],
                ['Open delivery', () => setActiveSection('delivery')],
              ] as Array<[string, () => void]>).map(([label, onClick]) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick as () => void}
                  className="flex items-center justify-between border border-black/10 bg-white px-4 py-4 text-sm font-medium transition-colors hover:bg-[#f8f4ec]"
                >
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {supplierComparisons.map((comparison) => (
                <button
                  key={comparison.id}
                  type="button"
                  onClick={() => {
                    setConfig((current) => ({ ...current, supplierId: comparison.id }));
                    setActiveSection('estimate');
                  }}
                  className={`border px-4 py-4 text-left transition-colors ${
                    config.supplierId === comparison.id
                      ? 'border-black bg-black text-white'
                      : 'border-black/10 bg-white hover:bg-[#f8f4ec]'
                  }`}
                >
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] opacity-60">{comparison.label}</p>
                  <p className="mt-3 text-lg font-medium tracking-[-0.04em]">{formatCurrency(comparison.total)}</p>
                  <p className="mt-2 text-sm opacity-75">Lead time {comparison.leadTime}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-black/10 bg-[#111111] p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/[0.55]">Readiness</p>
                <Workflow className="h-4 w-4 text-[#d4af37]" />
              </div>
              <div className="mt-4 space-y-3">
                {([
                  ['Walkthrough captured', captureReady],
                  ['Estimate activated', isEstimateReady],
                  ['Alternates generated', versions.length > 0],
                  ['Client draft available', isEstimateReady && deliveryPreview.length > 0],
                ] as Array<[string, boolean]>).map(([label, done]) => (
                  <div key={label} className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-3 py-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-[#d4af37]' : 'bg-white/20'}`} />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-black/10 bg-white/[0.72] p-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Selected facts</p>
              <div className="mt-4 grid gap-2">
                {selectedFacts.map((fact) => (
                  <div key={fact} className="flex items-start gap-3 border border-black/10 px-3 py-3 text-sm leading-6">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#7a5d17]" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderCapture() {
    return (
      <section className="grid gap-3 border border-white/10 bg-[#08131b]/92 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/45">FieldBoss applet</p>
            <h2 className="mt-2 text-[1.15rem] font-medium tracking-[-0.05em] text-white">Voice intake</h2>
          </div>
          <button
            type="button"
            onClick={handleTranscribe}
            className="inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-50 transition-colors hover:bg-cyan-300/15"
          >
            {isTranscribing ? <AudioLines className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isTranscribing ? 'Listening' : 'Run log'}
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3 border border-white/10 bg-[#0b1720] p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{walkthrough.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{walkthrough.site}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {walkthroughs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedWalkthroughId(item.id)}
                    className={`border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
                      item.id === selectedWalkthroughId
                        ? 'border-cyan-300/30 bg-cyan-300/12 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-h-[180px] border border-white/10 bg-[#061017] p-4">
              {isTranscribing ? (
                <div className="flex min-h-[132px] items-center justify-center gap-2">
                  {[22, 38, 18, 44, 26, 34, 20].map((height, index) => (
                    <motion.span
                      key={`${height}-${index}`}
                      className="w-2 bg-cyan-200"
                      animate={{ height: [height * 0.5, height, height * 0.65] }}
                      transition={{ duration: 0.8 + index * 0.06, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ height }}
                    />
                  ))}
                </div>
              ) : isTranscriptReady ? (
                <div className="grid gap-3">
                  <p className="text-sm leading-7 text-slate-100">
                    {transcriptVisibleText}
                    {transcriptVisibleCount < transcriptDraft.length ? (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-200 align-middle" />
                    ) : null}
                  </p>
                  <textarea
                    value={transcriptDraft}
                    onChange={(event) => {
                      setTranscriptDraft(event.target.value);
                      setTranscriptVisibleCount(event.target.value.length);
                    }}
                    rows={5}
                    className="w-full resize-none border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/25"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveTranscriptEdits}
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-200 transition-colors hover:border-cyan-300/25 hover:bg-cyan-300/10"
                    >
                      Save log
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[132px] items-center justify-center border border-dashed border-white/10 bg-white/[0.02] px-6 text-center text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                  Voice log idle
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="border border-white/10 bg-[#0b1720] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">Scope</p>
                <ClipboardList className="h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-3 grid gap-2">
                {walkthrough.extracted.map((fact) => {
                  const selected = selectedFacts.includes(fact);
                  return (
                    <button
                      key={fact}
                      type="button"
                      onClick={() => handleFactToggle(fact)}
                      className={`flex items-center gap-3 border px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? 'border-cyan-300/25 bg-cyan-300/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${selected ? 'bg-[#d4af37]' : 'bg-slate-600'}`} />
                      <span>{fact}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-white/10 bg-[#0b1720] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">Assets</p>
                <FileText className="h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mockAssets.map((asset) => {
                  const uploaded = uploadedAssets.includes(asset);
                  return (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => handleAssetToggle(asset)}
                      className={`border px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] transition-colors ${
                        uploaded
                          ? 'border-[#d4af37]/25 bg-[#d4af37]/10 text-[#f3d57f]'
                          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white'
                      }`}
                    >
                      {asset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderEstimate() {
    return (
      <section className="grid gap-3 border border-white/10 bg-[#08131b]/92 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/45">Estimator</p>
            <h2 className="mt-2 text-[1.15rem] font-medium tracking-[-0.05em] text-white">Bid table</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEstimateLaunch}
              disabled={!estimateUnlocked}
              className="inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-50 transition-colors hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-slate-500"
            >
              <BadgeDollarSign className="h-4 w-4" />
              {isEstimateReady ? 'Live' : 'Unlock'}
            </button>
            <button
              type="button"
              onClick={() => handleGenerateScenarioSet('Generated from estimate header.')}
              disabled={!isEstimateReady}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-200 transition-colors hover:border-cyan-300/25 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              <Layers2 className="h-4 w-4" />
              Alt set
            </button>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_286px]">
          <div className="grid gap-3">
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_110px]">
              <div className="grid gap-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Supplier</p>
                <div className="flex flex-wrap gap-2">
                  {suppliers.map((supplier) => (
                    <button
                      key={supplier.id}
                      type="button"
                      onClick={() => setConfig((current) => ({ ...current, supplierId: supplier.id }))}
                      disabled={!isEstimateReady}
                      className={`border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors ${
                        config.supplierId === supplier.id
                          ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                      } disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      {supplier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Client</p>
                <div className="flex flex-wrap gap-2">
                  {clientProfiles.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => setConfig((current) => ({ ...current, clientId: client.id }))}
                      disabled={!isEstimateReady}
                      className={`border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors ${
                        config.clientId === client.id
                          ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                      } disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      {client.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Send</p>
                <div className="flex flex-wrap gap-2">
                  {deliveryModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setConfig((current) => ({ ...current, deliveryId: mode.id }))}
                      disabled={!isEstimateReady}
                      className={`border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors ${
                        config.deliveryId === mode.id
                          ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                      } disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Tempo</p>
                <button
                  type="button"
                  onClick={() => setConfig((current) => ({ ...current, expedite: !current.expedite }))}
                  disabled={!isEstimateReady}
                  className={`border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors ${
                    config.expedite
                      ? 'border-[#d4af37]/30 bg-[#d4af37]/10 text-[#f3d57f]'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                  } disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {config.expedite ? 'Rush' : 'Std'}
                </button>
              </div>
            </div>

            <div className="overflow-hidden border border-white/10 bg-[#0b1720]">
              <div className="grid grid-cols-[36px_minmax(0,1.5fr)_minmax(0,1fr)_130px] gap-3 border-b border-white/10 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                <span>On</span>
                <span>Line</span>
                <span>Basis</span>
                <span className="text-right">Cost</span>
              </div>

              {lineDrafts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[36px_minmax(0,1.5fr)_minmax(0,1fr)_130px] gap-3 border-b border-white/10 px-4 py-3 text-sm text-slate-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => updateLine(item.id, (line) => ({ ...line, included: !line.included }))}
                    className={`mt-1 flex h-5 w-5 items-center justify-center border ${
                      item.included
                        ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-50'
                        : 'border-white/10 bg-white/[0.03] text-slate-500'
                    }`}
                  >
                    {item.included ? <Check className="h-3 w-3" /> : null}
                  </button>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.label}</p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">{item.kind}</p>
                  </div>

                  <p className="truncate text-slate-400">{item.scope}</p>

                  <input
                    type="number"
                    value={item.amount}
                    onChange={(event) =>
                      updateLine(item.id, (line) => ({
                        ...line,
                        amount: Number(event.target.value) > 0 ? Number(event.target.value) : line.amount,
                      }))
                    }
                    className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-right text-white outline-none focus:border-cyan-300/25"
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px_100px]">
              <input
                type="text"
                value={allowanceLabel}
                onChange={(event) => setAllowanceLabel(event.target.value)}
                placeholder="Manual line"
                className="border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/25"
              />
              <input
                type="number"
                value={allowanceAmount}
                onChange={(event) => setAllowanceAmount(event.target.value)}
                className="border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/25"
              />
              <button
                type="button"
                onClick={handleAddAllowance}
                className="inline-flex items-center justify-center border border-white/10 bg-white/[0.04] px-4 py-3 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-200 transition-colors hover:border-cyan-300/25 hover:bg-cyan-300/10"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="border border-white/10 bg-[#0b1720] p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">Live total</p>
                <BadgeDollarSign className="h-4 w-4 text-[#d4af37]" />
              </div>
              <p className="mt-4 text-3xl font-medium tracking-[-0.06em]">{isEstimateReady ? formatCurrency(estimate.total) : 'Locked'}</p>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                {[
                  ['Direct', estimate.directCost],
                  ['GC', estimate.gcFee],
                  ['Cont', estimate.contingency],
                  ['Rush', estimate.expediteFee],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-slate-400">{label}</span>
                    <span>{formatCurrency(value as number)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-[#0b1720] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">Modes</p>
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-3 grid gap-2">
                {supplierComparisons.map((comparison) => (
                  <button
                    key={comparison.id}
                    type="button"
                    onClick={() => setConfig((current) => ({ ...current, supplierId: comparison.id }))}
                    disabled={!isEstimateReady}
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 border px-3 py-3 text-left transition-colors ${
                      config.supplierId === comparison.id
                        ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10'
                    } disabled:cursor-not-allowed disabled:opacity-45`}
                  >
                    <div>
                      <p className="text-sm font-medium">{comparison.label}</p>
                      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">{comparison.leadTime}</p>
                    </div>
                    <span className="text-sm">{formatCurrency(comparison.total)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderScenarios() {
    return (
      <section className="grid gap-4">
        <div className="grid gap-4 border border-black/10 bg-white/[0.72] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Step 03 / scenario lab</p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Alternate versions and supplier comparisons</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleGenerateScenarioSet('Generated from the scenario lab control panel.')}
                className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <WandSparkles className="h-4 w-4" />
                Generate 3-path set
              </button>
              <button
                type="button"
                onClick={() => {
                  const ownerVersion = createVersionSnapshot(
                    walkthrough,
                    lineDrafts,
                    'Owner email version',
                    { ...config, clientId: 'owner', deliveryId: 'email' },
                    'Simplified owner-facing version.',
                    versionCounterRef.current,
                  );
                  pushVersion(ownerVersion);
                  pushActivity('Owner version generated', 'Created an owner-facing email variant.');
                }}
                className="border border-black/10 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-[#f8f4ec]"
              >
                Owner version
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-3">
              {versions.length > 0 ? (
                versions.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => handleRestoreVersion(version)}
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
                <div className="border border-dashed border-black/10 bg-white px-4 py-10 text-sm leading-6 text-neutral-500">
                  Generate alternate supplier and communication versions from the current estimate to populate this comparison workspace.
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="border border-black/10 bg-[#111111] p-4 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/[0.55]">Supplier compare</p>
                  <Workflow className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="mt-4 space-y-3">
                  {supplierComparisons.map((comparison) => (
                    <div key={comparison.id} className="border border-white/10 bg-white/[0.04] px-3 py-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{comparison.label}</span>
                        <span>{formatCurrency(comparison.total)}</span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/[0.5]">Lead time {comparison.leadTime}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-black/10 bg-white p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Version notes</p>
                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Every scenario here is clickable and restorable. This lets you test the full bid workflow without live AI, while keeping the UI and interaction model production-like.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderDelivery() {
    return (
      <section className="grid gap-4">
        <div className="grid gap-4 border border-black/10 bg-white/[0.72] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Step 04 / client delivery</p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Communication and mock send controls</h2>
            </div>
            <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-3 text-sm">
              <Clock3 className="h-4 w-4 text-neutral-500" />
              No live API, stateful mock only
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="grid gap-4">
              <div className="border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Contacts</p>
                  <Building2 className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="mt-4 grid gap-2">
                  {walkthrough.contacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setSelectedContactId(contact.id)}
                      className={`border px-3 py-3 text-left transition-colors ${
                        selectedContact.id === contact.id
                          ? 'border-black bg-black text-white'
                          : 'border-black/10 bg-white hover:bg-[#f8f4ec]'
                      }`}
                    >
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-70">{contact.role}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Channel</p>
                  {config.deliveryId === 'sms' ? <Phone className="h-4 w-4 text-neutral-500" /> : <Mail className="h-4 w-4 text-neutral-500" />}
                </div>
                <div className="mt-4 grid gap-2">
                  {deliveryModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setConfig((current) => ({ ...current, deliveryId: mode.id }))}
                      className={`border px-3 py-3 text-left text-sm transition-colors ${
                        config.deliveryId === mode.id
                          ? 'border-black bg-black text-white'
                          : 'border-black/10 bg-white hover:bg-[#f8f4ec]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Delivery preview</p>
                  <FileText className="h-4 w-4 text-neutral-500" />
                </div>
                <textarea
                  value={deliveryPreview}
                  readOnly
                  rows={12}
                  className="mt-4 w-full resize-none border border-black/10 bg-[#f8f4ec] px-4 py-3 text-sm leading-6 text-neutral-800 outline-none"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                <textarea
                  value={deliveryNote}
                  onChange={(event) => setDeliveryNote(event.target.value)}
                  rows={4}
                  placeholder="Add an extra note for the client draft..."
                  className="w-full resize-none border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25"
                />
                <button
                  type="button"
                  onClick={handleQueueDraft}
                  className="inline-flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-[#f8f4ec]"
                >
                  <span>Queue draft</span>
                  <Clock3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMockSend()}
                  className="inline-flex items-center justify-between border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  <span>Send mock</span>
                  <Send className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCreateFollowUpTask}
                  className="inline-flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-[#f8f4ec]"
                >
                  <span>Follow-up</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderActivity() {
    return (
      <section className="grid gap-4">
        <div className="grid gap-4 border border-black/10 bg-white/[0.72] p-5">
          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Audit trail</p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em]">Every action in the mock app</h2>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Entries</p>
              <p className="mt-2 text-sm text-neutral-700">{activity.length}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {activity.map((entry) => (
              <div key={entry.id} className="grid gap-2 border border-black/10 bg-white px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)]">
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">{entry.stamp}</div>
                <div>
                  <p className="text-sm font-medium">{entry.title}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderCopilotPanel() {
    return (
      <section className="grid gap-3 border border-white/10 bg-[#08131b] p-4 text-white sm:p-5">
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/45">Command line</p>
            <h2 className="mt-2 text-[1.15rem] font-medium tracking-[-0.05em]">Estimator edits</h2>
          </div>
          <Bot className="h-5 w-5 text-[#d4af37]" />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPromptChips.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setMessageInput(prompt);
                handleMessageSubmit(prompt);
              }}
              className="border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-slate-200 transition-colors hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="grid min-h-[220px] content-start gap-2 overflow-hidden border border-white/10 bg-black/[0.18] p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`border px-3 py-3 text-sm leading-6 ${
                message.role === 'assistant'
                  ? 'border-white/10 bg-white/[0.04] text-white'
                  : 'border-cyan-300/20 bg-cyan-300/10 text-cyan-50'
              }`}
            >
              <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">
                {message.role === 'assistant' ? 'FieldBoss' : 'Command'}
              </p>
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
            rows={3}
            placeholder="value path / premium rush / send as pdf"
            className="w-full resize-none border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-white/[0.35] focus:border-cyan-300/25"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-between border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-50 transition-colors hover:bg-cyan-300/15"
          >
            <span>Run command</span>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    );
  }

  function renderAiWorkspace() {
    return (
      <section className="grid gap-4">
        {renderCapture()}
        {renderEstimate()}
        {isEstimateReady ? renderCopilotPanel() : null}
      </section>
    );
  }

  function renderMainSection() {
    if (activeSection === 'capture' || activeSection === 'estimate' || activeSection === 'overview') {
      return renderAiWorkspace();
    }

    if (activeSection === 'scenarios') {
      return renderScenarios();
    }

    if (activeSection === 'delivery') {
      return renderDelivery();
    }

    if (activeSection === 'activity') {
      return renderActivity();
    }

    return renderOverview();
  }

  return (
    <>
      <Seo
        title="FieldBoss SaaS App Prototype"
        description="A fully clickable Swiss-style B2W SaaS prototype for contractor estimating, walkthrough intake, versions, client delivery, and mocked AI state changes."
        robots="noindex, nofollow"
      />

      <main className="min-h-screen overflow-hidden bg-[#061017] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 12% 14%, rgba(93,197,255,0.11), transparent 28%), radial-gradient(circle at 84% 12%, rgba(241,196,91,0.08), transparent 24%), linear-gradient(180deg, #061017 0%, #07131b 52%, #061017 100%)',
          }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-[1680px] flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <section className="grid flex-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="grid content-start gap-3 border border-white/10 bg-[#08131b] p-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                  <FieldBossIcon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/45">FieldBoss</p>
                  <p className="truncate text-sm font-medium text-white">{walkthrough.clientName}</p>
                </div>
              </div>

              {appSections.map((section) => {
                const isActive =
                  section.id === 'capture'
                    ? activeSection === 'capture' || activeSection === 'estimate' || activeSection === 'overview'
                    : activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`grid gap-1 border px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-cyan-300/30 bg-cyan-300/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-200 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{section.label}</span>
                    <span className={`text-xs ${isActive ? 'text-cyan-100/70' : 'text-slate-500'}`}>{section.blurb}</span>
                  </button>
                );
              })}

              <div className="grid gap-2 border-t border-white/10 pt-3">
                {walkthroughs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedWalkthroughId(item.id);
                      setActiveSection('capture');
                    }}
                    className={`border px-3 py-3 text-left transition-colors ${
                      item.id === selectedWalkthroughId
                        ? 'border-[#d4af37]/25 bg-[#d4af37]/10 text-[#f3d57f]'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white'
                    }`}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em]">{item.id}</p>
                    <p className="mt-2 text-sm font-medium">{item.clientName}</p>
                  </button>
                ))}
              </div>

              <div className="grid gap-2 border-t border-white/10 pt-3">
                {[
                  ['Total', isEstimateReady ? formatCurrency(estimate.total) : 'Locked'],
                  ['Mode', estimate.supplier.label],
                  ['Lead', estimate.supplier.leadTime],
                  ['Send', getDeliveryMode(config.deliveryId).label],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="grid content-start gap-4">
              <header className="grid gap-3 border border-white/10 bg-[#08131b]/92 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/45">Estimator session</p>
                  <h1 className="mt-2 text-[clamp(1.4rem,2.6vw,2.6rem)] font-medium leading-[0.95] tracking-[-0.07em] text-white">
                    {walkthrough.title}
                  </h1>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{walkthrough.site}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ['Capture', captureReady ? 'Ready' : 'Idle'],
                    ['Bid', isEstimateReady ? 'Live' : 'Locked'],
                    ['Alt', `${versions.length}`],
                  ].map(([label, value]) => (
                    <div key={label} className="border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <p className="mt-2 text-lg font-medium tracking-[-0.05em]">{value}</p>
                    </div>
                  ))}
                </div>
              </header>

              <div className="grid gap-4">{renderMainSection()}</div>
            </div>
          </section>
        </div>

        <AnimatePresence>
          {toast ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="fixed bottom-5 right-5 border border-cyan-300/30 bg-[#08131b] px-4 py-3 text-sm text-cyan-50 shadow-[0_20px_40px_rgba(0,0,0,0.28)]"
            >
              {toast}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </>
  );
}
