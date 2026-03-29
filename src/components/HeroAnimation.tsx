import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

type HeroAnimationProps = {
  theme?: 'light' | 'dark';
  className?: string;
};

type AccentTone = 'emerald' | 'sky' | 'amber';

type StreamRowProps = {
  label: string;
  tone: AccentTone;
  active: boolean;
  compact?: boolean;
  children: ReactNode;
  rowClassName: string;
  absolute?: boolean;
};

const toneClasses: Record<AccentTone, { chip: string; dot: string; line: string }> = {
  emerald: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-500',
    line: 'bg-emerald-200/80',
  },
  sky: {
    chip: 'border-sky-200 bg-sky-50 text-sky-800',
    dot: 'bg-sky-500',
    line: 'bg-sky-200/80',
  },
  amber: {
    chip: 'border-amber-200 bg-amber-50 text-amber-900',
    dot: 'bg-amber-500',
    line: 'bg-amber-200/80',
  },
};

const marketingNodes = [
  { top: '10%', left: '10%', size: '0.45rem', delay: 0 },
  { top: '28%', left: '24%', size: '0.34rem', delay: 0.08 },
  { top: '42%', left: '36%', size: '0.52rem', delay: 0.18 },
  { top: '18%', left: '52%', size: '0.3rem', delay: 0.26 },
  { top: '36%', left: '64%', size: '0.44rem', delay: 0.34 },
];

const operationsBlocks = [
  { left: '12%', top: '22%', width: '1.45rem', height: '0.52rem', delay: 0 },
  { left: '28%', top: '22%', width: '1.05rem', height: '0.52rem', delay: 0.08 },
  { left: '12%', top: '40%', width: '0.92rem', height: '0.52rem', delay: 0.16 },
  { left: '26%', top: '40%', width: '1.62rem', height: '0.52rem', delay: 0.24 },
];

const financialBars = [
  { height: '2.3rem', delay: 0 },
  { height: '3.4rem', delay: 0.08 },
  { height: '2.1rem', delay: 0.16 },
  { height: '4rem', delay: 0.24 },
];

function StreamRow({ label, tone, active, compact = false, children, rowClassName, absolute = true }: StreamRowProps) {
  const toneStyle = toneClasses[tone];
  const xMotion = compact ? [0, 8, 14, 8, 0] : [0, 12, 24, 14, 0];
  const opacityMotion = compact ? [0.72, 0.9, 1, 0.94, 0.72] : [0.68, 0.92, 1, 0.94, 0.68];

  return (
    <motion.div
      className={`${absolute ? 'absolute' : 'relative'} ${rowClassName} transform-gpu`}
      animate={
        active
          ? {
              x: xMotion,
              opacity: opacityMotion,
            }
          : { x: 0, opacity: 0.8 }
      }
      transition={{
        duration: compact ? 5.8 : 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] ${toneStyle.chip}`}
        >
          {label}
        </span>
        <div className={`h-px flex-1 ${toneStyle.line}`} />
      </div>

      <div className="relative mt-4 min-h-14">{children}</div>
    </motion.div>
  );
}

function UnifiedLayer({
  active,
  compact = false,
  theme,
}: {
  active: boolean;
  compact?: boolean;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`absolute right-5 top-1/2 ${compact ? 'w-[46%]' : 'w-[39%]'} -translate-y-1/2 transform-gpu overflow-hidden rounded-[1.5rem] border backdrop-blur-sm ${
        isDark ? 'border-white/10 bg-neutral-950/80 shadow-[0_18px_50px_rgba(0,0,0,0.35)]' : 'border-neutral-200 bg-white/88 shadow-[0_18px_50px_rgba(0,0,0,0.08)]'
      } ${compact ? 'p-4' : 'p-5'}`}
      animate={
        active
          ? {
              scale: [0.985, 1, 1.012, 1, 0.985],
              opacity: [0.72, 0.92, 1, 0.95, 0.72],
            }
          : { scale: 1, opacity: 0.88 }
      }
      transition={{
        duration: compact ? 6.1 : 5.4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]'
            : 'bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.04),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.5),transparent)]'
        }`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={`text-[10px] font-mono uppercase tracking-[0.28em] ${isDark ? 'text-white/45' : 'text-neutral-500'}`}>
            Unified Layer
          </p>
          <p className={`mt-2 text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-950'}`}>Clear signal</p>
        </div>
        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${isDark ? 'bg-white/75' : 'bg-neutral-900'}`} />
      </div>

      <div className="relative mt-6 space-y-3">
        <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`} />
        <div className={`h-px w-[86%] ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`} />
        <div className={`h-px w-[68%] ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`} />
      </div>

      <div className="relative mt-6 flex items-end gap-2">
        <motion.span
          className={`h-10 w-1.5 rounded-full ${isDark ? 'bg-white/30' : 'bg-neutral-300'}`}
          animate={active ? { scaleY: [0.95, 1.04, 0.98, 1, 0.95] } : { scaleY: 1 }}
          transition={{ duration: compact ? 5.8 : 5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
          style={{ transformOrigin: 'bottom' }}
        />
        <motion.span
          className={`h-14 w-1.5 rounded-full ${isDark ? 'bg-white/42' : 'bg-neutral-400'}`}
          animate={active ? { scaleY: [0.9, 1.06, 1, 1.02, 0.9] } : { scaleY: 1 }}
          transition={{ duration: compact ? 5.8 : 5, repeat: Infinity, ease: 'easeInOut', delay: 0.14 }}
          style={{ transformOrigin: 'bottom' }}
        />
        <motion.span
          className={`h-9 w-1.5 rounded-full ${isDark ? 'bg-white/30' : 'bg-neutral-300'}`}
          animate={active ? { scaleY: [1, 0.96, 1.05, 0.98, 1] } : { scaleY: 1 }}
          transition={{ duration: compact ? 5.8 : 5, repeat: Infinity, ease: 'easeInOut', delay: 0.22 }}
          style={{ transformOrigin: 'bottom' }}
        />
        <div className={`ml-2 flex-1 self-center rounded-full ${isDark ? 'bg-white/8' : 'bg-neutral-100'} px-3 py-2`}>
          <div className={`h-1.5 w-[72%] rounded-full ${isDark ? 'bg-white/20' : 'bg-neutral-300'}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroAnimation({ theme = 'light', className = '' }: HeroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 130, damping: 24, mass: 0.28 });
  const springY = useSpring(pointerY, { stiffness: 130, damping: 24, mass: 0.28 });
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [isVisible, setIsVisible] = useState(true);
  const [canHover, setCanHover] = useState(false);
  const active = !shouldReduceMotion && isVisible;
  const isDark = theme === 'dark';

  useEffect(() => {
    const node = rootRef.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.18 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(query.matches);

    update();
    query.addEventListener?.('change', update);

    return () => query.removeEventListener?.('change', update);
  }, []);

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!canHover || !active) {
      return;
    }

    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canHover || !active) {
      return;
    }

    const rect = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    boundsRef.current = rect;

    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(normalizedX * 10);
    pointerY.set(normalizedY * 8);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div ref={rootRef} aria-hidden="true" className={`relative w-full ${className}`.trim()}>
      <motion.div
        style={canHover && active ? { x: springX, y: springY } : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative overflow-hidden rounded-[1.9rem] border transform-gpu ${
          isDark
            ? 'border-white/10 bg-neutral-950 text-white shadow-[0_24px_90px_rgba(0,0,0,0.36)]'
            : 'border-neutral-200 bg-white text-black shadow-[0_24px_90px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]'
              : 'bg-[radial-gradient(circle_at_14%_16%,rgba(0,0,0,0.05),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(0,0,0,0.04),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,247,245,1))]'
          }`}
        />
        <div
          className={`absolute inset-0 opacity-55 ${
            isDark
              ? 'bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]'
              : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
          } bg-[size:32px_32px]`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]'
              : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.88),transparent_28%,transparent_72%,rgba(255,255,255,0.4))]'
          }`}
        />

        <div className="relative hidden min-h-[30rem] md:block">
          <div className="absolute left-6 top-5 z-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-500">
            <span className={`h-px w-6 ${isDark ? 'bg-white/20' : 'bg-neutral-300'}`} />
            <span>Systems view</span>
          </div>

          <StreamRow
            label="Marketing Data"
            tone="emerald"
            active={active}
            rowClassName="left-6 right-[27%] top-[17%]"
          >
            <div className="relative h-14">
              {marketingNodes.map((node, index) => (
                <motion.span
                  key={`${node.left}-${node.top}`}
                  className={`absolute rounded-full ${toneClasses.emerald.dot}`}
                  style={{
                    left: node.left,
                    top: node.top,
                    width: node.size,
                    height: node.size,
                  }}
                  animate={
                    active
                      ? {
                          x: [0, 12, 22, 10, 0],
                          y: [0, -2, 4, 1, 0],
                          opacity: [0.48, 1, 0.92, 1, 0.48],
                          scale: [0.95, 1.06, 1.01, 1.04, 0.95],
                        }
                      : { x: 0, y: 0, opacity: 0.72, scale: 1 }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: node.delay + index * 0.02,
                  }}
                />
              ))}
              <div className="absolute right-[8%] top-1/2 h-px w-[28%] -translate-y-1/2 bg-neutral-200/80" />
            </div>
          </StreamRow>

          <StreamRow
            label="Operational Performance"
            tone="sky"
            active={active}
            rowClassName="left-6 right-[24%] top-[44%]"
          >
            <div className="relative h-14">
              <div className="absolute left-[10%] top-[24%] h-px w-[66%] bg-neutral-200/80" />
              {operationsBlocks.map((block, index) => (
                <motion.span
                  key={`${block.left}-${block.top}`}
                  className={`absolute rounded-full ${toneClasses.sky.dot}`}
                  style={{
                    left: block.left,
                    top: block.top,
                    width: block.width,
                    height: block.height,
                  }}
                  animate={
                    active
                      ? {
                          x: [0, 8, 16, 6, 0],
                          opacity: [0.44, 0.92, 1, 0.95, 0.44],
                          scaleX: [0.96, 1.04, 1, 1.03, 0.96],
                        }
                      : { x: 0, opacity: 0.72, scaleX: 1 }
                  }
                  transition={{
                    duration: 5.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: block.delay + index * 0.03,
                  }}
                />
              ))}
              <motion.div
                className="absolute left-[18%] top-[59%] h-0.5 w-[40%] rounded-full bg-sky-300/70"
                animate={active ? { x: [0, 8, 18, 10, 0], opacity: [0.45, 0.9, 1, 0.9, 0.45] } : { x: 0, opacity: 0.65 }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </StreamRow>

          <StreamRow label="Financials" tone="amber" active={active} rowClassName="left-6 right-[26%] top-[71%]">
            <div className="relative flex h-14 items-end gap-3">
              <div className="absolute left-[9%] right-[18%] top-[11%] h-px bg-neutral-200/80" />
              {financialBars.map((bar, index) => (
                <motion.span
                  key={`${bar.height}-${index}`}
                  className={`w-2 rounded-full ${toneClasses.amber.dot}`}
                  style={{ height: bar.height, transformOrigin: 'bottom' }}
                  animate={
                    active
                      ? {
                          scaleY: [0.94, 1.04, 0.98, 1.01, 0.94],
                          opacity: [0.5, 0.95, 1, 0.92, 0.5],
                        }
                      : { scaleY: 1, opacity: 0.72 }
                  }
                  transition={{
                    duration: 5.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: bar.delay,
                  }}
                />
              ))}
              <motion.div
                className="absolute left-[16%] right-[13%] top-[24%] h-px rounded-full bg-amber-300/70"
                animate={active ? { x: [0, 8, 18, 10, 0], opacity: [0.5, 0.92, 1, 0.92, 0.5] } : { x: 0, opacity: 0.72 }}
                transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </StreamRow>

          <UnifiedLayer active={active} theme={theme} />
        </div>

        <div className="relative min-h-[20rem] px-4 py-5 md:hidden">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-500">
            <span className={`h-px w-6 ${isDark ? 'bg-white/20' : 'bg-neutral-300'}`} />
            <span>Systems view</span>
          </div>

          <div className="space-y-3">
            <StreamRow label="Marketing" tone="emerald" active={active} compact absolute={false} rowClassName="w-full">
              <div className="relative h-10">
                {marketingNodes.slice(0, 3).map((node, index) => (
                  <motion.span
                    key={`mobile-marketing-${node.left}-${index}`}
                    className={`absolute rounded-full ${toneClasses.emerald.dot}`}
                    style={{
                      left: `${16 + index * 12}%`,
                      top: `${32 + index * 10}%`,
                      width: index === 1 ? '0.42rem' : '0.34rem',
                      height: index === 1 ? '0.42rem' : '0.34rem',
                    }}
                    animate={active ? { x: [0, 10, 18, 8, 0], opacity: [0.5, 1, 0.92, 1, 0.5] } : { x: 0, opacity: 0.76 }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                  />
                ))}
              </div>
            </StreamRow>

            <StreamRow label="Operations" tone="sky" active={active} compact absolute={false} rowClassName="w-full">
              <div className="relative h-10">
                {operationsBlocks.slice(0, 3).map((block, index) => (
                  <motion.span
                    key={`mobile-ops-${block.left}-${index}`}
                    className={`absolute rounded-full ${toneClasses.sky.dot}`}
                    style={{
                      left: `${18 + index * 14}%`,
                      top: `${26 + (index % 2) * 10}%`,
                      width: index === 1 ? '1.45rem' : '0.95rem',
                      height: '0.48rem',
                    }}
                    animate={active ? { x: [0, 8, 14, 6, 0], opacity: [0.46, 0.92, 1, 0.94, 0.46] } : { x: 0, opacity: 0.76 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: block.delay }}
                  />
                ))}
              </div>
            </StreamRow>

            <StreamRow label="Financials" tone="amber" active={active} compact absolute={false} rowClassName="w-full">
              <div className="relative flex h-10 items-end gap-2">
                {financialBars.slice(0, 3).map((bar, index) => (
                  <motion.span
                    key={`mobile-fin-${index}`}
                    className={`w-2 rounded-full ${toneClasses.amber.dot}`}
                    style={{ height: index === 1 ? '2.8rem' : '1.8rem', transformOrigin: 'bottom' }}
                    animate={
                      active
                        ? {
                            scaleY: [0.94, 1.04, 0.99, 1.01, 0.94],
                            opacity: [0.5, 0.95, 1, 0.92, 0.5],
                          }
                        : { scaleY: 1, opacity: 0.76 }
                    }
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: bar.delay }}
                  />
                ))}
              </div>
            </StreamRow>
          </div>

          <UnifiedLayer active={active} compact theme={theme} />
        </div>
      </motion.div>
    </div>
  );
}
