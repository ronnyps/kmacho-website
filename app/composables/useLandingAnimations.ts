import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useLandingAnimations = (reduced: Ref<boolean>, startSignal?: Ref<boolean>) => {
  let ctx: gsap.Context | null = null
  let initialized = false
  const sectionTextEntry = (section: Element | null, selector: string, start = 'top 75%') => {
    if (!section || reduced.value) return
    const targets = section.querySelectorAll<HTMLElement>(selector)
    if (!targets.length) return

    gsap.fromTo(
      targets,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start },
      },
    )
  }

  const start = () => {
    if (initialized) return
    initialized = true
    if (!reduced.value) document.body.classList.add('has-motion')
    ctx = gsap.context(() => {
      if (!reduced.value) {
        initHeroTimeline()
        initServicesTriggers()
        initSolutionsTriggers()
        initProofTriggers()
        initProcessTriggers()
        initFitTriggers()
        initFinalCtaTriggers()
      } else {
        document.body.classList.add('hero-anim-ready')
      }
      initMarketGapTriggers()
    })
  }

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!startSignal || startSignal.value) start()
  })

  watch(
    () => startSignal?.value,
    (ready) => {
      if (ready) start()
    },
  )

  onBeforeUnmount(() => {
    ctx?.revert()
    ScrollTrigger.getAll().forEach((t) => t.kill())
    document.body.classList.remove('is-dark-zone')
    document.body.classList.remove('has-motion')
    document.body.classList.remove('hero-anim-ready')
  })

  const initHeroTimeline = () => {
    const lines = gsap.utils.toArray<HTMLElement>('.js-hero-line')
    const numNodes = gsap.utils.toArray<HTMLElement>('.js-stat-number')

    // Lock initial visual state before timeline starts to prevent first-frame flashes.
    gsap.set('.js-site-nav', { yPercent: -100, autoAlpha: 0 })
    gsap.set(lines, { yPercent: 116, autoAlpha: 0, force3D: true })
    gsap.set('.js-hero-subtitle', { y: 16, autoAlpha: 0 })
    gsap.set('.js-hero-action', { y: 12, autoAlpha: 0 })
    gsap.set('.js-hero-stats', { autoAlpha: 0 })
    document.body.classList.add('hero-anim-ready')
    numNodes.forEach((node) => gsap.set(node, { textContent: '0' }))

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to('.js-site-nav', { yPercent: 0, autoAlpha: 1, duration: 0.5 }, 0)

    lines.forEach((line, i) => {
      tl.to(
        line,
        { yPercent: 0, autoAlpha: 1, duration: 0.78, ease: 'power4.out', force3D: true },
        0.55 + i * 0.12,
      )
    })

    tl.to('.js-hero-subtitle', { y: 0, autoAlpha: 1, duration: 0.6 }, 1.2)
      .to('.js-hero-action', { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 1.45)
      .to('.js-hero-stats', { autoAlpha: 1, duration: 0.6 }, 1.7)

    numNodes.forEach((node) => {
      const target = Number(node.dataset.target ?? '0')
      const proxy = { n: 0 }
      tl.to(
        proxy,
        {
          n: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            node.textContent = String(Math.round(proxy.n))
          },
        },
        1.9,
      )
    })

    // Noise overlay: scrub ligado al scroll — aparece proporcionalmente
    // desde el primer px de scroll hasta los 320px. Sin umbrales, sin clases.
    gsap.fromTo(
      '.site-noise-overlay',
      { opacity: 0 },
      {
        opacity: 0.07,
        ease: 'none',
        scrollTrigger: { start: 0, end: 320, scrub: true },
      },
    )
  }

  const initMarketGapTriggers = () => {
    const section = document.querySelector<HTMLElement>('.js-market-gap')
    if (!section || reduced.value) return

    sectionTextEntry(section, '.js-gap-overline, .js-gap-title, .js-gap-paragraph, .js-gap-tagline')

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        document.querySelector('.js-gap-title-muted')?.classList.add('market-gap__title-line--active')
      },
    })
  }

  const initServicesTriggers = () => {
    const section = document.querySelector('.js-services')
    if (!section) return

    sectionTextEntry(section, '.js-services-overline, .js-services-title, .js-service-card')
  }

  const initProcessTriggers = () => {
    const section = document.querySelector<HTMLElement>('.js-process')
    const nav = document.querySelector<HTMLElement>('.js-site-nav')

    if (!section) return

    sectionTextEntry(section, '.js-process-overline, .js-process-title, .js-process-subtitle')

    // Rows entran desde la izquierda en cascada
    gsap.fromTo(
      '.js-process-step',
      { x: -24, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.68,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process__right',
          start: 'top 80%',
        },
      }
    )

    // Línea vertical scrub: crece de 0 a 100% mientras scrolleas los rows
    const vfill = document.querySelector('.js-process-vfill')
    if (vfill) {
      gsap.to(vfill, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process__right',
          start: 'top 58%',
          end: 'bottom 65%',
          scrub: 1,
        },
      })
    }

    // Cada row se activa al entrar en viewport
    gsap.utils.toArray<HTMLElement>('.js-process-step').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        end: 'bottom 30%',
        toggleClass: { targets: step, className: 'is-active' },
      })
    })

    // Dark zone desde Process hasta el final
    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      end: 'max',
      onEnter: () => {
        document.body.classList.add('is-dark-zone')
        nav?.classList.add('is-dark')
      },
      onLeaveBack: () => {
        document.body.classList.remove('is-dark-zone')
        nav?.classList.remove('is-dark')
      },
      onEnterBack: () => {
        document.body.classList.add('is-dark-zone')
        nav?.classList.add('is-dark')
      },
    })
  }

  const initSolutionsTriggers = () => {
    const section = document.querySelector<HTMLElement>('.js-solutions')
    if (!section) return
    sectionTextEntry(section, '.js-sol-item', 'top 78%')
  }

  const initProofTriggers = () => {
    const section = document.querySelector('.js-proof')
    if (!section) return

    sectionTextEntry(section, '.js-proof-overline, .js-proof-title, .js-proof-subtitle, .js-proof-card')
  }

  const initFitTriggers = () => {
    const section = document.querySelector<HTMLElement>('.js-fit')
    if (!section) return
    sectionTextEntry(section, '.js-fit-overline, .js-fit-title, .js-fit-subtitle, .js-fit-column, .js-fit-item')
  }

  const initFinalCtaTriggers = () => {
    const section = document.querySelector<HTMLElement>('.js-final-cta')
    if (!section) return

    sectionTextEntry(section, '.js-cta-word, .js-cta-subtitle, .js-cta-button, .js-cta-meta')
  }
}
