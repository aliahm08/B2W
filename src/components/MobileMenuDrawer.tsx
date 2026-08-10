import type { ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';

type MobileMenuDrawerProps = {
  isOpen: boolean;
  theme: 'light' | 'dark';
  header?: ReactNode;
  list?: ReactNode;
  cta?: ReactNode;
  footer?: ReactNode;
};

const containerClassName = {
  light: 'overflow-hidden border-t border-black/8 bg-white/96 px-4 pb-8 pt-4 text-black shadow-sm backdrop-blur-xl md:hidden',
  dark: 'overflow-hidden border-t border-white/10 bg-black/82 px-4 pb-8 pt-4 text-white shadow-sm backdrop-blur-xl md:hidden',
} as const;

const dividerClassName = {
  light: 'border-black/8',
  dark: 'border-white/10',
} as const;

const listDividerClassName = {
  light: 'divide-black/8',
  dark: 'divide-white/10',
} as const;

const ctaWrapperClassName = {
  light: 'border-t border-black/8 pt-4',
  dark: 'border-t border-white/10 pt-4',
} as const;

const itemVariants: Variants = {
  closed: { opacity: 0, y: -10, filter: 'blur(4px)' },
  open: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.28, ease: 'easeOut' },
  },
};

export default function MobileMenuDrawer({
  isOpen,
  theme,
  header,
  list,
  cta,
  footer,
}: MobileMenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'calc(100vh - 5rem)' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          className={containerClassName[theme]}
        >
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
              closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            }}
            className="mx-auto flex h-full max-w-7xl flex-col"
          >
            {header ? (
              <motion.div variants={itemVariants} className={`border-b pb-4 ${dividerClassName[theme]}`}>
                {header}
              </motion.div>
            ) : null}

            {list || cta ? (
              <motion.div variants={itemVariants} className="min-h-0 flex-1 overflow-y-auto">
                {list ? (
                  <div
                    className={`flex flex-col divide-y border-b pb-3 ${dividerClassName[theme]} ${listDividerClassName[theme]}`}
                  >
                    {list}
                  </div>
                ) : null}

                {cta ? (
                  <div className={`px-1 pb-2 ${ctaWrapperClassName[theme]}`}>
                    {cta}
                  </div>
                ) : null}
              </motion.div>
            ) : null}

            {footer ? (
              <motion.div variants={itemVariants} className={`mt-8 border-t pt-6 ${dividerClassName[theme]}`}>
                {footer}
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
