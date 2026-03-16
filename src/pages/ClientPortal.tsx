import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarClock, ExternalLink, LifeBuoy, LogOut, Milestone, ShieldCheck } from 'lucide-react';
import Seo from '../components/Seo';
import {
  clientPortalGoogleClientId,
  fetchClientPortalStatus,
  loginClientPortal,
  logoutClientPortal,
  type ClientPortalStatus,
} from '../content/clientPortal';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const defaultStatus: ClientPortalStatus = {
  authenticated: false,
  account: null,
  profile: null,
  loginEnabled: Boolean(clientPortalGoogleClientId),
};

function formatDate(value: string): string {
  if (!value) {
    return 'TBD';
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function ProjectStatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white/80 px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">{label}</p>
      <p className="mt-3 text-base font-medium text-neutral-950">{value || 'TBD'}</p>
    </div>
  );
}

export default function ClientPortal() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<ClientPortalStatus>(defaultStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    void fetchClientPortalStatus()
      .then((nextStatus) => {
        if (!isActive) {
          return;
        }

        setStatus(nextStatus);
        setError(nextStatus.error ?? '');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (status.authenticated || !buttonRef.current || !clientPortalGoogleClientId) {
      return;
    }

    let isCancelled = false;
    let script = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');

    const setupButton = () => {
      if (isCancelled || !buttonRef.current || !window.google?.accounts?.id) {
        return;
      }

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: clientPortalGoogleClientId,
        callback: ({ credential }) => {
          if (!credential) {
            setError('Google did not return a credential.');
            return;
          }

          void loginClientPortal(credential).then((nextStatus) => {
            setStatus(nextStatus);
            setError(nextStatus.error ?? '');
          });
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signin_with',
        shape: 'pill',
      });
    };

    if (window.google?.accounts?.id) {
      setupButton();
      return () => {
        isCancelled = true;
      };
    }

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = 'true';
      document.head.appendChild(script);
    }

    script.addEventListener('load', setupButton);

    return () => {
      isCancelled = true;
      script?.removeEventListener('load', setupButton);
    };
  }, [status.authenticated]);

  const account = status.account;
  const profile = status.profile;

  return (
    <>
      <Seo
        title="Client Portal"
        description="Secure client workspace with Google SSO for project status, milestones, documents, and support contacts."
      />

      <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.08),_transparent_34%),linear-gradient(180deg,_#f6f1e8_0%,_#f4f4ef_44%,_#ffffff_100%)] pt-28 text-neutral-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
            <div className="overflow-hidden rounded-[36px] border border-black/10 bg-white/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
                <ShieldCheck className="h-4 w-4" />
                Google SSO Client Portal
              </div>

              <h1 className="mt-6 max-w-3xl font-serif text-5xl tracking-tight text-neutral-950 md:text-6xl">
                One secure workspace for status, deliverables, and the next decision.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-700 md:text-lg">
                Clients sign in with an approved Google account. Sessions are verified server-side before any portal data is returned.
              </p>

              {!status.authenticated ? (
                <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-5 rounded-[28px] border border-black/10 bg-[#111111] p-7 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Access flow</p>
                    <p className="text-2xl font-medium">Use your approved Google account to enter the portal.</p>
                    <p className="text-sm leading-6 text-neutral-300">
                      The browser only sends the Google credential to the server. The server verifies the token audience and approved email before creating a signed session cookie.
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-neutral-400">
                      <span>Verified ID token</span>
                      <span>Server-issued session</span>
                      <span>No client-side secrets</span>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-black/10 bg-white/90 p-6">
                    <p className="text-sm font-medium text-neutral-950">Sign in</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Only allowlisted client emails in the portal registry can enter.
                    </p>

                    <div className="mt-6 min-h-12" ref={buttonRef} />

                    {!clientPortalGoogleClientId || !status.loginEnabled ? (
                      <p className="mt-4 text-sm text-amber-700">
                        Set `VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`, and `CLIENT_PORTAL_SECRET` to enable Google sign-in.
                      </p>
                    ) : null}

                    {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
                    {isLoading ? <p className="mt-4 text-sm text-neutral-500">Checking session…</p> : null}
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/90 px-4 py-3">
                    {profile?.picture ? (
                      <img src={profile.picture} alt={profile.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                        {profile?.name?.slice(0, 1) ?? 'C'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-neutral-950">{profile?.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{profile?.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void logoutClientPortal().then((nextStatus) => {
                        setStatus(nextStatus);
                        setError('');
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <aside className="rounded-[36px] border border-black/10 bg-[#161616] p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Included</p>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-lg font-medium">Project visibility</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-300">Current status, milestone dates, and recent updates in one place.</p>
                </div>
                <div>
                  <p className="text-lg font-medium">Controlled document access</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-300">Each project can point to proposal, profile, or future external resources.</p>
                </div>
                <div>
                  <p className="text-lg font-medium">Direct support routing</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-300">Stakeholders and support contacts stay attached to the authenticated account.</p>
                </div>
              </div>
            </aside>
          </div>

          {status.authenticated && account ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_360px]">
              <div className="space-y-6">
                <section className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.06)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Workspace</p>
                      <h2 className="mt-3 text-3xl font-medium text-neutral-950">{account.workspaceTitle}</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        This account-level workspace centralizes current projects, working deliverables, and the next milestone without sending clients across separate threads.
                      </p>
                    </div>
                    <div className="rounded-[28px] border border-black/10 bg-[#faf7f2] px-5 py-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Account</p>
                      <p className="mt-3 text-lg font-medium text-neutral-950">{account.companyName}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <ProjectStatusCard label="Active Projects" value={String(account.projects.length)} />
                    <ProjectStatusCard
                      label="Next Milestone"
                      value={account.projects[0]?.nextMilestone || 'No milestone scheduled'}
                    />
                    <ProjectStatusCard
                      label="Support"
                      value={account.supportEmail}
                    />
                  </div>
                </section>

                {account.projects.map((project) => (
                  <section
                    key={project.id}
                    className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f4efe5] px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-neutral-700">
                          <BriefcaseBusiness className="h-4 w-4" />
                          {project.status}
                        </div>
                        <h3 className="mt-4 text-3xl font-medium text-neutral-950">{project.name}</h3>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">{project.summary}</p>
                      </div>

                      <div className="rounded-[28px] border border-black/10 bg-[#111111] px-5 py-4 text-white">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Last updated</p>
                        <p className="mt-3 text-base font-medium">{formatDate(project.lastUpdated)}</p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                      <div className="rounded-[30px] border border-black/10 bg-[#faf7f2] p-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-950">
                          <Milestone className="h-4 w-4" />
                          Milestones
                        </div>
                        <div className="mt-5 space-y-4">
                          {project.milestones.map((milestone) => (
                            <div key={`${project.id}-${milestone.title}`} className="flex items-start justify-between gap-4 border-t border-black/10 pt-4 first:border-t-0 first:pt-0">
                              <div>
                                <p className="text-sm font-medium text-neutral-950">{milestone.title}</p>
                                <p className="mt-1 text-sm text-neutral-600">{milestone.status}</p>
                              </div>
                              <p className="text-sm text-neutral-500">{formatDate(milestone.dueDate)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-black/10 bg-white p-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-950">
                          <CalendarClock className="h-4 w-4" />
                          Recent updates
                        </div>
                        <div className="mt-5 space-y-5">
                          {project.updates.map((update) => (
                            <div key={`${project.id}-${update.date}-${update.title}`} className="border-t border-black/10 pt-5 first:border-t-0 first:pt-0">
                              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{formatDate(update.date)}</p>
                              <p className="mt-2 text-sm font-medium text-neutral-950">{update.title}</p>
                              <p className="mt-2 text-sm leading-6 text-neutral-600">{update.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.links.map((link) => {
                        const isInternal = link.href.startsWith('/');
                        const baseClasses = 'inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-colors';
                        return isInternal ? (
                          <a
                            key={`${project.id}-${link.href}`}
                            href={link.href}
                            className={`${baseClasses} border-black bg-black text-white hover:bg-neutral-800`}
                          >
                            {link.label}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <a
                            key={`${project.id}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`${baseClasses} border-black/15 bg-white text-neutral-950 hover:border-black`}
                          >
                            {link.label}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <div className="space-y-6">
                <section className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-950">
                    <LifeBuoy className="h-4 w-4" />
                    Support contacts
                  </div>
                  <div className="mt-6 space-y-4">
                    {account.contacts.map((contact) => (
                      <div key={`${contact.email}-${contact.name}`} className="rounded-[26px] border border-black/10 bg-[#faf7f2] px-5 py-4">
                        <p className="text-base font-medium text-neutral-950">{contact.name}</p>
                        <p className="mt-1 text-sm text-neutral-600">{contact.role}</p>
                        <a href={`mailto:${contact.email}`} className="mt-3 inline-block text-sm font-medium text-neutral-950 underline decoration-black/30 underline-offset-4">
                          {contact.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[36px] border border-black/10 bg-[#111111] p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Why this structure</p>
                  <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-300">
                    <p>The portal is account-scoped, not page-scoped, so one approved Google identity unlocks the right workspace without juggling project passwords.</p>
                    <p>Google verifies the user, the server verifies the token audience, and the registry controls who is allowed in.</p>
                    <p>As the portal grows, external docs, task links, invoices, and meeting notes can be attached per project without changing the auth model.</p>
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
