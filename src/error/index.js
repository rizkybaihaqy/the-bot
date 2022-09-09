import {execute} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {reply} from '../lib/telegram/request'

// TODO Make It Pure
export const errorHandler = (err, req, res, _) => {
  S.pipe ([
    reply (`ERROR: ${err}`),
    S.map ((x) => {
      res.header ('Content-Type', 'application/json')
      res.status (200).send (x.data)
      return x
    }),
    execute,
  ]) (req)
}
