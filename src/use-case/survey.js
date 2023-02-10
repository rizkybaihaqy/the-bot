import {
  findAllSurveys,
  findAllSurveysByReasonByDate,
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

// String -> String -> Future String Array Object
export const getSurveysHeatmapDataByReasonByDate = reason =>
  S.pipe ([
    interval =>
      findAllSurveysByReasonByDate ({reason, interval}),
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
