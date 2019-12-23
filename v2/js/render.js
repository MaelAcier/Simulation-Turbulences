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
  sunraysTemp: new Texture(),
  vorticity: new Texture()
}

export const registeredIDs = {
  sin: 'sin',
  'splat - dye': 'splat - dye',
  'splat - velocity': 'splat - velocity',
  curl: 'curl',
  vorticity: 'vorticity',
  divergence: 'divergence',
  clear: 'clear',
  pressure: 'pressure',
  cube: 'cube'
}

let time = 0
/* let lastUpdateTime = Date.now()

function calcDeltaTime () {
  const now = Date.now()
  let dt = (now - lastUpdateTime) / 1000
  dt = Math.min(dt, 0.016666)
  lastUpdateTime = now
  return dt
} */

export function renderingPipeline () {
  // const dt = calcDeltaTime()

  if (!config.pause) {
    time += 0.005
  }

  step({
    material: 'curl',
    textureID: 'curl',
    fun: (material, textures) => {
      material.uniforms.sVelocity.value = textures.velocity.currentTexture.texture
      material.uniforms.uDensity.value = config.density
    }
  })

  step({
    material: 'vorticity',
    textureID: 'vorticity',
    fun: (material, textures) => {
      material.uniforms.sVelocity.value = textures.velocity.currentTexture.texture
      material.uniforms.sCurl.value = textures.curl.currentTexture.texture
      material.uniforms.uDensity.value = config.density
      material.uniforms.uCurl.value = config.curl
      material.uniforms.uDt.value = time
    }
  })

  step({
    material: 'divergence',
    textureID: 'divergence',
    fun: (material, textures) => {
      material.uniforms.sVelocity.value = textures.velocity.currentTexture.texture
      material.uniforms.uDensity.value = config.density
    }
  })

  step({
    material: 'clear',
    textureID: 'pressure',
    fun: (material, textures) => {
      material.uniforms.sPressure.value = textures.pressure.currentTexture.texture
      material.uniforms.uDensity.value = config.density
      material.uniforms.uPressure.value = config.pressure
    }
  })

  for (let i = 0; i < config.pressureIterations; i++) {
    step({
      material: 'pressure',
      textureID: 'pressure',
      id: i === config.pressureIterations - 1 ? 'pressure' : '',
      fun: (material, textures) => {
        material.uniforms.sPressure.value = textures.pressure.currentTexture.texture
        material.uniforms.sDivergence.value = textures.divergence.currentTexture.texture
        material.uniforms.uDensity.value = config.density
      }
    })
  }

  step({
    material: 'sin',
    textureID: 1,
    fun: (material) => {
      material.uniforms.uDensity.value = config.density
      material.uniforms.uTime.value = time
    }
  })

  step({
    material: 'cube',
    textureID: 1,
    fun: (material, textures) => {
      material.uniforms.sTexture.value = textures[1].currentTexture.texture
      material.uniforms.uDensity.value = config.density
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
