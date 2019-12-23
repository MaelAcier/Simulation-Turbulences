precision highp float;

uniform sampler2D sPressure;

uniform float uDensity;
uniform float uPressure;

varying vec3 vTranslate;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main () {
    gl_FragColor = uPressure * read(sPressure, vTranslate);
}
