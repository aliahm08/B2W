import type { ReactNode } from 'react';
import { Bot, ChartNoAxesCombined, RadioTower } from 'lucide-react';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import { projectPageHeaderClassName, projectPageShellClassName } from '../../components/projectPageLayout';
import { getUyghurEatsRoutes } from './uyghurEatsRoutes';

type FieldBossShellProps = {
  active: 'chatbot' | 'manager' | 'dashboard';
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

const fieldBossTabs = [
  { id: 'chatbot', label: 'Chatbot', icon: Bot, to: getUyghurEatsRoutes().fieldBossChatbot },
  { id: 'manager', label: 'AI Agent Manager', icon: RadioTower, to: getUyghurEatsRoutes().fieldBossManager },
  { id: 'dashboard', label: 'AI Dashboard', icon: ChartNoAxesCombined, to: getUyghurEatsRoutes().fieldBossDashboard },
] as const;

export function FieldBossShell({ active, eyebrow, title, intro, children }: FieldBossShellProps) {
  const routes = getUyghurEatsRoutes();
  const navItems: ClientNavAction[] = [
    { label: 'Proposal', to: routes.proposal },
    { label: 'Profile', to: routes.profile },
    { label: 'Valuation', to: routes.valuation },
    { label: 'Documentation', to: routes.dataRoom },
    { label: 'Terms', to: routes.terms },
  ];

  return (
    <div className="min-h-screen bg-[#061017] text-white selection:bg-cyan-200/20 selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at 12% 14%, rgba(93, 197, 255, 0.1), transparent 28%), radial-gradient(circle at 84% 12%, rgba(241, 196, 91, 0.08), transparent 24%), linear-gradient(180deg, #061017 0%, #07131b 52%, #061017 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <ClientNavbar clientName="Uyghur Eats" clientLink={routes.proposal} navItems={navItems} theme="dark" hasFieldBoss={true} />
      <article className={`${projectPageShellClassName} relative z-10 text-white`}>
        <header className={`${projectPageHeaderClassName} border-white/10 pb-10`}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch lg:gap-6">
            <div className="grid content-start gap-3 md:grid-cols-2 md:gap-4">
              <div className="md:col-span-2">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-300/70">{eyebrow}</p>
                <h1 className="max-w-[13ch] text-[2.2rem] font-medium leading-[0.98] tracking-tight text-white sm:max-w-none sm:text-5xl md:text-6xl">
                  {title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-xl md:leading-8">{intro}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-2 md:contents">
                {fieldBossTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = active === tab.id;

                  return (
                    <div
                      key={tab.id}
                      className={`border p-4 text-sm leading-6 ${isActive ? 'border-cyan-300/40 bg-cyan-300/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-200' : 'text-slate-500'}`} />
                        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{tab.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="flex h-full flex-col border border-white/10 bg-[#08131b] p-5 text-white sm:p-6 md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-slate-500">FieldBoss principles</p>
              <h2 className="mb-5 max-w-md text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:mb-6 md:text-3xl">
                Match the proposal’s clarity, but use a darker operational language for AI-driven workflows.
              </h2>
              <div className="mt-auto space-y-3 border-y border-white/10 py-4 md:py-5">
                <p className="text-sm leading-6 text-slate-300">Helpful and conversational without dragging out the answer.</p>
                <p className="text-sm leading-6 text-slate-300">Scrupulous about what it knows, what it inferred, and what it should verify.</p>
                <p className="text-sm leading-6 text-slate-300">Private by default, with clear data boundaries and accountable workflows.</p>
                <p className="text-sm leading-6 text-slate-300">Explanatory when needed, concise when speed matters.</p>
              </div>
            </aside>
          </div>
        </header>

        <main className="space-y-12">
          {children}
        </main>
      </article>
    </div>
  );
}
