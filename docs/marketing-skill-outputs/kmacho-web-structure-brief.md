# Kmacho Technology — Web Structure & Interaction Brief
## Documento de producción para diseñador y desarrollador

Versión: 1.0 — 2026-04-21
Stack visual: Inter · #F5F5F2 base · #0D0D0B ink · #1A56DB accent
Stack técnico: Next.js · GSAP + ScrollTrigger · Three.js · CSS custom properties

---

## FILOSOFÍA DE LA WEB

Esta web no muestra clientes. No muestra portfolios. No vende servicios con listas de bullets.

Demuestra lo que somos mientras el visitante navega.

Cada animación es una prueba técnica. Cada microinteracción es una señal de que aquí hay gente que sabe construir. Cuando un CEO mid-market llegue a esta web, no va a leer "somos expertos en experiencia digital" — lo va a vivir en los primeros 10 segundos. Y eso es exactamente lo que necesitamos.

La web tiene una sola tarea: que el visitante llegue al CTA final pensando "no necesito ver más, quiero hablar con ellos."

---

## ESTRUCTURA GENERAL

```
SECCIÓN 1  →  Hero — Declaración de posición
SECCIÓN 2  →  La brecha — El problema del mercado
SECCIÓN 3  →  Los 3 pilares — Qué hacemos
SECCIÓN 4  →  Cómo trabajamos — El proceso
SECCIÓN 5  →  Fit / No-fit — Para quién somos
SECCIÓN 6  →  CTA final — El siguiente paso
```

Sin blog. Sin testimonios. Sin logo wall. Sin sección "Sobre nosotros" larga. Todo lo que no convierte, no existe.

Altura total estimada: **5.5x–6x la altura del viewport**. Suficiente para que la navegación se sienta rica, no tan larga que el visitante abandone.

---

## SECCIÓN 1 — HERO

### Propósito
Posicionar en 3 segundos. Demostrar capacidad técnica en los 5 siguientes. Convertir el primer scroll en intención.

### Contenido

**Nav (fixed, frosted glass):**
```
Logo: "Kmacho"  [Inter 600, tracking −0.02em]
Links: Services  ·  Work  ·  Process  ·  About
CTA:  "Start a project"  [botón filled]
```

**Body del hero:**
```
Overline:   ENGINEERING & TECHNOLOGY STRATEGY
            [Inter 500, 11px, uppercase, tracking +0.08em, #9A9A94]
            [Línea decorativa de 20px antes del texto]

H1 línea 1: "Not an agency."         [Inter 700, peso máximo]
H1 línea 2: "Your technology"        [Inter 300, italic — contraste de peso]
H1 línea 3: "partner."               [Inter 700, peso máximo]

Subtítulo:  "Enterprise-grade engineering and strategy for mid-market
             companies that need real execution — without the overhead
             of Big Consulting."
            [Inter 400, 17px, #4A4A46, max-width 460px]

Acciones:
  → "Book a discovery call"   [botón primario filled]
  → "See how we work"         [ghost button con flecha →]
```

**Stats bar (pegada al bottom del hero, full width):**
```
| 12+ Years delivering | $120 Base rate / hr | 100% Senior team | 3 Core verticals |
```
Cada stat separada por bordes verticales. Fondo: rgba(255,255,255,0.6) + backdrop blur.

### Canvas de fondo (Three.js)
Un campo de **280 partículas** conectadas entre sí con líneas cuando están a menos de 120px de distancia. Las partículas se mueven lentamente con física browniana. El canvas **responde al cursor**: las partículas más cercanas al ratón se apartan suavemente (distancia de repulsión: 80px, fuerza: 0.012). Fondo del canvas: transparente. Opacidad del canvas sobre la página: **0.45**. Color de partículas y líneas: `#0D0D0B`.

Esta es la primera demostración técnica. El visitante no sabe que está mirando Three.js — solo siente que la web "vive".

### Animación de entrada (GSAP — secuencia orquestada)

```
t=0.00s  Nav:       opacity 0→1, duration 500ms
t=0.35s  Overline:  translateY(10px)→0 + opacity, duration 500ms, ease power3.out
t=0.55s  H1 línea 1: clip reveal bottom→top, duration 750ms, ease power4.out
t=0.67s  H1 línea 2: clip reveal bottom→top, duration 750ms
t=0.79s  H1 línea 3: clip reveal bottom→top, duration 750ms
t=1.20s  Subtítulo:  translateY(16px)→0 + opacity, duration 600ms
t=1.45s  Acciones:   translateY(12px)→0 + opacity, duration 500ms
t=1.70s  Stats bar:  opacity 0→1, duration 600ms
t=1.90s  Contadores: numericales suben de 0 al valor final, duration 1800ms, ease power2.out
```

**Técnica clip reveal:** cada línea del H1 está dentro de un contenedor `overflow: hidden`. El texto empieza en `translateY(100%)` y sube a `translateY(0)`. El resultado es que el texto "emerge" del borde inferior del contenedor — efecto editorial premium.

### Microinteracciones del hero

**Cursor personalizado:**
Punto de 8px `#0D0D0B` que sigue al cursor con `lerp 0.12` (lag suave). Cuando el cursor está sobre un elemento interactivo (botones, links), el punto se expande a 32px con `mix-blend-mode: difference` — invierte el color sobre lo que está debajo. Efecto visualmente muy potente y completamente en JS nativo.

**Botón primario:**
`translateY(-2px)` + `box-shadow: 0 8px 24px rgba(13,13,11,0.15)` on hover. La sombra aparece SOLO en el hover — nunca en estado normal.

**Stats bar — hover por item:**
Cada stat al hacer hover sube el número en tamaño de 28px a 32px (transition 200ms) y cambia el label a `#1A56DB`. Sutil pero hace la barra interactiva.

---

## SECCIÓN 2 — LA BRECHA

### Propósito
Resonar con el dolor del ICP antes de hablar de soluciones. Si el CEO mid-market ha contratado una consultora grande o un freelancer y ha salido mal, esta sección lo hace sentir comprendido.

### Contenido

**Layout:** Dos columnas asimétricas. Izquierda: el texto. Derecha: visualización animada interactiva.

**Columna izquierda:**
```
Overline:   THE MARKET GAP

H2:         "Too big to move fast.
             Too small to think big."

Body:       "Enterprise consultancies move slow, cost more, and put
             junior teams on your project while the seniors pitch the
             next client. Freelancers are fast and affordable — but
             they don't think in systems, don't own the outcome, and
             disappear after delivery.

             Mid-market companies are stuck in the middle. They need
             enterprise-level thinking with startup-level execution.
             That's exactly what we do."

Tagline:    [pequeño, peso ligero, acento azul]
            "Enterprise capability. Without the enterprise overhead."
```

**Columna derecha — Visualización interactiva (canvas custom CSS + JS):**

Un diagrama visual animado con **3 "orbits"**:

- **Órbita exterior (grande, lenta):** etiqueta "Big Consulting". Una esfera grande que orbita lentamente. Representa peso y lentitud.
- **Punto central (estático):** etiqueta "Your company". El cliente. Quieto en el centro.
- **Punto pequeño (órbita rápida, cercana):** etiqueta "Freelancers". Orbita rápido pero nunca se acerca demasiado al centro.

Cuando el usuario hace **hover sobre el diagrama**, aparece un **cuarto elemento: Kmacho**. Una partícula de tamaño medio que orbita en el carril correcto — más cerca que Big Consulting, más estable que los freelancers. Aparece con un ease `elastic.out` y la etiqueta se escribe letra a letra.

Este diagrama no se explica en el texto. El visitante lo descubre. Es la segunda demostración técnica de la web.

### Animación de entrada (ScrollTrigger)

```
Trigger:    cuando la sección entra al 75% del viewport
Columna iz: translateX(-30px)→0 + opacity, duration 700ms, stagger por párrafo
Columna dr: opacity 0→1 + scale(0.95)→scale(1), duration 800ms
Diagrama:   las esferas comienzan su órbita al entrar en viewport
```

### Microinteracciones

**Split de texto en H2:**
El H2 está dividido en dos partes con colores distintos:
- "Too big to move fast." — `#0D0D0B`
- "Too small to think big." — `#9A9A94`

Cuando la sección entra al viewport, el texto secundario hace un fade de `#9A9A94` a `#0D0D0B` (duration 800ms, delay 400ms). Como si el problema se "aclarara" ante los ojos del lector.

**Hover en el diagrama:**
Al acercar el cursor, los labels de cada órbita se vuelven legibles (opacity 0→1). Al alejar, vuelven a desvanecerse. Kmacho solo aparece con hover — no existe en el estado normal.

---

## SECCIÓN 3 — LOS 3 PILARES

### Propósito
Organizar la decisión del visitante sin confundirlo. Cada pilar es un mundo: tiene su problema, su resultado y su microinteracción propia.

### Layout
3 cards en grid. Full width. Altura generosa: mínimo 320px por card. Las cards tienen bordes entre ellas pero no bordes exteriores visibles — forman un bloque continuo.

### Contenido de cada card

**Card 1 — Technology & Innovation**
```
Icono SVG:  [custom, outline style, 28px, #9A9A94]
Título:     "Technology & Innovation"
            [Inter 600, 20px]
Descripción: "Custom software, AI-powered systems and scalable
              architecture. We build what your operation actually
              needs — not what looks good in a proposal."
Link:       "Explore →"  [Inter 500, 12px, uppercase]
```

**Card 2 — Experience & Design**
```
Título:     "Experience & Design"
Descripción: "Production-ready interfaces, modern websites and UX
              that converts. Design that earns trust the moment
              someone lands on your platform."
Link:       "Explore →"
```

**Card 3 — IT Consulting & Strategy**
```
Título:     "IT Consulting & Strategy"
Descripción: "Technology roadmaps, IT advisory and continuous
              operational support. Strategic direction plus the hands
              to execute it — no hand-off limbo."
Link:       "Explore →"
```

### Animación de entrada (ScrollTrigger)

```
Trigger:    80% viewport
Cards:      cada una entra con translateY(24px)→0 + opacity
            stagger: 120ms entre cards
            duration: 600ms, ease power3.out
```

### Microinteracciones por card — aquí es donde la web demuestra

**Card 1 — Technology & Innovation:**
Al hacer hover, el background de la card se oscurece un tono. Simultáneamente, el icono SVG se "anima": sus paths hacen un stroke-dashoffset reveal (como si se dibujara en tiempo real). Duration 400ms. El visitante ve código ejecutándose, literalmente.

**Card 2 — Experience & Design:**
Al hacer hover, aparece en el corner superior derecho de la card un micro-mockup de 80×60px: una versión miniatura y abstracta de una interfaz (nav + bloque de texto + botón). Se construye con CSS puro — rectangles de distintos grises que se ordenan con un stagger de 30ms. Es un easter egg sutil: diseño que se construye ante tus ojos.

**Card 3 — IT Consulting & Strategy:**
Al hacer hover, un reloj analógico mínimo (SVG, 32px) aparece en el corner y sus agujas giran 360° con `ease: none`. Representa continuidad, no puntualidad. La animación es un loop suave.

Cada una de estas microinteracciones dura exactamente lo que dura el hover. Sin loops infinitos. Con o sin hover, la card es completamente funcional.

---

## SECCIÓN 4 — CÓMO TRABAJAMOS

### Propósito
Eliminar el miedo a contratar. El visitante mid-market ha tenido malas experiencias — proyectos que se alargan, costos que escalan, sin visibilidad. Esta sección desmonta esos miedos con proceso concreto.

### Layout
Full width. Fondo ligeramente más oscuro que el resto: `#EDEDEA`. Padding vertical generoso: 120px.

### Contenido

**Overline:** HOW WE WORK

**Headline:**
```
"Every phase has an objective,
 a deliverable, and an exit criteria."
```

**Subtítulo pequeño:**
```
"No black boxes. No surprises. You know exactly what's happening,
 why it's happening, and when it ends."
```

**Los 6 pasos — formato horizontal en desktop, vertical en mobile:**

```
01  DISCOVERY
    "We learn your operation before we propose a solution.
     Free. No strings."
    Duración: 1–2 días

02  PROPOSAL
    "Scope, timeline, and budget — in writing, in detail.
     You decide before we start."
    Duración: 48h

03  PHASED BUILD
    "Development in phases with milestone sign-off at each step.
     You always have a working version."
    Duración: según proyecto

04  QA & TESTING
    "We don't launch what hasn't been tested. Every release
     goes through structured QA before it reaches production."
    Duración: integrado

05  DELIVERY
    "Full ownership transfer — code, accounts, credentials,
     documentation. Yours from day one."
    Duración: 1 día

06  SUPPORT
    "We stay. Monthly retainer or on-demand — your choice.
     The relationship doesn't end at launch."
    Ongoing
```

### Animación principal de la sección — la más técnica

**Línea de progreso animada con scroll:**

Una línea horizontal (desktop) o vertical (mobile) conecta los 6 pasos. La línea está inicialmente con `stroke-dashoffset: 100%` — invisible. Al entrar en el viewport y mientras el usuario hace scroll DENTRO de la sección, la línea se "dibuja" de izquierda a derecha usando `ScrollTrigger scrub: true`.

La línea avanza exactamente al ritmo del scroll. Al llegar a cada paso, ese paso se "activa" (el número cambia de `#9A9A94` a `#0D0D0B`, el título hace un pequeño scale 1→1.02).

Implementación: SVG con `stroke-dasharray` y `stroke-dashoffset`, controlado por `gsap.to(path, { strokeDashoffset: 0, scrollTrigger: { scrub: 1 } })`.

Esta es la demostración técnica más visible de la web. El visitante interactúa físicamente con el proceso mientras lo lee.

### Microinteracciones adicionales

**Hover en cada paso:**
Aparece un tooltip de 1 línea debajo del paso con una nota extra (ejemplo: paso 01 → "We've never charged for discovery"). Aparece con `scaleY(0)→scaleY(1)` desde el top. Duration 200ms.

**Step numbers:**
Cuando la línea de scroll llega a un número, ese número hace un flip vertical (rotateX 90deg → 0deg) como un marcador de cuenta que cambia. Muy sutil, muy preciso.

---

## SECCIÓN 5 — FIT / NO-FIT

### Propósito
Proteger el posicionamiento premium. Filtrar antes de que lleguen leads no calificados. Y — por el efecto pratfall — aumentar la credibilidad de todo lo dicho antes. Una empresa que sabe para quién NO es su servicio transmite una seguridad que pocas tienen.

### Layout
Dos columnas. Fondo: `#0D0D0B` (el único bloque oscuro de la página, excepto el CTA final). Texto sobre negro.

### Contenido

**Overline** [en acento azul sobre fondo oscuro]:
IS THIS FOR YOU?

**Headline:**
```
"We're selective about who we work with.
 Here's why that's good for you."
```

**Subtítulo:**
```
"A project that isn't the right fit for us will fail regardless
 of how hard we work. We'd rather tell you upfront."
```

**Columna izquierda — Verde (trabajamos bien con):**
```
Título: "We're a great fit if —"

→  You have a defined technology need
   (not just "we need to modernize somehow")

→  You value quality and speed over the lowest price

→  You're a CEO or Founder who owns the decision

→  Your project has real business impact attached to it

→  You want a partner who pushes back when something
   doesn't make sense
```

**Columna derecha — Rojo (no somos la opción correcta):**
```
Título: "We're probably not your firm if —"

→  You're choosing on price alone

→  The scope is undefined and you have no ownership
   over the decision

→  You need someone to just "code what you say"
   without strategic input

→  You expect results in days for projects that take weeks

→  You've already decided exactly what to build and
   just need hands
```

### Animación de entrada

```
Fondo:         fade in de #F5F5F2 a #0D0D0B al entrar en viewport
               (la sección cambia el background-color de la página
               durante su presencia en el scroll — scroll-driven color transition)

Headline:      slide up + opacity, duration 700ms
Columnas:      stagger 150ms, slide up + opacity
Cada item:     stagger 60ms dentro de cada columna, slide right + opacity
```

### La transición de fondo — el momento más impactante de la web

Usando `ScrollTrigger` + `gsap.to(document.body, { backgroundColor })`:

Cuando esta sección entra al 60% del viewport, el fondo de TODA la página hace una transición suave de `#F5F5F2` (warm white) a `#0D0D0B` (negro profundo). El texto de la sección ya es blanco, por lo que es siempre legible. Al hacer scroll más allá de esta sección, la página vuelve a `#F5F5F2` suavemente.

Es la microinteracción de mayor impacto de la web porque el visitante no ve una card que cambia — ve el MUNDO cambiar. Es un momento que genera "oh, esto es diferente."

### Microinteracciones

**Cada item de la lista:**
Al hacer hover (desktop), el item hace `translateX(4px)` con duration 150ms. Pequeño, preciso.

**Los iconos →:**
Se animan de `→` a `—→` (el guión aparece desde la izquierda) en 200ms. Extremadamente sutil pero muy refinado.

---

## SECCIÓN 6 — CTA FINAL

### Propósito
Cerrar. Con claridad, con expectativa concreta, sin presión artificial.

### Layout
Fondo: `#0D0D0B` (continúa del tono oscuro de la sección anterior si el usuario llega directo, o hace su propia transición). Centrado. Padding vertical: 160px.

### Contenido

```
Overline:   READY TO START?
            [#9A9A94 sobre fondo oscuro]

Headline:   "Tell us what you're building.
             We'll tell you if we can help."
            [Inter 700, tamaño grande, color #F5F5F2]
            [La segunda línea en Inter 300 italic, color #9A9A94]

Subtítulo:  "Discovery is free. No pitch. No commitment.
             Just a conversation about what you need."
            [Inter 400, 16px, #9A9A94]

CTA primario:
  "Book a discovery call"
  [Botón filled, fondo #F5F5F2, texto #0D0D0B — invertido del normal]
  [Hover: scale(1.02) + leve opacity]

Expectativa:
  "We respond within 24 business hours."
  [Inter 400, 13px, #9A9A94]

Secondary info:
  Base rate: $120/hr  ·  Senior team only  ·  Miami, FL
  [Inter 400, 12px, #5A5A54]
```

### Animación de entrada (la última — debe ser la más limpia)

**Word-by-word reveal del headline:**

El H2 se divide en palabras individuales. Cada palabra entra con `translateY(20px)→0 + opacity` con un stagger de `40ms` entre palabras. Duration por palabra: `500ms`, ease `power3.out`.

El resultado es que el headline se "escribe" ante los ojos del visitante, palabra a palabra, de izquierda a derecha. No es typewriter (letra a letra, demasiado lento) — es word-by-word (más orgánico, más impactante).

### Microinteracciones

**El botón CTA:**
Tiene un subtle shimmer interno — una línea de luz de 2px de ancho que recorre el botón de izquierda a derecha cada 3 segundos en idle. Implementación: `::after` pseudo-element con `transform: skewX(-15deg)` y keyframe animation. En hover, el shimmer se detiene y el botón hace la transición normal.

**Cursor:**
En esta sección, el cursor personalizado cambia su label de "●" a "Let's talk →". El punto de 8px se expande y aparece texto flotante junto al cursor. Solo en desktop.

---

## NAVEGACIÓN Y ELEMENTOS PERSISTENTES

### Nav — comportamiento

**Estado inicial (hero):**
Transparente con `backdrop-filter: blur(0px)`. El fondo del hero es visible a través.

**Al hacer scroll (>80px del top):**
Transición suave a `background: rgba(245,245,242,0.88)` + `backdrop-filter: blur(16px)`. Duration: 300ms.

**Al entrar en sección oscura (Fit/No-fit + CTA):**
Los links cambian de `#4A4A46` a `rgba(245,245,242,0.7)`. El botón CTA de la nav invierte sus colores (fondo `#F5F5F2`, texto `#0D0D0B`).

Toda esta lógica es `scroll-driven` via `ScrollTrigger`.

### Footer

Minimalista. Una sola línea:
```
© 2025 Kmacho Technology  ·  Miami, FL  ·  hello@kmacho.net  ·  +1 (xxx) xxx-xxxx
```
Fondo `#0D0D0B`. Texto `#5A5A54`. Padding 32px vertical.

No hay links repetidos del footer. No hay mapa del sitio. No hay newsletter signup. El footer no es un lugar para vender — es solo datos de contacto para quien llegó hasta aquí y prefiere el email al formulario.

### Scroll progress indicator

Una línea de 2px de altura en el borde superior de la pantalla (debajo de la nav), `position: fixed`. Avanza de 0% a 100% de ancho según el scroll total de la página. Color: `#1A56DB`. Opacity: 0.7.

Implementación: `scaleX(0)→scaleX(1)` con `transform-origin: left`, controlado por `ScrollTrigger`.

Es el elemento más discreto de la web pero uno de los más refinados — le dice al visitante cuánto falta sin interrumpir la lectura.

---

## PERFORMANCE Y CONSIDERACIONES TÉCNICAS

### Principios

- **No hay un solo frame de video.** Todas las animaciones son código. Esto es intencional — es la demostración técnica más honesta.
- **Tiempo de carga objetivo:** <2.5s en LCP (Largest Contentful Paint). Las animaciones pesadas (Three.js) solo se inician después del primer paint.
- **Sin janking.** Todas las animaciones de scroll usan `will-change: transform` en los elementos animados. Ninguna propiedad que cause reflow (width, height, top, left) — solo `transform` y `opacity`.
- **Respeta `prefers-reduced-motion`.** Si el usuario tiene activada la preferencia de movimiento reducido, todas las animaciones se desactivan y el contenido es visible en su estado final desde el inicio.

### Carga progresiva de animaciones

```
1. First paint:     contenido estático visible (HTML + CSS)
2. 500ms:           GSAP cargado + secuencia de hero inicia
3. 1000ms:          Three.js cargado + canvas inicializado
4. On scroll:       ScrollTrigger activa animaciones por sección
```

Three.js se carga de forma asíncrona y no bloquea el render inicial.

### Mobile

En pantallas <768px:
- Three.js canvas desactivado (too expensive for mobile GPU)
- Reemplazado por un SVG pattern estático del mismo estilo visual
- Todas las animaciones de scroll se simplifican (solo opacity, sin transforms complejos)
- La sección Fit/No-fit pasa a layout vertical
- El proceso pasa de horizontal a vertical con la línea de progreso lateral

---

## RESUMEN DE DEMOSTRACIONES TÉCNICAS

Esta es la lista de momentos donde la web prueba capacidad antes de decirlo:

| Sección | Demostración | Tecnología |
|---|---|---|
| Hero | Campo de partículas con física + respuesta al cursor | Three.js |
| Hero | Secuencia de entrada orquestada a 100ms de precisión | GSAP timeline |
| Hero | Cursor personalizado con blend mode | JS nativo |
| La brecha | Diagrama orbital interactivo con easter egg | Canvas 2D + CSS |
| Pilares | SVG stroke-dashoffset reveal on hover | CSS + JS |
| Pilares | Micro-mockup que se construye en CSS | CSS stagger |
| Proceso | Línea de progreso dibujada por scroll | GSAP ScrollTrigger scrub |
| Proceso | Flip de números al activarse cada paso | GSAP rotateX |
| Fit/No-fit | Transición de fondo de toda la página al hacer scroll | GSAP + ScrollTrigger |
| CTA | Word-by-word reveal del headline | GSAP stagger split |
| CTA | Shimmer animado en botón principal | CSS keyframes |
| Global | Cursor personalizado que cambia por sección | JS lerp |
| Global | Progress bar de scroll | GSAP ScrollTrigger |
| Global | Nav que reacciona al fondo de cada sección | ScrollTrigger color |

**Total: 13 momentos de demostración técnica** distribuidos a lo largo de la navegación. Ninguno interrumpe. Todos refuerzan.

---

*Este documento es el brief de producción. Cualquier decisión de diseño o desarrollo que no esté explícitamente descrita aquí debe consultar primero el Brand & Visual Direction Guide antes de decidir.*
