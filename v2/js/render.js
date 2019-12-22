import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

export class Texture {
  constructor (size = config.density) {
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

export function step ({ material, textureID, fun, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    fun(materials[material], textures)
  }

  if (/cube/.test(config.renderTarget)) {
    if (config.renderTarget === id) {
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
    if (config.renderTarget === id) {
      renderer.setRenderTarget(null)
    } else {
      renderer.setRenderTarget(textures[textureID].oldTexture)
    }
    renderer.render(scene, cameras.texture)
  }

  materials[material].visible = false
  textures[textureID].swap()
}

export const textures = {
  1: new Texture(),
  2: new Texture(),
  dye: new Texture(),
  velocity: new Texture(),
  divergence: new Texture(),
  curl: new Texture(),
  pressure: new Texture(),
  bloom: new Texture(),
  bloomFramebuffers: new Texture(),
  sunrays: new Texture(),
  sunraysTemp: new Texture()
}

export const registeredIDs = {
  curl: 'curl',
  sin: 'sin',
  identity: 'identity',
  'splat - dye': 'splat - dye',
  'splat - velocity': 'splat - velocity',
  cube: 'cube'
}

let time = 0

export function renderingPipeline () {
  if (!config.pause) {
    time += 0.005
  }

  step({
    material: 'curl',
    textureID: 'curl',
    fun: (material, textures) => {
      material.uniforms.density.value = config.density
      material.uniforms.uVelocity.value = textures.velocity.currentTexture.texture
    }
  })

  step({
    material: 'sin',
    textureID: 1,
    fun: (material) => {
      material.uniforms.time.value = time
      material.uniforms.density.value = config.density
    }
  })

  step({
    material: 'identity',
    textureID: 1,
    fun: (material, textures) => {
      material.uniforms.density.value = config.density
      material.uniforms.textureMap.value = textures[1].currentTexture.texture
    }
  })

  step({
    material: 'cube',
    textureID: 1,
    fun: (material, textures) => {
      material.uniforms.time.value = time
      material.uniforms.density.value = config.density
      material.uniforms.textureMap.value = textures[1].currentTexture.texture
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
