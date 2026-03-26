import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChefHat, ChevronDown, Cpu, Database, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SolutionPreviewGate from '../../components/SolutionPreviewGate';
import {
  buildKitchenSolution,
  type KitchenOption,
  type KitchenSelection,
  type KitchenSolution,
  buildKitchenSolutionFromPreset,
  kitchenInformationOptions,
  kitchenIntegrationOptions,
  kitchenPresets,
  kitchenProductionOptions,
} from '../../content/kitchen';

const defaultSelection: KitchenSelection = {
  informationIds: [kitchenInformationOptions[0].id],
  integrationIds: [kitchenIntegrationOptions[0].id],
  productionIds: [kitchenProductionOptions[0].id],
};

type StepId = 1 | 2 | 3;

type StepConfig = {
  id: StepId;
  title: string;
  subheader: string;
  icon: typeof Database;
  field: keyof KitchenSelection;
  options: KitchenOption[];
};

const stepConfigs: StepConfig[] = [
  {
    id: 1,
    title: 'Information',
    subheader: 'Select the source materials, records, and raw inputs the solution should start from.',
    icon: Database,
    field: 'informationIds',
    options: kitchenInformationOptions,
  },
  {
    id: 2,
    title: 'Integration',
    subheader: 'Select the connected signals, systems, and external context B2W should layer in next.',
    icon: Cpu,
    field: 'integrationIds',
    options: kitchenIntegrationOptions,
  },
  {
    id: 3,
    title: 'Production',
    subheader: 'Select the output types the engagement should actually produce, build, or coordinate.',
    icon: Activity,
    field: 'productionIds',
    options: kitchenProductionOptions,
  },
];

const expertiseCardAccents = [
  { accentClassName: 'text-emerald-700', borderClassName: 'border-emerald-200' },
  { accentClassName: 'text-sky-700', borderClassName: 'border-sky-200' },
  { accentClassName: 'text-amber-700', borderClassName: 'border-amber-200' },
  { accentClassName: 'text-rose-700', borderClassName: 'border-rose-200' },
];

const projectCardTones = [
  { borderClassName: 'border-neutral-800', tagClassName: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-100' },
  { borderClassName: 'border-neutral-800', tagClassName: 'border-sky-400/30 bg-sky-400/15 text-sky-100' },
  { borderClassName: 'border-neutral-800', tagClassName: 'border-amber-400/30 bg-amber-400/15 text-amber-100' },
  { borderClassName: 'border-neutral-800', tagClassName: 'border-neutral-700 bg-neutral-900 text-neutral-100' },
];

export default function KitchenPage() {
  const [selection, setSelection] = useState<KitchenSelection>(defaultSelection);
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<KitchenSolution | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const solution = useMemo(() => buildKitchenSolution(selection), [selection]);
  const totalIngredients =
    selection.informationIds.length + selection.integrationIds.length + selection.productionIds.length;

  function toggleSelection(field: keyof KitchenSelection, id: string) {
    setSelection((current) => {
      const values = current[field];
      const exists = values.includes(id);
      const nextValues = exists ? values.filter((item) => item !== id) : [...values, id];

      return {
        ...current,
        [field]: nextValues.length > 0 ? nextValues : [id],
      };
    });
  }

  function toggleExpandedCard(cardId: string) {
    setExpandedCards((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));
  }

  const currentStep = stepConfigs.find((step) => step.id === activeStep) ?? stepConfigs[0];
  const currentSelections = selection[currentStep.field];

  const matchingPreset = kitchenPresets.find((preset) =>
    JSON.stringify(preset.selection.informationIds) === JSON.stringify(selection.informationIds) &&
    JSON.stringify(preset.selection.integrationIds) === JSON.stringify(selection.integrationIds) &&
    JSON.stringify(preset.selection.productionIds) === JSON.stringify(selection.productionIds),
  );

  const canMoveToStep2 = selection.informationIds.length > 0;
  const canMoveToStep3 = canMoveToStep2 && selection.integrationIds.length > 0;
  const canPreview = canMoveToStep3 && selection.productionIds.length > 0;

  return (
    <article className="min-h-screen bg-white pb-24 pt-24 text-black">
      <Seo />
      <section className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-14 border-b border-neutral-200 pb-10 md:pb-12"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Kitchen by B2W</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                Build your project one layer at a time.
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                This Kitchen works like a guided survey: start with information, move into integrations, then define production. Each step supports multiple ingredients.
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <div className="flex items-center gap-3">
                <ChefHat className="h-5 w-5" />
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Kitchen Flow</p>
              </div>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-neutral-300">
                <li>1. Choose one or more information ingredients.</li>
                <li>2. Add the integrations that strengthen the read.</li>
                <li>3. Select the production layers the project should include.</li>
                <li>4. Open a preview proposal after entering contact information.</li>
              </ul>
              <Link
                to="/kitchen/demo/original"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                View original Kitchen demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </motion.div>

        <section className="mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Existing Solutions</p>
          <div className="mt-5 flex flex-wrap gap-4">
            {kitchenPresets.map((preset) => {
              const presetSolution = buildKitchenSolutionFromPreset(preset.slug);
              if (!presetSolution) {
                return null;
              }

              const isActive = matchingPreset?.slug === preset.slug;

              return (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => {
                    setSelection(preset.selection);
                    setActiveStep(3);
                  }}
                  className={`flex items-center gap-3 border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'scale-105 border-black bg-black text-white shadow-lg'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-black hover:shadow-sm'
                  }`}
                >
                  <Layers className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{preset.solutionName}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {stepConfigs.map((step) => {
            const isActive = activeStep === step.id;
            const isLocked = (step.id === 2 && !canMoveToStep2) || (step.id === 3 && !canMoveToStep3);
            const selectedCount = selection[step.field].length;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (!isLocked) {
                    setActiveStep(step.id);
                  }
                }}
                className={`border px-5 py-5 text-left transition-colors ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : isLocked
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-400'
                      : 'border-neutral-200 bg-white text-neutral-900 hover:border-black'
                }`}
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] opacity-70">Step {step.id}</p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight">{step.title}</h2>
                <p className={`mt-3 text-sm leading-6 ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>{step.subheader}</p>
                <p className={`mt-4 text-xs font-medium uppercase tracking-[0.18em] ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                  {selectedCount} selected
                </p>
              </button>
            );
          })}
        </section>

        <section className="relative overflow-hidden border border-neutral-200 bg-white p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Step {currentStep.id}</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-neutral-950">{currentStep.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{currentStep.subheader}</p>
            </div>
            <currentStep.icon className="mt-1 h-5 w-5 text-neutral-400" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentStep.options.map((option, index) => {
              const isSelected = currentSelections.includes(option.id);
              const isExpanded = expandedCards[option.id] ?? false;

              if (currentStep.id === 1) {
                return (
                  <div
                    key={option.id}
                    className={`group border p-6 transition-colors ${isSelected ? 'border-black bg-white' : 'border-neutral-200 bg-neutral-50 hover:border-black hover:bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-3 text-lg font-medium tracking-tight text-neutral-950">{option.title}</h3>
                        <p className="text-sm leading-relaxed text-neutral-600">{option.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpandedCard(option.id)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 md:hidden"
                        aria-label={`Toggle details for ${option.title}`}
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 md:max-h-0 md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100 ${isExpanded ? 'mt-4 max-h-40 opacity-100' : 'max-h-0 opacity-0 md:mt-0'}`}>
                      <p className="border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-600">{option.detail}</p>
                      <button
                        type="button"
                        onClick={() => toggleSelection(currentStep.field, option.id)}
                        className={`mt-4 inline-flex items-center gap-2 border px-4 py-3 text-sm font-medium transition-colors ${isSelected ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black hover:border-black'}`}
                      >
                        {isSelected ? 'Selected' : 'Select ingredient'}
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                      </button>
                    </div>
                  </div>
                );
              }

              if (currentStep.id === 2) {
                const accent = expertiseCardAccents[index % expertiseCardAccents.length];

                return (
                  <div
                    key={option.id}
                    className={`group relative overflow-hidden border bg-white transition-all duration-300 ${isSelected ? 'border-black -translate-y-0.5' : `hover:-translate-y-0.5 hover:border-black ${accent.borderClassName}`}`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),transparent_45%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col p-6 md:p-8">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <p className={`text-[11px] font-mono uppercase tracking-[0.28em] ${isSelected ? 'text-neutral-900' : accent.accentClassName}`}>
                          {option.shortTitle}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleExpandedCard(option.id)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 md:hidden"
                          aria-label={`Toggle details for ${option.title}`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      <h3 className="text-2xl font-medium tracking-tight text-neutral-950">{option.title}</h3>
                      <p className="mt-4 text-base leading-relaxed text-neutral-700">{option.description}</p>
                      <div className={`overflow-hidden transition-all duration-300 md:max-h-0 md:opacity-0 md:group-hover:mt-6 md:group-hover:max-h-48 md:group-hover:opacity-100 ${isExpanded ? 'mt-6 max-h-48 opacity-100' : 'max-h-0 opacity-0 md:mt-0'}`}>
                        <p className="text-sm leading-6 text-neutral-600">{option.detail}</p>
                        <button
                          type="button"
                          onClick={() => toggleSelection(currentStep.field, option.id)}
                          className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${isSelected ? 'text-black' : 'text-neutral-900'}`}
                        >
                          {isSelected ? 'Selected' : 'Add integration'}
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const tone = projectCardTones[index % projectCardTones.length];

              return (
                <article
                  key={option.id}
                  className={`group relative min-h-[320px] border bg-neutral-950 p-8 transition-colors duration-300 ${tone.borderClassName} ${isSelected ? 'ring-1 ring-white/40' : ''}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />
                  <div className="relative grid h-full grid-rows-[auto,1fr,auto] gap-8">
                    <div>
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <span className={`inline-flex border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${tone.tagClassName}`}>
                          {option.shortTitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleExpandedCard(option.id)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-neutral-300 md:hidden"
                          aria-label={`Toggle details for ${option.title}`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      <h3 className="mb-4 text-2xl font-medium text-stone-50">{option.title}</h3>
                      <p className="text-sm leading-relaxed text-neutral-200 md:text-base">{option.description}</p>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 md:max-h-0 md:opacity-0 md:group-hover:max-h-48 md:group-hover:opacity-100 ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="border-t border-neutral-800 pt-5 text-sm leading-6 text-neutral-300">{option.detail}</p>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-neutral-800 pt-6">
                      <button
                        type="button"
                        onClick={() => toggleSelection(currentStep.field, option.id)}
                        className={`inline-flex w-full items-center justify-between gap-2 border px-4 py-3 text-sm font-medium transition-colors sm:w-auto sm:self-start ${isSelected ? 'border-stone-50 bg-stone-50 text-neutral-950' : 'border-neutral-700 text-stone-50 hover:border-stone-50 hover:bg-stone-50 hover:text-neutral-950'}`}
                      >
                        <span>{isSelected ? 'Selected' : 'Add production layer'}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">{currentSelections.length} ingredient(s) selected in this step</p>
              <p className="mt-1 text-sm text-neutral-600">{totalIngredients} total ingredients currently synced into the project.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((current) => Math.max(1, current - 1) as StepId)}
                  className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-black"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
              ) : null}
              {activeStep < 3 ? (
                <button
                  type="button"
                  disabled={(activeStep === 1 && !canMoveToStep2) || (activeStep === 2 && !canMoveToStep3)}
                  onClick={() => setActiveStep((current) => Math.min(3, current + 1) as StepId)}
                  className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canPreview}
                  onClick={() => {
                    setPreviewTarget(solution);
                    setPreviewOpen(true);
                  }}
                  className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Preview proposal
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={solution.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="mt-10 border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Generated Solution</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">{matchingPreset?.solutionName ?? solution.name}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-300">{solution.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[...solution.information, ...solution.integration, ...solution.production].map((item) => (
                <span key={item.id} className="border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-neutral-300">
                  {item.shortTitle}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={matchingPreset?.subpagePath ?? '/kitchen/demo/original'}
                className="inline-flex items-center justify-center gap-2 border border-white/15 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                View subpage
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPreviewTarget(solution);
                  setPreviewOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                Preview proposal
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </section>

      <SolutionPreviewGate
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewTarget(null);
        }}
        solutionName={(previewTarget ?? solution).name}
        previewPath={(previewTarget ?? solution).previewPath}
        projectAreas={(previewTarget ?? solution).projectAreas}
        inquiryType={(previewTarget ?? solution).inquiryType}
      />
    </article>
  );
}
