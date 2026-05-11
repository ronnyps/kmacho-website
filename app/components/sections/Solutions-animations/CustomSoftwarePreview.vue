<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()

const page = ref(0)

const previewState = reactive({
  stage1:     false,   // VALIDATE aparece
  stage2:     false,   // TRANSFORM aparece
  stage3:     false,   // PERSIST aparece
  connectors: false,   // flechas entre stages
  executing:  false,   // pipeline ejecuta en cascada
  expanded:   false,   // split â†’ canvas full (wow)
})

const editorRef = ref<HTMLElement | null>(null)
const currentLineIdx = ref(-1)

let pageTimer: ReturnType<typeof setTimeout>
const pending: ReturnType<typeof setTimeout>[] = []

const T = (i: number) => (0.3 + i * 0.17) * 1000
const S = (i: number) => (0.1 + i * 0.17) * 1000

const scrollToLine = (i: number) => {
  const el = editorRef.value
  if (!el) return
  const lineH = 6 * 1.85
  el.scrollTop = Math.max(0, i * lineH - el.clientHeight * 0.4)
}

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach(k => ((previewState as Record<string, boolean>)[k] = false))
}

const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const showAll = () => {
  previewState.stage1 = previewState.stage2 = previewState.stage3 = true
}

const runPage = (p: number) => {
  reset()
  currentLineIdx.value = -1
  if (editorRef.value) editorRef.value.scrollTop = 0

  pages[p]?.forEach((_, i) => at(S(i), () => {
    currentLineIdx.value = i
    scrollToLine(i)
  }))

  if (p === 0) {
    // Stages aparecen al definir el modelo
    at(T(3),  () => previewState.stage1 = true)
    at(T(6),  () => previewState.stage2 = true)
    at(T(9),  () => previewState.stage3 = true)
  } else if (p === 1) {
    // Connectors entran al definir el pipeline
    showAll()
    at(T(7), () => previewState.connectors = true)
  } else {
    // Pipeline ejecuta, luego split â†’ canvas full (wow)
    showAll()
    previewState.connectors = true
    at(T(4),  () => previewState.executing = true)
    at(2500,  () => previewState.expanded  = true)
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  currentLineIdx.value = -1
  if (editorRef.value) editorRef.value.scrollTop = 0
  showAll()
  previewState.connectors = previewState.executing = previewState.expanded = true
}

const scheduleNext = (p: number) => {
  // p2 tiene expanded a 2500ms + result card: necesita mÃ¡s margen
  const delay = p === 2 ? 3700 : T((pages[p]?.length ?? 1) - 1) + 900
  pageTimer = setTimeout(() => {
    const next = (p + 1) % 3
    page.value = next
    runPage(next)
    scheduleNext(next)
  }, delay)
}

const onEnter = () => {
  page.value = 0
  runPage(0)
  scheduleNext(0)
}

const onLeave = () => {
  clearTimeout(pageTimer)
  setStatic()
}

watch(() => props.active, val => val ? onEnter() : onLeave())
onMounted(() => setStatic())
onBeforeUnmount(() => { clearTimeout(pageTimer); reset() })

const tabs = ['model.ts', 'workflow.ts', 'run.ts']

const pages = [
  // â”€â”€ model.ts â€” dominio custom del cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'interface' },{ c:'op',v:' ' },{ c:'fn',v:'Order' },{ c:'op',v:' {' }],
    [{ c:'op',v:'  id:       ' },{ c:'kw',v:'string' }],
    [{ c:'op',v:'  customer: ' },{ c:'kw',v:'string' }],
    [{ c:'op',v:'  items:    ' },{ c:'fn',v:'Item' },{ c:'op',v:'[]' }],
    [{ c:'op',v:'  status:   ' },{ c:'fn',v:'Status' }],
    [{ c:'op',v:'}' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'type' },{ c:'op',v:' ' },{ c:'fn',v:'Status' },{ c:'op',v:' =' }],
    [{ c:'op',v:'  | ' },{ c:'st',v:'"PENDING"' }],
    [{ c:'op',v:'  | ' },{ c:'st',v:'"RUNNING"' }],
    [{ c:'op',v:'  | ' },{ c:'st',v:'"DONE"' }],
  ],
  // â”€â”€ workflow.ts â€” pipeline de negocio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'const' },{ c:'op',v:' steps: ' },{ c:'fn',v:'Step' },{ c:'op',v:'[] = [' }],
    [{ c:'op',v:'  { id: ' },{ c:'st',v:'"validate"' },{ c:'op',v:',' }],
    [{ c:'op',v:'    run: ' },{ c:'fn',v:'validateOrder' },{ c:'op',v:' },' }],
    [{ c:'op',v:'  { id: ' },{ c:'st',v:'"transform"' },{ c:'op',v:',' }],
    [{ c:'op',v:'    run: ' },{ c:'fn',v:'applyRules' },{ c:'op',v:'    },' }],
    [{ c:'op',v:'  { id: ' },{ c:'st',v:'"persist"' },{ c:'op',v:',' }],
    [{ c:'op',v:'    run: ' },{ c:'fn',v:'saveRecord' },{ c:'op',v:'    },' }],
    [{ c:'op',v:']' }],
  ],
  // â”€â”€ run.ts â€” ejecutar (wow: split â†’ canvas full) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'async function' },{ c:'op',v:' ' },{ c:'fn',v:'run' },{ c:'op',v:'(input) {' }],
    [{ c:'kw',v:'  for' },{ c:'op',v:' (' },{ c:'kw',v:'const' },{ c:'op',v:' step ' },{ c:'kw',v:'of' },{ c:'op',v:' steps) {' }],
    [{ c:'op',v:'    ' },{ c:'kw',v:'await' },{ c:'op',v:' step.' },{ c:'fn',v:'run' },{ c:'op',v:'(input)' }],
    [{ c:'op',v:'  }' }],
    [{ c:'kw',v:'  return' },{ c:'op',v:' { ok: ' },{ c:'kw',v:'true' },{ c:'op',v:' }' }],
    [{ c:'op',v:'}' }],
    [{ c:'op',v:'' }],
    [{ c:'op',v:'// âœ¦ ' },{ c:'fn',v:'pipeline complete' }],
  ],
]

const lineDelay = (i: number) => `${0.1 + i * 0.17}s`
</script>

<template>
  <div class="cs" :class="{'cs--static': !props.active}" aria-hidden="true">

    <div class="cs__chrome">
      <div class="cs__dots">
        <span class="cs__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="cs__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="cs__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span v-for="(tab,i) in tabs" :key="tab" class="cs__tab" :class="{'cs__tab--active': i===page}">{{ tab }}</span>
    </div>

    <!-- Split: editor izquierda, preview derecha.
         Cuando expanded=true, el editor colapsa a 0 y la preview ocupa todo. -->
    <div class="cs__split" :class="{'cs__split--expanded': previewState.expanded}">

      <!-- Editor -->
      <div ref="editorRef" class="cs__editor">
        <div :key="page" class="cs__code">
          <div v-for="(line,i) in pages[page]" :key="i" class="cs__cl">
            <span class="cs__cl-inner" :style="`--d:${lineDelay(i)}`">
              <span v-for="(s,j) in line" :key="j" :class="`cs__${s.c}`">{{ s.v }}</span>
            </span>
            <span v-if="i === currentLineIdx" class="cs__cursor">|</span>
          </div>
        </div>
      </div>

      <!-- Preview: pipeline de pasos custom -->
      <div class="cs__preview">

        <!-- Pipeline horizontal: stages + connectors -->
        <div class="cs__pipeline">

          <div class="cs__stage cs__stage--1" :class="{
            'cs__stage--in':   previewState.stage1,
            'cs__stage--exec': previewState.executing
          }">
            <span class="cs__stage-label">VALIDATE</span>
            <span class="cs__stage-dot" />
          </div>

          <div class="cs__conn" :class="{
            'cs__conn--in':   previewState.connectors,
            'cs__conn--flow': previewState.executing
          }"><span class="cs__flow-dot" /></div>

          <div class="cs__stage cs__stage--2" :class="{
            'cs__stage--in':   previewState.stage2,
            'cs__stage--exec': previewState.executing
          }">
            <span class="cs__stage-label">TRANSFORM</span>
            <span class="cs__stage-dot" />
          </div>

          <div class="cs__conn" :class="{
            'cs__conn--in':   previewState.connectors,
            'cs__conn--flow': previewState.executing
          }"><span class="cs__flow-dot" /></div>

          <div class="cs__stage cs__stage--3" :class="{
            'cs__stage--in':   previewState.stage3,
            'cs__stage--exec': previewState.executing
          }">
            <span class="cs__stage-label">PERSIST</span>
            <span class="cs__stage-dot" />
          </div>

        </div>

        <!-- Result card: solo visible en modo expandido + ejecutando -->
        <div class="cs__result" :class="{'cs__result--in': previewState.expanded && previewState.executing}">
          <span class="cs__result-icon" />
          <span class="cs__result-id">order / KM-2847</span>
          <span class="cs__result-status">COMPLETE</span>
          <span class="cs__result-time">2.1ms</span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.cs { width:100%; height:100%; display:flex; flex-direction:column; pointer-events:none; user-select:none; }
.cs--static .cs__cl-inner { animation:none; clip-path:none; }
.cs--static .cs__cursor   { display:none; }

/* Chrome */
.cs__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; }
.cs__dots   { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.cs__dot    { display:block; width:6px; height:6px; border-radius:50%; }
.cs__tab    { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; color:var(--solutions-shell-tab-text); padding:0 9px; height:100%; display:flex; align-items:center; transition:color .25s,background .25s; }
.cs__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

/* â”€â”€ Split layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   El editor colapsa de 50% â†’ 0% al hacer expand.
   La preview es flex:1 y toma el espacio restante.              */
.cs__split { flex:1; display:flex; overflow:hidden; min-height:0; }

.cs__editor {
  width: 50%;
  flex-shrink: 0;
  overflow: hidden;
  min-width: 0;
  background: var(--solutions-shell-bg);
  padding: 7px 6px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  border-right: 1px solid var(--solutions-shell-separator);
  transition: width .62s var(--ease-out);
}
.cs__editor::-webkit-scrollbar { display:none; }
.cs__split--expanded .cs__editor { width: 0; border-right-width: 0; }

.cs__code  { display:flex; flex-direction:column; }
.cs__cl    { font-size:6px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; line-height:1.85; display:flex; align-items:baseline; white-space:nowrap; }
.cs__cl-inner { display:inline-block; white-space:nowrap; clip-path:inset(0 100% 0 0); animation:csType .2s linear var(--d,0s) both; }

.cs__st { color:var(--solutions-editor-syntax-string); }
.cs__kw { color:var(--solutions-editor-syntax-keyword); }
.cs__fn { color:var(--solutions-editor-syntax-fn); }
.cs__nm { color:var(--solutions-editor-syntax-number); }
.cs__op { color:var(--solutions-editor-syntax-neutral); }

.cs__cursor { display:inline; font-size:8px; color:var(--solutions-editor-cursor); font-family:monospace; margin-left:1px; animation:csBlink .7s ease-in-out infinite; }

@keyframes csType  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes csBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* â”€â”€ Preview panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.cs__preview {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 8px 7px;
  background: var(--bg);
  overflow: hidden;
}

/* â”€â”€ Pipeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.cs__pipeline {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
}

/* Stage: en split mode es un bloque compacto sin label visible.
   En expanded mode el panel es mÃ¡s ancho y el label aparece.     */
.cs__stage {
  flex: 1;
  min-width: 0;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  opacity: 0;
  transform: translateY(4px) scale(.94);
  transition:
    opacity .32s var(--ease-out),
    transform .32s var(--ease-out),
    border-color .45s,
    background .45s,
    box-shadow .45s;
}
.cs__stage--in { opacity:1; transform:translateY(0) scale(1); }
.cs__stage--2 { transition-delay: .08s; }
.cs__stage--3 { transition-delay: .16s; }

/* Label â€” oculto en split, visible cuando el panel se expande */
.cs__stage-label {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5px;
  letter-spacing: .06em;
  color: var(--ink3);
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transition: max-width .5s var(--ease-out), opacity .4s var(--ease-out);
}
.cs__split--expanded .cs__stage-label {
  max-width: 60px;
  opacity: 1;
}

/* Dot de estado dentro del stage */
.cs__stage-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--surface2);
  flex-shrink: 0;
  transition: background .4s, box-shadow .4s;
}

/* Estado ejecutando: cascada con delay */
.cs__stage--exec {
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  background: color-mix(in srgb, var(--accent) 8%, var(--bg));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 10%, transparent);
}
.cs__stage--exec .cs__stage-dot { background: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent); }
.cs__stage--1.cs__stage--exec { transition-delay: 0s; }
.cs__stage--2.cs__stage--exec { transition-delay: .45s; }
.cs__stage--3.cs__stage--exec { transition-delay: .9s; }

/* Connector entre stages */
.cs__conn {
  width: 10px;
  flex-shrink: 0;
  height: 2px;
  background: transparent;
  position: relative;
  transition: background .4s;
}
.cs__conn--in { background: var(--border2); }
.cs__conn--in::after {
  content: '';
  position: absolute;
  right: -2px; top: -2px;
  border: 3px solid transparent;
  border-left-color: var(--border2);
  transition: border-left-color .4s;
}

/* Expanded connector: mÃ¡s ancho y con dot de flujo */
.cs__split--expanded .cs__conn { width: 20px; }
.cs__conn--flow { background: color-mix(in srgb, var(--accent) 35%, transparent); }
.cs__conn--flow::after { border-left-color: color-mix(in srgb, var(--accent) 45%, transparent); }

/* Dot de datos viajando por el connector */
.cs__flow-dot {
  position: absolute;
  top: -2px;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
}
.cs__conn--flow .cs__flow-dot { animation: csFlow 1.1s linear infinite; }
.cs__conn:nth-child(4) .cs__flow-dot { animation-delay: .55s; }

@keyframes csFlow {
  0%   { left: 0%;   opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* â”€â”€ Result card (solo en modo expandido) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.cs__result {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--accent-green) 40%, transparent);
  background: color-mix(in srgb, var(--accent-green) 7%, var(--bg));
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .4s var(--ease-out), transform .4s var(--ease-out);
}
.cs__result--in { opacity:1; transform:translateY(0); }

.cs__result-icon {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--accent-green);
  flex-shrink: 0;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-green) 20%, transparent);
}
.cs__result-id {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5.5px;
  color: var(--ink3);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.cs__result-status {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5.5px;
  letter-spacing: .04em;
  color: var(--accent-green);
  font-weight: 600;
}
.cs__result-time {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5px;
  color: var(--ink3);
}

/* â”€â”€ Estado estÃ¡tico: sin transiciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.cs--static .cs__split   { transition: none; }
.cs--static .cs__editor  { transition: none; }
.cs--static .cs__stage   { transition: none; }
.cs--static .cs__stage-label { transition: none; max-width: 60px; opacity: 1; }
.cs--static .cs__stage-dot   { transition: none; }
.cs--static .cs__conn    { transition: none; }
.cs--static .cs__result  { transition: none; }

@media (prefers-reduced-motion: reduce) {
  .cs__cl-inner  { animation: none; clip-path: none; }
  .cs__cursor    { animation: none; }
  .cs__split     { transition: none; }
  .cs__editor    { transition: none; }
  .cs__stage     { opacity: 1; transform: none; transition: none; }
  .cs__stage-label { max-width: 60px; opacity: 1; transition: none; }
  .cs__conn      { transition: none; }
  .cs__flow-dot  { animation: none; }
  .cs__result    { opacity: 1; transform: none; transition: none; }
}
</style>

