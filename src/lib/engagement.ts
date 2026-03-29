export type SubmissionResult = {
  ok: boolean;
  error?: string;
  warning?: string;
  submissionId?: string;
};

export function getCalendlyUrl(): string {
  return import.meta.env.VITE_CALENDLY_URL?.trim() ?? '';
}

export function getSourceMetadata(overrides?: Record<string, string>): Record<string, string> {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const href = typeof window !== 'undefined' ? window.location.href : '';
  const referrer = typeof document !== 'undefined' ? document.referrer : '';

  return {
    sourcePage: typeof document !== 'undefined' ? document.title : '',
    sourcePath: pathname,
    sourceUrl: href,
    referrer,
    submittedAt: new Date().toISOString(),
    ...overrides,
  };
}

export async function submitInternalForm(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<SubmissionResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    let data: Record<string, unknown> = {};

    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        ok: false,
        error: String(data.error ?? 'Unable to submit the form right now.'),
      };
    }

    return {
      ok: true,
      warning: typeof data.warning === 'string' ? data.warning : undefined,
      submissionId: typeof data.submissionId === 'string' ? data.submissionId : undefined,
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
