import * as THREE from '../lib/three.module.js'
import { materials } from './materials.js'
import { scene, config } from './data.js'

export const meshes = {}

export function loadMeshes () {
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

  const except = ['planeArray']

  for (const key in materials) {
    if (!except.includes(key)) {
      const material = materials[key]
      if (meshes[key]) {
        scene.remove(meshes[key])
      }
      meshes[key] = new THREE.Mesh(geometry, material)
      meshes[key].position.set(-1.5, -0.5, -0.5)
      scene.add(meshes[key])
    }
  }
}
