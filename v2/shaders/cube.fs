precision highp float;

uniform sampler2D sCircleTexture;
uniform sampler2D sTexture;

uniform float uDensity;

varying vec2 vUv;
varying vec3 vTranslate;

void main() {
	vec4 circleColor = texture2D( sCircleTexture, vUv );
	vec4 data = texture2D( sTexture, vec2((vTranslate.x / uDensity * ((uDensity - 1.) / uDensity) + vTranslate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (vTranslate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));
	if ( circleColor.w < 0.5 ) discard;
	gl_FragColor = vec4( circleColor.xyz * data.xyz, circleColor.w );
}
