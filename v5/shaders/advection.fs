#version 300 es

precision highp float;
precision highp sampler3D;

uniform sampler3D sVelocity;
uniform sampler3D sSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;

uniform float uZ;
uniform sampler3D sBuffer;
    
in vec3 vPosition;

in vec2 vUv;

out vec4 out_FragColor;
    
void main() {
    vec2 coord = vUv - dt * texture(sVelocity, vec3(vUv, uZ)).xy * texelSize;
    vec4 result = texture(sSource, vec3(coord, uZ));
    float decay = 1.0 + dissipation * dt;

    out_FragColor = result / decay;
}