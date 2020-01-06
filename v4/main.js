import Stats from './lib/stats.module.js'
import { WEBGL } from './lib/WebGL.js'

import * as THREE from './lib/three.module.js'
import { NRRDLoader } from './lib/3d/NRRDLoader.js'

import { config, objects, cameras, scene, renderer, controls } from './js/data.js'
import { loadMaterials, materials } from './js/materials.js'
import { loadMeshes } from './js/meshes.js'
import { setupGUI } from './js/gui.js'
import { renderingPipeline } from './js/render.js'
// import './3d.js'

/* global requestAnimationFrame */

const stats = new Stats()

var cmtextures

loadMaterials(() => {
  /* new NRRDLoader().load('./stent.nrrd', function (volume) {
    // Texture to hold the volume. We have scalars, so we put our data in the red channel.
    // THREEJS will select R32F (33326) based on the THREE.RedFormat and THREE.FloatType.
    // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    // TODO: look the dtype up in the volume metadata
    // console.log(volume.data)

    var texture = new THREE.DataTexture3D(volume.data, volume.xLength, volume.yLength, volume.zLength)
    // var texture = new THREE.DataTexture3D(gradient, size, size, size);
    texture.format = THREE.RGBAFormat
    texture.format = THREE.RedFormat
    texture.type = THREE.FloatType
    texture.minFilter = texture.magFilter = THREE.LinearFilter
    texture.unpackAlignment = 1

    // Colormap textures
    cmtextures = {
      viridis: new THREE.TextureLoader().load('./cm_viridis.png', () => {}),
      gray: new THREE.TextureLoader().load('./cm_gray.png', () => {})
    }

    materials.volume3D.uniforms.u_data.value = texture
    materials.volume3D.uniforms.u_size.value.set(volume.xLength, volume.yLength, volume.zLength)
    materials.volume3D.uniforms.u_clim.value.set(0, 1)
    materials.volume3D.uniforms.u_renderstyle.value = 'mip' // 0: MIP, 1: ISO
    materials.volume3D.uniforms.u_cmdata.value = cmtextures.viridis
  }) */
  init()
  animate()
})

function init () {
  /* if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage())
  } */

  /* if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return false
  } */

  cameras.perspective.position.set(config.distance, config.distance, config.distance)
  controls.perspective.update()

  cameras.orthographic3D.position.set(config.distance, config.distance, config.distance)
  controls.orthographic3D.update()

  objects.orthographicHelper.visible = config.showOrthographicHelper
  scene.add(objects.orthographicHelper)

  controls.perspective.enablePan = false
  controls.perspective.autoRotate = true
  controls.orthographic.enablePan = false
  controls.orthographic.enableRotate = false
  controls.texture.enablePan = false
  controls.texture.enableRotate = false
  controls.texture.enableZoom = false

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener('resize', onWindowResize, false)
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)

  loadMeshes()
  setupGUI(scene)

  /* const gl = renderer.domElement.getContext('webgl') || renderer.domElement.getContext('experimental-webgl')
  gl.getExtension('WEBGL_color_buffer_float')
  gl.getExtension('EXT_float_blend') */
}

function onWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight)

  const aspect = window.innerWidth / window.innerHeight
  const frustumHeight = cameras.orthographic3D.top - cameras.orthographic3D.bottom

  cameras.perspective.aspect = aspect

  cameras.orthographic3D.left = -frustumHeight * aspect / 2
  cameras.orthographic3D.right = frustumHeight * aspect / 2

  cameras.perspective.updateProjectionMatrix()
  cameras.orthographic3D.updateProjectionMatrix()
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  /* var time = performance.now() * 0.0005

  materials.planeArray.uniforms.uTime.value = time
  materials.sin.uniforms.uTime.value = time

  renderer.render(scene, cameras.perspective) */
  renderingPipeline()
  stats.update()
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    config.pause = !config.pause
  }
})
