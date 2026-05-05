# Homepage CSS Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar un polish sistémico a la navegación y a las secciones `services`, `proof` y `process`, mejorando consistencia visual, interacción y responsive sin alterar la estructura base.

**Architecture:** El trabajo se limita a CSS componentizado y tokens compartidos. La implementación se apoya en ajustes incrementales por grupo de componentes, validando después el cumplimiento de tokens y la generación estática.

**Tech Stack:** Nuxt 4, CSS modular por componente, design tokens en `app/assets/css/tokens.css`

---

### Task 1: Alinear sistema visual de secciones

**Files:**
- Modify: `app/assets/css/tokens.css`
- Modify: `app/assets/css/components/services.css`
- Modify: `app/assets/css/components/proof.css`
- Modify: `app/assets/css/components/process.css`

- [ ] Revisar ritmos verticales, paddings internos, alturas mínimas y bordes entre cards.
- [ ] Ajustar o crear tokens reutilizables solo si la consistencia lo exige.
- [ ] Aplicar los cambios mínimos necesarios para igualar jerarquía y densidad entre secciones.

### Task 2: Unificar estados interactivos y affordances

**Files:**
- Modify: `app/assets/css/components/services.css`
- Modify: `app/assets/css/components/process.css`
- Modify: `app/assets/css/components/nav.css`

- [ ] Corregir hover, focus-visible y active para que el feedback sea equivalente y accesible.
- [ ] Mejorar transiciones, fondos hover y lectura de elementos activos sin aumentar ruido visual.

### Task 3: Refinar infraestructura visual global

**Files:**
- Modify: `app/assets/css/components/nav.css`
- Modify: `app/assets/css/components/progress.css`

- [ ] Integrar mejor `site-nav` y `scroll-progress` dentro del sistema visual.
- [ ] Ajustar presencia, contraste y continuidad entre estados clear/scrolled/dark.

### Task 4: Verificación

**Files:**
- Modify: `app/assets/css/tokens.css`
- Modify: `app/assets/css/components/services.css`
- Modify: `app/assets/css/components/proof.css`
- Modify: `app/assets/css/components/process.css`
- Modify: `app/assets/css/components/nav.css`
- Modify: `app/assets/css/components/progress.css`

- [ ] Ejecutar `npm run check:tokens`.
- [ ] Ejecutar `npm run generate`.
- [ ] Revisar el diff final para detectar drift, duplicación o regressions obvias.
