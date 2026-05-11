# Complete Site Audit Report

Date: 2026-05-11  
Project: Kmacho Technology website  
Scope: full static review of architecture, rendering behavior, CSS structure, i18n coverage, technical debt, refactor candidates, performance risks, and production-readiness issues.

## Executive Summary

The site is already in a workable state:

- clear section-based composition
- strong token-driven visual system
- consistent overall brand direction
- broad i18n coverage for main marketing copy
- successful static build pipeline

The main problems are not visual. They are operational:

- too much imperative animation logic concentrated in a few large files
- still-present placeholder or non-functional links
- some user-facing text is still hardcoded outside the locale JSON files
- duplicated or expensive visual effects
- several sections are tightly coupled to selector-based global animation orchestration
- some current components are difficult to scale cleanly if the site grows beyond a single homepage

The site does **not** need a redesign. It needs cleanup, normalization, and a small set of structural refactors while preserving the current layout and visual language.

## Overall Evaluation

### Current strengths

- Good high-level content structure for a single-page marketing site.
- Strong use of design tokens in `app/assets/css/tokens.css`.
- Good section modularity in `app/components/sections/`.
- Main content is mostly centralized in `locales/en.json` and `locales/es.json`.
- Nuxt static generation and i18n route setup are already in place.
- The current visual system is coherent enough to scale if the implementation layer is cleaned up.

### Current weaknesses

- Animation and rendering complexity is higher than the current site size justifies.
- Some functionality still reads like prototype code instead of production code.
- Several areas are highly coupled to direct DOM selectors and body class toggling.
- A few UX and accessibility details remain unresolved.
- Legal/footer/navigation behavior is still incomplete.
- The site is structurally prepared for “one homepage”, but not yet organized for easy future expansion.

## Functional Site Review

### What is functioning well

- The site renders as a modular landing page with clearly separated sections.
- Hero, services, solutions, process, fit, CTA, nav, and footer are already isolated into components.
- Locale-driven copy works for the major top-level sections.
- Static build works and the app is shippable in its current broad shape.
- The visual system is consistent enough that later cleanup can be incremental instead of destructive.

### What is functioning but fragile

- Scroll-based entrance animations and dark-zone transitions.
- Canvas-based hero background.
- Noise overlays and preload animation layers.
- Three.js CTA background.
- Custom cursor behavior using blend-mode and surface annotations.

These areas work, but they are sensitive to markup changes, new sections, z-index changes, and future content expansion.

### What is functionally incomplete

- Footer legal items are not links.
- Some CTA/navigation links still point to `#`.
- There are no actual `terms` or `privacy` pages.
- Some accessibility labels are still hardcoded.

## Architecture Review

## 1. App composition

The site is currently organized around a single page:

- `app/pages/index.vue`
- section components in `app/components/sections/`
- shared layout in `app/components/layout/`
- shared UI in `app/components/ui/`
- shared animation logic in composables

This is workable for a homepage-first project, but there is a clear scaling boundary:

- the current structure is good for adding more sections
- it is less good for adding more pages with shared behavioral systems
- global animation logic will become harder to maintain as page count grows

### Recommendation

Keep the current component structure, but begin separating concerns more clearly:

- page composition stays in `app/pages/`
- rendering/animation primitives move toward focused composables
- section-specific logic should live closer to the section that owns it
- global behaviors should stop depending on fragile selectors when possible

## 2. Composables and animation orchestration

### `app/composables/useLandingAnimations.ts`

This file is a central orchestration hub for multiple sections, entrance states, and dark-zone transitions.

Benefits:

- easy to find the “main motion system”
- predictable one-file control over the homepage choreography

Risks:

- heavy selector dependency
- high coupling between DOM structure and animation behavior
- one file becomes responsible for too many unrelated sections
- difficult to extend safely when new sections appear

This is not yet a failure point, but it is a clear scalability debt item.

### Recommendation

Do not replace it immediately. Instead:

- split it gradually into section-owned animation hooks
- keep only truly global concerns in one file
- reduce the amount of selector-string choreography over time

## 3. Heavy rendering components

### `app/components/sections/FinalCtaBackground3D.vue`

This component is now one of the heaviest pieces in the codebase.

It currently combines:

- custom geometry generation
- scene setup
- material setup
- camera management
- recycle logic for the “infinite” road
- animation loop
- resize handling
- cleanup

This works, but it is too much responsibility in one component.

### Recommendation

Refactor later into:

- scene setup utilities
- road generation utilities
- animation/update loop
- technology/logo layer
- section wrapper component

The current version is acceptable for shipping, but it is not ideal for long-term maintainability.

## Technical Debt Inventory

## P1: Must fix

### 1. Footer legal items are not interactive

File:

- `app/components/layout/SiteFooter.vue`

Issue:

- `Terms and Conditions` and `Privacy Policy` are rendered as plain text spans.
- They visually imply navigation, but do nothing.

Impact:

- UX inconsistency
- accessibility ambiguity
- incomplete production readiness

### 2. Placeholder anchors still exist

Files:

- `app/components/layout/SiteNav.vue`
- `app/components/sections/FinalCtaSection.vue`

Issue:

- logo link still uses `href="#"`
- final CTA button still uses `href="#"`

Impact:

- broken navigation behavior
- conversion path not finalized
- signals unfinished implementation

### 3. Mojibake / encoding issue in footer

File:

- `app/components/layout/SiteFooter.vue`

Issue:

- separator renders as `Â·`

Impact:

- visible quality defect
- encoding inconsistency

## P2: Should fix

### 4. Duplicate/high-cost animated noise systems

Files:

- `app/components/ui/SiteNoiseOverlay.vue`
- `app/components/ui/SitePreload.vue`

Issue:

- the site contains more than one animated noise strategy
- at least one recalculates per-frame noise directly into canvas image data

Impact:

- unnecessary CPU usage
- avoidable rendering cost
- harder-to-reason-about layered visual behavior

### 5. Hero waves rendering cost is still high

Files:

- `app/components/hero/HeroWavesCanvas.vue`
- `app/composables/useHeroWaves.ts`

Issue:

- continuous RAF-driven animation
- repeated random noise regeneration
- decorative canvas is still performance-sensitive

Impact:

- battery/CPU cost
- potential jank on lower-end devices

### 6. Over-centralized selector-based motion system

File:

- `app/composables/useLandingAnimations.ts`

Issue:

- too much behavior is coordinated through DOM selectors and body classes

Impact:

- fragile scaling path
- future markup changes become risky

### 7. Large imperative Three.js implementation

File:

- `app/components/sections/FinalCtaBackground3D.vue`

Issue:

- too many responsibilities in one file

Impact:

- onboarding cost
- harder debugging
- harder future feature work

## P3: Cleanup later

### 8. Devtools still enabled in config

File:

- `nuxt.config.ts`

Issue:

- `devtools: { enabled: true }`

Impact:

- production config should be reviewed and explicitly separated from development defaults

### 9. Inter loaded via Google Fonts

File:

- `nuxt.config.ts`

Issue:

- external font dependency increases render dependency surface

Impact:

- performance and caching could be improved later

### 10. Static hero stats remain partly hardcoded

File:

- `app/components/hero/HeroStatsBar.vue`

Issue:

- labels come from i18n, but displayed numeric values remain in component code

Impact:

- content maintenance inconsistency

## Refactor Candidates

These are not mandatory today, but they are the highest-value structural refactors.

### 1. Break up `useLandingAnimations.ts`

Target:

- one global motion coordinator
- several section-level animation hooks

Why:

- lower coupling
- easier debugging
- easier scaling

### 2. Break up `FinalCtaBackground3D.vue`

Target:

- road generation
- camera/update loop
- material and color config
- logo cube layer
- component shell

Why:

- smaller cognitive surface
- easier iteration on the 3D effect

### 3. Normalize link ownership and routing strategy

Target:

- no visual link rendered unless destination exists
- all footer/legal items become real pages or are temporarily removed

Why:

- cleaner UX
- fewer placeholders in production

### 4. Move repeated interactive affordance rules toward a stricter contract

Target:

- `.interactive` only on actually interactive elements
- surface-based cursor annotations documented and minimized

Why:

- less ambiguity
- more predictable cursor behavior

### 5. Normalize content ownership

Target:

- marketing copy in locale JSON
- simulated preview/demo strings either:
  - also in locale JSON, or
  - explicitly documented as non-localized preview strings

Why:

- content operations become easier later

## i18n and Copy Audit

## What is already good

- major marketing copy is already in `locales/en.json` and `locales/es.json`
- CTA content is locale-driven
- section headings/subtitles are mostly structured correctly

## Text still outside JSON

### Hardcoded top-level UX strings

Files:

- `app/components/layout/SiteNav.vue`
  - `aria-label="Kmacho"`
- `app/components/layout/SiteFooter.vue`
  - `aria-label="Footer legal links"`
- `app/components/hero/HeroTagStrip.vue`
  - `aria-label="Hero tag"`

These should move to i18n or at least a shared constants layer.

### Hardcoded preview/demo strings

Files:

- `app/components/sections/Solutions-animations/CustomSoftwarePreview.vue`
- `app/components/sections/Solutions-animations/IoTPreview.vue`
- `app/components/sections/Solutions-animations/UXUIDesignPreview.vue`
- `app/components/sections/Solutions-animations/AISolutionsPreview.vue`
- `app/components/sections/MarketGapVenn.vue`

Examples:

- `VALIDATE`
- `TRANSFORM`
- `PERSIST`
- `order / KM-2847`
- `TEMP`
- `NRGY`
- `FLOW`
- `RELAY 01`
- `homepage.fig`
- `ai-chat.tsx`
- `K'MACHO`

These are understandable as visual/demo artifacts. The question is not whether they are “wrong”, but whether they are intentionally exempt from localization. Right now that boundary is undocumented.

### Recommendation

Split audit remediation into two buckets:

1. must-localize
   - navigation
   - labels
   - CTA copy
   - accessibility strings

2. optionally-localize
   - simulated preview artifacts
   - internal code-like labels
   - mock telemetry strings

## CSS and Style System Review

## Strengths

- token-driven structure is already strong
- `global.css` and component CSS are conceptually separated
- a style architecture document already exists in `docs/technical/site-structure-and-style-architecture.md`
- the site generally preserves consistent spacing and border language

## Risks and cleanup opportunities

### 1. Too many layered visual systems

Current site includes:

- hero canvas waves
- site-wide or section-wide noise
- preload effect
- custom cursor blend behavior
- square-grid background treatment
- Three.js CTA background

This can still work visually, but it is easy for these layers to start fighting each other over:

- performance
- contrast
- z-index
- perceived noise

### 2. Styles appear cohesive, but behavior is sometimes carried by CSS assumptions

Examples:

- cursor relies on `data-cursor-surface`
- dark zone relies on body class mutation
- several transitions depend on surface/background interplay rather than explicit ownership

This is a valid design system direction, but it should be documented more aggressively if the site is going to scale.

### 3. Candidate cleanup areas

Not all of these are necessarily “unused”, but they should be reviewed:

- overlapping visual effect layers
- one-off component-specific utility rules that might belong in global primitives
- any selector rules created only to support temporary experiments

The current audit does **not** claim dead CSS with certainty. It flags these as review candidates because the site has gone through many micro-adjustments and some style drift is likely.

## Accessibility Review

## Positive

- the site already considers motion preferences in several places
- section content is structurally understandable
- many visible texts have sufficient hierarchy

## Issues

### 1. Decorative canvas should be explicitly hidden from assistive tech

File:

- `app/components/hero/HeroWavesCanvas.vue`

Issue:

- decorative canvas should carry explicit decorative semantics

### 2. Footer legal items are non-links

Already covered above, but also an accessibility issue.

### 3. Placeholder anchors

Already covered above, but also an accessibility issue because they advertise navigation without destination.

### 4. Accessibility strings not yet localized

Files:

- `SiteNav.vue`
- `SiteFooter.vue`
- `HeroTagStrip.vue`

These are low-cost cleanup items with high long-term consistency value.

## Performance Review

## Main risks

### 1. `SiteNoiseOverlay.vue`

- animated canvas noise
- per-frame image generation
- global presence

### 2. `useHeroWaves.ts`

- continuous render loop
- random/noise regeneration
- hero-specific decorative cost

### 3. `FinalCtaBackground3D.vue`

- WebGL scene at the end of the page
- dynamic update loop
- geometry/material work that is heavier than ordinary DOM/CSS

### 4. Build warnings worth addressing

Known signals from build:

- duplicate `useAppConfig` imports
- unresolved favicon path warning
- large bundle chunks over 500 kB
- timing label warnings around Nuxt/i18n lifecycle

None of these currently block shipping, but they should not be ignored.

## Recommendation

Performance cleanup should be staged:

1. normalize noise strategy
2. reduce hero wave cost
3. review CTA 3D render budget and device fallbacks
4. inspect chunk splitting / asset loading

## Scalability and Future Organization

The current site is still fundamentally a homepage project.

That is fine today. It becomes a problem later if you want:

- legal pages
- case studies
- service detail pages
- solution detail pages
- blog/resources
- reusable section templates

### Current blockers to smooth scaling

- only one page exists in `app/pages/`
- footer/legal structure is not route-ready
- animation logic assumes one long page composition
- content ownership is still partly mixed between JSON and component markup

### Recommendation

Without changing current UI, prepare the site for growth with:

- route-ready footer and nav
- stricter content ownership rules
- smaller behavior modules
- optional content schema for services/solutions if those expand into detail pages later

## Production-Readiness Review

Before considering the site “clean” and stable, the following should be completed:

### Must

- replace or remove all `href="#"`
- make footer legal items real links or remove them
- fix encoding issue in footer separator
- audit decorative canvases for accessibility

### Should

- review and reduce animation/rendering overhead
- split heavy logic files
- move remaining UX strings to i18n
- review build warnings

### Nice to have

- self-host fonts
- formalize preview-string localization policy
- add page-level structure for future legal/service/solution pages

## Suggested Repair Plan

This plan preserves the current structure and current visual style.

### Phase 1: Functional cleanup

- fix placeholder links
- fix footer legal structure
- fix encoding issues
- fix decorative accessibility semantics
- normalize non-localized accessibility strings

### Phase 2: Performance cleanup

- reduce site noise overhead
- review hero waves render cost
- inspect CTA 3D budget and fallback behavior
- address build warnings

### Phase 3: Structural refactor

- split `useLandingAnimations.ts`
- split `FinalCtaBackground3D.vue`
- document cursor/surface rules
- document visual effect ownership

### Phase 4: Content and scaling cleanup

- inventory all remaining hardcoded strings
- define preview-string localization policy
- prepare footer/nav for future legal and detail pages

## Recommended Priorities

### Highest priority

1. footer legal links
2. placeholder anchors
3. accessibility semantics for decorative elements
4. encoding issue in footer

### Medium priority

1. animated noise cleanup
2. hero wave optimization
3. landing animation modularization
4. final CTA 3D refactor

### Lower priority

1. font delivery strategy
2. stats content normalization
3. preview string localization policy

## Final Assessment

This site is not structurally broken. It is in the normal state of a visually ambitious homepage that has accumulated implementation debt while being refined quickly.

The right strategy is **not** to redesign it.

The right strategy is:

- preserve the current visual system
- remove incomplete functionality
- reduce rendering overhead
- normalize i18n and link ownership
- modularize the heaviest behavioral files

If that is done carefully, the site can remain visually the same while becoming significantly cleaner, easier to scale, and cheaper to maintain.
