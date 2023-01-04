import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getMessageFromRequest,
  getTextFromMessage,
} from '../../lib/telegram/getter'
import {isHashtagEqualsTo} from '../../lib/telegram/predicate'

export default (locals) =>
  S.ifElse (isHashtagEqualsTo ('#VisitReport')) (
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
