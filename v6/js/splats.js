import * as THREE from '../lib/three.module.js'
import { computeStep, buffers } from './render.js'
import { config } from './data.js'

export function generateColor () {
  const c = HSVtoRGB(Math.random(), 1.0, 1.0)
  c.r *= 0.15
  c.g *= 0.15
  c.b *= 0.15
  return c
}

function HSVtoRGB (h, s, v) {
  let r, g, b
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return {
    r: r,
    g: g,
    b: b
  }
}

export function multipleSplats (amount) {
  for (let i = 0; i < amount; i++) {
    const color = generateColor()
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    const x = Math.floor(Math.random() * config.resolutions[0])
    const y = Math.floor(Math.random() * config.resolutions[0])
    const dx = 1000 * (Math.random() - 0.5)
    const dy = 1000 * (Math.random() - 0.5)
    splat(x, y, dx, dy, color, i === amount - 1)
  }
}

export function splat (x, y, dx, dy, color, show) {
  computeStep({
    material: 'splat',
    bufferOutput: 'velocity',
    id: show ? 'splat - velocity' : '',
    setup: (uniforms) => {
      uniforms.sTarget.value = buffers.velocity.data.texture
      uniforms.uPoint.value = new THREE.Vector2(x, y)
      uniforms.uColor.value = new THREE.Vector3(dx, dy, 0.0)
      uniforms.uRadius.value = config.SPLAT_RADIUS / 100.0
    }
  })

  computeStep({
    material: 'splat',
    bufferOutput: 'dye',
    id: show ? 'splat - dye' : '',
    setup: (uniforms) => {
      uniforms.sTarget.value = buffers.dye.data.texture
      uniforms.uPoint.value = new THREE.Vector2(x, y)
      uniforms.uColor.value = new THREE.Vector3(color.r, color.g, color.b)
      uniforms.uRadius.value = config.SPLAT_RADIUS / 100.0
    }
  })
}
