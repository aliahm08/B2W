'use server';

import { revalidatePath } from 'next/cache';
import { getAuthContext } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { canComment } from '@/lib/permissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function addCommentAction(formData: FormData) {
  const context = await getAuthContext();
  if (!canComment(context)) {
    throw new Error('Unauthorized');
  }

  const payload = {
    organization_id: String(formData.get('organizationId') ?? ''),
    proposal_id: String(formData.get('proposalId') ?? '') || null,
    deliverable_id: String(formData.get('deliverableId') ?? '') || null,
    parent_id: String(formData.get('parentId') ?? '') || null,
    body: String(formData.get('body') ?? ''),
    author_profile_id: context.profileId
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('comments').insert(payload);
  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: payload.organization_id,
    actorProfileId: context.profileId,
    action: 'comment_added',
    entityType: payload.proposal_id ? 'proposal_comment' : 'deliverable_comment',
    entityId: payload.proposal_id ?? payload.deliverable_id
  });

  if (payload.proposal_id) {
    revalidatePath(`/portal/proposals/${payload.proposal_id}`);
  }

  if (payload.deliverable_id) {
    revalidatePath(`/portal/deliverables/${payload.deliverable_id}`);
  }
}
