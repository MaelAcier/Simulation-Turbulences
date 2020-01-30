
#ifndef VOLUME
ivec3 getCurrentPosition() {
    uint cubeSize = uint(uProjectionSize * uProjectionSize);
    uvec2 src2D = uvec2(gl_FragCoord.xy);
    return ivec3(
        src2D.x % cubeSize,
        src2D.y % cubeSize,
        src2D.x / cubeSize + (src2D.y / cubeSize) * uint(uProjectionSize));
}

uvec3 clampVector(ivec3 pos, uint maxVal) {
    return uvec3(clamp(pos.x, 0, int(maxVal)), clamp(pos.y, 0, int(maxVal)), clamp(pos.z, 0, int(maxVal)));
}

vec4 getData(sampler2D texture, ivec3 pos) {
    int texture_size = textureSize(texture, 0).x;
    uint projectionSize = uint(pow(abs(float(texture_size)),1./3.));
    uint cubeSize = projectionSize * projectionSize;
    pos = ivec3(vec3(pos) * float(projectionSize * projectionSize) / float(uProjectionSize * uProjectionSize));
    uvec3 position = clampVector(pos, cubeSize);
    ivec2 src2D = ivec2(
      position.x + (position.z % projectionSize) * cubeSize,
      position.y + (position.z / projectionSize) * cubeSize);
    return texelFetch(texture, src2D, 0);
}

ivec3 vR(ivec3 pos) { return ivec3(pos.x + 1, pos.y, 0); }
ivec3 vL(ivec3 pos) { return ivec3(pos.x - 1, pos.y, 0); }
ivec3 vT(ivec3 pos) { return ivec3(pos.x, pos.y + 1, 0); }
ivec3 vB(ivec3 pos) { return ivec3(pos.x, pos.y - 1, 0); }

#endif