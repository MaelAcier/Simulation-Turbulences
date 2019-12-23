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

void main () {
    float X  = read(sVelocity, vX ).x;
    float X_ = read(sVelocity, vX_).x;
    float Y  = read(sVelocity, vY ).y;
    float Y_ = read(sVelocity, vY_).y;
    float Z  = read(sVelocity, vZ ).z;
    float Z_ = read(sVelocity, vZ_).z;

    vec3 C = read(sVelocity, vTranslate).xyz;
        if (vX.x  > 1.0 ) { X  = -C.x; }
        if (vX_.x < -1.0) { X_ = -C.x; }
        if (vY.y  > 1.0 ) { Y  = -C.y; }
        if (vY_.y < -1.0) { Y_ = -C.y; }
        if (vZ.z  > 1.0 ) { Z  = -C.z; }
        if (vZ_.z < -1.0) { Z_ = -C.z; }
        
    float div = 0.5 * (X - X_ + Y - Y_ + Z - Z_);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}