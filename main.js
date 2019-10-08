import getWebGLContext from './javascript/webGLContext.js'
import resizeCanvas from './javascript/resizeCanvas.js'
import startGUI from './javascript/GUI.js'
import { loadShaders } from './javascript/shaders.js'
import { loadPrograms } from './javascript/programs.js'
import { loadMaterials } from './javascript/materials.js'
import { multipleSplats } from './javascript/splats.js'
import update from './javascript/update.js'
import initEvents from './javascript/events.js'

const canvas = document.getElementById('glCanvas')

const webGLContext = getWebGLContext(canvas)
const gl = webGLContext.gl

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(0)

resizeCanvas(canvas)

loadShaders(gl, 'shaders', [
  'advection.fs',
  'bloomBlur.fs',
  'bloomPrefilter.fs',
  'blurVertex.vs',
  'clear.fs',
  'copy.fs',
  'display.fs',
  'gradientSubtract.fs',
  'splat.fs',
  'sunraysMask.fs',
  'baseVertex.vs',
  'bloomFinal.fs',
  'blur.fs',
  'checkerboard.fs',
  'color.fs',
  'curl.fs',
  'divergence.fs',
  'pressure.fs',
  'sunrays.fs',
  'vorticity.fs'
]).then(() => {
  loadPrograms(gl)
  loadMaterials(gl)
    .then(() => {
      startGUI(webGLContext)
      multipleSplats(webGLContext, parseInt(Math.random() * 20) + 5)
      update(webGLContext)
      initEvents(canvas)
    })
})
