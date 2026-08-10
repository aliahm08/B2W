import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import DescrambleText from './DescrambleText';
import B2WIcon from './logo/B2WIcon';

export const homepageMenus = [
  { label: 'JasonAI', to: '/jasonai' },
  { label: 'Workflows', to: '/workflows' },
  { label: 'Pricing', to: '/pricing' },
] as const;

export function HomeSiteHeader({
  textClass = 'text-slate-950',
  followPageTheme = false,
  adaptiveContrast = false,
}: {
  textClass?: string;
  followPageTheme?: boolean;
  adaptiveContrast?: boolean;
}) {
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 20);

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolledState);
  }, []);

  useEffect(() => {
    if (!followPageTheme && !adaptiveContrast) return undefined;

    let frame = 0;
    const updateTheme = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sampleY = 48;
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));
        const activeSection = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= sampleY && bounds.bottom > sampleY;
        });
        const nextTheme = activeSection?.dataset.headerTheme === 'light' ? 'light' : 'dark';
        setPageTheme((current) => current === nextTheme ? current : nextTheme);
      });
    };

    updateTheme();
    window.addEventListener('scroll', updateTheme, { passive: true });
    window.addEventListener('resize', updateTheme);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateTheme);
      window.removeEventListener('resize', updateTheme);
    };
  }, [adaptiveContrast, followPageTheme]);

  const resolvedTextClass = followPageTheme || adaptiveContrast
    ? pageTheme === 'light' ? 'text-[#172019]' : 'text-white'
    : textClass;
  const usesDarkChrome = followPageTheme || adaptiveContrast
    ? pageTheme === 'dark'
    : textClass.includes('text-white');
  const scrolledChromeClass = usesDarkChrome
    ? 'border-white/20 bg-[#101812]/82 shadow-[0_18px_55px_rgba(4,10,6,0.32)]'
    : 'border-black/12 bg-[#fbfaf6]/82 shadow-[0_18px_55px_rgba(15,23,42,0.16)]';

  return (
    <>
      <motion.header
        data-page-theme={followPageTheme || adaptiveContrast ? pageTheme : undefined}
        className={`fixed left-0 right-0 z-50 mx-auto grid grid-cols-[auto_1fr_auto] items-center border transition-[top,width,max-width,padding,background-color,border-color,box-shadow,color] duration-300 ${
          isScrolled
            ? `top-3 w-[calc(100%-1.5rem)] max-w-[calc(80rem-1.5rem)] rounded-[2rem] px-4 py-3 backdrop-blur-2xl backdrop-saturate-150 sm:rounded-full sm:px-6 ${scrolledChromeClass}`
            : 'top-0 w-full max-w-7xl border-transparent bg-transparent px-5 py-4 sm:px-8 sm:py-5 lg:px-10'
        } ${resolvedTextClass}`}
        initial={adaptiveContrast ? { opacity: 0, y: -14 } : { opacity: 0, y: -14, filter: 'blur(8px)' }}
        animate={adaptiveContrast ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" aria-label="B2W home" className="inline-flex items-center">
          <span className="inline-flex min-h-10 items-center gap-3">
            <B2WIcon title="" className="h-8 w-9 shrink-0 overflow-visible sm:h-9 sm:w-10" />
          </span>
        </Link>
        <nav aria-label="Homepage navigation" className="order-3 col-span-3 mt-3 flex items-center justify-center gap-1 sm:order-none sm:col-span-1 sm:mt-0 sm:gap-2">
          {homepageMenus.map((menu, menuIndex) => (
            <Link
              key={menu.label}
              to={menu.to}
              className="inline-flex min-h-9 items-center rounded-full px-2.5 text-xs font-semibold transition-colors hover:bg-white hover:text-black sm:px-3 sm:text-sm"
            >
              <DescrambleText text={menu.label} animateOnMount delay={120 + menuIndex * 90} />
            </Link>
          ))}
        </nav>
        <a
          href="mailto:info@b2w-ai.com"
          className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-current/30 px-4 text-sm font-semibold shadow-sm transition-all hover:bg-white hover:text-black"
        >
          <DescrambleText text="Contact" animateOnMount delay={420} />
          <Mail className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5" />
        </a>
      </motion.header>

    </>
  );
}

export function HomeSiteFooter({ className = 'text-slate-500' }: { className?: string }) {
  return (
    <motion.footer
      className={`relative z-20 -mt-12 mx-auto grid w-full max-w-7xl gap-8 bg-inherit px-5 pb-8 pt-20 text-sm backdrop-blur-3xl sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end sm:px-8 lg:px-10 ${className}`}
      initial={{ opacity: 0, y: 96, filter: 'blur(30px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-inherit backdrop-blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.82 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.72 }}
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }}
      />
      <div>
        <p className="font-semibold">B2W LLC</p>
        <p className="mt-1 text-xs opacity-75">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
      <nav aria-label="Footer sitemap">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-65">Sitemap</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {homepageMenus.map((menu) => (
            <Link key={menu.label} to={menu.to} className="text-xs font-semibold underline-offset-4 transition hover:underline">{menu.label}</Link>
          ))}
        </div>
        <a href="mailto:info@b2w-ai.com" className="mt-5 inline-flex text-xs font-semibold underline-offset-4 transition hover:underline">Contact</a>
      </nav>
      <Link
        to="/internal"
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-xs font-semibold transition hover:bg-white/15"
      >
        <LockKeyhole className="h-3.5 w-3.5" />
        Internal
      </Link>
    </motion.footer>
  );
}
