precision highp float;
uniform sampler2D map;
uniform float density;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
	gl_FragColor = vec4( floor(mod(vPosition.y * density, 3.)/2.), floor(mod(vPosition.y * density + 1., 3.)/2.), floor(mod(vPosition.y * density +2., 3.)/2.), 10. );
}