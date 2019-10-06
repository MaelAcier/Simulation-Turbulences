import { createFBO } from './FBO.js'
import render from './render.js'

console.log('screenshot.js called')

export default function captureScreenshot (gl, config, canvas, ext) {
  var res = getResolution(config.CAPTURE_RESOLUTION)
  var target = createFBO(res.width, res.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, gl.NEAREST)
  render(gl, config, canvas, target)

  var texture = framebufferToTexture(gl, target)
  texture = normalizeTexture(texture, target.width, target.height)

  var captureCanvas = textureToCanvas(texture, target.width, target.height)
  var datauri = captureCanvas.toDataURL()
  downloadURI('fluid.png', datauri)
  URL.revokeObjectURL(datauri)
}

function framebufferToTexture (gl, target) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
  var length = target.width * target.height * 4
  var texture = new Float32Array(length)
  gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture)
  return texture
}

function normalizeTexture (texture, width, height) {
  var result = new Uint8Array(texture.length)
  var id = 0
  for (var i = height - 1; i >= 0; i--) {
    for (var j = 0; j < width; j++) {
      var nid = i * width * 4 + j * 4
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
  var captureCanvas = document.createElement('canvas')
  var ctx = captureCanvas.getContext('2d')
  captureCanvas.width = width
  captureCanvas.height = height

  var imageData = ctx.createImageData(width, height)
  imageData.data.set(texture)
  ctx.putImageData(imageData, 0, 0)

  return captureCanvas
}

function downloadURI (filename, uri) {
  var link = document.createElement('a')
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
