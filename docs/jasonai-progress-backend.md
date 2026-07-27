# JasonAI progress intelligence backend

## What it does

The JasonAI tracker remains usable locally, but every server-synced change also creates an immutable backend version containing:

- who made the change (`CEO`, `COO`, or `CTO`);
- which goal or assignment changed;
- the before/after fields and interaction type;
- the complete progress snapshot and SHA-256 checksum;
- actual execution compared with the ideal 24-month phase timeline;
- a structured executive project-manager review;
- the model used and the time the version was created.

The overview reads the latest analysis and recent versions to show the executive review, accountability commitments, phase variance, and actual-versus-ideal trajectory.

## Setup

1. Apply [`supabase/migrations/202607270001_jasonai_progress_versions.sql`](../supabase/migrations/202607270001_jasonai_progress_versions.sql) to the B2W Supabase project.
2. Confirm the existing server-side Supabase variables are configured:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`

3. Add the OSS model variables to local `.env.local` and the Vercel project environment:

   - `JASONAI_OSS_MODEL_BASE_URL`
   - `JASONAI_OSS_MODEL_API_KEY`
   - `JASONAI_OSS_MODEL_NAME`
   - `JASONAI_OSS_MODEL_API_STYLE` (`openai` or `ollama`)

4. Run `npm run dev:full` when testing locally so Vercel serverless APIs are available.

The API key is read only by `api/jasonai-progress.ts`; it is never bundled into the browser and must not use a `VITE_` prefix.

## API

- `GET /api/jasonai-progress?action=status` — database/model configuration state.
- `GET /api/jasonai-progress?action=state` — latest version and recent history.
- `POST /api/jasonai-progress?action=sync` — merge one field-level change, calculate timeline variance, run the project-manager analysis, and save a new immutable version.

If the model is unavailable, the backend stores a deterministic executive review instead of losing the progress update.

## Identity note

The internal portal currently has no login by design. The selected `CEO`, `COO`, or `CTO` role is therefore an accountable operating label, not verified identity. Add Supabase Auth or company SSO before treating the audit trail as cryptographic proof of who performed an edit.
