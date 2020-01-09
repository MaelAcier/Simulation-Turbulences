import { GUI } from '../lib/dat.gui.module.js'

import { config } from './data.js'
import { loadMeshes } from './meshes.js'
// import { materials } from './materials.js'
import { buffers, registeredIDs } from './render.js'
// import { multipleSplats } from './splats.js'

export function setupGUI () {
  const gui = new GUI({ width: 350 })

  // gui.add(config, 'distribution', { Grille: 'grid', Crystal: 'crystal', Aléatoire: 'random' }).name('Répartition').onChange(() => loadMeshes(scene, newGeometry(config)))
  const resolution = gui.add(config, 'resolution', 2, 128).step(1).name('Résolution').onChange((value) => {
    loadMeshes()
    for (const key in buffers) {
      const buffer = buffers[key]
      buffer.resize(value)
    }
    depth.max(config.resolution - 1)
  })

  // gui.add(config, 'curl', 0, 10000).name('Tourbillons')

  gui.add(config, 'renderTarget', registeredIDs).name('Rendu').listen()
  const depth = gui.add(config, 'depth', 0, config.resolution).step(1).name('Profondeur')

  /* gui.add(config, 'transparent').name('Transparence').onChange((value) => {
    materials.cube.transparent = value
  }) */

  gui.add(config, 'pause').name('Pause')
  gui.add(config, 'autoRotation').name('Rotation automatique')

  /* gui.add({
    fun: () => {
      multipleSplats(parseInt(Math.random() * 2) + 5)
    }
  }, 'fun').name('Splash') */

  return {
    fixBlinking: () => {
      resolution.setValue(config.resolution)
    }
  }
}
