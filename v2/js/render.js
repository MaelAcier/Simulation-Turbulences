import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer, controls } from './data.js'

/* const field0 = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters)

field0.background = new THREE.Color(0x000000)

const field1 = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters)

field1.background = new THREE.Color(0x000000)

const fieldProj = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters)

fieldProj.background = new THREE.Color(0x000000)

scene.background = new THREE.Color(0x000000) */

let time = 0
export function render () {
  // const time = performance.now() * 0.0005
  if (!config.pause) {
    time += 0.005
    materials.sin.uniforms['time'].value = time
  }
  if (config.autoRotation) {
    controls.perspective.update()
  }
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

function step (material, update) {
  materials[material].visible = true

  update()

  // this.diffuseMaterial.uniforms["densityMap"].value = this.field0.texture

  renderer.setRenderTarget(field1)

  if (config.clipping) {
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene, cameras.perspective)
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene, cameras.orthographic)
  } else {
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    renderer.render(scene, cameras.perspective)
  }

  materials[material].visible = false

  this.swapTextures()
}
