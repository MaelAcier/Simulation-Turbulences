import { createFBO, createDoubleFBO, resizeDoubleFBO } from './FBO.js'
import { config, buffers } from './data.js'

export function initFramebuffers (webGLContext) {
  const gl = webGLContext.gl
  const ext = webGLContext.ext
  const simRes = getResolution(gl, config.SIM_RESOLUTION)
  const dyeRes = getResolution(gl, config.DYE_RESOLUTION)

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const rg = ext.formatRG
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  if (buffers.dye == null) {
    buffers.dye = createDoubleFBO(gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
  } else {
    buffers.dye = resizeDoubleFBO(gl, buffers.dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
  }

  if (buffers.velocity == null) {
    buffers.velocity = createDoubleFBO(gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
  } else {
    buffers.velocity = resizeDoubleFBO(gl, buffers.velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
  }

  buffers.divergence = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)
  buffers.curl = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)
  buffers.pressure = createDoubleFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)

  initBloomFramebuffers(webGLContext)
  initSunraysFramebuffers(webGLContext)
}

function initBloomFramebuffers (webGLContext) {
  const gl = webGLContext.gl
  const ext = webGLContext.ext
  const res = getResolution(gl, config.BLOOM_RESOLUTION)

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  buffers.bloom = createFBO(gl, res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering)

  buffers.bloomFramebuffers.length = 0
  for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
    const width = res.width >> (i + 1)
    const height = res.height >> (i + 1)

    if (width < 2 || height < 2) { break }

    const fbo = createFBO(gl, width, height, rgba.internalFormat, rgba.format, texType, filtering)
    buffers.bloomFramebuffers.push(fbo)
  }
}

function initSunraysFramebuffers (webGLContext) {
  const gl = webGLContext.gl
  const ext = webGLContext.ext
  const res = getResolution(gl, config.SUNRAYS_RESOLUTION)

  const texType = ext.halfFloatTexType
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  buffers.sunrays = createFBO(gl, res.width, res.height, r.internalFormat, r.format, texType, filtering)
  buffers.sunraysTemp = createFBO(gl, res.width, res.height, r.internalFormat, r.format, texType, filtering)
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
