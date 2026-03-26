import { motion } from 'motion/react';

const logoPath = 'M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z';

const logoLayers = [
  { rotation: -30, opacity: 0.1 },
  { rotation: -20, opacity: 0.16 },
  { rotation: -10, opacity: 0.24 },
  { rotation: 0, opacity: 0.9 },
  { rotation: 10, opacity: 0.32 },
  { rotation: 20, opacity: 0.2 },
];

const guideWords = ['Unknown', 'Signal', 'Scope', 'Clarity'];

export default function AboutHeroGraphic() {
  return (
    <div className="about-hero-graphic relative overflow-hidden border border-neutral-200 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.95),rgba(255,255,255,0)_34%),linear-gradient(90deg,#050505_0%,#111111_24%,#2a2a2a_46%,#8d8d8d_69%,#dadada_86%,#f7f7f7_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[47%] w-px bg-black/12" />
      <div className="pointer-events-none absolute inset-0 about-hero-graphic__scan" />

      <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-6 md:min-h-[520px] md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[13rem] text-white">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/60">Black to White</p>
            <p className="mt-4 text-sm leading-6 text-white/82">
              From unclear operating reality to something directional, measurable, and usable.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="border border-black/15 bg-white/88 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-600 backdrop-blur-sm">
              Mission Oriented
            </span>
            <span className="border border-black/15 bg-white/88 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-600 backdrop-blur-sm">
              Results Driven
            </span>
          </div>
        </div>

        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 h-px w-20 bg-white/26 md:w-28" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative flex items-center gap-5 md:gap-7"
            >
              <svg viewBox="0 0 96 96" className="h-28 w-28 shrink-0 text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)] md:h-36 md:w-36">
                {logoLayers.map((layer) => (
                  <path
                    key={layer.rotation}
                    d={logoPath}
                    fill="currentColor"
                    fillOpacity={layer.opacity}
                    className="about-hero-graphic__logo-layer"
                    transform={`rotate(${layer.rotation} 48 48)`}
                  />
                ))}
              </svg>

              <div className="space-y-2">
                <div className="text-4xl font-medium tracking-[-0.08em] text-white md:text-6xl">B2W</div>
                <p className="max-w-xs text-sm leading-6 text-white/76 md:text-base">
                  We translate ambiguity into operating clarity and turn that clarity into shipped work.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-3">
            {guideWords.map((word, index) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.14 * index, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <span className="w-12 text-[10px] font-mono uppercase tracking-[0.24em] text-black/34 md:w-14">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 border border-black/12 bg-white/78 px-4 py-3 backdrop-blur-sm">
                  <span className={`text-sm font-medium md:text-base ${index === guideWords.length - 1 ? 'text-black' : 'text-neutral-600'}`}>
                    {word}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
