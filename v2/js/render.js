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
    this.oldTexture = this.currentTexture
    this.currentTexture = buffer
  }
}

export const textures = {
  1: new Texture(config.density)
}

let time = 0
export function render () {
  time += 0.005

  step('test', 1, (material) => {
    material.uniforms.density.value = config.density
    material.uniforms.aspect.value = window.innerWidth / window.innerHeight
  })
  // step('sin', 1, (material) => {
  //   material.uniforms.time.value = time
  //   material.uniforms.density.value = config.density
  //   material.uniforms.aspect.value = window.innerWidth / window.innerHeight
  // })

  step('main', 1, (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
    material.uniforms.textureMap.value = textures[1].currentTexture.texture
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}

function step (material, textureID, update, visible = config.renderTarget === material) {
  materials[material].visible = true

  if (!config.pause) {
    update(materials[material])
  }

  if (config.renderTarget === 'main') {
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
  } else {
    if (visible) {
      renderer.setRenderTarget(null)
    } else {
      renderer.setRenderTarget(textures[textureID].oldTexture)
    }
    renderer.render(scene, cameras.texture)
  }

  materials[material].visible = false

  textures[textureID].swap()
}
