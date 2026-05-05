# Kmacho Homepage SSG + i18n Design

**Date:** 2026-04-21  
**Scope:** V1 homepage only (hero section), bilingual EN/ES, static deploy on Apache  
**Status:** Design approved (pending implementation planning)

## 1. Goal

Build a Nuxt-based static website (no Node server in production) with:
- English as primary homepage at `/`
- Spanish version at `/es`
- i18n content sourced from local JSON files
- SEO-ready metadata and language alternates for both locales

V1 is intentionally minimal:
- Only one section: hero
- One CTA button: `Request a Quote`
- Temporary CTA destination: `#`

## 2. Non-Goals (V1)

- No additional pages (`/services`, `/cases`, etc.)
- No contact form
- No external scheduling integration
- No CMS
- No dynamic backend

## 3. Architecture

### 3.1 Runtime and Deployment Model

- Framework: Nuxt 3
- Build target: fully static output (SSG)
- Deploy target: Apache serving generated static files
- Production runtime: no Node process required

### 3.2 Internationalization

- Locale strategy:
  - `en` default at `/`
  - `es` at `/es`
- Content source:
  - JSON translation files per locale (e.g. `en.json`, `es.json`)
- UI:
  - Single reusable hero component reading translation keys

### 3.3 SEO Model

Per locale, provide:
- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `<link rel="alternate" hreflang="en">`
- `<link rel="alternate" hreflang="es">`
- `<link rel="alternate" hreflang="x-default">` pointing to `/`

Canonical policy:
- EN page canonical: `/`
- ES page canonical: `/es`

## 4. Information Architecture (V1)

- `/` -> English homepage with hero
- `/es` -> Spanish homepage with hero

Both routes share:
- same visual structure
- locale-specific text and metadata

## 5. Hero Content Contract

Define a minimal translation schema for hero:
- eyebrow (optional)
- headline
- supporting text
- primary CTA label
- primary CTA href

V1 CTA:
- label: `Request a Quote` (EN)
- localized Spanish equivalent for `/es`
- href: `#`

## 6. Technical Design Details

### 6.1 Static Generation

- Use Nuxt static generation command to pre-render:
  - `/`
  - `/es`
- Output folder must be directly deployable to Apache document root.

### 6.2 Apache Compatibility

Primary assumption:
- Apache likely supports rewrite, but uncertain.

Design decision:
- Prioritize build output and routing setup that works with standard static hosting.
- Keep route set minimal in V1 to reduce rewrite dependency risk.

### 6.3 Extensibility

Design must be ready to scale to future pages with no i18n/SEO redesign:
- add pages per locale incrementally
- reuse metadata and translation patterns

## 7. Error Handling and Fallbacks

- If translation key is missing:
  - fail fast in development (visible warning/error)
  - do not silently ship broken content in production build
- If user navigates to unknown route:
  - default Nuxt static not-found behavior

## 8. Validation and Acceptance Criteria

### 8.1 Functional

1. Opening `/` shows English hero.
2. Opening `/es` shows Spanish hero.
3. CTA appears in both locales and points to `#`.

### 8.2 SEO

1. EN page has locale-appropriate title and description.
2. ES page has locale-appropriate title and description.
3. Both pages expose canonical and hreflang links correctly.
4. `x-default` points to `/`.

### 8.3 Build/Deploy

1. Static build completes without errors.
2. Generated output can be served by Apache as static files.
3. `/` and `/es` render correctly in deployed environment.

## 9. Testing Strategy (V1)

- Build verification:
  - run static generation and confirm output exists
- Route checks:
  - verify `/` and `/es` content language correctness
- Metadata checks:
  - inspect generated HTML for title/description/canonical/hreflang
- Basic performance sanity:
  - ensure minimal hero page ships lightweight assets

## 10. Risks and Mitigations

Risk 1:
- Apache rewrite capability is not fully confirmed.
Mitigation:
- keep route footprint minimal and validate `/es` behavior on staging early.

Risk 2:
- Locale metadata misconfiguration (common SEO issue).
Mitigation:
- explicit acceptance checks for canonical/hreflang on both routes.

Risk 3:
- Future growth introduces inconsistent translation keys.
Mitigation:
- establish translation key contract from V1 and enforce in reviews.

## 11. Implementation Readiness

This scope is intentionally small and ready for planning:
- one page structure
- two locales
- static generation
- foundational SEO

Next step after user review:
- create implementation plan with task-by-task breakdown.

