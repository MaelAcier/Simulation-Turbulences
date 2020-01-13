import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

class TextureManager {
  constructor () {
    this.index = {}
    this.init()
  }

  init () {
    for (const key in config.resolutions) {
      const res = config.resolutions[key]
      this.index[res] = new TextureArray(res)
    }
  }

  resize () {
    this.index = {}
    this.init()
    for (const key in buffers) {
      const buffer = buffers[key]
      buffer.size = config.resolutions[buffer.sizeID]
    }
  }
}

class TextureArray {
  constructor (size) {
    this.oldTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.currentTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
  }

  swap () {
    const temp = this.oldTextures
    this.oldTextures = this.currentTextures
    this.currentTextures = temp
  }
}

class Buffer {
  constructor (sizeID = 0) {
    this.sizeID = sizeID
    this.size = config.resolutions[sizeID]
    this.toTexture()
  }

  get data () {
    return textureManager.index[this.size]
  }

  toTexture () {
    const planeSize = (this.size ** 2 * 4)
    const pixelBuffers = Array.from(Array(this.size), () => new Float32Array(planeSize))
    for (let i = 0; i < this.size; i++) {
      renderer.readRenderTargetPixels(this.data.currentTextures[i], 0, 0, this.size, this.size, pixelBuffers[i])
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

export const textureManager = new TextureManager()

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material].uniforms)
  }

  for (let i = 0; i < buffers[bufferOutput].size; i++) {
    materials[material].uniforms.uZ.value = i / buffers[bufferOutput].size

    if (config.renderTarget === id && i === config.depth) {
      renderer.setRenderTarget(null)
      renderer.render(scene, cameras.texture)
    }
    renderer.setRenderTarget(buffers[bufferOutput].data.oldTextures[i])
    renderer.render(scene, cameras.texture)
  }

  buffers[bufferOutput].data.swap()
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
  'splat - velocity': 'splat - velocity',
  'splat - dye': 'splat - dye',
  curl: 'curl',
  divergence: 'divergence',
  vorticity: 'vorticity',
  clear: 'clear',
  pressure: 'pressure',
  gradientSubtract: 'gradientSubtract',
  'advection - dye': 'advection - dye',
  'advection - velocity': 'advection - velocity',
  display: 'display',
  volume2D: 'volume2D',
  volume3D: 'volume3D'
}

export const buffers = {
  velocity: new Buffer(0),
  dye: new Buffer(1),
  curl: new Buffer(0),
  pressure: new Buffer(0),
  divergence: new Buffer(0),
  display: new Buffer(1)
}

let lastUpdateTime = Date.now()

function calcDeltaTime () {
  const now = Date.now()
  let dt = (now - lastUpdateTime) / 1000
  dt = Math.min(dt, 0.016666)
  lastUpdateTime = now
  return dt
}

let time = 0

export function renderingPipeline () {
  const dt = calcDeltaTime()

  if (!config.pause) {
    time += 0.005
  }

  /* computeStep({
    material: 'curl',
    bufferOutput: 'curl',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
      uniforms.sVelocity.value = buffers.velocity.texture3D
    }
  })

  computeStep({
    material: 'divergence',
    bufferOutput: 'velocity',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
      uniforms.sVelocity.value = buffers.velocity.texture3D
    }
  })

  computeStep({
    material: 'vorticity',
    bufferOutput: 'velocity',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
      uniforms.sVelocity.value = buffers.velocity.texture3D
      uniforms.sCurl.value = buffers.curl.texture3D
      uniforms.curl.value = config.CURL
      uniforms.dt.value = dt
    }
  })

  computeStep({
    material: 'clear',
    bufferOutput: 'pressure',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
      uniforms.sTexture.value = buffers.pressure.texture3D
      uniforms.value.value = config.PRESSURE
    }
  })

  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    computeStep({
      material: 'pressure',
      bufferOutput: 'velocity',
      id: i === config.pressureIterations - 1 ? 'pressure' : '',
      setup: (uniforms) => {
        uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
        uniforms.sDivergence.value = buffers.divergence.texture3D
        uniforms.sPressure.value = buffers.pressure.texture3D
      }
    })
  }

  computeStep({
    material: 'gradientSubtract',
    bufferOutput: 'velocity',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resolution, 1 / config.resolution)
      uniforms.sVelocity.value = buffers.velocity.texture3D
      uniforms.sPressure.value = buffers.pressure.texture3D
    }
  })

  computeStep({
    material: 'advection',
    bufferOutput: 'velocity',
    id: 'advection - velocity',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resDisplay, 1 / config.resDisplay)
      uniforms.sVelocity.value = buffers.velocity.texture3D
      uniforms.sSource.value = buffers.velocity.texture3D
      uniforms.dt.value = dt
      uniforms.dissipation.value = config.VELOCITY_DISSIPATION
    }
  })

  computeStep({
    material: 'advection',
    bufferOutput: 'dye',
    id: 'advection - dye',
    setup: (uniforms) => {
      uniforms.texelSize.value.set(1 / config.resDisplay, 1 / config.resDisplay)
      uniforms.sVelocity.value = buffers.velocity.texture3D
      uniforms.sSource.value = buffers.dye.texture3D
      uniforms.dt.value = dt
      uniforms.dissipation.value = config.DENSITY_DISSIPATION
    }
  })

  computeStep({
    material: 'display',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sTexture.value = buffers.dye.texture3D
    }
  }) */

  computeStep({
    material: 'sin',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.uTime.value = time
      uniforms.texelSize.value.set(1 / config.resolutions[0], 1 / config.resolutions[0])
    }
  })

  computeStep({
    material: 'identity',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
      uniforms.texelSize.value.set(1 / config.resolutions[0], 1 / config.resolutions[0])
    }
  })

  /* computeStep({
    material: 'experiments',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
      uniforms.texelSize.value.set(1 / config.resolutions[0], 1 / config.resolutions[0])
    }
  }) */

  displayStep({
    material: 'volume2D',
    camera: cameras.perspective,
    setup: (uniforms) => {
      buffers.display.texture3D.minFilter = THREE.NearestFilter
      buffers.display.texture3D.magFilter = THREE.NearestFilter
      uniforms.uDensity.value = config.resolutions[1]
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
      uniforms.u_size.value.set(config.resolutions[1], config.resolutions[1], config.resolutions[1])
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}

/**
 * Only update uniforms when needed
 * Layers
 * Power of 2 textures
 */
