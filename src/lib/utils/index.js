import util from 'util'

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
