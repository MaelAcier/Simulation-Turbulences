import { GUI } from '../lib/dat.gui.module.js'
import * as THREE from '../lib/three.module.js'

import { config, scene } from './data.js'
import { loadMeshes } from './meshes.js'
import { registeredIDs, buffers } from './render.js'
// import { multipleSplats } from './splats.js'

export function setupGUI () {
  const gui = new GUI({ width: 350 })

  gui.add(config.resolutions, '0', 2, 1024).step(1).name('Résolution calculs').onChange((value) => { updateValues(value, '0') })
  gui.add(config.resolutions, '1', 2, 1024).step(1).name('Résolution affichage').onChange((value) => { updateValues(value, '1') })

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

  backgroundColor.setValue(config.backgroundColor)
}

function updateValues (value, slider) {
  const power2 = Math.ceil(Math.sqrt(value)) ** 2 || 1
  if (config.resolutions[slider] !== power2) config.resolutions[slider] = power2
  for (const key in buffers) {
    const buffer = buffers[key]
    buffer.resize()
  }
  loadMeshes()
}
