# B2W API Inventory: Current vs Future

## Current workspace inventory

The current workspace has **12** top-level Vercel API entry files. The executive strategy consolidation is already present locally, so the previous two strategy files are no longer counted.

| Current API | Current responsibility | Future gateway and action |
| --- | --- | --- |
| `business-intake-enrich` | Website/business enrichment | `gurge?action=intake.enrich` |
| `client-communication` | Foster + Partners client form | `communications?action=client.submit` |
| `consultations` | Availability and booking | `communications?action=consultation.availability` / `consultation.book` |
| `contact-lead` | Public lead forms | `communications?action=lead.submit` |
| `executive-strategy` | B2W and JasonAI strategy sessions | `strategy`; retain current URL during migration |
| `gurge-copy` | Generated Gurge copy | `gurge?action=copy.generate` |
| `gurge-today` | Today’s View statement | `gurge?action=today.generate` |
| `jasonai-progress` | Versioned JasonAI roadmap | `jasonai?action=progress.state` / `progress.sync` |
| `jasonai-roi-report` | JasonAI ROI report | `jasonai?action=roi.report` |
| `project-brief` | Project brief generation | `jasonai?action=brief.generate` |
| `proposal-signature` | Proposal acceptance/signature | `proposals?action=submit` |
| `proposals` | Proposal retrieval and delivery | `proposals?action=document` / `status` / `resend` |

## Future inventory

| Future API | Consolidates | Function count |
| --- | --- | --- |
| `communications` | 3 current APIs | 1 |
| `gurge` | 3 current APIs | 1 |
| `jasonai` | 3 current APIs | 1 |
| `strategy` | 1 current API | 1 |
| `proposals` | 2 current APIs | 1 |

**Target total: 5 Vercel Serverless Functions.**

## Migration order

1. Keep current APIs live while the new actions are implemented and tested.
2. Move front-end callers one capability at a time.
3. Verify production behavior and preserve response compatibility where needed.
4. Delete an old top-level API entry only after no caller references it.
5. Confirm the final deployment contains only the five listed top-level API files.
