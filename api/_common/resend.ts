import './env.js';
import { Resend } from 'resend';

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

  const resend = new Resend(config.apiKey);
  const response = await resend.emails.send({
      from: config.from,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
  });

  if (response.error) {
    throw new Error(`Resend request failed: ${response.error.message}`);
  }

  return response.data;
}
