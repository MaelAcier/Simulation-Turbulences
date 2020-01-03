import * as THREE from './lib/three.module.js'

import Stats from './lib/stats.module.js'
import { GUI } from './lib/dat.gui.module.js'
import { OrbitControls } from './lib/OrbitControls.js'

/* global requestAnimationFrame, performance */

var camera, scene, renderer, stats

var material
var amount = 40

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(2, 2, 2)
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene()

  material = new THREE.RawShaderMaterial({
    uniforms: {
      time: { value: 0.0 }
    },
    vertexShader: document.getElementById('vshader').textContent,
    fragmentShader: document.getElementById('fshader').textContent,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide
  })

  for (let x = 0; x < amount; x++) {
    const offset = x / amount
    const geometry = new THREE.BufferGeometry()
    var vertices = new Float32Array([
      0, 0, offset,
      1, 0, offset,
      1, 1, offset,

      1, 1, offset,
      0, 1, offset,
      0, 0, offset
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3))
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(-0.5, -0.5, -0.5)
    scene.add(mesh)
  }

  //

  var gui = new GUI()
  // gui.add(mesh, 'count', 0, amount)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  new OrbitControls(camera, renderer.domElement)

  stats = new Stats()
  document.body.appendChild(stats.dom)

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  var time = performance.now() * 0.0005

  material.uniforms.time.value = time

  renderer.render(scene, camera)
  stats.update()
}
