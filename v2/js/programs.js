import * as THREE from '../lib/three.module.js'

export const programs = {
  sin: {
    uniforms: {
      time: { value: 0.0 },
      density: { value: 0.0 }
    },
    vertexShader: 'sin.vs',
    fragmentShader: 'sin.fs'
  },
  test: {
    uniforms: {
      density: { value: 0.0 }
    },
    vertexShader: 'test.vs',
    fragmentShader: 'test.fs'
  },
  identity: {
    uniforms: {
      density: { value: 0.0 },
      textureMap: { value: null }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'identity.fs'
  },
  cube: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 },
      density: { value: 0.0 },
      textureMap: { value: null }
    },
    vertexShader: 'cube.vs',
    fragmentShader: 'cube.fs'
  }
}
