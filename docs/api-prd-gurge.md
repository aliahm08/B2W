# PRD: Gurge API

## Endpoint

`/api/gurge`

## Goal

Provide the authenticated Gurge workspace with business-aware generation and analysis behind one secure gateway.

## Actions

| Action | Result |
| --- | --- |
| `today.generate` | Generate the executive Today’s View with deterministic fallback |
| `copy.generate` | Generate approved structured copy from supplied business context |
| `intake.enrich` | Enrich a supplied business website or intake record |
| `analysis.generate` | Produce internal business analysis from authorized data |

## Required behavior

- Require an internal session except for an explicitly approved public intake action.
- Validate and cap all input fields before model invocation.
- Prefer deterministic calculations and stored business data; use the model for synthesis.
- Return structured JSON, never unbounded model prose.
- Preserve the 30-second Today’s View refresh contract.
- Record model, prompt version, generated timestamp, and fallback status without logging sensitive prompts.

## Migration sources

`gurge-copy`, `gurge-today`, and `business-intake-enrich` become actions in this gateway.

## Non-goals

Customer email delivery, JasonAI roadmap mutation, and strategy access.
