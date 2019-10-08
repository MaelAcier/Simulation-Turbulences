import { initFramebuffers } from './initBuffers.js'
import updateKeywords from './updateKeywords.js'
import captureScreenshot from './screenshot.js'
import { splatStack, config } from './data.js'
/* global dat */

export default function startGUI (webGLContext) {
  const gui = new dat.GUI({ width: 350 })
  gui.remember(config)

  gui.add(config, 'DYE_RESOLUTION', { high: 1024, medium: 512, low: 256, 'very low': 128 }).name('Qualité').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'SIM_RESOLUTION', { 32: 32, 64: 64, 128: 128, 256: 256 }).name('Résolution').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'DENSITY_DISSIPATION', 0, 4.0).name('Dissipation par densité')
  gui.add(config, 'VELOCITY_DISSIPATION', 0, 4.0).name('Dissipation de la vélocité')
  gui.add(config, 'PRESSURE', 0.0, 1.0).name('Pression')
  gui.add(config, 'CURL', 0, 50).name('Tourbillon').step(1)
  gui.add(config, 'SPLAT_RADIUS', 0.01, 1.0).name('Rayon éclaboussure')
  gui.add(config, 'SHADING').name('Ombres').onFinishChange(updateKeywords)
  gui.add(config, 'COLORFUL').name('Coloré')
  gui.add(config, 'PAUSED').name('Pause').listen()

  gui.add({
    fun: function () {
      splatStack.push(parseInt(Math.random() * 20) + 5)
    }
  }, 'fun').name('Eclaboussures aléatoires')

  const bloomFolder = gui.addFolder('Bloom')
  bloomFolder.add(config, 'BLOOM').name('enabled').onFinishChange(updateKeywords)
  bloomFolder.add(config, 'BLOOM_INTENSITY', 0.1, 2.0).name('intensity')
  bloomFolder.add(config, 'BLOOM_THRESHOLD', 0.0, 1.0).name('threshold')

  const sunraysFolder = gui.addFolder('Rayons')
  sunraysFolder.add(config, 'SUNRAYS').name('enabled').onFinishChange(updateKeywords)
  sunraysFolder.add(config, 'SUNRAYS_WEIGHT', 0.3, 1.0).name('weight')

  const captureFolder = gui.addFolder('Capture')
  captureFolder.addColor(config, 'BACK_COLOR').name('Couleur de fond')
  captureFolder.add(config, 'TRANSPARENT').name('Transparence')
  captureFolder.add({ fun: () => captureScreenshot(webGLContext, config) }, 'fun').name("Capture d'écran")

  if (isMobile()) { gui.close() }

  updateKeywords()
  initFramebuffers(webGLContext)
}

function isMobile () {
  return /Mobi|Android/i.test(navigator.userAgent)
}
