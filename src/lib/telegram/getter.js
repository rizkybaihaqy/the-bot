import $ from 'sanctuary-def'
import {S} from '../sanctuary'

// Request -> Either String Message
export const getMessageFromRequest = S.pipe ([
  S.gets (S.is ($.Object)) ([ 'body', 'message' ]),
  S.maybeToEither (
    'No Message Found. Did not support updated message',
  ),
])

// Request -> Either String Message
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

// Message -> String
export const getTextFromMessage = S.pipe ([
  S.get (S.is ($.String)) ('text'),
  S.maybeToEither (
    'No Text Found. Did not support other chat type other than text',
  ),
])

// Message -> Either String Entity
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

// Message -> Either String String
export const getHashtagFromMessage = S.pipe ([
  (msg) => ({
    text: getTextFromMessage (msg),
    entity: getEntityFromMessage ('hashtag') (msg),
  }),
  ({text, entity}) =>
    S.isLeft (text)
      ? text
      : S.isLeft (entity)
      ? entity
      : S.Right ({
          text: S.fromRight ('') (text),
          entity: S.fromRight ({}) (entity),
        }),
  S.map (({text, entity}) =>
    text.slice (
      S.prop ('offset') (entity),
      S.prop ('offset') (entity) + S.prop ('length') (entity),
    ),
  ),
  S.mapLeft (S.K ('Not A Hashtag, Maybe Its A Plain Text')),
])

// Message -> Either String String
export const getLocationFromMessage = S.pipe ([
  S.get (S.is ($.Object)) ('location'),
  S.map (S.values),
  S.map ((location) => location.toString ()),
  S.maybeToEither (
    'No Location Found, Maybe Its A Plain Text',
  ),
])

// Message -> Either String String
export const getEntityTextFromMessage =
  (entityType) => (req) =>
    S.lift2 (
      (text) => (entity) =>
        text.slice (
          S.prop ('offset') (entity),
          S.prop ('offset') (entity) +
            S.prop ('length') (entity),
        ),
    ) (getTextFromMessage (req)) (
      getEntityFromMessage (entityType) (req),
    )

// Message -> Either String String
export const getChatIdFromMessage = S.pipe ([
  S.gets (S.is ($.Number)) ([ 'chat', 'id' ]),
  S.maybeToEither ('No Chat Id Found. Who are you?'),
])
