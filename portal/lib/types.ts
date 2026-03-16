export type AppRole = 'admin' | 'team' | 'client_editor' | 'client_viewer';
export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'revision_requested'
  | 'closed';

export type AuditAction =
  | 'proposal_created'
  | 'proposal_edited'
  | 'proposal_viewed'
  | 'proposal_approved'
  | 'proposal_revision_requested'
  | 'proposal_receipt_acknowledged'
  | 'deliverable_uploaded'
  | 'comment_added'
  | 'user_invited';

export type ProfileRecord = {
  id: string;
  clerk_user_id: string;
  organization_id: string | null;
  email: string;
  full_name: string | null;
  role: AppRole;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
};

export type OrganizationRecord = {
  id: string;
  clerk_org_id: string | null;
  name: string;
  slug: string;
  primary_contact_email: string | null;
  created_at: string;
  updated_at: string;
};

export type ProposalRecord = {
  id: string;
  organization_id: string;
  title: string;
  summary: string | null;
  scope: string | null;
  pricing: string | null;
  assumptions: string | null;
  status: ProposalStatus;
  due_date: string | null;
  sent_at: string | null;
  approved_at: string | null;
  revision_requested_at: string | null;
  revision_notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ProposalAttachmentRecord = {
  id: string;
  proposal_id: string;
  organization_id: string;
  file_name: string;
  storage_path: string;
  content_type: string | null;
  file_size_bytes: number | null;
  uploaded_by: string;
  created_at: string;
};

export type DeliverableRecord = {
  id: string;
  organization_id: string;
  proposal_id: string | null;
  title: string;
  description: string | null;
  version: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
};

export type DeliverableFileRecord = {
  id: string;
  deliverable_id: string;
  organization_id: string;
  file_name: string;
  storage_path: string;
  content_type: string | null;
  file_size_bytes: number | null;
  uploaded_by: string;
  created_at: string;
};

export type CommentRecord = {
  id: string;
  organization_id: string;
  proposal_id: string | null;
  deliverable_id: string | null;
  parent_id: string | null;
  body: string;
  author_profile_id: string;
  created_at: string;
  updated_at: string;
};

export type AuditLogRecord = {
  id: string;
  organization_id: string | null;
  actor_profile_id: string | null;
  action: AuditAction;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type PortalCounts = {
  totalProposals: number;
  pendingApprovals: number;
  totalDeliverables: number;
  revisionRequests: number;
};

export type AuthContext = {
  clerkUserId: string;
  clerkOrgId: string | null;
  role: AppRole;
  email: string | null;
  organizationId: string | null;
  profileId: string | null;
  isInternal: boolean;
};
