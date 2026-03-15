import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fetchProjectAccessStatus,
  getProtectedProject,
  isProjectAccessGranted,
  submitProjectAccess,
  type ProjectAccessLevel,
} from '../content/projectAccess';
import Seo from './Seo';

type ProjectPasswordGateProps = {
  path: string;
  title: string;
  subtitle: string;
  overlayTop?: number;
  children: ReactNode;
};

type AccessMethod = 'proposal' | 'profile';

const accessLabels: Record<Exclude<ProjectAccessLevel, 'locked'>, string> = {
  proposal: 'Proposal View',
  profile: 'Business Profile View',
};

export default function ProjectPasswordGate({
  path,
  title,
  subtitle,
  children,
}: ProjectPasswordGateProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [accessLevel, setAccessLevel] = useState<ProjectAccessLevel>('locked');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [activeMethod, setActiveMethod] = useState<AccessMethod>('proposal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const protectedProject = useMemo(() => getProtectedProject(path), [path]);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      setIsCheckingAccess(true);

      try {
        const nextAccessLevel = await fetchProjectAccessStatus(path);
        if (!isActive) {
          return;
        }

        setAccessLevel(nextAccessLevel);
        window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, accessLevel: nextAccessLevel } }));
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleUnlock();
  };

  const handleUnlock = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitProjectAccess(
        activeMethod === 'proposal'
          ? { path, method: 'proposal', email: emailInput }
          : { path, method: 'profile', password: passwordInput },
      );

      if (!isProjectAccessGranted(result.accessLevel)) {
        setError(result.error || (activeMethod === 'proposal' ? 'Email address not recognized.' : 'Incorrect password.'));
        return;
      }

      setAccessLevel(result.accessLevel);
      window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, accessLevel: result.accessLevel } }));
      setIsPromptOpen(false);
      setError('');
      setEmailInput('');
      setPasswordInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailLabelId = useMemo(() => `project-email-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);
  const passwordLabelId = useMemo(() => `project-password-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);

  if (isProjectAccessGranted(accessLevel)) {
    return (
      <>
        <div className="pointer-events-none fixed right-4 top-24 z-40 flex justify-end px-4">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-black bg-white/92 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-black shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            {accessLabels[accessLevel]}
          </div>
        </div>
        {children}
      </>
    );
  }

  return (
    <section data-project-locked="true" className="relative min-h-screen text-black">
      <Seo
        title={protectedProject?.maskedSeoTitle ?? 'Confidential Project'}
        description={protectedProject?.maskedSeoDescription ?? 'This project is access-controlled.'}
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
                <p className="mt-3 text-lg font-medium">{protectedProject?.maskedTitle ?? 'Confidential Client'}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Profile details</p>
                <p className="mt-3 text-sm leading-6 text-neutral-300 blur-sm">
                  Full business profile, location details, and project-specific documentation are revealed only after access succeeds.
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
            onClick={() => setIsPromptOpen(true)}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black bg-black px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            <LockKeyhole className="h-4 w-4" />
            Choose viewing option
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {isPromptOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/25"
              onClick={() => setIsPromptOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="fixed inset-x-6 bottom-12 z-50 mx-auto max-w-4xl border border-neutral-200 bg-white/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-md md:p-10"
            >
              <Link
                to="/#industries"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>

              <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white/90">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <h1 className="mt-6 text-4xl font-medium tracking-tight">{title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">{subtitle}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('proposal');
                    setError('');
                  }}
                  className={`border px-5 py-5 text-left transition-colors ${
                    activeMethod === 'proposal' ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-black">
                    <Mail className="h-4 w-4" />
                    View Proposal
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Enter an approved email address to open the proposal version of this project.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('profile');
                    setError('');
                  }}
                  className={`border px-5 py-5 text-left transition-colors ${
                    activeMethod === 'profile' ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-black">
                    <ShieldCheck className="h-4 w-4" />
                    View Business Profile
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Enter the correct password to unlock the full business profile view.
                  </p>
                </button>
              </div>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {activeMethod === 'proposal' ? (
                  <div>
                    <label htmlFor={emailLabelId} className="mb-2 block text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
                      Proposal Email
                    </label>
                    <input
                      id={emailLabelId}
                      type="email"
                      value={emailInput}
                      onChange={(event) => {
                        setEmailInput(event.target.value);
                        if (error) {
                          setError('');
                        }
                      }}
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor={passwordLabelId} className="mb-2 block text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
                      Business Profile Password
                    </label>
                    <input
                      id={passwordLabelId}
                      type="password"
                      value={passwordInput}
                      onChange={(event) => {
                        setPasswordInput(event.target.value);
                        if (error) {
                          setError('');
                        }
                      }}
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                  </div>
                )}

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Verifying...'
                    : activeMethod === 'proposal'
                      ? 'Open Proposal'
                      : 'Unlock Business Profile'}
                </button>
              </form>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
