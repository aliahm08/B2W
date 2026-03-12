import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import ChatBot from './ChatBot';

type AssistantTab = 'chat' | 'book';

type OpenEventDetail = {
  tab?: AssistantTab;
};

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('chat');

  useEffect(() => {
    function handleOpen(event: Event) {
      const customEvent = event as CustomEvent<OpenEventDetail>;
      setActiveTab(customEvent.detail?.tab ?? 'chat');
      setIsOpen(true);
    }

    window.addEventListener('b2w-assistant:open', handleOpen as EventListener);
    return () => window.removeEventListener('b2w-assistant:open', handleOpen as EventListener);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex items-end justify-end">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            className="pointer-events-auto w-[min(92vw,24rem)] overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.14)]"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-black">B2W Assistant</p>
                <p className="text-xs text-neutral-500">Ask questions or book time</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="h-[38rem]">
              <ChatBot activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-black px-5 py-4 text-sm font-medium text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5"
        >
          <MessageSquare size={16} />
          Ask B2W
        </button>
      ) : null}
    </div>
  );
}
