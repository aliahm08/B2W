# B2W Client Portal

Production-minded MVP for a consultancy client portal built as a dedicated Next.js App Router app for deployment on `portal.example.com`.

## Architecture summary

- Frontend: Next.js App Router with server components and server actions.
- Authentication: Clerk for sign-in, sign-up, route protection, organizations, invitations, and user identity.
- Backend and file storage: Supabase Postgres + Storage.
- Authorization layers:
  - Clerk middleware protects `/portal`.
  - Server components and actions call explicit role helpers.
  - Supabase Row Level Security enforces organization scoping and role rules in the database.
- Multi-tenancy:
  - Every proposal, deliverable, comment, file, and audit event belongs to an organization.
  - Client users only read/write their own organization’s data through RLS.
  - Internal `admin` and `team` roles operate across tenants.

## Folder structure

```text
portal/
  app/
    (auth)/
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
    (portal)/
      portal/
        admin/
        deliverables/
        proposals/
        settings/
        layout.tsx
        page.tsx
    api/
      clerk/webhook/route.ts
      files/download/route.ts
      files/upload/route.ts
    globals.css
    layout.tsx
    not-found.tsx
    unauthorized/page.tsx
  components/
  lib/
    actions/
    data/
    supabase/
    auth.ts
    audit.ts
    clerk-sync.ts
    env.ts
    permissions.ts
    types.ts
  supabase/
    schema.sql
    rls.sql
    seed.sql
  middleware.ts
  package.json
  tsconfig.json
```

## Role model

- `admin`: full internal access.
- `team`: internal operational access for proposals, deliverables, invites, and client records.
- `client_editor`: tenant-scoped access, can comment, acknowledge, approve, and request revisions.
- `client_viewer`: tenant-scoped read-only access plus comments.

## Clerk configuration

In Clerk:

1. Create the application for the portal domain.
2. Enable Google and email magic link.
3. Optional: enable password sign-in if desired.
4. Enable Organizations.
5. Create a JWT template named `supabase` that includes:
   - `sub`
   - `org_id`
   - `role`
   - `email`
6. Add a webhook endpoint pointing to:
   - `https://portal.example.com/api/clerk/webhook`
7. Set the webhook secret in `CLERK_WEBHOOK_SECRET`.

Recommended metadata:

- Internal users: `publicMetadata.role = "admin"` or `"team"`
- Client users: store viewer/editor access on the Clerk organization invitation metadata and sync it into Supabase profiles.

## Supabase configuration

1. Create a Supabase project.
2. Create a private storage bucket named `portal-files`.
3. Run SQL files in order:
   1. `supabase/schema.sql`
   2. `supabase/rls.sql`
   3. `supabase/seed.sql` (optional)
4. Verify RLS is enabled for all tables.
5. Keep the service role key server-side only.

## Environment variables

Copy `.env.example` and set:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `CLERK_WEBHOOK_SECRET`
- `CLERK_SUPABASE_JWT_TEMPLATE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_APP_URL`

## Local development

```bash
cd portal
npm install
npm run dev
```

## Deployment on Vercel

1. Create a separate Vercel project rooted at `portal/`.
2. Set the production domain to your portal subdomain, for example `portal.example.com`.
3. Add all environment variables in Vercel.
4. Add the Clerk webhook URL in the Clerk dashboard.
5. Deploy.

## Security checklist

- Clerk middleware protects all portal routes.
- Server actions re-check role permissions.
- Database RLS policies enforce tenant isolation.
- Storage access is scoped by organization prefix.
- Downloads use short-lived signed URLs.
- Service role key is only used server-side.
- Client-side UI never substitutes for authorization.

## Invitation flow

- Internal users invite client users from `/portal/admin/invites`.
- The invite attaches the user to a Clerk organization.
- The Clerk webhook syncs the organization and membership into Supabase.
- The Supabase JWT template carries `org_id` and `role` into RLS.

## Notification architecture

This MVP records auditable events in `audit_logs`. For notifications:

- Trigger email or Slack notifications from Supabase database webhooks or Edge Functions.
- Recommended notification events:
  - proposal sent
  - proposal approved
  - revision requested
  - deliverable uploaded
  - comment added

## Future improvements

- Rich proposal editor with structured line items.
- Real threaded comments and mentions.
- Activity feeds by organization.
- SLA-oriented notification routing.
- Approval signatures and PDF sealing.
- Version compare for deliverables.
- Background malware scanning for uploads.
