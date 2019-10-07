import { pointers, PointerPrototype } from './update.js'
import { splatStack, config } from './GUI.js'
import { updatePointerDownData, updatePointerMoveData, updatePointerUpData } from './pointers.js'

export default function initEvents (canvas) {
  canvas.addEventListener('mousedown', function (e) {
    var posX = scaleByPixelRatio(e.offsetX)
    var posY = scaleByPixelRatio(e.offsetY)
    var pointer = pointers.find(function (p) { return p.id === -1 })
    if (pointer == null) { pointer = new PointerPrototype() }
    updatePointerDownData(canvas, pointer, -1, posX, posY)
  })

  canvas.addEventListener('mousemove', function (e) {
    var pointer = pointers[0]
    if (!pointer.down) { return }
    var posX = scaleByPixelRatio(e.offsetX)
    var posY = scaleByPixelRatio(e.offsetY)
    updatePointerMoveData(canvas, pointer, posX, posY)
  })

  window.addEventListener('mouseup', function () {
    updatePointerUpData(pointers[0])
  })

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault()
    var touches = e.targetTouches
    while (touches.length >= pointers.length) { pointers.push(new PointerPrototype()) }
    for (var i = 0; i < touches.length; i++) {
      var posX = scaleByPixelRatio(touches[i].pageX)
      var posY = scaleByPixelRatio(touches[i].pageY)
      updatePointerDownData(canvas, pointers[i + 1], touches[i].identifier, posX, posY)
    }
  })

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault()
    var touches = e.targetTouches
    for (var i = 0; i < touches.length; i++) {
      var pointer = pointers[i + 1]
      if (!pointer.down) { continue }
      var posX = scaleByPixelRatio(touches[i].pageX)
      var posY = scaleByPixelRatio(touches[i].pageY)
      updatePointerMoveData(canvas, pointer, posX, posY)
    }
  }, false)

  window.addEventListener('touchend', function (e) {
    var touches = e.changedTouches
    var loop = function (i) {
      var pointer = pointers.find(function (p) { return p.id === touches[i].identifier })
      if (pointer == null) { return }
      updatePointerUpData(pointer)
    }

    for (var i = 0; i < touches.length; i++) { loop(i) }
  })

  window.addEventListener('keydown', function (e) {
    if (e.code === 'KeyP') { config.PAUSED = !config.PAUSED }
    if (e.key === ' ') { splatStack.push(parseInt(Math.random() * 20) + 5) }
  })
}

function scaleByPixelRatio (input) {
  var pixelRatio = window.devicePixelRatio || 1
  return Math.floor(input * pixelRatio)
}
