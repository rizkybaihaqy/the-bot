export const stripEntity =
  text =>
  ({offset, length}) =>
    text.slice (offset + length)

export const stripCmdArg =
  text =>
  ({offset, length}) =>
    text.slice (offset, offset + length)
