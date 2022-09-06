import { Json } from 'fluture-express'
import { eitherToFuture } from '../../fluture'
import { S } from '../../sanctuary/instance'
import { getNBotCommandParameter } from '../getter'
import { fetchTrackId, replyTo } from '../request'

export const order = (req) =>
  S.pipe ([
    getNBotCommandParameter (1),
    eitherToFuture,
    S.chain (fetchTrackId),
    S.map ((x) => x.data.data),
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
