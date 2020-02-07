#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sVelocity;
uniform int uVelocitySize;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, int cubeSize, ivec3 pos);
ivec3 vR(ivec3 pos);
ivec3 vL(ivec3 pos);
ivec3 vT(ivec3 pos);
ivec3 vB(ivec3 pos);
ivec3 vUv(ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();

    float L = getData(sVelocity, uVelocitySize, vL(pos)).x;
    float R = getData(sVelocity, uVelocitySize, vR(pos)).x;
    float T = getData(sVelocity, uVelocitySize, vT(pos)).y;
    float B = getData(sVelocity, uVelocitySize, vB(pos)).y;

    vec2 C = getData(sVelocity, uVelocitySize, vUv(pos)).xy;
    if (vL(pos).x < 0) { L = -C.x; }
    if (vR(pos).x > uCubeSize - 1) { R = -C.x; }
    if (vT(pos).y > uCubeSize - 1) { T = -C.y; }
    if (vB(pos).y < 0) { B = -C.y; }
    
    float div = 0.5 * (R - L + T - B);
    out_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
