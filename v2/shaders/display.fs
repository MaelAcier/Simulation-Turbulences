precision highp float;

uniform sampler2D sTexture;

uniform float uDensity;

varying vec3 vTranslate;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main () {
    vec3 c = read(sTexture, vTranslate).rgb;

    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
}
