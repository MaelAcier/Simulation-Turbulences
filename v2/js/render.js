import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

let oldTexture = new THREE.WebGLRenderTarget(config.density, config.density ** 2)

oldTexture.background = new THREE.Color(0x000000)

let newTexture = new THREE.WebGLRenderTarget(config.density, config.density ** 2)

newTexture.background = new THREE.Color(0x000000)

let time = 0
export function render () {
  time += 0.005

  step('sin', (material) => {
    material.uniforms.time.value = time
  }, true)

  step('main', (material) => {
    material.uniforms.time.value = time
    material.uniforms.textureMap.value = newTexture.texture
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}

function swapTextures () {
  const swap = oldTexture
  oldTexture = newTexture
  newTexture = swap
}

function step (material, update, visible) {
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
    renderer.setRenderTarget(oldTexture)
    renderer.render(scene, cameras.texture)
  }

  materials[material].visible = false

  swapTextures()
}
