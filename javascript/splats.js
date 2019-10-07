import { config, splatStack } from './GUI.js'
import { generateColor } from './updateColors.js'
import { buffers } from './buffers.js'
import { programs } from './programs.js'
import blit from './blit.js'

export default function applyInputs (gl, canvas, pointers) {
  if (splatStack.length > 0) { multipleSplats(gl, canvas, splatStack.pop()) }

  pointers.forEach(function (p) {
    if (p.moved) {
      p.moved = false
      splatPointer(gl, canvas, p)
    }
  })
}

function splatPointer (gl, canvas, pointer) {
  var dx = pointer.deltaX * config.SPLAT_FORCE
  var dy = pointer.deltaY * config.SPLAT_FORCE
  splat(gl, canvas, pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
}

function multipleSplats (gl, canvas, amount) {
  for (var i = 0; i < amount; i++) {
    var color = generateColor()
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    var x = Math.random()
    var y = Math.random()
    var dx = 1000 * (Math.random() - 0.5)
    var dy = 1000 * (Math.random() - 0.5)
    splat(gl, canvas, x, y, dx, dy, color)
  }
}

function splat (gl, canvas, x, y, dx, dy, color) {
  gl.viewport(0, 0, buffers.velocity.width, buffers.velocity.height)
  programs.splat.bind()
  gl.uniform1i(programs.splat.uniforms.uTarget, buffers.velocity.read.attach(0))
  gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height)
  gl.uniform2f(programs.splat.uniforms.point, x, y)
  gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0)
  gl.uniform1f(programs.splat.uniforms.radius, correctRadius(canvas, config.SPLAT_RADIUS / 100.0))
  blit(gl, buffers.velocity.write.fbo)
  buffers.velocity.swap()

  gl.viewport(0, 0, buffers.dye.width, buffers.dye.height)
  gl.uniform1i(programs.splat.uniforms.uTarget, buffers.dye.read.attach(0))
  gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b)
  blit(gl, buffers.dye.write.fbo)
  buffers.dye.swap()
}

function correctRadius (canvas, radius) {
  var aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 1) { radius *= aspectRatio }
  return radius
}
