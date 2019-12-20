import { Texture, Pipeline } from './renderClass.js'
import { config, controls } from './data.js'

export const textures = {
  1: new Texture(config.density)
}

export const renderingPipeline = new Pipeline()

let time = 0

renderingPipeline.addExtraStep(() => {
  if (!config.pause) {
    time += 0.005
  }
})

renderingPipeline.addStep({
  material: 'sin',
  textureID: 1,
  fun: (material) => {
    material.uniforms.time.value = time
    material.uniforms.density.value = config.density
    material.uniforms.aspect.value = window.innerWidth / window.innerHeight
  }
})
/* renderingPipeline.addStep({
  material: 'test',
  textureID: 1,
  fun: (material) => {
    material.uniforms.density.value = config.density
    material.uniforms.aspect.value = window.innerWidth / window.innerHeight
  }
}) */

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
