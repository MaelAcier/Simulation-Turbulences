#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
    
in vec3 vPosition;

in vec2 vUv;

out vec4 out_FragColor;
    
void main() {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture(sTarget, vec3(vUv, uZ)).xyz;

    out_FragColor = vec4(base + splat, 1.0);
}
