precision highp float;
uniform float density;
uniform sampler2D uVelocity;

varying vec3 vTranslate;
varying vec3 vX_;
varying vec3 vX;
varying vec3 vY_;
varying vec3 vY;
varying vec3 vZ_;
varying vec3 vZ;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / density * ((density - 1.) / density) + translate.z * ((density - 1.) / density) + 1.) / 2., (translate.y * ((density - 1.) / density) + 1.) / 2.));	
}

void main() {
    float curlX = read(uVelocity, vY).z - read(uVelocity, vY_).z - (read(uVelocity, vZ).y - read(uVelocity, vZ_).y);
    float curlY = read(uVelocity, vZ).x - read(uVelocity, vZ_).x - (read(uVelocity, vX).z - read(uVelocity, vX_).z);
    float curlZ = read(uVelocity, vX).y - read(uVelocity, vX_).y - (read(uVelocity, vY).x - read(uVelocity, vY_).x);

	gl_FragColor = vec4(0.5 * vec3(curlX, curlY, curlZ), 1.0);
}
