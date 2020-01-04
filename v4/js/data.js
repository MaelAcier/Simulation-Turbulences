import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js'

export const config = {
  distance: 2,
  density: 10,
  pause: false,
  clipping: false,
  renderTarget: 'planeArray',
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

export const cameras = {
  perspective: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50000),
  orthographic: new THREE.OrthographicCamera(window.innerWidth / window.innerHeight / -2, window.innerWidth / window.innerHeight / 2, 1, -1, 0, 0.1),
  texture: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)
}

export const objects = {
  orthographicHelper: new THREE.CameraHelper(cameras.orthographic)
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2', { alpha: false, antialias: false })

export const scene = new THREE.Scene()
export const renderer = new THREE.WebGLRenderer({ canvas, context })
export const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic: new OrbitControls(cameras.orthographic, renderer.domElement),
  texture: new OrbitControls(cameras.texture, renderer.domElement)
}
