import * as THREE from '../lib/three.module.js'
import { step } from './render.js'
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
  step({
    material: 'splat',
    textureID: 'velocity',
    id: show ? 'splat - velocity' : '',
    fun: (material, textures) => {
      material.uniforms.sTarget.value = textures.velocity.currentTexture.texture
      material.uniforms.uPoint.value = new THREE.Vector2(x, y)
      material.uniforms.uColor.value = new THREE.Vector2(dx, dy)
      material.uniforms.uRadius.value = config.splatRadius / 100.0
    }
  })

  step({
    material: 'splat',
    textureID: 'dye',
    id: show ? 'splat - dye' : '',
    fun: (material, textures) => {
      material.uniforms.sTarget.value = textures.dye.currentTexture.texture
      material.uniforms.uDensity.value = config.density
      material.uniforms.uPoint.value = new THREE.Vector3(x, y)
      material.uniforms.uColor.value = new THREE.Vector3(color.r, color.g, color.b)
      material.uniforms.uRadius.value = config.splatRadius / 100.0
    }
  })
}
