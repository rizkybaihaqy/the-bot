import {Render} from 'fluture-express'
import {S} from '../../lib/sanctuary'
import {getAllVisits} from '../../use-case/visit'

export default locals =>
  S.pipe ([
    getAllVisits,
    S.map (data =>
      Render ('data') ({data, type: 'visits'})
    ),
  ])
