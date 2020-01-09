#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sBuffer;
    
in vec3 vPosition;

out vec4 out_FragColor;
    
void main() {
    // vec4 data = texture(sBuffer, vec3(vPosition.xy, uZ));
    vec3 data = vec3(sin(vPosition.x*10.), sin(vPosition.y*10.), sin(uZ*10.));
    float maxi = max(data.x, max( data.y, data.z));

    out_FragColor = vec4(data, abs(maxi));
}