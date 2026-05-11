<script setup lang="ts">
import * as THREE from 'three'

type BoxNode = {
  mesh: THREE.Mesh
  baseHeight: number
  baseZ: number
  seed: number
}

const rootRef = ref<HTMLDivElement | null>(null)
let cleanup: (() => void) | null = null

const parseColor = (value: string, fallback: string) => {
  const trimmed = value.trim()
  return trimmed || fallback
}

const createRoundedBoxGeometry = (width: number, height: number, depth: number, bevel = 0.14) => {
  const shape = new THREE.Shape()
  const hw = width / 2
  const hd = depth / 2
  const b = Math.min(bevel, hw * 0.35, hd * 0.35)

  shape.moveTo(-hw + b, -hd)
  shape.lineTo(hw - b, -hd)
  shape.quadraticCurveTo(hw, -hd, hw, -hd + b)
  shape.lineTo(hw, hd - b)
  shape.quadraticCurveTo(hw, hd, hw - b, hd)
  shape.lineTo(-hw + b, hd)
  shape.quadraticCurveTo(-hw, hd, -hw, hd - b)
  shape.lineTo(-hw, -hd + b)
  shape.quadraticCurveTo(-hw, -hd, -hw + b, -hd)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: b * 0.7,
    bevelThickness: b * 0.6,
  })

  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, height / 2, 0)
  return geometry
}

onMounted(() => {
  const root = rootRef.value
  if (!root || typeof window === 'undefined') return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const styles = getComputedStyle(document.documentElement)

  const colors = {
    bg: parseColor(styles.getPropertyValue('--dark-bg'), '#05070d'),
    ink: parseColor(styles.getPropertyValue('--dark-ink'), '#f5f5f2'),
    accent: parseColor(styles.getPropertyValue('--accent'), '#014efe'),
  }

  const tone = new THREE.Color(colors.accent)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(colors.bg, 8, 92)

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 220)
  camera.position.set(0, 4.2, 15.5)
  camera.lookAt(0, 0.8, -13)

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  const disposables: Array<{ dispose?: () => void }> = []
  const track = <T extends { dispose?: () => void }>(item: T) => {
    disposables.push(item)
    return item
  }

  const setSize = () => {
    const width = root.clientWidth || window.innerWidth
    const height = root.clientHeight || window.innerHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  setSize()

  const resizeObserver = new ResizeObserver(setSize)
  resizeObserver.observe(root)
  window.addEventListener('resize', setSize)

  const rig = new THREE.Group()
  scene.add(rig)

  const floor = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(180, 180),
      new THREE.MeshBasicMaterial({
        color: colors.bg,
        transparent: true,
        opacity: 0.98,
      })
    )
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0
  rig.add(floor)

  const ambient = track(new THREE.AmbientLight(new THREE.Color(colors.ink), 0.22))
  scene.add(ambient)

  const key = track(new THREE.DirectionalLight(tone, 1.2))
  key.position.set(-4, 10, 8)
  scene.add(key)

  const rim = track(new THREE.DirectionalLight(tone, 0.75))
  rim.position.set(6, 6, -10)
  scene.add(rim)

  const haze = track(new THREE.PointLight(tone, 0.65, 80, 2))
  haze.position.set(0, 4, -18)
  scene.add(haze)

  const boxGroup = new THREE.Group()
  rig.add(boxGroup)

  const columns = [-8.6, -6.3, -4.3, -2.4, -0.8, 0.8, 2.4, 4.3, 6.3, 8.6]
  const rowCount = 26
  const rowSpacing = 1.88
  const boxSize = 1.22
  const gapY = 0.04
  const trackLength = rowCount * rowSpacing

  const nodes: BoxNode[] = []

  const createBoxMaterial = (tone: 'base' | 'accent') => {
    if (tone === 'accent') {
      return [
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.08,
            roughness: 0.32,
            transparent: true,
            opacity: 0.96,
            emissive: tone,
            emissiveIntensity: 0.12,
          })
        ),
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.08,
            roughness: 0.28,
            transparent: true,
            opacity: 0.98,
            emissive: tone,
            emissiveIntensity: 0.12,
          })
        ),
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.08,
            roughness: 0.2,
            transparent: true,
            opacity: 0.98,
            emissive: tone,
            emissiveIntensity: 0.12,
          })
        ),
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.03,
            roughness: 0.88,
            transparent: true,
            opacity: 0.96,
            emissive: tone,
            emissiveIntensity: 0.08,
          })
        ),
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.08,
            roughness: 0.32,
            transparent: true,
            opacity: 0.96,
            emissive: tone,
            emissiveIntensity: 0.12,
          })
        ),
        track(
          new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.08,
            roughness: 0.32,
            transparent: true,
            opacity: 0.96,
            emissive: tone,
            emissiveIntensity: 0.12,
          })
        ),
      ] as THREE.Material[]
    }

    return [
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.06,
          roughness: 0.42,
          transparent: true,
          opacity: 0.96,
          emissive: tone,
          emissiveIntensity: 0.08,
        })
      ),
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.06,
          roughness: 0.38,
          transparent: true,
          opacity: 0.96,
          emissive: tone,
          emissiveIntensity: 0.08,
        })
      ),
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.06,
          roughness: 0.28,
          transparent: true,
          opacity: 0.96,
          emissive: tone,
          emissiveIntensity: 0.08,
        })
      ),
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.03,
          roughness: 0.9,
          transparent: true,
          opacity: 0.98,
          emissive: tone,
          emissiveIntensity: 0.06,
        })
      ),
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.06,
          roughness: 0.42,
          transparent: true,
          opacity: 0.96,
          emissive: tone,
          emissiveIntensity: 0.08,
        })
      ),
      track(
        new THREE.MeshStandardMaterial({
          color: colors.accent,
          metalness: 0.06,
          roughness: 0.42,
          transparent: true,
          opacity: 0.96,
          emissive: tone,
          emissiveIntensity: 0.08,
        })
      ),
    ] as THREE.Material[]
  }

  const isAccentBox = (row: number, column: number) => {
    const slot = row * columns.length + column
    return slot % 7 === 0 || (row % 6 === 0 && column % 3 === 1)
  }

  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columns.length; column++) {
      const accent = isAccentBox(row, column)
      const size = boxSize
      const geometry = track(createRoundedBoxGeometry(size, size, size, 0.18))
      const mesh = new THREE.Mesh(geometry, createBoxMaterial(accent ? 'accent' : 'base'))
      mesh.position.set(columns[column], size / 2, -row * rowSpacing)
      mesh.rotation.set(0.02, 0.03, -0.02)
      boxGroup.add(mesh)

      nodes.push({
        mesh,
        baseHeight: size,
        baseZ: -row * rowSpacing,
        seed: Math.random() * Math.PI * 2,
      })
    }
  }

  const pointer = { x: 0, y: 0 }
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const clock = new THREE.Clock()
  let raf = 0

  const renderFrame = () => {
    const time = clock.getElapsedTime()

    camera.position.x += (pointer.x * 0.75 - camera.position.x) * 0.02
    camera.position.y += ((4.2 + pointer.y * 0.18) - camera.position.y) * 0.02
    camera.lookAt(camera.position.x * 0.08, 0.7, -16)

    rig.rotation.y += (pointer.x * 0.03 - rig.rotation.y) * 0.02

    nodes.forEach((node, index) => {
      if (!prefersReducedMotion) {
        node.mesh.position.z += 0.055
        if (node.mesh.position.z > camera.position.z + 6) {
          node.mesh.position.z -= trackLength
        }
      }

      if (node.mesh.position.z < camera.position.z - trackLength - 6) {
        node.mesh.position.z += trackLength
      }

      const distance = camera.position.z - node.mesh.position.z
      const focus = Math.max(0, Math.min(1, 1 - (distance - 4) / 18))
      const lift = focus * 0.55 + Math.sin(time * 1.2 + node.seed) * 0.05

      node.mesh.position.y = node.baseHeight / 2 + lift
      node.mesh.rotation.x = 0.02 + Math.sin(time * 0.35 + node.seed) * 0.02
      node.mesh.rotation.y = 0.03 + Math.cos(time * 0.3 + index * 0.02) * 0.03
      node.mesh.rotation.z = -0.02 + Math.sin(time * 0.25 + index * 0.015) * 0.015

      const materials = node.mesh.material as THREE.Material[]
      const topMaterial = materials[2] as THREE.MeshStandardMaterial | undefined
      if (topMaterial) {
        topMaterial.opacity = 0.9 + focus * 0.08
        topMaterial.emissiveIntensity = 0.08 + focus * 0.08
      }
    })

    boxGroup.position.y = gapY + Math.sin(time * 0.25) * 0.03
    boxGroup.position.x = Math.sin(time * 0.17) * 0.12

    renderer.render(scene, camera)

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(renderFrame)
    }
  }

  renderFrame()

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', setSize)
    resizeObserver.disconnect()

    disposables.forEach((item) => item.dispose?.())

    if (root.contains(renderer.domElement)) {
      root.removeChild(renderer.domElement)
    }

    renderer.dispose()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="rootRef" class="final-cta-3d" aria-hidden="true" />
</template>
