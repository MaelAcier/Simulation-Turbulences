#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sBuffer;
    
in vec3 vPosition;

out vec4 out_FragColor;
    
void main() {
    vec4 data = texture(sBuffer, vec3(vPosition.xy, uZ));

    out_FragColor = vec4(data);
}