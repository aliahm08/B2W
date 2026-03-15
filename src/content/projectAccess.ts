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
    title: 'Borek-G Operations Chatbot',
    subtitle: 'Choose proposal access with the approved email, or enter the business-profile password.',
    overlayTop: 720,
    maskedTitle: 'Frontline Operations Copilot Prototype',
    maskedClientDescription: 'Independent restaurant team with recurring frontline questions',
    maskedDescription: 'Business name, operating details, and client-specific workflow documentation stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Response efficiency opportunity identified',
    maskedSeoTitle: 'Confidential Operations Prototype',
    maskedSeoDescription: 'This operations prototype is access-controlled. Enter an approved email or password to reveal the client name and workflow details.',
    teaserEyebrow: 'Access-Controlled Prototype',
    teaserHeadline: 'The client name and operating workflow are hidden until access is approved.',
    teaserSummary: 'Choose proposal view with the approved email or profile view with the business password.',
  },
  {
    path: '/uyghur-eats',
    scopeId: 'uyghur_eats',
    view: 'profile',
    routes: {
      profile: '/uyghur-eats',
    },
    title: 'Uyghur Eats',
    subtitle: 'Enter the business-profile password to open this client profile.',
    overlayTop: 760,
    maskedTitle: 'Acquisition Readiness and Valuation Profile',
    maskedClientDescription: 'Specialty restaurant positioned in a strong urban corridor',
    maskedDescription: 'Business name, location, and acquisition-profile details stay hidden until profile access is verified.',
    maskedImpact: 'Acquisition upside identified',
    maskedSeoTitle: 'Confidential Business Profile',
    maskedSeoDescription: 'This acquisition profile is access-controlled. Enter the business-profile password to reveal the client name and business details.',
    teaserEyebrow: 'Access-Controlled Business Profile',
    teaserHeadline: 'The client identity, location, and profile details are intentionally blurred.',
    teaserSummary: 'Use the business-profile password to reveal the full business profile.',
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
