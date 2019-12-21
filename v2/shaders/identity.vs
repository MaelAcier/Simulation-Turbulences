precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float density;
attribute vec2 uv;
attribute vec3 translate;
varying vec3 vTranslate;

void main() {
	vec4 position = vec4(((translate.x + density * translate.z) / (density + 1.)) * ( density * density - 1.) / ( density * density ) - 1. / ( density * density ), translate.y * ( density - 1.) / density - 1. / density, 0., 1.0 );
	position.xyz += vec3(uv.x / (density * density ) * 2. , uv.y / density * 2. , 0.0);
    vTranslate = translate;
	gl_Position = projectionMatrix * modelViewMatrix * position;
}
