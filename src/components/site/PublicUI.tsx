import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, LockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ProductStage } from '../../content/unifiedSite';
import { trackSiteEvent } from '../../lib/siteAnalytics';
import { isContactEmailHref } from '../../lib/contact';
import DescrambleText from '../DescrambleText';

export const pageWidth = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10';

export function Eyebrow({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'rust' | 'plum' | 'green' }) {
  const colors = {
    gold: 'text-[var(--b2w-gold-dark)]',
    rust: 'text-[var(--b2w-rust)]',
    plum: 'text-[var(--b2w-plum)]',
    green: 'text-[var(--b2w-green)]',
  };

  return <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.22em] ${colors[tone]}`}>{children}</p>;
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  eventLabel,
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'product' | 'tertiary';
  eventLabel?: string;
  className?: string;
}) {
  const variants = {
    primary: 'border-[var(--b2w-forest)] bg-[var(--b2w-forest)] text-white hover:bg-[var(--b2w-forest-deep)]',
    secondary: 'border-[var(--b2w-forest)]/20 bg-white/70 text-[var(--b2w-ink)] hover:border-[var(--b2w-forest)] hover:bg-white',
    product: 'border-[var(--b2w-rust)] bg-[var(--b2w-rust)] text-white hover:bg-[var(--b2w-rust-dark)]',
    tertiary: 'border-transparent bg-transparent px-0 text-[var(--b2w-ink)] hover:text-[var(--b2w-rust)]',
  };

  const linkClassName = `group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] focus-visible:ring-offset-2 ${variants[variant]} ${className}`;
  const handleClick = () => trackSiteEvent('cta_selected', { label: eventLabel ?? String(children), destination: to });
  const content = <>{typeof children === 'string' ? <DescrambleText text={children} /> : children}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" /></>;
  return isContactEmailHref(to)
    ? <a href={to} onClick={handleClick} className={linkClassName}>{content}</a>
    : <Link to={to} onClick={handleClick} className={linkClassName}>{content}</Link>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  primary,
  secondary,
  tone = 'gold',
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  primary?: { label: string; to: string; variant?: 'primary' | 'product' };
  secondary?: { label: string; to: string };
  tone?: 'gold' | 'rust' | 'plum' | 'green';
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`${pageWidth} relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40`}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-16 h-80 w-80 rounded-full bg-[var(--b2w-rust-soft)]/75 blur-3xl"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [.48, .82, .48] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,.55fr)] xl:items-end">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-[14ch] text-5xl font-medium leading-[0.94] tracking-[-0.055em] text-[var(--b2w-ink)] sm:text-7xl lg:text-[6.4rem]">
            {title}
          </h1>
        </motion.div>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: .52, delay: .08, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 border-l border-[var(--b2w-line)] pl-6 sm:pl-8"
        >
          <p className="text-base leading-8 text-[var(--b2w-ink-muted)] sm:text-lg">{description}</p>
          {aside ? <div className="mt-6">{aside}</div> : null}
          {primary ? (
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ButtonLink to={primary.to} variant={primary.variant ?? 'primary'}>{primary.label}</ButtonLink>
              {secondary ? <ButtonLink to={secondary.to} variant="tertiary">{secondary.label}</ButtonLink> : null}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeading({
  index,
  title,
  description,
  tone = 'gold',
}: {
  index?: string;
  title: string;
  description?: string;
  tone?: 'gold' | 'rust' | 'plum' | 'green';
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.65fr)] lg:items-end"
    >
      <div>
        {index ? <Eyebrow tone={tone}>{index}</Eyebrow> : null}
        <h2 className={`${index ? 'mt-4' : ''} max-w-[18ch] text-4xl font-medium leading-[1] tracking-[-0.045em] text-[var(--b2w-ink)] sm:text-5xl`}>{title}</h2>
      </div>
      {description ? <p className="max-w-2xl text-sm leading-7 text-[var(--b2w-ink-muted)]">{description}</p> : null}
    </motion.header>
  );
}

export function StatusBadge({ stage }: { stage: ProductStage | 'Published' }) {
  const styles: Record<ProductStage | 'Published', { className: string; Icon: typeof CheckCircle2 }> = {
    'Available now': { className: 'bg-[var(--b2w-green-soft)] text-[var(--b2w-green-dark)]', Icon: CheckCircle2 },
    Published: { className: 'bg-[var(--b2w-green-soft)] text-[var(--b2w-green-dark)]', Icon: CheckCircle2 },
    'In development': { className: 'bg-[var(--b2w-gold-soft)] text-[var(--b2w-gold-dark)]', Icon: Clock3 },
    Planned: { className: 'bg-[var(--b2w-gold-soft)] text-[var(--b2w-gold-dark)]', Icon: CircleAlert },
    Future: { className: 'bg-[var(--b2w-canvas-deep)] text-[var(--b2w-ink-muted)]', Icon: LockKeyhole },
  };
  const style = styles[stage];

  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.14em] ${style.className}`}>
      <style.Icon className="h-3 w-3" />
      {stage}
    </span>
  );
}

export function EvidenceBlock({ label = 'Evidence and boundaries', children }: { label?: string; children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.aside initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .4, ease: [0.22, 1, 0.36, 1] }} className="border-l-2 border-[var(--b2w-gold)] bg-white/60 p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold-dark)]">{label}</p>
      <div className="mt-3 text-sm leading-7 text-[var(--b2w-ink-muted)]">{children}</div>
    </motion.aside>
  );
}

export function CTASection({
  eyebrow,
  title,
  description,
  action,
  secondary,
  tone = 'forest',
  compactMobile = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action: { label: string; to: string; variant?: 'primary' | 'product' };
  secondary?: { label: string; to: string };
  tone?: 'forest' | 'rust' | 'plum';
  compactMobile?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const tones = {
    forest: 'bg-[var(--b2w-forest)] text-white',
    rust: 'bg-[var(--b2w-rust-dark)] text-white',
    plum: 'bg-[var(--b2w-plum-dark)] text-white',
  };

  return (
    <section className={`${pageWidth} ${compactMobile ? 'py-12' : 'py-16'} sm:py-24`}>
      <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 26, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: .56, ease: [0.22, 1, 0.36, 1] }} className={`relative grid overflow-hidden ${compactMobile ? 'gap-6 rounded-[1.5rem] p-5' : 'gap-8 rounded-[2rem] p-7'} sm:gap-8 sm:rounded-[2rem] sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.5fr)] lg:items-end ${tones[tone]}`}>
        <motion.div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [.45, .8, .45] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} />
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--b2w-gold)]">{eyebrow}</p>
          <h2 className={`mt-4 max-w-[16ch] font-medium leading-none tracking-[-0.045em] ${compactMobile ? 'text-3xl' : 'text-4xl'} sm:text-5xl`}>{title}</h2>
        </div>
        <div>
          <p className="text-sm leading-7 text-white/65">{description}</p>
          <div className={`mt-6 flex gap-3 ${compactMobile ? 'flex-col sm:flex-row sm:flex-wrap' : 'flex-wrap'}`}>
            <ButtonLink to={action.to} variant={action.variant ?? (tone === 'rust' ? 'product' : 'secondary')} className={`${compactMobile ? 'w-full sm:w-auto' : ''} ${tone !== 'rust' ? '!border-white/20 !bg-white !text-[#2b1724] hover:!bg-[#f8edf3]' : ''}`}>
              {action.label}
            </ButtonLink>
            {secondary ? <ButtonLink to={secondary.to} variant="tertiary" className={`${compactMobile ? 'w-full sm:w-auto' : ''} text-white hover:text-[var(--b2w-gold)]`}>{secondary.label}</ButtonLink> : null}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function JourneyRail({ active }: { active: 'Orient' | 'Diagnose' | 'Resolve' | 'Prove' | 'Advance' }) {
  const steps = ['Orient', 'Diagnose', 'Resolve', 'Prove', 'Advance'];
  return (
    <ol className="grid grid-cols-5 overflow-hidden rounded-full border border-[var(--b2w-line)] bg-white/60 p-1" aria-label="Page progression">
      {steps.map((step) => (
        <li key={step} className={`rounded-full px-2 py-2 text-center text-[8px] font-semibold uppercase tracking-[0.1em] sm:text-[9px] ${step === active ? 'bg-[var(--b2w-forest)] text-white' : 'text-[var(--b2w-ink-faint)]'}`}>
          {step}
        </li>
      ))}
    </ol>
  );
}
