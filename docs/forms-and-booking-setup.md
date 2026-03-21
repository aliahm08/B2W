# Forms and Booking Setup

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
- sends an internal email to `info@b2w-ai.com`
- sends a confirmation email to the submitter
- appends a row to Google Sheets

## Required environment variables

```bash
VITE_CALENDLY_URL="https://calendly.com/your-team/consultation"
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="B2W <info@b2w-ai.com>"
INTERNAL_NOTIFICATION_EMAIL="info@b2w-ai.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your-google-sheet-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SHEET_TAB_LEADS="Lead Inquiries"
SHEET_TAB_CLIENT_COMMUNICATIONS="Client Communications"
SHEET_TAB_PROPOSAL_SIGNATURES="Proposal Signatures"
```

You can also keep using `GOOGLE_SERVICE_ACCOUNT_JSON` instead of `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` if you prefer a single JSON credential.

## Google Sheets workbook expectations

Create one spreadsheet and add these tabs:

- `Lead Inquiries`
- `Client Communications`
- `Proposal Signatures`

If you use different tab names, set them through:

- `SHEET_TAB_LEADS`
- `SHEET_TAB_CLIENT_COMMUNICATIONS`
- `SHEET_TAB_PROPOSAL_SIGNATURES`

If a tab is missing, the append call will fail and the server logs will show the Google Sheets error.

## Local testing

1. Set the environment variables in `.env.local`.
2. Run `npm run dev:full` when you need the Vercel API routes locally.
3. Submit:
   - the homepage or service-page lead form
   - a client communication form
   - a proposal signature flow
4. Verify:
   - internal email arrives at `info@b2w-ai.com`
   - confirmation email arrives at the submitter email
   - a row appears in the correct Google Sheets tab

## Notes

- Rate limiting is intentionally lightweight and in-memory. It is appropriate for a small Vercel site but not a substitute for a distributed abuse-prevention service.
- If email succeeds and Sheets fails, or vice versa, the API returns success with a warning and logs the partial failure server-side for operator follow-up.
- Calendly is still optional and only used as a follow-on CTA after successful lead intake.
