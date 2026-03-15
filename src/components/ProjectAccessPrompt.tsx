import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isProjectAccessGranted, submitProjectAccess, type ProjectAccessLevel } from '../content/projectAccess';

type ProjectAccessPromptProps = {
  isOpen: boolean;
  path: string;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSuccess: (accessLevel: Exclude<ProjectAccessLevel, 'locked'>) => void;
};

type AccessMethod = 'proposal' | 'profile';

export default function ProjectAccessPrompt({
  isOpen,
  path,
  title,
  subtitle,
  onClose,
  onSuccess,
}: ProjectAccessPromptProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [activeMethod, setActiveMethod] = useState<AccessMethod>('proposal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailLabelId = useMemo(() => `project-email-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);
  const passwordLabelId = useMemo(() => `project-password-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);

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

      const grantedAccessLevel = result.accessLevel as Exclude<ProjectAccessLevel, 'locked'>;
      setError('');
      setEmailInput('');
      setPasswordInput('');
      window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, accessLevel: grantedAccessLevel } }));
      onSuccess(grantedAccessLevel);
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
            <Link
              to="/#industries"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
              onClick={onClose}
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
  );
}
