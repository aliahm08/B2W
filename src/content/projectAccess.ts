export type ProtectedProjectConfig = {
  path: string;
  title: string;
  subtitle: string;
  overlayTop: number;
  maskedTitle: string;
  maskedClientDescription: string;
  maskedDescription: string;
  maskedImpact: string;
  maskedSeoTitle: string;
  maskedSeoDescription: string;
  teaserEyebrow: string;
  teaserHeadline: string;
  teaserSummary: string;
};

export type ProjectAccessLevel = 'locked' | 'proposal' | 'profile';

export const protectedProjects: ProtectedProjectConfig[] = [
  {
    path: '/borek-g',
    title: 'Borek-G',
    subtitle: 'Choose approved-email access or enter the business-profile password to open this restaurant marketing profile.',
    overlayTop: 780,
    maskedTitle: 'Neighborhood Restaurant Marketing Profile',
    maskedClientDescription: 'Independent restaurant in a high-traffic suburban market',
    maskedDescription: 'Business name, location, and client-specific findings stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Growth opportunity identified',
    maskedSeoTitle: 'Confidential Restaurant Marketing Profile',
    maskedSeoDescription: 'This restaurant marketing profile is access-controlled. Enter an approved email or password to reveal the client name and profile details.',
    teaserEyebrow: 'Access-Controlled Profile',
    teaserHeadline: 'Client identity and business details remain blurred until access is verified.',
    teaserSummary: 'Use an approved email or enter the business-profile password to reveal the full restaurant marketing profile and supporting documentation.',
  },
  {
    path: '/borek-g-operations',
    title: 'Borek-G Operations Chatbot',
    subtitle: 'Choose proposal access with an approved email, or enter the business-profile password.',
    overlayTop: 720,
    maskedTitle: 'Frontline Operations Copilot Prototype',
    maskedClientDescription: 'Independent restaurant team with recurring frontline questions',
    maskedDescription: 'Business name, operating details, and client-specific workflow documentation stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Response efficiency opportunity identified',
    maskedSeoTitle: 'Confidential Operations Prototype',
    maskedSeoDescription: 'This operations prototype is access-controlled. Enter an approved email or password to reveal the client name and workflow details.',
    teaserEyebrow: 'Access-Controlled Prototype',
    teaserHeadline: 'The client name and operating workflow are hidden until access is approved.',
    teaserSummary: 'Proposal viewers can enter an approved email. Profile viewers can enter the project password to reveal the full documentation and prototype scope.',
  },
  {
    path: '/uyghur-eats',
    title: 'Uyghur Eats',
    subtitle: 'Choose proposal access with an approved email, or enter the business-profile password.',
    overlayTop: 760,
    maskedTitle: 'Acquisition Readiness and Valuation Profile',
    maskedClientDescription: 'Specialty restaurant positioned in a strong urban corridor',
    maskedDescription: 'Business name, location, and acquisition-profile details stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Acquisition upside identified',
    maskedSeoTitle: 'Confidential Business Profile',
    maskedSeoDescription: 'This acquisition profile is access-controlled. Enter an approved email or password to reveal the client name and business details.',
    teaserEyebrow: 'Access-Controlled Business Profile',
    teaserHeadline: 'The client identity, location, and profile details are intentionally blurred.',
    teaserSummary: 'Proposal viewers can unlock the proposal version with an approved email. Qualified profile viewers can use the project password to reveal the full business profile.',
  },
];

export function getProtectedProject(pathname: string) {
  return protectedProjects.find((project) => project.path === pathname);
}

export function isProjectAccessGranted(accessLevel: ProjectAccessLevel): boolean {
  return accessLevel === 'proposal' || accessLevel === 'profile';
}

export async function fetchProjectAccessStatus(pathname: string): Promise<ProjectAccessLevel> {
  const response = await fetch(`/api/project-access/status?path=${encodeURIComponent(pathname)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return 'locked';
  }

  const payload = (await response.json()) as { accessLevel?: ProjectAccessLevel };
  return payload.accessLevel ?? 'locked';
}

type SubmitProjectAccessInput =
  | { path: string; method: 'proposal'; email: string }
  | { path: string; method: 'profile'; password: string };

export async function submitProjectAccess(input: SubmitProjectAccessInput): Promise<{ accessLevel: ProjectAccessLevel; error?: string }> {
  const response = await fetch('/api/project-access/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as { accessLevel?: ProjectAccessLevel; error?: string };

  if (!response.ok) {
    return {
      accessLevel: 'locked',
      error: payload.error || 'Unable to verify password.',
    };
  }

  return { accessLevel: payload.accessLevel ?? 'locked' };
}
