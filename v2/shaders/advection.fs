precision highp float;

uniform sampler2D sVelocity;
uniform sampler2D sSource;

uniform float uDensity;
uniform float uDt;
uniform float uDissipation;

varying vec3 vTranslate;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main () {
    vec3 coord = vTranslate - uDt * read(sVelocity, vTranslate).xyz * 1. / uDensity;
    vec4 result = read(sSource, coord);
    float decay = 1.0 + uDissipation * uDt;
    gl_FragColor = result / decay;
}
