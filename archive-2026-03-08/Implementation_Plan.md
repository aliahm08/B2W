# B2W Landing Website Implementation Plan

Last updated: 2026-03-03

## Objective

Ship a production-quality product landing website for B2W with:

- clear brand and product positioning,
- audience-specific solution pages,
- a hosted demo experience,
- and reusable mockup tooling through Stitch MCP and 21st.dev workflows.

## Scope Summary

Implemented in current version:

1. Branded website architecture:
   - `/`
   - `/individuals`
   - `/enterprises`
   - `/government`
   - `/demo`
2. Product naming and narrative:
   - Brand: `B2W AI`
   - Product: `RelayOS`
3. Hosted demo page with WhatsApp-style interaction model.
4. Tooling installation for mockup and asset workflows:
   - `stitch-mcp`
   - `@21st-dev/cli`
   - `@21st-extension/toolbar`

## Phase Plan

## Phase 1: Brand and Product Surface (Completed)

- Define naming model and mission-safe copy.
- Create modern SaaS landing architecture.
- Build consistent CTA system and responsive navigation.

## Phase 2: Audience Experiences (Completed)

- Build dedicated Individuals page for three operational modes.
- Build enterprise consulting lifecycle page.
- Build government control-surface page.

## Phase 3: Hosted Demo (Completed)

- Implement `/demo` route.
- Build interactive tabbed demo:
  - Digital Twin
  - Assistant
  - AI Me
- Include text/voice/image input affordances in messenger UI.

## Phase 4: Mockup and Asset Pipeline (Partially Completed)

- Installed Stitch MCP locally and validated startup behavior.
- Installed 21st CLI and toolbar packages.
- Added project scripts for repeatable setup.

Pending credentials to fully activate:

1. Google Cloud project ID and Stitch API enablement.
2. 21st.dev API key for MCP install and registry pulls.

## Phase 5: Release and Iteration (Pending)

1. Generate reference mockups with Stitch MCP once credentials are available.
2. Pull selected UI assets/components from 21st.dev registry.
3. Run final visual QA, accessibility checks, and performance pass.
4. Deploy production release and collect stakeholder feedback.

## Commands

```bash
npm run dev
npm run build
npm run mcp:stitch
npm run mcp:21st:install:cursor -- --api-key YOUR_21ST_API_KEY
npm run assets:21st:add -- <componentIdentifier>
```

