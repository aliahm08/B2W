# B2W Workspace Brand System

**Version:** 1.0  
**Status:** Working system  
**Prototype route:** `/workspace`  
**Source:** The current B2W repository, including the Operating Map, internal portal, Services, JasonAI, Clara, the shared website navigation, and page footers.

## 1. Purpose

The B2W Workspace is the parent system for how the company looks, sounds, organizes information, demonstrates products, and guides users toward decisions.

It is not a new visual identity placed over the existing website. It is a synthesis of the strongest parts already present in the repository:

| Source | Repository location | Role in the unified system |
|---|---|---|
| Operating Map | `/internal/services` | Executive flow, numbered progression, evidence, gates, ownership, and tracking |
| Product direction | `/internal/portal` | Workspace UI, current-state orientation, metrics, updates, status, and role-aware views |
| Services | `/services` | Public offer organization and service taxonomy |
| Product | `/jasonai` | Customer narrative, problem tension, trust, objections, and conversion |
| Resources | `/clara` | Progressive interaction, guided demonstrations, motion, and user participation |
| Website shell | `/`, shared headers, shared footers | Parent brand, navigation behavior, product relationships, and restrained actions |

## 2. Brand promise

> Make business complexity clear enough to act on.

B2W should feel like an experienced operator has entered a complex situation, identified the important condition, organized the evidence, and made the next decision understandable.

The design is not primarily expressive. Its value comes from hierarchy, pacing, state, evidence, and clear action.

## 3. Brand character

B2W is:

- **Clear:** The point is visible on the first read.
- **Grounded:** Claims are tied to real work, current capability, or evidence.
- **Operational:** Content explains how work moves, where it is blocked, and what happens next.
- **Human:** Technology is described through the people and work it supports.
- **Decisive:** Important pages lead to one primary action.

B2W is not vague, futuristic, theatrical, overly technical, or inflated.

## 4. Design principles

### 4.1 Clarity is the visual brand

Use strong hierarchy, controlled spacing, readable measures, visible borders, and meaningful contrast. Decoration should not carry the burden of explaining the page.

### 4.2 The interface behaves like an operating system

Every page should answer:

1. Where am I?
2. What is the current condition?
3. What evidence supports it?
4. What can I do next?

This applies to marketing pages as much as dashboards.

### 4.3 Products have accents, not separate identities

JasonAI and Clara retain recognisable accents and interaction patterns, but they live inside the B2W parent structure.

The following remain consistent across contexts:

- Page width and spacing logic
- Typography hierarchy
- Status language
- Evidence patterns
- Header and footer behavior
- Content progression
- Accessibility and motion rules

### 4.4 Motion explains change

Motion may reveal:

- Sequence
- Progress
- State changes
- Transformation from input to output
- Cause and effect

Motion should not be added only to make a page feel active. Continuous motion is reserved for live state, recording, progress, or another condition that is actually changing.

## 5. Visual foundation

### 5.1 Core palette

| Token | Value | Use |
|---|---:|---|
| Canvas | `#FAFAF8` | Primary workspace and long-form background |
| Paper | `#FFFFFF` | Cards, documents, forms, and overlays |
| Ink | `#111111` | Primary text, dark panels, and decisive actions |
| Line | `#E5E5E5` | Borders, rules, table divisions, and structure |
| Active | `#4F7F52` | Healthy progress, active work, completion, and positive evidence |
| Gate | `#D8B536` | Pending decisions, dependencies, review points, and approvals |
| Risk | `#C63D2F` | Blockers, exceptions, risks, and destructive actions |
| JasonAI | `#B24A24` | JasonAI highlights and product-specific actions |
| Clara | `#A66589` | Guided resources, voice workflows, and Clara-specific interactions |

### 5.2 Color rules

1. Canvas, Paper, Ink, and Line create the base interface.
2. Active, Gate, and Risk communicate real status. They are not decorative category colors.
3. JasonAI and Clara accents should appear only when the content is explicitly product-specific.
4. Do not mix both product accents in a single local component unless comparing products.
5. Avoid adding new accent colors when hierarchy, typography, spacing, or status can communicate the distinction.

### 5.3 Typography

The existing repository uses Inter as the primary family. The workspace formalizes its roles:

- **Display:** Medium weight, compressed line height, negative tracking. Used for major statements and section titles.
- **Body:** Regular weight, generous line height, restricted readable width.
- **Interface:** Medium or semibold for actions, navigation, and concise labels.
- **System label:** Small uppercase text with controlled tracking.
- **Monospace:** Dates, phases, counts, metrics, status indexes, and machine-like metadata.

Display typography should feel editorial and decisive without becoming luxurious or ornamental.

## 6. Voice system

### 6.1 Voice statement

B2W speaks like an experienced operator: calm under pressure, specific about the work, and direct about the next decision.

### 6.2 Writing rules

1. Lead with the business condition, decision, or result.
2. Use concrete nouns and active verbs.
3. Separate what exists now from what is planned next.
4. Explain technology through the work it improves.
5. End important sections with one clear next action.

### 6.3 Avoid

- Generic transformation language
- Unqualified AI claims
- Long setup before the point
- Multiple competing calls to action
- Product language that ignores the operator
- Claims that combine current and future capability

### 6.4 Examples

**Avoid**

> We leverage cutting-edge AI to transform your business operations.

**Use**

> We find the operating constraint, build the right system, and make the result measurable.

**Avoid**

> JasonAI automates your entire workflow using advanced intelligence.

**Use**

> JasonAI can search approved job communication and turn long threads into a concise summary. Action extraction is still in development.

## 7. Content architecture

Use the following default journey for public pages, product pages, resources, guides, and major internal documents.

### 7.1 Orient

State who the page is for, what condition exists, and why the user should continue.

### 7.2 Diagnose

Show the operating problem through concrete situations, evidence, or friction.

### 7.3 Resolve

Explain the service, product, or system as a sequence of work rather than a feature list.

### 7.4 Prove

Use examples, current status, metrics, source links, privacy controls, objections, and current-versus-planned labels.

### 7.5 Advance

Offer one primary next action and one lower-emphasis alternative only when necessary.

## 8. How the six source areas combine

### Design

- **Production quality:** Operating Map
- **Business-plan flow:** Operating Map
- **Workspace UI:** Internal portal and shared site shell
- **Status language:** Internal portal
- **Product accents:** JasonAI and Clara
- **Header and footer discipline:** Existing shared and product-specific page shells

### Content

- **Organization:** Services
- **Narrative:** JasonAI
- **Engagement:** Clara
- **Animation:** Clara and existing Motion implementations
- **User journey:** Clara, adapted to the five-stage B2W content model
- **Trust and evidence:** JasonAI and Operating Map

## 9. Reusable components

The working implementation lives in:

```text
src/components/workspace/WorkspaceComponents.tsx
src/content/workspaceBrandSystem.ts
```

### WorkspaceShell

Provides the parent canvas, shared workspace header, shared workspace footer, and CSS-variable context.

Use it for:

- Guides
- Resource libraries
- Internal tools
- Client portals
- Documentation
- Design references

### WorkspaceSection

Provides consistent section labeling, titles, descriptions, width, spacing, and reveal behavior.

Use it for major page chapters. Do not use it for every small component group.

### WorkspaceButton

Provides four controlled action treatments:

- `primary`
- `secondary`
- `jason`
- `clara`

A page should normally contain one visually dominant primary action.

### WorkspaceStatusPill

Provides shared state language:

- Active
- Complete
- At gate
- Blocked
- Planned

Do not replace these labels with vague terms such as “processing,” “maybe,” or “coming along.”

### WorkspaceMetricCard

Pairs a number with status and interpretation. A number should not appear without enough context to understand why it matters.

### WorkspaceJourney

Provides the progressive five-step content structure. It may be used for:

- Product demonstrations
- Service delivery explanations
- Onboarding
- Resource experiences
- Internal processes

## 10. Implementation example

```tsx
import {
  WorkspaceShell,
  WorkspaceSection,
  WorkspaceButton,
} from '../components/workspace/WorkspaceComponents';

export default function NewPage() {
  return (
    <WorkspaceShell>
      <WorkspaceSection
        eyebrow="01 / Current condition"
        title="Make the decision visible."
        description="Explain the operating condition and evidence."
      >
        <WorkspaceButton to="/contact">
          Take the next step
        </WorkspaceButton>
      </WorkspaceSection>
    </WorkspaceShell>
  );
}
```

## 11. Visual assets

The following assets are committed as native SVG files:

```text
public/brand/workspace/b2w-workspace-board.svg
public/brand/workspace/b2w-system-pattern.svg
```

### Workspace brand board

Use for:

- Design reviews
- Onboarding developers and content authors
- Presentation references
- Full-width workspace documentation
- Cropped visual references

### Operating system pattern

Use for:

- Page heroes
- Strategy documents
- Product architecture sections
- Resource covers
- Social or presentation backgrounds

Do not rasterize the assets unless the destination requires it. Preserve SVG whenever possible.

## 12. Header and footer rules

### Parent header

- B2W appears first.
- The current context may appear after a divider.
- Navigation remains concise.
- One action may receive visual emphasis.
- Header changes on scroll must communicate state or improve usability.

### Product header

- Product name may lead locally, but “by B2W” or a clear path to B2W remains visible.
- Product-specific actions use the product accent.
- The product header should not introduce an unrelated type, layout, or navigation system.

### Footer

- Keep the footer restrained.
- Show company identity, copyright, contact, and essential product or policy links.
- Do not convert the footer into a second sitemap unless the site architecture requires it.

## 13. Motion rules

Default motion values are exported from `workspaceBrandSystem.ts`.

- Fast: `0.2s`
- Standard: `0.35s`
- Reveal: `0.56s`
- Default easing: `[0.22, 1, 0.36, 1]`

Use opacity plus 8–20px movement for most reveals. Use layout animation when content changes size or priority. Preserve all functionality under reduced-motion settings.

## 14. Release checklist

Before deploying a page using the workspace system, verify:

- [ ] The page names the user and current condition.
- [ ] The primary action is visibly dominant.
- [ ] Current and planned capabilities are separated.
- [ ] Status colors communicate a real state.
- [ ] Motion explains sequence, progress, or transformation.
- [ ] Mobile behavior preserves the content journey.
- [ ] Reduced-motion behavior preserves every interaction.
- [ ] Evidence and trust information appear before conversion pressure.
- [ ] JasonAI and Clara accents are used only in their proper context.
- [ ] The header and footer preserve the B2W parent relationship.

## 15. Recommended next application

Apply the workspace in this order:

1. Shared website navigation and footer
2. Unified homepage
3. Services organization
4. JasonAI product page
5. Resources and guided demonstrations
6. Internal portal and Operating Map alignment
7. Secondary pages and client delivery templates

The workspace reference page should remain available during this process as the visual and implementation authority.
