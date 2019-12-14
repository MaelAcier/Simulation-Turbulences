import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

class Texture {
  constructor (size) {
    this.resize(size)
  }

  resize (size) {
    this.oldTexture = new THREE.WebGLRenderTarget(size ** 2, size, { type: THREE.FloatType })
    this.currentTexture = new THREE.WebGLRenderTarget(size ** 2, size, { type: THREE.FloatType })
  }

  swap () {
    const buffer = this.oldTexture
    this.oldTexture = this.newTexture
    this.newTexture = buffer
  }
}

export const textures = {
  1: new Texture(config.density)
}

let time = 0
export function render () {
  time += 0.005

  step('sin', 1, (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
  })

  step('main', 1, (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
    material.uniforms.textureMap.value = textures[1].newTexture.texture
  }, true)

  if (config.autoRotation) {
    controls.perspective.update()
  }
}

function step (material, textureID, update, visible) {
  materials[material].visible = true

  if (!config.pause) {
    update(materials[material])
  }

  if (visible) {
    renderer.setRenderTarget(null)
    if (config.clipping) {
      renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
      renderer.render(scene, cameras.perspective)
      renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
      renderer.render(scene, cameras.orthographic)
    } else {
      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
      renderer.render(scene, cameras.perspective)
    }
  } else {
    renderer.setRenderTarget(textures[textureID].oldTexture)
    renderer.render(scene, cameras.texture)
  }

  materials[material].visible = false

  textures[textureID].swap()
}
