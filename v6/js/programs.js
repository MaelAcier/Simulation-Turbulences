import * as THREE from '../lib/three.module.js'
import { config } from './data.js'

const cubeSize = config.resolutions[0]
const textureSize = cubeSize * Math.sqrt(cubeSize)
const blankTexture = new THREE.DataTexture2DArray(new Float32Array(cubeSize ** 3 * 4), textureSize, textureSize, textureSize)
blankTexture.format = THREE.RGBAFormat
blankTexture.type = THREE.FloatType

export const programs = {
  sin: {
    uniforms: {
      uProjectionSize: { value: 0 },
      uTime: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'sin.fs'
  },

  identity: {
    uniforms: {
      uProjectionSize: { value: 0 },
      sData: { value: blankTexture }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'identity.fs'
  },

  splat: {
    uniforms: {
      uProjectionSize: { value: 0 },
      sTarget: { value: blankTexture },
      uPoint: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Vector3(0, 0, 0) },
      uRadius: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'splat.fs'
  },

  volume2D: {
    uniforms: {
      sData: { value: blankTexture }
    },
    vertexShader: 'volume2D.vs',
    fragmentShader: 'volume2D.fs'
  },

  volume3D: {
    uniforms: {
      sData: { value: blankTexture }
    },
    vertexShader: 'volume3D.vs',
    fragmentShader: 'volume3D.fs'
  }
}
