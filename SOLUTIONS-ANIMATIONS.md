# Solutions Animations — Guía de criterios

Referencia de diseño y desarrollo para los componentes de animación de las cards de Solutions.
Toda animación nueva debe seguir esta guía para mantener coherencia visual y técnica.

---

## Ubicación y estructura de archivos

```
app/components/sections/Solutions-animations/
  WebDevPreview.vue        ← implementado
  MobileAppPreview.vue     ← implementado
  AISolutionsPreview.vue   ← implementado
  UXUIDesignPreview.vue    ← implementado
  IoTPreview.vue           ← implementado
  CustomSoftwarePreview.vue ← implementado
```

Cada componente vive en su propio `.vue` con `<style scoped>`.
No hay CSS global para estas animaciones — todo va dentro del componente.

---

## Props y activación

Todo componente recibe exactamente esta prop, nada más:

```ts
const props = defineProps<{ active?: boolean }>()
```

La animación **solo corre cuando `active` es `true`**.
El estado `active` lo controla el card padre (`SolutionsSection.vue`) via `@mouseenter`/`@mouseleave`.
El componente nunca escucha eventos de ratón propios.

```ts
// Patrón obligatorio
watch(() => props.active, val => val ? onEnter() : onLeave())
onMounted(() => setStatic())
onBeforeUnmount(() => { clearInterval(pageTimer); reset() })
```

**Estado estático** (sin hover): mostrar el resultado final de la animación, visible y completo, sin movimiento.
**Estado activo** (con hover): animación corre desde el principio, cicla indefinidamente.

---

## Layouts disponibles

### Split panel (estilo WebDevPreview)
Código a la izquierda, preview a la derecha. Grid 50/50 o 42/58.
Usar cuando el código y el resultado tienen igual protagonismo visual.

```
┌─────────────────┬──────────────────┐
│   editor dark   │   live preview   │
│   (código)      │   (resultado)    │
└─────────────────┴──────────────────┘
```

### Float overlay (estilo MobileAppPreview)
El código llena todo el fondo. El elemento de preview (teléfono, dispositivo) flota
encima como `position: absolute` hijo directo del root `.component`, no del contenedor
del editor. Puede sobresalir ligeramente — el `overflow: hidden` del card lo clipea.

```
┌──────────────────────────────┐
│  código como fondo           │ ┌──────┐
│                              │ │phone │
│                              │ │      │
└──────────────────────────────┘ └──────┘
                                  ↑ posicionado absolute fuera del editor
```

### Canvas full (estilo AISolutionsPreview)
Sin editor de código. La animación ocupa todo el espacio bajo el chrome bar.
Usar cuando la interfaz de producto ES el mensaje visual (chat, dashboard, etc.).

```
┌──────────────────────────────┐
│  chrome bar (dots + tab)     │
│  [respuesta / output]        │
│  [estado de proceso]         │
│  [spacer flex:1]             │
│  [input + acción]            │
└──────────────────────────────┘
```

**Diferencias clave vs Split panel:**
- No hay `pages[]`, `currentLineIdx`, `editorRef` ni `scrollToLine`
- El timing usa ms directos (`at(200, ...)`) en lugar de la fórmula `T(i)` / `S(i)`
- El canvas usa `background: var(--bg)` con tokens del site (no `#1e1e1e`)
- El chrome bar conserva los dots macOS y un único tab activo

### Variantes futuras posibles
- **Split vertical**: elemento arriba, detalles abajo
- **Centered focus**: elemento central con contexto alrededor

---

## Chrome bar — especificación exacta

Toda animación que muestre un "entorno de herramienta" lleva este chrome en el top:

```
altura:     24px
background: var(--solutions-shell-bg)
```

**Dots macOS** (siempre en este orden, tokens definidos en `tokens.css`):
```css
background: var(--solutions-shell-dot-red)    /* #ff5f57 */
background: var(--solutions-shell-dot-yellow) /* #febc2e */
background: var(--solutions-shell-dot-green)  /* #28c840 */
```

**Tabs de archivo**:
```css
/* inactivo */
color: var(--solutions-shell-tab-text)
font-size: 7px
font-family: 'SF Mono', 'Cascadia Code', Menlo, monospace

/* activo */
color: var(--solutions-shell-tab-text-active)
background: var(--solutions-shell-tab-bg)
border-top: 1px solid var(--accent)   ← siempre el accent del site
```

---

## Paleta de colores del editor

El editor siempre usa el tema VS Code One Dark. Todos los valores están en `tokens.css`
bajo el namespace `--solutions-editor-*` y `--solutions-shell-*`:

| Rol | Token | Uso |
|---|---|---|
| Fondo editor | `var(--solutions-shell-bg)` | background del panel de código |
| Tab activo bg | `var(--solutions-shell-tab-bg)` | tab seleccionado |
| Separador | `var(--solutions-shell-separator)` | border entre paneles |
| Cursor | `var(--solutions-editor-cursor)` | carácter `\|` parpadeante |
| Keyword | `var(--solutions-editor-syntax-keyword)` | `const`, `function`, `import`, selectores CSS |
| Property / Tag | `var(--solutions-editor-syntax-tag)` | propiedades CSS, nombres de tag HTML |
| Value / String | `var(--solutions-editor-syntax-string)` | strings, valores CSS |
| Attribute | `var(--solutions-editor-syntax-attr)` | atributos HTML |
| Function | `var(--solutions-editor-syntax-fn)` | nombres de función, objetos |
| Number | `var(--solutions-editor-syntax-number)` | valores numéricos |
| Operator / neutral | `var(--solutions-editor-syntax-neutral)` | `{`, `}`, `:`, `;`, texto neutro |

**Tokens `--solutions-ui-*`** — para elementos del preview panel (no editor):

| Token | Uso típico |
|---|---|
| `var(--solutions-ui-surface)` | background blanco de elementos UI |
| `var(--solutions-ui-surface-soft)` | fondo wireframe suave |
| `var(--solutions-ui-surface-muted)` | fondo placeholder neutro |
| `var(--solutions-ui-cream)` | fondo claro cálido (mobile screens) |
| `var(--solutions-ui-border-soft)` | bordes suaves de cards |
| `var(--solutions-ui-border-strong)` | bordes de imágenes placeholder |
| `var(--solutions-ui-border-muted)` | bordes neutros, avatares |
| `var(--solutions-ui-muted)` | texto placeholder, barras secundarias |
| `var(--solutions-ui-muted-soft)` | botones inactivos |
| `var(--solutions-ui-ink-subtle)` | texto dim en UI |
| `var(--solutions-ui-night)` | dark mode preview background |

---

## Sistema de timing de animaciones

### Fórmula base (animaciones con editor de código)
```ts
const lineDelay = (i: number) => `${0.1 + i * 0.17}s`   // CSS animation-delay
const S = (i: number) => (0.1 + i * 0.17) * 1000         // ms: línea i empieza a escribirse
const T = (i: number) => (0.3 + i * 0.17) * 1000         // ms: línea i termina de escribirse
```

### Timing directo (Canvas full — sin editor)
Para animaciones sin editor de código, usar ms directos con valores pensados para cada beat visual:
```ts
// Ejemplo de AISolutionsPreview
at(200,  () => previewState.inputVisible  = true)  // input aparece
at(650,  () => previewState.queryTyped    = true)  // texto empieza a escribirse
at(1900, () => previewState.sendPulse     = true)  // click del botón send
at(2150, () => previewState.thinkingVisible = true) // thinking aparece
```
Referencia de beats: aparecer 150–300ms, acción principal 600–900ms, respuesta/feedback 1800–2200ms.

### Efecto de escritura (typing)
```css
.cl-inner {
  clip-path: inset(0 100% 0 0);
  animation: type 0.2s linear var(--d, 0s) both;
}
@keyframes type {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0%   0 0); }
}
```

El `clip-path` va en un elemento **inner** (`span.cl-inner`), no en el `div.cl` raíz,
para que el cursor pueda vivir fuera del clip y siempre sea visible.

### Cursor
```html
<!-- Dentro de cada línea, fuera del cl-inner -->
<span v-if="i === currentLineIdx" class="cursor">|</span>
```
```css
.cursor {
  display: inline;
  font-size: 8px;
  color: #528bff;
  font-family: monospace;
  margin-left: 1px;
  animation: blink 0.7s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
```

### Auto-scroll del editor
El editor sigue la línea activa en tiempo real:
```ts
const scrollToLine = (i: number) => {
  const el = editorRef.value
  if (!el) return
  const lineH = 6 * 1.85  // font-size × line-height
  el.scrollTop = Math.max(0, i * lineH - el.clientHeight * 0.4)
}
```
Editor CSS: `overflow-y: scroll; scroll-behavior: smooth; scrollbar-width: none;`

---

## Sistema de páginas (ciclo)

Cada animación tiene 2-3 "páginas" de contenido que ciclan. El cambio de página
reinicia las animaciones CSS usando `:key="page"` en el contenedor del código.

```ts
const pages = [ /* array de páginas */ ]
const page = ref(0)
let pageTimer: ReturnType<typeof setInterval>

const onEnter = () => {
  page.value = 0
  runPage(0)
  pageTimer = setInterval(() => {
    page.value = (page.value + 1) % pages.length
    runPage(page.value)
  }, 5200)  // ← intervalo estándar: 5200ms
}
```

```html
<!-- :key fuerza recreación del DOM → CSS animations se reinician -->
<div :key="page" class="code">...</div>
```

**Intervalo estándar: 5200ms** entre páginas.
**Delay base por línea: 0.17s** entre líneas consecutivas.

El intervalo puede ajustarse por componente si el ciclo de contenido lo justifica.
UXUIDesignPreview usa **3600ms** porque sus 3 fases visuales (grid+wireframe, refinement,
theme snap) son más densas y se consumen más rápido visualmente.

---

## i18n en componentes de animación

Las animaciones que muestran texto de interfaz (labels, queries, mensajes) deben obtener ese
texto desde los archivos de locale, **no hardcodeado** en el componente.

```ts
// En el script del componente
const { t } = useI18n()
```

```html
<!-- En el template -->
{{ t('solutions.items.ai.preview.thinking') }}
{{ t('solutions.items.ai.preview.query') }}
```

Los keys viven bajo `solutions.items.<card-key>.preview.*` en `locales/en.json` y `locales/es.json`.

**Qué va en i18n:**
- Labels de estado visibles al usuario ("Thinking...", "Loading...", etc.)
- Texto de queries o mensajes de ejemplo en inputs
- Cualquier string que el usuario pueda leer en la animación

**Qué NO va en i18n:**
- Nombres de archivos en tabs del chrome (`index.html`, `ai-chat.tsx`)
- Código sintético dentro del editor (siempre inglés, es código)
- Valores de configuración del componente

---

## Sincronización código ↔ preview

El `previewState` reactivo conecta qué se está escribiendo con lo que aparece en el preview.
Los triggers se programan con `setTimeout` al `T(i)` de la línea correspondiente.

```ts
const previewState = reactive({ /* propiedades booleanas */ })
const pending: ReturnType<typeof setTimeout>[] = []
const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach(k => ((previewState as any)[k] = false))
}
```

**Patrón de sincronización por página:**
- **Página de estructura** (HTML/JSX): elementos del preview aparecen cuando su tag se termina de escribir
- **Página de estilos** (CSS/StyleSheet): todos los elementos visibles desde el inicio (sin estilo), las propiedades visuales cambian cuando el bloque `}` se cierra
- **Página de lógica** (JS/TS): todos visibles y estilados; hay un momento "wow" cuando el código clave se completa (animación, transición de pantalla, toggle de tema, etc.)

---

## Criterios de diseño del preview (panel derecho)

### Colores del preview
El panel de preview usa los **tokens del site** y, para el shell de estas animaciones, la subsección `Solutions` de `app/assets/css/tokens.css`.
- Fondos: `var(--bg)`, `var(--surface)`, `var(--surface2)`
- Texto (barras placeholder): `var(--ink)`, `var(--ink2)`, `var(--ink3)`
- Accent: `#014efe` (el accent del site) para elementos destacados

**Excepción**: ninguna para el shell. Los colores de chrome, tabs, editor y sintaxis deben salir de `--solutions-*` o de tokens base existentes.

### Elementos de preview comunes
- **Barras de texto placeholder**: `height: 4-7px`, `border-radius: 2px`, ancho variable
- **Avatar/icono**: `width/height: 10-14px`, `border-radius: 50%` o `4px`
- **Botones**: `height: 10-12px`, `border-radius: 999px`
- **Cards**: `height: 16-20px`, `border: 1px solid`, `border-radius: 4-8px`

### Transiciones del preview
```css
/* Aparecer: siempre fade + slide desde abajo o desde la dirección lógica */
transition: opacity 0.25-0.3s ease, transform 0.25-0.3s ease;
/* Estado invisible por defecto: */
opacity: 0; transform: translateY(3-5px);
/* Clase activa: */
.el--in { opacity: 1 !important; transform: translateY(0) !important; }
```

### Barras de respuesta — patrón de montaje
Las barras de respuesta deben estar **siempre en el DOM** (sin `v-if`).
Si se montan con la clase de visibilidad ya aplicada, la transición CSS no se ejecuta.

```html
<!-- Correcto: siempre en DOM, clase aplicada reactivamente -->
<div
  v-for="(w, idx) in ['90%','76%','84%','55%']" :key="idx"
  class="ai__rline"
  :class="{'ai__pv-el--in': previewState.responseVisible}"
  :style="`width:${w}; transition-delay:${idx * 0.06}s`"
/>

<!-- Incorrecto: v-if hace que monten con la clase ya aplicada → sin transición -->
<template v-if="previewState.responseVisible">
  <div class="ai__rline ai__pv-el--in" />
</template>
```

El `transition-delay` inline en milisegundos crea el stagger de aparición (0.06s entre barras).
Durante streaming, cambiar `transition-delay` por `animation-delay` con el mismo intervalo.

### El "momento wow" — criterio obligatorio
Cada animación debe tener un momento de impacto claro en la página de JS/lógica.
Ejemplos válidos:
- Toggle de dark mode (preview entera cambia de paleta) — WebDevPreview
- Transición de pantalla nativa (slide desde la derecha) — MobileAppPreview
- Stagger animation con `back.out` overshoot en elementos
- **Streaming de respuesta IA**: barras con `clip-path` fill de izquierda a derecha + thinking card slide-out — AISolutionsPreview
- **Theme snap cascade**: interfaz entera pasa de wireframe gris → refinada (radios+bordes) → con color (nav dark, acento, tipografía con jerarquía) con stagger de 300ms entre elementos — UXUIDesignPreview
- Contadores numéricos animándose
- Morphing / transformación visible de layout

### Grid de 12 columnas (UXUIDesignPreview)
El artboard usa `position: relative` con dos capas absolutas de grid encima del layout:

**Columnas** (`.ux__grid` con 12 `.ux__gcol`):
```css
.ux__grid {
  position: absolute; inset: 7px 6px;
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4px;
  pointer-events: none;
}
.ux__gcol {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  animation: uxDraw .34s ease both; /* stagger via nth-child, 0.02s entre cols */
}
```
Las columnas se revelan secuencialmente de izquierda a derecha (0.02s entre cada una).
En páginas 1 y 2, el grid se suaviza (`ux__artboard--grid-soft`) a `opacity: .14`.

**Gutters** (`.ux__gutters`): `repeating-linear-gradient` que resalta los espacios entre columnas
con `color-mix(in srgb, var(--accent) 10%, transparent)`.

**Layout de contenido** (`.ux__layout`): también usa `grid-template-columns: repeat(12, 1fr)` con
`z-index: 1` para quedar encima de la capa de grid. Cada elemento ocupa su span de columnas:
```css
.ux__nav   { grid-column: 1 / -1; }          /* full width */
.ux__hero  { grid-column: 1 / span 8; }      /* 8 de 12 cols */
.ux__btn   { grid-column: 1 / span 3; }      /* 3 de 12 cols */
.ux__cards { grid-column: 1 / -1; }          /* full width, 3 cards de 4 cols c/u */
```

### Patrón Layout Guide → Wireframe → Refined → Themed
La animación de UX/UI tiene **4 fases** que se distribuyen en 3 páginas:

**Page 0 — Layout Guide + Wireframe:**
```
Fase 1 (0–750ms):   guides dibujan los zones del layout (clip-path de izquierda a derecha)
Fase 2 (1300ms+):   wireframes rellenan cada zone en stagger (guide desaparece al mismo tiempo)
```
Cada elemento actúa como su propio guide zone. El mismo `div` pasa de guide → wireframe sin
nodo extra en el DOM. El truco: la clase `ux__zone--guide` usa `!important` para override
los estilos base, y cuando se remueve, la transición del elemento base retoma naturalmente.

**Pages 1/2:** igual que Refined y Theme snap descritos abajo.

**Implementación del guide zone:**
```css
.ux__zone--guide {
  opacity: 1 !important; transform: translateY(0) !important;
  transition: none !important;        /* desactiva transition del elemento base */
  background: transparent !important;
  border: 1px dashed color-mix(in srgb, var(--accent) 38%, transparent) !important;
  animation: uxDraw .38s ease both;   /* dibuja de izquierda a derecha */
}
@keyframes uxDraw {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0%   0 0); }
}
```

El contenido interno (logo bars, h1/h2) se monta con `v-if` y solo aparece cuando
el elemento entra en fase wireframe:
```html
<div class="ux__nav" :class="{
  'ux__zone--guide': previewState.navGuide && !previewState.navVisible,
  'ux__pv-el--in':   previewState.navGuide || previewState.navVisible,
}">
  <template v-if="previewState.navVisible">
    <!-- contenido del wireframe -->
  </template>
</div>
```

### Patrón Wireframe → Refined → Themed
Para mostrar una UI que evoluciona por etapas, usar tres capas de modificadores que se acumulan:

```css
/* Wireframe — estado base: gris plano, esquinas cuadradas */
.ux__btn { background: var(--surface2); border-radius: 0; }

/* Refined — añade forma al elemento */
.ux__btn--refined { border-radius: var(--radius-sm); }

/* Themed — snap de color */
.ux__btn--themed  { background: var(--accent); border-radius: var(--radius-pill); }
```

Los modificadores `--refined` y `--themed` se activan en páginas distintas con `at()`,
pero en `setStatic()` y en página 2 ambos están activos al mismo tiempo.
El stagger entre elementos (300ms) hace que el snap de color se propague como una ola.

El artboard usa `background: var(--bg)` sobre un canvas `var(--surface2)` para simular
el contexto de una herramienta de diseño (Figma, Sketch).

### Patrón slide-in / slide-out con modificadores
Para elementos que entran y salen (como un thinking card), usar modificadores `--in` / `--out`
en lugar de `v-if`. Así la transición de salida también se ejecuta con CSS:

```css
.ai__think { opacity:0; transform:translateY(4px); transition:opacity .3s,transform .3s; }
.ai__think--in  { opacity:1; transform:translateY(0); }
.ai__think--out { opacity:0; transform:translateY(-6px); }  /* sale hacia arriba */
```

```html
<div class="ai__think" :class="{
  'ai__think--in':  previewState.thinkingVisible,
  'ai__think--out': previewState.streaming
}">
```

La clase `--out` tiene mayor especificidad implícita al activarse después que `--in`,
por lo que la transición de salida se ejecuta correctamente sin conflictos.

### Botón de acción (send / submit)
```css
.ai__send { width:16px; height:16px; border-radius:var(--radius-sm); background:var(--accent); }
.ai__send--pulse { animation: aiSendClick .35s ease; }
@keyframes aiSendClick {
  40% { transform:scale(.82); box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 20%,transparent); }
}
```
El pulso simula el click del usuario: escala down + glow ring efímero.
Activar con `at(ms, () => sendPulse = true)` y limpiar ~250ms después.

---

## Animaciones sin código (UX/UI, IoT, etc.)

Para cards que no muestran código, la estructura cambia pero los criterios se mantienen:

**Lo que SÍ se mantiene:**
- Props `active?: boolean` y patrón de activación idéntico
- `onMounted → setStatic()`, `watch(active)`, `onBeforeUnmount → reset()`
- Ciclo de 5200ms entre estados
- Timing de transiciones similar (0.25-0.5s)
- Tokens de color del site
- Un "momento wow" claro en el ciclo

**Lo que cambia:**
- No hay chrome bar (o puede haberla si tiene sentido)
- No hay editor de código
- El layout es libre: puede ser full-canvas, centered, split visual

**Criterios extra para animaciones no-código:**
- Deben ser **reconocibles**: el usuario debe entender inmediatamente qué servicio representa
- Deben usar **formas geométricas simples** — no ilustraciones complejas
- Las animaciones deben ser **suaves y continuas** — sin saltos bruscos
- El estado estático debe verse **completo y legible** (no a medias)

---

## Checklist antes de entregar una animación nueva

### Estructura y ciclo de vida
- [ ] Prop `active?: boolean` definida y usada
- [ ] `setStatic()` en `onMounted` — estado visible sin animación
- [ ] `watch(active)` conecta `onEnter`/`onLeave`
- [ ] `onBeforeUnmount` limpia interval y timeouts
- [ ] Ciclo de 3 páginas mínimo (5200ms entre páginas)
- [ ] "Momento wow" identificable en la última página
- [ ] Estado estático muestra resultado final, sin cursor, sin typing

### Layout y chrome
- [ ] Chrome bar con dots usando `var(--solutions-shell-dot-red/yellow/green)` (si aplica)
- [ ] Chrome bg/tabs usando `var(--solutions-shell-bg/tab-bg/tab-text/tab-text-active)`
- [ ] Layout elegido documentado: Split panel / Canvas full / Float overlay

### Si tiene editor de código
- [ ] Sintaxis coloreada con tokens `var(--solutions-editor-syntax-*)` y `var(--solutions-editor-cursor)`
- [ ] Auto-scroll del editor sigue al cursor (scrollToLine)
- [ ] `:key="page"` en el contenedor del código para reset de animaciones CSS
- [ ] Preview sincronizado con el código via `previewState` + `setTimeout` en `T(i)`
- [ ] Elementos del preview panel usan `var(--solutions-ui-*)` — no colores hardcoded

### Si usa Canvas full (sin código)
- [ ] `canvas` usa `background: var(--bg)` o `var(--surface2)` — no `#1e1e1e`
- [ ] Timing con ms directos, no con fórmula `T(i)`
- [ ] Texto de interfaz visible viene de i18n (`useI18n()`) — no hardcodeado
- [ ] Keys i18n añadidos en `locales/en.json` y `locales/es.json` bajo `solutions.items.<key>.preview.*`
- [ ] Barras de output siempre en DOM (no `v-if`) para que las transiciones CSS funcionen

### CSS y accesibilidad
- [ ] **Cero colores hardcoded** — todos los valores en tokens `var(--solutions-*)` o tokens globales del site
- [ ] No hay estilos globales — todo en `<style scoped>`
- [ ] `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones y keyframes
