precision highp float;

attribute vec2 uv;
attribute vec3 translate;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uDensity;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
	vec4 position = vec4(((translate.x + uDensity * translate.z) / (uDensity + 1.)) * ( uDensity * uDensity - 1.) / ( uDensity * uDensity ) - 1. / ( uDensity * uDensity ), translate.y * ( uDensity - 1.) / uDensity - 1. / uDensity, 0., 1.0 );
	position.xyz += vec3(uv.x / (uDensity * uDensity ) * 2. , uv.y / uDensity * 2. , 0.0);
	vec4 mvPosition = modelViewMatrix * position;
	vPosition = translate;
	vUv = uv;
	gl_Position = projectionMatrix * mvPosition;
}