import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromUpdate,
  getUpdateFromRequest,
} from './getter'

// String -> Request -> Boolean
export const isCommandEqualsTo = (cmd) =>
  S.pipe ([
    getUpdateFromRequest,
    S.chain (getMessageFromUpdate),
    S.chain (getEntityTextFromMessage ('bot_command')),
    S.map (S.equals (cmd)),
    S.fromRight (false),
  ])
