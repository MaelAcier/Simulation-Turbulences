precision highp float;

attribute vec2 uv;
attribute vec3 translate;

uniform sampler2D sTexture;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uDensity;

varying vec3 vTranslate;
varying vec2 vUv;

void main() {
	vTranslate = translate;
	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
	vec4 data = texture2D( sTexture, vec2((vTranslate.x / uDensity * ((uDensity - 1.) / uDensity) + vTranslate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (vTranslate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));
	mvPosition.xyz += vec3(uv, 0.0) * data.w;
	gl_Position = projectionMatrix * mvPosition;
}
