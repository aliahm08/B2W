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
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="B2W <info@b2w-ai.com>"
# Optional: defaults to this Supabase project's table editor.
SUPABASE_CRM_URL="https://supabase.com/dashboard/project/your-project-ref/editor"
```

Prefer `SUPABASE_SECRET_KEY`. `SUPABASE_SERVICE_ROLE_KEY` remains a compatibility fallback.

## Lead notifications

After Supabase confirms a contact lead insert, the API emails `INTERNAL_NOTIFICATION_EMAIL` through Resend. The email contains the submitted contact information and a button linking to the Supabase CRM/table editor. If email delivery fails, the saved lead remains successful and the API logs a notification warning rather than asking the visitor to resubmit.

To use a custom CRM view instead of the table editor, set `SUPABASE_CRM_URL` to that view's URL.

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
   - the notification arrives at `INTERNAL_NOTIFICATION_EMAIL`
   - **Open Supabase CRM** opens the intended project or custom CRM view

## Notes

- Rate limiting is intentionally lightweight and in-memory. It is appropriate for a small Vercel site but not a substitute for a distributed abuse-prevention service.
- Calendly is still optional and only used as a follow-on CTA after successful lead intake.
