import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { AuditAction } from '@/lib/types';

export async function logAuditEvent(input: {
  organizationId: string | null;
  actorProfileId: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();

  await admin.from('audit_logs').insert({
    organization_id: input.organizationId,
    actor_profile_id: input.actorProfileId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {}
  });
}
