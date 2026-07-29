# PRD: Communications API

## Endpoint

`/api/communications`

## Goal

Receive every lead, client message, and consultation request through one reliable pipeline; store it once; then route it to B2W and Google Workspace.

## Actions

| Action | Audience | Result |
| --- | --- | --- |
| `lead.submit` | Public | Create a lead record and notify B2W |
| `client.submit` | Authenticated client | Create and allocate a client communication |
| `consultation.availability` | Public | Return safe available booking slots |
| `consultation.book` | Public | Create a consultation and send confirmations |
| `delivery.retry` | Internal | Retry a recorded failed delivery |
| `status` | Internal | Return safe delivery status |

## Required behavior

1. Write the canonical record to Supabase before delivery.
2. Use an idempotency key for each submission.
3. Apply client, project, owner, priority, and category routing rules.
4. Send client-facing messages through Gmail API as `info@b2w-ai.com` after Workspace OAuth is configured.
5. Append an auditable row to the approved Google Sheet.
6. Create Drive logs, Calendar follow-ups, and Google Chat escalations only when a rule requires them.
7. Return `202` when the record is accepted but a non-primary follow-up needs retrying.

## Migration sources

`contact-lead`, `client-communication`, and `consultations` become actions in this gateway.

## Non-goals

Proposal signing, executive strategy access, and JasonAI roadmap persistence.
