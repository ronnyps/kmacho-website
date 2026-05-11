# TechInnovationPreview.vue — Resumen técnico SVG

## Archivo SVG

`public/svg/isometric/tech.svg` — ilustración isométrica exportada desde Illustrator/Figma.
Se sirve estático desde `public/`, sin procesamiento de Vite.

---

## Por qué se carga con `fetch` y no con `<img>`

Para animar elementos internos del SVG (paths, grupos) se necesita acceso al DOM del SVG.
Con `<img>` eso es imposible. La solución es traer el SVG como texto, modificarlo, e inyectarlo
inline con `v-html`.

---

## Flujo en `onMounted`

### 1. Fetch del SVG

```js
fetch('/svg/isometric/tech.svg', { cache: 'no-store' })
```

`no-store` es obligatorio — sin esto el browser devuelve una versión vieja del caché aunque
el archivo haya cambiado en disco.

---

### 2. Modificaciones como string (antes de inyectar al DOM)

Se hacen con `.replace()` directamente sobre el texto crudo.

> **Por qué string y no DOMParser:** manipular el DOM del DOMParser y re-serializar con
> `outerHTML` pierde namespaces SVG y los `<style>` inyectados no se registran en el CSSOM.
> El string manipulation es más fiable y predecible.

**Quitar `width`/`height` en pulgadas**
El SVG exportado trae `width="20.76in"` lo que rompe el layout.
Se eliminan con regex y se deja solo el `viewBox` para que escale con CSS.

**Inyectar `<style>` inline**
Se inserta un bloque `<style>` justo después del tag `<svg>`. Contiene:
- Estilos de hover para los grupos interactivos
- `@keyframes rippleOut` para los anillos del centerBox

Al ir embebido en el SVG string, el browser lo registra en el CSSOM al hacer `innerHTML`.

**Añadir `stroke-dasharray` a los connectors**
Cada path/polyline conector recibe estos atributos de presentación SVG:
```
stroke-dasharray="6 14" stroke-linecap="round"
```
Esto convierte la línea sólida en guiones (dash 6px, gap 14px).

---

### 3. Inyección en el DOM

```js
svgMarkup.value = svg  // v-html actualiza el DOM
await nextTick()       // esperar a que Vue renderice
```

---

### 4. Animaciones via Web Animations API (WAAPI)

> **Por qué WAAPI y no CSS scoped:** los estilos `scoped` de Vue no alcanzan elementos
> dentro de `v-html`. WAAPI aplica animaciones directamente sobre los nodos del DOM,
> sin depender de selectores CSS externos.

**Connectors — efecto flujo de datos**

```js
el.animate(
  [{ strokeDashoffset: '0' }, { strokeDashoffset: '-40' }],
  { duration: 1800, iterations: Infinity, easing: 'linear' }
)
```

Los guiones "caminan" a lo largo del path. `-40` es múltiplo del ciclo `(6+14) × 2 = 40`
para que el loop sea continuo sin salto visual.

**Ripple rings en `#centerBox` — posición dinámica**

```js
const bbox = centerBoxEl.getBBox() // coordenadas reales en el SVG
const cx = bbox.x + bbox.width / 2
const cy = bbox.y + bbox.height / 2
const rx = bbox.width / 2
const ry = rx * 0.58 // ratio isométrico del diamante
```

Se usa `getBBox()` para calcular el centro y dimensiones del elemento en tiempo de ejecución.
Así los anillos siempre caen encima independientemente de dónde esté el centerBox en el SVG.

Se crean 3 `<ellipse>` vía `createElementNS` y se animan con `rippleOut` (definido en el
`<style>` embebido). Los anillos se disparan con `0ms`, `550ms` y `1100ms` de delay para el
efecto escalonado, repitiéndose cada 7 segundos.

---

## Hover en grupos SVG

```css
#screen, #IA, #code, #centerBox { transition: transform 0.35s ease-out; }
#screen:hover, #IA:hover, #code:hover, #centerBox:hover { transform: translateY(-18px); }
```

CSS puro embebido dentro del SVG inline. `transform` (hover) y `filter` no interfieren entre sí.

---

## IDs importantes del SVG

| ID | Tipo | Función |
|---|---|---|
| `#screen` | `<g>` | Pantalla principal — hover lift |
| `#IA` | `<g>` | Tarjeta AI — hover lift |
| `#code` | `<g>` | Tarjeta código — hover lift |
| `#centerBox` | `<g>` | Caja central — hover lift + ripple rings |
| `#connecto1` | `<path>` | Conector (typo sin 'r', así exportado) |
| `#connector2` | `<path>` | Conector — `class="cls-7"` |
| `#connector3` | `<path>` | Conector — `class="cls-7"` |
| `#connector4` | `<polyline>` | Conector — `class="cls-7"` |
| `#connector5` | `<path>` | Conector — `class="cls-7"` |

> **Nota:** la clase `cls-7` es la que Illustrator asigna a los strokes de los connectors
> en el SVG actual. Si se reexporta y cambia (ej. a `cls-8`), hay que actualizar el
> string replacement en el componente.

---

## Para añadir un nuevo connector

1. En Illustrator/Figma nombrar la capa `connector6` (o el número que corresponda) y exportar.
2. En `TechInnovationPreview.vue`, añadir en dos lugares:

```js
// String replacement — añade los guiones
.replace('id="connector6" class="cls-7"', `id="connector6" class="cls-7" ${DASH}`)

// WAAPI — añade la animación de flujo
;['#connecto1', '#connector2', ..., '#connector6'].forEach(...)
```

---

## Componente: `app/components/sections/Services-animations/TechInnovationPreview.vue`
