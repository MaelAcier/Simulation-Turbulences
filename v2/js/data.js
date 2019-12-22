import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js'

export const config = {
  showOrthographicHelper: false,
  cameraClipAxis: 'z',
  cameraClipOffset: 0,
  clipping: false,
  distance: 1100,
  density: 40,
  distribution: 'grid',
  transparent: false,
  pause: false,
  autoRotation: false,
  renderTarget: 'cube',
  splatRadius: 0.0025
}

export const cameras = {
  perspective: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000),
  orthographic: new THREE.OrthographicCamera(500 * window.innerWidth / window.innerHeight / -2, 500 * window.innerWidth / window.innerHeight / 2, 500, -500, 0, 50),
  texture: new THREE.OrthographicCamera(-500, 500, 500, -500, 0, 1)
}

export const objects = {
  orthographicHelper: new THREE.CameraHelper(cameras.orthographic)
}

export const scene = new THREE.Scene()
export const renderer = new THREE.WebGLRenderer()
export const controls = {
  perspective: new OrbitControls(cameras.perspective, renderer.domElement),
  orthographic: new OrbitControls(cameras.orthographic, renderer.domElement),
  texture: new OrbitControls(cameras.texture, renderer.domElement)
}
