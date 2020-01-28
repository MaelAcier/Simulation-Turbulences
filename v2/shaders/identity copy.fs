precision highp float;

uniform sampler2D sTexture;

uniform float uDensity;

varying vec3 vTranslate;

uvec3 clampVector(vec3 pos) {
    return vec3(clamp(pos.x, 0, 1), clamp(pos.y, 0, 1), clamp(pos.z, 0, 1));
}

vec4 read(vec3 translate, sampler2D texture) {
	vec3 pos = clampVector(translate)
	return texture2D(texture, vec2((pos.x / uDensity * ((uDensity - 1.) / uDensity) + pos.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (pos.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main() {
	vec4 data = read(vTranslate, sTexture);
	gl_FragColor = vec4(data.xyzw);
}

