import {Render} from 'fluture-express'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {getSurveysHeatmapDataByReason} from '../../use-case/survey'
import {getVisitsHeatmapData} from '../../use-case/visit'

export default locals =>
  S.pipe ([
    _ =>
      F.parallel (6) ([
        getVisitsHeatmapData (S.Nothing),
        getSurveysHeatmapDataByReason (
          'no_need_for_internet'
        ),
        getSurveysHeatmapDataByReason (
          'unsubscribed_disappointed'
        ),
        getSurveysHeatmapDataByReason (
          'already_subscribe_to_competitor'
        ),
        getSurveysHeatmapDataByReason (
          'need_cheaper_package'
        ),
        getSurveysHeatmapDataByReason ('other'),
      ]),
    S.map (
      ([
        visits,
        noNeedForInternet,
        unsubscribedDisappointed,
        alreadySubscribeToCompetitor,
        needCheaperPackage,
        other,
      ]) => ({
        visits,
        noNeedForInternet,
        unsubscribedDisappointed,
        alreadySubscribeToCompetitor,
        needCheaperPackage,
        other,
      })
    ),
    S.map (data => Render ('dashboard') ({data})),
  ])
