import * as THREE from '../lib/three.module.js'

export const programs = {
  sin: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 }
    },
    vertexShader: 'sin.vs',
    fragmentShader: 'sin.fs'
  }
}
