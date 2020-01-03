precision highp float;

uniform float uTime;
    
varying vec3 vPosition;
    
// HSL to RGB Convertion helpers
vec3 HUEtoRGB(float H){
    H = mod(H,1.0);
    float R = abs(H * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);
    return clamp(vec3(R,G,B),0.0,1.0);
}
    
vec3 HSLtoRGB(vec3 HSL){
    vec3 RGB = HUEtoRGB(HSL.x);
    float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
    return (RGB - 0.5) * C + HSL.z;
}
    
void main() {
    vec3 trTime = vec3(vPosition.x + uTime, vPosition.y + uTime, vPosition.z + uTime);
    float color = sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );

    /*if (sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y) > 1.) {
        discard;
    }*/
    gl_FragColor = vec4( HSLtoRGB(vec3(color/5.0, 1.0, 0.5)), 1. );
}
