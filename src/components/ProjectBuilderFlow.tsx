import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import {
  getRankedProjectAreas,
  homeTestCapabilities,
  homeTestExpertise,
  homeTestProjectAreaLookup,
  type HomeTestCapabilityId,
  type HomeTestExpertiseId,
  type HomeTestProjectAreaId,
} from '../content/homeTestTwo';
import type {
  GeneratedProjectBrief,
  ProjectBriefApiResponse,
  ProjectBriefRequestPayload,
} from '../lib/projectBrief';

function toggleStringValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function renderInlineMarkdown(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={`${part}-${index}`} className="font-semibold text-neutral-950">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <Fragment key={`${part}-${index}`}>{part}</Fragment>
      ),
    );
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    const content = paragraphBuffer.join(' ');
    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="text-sm leading-7 text-neutral-700 md:text-base">
        {renderInlineMarkdown(content)}
      </p>,
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }

    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-3 pl-5 text-sm leading-7 text-neutral-700 md:text-base">
        {listBuffer.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={`heading-1-${blocks.length}`} className="text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl">
          {trimmed.slice(2)}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`heading-2-${blocks.length}`} className="pt-3 text-xl font-medium tracking-tight text-neutral-950 md:text-2xl">
          {trimmed.slice(3)}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`heading-3-${blocks.length}`} className="text-base font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {trimmed.slice(4)}
        </h4>,
      );
      return;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      listBuffer.push(trimmed.slice(2));
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-4">{blocks}</div>;
}

export default function ProjectBuilderFlow() {
  const [businessType, setBusinessType] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [arr, setArr] = useState('');
  const [selectedCapabilityIds, setSelectedCapabilityIds] = useState<HomeTestCapabilityId[]>([]);
  const [selectedExpertiseIds, setSelectedExpertiseIds] = useState<HomeTestExpertiseId[]>([]);
  const [selectedProjectAreaId, setSelectedProjectAreaId] = useState<HomeTestProjectAreaId | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedProjectBrief | null>(null);
  const [generatedSignature, setGeneratedSignature] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState<Omit<ProjectBriefApiResponse, 'brief'> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const rankedProjectAreas = useMemo(
    () => getRankedProjectAreas(selectedCapabilityIds, selectedExpertiseIds),
    [selectedCapabilityIds, selectedExpertiseIds],
  );

  useEffect(() => {
    if (selectedProjectAreaId || (selectedCapabilityIds.length === 0 && selectedExpertiseIds.length === 0)) {
      return;
    }

    setSelectedProjectAreaId(rankedProjectAreas[0]?.id ?? null);
  }, [rankedProjectAreas, selectedCapabilityIds.length, selectedExpertiseIds.length, selectedProjectAreaId]);

  const selectedProjectArea = selectedProjectAreaId ? homeTestProjectAreaLookup[selectedProjectAreaId] : null;
  const selectedCapabilityTitles = homeTestCapabilities
    .filter((item) => selectedCapabilityIds.includes(item.id))
    .map((item) => item.title);
  const selectedExpertiseTitles = homeTestExpertise
    .filter((item) => selectedExpertiseIds.includes(item.id))
    .map((item) => item.title);

  const requestPayload = useMemo<ProjectBriefRequestPayload | null>(() => {
    if (!selectedProjectAreaId) {
      return null;
    }

    return {
      businessType: businessType.trim(),
      location: businessLocation.trim(),
      arr: arr.trim(),
      capabilityIds: selectedCapabilityIds,
      expertiseIds: selectedExpertiseIds,
      projectAreaId: selectedProjectAreaId,
    };
  }, [arr, businessLocation, businessType, selectedCapabilityIds, selectedExpertiseIds, selectedProjectAreaId]);

  const canGenerateBrief = Boolean(
    requestPayload &&
      requestPayload.businessType &&
      requestPayload.location &&
      requestPayload.capabilityIds.length > 0 &&
      requestPayload.expertiseIds.length > 0,
  );
  const currentSignature = requestPayload ? JSON.stringify(requestPayload) : '';
  const briefIsStale = Boolean(generatedBrief && generatedSignature && currentSignature && generatedSignature !== currentSignature);

  async function handleGenerateBrief() {
    if (!requestPayload || !canGenerateBrief) {
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const response = await fetch('/api/project-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const raw = await response.text();
      const data = raw ? (JSON.parse(raw) as ProjectBriefApiResponse & { error?: string }) : null;

      if (!response.ok || !data || !('brief' in data)) {
        throw new Error(data?.error ?? 'Unable to generate the project brief right now.');
      }

      setGeneratedBrief(data.brief);
      setGeneratedSignature(currentSignature);
      setGeneratedMeta({
        generatedAt: data.generatedAt,
        provider: data.provider,
        warning: data.warning,
      });
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Unable to generate the project brief right now.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <section id="project-setup" className="border-t border-neutral-200 bg-[#faf7f2] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Project Setup</p>
              <h2 className="mt-5 max-w-4xl text-4xl font-medium tracking-tight text-neutral-950 md:text-5xl">
                Start with the business context, then build the project.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
                This builder is meant to shape a B2W proposal. First tell us what kind of business this is, where it is located, and optionally the ARR or revenue context. Then select the data sources you can provide, the outcomes you want, and the project format that fits.
              </p>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="border border-black/10 bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.05)] md:p-7"
            >
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Business Type</span>
                  <input
                    value={businessType}
                    onChange={(event) => setBusinessType(event.target.value)}
                    placeholder="Restaurant group, contractor, clinic, distributor..."
                    className="min-h-12 border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Location</span>
                  <input
                    value={businessLocation}
                    onChange={(event) => setBusinessLocation(event.target.value)}
                    placeholder="Washington, DC"
                    className="min-h-12 border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">ARR / Revenue Context (Optional)</span>
                  <input
                    value={arr}
                    onChange={(event) => setArr(event.target.value)}
                    placeholder="$2.5M ARR or annual revenue"
                    className="min-h-12 border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                  />
                </label>
              </div>

              <div className="mt-6 border-t border-black/10 pt-5">
                <p className="text-sm leading-6 text-neutral-600">
                  B2W uses this information to customize the proposal, similar to the Uyghur Eats portal structure, so the final brief can develop into profile, model, and documentation layers instead of a generic scope.
                </p>
                {(selectedCapabilityTitles.length > 0 || selectedExpertiseTitles.length > 0) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCapabilityTitles.map((item) => (
                      <span
                        key={item}
                        className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700"
                      >
                        {item}
                      </span>
                    ))}
                    {selectedExpertiseTitles.map((item) => (
                      <span
                        key={item}
                        className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section id="capabilities" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-medium tracking-tight text-neutral-950">Capabilities</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
              The existing landing page is meant to act like a project builder. Start by choosing which business materials you can actually provide. These become the evidence base for the project.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {homeTestCapabilities.map((item) => {
              const isSelected = selectedCapabilityIds.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCapabilityIds((current) => toggleStringValue(current, item.id))}
                  className={`group border p-6 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-[0_18px_54px_rgba(0,0,0,0.12)]'
                      : 'border-neutral-200 bg-neutral-50 hover:border-black hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`mb-3 text-lg font-medium tracking-tight ${isSelected ? 'text-white' : 'text-neutral-950'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>{item.body}</p>
                    </div>
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center border ${
                        isSelected ? 'border-white bg-white text-black' : 'border-black/15 text-transparent'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${
                          isSelected ? 'border border-white/15 bg-white/10 text-neutral-200' : 'border border-black/10 bg-white text-neutral-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className={`mt-5 text-xs leading-5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>{item.detail}</p>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm leading-relaxed text-neutral-600">
                The link below selects all three inputs, then those inputs are pulled into every expertise area you choose next.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCapabilityIds(homeTestCapabilities.map((item) => item.id))}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
              >
                Select all 3 inputs
              </button>
            </div>

            <p className="text-sm font-medium text-neutral-700">{selectedCapabilityIds.length} capability input(s) selected</p>
          </motion.div>
        </div>
      </section>

      <section id="expertise" className="bg-[#faf7f2] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">Expertise</h2>
            <p className="max-w-3xl text-base leading-relaxed text-neutral-600">
              Choose the goals that matter here: growth, optimization, or diligence. Each selected expertise area uses the same chosen data stack, but it organizes the resulting project differently.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {homeTestExpertise.map((item, index) => {
              const isSelected = selectedExpertiseIds.includes(item.id);

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  onClick={() => setSelectedExpertiseIds((current) => toggleStringValue(current, item.id))}
                  className={`group relative overflow-hidden border bg-white p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-black ${
                    isSelected ? 'border-black shadow-[0_18px_54px_rgba(0,0,0,0.08)]' : item.borderClassName
                  }`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),transparent_45%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <p className={`text-[11px] font-mono uppercase tracking-[0.28em] ${item.accentClassName}`}>{item.title}</p>
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-black bg-black text-white' : 'border-black/15 text-transparent'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </div>

                    <p className="mt-6 flex-1 text-lg leading-relaxed text-neutral-700">{item.description}</p>

                    <div className="mt-8 border-t border-neutral-200 pt-5">
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                        {selectedCapabilityIds.length > 0
                          ? `Uses ${selectedCapabilityIds.length} selected data source${selectedCapabilityIds.length === 1 ? '' : 's'}`
                          : 'Waiting on capability selection'}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCapabilityTitles.length > 0 ? (
                          selectedCapabilityTitles.map((title) => (
                            <span key={title} className="border border-black/10 bg-neutral-50 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-600">
                              {title}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-neutral-500">Select capabilities above.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="project-areas" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">Project Areas</h2>
            <p className="max-w-3xl text-base leading-relaxed text-neutral-600">
              Finally, choose the project type. Instead of clickthrough cards, these cards now behave like selection items that suggest the best proposal structure based on your inputs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {rankedProjectAreas.map((projectArea, index) => {
              const isSelected = selectedProjectAreaId === projectArea.id;

              return (
                <motion.button
                  key={projectArea.id}
                  type="button"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  onClick={() => setSelectedProjectAreaId(projectArea.id)}
                  className={`group relative min-h-[320px] border p-8 text-left transition-colors duration-300 ${
                    isSelected ? 'border-stone-50 bg-neutral-900 text-stone-50' : 'border-neutral-800 bg-neutral-950 text-stone-50 hover:border-stone-50'
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

                  <div className="relative grid h-full grid-rows-[auto,1fr,auto] gap-8">
                    <div>
                      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                        <span className="font-semibold text-stone-100">{projectArea.eyebrow}</span>
                        <span className="text-neutral-700">•</span>
                        <span>{projectArea.serviceType}</span>
                        {projectArea.isRecommended ? (
                          <>
                            <span className="text-neutral-700">•</span>
                            <span className="inline-flex border border-emerald-400/30 bg-emerald-400/15 px-2 py-1 text-[10px] tracking-[0.2em] text-emerald-100">
                              Recommended
                            </span>
                          </>
                        ) : null}
                      </div>

                      <div className="max-w-2xl">
                        <h3 className="mb-4 text-2xl font-medium text-stone-50">{projectArea.title}</h3>
                        <p className="text-sm leading-relaxed text-neutral-200 md:text-base">{projectArea.summary}</p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-6">
                      <p className="text-sm leading-6 text-neutral-300">{projectArea.detail}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {projectArea.tags.map((tag) => (
                          <span key={tag} className="border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-neutral-800 pt-6">
                      <div className="text-sm text-neutral-300">
                        {projectArea.matchedCapabilityCount} capability match{projectArea.matchedCapabilityCount === 1 ? '' : 'es'} • {projectArea.matchedExpertiseCount} expertise match{projectArea.matchedExpertiseCount === 1 ? '' : 'es'}
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-medium ${
                          isSelected ? 'text-stone-50' : 'text-neutral-300 group-hover:text-stone-50'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Use this project area'}
                        <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0 transition-opacity group-hover:opacity-100'}`} />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p className="text-base text-neutral-600">
                Our proposal language pulls all selected data sources into each expertise area, then translates that into profile, model, and documentation for the chosen project format.
              </p>
              {selectedProjectArea ? (
                <p className="mt-3 text-sm font-medium text-neutral-900">Current project area: {selectedProjectArea.title}</p>
              ) : null}
            </div>

            <a
              href="#brief"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Continue to generated brief
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="brief" className="bg-[#faf7f2] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-950">Generated Brief</h2>
            <p className="max-w-3xl text-base leading-relaxed text-neutral-600">
              The backend develops a project brief that the client can browse quickly. It follows the B2W structure so the project can evolve into a tailored portal with profile, model, and documentation layers.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)] lg:items-start">
            <div className="space-y-6">
              <div className="border border-black/10 bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.05)] md:p-8">
                {generatedBrief ? (
                  <>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-600">
                        {generatedMeta?.provider === 'gemini' ? 'Gemini Flash' : 'Local Draft'}
                      </span>
                      {briefIsStale ? (
                        <span className="border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-amber-800">
                          Selections changed
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-5 text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl">
                      {generatedBrief.projectTitle}
                    </h3>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">{generatedBrief.proposalSummary}</p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {[
                        ['Profile', generatedBrief.profile],
                        ['Model', generatedBrief.model],
                        ['Documentation', generatedBrief.documentation],
                      ].map(([label, section]) => (
                        <div key={label} className="border border-black/10 bg-neutral-50 p-4">
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">{label}</p>
                          <h4 className="mt-3 text-xl font-medium tracking-tight text-neutral-950">{section.headline}</h4>
                          <p className="mt-3 text-sm leading-6 text-neutral-600">{section.summary}</p>
                          <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
                            {section.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Brief Preview</p>
                    <h3 className="mt-4 text-3xl font-medium tracking-tight text-neutral-950">No project brief yet.</h3>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                      Fill in the business context, choose capabilities and expertise, select the project area, then generate the brief. The proposal draft will be designed to speak in B2W language and stay easy to browse.
                    </p>
                  </>
                )}
              </div>

              {generatedBrief ? (
                <div className="border border-black/10 bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.05)] md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">Markdown Brief</p>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight text-neutral-950">Browsable draft</h3>
                    </div>
                    {generatedMeta?.generatedAt ? (
                      <p className="text-sm text-neutral-500">
                        {new Date(generatedMeta.generatedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 max-h-[38rem] overflow-y-auto border-t border-black/10 pt-6">
                    <MarkdownPreview markdown={generatedBrief.briefMarkdown} />
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="border border-black bg-white p-6 shadow-[0_18px_54px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Builder Summary</p>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Business</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {businessType && businessLocation ? `${businessType} in ${businessLocation}` : 'Business type and location are still needed.'}
                    </p>
                    {arr ? <p className="mt-1 text-sm leading-6 text-neutral-600">ARR / revenue context: {arr}</p> : null}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900">Capabilities</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedCapabilityTitles.length > 0 ? (
                        selectedCapabilityTitles.map((item) => (
                          <span key={item} className="border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-700">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-neutral-500">No capability inputs selected yet.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900">Expertise</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedExpertiseTitles.length > 0 ? (
                        selectedExpertiseTitles.map((item) => (
                          <span key={item} className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-800">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-neutral-500">No expertise track selected yet.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900">Project Area</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {selectedProjectArea ? selectedProjectArea.title : 'Pick a project area above to frame the proposal.'}
                    </p>
                  </div>
                </div>

                {generatedMeta?.warning ? (
                  <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    {generatedMeta.warning}
                  </div>
                ) : null}

                {generationError ? (
                  <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                    {generationError}
                  </div>
                ) : null}

                {generatedBrief ? (
                  <div className="mt-6 border-t border-black/10 pt-5">
                    <p className="text-sm font-medium text-neutral-900">Recommended Scope</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                      {generatedBrief.recommendedScope.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <p className="mt-5 text-sm font-medium text-neutral-900">Immediate Next Steps</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                      {generatedBrief.nextSteps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleGenerateBrief}
                  disabled={!canGenerateBrief || isGenerating}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${
                    canGenerateBrief && !isGenerating
                      ? 'border border-black bg-black text-white hover:bg-neutral-800'
                      : 'cursor-not-allowed border border-black/10 bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {isGenerating ? 'Generating brief...' : generatedBrief ? 'Regenerate project brief' : 'Generate project brief'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {!canGenerateBrief ? (
                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    Add business type, location, at least one capability, at least one expertise track, and a project area to generate the brief.
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
