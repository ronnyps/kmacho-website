# Hero Grid Design

## Goal

Rediseñar el hero para incorporar una reticula estructural inspirada en patrones tipo Vercel, manteniendo intacta la identidad visual de Kmacho: tema claro, base warm-metal, acentos electric blue y tono premium/technical.

## Approved Direction

Se aprueba una direccion de `reticula integrada`:

- La reticula debe construir el hero como sistema visual de fondo.
- El contenido central debe quedar en una zona limpia, sin divisiones atravesando texto o CTAs.
- No se cambia la identidad de Kmacho ni se adopta un hero oscuro tipo Vercel.
- El hero debe seguir sintiendose propio de Kmacho, no un clon.

## Visual Principles

### Identity Preservation

- Mantener fondo claro y neutros calidos.
- Mantener cromatismo disciplinado.
- Mantener jerarquia premium y sobria.
- Mantener el lenguaje tecnico/minimal del sitio.

### Grid Behavior

- La reticula sera visible en periferia superior, laterales y zona inferior del hero.
- Las lineas deben ser finas, de bajo contraste y sistemicas.
- La reticula no debe cruzar headline, subtitle ni botones.
- La zona central funciona como una ventana limpia dentro del sistema.

### Content Framing

- El contenido deja de sentirse como tarjeta aislada cerrada.
- El contenido pasa a integrarse dentro de una estructura de reticula mayor.
- La composicion debe seguir centrada y muy legible.

### Spectrum Integration

- El espectro inferior puede mantenerse, pero debe convivir con la reticula.
- No debe competir con la legibilidad del copy.
- Debe sentirse como energia tecnica contenida dentro del sistema.

### Responsive Behavior

- En desktop la reticula puede ser mas explicita.
- En tablet debe simplificarse.
- En mobile debe reducirse mucho para no contaminar la lectura.

## Technical Direction

- Revisar primero `tokens.css` y `global.css`.
- Si hace falta una nueva primitive reutilizable de reticula, debe crearse en la capa global.
- `hero.css` debe quedarse con reglas locales del hero.
- La implementacion debe evitar duplicar layout sistemico dentro del componente.

## Expected Implementation Shape

1. Crear una primitive global de reticula estructural reutilizable.
2. Aplicarla al hero como marco tecnico del bloque.
3. Definir una zona central limpia para el contenido.
4. Ajustar el espectro inferior para que se integre con la reticula.
5. Simplificar el sistema en breakpoints pequeños.

## Validation

- Revisar legibilidad de headline, subtitle y CTAs.
- Confirmar que la reticula no invade el contenido principal.
- Confirmar que el resultado sigue pareciendo Kmacho.
- Ejecutar `npm run check:tokens`.
- Ejecutar `npm run generate`.
