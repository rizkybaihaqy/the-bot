import $ from 'sanctuary-def'
import {S} from '../sanctuary'
import {isEmptyString} from '../utils/predicate'
import {isBotCommand, isHashTag, isReply} from './predicate'

export const getMessageFromRequest = S.pipe ([
  S.gets (S.is ($.Object)) ([ 'body', 'message' ]),
  S.maybeToEither (
    'No Message Found. Did not support updated message',
  ),
])

export const getReplyMessageFromRequest = S.pipe ([
  S.gets (S.is ($.Object)) ([
    'body',
    'message',
    'reply_to_message',
  ]),
  S.maybeToEither (
    'No Reply Message Found. Did not support updated message',
  ),
])

export const getChatIdFromRequest = S.pipe ([
  S.gets (S.is ($.Number)) ([ 'body', 'message', 'chat', 'id' ]),
  S.maybeToEither ('No Chat Id Found. Who are you?'),
])

export const getChatIdFromCallbackQueryRequest = S.pipe ([
  S.gets (S.is ($.Number)) ([
    'body',
    'callback_query',
    'message',
    'chat',
    'id',
  ]),
  S.maybeToEither ('No Chat Id Found. Who are you?'),
])

export const getTextFromRequest = S.pipe ([
  S.gets (S.is ($.String)) ([ 'body', 'message', 'text' ]),
  S.maybeToEither (
    'No Text Found. Did not support other chat type other than text',
  ),
])

// Message -> string
export const getTextFromMessage = S.pipe ([
  S.get (S.is ($.String)) ('text'),
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

// req -> Either String Entity
export const getEntityFromRequest_ = (entityType) =>
  S.pipe ([
    S.gets (S.is ($.Array ($.Object))) ([
      'body',
      'message',
      'entities',
    ]),
    S.map (
      S.map ((entities) =>
        S.equals (S.get (S.is ($.String)) ('type') (entities)) (
          S.Just (entityType),
        )
          ? S.Just (entities)
          : S.Nothing,
      ),
    ),
    S.map (S.justs),
    S.chain (S.head),
    S.maybeToEither (
      'No Entities Found, Maybe Its A Plain Text',
    ),
  ])

// req -> Either String Entity
export const getEntityFromMessage = (entityType) =>
  S.pipe ([
    S.get (S.is ($.Array ($.Object))) ('entities'),
    S.map (
      S.map ((entities) =>
        S.equals (S.get (S.is ($.String)) ('type') (entities)) (
          S.Just (entityType),
        )
          ? S.Just (entities)
          : S.Nothing,
      ),
    ),
    S.map (S.justs),
    S.chain (S.head),
    S.maybeToEither (
      'No Entities Found, Maybe Its A Plain Text',
    ),
  ])

export const getEntityOffset = (entityType) => S.pipe ([
  getEntityFromRequest,
  S.map ((entity) => S.prop ('offset') (entity)),
  S.fromRight (0),
])

// Req -> Integer
export const getEntityOffset_ = (entityType) =>
  S.pipe ([
    getEntityFromRequest_ (entityType),
    S.map ((entity) => S.prop ('offset') (entity)),
    S.fromRight (0),
  ])

export const getEntityLength = S.pipe ([
  getEntityFromRequest,
  S.map ((entity) => S.prop ('length') (entity)),
  S.fromRight (0),
])

// Req -> Integer
export const getEntityLength_ = (entityType) =>
  S.pipe ([
    getEntityFromRequest_ (entityType),
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

// Req -> Either String String
export const getHashtagFromRequest = (req) =>
  S.pipe ([
    S.tagBy (isHashTag),
    S.chain (getTextFromRequest),
    S.map ((txt) =>
      txt.slice (
        getEntityOffset_ ('hashtag') (req),
        getEntityOffset_ ('hashtag') (req) +
          getEntityLength_ ('hashtag') (req),
      ),
    ),
    S.mapLeft (S.K ('Not A Hashtag, Maybe Its A Plain Text')),
  ]) (req)

// Message -> Either String String
export const getHashtagFromMessage = (req) =>
  S.pipe ([
    getTextFromMessage,
    S.map ((txt) =>
      txt.slice (
        getEntityOffset_ ('hashtag') (req),
        getEntityOffset_ ('hashtag') (req) +
          getEntityLength_ ('hashtag') (req),
      ),
    ),
    S.mapLeft (S.K ('Not A Hashtag, Maybe Its A Plain Text')),
  ]) (req)

// Req -> Either String String
export const getReplyFromRequest = (req) =>
  S.pipe ([
    S.gets (S.is ($.Object)) ([
      'body',
      'message',
      'reply_to_message',
    ]),
    S.maybeToEither ('No Reply Found'),
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
    S.chain (S.tagBy (S.complement (isEmptyString))),
    S.mapLeft (
      S.K (
        'This Command Need At Least One Or More Argument',
      ),
    ),
  ]) (req)

export const getNBotCommandArguments =
  (delimiter) => (n) => (req) =>
    S.pipe ([
      getBotCommandArgument,
      S.map (delimiter),
      S.chain (
        S.pipe ([
          S.ifElse ((args) => S.size (args) === n) (S.Just) (
            (_) => S.Nothing,
          ),
          S.chain (S.take (n)),
          S.maybeToEither (`Command Expect ${n} Argument`),
        ]),
      ),
    ]) (req)

export const getNBotCommandArgumentsBySpace =
  getNBotCommandArguments (S.words)

export const getNBotCommandArgumentsByNewLine =
  getNBotCommandArguments (S.lines)

export const getCallbackDataFromRequest = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.maybeToEither (
    'No Callback Data Found. Maybe its not a callback query',
  ),
])
