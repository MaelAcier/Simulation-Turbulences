#version 300 es

precision highp float;

uniform int uCubeSize;
uniform sampler2D sVelocity;
uniform int uVelocitySize;
uniform sampler2D sCurl;
uniform int uCurlSize;
uniform float uCurl;
uniform float uDt;

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

    float L = getData(sCurl, uCurlSize, vL(pos)).x;
    float R = getData(sCurl, uCurlSize, vR(pos)).x;
    float T = getData(sCurl, uCurlSize, vT(pos)).x;
    float B = getData(sCurl, uCurlSize, vB(pos)).x;
    float C = getData(sCurl, uCurlSize, vUv(pos)).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= uCurl * C;
    force.y *= -1.0;
    
    vec2 vel = getData(sVelocity, uVelocitySize, vUv(pos)).xy;
    out_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
