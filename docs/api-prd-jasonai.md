# PRD: JasonAI API

## Endpoint

`/api/jasonai`

## Goal

Operate JasonAI’s internal product intelligence as one application: roadmap state, executive analysis, ROI reports, and project briefs.

## Actions

| Action | Result |
| --- | --- |
| `progress.state` | Read current versioned JasonAI roadmap state |
| `progress.sync` | Apply an authorized roadmap change and produce analysis |
| `roi.report` | Generate and deliver a JasonAI ROI report |
| `brief.generate` | Generate a structured project brief from validated inputs |

## Required behavior

- Protect progress read/write actions with internal authorization and role checks.
- Use Supabase version history as the source of truth for roadmap changes.
- Keep public ROI and brief inputs independently rate-limited and spam-protected.
- Separate AI generation from authoritative calculations; return a fallback if the model is unavailable.
- Use idempotency for report delivery and durable output references for generated reports.

## Migration sources

`jasonai-progress`, `jasonai-roi-report`, and `project-brief` become actions in this gateway.

## Non-goals

General B2W client communication, proposals, and executive-session login.
