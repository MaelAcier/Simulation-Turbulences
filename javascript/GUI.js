import { initFramebuffers } from './buffers.js'
import { displayMaterial } from './materials.js'
import captureScreenshot from './screenshot.js'
/* global dat */

export const config = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 1,
  VELOCITY_DISSIPATION: 0.2,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 30,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLORFUL: true,
  COLOR_UPDATE_SPEED: 10,
  PAUSED: false,
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: false,
  BLOOM: true,
  BLOOM_ITERATIONS: 8,
  BLOOM_RESOLUTION: 256,
  BLOOM_INTENSITY: 0.8,
  BLOOM_THRESHOLD: 0.6,
  BLOOM_SOFT_KNEE: 0.7,
  SUNRAYS: true,
  SUNRAYS_RESOLUTION: 196,
  SUNRAYS_WEIGHT: 1.0
}

export const splatStack = []

export function startGUI (webGLContext, canvas) {
  const gui = new dat.GUI({ width: 300 })
  gui.add(config, 'DYE_RESOLUTION', { high: 1024, medium: 512, low: 256, 'very low': 128 }).name('quality').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'SIM_RESOLUTION', { 32: 32, 64: 64, 128: 128, 256: 256 }).name('sim resolution').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'DENSITY_DISSIPATION', 0, 4.0).name('density diffusion')
  gui.add(config, 'VELOCITY_DISSIPATION', 0, 4.0).name('velocity diffusion')
  gui.add(config, 'PRESSURE', 0.0, 1.0).name('pressure')
  gui.add(config, 'CURL', 0, 50).name('vorticity').step(1)
  gui.add(config, 'SPLAT_RADIUS', 0.01, 1.0).name('splat radius')
  gui.add(config, 'SHADING').name('shading').onFinishChange(updateKeywords)
  gui.add(config, 'COLORFUL').name('colorful')
  gui.add(config, 'PAUSED').name('paused').listen()

  gui.add({
    fun: function () {
      splatStack.push(parseInt(Math.random() * 20) + 5)
    }
  }, 'fun').name('Random splats')

  const bloomFolder = gui.addFolder('Bloom')
  bloomFolder.add(config, 'BLOOM').name('enabled').onFinishChange(updateKeywords)
  bloomFolder.add(config, 'BLOOM_INTENSITY', 0.1, 2.0).name('intensity')
  bloomFolder.add(config, 'BLOOM_THRESHOLD', 0.0, 1.0).name('threshold')

  const sunraysFolder = gui.addFolder('Sunrays')
  sunraysFolder.add(config, 'SUNRAYS').name('enabled').onFinishChange(updateKeywords)
  sunraysFolder.add(config, 'SUNRAYS_WEIGHT', 0.3, 1.0).name('weight')

  const captureFolder = gui.addFolder('Capture')
  captureFolder.addColor(config, 'BACK_COLOR').name('background color')
  captureFolder.add(config, 'TRANSPARENT').name('transparent')
  captureFolder.add({ fun: () => captureScreenshot(webGLContext, config, canvas) }, 'fun').name('take screenshot')

  if (isMobile()) { gui.close() }
}

export function updateKeywords () {
  var displayKeywords = []
  if (config.SHADING) { displayKeywords.push('SHADING') }
  if (config.BLOOM) { displayKeywords.push('BLOOM') }
  if (config.SUNRAYS) { displayKeywords.push('SUNRAYS') }
  displayMaterial.setKeywords(displayKeywords)
}

function isMobile () {
  return /Mobi|Android/i.test(navigator.userAgent)
}
