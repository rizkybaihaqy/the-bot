import {Render} from 'fluture-express'
import {TOKEN} from '../../config'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getMe,
  getWebhookInfo,
} from '../../lib/telegram/request'

export default locals =>
  S.pipe ([
    _ => F.both (getMe) (getWebhookInfo),
    S.map (S.map (S.props (['data', 'result']))),
    S.map (([me, webhook]) => ({
      ...me,
      webhook: S.fromMaybe ('') (
        S.stripSuffix (`/webhook/${TOKEN}`) (webhook.url)
      ),
      status: webhook.url === '' ? 'down' : 'up',
    })),
    S.map (data => ({data})),
    S.map (Render ('dashboard')),
  ])
