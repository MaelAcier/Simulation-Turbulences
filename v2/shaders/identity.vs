precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float density;
attribute vec2 uv;
attribute vec3 translate;
varying vec3 vTranslate;

varying vec3 vX_;
varying vec3 vX;
varying vec3 vY_;
varying vec3 vY;
varying vec3 vZ_;
varying vec3 vZ;

void main() {
	float offset = 1. / density;
	vX_ = translate - vec3(offset, 0., 0.);
    vX = translate + vec3(offset, 0., 0.);
	vY_ = translate - vec3(0., offset, 0.);
    vY = translate + vec3(0., offset, 0.);
	vZ_ = translate - vec3(0., 0., offset);
    vZ = translate + vec3(0., 0., offset);

	vec4 position = vec4(((translate.x + density * translate.z) / (density + 1.)) * ( density * density - 1.) / ( density * density ) - 1. / ( density * density ), translate.y * ( density - 1.) / density - 1. / density, 0., 1.0 );
	position.xyz += vec3(uv.x / (density * density ) * 2. , uv.y / density * 2. , 0.0);
    vTranslate = translate;
	
	gl_Position = projectionMatrix * modelViewMatrix * position;
}
