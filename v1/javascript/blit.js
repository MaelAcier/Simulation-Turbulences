export default function blit (gl, destination) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}
