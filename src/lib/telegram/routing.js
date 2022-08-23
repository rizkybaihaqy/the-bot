import { echo } from './command/echo'
import { invalid } from './command/invalid'
import { ping } from './command/ping'

export const command = (req) => (cmd) =>
  cmd === '/ping'
    ? ping (req)
  : cmd === '/echo'
    ? echo (req)
  : invalid (req)
