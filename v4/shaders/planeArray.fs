#version 300 es

precision highp float;
precision highp sampler2DArray;

uniform sampler2DArray sBuffer;
uniform float uDensity;

in vec3 vPosition;

out vec4 out_FragColor;
    
void main() {
    vec4 data = texture(sBuffer, vec3(vPosition.xy, vPosition.z * uDensity));

    /*if (sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y) > 1.) {
        discard;
    }*/

    out_FragColor = vec4(data);
}
