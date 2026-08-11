# B2W API Inventory

## Current workspace inventory

The current workspace has **9** top-level Vercel API entry files. Routes remain separate when they have different authentication, data, runtime, or failure semantics.

| API | Responsibility | Why it remains separate |
| --- | --- | --- |
| `client-communication` | Authenticated client messages to Supabase | Client-specific validation and rate-limit namespace |
| `contact-lead` | Public lead forms to Supabase | Public validation, spam protection, and two-step budget update |
| `executive-strategy` | B2W and JasonAI strategy sessions | Password/session security boundary; already consolidates two strategy scopes |
| `gurge-copy` | Optional model-generated Gurge copy | AI timeout/fallback semantics; internal-only caller |
| `gurge-today` | Optional model-generated Today’s View | Different payload, rate limit, and deterministic fallback from Gurge copy |
| `jasonai-progress` | Versioned JasonAI roadmap in Supabase | Stateful reads/writes and private project-manager analysis |
| `jasonai-roi-report` | Store and email a requested ROI report | Email is the explicit user-facing action, not a side effect of a contact form |
| `proposal-signature` | Proposal responses to Supabase | Higher-value audit record with proposal-specific fields |
| `proposals` | Proposal retrieval, signing transcript, and delivery | Signed-session and document-storage boundary |

## Removed in the 2026-08 cleanup

- `business-intake-enrich`: unused page scraping and unofficial Google Search scraping
- `consultations`: unused Google Calendar booking endpoint; public booking remains a Calendly link
- `project-brief`: unmounted Gemini/fallback prototype with no live-site caller
- Google Sheets fan-out from forms: Supabase is now the sole system of record
- direct form-notification email: notifications belong in Supabase automations

## Consolidation rule

Do not merge endpoints merely to reduce the file count. Consolidate only when callers share authentication, validation, persistence, rate limits, and failure behavior. A single catch-all API would increase coupling without reducing external providers or cost.
