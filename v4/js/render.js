import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

class Buffer {
  constructor (size = config.density) {
    this.resize(size)
  }

  resize (size) {
    this.oldTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.currentTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.size = size
  }

  swap () {
    const temp = this.oldTextures
    this.oldTextures = this.currentTextures
    this.currentTextures = temp
  }

  toTexture2dArray () {
    const planeSize = (this.size ** 2 * 4)
    const pixelBuffers = Array.from(Array(this.size), () => new Float32Array(planeSize))
    for (let i = 0; i < this.size; i++) {
      renderer.readRenderTargetPixels(this.currentTextures[i], 0, 0, 20 ** 2, 20, pixelBuffers[i])
    }
    // const array = new Float32Array(0).concat(...pixelBuffers)
    const array = new Float32Array(planeSize * this.size)
    for (let i = 0; i < this.size; i++) {
      array.set(pixelBuffers[i], i * planeSize)
    }
    // console.log(array)
    const texture = new THREE.DataTexture2DArray(array, this.size, this.size, this.size)
    texture.format = THREE.RGBAFormat
    texture.type = THREE.FloatType
    return texture
  }
}

export const buffers = {
  sin: new Buffer(),
  display: new Buffer()
}

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  setup(materials[material])

  for (let i = 0; i < config.density; i++) {
    materials[material].uniforms.uZ.value = i / config.density

    if (config.renderTarget === id && i === 0) {
      renderer.setRenderTarget(null)
      renderer.render(scene, cameras.texture)
    }
    renderer.setRenderTarget(buffers[bufferOutput].oldTextures[i])
    renderer.render(scene, cameras.texture)
  }

  buffers[bufferOutput].swap()
  materials[material].visible = false
}

export function displayStep ({ material, setup }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material])
  }

  if (config.renderTarget === material) {
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
  }

  materials[material].visible = false
}

export const registeredIDs = {
  sin: 'sin',
  planeArray: 'planeArray'
}

// let lastUpdateTime = Date.now()

/* function calcDeltaTime () {
  const now = Date.now()
  let dt = (now - lastUpdateTime) / 1000
  dt = Math.min(dt, 0.016666)
  lastUpdateTime = now
  return dt
} */

let time = 0

export function renderingPipeline () {
  // const dt = calcDeltaTime()

  if (!config.pause) {
    time += 0.0005

    computeStep({
      material: 'sin',
      bufferOutput: 'display',
      setup: (material) => {
        material.uniforms.uTime.value = time
      }
    })

    displayStep({
      material: 'planeArray',
      setup: (material) => {
        material.uniforms.sBuffer.value = buffers.display.toTexture2dArray()
      }
    })
  }

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
