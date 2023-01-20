import {Render} from 'fluture-express'
import {S} from '../../lib/sanctuary'
import {getAllSales} from '../../use-case/sales'

export default locals =>
  S.pipe ([
    getAllSales,
    S.map (data => Render ('data') ({data, type: 'sales'})),
  ])
