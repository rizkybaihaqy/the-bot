import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'

export default locals =>
  S.ifElse (isCommandEqualsTo ('/ping')) (
    S.pipe ([
      _ => 'pong',
      locals.sendMessage ({remove_keyboard: true}),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
