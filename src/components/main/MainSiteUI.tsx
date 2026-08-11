import type { ReactNode } from 'react';
import { ArrowRight, Check, Circle, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mainPageWidth } from './MainSiteChrome';
import { isContactEmailHref } from '../../lib/contact';

export function MainButton({ to, children, variant = 'primary' }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'text' }) {
  const style = variant === 'primary' ? 'bg-[#18201b] text-white hover:bg-[#315f79]' : variant === 'secondary' ? 'border border-black/15 bg-white text-[#18201b] hover:border-black/35' : 'text-[#315f79] underline underline-offset-4';
  const className = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79] focus-visible:ring-offset-2 ${style}`;
  const content = <>{children}<ArrowRight className="h-4 w-4" /></>;
  return isContactEmailHref(to) ? <a href={to} className={className}>{content}</a> : <Link to={to} className={className}>{content}</Link>;
}

export function MainHero({ eyebrow, title, description, primary = { label: 'Try JasonAI', to: '/get-started' }, secondary = { label: 'See How It Works', to: '/jasonai/how-it-works' }, aside }: { eyebrow: string; title: string; description: string; primary?: { label: string; to: string } | null; secondary?: { label: string; to: string } | null; aside?: ReactNode }) {
  return <section className={`${mainPageWidth} pb-20 pt-36 sm:pb-28 sm:pt-44`}><div className={`grid gap-10 ${aside ? 'lg:grid-cols-[1.02fr_.98fr] lg:items-center' : ''}`}><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#315f79]">{eyebrow}</p><h1 className="mt-6 max-w-[13ch] text-[clamp(3.25rem,8vw,7.5rem)] font-semibold leading-[.9] tracking-[-.065em]">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#18201b]/65 sm:text-xl">{description}</p>{primary || secondary ? <div className="mt-8 flex flex-wrap gap-3">{primary ? <MainButton to={primary.to}>{primary.label}</MainButton> : null}{secondary ? <MainButton to={secondary.to} variant="secondary">{secondary.label}</MainButton> : null}</div> : null}</div>{aside ? <div>{aside}</div> : null}</div></section>;
}

export function MainSection({ children, tone = 'paper', id, className = '' }: { children: ReactNode; tone?: 'paper' | 'white' | 'dark' | 'blue'; id?: string; className?: string }) {
  const tones = { paper: 'bg-[#f7f5ef]', white: 'bg-white', dark: 'bg-[#18201b] text-white', blue: 'bg-[#e7eef1]' };
  return <section id={id} className={`${tones[tone]} ${className}`}><div className={`${mainPageWidth} py-18 sm:py-24`}>{children}</div></section>;
}

export function SectionIntro({ eyebrow, title, description, inverse = false }: { eyebrow?: string; title: string; description?: string; inverse?: boolean }) {
  return <header className="grid gap-5 lg:grid-cols-[1fr_.68fr] lg:items-end"> <div>{eyebrow ? <p className={`text-xs font-bold uppercase tracking-[.16em] ${inverse ? 'text-[#9cc0d1]' : 'text-[#315f79]'}`}>{eyebrow}</p> : null}<h2 className={`${eyebrow ? 'mt-4' : ''} max-w-[18ch] text-4xl font-semibold leading-[.98] tracking-[-.05em] sm:text-6xl`}>{title}</h2></div>{description ? <p className={`text-base leading-8 ${inverse ? 'text-white/62' : 'text-[#18201b]/62'}`}>{description}</p> : null}</header>;
}

export function InfoCard({ title, body, to, label, children }: { title: string; body: string; to?: string; label?: string; children?: ReactNode }) {
  const content = <><h3 className="text-xl font-bold tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#18201b]/62">{body}</p>{children}{to ? <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#315f79]">{label ?? 'Read more'}<ArrowRight className="h-4 w-4" /></span> : null}</>;
  return to ? <Link to={to} className="group block rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(17,19,21,.05)] transition hover:-translate-y-1 hover:border-[#315f79]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79]">{content}</Link> : <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(17,19,21,.05)]">{content}</article>;
}

export function Status({ children, kind = 'available' }: { children: ReactNode; kind?: 'available' | 'configurable' | 'planned' }) {
  const Icon = kind === 'available' ? Check : kind === 'planned' ? Clock3 : Circle;
  const style = kind === 'available' ? 'bg-[#dcebe3] text-[#23533f]' : kind === 'planned' ? 'bg-[#ece1cf] text-[#6c532f]' : 'bg-[#e7eef1] text-[#315f79]';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${style}`}><Icon className="h-3 w-3" />{children}</span>;
}

export function FinalCTA({ title = 'Give JasonAI one job to keep track of.', description = 'See whether it makes your work easier before changing anything else.' }: { title?: string; description?: string }) {
  return <MainSection tone="dark"><div className="grid gap-8 lg:grid-cols-[1fr_.52fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9cc0d1]">One real workflow</p><h2 className="mt-4 max-w-[15ch] text-4xl font-semibold leading-none tracking-[-.05em] sm:text-6xl">{title}</h2></div><div><p className="text-base leading-8 text-white/62">{description}</p><div className="mt-6 flex flex-wrap gap-3"><MainButton to="/get-started" variant="secondary">Try JasonAI</MainButton><MainButton to="/book-demo" variant="text">Book a Walkthrough</MainButton></div></div></div></MainSection>;
}

export function LinkGrid({ items }: { items: Array<{ title: string; body: string; to: string; label?: string }> }) {
  return <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <InfoCard key={`${item.to}-${item.title}`} {...item} />)}</div>;
}
