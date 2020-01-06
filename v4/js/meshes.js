import * as THREE from '../lib/three.module.js'
import { materials } from './materials.js'
import { scene, config } from './data.js'

export const meshes = {}

export function loadMeshes () {
  for (const key in materials) {
    if (material2D(key)) {
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

  if (meshes.planeArray) {
    scene.remove(meshes.planeArray)
  }
  meshes.planeArray = new THREE.Group()
  for (let x = 0; x < config.density; x++) {
    const offset = x / config.density
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
    const mesh = new THREE.Mesh(geometry, materials.planeArray)
    meshes.planeArray.add(mesh)
  }
  meshes.planeArray.position.set(-0.5, -0.5, -0.5)
  scene.add(meshes.planeArray)

  if (meshes.volume3D) {
    scene.remove(meshes.volume3D)
  }

  const geometry = new THREE.BoxBufferGeometry(config.density, config.density, config.density)
  geometry.translate(config.density / 2 - 0.5, config.density / 2 - 0.5, config.density / 2 - 0.5)

  meshes.volume3D = new THREE.Mesh(geometry, materials.volume3D)
  meshes.volume3D.scale.set(1 / config.density, 1 / config.density, 1 / config.density)
  meshes.volume3D.position.set(-0.5, -0.5, -0.5)
  scene.add(meshes.volume3D)
}

function material2D (key) {
  return !['planeArray'].includes(key)
}
