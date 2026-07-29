# PRD: Strategy API

## Endpoint

`/api/strategy`

## Goal

Provide one protected session boundary for B2W and JasonAI executive strategy workspaces.

## Actions

| Scope | Actions | Result |
| --- | --- | --- |
| `b2w` | `login`, `status`, `logout` | B2W internal workspace session |
| `jasonai` | `login`, `status`, `logout`, `data` | JasonAI strategy session and dashboard data |

## Required behavior

- Require and allow-list `scope`.
- Use separate cookies and secrets for B2W and JasonAI sessions.
- Set `HttpOnly`, `SameSite=Strict`, and `Secure` in production.
- Return `Cache-Control: no-store` and `X-Robots-Tag: noindex`.
- Rate-limit login attempts by IP and avoid revealing whether an access key exists.

## Current status

The repository already has the consolidated implementation as `api/executive-strategy.ts`. Rename it to `api/strategy.ts` only during a deliberate client URL migration.

## Non-goals

General Gurge data, public messages, and proposal activity.
