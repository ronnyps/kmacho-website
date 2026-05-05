# Kmacho Technology — Brand & Visual Direction Guide
## Documento de referencia para diseñador y equipo

Versión: 1.0 — 2026-04-21

---

## CONTEXTO DE PARTIDA

Kmacho es una firma de ingeniería y estrategia tecnológica. Equipo 100% senior, experiencia de nivel enterprise, pero con la agilidad y el acceso directo que las grandes consultoras no pueden dar. La web tiene que ser el portfolio más potente de la empresa — no porque "se vea bonita", sino porque debe demostrar antes de decir.

El objetivo es que alguien entre y piense: "estas personas son lo que busco" — y luego vea el diseño y confirme: "sí, son exactamente ellos."

Referente de partida: **Raycast** (raycast.com) en light mode. Ese nivel de calidad, esa base warm grey, esa sensación de precision tech sin frialdad corporativa.

Nivel de ambición: **competir en Awwwards**.

---

## 1. SISTEMA DE COLOR

### La filosofía

No blanco clínico. No negro total. La base es **warm white con temperatura** — el mismo territorio que Raycast, Cron y Resend. Un gris que tiene calor, que hace que las cards y las superficies tengan profundidad natural sin necesitar sombras.

El único color de acento es azul eléctrico, usado con extrema disciplina — máximo un 10% del viewport en cualquier momento.

### Paleta completa

#### Fondos y superficies
```
Page background     #F5F5F2    Warm white — base de toda la web
Surface / Cards     #EDEDEA    Para cards, modales, elementos elevados
Divider sections    #E3E3DF    Para secciones alternadas de fondo
Border              rgba(0,0,0,0.08)   Bordes sutiles — siempre 0.5px
Border hover        rgba(0,0,0,0.14)   Para estados interactivos
```

#### Tinta / Texto
```
Ink primary         #0D0D0B    Títulos, headlines, elementos de máximo peso
Ink secondary       #4A4A46    Cuerpo de texto, descripciones
Ink muted           #9A9A94    Labels, meta-info, placeholders
```

#### Acento
```
Electric Blue       #1A56DB    CTAs secundarios, links, highlights técnicos
Blue tint           #E8F0FE    Backgrounds de badges informativos
```

#### Bloque oscuro (CTA sections)
```
Dark block bg       #0D0D0B    Para la sección CTA final y ocasionalmente hero alternativo
Dark text           #F5F5F2    Texto sobre fondo oscuro
Dark muted          #9A9A94    Texto secundario sobre fondo oscuro
Dark accent         #C8B89A    Acento cálido ocasional sobre fondos oscuros
```

### Reglas de uso del color

1. El acento azul va en máximo 2 elementos por pantalla visible.
2. No hay gradientes decorativos. Si se usan, son sutilísimos (misma familia de color, 5–10% de diferencia).
3. No hay sombras de caja (box-shadow). La profundidad se crea con bordes y diferencia de fondo.
4. El bloque oscuro (#0D0D0B) se usa una sola vez por página — en el CTA final o en el hero de páginas internas.
5. Las transiciones de color en hover son siempre suaves: `transition: 200ms ease`.

---

## 2. TIPOGRAFÍA

### Decisión: Inter. Una sola familia.

**Poppins descartada.** Tiene redondez de startup consumer, no de firma de ingeniería. Proyecta "app de bienestar", no "partner tecnológico enterprise".

**Inter elegida** por tres razones:
- Es la fuente de Raycast, Linear, Vercel — el ecosistema visual al que pertenece Kmacho
- Con tracking negativo en tamaños grandes se vuelve completamente diferente — no genérica
- Sus pesos extremos (300 vs 700) crean la jerarquía suficiente sin necesitar una segunda familia

No se necesita fuente secundaria. La jerarquía se construye con peso, tamaño y tracking.

### Escala tipográfica

#### Display — Hero headline
```
Font:       Inter
Weight:     700
Size:       clamp(52px, 7vw, 88px)
Tracking:   −0.04em
Line height: 1.0
Color:      #0D0D0B
Uso:        H1 del hero únicamente
```

#### H2 — Section headline
```
Font:       Inter
Weight:     600
Size:       clamp(28px, 3.5vw, 48px)
Tracking:   −0.025em
Line height: 1.1
Color:      #0D0D0B
```

#### H3 — Card / Component title
```
Font:       Inter
Weight:     600
Size:       18–22px
Tracking:   −0.015em
Line height: 1.2
```

#### Body / Lead paragraph
```
Font:       Inter
Weight:     400
Size:       16–17px
Tracking:   0
Line height: 1.65
Color:      #4A4A46
```

#### Small body
```
Font:       Inter
Weight:     400
Size:       14px
Tracking:   0
Line height: 1.6
Color:      #4A4A46
```

#### Label / Tag / Overline
```
Font:       Inter
Weight:     500–600
Size:       10–12px
Tracking:   +0.08em
Transform:  uppercase
Color:      #9A9A94
```

#### Stat numbers
```
Font:       Inter
Weight:     700
Size:       28–40px
Tracking:   −0.04em
Feature:    font-variant-numeric: tabular-nums
Color:      #0D0D0B
```

#### Nav links
```
Font:       Inter
Weight:     400
Size:       14px
Tracking:   0
Color:      #4A4A46  →  #0D0D0B on hover
```

### Una nota sobre el hero

El headline del hero puede tener una línea en weight 300 italic para crear contraste con el resto en 700. Ejemplo:
- "Not an agency." — peso 700
- "Your *technology*" — la palabra "technology" en 300 italic
- "partner." — peso 700

Este contraste de pesos dentro del mismo headline es la firma visual de la marca.

---

## 3. DESIGN TOKENS

Estos valores son los que van en el archivo de variables CSS o en el design system de Figma:

```css
/* Espaciado */
--space-1:  8px
--space-2:  16px
--space-3:  24px
--space-4:  32px
--space-6:  48px
--space-8:  64px
--space-10: 80px
--space-15: 120px

/* Layout */
--max-width:    1200px
--nav-height:   64px
--section-gap:  120px
--page-padding: 48px   /* desktop */
--page-padding-m: 20px  /* mobile */

/* Bordes */
--radius-sm:  6px
--radius-md:  8px
--radius-lg:  12px
--radius-xl:  16px
--border-w:   0.5px
--border-c:   rgba(0,0,0,0.08)
--border-c2:  rgba(0,0,0,0.14)

/* Animaciones */
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1)
--duration-fast:   150ms
--duration-base:   250ms
--duration-slow:   500ms
--duration-xslow:  800ms
```

---

## 4. SISTEMA DE ANIMACIONES

### Filosofía de motion

Las animaciones existen para una razón: demostrar capacidad técnica antes de que el visitante lea una sola palabra. No son decoración — son la primera prueba de que Kmacho puede construir lo que promete.

**Regla de oro:** cada animación tiene un propósito narrativo. Si no añade significado, no existe.

### Stack de animación recomendado

#### GSAP + ScrollTrigger
El estándar de la industria para webs que compiten en Awwwards. Control total sobre cada keyframe, perfectamente sincronizado con scroll. Úsalo para:
- Entrada del hero (secuencia de aparición)
- Clip reveals en titulares grandes
- Parallax de elementos decorativos
- Contadores de estadísticas
- Transiciones entre secciones

#### Three.js
Para el canvas técnico del hero — partículas, grids, o geometría que responde al cursor. Debe ser **sutil**: el visitante siente que hay algo técnico corriendo, no ve un espectáculo. Opacidad máxima del canvas: 60%.

**Alternativas según complejidad:**
- `@react-three/fiber` si la web es en React
- `Ogl` si se quiere algo más ligero que Three.js completo

#### CSS nativo
Para todo lo demás: hovers, transiciones de color, transforms básicos. No usar JS para lo que CSS resuelve solo.

### Secuencia de entrada del hero

Este es el momento más importante de toda la web. Debe sentirse como encender una máquina:

```
0.0s  → Nav aparece (fade, 600ms)
0.4s  → Label/tag sube (slide up + fade, 500ms)
0.6s  → H1 línea 1 — clip reveal de abajo a arriba (700ms)
0.72s → H1 línea 2 — clip reveal (700ms)
0.84s → H1 línea 3 — clip reveal (700ms)
1.2s  → Subtítulo aparece (slide up + fade, 600ms)
1.45s → Botones aparecen (slide up + fade, 500ms)
1.7s  → Stats bar aparece (fade, 600ms)
1.9s  → Contadores de stats se animan (1800ms, ease-out)
```

El canvas de Three.js está activo desde el inicio pero empieza con opacity 0 y sube a 0.55 durante los primeros 2 segundos.

### Scroll animations (por sección)

**Sección de servicios:**
Cards entran con stagger de 100ms, slide up 20px + fade, cuando entran al 80% del viewport.

**Sección de proceso:**
Los pasos del proceso se "dibujan" de izquierda a derecha con una línea que avanza según el scroll. Efecto de progreso visual.

**Sección de casos:**
Cada caso tiene un número grande (01, 02, 03) que hace parallax lento respecto al texto. Crea profundidad sin Three.js.

**Sección CTA:**
El headline hace un split por palabras — cada palabra entra con 40ms de stagger. Muy impactante para secciones cortas de alto peso.

### Hover states (microinteracciones)

```
Nav links:      color transition 200ms — ningún otro efecto
Botones CTA:    translateY(-2px) + ligero scale(1.01) — 200ms
Cards servicio: background más claro — 200ms, sin lift
Links de casos: underline animado de izquierda a derecha — 300ms
Stats bar:      ningún hover — es informativa, no interactiva
```

---

## 5. ESTRUCTURA DE LA WEB

### Páginas y propósito

```
/               Home — posiciona, prueba, convierte
/services       Servicios (índice de los 3 pilares)
/services/[slug] Página individual por pilar
/work           Portfolio de casos
/work/[slug]    Caso individual
/process        Cómo trabajamos (página dedicada)
/about          Quiénes somos
/contact        Discovery meeting
```

### Anatomía de la Home

Cada sección tiene un trabajo específico. No se mezclan objetivos:

| # | Sección | Trabajo | Duración atención |
|---|---|---|---|
| 1 | Hero | Posicionar + primera impresión técnica | 3–5 seg |
| 2 | Stats bar | Credibilidad rápida antes del scroll | 2 seg |
| 3 | Problema del mercado | Resonancia emocional con el ICP | 8–12 seg |
| 4 | 3 pilares de servicio | Organizar la decisión | 15–20 seg |
| 5 | Casos | Evidencia concreta | 20–40 seg |
| 6 | Proceso | Eliminar fricción de compra | 15 seg |
| 7 | Fit / No-fit | Calificar + generar respeto | 10 seg |
| 8 | CTA final | Convertir | 5 seg |

---

## 6. COMPONENTES CLAVE

### Nav
- Fixed, 64px de altura
- Backdrop blur + background rgba(245,245,242,0.85)
- Logo: "Kmacho" en Inter 600, tracking −0.02em
- Links: Inter 400, 14px, #4A4A46
- CTA: botón filled, #0D0D0B background, Inter 500

### Botones
```
Primary:   bg #0D0D0B, text #F5F5F2, radius 8px, padding 12px 24px
           hover: opacity 0.85, translateY(-2px)

Secondary: bg transparent, border 0.5px #0D0D0B, text #0D0D0B
           hover: bg rgba(13,13,11,0.05)

Ghost:     sin borde, texto + flecha →, hover: gap aumenta
```

### Cards de servicio
- Background: #EDEDEA
- Border: 0.5px rgba(0,0,0,0.08)
- Border radius: 12px
- Padding: 36px 32px
- Hover: background #E3E3DF (un paso más oscuro), transition 200ms
- Icono: SVG outline, 28px, #9A9A94
- Título: Inter 600, 20px, −0.015em
- Descripción: Inter 400, 14px, #4A4A46

### Stats bar
- Background rgba(255,255,255,0.6) + backdrop-filter blur(8px)
- Border: 0.5px rgba(0,0,0,0.1)
- Grid de 4 items separados por bordes verticales
- Número: Inter 700, 28px, −0.04em
- Label: Inter 400, 12px, #9A9A94

### Badges / Labels
- Background: #E8F0FE (blue tint)
- Text: #1A56DB
- Font: Inter 500, 11px, uppercase, +0.08em tracking
- Radius: 4px
- Padding: 3px 8px

---

## 7. LISTA DE WEBS DE REFERENCIA

Organizadas por lo que Kmacho debe extraer de cada una:

### Referentes de base (estilo general)

**Raycast** — raycast.com
El referente directo. Warm grey base, Inter bold con tracking negativo extremo, zero box-shadows, nav frosted glass, animaciones de entrada muy limpias. Es exactamente el territorio visual al que pertenece Kmacho.

**Resend** — resend.com
Boutique tech sin logos de Fortune 500 que se ve más enterprise que muchos que sí los tienen. Warm grey idéntico. Prueba de que la credibilidad viene del diseño y la precisión, no de los clientes.

**Cron** — cron.com
La web más parecida al estilo base Kmacho. Inter + warm grey + zero decoration. Adquirida por Notion — si les compró, el diseño funciona.

### Referentes de motion y animación

**Linear** — linear.app
El estándar de calidad en microanimaciones para webs tech. Cada hover, cada scroll reveal, cada transición tiene propósito. Referente para la sección de servicios y proceso.

**Framer** — framer.com
El mejor uso de GSAP ScrollTrigger en web de producto B2B. La sección de "how it works" es la referencia para la sección de proceso de Kmacho.

**Pitch** — pitch.com
Hero con scroll horizontal único que ganó Awwwards. Prueba de que B2B puede tener una web que compite en premios de diseño.

**Superlist** — superlist.com
Awwwards SOTD 2023. Tipografía Inter sola, sin gimmicks, ejecutada con tal precisión que se convierte en el elemento visual principal. Referente de que la fuente bien tratada es suficiente.

### Referentes de layout y estructura

**Stripe** — stripe.com
El mejor ejemplo mundial de jerarquía tipográfica en web B2B. Headlines de 80px+ que mandan sin gritar. La sección de "empresa" (stripe.com/about) es referente para la página About de Kmacho.

**Vercel** — vercel.com
Uso del espacio negativo como herramienta de diseño, no como relleno. Su hero es la referencia para "producto que se ve solo".

**Loom** — loom.com
El mejor storytelling de scroll en web B2B. Cada sección de la home tiene un propósito narrativo claro y encadena con la siguiente. Referente para la estructura de la home de Kmacho.

### Referentes de firmas boutique (el caso más relevante)

**Basement Studio** — basement.studio
Una firma de diseño pequeña con web que compite con cualquier grande del mundo. Han ganado Awwwards múltiples veces. La prueba más directa de que "la web es el portfolio" funciona como estrategia.

**Craft Docs** — craft.do
Awwwards SOTD. Light mode con Three.js integrado de forma orgánica — las partículas y geometría están al servicio del contenido, no compiten con él. Referente directo para el hero animado de Kmacho.

**Encore** — encore.dev
Firma de ingeniería boutique con web de calidad Awwwards. Misma tensión que Kmacho: equipo pequeño, producto serio, web que demuestra antes de decir.

### Referentes de páginas de proceso y casos

**Metalab** — metalab.com
La mejor página de casos del sector. Cada caso tiene su propio mundo visual pero mantiene coherencia de sistema. Referente para la página /work de Kmacho.

**Work & Co** — work.co
La firma de diseño más respetada del mundo en B2B digital. Su web es minimalismo extremo que comunica confianza absoluta. Ver cómo presentan el proceso.

---

## 8. CHECKLIST ANTES DE CONSTRUIR

Antes de que el diseñador abra Figma, confirmar:

**Estrategia:**
- [ ] Tagline final elegido (recomendación: "Not an agency. Your technology partner.")
- [ ] Idioma principal confirmado (inglés para US market)
- [ ] Los 3 casos base tienen suficiente contenido para las páginas individuales
- [ ] Se tiene al menos 1 cita real de cliente con nombre y cargo

**Visual:**
- [ ] Acento de color confirmado (propuesta: #1A56DB electric blue)
- [ ] Decisión sobre canvas Three.js en hero (partículas vs grid técnico vs geometría)
- [ ] Se tiene logotipo o se diseña junto con la web

**Técnico:**
- [ ] Framework de la web decidido (Next.js recomendado por performance + SEO)
- [ ] GSAP instalado y licencia correcta (GSAP es gratuito para proyectos no comerciales, Club GSAP para uso comercial)
- [ ] Three.js vs R3F decidido según si la web es React

---

*Este documento es la fuente de verdad para todas las decisiones de branding y diseño visual de Kmacho Technology. Cualquier decisión que no esté aquí, se toma consultando este documento primero.*
