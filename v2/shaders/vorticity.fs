precision highp float;

uniform sampler2D sVelocity;
uniform sampler2D sCurl;

uniform float uDensity;
uniform float uCurl;
uniform float uDt;

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

void main () {
    float forceX = read(sCurl, vY).z - read(sCurl, vY_).z - (read(sCurl, vZ).y - read(sCurl, vZ_).y);
    float forceY = read(sCurl, vZ).x - read(sCurl, vZ_).x - (read(sCurl, vX).z - read(sCurl, vX_).z);
    float forceZ = read(sCurl, vX).y - read(sCurl, vX_).y - (read(sCurl, vY).x - read(sCurl, vY_).x);
    vec3 force = 0.5 * vec3(forceX, forceY, forceZ);

    vec3 C = read(sCurl, vTranslate).xyz;

    force /= length(force) + 0.0001;
    force *= uCurl * length(C);

    vec3 velocity = read(sVelocity, vTranslate).xyz;
    gl_FragColor = vec4(velocity + force * uDt, 1.0);
}
