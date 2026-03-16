export type ClientPortalLink = {
  label: string;
  href: string;
  kind: string;
};

export type ClientPortalMilestone = {
  title: string;
  dueDate: string;
  status: string;
};

export type ClientPortalUpdate = {
  date: string;
  title: string;
  summary: string;
};

export type ClientPortalContact = {
  name: string;
  role: string;
  email: string;
};

export type ClientPortalProject = {
  id: string;
  name: string;
  status: string;
  summary: string;
  lastUpdated: string;
  nextMilestone: string;
  links: ClientPortalLink[];
  milestones: ClientPortalMilestone[];
  updates: ClientPortalUpdate[];
};

export type ClientPortalAccount = {
  accountId: string;
  companyName: string;
  workspaceTitle: string;
  supportEmail: string;
  contacts: ClientPortalContact[];
  projects: ClientPortalProject[];
};

export type ClientPortalProfile = {
  email: string;
  name: string;
  picture: string | null;
};

export type ClientPortalStatus = {
  authenticated: boolean;
  account: ClientPortalAccount | null;
  profile: ClientPortalProfile | null;
  loginEnabled: boolean;
  error?: string;
};

const anonymousStatus: ClientPortalStatus = {
  authenticated: false,
  account: null,
  profile: null,
  loginEnabled: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
};

function parseStatus(payload: Partial<ClientPortalStatus>): ClientPortalStatus {
  return {
    ...anonymousStatus,
    ...payload,
    account: payload.account ?? null,
    profile: payload.profile ?? null,
    authenticated: Boolean(payload.authenticated && payload.account && payload.profile),
  };
}

export const clientPortalGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export async function fetchClientPortalStatus(): Promise<ClientPortalStatus> {
  const response = await fetch('/api/client-portal/status', {
    credentials: 'include',
  });

  if (!response.ok) {
    return anonymousStatus;
  }

  const payload = (await response.json()) as Partial<ClientPortalStatus>;
  return parseStatus(payload);
}

export async function loginClientPortal(credential: string): Promise<ClientPortalStatus> {
  const response = await fetch('/api/client-portal/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });

  const raw = await response.text();
  const payload = raw ? JSON.parse(raw) as Partial<ClientPortalStatus> : {};

  if (!response.ok) {
    return parseStatus({
      ...payload,
      error: payload.error || 'Unable to sign in with Google.',
    });
  }

  return parseStatus(payload);
}

export async function logoutClientPortal(): Promise<ClientPortalStatus> {
  const response = await fetch('/api/client-portal/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    return anonymousStatus;
  }

  const payload = (await response.json()) as Partial<ClientPortalStatus>;
  return parseStatus(payload);
}
