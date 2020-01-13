#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sPressure;
uniform sampler3D sDivergence;
    
in vec3 vPosition;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 out_FragColor;
    
void main() {
    float L = texture(sPressure, vec3(vL, uZ)).x;
    float R = texture(sPressure, vec3(vR, uZ)).x;
    float T = texture(sPressure, vec3(vT, uZ)).x;
    float B = texture(sPressure, vec3(vB, uZ)).x;
    float C = texture(sPressure, vec3(vUv, uZ)).x;
    float divergence = texture(sDivergence, vec3(vUv, uZ)).x;
    float pressure = (L + R + B + T - divergence) * 0.25;

    out_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}