precision highp float;

uniform sampler2D sPressure;
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

void main () {
    float X  = read(sPressure, vX ).x;
    float X_ = read(sPressure, vX_).x;
    float Y  = read(sPressure, vY ).x;
    float Y_ = read(sPressure, vY_).x;
    float Z  = read(sPressure, vZ ).x;
    float Z_ = read(sPressure, vZ_).x;

    vec3 velocity = read(sVelocity, vTranslate).xyz;
    velocity.xyz -= vec3(X - X_, Y - Y_, Z - Z_);
    gl_FragColor = vec4(velocity, 1.0);
}
