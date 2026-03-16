'use server';

import { revalidatePath } from 'next/cache';
import { getAuthContext } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { requireAdminOrTeam, canApproveProposal } from '@/lib/permissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ProposalStatus } from '@/lib/types';

export async function createProposalAction(formData: FormData) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  const supabase = await createSupabaseServerClient();
  const payload = {
    organization_id: String(formData.get('organizationId') ?? ''),
    title: String(formData.get('title') ?? ''),
    summary: String(formData.get('summary') ?? ''),
    scope: String(formData.get('scope') ?? ''),
    pricing: String(formData.get('pricing') ?? ''),
    assumptions: String(formData.get('assumptions') ?? ''),
    due_date: String(formData.get('dueDate') ?? '') || null,
    status: 'draft' satisfies ProposalStatus,
    created_by: context.profileId
  };

  const { data, error } = await supabase.from('proposals').insert(payload).select('id').single<{ id: string }>();
  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: payload.organization_id,
    actorProfileId: context.profileId,
    action: 'proposal_created',
    entityType: 'proposal',
    entityId: data.id
  });

  revalidatePath('/portal');
  revalidatePath('/portal/admin/proposals');
}

export async function updateProposalAction(id: string, formData: FormData) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  const supabase = await createSupabaseServerClient();
  const updates = {
    title: String(formData.get('title') ?? ''),
    summary: String(formData.get('summary') ?? ''),
    scope: String(formData.get('scope') ?? ''),
    pricing: String(formData.get('pricing') ?? ''),
    assumptions: String(formData.get('assumptions') ?? ''),
    status: String(formData.get('status') ?? 'draft') as ProposalStatus,
    due_date: String(formData.get('dueDate') ?? '') || null,
    revision_notes: String(formData.get('revisionNotes') ?? '') || null
  };

  const { error } = await supabase.from('proposals').update(updates).eq('id', id);
  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: context.organizationId,
    actorProfileId: context.profileId,
    action: 'proposal_edited',
    entityType: 'proposal',
    entityId: id,
    metadata: updates
  });

  revalidatePath(`/portal/proposals/${id}`);
  revalidatePath(`/portal/admin/proposals/${id}/edit`);
}

export async function acknowledgeProposalAction(id: string) {
  const context = await getAuthContext();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('proposals')
    .update({ status: 'viewed' satisfies ProposalStatus })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: context.organizationId,
    actorProfileId: context.profileId,
    action: 'proposal_receipt_acknowledged',
    entityType: 'proposal',
    entityId: id
  });

  revalidatePath(`/portal/proposals/${id}`);
}

export async function approveProposalAction(id: string) {
  const context = await getAuthContext();
  if (!canApproveProposal(context)) {
    throw new Error('Unauthorized');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('proposals')
    .update({
      status: 'approved' satisfies ProposalStatus,
      approved_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: context.organizationId,
    actorProfileId: context.profileId,
    action: 'proposal_approved',
    entityType: 'proposal',
    entityId: id
  });

  revalidatePath(`/portal/proposals/${id}`);
}

export async function requestRevisionAction(id: string, formData: FormData) {
  const context = await getAuthContext();
  if (!canApproveProposal(context)) {
    throw new Error('Unauthorized');
  }

  const note = String(formData.get('revisionNotes') ?? '');
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('proposals')
    .update({
      status: 'revision_requested' satisfies ProposalStatus,
      revision_requested_at: new Date().toISOString(),
      revision_notes: note
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: context.organizationId,
    actorProfileId: context.profileId,
    action: 'proposal_revision_requested',
    entityType: 'proposal',
    entityId: id,
    metadata: { note }
  });

  revalidatePath(`/portal/proposals/${id}`);
}
