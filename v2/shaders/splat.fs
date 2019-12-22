precision highp float;
uniform float density;
uniform sampler2D uTarget;
uniform vec3 point;
uniform vec3 color;
uniform float radius;

varying vec3 vTranslate;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / density * ((density - 1.) / density) + translate.z * ((density - 1.) / density) + 1.) / 2., (translate.y * ((density - 1.) / density) + 1.) / 2.));	
}

void main() {
    vec3 p = vTranslate - point;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = read(uTarget, vTranslate).xyz;

    gl_FragColor = vec4(base + splat, 1.0);
}
