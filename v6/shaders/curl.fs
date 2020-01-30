#version 300 es

precision highp float;

uniform int uProjectionSize;
uniform sampler2D sVelocity;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, ivec3 pos);
ivec3 vR(ivec3 pos);
ivec3 vL(ivec3 pos);
ivec3 vT(ivec3 pos);
ivec3 vB(ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();

    float L = getData(sVelocity, vL(pos)).y;
    float R = getData(sVelocity, vR(pos)).y;
    float T = getData(sVelocity, vT(pos)).x;
    float B = getData(sVelocity, vB(pos)).x;
    float vorticity = R - L - T + B;

    out_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
