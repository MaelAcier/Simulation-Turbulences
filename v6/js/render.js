import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

export class Buffer {
  constructor (sizeID) {
    this.sizeID = sizeID
    this.resize()
  }

  resize () {
    const cubeSize = config.resolutions[this.sizeID]
    const textureSize = cubeSize * Math.sqrt(cubeSize)
    this.renderTarget = new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType })
  }
}

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material].uniforms)
  }

  const sizeID = buffers[bufferOutput].sizeID
  const cubeSize = config.resolutions[sizeID]
  const textureSize = cubeSize * Math.sqrt(cubeSize)

  materials[material].uniforms.uProjectionSize.value = Math.sqrt(cubeSize)

  if (config.renderTarget === id) {
    renderer.setRenderTarget(null)
    renderer.setScissor(0, 0, textureSize, textureSize)
    renderer.render(scene, cameras.texture)
  }
  renderer.setRenderTarget(buffers[bufferOutput].renderTarget)
  renderer.render(scene, cameras.texture)

  buffers[bufferOutput].texture2D = buffers[bufferOutput].renderTarget.texture

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
  identity: 'identity',
  volume2D: 'volume2D',
  volume3D: 'volume3D'
}

export const buffers = {
  sin: new Buffer(0),
  display: new Buffer(1)
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

  renderer.setScissorTest(true)

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
    setup: (uniforms) => {
      uniforms.sData.value = buffers.sin.renderTarget.texture
    }
  })

  renderer.setScissorTest(false)

  displayStep({
    material: 'volume2D',
    camera: cameras.perspective,
    setup: (uniforms) => {
      uniforms.sData.value = buffers.display.renderTarget.texture
    }
  })

  displayStep({
    material: 'volume3D',
    camera: cameras.orthographic3D,
    setup: (uniforms) => {
      uniforms.sData.value = buffers.display.renderTarget.texture
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
