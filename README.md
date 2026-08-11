# Website Strategy: B2W

## Core Philosophy
- **Minimalism**: Remove non-essential elements. Focus on content and clarity.
- **Monochrome**: Use only black, white, and shades of gray to convey professionalism and focus.
- **Motion**: Use subtle, smooth scroll-based animations to guide the user's attention without overwhelming them.
- **Clarity**: Avoid jargon. Speak plainly about problems and solutions.
- **Deliverables**: Name deliverables in plain, credible language. Public-facing cards should stay generic until access is granted; unlocked deliverables should use direct, specific titles without hype.

## Structure
1. **Hero**: Immediate value proposition. No large distracting imagery.
2. **Work**: Case studies presented as clean cards. Focus on results.
3. **Industries**: Where we operate. Simple list or grid.
4. **Team**: The humans behind the AI. Minimal portraits/avatars.
5. **CTA**: Clear path to contact.

## Design System
- **Font**: Inter (Sans-serif).
- **Colors**:
  - Background: White (#ffffff) or very light gray (#f9fafb).
  - Text: Black (#000000) or dark gray (#111827).
  - Borders: Light gray (#e5e7eb).
- **Components**:
  - Cards: Bordered, no shadow (or very subtle), clear hierarchy.
  - Buttons: Solid black with white text, or outlined.

## Landing Interaction Terms
- Scope: this section applies only to the B2W landing experience.
- Buttons are for actions:
  - redirecting to an external page
  - opening a dialog or modal
  - executing a command or interface function
  - moving to a section on the same page
- Links are for navigation to another page, usually within the same ecosystem.
- Within B2W, the landing site and the client environment are separate ecosystems. Page-to-page movement inside one ecosystem should usually be presented as a link.
- Do not add arrow icons to landing buttons only because they redirect. Button treatment already signals the action.

## Tech Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)

## Booking and Forms Setup
- Public landing pages, service pages, client communications, and proposal signatures now submit to internal Vercel API routes.
- The API routes validate input, rate-limit requests, and write one authoritative record to Supabase.
- Notifications and downstream exports should be triggered from Supabase; form success does not depend on email or Google Sheets.
- Calendly remains optional as a follow-on CTA after successful lead submissions.
- Add these environment variables locally and in Vercel:

```bash
VITE_CALENDLY_URL="https://calendly.com/your-team/consultation"
INTERNAL_NOTIFICATION_EMAIL="info@b2w-ai.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
SUPABASE_SECRET_KEY="sb_secret_xxx"
```

- `VITE_CALENDLY_URL` is used in the Expertise section and in the success state after public lead submissions.
- `/api/contact-lead` handles public lead inquiries.
- `/api/client-communication` handles client portal / client communication forms.
- `/api/proposal-signature` handles proposal acceptance and signature-related actions.
- Supabase secret credentials stay server-side only and are never exposed to the browser bundle.
- All non-client landing pages now use the same `Tell us about your business` intake form, including ARR and multi-select project areas.
- Selecting all three public project areas normalizes the lead to `End-to-End Rebuild`.
- Full operator setup is documented in [docs/forms-and-booking-setup.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/forms-and-booking-setup.md).

## Project Pipeline Sync
- The homepage hero copy and project cards are generated from `src/content/projectPipeline.generated.ts`.
- `npm run build` automatically runs `npm run sync:projects` first.
- The sync script reads the checked-in `index-projects.xlsx` workbook directly and regenerates the homepage project cards from the first worksheet.
- Protected project auth is backed by the checked-in [project-access.registry.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.json) file, which can be regenerated from the local workbook with `npm run sync:project-access`.
- The client portal is backed by the checked-in [client-portal.registry.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/client-portal.registry.json) file and the `/api/client-portal/*` routes. Portal access is issued server-side against the registry allowlist and stored in a signed session cookie.
- Proposal-state homepage cards must not expose client names, exact locations, or other PII. Public card copy should stay generalized until access is granted.
- Proposal-state card tags and impact must be derived from the underlying proposal/profile materials, with tag tiers expressed in monochrome shades.
- Route-specific public card overrides and proposal/page tag tiers live in `src/content/projectShowcase.ts`.
- To add a new project card, update `index-projects.xlsx`, then commit and deploy. The next build will regenerate the card list automatically.

## Marketing Sync
- Run `npm run marketing:sync` after major public-facing website edits that change brand copy, public routes, SEO metadata, canonical paths, favicons, or share images.
- `npm run sync:marketing-assets` regenerates the top-level favicon stack, web manifest, and default share cards from the checked-in brand assets.
- `npm run sync:marketing-docs` regenerates [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md) from the central SEO map and checks that public app routes are not missing static SEO coverage.
- The maintenance rules live in [docs/marketability-source-of-truth.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/marketability-source-of-truth.md).
