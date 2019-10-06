import { bloomBlurProgram, bloomFinalProgram, bloomPrefilterProgram, sunraysMaskProgram, sunraysProgram, blurProgram } from './programs.js'
import { drawColor, drawCheckerboard, drawDisplay } from './draw.js'
import { buffers } from './buffers.js'
import blit from './blit.js'

console.log('render.js called')

export default function render (gl, config, canvas, target) {
  if (config.BLOOM) { applyBloom(gl, config, buffers.dye.read, buffers.bloom) }
  if (config.SUNRAYS) {
    applySunrays(gl, config, buffers.dye.read, buffers.dye.write, buffers.sunrays)
    blur(gl, buffers.sunrays, buffers.sunraysTemp, 1)
  }

  if (target == null || !config.TRANSPARENT) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
  } else {
    gl.disable(gl.BLEND)
  }

  var width = target == null ? gl.drawingBufferWidth : target.width
  var height = target == null ? gl.drawingBufferHeight : target.height
  gl.viewport(0, 0, width, height)

  var fbo = target == null ? null : target.fbo
  if (!config.TRANSPARENT) { drawColor(gl, fbo, normalizeColor(config.BACK_COLOR)) }
  if (target == null && config.TRANSPARENT) { drawCheckerboard(gl, canvas, fbo) }
  drawDisplay(gl, config, fbo, width, height)
}

function applyBloom (gl, config, source, destination) {
  if (buffers.bloomFramebuffers.length < 2) { return }

  var last = destination

  gl.disable(gl.BLEND)
  bloomPrefilterProgram.bind()
  var knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001
  var curve0 = config.BLOOM_THRESHOLD - knee
  var curve1 = knee * 2
  var curve2 = 0.25 / knee
  gl.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2)
  gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD)
  gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0))
  gl.viewport(0, 0, last.width, last.height)
  blit(gl, last.fbo)

  bloomBlurProgram.bind()
  for (var i = 0; i < buffers.bloomFramebuffers.length; i++) {
    var dest = buffers.bloomFramebuffers[i]
    gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
    gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0))
    gl.viewport(0, 0, dest.width, dest.height)
    blit(gl, dest.fbo)
    last = dest
  }

  gl.blendFunc(gl.ONE, gl.ONE)
  gl.enable(gl.BLEND)

  for (var i$1 = buffers.bloomFramebuffers.length - 2; i$1 >= 0; i$1--) {
    var baseTex = buffers.bloomFramebuffers[i$1]
    gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
    gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0))
    gl.viewport(0, 0, baseTex.width, baseTex.height)
    blit(gl, baseTex.fbo)
    last = baseTex
  }

  gl.disable(gl.BLEND)
  bloomFinalProgram.bind()
  gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
  gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0))
  gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY)
  gl.viewport(0, 0, destination.width, destination.height)
  blit(gl, destination.fbo)
}

function applySunrays (gl, config, source, mask, destination) {
  gl.disable(gl.BLEND)
  sunraysMaskProgram.bind()
  gl.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0))
  gl.viewport(0, 0, mask.width, mask.height)
  blit(gl, mask.fbo)

  sunraysProgram.bind()
  gl.uniform1f(sunraysProgram.uniforms.weight, config.SUNRAYS_WEIGHT)
  gl.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0))
  gl.viewport(0, 0, destination.width, destination.height)
  blit(gl, destination.fbo)
}

function blur (gl, target, temp, iterations) {
  blurProgram.bind()
  for (var i = 0; i < iterations; i++) {
    gl.uniform2f(blurProgram.uniforms.texelSize, target.texelSizeX, 0.0)
    gl.uniform1i(blurProgram.uniforms.uTexture, target.attach(0))
    blit(gl, temp.fbo)

    gl.uniform2f(blurProgram.uniforms.texelSize, 0.0, target.texelSizeY)
    gl.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0))
    blit(gl, target.fbo)
  }
}

function normalizeColor (input) {
  var output = {
    r: input.r / 255,
    g: input.g / 255,
    b: input.b / 255
  }
  return output
}
