import * as THREE from './lib/three.module.js'

import Stats from './lib/stats.module.js'

import { config, objects, cameras, scene, renderer, controls } from './js/data.js'
import { loadMaterials, materials } from './js/materials.js'
import { setupGUI } from './js/gui.js'
import { loadMeshes } from './js/meshes.js'

/* global requestAnimationFrame, performance */

const stats = new Stats()

loadMaterials(() => {
  init()
  animate()
})

function init () {
  if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  }

  cameras.perspective.position.set(2, 2, 2)
  cameras.perspective.lookAt(0, 0, 0)

  loadMeshes()
  setupGUI(scene)

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  document.body.appendChild(stats.dom)

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  cameras.perspective.aspect = window.innerWidth / window.innerHeight
  cameras.perspective.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  var time = performance.now() * 0.0005

  materials.planeArray.uniforms.uTime.value = time
  materials.sin.uniforms.uTime.value = time

  renderer.render(scene, cameras.perspective)
  stats.update()
}
