# Client Portal Audit

## 1. Executive Summary

Observed
- The current production-oriented website at the repo root is not a Next.js app. It is a Vite + React Router SPA deployed via Vercel with a filesystem fallback to `index.html` in [`vercel.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/vercel.json) and SPA routes defined in [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L88).
- The current client-facing “portal” experience in that root app is a collection of branded proposal pages, preview pages, and hardcoded client-specific portal/dashboard screens. It is not a true account-based portal.
- A separate Next.js 15 App Router app exists under [`portal/`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal). It has middleware, Clerk auth, Supabase schema/RLS, server actions, route handlers, and admin/client route surfaces. It is architecturally closer to a real multi-client portal, but appears to be a separate deploy target and not the same app as the current root website.
- The root app and the `portal/` app represent two different portal models:
  - Root app: bespoke link/password gated project pages with API-backed cookies and proposal-signing transcripts.
  - `portal/` app: account/org-based authenticated portal foundation with tenant-aware data model.

Likely / inferred
- The root app is the current live implementation users would encounter today unless a separate Vercel project has already been created for `portal/`.
- The `portal/` app is an MVP foundation or parallel rebuild track rather than the currently integrated portal surface.

Recommended
- Treat the repo as two systems during planning:
  - “Current live portal behavior” = root Vite app.
  - “Structured future portal foundation” = `portal/` Next.js app.
- Do not assume the `portal/` app supersedes the root implementation until deployment topology, domain ownership, and data migration are explicitly defined.

Category scores
- Design coherence: 6/10
- Portal UX maturity: 4/10
- Auth/security maturity: 4/10
- Backend maturity: 5/10
- Scalability: 3/10
- Production readiness: 4/10

## 2. Technical Baseline

- Framework
  - Observed: root app is Vite + React 19 + React Router 7, not Next.js, per [`package.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/package.json) and [`src/main.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/main.tsx).
  - Observed: `portal/` is a separate Next.js 15.2 App Router app with React 19, Clerk, and Supabase per [`portal/package.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/package.json).

- Router model
  - Observed: root app uses `BrowserRouter` and `Routes` in [`src/main.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/main.tsx) and [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L110).
  - Observed: `portal/` uses Next App Router route groups `(auth)` and `(portal)` in [`portal/app/`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app).
  - Likely / inferred: repo should be classified as hybrid at the repository level, but not as a hybrid Next app. It is two separate web apps in one repo.

- Layouts
  - Observed: root app has no Next layouts; layout behavior is conditional in `App.tsx` via `isIsolatedView` checks that hide/show nav/footer based on pathname and query params in [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L92-L108).
  - Observed: `portal/` uses nested layouts:
    - root layout in [`portal/app/layout.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/layout.tsx)
    - portal shell layout in [`portal/app/(portal)/portal/layout.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/layout.tsx)
    - admin access layout in [`portal/app/(portal)/portal/admin/layout.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/layout.tsx)

- Route groups
  - Observed: route groups are used only in `portal/` and are cleanly separated into `(auth)` and `(portal)`.

- Middleware
  - Observed: root app has no app-level middleware.
  - Observed: `portal/` has Clerk middleware protecting `/portal(.*)` in [`portal/middleware.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/middleware.ts#L3-L12).

- Route Handlers
  - Observed: root app uses Vercel serverless API functions under `api/`, not Next route handlers.
  - Observed: `portal/` uses route handlers for Clerk webhook and file upload/download:
    - [`portal/app/api/clerk/webhook/route.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/api/clerk/webhook/route.ts)
    - [`portal/app/api/files/download/route.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/api/files/download/route.ts)
    - [`portal/app/api/files/upload/route.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/api/files/upload/route.ts)

- Server Actions
  - Observed: root app has none.
  - Observed: `portal/` uses server actions in [`portal/lib/actions/`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/actions).

- Deployment model
  - Observed: root deployment assumes a SPA fallback via [`vercel.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/vercel.json).
  - Observed: `portal/README.md` explicitly expects a separate Vercel project rooted at `portal/` and deployed to a portal subdomain in [`portal/README.md`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/README.md#L129-L135).

Framework summary
- Observed: current main app is not Next.js.
- Observed: a separate Next.js App Router portal exists, but is isolated from the current root app.

Routing paradigm summary
- Observed: root uses ad hoc React Router routing and pathname heuristics.
- Observed: `portal/` uses App Router with route groups and nested layouts.

Rendering/data mutation summary
- Observed: root is fully client-rendered for page surfaces, with Vercel API functions for mutations.
- Observed: `portal/` is server-component-first, with server actions and route handlers.

Deployment configuration summary
- Observed: current root Vercel config serves SPA routes.
- Likely / inferred: `portal/` requires its own Vercel project and domain to function as designed.

## 3. Route Tree and Portal Inventory

### Root app: current portal-like surfaces

| Route | File | Purpose | Audience | Access model | Layout wrapper(s) | Data source(s) | Protection status | Design/system notes | Risk notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/borek-g-social-media-management` | [`src/pages/projects/borek-g/ProfilePage.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/projects/borek-g/ProfilePage.tsx) | client/project profile | internal + approved viewers | project-access cookie + prompt | root SPA shell with isolated view | hardcoded content + access registry | visually and API gated | polished marketing-like page | not account-based |
| `/borek-g-operations` | [`src/pages/projects/borek-g/ProposalPage.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/projects/borek-g/ProposalPage.tsx) | proposal review and acceptance | approved proposal recipients | approved email flow + signed cookie | isolated view | hardcoded proposal content + proposal API | API-gated, no user identity | strongest current proposal flow | email allowlist is coarse |
| `/client/uyghur-eats` and `/client/uyghur-eats/:section` | [`src/pages/client/UyghurEatsClientPortal.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/client/UyghurEatsClientPortal.tsx) | branded proposal/portal narrative | single client | no real auth | `ClientNavbar` | hardcoded content | public unless page internals blur subviews | polished but bespoke | URL implies client portal more than actual protection |
| `/client/uyghur-eats-v2` | [`src/pages/client/UyghurEatsClientPortalV2.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/client/UyghurEatsClientPortalV2.tsx) | alternate portal concept | single client | partial preview password flow | `ClientNavbar` | hardcoded content + project-access status/login APIs | partially gated for preview mode only | variant design language | duplicate route intent |
| `/client/uyghur-eats-v3/*` | [`src/app/client/uyghur-eats-v3/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v3/page.tsx) | dashboard-style client portal concept | single client | no auth | custom sidebar layout | `portal-data.json` | public | closest visual portal shell in root app | static demo data |
| `/portal/uyghur-eats` | [`src/app/portal/uyghur-eats/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/page.tsx) | proposal hub | single client | none | custom standalone | hardcoded content | public | portal-style naming | misleading security expectation |
| `/portal/uyghur-eats/ad` | [`src/app/portal/uyghur-eats/property-profile.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/property-profile.tsx) | property profile | single client/buyer | unclear, likely preview-oriented | standalone | hardcoded | likely visual gating only | strong bespoke styling | implied secure content not actually account-scoped |
| `/portal/uyghur-eats/analysis` | [`src/app/portal/uyghur-eats/valuation-model.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/valuation-model.tsx) | valuation analysis | single client/buyer | unclear | standalone | hardcoded | likely visual gating only | premium preview style | no real per-user auth |
| `/portal/uyghur-eats/dashboard` | [`src/app/portal/uyghur-eats/ops-dashboard.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/ops-dashboard.tsx) | progress dashboard | single client | none | standalone | `portal-data.json` | public | dashboard concept only | mock data and dead-end actions |
| `/client/uyghur-eats/opportunity` | [`src/pages/projects/uyghur-eats/ProfilePage.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/projects/uyghur-eats/ProfilePage.tsx) | analysis profile | client/buyer | preview-password flow | `ClientNavbar` + preview chrome | hardcoded content + access APIs | partially gated | refined sales material | not durable portal access |
| `/client/uyghur-eats/valuation` | [`src/pages/projects/uyghur-eats/ValuationModelPage.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/projects/uyghur-eats/ValuationModelPage.tsx) | valuation deliverable | client/buyer | mostly preview-style | `ClientNavbar` | hardcoded content | effectively public sample unless internally blurred elsewhere | polished deliverable preview | no true data protection |
| `/client/uyghur-eats/data-room` | [`src/pages/projects/uyghur-eats/previews/DataRoomPage.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/projects/uyghur-eats/previews/DataRoomPage.tsx) | data room teaser | buyer/client | preview surface | standalone preview frame | hardcoded | teaser-level only | suggests future data room | not a real data room |

Observed
- Root route inventory is client-specific and hardcoded in [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L110-L133).
- There are duplicate/competing portal concepts for Uyghur Eats:
  - `/client/uyghur-eats`
  - `/client/uyghur-eats-v2`
  - `/client/uyghur-eats-v3/*`
  - `/portal/uyghur-eats`
  - `/client/uyghur-eats/opportunity`
  - `/client/uyghur-eats/valuation`
  - `/client/uyghur-eats/data-room`
- The route naming implies a secure multi-page client portal, but the implementation is mostly bespoke content routing, preview gating, and static content variants.

### `portal/` app: structured Next.js portal routes

| Route | File | Purpose | Audience | Access model | Layout wrapper(s) | Data source(s) | Protection status | Design/system notes | Risk notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/sign-in` | [`portal/app/(auth)/sign-in/[[...sign-in]]/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(auth)/sign-in/[[...sign-in]]/page.tsx) | auth entry | all portal users | Clerk | root layout | Clerk | protected by auth provider config | basic auth card | inert if Clerk env missing |
| `/sign-up` | [`portal/app/(auth)/sign-up/[[...sign-up]]/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(auth)/sign-up/[[...sign-up]]/page.tsx) | invite completion | invited users | Clerk | root layout | Clerk | provider-config dependent | basic auth card | inert if Clerk env missing |
| `/portal` | [`portal/app/(portal)/portal/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/page.tsx) | dashboard | all authenticated users | Clerk middleware + Supabase query scoping | root + portal layout | Supabase | protected | consistent shell | summary counts limited to top-5 query result count |
| `/portal/proposals` | [`portal/app/(portal)/portal/proposals/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/proposals/page.tsx) | proposal list | tenant users | Clerk + RLS | root + portal layout | Supabase | protected | coherent table pattern | depends on RLS correctness |
| `/portal/proposals/[id]` | [`portal/app/(portal)/portal/proposals/[id]/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/proposals/[id]/page.tsx) | proposal detail + comments + actions | tenant users | Clerk + server actions + RLS | root + portal layout | Supabase | protected | strongest true portal route in repo | actions rely heavily on DB policy |
| `/portal/deliverables` | [`portal/app/(portal)/portal/deliverables/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/deliverables/page.tsx) | deliverable list | tenant users | Clerk + RLS | root + portal layout | Supabase | protected | coherent | basic metadata only |
| `/portal/deliverables/[id]` | [`portal/app/(portal)/portal/deliverables/[id]/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/deliverables/[id]/page.tsx) | deliverable detail + file list + comments | tenant users | Clerk + RLS | root + portal layout | Supabase | protected | coherent | no version diff/review UX |
| `/portal/settings` | [`portal/app/(portal)/portal/settings/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/settings/page.tsx) | role/org diagnostics | authenticated users | Clerk | root + portal layout | auth context | protected | utilitarian | exposes internal identity details to end users |
| `/portal/admin` | [`portal/app/(portal)/portal/admin/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/page.tsx) | admin hub | internal users | admin layout role guard | root + portal + admin layout | none | protected | coherent | linked child routes missing in places |
| `/portal/admin/proposals` | [`portal/app/(portal)/portal/admin/proposals/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/proposals/page.tsx) | proposal management | internal users | admin layout | same | Supabase | protected | basic admin table | links to routes that do not exist |
| `/portal/admin/deliverables` | [`portal/app/(portal)/portal/admin/deliverables/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/deliverables/page.tsx) | deliverable creation | internal users | admin layout + server action | same | Supabase | protected | functional form | weak validation |
| `/portal/admin/clients` | [`portal/app/(portal)/portal/admin/clients/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/clients/page.tsx) | organization list | internal users | admin layout | same | Supabase | protected | utilitarian | no edit/create flow |
| `/portal/admin/invites` | [`portal/app/(portal)/portal/admin/invites/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/invites/page.tsx) | invite flow | internal users | admin layout + Clerk API | same | Clerk + Supabase org list | protected | useful MVP | no invitation tracking surface |
| `/portal/admin/audit` | [`portal/app/(portal)/portal/admin/audit/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/audit/page.tsx) | audit log | internal users | admin layout | same | Supabase | protected | useful internal screen | no filtering/search |

Observed
- `portal/` uses route groups and nested layouts strategically.
- `portal/` admin routes include links to unimplemented routes such as `/portal/admin/proposals/new` and `/portal/admin/proposals/[id]/edit` from [`portal/app/(portal)/portal/admin/proposals/page.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/(portal)/portal/admin/proposals/page.tsx), indicating incomplete admin workflows.

## 4. Access Control and Auth Audit

### Root app

Observed
- Root access control is based on a custom signed cookie system in [`api/_lib/projectAccess.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/projectAccess.ts#L88-L266).
- Proposal view access is granted by matching an entered email against a static allowlist in [`api/project-access/login.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/project-access/login.ts#L41-L65).
- Profile view access is granted by matching a plaintext password from env-backed config in [`api/project-access/login.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/project-access/login.ts#L72-L95).
- Cookie security is better than localStorage for access state:
  - signed with HMAC
  - `HttpOnly`
  - `SameSite=Lax`
  - optional `Secure` in production
  - see [`api/_lib/projectAccess.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/projectAccess.ts#L221-L266)
- Proposal acceptance form state is stored in `localStorage` in [`src/components/ProposalAcceptanceSection.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/ProposalAcceptanceSection.tsx), but this is draft UX state, not the access token itself.

Likely / inferred
- Root app has no true user/account system, no durable identity model, no roles, and no per-client user records.
- Email-based proposal access is closer to “shared secret by email knowledge” than real authentication, because it does not verify email ownership through a magic link or OTP. Anyone who knows an approved email can unlock the proposal.
- Password-based profile access is project-wide shared-secret access, not person-based access.
- Root app can support one-off gated links, but not real multi-client account-based access with auditable permissions.

Recommended
- Do not treat root app protection as sufficient for real client portal access.
- If root app remains live during transition, classify it as semi-protected presentation content, not secure client workspace infrastructure.

Explicit risk flags
- Hardcoded/locally stored secret exposure:
  - Observed: `.env.project-passwords.local` contains an actual password value for `PROJECT_PASSWORD_BOREK_G_OPERATIONS` in [` .env.project-passwords.local`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/.env.project-passwords.local).
- Static hidden pages still routable:
  - Observed: many `/portal/*` and `/client/*` routes are public in the root app and rely on page-level blur/prompt patterns rather than route-level authentication.
- Unvalidated query-param access patterns:
  - Observed: root isolated-view behavior changes based on `return` query param in [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L97-L98). This is UX-level, not auth, but shows route behavior tied to query params.
- Deployment protection confusion risk:
  - Likely / inferred: the root app could be mistaken as “secure” because of hidden/blurred states and gated prompts, but the system is not equivalent to authenticated, scoped application data.

### `portal/` app

Observed
- Middleware uses Clerk to protect `/portal(.*)` routes in [`portal/middleware.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/middleware.ts#L3-L12).
- Auth context is resolved from Clerk and then mapped to a Supabase `profiles` record in [`portal/lib/auth.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/auth.ts).
- Role checks are implemented in [`portal/lib/permissions.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/permissions.ts).
- Database-level tenant isolation is designed via Supabase RLS in [`portal/supabase/rls.sql`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/supabase/rls.sql#L76-L176).

Observed security gaps
- `portal` middleware protects `/portal`, but not `/api/files/*`; those handlers rely on `getAuthContext()` instead of middleware, which is acceptable if Clerk session cookies are available server-side.
- Some server actions update proposals by `id` without explicitly checking organization in code, relying on RLS only:
  - [`portal/lib/actions/proposals.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/actions/proposals.ts#L78-L163)
- The RLS policy `"client_editor can respond to proposal only"` permits update on the `proposals` table but does not constrain which columns may be changed in PostgreSQL policy terms. If a client editor can invoke a broader update path, they could potentially alter more than status/revision fields unless every server action is tightly constrained. See [`portal/supabase/rls.sql`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/supabase/rls.sql#L91-L98).
- `portal/app/api/files/upload/route.ts` trusts `organizationId`, `entityId`, and `entityType` from multipart form data and uses the Supabase service role to write storage objects and metadata in [`portal/app/api/files/upload/route.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app/api/files/upload/route.ts#L12-L55). Role gating limits this to internal users, but there is no server-side verification that the submitted organization/entity relationship is valid.
- `portal/app/api/files/download/route.ts` infers organization from the storage path prefix instead of resolving file ownership from DB metadata first. This works only if path conventions are always correct.

Likely / inferred
- `portal/` has a real user/account system and durable session model through Clerk.
- `portal/` is materially more secure than the root app if Clerk, JWT template, and Supabase RLS are configured correctly.
- `portal/` can support multi-client use, but only after missing admin CRUD flows, validation, and file ownership checks are tightened.

Security confidence level
- Root app: low
- `portal/` app: moderate in design, medium-low in current implementation completeness

## 5. Backend / Data / Mutation Audit

### Root app

Observed
- Proposal acceptance is persisted via `api/proposals/submit.ts` and proposal documents are stored either in Google Drive or local temp storage in [`api/_lib/proposals.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/proposals.ts).
- Signed proposal transcript access is protected by a signed token in the document URL via [`api/proposals/document.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/proposals/document.ts).
- Project access config is loaded from registry JSON plus env vars in [`api/_lib/config.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/config.ts#L193-L454).
- `client-portal.registry.json` exists and contains account/project metadata, but there is no route or API in the current root app actively turning it into a true authenticated dashboard model.

Likely / inferred
- Root backend model is not a relational portal backend. It is a set of file-backed registries, env-based passwords, and proposal submission documents.
- Proposal state can be captured as a signed transcript, but there is no lifecycle state machine, no account linkage, and no durable proposal record table.
- Deliverables, comments, files, and audit history are not modeled as first-class entities in the root app.

### `portal/` app

Observed
- `portal/` has a real schema for:
  - organizations
  - profiles
  - proposals
  - proposal_attachments
  - deliverables
  - deliverable_files
  - comments
  - audit_logs
  - in [`portal/supabase/schema.sql`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/supabase/schema.sql)
- Data fetching is centralized in [`portal/lib/data/queries.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/data/queries.ts).
- Mutations exist via server actions:
  - create/update proposals
  - approve/request revision/acknowledge
  - create deliverables
  - add comments
  - invite users
- Audit logging exists in [`portal/lib/audit.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/audit.ts).

Observed gaps
- No schema for proposal options, structured pricing, deliverable review states, comments with mentions, approvals/signatures, tasks, notifications, or admin publishing workflow.
- No input validation library is used. FormData is coerced directly to strings in server actions and route handlers.
- No idempotency protections for mutation flows.
- No malware scanning or file type allowlist for uploads.
- No server-enforced relationship check between uploaded file target entity and organization in `portal/app/api/files/upload/route.ts`.
- No explicit error boundary or typed domain error handling.
- Admin proposal CRUD is incomplete because linked `new` and `edit` routes are missing.

Data model maturity
- Root app: 3/10
- `portal/` app: 6/10

Backend maturity
- Root app: 4/10
- `portal/` app: 6/10

## 6. Design System Audit

### Root app

Observed
- Global styling uses Tailwind v4 plus a Google-hosted Inter import in [`src/index.css`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/index.css).
- Repeated primitives:
  - mono uppercase eyebrow labels
  - black/white cards
  - neutral borders
  - rounded-full CTAs
  - blurred locked-state overlays
  - `ClientNavbar`
  - `ProfileSectionNav`
- Page families diverge noticeably:
  - marketing landing
  - project profile/proposal pages
  - portal-v3 sidebar experience
  - `/portal/uyghur-eats` proposal hub
- There are multiple one-off visual systems for “portal”:
  - editorial premium longform
  - dashboard/sidebar shell
  - preview chrome overlay
  - access prompt modal

Likely / inferred
- The brand language is strongest in the longform proposal/profile pages.
- The dashboard/portal surfaces feel adjacent to the brand but not fully canonicalized.
- Root app design can support premium narrative proposals well, but it does not yet have a stable set of portal primitives for states like file review, comments, permissions, notifications, empty states, and admin tables.

### `portal/` app

Observed
- `portal/app/globals.css` defines a separate CSS variable system and a more utilitarian product UI with:
  - flat white surfaces
  - subtle gray borders
  - Inter/system stack
  - simple table/panel/sidebar patterns
- Core primitives are reusable and consistent:
  - `PortalShell`
  - `PageHeader`
  - `StatusPill`
  - table shell
  - panel
  - form grid
  - detail grid
- It is coherent internally, but visually much plainer than the root marketing/proposal surfaces.

Design coherence assessment
- Observed: there is no single canonical design system shared between public marketing, proposal pages, preview flows, and the Next portal.
- Observed: the root app is more premium and expressive; the `portal/` app is more sober and product-like.
- Recommended: preserve the premium typography, sectional storytelling, and trust-building longform patterns from the root proposal pages, but standardize them into canonical portal primitives before building dashboards/review workflows.

What should become canonical portal primitives
- client/workspace shell
- page header with status/actions
- secure access state banner
- proposal summary card
- deliverable card/file list
- threaded discussion block
- approval/revision action panel
- audit/event timeline
- role-aware empty states

Design system maturity
- Root proposal surfaces: 7/10
- Root portal/dashboard surfaces: 5/10
- `portal/` product UI consistency: 6/10
- Cross-experience coherence overall: 4/10

## 7. UX / Workflow Audit

### Likely current flow: new client landing on a proposal

Observed
1. Client receives a direct route.
2. In root app, they may encounter:
   - a public/semi-public proposal page,
   - a prompt to enter an approved email,
   - or a password prompt for profile access.
3. Proposal review is visual and polished, with acceptance handled in-page.
4. Acceptance submits a signed transcript and returns a document link via API.

Gaps
- No real account onboarding.
- No durable client home after acceptance.
- No clear transition from proposal acceptance to ongoing workspace access.

### Likely current flow: client reviewing scope/options

Observed
- Borek-G proposal has the most complete option-selection and acceptance UX via [`src/components/ProposalAcceptanceSection.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/ProposalAcceptanceSection.tsx).
- Option choice is stored locally before submission.

Gaps
- No draft save tied to identity.
- No shared comments/approvals around specific scope sections.
- No stateful review history outside the final signed transcript.

### Likely current flow: client accepting terms/signing

Observed
- Root app supports digital signature capture via canvas and transcript creation.

Gaps
- No legal workflow model beyond transcript generation.
- No countersignature state.
- No acceptance status surfaced back into a client dashboard.

### Likely current flow: client accessing a deliverable preview

Observed
- Deliverable/analysis pages in root app are often preview-oriented and may blur content behind password prompts.

Gaps
- No real file repository, revision compare, or secure document handoff in root app.
- UX reads as staged marketing/diligence previews rather than a durable client workspace.

### Likely current flow: internal/admin actor publishing/updating

Observed
- In root app, this appears manual: edit code/content/registry JSON/env values and redeploy.
- In `portal/`, internal actor flows exist conceptually for proposals, deliverables, invites, and audit history.

Gaps
- No completed admin publishing loop in `portal/`.
- No CMS/editorial workflow.
- No clear internal-to-client release process.

Portal UX maturity assessment
- Observed: the current product model is best described as a branded set of gated pages with some quasi-portal traits.
- Likely / inferred: the `portal/` app is the beginning of a true portal foundation, but not yet complete enough to replace the current root experience.

## 8. Vercel / Environment / Deployment Audit

Observed
- Root Vercel config is for SPA routing, not Next.js, in [`vercel.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/vercel.json).
- Root env model includes:
  - Google service account and Drive settings
  - project access secrets
  - project password env vars
  - proposal signing secret and email settings
  - client portal secret
  - in [`.env.example`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/.env.example)
- `portal/` env model includes Clerk and Supabase env vars in [`portal/.env.example`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/.env.example).
- `portal/next.config.mjs` sets `outputFileTracingRoot` to parent repo root, which is reasonable for monorepo-like deployment from `portal/`.

Explicit flags
- Environment drift risk:
  - Observed: root app and `portal/` app use completely different env surfaces and security assumptions.
- Callback/base URL fragility:
  - Observed: `portal/.env.example` uses `NEXT_PUBLIC_APP_URL`, while `portal/README.md` assumes `portal.example.com`.
- Deployment confusion risk:
  - Observed: current repo can be deployed as root Vite app while `portal/` expects a second Vercel project.
- Public vs server env usage:
  - Observed: `portal/` correctly uses `NEXT_PUBLIC_*` only for public Clerk/Supabase app config and keeps service role/private secrets server-side.
- Preview vs production confusion:
  - Likely / inferred: if preview deployments are used for client sharing, there is a risk of conflating Vercel deployment visibility with application auth, especially in the root app where routes are mostly public.

Production-safety assessment
- Root env usage: moderate, but coarse and secret-driven rather than user/account-driven.
- `portal/` env usage: structurally sound, pending correct Clerk/Supabase/Vercel setup.

## 9. Current Portal Snapshot

1. What is the portal today, in plain language?

Observed
- Today’s portal is primarily a branded set of proposal pages, analysis previews, and client-specific showcase/dashboard screens in a Vite SPA, supplemented by API-backed email/password gates and signed proposal transcript generation.
- Separately, there is a more conventional authenticated portal app under `portal/`, but it is not the same application surface as the current root site.

2. What is it not yet?

Observed
- It is not yet a unified account-based client portal with one canonical route system, one canonical backend, durable client identities, role-based permissions across projects, or a complete admin publishing workflow.

3. What pieces are already strong and worth preserving?

- The proposal presentation quality and longform trust-building design in root project pages.
- The signed proposal transcript flow in root APIs.
- The idea of proposal/profile dual-access modes for staged disclosure.
- The `portal/` app’s organization/profile/proposal/deliverable/comment/audit schema.
- The `portal/` app’s use of Clerk + Supabase + RLS as the target security model.

4. What technical constraints currently shape it?

- Two separate app architectures in one repo.
- Root app is client-rendered and content-driven.
- `portal/` app assumes separate deployment and its own auth/data stack.
- Current root access patterns are secret/registry based, not account based.

5. What design constraints currently shape it?

- Premium marketing/proposal language is stronger than product-shell language.
- Multiple portal UI directions exist with no single canonical primitive set.
- Client trust is currently driven by presentation quality more than authenticated product rigor.

6. What are the biggest risks if this went to real clients now?

- Confusion about what is actually secure versus merely blurred/gated.
- Client-facing URLs that imply private portal access but are actually public or semi-protected.
- Operational brittleness from manual registries/env passwords.
- No unified client identity or project/workspace model in the root app.
- Parallel portal implementations causing inconsistent client experience.

7. What are the clearest opportunities for the next version?

- Consolidate onto one portal architecture.
- Adopt the `portal/` app’s org/user/data model.
- Preserve and port the strongest root proposal/design patterns into product-grade portal components.
- Formalize proposal acceptance, deliverable release, comments, and audit history as first-class portal workflows.

Decision-grade snapshot
- Current portal model: branded gated pages plus a parallel authenticated portal MVP
- Current access model: root app uses shared-secret cookies; `portal/` app uses Clerk + org/role-based auth
- Current data model maturity: split; low in root app, moderate in `portal/`
- Current design system maturity: strong narrative design, weak cross-experience systemization
- Current backend maturity: bespoke APIs in root; real schema in `portal/`
- Security confidence level: low-to-moderate overall
- Scalability confidence level: low overall, moderate for `portal/` foundation only
- Readiness for real client use: limited for controlled, low-scale use; not ready as a true multi-client portal

Top 5 risks
1. Public or semi-protected routes are being presented as secure portal surfaces.
2. The repo contains two different portal architectures with different deployment assumptions.
3. Root access model is not account-based and does not verify user identity ownership.
4. `portal/` admin workflows are incomplete and rely on thin validation.
5. Design inconsistency between premium proposal pages and utilitarian portal shell will erode trust if stitched together without a unified system.

Top 5 opportunities
1. Use `portal/` as the canonical authenticated foundation.
2. Port the best root proposal UX into reusable portal primitives.
3. Convert root registry/env-driven access into real org/project/user records.
4. Make proposal acceptance a first-class stateful workflow tied to organizations and projects.
5. Build a coherent admin publishing flow for proposals, deliverables, invites, and audit history.

## 10. What Should Be Preserved

- Longform proposal storytelling patterns from root project pages.
- Visual trust signals: premium typography, restrained palette, high-information hero sections, scoped CTA rhythm.
- Signed proposal transcript generation and PDF/document delivery concept.
- The idea of staged disclosure between teaser/profile/proposal/deliverable access.
- `portal/` schema foundations:
  - organizations
  - profiles
  - proposals
  - deliverables
  - comments
  - audit logs
- `portal/` use of Clerk orgs mapped to tenant-scoped Supabase RLS.

## 11. What Is Missing or Risky

- One canonical app and deployment target.
- One canonical route structure for public, proposal, deliverable, and dashboard surfaces.
- Real account-based authentication in the currently active root experience.
- Per-client/per-project backend records driving the live root portal UX.
- Robust validation and authorization around server mutations and uploads.
- Canonical portal primitives for:
  - comments
  - approvals
  - deliverable release
  - notifications
  - review states
  - admin publishing
- A clear bridge from proposal acceptance to ongoing client workspace.

## 12. Recommended Next Architecture Decisions

1. Choose the canonical portal platform.
   - Decision: continue evolving the root Vite app, or migrate to the `portal/` Next.js app as the official portal.

2. Choose the access model.
   - Decision: account-based auth, invite-based org membership, signed-link access, or a hybrid for proposals.

3. Define the core tenant model.
   - Decision: organization -> project -> proposal/deliverable hierarchy, and whether one user can belong to multiple organizations/projects.

4. Define proposal lifecycle states.
   - Decision: draft, sent, viewed, approved, revision requested, countersigned, archived, etc.

5. Define deliverable model.
   - Decision: preview page, file package, structured review artifact, or all three.

6. Define comments/review workflow.
   - Decision: global thread, section-level comments, file annotations, approval checkpoints.

7. Define internal publishing workflow.
   - Decision: who can create/edit/send/archive proposals and deliverables, and how releases are versioned.

8. Define storage model.
   - Decision: Supabase Storage only, Drive integration for generated artifacts, or dual-mode archival.

9. Define portal IA and route strategy.
   - Decision: `/portal/[org]/projects/[project]/*` style structure versus flatter routes.

10. Define canonical portal design primitives.
   - Decision: which root proposal patterns become reusable components inside the authenticated portal.

## 13. Appendix

Important files
- Root app config: [`package.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/package.json)
- Root routing: [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx)
- Root CSS: [`src/index.css`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/index.css)
- Root access config: [`api/_lib/config.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/config.ts)
- Root project access: [`api/_lib/projectAccess.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/projectAccess.ts)
- Root proposal signing: [`api/_lib/proposals.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/api/_lib/proposals.ts)
- Root registries: [`project-access.registry.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.json), [`client-portal.registry.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/client-portal.registry.json)
- Portal app config: [`portal/package.json`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/package.json)
- Portal middleware: [`portal/middleware.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/middleware.ts)
- Portal auth: [`portal/lib/auth.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/auth.ts)
- Portal queries: [`portal/lib/data/queries.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/data/queries.ts)
- Portal permissions: [`portal/lib/permissions.ts`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/lib/permissions.ts)
- Portal schema/RLS: [`portal/supabase/schema.sql`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/supabase/schema.sql), [`portal/supabase/rls.sql`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/supabase/rls.sql)

Relevant routes
- Root SPA routes: see [`src/App.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx#L110-L133)
- Portal App Router tree: see [`portal/app/`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/app)

Relevant components
- Root access UX: [`src/components/ProjectPasswordGate.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/ProjectPasswordGate.tsx), [`src/components/ProjectAccessPrompt.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/ProjectAccessPrompt.tsx), [`src/components/PreviewAccessChrome.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/PreviewAccessChrome.tsx)
- Root proposal acceptance: [`src/components/ProposalAcceptanceSection.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/ProposalAcceptanceSection.tsx)
- Portal shell/components: [`portal/components/portal-shell.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/components/portal-shell.tsx), [`portal/components/page-header.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/components/page-header.tsx), [`portal/components/proposal-actions.tsx`](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/portal/components/proposal-actions.tsx)

Middleware coverage notes
- Root app: none.
- `portal/`: middleware protects `/portal*`, not `/sign-in` or `/sign-up`, which is correct. API handlers self-check auth/role.

Env assumptions
- Root app assumes env-backed project secrets, registry paths, Google credentials, and proposal signing secrets.
- `portal/` assumes Clerk, Supabase, JWT template, and app URL are configured per environment.

Unresolved uncertainties
- Whether `portal/` already has its own live Vercel deployment and domain.
- Whether root Vite app or `portal/` is the client-facing production system today.
- Whether Supabase RLS has actually been provisioned in the target environment.
- Whether Clerk organization invites and webhook sync are live or only scaffolded.
- Whether `client-portal.registry.json` is intended for a future root-app portal surface that was not completed.
