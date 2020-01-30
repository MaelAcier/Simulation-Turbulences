#version 300 es

precision highp float;

uniform int uProjectionSize;
uniform sampler2D sData;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();
    vec4 data = getData(sData, pos);

    out_FragColor = data;
}
