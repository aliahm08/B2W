const RESEND_API_URL = 'https://api.resend.com/emails';

export type EmailMessage = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function getEnv(name: string, fallback = ''): string {
  return String(process.env[name] ?? fallback).trim();
}

function getResendConfig() {
  return {
    apiKey: getEnv('RESEND_API_KEY'),
    from: getEnv('RESEND_FROM_EMAIL', getEnv('PROPOSAL_SIGNING_FROM_EMAIL', 'B2W <info@b2w-ai.com>')),
  };
}

export async function sendEmail(message: EmailMessage) {
  const config = getResendConfig();

  if (!config.apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      reply_to: message.replyTo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
