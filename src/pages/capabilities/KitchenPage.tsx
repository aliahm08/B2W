import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ClipboardList, Database, Layers3, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  buildKitchenSolution,
  buildKitchenSolutionFromPreset,
  kitchenInformationOptions,
  kitchenIntegrationOptions,
  kitchenPresets,
  kitchenProductionOptions,
  type KitchenOption,
  type KitchenSelection,
} from '../../content/kitchen';

const defaultSelection: KitchenSelection = {
  informationIds: [],
  integrationIds: [],
  productionIds: [],
};

type StepId = 1 | 2 | 3;

type StepConfig = {
  id: StepId;
  title: string;
  subheader: string;
  field: keyof KitchenSelection;
  options: KitchenOption[];
};

const stepConfigs: StepConfig[] = [
  {
    id: 1,
    title: 'Information',
    subheader: 'Choose the business materials, records, and source inputs we should start from.',
    field: 'informationIds',
    options: kitchenInformationOptions,
  },
  {
    id: 2,
    title: 'Integration',
    subheader: 'Choose the live systems, channels, and signals we should connect into the work.',
    field: 'integrationIds',
    options: kitchenIntegrationOptions,
  },
  {
    id: 3,
    title: 'Production',
    subheader: 'Choose the outputs, execution layers, and deliverables B2W should actually produce.',
    field: 'productionIds',
    options: kitchenProductionOptions,
  },
];

const stepIcons = {
  1: Database,
  2: Layers3,
  3: Settings2,
} satisfies Record<StepId, typeof Database>;

export default function KitchenPage() {
  const [selection, setSelection] = useState<KitchenSelection>(defaultSelection);
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string | null>(kitchenPresets[0]?.slug ?? null);
  const [activeStep, setActiveStep] = useState<StepId>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedPreset = selectedPresetSlug ? buildKitchenSolutionFromPreset(selectedPresetSlug) : null;
  const customSolution = useMemo(() => buildKitchenSolution(selection), [selection]);
  const activeSolution = mode === 'custom' ? customSolution : selectedPreset;
  const selectedItems = useMemo(
    () => ({
      information: kitchenInformationOptions.filter((option) => selection.informationIds.includes(option.id)),
      integration: kitchenIntegrationOptions.filter((option) => selection.integrationIds.includes(option.id)),
      production: kitchenProductionOptions.filter((option) => selection.productionIds.includes(option.id)),
    }),
    [selection],
  );

  const customIsReady =
    selection.informationIds.length > 0 &&
    selection.integrationIds.length > 0 &&
    selection.productionIds.length > 0;

  function selectPreset(slug: string) {
    setMode('preset');
    setSelectedPresetSlug(slug);
  }

  function startCustomBuilder() {
    setMode('custom');
    setSelectedPresetSlug(null);
    if (
      selection.informationIds.length === 0 &&
      selection.integrationIds.length === 0 &&
      selection.productionIds.length === 0
    ) {
      setSelection({
        informationIds: [kitchenInformationOptions[0].id],
        integrationIds: [],
        productionIds: [],
      });
    }
    setActiveStep(1);
  }

  function toggleSelection(field: keyof KitchenSelection, id: string) {
    setMode('custom');
    setSelectedPresetSlug(null);
    setSelection((current) => {
      const values = current[field];
      const nextValues = values.includes(id) ? values.filter((item) => item !== id) : [...values, id];

      return {
        ...current,
        [field]: nextValues,
      };
    });
  }

  function jumpToNextStep(stepId: StepId) {
    if (stepId === 2 && selection.informationIds.length === 0) {
      return;
    }

    if (stepId === 3 && (selection.informationIds.length === 0 || selection.integrationIds.length === 0)) {
      return;
    }

    setActiveStep(stepId);
  }

  return (
    <article className="min-h-screen bg-[#f6f1e8] pb-28 pt-24 text-black">
      <Seo />

      <section className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-8 border-b border-black/10 pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
        >
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Project Builder</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
              Explore B2W proposals the way you would build an order.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-700 md:text-2xl">
              This page is our proposal menu and intake form. Start from a proven sample proposal or build your own
              combination of information, integrations, and production layers to preview the kind of project B2W can deliver.
            </p>
          </div>

          <aside className="border border-black bg-black p-6 text-white md:p-7">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">How It Works</p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-300">
              <p>1. Choose a sample proposal or open the custom builder.</p>
              <p>2. If you build your own, select any combination of ingredients across the three sections.</p>
              <p>3. Preview the mock deliverable immediately.</p>
              <p>4. If the preview feels right, submit your information from the deliverable page and schedule a call.</p>
            </div>
          </aside>
        </motion.div>

        <section className="py-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Sample Proposals</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-neutral-950">Start with a ready-made scope or build your own.</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {kitchenPresets.map((preset) => {
              const isSelected = mode === 'preset' && selectedPresetSlug === preset.slug;

              return (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => selectPreset(preset.slug)}
                  className={`border p-5 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-[0_16px_48px_rgba(0,0,0,0.16)]'
                      : 'border-black/10 bg-white text-neutral-900 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className={`text-[11px] font-mono uppercase tracking-[0.22em] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {preset.title}
                    </p>
                    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-600'}`}>{preset.roughEstimate}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight">{preset.solutionName}</h3>
                  <p className={`mt-3 text-sm leading-6 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>{preset.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                      {isSelected ? 'Selected' : 'Choose proposal'}
                      <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </span>
                    <Link
                      to={preset.subpagePath}
                      onClick={(event) => event.stopPropagation()}
                      className={`text-sm underline underline-offset-4 ${isSelected ? 'text-neutral-200' : 'text-neutral-500 hover:text-black'}`}
                    >
                      Learn more
                    </Link>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={startCustomBuilder}
              className={`border p-5 text-left transition-all duration-200 ${
                mode === 'custom'
                  ? 'border-[#0f766e] bg-[#0f766e] text-white shadow-[0_16px_48px_rgba(15,118,110,0.18)]'
                  : 'border-dashed border-black/20 bg-[#fffaf0] text-neutral-900 hover:border-black'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className={`text-[11px] font-mono uppercase tracking-[0.22em] ${mode === 'custom' ? 'text-emerald-100' : 'text-neutral-500'}`}>
                  Custom
                </p>
                <span className={`text-sm font-medium ${mode === 'custom' ? 'text-white' : 'text-neutral-600'}`}>
                  {customIsReady ? customSolution.roughEstimate : 'Variable'}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">Build Your Own Project</h3>
              <p className={`mt-3 text-sm leading-6 ${mode === 'custom' ? 'text-emerald-50' : 'text-neutral-600'}`}>
                Assemble your own proposal from the menu and preview the resulting deliverable before you send us your information.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                {mode === 'custom' ? 'Builder open' : 'Open builder'}
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </section>

        {mode === 'custom' ? (
          <section className="grid gap-8 border-t border-black/10 py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div>
              <div className="sticky top-24 z-20 mb-6 border border-black/10 bg-[#f6f1e8]/95 p-3 backdrop-blur">
                <div className="grid gap-3 md:grid-cols-3">
                  {stepConfigs.map((step) => {
                    const selectedCount = selection[step.field].length;
                    const isActive = activeStep === step.id;
                    const isLocked =
                      (step.id === 2 && selection.informationIds.length === 0) ||
                      (step.id === 3 &&
                        (selection.informationIds.length === 0 || selection.integrationIds.length === 0));
                    const Icon = stepIcons[step.id];

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => jumpToNextStep(step.id)}
                        className={`flex items-center justify-between gap-4 border px-4 py-4 text-left transition-colors ${
                          isActive
                            ? 'border-black bg-black text-white'
                            : isLocked
                              ? 'border-black/10 bg-neutral-200 text-neutral-400'
                              : 'border-black/10 bg-white text-neutral-900 hover:border-black'
                        }`}
                      >
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.22em] opacity-70">Step {step.id}</p>
                          <p className="mt-2 text-lg font-medium">{step.title}</p>
                          <p className={`mt-1 text-xs ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>{selectedCount} selected</p>
                        </div>
                        <Icon className="h-5 w-5 shrink-0 opacity-70" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                {stepConfigs.map((step) => {
                  const isCurrent = activeStep === step.id;

                  return (
                    <section
                      key={step.id}
                      className={`scroll-mt-28 ${isCurrent ? 'block' : 'hidden lg:block'}`}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Step {step.id}</p>
                          <h3 className="mt-3 text-3xl font-medium tracking-tight text-neutral-950">{step.title}</h3>
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{step.subheader}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {step.options.map((option) => {
                          const isSelected = selection[step.field].includes(option.id);
                          const baseClasses = isSelected ? 'border-black' : 'border-black/10';

                          if (step.id === 1) {
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection(step.field, option.id)}
                                className={`${baseClasses} bg-white p-5 text-left transition-colors hover:border-black`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Information</p>
                                    <h4 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">{option.title}</h4>
                                  </div>
                                  <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center border ${isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'}`}>
                                    <Check className="h-4 w-4" />
                                  </span>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-neutral-600">{option.description}</p>
                                <p className="mt-4 text-xs leading-5 text-neutral-500">{option.detail}</p>
                              </button>
                            );
                          }

                          if (step.id === 2) {
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection(step.field, option.id)}
                                className={`${baseClasses} bg-[#fdfcf8] p-5 text-left transition-colors hover:border-black`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Integration</p>
                                    <h4 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">{option.title}</h4>
                                  </div>
                                  <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border ${isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'}`}>
                                    <Check className="h-4 w-4" />
                                  </span>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-neutral-600">{option.description}</p>
                                <p className="mt-5 inline-flex border border-black/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                                  Connected system
                                </p>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleSelection(step.field, option.id)}
                              className={`${baseClasses} bg-neutral-950 p-5 text-left text-white transition-colors hover:border-white/60`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Production</p>
                                  <h4 className="mt-3 text-2xl font-medium tracking-tight">{option.title}</h4>
                                </div>
                                <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center border ${isSelected ? 'border-white bg-white text-black' : 'border-white/20 text-transparent'}`}>
                                  <Check className="h-4 w-4" />
                                </span>
                              </div>
                              <p className="mt-4 text-sm leading-6 text-neutral-300">{option.description}</p>
                              <p className="mt-4 text-xs leading-5 text-neutral-400">{option.detail}</p>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="border border-black bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5" />
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Your Selection</p>
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-neutral-950">
                  {customIsReady ? customSolution.name : 'Custom B2W Proposal'}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {customIsReady
                    ? customSolution.summary
                    : 'Build out each step to generate a scoping-ready proposal and deliverable preview.'}
                </p>
                <div className="mt-5 border-t border-black/10 pt-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Rough Estimate</p>
                  <p className="mt-2 text-3xl font-medium tracking-tight text-neutral-950">
                    {customIsReady ? customSolution.roughEstimate : 'In progress'}
                  </p>
                </div>

                {stepConfigs.map((step) => {
                  const items = selectedItems[step.field.replace('Ids', '') as 'information' | 'integration' | 'production'];
                  return (
                    <div key={step.id} className="mt-5">
                      <p className="text-sm font-medium text-neutral-900">{step.title}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <span key={item.id} className="border border-black/10 bg-neutral-50 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-neutral-700">
                              {item.shortTitle}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-neutral-500">Nothing selected yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <Link
                  to={customIsReady ? customSolution.previewPath : '#'}
                  onClick={(event) => {
                    if (!customIsReady) {
                      event.preventDefault();
                    }
                  }}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${
                    customIsReady
                      ? 'border border-black bg-black text-white hover:bg-neutral-800'
                      : 'cursor-not-allowed border border-black/10 bg-neutral-200 text-neutral-500'
                  }`}
                >
                  Preview project delivery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </section>
        ) : null}

        {mode === 'preset' && activeSolution ? (
          <section className="border-t border-black/10 py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="border border-black/10 bg-white p-6 md:p-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Selected Proposal</p>
                <h2 className="mt-4 text-4xl font-medium tracking-tight text-neutral-950">{activeSolution.name}</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">{activeSolution.summary}</p>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {[
                    ['Information', activeSolution.information],
                    ['Integration', activeSolution.integration],
                    ['Production', activeSolution.production],
                  ].map(([label, items]) => (
                    <div key={label} className="border border-black/10 bg-neutral-50 p-4">
                      <p className="text-sm font-medium text-neutral-900">{label}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(items as typeof activeSolution.information).map((item) => (
                          <span key={item.id} className="border border-black/10 bg-white px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-neutral-700">
                            {item.shortTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="border border-black bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.08)] lg:sticky lg:top-28">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Proposal Snapshot</p>
                <p className="mt-4 text-3xl font-medium tracking-tight text-neutral-950">{activeSolution.roughEstimate}</p>
                <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-600">
                  {activeSolution.deliverables.slice(0, 3).map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
                <Link
                  to={activeSolution.previewPath}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Preview project delivery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            </div>
          </section>
        ) : null}
      </section>
    </article>
  );
}
