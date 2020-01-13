#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sPressure;
uniform sampler3D sVelocity;
    
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
    vec2 velocity = texture(sVelocity, vec3(vUv, uZ)).xy;
    velocity.xy -= vec2(R - L, T - B);

    out_FragColor = vec4(velocity, 0.0, 1.0);
}