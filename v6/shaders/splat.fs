#version 300 es

precision highp float;

uniform int uProjectionSize;
uniform sampler2D sTarget;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;

out vec4 out_FragColor;

ivec3 getCurrentPosition();
uvec3 clampVector(ivec3 pos, uint maxVal);
vec4 getData(sampler2D texture, ivec3 pos);
    
void main() {
    ivec2 pos = getCurrentPosition().xy;

    vec2 p = vec2(pos) / pow(abs(float(uProjectionSize)),2./3.) - uPoint;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base =  getData(sTarget, ivec3(pos, 0)).xyz;

    out_FragColor = vec4(base + splat, 1.0);
}
