import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {gets} from '../../lib/utils/object'

const isCancel = S.pipe ([
  gets (['body', 'message', 'text']),
  S.map (S.toLower),
  S.map (S.equals ('cancel')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isCancel) (
    S.pipe ([
      _ => 'Operation Canceled',
      locals.sendMessage ({remove_keyboard: true}),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
