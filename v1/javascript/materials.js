import { shaders, compileShader, loadFile } from './shaders.js'
import { createProgram, getUniforms } from './programs.js'

export let displayMaterial

class Material {
  constructor (gl, vertexShader, fragmentShaderSource) {
    this.gl = gl
    this.vertexShader = vertexShader
    this.fragmentShaderSource = fragmentShaderSource
    this.programs = []
    this.activeProgram = null
    this.uniforms = []
  }

  setKeywords (keywords) {
    let hash = 0
    for (let i = 0; i < keywords.length; i++) {
      hash += hashCode(keywords[i])
    }

    let program = this.programs[hash]
    if (program == null) {
      const fragmentShader = compileShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)
      program = createProgram(this.gl, this.vertexShader, fragmentShader)
      this.programs[hash] = program
    }

    if (program === this.activeProgram) { return }

    this.uniforms = getUniforms(this.gl, program)
    this.activeProgram = program
  }

  bind () {
    this.gl.useProgram(this.activeProgram)
  }
}

export function loadMaterials (gl) {
  return new Promise((resolve) => {
    loadFile('shaders/display.fs', 'display.fs', (name_, displayShaderSource) => {
      displayMaterial = new Material(gl, shaders.baseVertex, displayShaderSource)
      resolve()
    })
  })
}

function hashCode (s) {
  if (s.length === 0) { return 0 }
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
