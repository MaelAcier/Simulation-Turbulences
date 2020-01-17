#version 300 es

precision highp float;

uniform int projectionSize;
uniform sampler2D sBuffer;

out vec4 out_FragColor;

uvec3 getCurrentPosition() {
    uint cubeSize = uint(projectionSize * projectionSize);
    uvec2 src2D = uvec2(gl_FragCoord.xy);
    return uvec3(
        src2D.x % cubeSize,
        src2D.y % cubeSize,
        src2D.x / cubeSize + (src2D.y / cubeSize) * uint(projectionSize));
}

vec4 getData(sampler2D texture, uvec3 position) {
    int textureLength = textureSize(texture, 0).x;
    uint projectionSize = uint(pow(float(textureLength),2./3.));
    uint cubeSize = projectionSize * projectionSize;
    ivec2 src2D = ivec2(
      position.x + (position.z % projectionSize) * cubeSize,
      position.y + (position.z / projectionSize) * cubeSize);
    return texelFetch(texture, src2D, 0);
} 
    
void main() {
    vec4 data = getData(sBuffer, getCurrentPosition());

    out_FragColor = data;
    // out_FragColor = texelFetch(sBuffer, ivec2(gl_FragCoord.xy), 0);
}