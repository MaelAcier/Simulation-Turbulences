import { config, splatStack, buffers } from './data.js'
import { generateColor } from './updateColors.js'
import { programs } from './programs.js'
import blit from './blit.js'

export function applyInputs (webGLContext, pointers) {
  if (splatStack.length > 0) { multipleSplats(webGLContext, splatStack.pop()) }

  pointers.forEach(function (p) {
    if (p.moved) {
      p.moved = false
      splatPointer(webGLContext, p)
    }
  })
}

function splatPointer (webGLContext, pointer) {
  const dx = pointer.deltaX * config.SPLAT_FORCE
  const dy = pointer.deltaY * config.SPLAT_FORCE
  splat(webGLContext, pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
}

export function multipleSplats (webGLContext, amount) {
  for (let i = 0; i < amount; i++) {
    const color = generateColor()
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    const x = Math.random()
    const y = Math.random()
    const dx = 1000 * (Math.random() - 0.5)
    const dy = 1000 * (Math.random() - 0.5)
    splat(webGLContext, x, y, dx, dy, color)
  }
}

export function splat (webGLContext, x, y, dx, dy, color) {
  const gl = webGLContext.gl
  gl.viewport(0, 0, buffers.velocity.width, buffers.velocity.height)
  programs.splat.bind()
  gl.uniform1i(programs.splat.uniforms.uTarget, buffers.velocity.read.attach(0))
  gl.uniform1f(programs.splat.uniforms.aspectRatio, gl.canvas.width / gl.canvas.height)
  gl.uniform2f(programs.splat.uniforms.point, x, y)
  gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0)
  gl.uniform1f(programs.splat.uniforms.radius, correctRadius(gl.canvas, config.SPLAT_RADIUS / 100.0))
  blit(gl, buffers.velocity.write.fbo)
  buffers.velocity.swap()

  gl.viewport(0, 0, buffers.dye.width, buffers.dye.height)
  gl.uniform1i(programs.splat.uniforms.uTarget, buffers.dye.read.attach(0))
  gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b)
  blit(gl, buffers.dye.write.fbo)
  buffers.dye.swap()
}

function correctRadius (canvas, radius) {
  const aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 1) { radius *= aspectRatio }
  return radius
}
