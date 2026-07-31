import { motion } from 'motion/react';
import { ArrowRight, Check, FileText, MessageCircle, Mic, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  PrototypeButton,
  PrototypeEyebrow,
  UnifiedSiteShell,
} from '../../components/prototype/UnifiedSiteShell';
import { unifiedPrototype } from '../../content/unifiedPrototype';
import { workspaceBrandSystem } from '../../content/workspaceBrandSystem';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: workspaceBrandSystem.motion.defaultEase },
};

function PageIntro({ eyebrow, title, description, accent = 'neutral' }: { eyebrow: string; title: string; description: string; accent?: 'neutral' | 'jason' | 'clara' | 'active' }) {
  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <PrototypeEyebrow tone={accent}>{eyebrow}</PrototypeEyebrow>
        <h1 className="mt-7 max-w-5xl text-[clamp(3.4rem,8vw,7.4rem)] font-medium leading-[0.86] tracking-[-0.07em]">{title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">{description}</p>
      </div>
    </section>
  );
}

export function UnifiedHomePage() {
  return (
    <UnifiedSiteShell>
      <Seo
        title="B2W Unified Website Prototype"
        description="A unified B2W prototype combining services, JasonAI, resources, and the company operating narrative."
        canonicalPath="/prototype"
        robots="noindex, nofollow"
      />
      <main>
        <section className="relative overflow-hidden border-b border-neutral-200">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 16% 22%, rgba(79,127,82,.14), transparent 30%), radial-gradient(circle at 82% 18%, rgba(178,74,36,.13), transparent 26%), radial-gradient(circle at 74% 84%, rgba(166,101,137,.10), transparent 28%)',
            }}
          />
          <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, ease: workspaceBrandSystem.motion.defaultEase }}
            >
              <PrototypeEyebrow tone="active">B2W / Business systems for contracting companies</PrototypeEyebrow>
              <h1 className="mt-8 max-w-[10ch] text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.08em]">
                {unifiedPrototype.promise}
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">
                {unifiedPrototype.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <PrototypeButton to="/prototype/services">Explore services</PrototypeButton>
                <PrototypeButton to="/prototype/jasonai" tone="secondary">See JasonAI</PrototypeButton>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.58, delay: 0.12, ease: workspaceBrandSystem.motion.defaultEase }}
              className="border border-neutral-200 bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,.09)]"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
                <div>
                  <PrototypeEyebrow>One company system</PrototypeEyebrow>
                  <p className="mt-2 text-sm font-semibold">From business condition to next action.</p>
                </div>
                <Sparkles className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ['Services', 'Diagnose and improve the business.', '#111111'],
                  ['JasonAI', 'Recover context from daily communication.', '#B24A24'],
                  ['Resources', 'Learn through guides, tools, and demonstrations.', '#A66589'],
                ].map(([label, body, color]) => (
                  <div key={label} className="grid grid-cols-[12px_1fr] gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                    <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <motion.div {...reveal} className="grid gap-6 border-b border-neutral-200 pb-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <PrototypeEyebrow>01 / The website model</PrototypeEyebrow>
            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">One narrative. Three ways to enter.</h2>
              <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-600">
                Visitors can begin with a business problem, a product need, or a practical resource. Every path uses the same structure, evidence language, and next-action logic.
              </p>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { title: 'Services', label: 'Improve the business', body: 'Growth, optimization, and diligence organized around a real operating constraint.', to: '/prototype/services', tone: 'bg-neutral-950 text-white' },
              { title: 'JasonAI', label: 'Improve communication', body: 'Search and summarize approved job communication without forcing the team into another dashboard.', to: '/prototype/jasonai', tone: 'bg-[#24130E] text-[#FFF7ED]' },
              { title: 'Resources', label: 'Improve understanding', body: 'Guided demonstrations, operator guides, templates, and decision tools.', to: '/prototype/resources', tone: 'bg-[#3D1F33] text-[#FFF8FB]' },
            ].map((card, index) => (
              <motion.article key={card.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className={`flex min-h-[26rem] flex-col p-6 sm:p-8 ${card.tone}`}>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-55">0{index + 1} / {card.title}</p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold opacity-65">{card.label}</p>
                  <h3 className="mt-4 text-4xl font-medium tracking-[-0.05em]">{card.title}</h3>
                  <p className="mt-5 max-w-sm text-sm leading-6 opacity-70">{card.body}</p>
                  <Link to={card.to} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                    Open {card.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <PrototypeEyebrow>02 / Shared user journey</PrototypeEyebrow>
            <h2 className="mt-7 max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">Every important page advances the same decision.</h2>
            <div className="mt-12 grid border border-white/12 lg:grid-cols-5">
              {unifiedPrototype.operatingFlow.map((step, index) => (
                <motion.article key={step.label} {...reveal} transition={{ ...reveal.transition, delay: index * 0.06 }} className={`min-h-60 p-5 ${index ? 'border-t border-white/12 lg:border-l lg:border-t-0' : ''}`}>
                  <p className="font-mono text-[10px] text-[#D8B536]">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-12 text-xl font-medium">{step.label}</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedServicesPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="B2W Services Prototype" description="Growth, optimization, and diligence services organized around business decisions." canonicalPath="/prototype/services" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Services / Organized around the business condition"
          title="We improve the next decision, then build what supports it."
          description="B2W combines business analysis, product thinking, operational design, and implementation. The engagement begins with the constraint—not a predetermined deliverable."
          accent="active"
        />

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-5">
            {unifiedPrototype.serviceLanes.map((lane) => (
              <motion.article key={lane.name} {...reveal} className="grid gap-8 border border-neutral-200 bg-white p-6 sm:p-8 lg:grid-cols-[160px_minmax(0,1fr)_320px]">
                <div>
                  <p className="font-mono text-xs text-neutral-400">{lane.number}</p>
                  <p className="mt-3 text-sm font-semibold">{lane.name}</p>
                </div>
                <div>
                  <h2 className="max-w-2xl text-3xl font-medium leading-[1.02] tracking-[-.04em] sm:text-5xl">{lane.statement}</h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">{lane.description}</p>
                </div>
                <div className="border-t border-neutral-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <PrototypeEyebrow>Typical work</PrototypeEyebrow>
                  <div className="mt-5 space-y-3">
                    {lane.evidence.map((item) => (
                      <p key={item} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#4F7F52]" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <PrototypeEyebrow>How an engagement moves</PrototypeEyebrow>
            <div className="mt-10 grid border border-neutral-200 md:grid-cols-4">
              {[
                ['01', 'Business review', 'Establish the condition, goals, evidence, and decision owner.'],
                ['02', 'Working diagnosis', 'Map the workflow, constraint, assumptions, and current cost of inaction.'],
                ['03', 'Designed response', 'Define the service, system, document, or product intervention.'],
                ['04', 'Implementation and proof', 'Deploy, measure, document, and determine the next operating gate.'],
              ].map(([number, title, body], index) => (
                <div key={title} className={`min-h-64 p-5 ${index ? 'border-t border-neutral-200 md:border-l md:border-t-0' : ''}`}>
                  <p className="font-mono text-[10px] text-neutral-400">{number}</p>
                  <h3 className="mt-12 text-xl font-medium">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-500">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <PrototypeButton to="mailto:info@b2w-ai.com">Begin a business review</PrototypeButton>
              <PrototypeButton to="/prototype/resources" tone="secondary">Explore resources</PrototypeButton>
            </div>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedJasonAIPage() {
  return (
    <UnifiedSiteShell theme="dark">
      <Seo title="JasonAI Unified Prototype" description="A WhatsApp assistant that makes approved contracting job communication searchable and summarizable." canonicalPath="/prototype/jasonai" robots="noindex, nofollow" />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(circle at 18% 18%,rgba(178,74,36,.34),transparent 32%),radial-gradient(circle at 82% 24%,rgba(37,211,102,.12),transparent 25%)' }} />
          <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.56, ease: workspaceBrandSystem.motion.defaultEase }}>
              <PrototypeEyebrow tone="jason">{unifiedPrototype.jasonAI.eyebrow}</PrototypeEyebrow>
              <h1 className="mt-8 max-w-[13ch] text-[clamp(3.6rem,8vw,7.5rem)] font-medium leading-[.86] tracking-[-.07em] text-[#FFF7ED]">{unifiedPrototype.jasonAI.headline}</h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[#F4B28C] sm:text-xl">{unifiedPrototype.jasonAI.description}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <PrototypeButton to="mailto:info@b2w-ai.com?subject=JasonAI%20Business%20Review" tone="jason">Book a business review</PrototypeButton>
                <PrototypeButton to="/prototype/resources" tone="secondary">See how it works</PrototypeButton>
              </div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.56, delay: .12, ease: workspaceBrandSystem.motion.defaultEase }} className="border border-[#F4B28C]/25 bg-[#14110F]/88 p-5 shadow-[0_28px_90px_rgba(178,74,36,.2)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <PrototypeEyebrow tone="jason">Approved communication</PrototypeEyebrow>
                  <p className="mt-2 text-sm font-semibold text-white">Ask what happened on the job.</p>
                </div>
                <MessageCircle className="h-5 w-5 text-[#F4B28C]" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['Owner', 'What did the customer add after the estimate?'],
                  ['JasonAI', 'The customer requested two additional fixtures on Tuesday. The request appears in the project WhatsApp thread and has not been reflected in the estimate.'],
                ].map(([name, body]) => (
                  <div key={name} className={name === 'Owner' ? 'ml-10 bg-white p-4 text-black' : 'mr-5 border border-[#F4B28C]/20 bg-[#2A1710] p-4 text-[#FFF7ED]'}>
                    <p className="text-[9px] font-mono uppercase tracking-[.16em] opacity-50">{name}</p>
                    <p className="mt-2 text-sm leading-6">{body}</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <PrototypeEyebrow tone="jason">The communication problem</PrototypeEyebrow>
          <h2 className="mt-7 max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">Details are lost before they reach the project record.</h2>
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">
            {unifiedPrototype.jasonAI.problems.map((problem, index) => (
              <motion.article key={problem} {...reveal} className="min-h-52 bg-neutral-950 p-6">
                <p className="font-mono text-[10px] text-[#B24A24]">{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-10 max-w-lg text-2xl font-medium leading-8 tracking-[-.03em] text-white">{problem}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#14110F]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid gap-6 border-b border-white/10 pb-10 lg:grid-cols-[220px_minmax(0,1fr)]">
              <PrototypeEyebrow tone="jason">Capability truth</PrototypeEyebrow>
              <div>
                <h2 className="max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] text-white sm:text-6xl">Show what works now. Label what comes next.</h2>
                <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-400">Trust comes from clear capability boundaries, approved data access, and review before important business action.</p>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {unifiedPrototype.jasonAI.capabilities.map((capability) => (
                <article key={capability.title} className="border border-white/10 bg-white/[.03] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <PrototypeEyebrow tone={capability.status === 'Available now' ? 'active' : 'jason'}>{capability.status}</PrototypeEyebrow>
                    {capability.status === 'Available now' ? <Check className="h-4 w-4 text-[#4F7F52]" /> : <Sparkles className="h-4 w-4 text-[#B24A24]" />}
                  </div>
                  <h3 className="mt-10 text-2xl font-medium text-white">{capability.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">{capability.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [ShieldCheck, 'Controlled access', 'The business chooses which communication sources JasonAI can review.'],
                [FileText, 'Source-aware work', 'Search and summaries are grounded in approved business communication.'],
                [Check, 'Human review', 'Important billing, contractual, safety, or customer decisions remain reviewable.'],
              ].map(([Icon, title, body]) => {
                const Component = Icon as typeof ShieldCheck;
                return (
                  <div key={String(title)} className="border-t border-white/10 pt-5">
                    <Component className="h-5 w-5 text-[#F4B28C]" />
                    <h3 className="mt-5 text-sm font-semibold text-white">{String(title)}</h3>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">{String(body)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedResourcesPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="B2W Resources Prototype" description="Guides, templates, tools, and interactive demonstrations for contracting business operations." canonicalPath="/prototype/resources" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Resources / Learn by working through the process"
          title="Practical tools for clearer operating decisions."
          description="Resources turn B2W's methods into usable demonstrations, guides, templates, and assessments. The interaction pattern comes from Clara: capture input, organize it, review the result, and move it into action."
          accent="clara"
        />

        <section className="bg-[#3D1F33] text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
              <div>
                <PrototypeEyebrow tone="clara">Interactive demonstration</PrototypeEyebrow>
                <h2 className="mt-7 max-w-3xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">From field input to organized action.</h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#E8CBD9]">A resource should make the transformation visible—not simply describe it. This demonstration carries a field note through capture, organization, review, and output.</p>
                <div className="mt-8">
                  <PrototypeButton to="/clara" tone="clara">Open the existing Clara demo</PrototypeButton>
                </div>
              </div>
              <div className="border border-white/15 bg-black/20 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <PrototypeEyebrow tone="clara">Demo sequence</PrototypeEyebrow>
                    <p className="mt-2 text-sm font-semibold">Capture → organize → review → apply</p>
                  </div>
                  <Mic className="h-5 w-5 text-[#F5DCE8]" />
                </div>
                <div className="mt-5 space-y-2">
                  {[
                    ['01', 'Capture', 'Record or enter the operating input.'],
                    ['02', 'Organize', 'Extract the important facts and group the work.'],
                    ['03', 'Review', 'Make assumptions, gaps, and decisions visible.'],
                    ['04', 'Apply', 'Produce the scope, update, estimate, or next action.'],
                  ].map(([number, title, body]) => (
                    <div key={title} className="grid grid-cols-[36px_1fr] gap-3 border-b border-white/10 py-3 last:border-0">
                      <span className="font-mono text-[10px] text-[#D9A9C2]">{number}</span>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {unifiedPrototype.resources.map((resource, index) => (
              <motion.article key={resource.title} {...reveal} transition={{ ...reveal.transition, delay: index * .06 }} className="group flex min-h-72 flex-col border border-neutral-200 bg-white p-6 transition hover:border-[#A66589] hover:shadow-[0_20px_70px_rgba(61,31,51,.1)]">
                <div className="flex items-start justify-between gap-4">
                  <PrototypeEyebrow tone="clara">{resource.type}</PrototypeEyebrow>
                  <span className="font-mono text-[10px] text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 className="mt-12 max-w-lg text-3xl font-medium leading-[1.04] tracking-[-.04em]">{resource.title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-600">{resource.description}</p>
                <Link to={index === 1 ? '/prototype/guide' : '/prototype/resources'} className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#3D1F33]">
                  {resource.action}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedGuidePage() {
  const sections = [
    ['1. Define the reporting window', 'Choose the job, time period, approved communication sources, and intended reader before summarizing anything.'],
    ['2. Recover the decisions', 'Identify customer requests, commitments, scope changes, approvals, and decisions that affect cost, schedule, or responsibility.'],
    ['3. Separate status from activity', 'List what was completed, what remains active, what is blocked, and which items are waiting for a decision.'],
    ['4. Assign the next action', 'Every open item should identify an owner, expected result, dependency, and target date where one exists.'],
    ['5. Preserve the evidence', 'Link the update back to the approved message, document, call note, or project record that supports the statement.'],
  ];

  return (
    <UnifiedSiteShell>
      <Seo title="B2W Operator Guide Prototype" description="A reusable B2W guide template for turning job communication into an owner update." canonicalPath="/prototype/guide" robots="noindex, nofollow" />
      <main>
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
            <PrototypeEyebrow tone="clara">Operator guide / Project communication</PrototypeEyebrow>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[.88] tracking-[-.065em]">Turn job communication into an owner update.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-600">A reusable guide structure for organizing decisions, completed work, open gates, risks, and next actions from approved project communication.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span className="inline-flex min-h-8 items-center rounded-full border border-neutral-200 px-3 text-[10px] font-semibold uppercase tracking-[.14em] text-neutral-500">8 minute read</span>
              <span className="inline-flex min-h-8 items-center rounded-full border border-neutral-200 px-3 text-[10px] font-semibold uppercase tracking-[.14em] text-neutral-500">Owner + PM</span>
              <span className="inline-flex min-h-8 items-center rounded-full border border-neutral-200 px-3 text-[10px] font-semibold uppercase tracking-[.14em] text-neutral-500">Template included</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <PrototypeEyebrow>In this guide</PrototypeEyebrow>
            <nav className="mt-5 space-y-1" aria-label="Guide contents">
              {sections.map(([title], index) => (
                <a key={title} href={`#guide-${index + 1}`} className="block border-l border-neutral-200 py-2 pl-4 text-sm text-neutral-500 transition hover:border-black hover:text-black">{title}</a>
              ))}
              <a href="#guide-template" className="block border-l border-neutral-200 py-2 pl-4 text-sm text-neutral-500 transition hover:border-black hover:text-black">Owner update template</a>
            </nav>
          </aside>

          <article className="max-w-3xl">
            <div className="border-l-4 border-[#D8B536] bg-[#FFFBEA] p-5">
              <p className="text-sm font-semibold text-neutral-900">Use communication as evidence, not as the final operating record.</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">The goal is not to repeat every message. The goal is to convert approved communication into a concise, reviewable statement of condition and action.</p>
            </div>

            <div className="mt-12 space-y-14">
              {sections.map(([title, body], index) => (
                <section key={title} id={`guide-${index + 1}`} className="scroll-mt-28 border-b border-neutral-200 pb-12">
                  <PrototypeEyebrow>{String(index + 1).padStart(2, '0')}</PrototypeEyebrow>
                  <h2 className="mt-5 text-3xl font-medium tracking-[-.04em] sm:text-4xl">{title}</h2>
                  <p className="mt-5 text-base leading-8 text-neutral-600">{body}</p>
                  <div className="mt-6 border border-neutral-200 bg-white p-5">
                    <p className="text-[10px] font-mono uppercase tracking-[.18em] text-neutral-400">Review question</p>
                    <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">
                      {[
                        'Does everyone understand what period and sources this update covers?',
                        'Which statement changes cost, schedule, scope, responsibility, or customer expectation?',
                        'Can the reader distinguish completed work from ongoing activity and unresolved decisions?',
                        'Is every open item owned, dated, and connected to the condition preventing completion?',
                        'Could another reviewer find the source that supports this statement?',
                      ][index]}
                    </p>
                  </div>
                </section>
              ))}
            </div>

            <section id="guide-template" className="scroll-mt-28 pt-14">
              <PrototypeEyebrow tone="active">Reusable output</PrototypeEyebrow>
              <h2 className="mt-5 text-4xl font-medium tracking-[-.045em]">Owner update template</h2>
              <div className="mt-8 border border-neutral-300 bg-white">
                {[
                  ['Reporting window', 'Job name · dates covered · approved sources'],
                  ['Current condition', 'One sentence stating overall status and the most important change'],
                  ['Completed', 'Work completed during the reporting window'],
                  ['Active', 'Work currently underway and expected result'],
                  ['Open gates', 'Items awaiting approval, information, material, access, or another dependency'],
                  ['Risk', 'Conditions that could affect cost, schedule, quality, safety, or customer expectations'],
                  ['Next actions', 'Action · owner · target date · supporting source'],
                ].map(([label, example], index) => (
                  <div key={label} className={`grid gap-3 p-5 sm:grid-cols-[160px_1fr] ${index ? 'border-t border-neutral-200' : ''}`}>
                    <p className="text-[10px] font-mono uppercase tracking-[.16em] text-neutral-400">{label}</p>
                    <p className="text-sm leading-6 text-neutral-600">{example}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrototypeButton to="/prototype/jasonai" tone="jason">See JasonAI</PrototypeButton>
                <PrototypeButton to="/prototype/resources" tone="secondary">Back to resources</PrototypeButton>
              </div>
            </section>
          </article>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}
