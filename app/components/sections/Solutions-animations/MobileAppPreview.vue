<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()

const page = ref(0)
const currentLineIdx = ref(-1)
const editorRef = ref<HTMLElement | null>(null)

const previewState = reactive({
  headerVisible: false,
  item1Visible:  false,
  item2Visible:  false,
  item3Visible:  false,
  tabbarVisible: false,
  itemsStyled:   false,
  navigating:    false,
})

let pageTimer: ReturnType<typeof setTimeout>
const pending: ReturnType<typeof setTimeout>[] = []

const T = (i: number) => (0.3 + i * 0.17) * 1000
const S = (i: number) => (0.1 + i * 0.17) * 1000

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach(k => ((previewState as Record<string, boolean>)[k] = false))
}

const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const scrollToLine = (i: number) => {
  const el = editorRef.value
  if (!el) return
  const lineH = 6 * 1.85
  el.scrollTop = Math.max(0, i * lineH - el.clientHeight * 0.4)
}

const showAll = () => {
  previewState.headerVisible = previewState.item1Visible = previewState.item2Visible =
  previewState.item3Visible  = previewState.tabbarVisible = true
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
    at(T(4),  () => previewState.headerVisible = true)
    at(T(6),  () => previewState.item1Visible  = true)
    at(T(8),  () => previewState.item2Visible  = true)
    at(T(10), () => previewState.item3Visible  = true)
    at(T(12), () => previewState.tabbarVisible = true)
  } else if (p === 1) {
    showAll()
    at(T(10), () => previewState.itemsStyled = true)
  } else {
    showAll()
    previewState.itemsStyled = true
    at(T(8),  () => previewState.navigating = true)
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  currentLineIdx.value = -1
  if (editorRef.value) editorRef.value.scrollTop = 0
  showAll()
  previewState.itemsStyled = true
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

const tabs = ['App.tsx', 'styles.ts', 'navigator.tsx']

const pages = [
  // â”€â”€ Page 0: JSX structure â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw', v:'import' }, { c:'op', v:' React ' }, { c:'kw', v:'from' }, { c:'st', v:" 'react'" }],
    [{ c:'kw', v:'import' }, { c:'op', v:' { View, Text } ' }, { c:'kw', v:'from' }, { c:'st', v:" 'react-native'" }],
    [{ c:'op', v:'' }],
    [{ c:'kw', v:'export default function' }, { c:'fn', v:' App' }, { c:'op', v:'() {' }],
    [{ c:'op', v:'  return (' }, { c:'tg', v:'<View' }, { c:'at', v:' style' }, { c:'op', v:'=' }, { c:'st', v:'{styles.root}' }, { c:'tg', v:'>' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'<Header' }, { c:'at', v:' title' }, { c:'op', v:'=' }, { c:'st', v:'"Dashboard"' }, { c:'tg', v:' />' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'<ScrollView' }, { c:'tg', v:'>' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'<Item' }, { c:'at', v:' label' }, { c:'op', v:'=' }, { c:'st', v:'"Revenue"' }, { c:'tg', v:' />' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'<Item' }, { c:'at', v:' label' }, { c:'op', v:'=' }, { c:'st', v:'"Users"' }, { c:'tg', v:' />' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'</ScrollView>' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'<Item' }, { c:'at', v:' label' }, { c:'op', v:'=' }, { c:'st', v:'"Growth"' }, { c:'tg', v:' />' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'</ScrollView>' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'<TabBar' }, { c:'tg', v:' />' }],
    [{ c:'tg', v:'  </View>' }, { c:'op', v:' )' }],
    [{ c:'op', v:'}' }],
  ],
  // â”€â”€ Page 1: StyleSheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw', v:'const' }, { c:'op', v:' styles = ' }, { c:'fn', v:'StyleSheet' }, { c:'op', v:'.' }, { c:'fn', v:'create' }, { c:'op', v:'({' }],
    [{ c:'pr', v:'  root' }, { c:'op', v:': {' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'flex' }, { c:'op', v:': ' }, { c:'nm', v:'1' }, { c:'op', v:',' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'backgroundColor' }, { c:'op', v:': ' }, { c:'st', v:"'#fafafa'" }, { c:'op', v:',' }],
    [{ c:'op', v:'  },' }],
    [{ c:'pr', v:'  header' }, { c:'op', v:': {' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'paddingTop' }, { c:'op', v:': ' }, { c:'nm', v:'48' }, { c:'op', v:',' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'paddingHorizontal' }, { c:'op', v:': ' }, { c:'nm', v:'20' }, { c:'op', v:',' }],
    [{ c:'op', v:'  },' }],
    [{ c:'pr', v:'  item' }, { c:'op', v:': {' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'borderRadius' }, { c:'op', v:': ' }, { c:'nm', v:'12' }, { c:'op', v:',' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'padding' }, { c:'op', v:': ' }, { c:'nm', v:'14' }, { c:'op', v:',' }],
    [{ c:'op', v:'    ' }, { c:'pr', v:'marginBottom' }, { c:'op', v:': ' }, { c:'nm', v:'8' }, { c:'op', v:',' }],
    [{ c:'op', v:'  },' }],
    [{ c:'op', v:'})' }],
  ],
  // â”€â”€ Page 2: Navigator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  [
    [{ c:'kw', v:'const' }, { c:'op', v:' Stack = ' }, { c:'fn', v:'createNativeStackNavigator' }, { c:'op', v:'()' }],
    [{ c:'op', v:'' }],
    [{ c:'kw', v:'function' }, { c:'fn', v:' Navigation' }, { c:'op', v:'() {' }],
    [{ c:'op', v:'  return (' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'<Stack.Navigator>' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'<Stack.Screen' }],
    [{ c:'op', v:'        ' }, { c:'at', v:'name' }, { c:'op', v:'=' }, { c:'st', v:'"Dashboard"' }],
    [{ c:'op', v:'        ' }, { c:'at', v:'component' }, { c:'op', v:' =' }, { c:'fn', v:' Dashboard' }],
    [{ c:'op', v:'        ' }, { c:'at', v:'options' }, { c:'op', v:'={{ ' }, { c:'pr', v:'headerShown' }, { c:'op', v:': ' }, { c:'nm', v:'false' }, { c:'op', v:' }}' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'/>' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'<Stack.Screen' }],
    [{ c:'op', v:'        ' }, { c:'at', v:'name' }, { c:'op', v:'=' }, { c:'st', v:'"Detail"' }],
    [{ c:'op', v:'        ' }, { c:'at', v:'component' }, { c:'op', v:' =' }, { c:'fn', v:' Detail' }],
    [{ c:'op', v:'      ' }, { c:'tg', v:'/>' }],
    [{ c:'op', v:'    ' }, { c:'tg', v:'</Stack.Navigator>' }],
  ],
]

const lineDelay = (i: number) => `${0.1 + i * 0.17}s`
</script>

<template>
  <div class="mp" :class="{'mp--static': !props.active}" aria-hidden="true">

    <!-- Chrome -->
    <div class="mp__chrome">
      <div class="mp__dots">
        <span class="mp__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="mp__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="mp__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span v-for="(tab, i) in tabs" :key="tab" class="mp__tab" :class="{'mp__tab--active': i === page}">{{ tab }}</span>
    </div>

    <!-- CÃ³digo: fondo completo -->
    <div class="mp__content">
      <div ref="editorRef" class="mp__editor">
        <div :key="page" class="mp__code">
          <div v-for="(line, i) in pages[page]" :key="i" class="mp__cl">
            <span class="mp__cl-inner" :style="`--d:${lineDelay(i)}`">
              <span v-for="(s, j) in line" :key="j" :class="`mp__${s.c}`">{{ s.v }}</span>
            </span>
            <span v-if="i === currentLineIdx" class="mp__cursor">|</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TelÃ©fono: hijo directo de mp, independiente del editor -->
      <div class="mp__phone-float">
        <div class="mp__phone-outer">

          <!-- Volume buttons (left) -->
          <div class="mp__btn mp__btn--vol-up" />
          <div class="mp__btn mp__btn--vol-dn" />
          <!-- Power button (right) -->
          <div class="mp__btn mp__btn--pow" />

          <!-- Screen -->
          <div class="mp__phone">
            <!-- Notch / Dynamic Island -->
            <div class="mp__notch" />

            <!-- Status bar -->
            <div class="mp__status">
              <span class="mp__status-time">9:41</span>
              <div class="mp__status-icons">
                <span class="mp__sicon" /><span class="mp__sicon" /><span class="mp__sicon" />
              </div>
            </div>

            <!-- App content -->
            <div class="mp__app" :key="`app-${page}`">
              <div class="mp__header" :class="{'mp__el--in': previewState.headerVisible}">
                <div class="mp__header-title" />
                <div class="mp__header-sub" />
              </div>

              <div class="mp__items">
                <div
                  v-for="(_, idx) in 3"
                  :key="idx"
                  class="mp__item"
                  :class="{
                    'mp__el--in':       [previewState.item1Visible, previewState.item2Visible, previewState.item3Visible][idx],
                    'mp__item--styled': previewState.itemsStyled,
                  }"
                >
                  <div class="mp__item-avatar" />
                  <div class="mp__item-lines">
                    <div class="mp__item-line mp__item-line--a" />
                    <div class="mp__item-line mp__item-line--b" />
                  </div>
                  <div class="mp__item-val" />
                </div>
              </div>

              <!-- Navigation push â€” slide in del JS page -->
              <div class="mp__nav-push" :class="{'mp__nav-push--in': previewState.navigating}">
                <div class="mp__push-header">
                  <div class="mp__push-back">â€¹</div>
                  <div class="mp__push-title" />
                </div>
                <div class="mp__push-card" />
                <div class="mp__push-row" />
                <div class="mp__push-row mp__push-row--b" />
              </div>
            </div>

            <!-- Tab bar -->
            <div class="mp__tabbar" :class="{'mp__el--in': previewState.tabbarVisible}">
              <div v-for="n in 4" :key="n" class="mp__tabbi" :class="{'mp__tabbi--active': n === 1}" />
            </div>

            <!-- Home indicator -->
            <div class="mp__home-ind" />
          </div>

        </div>
      </div>

  </div>
</template>


<style scoped>
/* position: relative â†’ el telÃ©fono se posiciona respecto al componente completo */
.mp { width:100%; height:100%; display:flex; flex-direction:column; position:relative; overflow:visible; pointer-events:none; user-select:none; }

/* Static: code visible, no animation */
.mp--static .mp__cl-inner { animation:none; clip-path:none; }
.mp--static .mp__cursor   { display:none; }

/* Chrome */
.mp__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; gap:0; }
.mp__dots   { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.mp__dot    { display:block; width:6px; height:6px; border-radius:50%; }
.mp__tab    { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; color:var(--solutions-shell-tab-text); padding:0 9px; height:100%; display:flex; align-items:center; transition:color .25s,background .25s; }
.mp__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

/* Contenedor: cÃ³digo como fondo, telÃ©fono flotando */
.mp__content { flex:1; position:relative; overflow:hidden; min-height:0; }

/* Editor ocupa todo el fondo */
.mp__editor { position:absolute; inset:0; background:var(--solutions-shell-bg); padding:7px 6px; overflow-y:scroll; scroll-behavior:smooth; scrollbar-width:none; }
.mp__editor::-webkit-scrollbar { display:none; }

/* TelÃ©fono: absolute respecto a .mp (todo el componente, incluido chrome)
   Puede salirse ligeramente â€” el card-preview lo clipea con su border-radius */
.mp__phone-float {
  position: absolute;
  right: 30px;
  top: 6px;
  z-index: 10;
  filter: drop-shadow(0 8px 24px color-mix(in srgb, var(--ink) 85%, transparent));
}
.mp__code   { display:flex; flex-direction:column; }
.mp__cl     { font-size:6px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; line-height:1.85; display:flex; align-items:baseline; white-space:nowrap; }
.mp__cl-inner { display:inline-block; white-space:nowrap; clip-path:inset(0 100% 0 0); animation:mpType .2s linear var(--d,0s) both; }
.mp__cursor { display:inline; font-size:8px; color:var(--solutions-editor-cursor); font-family:monospace; margin-left:1px; animation:mpBlink .7s ease-in-out infinite; }

/* Syntax */
.mp__kw { color:var(--solutions-editor-syntax-keyword); } .mp__fn { color:var(--solutions-editor-syntax-fn); } .mp__tg { color:var(--solutions-editor-syntax-tag); }
.mp__at { color:var(--solutions-editor-syntax-attr); } .mp__st { color:var(--solutions-editor-syntax-string); } .mp__pr { color:var(--solutions-editor-syntax-tag); }
.mp__nm { color:var(--solutions-editor-syntax-number); } .mp__op { color:var(--solutions-editor-syntax-neutral); }

@keyframes mpType  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes mpBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* â”€â”€ Phone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* Outer mÃ¡s grande â€” se clipea naturalmente por el container */
.mp__phone-outer {
  position: relative;
  width: 100px;
  height: 196px;
}

.mp__btn { position:absolute; background:var(--solutions-ui-ink-subtle); border-radius:2px; }
.mp__btn--vol-up { left:-3px; top:30px;  width:2.5px; height:9px; }
.mp__btn--vol-dn { left:-3px; top:43px;  width:2.5px; height:9px; }
.mp__btn--pow    { right:-3px; top:38px; width:2.5px; height:18px; }

/* Pantalla */
.mp__phone {
  position: absolute;
  inset: 0;
  border: 2px solid var(--solutions-ui-ink-dim);
  border-radius: 20px;
  background: var(--solutions-ui-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Notch / Dynamic Island */
.mp__notch {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 7px;
  background: var(--solutions-ui-night);
  border-radius: 999px;
  z-index: 10;
}

/* Status bar â€” mÃ¡s padding top para respetar el notch */
.mp__status { display:flex; align-items:center; justify-content:space-between; padding:14px 8px 3px; flex-shrink:0; }
.mp__status-time { font-size:4.5px; font-family:monospace; color:var(--ink); font-weight:700; }
.mp__status-icons { display:flex; gap:2px; }
.mp__sicon { display:block; width:4px; height:3px; border-radius:1px; background:var(--ink); opacity:.5; }

/* Home indicator */
.mp__home-ind {
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mp__home-ind::after {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--ink);
  border-radius: 1px;
  opacity: .25;
}

/* App content */
.mp__app { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; }

/* Shared appear */
.mp__el--in { opacity:1 !important; transform:translateY(0) !important; }

/* Header */
.mp__header { padding:5px 5px 4px; opacity:0; transform:translateY(-3px); transition:opacity .25s ease,transform .25s ease; flex-shrink:0; }
.mp__header-title { height:5px; width:60%; background:var(--ink); border-radius:2px; margin-bottom:2px; }
.mp__header-sub   { height:3px; width:40%; background:var(--solutions-ui-muted); border-radius:2px; }

/* List items */
.mp__items { flex:1; padding:3px 5px; display:flex; flex-direction:column; gap:3px; }

.mp__item {
  display:flex; align-items:center; gap:4px;
  padding:4px 3px;
  border-radius:4px;
  background:var(--solutions-ui-cream);
  opacity:0; transform:translateY(4px);
  transition:opacity .25s ease,transform .25s ease,border-radius .3s ease,background .3s ease,padding .3s ease;
}
.mp__item--styled { border-radius:8px; background:var(--solutions-ui-surface); border:1px solid var(--solutions-ui-border-soft); padding:5px 4px; }

.mp__item-avatar { width:12px; height:12px; border-radius:50%; background:var(--solutions-ui-border-muted); flex-shrink:0; }
.mp__item-lines  { flex:1; display:flex; flex-direction:column; gap:2px; }
.mp__item-line   { height:3px; border-radius:1px; background:var(--ink); }
.mp__item-line--a { width:80%; }
.mp__item-line--b { width:55%; background:var(--solutions-ui-muted); }
.mp__item-val    { width:12px; height:5px; border-radius:2px; background:var(--accent); opacity:.7; flex-shrink:0; }

/* Navigation push overlay */
.mp__nav-push {
  position:absolute; inset:0;
  background:var(--solutions-ui-surface);
  transform:translateX(100%);
  transition:transform .4s cubic-bezier(.25,.46,.45,.94);
  display:flex; flex-direction:column; padding:5px;
  gap:4px;
}
.mp__nav-push--in { transform:translateX(0); }

.mp__push-header { display:flex; align-items:center; gap:4px; margin-bottom:2px; }
.mp__push-back   { font-size:8px; color:var(--accent); }
.mp__push-title  { height:5px; width:50%; background:var(--ink); border-radius:2px; }
.mp__push-card   { height:28px; background:var(--solutions-ui-cream); border-radius:6px; border:1px solid var(--solutions-ui-border-soft); }
.mp__push-row    { height:6px; background:var(--solutions-ui-border-soft); border-radius:3px; width:85%; }
.mp__push-row--b { width:65%; }

/* Tab bar */
.mp__tabbar {
  display:flex; justify-content:space-around; align-items:center;
  height:14px; border-top:1px solid var(--solutions-ui-surface-soft);
  flex-shrink:0; background:var(--solutions-ui-surface);
  opacity:0; transform:translateY(3px);
  transition:opacity .25s ease,transform .25s ease;
}
.mp__tabbi { width:10px; height:7px; border-radius:2px; background:var(--solutions-ui-border-muted); }
.mp__tabbi--active { background:var(--accent); }

/* Reduced motion */
@media (prefers-reduced-motion:reduce) {
  .mp__cl-inner,.mp__cursor { animation:none; }
  .mp__cl-inner { clip-path:none; }
  .mp__el--in,.mp__header,.mp__item,.mp__tabbar { opacity:1; transform:none; }
  .mp__nav-push--in { transform:none; }
}
</style>

