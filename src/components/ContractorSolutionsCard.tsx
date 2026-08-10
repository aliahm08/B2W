import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HardHat, ListChecks, Workflow } from 'lucide-react';
import DescrambleText from './DescrambleText';

const slides = [
  {
    label: 'Solutions',
    title: 'Choose the right starting point.',
    description: 'See how B2W supports trade businesses, contracting firms, and AEC companies with practical AI systems.',
    details: ['Trade businesses', 'Contracting firms', 'AEC companies'],
    to: '/industries/general-contracting',
    cta: 'Explore contractor solutions',
    icon: HardHat,
  },
  {
    label: 'Use Cases',
    title: 'Start with the work slowing the team down.',
    description: 'Find practical applications for project communication, estimates, decisions, handoffs, and follow-up.',
    details: ['Find job context faster', 'Clarify decisions and ownership', 'Reduce repeated administrative work'],
    to: '/solutions/business-use-cases',
    cta: 'Explore contractor use cases',
    icon: ListChecks,
  },
  {
    label: 'Workflows',
    title: 'Turn approved inputs into useful outputs.',
    description: 'See how communication and project information can become reviewable summaries, scopes, and next steps.',
    details: ['Approved project inputs', 'Reviewable AI output', 'Clear owner and next action'],
    to: '/solutions/ai-workflows',
    cta: 'Explore AI workflows',
    icon: Workflow,
  },
] as const;

export default function ContractorSolutionsCard() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];
  const SlideIcon = slide.icon;
  const move = (direction: number) => setActiveSlide((current) => (current + direction + slides.length) % slides.length);

  return (
    <motion.article
      id="solutions"
      data-header-theme="dark"
      className="group relative overflow-hidden rounded-[32px] border border-[#31513a] bg-[#0b2014] text-white shadow-[0_28px_90px_rgba(8,9,10,.2)] lg:col-span-2"
      initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div aria-hidden="true" className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#6d9a72]/35 blur-3xl" animate={{ scale: [1, 1.08, 1], opacity: [0.68, 1, 0.68] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,.025),transparent_48%,rgba(124,166,127,.08))]" />
      <div className="relative z-10 p-7 sm:p-9 lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div><p className="font-mono text-[11px] font-semibold uppercase tracking-[.22em] text-[#a9c7a8]">Solutions</p><span className="mt-3 inline-flex rounded-full border border-[#87aa8b]/35 bg-[#87aa8b]/10 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#b8d3b8]">For general contractors</span></div>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.05] text-[#c6dbc5]"><HardHat className="h-5 w-5" /></span>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <h2 className="max-w-[12ch] text-5xl font-medium leading-[.94] tracking-[-.055em] sm:text-6xl"><DescrambleText text="Solutions for general contractors." animateOnView delay={80} /></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">Explore the solutions, use cases, and AI workflows designed around how contractors already communicate and deliver work.</p>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-white/12 bg-black/15 backdrop-blur-sm">
            <div className="flex border-b border-white/10 p-2" role="tablist" aria-label="Contractor solution paths">
              {slides.map((item, index) => <button key={item.label} type="button" role="tab" aria-selected={activeSlide === index} onClick={() => setActiveSlide(index)} className={`min-h-10 flex-1 rounded-full px-3 text-xs font-semibold transition sm:text-sm ${activeSlide === index ? 'bg-[#dfe9d8] text-[#17321f]' : 'text-white/50 hover:text-white'}`}>{item.label}</button>)}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={slide.label} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.24 }} className="p-6 sm:p-7">
                <SlideIcon className="h-5 w-5 text-[#a9c7a8]" />
                <p className="mt-6 font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">{slide.label}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">{slide.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{slide.description}</p>
                <ul className="mt-5 grid gap-2 text-sm text-white/68 sm:grid-cols-3">{slide.details.map((detail) => <li key={detail} className="border-l border-[#87aa8b]/45 pl-3">{detail}</li>)}</ul>
                <div className="mt-7 flex items-center justify-between gap-4">
                  <Link to={slide.to} className="inline-flex items-center gap-2 text-sm font-semibold text-[#b8d3b8] transition hover:text-white">{slide.cta}<ArrowRight className="h-4 w-4" /></Link>
                  <div className="flex gap-2"><button type="button" onClick={() => move(-1)} aria-label="Previous solution path" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/65 transition hover:bg-white hover:text-[#17321f]"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => move(1)} aria-label="Next solution path" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/65 transition hover:bg-white hover:text-[#17321f]"><ArrowRight className="h-4 w-4" /></button></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
