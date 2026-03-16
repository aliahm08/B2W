import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ReceiptText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getProposalContent } from '../content/proposals';
import { fetchProjectAccessStatus, getProtectedProject, isProjectAccessGranted, type ProjectAccessStatus } from '../content/projectAccess';

type FloatingPageCta =
  | { type: 'proposal'; label: string }
  | { type: 'event'; label: string; eventName: string }
  | { type: 'link'; label: string; href: string };

const floatingPageCtas: Record<string, FloatingPageCta[]> = {
  '/borek-g-operations': [{ type: 'proposal', label: 'Key Terms & Sign' }],
  '/uyghur-eats-acquisition': [
    {
      type: 'link',
      label: 'Preview Analysis Profile',
      href: '/uyghur-eats?preview=proposal&return=%2Fuyghur-eats-acquisition%23scope-options',
    },
    { type: 'proposal', label: 'Key Terms & Sign' },
  ],
  '/uyghur-eats': [{ type: 'event', label: 'Make an Offer', eventName: 'b2w-uyghur-offer:open' }],
};

export default function AssistantWidget() {
  const { pathname } = useLocation();
  const [isBottomPrompted, setIsBottomPrompted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isProjectUnlocked, setIsProjectUnlocked] = useState(true);
  const protectedProject = useMemo(() => getProtectedProject(pathname), [pathname]);
  const proposal = useMemo(() => getProposalContent(pathname), [pathname]);
  const activeFloatingCtas = useMemo(() => floatingPageCtas[pathname] ?? [], [pathname]);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      if (!protectedProject) {
        if (isActive) {
          setIsProjectUnlocked(true);
        }
        return;
      }

      const accessStatus = await fetchProjectAccessStatus(pathname);
      if (isActive) {
        setIsProjectUnlocked(isProjectAccessGranted(accessStatus.accessLevel));
      }
    };

    void checkAccess();

    function handleAccessChange(event: Event) {
      const detail = (event as CustomEvent<{ path?: string; status?: ProjectAccessStatus }>).detail;

      if (detail?.path === pathname) {
        setIsProjectUnlocked(isProjectAccessGranted(detail.status?.accessLevel ?? 'locked'));
        return;
      }

      void checkAccess();
    }

    window.addEventListener('b2w-project-access-change', handleAccessChange as EventListener);
    window.addEventListener('storage', handleAccessChange);

    return () => {
      isActive = false;
      window.removeEventListener('b2w-project-access-change', handleAccessChange as EventListener);
      window.removeEventListener('storage', handleAccessChange);
    };
  }, [pathname, protectedProject]);

  useEffect(() => {
    setIsBottomPrompted(false);
    setHasAutoOpened(false);
  }, [pathname]);

  useEffect(() => {
    if (activeFloatingCtas.length === 0 || !isProjectUnlocked || hasAutoOpened) {
      return;
    }

    function handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomThreshold = document.documentElement.scrollHeight - 120;

      if (scrollPosition < bottomThreshold) {
        return;
      }

      setHasAutoOpened(true);
      setIsBottomPrompted(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeFloatingCtas, hasAutoOpened, isProjectUnlocked]);

  if (activeFloatingCtas.length === 0 || !isProjectUnlocked) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${pathname}-floating-cta`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`pointer-events-auto flex flex-wrap items-center justify-center gap-3 transition-all duration-300 ${
            isBottomPrompted ? 'scale-105' : ''
          }`}
        >
          {activeFloatingCtas.map((cta) => (
            <button
              key={`${pathname}-${cta.label}`}
              type="button"
              onClick={() => {
                if (cta.type === 'proposal') {
                  if (proposal) {
                    window.dispatchEvent(new CustomEvent('b2w-assistant:open'));
                  }
                  return;
                }

                if (cta.type === 'link') {
                  window.location.assign(cta.href);
                  return;
                }

                window.dispatchEvent(new CustomEvent(cta.eventName));
              }}
              className={`inline-flex items-center gap-3 rounded-full border border-black bg-black text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 ${
                isBottomPrompted ? 'px-8 py-5' : 'px-6 py-4'
              }`}
            >
              {cta.type === 'proposal' ? (
                <ReceiptText size={16} />
              ) : cta.type === 'link' ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
              {cta.label}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
