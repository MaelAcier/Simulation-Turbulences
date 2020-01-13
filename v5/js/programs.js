import * as THREE from '../lib/three.module.js'
import { config, cmtextures } from './data.js'

const texture0 = new THREE.DataTexture2DArray(new Float32Array(config.resolutions[0] ** 3 * 4), config.resolutions[0], config.resolutions[0], config.resolutions[0])
texture0.format = THREE.RGBAFormat
texture0.type = THREE.FloatType

const texture1 = new THREE.DataTexture2DArray(new Float32Array(config.resolutions[1] ** 3 * 4), config.resolutions[1], config.resolutions[1], config.resolutions[1])
texture1.format = THREE.RGBAFormat
texture1.type = THREE.FloatType

/* const texture3D = new THREE.DataTexture3D(new Float32Array(config.density ** 3 * 4), config.density, config.density, config.density)
texture3D.format = THREE.RGBAFormat
texture3D.type = THREE.FloatType
texture3D.minFilter = texture3D.magFilter = THREE.LinearFilter
texture3D.unpackAlignment = 1 */

export const programs = {
  /* curl: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sVelocity: { value: texture }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'curl.fs'
  },

  divergence: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sVelocity: { value: texture }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'divergence.fs'
  },

  splat: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sTarget: { value: texture },
      aspectRatio: { value: 1 },
      point: { value: new THREE.Vector2(1, 1) },
      color: { value: new THREE.Vector2(1, 1) },
      radius: { value: 0.0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'splat.fs'
  },

  vorticity: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sVelocity: { value: texture },
      sCurl: { value: texture },
      curl: { value: 0.0 },
      dt: { value: 0.0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'vorticity.fs'
  },

  clear: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sTexture: { value: texture },
      value: { value: 0.0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'clear.fs'
  },

  pressure: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sDivergence: { value: texture },
      sPressure: { value: texture }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'pressure.fs'
  },

  gradientSubtract: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sVelocity: { value: texture },
      sPressure: { value: texture }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'gradientSubtract.fs'
  },

  advection: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sVelocity: { value: texture },
      sSource: { value: texture },
      dissipation: { value: 0.0 },
      dt: { value: 0.0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'advection.fs'
  }, */

  display: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sTexture: { value: texture1 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'display.fs'
  },
  sin: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      uTime: { value: 0.0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'sin.fs'
  },

  identity: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sBuffer: { value: texture0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'identity.fs'
  },

  experiments: {
    uniforms: {
      texelSize: { value: new THREE.Vector2(1, 1) },
      uZ: { value: 0.0 },
      sBuffer: { value: texture0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'experiments.fs'
  },

  volume2D: {
    uniforms: {
      uDensity: { value: 0 },
      sBuffer: { value: texture1 }
    },
    vertexShader: 'volume2D.vs',
    fragmentShader: 'volume2D.fs'
  },

  volume3D: {
    uniforms: {
      u_size: { value: new THREE.Vector3(1, 1, 1) },
      u_renderstyle: { value: 0 }, // MIP
      u_renderthreshold: { value: 0.5 },
      u_clim: { value: new THREE.Vector2(0, 1) },
      u_data: { value: null },
      u_cmdata: { value: cmtextures.viridis }
    },
    vertexShader: 'volume3D.vs',
    fragmentShader: 'volume3D.fs'
  }

  /* test: {
    uniforms: {
      uDensity: { value: 0.0 }
    },
    vertexShader: 'test.vs',
    fragmentShader: 'test.fs'
  }

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

  gradientSubtract: {
    uniforms: {
      sPressure: { value: new THREE.Texture() },
      sVelocity: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'gradientSubtract.fs'
  },

  advection: {
    uniforms: {
      sVelocity: { value: new THREE.Texture() },
      sSource: { value: new THREE.Texture() },
      uDensity: { value: 0.0 },
      uDt: { value: 0.0 },
      uDissipation: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'advection.fs'
  },

  display: {
    uniforms: {
      sTexture: { value: new THREE.Texture() },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'identity.vs',
    fragmentShader: 'display.fs'
  },

  cube: {
    uniforms: {
      sTexture: { value: new THREE.Texture() },
      sCircleTexture: { value: new THREE.TextureLoader().load('circle3.png') },
      uDensity: { value: 0.0 }
    },
    vertexShader: 'cube.vs',
    fragmentShader: 'cube.fs'
  } */
}
