import {reject, resolve} from 'fluture'
import {pgFlQuery} from '../../../db/instance'
import {JSONData, eitherToFuture} from '../../fluture'
import {getArrayElement} from '../../sanctuary/getter'
import {S} from '../../sanctuary/instance'
import {tap} from '../../utils'
import {getNBotCommandArguments} from '../getter'
import {replyTo} from '../request'

const checkSalesId = (data) =>
  S.pipe ([
    S.head,
    S.maybe (reject ('No Id Found')) (resolve),
    S.chain ((id) =>
      pgFlQuery ({
        name: 'select one sales',
        text: 'SELECT * FROM sales WHERE id=$1',
        values: [id],
      }),
    ),
    S.chain (
      S.pipe ([
        S.prop ('rowCount'),
        S.equals (1),
        S.ifElse (S.equals (true)) ((_) => resolve (data)) (
          (_) => reject ('No Sales Id Found'),
        ),
      ]),
    ),
  ]) (data)

const checkNoDeal = S.pipe ([
  getArrayElement (1),
  S.map (S.toLower),
  S.complement (S.equals (S.Just ('deal'))),
  tap,
])

const checkChannel = (data) =>
  S.pipe ([
    getArrayElement (2),
    S.maybe (reject ('No Channel Found')) (resolve),
    S.chain (
      S.ifElse ((data) =>
        S.any (S.equals (data)) ([
          'mip',
          'landing_page',
          'no_deal',
          'sobi',
        ]),
      ) ((_) => resolve (data)) ((_) =>
        reject ('Not A Valid Channel'),
      ),
    ),
  ]) (data)

const checkAddress = (data) =>
  S.pipe ([
    getArrayElement (3),
    S.maybe (reject ('No Address Found')) ((_) =>
      resolve (data),
    ),
  ]) (data)

const checkSubmittedData = S.pipe ([
  S.prop ('rows'),
  S.head,
  S.map (({address, sales_id, channel}) => ({
    address,
    sales_id,
    channel,
  })),
  S.maybe (reject ('Data Not Recorded In Database')) (resolve),
])

export const visit = (req) =>
  S.pipe ([
    getNBotCommandArguments (4),
    eitherToFuture,
    S.chain (checkSalesId),
    S.chain (checkChannel),
    S.chain (checkAddress),
    S.chain ((data) =>
      pgFlQuery ({
        name: 'Insert Sales Data Visit',
        text: 'INSERT INTO visits(sales_id, channel, address) VALUES ($1, $2, $3) RETURNING *',
        values: [ data[0], data[2], data[3] ],
      }),
    ),
    S.chain (checkSubmittedData),
    S.map (
      (x) => `
      Data Berhasil Di Submit
      Id Sales: ${x.sales_id}
      Alamat: ${x.address}
      Channel: ${x.channel}
      `,
    ),
    S.chain (replyTo (req)),
    S.map (JSONData),
  ]) (req)
