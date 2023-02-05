import {S} from '../lib/sanctuary'
import error from './error'
import message from './message'
import surveyModel from './model/survey'
import visitModel from './model/visit'

const words = [
  ...surveyModel,
  ...visitModel,
  ...message,
  ...error,
]

export const getTranslation = txt =>
  S.pipe ([
    S.find (x => S.toLower (txt) === S.toLower (S.fst (x))),
    S.map (S.snd),
    S.fromMaybe (txt),
  ]) (words)

export const getOriginal = txt =>
  S.pipe ([
    S.find (x => S.toLower (txt) === S.toLower (S.snd (x))),
    S.map (S.fst),
    S.fromMaybe (txt),
  ]) (words)

export const t = getTranslation
export const o = getOriginal
