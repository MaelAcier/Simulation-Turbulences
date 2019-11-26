import { pointers, PointerPrototype } from './update.js'
import { splatStack, config } from './data.js'
import { updatePointerDownData, updatePointerMoveData, updatePointerUpData } from './pointers.js'

export default function initEvents (canvas) {
  canvas.addEventListener('mousedown', function (e) {
    const posX = scaleByPixelRatio(e.offsetX)
    const posY = scaleByPixelRatio(e.offsetY)
    let pointer = pointers.find((p) => p.id === -1)
    if (pointer == null) {
      pointer = new PointerPrototype()
    }
    updatePointerDownData(canvas, pointer, -1, posX, posY)
  })

  canvas.addEventListener('mousemove', function (e) {
    const pointer = pointers[0]
    if (!pointer.down) { return }
    const posX = scaleByPixelRatio(e.offsetX)
    const posY = scaleByPixelRatio(e.offsetY)
    updatePointerMoveData(canvas, pointer, posX, posY)
  })

  window.addEventListener('mouseup', function () {
    updatePointerUpData(pointers[0])
  })

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault()
    const touches = e.targetTouches
    while (touches.length >= pointers.length) {
      pointers.push(new PointerPrototype())
    }
    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].pageX)
      const posY = scaleByPixelRatio(touches[i].pageY)
      updatePointerDownData(canvas, pointers[i + 1], touches[i].identifier, posX, posY)
    }
  })

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault()
    const touches = e.targetTouches
    for (let i = 0; i < touches.length; i++) {
      const pointer = pointers[i + 1]
      if (!pointer.down) { continue }
      const posX = scaleByPixelRatio(touches[i].pageX)
      const posY = scaleByPixelRatio(touches[i].pageY)
      updatePointerMoveData(canvas, pointer, posX, posY)
    }
  }, false)

  window.addEventListener('touchend', function (e) {
    const touches = e.changedTouches
    const loop = function (i) {
      const pointer = pointers.find((p) => p.id === touches[i].identifier)
      if (pointer == null) { return }
      updatePointerUpData(pointer)
    }

    for (let i = 0; i < touches.length; i++) { loop(i) }
  })

  window.addEventListener('keydown', function (e) {
    if (e.code === 'KeyP') {
      config.PAUSED = !config.PAUSED
    }
    if (e.key === ' ') {
      splatStack.push(parseInt(Math.random() * 20) + 5)
    }
  })
}

function scaleByPixelRatio (input) {
  const pixelRatio = window.devicePixelRatio || 1
  return Math.floor(input * pixelRatio)
}
