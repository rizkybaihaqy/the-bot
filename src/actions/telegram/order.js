import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {getEntity} from '../../lib/telegram/object'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'
import {fetchTrackId} from '../../lib/telegram/request'
import {stripEntity} from '../../lib/telegram/string'
import {lift2_} from '../../lib/utils/function'
import {get, gets} from '../../lib/utils/object'

// Res -> Future String Data
const checkData = S.pipe ([
  S.prop ('data'),
  S.ifElse (S.pipe ([S.prop ('info'), S.equals ('OK')])) (
    F.resolve
  ) (S.pipe ([S.prop ('info'), F.reject])),
  S.map (S.prop ('data')),
])

// Data -> String
const formatData = x => `
  ${x.milestones[0].name}: ${
  x.milestones[0].description ?? x.milestones[0].status
}
  ${x.milestones[1].name}: ${
  x.milestones[1].description ?? x.milestones[1].status
}
  ${x.milestones[2].name}: ${
  x.milestones[2].description ?? x.milestones[2].status
}
  ${x.milestones[2].name}: ${
  x.milestones[2].description ?? x.milestones[2].status
}
  ${x.milestones[4].name}: ${
  x.milestones[4].description ?? x.milestones[4].status
}
  ${x.milestones[3].name}: ${
  x.milestones[3].description ?? x.milestones[3].status
}
  ${x.milestones[6].name}: ${
  x.milestones[6].description ?? x.milestones[6].status
}
  ${x.milestones[5].name}: ${
  x.milestones[5].description ?? x.milestones[5].status
}
  ${x.milestones[7].name}: ${
  x.milestones[7].description ?? x.milestones[7].status
}
      `

export default locals =>
  S.ifElse (isCommandEqualsTo ('/order')) (
    S.pipe ([
      gets (['body', 'message']),
      S.chain (
        lift2_ (stripEntity) (get ('text')) (
          getEntity ('bot_command')
        )
      ),
      S.map (S.trim),
      S.when (S.equals (S.Just (''))) (S.K (S.Nothing)),
      S.maybe (F.reject ('Order Id Is Required')) (F.resolve),
      S.chain (fetchTrackId),
      S.chain (checkData),
      S.map (x => (console.log (x), x)),
      S.map (formatData),
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
