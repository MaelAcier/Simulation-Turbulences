import * as THREE from '../lib/three.module.js'
import { materials } from './materials.js'

export const meshes = {}

export function loadMeshes (scene, geometry) {
  for (const key in materials) {
    const material = materials[key]
    if (meshes[key]) {
      scene.remove(meshes[key])
    }
    meshes[key] = new THREE.Mesh(geometry, material)
    meshes[key].scale.set(500, 500, 500)
    scene.add(meshes[key])
  }
}
