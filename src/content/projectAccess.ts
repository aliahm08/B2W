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
    path: '/borek-g-social-media-management',
    scopeId: 'borek_g',
    view: 'profile',
    routes: {
      profile: '/borek-g-social-media-management',
      proposal: '/borek-g-operations',
    },
    title: 'Borek-G',
    subtitle: 'Choose proposal access with the approved email or enter the analysis-profile password.',
    overlayTop: 780,
    maskedTitle: 'Neighborhood Restaurant Marketing Profile',
    maskedClientDescription: 'Independent restaurant in a high-traffic suburban market',
    maskedDescription: 'Business name, location, and client-specific findings stay hidden until proposal-email or profile-password access is verified.',
    maskedImpact: 'Growth opportunity identified',
    maskedSeoTitle: 'Confidential Restaurant Marketing Profile',
    maskedSeoDescription: 'This restaurant marketing profile is access-controlled. Enter an approved email or password to reveal the client name and profile details.',
    teaserEyebrow: 'Access-Controlled Profile',
    teaserHeadline: 'Client identity and business details remain blurred until access is verified.',
    teaserSummary: 'Use the proposal email or the analysis-profile password to choose which view you want to open.',
  },
  {
    path: '/borek-g-operations',
    scopeId: 'borek_g',
    view: 'proposal',
    routes: {
      profile: '/borek-g-social-media-management',
      proposal: '/borek-g-operations',
    },
    title: 'Borek-G Marketing Proposal',
    subtitle: 'Choose proposal access with the approved email, or enter the analysis-profile password.',
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
  const project = getProtectedProject(pathname);
  
  return {
    ...lockedStatus,
    accessLevel: project?.view || 'profile',
    grantedLevels: ['proposal', 'profile'],
    currentView: project?.view || 'profile',
    title: project?.title || 'B2W Project',
    availableViews: project?.routes || {},
  };
}

type SubmitProjectAccessInput =
  | { path: string; method: 'proposal'; email: string }
  | { path: string; method: 'profile'; password: string };

export async function submitProjectAccess(input: SubmitProjectAccessInput): Promise<ProjectAccessStatus> {
  return fetchProjectAccessStatus(input.path);
}

export async function logoutProjectAccess(pathname: string): Promise<ProjectAccessStatus> {
  return lockedStatus;
}
