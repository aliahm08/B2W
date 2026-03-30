import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../components/projectPageLayout';

export const fosterPartnersBasePath = '/client/foster-partners';

export function goToFosterPartnersContact() {
  const contact = document.getElementById('contact');

  if (contact) {
    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.location.href = `${fosterPartnersBasePath}#contact`;
}

export function getFosterPartnersNavItems(): ClientNavAction[] {
  return [
    { label: 'Overview', to: fosterPartnersBasePath },
    { label: 'Development Dashboard', to: `${fosterPartnersBasePath}/development-dashboard` },
    { label: 'Design Lifecycle', to: `${fosterPartnersBasePath}/development-dashboard/design` },
    { label: 'Build Lifecycle', to: `${fosterPartnersBasePath}/development-dashboard/build` },
    { label: 'Development Lifecycle', to: `${fosterPartnersBasePath}/development-dashboard/development` },
    { label: 'Scope', to: `${fosterPartnersBasePath}/scope` },
    { label: 'Operating Model', to: `${fosterPartnersBasePath}/operating-model` },
    { label: 'Governance', to: `${fosterPartnersBasePath}/governance` },
    { label: 'Terms', to: `${fosterPartnersBasePath}/terms` },
    { label: 'Contact', type: 'cta', onClick: goToFosterPartnersContact },
  ];
}

type FosterPartnersMetric = {
  label: string;
  value: string;
};

type FosterPartnersPageFrameProps = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  heading: string;
  summary: string;
  asideLabel: string;
  asideHeading: string;
  asideSummary: string;
  metrics: FosterPartnersMetric[];
  children: ReactNode;
};

const heroReveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

export function FosterPartnersPageFrame({
  seoTitle,
  seoDescription,
  eyebrow,
  heading,
  summary,
  asideLabel,
  asideHeading,
  asideSummary,
  metrics,
  children,
}: FosterPartnersPageFrameProps) {
  return (
    <article className={projectPageShellClassName}>
      <ClientNavbar
        clientName="Foster + Partners"
        clientLink={fosterPartnersBasePath}
        navItems={getFosterPartnersNavItems()}
      />
      <Seo title={seoTitle} description={seoDescription} robots="noindex, nofollow" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <header className={projectPageHeaderClassName}>
          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Client Portal</span>
            <span className="text-neutral-300">•</span>
            <span>{eyebrow}</span>
          </div>

          <div className={projectHeroGridClassNames.operations}>
            <div>
              <motion.h1
                {...heroReveal}
                className="max-w-5xl text-4xl font-medium tracking-tight text-black md:text-6xl"
              >
                {heading}
              </motion.h1>

              <motion.p
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.05 }}
                className="mt-6 max-w-4xl text-lg leading-relaxed text-neutral-600 md:text-xl"
              >
                {summary}
              </motion.p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <motion.p
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.08 }}
                className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400"
              >
                {asideLabel}
              </motion.p>
              <motion.h2
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.12 }}
                className="max-w-md text-2xl font-medium leading-tight tracking-tight md:text-4xl"
              >
                {asideHeading}
              </motion.h2>
              <motion.p
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.16 }}
                className="mt-5 text-sm leading-6 text-neutral-300"
              >
                {asideSummary}
              </motion.p>

              <motion.div
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.2 }}
                className="mt-6 grid grid-cols-2 gap-3 text-sm"
              >
                {metrics.map((item) => (
                  <div key={item.label} className="border border-white/15 bg-white/5 p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">{item.label}</p>
                    <p className="font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            </aside>
          </div>
        </header>

        <main className="space-y-12">{children}</main>
      </motion.div>

      <Footer />
    </article>
  );
}
