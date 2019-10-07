import { programs } from './programs.js'
import { drawColor, drawCheckerboard, drawDisplay } from './draw.js'
import { buffers } from './buffers.js'
import blit from './blit.js'

export default function render (gl, config, canvas, target) {
  if (config.BLOOM) {
    applyBloom(gl, config, buffers.dye.read, buffers.bloom)
  }
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
  programs.bloomPrefilter.bind()
  var knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001
  var curve0 = config.BLOOM_THRESHOLD - knee
  var curve1 = knee * 2
  var curve2 = 0.25 / knee
  gl.uniform3f(programs.bloomPrefilter.uniforms.curve, curve0, curve1, curve2)
  gl.uniform1f(programs.bloomPrefilter.uniforms.threshold, config.BLOOM_THRESHOLD)
  gl.uniform1i(programs.bloomPrefilter.uniforms.uTexture, source.attach(0))
  gl.viewport(0, 0, last.width, last.height)
  blit(gl, last.fbo)

  programs.bloomBlur.bind()
  for (var i = 0; i < buffers.bloomFramebuffers.length; i++) {
    var dest = buffers.bloomFramebuffers[i]
    gl.uniform2f(programs.bloomBlur.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
    gl.uniform1i(programs.bloomBlur.uniforms.uTexture, last.attach(0))
    gl.viewport(0, 0, dest.width, dest.height)
    blit(gl, dest.fbo)
    last = dest
  }

  gl.blendFunc(gl.ONE, gl.ONE)
  gl.enable(gl.BLEND)

  for (var i$1 = buffers.bloomFramebuffers.length - 2; i$1 >= 0; i$1--) {
    var baseTex = buffers.bloomFramebuffers[i$1]
    gl.uniform2f(programs.bloomBlur.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
    gl.uniform1i(programs.bloomBlur.uniforms.uTexture, last.attach(0))
    gl.viewport(0, 0, baseTex.width, baseTex.height)
    blit(gl, baseTex.fbo)
    last = baseTex
  }

  gl.disable(gl.BLEND)
  programs.bloomFinal.bind()
  gl.uniform2f(programs.bloomFinal.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
  gl.uniform1i(programs.bloomFinal.uniforms.uTexture, last.attach(0))
  gl.uniform1f(programs.bloomFinal.uniforms.intensity, config.BLOOM_INTENSITY)
  gl.viewport(0, 0, destination.width, destination.height)
  blit(gl, destination.fbo)
}

function applySunrays (gl, config, source, mask, destination) {
  gl.disable(gl.BLEND)
  programs.sunraysMask.bind()
  gl.uniform1i(programs.sunraysMask.uniforms.uTexture, source.attach(0))
  gl.viewport(0, 0, mask.width, mask.height)
  blit(gl, mask.fbo)

  programs.sunrays.bind()
  gl.uniform1f(programs.sunrays.uniforms.weight, config.SUNRAYS_WEIGHT)
  gl.uniform1i(programs.sunrays.uniforms.uTexture, mask.attach(0))
  gl.viewport(0, 0, destination.width, destination.height)
  blit(gl, destination.fbo)
}

function blur (gl, target, temp, iterations) {
  programs.blur.bind()
  for (var i = 0; i < iterations; i++) {
    gl.uniform2f(programs.blur.uniforms.texelSize, target.texelSizeX, 0.0)
    gl.uniform1i(programs.blur.uniforms.uTexture, target.attach(0))
    blit(gl, temp.fbo)

    gl.uniform2f(programs.blur.uniforms.texelSize, 0.0, target.texelSizeY)
    gl.uniform1i(programs.blur.uniforms.uTexture, temp.attach(0))
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
