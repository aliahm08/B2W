import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { canViewOrganization } from '@/lib/permissions';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export async function GET(request: Request) {
  const context = await getAuthContext();
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const bucket = searchParams.get('bucket') || env.supabaseBucket;

  if (!path) {
    return NextResponse.json({ error: 'Path is required.' }, { status: 400 });
  }

  const organizationId = path.split('/')[0] ?? null;
  if (!canViewOrganization(context, organizationId)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const signed = await admin.storage.from(bucket).createSignedUrl(path, 60);
  if (signed.error) {
    return NextResponse.json({ error: signed.error.message }, { status: 500 });
  }

  return NextResponse.redirect(signed.data.signedUrl, 302);
}
