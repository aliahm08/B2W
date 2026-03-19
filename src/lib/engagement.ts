type HostedFormIntent = 'lead' | 'client';

export type HostedFormResult = {
  ok: boolean;
  error?: string;
};

export function getCalendlyUrl(): string {
  return import.meta.env.VITE_CALENDLY_URL?.trim() ?? '';
}

export function getHostedFormEndpoint(intent: HostedFormIntent): string {
  const value =
    intent === 'lead'
      ? import.meta.env.VITE_FORM_ENDPOINT_LEADS
      : import.meta.env.VITE_FORM_ENDPOINT_CLIENT;

  return value?.trim() ?? '';
}

export function getSourceMetadata(overrides?: Record<string, string>): Record<string, string> {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const href = typeof window !== 'undefined' ? window.location.href : '';

  return {
    source_page: typeof document !== 'undefined' ? document.title : '',
    source_path: pathname,
    source_url: href,
    submitted_at: new Date().toISOString(),
    site_context: pathname.startsWith('/client/') || pathname.startsWith('/portal/') ? 'client' : 'public',
    ...overrides,
  };
}

export async function submitHostedForm(
  endpoint: string,
  fields: Record<string, string | boolean | undefined>,
): Promise<HostedFormResult> {
  if (!endpoint) {
    return { ok: false, error: 'Form routing is not configured yet.' };
  }

  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) return;
    formData.append(key, String(value));
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (response.ok) {
      return { ok: true };
    }

    const payload = (await response.json().catch(() => null)) as
      | { errors?: Array<{ message?: string }>; error?: string }
      | null;

    return {
      ok: false,
      error:
        payload?.errors?.[0]?.message ??
        payload?.error ??
        'Unable to submit the form right now.',
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to submit the form right now.',
    };
  }
}

export function openCalendly() {
  const url = getCalendlyUrl();

  if (!url) {
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
