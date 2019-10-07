import { config } from './GUI.js'

var colorUpdateTimer = 0.0

export function updateColors (pointers, dt) {
  if (!config.COLORFUL) { return }

  colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
  if (colorUpdateTimer >= 1) {
    colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
    pointers.forEach(function (p) {
      p.color = generateColor()
    })
  }
}

export function generateColor () {
  var c = HSVtoRGB(Math.random(), 1.0, 1.0)
  c.r *= 0.15
  c.g *= 0.15
  c.b *= 0.15
  return c
}

function HSVtoRGB (h, s, v) {
  var r, g, b, i, f, p, q, t
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return {
    r: r,
    g: g,
    b: b
  }
}

function wrap (value, min, max) {
  var range = max - min
  if (range === 0) { return min }
  return (value - min) % range + min
}
