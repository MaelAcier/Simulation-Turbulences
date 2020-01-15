import Stats from './lib/stats.module.js'
import { WEBGL } from './lib/WebGL.js'

import { config, cameras, scene, renderer, controls } from './js/data.js'
import { loadMaterials } from './js/materials.js'
import { loadMeshes } from './js/meshes.js'
import { setupGUI } from './js/gui.js'
import { renderingPipeline } from './js/render.js'

/* global requestAnimationFrame */

const stats = new Stats()

loadMaterials(() => {
  init()
  animate()
})

function init () {
  if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage())
  }

  /* if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  } */

  cameras.perspective.position.set(config.distance, config.distance, config.distance)
  controls.perspective.update()

  cameras.orthographic3D.position.set(config.distance, config.distance, config.distance)
  controls.orthographic3D.update()

  controls.perspective.enablePan = false
  controls.perspective.autoRotate = true

  controls.orthographic3D.enablePan = false
  controls.orthographic3D.autoRotate = true

  controls.texture.enablePan = false
  controls.texture.enableRotate = false
  controls.texture.enableZoom = false

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener('resize', onWindowResize, false)
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)

  loadMeshes()
  render()
  setupGUI(scene)
}

function onWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight)

  const aspect = window.innerWidth / window.innerHeight
  const frustumHeight = cameras.orthographic3D.top - cameras.orthographic3D.bottom

  cameras.perspective.aspect = aspect

  cameras.orthographic3D.left = -frustumHeight * aspect / 2
  cameras.orthographic3D.right = frustumHeight * aspect / 2

  cameras.perspective.updateProjectionMatrix()
  cameras.orthographic3D.updateProjectionMatrix()
}

function animate () {
  render()
  requestAnimationFrame(animate)
}

function render () {
  renderingPipeline()
  stats.update()
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    config.pause = !config.pause
  }
})
