import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

class Buffer {
  constructor (size) {
    this.resize(size)
  }

  resize (size = config.resolution) {
    this.oldTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.currentTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.size = size
  }

  swap () {
    const temp = this.oldTextures
    this.oldTextures = this.currentTextures
    this.currentTextures = temp
  }

  toTexture () {
    const planeSize = (this.size ** 2 * 4)
    const pixelBuffers = Array.from(Array(this.size), () => new Float32Array(planeSize))
    for (let i = 0; i < this.size; i++) {
      renderer.readRenderTargetPixels(this.currentTextures[i], 0, 0, this.size, this.size, pixelBuffers[i])
    }
    const data = new Float32Array(planeSize * this.size)
    for (let i = 0; i < this.size; i++) {
      data.set(pixelBuffers[i], i * planeSize)
    }

    const texture3D = new THREE.DataTexture3D(data, this.size, this.size, this.size)
    texture3D.format = THREE.RGBAFormat
    texture3D.type = THREE.FloatType
    texture3D.unpackAlignment = 1
    this.texture3D = texture3D
  }
}

export const buffers = {
  sin: new Buffer(),
  display: new Buffer()
}

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material].uniforms)
  }

  for (let i = 0; i < config.resolution; i++) {
    materials[material].uniforms.uZ.value = i / config.resolution

    if (config.renderTarget === id && i === config.depth) {
      renderer.setRenderTarget(null)
      renderer.render(scene, cameras.texture)
    }
    renderer.setRenderTarget(buffers[bufferOutput].oldTextures[i])
    renderer.render(scene, cameras.texture)
  }

  buffers[bufferOutput].swap()
  buffers[bufferOutput].toTexture()
  materials[material].visible = false
}

export function displayStep ({ material, camera, setup }) {
  materials[material].visible = true

  if (config.renderTarget === material) {
    setup(materials[material].uniforms)

    renderer.setRenderTarget(null)
    if (config.clipping) {
      renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
      renderer.render(scene, camera)
      renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
      renderer.render(scene, cameras.orthographic)
    } else {
      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
    }
  }

  materials[material].visible = false
}

export const registeredIDs = {
  sin: 'sin',
  identity: 'identity',
  experiments: 'experiments',
  volume2D: 'volume2D',
  volume3D: 'volume3D'
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
    time += 0.005
  }

  computeStep({
    material: 'sin',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.uTime.value = time
    }
  })

  computeStep({
    material: 'identity',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
    }
  })

  computeStep({
    material: 'experiments',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
    }
  })

  displayStep({
    material: 'volume2D',
    camera: cameras.perspective,
    setup: (uniforms) => {
      buffers.display.texture3D.minFilter = THREE.NearestFilter
      buffers.display.texture3D.magFilter = THREE.NearestFilter
      uniforms.uDensity.value = config.resolution
      uniforms.sBuffer.value = buffers.display.texture3D
    }
  })

  displayStep({
    material: 'volume3D',
    camera: cameras.orthographic3D,
    setup: (uniforms) => {
      buffers.display.texture3D.minFilter = THREE.LinearFilter
      buffers.display.texture3D.magFilter = THREE.LinearFilter
      uniforms.u_data.value = buffers.display.texture3D
      uniforms.u_size.value.set(config.resolution, config.resolution, config.resolution)
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
