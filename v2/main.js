import * as THREE from './lib/three.module.js'
import Stats from './lib/stats.module.js'
import { OrbitControls } from './lib/OrbitControls.js'

import { config, objects, cameras } from './js/data.js'
import { loadMeshes } from './js/meshes.js'
import { setupGUI } from './js/gui.js'
import { loadMaterials, materials } from './js/materials.js'
import { newGeometry } from './js/geometry.js'

/* global requestAnimationFrame, performance */

const stats = new Stats()
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()

const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic: new OrbitControls(cameras.orthographic, renderer.domElement)
}

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

  cameras.perspective.position.z = 2000
  objects.orthographicHelper.visible = config.showOrthographicHelper
  controls.perspective.enablePan = false
  controls.perspective.autoRotate = true
  controls.orthographic.enablePan = false
  controls.orthographic.enableRotate = false

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
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  stats.update()
  render()
}

let time = 0
function render () {
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

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    config.pause = !config.pause
  }
})
