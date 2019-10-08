/* global XMLHttpRequest */

export const shaders = {}

export function loadShaders (gl, path, names) {
  return new Promise((resolve) => {
    const queue = names.map(name => path + '/' + name)
    const content = {}
    let filesRemaining = queue.length

    const fileLoaded = function (file, text) {
      const name = file.split('.')[0]
      const extension = file.split('.')[1]
      content[name] = {
        text: text,
        extension: extension
      }
      filesRemaining--
      if (filesRemaining === 0) {
        compileShaders(gl, content)
        resolve()
      }
    }

    for (var i = 0; i < queue.length; i++) {
      loadFile(queue[i], names[i], fileLoaded)
    }
  })
}

export function loadFile (file, name, callback) {
  const request = new XMLHttpRequest()
  request.onload = function () {
    if (request.status === 200) {
      callback(name, request.responseText)
    } else {
      console.log(`Erreur avec le fichier ${file}, erreur ${request.status}`)
    }
  }
  request.open('GET', file, true)
  request.send()
}

function compileShaders (gl, list) {
  for (const shader in list) {
    if (list[shader].extension === 'fs') {
      shaders[shader] = compileShader(gl, gl.FRAGMENT_SHADER, list[shader].text)
    } else if (list[shader].extension === 'vs') {
      shaders[shader] = compileShader(gl, gl.VERTEX_SHADER, list[shader].text)
    } else {
      console.log(`Mauvaise extension avec ${shader}: ${shader.extension}`)
    }
  }
}

export function compileShader (gl, shaderType, source, keywords) {
  source = addKeywords(source, keywords)

  // Create the shader object
  const shader = gl.createShader(shaderType)

  // Load the shader source
  gl.shaderSource(shader, source)

  // Compile the shader
  gl.compileShader(shader)

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled && !gl.isContextLost()) {
    // Something went wrong during compilation; get the error
    var error = gl.getShaderInfoLog(shader)
    console.log("*** Erreur en compilant le shader '" + source + "':" + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function addKeywords (source, keywords) {
  if (keywords == null) { return source }
  let keywordsString = ''
  keywords.forEach(function (keyword) {
    keywordsString += '#define ' + keyword + '\n'
  })
  return keywordsString + source
}
