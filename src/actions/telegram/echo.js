import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {getEntity} from '../../lib/telegram/object'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'
import {stripEntity} from '../../lib/telegram/string'
import {lift2_} from '../../lib/utils/function'
import {get, gets} from '../../lib/utils/object'

export default locals =>
  S.ifElse (isCommandEqualsTo ('/echo')) (
    S.pipe ([
      gets (['body', 'message']),
      S.chain (
        lift2_ (stripEntity) (get ('text')) (
          getEntity ('bot_command')
        )
      ),
      S.map (S.trim),
      S.when (S.equals (S.Just (''))) (S.K (S.Nothing)),
      S.maybe (F.reject ('Cannot Echo Nothing')) (F.resolve),
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
