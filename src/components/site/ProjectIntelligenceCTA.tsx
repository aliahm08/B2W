import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ButtonLink, pageWidth } from './PublicUI';

export default function ProjectIntelligenceCTA({
  eyebrow,
  title,
  description,
  action,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  const reduceMotion = useReducedMotion();
  return (
    <section className={`${pageWidth} py-16 sm:py-24`}>
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-90px' }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[2rem] bg-[#111315] p-7 text-white sm:p-10 lg:p-12">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#315f79]/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#39745f]/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.5fr)] lg:items-end lg:gap-12">
          <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.2em] text-[#f4b28c]">{eyebrow}</p><h2 className="mt-4 max-w-[15ch] text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[.95] tracking-[-.052em]">{title}</h2></div>
          <div><p className="text-sm leading-7 text-white/62">{description}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><ButtonLink to={action.to} variant="secondary" className="!border-white/15 !bg-white !text-[#111315]">{action.label}</ButtonLink>{secondary ? <ButtonLink to={secondary.to} variant="tertiary" className="text-white hover:text-[#f4b28c]">{secondary.label}</ButtonLink> : null}</div></div>
        </div>
        <div className="relative mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {['Map one information gap', 'Locate the approved sources', 'Define the smallest useful workflow'].map((item) => <div key={item} className="flex items-center gap-2.5 bg-[#111315]/88 px-4 py-3.5 text-[10px] font-medium uppercase tracking-[.1em] text-white/42"><Check className="h-3.5 w-3.5 shrink-0 text-[#a9c7a8]" />{item}</div>)}
        </div>
      </motion.div>
    </section>
  );
}
