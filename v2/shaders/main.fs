precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 position;
varying float vScale;
uniform sampler2D textureMap;
// HSL to RGB Convertion helpers
void main() {
	vec4 circleColor = texture2D( map, vUv );
	vec4 data = texture2D( textureMap, vec2(position.x, (position.y + 40.0 * position.z)/40.));
	if ( circleColor.w < 0.5 ) discard;
	gl_FragColor = vec4( circleColor.xyz * data.xyz, circleColor.w );
}