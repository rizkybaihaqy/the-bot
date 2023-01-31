import {Next} from 'fluture-express'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sendMessage} from '../../lib/telegram/request'
import {alt_} from '../../lib/utils/function'
import {get, gets} from '../../lib/utils/object'

export default locals =>
  S.pipe ([
    get ('body'),
    S.chain (
      alt_ (get ('message')) (
        gets (['callback_query', 'message'])
      )
    ),
    S.chain (gets (['chat', 'id'])),
    S.map (chatId =>
      S.insert ('sendMessage') (sendMessage (chatId)) (locals)
    ),
    S.maybe (F.reject ('Cannot Find Chat Id')) (F.resolve),
    S.map (Next),
  ])
