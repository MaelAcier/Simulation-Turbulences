import { programs } from './programs.js'
import blit from './blit.js'

export function createFBO (gl, w, h, internalFormat, format, type, param) {
  gl.activeTexture(gl.TEXTURE0)
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.viewport(0, 0, w, h)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const texelSizeX = 1.0 / w
  const texelSizeY = 1.0 / h

  return {
    texture: texture,
    fbo: fbo,
    width: w,
    height: h,
    texelSizeX: texelSizeX,
    texelSizeY: texelSizeY,
    attach: function attach (id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    }
  }
}

export function createDoubleFBO (gl, w, h, internalFormat, format, type, param) {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param)
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param)

  return {
    width: w,
    height: h,
    texelSizeX: fbo1.texelSizeX,
    texelSizeY: fbo1.texelSizeY,
    get read () {
      return fbo1
    },
    set read (value) {
      fbo1 = value
    },
    get write () {
      return fbo2
    },
    set write (value) {
      fbo2 = value
    },
    swap: function swap () {
      var temp = fbo1
      fbo1 = fbo2
      fbo2 = temp
    }
  }
}

export function resizeFBO (gl, target, w, h, internalFormat, format, type, param) {
  const newFBO = createFBO(gl, w, h, internalFormat, format, type, param)
  programs.copy.bind()
  gl.uniform1i(programs.copy.uniforms.uTexture, target.attach(0))
  blit(gl, newFBO.fbo)
  return newFBO
}

export function resizeDoubleFBO (gl, target, w, h, internalFormat, format, type, param) {
  if (target.width === w && target.height === h) { return target }
  target.read = resizeFBO(gl, target.read, w, h, internalFormat, format, type, param)
  target.write = createFBO(gl, w, h, internalFormat, format, type, param)
  target.width = w
  target.height = h
  target.texelSizeX = 1.0 / w
  target.texelSizeY = 1.0 / h
  return target
}
