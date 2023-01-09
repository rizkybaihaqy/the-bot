import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromRequest,
} from './getter'

// String -> Request -> Boolean
export const isCommandEqualsTo = (cmd) =>
  S.pipe ([
    getMessageFromRequest,
    S.chain (getEntityTextFromMessage ('bot_command')),
    S.map (S.equals (cmd)),
    S.fromRight (false),
  ])
