# Guia Operativa de Skills del Proyecto

Este archivo define como usar los skills instalados en `/skills` y cuando aplicarlos.

## Prioridad de instrucciones
1. Instruccion directa del usuario.
2. `agent.md` del proyecto.
3. Resto de guias y defaults del sistema.

## Skills disponibles y criterio de uso

### `using-superpowers`
- Usar al inicio de cada conversacion.
- Caso de uso: validar si hay skills aplicables antes de responder o ejecutar acciones.

### `brainstorming`
- Usar antes de trabajo creativo o de diseno (features, componentes, cambios de comportamiento).
- Caso de uso: definir problema, opciones, tradeoffs y diseno aprobado.

### `writing-plans`
- Usar cuando exista un spec/requerimiento multi-paso y aun no haya plan.
- Caso de uso: producir plan detallado por tareas con tests y archivos.

### `executing-plans`
- Usar cuando ya hay un plan escrito y se va a ejecutar paso a paso.
- Caso de uso: ejecucion disciplinada con checkpoints de validacion.

### `subagent-driven-development`
- Usar para ejecutar planes con tareas independientes dentro de la sesion actual.
- Caso de uso: delegacion por tareas con revisiones de cumplimiento y calidad.

### `dispatching-parallel-agents`
- Usar cuando haya 2+ problemas independientes sin dependencias entre si.
- Caso de uso: investigaciones o fixes en paralelo por dominio.

### `test-driven-development`
- Usar para implementar cualquier feature, bugfix o cambio de comportamiento.
- Caso de uso: test que falla primero, implementacion minima despues, refactor al final.

### `systematic-debugging`
- Usar al detectar bugs, fallos de tests o comportamiento inesperado.
- Caso de uso: investigacion de causa raiz antes de proponer fix.

### `requesting-code-review`
- Usar al cerrar tareas importantes, features grandes o antes de merge.
- Caso de uso: revision enfocada en riesgos, regresiones y calidad.

### `context-optimization`
- Usar en sesiones largas o problemas grandes donde el contexto limite precision.
- Caso de uso: resumir, particionar y mantener senales criticas.

### `writing-skills`
- Usar al crear/editar/verificar skills.
- Caso de uso: documentacion de procesos con enfoque de pruebas de comportamiento.

### `copywriting` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: crear copy comercial para home, landings, pricing y paginas de conversion.

### `copy-editing` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: editar copy existente para mejorar claridad, tono, concision y conversion.

### `customer-research` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: analizar entrevistas, encuestas, tickets, reviews y VOC para extraer insights.

### `marketing-psychology` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: aplicar modelos mentales y sesgos cognitivos de forma etica a mensajes y ofertas.

### `programmatic-seo` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: disenar y producir paginas SEO escalables basadas en plantillas y data.

### `seo-audit` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: auditar SEO tecnico/on-page y priorizar acciones para recuperar o crecer trafico.

### `brand-guidelines` (marketing bajo demanda)
- Usar solo bajo demanda explicita del usuario.
- Caso de uso: aplicar lineamientos de marca a contenido, piezas visuales o entregables de marketing.

## Skills de uso obligatorio

1. `using-superpowers` al inicio de cada conversacion.
2. `brainstorming` antes de disenar o construir cambios creativos.
3. `test-driven-development` antes de implementar cualquier cambio funcional.
4. `systematic-debugging` ante cualquier bug o fallo antes de aplicar correcciones.
5. `requesting-code-review` al finalizar trabajo relevante y antes de merge.

## Regla especial para skills de marketing

Los skills de marketing (`copywriting`, `copy-editing`, `customer-research`, `marketing-psychology`, `programmatic-seo`, `seo-audit`, `brand-guidelines`) solo se activan bajo demanda explicita del usuario.

Cada respuesta, entregable o resultado generado con esos skills debe guardarse siempre en una carpeta dedicada para historial futuro:
- Carpeta obligatoria: `docs/marketing-skill-outputs/`
- Formato sugerido de archivo: `YYYY-MM-DD-<skill>-<tema>.md`

## Regla obligatoria de CSS Tokens

Desde este punto, el sistema visual del website se define por tokens y su uso es obligatorio.

Reglas:
1. Todos los estilos deben consumir tokens CSS (`var(--token)`).
2. No se permiten valores hardcodeados en archivos CSS o bloques `<style>`:
   - colores hex/rgb/hsl
   - valores de spacing, radius, border, duration, typography
3. No se permite `style=""` inline en templates para propiedades visuales.
4. La unica excepcion para declarar valores crudos es `app/assets/css/tokens.css`.
5. Cualquier nuevo estilo global debe vivir en `app/assets/css/global.css` o en archivos CSS que tambien consuman tokens.

## Regla obligatoria de arquitectura CSS

Referencia tecnica obligatoria:
- `docs/technical/site-structure-and-style-architecture.md`

Reglas:
1. `app/assets/css/global.css` es la fuente principal de layout sistemico, primitives reutilizables y patrones compartidos.
2. `app/assets/css/components/*.css` solo puede contener estilos especificos del componente.
3. No se permite duplicar contexto de estilos ya resuelto en `global.css` dentro del CSS local del componente.
4. Antes de crear o tocar estilos de un componente, revisar primero `tokens.css` y `global.css`.
5. Antes de crear una nueva primitive global o un nuevo patron visual reusable, consultar al usuario.
6. Si una necesidad puede resolverse con clases globales existentes, se debe reutilizar esa solucion.
7. No reimplementar localmente shells de seccion, headers de seccion, boundaries, grids o botones ya existentes en la capa global.
8. Si aparece repeticion entre 2 o mas componentes, debe evaluarse moverla a `global.css`.

## Reglas de decision rapidas

1. Hay que definir solucion: `brainstorming`.
2. Ya hay diseno/spec: `writing-plans`.
3. Ya hay plan y toca ejecutar: `subagent-driven-development` o `executing-plans`.
4. Hay varios frentes independientes: `dispatching-parallel-agents`.
5. Se implementa codigo: `test-driven-development`.
6. Hay fallo/bug: `systematic-debugging`.
7. Se esta cerrando entrega: `requesting-code-review`.
8. Contexto demasiado grande: `context-optimization`.
9. Se modifican skills: `writing-skills`.
