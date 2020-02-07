#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sPressure;
uniform int uPressureSize;
uniform float uPressure;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, int cubeSize, ivec3 pos);
ivec3 vUv(ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();

    out_FragColor = uPressure * getData(sPressure, uPressureSize, vUv(pos));
}
