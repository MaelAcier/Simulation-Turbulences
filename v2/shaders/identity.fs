precision highp float;
uniform float density;
uniform sampler2D textureMap;
varying vec3 vTranslate;

void main() {
	vec4 data = texture2D( textureMap, vec2((vTranslate.x / density * ((density - 1.) / density) + vTranslate.z * ((density - 1.) / density) + 1.) / 2., (vTranslate.y * ((density - 1.) / density) + 1.) / 2.));
	gl_FragColor = vec4( data.xyzw );
}