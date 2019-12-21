precision highp float;
uniform float density;
uniform sampler2D map;
uniform sampler2D textureMap;
varying float vScale;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
	vec4 circleColor = texture2D( map, vUv );
	vec4 data = texture2D( textureMap, vec2((vPosition.x / density * ((density - 1.) / density) + vPosition.z * ((density - 1.) / density) + 1.) / 2., (vPosition.y * ((density - 1.) / density) + 1.) / 2.));
	if ( circleColor.w < 0.5 ) discard;
	gl_FragColor = vec4( circleColor.xyz * data.xyz, circleColor.w );
}