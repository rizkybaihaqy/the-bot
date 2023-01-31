export const stripEntity =
  text =>
  ({offset, length}) =>
    text.slice (offset + length)

export const stripText =
  text =>
  ({offset, length}) =>
    text.slice (offset, offset + length)
