import * as THREE from './js/three.module.js'
import { OrbitControls } from './js/OrbitControls.js'
import { GUI } from './js/dat.gui.module.js'
import Stats from './js/stats.module.js'

/* global requestAnimationFrame, performance */

let container, stats
let camera, scene, renderer, controls
let geometry, material, mesh

const params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false,
  density: 40
}

const clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
]

function init () {
  renderer = new THREE.WebGLRenderer()

  if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  }

  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000)
  camera.position.z = 1400

  scene = new THREE.Scene()
  controls = new OrbitControls(camera, renderer.domElement)

  setupMesh(40)

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.localClippingEnabled = true
  container.appendChild(renderer.domElement)

  stats = new Stats()
  container.appendChild(stats.dom)
  window.addEventListener('resize', onWindowResize, false)

  // helpers
  var helpers = new THREE.Group()
  helpers.add(new THREE.PlaneHelper(clipPlanes[0], 1100, 0xff0000))
  helpers.add(new THREE.PlaneHelper(clipPlanes[1], 1100, 0x00ff00))
  helpers.add(new THREE.PlaneHelper(clipPlanes[2], 1100, 0x0000ff))
  helpers.visible = false
  scene.add(helpers)

  // gui
  var gui = new GUI()
  gui.add(params, 'clipIntersection').name('Découpage').onChange(function (value) {
    mesh.material.clipIntersection = value
  })

  gui.add(params, 'planeConstant', -500, 500).step(10).name('Coordonnées plans').onChange(function (value) {
    for (var j = 0; j < clipPlanes.length; j++) {
      clipPlanes[j].constant = value
    }
  })

  gui.add(params, 'density', 1, 200).step(1).name('Densité').onChange(function (value) {
    setupMesh(value)
  })

  gui.add(params, 'showHelpers').name('Afficher les plans').onChange(function (value) {
    helpers.visible = value
  })

  return true
}

function setupMesh (density, random) {
  if (mesh) scene.remove(mesh)

  const circleGeometry = new THREE.CircleBufferGeometry(1, 6)
  geometry = new THREE.InstancedBufferGeometry()
  geometry.index = circleGeometry.index
  geometry.attributes = circleGeometry.attributes

  const translateArray = random ? particlesRandom(density) : particlesGrid(density)

  geometry.setAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3))
  material = new THREE.RawShaderMaterial({
    uniforms: {
      'map': { value: new THREE.TextureLoader().load('circle.png') },
      'time': { value: 0.0 }
    },
    vertexShader: document.getElementById('vshader').textContent,
    fragmentShader: document.getElementById('fshader').textContent,
    depthTest: true,
    depthWrite: true,
    clipping: true,
    clippingPlanes: clipPlanes,
    clipIntersection: params.clipIntersection
  })

  mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(500, 500, 500)
  scene.add(mesh)
}

function particlesRandom (density) {
  const particleCount = density ** 3
  const translateArray = new Float32Array(particleCount * 3)
  for (let i = 0, i3 = 0, l = particleCount; i < l; i++ , i3 += 3) {
    translateArray[i3 + 0] = Math.random() * 2 - 1
    translateArray[i3 + 1] = Math.random() * 2 - 1
    translateArray[i3 + 2] = Math.random() * 2 - 1
  }
  return translateArray
}

function particlesGrid (density) {
  const particleCount = density ** 3
  density--
  const translateArray = new Float32Array(particleCount * 3)

  for (let x = 0, i3 = 0; x <= density; x++) {
    for (let y = 0; y <= density; y++) {
      for (let z = 0; z <= density; z++) {
        translateArray[i3 + 0] = (x / density) * 2 - 1
        translateArray[i3 + 1] = (y / density) * 2 - 1
        translateArray[i3 + 2] = (z / density) * 2 - 1
        i3 += 3
      }
    }
  }
  return translateArray
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
  stats.update()
}

function render () {
  const time = performance.now() * 0.0005
  material.uniforms['time'].value = time
  // mesh.rotation.x = time * 0.2
  // mesh.rotation.y = time * 0.4
  renderer.render(scene, camera)
}

if (init()) {
  animate()
}
