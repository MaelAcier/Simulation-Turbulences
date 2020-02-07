import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

export class Buffer {
  constructor (sizeID) {
    this.sizeID = sizeID
    this.resize()
  }

  resize () {
    this.cubeSize = config.resolutions[this.sizeID]
    const textureSize = this.cubeSize * Math.sqrt(this.cubeSize)
    this.data = new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType })
    this.renderTarget = new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType })
  }

  swap () {
    const temp = this.data
    this.data = this.renderTarget
    this.renderTarget = temp
  }
}

export function computeStep ({ material, bufferOutput, setup, id = material }) {
  materials[material].visible = true

  if (!config.pause) {
    setup(materials[material].uniforms)
  }

  const sizeID = buffers[bufferOutput].sizeID
  const cubeSize = config.resolutions[sizeID]
  const textureSize = cubeSize * Math.ceil(Math.sqrt(cubeSize))

  materials[material].uniforms.uCubeSize.value = cubeSize

  if (config.renderTarget === id) {
    renderer.setRenderTarget(null)
    renderer.setScissor(0, 0, textureSize, textureSize)
    renderer.render(scene, cameras.texture)
  }
  renderer.setRenderTarget(buffers[bufferOutput].renderTarget)
  renderer.render(scene, cameras.texture)

  buffers[bufferOutput].swap()

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
  curl: 'curl',
  divergence: 'divergence',
  vorticity: 'vorticity',
  clear: 'clear',
  pressure: 'pressure',
  gradientSubtract: 'gradientSubtract',
  'advection - velocity': 'advection - velocity',
  'advection - dye': 'advection - dye',
  'splat - velocity': 'splat - velocity',
  'splat - dye': 'splat - dye',
  display: 'display',
  volume2D: 'volume2D',
  volume3D: 'volume3D'
}

export const buffers = {
  sin: new Buffer(0),
  curl: new Buffer(0),
  velocity: new Buffer(0),
  divergence: new Buffer(0),
  pressure: new Buffer(0),
  dye: new Buffer(1),
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

// let time = 0

export function renderingPipeline () {
  const dt = calcDeltaTime()

  // if (!config.pause) {
  //   time += 0.005
  // }

  renderer.setScissorTest(true)

  /*   computeStep({
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
      uniforms.sData.value = buffers.sin.data.texture
      uniforms.uDataSize.value = buffers.sin.cubeSize
    }
  }) */

  computeStep({
    material: 'curl',
    bufferOutput: 'curl',
    setup: (uniforms) => {
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
    }
  })

  computeStep({
    material: 'divergence',
    bufferOutput: 'divergence',
    setup: (uniforms) => {
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
    }
  })

  computeStep({
    material: 'vorticity',
    bufferOutput: 'velocity',
    setup: (uniforms) => {
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
      uniforms.sCurl.value = buffers.curl.data.texture
      uniforms.uCurlSize.value = buffers.curl.cubeSize
      uniforms.uCurl.value = config.CURL
      uniforms.uDt.value = dt
    }
  })

  computeStep({
    material: 'clear',
    bufferOutput: 'pressure',
    setup: (uniforms) => {
      uniforms.sPressure.value = buffers.pressure.data.texture
      uniforms.uPressureSize.value = buffers.pressure.cubeSize
      uniforms.uPressure.value = config.PRESSURE
    }
  })

  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    computeStep({
      material: 'pressure',
      bufferOutput: 'pressure',
      setup: (uniforms) => {
        uniforms.sPressure.value = buffers.pressure.data.texture
        uniforms.uPressureSize.value = buffers.pressure.cubeSize
        uniforms.sDivergence.value = buffers.divergence.data.texture
        uniforms.uDivergenceSize.value = buffers.divergence.cubeSize
      }
    })
  }

  computeStep({
    material: 'gradientSubtract',
    bufferOutput: 'velocity',
    setup: (uniforms) => {
      uniforms.sPressure.value = buffers.pressure.data.texture
      uniforms.uPressureSize.value = buffers.pressure.cubeSize
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
    }
  })

  computeStep({
    material: 'advection',
    bufferOutput: 'velocity',
    id: 'advection - velocity',
    setup: (uniforms) => {
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
      uniforms.sSource.value = buffers.velocity.data.texture
      uniforms.uSourceSize.value = buffers.velocity.cubeSize
      uniforms.uDissipation.value = config.VELOCITY_DISSIPATION
      uniforms.uDt.value = dt
    }
  })

  computeStep({
    material: 'advection',
    bufferOutput: 'dye',
    id: 'advection - dye',
    setup: (uniforms) => {
      uniforms.sVelocity.value = buffers.velocity.data.texture
      uniforms.uVelocitySize.value = buffers.velocity.cubeSize
      uniforms.sSource.value = buffers.dye.data.texture
      uniforms.uSourceSize.value = buffers.dye.cubeSize
      uniforms.uDissipation.value = config.DENSITY_DISSIPATION
      uniforms.uDt.value = dt
    }
  })
  computeStep({
    material: 'display',
    bufferOutput: 'display',
    setup: (uniforms) => {
      uniforms.sDye.value = buffers.dye.data.texture
      uniforms.uDyeSize.value = buffers.dye.cubeSize
    }
  })

  renderer.setScissorTest(false)

  displayStep({
    material: 'volume2D',
    camera: cameras.perspective,
    setup: (uniforms) => {
      uniforms.sData.value = buffers.display.data.texture
      uniforms.uDataSize.value = buffers.display.cubeSize
    }
  })

  displayStep({
    material: 'volume3D',
    camera: cameras.orthographic3D,
    setup: (uniforms) => {
      uniforms.sData.value = buffers.display.data.texture
      uniforms.uDataSize.value = buffers.display.cubeSize
    }
  })

  if (config.autoRotation) {
    controls.perspective.update()
  }
}
