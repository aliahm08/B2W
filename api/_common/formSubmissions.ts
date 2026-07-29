import './env.js';
import { createClient } from '@supabase/supabase-js';
import type { JasonAiRoiModel } from '../../src/lib/jasonAiRoi.js';
import type {
  ClientCommunicationSubmission,
  JasonAiRoiReportSubmission,
  LeadSubmission,
} from './validation.js';

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
    accessKey: getEnv('SUPABASE_SECRET_KEY', getEnv('SUPABASE_SERVICE_ROLE_KEY')),
  };
}

async function insertFormSubmission(payload: FormSubmissionInsert) {
  const { url, accessKey } = getSupabaseConfig();

  if (!url || !accessKey) {
    throw new Error('Supabase form submission env vars are not configured.');
  }

  const supabase = createClient(url, accessKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.from('form_submissions').insert(payload).select('id').single();

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message} (${error.code || 'unknown'})`);
  }

  return String(data.id);
}

async function updateFormSubmissionBudget(id: string, budgetRange: string) {
  const { url, accessKey } = getSupabaseConfig();

  if (!url || !accessKey) {
    throw new Error('Supabase form submission env vars are not configured.');
  }

  const supabase = createClient(url, accessKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: existing, error: fetchError } = await supabase
    .from('form_submissions')
    .select('metadata')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Supabase fetch failed: ${fetchError.message} (${fetchError.code || 'unknown'})`);
  }

  const currentMetadata = existing?.metadata && typeof existing.metadata === 'object'
    ? (existing.metadata as Record<string, unknown>)
    : {};

  const { error: updateError } = await supabase
    .from('form_submissions')
    .update({
      metadata: {
        ...currentMetadata,
        arrRange: budgetRange,
        budgetRange,
      },
    })
    .eq('id', id);

  if (updateError) {
    throw new Error(`Supabase update failed: ${updateError.message} (${updateError.code || 'unknown'})`);
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
      budgetRange: submission.budgetRange,
      projectAreas: submission.projectAreas,
      inquiryType: submission.inquiryType,
      normalizedProjectArea: submission.normalizedProjectArea,
    },
  });
}

export async function saveLeadSubmissionBudget(submissionId: string, budgetRange: string) {
  return updateFormSubmissionBudget(submissionId, budgetRange);
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

export async function insertJasonAiRoiFormSubmission(
  submission: JasonAiRoiReportSubmission,
  model: JasonAiRoiModel,
  notificationEmail: string,
) {
  const businessType = submission.businessType === 'firm' ? 'Contracting Firm' : 'General Contractor';
  const fullName = `${submission.firstName} ${submission.lastName}`.trim();
  const marketingConsentText =
    'Yes, I would like to receive marketing communications regarding B2W products, services, and events. I can unsubscribe at any time.';

  return insertFormSubmission({
    audience: 'landing',
    submission_type: 'jasonai_roi_report',
    template_key: 'jasonai_roi_report',
    notification_email: notificationEmail,
    contact_name: fullName,
    contact_email: submission.businessEmail,
    company: submission.companyName,
    subject: `${businessType} AI ROI report`,
    message: `Requested a JasonAI ROI report with an estimated four-year ROI of ${Math.round(model.roi * 100)}% and a net return of $${Math.round(model.netReturn).toLocaleString('en-US')}.`,
    source_page: submission.sourcePage,
    source_path: submission.sourcePath,
    source_url: submission.sourceUrl,
    referrer: submission.referrer,
    submitted_at: submission.submittedAt,
    metadata: {
      firstName: submission.firstName,
      lastName: submission.lastName,
      companyLocation: submission.companyLocation,
      marketingOptIn: submission.marketingOptIn,
      marketingConsentText,
      marketingConsentCapturedAt: submission.submittedAt,
      marketingConsentVersion: '2026-07-28',
      businessType: submission.businessType,
      employees: submission.employees,
      activeProjects: submission.activeProjects,
      averageProjectWeeks: submission.averageProjectWeeks,
      estimatedRoi: model.roi,
      estimatedRoiPercent: Math.round(model.roi * 100),
      estimatedNetReturn: model.netReturn,
      modeledValue: model.totalValue,
      preLaunchInvestment: model.totalInvestment,
      standardInvestment: model.totalStandardInvestment,
      years: model.years,
    },
  });
}
