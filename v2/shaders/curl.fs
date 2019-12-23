precision highp float;

uniform sampler2D sVelocity;

uniform float uDensity;

varying vec3 vTranslate;
varying vec3 vX_;
varying vec3 vX;
varying vec3 vY_;
varying vec3 vY;
varying vec3 vZ_;
varying vec3 vZ;

vec4 read(sampler2D texture, vec3 translate) {
	return texture2D(texture, vec2((translate.x / uDensity * ((uDensity - 1.) / uDensity) + translate.z * ((uDensity - 1.) / uDensity) + 1.) / 2., (translate.y * ((uDensity - 1.) / uDensity) + 1.) / 2.));	
}

void main() {
    float curlX = read(sVelocity, vY).z - read(sVelocity, vY_).z - (read(sVelocity, vZ).y - read(sVelocity, vZ_).y);
    float curlY = read(sVelocity, vZ).x - read(sVelocity, vZ_).x - (read(sVelocity, vX).z - read(sVelocity, vX_).z);
    float curlZ = read(sVelocity, vX).y - read(sVelocity, vX_).y - (read(sVelocity, vY).x - read(sVelocity, vY_).x);

	gl_FragColor = vec4(0.5 * vec3(curlX, curlY, curlZ), 1.0);
}
