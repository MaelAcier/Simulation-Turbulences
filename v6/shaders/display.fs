#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sDye;
uniform int uDyeSize;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, int cubeSize, ivec3 pos);
ivec3 vUv(ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();
    vec3 c = getData(sDye, uDyeSize, vUv(pos)).rgb;

    float a = max(c.r, max(c.g, c.b));
    out_FragColor = vec4(c, exp(-abs(a)));
}
