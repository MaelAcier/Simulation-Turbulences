#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sPressure;
uniform int uPressureSize;
uniform sampler2D sDivergence;
uniform int uDivergenceSize;

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

    float L = getData(sPressure, uPressureSize, vL(pos)).x;
    float R = getData(sPressure, uPressureSize, vR(pos)).x;
    float T = getData(sPressure, uPressureSize, vT(pos)).x;
    float B = getData(sPressure, uPressureSize, vB(pos)).x;
    float C = getData(sPressure, uPressureSize, vUv(pos)).x;
    float divergence = getData(sDivergence, uDivergenceSize, vUv(pos)).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    out_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
