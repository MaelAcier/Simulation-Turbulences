import { createFBO } from './FBO.js'
import render from './render.js'

export default function captureScreenshot (webGLContext, config) {
  const gl = webGLContext.gl
  const ext = webGLContext.ext
  const res = getResolution(gl, config.CAPTURE_RESOLUTION)
  const target = createFBO(gl, res.width, res.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, gl.NEAREST)
  render(webGLContext, config, target)

  let texture = framebufferToTexture(gl, target)
  texture = normalizeTexture(texture, target.width, target.height)

  const captureCanvas = textureToCanvas(texture, target.width, target.height)
  const datauri = captureCanvas.toDataURL()
  downloadURI('fluid.png', datauri)
  URL.revokeObjectURL(datauri)
}

function framebufferToTexture (gl, target) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
  const length = target.width * target.height * 4
  const texture = new Float32Array(length)
  gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture)
  return texture
}

function normalizeTexture (texture, width, height) {
  const result = new Uint8Array(texture.length)
  let id = 0
  for (let i = height - 1; i >= 0; i--) {
    for (let j = 0; j < width; j++) {
      const nid = i * width * 4 + j * 4
      result[nid + 0] = clamp01(texture[id + 0]) * 255
      result[nid + 1] = clamp01(texture[id + 1]) * 255
      result[nid + 2] = clamp01(texture[id + 2]) * 255
      result[nid + 3] = clamp01(texture[id + 3]) * 255
      id += 4
    }
  }
  return result
}

function clamp01 (input) {
  return Math.min(Math.max(input, 0), 1)
}

function textureToCanvas (texture, width, height) {
  const captureCanvas = document.createElement('canvas')
  const ctx = captureCanvas.getContext('2d')
  captureCanvas.width = width
  captureCanvas.height = height

  const imageData = ctx.createImageData(width, height)
  imageData.data.set(texture)
  ctx.putImageData(imageData, 0, 0)

  return captureCanvas
}

function downloadURI (filename, uri) {
  const link = document.createElement('a')
  link.download = filename
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getResolution (gl, resolution) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  if (aspectRatio < 1) { aspectRatio = 1.0 / aspectRatio }

  const min = Math.round(resolution)
  const max = Math.round(resolution * aspectRatio)

  if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
    return { width: max, height: min }
  } else {
    return { width: min, height: max }
  }
}
