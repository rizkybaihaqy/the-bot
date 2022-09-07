import util from 'util'
const debug = require ('debug') ('the-bot:server')

export const tap = (x) => (console.log (x), x)

export const tapToString = (x) => (
  console.log (x.toString ()), x
)

export const tapDetail = (x) => (
  console.log (
    util.inspect (x, {
      showHidden: false,
      depth: null,
      colors: true,
    }),
  ),
  x
)

export const tapJSONStringify = (x) => (
  console.log (JSON.stringify (x, null, 2)), x
)

export const checkPoint = (txt) => (x) => (
  console.log (txt), x
)

export const tapDebug = (txt) => (x) => (debug (txt + x), x)
