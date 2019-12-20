import * as THREE from '../lib/three.module.js'

export const programs = {
  sin: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 },
      density: { value: 0.0 },
      aspect: { value: 0.0 }
    },
    vertexShader: 'sin.vs',
    fragmentShader: 'sin.fs'
  },
  test: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      density: { value: 0.0 },
      aspect: { value: 0.0 }
    },
    vertexShader: 'test.vs',
    fragmentShader: 'test.fs'
  },
  main: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 },
      density: { value: 0.0 },
      textureMap: { value: null }
    },
    vertexShader: 'main.vs',
    fragmentShader: 'main.fs'
  }
}
