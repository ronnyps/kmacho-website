const parseHex = (hex: string): [number, number, number] => {
  const h = hex.trim().replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export const useHeroWaves = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let   GAP        = 88    // recalculated per-resize, scales with canvas height
  const DRIFT      = 0.22
  const NOISE_SIZE = 256   // offscreen tile — tiled across the main canvas

  // Design tokens
  const style = getComputedStyle(document.documentElement)
  const [bgR, bgG, bgB] = parseHex(style.getPropertyValue('--dark-bg'))    // #0d0d0b
  const [i3R, i3G, i3B] = parseHex(style.getPropertyValue('--dark-ink3'))  // #5a5a54

  // Offscreen noise canvas — small tile, re-randomised every frame
  const noiseCanvas  = document.createElement('canvas')
  noiseCanvas.width  = NOISE_SIZE
  noiseCanvas.height = NOISE_SIZE
  const noiseCtx     = noiseCanvas.getContext('2d')!
  const noiseImgData = noiseCtx.createImageData(NOISE_SIZE, NOISE_SIZE)

  const refreshNoise = () => {
    const d = noiseImgData.data
    for (let i = 0; i < d.length; i += 4) {
      const v    = Math.random() * 110 | 0   // 0–110 dark grain
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 255
    }
    noiseCtx.putImageData(noiseImgData, 0, 0)
  }

  let w = 0, h = 0, dpr = 1
  let offset = 0, raf = 0, ready = false
  let waveTime = 0

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

  const applySize = () => {
    dpr = Math.min(window.devicePixelRatio, 2)
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) {
      // Layout not ready yet — retry next frame so we don't miss the first paint.
      requestAnimationFrame(applySize)
      return
    }
    w = rect.width
    h = rect.height
    canvas.width  = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    GAP      = clamp(60, h * 0.11, 130)
    WAVE_AMP = GAP * 0.32
    ready = true
  }

  // Wave perturbation params — distort the radius around the angle to break up
  // the perfect circles into organic flowing curves while keeping bands aligned.
  const WAVE_FREQ_A = 3
  const WAVE_FREQ_B = 5
  let   WAVE_AMP    = GAP * 0.32   // tracks GAP on resize
  const ARC_STEPS   = 160

  const tracePerturbedArc = (cx: number, cy: number, radius: number, p1: number, p2: number, rot: number, ampMod: number, reverse = false) => {
    for (let s = 0; s <= ARC_STEPS; s++) {
      const t = reverse ? 1 - s / ARC_STEPS : s / ARC_STEPS
      const angle = t * Math.PI * 2
      // Rotated angle drives the wobble pattern → waves drift tangentially
      // around the origin instead of just expanding radially.
      const waveAngle = angle + rot
      const wobble =
        Math.sin(waveAngle * WAVE_FREQ_A + p1) * WAVE_AMP * ampMod +
        Math.sin(waveAngle * WAVE_FREQ_B + p2) * WAVE_AMP * 0.4 * ampMod
      const r = radius + wobble
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
  }

  const draw = () => {
    ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
    ctx.fillRect(0, 0, w, h)

    // Origin outside top-left → arcs sweep toward bottom-right
    const ox   = w * -0.18
    const oy   = h * -0.20
    const maxR = Math.hypot(w - ox, h - oy) * 1.06
    const num  = Math.ceil(maxR / GAP) + 3
    // Decoupled time-driven phases. Sin is naturally periodic so monotonically
    // increasing phases produce a smooth, never-ending loop without needing to
    // align with offset. Different speeds → harmonics beat against each other
    // → motion feels organic instead of mechanical.
    const p1     =  waveTime * 0.011
    const p2     = -waveTime * 0.0073 + 1.7
    const rot    =  waveTime * 0.00045
    const ampMod = 1 + Math.sin(waveTime * 0.0028) * 0.18

    for (let i = num; i >= -1; i--) {
      const rOuter = (i + 1) * GAP + offset
      const rInner = Math.max(0, i * GAP + offset)
      if (rOuter <= 0 || rInner >= maxR * 1.1) continue

      const prog = clamp(rOuter / maxR, 0, 1)
      const dv   = (prog - 0.45) / 0.30
      const bell = Math.exp(-(dv * dv))

      // Band fill — neutral dark gray
      const f   = bell * 0.14
      const br  = Math.round(bgR + (i3R - bgR) * f)
      const bg_ = Math.round(bgG + (i3G - bgG) * f)
      const bb  = Math.round(bgB + (i3B - bgB) * f)

      // Rim highlight — neutral white, no accent tint (blue dominated otherwise)
      const fh = bell * 0.07
      const hr = clamp(Math.round(bgR + (255 - bgR) * fh), 0, 255)
      const hg = clamp(Math.round(bgG + (255 - bgG) * fh), 0, 255)
      const hb = clamp(Math.round(bgB + (255 - bgB) * fh), 0, 255)

      // Rim shadow
      const sr = clamp(br  - 3, 0, 255)
      const sg = clamp(bg_ - 3, 0, 255)
      const sb = clamp(bb  - 3, 0, 255)

      const r0   = Math.max(1, rInner)
      const r1   = Math.max(r0 + 1, rOuter)
      const grad = ctx.createRadialGradient(ox, oy, r0, ox, oy, r1)
      grad.addColorStop(0,    `rgb(${hr},${hg},${hb})`)
      grad.addColorStop(0.15, `rgb(${br},${bg_},${bb})`)
      grad.addColorStop(0.88, `rgb(${br},${bg_},${bb})`)
      grad.addColorStop(1,    `rgb(${sr},${sg},${sb})`)

      ctx.beginPath()
      tracePerturbedArc(ox, oy, rOuter, p1, p2, rot, ampMod)
      if (rInner > 1) {
        ctx.closePath()
        ctx.moveTo(ox + rInner, oy)
        tracePerturbedArc(ox, oy, rInner, p1, p2, rot, ampMod, true)
        ctx.fillStyle = grad
        ctx.fill('evenodd')
      } else {
        ctx.fillStyle = grad
        ctx.fill()
      }
    }

    // Animated noise layer
    refreshNoise()
    const pattern = ctx.createPattern(noiseCanvas, 'repeat')
    if (pattern) {
      const tx = Math.random() * NOISE_SIZE
      const ty = Math.random() * NOISE_SIZE
      pattern.setTransform(new DOMMatrix([1, 0, 0, 1, tx, ty]))
      ctx.save()
      ctx.globalAlpha = 0.08
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }

    offset = (offset + DRIFT) % GAP
    waveTime += 1
  }

  const animate = () => {
    raf = requestAnimationFrame(animate)
    if (!ready) return
    // Per-frame size guard — observers (ResizeObserver, matchMedia) can miss
    // browser zoom changes because CSS-pixel dimensions don't always change
    // when only DPR shifts. Check directly each frame and re-sync if drifted.
    const rect = canvas.getBoundingClientRect()
    const liveDpr = Math.min(window.devicePixelRatio, 2)
    if (
      Math.abs(rect.width  - w) > 0.5 ||
      Math.abs(rect.height - h) > 0.5 ||
      liveDpr !== dpr
    ) {
      applySize()
    }
    draw()
  }

  // ResizeObserver + window.resize are fast-path triggers; the per-frame
  // size guard inside animate() is the real safety net for any case they miss
  // (most notably browser zoom changes that only shift DPR).
  const ro = new ResizeObserver(applySize)
  ro.observe(canvas)
  window.addEventListener('resize', applySize)

  requestAnimationFrame(applySize)
  animate()

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener('resize', applySize)
  }
}
