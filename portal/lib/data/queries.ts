import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  AuditLogRecord,
  CommentRecord,
  DeliverableFileRecord,
  DeliverableRecord,
  OrganizationRecord,
  PortalCounts,
  ProposalAttachmentRecord,
  ProposalRecord
} from '@/lib/types';

export async function getDashboardSummary() {
  const supabase = await createSupabaseServerClient();

  const [{ data: proposals }, { data: deliverables }] = await Promise.all([
    supabase.from('proposals').select('*').order('updated_at', { ascending: false }).limit(5).returns<ProposalRecord[]>(),
    supabase.from('deliverables').select('*').order('updated_at', { ascending: false }).limit(5).returns<DeliverableRecord[]>()
  ]);

  const counts: PortalCounts = {
    totalProposals: proposals?.length ?? 0,
    pendingApprovals: proposals?.filter((proposal) => proposal.status === 'sent' || proposal.status === 'viewed').length ?? 0,
    totalDeliverables: deliverables?.length ?? 0,
    revisionRequests: proposals?.filter((proposal) => proposal.status === 'revision_requested').length ?? 0
  };

  return {
    proposals: proposals ?? [],
    deliverables: deliverables ?? [],
    counts
  };
}

export async function getProposals() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('proposals')
    .select('*')
    .order('updated_at', { ascending: false })
    .returns<ProposalRecord[]>();

  return data ?? [];
}

export async function getProposalById(id: string) {
  const supabase = await createSupabaseServerClient();
  const [{ data: proposal }, { data: attachments }, { data: comments }] = await Promise.all([
    supabase.from('proposals').select('*').eq('id', id).maybeSingle<ProposalRecord>(),
    supabase.from('proposal_attachments').select('*').eq('proposal_id', id).returns<ProposalAttachmentRecord[]>(),
    supabase.from('comments').select('*').eq('proposal_id', id).order('created_at', { ascending: true }).returns<CommentRecord[]>()
  ]);

  return {
    proposal,
    attachments: attachments ?? [],
    comments: comments ?? []
  };
}

export async function getDeliverables() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('deliverables')
    .select('*')
    .order('updated_at', { ascending: false })
    .returns<DeliverableRecord[]>();

  return data ?? [];
}

export async function getDeliverableById(id: string) {
  const supabase = await createSupabaseServerClient();
  const [{ data: deliverable }, { data: files }, { data: comments }] = await Promise.all([
    supabase.from('deliverables').select('*').eq('id', id).maybeSingle<DeliverableRecord>(),
    supabase.from('deliverable_files').select('*').eq('deliverable_id', id).returns<DeliverableFileRecord[]>(),
    supabase.from('comments').select('*').eq('deliverable_id', id).order('created_at', { ascending: true }).returns<CommentRecord[]>()
  ]);

  return {
    deliverable,
    files: files ?? [],
    comments: comments ?? []
  };
}

export async function getOrganizations() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('organizations').select('*').order('name').returns<OrganizationRecord[]>();
  return data ?? [];
}

export async function getAuditLog() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100).returns<AuditLogRecord[]>();
  return data ?? [];
}
