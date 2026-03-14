import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProjectAccessStatus, submitProjectAccessPassword } from '../content/projectAccess';

type ProjectPasswordGateProps = {
    path: string;
    title: string;
    subtitle: string;
    overlayTop?: number;
    children: ReactNode;
};

export default function ProjectPasswordGate({
    path,
    title,
    subtitle,
    children,
}: ProjectPasswordGateProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [isPromptOpen, setIsPromptOpen] = useState(false);

    useEffect(() => {
        let isActive = true;

        const checkAccess = async () => {
            setIsCheckingAccess(true);

            try {
                const unlocked = await fetchProjectAccessStatus(path);
                if (!isActive) {
                    return;
                }

                setIsUnlocked(unlocked);
                window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, unlocked } }));
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
        const result = await submitProjectAccessPassword(path, input);

        if (!result.unlocked) {
            setError(result.error || 'Incorrect password.');
            return;
        }

        setIsUnlocked(true);
        window.dispatchEvent(new CustomEvent('b2w-project-access-change', { detail: { path, unlocked: true } }));
        setIsPromptOpen(false);
        setError('');
        setInput('');
    };

    const promptLabelId = useMemo(() => `project-password-${path.replace(/[^a-z0-9]+/gi, '-')}`, [path]);

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <section data-project-locked="true" className="relative min-h-screen text-black">
            {children}

            <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
                {!isCheckingAccess ? (
                    <button
                        type="button"
                        onClick={() => setIsPromptOpen(true)}
                        className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black bg-black px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
                    >
                        <LockKeyhole className="h-4 w-4" />
                        Enter password to see details
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
                            className="fixed inset-x-6 bottom-24 z-50 mx-auto max-w-xl border border-neutral-200 bg-white/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-md md:p-10"
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
                            <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600">{subtitle}</p>

                            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor={promptLabelId} className="mb-2 block text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
                                        Project Password
                                    </label>
                                    <input
                                        id={promptLabelId}
                                        type="password"
                                        value={input}
                                        onChange={(event) => {
                                            setInput(event.target.value);
                                            if (error) {
                                                setError('');
                                            }
                                        }}
                                        className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        placeholder="Enter password"
                                        autoComplete="current-password"
                                    />
                                </div>

                                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                >
                                    Unlock Project
                                </button>
                            </form>
                        </motion.div>
                    </>
                ) : null}
            </AnimatePresence>
        </section>
    );
}
