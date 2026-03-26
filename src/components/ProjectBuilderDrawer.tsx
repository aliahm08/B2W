import { type FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, Send, X } from 'lucide-react';
import {
  getRankedProjectAreas,
  homeTestCapabilities,
  homeTestExpertise,
  type HomeTestCapabilityId,
  type HomeTestExpertiseId,
} from '../content/homeTestTwo';
import { getSourceMetadata, submitInternalForm } from '../lib/engagement';

type ProjectTypeId = 'basic-advisory' | 'consulting' | 'implementation' | 'custom-tool';
type CapabilityCollectionMode = 'manual' | 'digital';
type BuilderScreenId = 'selection' | 'preview' | 'acceptance';

type BusinessDetails = {
  businessName: string;
  businessType: string;
  website: string;
  email: string;
  arr: string;
};

type AcceptanceDetails = {
  fullName: string;
  email: string;
  acceptedTerms: boolean;
};

const lanePricing: Record<HomeTestExpertiseId, { multiplier: number; label: string }> = {
  growth: { multiplier: 2, label: '2x lane multiplier' },
  optimization: { multiplier: 2, label: '2x lane multiplier' },
  diligence: { multiplier: 3, label: '3x lane multiplier' },
};

const expertiseSelectionStyles: Record<HomeTestExpertiseId, { selectedCard: string; selectedBadge: string; selectedCheck: string }> = {
  growth: {
    selectedCard: 'border-emerald-500 bg-emerald-50',
    selectedBadge: 'text-emerald-800',
    selectedCheck: 'border-emerald-600 bg-emerald-600 text-white',
  },
  optimization: {
    selectedCard: 'border-sky-500 bg-sky-50',
    selectedBadge: 'text-sky-800',
    selectedCheck: 'border-sky-600 bg-sky-600 text-white',
  },
  diligence: {
    selectedCard: 'border-amber-500 bg-amber-50',
    selectedBadge: 'text-amber-800',
    selectedCheck: 'border-amber-600 bg-amber-600 text-white',
  },
};

const projectTypes: Array<{ id: ProjectTypeId; title: string; summary: string; price: number | null; priceLabel: string }> = [
  {
    id: 'basic-advisory',
    title: 'Basic Advisory',
    summary: 'A lighter advisory structure for clear direction, prioritization, and scoped recommendations.',
    price: 1000,
    priceLabel: '$1,000 tier',
  },
  {
    id: 'consulting',
    title: 'Consulting',
    summary: 'Hands-on guidance with a deeper working cadence across the selected lanes.',
    price: 2200,
    priceLabel: '$2,200 tier',
  },
  {
    id: 'implementation',
    title: 'End to End Implementation',
    summary: 'Full execution support across planning, build, delivery, and launch.',
    price: 5000,
    priceLabel: '$5,000 tier',
  },
  {
    id: 'custom-tool',
    title: 'Custom Tool Solution',
    summary: 'A custom software or AI system build. Final pricing requires direct scoping.',
    price: null,
    priceLabel: 'PRICE TBD',
  },
];

const timelineByProjectType: Record<Exclude<ProjectTypeId, 'custom-tool'>, { label: string; detail: string }[]> = {
  'basic-advisory': [
    { label: 'Week 1', detail: 'Business intake, lane alignment, and advisory scope confirmation.' },
    { label: 'Week 2', detail: 'Draft recommendations, proposal revisions, and working review.' },
    { label: 'Week 3', detail: 'Final advisory package, handoff, and next-step planning call.' },
  ],
  consulting: [
    { label: 'Week 1', detail: 'Kickoff, operating context capture, and lane-by-lane workplan.' },
    { label: 'Week 2', detail: 'Active consulting workstream across the selected lanes.' },
    { label: 'Week 3', detail: 'Review, refinements, and updated scope based on findings.' },
    { label: 'Week 4', detail: 'Delivery handoff and contract-ready next phase.' },
  ],
  implementation: [
    { label: 'Week 1', detail: 'Discovery, requirements, and implementation plan signoff.' },
    { label: 'Week 2', detail: 'System design, operational mapping, and first build sprint.' },
    { label: 'Week 3', detail: 'Execution, testing, and stakeholder review.' },
    { label: 'Week 4', detail: 'Launch prep, rollout alignment, and transition into delivery cadence.' },
  ],
};

function toggleStringValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function getDiscountedPrice(value: number) {
  return Math.round(value * 0.2);
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

type ProjectBuilderDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectBuilderDrawer({ isOpen, onClose }: ProjectBuilderDrawerProps) {
  const signature = useSignaturePad(isOpen);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: '',
    businessType: '',
    website: '',
    email: '',
    arr: '',
  });
  const [selectedCapabilityIds, setSelectedCapabilityIds] = useState<HomeTestCapabilityId[]>([]);
  const [capabilityModes, setCapabilityModes] = useState<Partial<Record<HomeTestCapabilityId, CapabilityCollectionMode>>>({});
  const [selectedExpertiseIds, setSelectedExpertiseIds] = useState<HomeTestExpertiseId[]>([]);
  const [selectedProjectTypeId, setSelectedProjectTypeId] = useState<ProjectTypeId | null>(null);
  const [openSectionId, setOpenSectionId] = useState('business');
  const [currentScreen, setCurrentScreen] = useState<BuilderScreenId>('selection');
  const [acceptanceDetails, setAcceptanceDetails] = useState<AcceptanceDetails>({
    fullName: '',
    email: '',
    acceptedTerms: false,
  });
  const [submitError, setSubmitError] = useState('');
  const [submitWarning, setSubmitWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function resetBuilder() {
    setBusinessDetails({
      businessName: '',
      businessType: '',
      website: '',
      email: '',
      arr: '',
    });
    setSelectedCapabilityIds([]);
    setCapabilityModes({});
    setSelectedExpertiseIds([]);
    setSelectedProjectTypeId(null);
    setOpenSectionId('business');
    setCurrentScreen('selection');
    setAcceptanceDetails({
      fullName: '',
      email: '',
      acceptedTerms: false,
    });
    setSubmitError('');
    setSubmitWarning('');
    setIsSubmitting(false);
    setHasSubmitted(false);
    signature.clearSignature();
  }

  const rankedProjectAreas = useMemo(
    () => getRankedProjectAreas(selectedCapabilityIds, selectedExpertiseIds),
    [selectedCapabilityIds, selectedExpertiseIds],
  );
  const selectedCapabilities = homeTestCapabilities.filter((item) => selectedCapabilityIds.includes(item.id));
  const selectedExpertise = homeTestExpertise.filter((item) => selectedExpertiseIds.includes(item.id));
  const selectedProjectType = projectTypes.find((item) => item.id === selectedProjectTypeId) ?? null;
  const recommendedProjectAreas = rankedProjectAreas.slice(0, 2);
  const missingCapabilityCount = homeTestCapabilities.length - selectedCapabilityIds.length;
  const manualCapabilityCount = selectedCapabilityIds.filter((id) => (capabilityModes[id] ?? 'digital') === 'manual').length;
  const missingDataFee = missingCapabilityCount * 500;
  const digitizationFee = manualCapabilityCount * 500;
  const canConfirmSelections = selectedCapabilityIds.length > 0 && selectedExpertiseIds.length > 0 && Boolean(selectedProjectTypeId);
  const laneMultiplier = selectedExpertiseIds.reduce((total, id) => total * lanePricing[id].multiplier, 1);
  const estimatedMonthlyPrice = selectedProjectType?.price ? laneMultiplier * selectedProjectType.price + missingDataFee + digitizationFee : null;
  const discountedMonthlyPrice = estimatedMonthlyPrice ? getDiscountedPrice(estimatedMonthlyPrice) : null;
  const timelineItems =
    selectedProjectTypeId && selectedProjectTypeId !== 'custom-tool' ? timelineByProjectType[selectedProjectTypeId] : [];

  const proposalDeliverables = Array.from(
    new Set([
      ...selectedCapabilities.map((item) => `${item.title} workstream activated with ${capabilityModes[item.id] ?? 'digital'} tracking inputs`),
      ...selectedExpertise.map((item) => `${item.title} lane applied to the selected business materials`),
      ...(recommendedProjectAreas[0] ? [`Recommended scope shape: ${recommendedProjectAreas[0].title}`] : []),
      ...(selectedProjectType ? [`Project tier: ${selectedProjectType.title}`] : []),
    ]),
  );

  const proposalProfile = [
    `Business Tracks: ${selectedCapabilities.map((item) => `${item.title} (${capabilityModes[item.id] ?? 'digital'})`).join(', ') || 'Pending'}`,
    `Expertise Lanes: ${selectedExpertise.map((item) => item.title).join(', ') || 'Pending'}`,
    `Project Type: ${selectedProjectType?.title || 'Pending'}`,
  ];

  const previewHeadline =
    selectedProjectTypeId === 'basic-advisory'
      ? 'Business Profile Preview'
      : selectedProjectTypeId === 'consulting'
        ? 'Valuation Model Preview'
        : selectedProjectTypeId === 'implementation'
          ? 'Documentation Dashboard & CRM Preview'
          : selectedProjectTypeId === 'custom-tool'
            ? 'Custom AI Tool Preview'
            : 'Deliverable Preview';

  useEffect(() => {
    if (!isOpen) {
      setCurrentScreen('selection');
      setOpenSectionId('business');
      return;
    }

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
    if (!canConfirmSelections || !acceptanceDetails.acceptedTerms || !signature.hasSignature || !selectedProjectType) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitWarning('');

    const notes = [
      'Non-binding proposal acceptance for homepage project builder.',
      `Business Type: ${businessDetails.businessType}`,
      `Website: ${businessDetails.website}`,
      `Business Email: ${businessDetails.email || 'Not provided'}`,
      `ARR: ${businessDetails.arr || 'Not provided'}`,
      `Capabilities: ${selectedCapabilities.map((item) => `${item.title} (${capabilityModes[item.id] ?? 'digital'})`).join(', ')}`,
      `Expertise Lanes: ${selectedExpertise.map((item) => item.title).join(', ')}`,
      `Project Type: ${selectedProjectType.title}`,
      `Lane Multiplier: ${laneMultiplier}x`,
      `Missing Data Fee: ${missingDataFee ? formatCurrency(missingDataFee) : '$0'}`,
      `Digitization Fee: ${digitizationFee ? formatCurrency(digitizationFee) : '$0'}`,
      `Estimated Monthly Price: ${estimatedMonthlyPrice ? formatCurrency(estimatedMonthlyPrice) : 'Contact for pricing'}`,
      `Discounted Monthly Price: ${discountedMonthlyPrice ? formatCurrency(discountedMonthlyPrice) : 'Contact for pricing'}`,
      'Term: 3-month minimum',
      `Recommended Project Areas: ${recommendedProjectAreas.map((item) => item.title).join(', ') || 'None'}`,
      'Acknowledgment: Client understands this acceptance is not legally binding; B2W will share the contract and schedule a call.',
    ].join('\n');

    try {
      const result = await submitInternalForm('/api/proposal-signature', {
        signerName: acceptanceDetails.fullName.trim(),
        signerEmail: acceptanceDetails.email.trim(),
        company: businessDetails.businessName.trim(),
        proposalName: `${businessDetails.businessName.trim() || 'B2W'} Project Builder Proposal`,
        proposalId: selectedProjectType.id,
        selectedOptionId: selectedProjectType.id,
        selectedOptionTitle: selectedProjectType.title,
        selectedOptionPrice:
          discountedMonthlyPrice && estimatedMonthlyPrice
            ? `${formatCurrency(estimatedMonthlyPrice)}/month struck through; ${formatCurrency(discountedMonthlyPrice)}/month discounted, 3-month minimum`
            : 'Contact for pricing',
        actionTaken: 'homepage_project_builder_acceptance',
        acceptedTerms: acceptanceDetails.acceptedTerms,
        notes,
        signatureName: acceptanceDetails.fullName.trim(),
        signatureDataUrl: signature.toDataUrl(),
        companyWebsite: '',
        ...getSourceMetadata({
          sourcePage: 'B2W Homepage Project Builder',
          formType: 'homepage_project_builder_acceptance',
          actionType: 'homepage_project_builder_acceptance',
        }),
      });

      if (!result.ok) {
        throw new Error(result.error || 'Unable to submit the proposal acceptance.');
      }

      setSubmitWarning(result.warning ?? '');
      setHasSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the proposal acceptance.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function canAdvance(sectionId: string) {
    if (sectionId === 'business') return selectedCapabilityIds.length > 0;
    if (sectionId === 'needs') return selectedExpertiseIds.length > 0;
    if (sectionId === 'project-types') return Boolean(selectedProjectTypeId);
    return false;
  }

  const selectionSections = [
    {
      id: 'business',
      step: '01',
      interactionLabel: 'Business Intake',
      interactionDetail: selectedCapabilityIds.length > 0 ? 'Ready' : 'Required',
      title: 'Tell Us About Your Business',
      content: (
        <div>
          <p className="mb-3 text-base font-medium text-black">Which of the following data does your business currently track?</p>
          <p className="mb-4 text-sm leading-6 text-neutral-500">My Business Tracks:</p>
          <div className="grid gap-3 md:grid-cols-3">
            {homeTestCapabilities.map((item) => {
              const isSelected = selectedCapabilityIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedCapabilityIds((current) => {
                      const next = toggleStringValue(current, item.id);
                      setCapabilityModes((modeCurrent) => {
                        if (next.includes(item.id)) return { ...modeCurrent, [item.id]: modeCurrent[item.id] ?? 'digital' };
                        const { [item.id]: _removed, ...rest } = modeCurrent;
                        return rest;
                      });
                      return next;
                    })
                  }
                  className={`flex min-h-40 flex-col justify-between border p-4 text-left transition-colors ${isSelected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-black'}`}
                >
                  <div>
                    <p className="text-sm font-medium text-black">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
                    <div className="mt-4" onClick={(event) => event.stopPropagation()}>
                      <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Tracking Mode</p>
                      <div className="inline-flex rounded-full border border-black/10 bg-neutral-100 p-1">
                        {(['manual', 'digital'] as CapabilityCollectionMode[]).map((mode) => {
                          const isModeSelected = (capabilityModes[item.id] ?? 'digital') === mode;
                          return (
                            <button
                              key={mode}
                              type="button"
                              role="switch"
                              aria-checked={isModeSelected}
                              onClick={() => setCapabilityModes((current) => ({ ...current, [item.id]: mode }))}
                              className={`min-w-24 rounded-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${isModeSelected ? 'bg-black text-white shadow-sm' : 'bg-transparent text-neutral-600'}`}
                            >
                              {mode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <span className={`mt-6 inline-flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: 'needs',
      step: '02',
      interactionLabel: 'Selections',
      interactionDetail: selectedExpertiseIds.length > 0 ? 'Configured' : 'In progress',
      title: 'Select Expertise Lanes',
      content: (
        <div className="grid gap-3 md:grid-cols-3">
          {homeTestExpertise.map((item) => {
            const isSelected = selectedExpertiseIds.includes(item.id);
            const selectionStyle = expertiseSelectionStyles[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedExpertiseIds((current) => toggleStringValue(current, item.id))}
                className={`flex min-h-40 flex-col justify-between border p-4 text-left transition-colors ${isSelected ? selectionStyle.selectedCard : 'border-neutral-200 bg-white hover:border-black'}`}
              >
                <div>
                  <p className={`text-sm font-medium ${isSelected ? selectionStyle.selectedBadge : item.accentClassName}`}>{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
                  <p className={`mt-4 text-[11px] font-mono uppercase tracking-[0.18em] ${isSelected ? selectionStyle.selectedBadge : 'text-neutral-500'}`}>
                    {lanePricing[item.id].label}
                  </p>
                </div>
                <span className={`mt-6 inline-flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? selectionStyle.selectedCheck : 'border-black/15 text-transparent'}`}>
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: 'project-types',
      step: '03',
      interactionLabel: 'Project Type',
      interactionDetail: selectedProjectType ? selectedProjectType.title : 'Choose one',
      title: 'Choose Project Tier',
      content: (
        <div className="grid gap-4">
          <div className="grid gap-3 lg:grid-cols-4">
            {projectTypes.map((item, index) => {
              const isSelected = selectedProjectTypeId === item.id;
              const inheritedCopy = index === 0 ? 'Foundation tier' : `Includes everything in ${projectTypes[index - 1].title}`;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProjectTypeId(item.id)}
                  className={`flex min-h-64 flex-col justify-between border p-5 text-left transition-colors ${isSelected ? 'border-black bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-black'}`}
                >
                  <div>
                    <p className={`text-[11px] font-mono uppercase tracking-[0.22em] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>Tier {index + 1}</p>
                    <p className={`mt-3 text-lg font-medium ${isSelected ? 'text-white' : 'text-black'}`}>{item.title}</p>
                    <p className={`mt-3 text-sm leading-6 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>{item.summary}</p>
                    {index > 0 ? (
                      <div className={`mt-4 border p-3 ${isSelected ? 'border-white/15 bg-white/5' : 'border-black/10 bg-neutral-50'}`}>
                        <p className={`text-sm leading-6 ${isSelected ? 'text-neutral-200' : 'text-neutral-700'}`}>{inheritedCopy}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <p className={`text-[11px] font-mono uppercase tracking-[0.18em] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.priceLabel}</p>
                    <span className={`mt-4 inline-flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-white bg-white text-black' : 'border-black/15 text-transparent'}`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  const acceptanceContent = hasSubmitted ? (
    <div className="border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-sm font-medium text-emerald-900">Proposal acceptance received.</p>
      <p className="mt-3 text-sm leading-6 text-emerald-900">
        We will share the contract and schedule a call. This submission is recorded through the internal proposal workflow.
      </p>
      {submitWarning ? <p className="mt-3 text-sm leading-6 text-amber-900">{submitWarning}</p> : null}
      <div className="mt-5 border-t border-emerald-300/60 pt-5">
        <button
          type="button"
          onClick={resetBuilder}
          className="inline-flex min-h-11 items-center justify-center border border-emerald-900 bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Restart
        </button>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="grid gap-5 border border-neutral-200 bg-neutral-50 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Name</span>
          <input value={acceptanceDetails.fullName} onChange={(event) => setAcceptanceDetails((current) => ({ ...current, fullName: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Email Address</span>
          <input type="email" value={acceptanceDetails.email} onChange={(event) => setAcceptanceDetails((current) => ({ ...current, email: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Business Name</span>
          <input value={businessDetails.businessName} onChange={(event) => setBusinessDetails((current) => ({ ...current, businessName: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Website</span>
          <input value={businessDetails.website} onChange={(event) => setBusinessDetails((current) => ({ ...current, website: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Business Type</span>
          <input value={businessDetails.businessType} onChange={(event) => setBusinessDetails((current) => ({ ...current, businessType: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Business Email</span>
          <input type="email" value={businessDetails.email} onChange={(event) => setBusinessDetails((current) => ({ ...current, email: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">ARR</span>
          <input value={businessDetails.arr} onChange={(event) => setBusinessDetails((current) => ({ ...current, arr: event.target.value }))} className="min-h-12 border border-black/10 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-black" />
        </label>
      </div>

      <div className="border border-black/10 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">E-Ink Signature</p>
          <button type="button" onClick={signature.clearSignature} className="text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:text-black">
            Clear
          </button>
        </div>
        <canvas
          ref={signature.canvasRef}
          onPointerDown={signature.startDrawing}
          onPointerMove={signature.draw}
          onPointerUp={signature.stopDrawing}
          onPointerLeave={signature.stopDrawing}
          className="mt-3 h-40 w-full border border-dashed border-black/15 bg-white"
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
        <input type="checkbox" checked={acceptanceDetails.acceptedTerms} onChange={(event) => setAcceptanceDetails((current) => ({ ...current, acceptedTerms: event.target.checked }))} className="mt-1 h-4 w-4 rounded border border-black/20" />
        <span>I acknowledge that accepting this proposal is not legally binding. B2W will share a contract and schedule a call before work begins.</span>
      </label>

      {submitError ? <div className="border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">{submitError}</div> : null}

      <button
        type="submit"
        disabled={!canConfirmSelections || !acceptanceDetails.acceptedTerms || !signature.hasSignature || isSubmitting}
        className={`inline-flex min-h-12 items-center justify-center gap-2 border px-5 py-3 text-sm font-medium transition-colors ${
          canConfirmSelections && acceptanceDetails.acceptedTerms && signature.hasSignature && !isSubmitting
            ? 'border-black bg-black text-white hover:bg-neutral-800'
            : 'cursor-not-allowed border-black/10 bg-neutral-200 text-neutral-500'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Accept Proposal'}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
          <motion.aside
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto border-t border-black/10 bg-white shadow-[0_-24px_80px_rgba(0,0,0,0.18)]"
          >
            <div className="sticky top-0 z-10 border-b border-black/10 bg-white/95 px-6 py-4 backdrop-blur">
              <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto] lg:items-center">
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-black">Project Builder</h2>
                  <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-amber-700">
                    Offer: Next 3 Clients Receive 80% Off
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { id: 'selection', step: '01', title: 'Selections' },
                    { id: 'preview', step: '02', title: 'Proposal Preview' },
                    { id: 'acceptance', step: '03', title: 'Acceptance' },
                  ].map((screen) => {
                    const isActive = currentScreen === screen.id;
                    return (
                      <div
                        key={screen.id}
                        className={`border px-4 py-3 ${isActive ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-500'}`}
                      >
                        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">{screen.step}</p>
                        <p className="mt-2 text-sm font-medium">{screen.title}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 transition-colors hover:border-black" aria-label="Close project drawer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-6">
              <AnimatePresence mode="wait" initial={false}>
                {currentScreen === 'selection' ? (
                  <motion.div key="selection-screen" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="grid gap-6">
                    <div className="grid gap-3">
                      {selectionSections.map((section, index) => {
                        const isOpenSection = openSectionId === section.id;
                        const previousSection = index > 0 ? selectionSections[index - 1] : null;
                        const nextSection = index < selectionSections.length - 1 ? selectionSections[index + 1] : null;
                        return (
                          <div key={section.id} className={`border-t transition-colors ${isOpenSection ? 'border-neutral-900' : 'border-neutral-200'}`}>
                            <button type="button" onClick={() => setOpenSectionId((current) => (current === section.id ? '' : section.id))} className="flex w-full items-start gap-6 px-0 py-6 text-left" aria-expanded={isOpenSection}>
                              <div className="min-w-14 pt-1 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">{section.step}</div>
                              <div className="flex-1">
                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                  <span className={`border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] ${isOpenSection ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-500'}`}>{section.interactionLabel}</span>
                                  <span className="text-xs text-neutral-400">{section.interactionDetail}</span>
                                </div>
                                <h3 className={`text-xl font-medium tracking-tight md:text-2xl ${isOpenSection ? 'text-neutral-950' : 'text-neutral-700'}`}>{section.title}</h3>
                              </div>
                              <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${isOpenSection ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpenSection ? (
                                <motion.div key={`${section.id}-content`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="overflow-hidden">
                                  <div className="border-t border-neutral-200 py-6">
                                    {section.content}
                                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                                      <button type="button" onClick={() => previousSection && setOpenSectionId(previousSection.id)} disabled={!previousSection} className={`min-h-11 border px-4 py-2 text-sm font-medium transition-colors ${previousSection ? 'border-black/15 bg-white text-black hover:border-black' : 'cursor-not-allowed border-black/10 bg-neutral-100 text-neutral-400'}`}>
                                        Previous
                                      </button>
                                      {section.id !== 'project-types' ? (
                                        <button type="button" onClick={() => nextSection && setOpenSectionId(nextSection.id)} disabled={!nextSection || !canAdvance(section.id)} className={`min-h-11 border px-4 py-2 text-sm font-medium transition-colors ${nextSection && canAdvance(section.id) ? 'border-black bg-black text-white hover:bg-neutral-800' : 'cursor-not-allowed border-black/10 bg-neutral-100 text-neutral-400'}`}>
                                          Next
                                        </button>
                                      ) : <div />}
                                    </div>
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border border-black/10 bg-neutral-50 p-5">
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-black" />
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Selection Summary</p>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="border border-black/10 bg-white p-4">
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Business Audit</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedCapabilities.length > 0 ? selectedCapabilities.map((item) => (
                              <span key={item.id} className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700">{item.title}</span>
                            )) : <span className="text-sm text-neutral-400">Pending</span>}
                          </div>
                        </div>
                        <div className="border border-black/10 bg-white p-4">
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Expertise Lanes</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedExpertise.length > 0 ? selectedExpertise.map((item) => (
                              <span key={item.id} className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700">{item.title}</span>
                            )) : <span className="text-sm text-neutral-400">Pending</span>}
                          </div>
                        </div>
                        <div className="border border-black/10 bg-white p-4">
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Project Tier</p>
                          <div className="mt-3">
                            {selectedProjectType ? <span className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700">{selectedProjectType.title}</span> : <span className="text-sm text-neutral-400">Pending</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end border-t border-neutral-200 pt-5">
                        <button type="button" onClick={() => setCurrentScreen('preview')} disabled={!canConfirmSelections} className={`inline-flex min-h-12 items-center justify-center gap-2 border px-5 py-3 text-sm font-medium transition-colors ${canConfirmSelections ? 'border-black bg-black text-white hover:bg-neutral-800' : 'cursor-not-allowed border-black/10 bg-neutral-200 text-neutral-500'}`}>
                          Confirm Selections
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {currentScreen === 'preview' ? (
                  <motion.div key="preview-screen" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="grid gap-4">
                    <div className="border border-black/10 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-black" />
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">{previewHeadline}</p>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {proposalProfile.map((item) => (
                          <div key={item} className="border border-black/10 bg-neutral-50 p-4">
                            <p className="text-sm leading-6 text-neutral-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-black bg-black p-4 text-white">
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">Terms</p>
                      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <div>
                          <p className="text-sm leading-6 text-neutral-300">Base price starts at $1,000. Selected lanes multiply that base, project tier pricing is applied, and missing-data or digitization fees are added before the discount.</p>
                          {estimatedMonthlyPrice && discountedMonthlyPrice ? (
                            <div className="mt-5">
                              <p className="text-lg text-neutral-400 line-through">{formatCurrency(estimatedMonthlyPrice)}/month</p>
                              <p className="mt-2 text-5xl font-medium tracking-tight text-white">{formatCurrency(discountedMonthlyPrice)}/month</p>
                            </div>
                          ) : (
                            <p className="mt-5 text-3xl font-medium tracking-tight text-white">Contact for pricing</p>
                          )}
                        </div>
                        <div className="border border-white/15 bg-white/5 p-4">
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">Pricing Breakdown</p>
                          <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-200">
                            <p>Lane multiplier: {laneMultiplier}x</p>
                            <p>Project type tier: {selectedProjectType?.priceLabel ?? 'Pending'}</p>
                            <p>Missing data fee: {missingDataFee ? formatCurrency(missingDataFee) : '$0'}</p>
                            <p>Digitization fee: {digitizationFee ? formatCurrency(digitizationFee) : '$0'}</p>
                          </div>
                          <div className="mt-5 border-t border-white/15 pt-4">
                            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">Term</p>
                            <p className="mt-2 text-sm leading-6 text-neutral-200">3-month minimum</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-black/10 bg-white p-4">
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Expected Deliverables</p>
                      <div className="mt-3 grid gap-3">
                        {proposalDeliverables.map((item) => (
                          <div key={item} className="border border-black/10 bg-neutral-50 p-4">
                            <p className="text-sm leading-6 text-neutral-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {timelineItems.length > 0 ? (
                      <div className="border border-black/10 bg-neutral-50 p-4">
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Timeline</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                          {timelineItems.map((item) => (
                            <div key={item.label} className="border border-black/10 bg-white p-4">
                              <p className="text-sm font-medium text-black">{item.label}</p>
                              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                      <button type="button" onClick={() => setCurrentScreen('selection')} className="inline-flex min-h-11 items-center gap-2 border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button type="button" onClick={() => setCurrentScreen('acceptance')} className="inline-flex min-h-12 items-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                        Continue to Acceptance
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {currentScreen === 'acceptance' ? (
                  <motion.div key="acceptance-screen" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="grid gap-5">
                    {acceptanceContent}
                    {!hasSubmitted ? (
                      <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                        <button type="button" onClick={() => setCurrentScreen('preview')} className="inline-flex min-h-11 items-center gap-2 border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black">
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
