import * as THREE from '../lib/three.module.js'
import { computeStep, buffers } from './render.js'
import { config } from './data.js'

function generateColor () {
  var color = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 100%)`)
  color.r *= 0.15
  color.g *= 0.15
  color.b *= 0.15
  return color
}

export function multipleSplats (amount) {
  for (let i = 0; i < amount; i++) {
    const color = generateColor()
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    const x = Math.random() * config.resolutions[0]
    const y = Math.random() * config.resolutions[0]
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
      uniforms.uRadius.value = config.splatRadius / 100.0
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
      uniforms.uRadius.value = config.splatRadius / 100.0
    }
  })
}
