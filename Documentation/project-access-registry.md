# Project Access Registry

Use the local-only spreadsheet at [project-access-registry.local.xlsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access-registry.local.xlsx) to track client access metadata for authenticated project scopes.

The backend consumes the deployable JSON file at [project-access.registry.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.json).

Rules:

- Do not store plaintext passwords in this document.
- Store passwords only in `.env.local`, `.env.project-passwords.local`, or your hosting provider's encrypted environment variables.
- Keep approved proposal emails, password env var names, and page mappings in the local spreadsheet.
- Model routes by scope. The primary path is typically the `profile` page, and extra rows in `pages` can be marked as `proposal` or `profile`.

Setup:

1. Open [project-access-registry.local.xlsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access-registry.local.xlsx).
2. Fill in the real client emails and the correct `password_env_var` for each client.
3. Add the matching password values to `.env.project-passwords.local` or your deployed environment.
4. Run `npm run sync:project-access` to refresh the deployable registry JSON.

Backend behavior:

- The backend loads `project-access.registry.json` by default.
- If the registry is missing, it falls back to the existing env mapping.
- One client scope can cover multiple authenticated pages, and each page is tagged as `proposal` or `profile`.
- Sessions are stored as signed HttpOnly cookies per scope, so users can move between related pages without reauthenticating until they sign out.

Update workflow:

1. Keep the main route in `clients.primary_path`, and add any sibling routes in the `pages` sheet.
2. Set the proposal allowlist in `proposal_emails_csv` only for scopes that actually have a proposal page.
3. Add or rotate the referenced password environment variable.
4. Run `npm run sync:project-access`.
5. Redeploy if hosted env vars changed.
