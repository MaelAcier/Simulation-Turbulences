import * as THREE from './js/three.module.js'

import { OrbitControls } from './js/OrbitControls.js'
/* global requestAnimationFrame */

import getWebGLContext from './javascript/webGLContext.js'
import resizeCanvas from './javascript/resizeCanvas.js'
import startGUI from './javascript/GUI.js'
import { loadShaders } from './javascript/shaders.js'
import { loadPrograms } from './javascript/programs.js'
import { loadMaterials } from './javascript/materials.js'
import { multipleSplats } from './javascript/splats.js'
import update from './javascript/update.js'
import initEvents from './javascript/events.js'

const canvas = document.getElementById('glCanvas')

const webGLContext = getWebGLContext(canvas)
const gl = webGLContext.gl

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(0)

// resizeCanvas(canvas)

loadShaders(gl, 'shaders', [
  'advection.fs',
  'bloomBlur.fs',
  'bloomPrefilter.fs',
  'blurVertex.vs',
  'clear.fs',
  'copy.fs',
  'display.fs',
  'gradientSubtract.fs',
  'splat.fs',
  'sunraysMask.fs',
  'baseVertex.vs',
  'bloomFinal.fs',
  'blur.fs',
  'checkerboard.fs',
  'color.fs',
  'curl.fs',
  'divergence.fs',
  'pressure.fs',
  'sunrays.fs',
  'vorticity.fs'
]).then(() => {
  loadPrograms(gl)
  loadMaterials(gl)
    .then(() => {
      startGUI(webGLContext)
      multipleSplats(webGLContext, parseInt(Math.random() * 20) + 5)
      update(webGLContext)
      initEvents(canvas)
    })
})

var camera, scene, renderer, controls, mesh, material
// var drawStartPos = new THREE.Vector2()

init()
setupCanvasDrawing()
animate()

function init () {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000)
  camera.position.z = 500

  scene = new THREE.Scene()

  material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true })

  // mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 200, 200, 200 ), material )
  for (let i = 0; i < 128; i++) {
    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 128, 128), material)
    mesh.position.z = i
    scene.add(mesh)
  }

  renderer = new THREE.WebGLRenderer({ antialias: true })

  controls = new OrbitControls(camera, renderer.domElement)

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)
}

// Sets up the drawing canvas and adds it as the material map

function setupCanvasDrawing () {
  // get canvas and context

  var drawingCanvas = document.getElementById('glCanvas')
  material.map = new THREE.CanvasTexture(drawingCanvas)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  material.map.needsUpdate = true

  // controls.update()

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;

  renderer.render(scene, camera)
}
