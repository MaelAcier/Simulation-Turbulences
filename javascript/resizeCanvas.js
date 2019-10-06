console.log('resizeCanvas.js called')

export default function resizeCanvas (canvas) {
  const width = scaleByPixelRatio(canvas.clientWidth)
  const height = scaleByPixelRatio(canvas.clientHeight)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

function scaleByPixelRatio (input) {
  var pixelRatio = window.devicePixelRatio || 1
  return Math.floor(input * pixelRatio)
}
