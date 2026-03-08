export const brandName = 'B2W AI';
export const productName = 'RelayOS';
export const siteName = `${brandName} ${productName}`;

export const missionStatement =
  'B2W builds AI solutions to improve communications and optimize operational insights.';

export const productDescription =
  'RelayOS is B2W\'s communication operating layer for teams that need clear decisions and controlled execution.';

export const navItems = [
  { label: 'B2W Plan', path: '/' },
  { label: 'Individuals', path: '/individuals' },
  { label: 'Enterprises', path: '/enterprises' },
  { label: 'Government', path: '/government' },
  { label: 'Hosted Demo', path: '/demo' }
] as const;

export const audiencePillars = [
  {
    title: 'Individuals',
    statement: 'AI services for Individuals',
    path: '/individuals'
  },
  {
    title: 'Enterprises',
    statement: 'AI consulting for enterprise clients',
    path: '/enterprises'
  },
  {
    title: 'Government',
    statement: 'AI platforms for federal agencies',
    path: '/government'
  }
] as const;

export const primaryCtaLabel = 'Launch Hosted Demo';
export const primaryCtaPath = '/demo';

export const secondaryCtaLabel = 'Book Intro Call';
export const secondaryCtaHref = 'mailto:team@b2w-ai.com?subject=B2W%20Intro%20Call';
