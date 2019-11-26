import { generateColor } from './updateColors.js'

export function updatePointerDownData (canvas, pointer, id, posX, posY) {
  pointer.id = id
  pointer.down = true
  pointer.moved = false
  pointer.texcoordX = posX / canvas.width
  pointer.texcoordY = 1.0 - posY / canvas.height
  pointer.prevTexcoordX = pointer.texcoordX
  pointer.prevTexcoordY = pointer.texcoordY
  pointer.deltaX = 0
  pointer.deltaY = 0
  pointer.color = generateColor()
}

export function updatePointerMoveData (canvas, pointer, posX, posY) {
  pointer.prevTexcoordX = pointer.texcoordX
  pointer.prevTexcoordY = pointer.texcoordY
  pointer.texcoordX = posX / canvas.width
  pointer.texcoordY = 1.0 - posY / canvas.height
  pointer.deltaX = correctDeltaX(canvas, pointer.texcoordX - pointer.prevTexcoordX)
  pointer.deltaY = correctDeltaY(canvas, pointer.texcoordY - pointer.prevTexcoordY)
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
}

export function updatePointerUpData (pointer) {
  pointer.down = false
}

function correctDeltaX (canvas, delta) {
  const aspectRatio = canvas.width / canvas.height
  if (aspectRatio < 1) { delta *= aspectRatio }
  return delta
}

function correctDeltaY (canvas, delta) {
  const aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 1) { delta /= aspectRatio }
  return delta
}
