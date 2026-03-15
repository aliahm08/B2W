# Project Access Registry

Use the local-only spreadsheet at [project-access-registry.local.xlsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access-registry.local.xlsx) to track client access metadata for authenticated project pages.

The backend consumes the synced JSON file at [project-access.registry.local.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.local.json).

Rules:

- Do not store plaintext passwords in this document.
- Store passwords only in `.env.local`, `.env.project-passwords.local`, or your hosting provider's encrypted environment variables.
- Keep approved proposal emails, password env var names, and page mappings in the local spreadsheet.
- Add every new authenticated page path to `authenticatedPages` so backend access stays aligned with frontend routing.

Setup:

1. Open [project-access-registry.local.xlsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access-registry.local.xlsx).
2. Fill in the real client emails and the correct `password_env_var` for each client.
3. Add the matching password values to `.env.project-passwords.local` or your deployed environment.
4. Run `npm run sync:project-access` to refresh the backend JSON.

Backend behavior:

- The backend loads `project-access.registry.local.json` automatically when present.
- If the registry is missing, it falls back to the existing hard-coded env mapping.
- One client record can cover multiple authenticated pages through `authenticatedPages`.

Update workflow:

1. Add the new protected page path in the `pages` sheet and keep the main route in `clients.primary_path`.
2. Add or update approved proposal emails in `proposal_emails_csv`.
3. Add or rotate the referenced password environment variable.
4. Run `npm run sync:project-access`.
5. Redeploy if hosted env vars changed.
