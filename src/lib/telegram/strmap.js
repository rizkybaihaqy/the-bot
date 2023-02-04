import {headerCase} from 'change-case'
import {getTranslation} from '../../translation'
import {S} from '../sanctuary'

// StrMap String -> String
export const strMapToTextForm = S.pipe ([
  S.pairs,
  S.map (
    x =>
      S.pipe ([
        getTranslation,
        x => headerCase (x, {delimiter: ' '}),
      ]) (S.fst (x)) +
      ':' +
      S.snd (x)
  ),
  S.unlines,
])
