import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js'

export const config = {
  distance: 2,
  resolution: 32,
  pause: false,
  clipping: false,
  renderTarget: 'volume3D',
  depth: 0,
  autoRotation: false,
  showOrthographicHelper: false,
  cameraClipAxis: 'z',
  cameraClipOffset: 0,
  transparent: false,
  splatRadius: 0.0025,
  curl: 30.0,
  pressure: 0.8,
  pressureIterations: 3,
  velocityDissipation: 2.0,
  densityDissipation: 1
}

export const cmtextures = {
  viridis: new THREE.TextureLoader().load('./cm_viridis.png', () => {}),
  gray: new THREE.TextureLoader().load('./cm_gray.png', () => {})
}

const h = 1
const aspect = window.innerWidth / window.innerHeight

export const cameras = {
  perspective: new THREE.PerspectiveCamera(50, aspect, 0.1, 50000),
  orthographic3D: new THREE.OrthographicCamera(aspect / -2 * h, aspect / 2 * h, h / 2, -h / 2, 1, 1000),
  orthographic: new THREE.OrthographicCamera(aspect / -2, aspect / 2, 1, -1, 0, 0.1),
  texture: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)
}

export const objects = {
  orthographicHelper: new THREE.CameraHelper(cameras.orthographic)
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2', { alpha: false, antialias: false })
context.getExtension('WEBGL_color_buffer_float')
context.getExtension('EXT_float_blend')

export const scene = new THREE.Scene()
export const renderer = new THREE.WebGLRenderer({ canvas, context })
export const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic3D: new OrbitControls(cameras.orthographic3D, renderer.domElement),
  orthographic: new OrbitControls(cameras.orthographic, renderer.domElement),
  texture: new OrbitControls(cameras.texture, renderer.domElement)
}
