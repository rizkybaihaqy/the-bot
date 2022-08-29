import $ from 'sanctuary-def'
import {S} from '../sanctuary/instance'
import {isBotCommand} from './predicate'

export const getMessageFromRequest = S.pipe ([
  S.gets (S.is ($.Object)) ([ 'body', 'message' ]),
  S.maybeToEither (
    'No Message Found. Did not support updated message',
  ),
])

export const getChatIdFromRequest = S.pipe ([
  S.gets (S.is ($.Number)) ([ 'body', 'message', 'chat', 'id' ]),
  S.maybeToEither ('No Chat Id Found. Who are you?'),
])

export const getTextFromRequest = S.pipe ([
  S.gets (S.is ($.String)) ([ 'body', 'message', 'text' ]),
  S.maybeToEither (
    'No Text Found. Did not support other chat type other than text',
  ),
])

export const getEntityFromRequest = S.pipe ([
  S.gets (S.is ($.Array ($.Object))) ([
    'body',
    'message',
    'entities',
  ]),
  S.chain (S.head),
  S.maybeToEither (
    'No Entities Found, Maybe Its A Plain Text',
  ),
])

export const getEntityOffset = S.pipe ([
  getEntityFromRequest,
  S.map ((entity) => S.prop ('offset') (entity)),
  S.fromRight (0),
])

export const getEntityLength = S.pipe ([
  getEntityFromRequest,
  S.map ((entity) => S.prop ('length') (entity)),
  S.fromRight (0),
])

export const getBotCommandFromRequest = S.ifElse (
  isBotCommand,
) ((req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((txt) =>
      txt.slice (
        getEntityOffset (req),
        getEntityOffset (req) + getEntityLength (req),
      ),
    ),
  ]) (req),
) ((_) =>
  S.Left ('Not A Bot Command, Maybe Its A Plain Text'),
)
