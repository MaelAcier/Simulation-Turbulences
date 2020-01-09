import * as THREE from '../lib/three.module.js'
import { materials } from './materials.js'
import { scene, config } from './data.js'

export const meshes = {}

export function loadMeshes () {
  loadComputingPlans()
  loadVolume2D()
  loadVolume3D()
}

function loadComputingPlans () {
  for (const key in materials) {
    if (materialNeedComputing(key)) {
      const material = materials[key]

      if (meshes[key]) {
        scene.remove(meshes[key])
      }

      const geometry = new THREE.BufferGeometry()
      const vertices = new Float32Array([
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,

        1, 1, 0,
        0, 1, 0,
        0, 0, 0
      ])
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

      meshes[key] = new THREE.Mesh(geometry, material)
      meshes[key].position.set(-0.5, -0.5, -0.5)
      scene.add(meshes[key])
    }
  }
}

function loadVolume2D () {
  if (meshes.volume2D) {
    scene.remove(meshes.volume2D)
  }

  meshes.volume2D = new THREE.Group()
  for (let x = 0; x < config.resolution; x++) {
    const offset = x / config.resolution
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, offset,
      1, 0, offset,
      1, 1, offset,

      1, 1, offset,
      0, 1, offset,
      0, 0, offset
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const mesh = new THREE.Mesh(geometry, materials.volume2D)
    meshes.volume2D.add(mesh)
  }

  meshes.volume2D.position.set(-0.5, -0.5, -0.5)
  scene.add(meshes.volume2D)
}

function loadVolume3D () {
  if (meshes.volume3D) {
    scene.remove(meshes.volume3D)
  }

  const geometry = new THREE.BoxBufferGeometry(config.resolution, config.resolution, config.resolution)
  geometry.translate(config.resolution / 2 - 0.5, config.resolution / 2 - 0.5, config.resolution / 2 - 0.5)

  meshes.volume3D = new THREE.Mesh(geometry, materials.volume3D)
  meshes.volume3D.scale.set(1 / config.resolution, 1 / config.resolution, 1 / config.resolution)
  meshes.volume3D.position.set(-0.5, -0.5, -0.5)
  scene.add(meshes.volume3D)
}

function materialNeedComputing (key) {
  return !['volume2D', 'volume3D'].includes(key)
}
