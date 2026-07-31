# B2W Unified Website Prototype

**Status:** First-run prototype  
**Branch:** `agent/workspace-brand-system`  
**Prototype root:** `/prototype`  
**Live routes affected:** None

## Purpose

This prototype tests the B2W website as one company system rather than a collection of separate service, product, resource, and internal experiences.

The prototype remains isolated from the current public routes so the structure, voice, components, and user journey can be reviewed before migration.

## Approved website structure

```text
Services
Products
  Agents
  Workflows
  Pricing
Resources
About
Contact
```

| Prototype route | Role |
|---|---|
| `/prototype` | Unified homepage and website orientation |
| `/prototype/services` | Growth, optimization, and diligence services |
| `/prototype/products` | Product system overview |
| `/prototype/products/agents` | JasonAI and the specialized-agent model |
| `/prototype/products/workflows` | Current, developing, and future operating workflows |
| `/prototype/products/pricing` | Standard and early-access JasonAI pricing |
| `/prototype/resources` | Guides, demonstrations, templates, and decision tools |
| `/prototype/guide` | Reusable operator-guide template |
| `/prototype/about` | Company purpose, audience, approach, and principles |
| `/prototype/contact` | Service and product contact paths |

The previous `/prototype/jasonai` path remains supported as an alias for `/prototype/products/agents`.

## Workspace elements used across the website

### Clara mark as the B2W logo

The Clara visual mark is used as the parent B2W mark in the prototype header and footer. It is paired with the B2W wordmark rather than presented as a separate Clara identity.

Asset:

```text
public/brand/clara-logo-solid.png
```

### Buttons

The shared button system includes:

- Primary company action
- Secondary action
- JasonAI product action
- Clara / Resources action
- Compact, standard, and large sizes

Every major page should have one visually dominant action.

### Search

The prototype includes working website search in the shared header.

Search covers:

- Services
- Products
- Agents
- Workflows
- Pricing
- Resources
- Guide content
- About
- Contact
- Workspace reference

Keyboard access:

```text
Command + K
Control + K
```

### Structure

The shared structure includes:

- One sticky header
- Products dropdown
- Responsive mobile navigation
- One multi-column footer
- Shared content width and spacing
- Shared display and interface typography
- Shared page progression
- Shared status language
- Product accents used only for context

## Parent visual system

- Canvas: warm neutral
- Documents and cards: white
- Primary text and actions: black
- Active state: green
- Gate or dependency: gold
- Risk or blocker: red
- JasonAI context: rust
- Resources context: plum

Product colors identify context. They do not create separate navigation, spacing, typography, or content systems.

## Content model

Every major page follows the same operating progression:

1. **Orient** — Establish the audience, business condition, and reason to continue.
2. **Diagnose** — Show the operating constraint with concrete evidence.
3. **Resolve** — Explain the service, agent, or workflow as a sequence of work.
4. **Prove** — Show current status, boundaries, evidence, controls, and outcomes.
5. **Advance** — Present one clear next action.

## Product model

### Agents

JasonAI is the current B2W product. Future specialized agents are labeled as planned rather than presented as available products.

### Workflows

The product workflow model is:

```text
Source → Context → Transformation → Review → Action
```

The prototype separates:

- Available now
- In development
- Future

### Pricing

The pricing page shows:

- JasonAI Standard: `$99/month` and `$2,000 setup`
- Early access: `$25/month for year one` and setup waived

Early-access terms are presented as limited participation rather than the default commercial price.

## Implementation files

- `src/content/unifiedPrototype.ts`
- `src/components/prototype/UnifiedSiteShell.tsx`
- `src/pages/prototype/UnifiedStructurePages.tsx`
- `src/pages/prototype/UnifiedPrototypePages.tsx`
- `src/pages/prototype/UnifiedPrototypeRouterPage.tsx`
- `src/App.tsx`

The prototype also reuses:

- `src/content/workspaceBrandSystem.ts`
- `src/components/Seo.tsx`
- Existing Motion, Tailwind, Lucide, and React Router dependencies

## Review order

1. Open `/prototype` and verify the overall company positioning.
2. Test the header, Products dropdown, Search, Contact action, and mobile menu.
3. Confirm Services, Products, and Resources feel like one B2W system.
4. Review Agents for correct current-versus-planned positioning.
5. Review Workflows for capability accuracy.
6. Review Pricing for correct commercial framing.
7. Review About and Contact for completeness.
8. Review `/workspace` for design-system and component consistency.
9. Decide which sections should replace the live routes.

## Migration after approval

1. Move `/prototype` to `/`.
2. Move `/prototype/services` to `/services`.
3. Move `/prototype/products` and its subroutes to `/products`.
4. Redirect or integrate the current `/jasonai` routes into Products while preserving pricing, questions, and privacy content.
5. Move `/prototype/resources` to `/resources`.
6. Decide whether `/clara` remains a demonstration or becomes a resource-detail route.
7. Move `/prototype/about` and `/prototype/contact` to their public routes.
8. Preserve legacy redirects and confirm SEO metadata.
9. Run type checking, build validation, responsive review, route testing, and accessibility checks.
