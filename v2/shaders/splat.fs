precision highp float;

uniform sampler2D sTarget;

uniform float uDensity;
uniform vec3 uPoint;
uniform vec3 uColor;
uniform float uRadius;

varying vec3 vTranslate;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main() {
    vec3 p = vTranslate - uPoint;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = read(sTarget, vTranslate).xyz;

    gl_FragColor = vec4(base + splat, 1.0);
}
