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
    float L = texture(sVelocity, vec3(vL, uZ)).x;
    float R = texture(sVelocity, vec3(vR, uZ)).x;
    float T = texture(sVelocity, vec3(vT, uZ)).y;
    float B = texture(sVelocity, vec3(vB, uZ)).y;
    vec2 C = texture(sVelocity, vec3(vUv, uZ)).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    
    float div = 0.5 * (R - L + T - B);

    out_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
