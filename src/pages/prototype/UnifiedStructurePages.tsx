import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  FileSearch,
  Layers3,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
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
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.48, ease: workspaceBrandSystem.motion.defaultEase },
};

function PageIntro({
  eyebrow,
  title,
  description,
  tone = 'neutral',
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: 'neutral' | 'jason' | 'clara' | 'active';
}) {
  return (
    <section className="border-b border-neutral-200 bg-[var(--b2w-canvas)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <PrototypeEyebrow tone={tone}>{eyebrow}</PrototypeEyebrow>
        <h1 className="mt-7 max-w-5xl text-[clamp(3.4rem,8vw,7.4rem)] font-medium leading-[0.86] tracking-[-0.07em]">{title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">{description}</p>
      </div>
    </section>
  );
}

function StatusLabel({ status }: { status: string }) {
  const available = status === 'Available now';
  const future = status === 'Future' || status === 'Planned';
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.14em] ${
        available
          ? 'bg-[#4F7F52] text-white'
          : future
            ? 'bg-neutral-200 text-neutral-600'
            : 'bg-[#D8B536] text-neutral-950'
      }`}
    >
      {status}
    </span>
  );
}

export function UnifiedStructuredHomePage() {
  return (
    <UnifiedSiteShell>
      <Seo
        title="B2W Unified Website Prototype"
        description="B2W services, products, resources, company information, and contact paths in one operating system."
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
              <PrototypeEyebrow tone="active">B2W / Systems for contracting businesses</PrototypeEyebrow>
              <h1 className="mt-8 max-w-[10ch] text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.08em]">
                {unifiedPrototype.promise}
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">{unifiedPrototype.description}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <PrototypeButton to="/prototype/products" size="large">Explore products</PrototypeButton>
                <PrototypeButton to="/prototype/services" tone="secondary" size="large">View services</PrototypeButton>
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
                  <PrototypeEyebrow>Website structure</PrototypeEyebrow>
                  <p className="mt-2 text-sm font-semibold">One B2W operating system.</p>
                </div>
                <Layers3 className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="mt-5 space-y-1">
                {unifiedPrototype.navigation.map((item, index) => (
                  <div key={item.to} className="border-b border-neutral-100 py-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
                      <Link to={item.to} className="text-sm font-semibold hover:underline">{item.label}</Link>
                    </div>
                    {'children' in item && item.children ? (
                      <div className="ml-8 mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        {item.children.map((child) => (
                          <Link key={child.to} to={child.to} className="text-xs text-neutral-500 hover:text-black">{child.label}</Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <motion.div {...reveal} className="grid gap-6 border-b border-neutral-200 pb-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <PrototypeEyebrow>01 / Primary paths</PrototypeEyebrow>
            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">Services improve the business. Products improve the work. Resources improve understanding.</h2>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { title: 'Services', label: 'Business improvement', body: 'Growth, optimization, and diligence organized around the operating condition.', to: '/prototype/services', tone: 'bg-neutral-950 text-white' },
              { title: 'Products', label: 'Agents and workflows', body: 'Specialized assistants, defined operating workflows, and transparent pricing.', to: '/prototype/products', tone: 'bg-[#24130E] text-[#FFF7ED]' },
              { title: 'Resources', label: 'Guides and demonstrations', body: 'Practical tools that show how information becomes a reviewable next action.', to: '/prototype/resources', tone: 'bg-[#3D1F33] text-[#FFF8FB]' },
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

        <section className="border-y border-neutral-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
            <div>
              <PrototypeEyebrow>02 / Workspace behavior</PrototypeEyebrow>
              <h2 className="mt-7 max-w-3xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">The website behaves like a useful workspace.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">The structure stays visible. Search recovers the right page or resource. Buttons communicate action priority. The Clara mark identifies B2W across every context.</p>
            </div>
            <div className="grid gap-3">
              {[
                [Search, 'Search', 'Command search covers services, products, workflows, pricing, resources, and company pages.'],
                [ArrowRight, 'Buttons', 'Primary, secondary, JasonAI, and resource actions follow one hierarchy.'],
                [Layers3, 'Structure', 'A shared header, footer, grid, content progression, and page width hold the system together.'],
              ].map(([Icon, title, body]) => {
                const Component = Icon as typeof Search;
                return (
                  <div key={String(title)} className="grid grid-cols-[44px_1fr] gap-4 border border-neutral-200 p-5">
                    <span className="grid h-11 w-11 place-items-center bg-neutral-950 text-white"><Component className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-semibold">{String(title)}</p>
                      <p className="mt-2 text-xs leading-5 text-neutral-500">{String(body)}</p>
                    </div>
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

export function UnifiedProductsPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="B2W Products Prototype" description="B2W agents, workflows, and pricing." canonicalPath="/prototype/products" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Products / Agents, workflows, pricing"
          title="Products built around the work—not around another dashboard."
          description="B2W products combine specialized assistants with defined workflows and clear capability boundaries. JasonAI is the first commercial product in this system."
          tone="jason"
        />
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {unifiedPrototype.productCategories.map((category, index) => (
              <motion.article key={category.name} {...reveal} transition={{ ...reveal.transition, delay: index * 0.07 }} className="group flex min-h-[25rem] flex-col border border-neutral-200 bg-white p-6 transition hover:border-neutral-500 hover:shadow-[0_20px_70px_rgba(0,0,0,.08)]">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-neutral-300">{category.number}</span>
                  <ArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-black" />
                </div>
                <h2 className="mt-14 text-4xl font-medium tracking-[-0.05em]">{category.name}</h2>
                <p className="mt-5 text-base font-medium leading-6">{category.statement}</p>
                <p className="mt-4 text-sm leading-6 text-neutral-500">{category.description}</p>
                <Link to={category.to} className="mt-auto pt-8 text-sm font-semibold">Explore {category.name}</Link>
              </motion.article>
            ))}
          </div>
        </section>
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <PrototypeEyebrow tone="jason">Current product</PrototypeEyebrow>
            <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <h2 className="max-w-4xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">JasonAI makes approved job communication searchable and summarizable.</h2>
                <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-400">It is designed for contracting businesses using WhatsApp and other approved communication sources to coordinate active work.</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <PrototypeButton to="/prototype/products/agents" tone="jason">View agents</PrototypeButton>
                <PrototypeButton to="/prototype/products/pricing" tone="secondary">View pricing</PrototypeButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedAgentsPage() {
  return (
    <UnifiedSiteShell theme="dark">
      <Seo title="B2W Agents Prototype" description="JasonAI and the B2W specialized-agent product model." canonicalPath="/prototype/products/agents" robots="noindex, nofollow" />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(circle at 18% 18%,rgba(178,74,36,.34),transparent 32%),radial-gradient(circle at 82% 24%,rgba(37,211,102,.12),transparent 25%)' }} />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 sm:py-32 lg:px-8">
            <PrototypeEyebrow tone="jason">Products / Agents</PrototypeEyebrow>
            <h1 className="mt-8 max-w-[12ch] text-[clamp(3.8rem,9vw,8rem)] font-medium leading-[.84] tracking-[-.075em] text-[#FFF7ED]">Specialized assistants for real operating work.</h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#F4B28C] sm:text-xl">Agents live close to the workflow, use approved business context, and stay explicit about what they can do now versus what is planned.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {unifiedPrototype.agents.map((agent, index) => (
              <article key={agent.name} className={`flex min-h-[27rem] flex-col border p-6 sm:p-8 ${index === 0 ? 'border-[#B24A24] bg-[#24130E]' : 'border-white/10 bg-white/[.03]'}`}>
                <div className="flex items-start justify-between gap-4">
                  <PrototypeEyebrow tone={index === 0 ? 'jason' : 'neutral'}>{agent.role}</PrototypeEyebrow>
                  <StatusLabel status={agent.status} />
                </div>
                <h2 className="mt-14 text-5xl font-medium tracking-[-.055em] text-white">{agent.name}</h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-400">{agent.description}</p>
                {index === 0 ? (
                  <div className="mt-auto flex flex-wrap gap-3 pt-10">
                    <PrototypeButton to="/prototype/products/workflows" tone="jason">See workflows</PrototypeButton>
                    <PrototypeButton to="/prototype/products/pricing" tone="secondary">See pricing</PrototypeButton>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <PrototypeEyebrow>Agent rules</PrototypeEyebrow>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [MessageCircle, 'Work where the team works', 'The interface should fit the existing communication pattern before asking people to adopt another system.'],
                [FileSearch, 'Use approved context', 'Search and output remain grounded in business-selected sources and visible evidence.'],
                [ShieldCheck, 'Keep control reviewable', 'Important financial, contractual, safety, and customer actions remain permissioned and reviewable.'],
              ].map(([Icon, title, body]) => {
                const Component = Icon as typeof MessageCircle;
                return (
                  <div key={String(title)} className="border border-white/10 p-6">
                    <Component className="h-5 w-5 text-[#F4B28C]" />
                    <h3 className="mt-8 text-xl font-medium text-white">{String(title)}</h3>
                    <p className="mt-4 text-sm leading-6 text-neutral-400">{String(body)}</p>
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

export function UnifiedWorkflowsPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="B2W Workflows Prototype" description="Current, developing, and future B2W product workflows." canonicalPath="/prototype/products/workflows" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Products / Workflows"
          title="A workflow connects the business input to a reviewable result."
          description="Each product workflow defines the source, transformation, output, capability status, and point of human review. This keeps the product credible and the operating result understandable."
          tone="active"
        />
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="border border-neutral-200 bg-white">
            {unifiedPrototype.workflows.map((workflowItem, index) => (
              <article key={workflowItem.title} className={`grid gap-5 p-6 sm:p-8 lg:grid-cols-[70px_220px_1fr_1fr] lg:items-center ${index ? 'border-t border-neutral-200' : ''}`}>
                <span className="font-mono text-xs text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <StatusLabel status={workflowItem.status} />
                  <h2 className="mt-4 text-xl font-medium">{workflowItem.title}</h2>
                </div>
                <div className="border-t border-neutral-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <PrototypeEyebrow>Input</PrototypeEyebrow>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{workflowItem.input}</p>
                </div>
                <div className="border-t border-neutral-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <PrototypeEyebrow>Output</PrototypeEyebrow>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{workflowItem.output}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_360px] lg:px-8">
            <div>
              <PrototypeEyebrow>Workflow structure</PrototypeEyebrow>
              <h2 className="mt-7 max-w-3xl text-4xl font-medium leading-[.98] tracking-[-.045em] sm:text-6xl">Source → context → transformation → review → action.</h2>
            </div>
            <div className="flex flex-col justify-end">
              <Workflow className="h-8 w-8 text-[#D8B536]" />
              <p className="mt-6 text-sm leading-7 text-neutral-400">This sequence becomes the shared pattern for product demonstrations, implementation documentation, and future workflow automation.</p>
            </div>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedPricingPage() {
  const plans = [unifiedPrototype.pricing.standard, unifiedPrototype.pricing.earlyAccess];
  return (
    <UnifiedSiteShell>
      <Seo title="B2W Pricing Prototype" description="JasonAI standard and early-access pricing." canonicalPath="/prototype/products/pricing" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Products / Pricing"
          title="Pricing tied to the product that exists today."
          description="JasonAI pricing separates standard commercial terms from limited early-access participation. Future workflow and automation packages will be priced only after their capability and value are proven."
          tone="jason"
        />
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {plans.map((plan, index) => (
              <article key={plan.name} className={`flex min-h-[31rem] flex-col border p-6 sm:p-8 ${index === 1 ? 'border-[#B24A24] bg-[#FFF7ED]' : 'border-neutral-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-4">
                  <PrototypeEyebrow tone={index === 1 ? 'jason' : 'neutral'}>{index === 1 ? 'Selected pre-launch businesses' : 'Commercial reference'}</PrototypeEyebrow>
                  {index === 1 ? <span className="rounded-full bg-[#B24A24] px-3 py-1 text-[9px] font-semibold uppercase tracking-[.14em] text-white">Limited</span> : null}
                </div>
                <h2 className="mt-12 text-4xl font-medium tracking-[-.05em]">{plan.name}</h2>
                <p className="mt-8 text-5xl font-medium tracking-[-.055em]">{plan.monthly}</p>
                <p className="mt-3 text-base font-semibold text-neutral-500">{plan.setup}</p>
                <p className="mt-8 max-w-xl text-sm leading-7 text-neutral-600">{plan.description}</p>
                <div className="mt-auto pt-10">
                  <PrototypeButton to="/prototype/contact" tone={index === 1 ? 'jason' : 'primary'}>Discuss this package</PrototypeButton>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 border-l-4 border-[#D8B536] bg-[#FFFBEA] p-5">
            <p className="text-sm font-semibold">Capability boundary</p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-600">Pricing shown here supports the core JasonAI communication search and summary product. In-development and future workflows are shown for direction and are not represented as generally available features.</p>
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedAboutPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="About B2W Prototype" description="B2W company purpose, approach, audience, and operating principles." canonicalPath="/prototype/about" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="About / B2W"
          title={unifiedPrototype.about.statement}
          description={unifiedPrototype.about.description}
          tone="active"
        />
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {unifiedPrototype.about.principles.map((principle, index) => (
              <motion.article key={principle} {...reveal} transition={{ ...reveal.transition, delay: index * .06 }} className="min-h-64 border border-neutral-200 bg-white p-6">
                <span className="font-mono text-xs text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-16 max-w-lg text-2xl font-medium leading-[1.15] tracking-[-.035em]">{principle}</p>
              </motion.article>
            ))}
          </div>
        </section>
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-3 lg:px-8">
            {[
              ['Who we serve', 'Small and midsize contracting businesses, general contractors, and operators managing fragmented project communication and growing operational complexity.'],
              ['What we combine', 'Business strategy, product design, workflow discovery, documentation, software implementation, and applied AI.'],
              ['How we work', 'Establish the condition, organize the evidence, design the response, implement the system, and document the next operating gate.'],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-white/15 pt-6">
                <h2 className="text-xl font-medium">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-400">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}

export function UnifiedContactPage() {
  return (
    <UnifiedSiteShell>
      <Seo title="Contact B2W Prototype" description="Start a B2W business review or JasonAI conversation." canonicalPath="/prototype/contact" robots="noindex, nofollow" />
      <main>
        <PageIntro
          eyebrow="Contact / Start with the condition"
          title="Tell us what is unclear, repeated, or getting missed."
          description="A useful first conversation identifies the business condition, current workflow, decision owner, and the result that would justify changing the system."
          tone="active"
        />
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="flex min-h-[28rem] flex-col border border-neutral-200 bg-white p-6 sm:p-8">
              <PrototypeEyebrow>Services</PrototypeEyebrow>
              <h2 className="mt-12 text-4xl font-medium tracking-[-.05em]">Begin a business review.</h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600">Use this path for growth, operational optimization, financial diligence, workflow design, business systems, and implementation work.</p>
              <div className="mt-auto pt-10">
                <PrototypeButton to="mailto:info@b2w-ai.com?subject=B2W%20Business%20Review">Email B2W</PrototypeButton>
              </div>
            </article>
            <article className="flex min-h-[28rem] flex-col border border-[#B24A24] bg-[#FFF7ED] p-6 sm:p-8">
              <PrototypeEyebrow tone="jason">Products</PrototypeEyebrow>
              <h2 className="mt-12 text-4xl font-medium tracking-[-.05em]">Discuss JasonAI.</h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600">Use this path to discuss communication search, job summaries, approved source access, early-access participation, setup, or pricing.</p>
              <div className="mt-auto pt-10">
                <PrototypeButton to="mailto:info@b2w-ai.com?subject=JasonAI%20Inquiry" tone="jason">Contact JasonAI</PrototypeButton>
              </div>
            </article>
          </div>

          <div className="mt-10 grid gap-4 border border-neutral-200 bg-white p-6 sm:grid-cols-4 sm:p-8">
            {[
              ['01', 'Business condition', 'What is unclear, repeated, delayed, or currently dependent on one person?'],
              ['02', 'Existing workflow', 'Where does the team communicate, document, review, and make decisions today?'],
              ['03', 'Desired result', 'What should become faster, more reliable, more visible, or more valuable?'],
              ['04', 'Decision owner', 'Who will evaluate the result and decide whether the new system works?'],
            ].map(([number, title, body], index) => (
              <div key={title} className={`${index ? 'border-t border-neutral-200 pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0' : ''}`}>
                <p className="font-mono text-[10px] text-neutral-300">{number}</p>
                <p className="mt-5 text-sm font-semibold">{title}</p>
                <p className="mt-3 text-xs leading-5 text-neutral-500">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </UnifiedSiteShell>
  );
}
