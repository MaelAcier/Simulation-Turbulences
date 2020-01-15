import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

export class Buffer {
  constructor (sizeID) {
    this.sizeID = sizeID
    const size = config.resolutions[sizeID]
    this.texture3D = new THREE.DataTexture3D(new Float32Array(size ** 3 * 4), size, size, size)
  }
}

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material].uniforms)
  }

  const sizeID = buffers[bufferOutput].sizeID
  const size = config.resolutions[sizeID]
  const texture2D = new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType })
  const planeSize = (size ** 2 * 4)
  const pixelBuffers = Array.from(Array(size), () => new Float32Array(planeSize))

  const data = new Float32Array(planeSize * size)
  for (let i = 0; i < size; i++) {
    materials[material].uniforms.uZ.value = i / size

    if (config.renderTarget === id && i === config.depth) {
      renderer.setRenderTarget(null)
      renderer.render(scene, cameras.texture)
    }
    renderer.setRenderTarget(texture2D)
    renderer.render(scene, cameras.texture)

    renderer.readRenderTargetPixels(texture2D, 0, 0, size, size, pixelBuffers[i])
    data.set(pixelBuffers[i], i * planeSize)
  }

  const texture3D = new THREE.DataTexture3D(data, size, size, size)
  texture3D.format = THREE.RGBAFormat
  texture3D.type = THREE.FloatType
  texture3D.unpackAlignment = 1
  buffers[bufferOutput].texture3D = texture3D

  materials[material].visible = false
}

export function displayStep ({ material, camera, setup }) {
  materials[material].visible = true

  if (config.renderTarget === material) {
    setup(materials[material].uniforms)

    renderer.setRenderTarget(null)
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
  }

  materials[material].visible = false
}

export const registeredIDs = {
  sin: 'sin',
  // identity: 'identity',
  id1: 'id1',
  id2: 'id2',
  experiments: 'experiments',
  volume2D: 'volume2D',
  volume3D: 'volume3D'
}

export const buffers = {
  sin: new Buffer(0),
  display: new Buffer(2)
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
    bufferOutput: 'sin',
    setup: (uniforms) => {
      uniforms.uTime.value = time
    }
  })

  computeStep({
    material: 'identity',
    bufferOutput: 'display',
    id: 'id1',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.sin.texture3D
    }
  })

  computeStep({
    material: 'identity',
    bufferOutput: 'display',
    id: 'id2',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
    }
  })

  /* computeStep({
    material: 'experiments',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sBuffer.value = buffers.display.texture3D
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
