precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float density;
uniform float aspect;
attribute vec2 uv;
attribute vec3 translate;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
	vec4 position = vec4(((translate.x + density * translate.z) / (density + 1.)) * (density * density - 1.) / (density * density) - 1. / (density * density), translate.y * ( density - 1.) / density - 1. / density, 0., 1.0 );
	position.xyz += vec3(uv.x / (density * density ) * aspect, uv.y / density * aspect , 0.0);
	vec4 mvPosition = modelViewMatrix * position;
	vPosition = translate;
	vUv = uv;
	gl_Position = projectionMatrix * mvPosition;
}