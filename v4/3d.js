import * as THREE from './lib/three.module.js';

		import { GUI } from './lib/dat.gui.module.js';
		import { OrbitControls } from './lib/OrbitControls.js';
		import { NRRDLoader } from './lib/NRRDLoader.js';
		import { VolumeRenderShader1 } from './lib/VolumeShader.js';
		import { WEBGL } from './lib/WebGL.js';

		if (WEBGL.isWebGL2Available() === false) {

			document.body.appendChild(WEBGL.getWebGL2ErrorMessage());

		}

		var renderer,
			scene,
			camera,
			controls,
			material,
			volconfig,
			cmtextures;

		init();

		function init() {

			scene = new THREE.Scene();

			// Create renderer
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('webgl2', { alpha: false, antialias: false });
			renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			// Create camera (The volume renderer does not work very well with perspective yet)
			var h = 512; // frustum height
			var aspect = window.innerWidth / window.innerHeight;
			camera = new THREE.OrthographicCamera(- h * aspect / 2, h * aspect / 2, h / 2, - h / 2, 1, 1000);
			camera.position.set(0, 0, 128);
			camera.up.set(0, 0, 1); // In our data, z is up

			// Create controls
			controls = new OrbitControls(camera, renderer.domElement);
			controls.addEventListener('change', render);
			controls.target.set(64, 64, 128);
			controls.minZoom = 0.5;
			controls.maxZoom = 4;
			controls.update();

			// scene.add( new AxesHelper( 128 ) );

			// Lighting is baked into the shader a.t.m.
			// var dirLight = new DirectionalLight( 0xffffff );

			// The gui for interaction
			volconfig = { clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.15, colormap: 'viridis' };
			var gui = new GUI();
			gui.add(volconfig, 'clim1', 0, 1, 0.01).onChange(updateUniforms);
			gui.add(volconfig, 'clim2', 0, 1, 0.01).onChange(updateUniforms);
			gui.add(volconfig, 'colormap', { gray: 'gray', viridis: 'viridis' }).onChange(updateUniforms);
			gui.add(volconfig, 'renderstyle', { mip: 'mip', iso: 'iso' }).onChange(updateUniforms);
			gui.add(volconfig, 'isothreshold', 0, 1, 0.01).onChange(updateUniforms);

			// Load the data ...
			new NRRDLoader().load("./stent.nrrd", function (volume) {

				// Texture to hold the volume. We have scalars, so we put our data in the red channel.
				// THREEJS will select R32F (33326) based on the THREE.RedFormat and THREE.FloatType.
				// Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
				// TODO: look the dtype up in the volume metadata
				console.log(volume.data)

				/* let size = 128
				let gradient = new Float32Array(size ** 3 * 3)

				let i = 0
				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						for (let z = 0; z < size; z++) {
							gradient[x * (size ** 2) + y * size + z] = Math.abs(Math.sin(x))
							gradient[x * (size ** 2) + y * size + z + 1] = Math.abs(Math.sin(y))
							gradient[x * (size ** 2) + y * size + z + 2] = Math.abs(Math.sin(z))
						}
					}
				} */


				var texture = new THREE.DataTexture3D(volume.data, volume.xLength, volume.yLength, volume.zLength);
				// var texture = new THREE.DataTexture3D(gradient, size, size, size);
				texture.format = THREE.RGBAFormat;
				texture.format = THREE.RedFormat;
				texture.type = THREE.FloatType;
				texture.minFilter = texture.magFilter = THREE.LinearFilter;
				texture.unpackAlignment = 1;

				// Colormap textures
				cmtextures = {
					viridis: new THREE.TextureLoader().load('./cm_viridis.png', render),
					gray: new THREE.TextureLoader().load('./cm_gray.png', render)
				};

				// Material
				var shader = VolumeRenderShader1;

				var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

				uniforms["u_data"].value = texture;
				uniforms["u_size"].value.set(volume.xLength, volume.yLength, volume.zLength);
				uniforms["u_clim"].value.set(volconfig.clim1, volconfig.clim2);
				uniforms["u_renderstyle"].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
				uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
				uniforms["u_cmdata"].value = cmtextures[volconfig.colormap];

				material = new THREE.ShaderMaterial({
					uniforms: uniforms,
					vertexShader: shader.vertexShader,
					fragmentShader: shader.fragmentShader,
					side: THREE.BackSide // The volume shader uses the backface as its "reference point"
				});

				// THREE.Mesh
				var geometry = new THREE.BoxBufferGeometry(volume.xLength, volume.yLength, volume.zLength);
				geometry.translate(volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5);

				var mesh = new THREE.Mesh(geometry, material);
				scene.add(mesh);

				render();

			});

			window.addEventListener('resize', onWindowResize, false);

		}

		function updateUniforms() {

			material.uniforms["u_clim"].value.set(volconfig.clim1, volconfig.clim2);
			material.uniforms["u_renderstyle"].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
			material.uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
			material.uniforms["u_cmdata"].value = cmtextures[volconfig.colormap];

			render();

		}

		function onWindowResize() {

			renderer.setSize(window.innerWidth, window.innerHeight);

			var aspect = window.innerWidth / window.innerHeight;

			var frustumHeight = camera.top - camera.bottom;

			camera.left = - frustumHeight * aspect / 2;
			camera.right = frustumHeight * aspect / 2;

			camera.updateProjectionMatrix();

			render();

		}

		function render() {

			renderer.render(scene, camera);

		}