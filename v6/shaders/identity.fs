#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sData;
uniform int uDataSize;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, int cubeSize, ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();
    vec4 data = getData(sData, uDataSize, pos);

    out_FragColor = data;
}
