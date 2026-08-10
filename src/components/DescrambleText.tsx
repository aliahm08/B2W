import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const descrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function DescrambleText({
  text,
  className = '',
  animateOnMount = false,
  animateOnView = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  animateOnMount?: boolean;
  animateOnView?: boolean;
  delay?: number;
}) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const segments = useMemo(() => text.split(/(\s+)/), [text]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runDescramble = useCallback(() => {
    clearTimer();

    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const totalFrames = Math.max(14, Math.min(28, Math.round(text.length * 1.1)));

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const easedProgress = progress < .5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const settledCharacters = Math.floor(easedProgress * text.length);

      setDisplayText(text.split('').map((character, index) => {
        if (!/[A-Za-z0-9]/.test(character) || index < settledCharacters) return character;
        return descrambleCharacters[Math.floor(Math.random() * descrambleCharacters.length)];
      }).join(''));

      if (frame < totalFrames) timerRef.current = window.setTimeout(tick, 24);
      else {
        setDisplayText(text);
        timerRef.current = null;
      }
    };

    tick();
  }, [clearTimer, shouldReduceMotion, text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const interactionHost = root.closest('a, button');
    if (!interactionHost) return;
    interactionHost.addEventListener('mouseenter', runDescramble);
    interactionHost.addEventListener('focusin', runDescramble);
    return () => {
      interactionHost.removeEventListener('mouseenter', runDescramble);
      interactionHost.removeEventListener('focusin', runDescramble);
    };
  }, [runDescramble]);

  useEffect(() => {
    if (!animateOnMount || shouldReduceMotion) return;
    timerRef.current = window.setTimeout(runDescramble, delay);
    return clearTimer;
  }, [animateOnMount, clearTimer, delay, runDescramble, shouldReduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animateOnView || shouldReduceMotion) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timerRef.current = window.setTimeout(runDescramble, delay);
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [animateOnView, clearTimer, delay, runDescramble, shouldReduceMotion]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <span ref={rootRef} className={className} aria-label={text} data-descramble-text>
      <span aria-hidden="true">
        {(() => {
          let cursor = 0;
          return segments.map((segment, segmentIndex) => {
            const start = cursor;
            cursor += segment.length;
            if (/^\s+$/.test(segment)) return segment;
            return (
              <span key={`${segment}-${segmentIndex}`} className="inline-block whitespace-nowrap">
                {Array.from(segment).map((character, characterIndex) => (
                  <span key={`${character}-${characterIndex}`} className="scramble-character" data-final={character}>
                    <span>{displayText[start + characterIndex] ?? character}</span>
                  </span>
                ))}
              </span>
            );
          });
        })()}
      </span>
    </span>
  );
}
