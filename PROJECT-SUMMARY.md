# Kmacho Website — Resumen técnico del proyecto

## Stack

- **Framework:** Nuxt 3 (SSR)
- **Lenguaje:** TypeScript
- **i18n:** EN / ES via `useI18n()`
- **Estilos:** CSS puro (sin Tailwind, sin frameworks) — variables globales + scoped por componente

---

## Sistema de estilos — REGLA FUNDAMENTAL

**Siempre usar tokens y clases globales. Nunca hardcodear valores.**

### Tokens (`app/assets/css/tokens.css`)

Todas las variables están en `:root`. Categorías principales:

```css
/* Colores */
--bg: #fafafa;
--surface: #ededea;
--surface2: #e3e3df;
--ink: #0d0d0b;        /* texto principal */
--ink2: #4a4a46;       /* texto secundario */
--ink3: #9a9a94;       /* texto muted */
--accent: #014efe;     /* azul marca */
--border: rgba(0,0,0,0.08);
--border2: rgba(0,0,0,0.14);

/* Tipografía */
--font-family-inter
--font-size-display / h2 / h3 / h4 / body / body-sm / label  (todos clamp())
--line-height-display / heading / body
--tracking-display / h2 / h3 / label

/* Espaciado */
--space-1: 8px  → --space-18: 144px  (escala de 8px)

/* Layout */
--max-width: clamp(1200px, 88vw, 1440px)
--page-padding: clamp(12px, 4vw, 96px)

/* Radius */
--radius-sm: 6px  --radius-md: 8px  --radius-lg: 12px  --radius-pill: 999px

/* Motion */
--ease-out / --ease-in-out / --ease-emphasized
--duration-fast: 150ms → --duration-xslow: 800ms

/* Dark mode */
--dark-bg / --dark-ink / --dark-ink2 / --dark-ink3
--dark-border / --dark-border-strong
```

### Clases globales (`app/assets/css/global.css`)

```css
/* Layout */
.container           /* max-width + page-padding */
.container--wide
.container--narrow
.section-shell       /* max-width centrado con border */

/* Secciones */
.section-header
.section-overline    /* eyebrow uppercase */
.section-title
.section-subtitle

/* Composición */
.flow / .flow-sm / .flow-lg     /* margin-top entre hijos */
.stack / .stack-sm / .stack-lg  /* grid con gap */
.cluster / .cluster-lg          /* flex wrap */
.split-grid                     /* 2 columnas */
.grid-3 / .grid-4

/* Superficies */
.surface-panel
.surface-panel--soft
.surface-panel--dark

/* Botones */
.btn-primary   /* fondo oscuro */
.btn-ghost     /* fondo transparente */
.btn-inverse   /* fondo claro sobre oscuro */

/* Dark zone */
body.is-dark-zone   /* activa paleta dark en la sección */
```

### Regla dark mode

No hay selector `@media (prefers-color-scheme)`. El dark se activa por clase:
```js
body.classList.add('is-dark-zone')
```
Cuando el hero hace scroll, el body alterna entre claro y oscuro.

---

## Estructura de componentes relevante

```
app/
├── assets/css/
│   ├── tokens.css          ← variables globales
│   ├── global.css          ← reset + clases reutilizables
│   └── components/
│       ├── nav.css
│       ├── services.css
│       └── ...
├── components/
│   └── sections/
│       ├── ServicesSection.vue
│       └── Services-animations/
│           ├── TechInnovationPreview.vue
│           ├── ExperienceDesignPreview.vue
│           ├── StrategyConsultingPreview.vue
│           └── ProductGrowthPreview.vue
└── pages/
    └── index.vue
```

---

## SVG animations — cómo funcionan

Cada componente de animación de servicio carga su SVG isométrico desde `public/svg/isometric/`.

### Patrón común (igual en los 4 componentes)

```js
// 1. Fetch con no-store (evita caché viejo del browser)
const response = await fetch('/svg/isometric/archivo.svg', { cache: 'no-store' })

// 2. Modificaciones como string antes de inyectar al DOM
svg = svg
  .replace(/width="..."/, '')           // quita dimensiones en pulgadas
  .replace(/height="..."/, '')
  .replace(/(<svg\b[^>]*>)/, `$1${inlineStyle}`)  // inyecta <style> con hover y animaciones
  .replace('id="connectorN" class="cls-X"', `id="connectorN" class="cls-X" stroke-dasharray="6 14" stroke-linecap="round"`)
  .replace(/cls-/g, `${prefix}cls-`)    // renombra clases para evitar colisión entre SVGs
  .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)  // prefija IDs
  .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)  // actualiza referencias url()
  .replace(/href="#([^"]+)"/g, `href="#${prefix}$1"`)

// 3. v-html inyecta el SVG
svgMarkup.value = svg
await nextTick()

// 4. WAAPI anima los connectors (no CSS scoped, no funciona en v-html)
el.animate(
  [{ strokeDashoffset: '0' }, { strokeDashoffset: '-40' }],
  { duration: 1800, iterations: Infinity, easing: 'linear' }
)
```

### Por qué string y no DOMParser

DOMParser pierde namespaces SVG al re-serializar con `outerHTML`. El string manipulation es más fiable.

### Por qué WAAPI y no CSS scoped

Los estilos `scoped` de Vue no alcanzan elementos dentro de `v-html`. WAAPI aplica animaciones directamente al nodo del DOM.

### Prefijos por SVG (evitan colisión de IDs y clases entre SVGs en el mismo DOM)

| Componente | SVG | Prefijo |
|---|---|---|
| TechInnovationPreview | tech.svg | `tech-` |
| ExperienceDesignPreview | uiux.svg | `uiux-` |
| StrategyConsultingPreview | strategy.svg | `strat-` |
| ProductGrowthPreview | growth.svg | `growth-` |

### Connectors — nota importante

Cada vez que se reexporta un SVG desde Illustrator/Figma, las clases internas (`cls-1`, `cls-6`, etc.) se renumeran automáticamente. Cuando los connectors dejan de animarse, hay que verificar qué clase tienen actualmente y actualizar el string replacement en el componente correspondiente.

```bash
# Comando para verificar la clase actual de los connectors
Select-String -Path "public/svg/isometric/archivo.svg" -Pattern 'id="connector'
```

### Hover en grupos SVG

Se inyecta CSS directamente en el string del SVG (antes de inyectarlo vía v-html):

```js
const inlineStyle = `<style>
#${p}grupoid { transition: transform 0.35s ease-out; }
#${p}grupoid:hover { transform: translateY(-8px); }
</style>`
```

### Ripple rings (solo TechInnovationPreview)

Los anillos se crean programáticamente con `createElementNS` después del `nextTick`, usando `getBBox()` para calcular la posición real del `#centerBox` en el DOM. Así son independientes de la posición en el SVG.

---

## Background decorativo (ServicesSection)

`public/svg/isometric/grid-back.svg` se carga como `<img>` con `opacity: 0.35` detrás de cada animación en `.services__anim-slot`. Es puramente decorativo, `pointer-events: none`.

---

## Reglas de CSS en componentes

- Los componentes usan `<style scoped>`
- **Siempre** referenciar tokens: `var(--accent)`, `var(--border)`, `var(--radius-md)`, etc.
- **Nunca** hardcodear colores, tamaños o espaciados
- Para elementos dentro de `v-html` usar `:deep()` o inyectar el CSS dentro del propio SVG string
