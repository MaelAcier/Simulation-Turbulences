import * as THREE from './js/three.module.js'
import { OrbitControls } from './js/OrbitControls.js'
import { GUI } from './js/dat.gui.module.js'
import Stats from './js/stats.module.js'

/* global requestAnimationFrame, performance */

let container, stats
let camera, scene, renderer, helpers
let geometry, material, mesh
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

const params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false,
  density: 40,
  distribution: 'grid',
  pause: false,
  autoRotation: false,
  rotationSpeed: 5
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
  camera.position.z = 2000

  scene = new THREE.Scene()
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false

  setupMesh({
    density: 40
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.localClippingEnabled = true
  container.appendChild(renderer.domElement)

  stats = new Stats()
  container.appendChild(stats.dom)
  window.addEventListener('resize', onWindowResize, false)

  // helpers
  helpers = new THREE.Group()
  helpers.add(new THREE.PlaneHelper(clipPlanes[0], 1100, 0xff0000))
  helpers.add(new THREE.PlaneHelper(clipPlanes[1], 1100, 0x00ff00))
  helpers.add(new THREE.PlaneHelper(clipPlanes[2], 1100, 0x0000ff))
  helpers.visible = false
  scene.add(helpers)

  setupGUI()

  return true
}

function setupGUI () {
  const gui = new GUI({ width: 350 })

  gui.add(params, 'distribution', { Grille: 'grid', Crystal: 'crystal', Aléatoire: 'random' }).name('Répartition').onChange(() => setupMesh(params))
  gui.add(params, 'density', 2, 200).step(1).name('Densité').onChange(() => setupMesh(params))

  gui.add(params, 'planeConstant', -500, 500).step(10).name('Coordonnées plans').onChange(function (value) {
    for (var j = 0; j < clipPlanes.length; j++) {
      clipPlanes[j].constant = value
    }
  })
  gui.add(params, 'clipIntersection').name('Découpage').onChange(function (value) {
    mesh.material.clipIntersection = value
  })
  gui.add(params, 'showHelpers').name('Afficher les plans').onChange(function (value) {
    helpers.visible = value
  })

  gui.add(params, 'pause').name('Pause').listen()
  gui.add(params, 'autoRotation').name('Rotation automatique').listen()
  gui.add(params, 'rotationSpeed', 0, 10).step(1).name('Vitesse de rotation').listen()
}

function setupMesh ({ density, distribution = 'grid' }) {
  if (mesh) scene.remove(mesh)

  const circleGeometry = new THREE.CircleBufferGeometry(1, 6)
  geometry = new THREE.InstancedBufferGeometry()
  geometry.index = circleGeometry.index
  geometry.attributes = circleGeometry.attributes

  let translateArray
  switch (distribution) {
    case 'random':
      translateArray = particlesRandom(density)
      break
    case 'crystal':
      translateArray = particlesCrystal(density)
      break
    default:
      translateArray = particlesGrid(density)
      break
  }

  geometry.setAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3))
  material = new THREE.RawShaderMaterial({
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 }
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
  for (let j = 0, i = 0, l = particleCount; j < l; j++) {
    translateArray[i + 0] = Math.random() * 2 - 1
    translateArray[i + 1] = Math.random() * 2 - 1
    translateArray[i + 2] = Math.random() * 2 - 1
    i += 3
  }
  return translateArray
}

function particlesGrid (density) {
  const particleCount = density ** 3
  const translateArray = new Float32Array(particleCount * 3)
  density--

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

function particlesCrystal (density) {
  const particleCount = density ** 3 + (density - 1) ** 3
  const translateArray = new Float32Array(particleCount * 3)
  density--

  let i = 0
  for (let x = 0; x <= density; x++) {
    for (let y = 0; y <= density; y++) {
      for (let z = 0; z <= density; z++) {
        translateArray[i + 0] = (x / density) * 2 - 1
        translateArray[i + 1] = (y / density) * 2 - 1
        translateArray[i + 2] = (z / density) * 2 - 1
        i += 3
      }
    }
  }

  const offset = 0.5 / density
  for (let x = 0; x <= density - 1; x++) {
    for (let y = 0; y <= density - 1; y++) {
      for (let z = 0; z <= density - 1; z++) {
        translateArray[i + 0] = (x / density + offset) * 2 - 1
        translateArray[i + 1] = (y / density + offset) * 2 - 1
        translateArray[i + 2] = (z / density + offset) * 2 - 1
        i += 3
      }
    }
  }
  return translateArray
}

window.addEventListener('mousemove', onMouseMove, false)

function onMouseMove (event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  stats.update()
  render()
}

function render () {
  const time = performance.now() * 0.0005
  if (!params.pause) {
    material.uniforms['time'].value = time
  }
  if (params.autoRotation) {
    mesh.rotation.x += params.rotationSpeed / 100
    mesh.rotation.y += params.rotationSpeed / 100
  }
  renderer.render(scene, camera)
  // console.log(raycaster.intersectObjects(scene.children))
}

if (init()) {
  animate()
}