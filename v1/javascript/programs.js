import { shaders } from './shaders.js'

export const programs = {
  blur: undefined,
  copy: undefined,
  clear: undefined,
  color: undefined,
  checkerboard: undefined,
  bloomPrefilter: undefined,
  bloomBlur: undefined,
  bloomFinal: undefined,
  sunraysMask: undefined,
  sunrays: undefined,
  splat: undefined,
  advection: undefined,
  divergence: undefined,
  curl: undefined,
  vorticity: undefined,
  pressure: undefined,
  gradientSubtract: undefined
}

class Program {
  constructor (gl, vertexShader, fragmentShader) {
    this.gl = gl
    this.program = createProgram(gl, vertexShader, fragmentShader)
    this.uniforms = getUniforms(gl, this.program)
  }

  bind () {
    this.gl.useProgram(this.program)
  }
}

export function createProgram (gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program)
  }

  return program
}

export function getUniforms (gl, program) {
  const uniforms = []
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniformCount; i++) {
    const uniformName = gl.getActiveUniform(program, i).name
    uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
  }
  return uniforms
}

export function loadPrograms (gl) {
  programs.blur = new Program(gl, shaders.blurVertex, shaders.blur)
  programs.copy = new Program(gl, shaders.baseVertex, shaders.copy)
  programs.clear = new Program(gl, shaders.baseVertex, shaders.clear)
  programs.color = new Program(gl, shaders.baseVertex, shaders.color)
  programs.checkerboard = new Program(gl, shaders.baseVertex, shaders.checkerboard)
  programs.bloomPrefilter = new Program(gl, shaders.baseVertex, shaders.bloomPrefilter)
  programs.bloomBlur = new Program(gl, shaders.baseVertex, shaders.bloomBlur)
  programs.bloomFinal = new Program(gl, shaders.baseVertex, shaders.bloomFinal)
  programs.sunraysMask = new Program(gl, shaders.baseVertex, shaders.sunraysMask)
  programs.sunrays = new Program(gl, shaders.baseVertex, shaders.sunrays)
  programs.splat = new Program(gl, shaders.baseVertex, shaders.splat)
  programs.advection = new Program(gl, shaders.baseVertex, shaders.advection)
  programs.divergence = new Program(gl, shaders.baseVertex, shaders.divergence)
  programs.curl = new Program(gl, shaders.baseVertex, shaders.curl)
  programs.vorticity = new Program(gl, shaders.baseVertex, shaders.vorticity)
  programs.pressure = new Program(gl, shaders.baseVertex, shaders.pressure)
  programs.gradientSubtract = new Program(gl, shaders.baseVertex, shaders.gradientSubtract)
}
