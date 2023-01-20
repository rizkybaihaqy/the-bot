import {Render} from 'fluture-express'
import {S} from '../../lib/sanctuary'
import {getAllSurveys} from '../../use-case/survey'

export default locals =>
  S.pipe ([
    getAllSurveys,
    S.map (data =>
      Render ('data') ({data, type: 'surveys'})
    ),
  ])
