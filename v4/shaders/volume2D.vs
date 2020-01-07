#version 300 es

precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;

out vec3 vPosition;

void main() {
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
