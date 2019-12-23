import * as THREE from '../lib/three.module.js'

export const programs = {
  sin: {
    uniforms: {
      uDensity: { value: 0.0 },
      uTime: { value: 0.0 }
    },
    vertexShader: 'sin.vs',
    fragmentShader: 'sin.fs'
  },

  test: {
    uniforms: {
      uDensity: { value: 0.0 }
    },
    vertexShader: 'test.vs',
    fragmentShader: 'test.fs'
  },

  identity: {
    uniforms: {
      sTexture: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'identity.fs'
  },

  splat: {
    uniforms: {
      sTarget: { value: new THREE.Texture() },
      uDensity: { value: 0.0 },
      uPoint: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Vector3() },
      uRadius: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'splat.fs'
  },

  curl: {
    uniforms: {
      sVelocity: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'curl.fs'
  },

  vorticity: {
    uniforms: {
      sVelocity: { value: new THREE.Texture() },
      sCurl: { value: new THREE.Texture() },
      uDensity: { value: 0.0 },
      uCurl: { value: 0.0 },
      uDt: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'vorticity.fs'
  },

  divergence: {
    uniforms: {
      sVelocity: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'divergence.fs'
  },

  clear: {
    uniforms: {
      sPressure: { value: new THREE.Texture() },
      uDensity: { value: 0.0 },
      uPressure: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'clear.fs'
  },

  pressure: {
    uniforms: {
      sPressure: { value: new THREE.Texture() },
      sDivergence: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'pressure.fs'
  },

  cube: {
    uniforms: {
      sTexture: { value: new THREE.Texture() },
      sCircleTexture: { value: new THREE.TextureLoader().load('circle3.png') },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'cube.vs',
    fragmentShader: 'cube.fs'
  }
}
