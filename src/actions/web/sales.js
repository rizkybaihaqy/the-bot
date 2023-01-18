import {Render} from 'fluture-express'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'

export default locals =>
  S.pipe ([
    _ => [
      {
        sales_code: '4491',
        name: 'Makara Suwarno',
        telegram_id: '529444704',
        created_at: '2023-01-16 06:04:59',
      },
      {
        sales_code: '4156',
        name: 'Wage Budiyanto',
        telegram_id: '799931653',
        created_at: '2023-01-15 13:29:14',
      },
      {
        sales_code: '4556',
        name: 'Cahyono Latupono',
        telegram_id: '139306153',
        created_at: '2023-01-14 12:29:20',
      },
    ],
    data => F.resolve (Render ('data') ({data, type: 'sales'})),
  ])
