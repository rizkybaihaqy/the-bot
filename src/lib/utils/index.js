import debug from 'debug'

export const tap = (env) => (txt) => (x) => (
  debug ('the-bot:' + env) ('%O', txt), x
)
