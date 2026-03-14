# Website Strategy: B2W

## Core Philosophy
- **Minimalism**: Remove non-essential elements. Focus on content and clarity.
- **Monochrome**: Use only black, white, and shades of gray to convey professionalism and focus.
- **Motion**: Use subtle, smooth scroll-based animations to guide the user's attention without overwhelming them.
- **Clarity**: Avoid jargon. Speak plainly about problems and solutions.

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

## Project Pipeline Sync
- The homepage hero copy and project cards are generated from `src/content/projectPipeline.generated.ts`.
- `npm run build` automatically runs `npm run sync:projects` first.
- When `GOOGLE_SERVICE_ACCOUNT_JSON` is set, the sync script reads `PROJECT_PIPELINE_SHEET_ID` or falls back to the `doc_id` inside `index-projects.gsheet`.
- Share the Google Sheet with the service account email if you want Vercel builds to pull the latest hero copy and newly added project rows automatically.
