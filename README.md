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

## Tech Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)

## Website Assistant
- The site now uses server-side `/api` routes for chat and consultation booking.
- Ollama credentials stay in environment variables and are never exposed to the browser bundle.
- Knowledge is pulled from local `.md` and `.json` files plus optional allowlisted Google Drive files/folders.
- Calendar reads and event creation are restricted to `GOOGLE_ALLOWED_CALENDAR_IDS`, and Drive writes are restricted to `GOOGLE_DRIVE_BOOKING_FOLDER_ID` when that folder is also allowlisted.

## Booking and Forms Setup
- Public landing pages now use a hosted lead form as the primary intake flow, with Calendly shown as a follow-on booking option.
- Client proposal and portal pages use a separate hosted form endpoint for proposal acceptance and client communications.
- Add these browser-safe environment variables locally and in Vercel:

```bash
VITE_CALENDLY_URL="https://calendly.com/your-team/consultation"
VITE_FORM_ENDPOINT_LEADS="https://formspree.io/f/your-leads-id"
VITE_FORM_ENDPOINT_CLIENT="https://formspree.io/f/your-client-id"
```

- `VITE_CALENDLY_URL` is used in the Expertise section and in the success state after public lead submissions.
- `VITE_FORM_ENDPOINT_LEADS` is used by the public lead inquiry form.
- `VITE_FORM_ENDPOINT_CLIENT` is used by client-side proposal acceptance and communication forms.
- All non-client landing pages now use the same `Tell us about your business` intake form, including ARR and multi-select project areas.
- Selecting all three public project areas normalizes the lead to `End-to-End Rebuild`.
- Configure the client hosted form so notifications go to `info@b2w-ai.com` and replies can use the submitted client email.
- If the provider supports autoresponders, enable a confirmation email on the client form.
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
