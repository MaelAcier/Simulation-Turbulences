#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sTexture;
uniform vec2 ditherScale;
uniform vec2 texelSize;
    
in vec3 vPosition;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 out_FragColor;
    
void main() {
    vec3 c = texture(sTexture, vec3(vUv, uZ)).rgb;
    float a = max(c.r, max(c.g, c.b));

    out_FragColor = vec4(c, a);
}