import path from 'node:path';
import dotenv from 'dotenv';
import type { ClientCommunicationSubmission, LeadSubmission } from './validation.js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

type FormAudience = 'landing' | 'client';

type FormSubmissionInsert = {
  audience: FormAudience;
  submission_type: string;
  template_key: string;
  notification_email: string;
  contact_name: string;
  contact_email: string;
  company?: string;
  phone?: string;
  website?: string;
  subject?: string;
  message: string;
  project_name?: string;
  project_area?: string;
  source_page?: string;
  source_path?: string;
  source_url?: string;
  referrer?: string;
  submitted_at: string;
  metadata: Record<string, unknown>;
};

function getEnv(name: string, fallback = ''): string {
  return String(process.env[name] ?? fallback).trim();
}

function getSupabaseConfig() {
  return {
    url: getEnv('NEXT_PUBLIC_SUPABASE_URL', getEnv('SUPABASE_URL')),
    accessKey: getEnv(
      'SUPABASE_SERVICE_ROLE_KEY',
      getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')),
    ),
  };
}

async function insertFormSubmission(payload: FormSubmissionInsert) {
  const { url, accessKey } = getSupabaseConfig();

  if (!url || !accessKey) {
    throw new Error('Supabase form submission env vars are not configured.');
  }

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/form_submissions`, {
    method: 'POST',
    headers: {
      apikey: accessKey,
      Authorization: `Bearer ${accessKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed (${response.status}): ${await response.text()}`);
  }
}

export async function insertLeadFormSubmission(submission: LeadSubmission, notificationEmail: string) {
  return insertFormSubmission({
    audience: 'landing',
    submission_type: 'lead_inquiry',
    template_key: 'landing_lead',
    notification_email: notificationEmail,
    contact_name: submission.name,
    contact_email: submission.email,
    company: submission.company,
    phone: submission.phone,
    website: submission.website,
    subject: submission.inquiryType,
    message: submission.message,
    project_area: submission.normalizedProjectArea,
    source_page: submission.sourcePage,
    source_path: submission.sourcePath,
    source_url: submission.sourceUrl,
    referrer: submission.referrer,
    submitted_at: submission.submittedAt,
    metadata: {
      arrRange: submission.arrRange,
      projectAreas: submission.projectAreas,
      inquiryType: submission.inquiryType,
      normalizedProjectArea: submission.normalizedProjectArea,
    },
  });
}

export async function insertClientFormSubmission(submission: ClientCommunicationSubmission, notificationEmail: string) {
  return insertFormSubmission({
    audience: 'client',
    submission_type: 'client_message',
    template_key: 'client_communication',
    notification_email: notificationEmail,
    contact_name: submission.clientName,
    contact_email: submission.clientEmail,
    company: submission.company,
    subject: submission.messageCategory,
    message: submission.message,
    project_name: submission.projectName,
    source_page: submission.sourcePage,
    source_path: submission.sourcePath,
    source_url: submission.sourceUrl,
    referrer: submission.referrer,
    submitted_at: submission.submittedAt,
    metadata: {
      messageCategory: submission.messageCategory,
      projectName: submission.projectName,
    },
  });
}
