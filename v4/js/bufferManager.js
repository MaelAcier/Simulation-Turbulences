import * as THREE from '../lib/three.module.js'

import { config, renderer } from './data.js'

export const textureIndex = {}

class TextureArray {
  constructor (size) {
    this.oldTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.currentTextures = Array.from(Array(size), () => new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType }))
    this.size = size
  }

  swap () {
    const temp = this.oldTextures
    this.oldTextures = this.currentTextures
    this.currentTextures = temp
  }

  destroy () {
    for (let i = 0; i < this.size; i++) {
      this.oldTextures[i].dispose()
      this.currentTextures[i].dispose()
    }
  }
}

export class Buffer {
  constructor (sizeID) {
    this.sizeID = sizeID
    updateTextureIndex(sizeID)
    this.texture3D = texture2Dto3D(textureIndex[sizeID])
  }
}

export function updateTextureIndex (sizeID) {
  const size = config.resolutions[sizeID]
  if (textureIndex[sizeID]) {
    textureIndex[sizeID].destroy()
  }
  textureIndex[sizeID] = new TextureArray(size)
}

export function texture2Dto3D (textureArray) {
  // console.time('texture2Dto3D')
  textureArray.swap()
  const size = textureArray.size
  const planeSize = (size ** 2 * 4)
  // console.time('read')
  const pixelBuffers = Array.from(Array(size), () => new Float32Array(planeSize))
  for (let i = 0; i < size; i++) {
    renderer.readRenderTargetPixels(textureArray.currentTextures[i], 0, 0, size, size, pixelBuffers[i])
  }
  // console.timeEnd('read')
  const data = new Float32Array(planeSize * size)
  for (let i = 0; i < size; i++) {
    data.set(pixelBuffers[i], i * planeSize)
  }
  const texture3D = new THREE.DataTexture3D(data, size, size, size)
  texture3D.format = THREE.RGBAFormat
  texture3D.type = THREE.FloatType
  texture3D.unpackAlignment = 1
  // console.timeEnd('texture2Dto3D')
  return texture3D
}
