import {Render} from 'fluture-express'
import {S} from '../../lib/sanctuary'
import {getVisitsHeatmapData} from '../../use-case/visit'

export default locals =>
  S.pipe ([
    getVisitsHeatmapData,
    S.map (visits => Render ('dashboard') ({visits})),
  ])
