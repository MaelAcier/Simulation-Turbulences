export default function getWebGLContext (canvas) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false
  }

  const isWebGL2 = Boolean(canvas.getContext('webgl2', params))
  const gl = canvas.getContext('webgl2', params) || canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)

  if (isWebGL2) gl.getExtension('EXT_color_buffer_float')

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const supportLinearFiltering = isWebGL2
    ? gl.getExtension('OES_texture_float_linear')
    : gl.getExtension('OES_texture_half_float_linear')
  const halfFloat = isWebGL2
    ? undefined
    : gl.getExtension('OES_texture_half_float')
  const halfFloatTexType = isWebGL2
    ? gl.HALF_FLOAT
    : halfFloat.HALF_FLOAT_OES

  return {
    gl: gl,
    ext: {
      formats: getFormats(gl, isWebGL2, halfFloatTexType),
      halfFloatTexType: halfFloatTexType,
      supportLinearFiltering: supportLinearFiltering
    }
  }
}

function getFormats (gl, isWebGL2, halfFloatTexType) {
  return isWebGL2
    ? {
      formatRGBA: getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType),
      formatRG: getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType),
      formatR: getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
    }
    : {
      formatRGBA: getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType),
      formatRG: getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType),
      formatR: getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    }
}

function getSupportedFormat (gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }

  return {
    internalFormat: internalFormat,
    format: format
  }
}

function supportRenderTextureFormat (gl, internalFormat, format, type) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  return status === gl.FRAMEBUFFER_COMPLETE
}
