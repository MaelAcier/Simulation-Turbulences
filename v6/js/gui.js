import { GUI } from '../lib/dat.gui.module.js'
import * as THREE from '../lib/three.module.js'

import { config, scene } from './data.js'
import { loadMeshes } from './meshes.js'
import { registeredIDs } from './render.js'
// import { multipleSplats } from './splats.js'

let depth

export function setupGUI () {
  const gui = new GUI({ width: 350 })

  gui.add(config.resolutions, '0', 2, 1024).step(1).name('Résolution calculs').onChange(update)
  gui.add(config.resolutions, '1', 2, 1024).step(1).name('Résolution affichage').onChange(update)
  gui.add(config.resolutions, '2', 2, 1024).step(1).name('Résolution display').onChange(update)

  depth = gui.add(config, 'depth', 0, 100).step(1).name('Profondeur (2D)')

  gui.add(config, 'renderTarget', registeredIDs).name('Rendu').listen()

  gui.add(config, 'pause').name('Pause')
  gui.add(config, 'autoRotation').name('Rotation automatique')

  const backgroundColor = gui.addColor(config, 'backgroundColor').name('Couleur de fond').onChange((value) => {
    scene.background = new THREE.Color(value)
  })

  /* gui.add({
    fun: () => {
      multipleSplats(parseInt(Math.random() * 2) + 5)
    }
  }, 'fun').name('Splash') */

  updateDepth(depth)
  backgroundColor.setValue(config.backgroundColor)
}

function update () {
  loadMeshes()
  updateDepth(depth)
}

function updateDepth (depth) {
  depth.max(Math.max(...config.resolutions) - 1)
}
