precision highp float;

attribute vec2 uv;
attribute vec3 translate;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uDensity;

varying vec3 vTranslate;
varying vec3 vX_;
varying vec3 vX;
varying vec3 vY_;
varying vec3 vY;
varying vec3 vZ_;
varying vec3 vZ;

void main() {
	float offset = 1. / uDensity;
	vX_ = translate - vec3(offset, 0., 0.);
    vX  = translate + vec3(offset, 0., 0.);
	vY_ = translate - vec3(0., offset, 0.);
    vY  = translate + vec3(0., offset, 0.);
	vZ_ = translate - vec3(0., 0., offset);
    vZ  = translate + vec3(0., 0., offset);

	vec4 position = vec4(((translate.x + uDensity * translate.z) / (uDensity + 1.)) * ( uDensity * uDensity - 1.) / ( uDensity * uDensity ) - 1. / ( uDensity * uDensity ), translate.y * ( uDensity - 1.) / uDensity - 1. / uDensity, 0., 1.0 );
	position.xyz += vec3(uv.x / (uDensity * uDensity ) * 2. , uv.y / uDensity * 2. , 0.0);
    vTranslate = translate;
	
	gl_Position = projectionMatrix * modelViewMatrix * position;
}
