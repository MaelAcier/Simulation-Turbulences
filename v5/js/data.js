import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js'

export const config = {
  distance: 2,
  resolutions: {
    0: 32,
    1: 64
  },
  pause: false,
  clipping: false,
  renderTarget: 'volume2D',
  backgroundColor: '#FF0000',
  depth: 0,
  autoRotation: false,
  transparent: false,
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 1,
  VELOCITY_DISSIPATION: 0.2,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 30,
  SPLAT_RADIUS: 0.025,
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
  SUNRAYS: false,
  SUNRAYS_RESOLUTION: 196,
  SUNRAYS_WEIGHT: 1.0
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
  texture: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)
}

export const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2', { alpha: false, antialias: false })
context.getExtension('WEBGL_color_buffer_float')
context.getExtension('EXT_float_blend')

export const scene = new THREE.Scene()
export const renderer = new THREE.WebGLRenderer({ canvas, context, powerPreference: 'high-performance' })
export const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic3D: new OrbitControls(cameras.orthographic3D, renderer.domElement),
  texture: new OrbitControls(cameras.texture, renderer.domElement)
}
