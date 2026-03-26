import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import PreviewReturnBar from '../../../../components/PreviewReturnBar';
import ClientNavbar, { type ClientNavAction } from '../../../../components/ClientNavbar';
import Seo from '../../../../components/Seo';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../../../components/projectPageLayout';

type PreviewPageFrameProps = {
  title: string;
  description: string;
  returnPath: string;
  returnLabel: string;
  returnDetail: string;
  eyebrow: string;
  kicker: string;
  heading: string;
  summary: string;
  tagContent: ReactNode;
  asideLabel: string;
  asideHeading: string;
  asideSummary: string;
  metricsContent: ReactNode;
  heroNotes: ReactNode;
  floatingContent?: ReactNode;
  navContent: ReactNode;
  mainContent: ReactNode;
  shellClassName?: string;
};

export default function PreviewPageFrame({
  title,
  description,
  returnPath,
  returnLabel,
  returnDetail,
  eyebrow,
  kicker,
  heading,
  summary,
  tagContent,
  asideLabel,
  asideHeading,
  asideSummary,
  metricsContent,
  heroNotes,
  floatingContent,
  navContent,
  mainContent,
  shellClassName,
}: PreviewPageFrameProps) {
  const navItems: ClientNavAction[] = [
    { label: 'Proposal', to: '/client/uyghur-eats' },
    { label: 'Profile', to: '/client/uyghur-eats/profile' },
    { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
    { label: 'Documentation', to: '/client/uyghur-eats/data-room' },
    { label: 'Terms', to: '/client/uyghur-eats/terms' },
  ];

  const articleClassName = shellClassName
    ? `${projectPageShellClassName} ${shellClassName}`
    : projectPageShellClassName;

  return (
    <article className={articleClassName}>
      <ClientNavbar clientName="Uyghur Eats" clientLink="/client/uyghur-eats" navItems={navItems} />
      <Seo title={title} description={description} robots="noindex, nofollow" />

      <PreviewReturnBar returnPath={returnPath} label={returnLabel} detail={returnDetail} />

      {floatingContent}

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <header className={projectPageHeaderClassName}>
          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Food & Beverage</span>
            <span className="text-neutral-300">•</span>
            <span>{eyebrow}</span>
          </div>

          <div className={projectHeroGridClassNames.profile}>
            <div>
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                {kicker}
              </p>
              <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                {heading}
              </h1>
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                {summary}
              </p>

              <div className="mb-8 grid gap-3 md:grid-cols-2">
                {heroNotes}
              </div>

              <div className="flex flex-wrap gap-2">{tagContent}</div>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                {asideLabel}
              </p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                {asideHeading}
              </h2>
              <p className="mb-6 text-sm leading-6 text-neutral-300">
                {asideSummary}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">{metricsContent}</div>
            </aside>
          </div>
        </header>

        <main className="space-y-12">
          {navContent}
          {mainContent}
        </main>
      </motion.div>
    </article>
  );
}
