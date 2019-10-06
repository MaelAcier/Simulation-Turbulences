import { shaders } from './shaders.js'

console.log('programs.js called')

export let blurProgram
export let copyProgram
export let clearProgram
export let colorProgram
export let checkerboardProgram
export let bloomPrefilterProgram
export let bloomBlurProgram
export let bloomFinalProgram
export let sunraysMaskProgram
export let sunraysProgram
export let splatProgram
export let advectionProgram
export let divergenceProgram
export let curlProgram
export let vorticityProgram
export let pressureProgram
export let gradienSubtractProgram

class Program {
  constructor (gl, vertexShader, fragmentShader) {
    this.gl = gl
    this.uniforms = {}
    this.program = createProgram(gl, vertexShader, fragmentShader)
    this.uniforms = getUniforms(gl, this.program)
  }

  bind () {
    this.gl.useProgram(this.program)
  }
}

function createProgram (gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { throw gl.getProgramInfoLog(program) }

  return program
}

function getUniforms (gl, program) {
  var uniforms = []
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (var i = 0; i < uniformCount; i++) {
    var uniformName = gl.getActiveUniform(program, i).name
    uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
  }
  return uniforms
}

export function loadPrograms (gl) {
  blurProgram = new Program(gl, shaders.blurVertex, shaders.blur)
  copyProgram = new Program(gl, shaders.baseVertex, shaders.copy)
  clearProgram = new Program(gl, shaders.baseVertex, shaders.clear)
  colorProgram = new Program(gl, shaders.baseVertex, shaders.color)
  checkerboardProgram = new Program(gl, shaders.baseVertex, shaders.checkerboard)
  bloomPrefilterProgram = new Program(gl, shaders.baseVertex, shaders.bloomPrefilter)
  bloomBlurProgram = new Program(gl, shaders.baseVertex, shaders.bloomBlur)
  bloomFinalProgram = new Program(gl, shaders.baseVertex, shaders.bloomFinal)
  sunraysMaskProgram = new Program(gl, shaders.baseVertex, shaders.sunraysMask)
  sunraysProgram = new Program(gl, shaders.baseVertex, shaders.sunrays)
  splatProgram = new Program(gl, shaders.baseVertex, shaders.splat)
  advectionProgram = new Program(gl, shaders.baseVertex, shaders.advection)
  divergenceProgram = new Program(gl, shaders.baseVertex, shaders.divergence)
  curlProgram = new Program(gl, shaders.baseVertex, shaders.curl)
  vorticityProgram = new Program(gl, shaders.baseVertex, shaders.vorticity)
  pressureProgram = new Program(gl, shaders.baseVertex, shaders.pressure)
  gradienSubtractProgram = new Program(gl, shaders.baseVertex, shaders.gradientSubtract)
}
