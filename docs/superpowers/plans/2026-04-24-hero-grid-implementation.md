# Hero Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar una reticula estructural en el hero manteniendo la identidad visual de Kmacho y respetando la arquitectura CSS del proyecto.

**Architecture:** La implementacion debe extraer a `global.css` cualquier primitive reutilizable real del sistema y dejar en `hero.css` solo la composicion, ornamentacion y ajustes locales del hero. El contenido central del hero debe quedar protegido de las divisiones de la reticula.

**Tech Stack:** Nuxt 4, Vue 3, CSS modular por componente, tokens CSS en `app/assets/css/tokens.css`

---

### Task 1: Preparar primitives globales de reticula

**Files:**
- Modify: `app/assets/css/tokens.css`
- Modify: `app/assets/css/global.css`

- [ ] Revisar si la reticula necesita nuevos tokens de linea, celdas, mascaras o offsets.
- [ ] Añadir solo los tokens estrictamente necesarios en `tokens.css`.
- [ ] Crear en `global.css` una primitive reutilizable de reticula estructural que no duplique logica del hero.
- [ ] Mantener la primitive enfocada en layout/sistema, no en decoracion especifica del hero.

### Task 2: Adaptar markup del hero al nuevo sistema

**Files:**
- Modify: `app/components/hero/HeroSection.vue`

- [ ] Reestructurar el markup del hero para soportar la reticula perimetral y la zona limpia central.
- [ ] Reutilizar primero primitives globales existentes y nuevas.
- [ ] Evitar wrappers innecesarios o estructura acoplada que no aporte al sistema.

### Task 3: Implementar composicion local del hero

**Files:**
- Modify: `app/assets/css/components/hero.css`

- [ ] Aplicar la reticula al hero manteniendo fondo claro y tono Kmacho.
- [ ] Definir la ventana limpia del contenido para que las lineas no crucen copy ni CTAs.
- [ ] Integrar mejor el espectro inferior con la nueva reticula.
- [ ] Ajustar el hero para tablet y mobile sin ruido visual.
- [ ] Mantener accesibilidad, legibilidad y reduced motion.

### Task 4: Verificacion

**Files:**
- Modify: `app/assets/css/tokens.css`
- Modify: `app/assets/css/global.css`
- Modify: `app/components/hero/HeroSection.vue`
- Modify: `app/assets/css/components/hero.css`

- [ ] Ejecutar `npm run check:tokens`.
- [ ] Ejecutar `npm run generate`.
- [ ] Revisar que la solucion siga respetando la regla de arquitectura CSS del proyecto.
- [ ] Confirmar que el hero sigue sintiendose Kmacho y no derivado de Vercel.
