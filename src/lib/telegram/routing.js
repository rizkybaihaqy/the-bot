import {echo} from './command/echo'
import {invalid} from './command/invalid'
import {order} from './command/order'
import {ping} from './command/ping'
import { visit } from './command/visit'

export const command = (req) => (cmd) =>
  cmd === '/order'
    ? order (req)
    : cmd === '/visit'
    ? visit (req)
    : cmd === '/ping'
    ? ping (req)
    : cmd === '/echo'
    ? echo (req)
    : invalid (req)
