import $ from 'sanctuary-def'
import {S} from '../sanctuary'

export const isBotCommand = S.pipe ([
  S.gets (S.is ($.Array ($.Object))) ([
    'body',
    'message',
    'entities',
  ]),
  S.chain (S.head),
  S.chain (S.get (S.is ($.String)) ('type')),
  S.equals (S.Just ('bot_command')),
])

export const isCallbackQuery = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.isJust,
])
