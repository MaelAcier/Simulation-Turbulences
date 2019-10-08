const madge = require('madge')

/* madge('main.js').then((res) => {
  console.log(res.obj())
}) */

madge('main.js')
  .then((res) => res.image('graph.svg'))
  .then((writtenImagePath) => {
    console.log('Image written to ' + writtenImagePath)
  })
