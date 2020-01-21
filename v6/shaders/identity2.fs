#version 300 es

precision highp float;

uniform int uProjectionSize;
uniform sampler2D sBuffer;

out vec4 out_FragColor;

uvec3 getCurrentPosition(sampler2D texture) {
    int texture_size = textureSize(texture, 0).x;
    uint projectionSize = uint(pow(float(texture_size),2./3.));
    uint cubeSize = uint(projectionSize * projectionSize);
    uvec2 src2D = uvec2(gl_FragCoord.xy);
    return uvec3(
        src2D.x % cubeSize,
        src2D.y % cubeSize,
        src2D.x / cubeSize + (src2D.y / cubeSize) * uint(projectionSize));
}

vec4 getData(sampler2D texture, uvec3 position) {
    uint cubeSize = uint(uProjectionSize * uProjectionSize);
    ivec2 src2D = ivec2(
      position.x + (position.z % uint(uProjectionSize)) * cubeSize,
      position.y + (position.z / uint(uProjectionSize)) * cubeSize);
    return texelFetch(texture, src2D, 0);
}
    
void main() {
    uvec3 pos = getCurrentPosition(sBuffer);
    vec4 data = getData(sBuffer, pos/uint(1));

    out_FragColor = data;
    // out_FragColor = vec4(getCurrentPosition(sBuffer),uProjectionSize) / float(uProjectionSize * uProjectionSize * uProjectionSize * uProjectionSize);
}