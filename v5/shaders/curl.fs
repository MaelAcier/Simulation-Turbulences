#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sVelocity;
    
in vec3 vPosition;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 out_FragColor;
    
void main() {
    float L = texture(sVelocity, vec3(vL, uZ)).y;
    float R = texture(sVelocity, vec3(vR, uZ)).y;
    float T = texture(sVelocity, vec3(vT, uZ)).x;
    float B = texture(sVelocity, vec3(vB, uZ)).x;
    float vorticity = R - L - T + B;

    out_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
