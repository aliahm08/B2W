# Forms and Supabase Setup

This site now uses internal Vercel API routes for form submission.

## Submission routes

- `POST /api/contact-lead`
  Public lead inquiries from the homepage, landing pages, and project/service pages.
- `POST /api/client-communication`
  Existing client communication forms inside portal/client pages.
- `POST /api/proposal-signature`
  Proposal acceptance and signature-related submission flows.

Each route:

- validates and sanitizes input
- applies a honeypot spam check
- rate-limits by IP
- inserts one record into the Supabase `form_submissions` table
- returns success only after Supabase confirms the insert
- returns a submission ID for audit and follow-up

## Required environment variables

```bash
VITE_CALENDLY_URL="https://calendly.com/your-team/consultation"
INTERNAL_NOTIFICATION_EMAIL="info@b2w-ai.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
SUPABASE_SECRET_KEY="sb_secret_xxx"
```

Prefer `SUPABASE_SECRET_KEY`. `SUPABASE_SERVICE_ROLE_KEY` remains a compatibility fallback.

## Notifications and exports

Supabase is the system of record. Configure Database Webhooks or an Edge Function in Supabase for optional follow-up work such as:

- notifying `info@b2w-ai.com`
- sending submitter confirmations through an email provider
- mirroring selected rows to another reporting system

These automations must not control whether the website reports a successful submission.

## Local testing

1. Set the environment variables in `.env.local`.
2. Run `npm run dev:full` when you need the Vercel API routes locally.
3. Submit:
   - the homepage or service-page lead form
   - a client communication form
   - a proposal signature flow
4. Verify:
   - a row appears in Supabase `form_submissions`
   - the browser receives `ok: true` and a `submissionId`
   - any configured Supabase automation runs independently

## Notes

- Rate limiting is intentionally lightweight and in-memory. It is appropriate for a small Vercel site but not a substitute for a distributed abuse-prevention service.
- Calendly is still optional and only used as a follow-on CTA after successful lead intake.
