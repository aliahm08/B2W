import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';

type HeroAnimationProps = {
  theme?: 'light' | 'dark';
  className?: string;
};

type SignalPoint = {
  x: number;
  y: number;
  tone: 'teal' | 'sky' | 'amber' | 'ink';
  size: number;
  delay: number;
};

type SignalPath = {
  id: string;
  d: string;
  tone: 'teal' | 'sky' | 'amber' | 'ink';
  duration: number;
  delay: number;
};

const signalPoints: SignalPoint[] = [
  { x: 82, y: 118, tone: 'teal', size: 2.5, delay: 0.1 },
  { x: 168, y: 154, tone: 'ink', size: 1.5, delay: 0.34 },
  { x: 258, y: 108, tone: 'sky', size: 1.75, delay: 0.52 },
  { x: 354, y: 162, tone: 'teal', size: 2.75, delay: 0.76 },
  { x: 452, y: 112, tone: 'amber', size: 1.75, delay: 0.94 },
  { x: 556, y: 152, tone: 'ink', size: 1.5, delay: 1.2 },
  { x: 112, y: 252, tone: 'sky', size: 2.25, delay: 0.28 },
  { x: 218, y: 232, tone: 'teal', size: 1.875, delay: 0.88 },
  { x: 330, y: 254, tone: 'ink', size: 1.5, delay: 1.08 },
  { x: 426, y: 238, tone: 'teal', size: 3, delay: 1.44 },
  { x: 536, y: 262, tone: 'sky', size: 1.875, delay: 1.74 },
  { x: 620, y: 224, tone: 'amber', size: 1.5, delay: 1.92 },
  { x: 96, y: 372, tone: 'amber', size: 2.125, delay: 0.42 },
  { x: 188, y: 338, tone: 'ink', size: 1.5, delay: 1.02 },
  { x: 286, y: 388, tone: 'teal', size: 2.5, delay: 1.28 },
  { x: 390, y: 346, tone: 'sky', size: 1.875, delay: 1.56 },
  { x: 494, y: 396, tone: 'teal', size: 2.75, delay: 1.86 },
  { x: 604, y: 352, tone: 'amber', size: 1.75, delay: 2.08 },
];

const signalPaths: SignalPath[] = [
  { id: 'a', d: 'M 82 118 C 132 118, 146 146, 168 154', tone: 'teal', duration: 6.1, delay: 0.2 },
  { id: 'b', d: 'M 168 154 C 208 164, 226 116, 258 108', tone: 'ink', duration: 6.5, delay: 1.1 },
  { id: 'c', d: 'M 258 108 C 292 104, 320 144, 354 162', tone: 'sky', duration: 5.9, delay: 0.9 },
  { id: 'd', d: 'M 354 162 C 390 178, 416 122, 452 112', tone: 'teal', duration: 6.3, delay: 1.5 },
  { id: 'e', d: 'M 452 112 C 500 96, 522 138, 556 152', tone: 'amber', duration: 6.8, delay: 2 },
  { id: 'f', d: 'M 112 252 C 158 238, 188 224, 218 232', tone: 'sky', duration: 6.2, delay: 0.6 },
  { id: 'g', d: 'M 218 232 C 260 246, 292 248, 330 254', tone: 'teal', duration: 5.8, delay: 1.4 },
  { id: 'h', d: 'M 330 254 C 366 262, 394 242, 426 238', tone: 'ink', duration: 6.7, delay: 2.1 },
  { id: 'i', d: 'M 426 238 C 472 226, 500 270, 536 262', tone: 'teal', duration: 6.1, delay: 0.8 },
  { id: 'j', d: 'M 536 262 C 572 270, 590 238, 620 224', tone: 'sky', duration: 6.4, delay: 1.8 },
  { id: 'k', d: 'M 96 372 C 142 348, 160 334, 188 338', tone: 'amber', duration: 6.6, delay: 0.4 },
  { id: 'l', d: 'M 188 338 C 234 334, 250 376, 286 388', tone: 'ink', duration: 5.7, delay: 1.2 },
  { id: 'm', d: 'M 286 388 C 336 402, 354 356, 390 346', tone: 'teal', duration: 6, delay: 1.7 },
  { id: 'n', d: 'M 390 346 C 436 330, 462 386, 494 396', tone: 'sky', duration: 6.3, delay: 2.2 },
  { id: 'o', d: 'M 494 396 C 540 410, 562 368, 604 352', tone: 'amber', duration: 6.9, delay: 1 },
  { id: 'p', d: 'M 168 154 C 182 208, 176 284, 188 338', tone: 'ink', duration: 7.2, delay: 2.4 },
  { id: 'q', d: 'M 354 162 C 346 212, 342 220, 330 254', tone: 'teal', duration: 5.6, delay: 0.3 },
  { id: 'r', d: 'M 452 112 C 446 176, 438 212, 426 238', tone: 'amber', duration: 7, delay: 1.3 },
  { id: 's', d: 'M 426 238 C 418 292, 406 318, 390 346', tone: 'teal', duration: 6.4, delay: 2.5 },
  { id: 't', d: 'M 258 108 C 248 184, 234 208, 218 232', tone: 'sky', duration: 6.8, delay: 0.7 },
];

const haloOrbs = [
  { size: 150, top: '4%', left: '10%', color: 'rgba(21, 140, 140, 0.12)' },
  { size: 170, top: '58%', left: '58%', color: 'rgba(97, 113, 129, 0.09)' },
  { size: 120, top: '18%', left: '76%', color: 'rgba(201, 163, 92, 0.1)' },
];

const ambientBands = [
  { top: '18%', left: '10%', width: '44%', rotate: '-7deg', color: 'rgba(21, 140, 140, 0.08)' },
  { top: '46%', left: '28%', width: '34%', rotate: '12deg', color: 'rgba(109, 149, 196, 0.08)' },
  { top: '70%', left: '42%', width: '30%', rotate: '-10deg', color: 'rgba(201, 163, 92, 0.08)' },
];

const toneStyles = {
  teal: { fill: '#158c8c', glow: 'rgba(21, 140, 140, 0.24)', stroke: 'rgba(21, 140, 140, 0.26)' },
  sky: { fill: '#6d95c4', glow: 'rgba(109, 149, 196, 0.2)', stroke: 'rgba(109, 149, 196, 0.22)' },
  amber: { fill: '#c9a35c', glow: 'rgba(201, 163, 92, 0.2)', stroke: 'rgba(201, 163, 92, 0.22)' },
  ink: { fill: '#617181', glow: 'rgba(97, 113, 129, 0.18)', stroke: 'rgba(97, 113, 129, 0.2)' },
} as const;

function FlowPulse({ path, active }: { path: SignalPath; active: boolean }) {
  const tone = toneStyles[path.tone];

  return (
    <>
      <circle cx="0" cy="0" r="2.2" fill={tone.fill} opacity={active ? 0.95 : 0.42}>
        {active ? (
          <animateMotion dur={`${path.duration}s`} begin={`${path.delay}s`} repeatCount="indefinite" path={path.d} />
        ) : null}
      </circle>
      <circle cx="0" cy="0" r="5.5" fill={tone.fill} opacity={active ? 0.14 : 0.07}>
        {active ? (
          <animateMotion dur={`${path.duration}s`} begin={`${path.delay}s`} repeatCount="indefinite" path={path.d} />
        ) : null}
      </circle>
    </>
  );
}

export default function HeroAnimation({ theme = 'light', className = '' }: HeroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 100, damping: 18, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 100, damping: 18, mass: 0.5 });
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [isVisible, setIsVisible] = useState(true);
  const [canHover, setCanHover] = useState(false);
  const active = !shouldReduceMotion && isVisible;
  const gradientId = useId().replace(/:/g, '');
  const isDark = theme === 'dark';

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 });
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

    pointerX.set(normalizedX * 18);
    pointerY.set(normalizedY * 14);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div ref={rootRef} aria-hidden="true" className={`relative h-full w-full ${className}`.trim()}>
      <motion.div
        style={canHover && active ? { x: springX, y: springY } : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative h-full overflow-hidden ${isDark ? 'bg-neutral-950' : 'bg-transparent'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.44),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.34),transparent_22%),linear-gradient(135deg,rgba(240,237,230,0.28),rgba(255,255,255,0.08)_40%,rgba(236,242,248,0.28))]" />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),transparent_34%,rgba(255,255,255,0.2)_72%,transparent)]" />

        {haloOrbs.map((orb) => (
          <motion.div
            key={`${orb.top}-${orb.left}`}
            className="absolute rounded-full blur-3xl"
            style={{ top: orb.top, left: orb.left, width: orb.size, height: orb.size, background: orb.color }}
            animate={active ? { scale: [1, 1.06, 0.99, 1], opacity: [0.34, 0.52, 0.4, 0.34] } : undefined}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {ambientBands.map((band, index) => (
          <motion.div
            key={`${band.top}-${band.left}`}
            className="absolute h-px rounded-full blur-[1px]"
            style={{
              top: band.top,
              left: band.left,
              width: band.width,
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${band.color}, transparent)`,
              transform: `rotate(${band.rotate})`,
              transformOrigin: 'left center',
            }}
            animate={active ? { opacity: [0.22, 0.5, 0.22], scaleX: [0.96, 1.03, 0.96] } : undefined}
            transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative h-full min-h-[24rem] md:min-h-[33rem]">
          <div className="absolute inset-0">
            <svg className="h-full w-full" viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`${gradientId}-main`} x1="72" y1="96" x2="628" y2="402" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="rgba(21,140,140,0.12)" />
                <stop offset="0.5" stopColor="rgba(97,113,129,0.12)" />
                <stop offset="1" stopColor="rgba(201,163,92,0.12)" />
              </linearGradient>
            </defs>

            {signalPaths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                stroke={`url(#${gradientId}-main)`}
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="4 10"
                opacity="0.62"
              />
            ))}

            {active ? signalPaths.map((path) => <FlowPulse key={`pulse-${path.id}`} path={path} active={active} />) : null}

            {signalPoints.map((point) => {
              const tone = toneStyles[point.tone];

              return (
                <g key={`${point.x}-${point.y}`}>
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={point.size * 1.2}
                    fill={tone.glow}
                    animate={active ? { opacity: [0.06, 0.16, 0.06], scale: [0.96, 1.06, 0.96] } : undefined}
                    transition={{ duration: 3.6, delay: point.delay, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
                  />
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={point.size}
                    fill={tone.fill}
                    animate={active ? { opacity: [0.42, 0.9, 0.42], scale: [0.98, 1.04, 0.98] } : undefined}
                    transition={{ duration: 2.8, delay: point.delay, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
                  />
                  <circle cx={point.x} cy={point.y} r={point.size + 3.5} stroke={tone.stroke} strokeWidth="0.8" opacity="0.6" />
                </g>
              );
            })}
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
