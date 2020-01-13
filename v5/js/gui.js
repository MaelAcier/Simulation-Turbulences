import { GUI } from '../lib/dat.gui.module.js'
import * as THREE from '../lib/three.module.js'
// import { render } from '../main.js'

import { config, scene/* , canvas */ } from './data.js'
import { loadMeshes } from './meshes.js'
import { registeredIDs, textureManager } from './render.js'
import { multipleSplats } from './splats.js'

export function setupGUI () {
  const gui = new GUI({ width: 350 })

  // gui.add(config, 'distribution', { Grille: 'grid', Crystal: 'crystal', Aléatoire: 'random' }).name('Répartition').onChange(() => loadMeshes(scene, newGeometry(config)))
  const resolution = gui.add(config.resolutions, '0', 2, 128).step(1).name('Résolution calculs').onChange(() => {
    loadMeshes()
    textureManager.resize()
    depth.max(config.resolutions[0] - 1)
  })

  // gui.add(config, 'curl', 0, 10000).name('Tourbillons')

  gui.add(config, 'renderTarget', registeredIDs).name('Rendu').listen()
  const depth = gui.add(config, 'depth', 0, 100).step(1).name('Profondeur')

  /* gui.add(config, 'transparent').name('Transparence').onChange((value) => {
    materials.cube.transparent = value
  }) */

  gui.add(config, 'pause').name('Pause')
  gui.add(config, 'autoRotation').name('Rotation automatique')

  const backgroundColor = gui.addColor(config, 'backgroundColor').name('Couleur de fond').onChange((value) => {
    scene.background = new THREE.Color(value)
  })

  gui.add({
    fun: () => {
      multipleSplats(parseInt(Math.random() * 2) + 5)
    }
  }, 'fun').name('Splash')

  /* gui.add({
    fun: () => {
      canvas.toBlob((blob) => {
        render()
        saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
      })
    }
  }, 'fun').name("Capture d'écran") */

  resolution.setValue(config.resolutions[0])
  depth.max(config.resolutions[0] - 1)
  backgroundColor.setValue(config.backgroundColor)
  console.log(textureManager)
}

/* const saveBlob = (function () {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  return function saveData (blob, fileName) {
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
  }
}()) */
