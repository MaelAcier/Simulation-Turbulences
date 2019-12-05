import * as THREE from '../lib/three.module.js'

export const config = {
  clipIntersection: true,
  planeConstant: 0.0,
  showPlaneHelpers: false,
  showOrthographicHelper: false,
  cameraClipAxis: 'z',
  cameraClipOffset: 0,
  clipping: false,
  density: 40,
  distribution: 'grid',
  pause: false,
  autoRotation: false
}

export const cameras = {
  perspective: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000),
  orthographic: new THREE.OrthographicCamera(500 * window.innerWidth / window.innerHeight / -2, 500 * window.innerWidth / window.innerHeight / 2, 500, -500, 0, 50)
}

export const objects = {
  orthographicHelper: new THREE.CameraHelper(cameras.orthographic)
}
