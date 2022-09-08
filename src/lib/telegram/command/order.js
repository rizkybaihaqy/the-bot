import F from 'fluture'
import {Json} from 'fluture-express'
import {eitherToFuture} from '../../fluture'
import {S} from '../../sanctuary/instance'
import {getNBotCommandArguments} from '../getter'
import {fetchTrackId, replyTo} from '../request'

export const order = (req) =>
  S.pipe ([
    getNBotCommandArguments (1),
    S.chain (
      S.pipe ([
        S.head,
        S.maybeToEither ('No Track Id Passed To Command'),
      ]),
    ),
    eitherToFuture,
    S.chain (fetchTrackId),
    S.map (S.prop ('data')),
    S.chain (
      S.ifElse (S.pipe ([ S.prop ('info'), S.equals ('OK') ])) (
        F.resolve,
      ) (S.pipe ([ S.prop ('info'), F.reject ])),
    ),
    S.map (S.prop ('data')),
    S.map (
      (x) => `
    Nama Pelanggan: ${
      x.milestones[0].variables.customerName
    }
${x.milestones[0].name}: ${
        x.milestones[0].description ??
        x.milestones[0].status
      }
${x.milestones[1].name}: ${
        x.milestones[1].description ??
        x.milestones[1].status
      }
${x.milestones[2].name}: ${
        x.milestones[2].description ??
        x.milestones[2].status
      }
${x.milestones[2].name}: ${
        x.milestones[2].description ??
        x.milestones[2].status
      }
${x.milestones[4].name}: ${
        x.milestones[4].description ??
        x.milestones[4].status
      }
${x.milestones[3].name}: ${
        x.milestones[3].description ??
        x.milestones[3].status
      }
${x.milestones[6].name}: ${
        x.milestones[6].description ??
        x.milestones[6].status
      }
${x.milestones[5].name}: ${
        x.milestones[5].description ??
        x.milestones[5].status
      }
${x.milestones[7].name}: ${
        x.milestones[7].description ??
        x.milestones[7].status
      }
    `,
    ),
    S.chain (replyTo (req)),
    S.map ((msg) => Json (msg.data)),
  ]) (req)
