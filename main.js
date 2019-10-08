import getWebGLContext from './javascript/webGLContext.js'
import resizeCanvas from './javascript/resizeCanvas.js'
import { initBlit } from './javascript/blit.js'
import { startGUI, updateKeywords } from './javascript/GUI.js'
import { loadShaders } from './javascript/shaders.js'
import { loadPrograms } from './javascript/programs.js'
import { loadMaterials } from './javascript/materials.js'
import { initFramebuffers } from './javascript/initBuffers.js'
import { multipleSplats } from './javascript/splats.js'
import update from './javascript/update.js'
import initEvents from './javascript/events.js'

const canvas = document.getElementById('glCanvas')

const webGLContext = getWebGLContext(canvas)
const gl = webGLContext.gl

initBlit(gl)
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
], () => {
  loadPrograms(gl)
  loadMaterials(gl)
  startGUI(webGLContext)
  updateKeywords()
  initFramebuffers(webGLContext)
  multipleSplats(webGLContext, parseInt(Math.random() * 20) + 5)
  update(webGLContext)
  initEvents(canvas)
})
