import Stats from './lib/stats.module.js'

import { config, objects, cameras, scene, renderer, controls } from './js/data.js'
import { loadMeshes } from './js/meshes.js'
import { setupGUI } from './js/gui.js'
import { loadMaterials } from './js/materials.js'
import { newGeometry } from './js/geometry.js'
import { render } from './js/render.js'

/* global requestAnimationFrame */

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

  const container = document.createElement('div')
  document.body.appendChild(container)

  cameras.perspective.position.x = config.distance
  cameras.perspective.position.y = config.distance
  cameras.perspective.position.z = config.distance
  controls.perspective.update()

  objects.orthographicHelper.visible = config.showOrthographicHelper
  controls.perspective.enablePan = false
  controls.perspective.autoRotate = true
  controls.orthographic.enablePan = false
  controls.orthographic.enableRotate = false
  controls.texture.enablePan = false
  controls.texture.enableRotate = false
  controls.texture.enableZoom = false

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)
  container.appendChild(stats.dom)

  window.addEventListener('resize', onWindowResize, false)

  scene.add(objects.orthographicHelper)

  loadMeshes(scene, newGeometry({ density: config.density }))
  setupGUI(scene)

  return true
}

function onWindowResize () {
  cameras.perspective.aspect = window.innerWidth / window.innerHeight
  cameras.perspective.updateProjectionMatrix()
  cameras.orthographic.aspect = window.innerWidth / window.innerHeight
  cameras.orthographic.updateProjectionMatrix()
  cameras.texture.aspect = window.innerWidth / window.innerHeight
  cameras.texture.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  stats.update()
  render()
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    config.pause = !config.pause
  }
})
