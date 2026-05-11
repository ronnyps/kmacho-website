<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()

const page = ref(0)

const previewState = reactive({
  navVisible:    false,
  h1Visible:     false,
  imgVisible:    false,
  btnVisible:    false,
  card1Visible:  false,
  card2Visible:  false,
  card3Visible:  false,
  h1Styled:      false,
  cardsStyled:   false,
  btnStyled:     false,
  cardsAnimated: false, // JS: stagger back.out pop
  themeDark:     false, // JS: dark mode toggle
})

const isHovered = ref(false)
const editorRef = ref<HTMLElement | null>(null)
const currentLineIdx = ref(-1)
let pageTimer: ReturnType<typeof setTimeout>
const pending: ReturnType<typeof setTimeout>[] = []

// Line i finishes typing at this ms
const T = (i: number) => (0.3 + i * 0.17) * 1000
// Line i starts typing at this ms (used for scroll timing)
const S = (i: number) => (0.1 + i * 0.17) * 1000

const scrollToLine = (i: number) => {
  const el = editorRef.value
  if (!el) return
  const lineH = 6 * 1.85        // font-size Ã— line-height â‰ˆ 11.1px
  const visible = el.clientHeight
  const top = i * lineH
  el.scrollTop = Math.max(0, top - visible * 0.4)
}

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach(k => ((previewState as Record<string, boolean>)[k] = false))
}

const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const showAll = () => {
  previewState.navVisible = previewState.h1Visible = previewState.imgVisible =
  previewState.btnVisible = previewState.card1Visible = previewState.card2Visible =
  previewState.card3Visible = true
}

const styleAll = () => {
  previewState.h1Styled = previewState.cardsStyled = previewState.btnStyled = true
}

const runPage = (p: number) => {
  reset()
  if (editorRef.value) editorRef.value.scrollTop = 0

  // Cursor y scroll siguen la lÃ­nea activa en tiempo real
  pages[p]?.forEach((_, i) => at(S(i), () => {
    currentLineIdx.value = i
    scrollToLine(i)
  }))

  if (p === 0) {
    // HTML â€” structure builds piece by piece
    at(T(3),  () => previewState.navVisible   = true)
    at(T(5),  () => previewState.h1Visible    = true)
    at(T(6),  () => previewState.imgVisible   = true)
    at(T(7),  () => previewState.btnVisible   = true)
    at(T(10), () => previewState.card1Visible = true)
    at(T(11), () => previewState.card2Visible = true)
    at(T(12), () => previewState.card3Visible = true)
  } else if (p === 1) {
    // CSS â€” structure visible, styles apply when each rule closes
    showAll()
    at(T(2),  () => previewState.h1Styled    = true)
    at(T(7),  () => previewState.cardsStyled = true)
    at(T(16), () => previewState.btnStyled   = true)
  } else {
    // JS â€” todo visible y estilado; cards en pre-animaciÃ³n hasta que el stagger code dispara
    showAll()
    styleAll()
    at(T(9),  () => previewState.cardsAnimated = true)
    at(T(16), () => previewState.themeDark     = true)
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  currentLineIdx.value = -1
  if (editorRef.value) editorRef.value.scrollTop = 0
  showAll()
  styleAll()
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
  isHovered.value = true
  page.value = 0
  runPage(0)
  scheduleNext(0)
}

const onLeave = () => {
  isHovered.value = false
  clearTimeout(pageTimer)
  setStatic()
}

// Prop `active` controla la animaciÃ³n desde el card padre
watch(() => props.active, (val) => {
  if (val) onEnter()
  else onLeave()
})

onMounted(() => setStatic())
onBeforeUnmount(() => { clearTimeout(pageTimer); reset() })

const tabs = ['index.html', 'styles.css', 'app.js']

const pages = [
  // â”€â”€ HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'br',v:'<' },{ c:'tg',v:'!DOCTYPE' },{ c:'at',v:' html' },{ c:'br',v:'>' }],
    [{ c:'br',v:'<' },{ c:'tg',v:'html' },{ c:'at',v:' lang' },{ c:'op',v:'=' },{ c:'st',v:'"en"' },{ c:'br',v:'>' }],
    [{ c:'op',v:'  ' },{ c:'br',v:'<' },{ c:'tg',v:'body' },{ c:'br',v:'>' }],
    [{ c:'op',v:'    ' },{ c:'br',v:'<' },{ c:'tg',v:'nav' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"nav"' },{ c:'br',v:'/>' }],
    [{ c:'op',v:'    ' },{ c:'br',v:'<' },{ c:'tg',v:'section' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"hero"' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'h1' },{ c:'br',v:'>' },{ c:'op',v:'Not an agency.' },{ c:'br',v:'</' },{ c:'tg',v:'h1' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'img' },{ c:'at',v:' src' },{ c:'op',v:'=' },{ c:'st',v:'"hero.jpg"' },{ c:'at',v:' alt' },{ c:'op',v:'=' },{ c:'st',v:'"hero"' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'a' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"btn"' },{ c:'br',v:'>' },{ c:'op',v:'Start â†’' },{ c:'br',v:'</' },{ c:'tg',v:'a' },{ c:'br',v:'>' }],
    [{ c:'op',v:'    ' },{ c:'br',v:'</' },{ c:'tg',v:'section' },{ c:'br',v:'>' }],
    [{ c:'op',v:'    ' },{ c:'br',v:'<' },{ c:'tg',v:'div' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"grid"' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'div' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"card"' },{ c:'br',v:'></' },{ c:'tg',v:'div' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'div' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"card"' },{ c:'br',v:'></' },{ c:'tg',v:'div' },{ c:'br',v:'>' }],
    [{ c:'op',v:'      ' },{ c:'br',v:'<' },{ c:'tg',v:'div' },{ c:'at',v:' class' },{ c:'op',v:'=' },{ c:'st',v:'"card"' },{ c:'br',v:'></' },{ c:'tg',v:'div' },{ c:'br',v:'>' }],
    [{ c:'op',v:'    ' },{ c:'br',v:'</' },{ c:'tg',v:'div' },{ c:'br',v:'>' }],
  ],
  // â”€â”€ CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw',v:'h1' },{ c:'op',v:' {' }],
    [{ c:'pr',v:'  font-size' },{ c:'op',v:': ' },{ c:'vl',v:'4rem' },{ c:'op',v:';' }],
    [{ c:'op',v:'}' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'.grid' },{ c:'op',v:' {' }],
    [{ c:'pr',v:'  display' },{ c:'op',v:': ' },{ c:'vl',v:'grid' },{ c:'op',v:';' }],
    [{ c:'pr',v:'  grid-template-columns' },{ c:'op',v:': ' },{ c:'vl',v:'repeat(3,1fr)' },{ c:'op',v:';' }],
    [{ c:'op',v:'}' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'.card' },{ c:'op',v:' {' }],
    [{ c:'pr',v:'  border-radius' },{ c:'op',v:': ' },{ c:'vl',v:'8px' },{ c:'op',v:';' }],
    [{ c:'pr',v:'  border' },{ c:'op',v:': ' },{ c:'vl',v:'1px solid #e0e0e0' },{ c:'op',v:';' }],
    [{ c:'op',v:'}' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'.btn' },{ c:'op',v:' {' }],
    [{ c:'pr',v:'  background' },{ c:'op',v:': ' },{ c:'vl',v:'#014efe' },{ c:'op',v:';' }],
    [{ c:'pr',v:'  border-radius' },{ c:'op',v:': ' },{ c:'vl',v:'999px' },{ c:'op',v:';' }],
    [{ c:'op',v:'}' }],
  ],
  // â”€â”€ JavaScript â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'fn',v:'gsap' },{ c:'op',v:'.' },{ c:'fn',v:'fromTo' },{ c:'op',v:'(' },{ c:'st',v:"'.card'" },{ c:'op',v:',' }],
    [{ c:'op',v:'  { ' },{ c:'pr',v:'opacity' },{ c:'op',v:': ' },{ c:'nm',v:'0' },{ c:'op',v:', ' },{ c:'pr',v:'y' },{ c:'op',v:': ' },{ c:'nm',v:'32' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'pr',v:'scale' },{ c:'op',v:': ' },{ c:'nm',v:'0.88' },{ c:'op',v:' },' }],
    [{ c:'op',v:'  { ' },{ c:'pr',v:'opacity' },{ c:'op',v:': ' },{ c:'nm',v:'1' },{ c:'op',v:', ' },{ c:'pr',v:'y' },{ c:'op',v:': ' },{ c:'nm',v:'0' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'pr',v:'scale' },{ c:'op',v:': ' },{ c:'nm',v:'1' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'pr',v:'stagger' },{ c:'op',v:': ' },{ c:'nm',v:'0.1' },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'pr',v:'ease' },{ c:'op',v:': ' },{ c:'st',v:"'back.out(1.4)'" },{ c:'op',v:',' }],
    [{ c:'op',v:'    ' },{ c:'pr',v:'duration' },{ c:'op',v:': ' },{ c:'nm',v:'0.55' },{ c:'op',v:' }' }],
    [{ c:'op',v:')' }],
    [{ c:'op',v:'' }],
    [{ c:'kw',v:'const' },{ c:'op',v:' btn = ' },{ c:'fn',v:'document' },{ c:'op',v:'.' },{ c:'fn',v:'querySelector' },{ c:'op',v:'(' },{ c:'st',v:"'.theme-btn'" },{ c:'op',v:')' }],
    [{ c:'fn',v:'btn' },{ c:'op',v:'.' },{ c:'fn',v:'addEventListener' },{ c:'op',v:'(' },{ c:'st',v:"'click'" },{ c:'op',v:', () => {' }],
    [{ c:'op',v:'  ' },{ c:'fn',v:'document' },{ c:'op',v:'.' },{ c:'fn',v:'body' },{ c:'op',v:'.' },{ c:'fn',v:'classList' }],
    [{ c:'op',v:'    .' },{ c:'fn',v:'toggle' },{ c:'op',v:'(' },{ c:'st',v:"'dark'" },{ c:'op',v:')' }],
    [{ c:'op',v:'})' }],
    [{ c:'op',v:'' }],
    [{ c:'op',v:'// âœ¦ theme switched to dark mode' }],
  ],
]

const lineDelay = (i: number) => `${0.1 + i * 0.17}s`
</script>

<template>
  <div
    class="wd"
    :class="{ 'wd--static': !props.active }"
    aria-hidden="true"
  >

    <div class="wd__chrome">
      <div class="wd__dots">
        <span class="wd__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="wd__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="wd__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span v-for="(tab,i) in tabs" :key="tab" class="wd__tab" :class="{'wd__tab--active':i===page}">{{ tab }}</span>
    </div>

    <div class="wd__split">

      <!-- Editor -->
      <div ref="editorRef" class="wd__editor">
        <div :key="page" class="wd__code">
          <div v-for="(line,i) in pages[page]" :key="i" class="wd__cl">
            <span class="wd__cl-inner" :style="`--d:${lineDelay(i)}`">
              <span v-for="(s,j) in line" :key="j" :class="`wd__${s.c}`">{{ s.v }}</span>
            </span>
            <span v-if="i === currentLineIdx" class="wd__cursor">|</span>
          </div>
        </div>
      </div>

      <!-- Preview: dark mode cuando el theme toggle code se escribe -->
      <div class="wd__preview" :class="{'wd__preview--dark': previewState.themeDark}">

        <!-- Nav -->
        <div class="wd__pv-nav" :class="{'wd__pv-nav--in':previewState.navVisible}">
          <div class="wd__pv-logo" />
          <div class="wd__pv-nl-group">
            <div class="wd__pv-nl" /><div class="wd__pv-nl" /><div class="wd__pv-nl" />
          </div>
        </div>

        <!-- Hero section -->
        <div class="wd__pv-hero">
          <div class="wd__pv-h1 wd__pv-h1--a" :class="{'wd__pv-el--in':previewState.h1Visible,'wd__pv-h1--styled':previewState.h1Styled}" />
          <div class="wd__pv-h1 wd__pv-h1--b" :class="{'wd__pv-el--in':previewState.h1Visible,'wd__pv-h1--styled':previewState.h1Styled}" />

          <!-- Wireframe image placeholder -->
          <div class="wd__pv-img" :class="{'wd__pv-el--in':previewState.imgVisible}" />

          <div class="wd__pv-btns">
            <div class="wd__pv-btn wd__pv-btn--p" :class="{'wd__pv-el--in':previewState.btnVisible,'wd__pv-btn--styled':previewState.btnStyled}" />
            <div class="wd__pv-btn" :class="{'wd__pv-el--in':previewState.btnVisible}" />
          </div>
        </div>

        <!-- Grid section -->
        <div
          class="wd__pv-grid"
          :class="{
            'wd__pv-grid--pre':      page === 2 && !previewState.cardsAnimated,
            'wd__pv-grid--animated': previewState.cardsAnimated,
          }"
        >
          <div class="wd__pv-card" :class="{'wd__pv-el--in':previewState.card1Visible,'wd__pv-card--styled':previewState.cardsStyled}" />
          <div class="wd__pv-card" :class="{'wd__pv-el--in':previewState.card2Visible,'wd__pv-card--styled':previewState.cardsStyled}" />
          <div class="wd__pv-card" :class="{'wd__pv-el--in':previewState.card3Visible,'wd__pv-card--styled':previewState.cardsStyled}" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.wd { width:100%; height:100%; display:flex; flex-direction:column; pointer-events:none; user-select:none; }

/* Estado estÃ¡tico: cÃ³digo visible completo, sin typing ni cursor */
.wd--static .wd__cl-inner { animation: none; clip-path: none; }
.wd--static .wd__cursor   { display: none; }

/* Chrome */
.wd__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; gap:0; }
.wd__dots   { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.wd__dot    { display:block; width:6px; height:6px; border-radius:50%; }
.wd__tab    { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; color:var(--solutions-shell-tab-text); padding:0 9px; height:100%; display:flex; align-items:center; transition:color .25s,background .25s; }
.wd__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

/* Split */
.wd__split { flex:1; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; min-height:0; }

/* Editor */
.wd__editor { background:var(--solutions-shell-bg); padding:7px 6px; overflow-y:scroll; scroll-behavior:smooth; scrollbar-width:none; position:relative; border-right:1px solid var(--solutions-shell-separator); }
.wd__editor::-webkit-scrollbar { display:none; }
.wd__code   { display:flex; flex-direction:column; }
.wd__cl      { font-size:6px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; line-height:1.85; display:flex; align-items:baseline; white-space:nowrap; }
.wd__cl-inner { display:inline-block; white-space:nowrap; clip-path:inset(0 100% 0 0); animation:wdType .2s linear var(--d,0s) both; }

.wd__tg { color:var(--solutions-editor-syntax-tag); } .wd__at { color:var(--solutions-editor-syntax-attr); } .wd__br { color:var(--solutions-editor-syntax-neutral); }
.wd__st { color:var(--solutions-editor-syntax-string); } .wd__kw { color:var(--solutions-editor-syntax-keyword); } .wd__pr { color:var(--solutions-editor-syntax-tag); }
.wd__vl { color:var(--solutions-editor-syntax-string); } .wd__fn { color:var(--solutions-editor-syntax-fn); } .wd__nm { color:var(--solutions-editor-syntax-number); }
.wd__op { color:var(--solutions-editor-syntax-neutral); }

/* Cursor inline â€” aparece junto al texto de la lÃ­nea activa, fuera del clip */
.wd__cursor { display:inline; font-size:8px; color:var(--solutions-editor-cursor); font-family:monospace; margin-left:1px; animation:wdBlink .7s ease-in-out infinite; }

@keyframes wdType  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes wdBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Preview â€” dark mode transition */
.wd__preview { background:var(--bg); padding:5px; display:flex; flex-direction:column; gap:4px; overflow:hidden; transition:background .55s ease; }
.wd__preview--dark { background:var(--dark-bg); }
.wd__preview--dark .wd__pv-logo  { background:var(--dark-ink); }
.wd__preview--dark .wd__pv-nl    { background:var(--dark-ink3); }
.wd__preview--dark .wd__pv-nav   { border-bottom-color:var(--dark-border-strong); }
.wd__preview--dark .wd__pv-h1    { background:var(--dark-ink); }
.wd__preview--dark .wd__pv-h1--b { background:var(--dark-ink3); }
.wd__preview--dark .wd__pv-img   { background: linear-gradient(to bottom right,transparent 49%,var(--dark-ink3) 49%,var(--dark-ink3) 51%,transparent 51%), linear-gradient(to bottom left,transparent 49%,var(--dark-ink3) 49%,var(--dark-ink3) 51%,transparent 51%), color-mix(in srgb, var(--dark-bg) 94%, var(--ink) 6%); border-color:var(--dark-border-strong); }
.wd__preview--dark .wd__pv-btn   { border-color:var(--dark-border-strong); }
.wd__preview--dark .wd__pv-card  { background:color-mix(in srgb, var(--dark-bg) 94%, var(--ink) 6%); border-color:var(--dark-border-strong); }

/* Shared appear transition */
.wd__pv-el--in { opacity:1 !important; transform:translateY(0) !important; }

/* Nav */
.wd__pv-nav { display:flex; align-items:center; justify-content:space-between; padding-bottom:3px; border-bottom:1px solid var(--border); opacity:0; transform:translateY(-3px); transition:opacity .28s ease,transform .28s ease,border-color .35s ease; }
.wd__pv-nav--in       { opacity:1; transform:translateY(0); }
.wd__pv-nav--scrolled { border-bottom-color:var(--accent); }
.wd__pv-logo  { width:16px; height:4px; border-radius:2px; background:var(--ink); }
.wd__pv-nl-group { display:flex; gap:3px; }
.wd__pv-nl    { width:9px; height:3px; border-radius:2px; background:var(--border2); }

/* Hero */
.wd__pv-hero { display:flex; flex-direction:column; gap:3px; transition:opacity .45s ease,transform .5s cubic-bezier(.16,1,.3,1); }
.wd__pv-hero--pre { opacity:.3; transform:translateY(7px); }

/* H1 bars: thin+gray â†’ thick+dark when h1Styled */
.wd__pv-h1 { height:4px; border-radius:2px; background:var(--ink3); opacity:0; transform:translateY(3px); transition:opacity .25s ease,transform .25s ease,height .3s ease,background .3s ease; }
.wd__pv-h1--styled { height:6px; background:var(--ink); }
.wd__pv-h1--a { width:82%; }
.wd__pv-h1--b { width:55%; }

/* Wireframe img â€” gray rect with CSS X-diagonal pattern */
.wd__pv-img {
  width:100%;
  height:22px;
  border-radius:3px;
  border:1px solid var(--solutions-ui-border-strong);
  background:
    linear-gradient(to bottom right, transparent 49%, var(--solutions-ui-border-muted) 49%, var(--solutions-ui-border-muted) 51%, transparent 51%),
    linear-gradient(to bottom left,  transparent 49%, var(--solutions-ui-border-muted) 49%, var(--solutions-ui-border-muted) 51%, transparent 51%),
    var(--solutions-ui-surface-soft);
  opacity:0;
  transform:translateY(3px);
  transition:opacity .28s ease,transform .28s ease;
}

/* Buttons */
.wd__pv-btns { display:flex; gap:4px; margin-top:1px; }
.wd__pv-btn  { height:10px; width:30px; border-radius:999px; border:1px solid var(--solutions-ui-border-muted); opacity:0; transform:translateY(3px); transition:opacity .25s ease,transform .25s ease,background .35s ease,border-color .35s ease; }
.wd__pv-btn--p { background:var(--solutions-ui-muted-soft); border-color:var(--solutions-ui-muted-soft); }
.wd__pv-btn--p.wd__pv-btn--styled { background:var(--accent); border-color:var(--accent); }

/* Grid cards */
.wd__pv-grid { display:flex; gap:3px; }
.wd__pv-card { flex:1; height:18px; border-radius:2px; background:var(--solutions-ui-surface-soft); border:1px solid transparent; opacity:0; transform:translateY(3px); transition:opacity .25s ease,transform .25s ease,border-color .35s ease,background .35s ease; }
.wd__pv-card--styled { border-color:var(--solutions-ui-border-strong); background:var(--bg); }

/* JS page: cards in pre-animation state (what gsap fromTo starts from) */
.wd__pv-grid--pre .wd__pv-card { opacity:.25; transform:translateY(10px) scale(.88); }

/* JS page: stagger back.out pop when cardsAnimated fires */
.wd__pv-grid--animated .wd__pv-card                 { animation:cardPop .45s cubic-bezier(.34,1.56,.64,1) both; }
.wd__pv-grid--animated .wd__pv-card:nth-child(2)    { animation-delay:.1s; }
.wd__pv-grid--animated .wd__pv-card:nth-child(3)    { animation-delay:.2s; }

@keyframes cardPop {
  from { opacity:.25; transform:translateY(10px) scale(.88); }
  to   { opacity:1;   transform:translateY(0) scale(1); }
}

/* Reduced motion */
@media (prefers-reduced-motion:reduce) {
  .wd__cl-inner { animation:none; clip-path:none; }
  .wd__cursor   { animation:none; }
  .wd__pv-nav,.wd__pv-h1,.wd__pv-img,.wd__pv-btn,.wd__pv-card,.wd__pv-hero { transition:none; opacity:1; transform:none; }
  .wd__pv-h1 { height:6px; background:var(--ink); }
  .wd__pv-btn--p { background:var(--accent); border-color:var(--accent); }
}
</style>

