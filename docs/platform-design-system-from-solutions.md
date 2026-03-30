# Platform Design System

Derived from the current Solutions experience in:

- [src/pages/solutions/SolutionsLandingPage.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/solutions/SolutionsLandingPage.tsx)
- [src/pages/solutions/SolutionTemplatePage.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/pages/solutions/SolutionTemplatePage.tsx)
- [src/components/solutions/SolutionsNavbar.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/solutions/SolutionsNavbar.tsx)
- [src/components/solutions/AiDemoPanel.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/solutions/AiDemoPanel.tsx)

## 1. Design Intent

The Solutions page already establishes the correct tone for the platform:

- cinematic, not corporate-flat
- technical, but still premium
- dark-first with luminous accents
- dense with information, but staged in clear modules
- animated in meaningful ways, not decorative noise

The platform should inherit that language and shift it from marketing storytelling into an operational product system.

## 2. Core Principles

### 2.1 Cinematic Utility

Interfaces should feel high-value and intentional, but every visual effect must support hierarchy, focus, or state.

### 2.2 Layered Surfaces

The Solutions page uses stacked panels, blur, glow, and gradient cards. The platform should use those same layers to separate:

- global navigation
- active workspace
- supporting context
- action trays
- modal and approval layers

### 2.3 AI Is Visible, Not Abstract

The product should show:

- what the system is doing
- which mode it is in
- which output is being produced
- when review is required

Do not hide AI state behind generic UI chrome.

### 2.4 One System, Different Densities

Desktop, tablet, and mobile should share the same visual DNA while changing:

- information density
- navigation treatment
- interaction sequencing
- panel stacking

## 3. Brand Translation

The Solutions page uses a dark graphite base with cool spectral highlights. For the platform, keep the same family but assign clearer product roles.

### 3.1 Foundation Palette

- `bg-canvas`: `#080a0f`
- `bg-section`: `#0d1116`
- `bg-panel`: `rgba(12,16,24,0.70)`
- `bg-panel-strong`: `linear-gradient(180deg, rgba(18,24,34,0.86) 0%, rgba(11,16,22,0.88) 100%)`
- `bg-panel-light`: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(239,245,255,0.92) 100%)`

### 3.2 Neutral Text Scale

- `text-primary`: `#ffffff`
- `text-secondary`: `rgb(212 212 212)` equivalent to `neutral-300/400`
- `text-tertiary`: `rgb(115 115 115)` equivalent to `neutral-500`
- `text-inverse`: `#0a0f14`

### 3.3 Accent Roles

These are already present on Solutions and should become semantic product colors:

- `accent-info`: Sky blue
  Use for chat flow, intelligence, input state, and active processing.
- `accent-success`: Teal
  Use for system confirmations, resolved context, approved actions, and live AI readiness.
- `accent-strategy`: Purple
  Use for modeling, reasoning depth, forecasts, and advanced analysis.
- `accent-warning`: Amber
  Use for approval-needed states, edge-case review, and risk emphasis.
- `accent-critical`: Red
  Use only for live alerts, failures, or blocked states.

## 4. Typography System

The Solutions page uses aggressive tracking, tight headlines, and clean sans serif utility text. The platform should preserve this.

### 4.1 Type Roles

- Display headline:
  Large, compressed-feeling, tight tracking, high contrast.
  Use for workspace titles and major screen headers.
- Section heading:
  Large but calmer than display.
  Use for modules and major panels.
- Utility label:
  Small uppercase with high letter spacing.
  Use for metadata, categories, panel labels, and status headers.
- Body:
  Clean sans serif, medium line-height, neutral contrast.
  Use for explanation, summaries, and descriptions.
- Data text:
  Tighter and more compact for tables, metrics, and structured outputs.

### 4.2 Style Rules

- Headlines should use negative letter spacing and strong vertical rhythm.
- Eyebrows should use uppercase and high tracking consistently.
- Product screens should never look essay-like; keep paragraphs short.
- Dense information should be separated with spacing and panel structure, not tiny text.

## 5. Spacing and Layout

The Solutions pages rely on large section spacing and contained panels. The platform should preserve that composure while tightening for operational use.

### 5.1 Spacing Scale

- `4`: micro spacing inside pills and labels
- `8`: compact internal spacing
- `12`: small card spacing
- `16`: default control spacing
- `24`: module padding
- `32`: major card padding
- `48`: section separation
- `72+`: page-level spacing

### 5.2 Grid Model

- Desktop:
  12-column grid with asymmetric composition.
  Main workspace should dominate; supporting panels should feel secondary but persistent.
- Tablet:
  8-column grid with stacked primary/secondary zones.
- Mobile:
  single-column stack with sticky navigation and condensed panels.

### 5.3 Surface Shapes

The Solutions page already favors large radii. Keep that.

- hero or major shell: `rounded-[32px]`
- standard panel: `rounded-[24px]` to `rounded-[30px]`
- small utility tile: `rounded-[16px]` to `rounded-[22px]`
- chip and pill: full pill radius

## 6. Surface System

The platform should use four surface levels.

### 6.1 Surface 0: Canvas

Dark global background with subtle radial lighting and faint grid or atmospheric glow.

### 6.2 Surface 1: Section Band

Used for full-width zones such as workspace region changes or major content blocks.

### 6.3 Surface 2: Primary Panel

Used for command center, model canvas, deliverables editor, and key working surfaces.

### 6.4 Surface 3: Utility Layer

Used for metric tiles, status cards, small forms, filters, and sidebar modules.

### 6.5 Borders and Elevation

Match Solutions:

- use soft white-alpha borders
- use blur for premium depth
- use shadow to separate interactive planes
- never use heavy dark borders or flat gray boxes

## 7. Motion System

Solutions already uses motion well: soft float, staged reveals, blur-backed transitions, and continuous ambient animation.

### 7.1 Motion Principles

- motion should clarify state change
- major transitions should feel smooth and physical
- background motion should remain slow and atmospheric
- interaction motion should be brief and decisive

### 7.2 Motion Types

- ambient glow pulsing
- panel float on hero or preview surfaces
- staged message reveal for AI interactions
- hover lift on cards
- section handoff transitions
- progress shimmer for active generation

### 7.3 Timing

- hover and tap feedback: `120ms` to `180ms`
- card reveal: `300ms` to `500ms`
- staged sequences: `150ms` to `350ms` offsets
- ambient loops: `5s` to `8s`

### 7.4 Reduced Motion

All ambient float, shimmer, and repeated glow should collapse cleanly under `prefers-reduced-motion`.

## 8. Navigation System

Use the Solutions navbar as the base reference.

### 8.1 Top Navigation

Should be:

- fixed
- translucent
- bordered lightly
- blurred
- compact but premium

For the platform, top navigation should contain:

- workspace switcher or logo
- current client/workspace
- main modules
- live AI mode indicator
- account or admin entry

### 8.2 Secondary Navigation

Use horizontally scrollable tabs on smaller screens. On desktop, use sidebar or segmented top-subnav depending on module complexity.

### 8.3 Mobile Navigation

Should feel like a compact operations dock:

- sticky bottom or compact top tab row
- icon + short label
- clear active state

## 9. Component Library

### 9.1 Buttons

Button families should include:

- Primary:
  bright contrast, white or light fill on dark surface
- Secondary:
  ghost or soft-outline
- Tertiary:
  text-only utility action
- State button:
  colored by semantic purpose, for example review, run, approved

Buttons should use pill or softened rounded shapes, not sharp rectangles.

### 9.2 Chips and Pills

The Solutions page uses pill treatment well. Reuse it for:

- reasoning mode
- model family
- workspace status
- approval state
- client personality

### 9.3 Cards

Cards are the main structural unit. Each card should support:

- eyebrow
- title
- short explanation
- optional metric, action, or status

### 9.4 Data Tiles

Use the stat-tile approach from [AiDemoPanel.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/solutions/AiDemoPanel.tsx) for:

- metrics
- outputs
- pricing summaries
- model assumptions
- system health

### 9.5 Chat Bubbles

Use asymmetric message bubbles derived from the demo panel:

- AI messages on the left, darker or accented
- user messages on the right, lighter or contrast-shifted
- metadata above messages where needed

### 9.6 Tables

Tables should inherit the light-card contrast seen in the financial model demo:

- clear row separation
- compact headers
- strong emphasis on modeled result columns
- no spreadsheet-style dense borders

### 9.7 Input Controls

Sliders, toggles, and selectors should feel native to the visual system:

- rounded rails
- color-accented active track
- generous padding
- clear value readout

### 9.8 Status Modules

Every status block should expose:

- label
- current state
- implication
- next action

Avoid vague badges with no explanation.

## 10. Screen-Level Patterns

### 10.1 Command Center

Layout:

- main conversation pane
- active context rail
- task/output tray

Visual emphasis:

- live conversational timeline
- active model and reasoning chip
- clear “what happens next” panels

### 10.2 Modeling Workspace

Layout:

- assumption controls
- chart or table region
- recommendation rail

Visual emphasis:

- purple/teal analytical accenting
- structured contrast between editable inputs and computed outputs
- calm density rather than flashy animation

### 10.3 Deliverables Workspace

Layout:

- document canvas
- output structure sidebar
- approval and export controls

Visual emphasis:

- crisp hierarchy
- light document-like surfaces inside dark application frame
- clear versioning and review state

### 10.4 Use-Case Library

Layout:

- searchable catalog
- category filter chips
- policy detail panel

Visual emphasis:

- systematic rather than expressive
- use chips, rows, and utility cards
- make routing logic legible

### 10.5 Settings and Admin

Layout:

- grouped controls
- provider policy sections
- permission matrix

Visual emphasis:

- subdued
- legible
- governance-first

## 11. Content Style

The Solutions page copy is direct and high-signal. Preserve that.

### 11.1 Voice

- precise
- non-generic
- commercially literate
- concise

### 11.2 Rules

- do not use vague AI marketing language
- write labels as operators would understand them
- explain outputs in terms of business action
- make system state explicit

## 12. Responsive Rules

### 12.1 Desktop

- maintain asymmetric compositions
- keep persistent side context visible
- prioritize multi-panel workflows

### 12.2 Tablet

- collapse sidebars into stacked cards
- preserve review and approval utility
- keep chart and document reading comfortable

### 12.3 Mobile

- one primary action path per screen
- sticky status and navigation
- transform large data modules into cards, accordions, or horizontal snaps

## 13. Do / Don’t

### Do

- use blur, gradients, and glow sparingly but intentionally
- keep radius generous
- use semantic accent colors consistently
- make AI routing and reasoning visible
- preserve strong hierarchy between primary and secondary panels

### Don’t

- flatten the product into generic dashboard gray
- use purple as a default accent everywhere
- overload every panel with animation
- hide state behind minimal badges
- make mobile just a shrunken desktop

## 14. Recommended Token Set

### Color Tokens

- `--platform-bg-canvas`
- `--platform-bg-section`
- `--platform-bg-panel`
- `--platform-bg-panel-strong`
- `--platform-bg-panel-light`
- `--platform-border-soft`
- `--platform-text-primary`
- `--platform-text-secondary`
- `--platform-text-tertiary`
- `--platform-accent-info`
- `--platform-accent-success`
- `--platform-accent-strategy`
- `--platform-accent-warning`
- `--platform-accent-critical`

### Radius Tokens

- `--platform-radius-sm: 16px`
- `--platform-radius-md: 22px`
- `--platform-radius-lg: 30px`
- `--platform-radius-xl: 32px`

### Shadow Tokens

- `--platform-shadow-soft`
- `--platform-shadow-panel`
- `--platform-shadow-float`

### Motion Tokens

- `--platform-duration-fast: 140ms`
- `--platform-duration-base: 220ms`
- `--platform-duration-slow: 420ms`
- `--platform-duration-ambient: 6s`

## 15. Implementation Direction

If this system is turned into code, it should be implemented in this order:

1. Design tokens
2. Surface primitives
3. Typography primitives
4. Navigation and shell
5. Card, tile, chip, and button components
6. Chat, table, and model-specific components
7. Screen templates for command, modeling, deliverables, library, and settings

## 16. Summary

The correct platform design system is not a new visual language. It is the Solutions language converted from marketing composition into operational software.

That means:

- same dark premium atmosphere
- same luminous accent logic
- same rounded, layered panels
- same strong typography hierarchy
- more explicit status
- more systematic component behavior
- tighter responsive rules for real workflow usage
