import {Render} from 'fluture-express'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {lift2_} from '../../lib/utils/function'
import {get} from '../../lib/utils/object'
import {getSurveysHeatmapDataByReasonByDate} from '../../use-case/survey'
import {getVisitsHeatmapDataByDate} from '../../use-case/visit'

export default locals =>
  S.pipe ([
    get ('query'),
    S.chain (
      lift2_ (from => until => ({from, until})) (
        get ('from')
      ) (get ('until'))
    ),
    S.fromMaybe ({from: '2023-02-01', until: '2023-02-10'}),
    interval =>
      F.parallel (6) ([
        getVisitsHeatmapDataByDate (interval),
        getSurveysHeatmapDataByReasonByDate (
          'no_need_for_internet'
        ) (interval),
        getSurveysHeatmapDataByReasonByDate (
          'unsubscribed_disappointed'
        ) (interval),
        getSurveysHeatmapDataByReasonByDate (
          'already_subscribe_to_competitor'
        ) (interval),
        getSurveysHeatmapDataByReasonByDate (
          'need_cheaper_package'
        ) (interval),
        getSurveysHeatmapDataByReasonByDate ('other') (
          interval
        ),
        F.resolve ([interval]),
      ]),
    S.map (
      ([
        visits,
        noNeedForInternet,
        unsubscribedDisappointed,
        alreadySubscribeToCompetitor,
        needCheaperPackage,
        other,
        interval,
      ]) => ({
        visits,
        noNeedForInternet,
        unsubscribedDisappointed,
        alreadySubscribeToCompetitor,
        needCheaperPackage,
        other,
        interval: interval[0],
      })
    ),
    S.map (data => Render ('dashboard') ({data})),
  ])
