# B2W API Master Rules

## Purpose

Keep B2W's Vercel API surface small, secure, and understandable. A top-level file in `api/` is a deployed Serverless Function. Reusable code belongs in `api/_lib/` or `api/_common/` and does not count as another function.

## Target gateway surface

| Gateway | Responsibility |
| --- | --- |
| `/api/communications` | Public and client intake, booking, Gmail delivery, and Workspace routing |
| `/api/gurge` | Internal analysis, generated copy, intake enrichment, and Today's View |
| `/api/jasonai` | JasonAI product progress, ROI reports, and project briefs |
| `/api/strategy` | B2W and JasonAI executive-strategy sessions and protected data |
| `/api/proposals` | Proposal signing, retrieval, transcripts, and delivery |

## Routing convention

One gateway can expose multiple allow-listed actions:

```text
POST /api/communications?action=client.submit
POST /api/communications?action=lead.submit
POST /api/gurge?action=today.generate
GET  /api/jasonai?action=progress.state
POST /api/strategy?scope=b2w&action=login
```

- Reject unknown actions with `400`.
- Each action gets its own request schema, authorization rule, rate limit, idempotency policy, and audit event.
- Route handlers only dispatch. Application logic belongs in `api/_lib/<gateway>/`.

## Security rules

1. Never expose secrets in browser code or `VITE_*` variables.
2. Validate origin, method, body size, and schema before any side effect.
3. Public forms require Turnstile, honeypot, and distributed rate limiting. Client and internal actions require a signed session.
4. Keep Gmail OAuth, Workspace service-account access, Supabase service-role access, and AI credentials separate.
5. Workspace credentials may access only explicitly shared Sheets, Drive folders, and calendars. Do not use domain-wide delegation unless multiple B2W mailboxes require it.
6. Store client messages first; perform external delivery second. Record every external action as pending, delivered, or failed.
7. Use idempotency keys for sending email, creating Calendar events, writing Sheets rows, and signing proposals.
8. Google Chat alerts contain a summary and a secure record link, never a full client message.

## Responses and operations

Use `{ "ok": true, "data": ... }` for success and `{ "ok": false, "error": "safe message", "code": "stable_code" }` for expected errors.

- `400`: invalid action or input
- `401` / `403`: authorization failure
- `409`: duplicate or invalid state transition
- `429`: rate limit, with `Retry-After`
- `500`: unexpected server failure; never expose provider errors or secrets
- `202`: record accepted but a follow-up delivery is pending

Every request gets a request ID. Log action, actor type, target ID, provider, result, and latency—not full message bodies or secrets. Failed deliveries need an internal retry action that uses the original idempotency key.

## Change rule

Before adding any top-level `api/` file, first decide whether it belongs as an action of an existing gateway. A new Vercel function requires a documented reason, owner, security review, and confirmation that the deployment limit remains satisfied.
