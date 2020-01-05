import Stats from './lib/stats.module.js'
import { WEBGL } from './lib/WebGL.js'

import { config, objects, cameras, scene, renderer, controls } from './js/data.js'
import { loadMaterials } from './js/materials.js'
import { loadMeshes } from './js/meshes.js'
import { setupGUI } from './js/gui.js'
import { renderingPipeline } from './js/render.js'
// import {} from './3d.js'

/* global requestAnimationFrame */

const stats = new Stats()

loadMaterials(() => {
  init()
  animate()
})

function init () {
  /* if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage())
  } */

  /* if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  } */

  cameras.perspective.position.set(config.distance, config.distance, config.distance)
  cameras.perspective.lookAt(0, 0, 0)
  controls.perspective.update()

  objects.orthographicHelper.visible = config.showOrthographicHelper
  scene.add(objects.orthographicHelper)

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

  window.addEventListener('resize', onWindowResize, false)
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)

  loadMeshes()
  setupGUI(scene)

  /* const gl = renderer.domElement.getContext('webgl') || renderer.domElement.getContext('experimental-webgl')
  gl.getExtension('WEBGL_color_buffer_float')
  gl.getExtension('EXT_float_blend') */
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
  /* var time = performance.now() * 0.0005

  materials.planeArray.uniforms.uTime.value = time
  materials.sin.uniforms.uTime.value = time

  renderer.render(scene, cameras.perspective) */
  renderingPipeline()
  stats.update()
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    config.pause = !config.pause
  }
})
