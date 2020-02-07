import * as THREE from '../lib/three.module.js'
import { config } from './data.js'

const cubeSize = config.resolutions[0]
const textureSize = cubeSize * Math.sqrt(cubeSize)
const blankTexture = new THREE.DataTexture2DArray(new Float32Array(cubeSize ** 3 * 4), textureSize, textureSize, textureSize)
blankTexture.format = THREE.RGBAFormat
blankTexture.type = THREE.FloatType

export const programs = {
/*   sin: {
    uniforms: {
      uCubeSize: { value: 0 },
      uTime: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'sin.fs'
  },

  identity: {
    uniforms: {
      uCubeSize: { value: 0 },
      sData: { value: blankTexture },
      uDataSize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'identity.fs'
  }, */

  splat: {
    uniforms: {
      uCubeSize: { value: 0 },
      sTarget: { value: blankTexture },
      uTargetSize: { value: 0 },
      uPoint: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Vector3(0, 0, 0) },
      uRadius: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'splat.fs'
  },

  curl: {
    uniforms: {
      uCubeSize: { value: 0 },
      sVelocity: { value: blankTexture },
      uVelocitySize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'curl.fs'
  },

  divergence: {
    uniforms: {
      uCubeSize: { value: 0 },
      sVelocity: { value: blankTexture },
      uVelocitySize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'divergence.fs'
  },

  vorticity: {
    uniforms: {
      uCubeSize: { value: 0 },
      sVelocity: { value: blankTexture },
      uVelocitySize: { value: 0 },
      sCurl: { value: blankTexture },
      uCurlSize: { value: 0 },
      uCurl: { value: 0 },
      uDt: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'vorticity.fs'
  },

  clear: {
    uniforms: {
      uCubeSize: { value: 0 },
      sPressure: { value: blankTexture },
      uPressureSize: { value: 0 },
      uPressure: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'clear.fs'
  },

  pressure: {
    uniforms: {
      uCubeSize: { value: 0 },
      sPressure: { value: blankTexture },
      uPressureSize: { value: 0 },
      sDivergence: { value: blankTexture },
      uDivergenceSize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'pressure.fs'
  },

  gradientSubtract: {
    uniforms: {
      uCubeSize: { value: 0 },
      sPressure: { value: blankTexture },
      uPressureSize: { value: 0 },
      sVelocity: { value: blankTexture },
      uVelocitySize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'gradientSubtract.fs'
  },

  advection: {
    uniforms: {
      uCubeSize: { value: 0 },
      sVelocity: { value: blankTexture },
      uVelocitySize: { value: 0 },
      sSource: { value: blankTexture },
      uSourceSize: { value: 0 },
      uDissipation: { value: 0 },
      uDt: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'advection.fs'
  },

  display: {
    uniforms: {
      uCubeSize: { value: 0 },
      sDye: { value: blankTexture },
      uDyeSize: { value: 0 }
    },
    vertexShader: 'base.vs',
    fragmentShader: 'display.fs'
  },

  volume2D: {
    uniforms: {
      sData: { value: blankTexture },
      uDataSize: { value: 0 }
    },
    vertexShader: 'volume2D.vs',
    fragmentShader: 'volume2D.fs'
  },

  volume3D: {
    uniforms: {
      sData: { value: blankTexture },
      uDataSize: { value: 0 }
    },
    vertexShader: 'volume3D.vs',
    fragmentShader: 'volume3D.fs'
  }
}
