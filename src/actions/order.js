import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getEntityFromMessage,
  getMessageFromRequest,
  getTextFromMessage,
} from '../lib/telegram/getter'
import {isCommandEqualsTo} from '../lib/telegram/predicate'
import {fetchTrackId} from '../lib/telegram/request'
import {isEmptyString} from '../lib/utils/predicate'

// Message -> Either String String
const getTrackIdFromMessage = S.pipe ([
  (msg) =>
    S.lift2 (
      (text) => (entity) =>
        text.slice (
          S.prop ('offset') (entity) +
            S.prop ('length') (entity),
        ),
    ) (getTextFromMessage (msg)) (
      getEntityFromMessage ('bot_command') (msg),
    ),
  S.map (S.trim),
  S.chain (S.tagBy (S.complement (isEmptyString))),
  S.mapLeft (S.K ('Order Id Is Required')),
])

// Res -> Future String Data
const checkData = S.pipe ([
  S.prop ('data'),
  S.ifElse (S.pipe ([ S.prop ('info'), S.equals ('OK') ])) (
    F.resolve,
  ) (S.pipe ([ S.prop ('info'), F.reject ])),
  S.map (S.prop ('data')),
])

// Data -> String
const formatData = (x) => `
      Nama Pelanggan: ${
        x.milestones[0].variables.customerName
      }
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

export default (locals) => (req) =>
  S.ifElse (isCommandEqualsTo ('/order')) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getTrackIdFromMessage),
      eitherToFuture,
      S.chain (fetchTrackId),
      S.chain (checkData),
      S.map (formatData),
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
