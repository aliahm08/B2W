import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { requireAdminOrTeam } from '@/lib/permissions';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export async function POST(request: Request) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  const formData = await request.formData();
  const file = formData.get('file');
  const entityId = String(formData.get('entityId') ?? '');
  const organizationId = String(formData.get('organizationId') ?? '');
  const entityType = String(formData.get('entityType') ?? '');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const path = `${organizationId}/${entityType}/${entityId}/${Date.now()}-${file.name}`;
  const admin = createSupabaseAdminClient();
  const upload = await admin.storage.from(env.supabaseBucket).upload(path, fileBuffer, {
    contentType: file.type,
    upsert: false
  });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  if (entityType === 'proposal') {
    await admin.from('proposal_attachments').insert({
      proposal_id: entityId,
      organization_id: organizationId,
      file_name: file.name,
      storage_path: path,
      content_type: file.type,
      file_size_bytes: file.size,
      uploaded_by: context.profileId
    });
  }

  if (entityType === 'deliverable') {
    await admin.from('deliverable_files').insert({
      deliverable_id: entityId,
      organization_id: organizationId,
      file_name: file.name,
      storage_path: path,
      content_type: file.type,
      file_size_bytes: file.size,
      uploaded_by: context.profileId
    });
  }

  await logAuditEvent({
    organizationId,
    actorProfileId: context.profileId,
    action: 'deliverable_uploaded',
    entityType: `${entityType}_file`,
    entityId,
    metadata: { fileName: file.name, storagePath: path }
  });

  const referer = request.headers.get('referer') || '/portal';
  return NextResponse.redirect(referer, 303);
}
