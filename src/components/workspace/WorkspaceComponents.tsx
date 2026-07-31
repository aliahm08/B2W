import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import B2WLogoMark from '../B2WLogoMark';
import { workspaceBrandSystem, workspaceCssVariables } from '../../content/workspaceBrandSystem';

export type WorkspaceStatus = 'Active' | 'Complete' | 'At gate' | 'Blocked' | 'Planned';

type WorkspaceShellProps = {
  children: ReactNode;
};

type WorkspaceSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  id?: string;
  dark?: boolean;
};

type WorkspaceButtonProps = {
  children: ReactNode;
  to: string;
  tone?: 'primary' | 'secondary' | 'jason' | 'clara';
  external?: boolean;
};

const statusMap: Record<WorkspaceStatus, { background: string; foreground: string }> = {
  Active: { background: 'var(--b2w-active)', foreground: '#FFFFFF' },
  Complete: { background: 'var(--b2w-active)', foreground: '#FFFFFF' },
  'At gate': { background: 'var(--b2w-gate)', foreground: '#171717' },
  Blocked: { background: 'var(--b2w-risk)', foreground: '#FFFFFF' },
  Planned: { background: '#E7E5E4', foreground: '#44403C' },
};

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div
      className="min-h-screen bg-[var(--b2w-canvas)] text-[var(--b2w-ink)]"
      style={workspaceCssVariables as CSSProperties}
    >
      <WorkspaceHeader />
      {children}
      <WorkspaceFooter />
    </div>
  );
}

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--b2w-line)] bg-[color:var(--b2w-canvas)]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <B2WLogoMark wordmark="B2W" className="text-black" label="B2W home" />
          <span className="hidden text-neutral-300 sm:inline">/</span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 sm:inline">
            Workspace
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-600 md:flex" aria-label="Workspace sections">
          <a href="#foundation" className="transition hover:text-black">Foundation</a>
          <a href="#components" className="transition hover:text-black">Components</a>
          <a href="#voice" className="transition hover:text-black">Voice</a>
          <a href="#deployment" className="transition hover:text-black">Use guide</a>
        </nav>
        <Link
          to="/"
          className="inline-flex min-h-10 items-center gap-2 border border-neutral-300 bg-white px-4 text-xs font-semibold transition hover:border-black"
        >
          View website
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

export function WorkspaceFooter() {
  return (
    <footer className="border-t border-[var(--b2w-line)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">B2W workspace system</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
            One parent design language for consulting, products, resources, internal strategy, and client delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-neutral-500">
          <Link to="/services" className="transition hover:text-black">Services</Link>
          <Link to="/jasonai" className="transition hover:text-black">JasonAI</Link>
          <Link to="/clara" className="transition hover:text-black">Clara</Link>
          <a href="mailto:info@b2w-ai.com" className="transition hover:text-black">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export function WorkspaceSection({ eyebrow, title, description, children, id, dark = false }: WorkspaceSectionProps) {
  return (
    <section
      id={id}
      className={dark ? 'bg-neutral-950 text-white' : 'bg-[var(--b2w-canvas)] text-[var(--b2w-ink)]'}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: workspaceBrandSystem.motion.durations.reveal, ease: workspaceBrandSystem.motion.defaultEase }}
          className="grid gap-6 border-b border-current/15 pb-10 lg:grid-cols-[220px_minmax(0,1fr)]"
        >
          <p className={dark ? 'text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500' : 'text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400'}>
            {eyebrow}
          </p>
          <div>
            <h2 className="max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">{title}</h2>
            {description ? (
              <p className={dark ? 'mt-6 max-w-3xl text-base leading-7 text-neutral-400' : 'mt-6 max-w-3xl text-base leading-7 text-neutral-600'}>
                {description}
              </p>
            ) : null}
          </div>
        </motion.div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

export function WorkspaceButton({ children, to, tone = 'primary', external = false }: WorkspaceButtonProps) {
  const tones = {
    primary: 'border-black bg-black text-white hover:bg-neutral-800',
    secondary: 'border-neutral-300 bg-white text-black hover:border-black',
    jason: 'border-[#B24A24] bg-[#B24A24] text-white hover:bg-[#913B1D]',
    clara: 'border-[#A66589] bg-[#3D1F33] text-white hover:bg-[#5A2F49]',
  } as const;
  const className = `inline-flex min-h-11 items-center justify-center gap-2 border px-5 text-sm font-semibold transition ${tones[tone]}`;

  if (external) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function WorkspaceStatusPill({ status }: { status: WorkspaceStatus }) {
  const style = statusMap[status];
  return (
    <span
      className="inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.14em]"
      style={{ backgroundColor: style.background, color: style.foreground }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function WorkspaceMetricCard({ label, value, note, status }: { label: string; value: string; note: string; status?: WorkspaceStatus }) {
  return (
    <article className="flex min-h-52 flex-col border border-[var(--b2w-line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">{label}</p>
        {status ? <WorkspaceStatusPill status={status} /> : null}
      </div>
      <p className="mt-8 font-mono text-4xl tracking-[-0.05em] text-black">{value}</p>
      <p className="mt-auto pt-6 text-xs leading-5 text-neutral-500">{note}</p>
    </article>
  );
}

export function WorkspaceSourceCard({ number, title, route, contribution }: { number: string; title: string; route: string; contribution: string }) {
  return (
    <Link
      to={route}
      className="group flex min-h-64 flex-col border border-[var(--b2w-line)] bg-white p-5 transition hover:border-neutral-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-neutral-400">{number}</span>
        <ArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-black" />
      </div>
      <h3 className="mt-12 text-2xl font-medium tracking-[-0.035em]">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-neutral-600">{contribution}</p>
      <p className="mt-auto pt-8 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">{route}</p>
    </Link>
  );
}

export function WorkspaceJourney({ steps }: { steps: ReadonlyArray<{ title: string; description: string }> }) {
  return (
    <div className="grid border border-white/12 bg-white/[0.03] lg:grid-cols-5">
      {steps.map((step, index) => (
        <motion.article
          key={step.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, delay: index * 0.07, ease: workspaceBrandSystem.motion.defaultEase }}
          className={`min-h-64 p-5 ${index ? 'border-t border-white/12 lg:border-l lg:border-t-0' : ''}`}
        >
          <p className="font-mono text-[10px] text-[#D8B536]">{String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-12 text-xl font-medium tracking-[-0.03em]">{step.title}</h3>
          <p className="mt-4 text-sm leading-6 text-neutral-400">{step.description}</p>
        </motion.article>
      ))}
    </div>
  );
}
