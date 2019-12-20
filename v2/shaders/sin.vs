precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float density;
uniform float aspect;
attribute vec2 uv;
attribute vec3 translate;

varying vec2 vUv;
varying float vScale;

void main() {
	vec4 position = vec4(((translate.x + density * translate.z) / (density + 1.)), translate.y * ( density - 1.) / density - 1. / density, 0., 1.0 );
	position.xyz += vec3(uv.x / (density * density ) * 2. , uv.y / density * 2. , 0.0);
	vec4 mvPosition = modelViewMatrix * position;
	vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
	float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
	vScale = scale;
	vUv = uv;
	gl_Position = projectionMatrix * mvPosition;
}