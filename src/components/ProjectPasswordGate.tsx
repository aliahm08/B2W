import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjectAccessStatus,
  getProtectedProject,
  hasGrantedView,
  isProjectAccessGranted,
  logoutProjectAccess,
  type ProjectAccessStatus,
  type ProjectAccessView,
} from '../content/projectAccess';
import ProjectAccessPrompt from './ProjectAccessPrompt';
import Seo from './Seo';

type ProjectPasswordGateProps = {
  path: string;
  title: string;
  subtitle: string;
  overlayTop?: number;
  children: ReactNode;
};

const accessLabels: Record<ProjectAccessView, string> = {
  proposal: 'Proposal View',
  profile: 'Analysis Profile View',
};

const emptyStatus: ProjectAccessStatus = {
  scopeId: null,
  accessLevel: 'locked',
  grantedLevels: [],
  currentView: null,
  availableViews: {},
  title: '',
};

export default function ProjectPasswordGate({
  path,
  title,
  subtitle,
  children,
}: ProjectPasswordGateProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ProjectAccessStatus>(emptyStatus);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [preferredMethod, setPreferredMethod] = useState<ProjectAccessView | undefined>(undefined);
  const protectedProject = useMemo(() => getProtectedProject(path), [path]);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      setIsCheckingAccess(true);

      try {
        const nextStatus = await fetchProjectAccessStatus(path);
        if (!isActive) {
          return;
        }

        setStatus(nextStatus);
        window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, status: nextStatus } }));
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    void checkAccess();

    return () => {
      isActive = false;
    };
  }, [path]);

  const currentView = protectedProject?.view ?? null;

  if (currentView && isProjectAccessGranted(status.accessLevel)) {
    const otherViewEntries = (Object.entries(protectedProject?.routes ?? {}) as Array<[ProjectAccessView, string]>)
      .filter(([view, routePath]) => Boolean(routePath) && view !== currentView);

    return (
      <>
        <div className="pointer-events-none fixed right-4 top-24 z-40 flex justify-end px-4">
          <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2 rounded-3xl border border-black bg-white/92 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {currentView ? accessLabels[currentView] : 'Access Granted'}
            </div>

            {otherViewEntries.map(([view, routePath]) => (
              hasGrantedView(status, view) ? (
                <button
                  key={view}
                  type="button"
                  onClick={() => navigate(routePath)}
                  className="border border-neutral-300 px-3 py-2 text-[10px] tracking-[0.22em] text-neutral-700 transition-colors hover:border-black hover:text-black"
                >
                  Open {accessLabels[view]}
                </button>
              ) : (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    setPreferredMethod(view);
                    setIsPromptOpen(true);
                  }}
                  className="border border-neutral-300 px-3 py-2 text-[10px] tracking-[0.22em] text-neutral-700 transition-colors hover:border-black hover:text-black"
                >
                  Unlock {accessLabels[view]}
                </button>
              )
            ))}

            <button
              type="button"
              onClick={() => {
                void logoutProjectAccess(path).then((nextStatus) => {
                  setStatus(nextStatus);
                  window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, status: nextStatus } }));
                });
              }}
              className="border border-neutral-300 px-3 py-2 text-[10px] tracking-[0.22em] text-neutral-700 transition-colors hover:border-black hover:text-black"
            >
              Sign Out
            </button>
          </div>
        </div>
        {children}
        <ProjectAccessPrompt
          isOpen={isPromptOpen}
          path={path}
          title={protectedProject?.maskedTitle ?? title}
          subtitle={subtitle}
          initialMethod={preferredMethod}
          onClose={() => setIsPromptOpen(false)}
          onStatusChange={(nextStatus) => setStatus(nextStatus)}
        />
      </>
    );
  }

  return (
    <section data-project-locked="true" className="relative min-h-screen text-black">
      <Seo
        title={protectedProject?.maskedSeoTitle ?? 'Confidential Project'}
        description={protectedProject?.maskedSeoDescription ?? 'This project is access-controlled.'}
        robots="noindex, nofollow"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.15fr)_420px]">
          <div className="border border-neutral-200 bg-white p-8 md:p-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
              {protectedProject?.teaserEyebrow ?? 'Access-Controlled Project'}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-medium tracking-tight text-black md:text-6xl">
              {protectedProject?.teaserHeadline ?? 'Client identity and supporting details are hidden until access is verified.'}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
              {protectedProject?.teaserSummary ?? 'Enter an approved email or project password to reveal the full documentation.'}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 bg-neutral-50 p-5"
                >
                  <div className="h-3 w-24 bg-neutral-200" />
                  <div className="mt-4 space-y-3 blur-sm">
                    <div className="h-5 w-11/12 bg-neutral-300" />
                    <div className="h-5 w-9/12 bg-neutral-300" />
                    <div className="h-4 w-full bg-neutral-200" />
                    <div className="h-4 w-10/12 bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="border border-neutral-900 bg-neutral-950 p-8 text-white md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-300">
              <LockKeyhole className="h-4 w-4" />
              Confidential
            </div>

            <div className="mt-8 space-y-5">
              <div className="border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Business name</p>
                <p className="mt-3 text-lg font-medium">{protectedProject?.maskedTitle ?? title}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">View options</p>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Proposal and profile routes are authenticated separately, and the session stays available across linked pages until you sign out.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        {!isCheckingAccess ? (
          <button
            type="button"
            onClick={() => {
              setPreferredMethod(protectedProject?.view);
              setIsPromptOpen(true);
            }}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black bg-black px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            <LockKeyhole className="h-4 w-4" />
            Choose viewing option
          </button>
        ) : null}
      </div>
      <ProjectAccessPrompt
        isOpen={isPromptOpen}
        path={path}
        title={protectedProject?.maskedTitle ?? title}
        subtitle={subtitle}
        initialMethod={preferredMethod}
        onClose={() => setIsPromptOpen(false)}
        onStatusChange={(nextStatus) => setStatus(nextStatus)}
      />
    </section>
  );
}
