# Kmacho Homepage SSG + i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 3 static homepage with EN at `/` and ES at `/es`, hero-only content from JSON translations, and SEO-ready metadata (`canonical` + `hreflang`) for Apache static hosting.

**Architecture:** Use Nuxt 3 in static generation mode with `@nuxtjs/i18n` configured for `prefix_except_default` routing. Keep V1 minimal (single hero page), and centralize content in locale JSON files. Add deterministic validation scripts that check generated HTML for locale routing and SEO tags.

**Tech Stack:** Nuxt 3, @nuxtjs/i18n, TypeScript config defaults, Node.js scripts, Apache static hosting.

---

## File Structure Plan

- `package.json`: scripts and dependencies.
- `nuxt.config.ts`: Nuxt + i18n + Nitro static preset + head defaults.
- `i18n.config.ts`: locale definitions and vue-i18n behavior.
- `locales/en.json`: English hero + SEO strings.
- `locales/es.json`: Spanish hero + SEO strings.
- `app.vue`: shell wrapper.
- `pages/index.vue`: localized hero section and SEO meta bindings.
- `scripts/validate-generated.mjs`: post-generate assertions on static HTML.
- `README.md`: build/deploy instructions for Apache static upload.

---

### Task 1: Scaffold Nuxt static project baseline

**Files:**
- Create: `package.json` (via scaffold command if not present)
- Create: `nuxt.config.ts`
- Create: `app.vue`
- Modify/Create: `.gitignore`

- [ ] **Step 1: Initialize Nuxt project files in current directory**

Run:
```bash
npx nuxi@latest init . --template minimal --packageManager npm --force --no-gitInit --no-install
```

Expected:
- Nuxt starter files are created in workspace root.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
npm install @nuxtjs/i18n
```

Expected:
- `node_modules` exists
- `package-lock.json` updated

- [ ] **Step 3: Configure static output in `nuxt.config.ts`**

Set file content to:
```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n'],
  nitro: {
    preset: 'static'
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'es', iso: 'es-ES', file: 'es.json' }
    ],
    langDir: 'locales',
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts'
  }
})
```

- [ ] **Step 4: Ensure root app shell exists**

Set `app.vue` to:
```vue
<template>
  <NuxtPage />
</template>
```

- [ ] **Step 5: Run dev server smoke check**

Run:
```bash
npm run dev
```

Expected:
- Local Nuxt server starts without config errors.

- [ ] **Step 6: Commit baseline scaffold**

Run:
```bash
git add .
git commit -m "chore: scaffold nuxt static baseline with i18n module"
```

Expected:
- Commit created (if repo is initialized).

---

### Task 2: Add locale JSON content and hero-only homepage

**Files:**
- Create: `i18n.config.ts`
- Create: `locales/en.json`
- Create: `locales/es.json`
- Create: `pages/index.vue`

- [ ] **Step 1: Add vue-i18n config**

Create `i18n.config.ts`:
```ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en'
}))
```

- [ ] **Step 2: Add English locale JSON**

Create `locales/en.json`:
```json
{
  "seo": {
    "title": "Kmacho Technology | Engineering & IT Strategy Partner",
    "description": "Premium, reliable, and innovative technology partner for custom software, UX, and IT strategy."
  },
  "hero": {
    "eyebrow": "Technology & Innovation",
    "headline": "Engineering and IT strategy for companies that need execution, not noise.",
    "supporting": "We design and implement high-impact technology solutions with phased delivery, QA, and continuous support.",
    "ctaLabel": "Request a Quote",
    "ctaHref": "#"
  }
}
```

- [ ] **Step 3: Add Spanish locale JSON**

Create `locales/es.json`:
```json
{
  "seo": {
    "title": "Kmacho Technology | Partner de Ingenieria y Estrategia IT",
    "description": "Partner tecnologico premium, confiable e innovador para software a medida, UX y estrategia IT."
  },
  "hero": {
    "eyebrow": "Tecnologia e Innovacion",
    "headline": "Ingenieria y estrategia IT para empresas que necesitan ejecucion, no ruido.",
    "supporting": "Disenamos e implementamos soluciones tecnologicas de alto impacto con ejecucion por fases, QA y soporte continuo.",
    "ctaLabel": "Solicitar Presupuesto",
    "ctaHref": "#"
  }
}
```

- [ ] **Step 4: Implement hero-only page with localized text**

Create `pages/index.vue`:
```vue
<script setup lang="ts">
const { t, locale } = useI18n()

const siteUrl = 'https://www.kmacho.net'
const currentPath = computed(() => (locale.value === 'en' ? '/' : '/es'))
const canonicalUrl = computed(() => `${siteUrl}${currentPath.value}`)

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description')
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/` },
    { rel: 'alternate', hreflang: 'es', href: `${siteUrl}/es` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` }
  ]
})
</script>

<template>
  <main class="hero">
    <section class="hero__container">
      <p class="hero__eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1 class="hero__headline">{{ t('hero.headline') }}</h1>
      <p class="hero__supporting">{{ t('hero.supporting') }}</p>
      <a class="hero__cta" :href="t('hero.ctaHref')">{{ t('hero.ctaLabel') }}</a>
    </section>
  </main>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8eef5 100%);
  color: #141413;
  padding: 2rem;
}

.hero__container {
  max-width: 56rem;
  text-align: left;
}

.hero__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4d5b6a;
}

.hero__headline {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.hero__supporting {
  margin: 0 0 1.5rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.5;
  color: #253443;
}

.hero__cta {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  background: #0f2740;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
}

.hero__cta:hover {
  background: #183755;
}
</style>
```

- [ ] **Step 5: Validate locale routes in dev**

Run:
```bash
npm run dev
```

Manual checks:
- `/` shows English hero and `Request a Quote`.
- `/es` shows Spanish hero and `Solicitar Presupuesto`.

- [ ] **Step 6: Commit hero and translations**

Run:
```bash
git add i18n.config.ts locales pages/index.vue
git commit -m "feat: add bilingual hero homepage with json locale content"
```

---

### Task 3: Add static generation + SEO verification script

**Files:**
- Create: `scripts/validate-generated.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add verification script file**

Create `scripts/validate-generated.mjs`:
```js
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const outDir = resolve('.output/public')
const enFile = resolve(outDir, 'index.html')
const esFile = resolve(outDir, 'es/index.html')

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
}

assert(existsSync(enFile), 'Missing generated EN file: .output/public/index.html')
assert(existsSync(esFile), 'Missing generated ES file: .output/public/es/index.html')

const enHtml = readFileSync(enFile, 'utf-8')
const esHtml = readFileSync(esFile, 'utf-8')

assert(enHtml.includes('Request a Quote'), 'EN hero CTA text not found')
assert(esHtml.includes('Solicitar Presupuesto'), 'ES hero CTA text not found')

assert(enHtml.includes('hreflang="en"'), 'EN hreflang=en not found')
assert(enHtml.includes('hreflang="es"'), 'EN hreflang=es not found')
assert(enHtml.includes('hreflang="x-default"'), 'EN hreflang=x-default not found')

assert(esHtml.includes('hreflang="en"'), 'ES hreflang=en not found')
assert(esHtml.includes('hreflang="es"'), 'ES hreflang=es not found')
assert(esHtml.includes('hreflang="x-default"'), 'ES hreflang=x-default not found')

assert(enHtml.includes('rel="canonical"'), 'EN canonical link not found')
assert(esHtml.includes('rel="canonical"'), 'ES canonical link not found')

console.log('PASS: Generated static output and SEO tags validated')
```

- [ ] **Step 2: Add build and validation scripts in `package.json`**

Ensure scripts include:
```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "validate:generated": "node scripts/validate-generated.mjs",
    "check:static": "npm run generate && npm run validate:generated"
  }
}
```

- [ ] **Step 3: Run static build verification**

Run:
```bash
npm run check:static
```

Expected:
- `nuxt generate` completes.
- Script ends with:
```text
PASS: Generated static output and SEO tags validated
```

- [ ] **Step 4: Commit static validation tooling**

Run:
```bash
git add package.json scripts/validate-generated.mjs
git commit -m "chore: add static output seo validation checks"
```

---

### Task 4: Document Apache deployment and acceptance checks

**Files:**
- Create: `README.md`

- [ ] **Step 1: Add deployment documentation**

Create `README.md`:
```md
# Kmacho Homepage (Nuxt Static)

## Development

```bash
npm install
npm run dev
```

## Build Static Output

```bash
npm run generate
```

Generated site is in:

`.output/public`

## Validate Generated Output

```bash
npm run validate:generated
```

## Apache Deployment

1. Build locally with `npm run generate`.
2. Upload everything inside `.output/public` to Apache document root.
3. Verify routes:
   - `/` (English)
   - `/es` (Spanish)
4. Verify source HTML for canonical + hreflang tags.
```

- [ ] **Step 2: Final acceptance run**

Run:
```bash
npm run check:static
```

Expected:
- Build and validation pass.

- [ ] **Step 3: Commit docs**

Run:
```bash
git add README.md
git commit -m "docs: add static build and apache deployment guide"
```

---

## Spec Coverage Check

- EN at `/` and ES at `/es`: Covered by Task 2 + Task 3 checks.
- Hero-only V1: Covered by Task 2.
- JSON-driven text: Covered by Task 2 locales.
- CTA `Request a Quote` with `#`: Covered by Task 2.
- Static Apache-ready output: Covered by Task 1/3/4.
- Canonical + hreflang for both locales: Covered by Task 2 + Task 3 checks.

## Placeholder Scan

- No `TODO`/`TBD` placeholders.
- All steps include exact commands and concrete file content.

## Type/Name Consistency Check

- Locale codes consistently `en` and `es`.
- Route strategy consistently `prefix_except_default`.
- Validation script paths consistently `.output/public/index.html` and `.output/public/es/index.html`.

