import * as THREE from '../lib/three.module.js'

import { materials } from './materials.js'
import { config, cameras, scene, renderer } from './data.js'
import { textures } from './render.js'

export class Texture {
  constructor (size = config.density) {
    this.resize(size)
  }

  resize (size) {
    this.oldTexture = new THREE.WebGLRenderTarget(size ** 2, size, { type: THREE.FloatType })
    this.currentTexture = new THREE.WebGLRenderTarget(size ** 2, size, { type: THREE.FloatType })
  }

  swap () {
    const buffer = this.oldTexture
    this.oldTexture = this.currentTexture
    this.currentTexture = buffer
  }
}

export class Pipeline {
  constructor () {
    this.steps = []
    this.extraSteps = {}
    this.ids = []
  }

  addStep (step) {
    const id = this.steps.length + '-' + step.material
    this.steps.push(Object.assign({ id }, step))
    this.ids.push(id)
  }

  addExtraStep (fun) {
    this.extraSteps[this.steps.length] = fun
  }

  run () {
    for (let i = 0; i < this.steps.length; i++) {
      if (this.extraSteps[i]) {
        this.extraSteps[i]()
      }

      const step = this.steps[i]
      materials[step.material].visible = true

      if (!config.pause) {
        step.fun(materials[step.material])
      }

      if (/cube/.test(config.renderTarget)) {
        if (config.renderTarget === step.id) {
          renderer.setRenderTarget(null)
          if (config.clipping) {
            renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
            renderer.render(scene, cameras.perspective)
            renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
            renderer.render(scene, cameras.orthographic)
          } else {
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
            renderer.render(scene, cameras.perspective)
          }
        } else {
          renderer.setRenderTarget(textures[step.textureID].oldTexture)
          renderer.render(scene, cameras.texture)
        }
      } else {
        if (config.renderTarget === step.id) {
          renderer.setRenderTarget(null)
        } else {
          renderer.setRenderTarget(textures[step.textureID].oldTexture)
        }
        renderer.render(scene, cameras.texture)
      }

      materials[step.material].visible = false
      textures[step.textureID].swap()
    }
    if (this.extraSteps[this.steps.length]) {
      this.extraSteps[this.steps.length]()
    }
  }
}
