import $ from 'sanctuary-def'
import {S} from '../sanctuary/instance'
import {isEmptyString} from '../sanctuary/predicate'
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

export const getBotCommandFromRequest = (req) =>
  S.pipe ([
    S.tagBy (isBotCommand),
    S.mapLeft (
      S.K ('Not A Bot Command, Maybe Its A Plain Text'),
    ),
    S.chain (getTextFromRequest),
    S.map ((txt) =>
      txt.slice (
        getEntityOffset (req),
        getEntityOffset (req) + getEntityLength (req),
      ),
    ),
  ]) (req)

export const getBotCommandArgument = (req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((txt) =>
      txt.slice (
        getEntityOffset (req) + getEntityLength (req),
      ),
    ),
    S.map (S.trim),
    S.chain (S.tagBy (isEmptyString)),
    S.mapLeft (
      S.K (
        'This Command Need At Least One Or More Argument',
      ),
    ),
  ]) (req)

export const getNBotCommandArguments = (n) => (req) =>
  S.pipe ([
    getBotCommandArgument,
    S.map (S.words),
    S.chain (
      S.pipe ([
        S.ifElse ((words) => S.size (words) === n) (S.Just) (
          (_) => S.Nothing,
        ),
        S.chain (S.take (n)),
        S.maybeToEither (`Command Expect ${n} Argument`),
      ]),
    ),
  ]) (req)
