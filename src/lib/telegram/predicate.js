import {S} from '../../lib/sanctuary'
import {lift2_} from '../utils/function'
import {get, gets} from '../utils/object'
import {getEntity} from './object'
import {stripText} from './string'

// String -> Request -> Boolean
export const isCommandEqualsTo = cmd =>
  S.pipe ([
    gets (['body', 'message']),
    S.chain (
      lift2_ (stripText) (get ('text')) (
        getEntity ('bot_command')
      )
    ),
    S.map (S.equals (cmd)),
    S.fromMaybe (false),
  ])
