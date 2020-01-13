#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sVelocity;
uniform sampler3D sCurl;
uniform float curl;
uniform float dt;
    
in vec3 vPosition;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 out_FragColor;
    
void main() {
    float L = texture(sCurl, vec3(vL, uZ)).x;
    float R = texture(sCurl, vec3(vR, uZ)).x;
    float T = texture(sCurl, vec3(vT, uZ)).x;
    float B = texture(sCurl, vec3(vB, uZ)).x;
    float C = texture(sCurl, vec3(vUv, uZ)).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    
    vec2 vel = texture(sVelocity, vec3(vUv, uZ)).xy;

    out_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}