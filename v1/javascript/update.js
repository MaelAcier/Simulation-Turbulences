import resizeCanvas from './resizeCanvas.js'
import { initFramebuffers } from './initBuffers.js'
import { config, buffers } from './data.js'
import { programs } from './programs.js'
import { updateColors } from './updateColors.js'
import { applyInputs } from './splats.js'
import render from './render.js'
import blit from './blit.js'
import { stats } from './stats.js'
/* global requestAnimationFrame */

let lastUpdateTime = Date.now()

export function PointerPrototype () {
  this.id = -1
  this.texcoordX = 0
  this.texcoordY = 0
  this.prevTexcoordX = 0
  this.prevTexcoordY = 0
  this.deltaX = 0
  this.deltaY = 0
  this.down = false
  this.moved = false
  this.color = [30, 0, 300]
}

export const pointers = []
pointers.push(new PointerPrototype())

export default function update (webGLContext) {
  stats.begin()
  const gl = webGLContext.gl
  const dt = calcDeltaTime()
  if (resizeCanvas(gl.canvas)) { initFramebuffers(webGLContext) }
  updateColors(pointers, dt)
  applyInputs(webGLContext, pointers)
  if (!config.PAUSED) { step(webGLContext, dt) }
  // render(webGLContext, config, null)
  stats.end()
  requestAnimationFrame(() => update(webGLContext))
}

function step (webGLContext, dt) {
  const gl = webGLContext.gl
  const ext = webGLContext.ext

  gl.disable(gl.BLEND)
  gl.viewport(0, 0, buffers.velocity.width, buffers.velocity.height)

  programs.curl.bind()
  gl.uniform2f(programs.curl.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  gl.uniform1i(programs.curl.uniforms.uVelocity, buffers.velocity.read.attach(0))
  blit(gl, buffers.curl.fbo)

  programs.divergence.bind()
  gl.uniform2f(programs.divergence.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  gl.uniform1i(programs.divergence.uniforms.uVelocity, buffers.velocity.read.attach(0))
  blit(gl, buffers.divergence.fbo)

  programs.vorticity.bind()
  gl.uniform2f(programs.vorticity.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  gl.uniform1i(programs.vorticity.uniforms.uVelocity, buffers.velocity.read.attach(0))
  gl.uniform1i(programs.vorticity.uniforms.uCurl, buffers.curl.attach(1))
  gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL)
  gl.uniform1f(programs.vorticity.uniforms.dt, dt)
  blit(gl, buffers.velocity.write.fbo)
  buffers.velocity.swap()

  programs.clear.bind()
  gl.uniform1i(programs.clear.uniforms.uTexture, buffers.pressure.read.attach(0))
  gl.uniform1f(programs.clear.uniforms.value, config.PRESSURE)
  blit(gl, buffers.pressure.write.fbo)
  buffers.pressure.swap()

  programs.pressure.bind()
  gl.uniform2f(programs.pressure.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  gl.uniform1i(programs.pressure.uniforms.uDivergence, buffers.divergence.attach(0))
  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    gl.uniform1i(programs.pressure.uniforms.uPressure, buffers.pressure.read.attach(1))
    blit(gl, buffers.pressure.write.fbo)
    buffers.pressure.swap()
  }

  programs.gradientSubtract.bind()
  gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, buffers.pressure.read.attach(0))
  gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, buffers.velocity.read.attach(1))
  blit(gl, buffers.velocity.write.fbo)
  buffers.velocity.swap()

  programs.advection.bind()
  gl.uniform2f(programs.advection.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  if (!ext.supportLinearFiltering) {
    gl.uniform2f(programs.advection.uniforms.dyeTexelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY)
  }
  const velocityId = buffers.velocity.read.attach(0)
  gl.uniform1i(programs.advection.uniforms.uVelocity, velocityId)
  gl.uniform1i(programs.advection.uniforms.uSource, velocityId)
  gl.uniform1f(programs.advection.uniforms.dt, dt)
  gl.uniform1f(programs.advection.uniforms.dissipation, config.VELOCITY_DISSIPATION)
  blit(gl, buffers.velocity.write.fbo)
  blit(gl, null)
  buffers.velocity.swap()

  gl.viewport(0, 0, buffers.dye.width, buffers.dye.height)

  if (!ext.supportLinearFiltering) {
    gl.uniform2f(programs.advection.uniforms.dyeTexelSize, buffers.dye.texelSizeX, buffers.dye.texelSizeY)
  }
  gl.uniform1i(programs.advection.uniforms.uVelocity, buffers.velocity.read.attach(0))
  gl.uniform1i(programs.advection.uniforms.uSource, buffers.dye.read.attach(1))
  gl.uniform1f(programs.advection.uniforms.dissipation, config.DENSITY_DISSIPATION)
  blit(gl, buffers.dye.write.fbo)
  buffers.dye.swap()
}

function calcDeltaTime () {
  const now = Date.now()
  let dt = (now - lastUpdateTime) / 1000
  dt = Math.min(dt, 0.016666)
  lastUpdateTime = now
  return dt
}
