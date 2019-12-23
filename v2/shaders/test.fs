precision highp float;

uniform float uDensity;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
	gl_FragColor = vec4( floor(mod(vPosition.y * uDensity, 3.)/2.), floor(mod(vPosition.y * uDensity + 1., 3.)/2.), floor(mod(vPosition.y * uDensity +2., 3.)/2.), 10. );
}