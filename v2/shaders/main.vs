precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
attribute vec2 uv;
attribute vec3 translate;
varying vec3 position;
varying vec2 vUv;
varying float vScale;

void main() {
	vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
	vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
	float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
	vScale = scale;
	scale = scale * 10.0 + 10.0;
	mvPosition.xyz += vec3(uv, 0.0) * scale;
	vUv = uv;
	position = translate;
	gl_Position = projectionMatrix * mvPosition;
}
