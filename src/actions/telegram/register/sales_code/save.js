import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isSaveSalesCode = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('save-sales-code')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isSaveSalesCode) (
    S.pipe ([
      S.gets (S.is ($.String)) ([
        'body',
        'callback_query',
        'message',
        'text',
      ]),
      S.map (S.lines),
      S.map (S.map (S.splitOn (':'))),
      S.map (S.filter (row => row.length === 2)),
      S.map (Object.fromEntries),
      S.map (
        ({name, code}) =>
          '#SaveSales\n' +
          `name:${name}\n` +
          `code:${code}\n` +
          'apakah data sudah benar?'
      ),
      S.maybe (
        F.reject ('gagal mendapatkan data @SaveSalesCodeAction')
      ) (
        locals.sendMessage ({
          inline_keyboard: [
            [{text: 'yes', callback_data: 'save-sales'}],
          ],
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
