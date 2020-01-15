const vertexShader = `#version 300 es

precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;

out vec3 vPosition;

void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, 0., 1. );
}
`

const fragmentShader = `#version 300 es

precision highp float;
precision highp sampler3D;

uniform float uZ;
uniform sampler3D sBuffer;
    
in vec3 vPosition;

out vec4 out_FragColor;
    
void main() {
    vec4 data = texture(sBuffer, vec3(vPosition.xy, uZ));

    // perform some calculations on data

    out_FragColor = vec4(data);
}`

export const cameras = {
    perspective: new THREE.PerspectiveCamera(50, aspect, 0.1, 50000),
    texture: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)
}

const uniforms = {
    uZ: { value: 0.0 },
    sBuffer: { value: null }
}

const material = new THREE.RawShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true
  })
material.visible = false

class Buffer {
    constructor (size) {
        this.size = size
        this.texture3D = new THREE.DataTexture3D(new Float32Array(size ** 3 * 4), size, size, size)
    }
}

const buffers = {
    sin: new Buffer(64),
    display: new Buffer(32)
    // a lot more
  }

function computeStep ({ material, bufferOutput, setup }) {
    materials.visible = true

    setup(materials.uniforms)

    const size = buffers[bufferOutput].size
    const texture2D = new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType })
    const planeSize = (size ** 2 * 4)
    const pixelBuffers = Array.from(Array(size), () => new Float32Array(planeSize))
    
    const data = new Float32Array(planeSize * size)
    for (let i = 0; i < size; i++) {
        materials[material].uniforms.uZ.value = i / size

        renderer.setRenderTarget(texture2D)
        renderer.render(scene, cameras.texture)
  
        renderer.readRenderTargetPixels(texture2D, 0, 0, size, size, pixelBuffers[i]) // THE SLOW PART
        data.set(pixelBuffers[i], i * planeSize)
    }
  
    const texture3D = new THREE.DataTexture3D(data, size, size, size)
    texture3D.format = THREE.RGBAFormat
    texture3D.type = THREE.FloatType
    texture3D.unpackAlignment = 1
    buffers[bufferOutput].texture3D = texture3D
  
    materials[material].visible = false
}

computeStep({
    material: material,
    bufferOutput: 'display',
    setup: (uniforms) => {
        uniforms.sBuffer.value = buffers.sin.texture3D // Previous calculation
    }
})

/**
 * Display step using perspective camera and some
 * algorithms to render the volume in 3D.
 * The problem isn't here.
 */
