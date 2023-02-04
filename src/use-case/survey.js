import {
  findAllSurveys,
  findAllSurveysByReason,
  insertOneToSurveys,
} from '../data-access'
import {S} from '../lib/sanctuary'
import {now} from '../lib/utils/date'

// StrMap String -> Future String Survey
export const addSurvey = S.pipe ([
  S.insert ('created_at') (now),
  insertOneToSurveys,
])

// Nothing -> Future String Array Survey
export const getAllSurveys = findAllSurveys

// String -> Future String Array Object
export const getSurveysHeatmapDataByReason = S.pipe ([
  findAllSurveysByReason,
  S.map (
    S.map (
      S.pipe ([
        S.prop ('location'),
        S.splitOn (','),
        ([lat, lng]) => ({lat, lng, value: '1'}),
      ])
    )
  ),
])
