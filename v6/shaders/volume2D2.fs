#version 300 es

precision highp float;

uniform sampler2D sBuffer;

in vec3 vPosition;

out vec4 out_FragColor;

uvec3 clampVector(ivec3 pos, uint maxVal) {
    return uvec3(clamp(pos.x, 0, int(maxVal)), clamp(pos.y, 0, int(maxVal)), clamp(pos.z, 0, int(maxVal)));
}

vec4 getData(sampler2D texture, vec3 pos) {
    int texture_size = textureSize(texture, 0).x;
    uint projectionSize = uint(pow(float(texture_size),1./3.));
    uint cubeSize = projectionSize * projectionSize;
    uvec3 position = clampVector(ivec3(pos * float(cubeSize)), cubeSize);
    ivec2 src2D = ivec2(
      position.x + (position.z % projectionSize) * cubeSize,
      position.y + (position.z / projectionSize) * cubeSize);
    return texelFetch(texture, src2D, 0);
}
    
void main() {
    vec4 data = getData(sBuffer, vPosition);

    out_FragColor = vec4(data);
}
