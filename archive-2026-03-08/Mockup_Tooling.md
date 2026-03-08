# Mockup Tooling Setup

Last updated: 2026-03-03

This repo includes local tooling for mockup workflows requested for B2W landing design.

## Installed Tooling

- `stitch-mcp` (installed as dev dependency)
- `@21st-dev/cli` (installed as dev dependency)
- `@21st-extension/toolbar` (installed as dev dependency)

## Stitch MCP

`stitch-mcp` is installed and executable through npm scripts.

Run:

```bash
npm run mcp:stitch
```

Prerequisites:

1. Google Cloud project with Stitch API enabled.
2. `GOOGLE_CLOUD_PROJECT` environment variable set.
3. Application default credentials configured through `gcloud`.

Observed startup check in this environment:

- Server starts, then exits until `GOOGLE_CLOUD_PROJECT` is provided.

## 21st.dev Asset and Component Tooling

Install MCP config for Cursor (requires your API key):

```bash
npm run mcp:21st:install:cursor -- --api-key YOUR_21ST_API_KEY
```

Add a 21st component into the codebase:

```bash
npm run assets:21st:add -- <componentIdentifier>
```

Notes:

- `componentIdentifier` can be a name or a `https://21st.dev/r/...` URL.
- This project currently uses Radix Themes + custom layout classes for production UI.

## Dev Toolbar Injection

The 21st toolbar is initialized only in development mode in `src/main.tsx`.

