import * as THREE from '../lib/three.module.js'
import { GUI } from '../lib/dat.gui.module.js'

import { config, cameras, objects, controls } from './data.js'
import { loadMeshes } from './meshes.js'
import { newGeometry } from './geometry.js'
import { materials } from './materials.js'
import { textures } from './render.js'
import { programs } from './programs.js'

export function setupGUI (scene) {
  const gui = new GUI({ width: 350 })

  gui.add(config, 'distribution', { Grille: 'grid', Crystal: 'crystal', Aléatoire: 'random' }).name('Répartition').onChange(() => loadMeshes(scene, newGeometry(config)))
  gui.add(config, 'density', 2, 200).step(1).name('Densité').onChange((value) => {
    loadMeshes(scene, newGeometry(config))
    for (const key in textures) {
      const texture = textures[key]
      texture.resize(value)
    }
  })

  const clipFolder = gui.addFolder('Section plan')
  clipFolder.add(config, 'clipping').name('Activé').onChange((value) => {
    cameras.perspective.aspect = value ? 0.5 * window.innerWidth / window.innerHeight
      : window.innerWidth / window.innerHeight
    cameras.perspective.updateProjectionMatrix()
  })
  clipFolder.add(config, 'showOrthographicHelper').name('Assistant caméra').onChange((value) => { objects.orthographicHelper.visible = value })
  clipFolder.add(config, 'cameraClipAxis', { x: 'x', y: 'y', z: 'z' }).name('Axe').onChange((value) => {
    switch (value) {
      case 'x':
        cameras.orthographic.rotation.x = 0
        cameras.orthographic.rotation.y = Math.PI / 2
        cameras.orthographic.rotation.z = 0
        break
      case 'y':
        cameras.orthographic.rotation.x = Math.PI / 2
        cameras.orthographic.rotation.y = 0
        cameras.orthographic.rotation.z = 0
        break
      case 'z':
        cameras.orthographic.rotation.x = 0
        cameras.orthographic.rotation.y = 0
        cameras.orthographic.rotation.z = 0
        break
    }
    cameras.orthographic.position.x = 0
    cameras.orthographic.position.y = 0
    cameras.orthographic.position.z = 0
    config.cameraClipOffset = 0
  })
  clipFolder.add(config, 'cameraClipOffset', -500, 500).step(1).name('Position').listen().onChange((value) => {
    cameras.orthographic.position.x = 0
    cameras.orthographic.position.y = 0
    cameras.orthographic.position.z = 0
    cameras.orthographic.position[config.cameraClipAxis] = value
  })

  gui.add(config, 'renderTarget', mapKeys(programs, (val, key) => key)).name('Rendu')

  gui.add(config, 'transparent').name('Transparence').onChange((value) => {
    materials.main.transparent = value
  })

  gui.add(config, 'pause').name('Pause')
  gui.add(config, 'autoRotation').name('Rotation automatique')
}

const mapKeys = (obj, fn) =>
  Object.keys(obj).reduce((acc, k) => {
    const val = fn(obj[k], k)
    acc[k] = val
    return acc
  }, {})
