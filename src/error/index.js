import {execute} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {reply} from '../lib/telegram/reply'

// TODO Make It Pure
export const errorHandler = (err, req, res, _) => {
  console.log ('ERROR:', err)
  S.pipe ([
    reply (`ERROR: ${err}`),
    S.map (
      (x) => (
        res.header ('Content-Type', 'application/json'), x
      ),
    ),
    S.map (
      (x) => (res.status (200).send (`ERROR: ${err}`), x),
    ),
    S.mapLeft (
      (x) => (res.status (200).send (`ERROR: ${err}`), x),
    ),
    execute,
  ]) (req)
}
