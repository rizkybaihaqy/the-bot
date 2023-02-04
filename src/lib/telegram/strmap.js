import {getTranslation} from '../../translation'
import {S} from '../sanctuary'

// StrMap String -> String
export const strMapToTextForm = S.pipe ([
  S.pairs,
  S.map (x => getTranslation (S.fst (x)) + ':' + S.snd (x)),
  S.unlines,
])
