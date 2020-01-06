import * as THREE from './lib/three.module.js'

import { GUI } from './lib/dat.gui.module.js'
import { NRRDLoader } from './lib/3d/NRRDLoader.js'
import { VolumeRenderShader1 } from './lib/VolumeShader.js'
import { WEBGL } from './lib/WebGL.js'

import { config, objects, cameras, scene, renderer, controls } from './js/data.js'

if (WEBGL.isWebGL2Available() === false) {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage())
}

var material,
  volconfig,
  cmtextures

init()

function init () {
  // scene.add( new AxesHelper( 128 ) );

  // Lighting is baked into the shader a.t.m.
  // var dirLight = new DirectionalLight( 0xffffff );

  // The gui for interaction
  volconfig = { clim1: 0, clim2: 1, colormap: 'viridis' }
  var gui = new GUI()
  gui.add(volconfig, 'clim1', 0, 1, 0.01)/* .onChange(updateUniforms) */
  gui.add(volconfig, 'clim2', 0, 1, 0.01)/* .onChange(updateUniforms) */
  gui.add(volconfig, 'colormap', { gray: 'gray', viridis: 'viridis' })/* .onChange(updateUniforms) */

  // Load the data ...
}

/* function updateUniforms () {
  material.uniforms.u_clim.value.set(volconfig.clim1, volconfig.clim2)
  material.uniforms.u_renderthreshold.value = volconfig.isothreshold // For ISO renderstyle
  material.uniforms.u_cmdata.value = cmtextures[volconfig.colormap]
} */
