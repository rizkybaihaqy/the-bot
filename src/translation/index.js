import {S} from '../lib/sanctuary'
import {survey} from './survey'
import {visit} from './visit'

const words = [...survey, ...visit]

export const getTranslation = txt =>
  S.pipe ([
    S.find (x => txt === S.fst (x)),
    S.map (S.snd),
    S.fromMaybe (txt),
  ]) (words)

export const getOriginal = txt =>
  S.pipe ([
    S.find (x => txt === S.snd (x)),
    S.map (S.fst),
    S.fromMaybe (txt),
  ]) (words)

export const t = getTranslation
export const o = getOriginal
