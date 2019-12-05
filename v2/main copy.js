import * as THREE from './lib/three.module.js'
import Stats from './lib/stats.module.js'
import { OrbitControls } from './lib/OrbitControls.js'

import { config, objects, cameras, scene, renderer } from './js/data.js'
import { setupMesh, material } from './js/mesh.js'
import setupGUI from './js/gui.js'

/* global requestAnimationFrame, performance */

let container, stats

const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic: new OrbitControls(cameras.orthographic, renderer.domElement)
}

function init () {
  if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  }

  container = document.createElement('div')
  document.body.appendChild(container)

  stats = new Stats()

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

  objects.planesClipHelpers.add(new THREE.PlaneHelper(objects.clipPlanes[0], 1100, 0xff0000))
  objects.planesClipHelpers.add(new THREE.PlaneHelper(objects.clipPlanes[1], 1100, 0x00ff00))
  objects.planesClipHelpers.add(new THREE.PlaneHelper(objects.clipPlanes[2], 1100, 0x0000ff))
  objects.planesClipHelpers.visible = config.showPlaneHelpers

  scene.add(objects.orthographicHelper)
  scene.add(objects.planesClipHelpers)

  setupMesh({ density: config.density })
  setupGUI()

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

function render () {
  const time = performance.now() * 0.0005
  if (!config.pause) {
    material.uniforms['time'].value = time
    material.uniforms['planeConstant'].value = -config.planeConstant / 500
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
  /* if (e.key === ' ') {
    splatStack.push(parseInt(Math.random() * 20) + 5)
  } */
})

init()
animate()
