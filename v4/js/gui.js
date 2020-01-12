import { GUI } from '../lib/dat.gui.module.js'

import { config } from './data.js'
import { loadMeshes } from './meshes.js'
// import { materials } from './materials.js'
import { registeredIDs } from './render.js'
import { updateTextureIndex } from './bufferManager.js'
// import { multipleSplats } from './splats.js'

let depth

export function setupGUI () {
  const gui = new GUI({ width: 350 })

  gui.add(config.resolutions, '0', 2, 1024).step(1).name('Résolution calculs').onChange(() => { update(0) })
  gui.add(config.resolutions, '1', 2, 1024).step(1).name('Résolution affichage').onChange(() => { update(1) })
  gui.add(config.resolutions, '2', 2, 1024).step(1).name('Résolution display').onChange(() => { update(2) })

  depth = gui.add(config, 'depth', 0, 100).step(1).name('Profondeur (2D)')

  gui.add(config, 'renderTarget', registeredIDs).name('Rendu').listen()

  gui.add(config, 'pause').name('Pause')
  gui.add(config, 'autoRotation').name('Rotation automatique')

  /* gui.add({
    fun: () => {
      multipleSplats(parseInt(Math.random() * 2) + 5)
    }
  }, 'fun').name('Splash') */

  updateDepth(depth)
}

function update (id) {
  loadMeshes()
  updateTextureIndex(id)
  updateDepth(depth)
}

function updateDepth (depth) {
  depth.max(Math.max(...config.resolutions) - 1)
}
