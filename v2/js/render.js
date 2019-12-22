import { Texture, Pipeline } from './renderClass.js'
import { config, controls } from './data.js'

export const textures = {
  1: new Texture(),
  2: new Texture(),
  dye: new Texture(),
  velocity: new Texture(),
  divergence: new Texture(),
  curl: new Texture(),
  pressure: new Texture(),
  bloom: new Texture(),
  bloomFramebuffers: new Texture(),
  sunrays: new Texture(),
  sunraysTemp: new Texture()
}

export const renderingPipeline = new Pipeline()

let time = 0

// material.uniforms.aspect.value = window.innerWidth / window.innerHeight

renderingPipeline.addExtraStep(() => {
  if (!config.pause) {
    time += 0.005
  }
})

renderingPipeline.addStep({
  material: 'test',
  textureID: 2,
  fun: (material) => {
    material.uniforms.density.value = config.density
  }
})

renderingPipeline.addStep({
  material: 'sin',
  textureID: 1,
  fun: (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
  }
})

renderingPipeline.addStep({
  material: 'identity',
  textureID: 1,
  fun: (material) => {
    material.uniforms.density.value = config.density
    material.uniforms.textureMap.value = textures[1].currentTexture.texture
  }
})

renderingPipeline.addStep({
  material: 'cube',
  textureID: 1,
  fun: (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
    material.uniforms.textureMap.value = textures[1].currentTexture.texture
  }
})

renderingPipeline.addExtraStep(() => {
  if (config.autoRotation) {
    controls.perspective.update()
  }
})
