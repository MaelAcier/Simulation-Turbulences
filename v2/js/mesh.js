import * as THREE from '../lib/three.module.js'
import { config, objects, scene } from './data.js'

export let material

export function setupMesh ({ density, distribution = 'grid' }) {
  if (objects.mesh) scene.remove(objects.mesh)

  const circleGeometry = new THREE.CircleBufferGeometry(1, 4)
  const geometry = new THREE.InstancedBufferGeometry()
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
      time: { value: 0.0 },
      planeConstant: { value: config.planeConstant }
    },
    vertexShader: document.getElementById('vshader').textContent,
    fragmentShader: document.getElementById('fshader').textContent,
    depthTest: true,
    depthWrite: true
  })

  objects.mesh = new THREE.Mesh(geometry, material)
  objects.mesh.scale.set(500, 500, 500)
  scene.add(objects.mesh)
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
