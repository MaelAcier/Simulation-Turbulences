#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sVelocity;
uniform int uVelocitySize;
uniform sampler2D sSource;
uniform int uSourceSize;
uniform float uDt;
uniform float uDissipation;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, int cubeSize, ivec3 pos);
ivec3 vUv(ivec3 pos);
    
void main() {
    ivec3 pos = getCurrentPosition();

    vec2 coord = vec2(pos.xy) - uDt * getData(sVelocity, uVelocitySize, vUv(pos)).xy;
    vec4 result = getData(sSource, uSourceSize, ivec3(coord, 0));

    float decay = 1.0 + uDissipation * uDt;

    out_FragColor = result / decay;
}
