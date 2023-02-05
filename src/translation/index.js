import {S} from '../lib/sanctuary'
import visitError from './error/visit'
import visitMessage from './message/visit'
import surveyModel from './model/survey'
import visitModel from './model/visit'

const words = [
  ...surveyModel,
  ...visitModel,
  ...visitMessage,
  ...visitError,
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
