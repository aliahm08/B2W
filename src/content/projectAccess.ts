export type ProjectAccessView = 'proposal' | 'profile';
export type ProjectAccessLevel = ProjectAccessView | 'locked';

export type ProtectedProjectConfig = {
  path: string;
  scopeId: string;
  view: ProjectAccessView;
  routes: Partial<Record<ProjectAccessView, string>>;
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

export type ProjectAccessStatus = {
  scopeId: string | null;
  accessLevel: ProjectAccessLevel;
  grantedLevels: ProjectAccessView[];
  currentView: ProjectAccessView | null;
  availableViews: Partial<Record<ProjectAccessView, string>>;
  title: string;
  redirectPath?: string;
  error?: string;
};

export const protectedProjects: ProtectedProjectConfig[] = [
  {
    path: '/borek-g',
    scopeId: 'borek_g',
    view: 'profile',
    routes: {
      profile: '/borek-g',
      proposal: '/borek-g-operations',
    },
    title: 'Borek-G',
    subtitle: 'Choose proposal access with the approved email or enter the business-profile password.',
    overlayTop: 780,
    maskedTitle: 'Neighborhood Restaurant Marketing Profile',
    maskedClientDescription: 'Independent restaurant in a high-traffic suburban market',
    maskedDescription: 'Business name, location, and client-specific findings stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Growth opportunity identified',
    maskedSeoTitle: 'Confidential Restaurant Marketing Profile',
    maskedSeoDescription: 'This restaurant marketing profile is access-controlled. Enter an approved email or password to reveal the client name and profile details.',
    teaserEyebrow: 'Access-Controlled Profile',
    teaserHeadline: 'Client identity and business details remain blurred until access is verified.',
    teaserSummary: 'Use the proposal email or the business-profile password to choose which view you want to open.',
  },
  {
    path: '/borek-g-operations',
    scopeId: 'borek_g',
    view: 'proposal',
    routes: {
      profile: '/borek-g',
      proposal: '/borek-g-operations',
    },
    title: 'Borek-G Marketing Proposal',
    subtitle: 'Choose proposal access with the approved email, or enter the business-profile password.',
    overlayTop: 720,
    maskedTitle: 'Restaurant Marketing Proposal',
    maskedClientDescription: 'Independent restaurant with strong local demand and underused digital channels',
    maskedDescription: 'Client name, channel findings, and proposal details stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Marketing opportunity identified',
    maskedSeoTitle: 'Confidential Restaurant Marketing Proposal',
    maskedSeoDescription: 'This restaurant marketing proposal is access-controlled. Enter an approved email or password to reveal the client name and proposal details.',
    teaserEyebrow: 'Access-Controlled Proposal',
    teaserHeadline: 'The client identity and marketing proposal details remain blurred until access is verified.',
    teaserSummary: 'Use the approved email for proposal view or the business password for profile view.',
  },
  {
    path: '/uyghur-eats',
    scopeId: 'uyghur_eats',
    view: 'profile',
    routes: {
      profile: '/uyghur-eats',
      proposal: '/uyghur-eats-acquisition',
    },
    title: 'Uyghur Eats Diligence Document',
    subtitle: 'Enter the business-profile password to open this diligence document.',
    overlayTop: 760,
    maskedTitle: 'Acquisition Diligence Document',
    maskedClientDescription: 'Specialty restaurant positioned in a strong urban corridor',
    maskedDescription: 'Business name, location, and acquisition-diligence details stay hidden until profile access is verified.',
    maskedImpact: 'Acquisition upside identified',
    maskedSeoTitle: 'Confidential Acquisition Diligence Document',
    maskedSeoDescription: 'This acquisition diligence document is access-controlled. Enter the business-profile password to reveal the client name and business details.',
    teaserEyebrow: 'Access-Controlled Diligence Document',
    teaserHeadline: 'The client identity, location, and diligence details are intentionally blurred.',
    teaserSummary: 'Use the business-profile password to reveal the full diligence document.',
  },
  {
    path: '/uyghur-eats-acquisition',
    scopeId: 'uyghur_eats',
    view: 'proposal',
    routes: {
      profile: '/uyghur-eats',
      proposal: '/uyghur-eats-acquisition',
    },
    title: 'Uyghur Eats Acquisition Proposal',
    subtitle: 'Choose proposal access with the approved email, or enter the business-profile password.',
    overlayTop: 720,
    maskedTitle: 'Restaurant Acquisition Proposal',
    maskedClientDescription: 'Specialty restaurant with differentiated cuisine and buyer-readiness upside',
    maskedDescription: 'Client name, location, and acquisition proposal details stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Acquisition process defined',
    maskedSeoTitle: 'Confidential Restaurant Acquisition Proposal',
    maskedSeoDescription: 'This acquisition proposal is access-controlled. Enter an approved email or password to reveal the client name and proposal details.',
    teaserEyebrow: 'Access-Controlled Proposal',
    teaserHeadline: 'The client identity and acquisition proposal details remain blurred until access is verified.',
    teaserSummary: 'Use the approved email for proposal view or the business password for profile view.',
  },
];

const lockedStatus: ProjectAccessStatus = {
  scopeId: null,
  accessLevel: 'locked',
  grantedLevels: [],
  currentView: null,
  availableViews: {},
  title: '',
};

export function getProtectedProject(pathname: string) {
  return protectedProjects.find((project) => project.path === pathname);
}

export function isProjectAccessGranted(accessLevel: ProjectAccessLevel): boolean {
  return accessLevel === 'proposal' || accessLevel === 'profile';
}

export function hasGrantedView(status: ProjectAccessStatus, view: ProjectAccessView): boolean {
  return status.grantedLevels.includes(view);
}

export async function fetchProjectAccessStatus(pathname: string): Promise<ProjectAccessStatus> {
  const response = await fetch(`/api/project-access/status?path=${encodeURIComponent(pathname)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return lockedStatus;
  }

  const payload = (await response.json()) as Partial<ProjectAccessStatus>;
  return {
    ...lockedStatus,
    ...payload,
    grantedLevels: Array.isArray(payload.grantedLevels)
      ? payload.grantedLevels.filter((value): value is ProjectAccessView => value === 'proposal' || value === 'profile')
      : [],
    availableViews: payload.availableViews ?? {},
  };
}

type SubmitProjectAccessInput =
  | { path: string; method: 'proposal'; email: string }
  | { path: string; method: 'profile'; password: string };

export async function submitProjectAccess(input: SubmitProjectAccessInput): Promise<ProjectAccessStatus> {
  const response = await fetch('/api/project-access/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const raw = await response.text();
  const payload = (() => {
    if (!raw) {
      return {} as Partial<ProjectAccessStatus>;
    }

    try {
      return JSON.parse(raw) as Partial<ProjectAccessStatus>;
    } catch {
      return {} as Partial<ProjectAccessStatus>;
    }
  })();

  const fallbackError =
    input.method === 'proposal'
      ? 'Unable to verify proposal access. Confirm the API route is reachable and the email is approved.'
      : 'Unable to verify business profile access. Confirm the API route is reachable and the password is correct.';

  if (!response.ok) {
    return {
      ...lockedStatus,
      error: payload.error || fallbackError,
    };
  }

  return {
    ...lockedStatus,
    ...payload,
    grantedLevels: Array.isArray(payload.grantedLevels)
      ? payload.grantedLevels.filter((value): value is ProjectAccessView => value === 'proposal' || value === 'profile')
      : [],
    availableViews: payload.availableViews ?? {},
  };
}

export async function logoutProjectAccess(pathname: string): Promise<ProjectAccessStatus> {
  const response = await fetch('/api/project-access/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path: pathname }),
  });

  if (!response.ok) {
    return lockedStatus;
  }

  const payload = (await response.json()) as Partial<ProjectAccessStatus>;
  return {
    ...lockedStatus,
    ...payload,
    grantedLevels: Array.isArray(payload.grantedLevels)
      ? payload.grantedLevels.filter((value): value is ProjectAccessView => value === 'proposal' || value === 'profile')
      : [],
    availableViews: payload.availableViews ?? {},
  };
}
