import * as THREE from '../lib/three.module.js'
import { programs } from './programs.js'
/* global XMLHttpRequest */

export const materials = {}

export function loadMaterials (callback) {
  let shaderCount = 0
  let shaderLoaded = 0
  for (const key in programs) {
    const program = programs[key]
    loadShader(program.vertexShader, (vertexShader) => {
      loadShader(program.fragmentShader, (fragmentShader) => {
        materials[key] = new THREE.RawShaderMaterial({
          uniforms: program.uniforms,
          vertexShader,
          fragmentShader,
          depthTest: true,
          depthWrite: true,
          side: program === 'volume3D' ? THREE.BackSide : THREE.DoubleSide,
          visible: false
        })
        shaderLoaded++
        if (shaderLoaded === shaderCount) {
          callback()
        }
      })
    })
    shaderCount++
  }
}

function loadShader (file, callback) {
  file = 'shaders/' + file
  const request = new XMLHttpRequest()
  request.onload = function () {
    if (request.status === 200) {
      callback(request.responseText)
    } else {
      console.log(`Erreur avec le fichier ${file}, erreur ${request.status}`)
    }
  }
  request.open('GET', file, true)
  request.send()
}
