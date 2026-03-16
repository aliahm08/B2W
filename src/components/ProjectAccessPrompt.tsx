import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, LockKeyhole, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchProjectAccessStatus,
  hasGrantedView,
  logoutProjectAccess,
  submitProjectAccess,
  type ProjectAccessStatus,
  type ProjectAccessView,
} from '../content/projectAccess';

type ProjectAccessPromptProps = {
  isOpen: boolean;
  path: string;
  title: string;
  subtitle: string;
  initialMethod?: ProjectAccessView;
  onClose: () => void;
  onStatusChange?: (status: ProjectAccessStatus) => void;
};

const emptyStatus: ProjectAccessStatus = {
  scopeId: null,
  accessLevel: 'locked',
  grantedLevels: [],
  currentView: null,
  availableViews: {},
  title: '',
};

export default function ProjectAccessPrompt({
  isOpen,
  path,
  title,
  subtitle,
  initialMethod,
  onClose,
  onStatusChange,
}: ProjectAccessPromptProps) {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ProjectAccessStatus>(emptyStatus);
  const [activeMethod, setActiveMethod] = useState<ProjectAccessView>(initialMethod ?? 'proposal');
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveMethod(initialMethod ?? 'proposal');
  }, [initialMethod, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isActive = true;
    setIsLoadingStatus(true);

    void fetchProjectAccessStatus(path)
      .then((nextStatus) => {
        if (!isActive) {
          return;
        }

        setStatus(nextStatus);
        onStatusChange?.(nextStatus);

        const views = Object.keys(nextStatus.availableViews) as ProjectAccessView[];
        if (!views.includes(activeMethod) && views.length > 0) {
          setActiveMethod(views[0]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingStatus(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isOpen, path]);

  const emailLabelId = useMemo(() => `project-email-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);
  const passwordLabelId = useMemo(() => `project-password-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);
  const availableMethods = useMemo(
    () => (Object.keys(status.availableViews) as ProjectAccessView[]).filter((value) => value === 'proposal' || value === 'profile'),
    [status.availableViews],
  );
  const targetPath = status.availableViews[activeMethod];
  const canOpenActiveView = hasGrantedView(status, activeMethod) && Boolean(targetPath);
  const hasAnyGrant = status.grantedLevels.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleUnlock();
  };

  const handleOpenView = () => {
    if (!targetPath) {
      return;
    }

    onClose();
    navigate(targetPath);
  };

  const handleUnlock = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitProjectAccess(
        activeMethod === 'proposal'
          ? { path, method: 'proposal', email: emailInput }
          : { path, method: 'profile', password: passwordInput },
      );

      if (!hasGrantedView(result, activeMethod)) {
        setError(result.error || (activeMethod === 'proposal' ? 'Email address not recognized.' : 'Incorrect password.'));
        return;
      }

      setStatus(result);
      setError('');
      setEmailInput('');
      setPasswordInput('');
      onStatusChange?.(result);
      window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, status: result } }));

      const nextPath = result.redirectPath || result.availableViews[activeMethod] || path;
      onClose();
      navigate(nextPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);

    try {
      const nextStatus = await logoutProjectAccess(path);
      setStatus(nextStatus);
      setError('');
      onStatusChange?.(nextStatus);
      window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, status: nextStatus } }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/25"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed inset-x-6 bottom-12 z-50 mx-auto max-w-4xl border border-neutral-200 bg-white/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-md md:p-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/#industries"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
                onClick={onClose}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>

              {hasAnyGrant ? (
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600 transition-colors hover:border-black hover:text-black"
                  disabled={isSubmitting}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : null}
            </div>

            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white/90">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <h1 className="mt-6 text-4xl font-medium tracking-tight">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">{subtitle}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {status.availableViews.proposal ? (
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
                    Proposal View
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Use the approved email to open the proposal page and keep the signed proposal state on revisit.
                  </p>
                </button>
              ) : null}

              {status.availableViews.profile ? (
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
                    Analysis Profile
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Use the analysis password to unlock the full deliverable and switch back whenever needed.
                  </p>
                </button>
              ) : null}
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isLoadingStatus ? (
                <p className="text-sm text-neutral-500">Loading access options...</p>
              ) : canOpenActiveView ? (
                <div className="border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                  You already have access to this view. Open it directly, or switch tabs to unlock the other view.
                </div>
              ) : activeMethod === 'proposal' ? (
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
                    placeholder="info@b2w-ai.com"
                    autoComplete="email"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor={passwordLabelId} className="mb-2 block text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
                    Analysis Profile Password
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

              {!isLoadingStatus && availableMethods.length > 0 ? (
                canOpenActiveView ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleOpenView}
                    className="inline-flex items-center justify-center border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Open View
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Verifying...'
                      : activeMethod === 'proposal'
                        ? 'Open Proposal'
                        : 'Unlock Analysis Profile'}
                  </button>
                )
              ) : null}
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
