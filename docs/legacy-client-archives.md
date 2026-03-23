# Legacy Client Archives

The old Uyghur Eats client-site variants are intentionally kept in the repo, but they are no longer wired into the active router in [src/App.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx).

This keeps production cleaner while making rollback or reference work straightforward.

## Active Version

- Final live client site:
  [src/pages/client/UyghurEatsClientPortal.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/client/UyghurEatsClientPortal.tsx)
- Active routes:
  `/client/uyghur-eats`
  `/client/uyghur-eats/profile`
  `/client/uyghur-eats/valuation`
  `/client/uyghur-eats/data-room`
  `/client/uyghur-eats/terms`

## Archived Variants

- V1:
  [src/app/client/uyghur-eats-v1/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v1/page.tsx)
- V2:
  [src/app/client/uyghur-eats-v2/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v2/page.tsx)
- V3:
  [src/app/client/uyghur-eats-v3/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v3/page.tsx)
  plus [src/components/portal/Proposal.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/portal/Proposal.tsx), [src/components/portal/Deliverables.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/portal/Deliverables.tsx), [src/components/portal/Outcomes.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/portal/Outcomes.tsx), [src/components/portal/Timeline.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/portal/Timeline.tsx)
- V4:
  [src/app/client/uyghur-eats-v4/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v4/page.tsx)
  plus subpages in [src/app/client/uyghur-eats-v4](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v4/page.tsx)
- V5:
  [src/app/client/uyghur-eats-v5/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v5/page.tsx)
  plus subpages in [src/app/client/uyghur-eats-v5](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/client/uyghur-eats-v5/page.tsx)
- Former portal wrappers:
  [src/app/portal/uyghur-eats/page.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/page.tsx)
  and sibling files under [src/app/portal/uyghur-eats](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/app/portal/uyghur-eats/page.tsx)

## How To Re-enable A Legacy Version

1. Restore the relevant imports in [src/App.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/App.tsx).
2. Restore the route block for the version you want, for example `/client/uyghur-eats-v4` and its subpages.
3. Run `npm run lint`.
4. Run `npm run build`.

## Why This Structure

- The legacy implementations stay in Git and on disk.
- Production routing stays strict and only exposes the final client site.
- Reverting is a small router change, not a file recovery exercise.
