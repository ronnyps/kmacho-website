# Site Structure and Style Architecture

## Objetivo

Este documento define como se estructura el sitio y como se reparte la responsabilidad entre `global.css`, `tokens.css` y los estilos por componente. Su objetivo es evitar duplicacion, drift visual y reglas inconsistentes entre secciones.

## Estructura del sitio

### Stack

- Framework: Nuxt 4
- Salida: sitio estatico prerenderizado
- Idiomas: rutas `/` y `/es`
- Estilos: tokens CSS + `global.css` + CSS por componente

### Organizacion principal

- `app/components/hero/`
  Contiene el hero y sus piezas internas.
- `app/components/sections/`
  Contiene las secciones principales de la home.
- `app/components/layout/`
  Contiene elementos de layout compartido como nav y footer.
- `app/assets/css/tokens.css`
  Fuente unica de valores crudos del sistema visual.
- `app/assets/css/global.css`
  Capa sistemica de layout, superficies, tipografia comun, helpers y patrones reutilizables.
- `app/assets/css/components/*.css`
  Capa local. Solo debe contener reglas especificas de cada componente.

## Arquitectura de estilos

### 1. `tokens.css`

Aqui viven exclusivamente:

- colores base
- spacing scale
- radios
- durations y easings
- tamaños tipograficos
- medidas de layout
- gradientes o valores especiales del sistema

Regla:
- Si aparece un valor visual crudo nuevo, primero debe evaluarse si realmente merece existir.
- Si se aprueba, se declara en `tokens.css`.

### 2. `global.css`

Aqui vive el sistema comun del sitio. Ejemplos actuales:

- reset y base HTML/body
- contenedores (`container`, `layout-boundary`)
- shells de seccion (`section-shell`)
- headers de seccion (`section-header`, `section-overline`, `section-title`, `section-subtitle`)
- grids sistemicos (`grid-3`, `grid-4`, `split-grid`)
- superficies (`surface-panel`)
- botones compartidos (`btn-primary`, `btn-ghost`, `btn-inverse`)
- helpers de flujo, stack, cluster y responsive

Regla:
- Si un patron aparece o va a aparecer en mas de un componente, debe vivir en `global.css`.
- `global.css` define layout y primitives del sistema, no decoracion especifica de una seccion concreta.

### 3. CSS por componente

Cada archivo en `app/assets/css/components/` debe encargarse solo de:

- variantes visuales exclusivas del componente
- piezas decorativas unicas
- comportamiento visual que no exista en otro bloque
- tamaños, offsets o animaciones locales no sistemicas

No debe repetir:

- `max-width: var(--max-width)` + `margin-inline: auto`
- shells de seccion ya resueltos por `section-shell`
- headers de seccion ya resueltos por `section-header`
- botones ya resueltos por `btn-primary`, `btn-ghost` o `btn-inverse`
- grids ya resueltos por `grid-3`, `grid-4` o `split-grid`
- estilos base de tipografia o spacing ya cubiertos por utilidades globales

## Flujo obligatorio al crear o tocar una seccion

1. Revisar primero `tokens.css`.
2. Revisar despues `global.css`.
3. Comprobar si el layout o patron ya existe como primitive global.
4. Reutilizar la primitive existente desde el template si encaja.
5. Solo si falta una primitive real del sistema, detenerse y consultar antes de crearla.
6. Solo despues de esa revision se permite escribir CSS local del componente.

## Regla de consulta obligatoria

Si se necesita un estilo nuevo que no encaja claramente en las primitives globales actuales:

- no se introduce automaticamente
- primero se consulta
- despues se decide si:
  - pertenece a `global.css` por ser reutilizable, o
  - pertenece al CSS local por ser una necesidad realmente especifica

## Criterios para decidir `global` vs `componente`

Llevar a `global.css` cuando:

- resuelve layout general
- define ritmo o estructura comun
- aplica a mas de una seccion
- evita repetir 3 o mas reglas en varios archivos
- mejora consistencia del sistema visual

Mantener en CSS local cuando:

- la regla solo existe en un componente
- la regla depende de markup muy particular
- es decoracion propia del bloque
- es una animacion o efecto aislado

## Buenas practicas obligatorias

- No duplicar contexto de estilos dentro del CSS de cada componente.
- No crear shells, headers o botones locales si ya existe equivalente global.
- No meter valores hardcodeados fuera de `tokens.css`.
- No usar `style=""` inline para decisiones visuales.
- No introducir nuevas primitives globales sin validarlas primero.
- Antes de escribir CSS nuevo, intentar resolverlo desde clases globales ya existentes.
- Si un componente necesita demasiadas reglas para repetir una estructura comun, probablemente falta una primitive en `global.css`.

## Checklist antes de cerrar cambios de estilos

- El componente reutiliza primero primitives globales.
- No hay duplicacion obvia con otro CSS de componente.
- No se han añadido valores crudos fuera de `tokens.css`.
- `npm run check:tokens` pasa.
- `npm run generate` pasa.

## Estado actual del sistema

Actualmente el sitio ya usa layout global compartido para:

- boundaries y shells de seccion
- headers de seccion
- grids comunes
- botones principales
- varias estructuras repetidas de la home

La expectativa a partir de ahora es continuar en esa direccion y no volver a empujar contexto sistemico dentro de cada archivo de componente.
