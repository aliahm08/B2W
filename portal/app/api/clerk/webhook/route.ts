import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { syncClerkMembership, syncClerkOrganization, syncClerkUser } from '@/lib/clerk-sync';

export async function POST(request: Request) {
  const payload = await request.text();
  const headerBag = await headers();

  const svixId = headerBag.get('svix-id');
  const svixTimestamp = headerBag.get('svix-timestamp');
  const svixSignature = headerBag.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers.' }, { status: 400 });
  }

  const webhook = new Webhook(env.clerkWebhookSecret);

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = webhook.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as { type: string; data: Record<string, unknown> };
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid webhook' }, { status: 400 });
  }

  switch (event.type) {
    case 'organization.created':
    case 'organization.updated':
      await syncClerkOrganization(event.data as never);
      break;
    case 'user.created':
    case 'user.updated':
      await syncClerkUser(event.data as never);
      break;
    case 'organizationMembership.created':
    case 'organizationMembership.updated':
      await syncClerkMembership(event.data as never);
      break;
    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
