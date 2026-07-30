import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Clipboard,
  FileText,
  Layers3,
  MessageSquareText,
  MousePointer2,
  Palette,
  Route,
  Sparkles,
  Type,
  Workflow,
} from 'lucide-react';
import { motion } from 'motion/react';
import Seo from '../components/Seo';
import {
  WorkspaceButton,
  WorkspaceJourney,
  WorkspaceMetricCard,
  WorkspaceSection,
  WorkspaceShell,
  WorkspaceSourceCard,
  WorkspaceStatusPill,
} from '../components/workspace/WorkspaceComponents';
import { workspaceBrandSystem } from '../content/workspaceBrandSystem';

const componentInventory = [
  {
    name: 'WorkspaceShell',
    role: 'Parent canvas, shared header, shared footer, and design-token context.',
    use: 'Guides, internal tools, client portals, documentation, and resource libraries.',
  },
  {
    name: 'WorkspaceSection',
    role: 'Consistent section introduction and content boundary.',
    use: 'Long-form pages that need strong pacing and executive readability.',
  },
  {
    name: 'WorkspaceButton',
    role: 'Primary, secondary, JasonAI, and Clara action treatments.',
    use: 'One dominant page action with product accents applied only in product context.',
  },
  {
    name: 'WorkspaceStatusPill',
    role: 'Shared state language for active, complete, gate, blocked, and planned work.',
    use: 'Roadmaps, project cards, evidence tables, approvals, and internal dashboards.',
  },
  {
    name: 'WorkspaceMetricCard',
    role: 'A compact evidence block with number, status, and interpretation.',
    use: 'KPIs, project summaries, ROI, delivery health, and progress views.',
  },
  {
    name: 'WorkspaceJourney',
    role: 'A progressive five-part content and interaction sequence.',
    use: 'Service explanations, product demonstrations, onboarding, and resources.',
  },
] as const;

const voiceExamples = [
  {
    label: 'Company statement',
    weak: 'We leverage cutting-edge AI to transform your business operations.',
    strong: 'We find the operating constraint, build the right system, and make the result measurable.',
  },
  {
    label: 'Product capability',
    weak: 'JasonAI automates your entire workflow using advanced intelligence.',
    strong: 'JasonAI can search approved job communication and turn long threads into a concise summary. Action extraction is still in development.',
  },
  {
    label: 'Call to action',
    weak: 'Unlock the future of your business today.',
    strong: 'Review how your team communicates today.',
  },
] as const;

const deploymentSteps = [
  {
    number: '01',
    title: 'Start with the page condition.',
    body: 'Identify the user, current operating condition, decision, and primary action before selecting components.',
  },
  {
    number: '02',
    title: 'Wrap the experience.',
    body: 'Use WorkspaceShell for reference, internal, resource, and client experiences that need the parent B2W workspace language.',
  },
  {
    number: '03',
    title: 'Build the narrative in sequence.',
    body: 'Use Orient, Diagnose, Resolve, Prove, and Advance as the default page journey. Remove a stage only when it adds no decision value.',
  },
  {
    number: '04',
    title: 'Apply product accents selectively.',
    body: 'Use JasonAI rust or Clara plum for product-specific context. Keep navigation, page structure, status, and evidence in the parent system.',
  },
  {
    number: '05',
    title: 'Verify state, motion, and claims.',
    body: 'Check mobile behavior, reduced motion, present-versus-planned language, action priority, and visible evidence before release.',
  },
] as const;

function PrincipleCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.42, ease: workspaceBrandSystem.motion.defaultEase }}
      className="min-h-72 border border-neutral-200 bg-white p-5"
    >
      <p className="font-mono text-xs text-neutral-400">{number}</p>
      <h3 className="mt-16 text-2xl font-medium leading-tight tracking-[-0.035em]">{title}</h3>
      <p className="mt-5 text-sm leading-6 text-neutral-600">{body}</p>
    </motion.article>
  );
}

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden border border-neutral-800 bg-neutral-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">Implementation</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 text-xs text-neutral-400 transition hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-6 text-neutral-300"><code>{code}</code></pre>
    </div>
  );
}

export default function WorkspaceGuidePage() {
  return (
    <WorkspaceShell>
      <Seo
        title="B2W Workspace Brand System"
        description="The working visual, content, component, and voice system for B2W's unified website and workspace."
        canonicalPath="/workspace"
        robots="noindex, nofollow"
      />

      <main>
        <section className="relative overflow-hidden border-b border-neutral-200 bg-[var(--b2w-canvas)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 16% 18%, rgba(79,127,82,0.14), transparent 30%), radial-gradient(circle at 82% 18%, rgba(178,74,36,0.12), transparent 25%), radial-gradient(circle at 72% 82%, rgba(166,101,137,0.10), transparent 28%)',
            }}
          />
          <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.56, ease: workspaceBrandSystem.motion.defaultEase }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex min-h-7 items-center rounded-full border border-neutral-300 bg-white px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                  Workspace system 01
                </span>
                <WorkspaceStatusPill status="Active" />
              </div>
              <h1 className="mt-8 max-w-[12ch] text-[clamp(3.5rem,8vw,7.7rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                Clear enough to act on.
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">
                A working system for how B2W looks, sounds, organizes information, demonstrates products, and moves people toward a decision.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <WorkspaceButton to="#foundation">Open the system</WorkspaceButton>
                <WorkspaceButton to="/brand/workspace/b2w-workspace-board.svg" tone="secondary" external>
                  View visual board
                </WorkspaceButton>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.56, delay: 0.12, ease: workspaceBrandSystem.motion.defaultEase }}
              className="border border-neutral-200 bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.09)]"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">System definition</p>
                  <p className="mt-2 text-sm font-semibold">One B2W. Three contexts.</p>
                </div>
                <Layers3 className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['Company', 'Neutral structure, evidence, and executive clarity.', '#111111'],
                  ['JasonAI', 'Warm rust for field communication and follow-up clarity.', '#B24A24'],
                  ['Clara / Resources', 'Plum for guided capture-to-output experiences.', '#A66589'],
                ].map(([label, description, color]) => (
                  <div key={label} className="grid grid-cols-[12px_1fr] gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                    <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <WorkspaceSection
          id="foundation"
          eyebrow="01 / Source synthesis"
          title="Built from the real systems already in the repository."
          description="The workspace does not introduce an unrelated design direction. It identifies the strongest role of each existing experience and assigns it a controlled place in the parent system."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaceBrandSystem.sources.map((source, index) => (
              <WorkspaceSourceCard
                key={source.name}
                number={String(index + 1).padStart(2, '0')}
                title={source.name}
                route={source.route}
                contribution={source.contribution}
              />
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          eyebrow="02 / Design direction"
          title="Operational clarity is the parent brand."
          description="Warm neutral space makes the system approachable. Strong black typography establishes authority. Status colors communicate condition. Product accents create recognition without fragmenting the company."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workspaceBrandSystem.principles.map((principle) => (
              <PrincipleCard key={principle.number} {...principle} />
            ))}
          </div>

          <div className="mt-12 overflow-hidden border border-neutral-200 bg-white">
            <img
              src="/brand/workspace/b2w-workspace-board.svg"
              alt="B2W Workspace visual brand board with palette, typography, promise, and content journey"
              className="block h-auto w-full"
            />
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          eyebrow="03 / Foundation tokens"
          title="A restrained base with meaningful signals."
          description="The core palette is intentionally small. Every additional color must communicate a product context, current state, or decision condition."
        >
          <div className="grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {workspaceBrandSystem.colors.map((color) => (
              <article key={color.name} className="grid min-h-52 grid-rows-[112px_1fr] bg-white">
                <div className="border-b border-black/5" style={{ backgroundColor: color.value }} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{color.name}</h3>
                    <span className="font-mono text-[10px] text-neutral-400">{color.value}</span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-neutral-700">{color.role}</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">{color.usage}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <article className="border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3 text-neutral-500">
                <Type className="h-4 w-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em]">Typography</span>
              </div>
              <p className="mt-10 text-6xl font-medium leading-[0.9] tracking-[-0.06em] sm:text-8xl">Today’s view.</p>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
                Display type is compressed and decisive. Body copy is measured and readable. Labels organize the system without competing with the message.
              </p>
              <div className="mt-10 flex flex-wrap gap-5 border-t border-neutral-200 pt-6">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Phase 01 · Foundation</span>
                <span className="text-sm font-semibold">Primary interface label</span>
                <span className="text-sm text-neutral-500">Supporting explanation and evidence.</span>
              </div>
            </article>

            <article className="overflow-hidden border border-neutral-800 bg-neutral-950 text-white">
              <img
                src="/brand/workspace/b2w-system-pattern.svg"
                alt="B2W signal to context to action operating pattern"
                className="aspect-[3/2] h-full w-full object-cover"
              />
            </article>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          id="components"
          eyebrow="04 / Components"
          title="Components should expose state, evidence, and action."
          description="The workspace primitives are designed to be reused across public pages, internal portals, guides, client delivery, and product demonstrations."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <WorkspaceMetricCard label="Active work" value="08" note="Visible progress with a current-state interpretation." status="Active" />
            <WorkspaceMetricCard label="Complete" value="04" note="Completed outputs remain accessible as evidence." status="Complete" />
            <WorkspaceMetricCard label="Open gates" value="03" note="A gate is a decision or dependency, not vague pending work." status="At gate" />
            <WorkspaceMetricCard label="Blocked" value="01" note="Risk language identifies what prevents the next action." status="Blocked" />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <article className="border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-3 text-neutral-500">
                <MousePointer2 className="h-4 w-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em]">Actions</span>
              </div>
              <h3 className="mt-8 text-3xl font-medium tracking-[-0.04em]">One page, one dominant action.</h3>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Secondary actions may support comparison or exploration, but they should never carry the same visual priority as the primary decision.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <WorkspaceButton to="/services">Primary</WorkspaceButton>
                <WorkspaceButton to="/about" tone="secondary">Secondary</WorkspaceButton>
                <WorkspaceButton to="/jasonai" tone="jason">JasonAI</WorkspaceButton>
                <WorkspaceButton to="/clara" tone="clara">Clara</WorkspaceButton>
              </div>
            </article>

            <div className="overflow-hidden border border-neutral-200 bg-white">
              <div className="grid border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[9px] font-mono uppercase tracking-[0.16em] text-neutral-400 sm:grid-cols-[180px_1fr_1fr]">
                <span>Component</span>
                <span className="hidden sm:block">Role</span>
                <span className="hidden sm:block">Use</span>
              </div>
              {componentInventory.map((component) => (
                <article key={component.name} className="grid gap-3 border-b border-neutral-100 p-5 last:border-0 sm:grid-cols-[180px_1fr_1fr]">
                  <code className="text-xs font-semibold text-black">{component.name}</code>
                  <p className="text-xs leading-5 text-neutral-600">{component.role}</p>
                  <p className="text-xs leading-5 text-neutral-500">{component.use}</p>
                </article>
              ))}
            </div>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          id="voice"
          eyebrow="05 / Voice"
          title="Sound like the operator who understands the work."
          description={workspaceBrandSystem.voice.statement}
        >
          <div className="grid gap-4 lg:grid-cols-[.75fr_1.25fr]">
            <article className="border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-3 text-neutral-500">
                <MessageSquareText className="h-4 w-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em]">Voice rules</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {workspaceBrandSystem.voice.character.map((character) => (
                  <span key={character} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold">
                    {character}
                  </span>
                ))}
              </div>
              <ol className="mt-8 space-y-4">
                {workspaceBrandSystem.voice.rules.map((rule, index) => (
                  <li key={rule} className="grid grid-cols-[28px_1fr] gap-3 text-sm leading-6 text-neutral-600">
                    <span className="font-mono text-[10px] text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
                    {rule}
                  </li>
                ))}
              </ol>
            </article>

            <div className="space-y-4">
              {voiceExamples.map((example) => (
                <article key={example.label} className="border border-neutral-200 bg-white p-6">
                  <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">{example.label}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="border-l-2 border-[var(--b2w-risk)] pl-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--b2w-risk)]">Avoid</p>
                      <p className="mt-3 text-sm leading-6 text-neutral-500">{example.weak}</p>
                    </div>
                    <div className="border-l-2 border-[var(--b2w-active)] pl-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--b2w-active)]">Use</p>
                      <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{example.strong}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          eyebrow="06 / Content system"
          title="Organization from Services. Narrative from JasonAI. Journey from Resources."
          description="Every major page should operate as a guided decision path rather than a collection of independent sections."
          dark
        >
          <WorkspaceJourney steps={workspaceBrandSystem.contentModel} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Route,
                title: 'Services organizes the offer.',
                body: 'Use clear lanes, concrete deliverables, visible examples, and routes that match how customers identify their need.',
              },
              {
                icon: MessageSquareText,
                title: 'JasonAI carries the narrative.',
                body: 'Start from recognisable operating failures, distinguish current from planned capability, answer objections, then make the next step low-friction.',
              },
              {
                icon: Sparkles,
                title: 'Resources creates participation.',
                body: 'Let users capture, choose, transform, compare, and advance. Motion should make the transformation visible and understandable.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="border border-white/12 bg-white/[0.03] p-6">
                <Icon className="h-5 w-5 text-[#D8B536]" />
                <h3 className="mt-8 text-xl font-medium tracking-[-0.03em]">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-neutral-400">{body}</p>
              </article>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          eyebrow="07 / Asset library"
          title="Native visual assets for deployment and reuse."
          description="The workspace assets are SVG files committed with the product. They can be used as full-width boards, section backgrounds, social crops, presentation references, or implementation guides without resolution loss."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                title: 'Workspace brand board',
                path: '/brand/workspace/b2w-workspace-board.svg',
                description: 'The complete visual reference for promise, voice, palette, typography, and content journey.',
              },
              {
                title: 'Operating system pattern',
                path: '/brand/workspace/b2w-system-pattern.svg',
                description: 'A reusable signal-to-context-to-action visual for page heroes, reports, and system explanations.',
              },
            ].map((asset) => (
              <article key={asset.path} className="overflow-hidden border border-neutral-200 bg-white">
                <div className="aspect-[3/2] overflow-hidden bg-neutral-950">
                  <img src={asset.path} alt={asset.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-lg font-semibold">{asset.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-500">{asset.description}</p>
                    </div>
                    <FileText className="h-5 w-5 shrink-0 text-neutral-400" />
                  </div>
                  <a
                    href={asset.path}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-black"
                  >
                    Open SVG
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection
          id="deployment"
          eyebrow="08 / Deployment guide"
          title="Use the system as a decision framework, not a coat of paint."
          description="Components create consistency, but the system only works when content state, claims, actions, and motion are designed together."
        >
          <div className="grid gap-4 lg:grid-cols-5">
            {deploymentSteps.map((step) => (
              <article key={step.number} className="min-h-72 border border-neutral-200 bg-white p-5">
                <p className="font-mono text-xs text-neutral-400">{step.number}</p>
                <h3 className="mt-12 text-xl font-medium tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-neutral-500">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <CopyBlock
              code={`import {\n  WorkspaceShell,\n  WorkspaceSection,\n  WorkspaceButton,\n} from '../components/workspace/WorkspaceComponents';\n\nexport default function NewPage() {\n  return (\n    <WorkspaceShell>\n      <WorkspaceSection\n        eyebrow="01 / Current condition"\n        title="Make the decision visible."\n        description="Explain the operating condition and evidence."\n      >\n        <WorkspaceButton to="/contact">Take the next step</WorkspaceButton>\n      </WorkspaceSection>\n    </WorkspaceShell>\n  );\n}`}
            />
            <article className="border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-3 text-neutral-500">
                <Workflow className="h-4 w-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em]">Release check</span>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  'The page names the user and current condition.',
                  'The primary action is visibly dominant.',
                  'Current and planned capabilities are separated.',
                  'Status colors communicate a real state.',
                  'Motion explains sequence, progress, or transformation.',
                  'Mobile and reduced-motion behavior preserve the journey.',
                  'Evidence and trust information appear before conversion pressure.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--b2w-active)] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <p className="text-sm leading-6 text-neutral-600">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </WorkspaceSection>
      </main>
    </WorkspaceShell>
  );
}
