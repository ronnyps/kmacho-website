<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()

const page = ref(0)

const previewState = reactive({
  card1Visible: false,   // TEMP
  card2Visible: false,   // NRGY
  card3Visible: false,   // FLOW
  bar1:         false,
  bar2:         false,
  bar3:         false,
  threshold:    false,
  alert:        false,   // TEMP cruza umbral
  relay:        false,   // RELAY â†’ ACTIVE (wow)
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
  previewState.card1Visible = previewState.card2Visible = previewState.card3Visible = true
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
    // Sensor cards aparecen al suscribir cada topic
    at(T(8),  () => previewState.card1Visible = true)
    at(T(9),  () => previewState.card2Visible = true)
    at(T(10), () => previewState.card3Visible = true)
  } else if (p === 1) {
    // Cada barra se llena cuando se escribe su valor mÃ¡ximo
    showAll()
    at(T(2),  () => previewState.bar1 = true)
    at(T(6),  () => previewState.bar2 = true)
    at(T(10), () => previewState.bar3 = true)
    at(T(13), () => previewState.threshold = true)
  } else {
    // Todo listo â†’ umbral cruzado â†’ relay activa (wow)
    showAll()
    previewState.bar1 = previewState.bar2 = previewState.bar3 = previewState.threshold = true
    at(T(8),  () => previewState.alert = true)
    at(T(11), () => previewState.relay = true)
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  currentLineIdx.value = -1
  if (editorRef.value) editorRef.value.scrollTop = 0
  showAll()
  previewState.bar1 = previewState.bar2 = previewState.bar3 =
  previewState.threshold = previewState.alert = previewState.relay = true
}

const scheduleNext = (p: number) => {
  pageTimer = setTimeout(() => {
    const next = (p + 1) % 3
    page.value = next
    runPage(next)
    scheduleNext(next)
  }, T((pages[p]?.length ?? 1) - 1) + 900)
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

const tabs = ['subscribe.py', 'rules.py', 'trigger.py']

const pages = [
  // â”€â”€ subscribe.py â€” conectar y suscribir sensores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'from' },{ c:'op',v:' mqtt ' },{ c:'kw',v:'import' },{ c:'fn',v:' connect' }],
    [{ c:'op',v:'' }],
    [{ c:'op',v:'client = ' },{ c:'fn',v:'connect' },{ c:'op',v:'(' }],
    [{ c:'op',v:'  host=' },{ c:'st',v:'"iot.broker"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  port=' },{ c:'nm',v:'1883' }],
    [{ c:'op',v:')' }],
    [{ c:'op',v:'' }],
    [{ c:'op',v:'client.' },{ c:'fn',v:'subscribe' },{ c:'op',v:'([' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"sensors/temp"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"sensors/energy"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"sensors/flow"' },{ c:'op',v:',' }],
    [{ c:'op',v:'])' }],
  ],
  // â”€â”€ rules.py â€” definir reglas y umbrales â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'fn',v:'RULES' },{ c:'op',v:' = {' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"temp"' },{ c:'op',v:': {' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"max"' },{ c:'op',v:':  ' },{ c:'nm',v:'78.5' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"unit"' },{ c:'op',v:': ' },{ c:'st',v:'"Â°C"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  },' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"energy"' },{ c:'op',v:': {' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"max"' },{ c:'op',v:':  ' },{ c:'nm',v:'4200' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"unit"' },{ c:'op',v:': ' },{ c:'st',v:'"W"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  },' }],
    [{ c:'op',v:'  ' },{ c:'st',v:'"flow"' },{ c:'op',v:': {' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"min"' },{ c:'op',v:':   ' },{ c:'nm',v:'0.8' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'st',v:'"unit"' },{ c:'op',v:': ' },{ c:'st',v:'"L/s"' },{ c:'op',v:',' }],
    [{ c:'op',v:'  },' }],
    [{ c:'op',v:'}' }],
  ],
  // â”€â”€ trigger.py â€” evaluar y disparar acciÃ³n (wow) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'def' },{ c:'op',v:' ' },{ c:'fn',v:'on_message' },{ c:'op',v:'(msg):' }],
    [{ c:'op',v:'  sensor = msg.topic' }],
    [{ c:'op',v:'    .' },{ c:'fn',v:'split' },{ c:'op',v:'(' },{ c:'st',v:'"/"' },{ c:'op',v:')[' },{ c:'nm',v:'1' },{ c:'op',v:']' }],
    [{ c:'op',v:'  value  = ' },{ c:'fn',v:'float' },{ c:'op',v:'(' }],
    [{ c:'op',v:'    msg.payload' }],
    [{ c:'op',v:'  )' }],
    [{ c:'op',v:'  rule   = ' },{ c:'fn',v:'RULES' },{ c:'op',v:'[sensor]' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'  if' },{ c:'op',v:' value > rule[' },{ c:'st',v:'"max"' },{ c:'op',v:']:' }],
    [{ c:'op',v:'    ' },{ c:'fn',v:'trigger' },{ c:'op',v:'(' }],
    [{ c:'op',v:'      rule[' },{ c:'st',v:'"action"' },{ c:'op',v:']' }],
    [{ c:'op',v:'    )' }],
    [{ c:'op',v:'' }],
    [{ c:'op',v:'# âœ¦ ' },{ c:'fn',v:'RELAY â†’ ACTIVE' }],
  ],
]

const lineDelay = (i: number) => `${0.1 + i * 0.17}s`
</script>

<template>
  <div class="iot" :class="{'iot--static': !props.active}" aria-hidden="true">

    <div class="iot__chrome">
      <div class="iot__dots">
        <span class="iot__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="iot__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="iot__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span v-for="(tab,i) in tabs" :key="tab" class="iot__tab" :class="{'iot__tab--active': i===page}">{{ tab }}</span>
    </div>

    <div class="iot__split">

      <!-- Editor -->
      <div ref="editorRef" class="iot__editor">
        <div :key="page" class="iot__code">
          <div v-for="(line,i) in pages[page]" :key="i" class="iot__cl">
            <span class="iot__cl-inner" :style="`--d:${lineDelay(i)}`">
              <span v-for="(s,j) in line" :key="j" :class="`iot__${s.c}`">{{ s.v }}</span>
            </span>
            <span v-if="i === currentLineIdx" class="iot__cursor">|</span>
          </div>
        </div>
      </div>

      <!-- Preview: sensor dashboard -->
      <div class="iot__preview">

        <!-- Sensor cards -->
        <div class="iot__sensors">

          <!-- TEMP â€” card que dispara el alert -->
          <div
            class="iot__card"
            :class="{
              'iot__pv-el--in':   previewState.card1Visible,
              'iot__card--alert': previewState.alert
            }"
          >
            <span class="iot__dot-s" :class="{'iot__dot-s--alert': previewState.alert}" />
            <span class="iot__lbl">TEMP</span>
            <div class="iot__track">
              <div
                class="iot__fill"
                :style="{
                  width: previewState.alert ? '94%' : previewState.bar1 ? '72%' : '8%',
                  background: previewState.alert ? 'var(--accent-red)' : undefined
                }"
              />
              <div class="iot__mark" :class="{'iot__mark--in': previewState.threshold}" style="left:80%" />
            </div>
          </div>

          <!-- NRGY -->
          <div class="iot__card" :class="{'iot__pv-el--in': previewState.card2Visible}">
            <span class="iot__dot-s" />
            <span class="iot__lbl">NRGY</span>
            <div class="iot__track">
              <div class="iot__fill" :style="{ width: previewState.bar2 ? '58%' : '8%' }" />
              <div class="iot__mark" :class="{'iot__mark--in': previewState.threshold}" style="left:75%" />
            </div>
          </div>

          <!-- FLOW -->
          <div class="iot__card" :class="{'iot__pv-el--in': previewState.card3Visible}">
            <span class="iot__dot-s" />
            <span class="iot__lbl">FLOW</span>
            <div class="iot__track">
              <div class="iot__fill" :style="{ width: previewState.bar3 ? '45%' : '8%' }" />
              <div class="iot__mark" :class="{'iot__mark--in': previewState.threshold}" style="left:32%" />
            </div>
          </div>
        </div>

        <div class="iot__spacer" />

        <!-- RELAY card â€” aparece cuando el trigger dispara -->
        <div
          class="iot__relay"
          :class="{
            'iot__relay--in':     previewState.relay,
            'iot__relay--active': previewState.relay
          }"
        >
          <span class="iot__relay-lbl">RELAY 01</span>
          <span class="iot__relay-state" :class="{'iot__relay-state--on': previewState.relay}">
            {{ previewState.relay ? 'ACTIVE' : 'IDLE' }}
          </span>
          <div class="iot__toggle" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.iot { width:100%; height:100%; display:flex; flex-direction:column; pointer-events:none; user-select:none; }
.iot--static .iot__cl-inner { animation:none; clip-path:none; }
.iot--static .iot__cursor   { display:none; }

/* Chrome */
.iot__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; }
.iot__dots   { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.iot__dot    { display:block; width:6px; height:6px; border-radius:50%; }
.iot__tab    { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; color:var(--solutions-shell-tab-text); padding:0 9px; height:100%; display:flex; align-items:center; transition:color .25s,background .25s; }
.iot__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

/* Split */
.iot__split { flex:1; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; min-height:0; }

/* Editor */
.iot__editor { background:var(--solutions-shell-bg); padding:7px 6px; overflow-y:scroll; scroll-behavior:smooth; scrollbar-width:none; border-right:1px solid var(--solutions-shell-separator); }
.iot__editor::-webkit-scrollbar { display:none; }
.iot__code   { display:flex; flex-direction:column; }
.iot__cl     { font-size:6px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; line-height:1.85; display:flex; align-items:baseline; white-space:nowrap; }
.iot__cl-inner { display:inline-block; white-space:nowrap; clip-path:inset(0 100% 0 0); animation:iotType .2s linear var(--d,0s) both; }

.iot__st { color:var(--solutions-editor-syntax-string); }
.iot__kw { color:var(--solutions-editor-syntax-keyword); }
.iot__fn { color:var(--solutions-editor-syntax-fn); }
.iot__nm { color:var(--solutions-editor-syntax-number); }
.iot__op { color:var(--solutions-editor-syntax-neutral); }

.iot__cursor { display:inline; font-size:8px; color:var(--solutions-editor-cursor); font-family:monospace; margin-left:1px; animation:iotBlink .7s ease-in-out infinite; }

@keyframes iotType  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes iotBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Preview panel */
.iot__preview {
  padding: 7px 6px 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-cyan) 9%, transparent), transparent 55%),
    var(--bg);
}

/* Shared appear */
.iot__pv-el--in { opacity:1 !important; transform:translateY(0) !important; }

/* Sensor cards */
.iot__sensors { display:flex; flex-direction:column; gap:3px; }
.iot__card {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg);
  opacity: 0;
  transform: translateY(3px);
  transition: opacity .25s var(--ease-out), transform .25s var(--ease-out), border-color .4s, background .4s;
}
.iot__card--alert {
  border-color: color-mix(in srgb, var(--accent-red) 42%, transparent);
  background: color-mix(in srgb, var(--accent-red) 5%, var(--bg));
}

/* Status dot */
.iot__dot-s {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--accent-green);
  flex-shrink: 0;
  transition: background .4s;
}
.iot__dot-s--alert {
  background: var(--accent-red);
  animation: iotDotPulse .9s ease-in-out infinite;
}
@keyframes iotDotPulse {
  0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-red) 38%, transparent); }
  50%     { box-shadow: 0 0 0 3px transparent; }
}

/* Label */
.iot__lbl {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5.5px;
  letter-spacing: .04em;
  color: var(--ink3);
  width: 22px;
  flex-shrink: 0;
  transition: color .4s;
}
.iot__card--alert .iot__lbl { color: var(--accent-red); }

/* Bar track */
.iot__track {
  flex: 1;
  height: 4px;
  background: var(--surface2);
  border-radius: var(--radius-pill);
  position: relative;
}
.iot__fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--accent-cyan) 75%, var(--accent));
  width: 8%;
  transition: width .85s var(--ease-out), background .4s;
}

/* Threshold marker */
.iot__mark {
  position: absolute;
  top: -2px; bottom: -2px;
  width: 1.5px;
  border-radius: 1px;
  background: var(--accent-amber);
  opacity: 0;
  transition: opacity .35s;
}
.iot__mark--in { opacity: 1; }

/* Spacer */
.iot__spacer { flex: 1; min-height: 4px; }

/* RELAY card */
.iot__relay {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
  background: var(--bg);
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .35s var(--ease-out), transform .35s var(--ease-out), border-color .5s, background .5s;
}
.iot__relay--in { opacity: 1; transform: translateY(0); }
.iot__relay--active {
  border-color: color-mix(in srgb, var(--accent-green) 45%, transparent);
  background: color-mix(in srgb, var(--accent-green) 8%, var(--bg));
}

.iot__relay-lbl {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5.5px;
  letter-spacing: .04em;
  color: var(--ink3);
}
.iot__relay-state {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 5.5px;
  letter-spacing: .04em;
  color: var(--ink3);
  flex: 1;
  text-align: right;
  transition: color .45s;
}
.iot__relay-state--on { color: var(--accent-green); }

/* Toggle switch */
.iot__toggle {
  width: 20px; height: 10px;
  border-radius: var(--radius-pill);
  background: var(--surface2);
  position: relative;
  flex-shrink: 0;
  transition: background .45s var(--ease-out);
}
.iot__relay--active .iot__toggle { background: var(--accent-green); }
.iot__toggle::after {
  content: '';
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--solutions-ui-surface);
  top: 1px; left: 1px;
  transition: transform .45s var(--ease-out);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--ink) 18%, transparent);
}
.iot__relay--active .iot__toggle::after { transform: translateX(10px); }

/* Static: desactiva todas las transiciones */
.iot--static .iot__card,
.iot--static .iot__dot-s,
.iot--static .iot__lbl,
.iot--static .iot__fill,
.iot--static .iot__mark,
.iot--static .iot__relay,
.iot--static .iot__relay-lbl,
.iot--static .iot__relay-state,
.iot--static .iot__toggle { transition:none; }
.iot--static .iot__dot-s--alert { animation:none; }

@media (prefers-reduced-motion: reduce) {
  .iot__cl-inner          { animation:none; clip-path:none; }
  .iot__cursor            { animation:none; }
  .iot__card, .iot__relay { opacity:1; transform:none; transition:none; }
  .iot__fill, .iot__mark, .iot__toggle, .iot__dot-s { transition:none; }
  .iot__dot-s--alert      { animation:none; }
}
</style>

