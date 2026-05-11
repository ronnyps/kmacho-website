<script setup lang="ts">
const props = defineProps<{ active?: boolean }>()

const page = ref(0)

const previewState = reactive({
  // Page 0: classic layout grid (12 cols)
  gridVisible: false,
  // Pages 1/2: keep grid but softer
  gridSoft: false,
  // Page 0 phase 1: guide containers
  navGuide: false,
  heroGuide: false,
  btnGuide: false,
  cardsGuide: false,
  // Page 0 phase 2 + pages 1/2
  navVisible: false,
  heroVisible: false,
  btnVisible: false,
  card1Visible: false,
  card2Visible: false,
  card3Visible: false,
  // Page 1: refinement
  refined: false,
  // Page 2: themed snap
  navThemed: false,
  heroThemed: false,
  btnThemed: false,
  cardsThemed: false,
})

let pageTimer: ReturnType<typeof setTimeout>
const pending: ReturnType<typeof setTimeout>[] = []

const reset = () => {
  pending.forEach(clearTimeout)
  pending.length = 0
  Object.keys(previewState).forEach((k) => ((previewState as Record<string, boolean>)[k] = false))
}

const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

const showAll = () => {
  previewState.gridVisible = true
  previewState.navVisible = previewState.heroVisible = previewState.btnVisible =
  previewState.card1Visible = previewState.card2Visible = previewState.card3Visible = true
}

const runPage = (p: number) => {
  reset()

  if (p === 0) {
    // 1) Draw columns first
    at(90,   () => { previewState.gridVisible = true })
    // 2) Add guide containers aligned to columns
    at(360,  () => { previewState.navGuide = true })
    at(620,  () => { previewState.heroGuide = true })
    at(860,  () => { previewState.btnGuide = true })
    at(1100, () => { previewState.cardsGuide = true })
    // 3) Fill containers
    at(1540, () => { previewState.navGuide = false })
    at(1620, () => { previewState.navVisible = true })
    at(1900, () => { previewState.heroGuide = false })
    at(1980, () => { previewState.heroVisible = true })
    at(2240, () => { previewState.btnGuide = false })
    at(2320, () => { previewState.btnVisible = true })
    at(2580, () => { previewState.cardsGuide = false })
    at(2660, () => { previewState.card1Visible = true })
    at(2860, () => { previewState.card2Visible = true })
    at(3140, () => { previewState.card3Visible = true })
  } else if (p === 1) {
    showAll()
    previewState.gridSoft = true
    at(220, () => { previewState.refined = true })
  } else {
    showAll()
    previewState.gridSoft = true
    previewState.refined = true
    at(420, () => { previewState.navThemed = true })
    at(760, () => { previewState.heroThemed = true })
    at(1100, () => { previewState.btnThemed = true })
    at(1440, () => { previewState.cardsThemed = true })
  }
}

const setStatic = () => {
  reset()
  page.value = 0
  showAll()
  previewState.gridSoft = true
  previewState.refined = previewState.navThemed = previewState.heroThemed =
  previewState.btnThemed = previewState.cardsThemed = true
}

// p0: wireframe llena hasta 3140ms  p1: refinement a 220ms  p2: theme snap a 1440ms
const pageDelays = [3300, 1800, 2500]

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

watch(() => props.active, (val) => (val ? onEnter() : onLeave()))
onMounted(() => setStatic())
onBeforeUnmount(() => { clearTimeout(pageTimer); reset() })
</script>

<template>
  <div class="ux" :class="{ 'ux--static': !props.active }" aria-hidden="true">
    <div class="ux__chrome">
      <div class="ux__dots">
        <span class="ux__dot" style="background:var(--solutions-shell-dot-red)" />
        <span class="ux__dot" style="background:var(--solutions-shell-dot-yellow)" />
        <span class="ux__dot" style="background:var(--solutions-shell-dot-green)" />
      </div>
      <span class="ux__tab ux__tab--active">homepage.fig</span>
    </div>

    <div class="ux__canvas">
      <div class="ux__artboard" :class="{ 'ux__artboard--grid-soft': previewState.gridSoft }">
        <div class="ux__grid" :class="{ 'ux__grid--in': previewState.gridVisible }" aria-hidden="true">
          <span v-for="n in 12" :key="n" class="ux__gcol" />
        </div>
        <div class="ux__gutters" :class="{ 'ux__gutters--in': previewState.gridVisible }" aria-hidden="true" />

        <div class="ux__layout">
          <div
            class="ux__nav"
            :class="{
              'ux__zone--guide': previewState.navGuide && !previewState.navVisible,
              'ux__pv-el--in': previewState.navVisible,
              'ux__nav--themed': previewState.navThemed
            }"
          >
            <template v-if="previewState.navVisible">
              <div class="ux__nav-logo" :class="{ 'ux__nav-logo--themed': previewState.navThemed }" />
              <div class="ux__nav-links">
                <div class="ux__nav-link" :class="{ 'ux__nav-link--themed': previewState.navThemed }" />
                <div class="ux__nav-link" :class="{ 'ux__nav-link--themed': previewState.navThemed }" />
                <div class="ux__nav-link" :class="{ 'ux__nav-link--themed': previewState.navThemed }" />
              </div>
            </template>
          </div>

          <div
            class="ux__hero"
            :class="{
              'ux__zone--guide': previewState.heroGuide && !previewState.heroVisible,
              'ux__pv-el--in': previewState.heroVisible
            }"
          >
            <template v-if="previewState.heroVisible">
              <div class="ux__h1" :class="{ 'ux__h1--refined': previewState.refined, 'ux__h1--themed': previewState.heroThemed }" />
              <div class="ux__h2" :class="{ 'ux__h2--refined': previewState.refined, 'ux__h2--themed': previewState.heroThemed }" />
            </template>
          </div>

          <div
            class="ux__btn"
            :class="{
              'ux__zone--guide': previewState.btnGuide && !previewState.btnVisible,
              'ux__pv-el--in': previewState.btnVisible,
              'ux__btn--refined': previewState.refined,
              'ux__btn--themed': previewState.btnThemed
            }"
          />

          <div class="ux__cards">
            <div
              class="ux__card"
              :class="{
                'ux__zone--guide': previewState.cardsGuide && !previewState.card1Visible,
                'ux__pv-el--in': previewState.card1Visible,
                'ux__card--refined': previewState.refined,
                'ux__card--themed': previewState.cardsThemed
              }"
            />
            <div
              class="ux__card"
              :class="{
                'ux__zone--guide': previewState.cardsGuide && !previewState.card2Visible,
                'ux__pv-el--in': previewState.card2Visible,
                'ux__card--refined': previewState.refined,
                'ux__card--themed': previewState.cardsThemed
              }"
            />
            <div
              class="ux__card"
              :class="{
                'ux__zone--guide': previewState.cardsGuide && !previewState.card3Visible,
                'ux__pv-el--in': previewState.card3Visible,
                'ux__card--refined': previewState.refined,
                'ux__card--themed': previewState.cardsThemed
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ux { width:100%; height:100%; display:flex; flex-direction:column; pointer-events:none; user-select:none; }

.ux__chrome { display:flex; align-items:center; padding-left:8px; height:24px; background:var(--solutions-shell-bg); flex-shrink:0; }
.ux__dots { display:flex; gap:4px; flex-shrink:0; margin-right:8px; }
.ux__dot { display:block; width:6px; height:6px; border-radius:50%; }
.ux__tab { font-size:7px; font-family:'SF Mono','Cascadia Code',Menlo,monospace; padding:0 9px; height:100%; display:flex; align-items:center; color:var(--solutions-shell-tab-text); }
.ux__tab--active { color:var(--solutions-shell-tab-text-active); background:var(--solutions-shell-tab-bg); border-top:1px solid var(--accent); }

.ux__canvas {
  flex:1;
  background: color-mix(in srgb, var(--bg) 84%, white);
  padding:8px;
  overflow:hidden;
  display:flex;
}
.ux__artboard {
  position: relative;
  flex:1;
  background: color-mix(in srgb, var(--bg) 94%, white);
  border-radius:2px;
  padding:7px 6px;
  box-shadow: 0 1px 6px color-mix(in srgb, var(--ink) 7%, transparent);
}

.ux__grid {
  position: absolute;
  inset: 7px 6px;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 4px;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity .32s ease, transform .32s ease;
  pointer-events: none;
}
.ux__grid--in { opacity: 1; transform: translateY(0); }
.ux__gcol {
  border-radius: 1px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);
  clip-path: inset(0 100% 0 0);
  animation: uxDraw .34s ease both;
}
.ux__gcol:nth-child(2) { animation-delay: .02s; }
.ux__gcol:nth-child(3) { animation-delay: .04s; }
.ux__gcol:nth-child(4) { animation-delay: .06s; }
.ux__gcol:nth-child(5) { animation-delay: .08s; }
.ux__gcol:nth-child(6) { animation-delay: .10s; }
.ux__gcol:nth-child(7) { animation-delay: .12s; }
.ux__gcol:nth-child(8) { animation-delay: .14s; }
.ux__gcol:nth-child(9) { animation-delay: .16s; }
.ux__gcol:nth-child(10) { animation-delay: .18s; }
.ux__gcol:nth-child(11) { animation-delay: .20s; }
.ux__gcol:nth-child(12) { animation-delay: .22s; }
.ux__artboard--grid-soft .ux__gcol { opacity: .14; transition: opacity .35s ease; }

.ux__gutters {
  position: absolute;
  inset: 7px 6px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(3px);
  transition: opacity .32s ease, transform .32s ease;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc((100% - 44px) / 12),
    color-mix(in srgb, var(--accent) 10%, transparent) calc((100% - 44px) / 12),
    color-mix(in srgb, var(--accent) 10%, transparent) calc((100% - 44px) / 12 + 4px)
  );
}
.ux__gutters--in { opacity: .4; transform: translateY(0); }
.ux__artboard--grid-soft .ux__gutters { opacity: .18; transition: opacity .35s ease; }

.ux__layout {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto auto auto 1fr;
  gap: 6px 4px;
}

.ux__pv-el--in { opacity:1 !important; transform:translateY(0) !important; }

.ux__zone--guide {
  opacity: 0 !important;
  transform: translateY(3px) !important;
  transition: none !important;
  background: transparent !important;
  border: 1px dashed color-mix(in srgb, var(--accent) 38%, transparent) !important;
  animation: uxGuideIn .42s cubic-bezier(.22,1,.36,1) both;
  will-change: transform, opacity, clip-path;
}
@keyframes uxGuideIn {
  0% {
    opacity: 0;
    transform: translateY(3px);
    clip-path: inset(0 100% 0 0);
    border-color: color-mix(in srgb, var(--accent) 18%, transparent);
  }
  55% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0% 0 0);
    border-color: color-mix(in srgb, var(--accent) 38%, transparent);
  }
}

.ux__nav {
  grid-column: 1 / -1;
  display:flex;
  align-items:center;
  justify-content:space-between;
  min-height:10px;
  padding:0 2px 4px;
  border-bottom:1px solid var(--border);
  opacity:0;
  transform:translateY(-5px) scale(.985);
  transition: opacity .62s var(--ease-out), transform .62s var(--ease-out), background .56s var(--ease-out), border-radius .52s var(--ease-out), padding .52s var(--ease-out), border-bottom-color .52s var(--ease-out);
}
.ux__nav--themed {
  background: var(--ink);
  border-radius: var(--radius-sm);
  padding: 3px 5px;
  border-bottom-color: transparent;
  animation: uxThemeNav 1.18s var(--ease-out) both;
}
.ux__nav-logo { width:14px; height:3px; border-radius:0; background:var(--surface2); transition: background .62s var(--ease-out), border-radius .62s var(--ease-out), transform .62s var(--ease-out), opacity .62s var(--ease-out); }
.ux__nav-logo--themed { background: var(--accent); border-radius: var(--radius-pill); animation: uxThemeAccent 1.12s var(--ease-out) both; }
.ux__nav-links { display:flex; gap:4px; }
.ux__nav-link { width:8px; height:3px; border-radius:0; background:var(--surface2); transition: background .62s var(--ease-out), border-radius .62s var(--ease-out), transform .62s var(--ease-out), opacity .62s var(--ease-out); }
.ux__nav-link--themed { background:color-mix(in srgb, var(--dark-ink) 35%, transparent); border-radius:var(--radius-pill); animation: uxThemeLink 1.12s var(--ease-out) both; }

.ux__nav-links .ux__nav-link { opacity: 0; transform: translateY(2px); }
.ux__nav.ux__pv-el--in .ux__nav-links .ux__nav-link { opacity: 1; transform: translateY(0); }
.ux__nav.ux__pv-el--in .ux__nav-links .ux__nav-link:nth-child(1) { transition-delay: .12s; }
.ux__nav.ux__pv-el--in .ux__nav-links .ux__nav-link:nth-child(2) { transition-delay: .24s; }
.ux__nav.ux__pv-el--in .ux__nav-links .ux__nav-link:nth-child(3) { transition-delay: .36s; }

.ux__hero {
  grid-column: 1 / span 8;
  display:flex;
  flex-direction:column;
  gap:3px;
  min-height:15px;
  opacity:0;
  transform:translateY(5px) scale(.986);
  transition: opacity .66s var(--ease-out), transform .66s var(--ease-out);
}
.ux__h1 { width:82%; height:7px; border-radius:0; background:var(--surface2); opacity:.15; transform:translateY(2px); transition:background .66s var(--ease-out),border-radius .66s var(--ease-out),opacity .66s var(--ease-out),transform .66s var(--ease-out); }
.ux__h1--refined { border-radius: var(--radius-sm); }
.ux__h1--themed { background: var(--ink); animation: uxThemeInk 1.22s var(--ease-out) both; }
.ux__h2 { width:60%; height:4px; border-radius:0; background:var(--surface2); opacity:.15; transform:translateY(2px); transition:background .66s var(--ease-out),border-radius .66s var(--ease-out),opacity .66s var(--ease-out),transform .66s var(--ease-out); }
.ux__h2--refined { border-radius: var(--radius-sm); }
.ux__h2--themed { background: var(--ink3); animation: uxThemeInkSoft 1.22s var(--ease-out) both; }

.ux__hero.ux__pv-el--in .ux__h1 { opacity: 1; transform: translateY(0); transition-delay: .14s; }
.ux__hero.ux__pv-el--in .ux__h2 { opacity: 1; transform: translateY(0); transition-delay: .28s; }

.ux__btn {
  grid-column: 1 / span 3;
  width:auto;
  height:10px;
  border-radius:0;
  background:var(--surface2);
  opacity:0;
  transform:translateY(5px) scale(.982);
  transition: opacity .62s var(--ease-out), transform .62s var(--ease-out), background .62s var(--ease-out), border-radius .62s var(--ease-out);
}
.ux__btn--refined { border-radius: var(--radius-sm); }
.ux__btn--themed { background: var(--accent); border-radius: var(--radius-pill); animation: uxThemeAccent 1.18s var(--ease-out) both; }

.ux__cards {
  grid-column: 1 / -1;
  align-self: end;
  display:grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 4px;
}
.ux__card {
  height:21px;
  border-radius:0;
  background:var(--surface2);
  border:1px solid transparent;
  opacity:0;
  transform:translateY(7px) scale(.972);
  transition: opacity .68s var(--ease-out), transform .68s var(--ease-out), border-radius .62s var(--ease-out), background .56s var(--ease-out), border-color .62s var(--ease-out), box-shadow .62s var(--ease-out);
}
.ux__card:nth-child(1) { grid-column: 1 / span 4; }
.ux__card:nth-child(2) { grid-column: 5 / span 4; }
.ux__card:nth-child(3) { grid-column: 9 / span 4; }
.ux__card--refined { border-radius:var(--radius-sm); border-color:var(--border2); background:var(--surface); }
.ux__card--themed { background:var(--bg); border-color:var(--border2); animation: uxThemeCard 1.2s var(--ease-out) both; }

@keyframes uxThemeNav {
  from { background: transparent; border-bottom-color: var(--border); }
  to { background: var(--ink); border-bottom-color: transparent; }
}
@keyframes uxThemeAccent {
  from { background: var(--surface2); }
  to { background: var(--accent); }
}
@keyframes uxThemeLink {
  from { background: var(--surface2); }
  to { background: color-mix(in srgb, var(--dark-ink) 35%, transparent); }
}
@keyframes uxThemeInk {
  from { background: var(--surface2); }
  to { background: var(--ink); }
}
@keyframes uxThemeInkSoft {
  from { background: var(--surface2); }
  to { background: var(--ink3); }
}
@keyframes uxThemeCard {
  from { background: var(--surface); border-color: var(--border2); }
  to { background: var(--bg); border-color: var(--border2); }
}

.ux__card.ux__pv-el--in { box-shadow: 0 2px 8px color-mix(in srgb, var(--ink) 8%, transparent); }
.ux__cards .ux__card:nth-child(1) { transition-delay: .12s; }
.ux__cards .ux__card:nth-child(2) { transition-delay: .26s; }
.ux__cards .ux__card:nth-child(3) { transition-delay: .4s; }

.ux--static .ux__grid,
.ux--static .ux__nav,
.ux--static .ux__nav-logo,
.ux--static .ux__nav-link,
.ux--static .ux__h1,
.ux--static .ux__h2,
.ux--static .ux__btn,
.ux--static .ux__card { transition: none; animation: none; }

@media (prefers-reduced-motion: reduce) {
  .ux__grid { opacity:.35; transform:none; transition:none; }
  .ux__gcol { animation:none; clip-path:none; }
  .ux__zone--guide { animation:none; clip-path:none; opacity:1 !important; transform:none !important; }
  .ux__nav--themed,
  .ux__nav-logo--themed,
  .ux__nav-link--themed,
  .ux__h1--themed,
  .ux__h2--themed,
  .ux__btn--themed,
  .ux__card--themed { animation:none; }
  .ux__nav,.ux__hero,.ux__btn,.ux__card { opacity:1; transform:none; transition:none; }
  .ux__nav-logo,.ux__nav-link,.ux__h1,.ux__h2 { transition:none; }
}
</style>

