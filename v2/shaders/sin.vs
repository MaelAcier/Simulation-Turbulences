precision highp float;

attribute vec2 uv;
attribute vec3 translate;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uDensity;

varying vec2 vUv;
varying float vScale;

void main() {
	vec4 position = vec4(((translate.x + uDensity * translate.z) / (uDensity + 1.)) * ( uDensity * uDensity - 1.) / ( uDensity * uDensity ) - 1. / ( uDensity * uDensity ), translate.y * ( uDensity - 1.) / uDensity - 1. / uDensity, 0., 1.0 );
	position.xyz += vec3(uv.x / (uDensity * uDensity ) * 2. , uv.y / uDensity * 2. , 0.0);
	vec3 trTime = vec3(translate.x + uTime,translate.y + uTime,translate.z + uTime);
	float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
	vScale = scale;
	vUv = uv;
	gl_Position = projectionMatrix *  modelViewMatrix * position;
}