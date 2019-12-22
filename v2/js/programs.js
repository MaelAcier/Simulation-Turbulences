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
      textureMap: { value: new THREE.Texture() }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'identity.fs'
  },

  curl: {
    uniforms: {
      density: { value: 0.0 },
      uVelocity: { value: new THREE.Texture() }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'curl.fs'
  },

  splat: {
    uniforms: {
      density: { value: 0.0 },
      point: { value: new THREE.Vector3() },
      color: { value: new THREE.Vector3() },
      radius: { value: 0.0 },
      uTarget: { value: new THREE.Texture() }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'splat.fs'
  },

  cube: {
    uniforms: {
      map: { value: new THREE.TextureLoader().load('circle3.png') },
      time: { value: 0.0 },
      density: { value: 0.0 },
      textureMap: { value: new THREE.Texture() }
    },
    vertexShader: 'cube.vs',
    fragmentShader: 'cube.fs'
  }
}
