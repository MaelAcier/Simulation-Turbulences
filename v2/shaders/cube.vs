precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float density;
uniform sampler2D textureMap;
attribute vec2 uv;
attribute vec3 translate;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
	vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
	vec4 data = texture2D( textureMap, vec2((vPosition.x / density * ((density - 1.) / density) + vPosition.z * ((density - 1.) / density) + 1.) / 2., (vPosition.y * ((density - 1.) / density) + 1.) / 2.));
	mvPosition.xyz += vec3(uv, 0.0) * data.w;
	vUv = uv;
	vPosition = translate;
	gl_Position = projectionMatrix * mvPosition;
}
