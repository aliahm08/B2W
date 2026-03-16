import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ReceiptText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getProposalContent } from '../content/proposals';
import { fetchProjectAccessStatus, getProtectedProject, isProjectAccessGranted, type ProjectAccessStatus } from '../content/projectAccess';

type FloatingPageCta =
  | { type: 'proposal'; label: string }
  | { type: 'event'; label: string; eventName: string };

const floatingPageCtas: Record<string, FloatingPageCta> = {
  '/borek-g-operations': { type: 'proposal', label: 'Accept Terms & Sign' },
  '/uyghur-eats': { type: 'event', label: 'Make an Offer', eventName: 'b2w-uyghur-offer:open' },
};

export default function AssistantWidget() {
  const { pathname } = useLocation();
  const [isBottomPrompted, setIsBottomPrompted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isProjectUnlocked, setIsProjectUnlocked] = useState(true);
  const protectedProject = useMemo(() => getProtectedProject(pathname), [pathname]);
  const proposal = useMemo(() => getProposalContent(pathname), [pathname]);
  const activeFloatingCta = useMemo(() => floatingPageCtas[pathname], [pathname]);

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
    if (!activeFloatingCta || !isProjectUnlocked || hasAutoOpened) {
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
  }, [activeFloatingCta, hasAutoOpened, isProjectUnlocked]);

  if (!activeFloatingCta || !isProjectUnlocked) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.button
          key={`${pathname}-floating-cta`}
          type="button"
          onClick={() => {
            if (activeFloatingCta.type === 'proposal') {
              if (proposal) {
                window.dispatchEvent(new CustomEvent('b2w-assistant:open'));
              }
              return;
            }

            window.dispatchEvent(new CustomEvent(activeFloatingCta.eventName));
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black bg-black text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 ${
            isBottomPrompted ? 'scale-105 px-8 py-5' : 'px-6 py-4'
          }`}
        >
          {activeFloatingCta.type === 'proposal' ? <ReceiptText size={16} /> : <ArrowRight size={16} />}
          {activeFloatingCta.label}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
