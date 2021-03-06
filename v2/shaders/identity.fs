precision highp float;

uniform sampler2D sTexture;

uniform float uDensity;

varying vec3 vTranslate;

vec4 read(vec3 translate, sampler2D texture) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main() {
	vec4 data = read(vTranslate, sTexture);
	gl_FragColor = vec4(data.xyzw);
}
