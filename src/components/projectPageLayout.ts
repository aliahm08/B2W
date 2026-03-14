export const projectPageShellClassName = 'min-h-screen max-w-7xl mx-auto px-4 pb-12 pt-20 sm:px-6 md:pb-16 md:pt-24';

export const projectPageHeaderClassName = 'mt-8 mb-10 border-b border-neutral-100 pb-8 md:mt-12 md:mb-12';

export const projectPageBackLinkClassName =
  'mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black';

export const projectPageEyebrowClassName =
  'mb-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500';

export const projectHeroGridClassNames = {
  proposal: 'grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.9fr)] lg:items-start',
  operations: 'grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-start',
  profile: 'grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] lg:items-start',
} as const;
