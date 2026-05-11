<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()
const { t } = useI18n()

const page = ref(0)

const previewState = reactive({
  inputVisible:    false,
  queryTyped:      false,
  sendPulse:       false,
  thinkingVisible: false,
  responseVisible: false,
  streaming:       false,
})

let pageTimer: ReturnType<typeof setTimeout>
const pending: ReturnType<typeof setTimeout>[] = []

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach(k => ((previewState as Record<string, boolean>)[k] = false))
}

const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const runPage = (p: number) => {
  reset()

  if (p === 0) {
    // Input aparece â†’ query tipea â†’ send click â†’ thinking
    at(200,  () => previewState.inputVisible  = true)
    at(650,  () => previewState.queryTyped    = true)
    at(1900, () => previewState.sendPulse     = true)
    at(2150, () => { previewState.sendPulse = false; previewState.thinkingVisible = true })
  } else if (p === 1) {
    // Thinking visible â†’ respuesta aparece
    previewState.inputVisible = previewState.queryTyped = previewState.thinkingVisible = true
    at(1800, () => previewState.responseVisible = true)
  } else {
    // Thinking + respuesta visibles â†’ streaming dispara el wow
    previewState.inputVisible = previewState.queryTyped =
    previewState.thinkingVisible = previewState.responseVisible = true
    at(2000, () => previewState.streaming = true)
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  previewState.inputVisible = previewState.queryTyped =
  previewState.thinkingVisible = previewState.responseVisible = true
}

// p0: last at() 2150ms  p1: last at() 1800ms  p2: streaming ends ~3140ms
const pageDelays = [3100, 2700, 3500]

const scheduleNext = (p: number) => {
  pageTimer = setTimeout(() => {
    const next = (p + 1) % 3
    page.value = next
    runPage(next)
    scheduleNext(next)
  }, pageDelays[p])
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
</script>

<template>
  <div class="ai" :class="{'ai--static': !props.active}" aria-hidden="true">

    <!-- Chrome bar -->
    <div class="ai__chrome">
      <div class="ai__dots">
        <span class="ai__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="ai__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="ai__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span class="ai__tab ai__tab--active">ai-chat.tsx</span>
    </div>

    <!-- Chat canvas â€” full height below chrome -->
    <div class="ai__canvas">

      <!-- Response bars (siempre en DOM para que la transiciÃ³n CSS funcione) -->
      <div class="ai__responses">
        <div
          v-for="(w, idx) in ['90%','76%','84%','55%']"
          :key="idx"
          class="ai__rline"
          :class="{
            'ai__pv-el--in':     previewState.responseVisible && !previewState.streaming,
            'ai__rline--stream': previewState.streaming
          }"
          :style="previewState.streaming
            ? `width:${w}; animation-delay:${idx * 0.38}s`
            : `width:${w}; transition-delay:${idx * 0.06}s`"
        />
      </div>

      <!-- Thinking card â€” se desliza arriba y desaparece al hacer streaming -->
      <div
        class="ai__think"
        :class="{
          'ai__think--in':  previewState.thinkingVisible,
          'ai__think--out': previewState.streaming
        }"
      >
        <span class="ai__think-spin" />
        <span class="ai__think-label">{{ t('solutions.items.ai.preview.thinking') }}</span>
      </div>

      <div class="ai__spacer" />

      <!-- Input row -->
      <div
        class="ai__input-row"
        :class="{'ai__pv-el--in': previewState.inputVisible}"
      >
        <div class="ai__input">
          <span v-if="previewState.queryTyped" class="ai__qtext">
            {{ t('solutions.items.ai.preview.query') }}
          </span>
          <span v-else-if="previewState.inputVisible" class="ai__cursor">|</span>
        </div>
        <button class="ai__send" :class="{'ai__send--pulse': previewState.sendPulse}" tabindex="-1">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M1.5 4h5M4 1.5L6.5 4 4 6.5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.ai { width:100%; height:100%; display:flex; flex-direction:column; pointer-events:none; user-select:none; }

/* Chrome */
.ai__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; }
.ai__dots   { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.ai__dot    { display:block; width:6px; height:6px; border-radius:50%; }
.ai__tab    { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; padding:0 9px; height:100%; display:flex; align-items:center; color:var(--solutions-shell-tab-text); }
.ai__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

/* Canvas */
.ai__canvas { flex:1; display:flex; flex-direction:column; padding:8px 8px 6px; background:var(--bg); overflow:hidden; gap:6px; }

/* Shared appear */
.ai__pv-el--in { opacity:1 !important; transform:translateY(0) !important; }

/* Response bars */
.ai__responses { display:flex; flex-direction:column; gap:3px; }
.ai__rline {
  height: 4px;
  border-radius: 2px;
  background: var(--ink2);
  opacity: 0;
  transform: translateY(3px);
  transition: opacity .25s, transform .25s;
}
/* Wow: cada barra se llena de izquierda a derecha */
.ai__rline--stream {
  opacity: 1;
  transform: translateY(0);
  background: var(--accent-cyan);
  animation: aiStream .48s cubic-bezier(.25,1,.5,1) both;
}
@keyframes aiStream {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0%   0 0); }
}

/* Thinking card */
.ai__think {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
  background: var(--surface);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .3s ease, transform .3s ease;
}
.ai__think--in  { opacity: 1; transform: translateY(0); }
.ai__think--out { opacity: 0; transform: translateY(-6px); }

.ai__think-spin {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--surface2);
  border-top-color: var(--accent);
  flex-shrink: 0;
  animation: aiSpin .8s linear infinite;
}
.ai__think-label {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 7px;
  color: var(--ink2);
  white-space: nowrap;
}
@keyframes aiSpin { to { transform: rotate(360deg); } }

/* Spacer */
.ai__spacer { flex: 1; }

/* Input row */
.ai__input-row { display:flex; align-items:center; gap:4px; opacity:0; transform:translateY(3px); transition:opacity .25s,transform .25s; }
.ai__input { flex:1; height:16px; border-radius:var(--radius-sm); border:1px solid var(--border2); background:var(--surface); display:flex; align-items:center; padding:0 6px; overflow:hidden; }

/* Query text â€” se revela de izquierda a derecha */
.ai__qtext {
  font-family: 'SF Mono','Cascadia Code',Menlo,monospace;
  font-size: 6px;
  color: var(--ink2);
  white-space: nowrap;
  clip-path: inset(0 100% 0 0);
  animation: aiStream .9s linear both;
}

/* Cursor parpadeante antes de escribir */
.ai__cursor {
  font-size: 8px;
  color: var(--accent);
  font-family: monospace;
  animation: aiBlink .7s ease-in-out infinite;
}
@keyframes aiBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Send button */
.ai__send {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  flex-shrink: 0;
  transition: transform .15s;
}
.ai__send--pulse { animation: aiSendClick .35s ease; }
@keyframes aiSendClick {
  0%   { transform: scale(1); }
  40%  { transform: scale(.82); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  100% { transform: scale(1); }
}

/* Estado estÃ¡tico: sin animaciones, todo visible */
.ai--static .ai__qtext      { animation: none; clip-path: none; }
.ai--static .ai__cursor     { display: none; }
.ai--static .ai__think-spin { animation: none; }

@media (prefers-reduced-motion: reduce) {
  .ai__qtext, .ai__rline--stream { animation: none; clip-path: none; }
  .ai__cursor, .ai__think-spin, .ai__send--pulse { animation: none; }
  .ai__rline, .ai__input-row, .ai__think { opacity: 1; transform: none; transition: none; }
}
</style>

