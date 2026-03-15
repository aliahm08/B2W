# Project Access Registry

Use the local-only registry at [project-access.registry.local.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.local.json) to track client access metadata for authenticated project pages.

Rules:

- Do not store plaintext passwords in this document.
- Store passwords only in `.env.local`, `.env.project-passwords.local`, or your hosting provider's encrypted environment variables.
- Keep approved proposal emails and page mappings in the local registry file.
- Add every new authenticated page path to `authenticatedPages` so backend access stays aligned with frontend routing.

Setup:

1. Copy [project-access.registry.example.json](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/project-access.registry.example.json) to `project-access.registry.local.json`.
2. Fill in the real client emails and the correct `passwordEnvVar` for each client.
3. Add the matching password values to `.env.project-passwords.local` or your deployed environment.

Backend behavior:

- The backend loads `project-access.registry.local.json` automatically when present.
- If the registry is missing, it falls back to the existing hard-coded env mapping.
- One client record can cover multiple authenticated pages through `authenticatedPages`.

Update workflow:

1. Add the new protected page path to the relevant client entry.
2. Add or update approved proposal emails.
3. Add or rotate the referenced password environment variable.
4. Redeploy if hosted env vars changed.
