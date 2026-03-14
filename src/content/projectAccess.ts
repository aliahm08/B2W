export type ProtectedProjectConfig = {
  path: string;
  title: string;
  subtitle: string;
  overlayTop: number;
};

export const protectedProjects: ProtectedProjectConfig[] = [
  {
    path: '/borek-g',
    title: 'Borek-G',
    subtitle: 'This project page is password protected. Enter the Borek-G password to continue.',
    overlayTop: 780,
  },
  {
    path: '/borek-g-operations',
    title: 'Borek-G Operations Chatbot',
    subtitle: 'This project page is password protected. Enter the Borek-G Operations password to continue.',
    overlayTop: 720,
  },
  {
    path: '/uyghur-eats',
    title: 'Uyghur Eats',
    subtitle: 'This project page is password protected. Enter the Uyghur Eats password to continue.',
    overlayTop: 760,
  },
];

export function getProtectedProject(pathname: string) {
  return protectedProjects.find((project) => project.path === pathname);
}

export async function fetchProjectAccessStatus(pathname: string): Promise<boolean> {
  const response = await fetch(`/api/project-access/status?path=${encodeURIComponent(pathname)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { unlocked?: boolean };
  return Boolean(payload.unlocked);
}

export async function submitProjectAccessPassword(pathname: string, password: string): Promise<{ unlocked: boolean; error?: string }> {
  const response = await fetch('/api/project-access/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: pathname,
      password,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as { unlocked?: boolean; error?: string };

  if (!response.ok) {
    return {
      unlocked: false,
      error: payload.error || 'Unable to verify password.',
    };
  }

  return { unlocked: Boolean(payload.unlocked) };
}
