#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sTexture;
uniform float value;
    
in vec3 vPosition;

in vec2 vUv;

out vec4 out_FragColor;
    
void main() {
    out_FragColor = value * texture(sTexture, vec3(vUv, uZ));
}