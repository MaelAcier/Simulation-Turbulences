#version 300 es

precision highp float;
precision mediump sampler3D;

uniform vec3 u_size;
uniform int u_renderstyle;
uniform float u_renderthreshold;
uniform vec2 u_clim;
uniform sampler3D u_data;
uniform sampler2D u_cmdata;

in vec3 v_position;
in vec4 v_nearpos;
in vec4 v_farpos;

out vec4 out_FragColor;

// The maximum distance through our rendering volume is sqrt(3).
// const int MAX_STEPS = 887;
const int REFINEMENT_STEPS = 4;
const float relative_step_size = 1.0;
const vec4 ambient_color = vec4(0.2, 0.4, 0.2, 1.0);
const vec4 diffuse_color = vec4(0.8, 0.2, 0.2, 1.0);
const vec4 specular_color = vec4(1.0, 1.0, 1.0, 1.0);
const float shininess = 40.0;

void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);
void cast_iso(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);
float sample1(vec3 texcoords);
vec4 apply_colormap(float val);
vec4 add_lighting(float val, vec3 loc, vec3 step, vec3 view_ray);

void main() {
	// Normalize clipping plane info
	vec3 farpos = v_farpos.xyz / v_farpos.w;
	vec3 nearpos = v_nearpos.xyz / v_nearpos.w;

	// Calculate unit vector pointing in the view direction through this fragment.
	vec3 view_ray = normalize(nearpos.xyz - farpos.xyz);

	// Compute the (negative) distance to the front surface or near clipping plane.
	// v_position is the back face of the cuboid, so the initial distance calculated in the dot
	// product below is the distance from near clip plane to the back of the cuboid
	float distance = dot(nearpos - v_position, view_ray);
	distance = max(distance, min((-0.5 - v_position.x) / view_ray.x,
		(u_size.x - 0.5 - v_position.x) / view_ray.x));
	distance = max(distance, min((-0.5 - v_position.y) / view_ray.y,
		(u_size.y - 0.5 - v_position.y) / view_ray.y));
	distance = max(distance, min((-0.5 - v_position.z) / view_ray.z,
		(u_size.z - 0.5 - v_position.z) / view_ray.z));
	
	// Now we have the starting position on the front surface
	vec3 front = v_position + view_ray * distance;

	// Decide how many steps to take
	int nsteps = int(-distance / relative_step_size + 0.5);
	if ( nsteps < 1 )
		discard;

	// Get starting location and step vector in texture coordinates
	vec3 step = ((v_position - front) / u_size) / float(nsteps);
	vec3 start_loc = front / u_size;

	// For testing: show the number of steps. This helps to establish
	// whether the rays are correctly oriented
	/* out_FragColor = vec4(0.0, float(nsteps) / 1.0 / u_size.x, 1.0, 1.0);
	return; */
	cast_mip(start_loc, step, nsteps, view_ray);
	if (out_FragColor.a < 0.05)
		discard;
}

vec4 apply_colormap(float val) {
	val = (val - u_clim[0]) / (u_clim[1] - u_clim[0]);
	return texture(u_cmdata, vec2(val, 0.5));
}

float sample1(vec3 texcoords) {
	/* Sample float value from a 3D texture. Assumes intensity data. */
	return texture(u_data, texcoords.xyz).a;
}

void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {
	float max_val = -1e6;
	int max_i = 100;
	vec3 loc = start_loc;
	vec4 color = vec4(0.);
	float attenuation = pow(abs(u_size.x), 1./3.);

	// Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
	// non-constant expression. So we use a hard-coded max, and an additional condition
	// inside the loop.
	if (nsteps % 2 != 0)
		nsteps += 1;
	
	int MAX_STEPS = int(pow(u_size.x, 3.));

	for (int iter=0; iter<MAX_STEPS; iter++) {
		if (iter >= nsteps)
			break;
		
		vec4 data = texture(u_data, loc);
		float transmittance = pow(abs((1. - color.a) * data.a), attenuation);
		color += vec4(data.rgb * transmittance, transmittance);
		
		// Advance location deeper into the volume
		loc += step;
	}

	// Resolve final color
	out_FragColor = color;
}
