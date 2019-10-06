import { gl, shaders } from './shaders.js'

console.log('materials.js called')

var displayShaderSource = '\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform sampler2D uBloom;\n    uniform sampler2D uSunrays;\n    uniform sampler2D uDithering;\n    uniform vec2 ditherScale;\n    uniform vec2 texelSize;\n\n    vec3 linearToGamma (vec3 color) {\n        color = max(color, vec3(0));\n        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));\n    }\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n\n    #ifdef SHADING\n        vec3 lc = texture2D(uTexture, vL).rgb;\n        vec3 rc = texture2D(uTexture, vR).rgb;\n        vec3 tc = texture2D(uTexture, vT).rgb;\n        vec3 bc = texture2D(uTexture, vB).rgb;\n\n        float dx = length(rc) - length(lc);\n        float dy = length(tc) - length(bc);\n\n        vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n        vec3 l = vec3(0.0, 0.0, 1.0);\n\n        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n        c *= diffuse;\n    #endif\n\n    #ifdef BLOOM\n        vec3 bloom = texture2D(uBloom, vUv).rgb;\n    #endif\n\n    #ifdef SUNRAYS\n        float sunrays = texture2D(uSunrays, vUv).r;\n        c *= sunrays;\n    #ifdef BLOOM\n        bloom *= sunrays;\n    #endif\n    #endif\n\n    #ifdef BLOOM\n        float noise = texture2D(uDithering, vUv * ditherScale).r;\n        noise = noise * 2.0 - 1.0;\n        bloom += noise / 255.0;\n        bloom = linearToGamma(bloom);\n        c += bloom;\n    #endif\n\n        float a = max(c.r, max(c.g, c.b));\n        gl_FragColor = vec4(c, a);\n    }\n'

var Material = function Material (vertexShader, fragmentShaderSource) {
  this.vertexShader = vertexShader
  this.fragmentShaderSource = fragmentShaderSource
  this.programs = []
  this.activeProgram = null
  this.uniforms = []
}

Material.prototype.setKeywords = function setKeywords (keywords) {
  var hash = 0
  for (var i = 0; i < keywords.length; i++) { hash += hashCode(keywords[i]) }

  var program = this.programs[hash]
  if (program == null) {
    var fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)
    program = createProgram(this.vertexShader, fragmentShader)
    this.programs[hash] = program
  }

  if (program === this.activeProgram) { return }

  this.uniforms = getUniforms(program)
  this.activeProgram = program
}

Material.prototype.bind = function bind () {
  gl.useProgram(this.activeProgram)
}

export const displayMaterial = new Material(shaders.baseVertex, displayShaderSource)

function compileShader (type, source, keywords) {
  source = addKeywords(source, keywords)

  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { throw gl.getShaderInfoLog(shader) }

  return shader
}

function createProgram (vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { throw gl.getProgramInfoLog(program) }

  return program
}

function getUniforms (program) {
  var uniforms = []
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (var i = 0; i < uniformCount; i++) {
    var uniformName = gl.getActiveUniform(program, i).name
    uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
  }
  return uniforms
}

function addKeywords (source, keywords) {
  if (keywords == null) { return source }
  var keywordsString = ''
  keywords.forEach(function (keyword) {
    keywordsString += '#define ' + keyword + '\n'
  })
  return keywordsString + source
}

function hashCode (s) {
  if (s.length === 0) { return 0 }
  var hash = 0
  for (var i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
