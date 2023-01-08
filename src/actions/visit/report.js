import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromRequest,
  getTextFromMessage,
} from '../../lib/telegram/getter'

// Req -> boolean
const isVisitReport = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitReport')),
  S.fromRight (false),
])

export default (locals) =>
  S.ifElse (isVisitReport) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getTextFromMessage),
      S.map ((text) =>
        text.replace ('#VisitReport', '#VisitSubmit'),
      ),
      eitherToFuture,
      S.chain (
        locals.sendMessage ({
          keyboard: [
            [
              {
                text: 'Send Location',
                request_location: true,
              },
            ],
          ],
        }),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
