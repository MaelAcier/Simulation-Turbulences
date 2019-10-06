import { colorProgram, checkerboardProgram } from './programs.js'
import { displayMaterial } from './materials.js'
import { buffers } from './buffers.js'
import blit from './blit.js'
/* global Image */

console.log('draw.js called')

let ditheringTexture

export function drawColor (gl, fbo, color) {
  colorProgram.bind()
  gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1)
  blit(fbo)
}

export function drawCheckerboard (gl, canvas, fbo) {
  checkerboardProgram.bind()
  gl.uniform1f(checkerboardProgram.uniforms.aspectRatio, canvas.width / canvas.height)
  blit(fbo)
}

export function drawDisplay (gl, config, fbo, width, height) {
  displayMaterial.bind()
  if (config.SHADING) { gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height) }
  gl.uniform1i(displayMaterial.uniforms.uTexture, buffers.dye.read.attach(0))
  if (config.BLOOM) {
    ditheringTexture = ditheringTexture | createTextureAsync(gl, 'LDR_LLL1_0.png')
    gl.uniform1i(displayMaterial.uniforms.uBloom, buffers.bloom.attach(1))
    gl.uniform1i(displayMaterial.uniforms.uDithering, ditheringTexture.attach(2))
    var scale = getTextureScale(ditheringTexture, width, height)
    gl.uniform2f(displayMaterial.uniforms.ditherScale, scale.x, scale.y)
  }
  if (config.SUNRAYS) { gl.uniform1i(displayMaterial.uniforms.uSunrays, buffers.sunrays.attach(3)) }
  blit(fbo)
}

function getTextureScale (texture, width, height) {
  return {
    x: width / texture.width,
    y: height / texture.height
  }
}

function createTextureAsync (gl, url) {
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]))

  var obj = {
    texture: texture,
    width: 1,
    height: 1,
    attach: function attach (id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    }
  }

  var image = new Image()
  image.onload = function () {
    obj.width = image.width
    obj.height = image.height
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  }
  image.src = url

  return obj
}
