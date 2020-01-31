
#ifndef VOLUME
uvec3 clampVector(ivec3 pos, uint maxVal) {
    return uvec3(clamp(pos.x, 0, int(maxVal)), clamp(pos.y, 0, int(maxVal)), clamp(pos.z, 0, int(maxVal)));
}

ivec3 getCurrentPosition() {
    uint cubeSize = uint(uCubeSize);
    uint column = uint(ceil(sqrt(float(cubeSize))));
    uvec2 src2D = uvec2(gl_FragCoord.xy);
    ivec3 pos = ivec3(
        src2D.x % cubeSize,
        src2D.y % cubeSize,
        src2D.x / cubeSize + (src2D.y / cubeSize) * column);
    int cubeSizei = int(cubeSize);
    if (pos.x < 0 || pos.x > cubeSizei - 1) { discard; }
    if (pos.y < 0 || pos.y > cubeSizei - 1) { discard; }
    if (pos.z < 0 || pos.z > cubeSizei - 1) { discard; }
    return pos;
}

vec4 getData(sampler2D texture, int cubeSize, ivec3 pos) {
    uint cubeSizeu = uint(cubeSize);
    uint column = uint(ceil(sqrt(float(cubeSizeu))));
    pos = ivec3(vec3(pos) * float(cubeSizeu) / float(uCubeSize));
    uvec3 position = clampVector(pos, cubeSizeu);
    ivec2 src2D = ivec2(
      position.x + (position.z % column) * cubeSizeu,
      position.y + (position.z / column) * cubeSizeu);
    return texelFetch(texture, src2D, 0);
}

ivec3 vR(ivec3 pos) { return ivec3(pos.x + 1, pos.y, 0); }
ivec3 vL(ivec3 pos) { return ivec3(pos.x - 1, pos.y, 0); }
ivec3 vT(ivec3 pos) { return ivec3(pos.x, pos.y + 1, 0); }
ivec3 vB(ivec3 pos) { return ivec3(pos.x, pos.y - 1, 0); }

#endif