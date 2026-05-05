# Homepage CSS Polish Design

## Goal

Aplicar un pase de polish sistémico a la home existente para corregir inconsistencias visuales, de ritmo, interacción y responsive en los componentes `nav`, `progress`, `services`, `proof` y `process`, sin romper el lenguaje visual premium/technical ya definido.

## Scope

- Refinar jerarquía y espaciado entre encabezados de sección y grids.
- Unificar comportamiento de hover, focus y active en superficies interactivas.
- Corregir drift entre divisiones de cards, densidad interna y mínimos de altura.
- Mejorar coherencia visual entre navegación fija y barra de progreso.
- Ajustar breakpoints de tablet/mobile donde haya fricción visible.
- Mantener uso exclusivo de tokens CSS existentes o extender tokens solo si hace falta y desde `tokens.css`.

## Non-Goals

- No rediseñar la arquitectura de componentes Vue.
- No cambiar copy, estructura HTML ni animaciones GSAP salvo que un CSS actual las degrade.
- No introducir un nuevo lenguaje visual distinto del definido en `.impeccable.md`.

## Design Direction

El polish debe reforzar una sensación de precisión técnica y madurez enterprise: bordes disciplinados, ritmo vertical consistente, mejor legibilidad de estados y transiciones más limpias. `services`, `proof` y `process` deben sentirse como parte de una misma familia editorial, mientras `nav` y `progress` deben actuar como infraestructura visual silenciosa y exacta.

## Planned Changes

### Section Rhythm

- Homogeneizar márgenes entre overline, title y subtitle.
- Alinear paddings internos de cards y separación previa al grid.
- Mejorar consistencia entre layouts de 3 columnas y colapso a 1 columna.

### Interactive States

- Igualar hover/focus/active en enlaces, cards y botones donde hoy se sienten descompensados.
- Reducir aspereza visual en sombras, fondos hover y feedback de presión.
- Añadir estados de foco visibles donde falten a nivel de superficie interactiva.

### Structural Consistency

- Revisar bordes entre siblings para que el sistema de divisiones sea consistente en desktop y mobile.
- Ajustar alturas mínimas y gaps para que el contenido no quede demasiado suelto o demasiado denso.
- Afinar contraste de texto secundario y detalles decorativos donde la lectura pierda fuerza.

### Navigation and Progress

- Hacer que `nav` scrolled/dark tenga una transición más cohesionada con el resto del sitio.
- Ajustar la presencia visual de `scroll-progress` para que acompañe sin dominar.

## Validation

- `npm run check:tokens`
- `npm run generate`
- Revisión visual de los CSS modificados para confirmar que no se introducen valores hardcodeados ni regressions obvias de responsive.
