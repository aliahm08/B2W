import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  ListChecks,
  LogIn,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WIcon from '../../components/logo/B2WIcon';
import Seo from '../../components/Seo';
import InternalDocumentNav from '../../components/internal/InternalDocumentNav';

class InternalWorkspaceErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Internal workspace failed to render.', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[#F5F1E8] px-5 text-[#223C33]">
        <Seo
          title="B2W Internal Workspace"
          description="Private B2W internal workspace."
          robots="noindex, nofollow"
          canonicalPath="/internal"
        />
        <section className="w-full max-w-xl rounded-[2rem] border border-[#223C33]/15 bg-white/70 p-8 shadow-[0_30px_90px_rgba(34,60,51,0.14)] backdrop-blur sm:p-10">
          <B2WIcon title="" className="h-11 w-12 text-[#223C33]" />
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#997022]">
            Workspace recovery
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
            This workspace could not finish loading.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#223C33]/60">
            Reload the current workspace to fetch the latest application files.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-11 rounded-full bg-[#223C33] px-5 text-sm font-semibold text-white"
            >
              Reload workspace
            </button>
            <Link
              to="/internal"
              className="inline-flex min-h-11 items-center rounded-full border border-[#223C33]/15 px-5 text-sm font-semibold"
            >
              Return to internal home
            </Link>
          </div>
        </section>
      </main>
    );
  }
}

function InternalHub() {
  const destinations = [
    {
      label: 'Services · Business Plan',
      title: 'Strategy, Systems, Implementation',
      description:
        'Review direction, commercial systems, ownership, and implementation progress.',
      to: '/internal/business-plan',
      Icon: LayoutDashboard,
      tone: 'bg-[#223C33] text-white',
      iconTone: 'text-[#D8B56A]',
    },
    {
      label: 'Products · Pre-launch',
      title: 'JasonAI',
      description:
        'Review the Gurge product structure, JasonAI phases, metrics, and supporting documents.',
      to: '/internal/portal',
      Icon: ListChecks,
      tone: 'bg-white text-[#17221E]',
      iconTone: 'text-[#997022]',
      portal: true,
    },
    {
      label: 'Resources',
      title: 'Prioritized Plan',
      description:
        'Move JasonAI from its current demo through repeatable deployment and controlled launch.',
      to: '/internal/resources',
      Icon: BookOpen,
      tone: 'bg-[#EDE4D1] text-[#17221E]',
      iconTone: 'text-[#997022]',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#17221E]">
      <Seo
        title="B2W Executive Strategy"
        description="Private B2W business plan, product direction, and executive strategy resources."
        robots="noindex, nofollow"
        canonicalPath="/internal"
      />
      <header className="border-b border-[#223C33]/12 bg-[#F8F5EE]/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <B2WIcon title="" className="h-9 w-10 text-[#223C33]" />
            <div>
              <p className="b2w-wordmark text-xs font-semibold tracking-[0.17em]">B2W</p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#223C33]/42">Executive strategy</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/65 px-4 text-xs font-semibold transition hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            B2W home
          </Link>
        </div>
        <InternalDocumentNav />
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#997022]">Executive Strategy</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-7xl">
          Our mission is to improve communication and optimize actionable insights.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-[#223C33]/62 sm:text-lg">
          We help small and midsize business owners by providing a WhatsApp-based AI assistant that can summarize, search, and act.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {destinations.map(({ label, title, description, to, Icon, tone, iconTone, portal }) => {
            const content = (
              <>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-current/15 bg-current/5">
                  <Icon className={`h-5 w-5 ${iconTone}`} />
                </span>
                {portal ? (
                  <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                ) : (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </div>
              <div>
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] opacity-45">{label}</p>
                <h2 className="text-3xl font-medium tracking-[-0.04em]">{title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 opacity-60">{description}</p>
              </div>
              </>
            );
            const className = `group flex min-h-72 flex-col justify-between rounded-[2rem] border border-[#223C33]/12 p-7 shadow-[0_24px_70px_rgba(34,60,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_85px_rgba(34,60,51,0.14)] sm:p-8 ${tone}`;

            return (
              <Link key={to} to={to} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function InternalAccessGate({ children }: { children?: ReactNode }) {
  return (
    <InternalWorkspaceErrorBoundary>
      {children ?? <InternalHub />}
    </InternalWorkspaceErrorBoundary>
  );
}
