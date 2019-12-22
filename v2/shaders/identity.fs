precision highp float;
uniform float density;
uniform sampler2D textureMap;
varying vec3 vTranslate;

vec4 read(vec3 translate, sampler2D texture) {
	return texture2D(texture, vec2((translate.x / density * ((density - 1.) / density) + translate.z * ((density - 1.) / density) + 1.) / 2., (translate.y * ((density - 1.) / density) + 1.) / 2.));	
}

void main() {
	vec4 data = read(vTranslate, textureMap);
	gl_FragColor = vec4(data.xyzw);
}
