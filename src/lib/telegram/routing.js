import {echo} from './command/echo'
import {invalid} from './command/invalid'
import {order} from './command/order'
import {ping} from './command/ping'

export const command = (req) => (cmd) =>
  cmd === '/order'
    ? order (req)
    : cmd === '/ping'
    ? ping (req)
    : cmd === '/echo'
    ? echo (req)
    : invalid (req)
