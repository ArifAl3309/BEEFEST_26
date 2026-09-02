'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ElectricalBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    const scene = new THREE.Scene()
    const aspect = window.innerWidth / window.innerHeight
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x06080f, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    currentMount.appendChild(renderer.domElement)

    // Subdued, elegant particle cloud (less overwhelming, more subtle)
    const PARTICLE_COUNT = 45
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: THREE.Vector2[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * aspect * 2.2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2
      positions[i * 3 + 2] = 0

      const speed = 0.0003 + Math.random() * 0.0004
      const angle = Math.random() * Math.PI * 2
      velocities.push(new THREE.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed))
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.016,
      transparent: true,
      opacity: 0.65,
    })
    const particleMesh = new THREE.Points(particleGeo, particleMat)
    scene.add(particleMesh)

    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true })
    const lineGeo = new THREE.BufferGeometry()
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineMesh)

    let sparkActive = false
    let sparkPair = [0, 1]
    let sparkTimer = 0
    let sparkInterval = 3500
    const clock = new THREE.Clock()

    const animate = () => {
      const delta = clock.getDelta() * 1000
      sparkTimer += delta

      if (sparkTimer > sparkInterval && !sparkActive) {
        sparkActive = true
        sparkTimer = 0
        sparkInterval = 2500 + Math.random() * 3000
        sparkPair = [
          Math.floor(Math.random() * PARTICLE_COUNT),
          Math.floor(Math.random() * PARTICLE_COUNT),
        ]
        setTimeout(() => { sparkActive = false }, 200)
      }

      const pos = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y

        if (pos[i * 3] > aspect || pos[i * 3] < -aspect) velocities[i].x *= -1
        if (pos[i * 3] > 1 || pos[i * 3] < -1) velocities[i].y *= -1
      }
      particleGeo.attributes.position.needsUpdate = true

      const linePositions: number[] = []
      const lineColors: number[] = []
      const MAX_DIST = 0.35

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = pos[i * 3] - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const dist = Math.sqrt(dx * dx + dy * dy)
          const isSpark = sparkActive && (
            (sparkPair[0] === i && sparkPair[1] === j) ||
            (sparkPair[0] === j && sparkPair[1] === i)
          )

          if (dist < MAX_DIST || isSpark) {
            const alpha = isSpark ? 0.9 : (1.0 - dist / MAX_DIST) * 0.4
            const r = isSpark ? 0.9 : 0.05 * alpha
            const g = isSpark ? 0.95 : 0.45 * alpha
            const b = isSpark ? 1.0 : 0.85 * alpha

            linePositions.push(pos[i * 3], pos[i * 3 + 1], 0)
            linePositions.push(pos[j * 3], pos[j * 3 + 1], 0)
            lineColors.push(r, g, b, r, g, b)
          }
        }
      }

      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const newAspect = w / h
      renderer.setSize(w, h)
      camera.left = -newAspect
      camera.right = newAspect
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', handleResize)
      particleGeo.dispose()
      particleMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
      if (currentMount) {
        currentMount.innerHTML = ''
      }
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none opacity-80" />
}
