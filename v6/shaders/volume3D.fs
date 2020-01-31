#version 300 es

precision highp float;

uniform sampler2D sData;
uniform int uDataSize;

in vec3 v_position;
in vec4 v_nearpos;
in vec4 v_farpos;

out vec4 out_FragColor;

#define VOLUME

// The maximum distance through our rendering volume is sqrt(3).
// const int MAX_STEPS = 887;
const int REFINEMENT_STEPS = 4;
const float relative_step_size = 1.0;
const vec4 ambient_color = vec4(0.2, 0.4, 0.2, 1.0);
const vec4 diffuse_color = vec4(0.8, 0.2, 0.2, 1.0);
const vec4 specular_color = vec4(1.0, 1.0, 1.0, 1.0);
const float shininess = 40.0;

void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);
vec4 getData(sampler2D texture, vec3 pos);
uvec3 clampVector(ivec3 pos, uint maxVal);

void main() {
	int texture_size = textureSize(sData, 0).x;
    float projectionSize = pow(abs(float(texture_size)),1./3.);
    float u_size = projectionSize * projectionSize;
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
		(u_size - 0.5 - v_position.x) / view_ray.x));
	distance = max(distance, min((-0.5 - v_position.y) / view_ray.y,
		(u_size - 0.5 - v_position.y) / view_ray.y));
	distance = max(distance, min((-0.5 - v_position.z) / view_ray.z,
		(u_size - 0.5 - v_position.z) / view_ray.z));
	
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

vec4 getData(sampler2D texture, vec3 pos) {
    int texture_size = textureSize(texture, 0).x;
    uint projectionSize = uint(pow(abs(float(texture_size)),1./3.));
    uint cubeSize = projectionSize * projectionSize;
    uvec3 position = clampVector(ivec3(pos * float(cubeSize)), cubeSize);
    ivec2 src2D = ivec2(
      position.x + (position.z % projectionSize) * cubeSize,
      position.y + (position.z / projectionSize) * cubeSize);
    return texelFetch(texture, src2D, 0);
}

uvec3 clampVector(ivec3 pos, uint maxVal) {
    return uvec3(clamp(pos.x, 0, int(maxVal)), clamp(pos.y, 0, int(maxVal)), clamp(pos.z, 0, int(maxVal)));
}

void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {
	int texture_size = textureSize(sData, 0).x;
    float projectionSize = pow(abs(float(texture_size)),1./3.);
    float u_size = projectionSize * projectionSize;
	float max_val = -1e6;
	int max_i = 100;
	vec3 loc = start_loc;
	vec4 color = vec4(0.);
	float attenuation = pow(abs(u_size), 1./3.);

	// Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
	// non-constant expression. So we use a hard-coded max, and an additional condition
	// inside the loop.
	// if (nsteps % 2 != 0)
	// 	nsteps += 1;
	
	int MAX_STEPS = int(pow(abs(u_size), 3.));

	for (int iter=0; iter<MAX_STEPS; iter++) {
		if (iter >= nsteps || color.a >= 0.7)
			break;
		
		vec4 data = getData(sData, loc);
		float transmittance = pow(abs((1. - color.a) * data.a), attenuation);
		color += vec4(data.rgb * transmittance, transmittance);
		
		// Advance location deeper into the volume
		loc += step;
	}

	// Resolve final color
	out_FragColor = color;
}
